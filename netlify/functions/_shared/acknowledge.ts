/**
 * Visitor acknowledgements (Phase 3, owner's brief Oct 24 2026). Called by the
 * submission-created event after Netlify Forms has stored a verified submission and
 * sent its own notifications, which this code never touches.
 *
 * 1. Re-reads the submission from the Netlify API, so only a real, verified (non-spam)
 *    submission of the "contact" or "benevolat" form can lead to an email, whatever
 *    the event body says.
 * 2. Sends four values (submission id, form, language, email) to the Google Apps Script
 *    of forms@matincc.ca, signed with HMAC-SHA256 and a timestamp. The script refuses
 *    anything unsigned, altered or older than five minutes, and sends one fixed text.
 * The name and the message never leave Netlify, and are never logged.
 *
 * Inactive unless all three variables are set (Netlify → Environment variables):
 *   ACK_ENDPOINT_URL   the Apps Script web app address
 *   ACK_SHARED_SECRET  the secret created by ackSetup() in the script ("secret" value)
 *   NETLIFY_API_TOKEN  a Netlify personal access token, with an expiration date
 */
import { createHmac } from 'node:crypto';

export const ACK_FORMS = ['contact', 'benevolat'] as const;
const SITE = process.env.ACK_SITE || 'matincc.netlify.app';
const API = 'https://api.netlify.com/api/v1';

export interface EventPayload {
  id: string;
  form_id?: string;
  form_name: string;
  data?: Record<string, string>;
}

interface Submission {
  id: string;
  created_at: string;
  data: Record<string, string>;
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

async function api<T>(path: string, token: string): Promise<T | null> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    console.warn(`Acknowledgement: Netlify API ${res.status} on ${path.split('?')[0]}`);
    return null;
  }
  return (await res.json()) as T;
}

/** The submission as Netlify stored it, or null if it is not a verified one of ours. */
async function verifiedSubmission(p: EventPayload, token: string) {
  const forms = await api<{ id: string; name: string }[]>(`/sites/${SITE}/forms`, token);
  const form = forms?.find((f) => f.name === p.form_name && (!p.form_id || f.id === p.form_id));
  if (!form) return null;
  // Verified submissions only (spam is listed separately); newest first.
  const list = await api<Submission[]>(`/forms/${form.id}/submissions?per_page=50`, token);
  return list?.find((s) => s.id === p.id) ?? null;
}

export type AckResult =
  'disabled' | 'not-acknowledged-form' | 'unverified' | 'honeypot' | 'no-email' | 'error' | string;

export async function acknowledge(p: EventPayload): Promise<AckResult> {
  const url = process.env.ACK_ENDPOINT_URL;
  const secret = process.env.ACK_SHARED_SECRET;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!url || !secret || !token) return 'disabled';
  if (!(ACK_FORMS as readonly string[]).includes(p.form_name)) return 'not-acknowledged-form';

  try {
    const s = await verifiedSubmission(p, token);
    if (!s) return 'unverified';
    if (s.data['bot-field']) return 'honeypot';
    const email = (s.data.email ?? '').trim();
    if (!email) return 'no-email';

    const payload = asciiJson({
      id: s.id,
      form: p.form_name,
      lang: s.data.lang ?? '',
      email,
      created_at: s.created_at,
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
