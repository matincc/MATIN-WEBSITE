/**
 * Runs automatically after every Netlify form submission (« submission-created » event).
 *
 * 1. Optional anti-spam with Cloudflare Turnstile. Only active when these environment
 *    variables are set:
 *      TURNSTILE_SECRET_KEY   Cloudflare dashboard → Turnstile → your widget → Secret key
 *      NETLIFY_API_TOKEN      Netlify → User settings → Applications → Personal access token
 *    (and PUBLIC_TURNSTILE_SITE_KEY at build time, so the widget appears on the forms).
 *    If the token is missing or invalid, the submission is deleted.
 *    Without them, the honeypot field and Netlify's built-in spam filter still apply.
 *
 * 2. Google Sheet (owner's request, Oct 27 2026): every kept submission becomes one row
 *    in the institute's Sheet « Matin – Formulaires du site » (Drive, 50_Members_Volunteers),
 *    through the Apps Script web app in google-sheets/. The site sends a random secret
 *    kept in Netlify Blobs; the web app pairs with it on the first request. Email
 *    notifications are unchanged; the Sheet is an extra copy, so a failure here never
 *    affects the visitor.
 */
import type { Handler } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';

/** The Apps Script web app (Deploy → Web app). Empty: the Sheet copy is off. */
const SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbw-Tpom1Ejxw9H0fOnyzp7YjM9_yLqtwFWjUcokD9vgYjRMqOHI9NcQyqn5bQuKbZq4EQ/exec';

/** Forms copied to the Sheet; anything else is ignored there. */
const SHEET_FORMS = new Set(['benevolat', 'contact', 'newsletter', 'emplois', 'adhesion', 'conseillers']);

/** Never sent to the Sheet: spam-filter internals and the visitor's network details. */
const PRIVATE_FIELDS = new Set([
  'bot-field',
  'cf-turnstile-response',
  'form-name',
  'ip',
  'user_agent',
  'referrer',
  'consent',
  'confirm_age',
  'confirm_authorized',
  'confirm_nonpartisan',
  'confirm_bylaws',
]);

interface Payload {
  id: string;
  form_name: string;
  created_at?: string;
  data: Record<string, unknown>;
}

async function isSpam(payload: Payload) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const token = process.env.NETLIFY_API_TOKEN;
  if (!secret || !token) return false;

  const response = String(payload.data?.['cf-turnstile-response'] ?? '');
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

/** The site's half of the pairing with the web app, created once and kept in Netlify Blobs. */
async function sheetSecret() {
  const store = getStore('forms-to-sheet');
  const existing = await store.get('secret');
  if (existing) return existing;
  const secret = crypto.randomUUID() + crypto.randomUUID();
  await store.set('secret', secret);
  return secret;
}

/** An uploaded file as Netlify reports it: a link, or an object carrying one. */
function fileLink(value: unknown) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const file = value as { url?: string; filename?: string };
  return file.url ?? file.filename ?? '';
}

/**
 * Job applications (Careers page, « emplois ») go through the web app's Contact form, so
 * the deployed script needs no change, one field per column: phone in « Organisme »,
 * position in « Fonction », CV link in « Objet », LinkedIn link above the message. The
 * Sheet's « Emplois · Jobs » tab lists these rows on their own (FILTER on « Je suis »).
 */
function asContactRow(data: Record<string, unknown>) {
  const link = String(data.link ?? '').trim();
  const message = String(data.message ?? '');
  return {
    requester_type: 'Candidature · Job application · درخواست شغل',
    organization: data.phone,
    position: data.position,
    name: data.name,
    email: data.email,
    subject: fileLink(data.cv),
    message: link ? `${link}\n\n${message}` : message,
    lang: data.lang,
  };
}

/**
 * Advisory Circle applications (« conseillers », Oct 31 2026): the CV becomes a link the web
 * app copies into Drive, and the four required commitments (terms, no employment, three-year
 * register, privacy) are recorded as one « Consents » value instead of separate fields.
 */
const ADVISOR_CONSENTS: [string, string][] = [
  ['accept_terms', 'Terms'],
  ['no_employment', 'No employment'],
  ['retention', 'Kept 3 years'],
  ['consent', 'Privacy (Law 25)'],
];

function asAdvisorRow(raw: Record<string, unknown>, fields: Record<string, unknown>) {
  const given = ADVISOR_CONSENTS.filter(([key]) => raw[key]).map(([, label]) => label);
  const data: Record<string, unknown> = { ...fields, cv: fileLink(raw.cv) };
  // Country code chosen beside the number (« +98 IR »): kept with it, as « +98 912 … ».
  const code = String(fields.phone_code ?? '').split(' ')[0];
  const phone = String(fields.phone ?? '').trim();
  // The national « 0 » prefix is dropped, except for Italy, San Marino and the Vatican, where it is dialled.
  const local = ['+39', '+378'].includes(code) ? phone : phone.replace(/^0+/, '');
  data.phone = phone && code && !phone.startsWith('+') ? `${code} ${local}` : phone;
  delete data.phone_code;
  for (const [key] of ADVISOR_CONSENTS) delete data[key];
  data.consents = given.length ? `${given.join(', ')} · ${new Date().toISOString().slice(0, 10)}` : '';
  return data;
}

async function copyToSheet(payload: Payload) {
  if (!SHEET_WEBHOOK_URL || !SHEET_FORMS.has(payload.form_name)) return;
  const fields = Object.fromEntries(
    Object.entries(payload.data ?? {}).filter(([key]) => !PRIVATE_FIELDS.has(key)),
  );
  const job = payload.form_name === 'emplois';
  const data = job
    ? asContactRow(fields)
    : payload.form_name === 'conseillers'
      ? asAdvisorRow(payload.data ?? {}, fields)
      : fields;
  try {
    const res = await fetch(SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: await sheetSecret(),
        id: payload.id,
        form: job ? 'contact' : payload.form_name,
        created_at: payload.created_at,
        data,
      }),
    });
    const answer = (await res.text()).trim();
    if (answer !== 'ok' && answer !== 'duplicate') {
      console.error(
        `Sheet copy of ${payload.id} (${payload.form_name}) failed: ${answer.slice(0, 200)}`,
      );
    }
  } catch (err) {
    console.error(`Sheet copy of ${payload.id} (${payload.form_name}) failed:`, err);
  }
}

export const handler: Handler = async (event) => {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  const { payload } = JSON.parse(event.body ?? '{}') as { payload?: Payload };
  if (!payload?.id) return { statusCode: 400, body: 'No payload' };

  if (await isSpam(payload)) return { statusCode: 200, body: 'spam removed' };
  await copyToSheet(payload);
  return { statusCode: 200, body: 'ok' };
};
