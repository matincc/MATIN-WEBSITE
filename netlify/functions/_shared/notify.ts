/**
 * Central email notifications for every website form (contact, interest, volunteer,
 * newsletter). Emails are sent through Brevo's transactional API from the server, so no
 * key or address ever reaches the browser.
 *
 * Environment variables (Netlify → Site configuration → Environment variables):
 *   BREVO_API_KEY     Brevo → SMTP & API → API keys (shared with the newsletter)
 *   NOTIFY_FROM       sender address verified in Brevo (Senders, domains & dedicated IPs)
 *   NOTIFY_FROM_NAME  optional sender name (default « Site web Matin »)
 *   NOTIFY_TO         optional: inbox that receives every submission
 *                     (default matincc.mtl@gmail.com, the single administrative inbox)
 */

export const DEFAULT_ADMIN_INBOX = 'matincc.mtl@gmail.com';
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Lang = 'fr' | 'en' | 'fa';
export const langOf = (value: unknown): Lang =>
  value === 'en' ? 'en' : value === 'fa' ? 'fa' : 'fr';

export function emailConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.NOTIFY_FROM;
  return apiKey && from && EMAIL.test(from)
    ? {
        apiKey,
        from,
        fromName: process.env.NOTIFY_FROM_NAME || 'Site web Matin',
        to: process.env.NOTIFY_TO || DEFAULT_ADMIN_INBOX,
      }
    : undefined;
}

/** Removes control characters (including CR/LF, which could inject email headers). */
export const singleLine = (value: unknown, max = 200) =>
  String(value ?? '')
    // eslint-disable-next-line no-control-regex -- removing control characters is the point
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);

/** Keeps line breaks for messages, removes other control characters. */
export const multiLine = (value: unknown, max = 5000) =>
  String(value ?? '')
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex -- removing control characters is the point
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, max);

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

/** « 17 octobre 2026, 14 h 05 (heure de Montréal) » */
export function montrealNow(date = new Date()) {
  const when = new Intl.DateTimeFormat('fr-CA', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Toronto',
  }).format(date);
  return `${when} (heure de Montréal / Montréal time)`;
}

export type Row = { label: string; value: string };

/** Plain, readable notification: a title, then one labelled line per submitted field. */
export function adminEmail(type: string, rows: Row[]) {
  const filled = rows.filter((r) => r.value);
  const text = [`${type}`, '', ...filled.map((r) => `${r.label}: ${r.value}`)].join('\n');
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#F7F3EA;font-family:Arial,Helvetica,sans-serif;color:#293442">
<table role="presentation" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #E3D3B4;border-radius:12px;border-collapse:separate;padding:24px">
<tr><td><p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#C69C46;font-weight:bold">Matin — site web / website</p>
<h1 style="margin:0 0 20px;font-size:20px;color:#103B59">${escapeHtml(type)}</h1>
<table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5">
${filled
  .map(
    (r) =>
      `<tr><th style="text-align:left;vertical-align:top;padding:8px 12px 8px 0;border-top:1px solid #EFE4D2;color:#103B59;width:38%">${escapeHtml(r.label)}</th><td style="padding:8px 0;border-top:1px solid #EFE4D2;white-space:pre-wrap">${escapeHtml(r.value)}</td></tr>`,
  )
  .join('\n')}
</table></td></tr></table></body></html>`;
  return { text, html };
}

/**
 * Sends one email through Brevo. Returns true only when Brevo accepted it (2xx): that
 * is acceptance by the provider, not proof of delivery to the inbox.
 */
export async function sendEmail(
  cfg: NonNullable<ReturnType<typeof emailConfig>>,
  msg: { to: string; subject: string; text: string; html: string; replyTo?: string },
): Promise<boolean> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': cfg.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: cfg.from, name: cfg.fromName },
      to: [{ email: msg.to }],
      ...(msg.replyTo && EMAIL.test(msg.replyTo) && { replyTo: { email: msg.replyTo } }),
      subject: singleLine(msg.subject, 250),
      textContent: msg.text,
      htmlContent: msg.html,
    }),
  });
  if (!res.ok) console.error('Brevo transactional email rejected', res.status);
  return res.ok;
}

/** Short acknowledgement sent to the visitor, in their language; never promotional. */
export function visitorConfirmation(lang: Lang) {
  const t = {
    fr: {
      subject: 'Institut interculturel Matin — message bien reçu',
      body: "Merci d'avoir communiqué avec l'Institut interculturel Matin. Nous avons bien reçu votre message et l'examinerons dans les meilleurs délais.",
    },
    en: {
      subject: 'Matin Intercultural Institute — message received',
      body: 'Thank you for contacting Matin Intercultural Institute. We have received your message and will review it as soon as possible.',
    },
    fa: {
      subject: 'مؤسسه بین‌فرهنگی متین — پیام شما دریافت شد',
      body: 'از اینکه با مؤسسه بین‌فرهنگی متین تماس گرفتید سپاسگزاریم. پیام شما به دست ما رسید و در نخستین فرصت آن را بررسی می‌کنیم.',
    },
  }[lang];
  const note = 'Ceci est un message automatique. / This is an automated message.';
  return {
    subject: t.subject,
    text: `${t.body}\n\n— Matin\n\n${note}`,
    html: `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#293442;padding:24px" dir="${lang === 'fa' ? 'rtl' : 'ltr'}"><p style="font-size:16px;line-height:1.6">${escapeHtml(t.body)}</p><p>— Matin</p><p style="font-size:12px;color:#6b7280">${note}</p></body></html>`,
  };
}

/** Very small per-instance rate limit: at most `max` submissions per address per window. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

export const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
