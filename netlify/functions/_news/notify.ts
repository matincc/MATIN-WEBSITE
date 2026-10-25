/**
 * One internal editorial email per discovery run, through Google Workspace's own mail
 * server: from forms@matincc.ca to admin@matincc.ca (an app password of forms@, stored only
 * in Netlify). No visitor ever receives anything from this code.
 *
 *   NEWS_SMTP_USER      forms@matincc.ca
 *   NEWS_SMTP_PASSWORD  the 16-character Google app password (secret)
 *   NEWS_NOTIFY_TO      optional, default admin@matincc.ca
 *
 * The email lists headlines and source names with a link to the dashboard: no article text
 * and no sign-in link.
 */
import nodemailer from 'nodemailer';
import type { Summary } from './types';

export const notifyConfigured = () =>
  Boolean(process.env.NEWS_SMTP_USER && process.env.NEWS_SMTP_PASSWORD);

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

async function send(subject: string, text: string, html: string) {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: process.env.NEWS_SMTP_USER, pass: process.env.NEWS_SMTP_PASSWORD },
  });
  await transport.sendMail({
    from: { name: 'Matin – Editorial assistant', address: process.env.NEWS_SMTP_USER! },
    to: process.env.NEWS_NOTIFY_TO || 'admin@matincc.ca',
    subject,
    text,
    html,
  });
}

const frame = (
  title: string,
  body: string,
) => `<!doctype html><html><body style="margin:0;padding:24px;background:#F7F3EA;font-family:Arial,Helvetica,sans-serif;color:#293442">
<table role="presentation" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #E3D3B4;border-radius:12px;padding:24px"><tr><td>
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#B08A3E;font-weight:bold">Matin · Cultural News</p>
<h1 style="margin:0 0 16px;font-size:20px;color:#103B59">${esc(title)}</h1>${body}
<p style="margin:20px 0 0;font-size:12px;color:#6B7280">Internal message for the editor. Nothing has been published: every story waits for your approval.</p>
</td></tr></table></body></html>`;

export async function sendCandidatesEmail(items: Summary[], dashboard: string, testOnly = false) {
  const title = testOnly
    ? 'Test: editorial notifications work'
    : `${items.length} new cultural news ${items.length === 1 ? 'candidate' : 'candidates'} to review`;
  const lines = items.map((i) => `• ${i.title} (${i.sourceName})`);
  const text = [title, '', ...lines, '', `Review them: ${dashboard}`].join('\n');
  const html = frame(
    title,
    `${items.length ? `<ul style="padding-left:18px;margin:0 0 16px;line-height:1.5">${items.map((i) => `<li>${esc(i.title)} <span style="color:#6B7280">(${esc(i.sourceName)})</span></li>`).join('')}</ul>` : ''}
<p style="margin:0"><a href="${esc(dashboard)}" style="display:inline-block;background:#103B59;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px">Open the editorial dashboard</a></p>`,
  );
  await send(`[Matin] ${title}`, text, html);
}

export async function sendFailureEmail(message: string, dashboard: string) {
  const title = 'The daily news discovery did not finish';
  await send(
    `[Matin] ${title}`,
    `${title}\n\n${message}\n\nDetails: ${dashboard}`,
    frame(
      title,
      `<p style="margin:0 0 16px">${esc(message)}</p><p><a href="${esc(dashboard)}">Open the dashboard</a></p>`,
    ),
  );
}
