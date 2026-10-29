/**
 * Matin – website form entries → Google Sheet (owner's request, Oct 27 2026; membership
 * applications added Oct 28 2026, volunteer registry and thank-you emails Oct 29 2026: after changing this file, paste it into the Apps Script
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
    if (body.form === 'benevolat') addVolunteer(data, received, id);
    if (body.form === 'contact' && !/^Candidature/.test(clean(data.requester_type))) sendContactAck(data);
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

/*
 * Volunteer registry (owner's request, Oct 29 2026): every volunteer offer from the website
 * also lands in the sheet « Volunteers - داوطلبان » (tab Volunteers), one row per person.
 * When an admin ticks Approve (column M), the volunteer gets a volunteer number (VOL-0001…,
 * column A) and an official thank-you email in French and English (and Persian when they
 * wrote from the Persian site) that names the area of collaboration: column L when an admin
 * typed one, otherwise the skills and interests the volunteer wrote. Column N records the
 * time it was sent, or the error (rows whose N starts with « Error » are tried again).
 * Nothing is sent before approval. Run setupVolunteerEmails once after pasting this file.
 */
const VOL_REGISTRY_ID = '1xKKzk-tlUH4Nf6LjZpL5-VWoW3YKazi73sYCCDOiTUg';
const VOL_TAB = 'Volunteers';
const VOL_REPLY_TO = 'info@matincc.ca';
const VOL_FORMATS = {
  'Remote / Online': ['En ligne', 'Online', 'آنلاین'],
  'In person': ['En personne', 'In person', 'حضوری'],
  Both: ['En ligne et en personne', 'Online and in person', 'آنلاین و حضوری'],
};

function addVolunteer(data, received, id) {
  try {
    const sheet = SpreadsheetApp.openById(VOL_REGISTRY_ID).getSheetByName(VOL_TAB);
    const v = (f) => clean(data[f]);
    // The Approve checkboxes are pre-filled down the sheet (unticked = FALSE), so the new
    // row is the first one whose Received cell (B) is empty, never appendRow.
    const last = Math.max(sheet.getLastRow(), 1);
    const dates = sheet.getRange(1, 2, last, 1).getValues();
    let row = dates.findIndex((r, i) => i > 0 && String(r[0]).trim() === '') + 1;
    if (row < 2) row = last + 1;
    sheet.getRange(row, 1, 1, 12).setValues([[
      '', received, v('name'), v('email'), v('country'), v('city'), v('languages'),
      v('collaboration'), v('skills'), v('additional_info'), v('lang').toUpperCase(), '',
    ]]);
    sheet.getRange(row, 16).setValue(id);
    if (row > last) sheet.getRange(row, 13).insertCheckboxes();
  } catch (err) {
    console.error('Volunteer registry not updated: ' + err);
  }
}

