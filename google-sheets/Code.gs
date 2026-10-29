/**
 * Matin – website form entries → Google Sheet (owner's request, Oct 27 2026; membership
 * applications added Oct 28 2026: after changing this file, paste it into the Apps Script
 * editor and Deploy → Manage deployments → Edit → New version, keeping the same URL).
 *
 * Web app (Execute as: Me, Who has access: Anyone). The site's Netlify function
 * « submission-created » posts every verified form submission here; each one becomes
 * one row in the matching tab of the institute's Sheet. Read-only for the outside world:
 * doPost only adds rows, nothing is ever sent back but « ok ».
 *
 * Pairing: the first valid request stores the site's random secret (kept in Netlify
 * Blobs on the site side); every later request must carry the same secret.
 * To pair again, delete the PAIR_SECRET script property.
 */
const SHEET_ID = '1HNXxjIDN3QiRExOLITgVevRZTg6MsR4dGt03SDQmrWY';
const STATUS_NEW = 'Nouveau · New · جدید';

const FORMS = {
  benevolat: {
    tab: 'Bénévoles · Volunteers',
    fields: ['name', 'email', 'country', 'city', 'languages', 'collaboration', 'skills', 'additional_info'],
  },
  contact: {
    tab: 'Contact',
    fields: ['requester_type', 'organization', 'position', 'name', 'email', 'subject', 'message'],
  },
  newsletter: {
    tab: 'Infolettre · Newsletter',
    fields: ['email'],
  },
  // Membership applications (Oct 28 2026): kept here as a log, and also written straight
  // into the category tab of the registry « Members - اعضا » (see addToRegistry below).
  adhesion: {
    tab: 'Adhésions · Membership · عضویت',
    fields: [
      'member_type', 'first_name', 'last_name', 'occupation', 'organization', 'org_type',
      'position', 'office', 'government_level', 'district', 'email', 'phone', 'address',
      'city', 'province', 'postal_code', 'country', 'languages', 'message',
    ],
  },
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = String(body.secret || '');
    if (secret.length < 32) return reply('bad request');

    const props = PropertiesService.getScriptProperties();
    const paired = props.getProperty('PAIR_SECRET');
    if (!paired) props.setProperty('PAIR_SECRET', secret);
    else if (paired !== secret) return reply('forbidden');

    const form = FORMS[body.form];
    if (!form) return reply('ignored');
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(form.tab);
    const id = clean(body.id);

    // Netlify may retry: never add the same submission twice (ID is the last column).
    const idCol = form.fields.length + 5;
    if (id && sheet.getLastRow() > 1) {
      const found = sheet
        .getRange(2, idCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(id)
        .matchEntireCell(true)
        .findNext();
      if (found) return reply('duplicate');
    }

    const data = body.data || {};
    const received = body.created_at ? new Date(body.created_at) : new Date();
    sheet.appendRow([
      received,
      ...form.fields.map((f) => clean(data[f])),
      clean(data.lang).toUpperCase(),
      STATUS_NEW,
      '',
      id,
    ]);
    if (body.form === 'adhesion') {
      addToRegistry(data, received);
      sendReceipt(data);
    }
    return reply('ok');
  } catch (err) {
    console.error(err);
    return reply('error');
  } finally {
    lock.releaseLock();
  }
}

/*
 * Membership registry (owner's request, Oct 28 2026): each website application lands
 * directly in its category tab, one row per member, with a new Member ID. Only the data
 * columns are written: row 1 holds array formulas that fill End Date, Status and Days Left,
 * so the row is the first one whose column B is empty (never appendRow). Start Date stays
 * empty: the row shows as pending until an admin ticks Approve (the registry's own
 * approval script, a separate Apps Script project, then sends the welcome email).
 * Membership is free until December 31, 2027, so Fee Paid is 0. Consent is required by the form,
 * so the submission date is also the Law 25 consent date. The Approve and Welcome Email Sent
 * columns at the end of each tab (V–W, or X–Y) belong to the registry's own script: never
 * written here.
 */
const REGISTRY_ID = '13DqFVQzSBlSPtlIU-a41dCn3WsYe6VquDCwAhIXS4Y8';
const SOURCE_WEBSITE = 'Website form';

