/**
 * Runs automatically after every verified Netlify Forms submission
 * ("submission-created" event). Netlify has already stored the submission and sent
 * its notification emails; nothing here can change or block that.
 *
 * 1. Optional anti-spam with Cloudflare Turnstile: if enabled and the token is missing
 *    or invalid, the submission is deleted. Only active when these variables are set:
 *      TURNSTILE_SECRET_KEY   Cloudflare dashboard → Turnstile → your widget → Secret key
 *      NETLIFY_API_TOKEN      Netlify → User settings → Applications → Personal access token
 *    (and PUBLIC_TURNSTILE_SITE_KEY at build time, so the widget appears on the forms).
 *    Without them, the honeypot field and Netlify's built-in spam filter still apply.
 * 2. Optional acknowledgement email to the visitor, through Google Apps Script
 *    (see _shared/acknowledge.ts and google-apps-script/README.md). Inactive until its
 *    variables are set.
 *
 * Always answers 200, so Netlify never retries because of us. Logs never contain the
 * visitor's name, email or message.
 */
import type { Handler } from '@netlify/functions';
import { acknowledge, type EventPayload } from './_shared/acknowledge';

/** true when Turnstile is enabled and the submission failed it (and was deleted). */
async function failedTurnstile(payload: EventPayload) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!secret || !token) return false;

  const response = payload.data?.['cf-turnstile-response'] ?? '';
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response }),
  });
  const result = (await verify.json()) as { success: boolean; 'error-codes'?: string[] };
  if (result.success) return false;

  console.warn(
    `Turnstile failed for "${payload.form_name}" (${result['error-codes']?.join(', ')}); deleting ${payload.id}`,
  );
  await fetch(`https://api.netlify.com/api/v1/submissions/${payload.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return true;
}

export const handler: Handler = async (event) => {
  const { payload } = JSON.parse(event.body ?? '{}') as { payload?: EventPayload };
  if (!payload?.id) return { statusCode: 400, body: 'No payload' };

  try {
    if (await failedTurnstile(payload)) return { statusCode: 200, body: 'spam removed' };
  } catch (err) {
    // Unsure whether it is spam: keep the submission, send no acknowledgement.
    console.warn(`Turnstile check failed: ${(err as Error).name}`);
    return { statusCode: 200, body: 'ok' };
  }

  const ack = await acknowledge(payload);
  if (ack !== 'disabled' && ack !== 'not-acknowledged-form')
    console.log(`Acknowledgement ${payload.form_name} ${payload.id}: ${ack}`);
  return { statusCode: 200, body: 'ok' };
};