/** Run once by hand: installs the Approve trigger and an hourly retry. */
function setupVolunteerEmails() {
  ScriptApp.getProjectTriggers().forEach((t) => {
    if (['onVolunteerApprove', 'sendVolunteerThanks'].indexOf(t.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('onVolunteerApprove').forSpreadsheet(VOL_REGISTRY_ID).onEdit().create();
  ScriptApp.newTrigger('sendVolunteerThanks').timeBased().everyHours(1).create();
  sendVolunteerThanks();
}

function onVolunteerApprove(e) {
  const r = e && e.range;
  if (r && r.getSheet().getName() === VOL_TAB && r.getColumn() <= 13 && r.getLastColumn() >= 13) {
    sendVolunteerThanks();
  }
}

function sendVolunteerThanks() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  let sent = 0;
  try {
    const sheet = SpreadsheetApp.openById(VOL_REGISTRY_ID).getSheetByName(VOL_TAB);
    const last = sheet.getLastRow();
    if (last < 2) return;
    const rows = sheet.getRange(2, 1, last - 1, 14).getValues();
    let max = 0;
    rows.forEach((r) => {
      const m = /^VOL-(\d+)$/.exec(String(r[0]).trim());
      if (m && +m[1] > max) max = +m[1];
    });
    rows.forEach((r, i) => {
      const done = String(r[13]).trim();
      if (r[12] !== true || (done && !/^Error/i.test(done))) return;
      const row = i + 2;
      const email = String(r[3]).trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sheet.getRange(row, 14).setValue('Error: no valid email');
        return;
      }
      let volId = String(r[0]).trim();
      if (!volId) {
        volId = 'VOL-' + String(++max).padStart(4, '0');
        sheet.getRange(row, 1).setValue(volId);
      }
      try {
        const msg = volunteerEmail(volId, r);
        const options = { name: 'Institut interculturel Matin', replyTo: VOL_REPLY_TO };
        GmailApp.sendEmail(email, msg.subject, msg.text, options);
        sheet.getRange(row, 14).setValue(Utilities.formatDate(new Date(), 'America/Toronto', 'yyyy-MM-dd HH:mm'));
        sent++;
      } catch (err) {
        sheet.getRange(row, 14).setValue('Error: ' + err.message);
      }
    });
  } finally {
    lock.releaseLock();
    console.log(sent + ' volunteer thank-you email(s) sent');
  }
}

function volunteerEmail(volId, r) {
  const name = String(r[2]).trim();
  const area = String(r[11]).trim() || String(r[8]).trim().slice(0, 400);
  const format = VOL_FORMATS[String(r[7]).trim()] || ['', '', ''];
  const fa = String(r[10]).trim().toUpperCase() === 'FA';
  const fr = [
    'Bonjour' + (name ? ' ' + name : '') + ',',
    '',
    "Au nom de l'Institut interculturel Matin, merci de votre volonté de contribuer à nos activités. " +
      "Nous avons le plaisir de confirmer votre inscription dans l'équipe bénévole de Matin.",
    '',
    'Votre numéro de bénévole : ' + volId,
    area ? 'Domaine de collaboration : ' + area : null,
    format[0] ? 'Format : ' + format[0] : null,
    '',
    'Nous communiquerons avec vous lorsqu\'un projet correspondra à vos intérêts. ' +
      'Veuillez indiquer votre numéro de bénévole dans vos échanges avec nous.',
    '',
    'Avec nos remerciements,',
    "L'équipe de l'Institut interculturel Matin",
  ];
  const en = [
    'Hello' + (name ? ' ' + name : '') + ',',
    '',
    'On behalf of the Matin Intercultural Institute, thank you for offering to contribute to our activities. ' +
      "We are pleased to confirm that you are now part of Matin's volunteer team.",
    '',
    'Your volunteer number: ' + volId,
    area ? 'Area of collaboration: ' + area : null,
    format[1] ? 'Format: ' + format[1] : null,
    '',
    'We will contact you when a project matches your interests. ' +
      'Please mention your volunteer number when you write to us.',
    '',
    'With our thanks,',
    'The Matin Intercultural Institute team',
  ];
  const faText = [
    'سلام' + (name ? ' ' + name + ' عزیز' : '') + '،',
    '',
    'از طرف مؤسسه میان‌فرهنگی متین، از اینکه می‌خواهید در فعالیت‌های ما همکاری کنید سپاسگزاریم. ' +
      'با خوشحالی عضویت شما را در تیم داوطلبان متین تأیید می‌کنیم.',
    '',
    'شمارهٔ داوطلبی شما: ' + volId,
    area ? 'حوزهٔ همکاری: ' + area : null,
    format[2] ? 'نوع همکاری: ' + format[2] : null,
    '',
    'هر وقت پروژه‌ای با علاقه‌های شما هماهنگ باشد، با شما تماس می‌گیریم. ' +
      'لطفاً در نامه‌هایتان به ما شمارهٔ داوطلبی خود را ذکر کنید.',
    '',
    'با سپاس،',
    'تیم مؤسسه میان‌فرهنگی متین',
  ];
  const parts = [fr, en].concat(fa ? [faText] : []);
  const text = parts
    .map((p) => p.filter((line) => line !== null).join('\n'))
    .join('\n\n———\n\n') + '\n\nmatincc.ca · Instagram: https://www.instagram.com/matincc.ca/';
  return {
    subject: "Bienvenue dans l'équipe bénévole de Matin · Welcome to Matin's volunteer team",
    text: text,
  };
}

/*
 * « Write to us » acknowledgement (owner's request, Oct 29 2026): whoever sends the contact
 * form gets an immediate « we received your message » email, French then English (and
 * Persian from the Persian site); replies go to info@. Job applications, which arrive here
 * as contact rows marked « Candidature », get none. A failure is logged, never blocking.
 */
const CONTACT_REPLY_TO = 'info@matincc.ca';

function sendContactAck(data) {
  try {
    const email = clean(data.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const name = clean(data.name);
    const parts = [
      [
        'Bonjour' + (name ? ' ' + name : '') + ',',
        '',
        "Merci d'avoir écrit à l'Institut interculturel Matin. " +
          'Nous avons bien reçu votre message et nous vous répondrons dans les meilleurs délais.',
        '',
        'Cordialement,',
        "L'équipe de l'Institut interculturel Matin",
      ],
      [
        'Hello' + (name ? ' ' + name : '') + ',',
        '',
        'Thank you for writing to the Matin Intercultural Institute. ' +
          'We have received your message and will reply as soon as possible.',
        '',
        'Best regards,',
        'The Matin Intercultural Institute team',
      ],
    ];
    if (clean(data.lang).toUpperCase() === 'FA') {
      parts.push([
        'سلام' + (name ? ' ' + name + ' عزیز' : '') + '،',
        '',
        'از اینکه برای مؤسسه میان‌فرهنگی متین پیام فرستادید سپاسگزاریم. ' +
          'پیام شما به دست ما رسید و به‌زودی پاسخ می‌دهیم.',
        '',
        'با احترام،',
        'تیم مؤسسه میان‌فرهنگی متین',
      ]);
    }
    const text = parts.map((p) => p.join('\n')).join('\n\n———\n\n') +
      '\n\n' + CONTACT_REPLY_TO + ' · https://matincc.ca';
    GmailApp.sendEmail(email, 'Nous avons bien reçu votre message · We have received your message', text, {
      name: 'Institut interculturel Matin',
      replyTo: CONTACT_REPLY_TO,
    });
  } catch (err) {
    console.error('Contact acknowledgement not sent: ' + err);
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
