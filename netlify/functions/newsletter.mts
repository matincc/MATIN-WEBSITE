/**
 * Newsletter sign-up → Brevo, with double opt-in (the person must confirm by email,
 * which is the proof of consent recommended under Canada's anti-spam law, CASL).
 *
 * The API key stays on the server. Required environment variables (Netlify):
 *   BREVO_API_KEY            Brevo → SMTP & API → API keys
 *   BREVO_LIST_ID_FR         ID of the French list
 *   BREVO_LIST_ID_EN         ID of the English list (may be the same as FR)
 *   BREVO_DOI_TEMPLATE_ID    ID of the "double opt-in" confirmation template
 * The site uses this endpoint only when PUBLIC_NEWSLETTER_MODE=brevo.
 *
 * Brevo keeps the mailing list (with the consent record) and adds an unsubscribe link
 * to every campaign. Each new sign-up also sends a short notice to the administrative
 * inbox when notifications are configured (see _shared/notify); that notice is never
 * the list itself.
 */
import type { Config, Context } from '@netlify/functions';
import { adminEmail, emailConfig, montrealNow, sendEmail } from './_shared/notify';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return json(405, { ok: false });

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return json(400, { ok: false, error: 'invalid_body' });
  }

  // Honeypot: bots fill every field. Pretend success so they learn nothing.
  if (data['bot-field']) return json(200, { ok: true });

  const email = String(data.email ?? '')
    .trim()
    .toLowerCase();
  const lang = data.lang === 'en' ? 'en' : 'fr';
  if (!EMAIL.test(email) || email.length > 254) return json(400, { ok: false, error: 'email' });
  if (data.consent !== true && data.consent !== 'on' && data.consent !== 'oui') {
    return json(400, { ok: false, error: 'consent' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(
    lang === 'en' ? process.env.BREVO_LIST_ID_EN : process.env.BREVO_LIST_ID_FR,
  );
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  if (!apiKey || !listId || !templateId) {
    console.error(
      'Brevo is not configured (BREVO_API_KEY / BREVO_LIST_ID_* / BREVO_DOI_TEMPLATE_ID).',
    );
    return json(503, { ok: false, error: 'not_configured' });
  }

  const site = context.site?.url ?? new URL(req.url).origin;
  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl: `${site}/${lang}/?infolettre=confirmee`,
      attributes: { LANGUE: lang.toUpperCase() },
    }),
  });

  if (res.ok) {
    const cfg = emailConfig();
    if (cfg) {
      const { text, html } = adminEmail('New Newsletter Subscription', [
        { label: 'Courriel / Email', value: email },
        { label: 'Langue / Language', value: lang },
        {
          label: 'Consentement / Consent',
          value: 'oui / yes (confirmation email sent: double opt-in)',
        },
        { label: 'Reçu le / Received', value: montrealNow() },
      ]);
      await sendEmail(cfg, {
        to: cfg.to,
        subject: '[MATIN WEBSITE] New Newsletter Subscription',
        text,
        html,
      }).catch(() => false);
    }
    return json(200, { ok: true });
  }

  const detail = await res.text();
  // An already-subscribed address is treated as success, so the form never
  // reveals whether someone is on the list.
  if (res.status === 400 && detail.includes('duplicate_parameter')) return json(200, { ok: true });

  console.error('Brevo error', res.status, detail);
  return json(502, { ok: false, error: 'provider' });
};

export const config: Config = { path: '/api/newsletter' };
