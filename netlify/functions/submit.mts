/**
 * /api/submit: one endpoint for every website form (used when PUBLIC_FORMS_MODE=email).
 * Validates and cleans the submission, checks the honeypot, the optional Turnstile token
 * and a small rate limit, then emails it to the administrative inbox (see _shared/notify).
 * The visitor sees « sent » only if the email provider accepted the notification; a short
 * acknowledgement is then sent to the visitor.
 *
 * To add a form later: add an entry to FORMS below (name = the form's `name` attribute).
 */
import type { Config, Context } from '@netlify/functions';
import {
  adminEmail,
  EMAIL,
  emailConfig,
  json,
  langOf,
  montrealNow,
  multiLine,
  rateLimited,
  sendEmail,
  singleLine,
  visitorConfirmation,
  type Row,
} from './_shared/notify';

type Field = {
  name: string;
  label: string;
  long?: boolean;
  required?: boolean;
  /** Required only when another field has this value, e.g. "requester_type=organization". */
  requiredWhen?: string;
  checkbox?: boolean;
};
type FormDef = {
  subject: string | ((data: Record<string, string>) => string);
  fields: Field[];
  confirm: boolean;
};

const PREFIX = '[MATIN WEBSITE]';
const consentField: Field = {
  name: 'consent',
  label: 'Consentement / Consent',
  checkbox: true,
  required: true,
};

const FORMS: Record<string, FormDef> = {
  // Contact & Collaboration (Oct 2026): an individual or an organization's representative.
  contact: {
    subject: (d) =>
      d.requester_type === 'organization'
        ? `${PREFIX} New Contact Message (organization): ${d.subject}`
        : `${PREFIX} New Contact Message: ${d.subject}`,
    confirm: true,
    fields: [
      { name: 'requester_type', label: 'Je suis / I am', required: true },
      {
        name: 'organization',
        label: 'Organisme (déclaré par l’expéditeur) / Organization (as declared by the sender)',
        requiredWhen: 'requester_type=organization',
      },
      { name: 'position', label: 'Fonction / Position' },
      { name: 'name', label: 'Nom / Name', required: true },
      { name: 'email', label: 'Courriel / Email', required: true },
      { name: 'subject', label: 'Objet / Subject', required: true },
      { name: 'message', label: 'Message', long: true, required: true },
      consentField,
    ],
  },
  interet: {
    // A partnership request gets its own subject so the inbox can filter it.
    subject: (d) =>
      d.interest_partnerships
        ? `${PREFIX} New Partnership Inquiry`
        : `${PREFIX} New Expression of Interest`,
    confirm: true,
    fields: [
      { name: 'name', label: 'Nom / Name', required: true },
      { name: 'email', label: 'Courriel / Email', required: true },
      {
        name: 'preferred_language',
        label: 'Langue de préférence / Preferred language',
        required: true,
      },
      { name: 'organization', label: 'Organisme / Organization' },
      { name: 'interest_partnerships', label: 'Partenariats / Partnerships', checkbox: true },
      { name: 'interest_research', label: 'Recherche / Research', checkbox: true },
      {
        name: 'interest_programs',
        label: 'Programmes et événements / Programs & events',
        checkbox: true,
      },
      { name: 'interest_volunteering', label: 'Bénévolat / Volunteering', checkbox: true },
      {
        name: 'interest_updates',
        label: 'Nouvelles / News & updates (not a newsletter subscription)',
        checkbox: true,
      },
      { name: 'message', label: 'Message', long: true },
      consentField,
    ],
  },
  adhesion: {
    subject: (d) => `${PREFIX} New Membership Application (${d.member_type})`,
    confirm: true,
    fields: [
      { name: 'member_type', label: 'Catégorie / Category', required: true },
      { name: 'first_name', label: 'Prénom / First name', required: true },
      { name: 'last_name', label: 'Nom / Last name', required: true },
      { name: 'occupation', label: 'Profession / Occupation' },
      {
        name: 'organization',
        label: 'Organisme / Organization',
        requiredWhen: 'member_type=organization',
      },
      { name: 'org_type', label: 'Type d’organisme / Type of organization' },
      { name: 'position', label: 'Fonction / Position' },
      {
        name: 'office',
        label: 'Fonction élective / Elected office',
        requiredWhen: 'member_type=elected',
      },
      { name: 'government_level', label: 'Palier / Level of government' },
      { name: 'district', label: 'Circonscription / District' },
      { name: 'email', label: 'Courriel / Email', required: true },
      { name: 'phone', label: 'Téléphone / Phone' },
      { name: 'address', label: 'Adresse / Address', required: true },
      { name: 'city', label: 'Ville / City', required: true },
      { name: 'province', label: 'Province', required: true },
      { name: 'postal_code', label: 'Code postal / Postal code', required: true },
      { name: 'country', label: 'Pays / Country', required: true },
      { name: 'languages', label: 'Langues / Languages' },
      { name: 'interests', label: 'Intérêts / Interests' },
      { name: 'message', label: 'Message', long: true },
      { name: 'confirm_bylaws', label: 'Règlements / Bylaws', checkbox: true, required: true },
      consentField,
    ],
  },
  benevolat: {
    subject: `${PREFIX} New Volunteer Application`,
    confirm: true,
    fields: [
      { name: 'name', label: 'Nom / Name', required: true },
      { name: 'email', label: 'Courriel / Email', required: true },
      { name: 'phone', label: 'Téléphone / Phone' },
      { name: 'role', label: 'Rôle souhaité / Preferred role' },
      { name: 'availability', label: 'Disponibilités / Availability' },
      { name: 'languages', label: 'Langues / Languages' },
      { name: 'languages_other', label: 'Autre langue / Other language' },
      { name: 'motivation', label: 'Motivation', long: true, required: true },
      consentField,
    ],
  },
};

