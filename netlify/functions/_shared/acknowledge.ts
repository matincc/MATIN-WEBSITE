/**
 * Visitor acknowledgements (Phase 3, owner's brief Oct 24 2026). Called by the
 * submission-created event after Netlify Forms has stored a verified submission and
 * sent its own notifications, which this code never touches.
 *
 * Netlify only runs submission-created for verified (non-spam) submissions, and signs
 * each event so that outside requests cannot invoke the function. So the values come
 * straight from the event: no Netlify access token is needed.
 *
 * Sends four values (submission id, form, language, email) to the Google Apps Script of
 * forms@matincc.ca, signed with HMAC-SHA256 and a timestamp. The script refuses anything
 * unsigned, altered or older than five minutes, and sends one fixed text.
 * The name and the message never leave Netlify, and are never logged.
 *
 * Inactive unless both variables are set (Netlify → Environment variables):
 *   ACK_ENDPOINT_URL   the Apps Script web app address
 *   ACK_SHARED_SECRET  the secret created by ackSetup() in the script
 */
import { createHmac } from 'node:crypto';

export const ACK_FORMS = ['contact', 'benevolat'] as const;

export interface EventPayload {
  id: string;
  form_id?: string;
  form_name: string;
  created_at?: string;
  data?: Record<string, string>;
}

/** JSON with every non-ASCII character escaped, so both sides sign the same bytes. */
export function asciiJson(value: unknown) {
  return JSON.stringify(value).replace(
    /[\u007f-￿]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}

export function sign(ts: string, payload: string, secret: string) {
  return createHmac('sha256', secret).update(`${ts}.${payload}`, 'utf8').digest('hex');
}

export type AckResult =
  'disabled' | 'not-acknowledged-form' | 'honeypot' | 'no-email' | 'error' | string;

export async function acknowledge(p: EventPayload): Promise<AckResult> {
  const url = process.env.ACK_ENDPOINT_URL;
  const secret = process.env.ACK_SHARED_SECRET;
  if (!url || !secret) return 'disabled';
  if (!(ACK_FORMS as readonly string[]).includes(p.form_name)) return 'not-acknowledged-form';

  const data = p.data ?? {};
  if (data['bot-field']) return 'honeypot';
  const email = (data.email ?? '').trim();
  if (!email) return 'no-email';

  try {
    const payload = asciiJson({
      id: p.id,
      form: p.form_name,
      lang: data.lang ?? '',
      email,
      created_at: p.created_at || new Date().toISOString(),
    });
    const ts = String(Date.now());
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ts, payload, sig: sign(ts, payload, secret) }),
      redirect: 'follow', // Apps Script answers through a redirect
      signal: AbortSignal.timeout(8000),
    });
    const out = (await res.json().catch(() => ({}))) as { status?: string; reference?: string };
    return `${out.status ?? `http-${res.status}`}${out.reference ? ` ${out.reference}` : ''}`;
  } catch (err) {
    console.warn(`Acknowledgement failed: ${(err as Error).name}`);
    return 'error';
  }
}