const REGISTRY = {
  individual: {
    tab: 'Individual',
    prefix: 'IND-',
    // A..L, then P..S, then U (M, N, O and T are formulas or admin checkboxes).
    blocks: (d, date) => [
      ['A', [null, d.first_name, d.last_name, d.occupation, d.email, d.phone, d.address,
        d.city, d.province, d.postal_code, d.language, '']],
      ['P', [0, true, date, SOURCE_WEBSITE]],
      ['U', [d.message]],
    ],
  },
  organization: {
    tab: 'Organizational',
    prefix: 'ORG-',
    blocks: (d, date) => [
      ['A', [null, d.organization, d.org_type, d.first_name, d.last_name, d.position, d.email,
        d.phone, d.address, d.city, d.province, d.postal_code, d.language, '']],
      ['R', [0, true, date, SOURCE_WEBSITE]],
      ['W', [d.message]],
    ],
  },
  elected: {
    tab: 'Elected Officials',
    prefix: 'ELU-',
    blocks: (d, date) => [
      ['A', [null, d.first_name, d.last_name, d.office, d.government_level, d.district, d.email,
        d.phone, d.address, d.city, d.province, d.postal_code, d.language, '']],
      ['R', [0, true, date, SOURCE_WEBSITE]],
      ['W', [d.message]],
    ],
  },
};

function addToRegistry(data, received) {
  const type = REGISTRY[clean(data.member_type)];
  if (!type) return;
  const sheet = SpreadsheetApp.openById(REGISTRY_ID).getSheetByName(type.tab);
  const last = Math.max(sheet.getLastRow(), 1);
  const ids = sheet.getRange(1, 1, last, 2).getValues();
  // First row (after the header) whose column B is empty; the highest ID so far.
  let row = 0;
  let max = 0;
  ids.forEach(([id, b], i) => {
    if (i === 0) return;
    if (!row && String(b).trim() === '') row = i + 1;
    const n = String(id).startsWith(type.prefix) ? parseInt(String(id).slice(type.prefix.length), 10) : 0;
    if (n > max) max = n;
  });
  if (!row) row = last + 1;

  const langs = clean(data.languages);
  const d = {};
  Object.keys(data).forEach((k) => (d[k] = clean(data[k])));
  d.language = /French/.test(langs) && /English/.test(langs)
    ? 'French & English'
    : /French/.test(langs) ? 'French' : /English/.test(langs) ? 'English' : '';

  type.blocks(d, received).forEach(([col, values]) => {
    if (col === 'A') values[0] = type.prefix + String(max + 1).padStart(4, '0');
    const cells = values.map((v) => (v === undefined || v === null ? '' : v));
    sheet.getRange(row, columnNumber(col), 1, cells.length).setValues([cells]);
  });
}

/*
 * Receipt email (owner's decision, Oct 28 2026): each membership applicant gets an
 * immediate « we received your application » email, in French then English. No fees,
 * no voting, no promise of acceptance: the welcome email is sent later, when an admin
 * ticks Approve in the registry. Sent from members@matincc.ca once that address is a Gmail
 * "send as" alias of this account; until then from this account, with replies going to
 * members@ (Oct 29 2026, same as the welcome email). A failure is logged, never blocking.
 */
const MEMBERS_FROM = 'members@matincc.ca';

function sendReceipt(data) {
  try {
    const email = clean(data.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const first = clean(data.first_name);
    const text = [
      'Bonjour' + (first ? ' ' + first : '') + ',',
      '',
      "Nous avons bien reçu votre demande d'adhésion à l'Institut interculturel Matin. " +
        'Notre équipe l\'examinera et vous recevrez une confirmation par courriel. ' +
        'Merci de votre intérêt!',
      '',
      '———',
      '',
      'Hello' + (first ? ' ' + first : '') + ',',
      '',
      'We have received your membership application to the Matin Intercultural Institute. ' +
        'Our team will review it and you will receive a confirmation by email. ' +
        'Thank you for your interest!',
      '',
      'Institut interculturel Matin · Matin Intercultural Institute',
    ].join('\n');
    const options = { name: 'Institut interculturel Matin', replyTo: MEMBERS_FROM };
    if (GmailApp.getAliases().indexOf(MEMBERS_FROM) !== -1) options.from = MEMBERS_FROM;
    GmailApp.sendEmail(email, "Votre demande d'adhésion a été reçue · Your membership application has been received", text, options);
  } catch (err) {
    console.error('Receipt not sent: ' + err);
  }
}

function columnNumber(letter) {
  return letter.charCodeAt(0) - 64;
}

/** Plain text only: lists joined, length capped, no formulas (=, +, -, @). */
function clean(value) {
  const text = Array.isArray(value) ? value.join(', ') : String(value == null ? '' : value);
  const short = text.trim().slice(0, 5000);
  return /^[=+\-@]/.test(short) ? "'" + short : short;
}

function reply(text) {
  return ContentService.createTextOutput(text);
}
