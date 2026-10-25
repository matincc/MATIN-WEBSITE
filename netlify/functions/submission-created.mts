/**
 * Optional anti-spam with Cloudflare Turnstile.
 *
 * Netlify runs this function automatically after every form submission
 * ("submission-created" event). If Turnstile is enabled and the token is missing
 * or invalid, the submission is deleted.
 *
 * Only active when these environment variables are set:
 *   TURNSTILE_SECRET_KEY   Cloudflare dashboard → Turnstile → your widget → Secret key
 *   NETLIFY_API_TOKEN      Netlify → User settings → Applications → Personal access token
 * (and PUBLIC_TURNSTILE_SITE_KEY at build time, so the widget appears on the forms).
 *
 * Without them, the honeypot field and Netlify's built-in spam filter still apply.
 */
import type { Handler } from '@netlify/functions';

interface Payload {
  id: string;
  form_name: string;
  data: Record<string, string>;
}

export const handler: Handler = async (event) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!secret || !token) return { statusCode: 200, body: 'Turnstile disabled' };

  const { payload } = JSON.parse(event.body ?? '{}') as { payload?: Payload };
  if (!payload?.id) return { statusCode: 400, body: 'No payload' };

  const response = payload.data?.['cf-turnstile-response'] ?? '';
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response }),
  });
  const result = (await verify.json()) as { success: boolean; 'error-codes'?: string[] };
  if (result.success) return { statusCode: 200, body: 'ok' };

  console.warn(
    `Turnstile failed for "${payload.form_name}" (${result['error-codes']?.join(', ')}); deleting ${payload.id}`,
  );
  await fetch(`https://api.netlify.com/api/v1/submissions/${payload.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return { statusCode: 200, body: 'spam removed' };
};
