// Matin forms web app v6 (My Story uploads, clean HTML emails, Advisory Circle, Oct 31 2026)
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
  // « My Story in 15 Seconds » uploads come straight from visitors' browsers (see below).
  const story = storyRequest(e);
  if (story) return story;

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

    if (body.form === 'conseillers') return reply(addAdvisor(body));
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
    options.htmlBody = emailHtml(text);
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
        const options = { name: 'Institut interculturel Matin', replyTo: VOL_REPLY_TO, htmlBody: emailHtml(msg.text) };
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
    .join('\n\n———\n\n') + '\n\nhttps://matincc.ca · Instagram: https://www.instagram.com/matincc.ca/';
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
      htmlBody: emailHtml(text),
    });
  } catch (err) {
    console.error('Contact acknowledgement not sent: ' + err);
  }
}

/*
 * Clean HTML copy of a plain-text email (Oct 31 2026). Without it, mail apps cut long
 * plain-text lines at a fixed width, so sentences broke in the middle. Blank lines become
 * paragraphs, « ——— » a thin rule, links are clickable, Persian paragraphs read right to
 * left. The plain text is still sent alongside, for mail apps that show text only.
 */
function emailHtml(text) {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const link = (t) => t
    .replace(/(https:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" style="color:#1f3a68">$1</a>')
    .replace(/([\w.+-]+@[\w-]+\.[\w.-]*\w)/g, '<a href="mailto:$1" style="color:#1f3a68">$1</a>');
  const sections = String(text).split(/\n*———\n*/).map((sec) => sec.trim().split(/\n{2,}/).map((para) => {
    const rtl = /^[\u0600-\u06FF]/.test(para.trim());
    const body = para.split('\n').map((line) => link(esc(line))).join('<br>');
    return '<p style="margin:0 0 14px' + (rtl ? ';text-align:right' : '') + '"' + (rtl ? ' dir="rtl"' : '') + '>' + body + '</p>';
  }).join(''));
  return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:600px">' +
    sections.join('<hr style="border:none;border-top:1px solid #ddd;margin:22px 0">') + '</div>';
}

/*
 * Matin Advisory Circle (owner's request, Oct 31 2026): « Cercle des conseillers de Matin » /
 * "Matin Advisory Circle" / «گروه مشاوران متین». Each application from the Contact page
 * (Netlify form « conseillers ») becomes one row of the sheet « Advisors - مشاوران »
 * (tab Advisors). The CV is copied from Netlify into the private Drive folder
 * « CV conseillers · Advisor CVs » next to that sheet (created on first use); if the copy
 * fails, the Netlify link is kept instead. The applicant gets an immediate receipt
 * (French, English, and Persian from the Persian site). When an admin ticks Approve
 * (column T), the advisor gets a number (ADV-0001…, column A) and a welcome email; column U
 * records the time it was sent, or the error (rows whose U starts with « Error » are tried
 * again). Joining the circle creates no employment: any paid work needs a separate written
 * contract. Run setupAdvisorEmails once after pasting this file.
 */
const ADV_REGISTRY_ID = '1rWfbevGWZ3mcXEGi9qprhx-9syMjzKsrZeDH4FEQ-z8';
const ADV_TAB = 'Advisors';
const ADV_FOLDER_NAME = 'CV conseillers · Advisor CVs';
const ADV_REPLY_TO = 'info@matincc.ca';
const ADV_COLS = 22; // A Advisor ID … V Submission ID
const ADV_APPROVE = 20; // T
const ADV_SENT = 21; // U

function addAdvisor(body) {
  try {
    const sheet = SpreadsheetApp.openById(ADV_REGISTRY_ID).getSheetByName(ADV_TAB);
    const id = clean(body.id);
    const last = Math.max(sheet.getLastRow(), 1);
    if (id && last > 1) {
      const found = sheet.getRange(2, ADV_COLS, last - 1, 1)
        .createTextFinder(id).matchEntireCell(true).findNext();
      if (found) return 'duplicate';
    }
    const data = body.data || {};
    const v = (f) => clean(data[f]);
    const received = body.created_at ? new Date(body.created_at) : new Date();
    const cv = saveAdvisorCv(v('cv'), v('first_name') + ' ' + v('last_name'), received);
    // Approve checkboxes are pre-filled down the sheet, so the new row is the first one
    // whose Received cell (B) is empty, never appendRow.
    const dates = sheet.getRange(1, 2, last, 1).getValues();
    let row = dates.findIndex((r, i) => i > 0 && String(r[0]).trim() === '') + 1;
    if (row < 2) row = last + 1;
    sheet.getRange(row, 1, 1, 19).setValues([[
      '', received, v('first_name'), v('last_name'), v('email'), v('phone'), v('country'),
      v('city'), v('degree'), v('discipline'), v('expertise'), v('areas'), v('languages'),
      v('linkedin'), v('motivation'), cv, v('lang').toUpperCase(), v('consents'), '',
    ]]);
    sheet.getRange(row, ADV_COLS).setValue(id);
    if (row > last) sheet.getRange(row, ADV_APPROVE).insertCheckboxes();
    sendAdvisorReceipt(data);
    return 'ok';
  } catch (err) {
    console.error('Advisor registry not updated: ' + err);
    return 'error';
  }
}

/** Copies the CV into the private Drive folder; returns its Drive link, or the original link. */
function saveAdvisorCv(url, name, received) {
  if (!/^https:\/\//.test(url)) return url;
  try {
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    if (res.getResponseCode() !== 200) return url;
    const blob = res.getBlob();
    if (blob.getBytes().length > 6 * 1024 * 1024) return url;
    const ext = (/\.(pdf|docx?)(\?|$)/i.exec(url) || [, 'pdf'])[1].toLowerCase();
    const day = Utilities.formatDate(received, 'America/Toronto', 'yyyy-MM-dd');
    const safe = name.replace(/[^\p{L}\p{N} .-]/gu, '').trim().slice(0, 80) || 'CV';
    blob.setName(day + ' ' + safe + '.' + ext);
    return advisorFolder().createFile(blob).getUrl();
  } catch (err) {
    console.error('Advisor CV not copied: ' + err);
    return url;
  }
}

function advisorFolder() {
  const props = PropertiesService.getScriptProperties();
  const known = props.getProperty('ADV_FOLDER_ID');
  if (known) {
    try { return DriveApp.getFolderById(known); } catch (err) { /* recreated below */ }
  }
  const parents = DriveApp.getFileById(ADV_REGISTRY_ID).getParents();
  const parent = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const existing = parent.getFoldersByName(ADV_FOLDER_NAME);
  const folder = existing.hasNext() ? existing.next() : parent.createFolder(ADV_FOLDER_NAME);
  props.setProperty('ADV_FOLDER_ID', folder.getId());
  return folder;
}

function sendAdvisorReceipt(data) {
  try {
    const email = clean(data.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const name = clean(data.first_name);
    const parts = [
      [
        'Bonjour' + (name ? ' ' + name : '') + ',',
        '',
        "Merci de votre intérêt pour le Cercle des conseillers de l'Institut interculturel Matin. " +
          'Nous avons bien reçu votre candidature et votre CV.',
        '',
        'Notre équipe étudiera votre profil et vous enverra un courriel de confirmation dans un délai maximal de cinq jours ouvrables. ' +
          "Pour rappel, l'inscription au Cercle est gratuite et ne crée aucun lien d'emploi : " +
          'toute collaboration rémunérée fera l’objet d’un contrat écrit distinct, projet par projet.',
        '',
        'Cordialement,',
        "L'équipe de l'Institut interculturel Matin",
      ],
      [
        'Hello' + (name ? ' ' + name : '') + ',',
        '',
        "Thank you for your interest in the Matin Intercultural Institute's Advisory Circle. " +
          'We have received your application and your CV.',
        '',
        'Our team will review your profile and send you a confirmation email within five business days at most. ' +
          'As a reminder, joining the Circle is free and creates no employment relationship: ' +
          'any paid collaboration will be set out in a separate written contract, project by project.',
        '',
        'Best regards,',
        'The Matin Intercultural Institute team',
      ],
    ];
    // From the Persian site: Persian first, then English, no French (owner, Nov 1 2026).
    const fa = clean(data.lang).toUpperCase() === 'FA';
    if (fa) {
      // The owner's own Persian text (Nov 1 2026), word for word, then the usual English text.
      parts.splice(0, 2, [
        'سلام' + (name ? ' ' + name + ' عزیز' : '') + '،',
        '',
        'درخواست شما دریافت شد، از علاقه شما برای همکاری با گروه مشاوران مؤسسه میان‌فرهنگی متین سپاسگزاریم. ' +
          'کارشناسان ما رزومه ارسالی شما را بررسی می‌کنند و حداکثر ظرف ۵ روز کاری یک ایمیل تایید برای شما ارسال خواهد شد.',
        '',
        'با احترام،',
        'معاونت پژوهشی',
        'مؤسسه میان‌فرهنگی متین',
      ], parts[1]);
    }
    const text = parts.map((p) => p.join('\n')).join('\n\n———\n\n') +
      '\n\n' + ADV_REPLY_TO + ' · https://matincc.ca';
    GmailApp.sendEmail(
      email,
      fa
        ? 'درخواست شما دریافت شد. گروه مشاوران متین'
        : 'Candidature reçue · Cercle des conseillers de Matin · Application received · Matin Advisory Circle',
      text,
      { name: 'Institut interculturel Matin', replyTo: ADV_REPLY_TO, htmlBody: emailHtml(text) },
    );
  } catch (err) {
    console.error('Advisor receipt not sent: ' + err);
  }
}

/** Run once by hand: installs the Approve trigger and an hourly retry. */
function setupAdvisorEmails() {
  ScriptApp.getProjectTriggers().forEach((t) => {
    if (['onAdvisorApprove', 'sendAdvisorWelcome'].indexOf(t.getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('onAdvisorApprove').forSpreadsheet(ADV_REGISTRY_ID).onEdit().create();
  ScriptApp.newTrigger('sendAdvisorWelcome').timeBased().everyHours(1).create();
  advisorFolder();
  sendAdvisorWelcome();
}

function onAdvisorApprove(e) {
  const r = e && e.range;
  if (r && r.getSheet().getName() === ADV_TAB && r.getColumn() <= ADV_APPROVE && r.getLastColumn() >= ADV_APPROVE) {
    sendAdvisorWelcome();
  }
}

function sendAdvisorWelcome() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  let sent = 0;
  try {
    const sheet = SpreadsheetApp.openById(ADV_REGISTRY_ID).getSheetByName(ADV_TAB);
    const last = sheet.getLastRow();
    if (last < 2) return;
    const rows = sheet.getRange(2, 1, last - 1, ADV_SENT).getValues();
    let max = 0;
    rows.forEach((r) => {
      const m = /^ADV-(\d+)$/.exec(String(r[0]).trim());
      if (m && +m[1] > max) max = +m[1];
    });
    rows.forEach((r, i) => {
      const done = String(r[ADV_SENT - 1]).trim();
      if (r[ADV_APPROVE - 1] !== true || (done && !/^Error/i.test(done))) return;
      const row = i + 2;
      const email = String(r[4]).trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sheet.getRange(row, ADV_SENT).setValue('Error: no valid email');
        return;
      }
      let advId = String(r[0]).trim();
      if (!advId) {
        advId = 'ADV-' + String(++max).padStart(4, '0');
        sheet.getRange(row, 1).setValue(advId);
      }
      try {
        const msg = advisorWelcomeEmail(advId, String(r[2]).trim(), String(r[16]).trim().toUpperCase() === 'FA');
        GmailApp.sendEmail(email, msg.subject, msg.text, {
          name: 'Institut interculturel Matin',
          replyTo: ADV_REPLY_TO,
          htmlBody: emailHtml(msg.text),
        });
        sheet.getRange(row, ADV_SENT).setValue(Utilities.formatDate(new Date(), 'America/Toronto', 'yyyy-MM-dd HH:mm'));
        sent++;
      } catch (err) {
        sheet.getRange(row, ADV_SENT).setValue('Error: ' + err.message);
      }
    });
  } finally {
    lock.releaseLock();
    console.log(sent + ' advisor welcome email(s) sent');
  }
}

function advisorWelcomeEmail(advId, name, fa) {
  const fr = [
    'Bonjour' + (name ? ' ' + name : '') + ',',
    '',
    "Au nom de l'Institut interculturel Matin, nous avons le plaisir de vous accueillir au sein du " +
      'Cercle des conseillers de Matin. Merci de mettre votre expertise au service du dialogue entre les cultures.',
    '',
    'Votre numéro de conseiller : ' + advId,
    '',
    'Lorsqu’un projet correspondra à votre expertise, nous vous écrirons pour vous le présenter. ' +
      'Toute collaboration rémunérée sera précisée dans un contrat écrit distinct, et les honoraires seront ' +
      'versés après la réalisation du travail, selon ce contrat. Votre nom ne sera publié qu’avec votre accord écrit.',
    '',
    'Veuillez indiquer votre numéro de conseiller dans vos échanges avec nous.',
    '',
    'Avec nos remerciements,',
    "L'équipe de l'Institut interculturel Matin",
  ];
  const en = [
    'Hello' + (name ? ' ' + name : '') + ',',
    '',
    'On behalf of the Matin Intercultural Institute, we are pleased to welcome you to the Matin Advisory Circle. ' +
      'Thank you for offering your expertise to dialogue between cultures.',
    '',
    'Your advisor number: ' + advId,
    '',
    'When a project matches your expertise, we will write to present it to you. ' +
      'Any paid collaboration will be set out in a separate written contract, and fees will be paid ' +
      'once the work is completed, as that contract provides. Your name will be published only with your written agreement.',
    '',
    'Please mention your advisor number when you write to us.',
    '',
    'With our thanks,',
    'The Matin Intercultural Institute team',
  ];
  const faText = [
    'سلام' + (name ? ' ' + name + ' عزیز' : '') + '،',
    '',
    'از طرف مؤسسه میان‌فرهنگی متین، با خوشحالی پیوستن شما را به گروه مشاوران متین خوشامد می‌گوییم. ' +
      'سپاسگزاریم که تخصص خود را در خدمت گفت‌وگوی میان فرهنگ‌ها قرار می‌دهید.',
    '',
    'شمارهٔ مشاور شما: ' + advId,
    '',
    'هر وقت پروژه‌ای با تخصص شما هماهنگ باشد، برایتان می‌نویسیم و آن را معرفی می‌کنیم. ' +
      'هر همکاری با دستمزد در قراردادی کتبی و جداگانه مشخص می‌شود و دستمزد پس از انجام کار، طبق همان قرارداد، پرداخت می‌شود. ' +
      'نام شما فقط با موافقت کتبی خودتان منتشر می‌شود.',
    '',
    'لطفاً در نامه‌هایتان به ما شمارهٔ مشاور خود را ذکر کنید.',
    '',
    'با سپاس،',
    'معاونت پژوهشی',
    'مؤسسه میان‌فرهنگی متین',
  ];
  // From the Persian site: Persian first, then English, no French (owner, Nov 1 2026).
  const parts = fa ? [faText, en] : [fr, en];
  return {
    subject: fa
      ? 'به گروه مشاوران متین خوش آمدید · Welcome to the Matin Advisory Circle'
      : 'Bienvenue au Cercle des conseillers de Matin · Welcome to the Matin Advisory Circle',
    text: parts.map((p) => p.join('\n')).join('\n\n———\n\n') +
      '\n\nhttps://matincc.ca · ' + ADV_REPLY_TO,
  };
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

/*
 * « Mon histoire en 15 secondes » / "My Story in 15 Seconds" / «داستان من در ۱۵ ثانیه»
 * (owner's request, Oct 31 2026). Visitors send a short phone video (up to 15 s for the
 * site, or up to 1 minute for a YouTube Short) from the page /en/my-story/. The browser
 * talks to this web app directly, because Netlify Forms cannot take files this large:
 *
 *   story-start  checks the form, opens a resumable upload in the Drive folder below and
 *                returns a one-time token (valid 6 hours);
 *   story-chunk  receives one 8 MB piece (base64) and passes it on to Drive; the last piece
 *                adds the row to the « Histoires · Stories » tab and emails the admin inbox;
 *   story-status tells the browser where to resume after a dropped connection.
 *
 * Nothing is published: an admin watches the video, and only an approved clip goes to
 * Matin's YouTube channel and onto the site (a YAML file in src/content/stories/).
 * No email is sent to the visitor. A clip that is not published is deleted from the folder.
 * Abuse limits: video files only, at most 250 MB, at most STORY_DAILY_MAX uploads a day.
 */
const STORY_FOLDER_ID = '1rSsYz4D8IautFj3XqIwYWFI1krWDFUGq'; // 50_Members_Volunteers › Histoires vidéo
const STORY_TAB = 'Histoires · Stories';
const STORY_HEADERS = [
  'Reçu · Received', 'Prénom · First name', 'Ville / quartier · City', 'Langue · Language',
  'Question', 'Format', 'Durée (s) · Length', 'Courriel · Email', 'Vidéo · Video (Drive)',
  'Langue du site · Site language', 'Statut · Status', 'YouTube', 'Notes', 'ID',
];
const STORY_MAX_BYTES = 250 * 1024 * 1024;
const STORY_CHUNK = 8 * 1024 * 1024; // a multiple of 256 KB, as Drive requires
const STORY_DAILY_MAX = 40;
const STORY_ADMIN = 'matincc.mtl@gmail.com';

function storyRequest(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return null;
  }
  const action = String(body.action || '');
  if (action.indexOf('story-') !== 0) return null;
  try {
    if (action === 'story-start') return json(storyStart(body));
    if (action === 'story-chunk') return json(storyChunk(body));
    if (action === 'story-status') return json(storyStatus(body));
    return json({ ok: false, error: 'unknown' });
  } catch (err) {
    console.error('Story ' + action + ': ' + err);
    return json({ ok: false, error: 'server' });
  }
}

function storyStart(body) {
  if (clean(body['bot-field'])) return { ok: false, error: 'invalid' };
  const d = body.data || {};
  const v = (f) => clean(d[f]).slice(0, 200);
  const size = Number(body.size);
  const type = String(body.type || '');
  if (!v('first_name') || !v('city') || !v('language') || !v('prompt')) return { ok: false, error: 'invalid' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) return { ok: false, error: 'invalid' };
  if (['short', 'long'].indexOf(v('format')) === -1) return { ok: false, error: 'invalid' };
  if (d.confirm_age !== true || d.confirm_people !== true || d.confirm_publish !== true || d.consent !== true) {
    return { ok: false, error: 'invalid' };
  }
  if (!/^video\//.test(type) || !(size > 0) || size > STORY_MAX_BYTES) return { ok: false, error: 'file' };

  // Daily limit, counted in Montréal time.
  const props = PropertiesService.getScriptProperties();
  const day = Utilities.formatDate(new Date(), 'America/Toronto', 'yyyy-MM-dd');
  const count = props.getProperty('STORY_DAY') === day ? Number(props.getProperty('STORY_COUNT') || 0) : 0;
  if (count >= STORY_DAILY_MAX) return { ok: false, error: 'busy' };
  props.setProperties({ STORY_DAY: day, STORY_COUNT: String(count + 1) });

  const id = Utilities.getUuid();
  const stamp = Utilities.formatDate(new Date(), 'America/Toronto', 'yyyy-MM-dd HHmm');
  const ext = (String(body.name || '').match(/\.([a-z0-9]{2,4})$/i) || [, 'mp4'])[1].toLowerCase();
  const res = UrlFetchApp.fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
    {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
        'X-Upload-Content-Type': type,
        'X-Upload-Content-Length': String(size),
      },
      payload: JSON.stringify({
        name: stamp + ' · ' + v('first_name') + ' · ' + v('city') + ' (' + v('format') + ').' + ext,
        parents: [STORY_FOLDER_ID],
        mimeType: type,
        description: 'À valider · To review · ' + id,
      }),
      muteHttpExceptions: true,
    },
  );
  const session = res.getHeaders().Location || res.getHeaders().location;
  if (res.getResponseCode() !== 200 || !session) {
    console.error('Story session not opened: ' + res.getResponseCode() + ' ' + res.getContentText().slice(0, 300));
    return { ok: false, error: 'server' };
  }
  const info = {
    session: session,
    size: size,
    id: id,
    row: [
      v('first_name'), v('city'), v('language'), v('prompt'), v('format'),
      Math.round(Number(body.duration) || 0) || '', v('email'),
    ],
    lang: v('lang').toUpperCase(),
  };
  CacheService.getScriptCache().put('story:' + id, JSON.stringify(info), 21600);
  return { ok: true, token: id, chunk: STORY_CHUNK };
}

function storyInfo(body) {
  const cached = CacheService.getScriptCache().get('story:' + String(body.token || ''));
  return cached ? JSON.parse(cached) : null;
}

function storyChunk(body) {
  const info = storyInfo(body);
  if (!info) return { ok: false, error: 'expired' };
  const offset = Number(body.offset);
  const bytes = Utilities.base64Decode(String(body.data || ''));
  if (!(offset >= 0) || !bytes.length || offset + bytes.length > info.size) return { ok: false, error: 'invalid' };
  const end = offset + bytes.length - 1;
  const res = UrlFetchApp.fetch(info.session, {
    method: 'put',
    contentType: 'application/octet-stream',
    headers: { 'Content-Range': 'bytes ' + offset + '-' + end + '/' + info.size },
    payload: bytes,
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  if (code === 308) return { ok: true, next: nextByte(res) };
  if (code === 200 || code === 201) {
    const file = JSON.parse(res.getContentText());
    storyDone(info, file.id);
    CacheService.getScriptCache().remove('story:' + info.id);
    return { ok: true, done: true };
  }
  console.error('Story chunk failed: ' + code + ' ' + res.getContentText().slice(0, 300));
  return { ok: false, error: 'server' };
}

/** Where to resume: asks Drive how many bytes it already has. */
function storyStatus(body) {
  const info = storyInfo(body);
  if (!info) return { ok: false, error: 'expired' };
  const res = UrlFetchApp.fetch(info.session, {
    method: 'put',
    headers: { 'Content-Range': 'bytes */' + info.size },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() === 308) return { ok: true, next: nextByte(res) };
  return { ok: false, error: 'server' };
}

function nextByte(res) {
  const range = res.getHeaders().Range || res.getHeaders().range;
  const m = range && String(range).match(/bytes=0-(\d+)/);
  return m ? Number(m[1]) + 1 : 0;
}

function storyDone(info, fileId) {
  const link = 'https://drive.google.com/file/d/' + fileId + '/view';
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const book = SpreadsheetApp.openById(SHEET_ID);
    let sheet = book.getSheetByName(STORY_TAB);
    if (!sheet) {
      sheet = book.insertSheet(STORY_TAB);
      sheet.appendRow(STORY_HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, STORY_HEADERS.length).setFontWeight('bold');
    }
    sheet.appendRow([new Date()].concat(info.row, [link, info.lang, STATUS_NEW, '', '', info.id]));
  } finally {
    lock.releaseLock();
  }
  try {
    const r = info.row;
    GmailApp.sendEmail(
      STORY_ADMIN,
      '[MATIN WEBSITE] Nouvelle histoire vidéo · New video story: ' + r[0] + ' (' + r[1] + ')',
      [
        'Une nouvelle vidéo attend votre validation. · A new video is waiting for your review.',
        '',
        'Prénom · First name: ' + r[0],
        'Ville · City: ' + r[1],
        'Langue · Language: ' + r[2],
        'Question: ' + r[3],
        'Format: ' + r[4] + (r[5] ? ' · ' + r[5] + ' s' : ''),
        'Courriel · Email: ' + r[6],
        '',
        'Vidéo · Video: ' + link,
        'Rien n’est publié sans votre accord. · Nothing is published without your approval.',
      ].join('\n'),
      { name: 'Site web Matin', htmlBody: emailHtml([
        'Une nouvelle vidéo attend votre validation. · A new video is waiting for your review.',
        '',
        'Prénom · First name: ' + r[0],
        'Ville · City: ' + r[1],
        'Langue · Language: ' + r[2],
        'Question: ' + r[3],
        'Format: ' + r[4] + (r[5] ? ' · ' + r[5] + ' s' : ''),
        'Courriel · Email: ' + r[6],
        '',
        'Vidéo · Video: ' + link,
        'Rien n’est publié sans votre accord. · Nothing is published without your approval.',
      ].join('\n')) },
    );
  } catch (err) {
    console.error('Story notification not sent: ' + err);
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