const yes = (v: unknown) => v === true || v === 'oui' || v === 'on' || v === 'yes';

async function turnstileOk(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured: honeypot + rate limit only
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  return ((await res.json()) as { success: boolean }).success;
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return json(405, { ok: false });

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: 'invalid_body' });
  }

  const formName = singleLine(data['form-name'], 40);
  const form = FORMS[formName];
  if (!form) return json(400, { ok: false, error: 'unknown_form' });

  // Honeypot: bots fill every field. Pretend success so they learn nothing.
  if (data['bot-field']) return json(200, { ok: true });

  const ip = context.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  if (rateLimited(ip)) return json(429, { ok: false, error: 'rate_limited' });
  if (!(await turnstileOk(singleLine(data['cf-turnstile-response'], 2048), ip))) {
    return json(400, { ok: false, error: 'captcha' });
  }

  // Keep only the fields this form declares, cleaned; check the required ones.
  const clean: Record<string, string> = {};
  const missing: string[] = [];
  for (const f of form.fields) {
    const raw = data[f.name];
    const value = f.checkbox
      ? yes(raw)
        ? 'oui / yes'
        : ''
      : f.long
        ? multiLine(raw)
        : singleLine(raw);
    const [whenName, whenValue] = f.requiredWhen?.split('=') ?? [];
    const needed = f.required || (!!whenName && singleLine(data[whenName]) === whenValue);
    if (needed && !value) missing.push(f.name);
    if (value) clean[f.name] = value;
  }
  if (missing.length) return json(400, { ok: false, error: 'required', fields: missing });
  if (!EMAIL.test(clean.email) || clean.email.length > 254) {
    return json(400, { ok: false, error: 'email', fields: ['email'] });
  }

  const cfg = emailConfig();
  if (!cfg) {
    console.error('Form notifications are not configured (BREVO_API_KEY / NOTIFY_FROM).');
    return json(503, { ok: false, error: 'not_configured' });
  }

  const lang = langOf(data.lang);
  const type = typeof form.subject === 'function' ? form.subject(clean) : form.subject;
  const rows: Row[] = [
    { label: 'Formulaire / Form', value: formName },
    ...form.fields.map((f) => ({ label: f.label, value: clean[f.name] ?? '' })),
    { label: 'Langue du site / Site language', value: lang },
    { label: 'Reçu le / Received', value: montrealNow() },
  ];
  const { text, html } = adminEmail(type.replace(`${PREFIX} `, ''), rows);

  const accepted = await sendEmail(cfg, {
    to: cfg.to,
    subject: type,
    text,
    html,
    replyTo: clean.email,
  });
  if (!accepted) return json(502, { ok: false, error: 'provider' });

  if (form.confirm) {
    const c = visitorConfirmation(lang);
    // The visitor's acknowledgement is a courtesy: its failure doesn't undo the submission.
    await sendEmail(cfg, { to: clean.email, ...c }).catch(() => false);
  }
  console.log(`Form "${formName}" accepted by the email provider`);
  return json(200, { ok: true });
};

export const config: Config = { path: '/api/submit' };
