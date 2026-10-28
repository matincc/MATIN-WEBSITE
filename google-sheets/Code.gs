/**
 * Matin – website form entries → Google Sheet (owner's request, Oct 27 2026; membership
 * applications added Oct 28 2026: after changing this file, paste it into the Apps Script
 * editor and Deploy → Manage deployments → Edit → New version, keeping the same URL; then
 * select setupAutoSend, click Run once and Allow, for the registry's Approve tick).
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
 * empty: the row shows as pending until an admin ticks Approve (see onApproveEdit below).
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
 * ticks Approve in the registry. Sent only from members@matincc.ca once that address is
 * a Gmail "send as" alias of this account; otherwise skipped and logged, never blocking.
 */
const MEMBERS_FROM = 'members@matincc.ca';

function sendReceipt(data) {
  try {
    const email = clean(data.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (GmailApp.getAliases().indexOf(MEMBERS_FROM) === -1) {
      console.warn('Receipt not sent: ' + MEMBERS_FROM + ' is not a send-as alias yet.');
      return;
    }
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
    GmailApp.sendEmail(email, "Votre demande d'adhésion a été reçue · Your membership application has been received", text, {
      from: MEMBERS_FROM,
      name: 'Institut interculturel Matin',
      replyTo: MEMBERS_FROM,
    });
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

// ---------------------------------------------------------------------------------------

/**
 * Matin – Members registry: approve tick + automatic welcome email.
 *
 * Works from any Apps Script project running as admin@ (bound or standalone, e.g. the
 * website forms Code.gs project): it opens the registry by ID. After deploying, run
 * setupAutoSend() once from the editor and accept the permissions.
 *
 * How it works: tick "Approve" on a member's row. The script fills Start Date with today
 * (if empty), gives the row a Member ID (if empty), and emails the welcome message from
 * members@matincc.ca. It then writes the send time in "Welcome Email Sent", so nobody is
 * emailed twice. If members@ is not ready yet, it writes an error there instead and sends
 * nothing; an hourly trigger retries it once members@ works.
 */

var FROM = 'members@matincc.ca';
var SENDER_NAME = 'Institut interculturel Matin';
// REGISTRY_ID is declared once, above (same registry).

// Column numbers are 1-based (A = 1).
var TABS = {
  'Individual':        { prefix: 'IND', id: 1, first: 2, last: 3, org: 0, email: 5, start: 12, approve: 22, sent: 23 },
  'Organizational':    { prefix: 'ORG', id: 1, first: 4, last: 5, org: 2, email: 7, start: 14, approve: 24, sent: 25 },
  'Elected Officials': { prefix: 'ELU', id: 1, first: 2, last: 3, org: 0, email: 7, start: 14, approve: 24, sent: 25 }
};

var SOCIAL = [
  ['Instagram', 'https://www.instagram.com/matincc.ca/'],
  ['LinkedIn', 'https://www.linkedin.com/company/matin-intercultural-institute/'],
  ['YouTube', 'https://www.youtube.com/@matin.institute']
];

/** Installs the edit trigger. Sending email needs an installable trigger, not a simple onEdit. */
function setupAutoSend() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (fn === 'onApproveEdit' || fn === 'sendPendingWelcomes') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onApproveEdit').forSpreadsheet(REGISTRY_ID).onEdit().create();
  // Safety net: retries anything the edit trigger missed (e.g. members@ not ready yet).
  ScriptApp.newTrigger('sendPendingWelcomes').timeBased().everyHours(1).create();
}

function onApproveEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var cfg = TABS[sheet.getName()];
  if (!cfg) return;
  var r = e.range;
  if (r.getColumn() > cfg.approve || r.getLastColumn() < cfg.approve) return;
  for (var row = Math.max(r.getRow(), 2); row <= r.getLastRow(); row++) {
    if (sheet.getRange(row, cfg.approve).getValue() === true) processRow_(sheet, cfg, row);
  }
}

/** Retries every approved row that has no successful send yet (hourly, or run by hand). */
function sendPendingWelcomes() {
  var count = 0;
  var ss = SpreadsheetApp.openById(REGISTRY_ID);
  Object.keys(TABS).forEach(function (name) {
    var sheet = ss.getSheetByName(name);
    var cfg = TABS[name];
    var last = sheet.getLastRow();
    for (var row = 2; row <= last; row++) {
      if (sheet.getRange(row, cfg.approve).getValue() === true && processRow_(sheet, cfg, row)) count++;
    }
  });
  Logger.log(count + ' welcome email(s) sent.');
}

/** Returns true when an email was sent. */
function processRow_(sheet, cfg, row) {
  var lock = LockService.getScriptLock(); // no document lock in a standalone project
  lock.waitLock(20000);
  try {
    var sentCell = sheet.getRange(row, cfg.sent);
    var sentValue = sentCell.getValue();
    if (sentValue instanceof Date || (sentValue && String(sentValue).indexOf('Error') !== 0)) return false;

    var values = sheet.getRange(row, 1, 1, cfg.sent).getValues()[0];
    var email = String(values[cfg.email - 1] || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sentCell.setValue('Error: no valid email');
      return false;
    }

    var start = values[cfg.start - 1];
    if (!(start instanceof Date)) {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      sheet.getRange(row, cfg.start).setValue(start);
    }
    var end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate() - 1);

    var id = String(values[cfg.id - 1] || '').trim();
    if (!id) {
      id = nextId_(sheet, cfg);
      sheet.getRange(row, cfg.id).setValue(id);
    }

    if (GmailApp.getAliases().indexOf(FROM) === -1 && Session.getEffectiveUser().getEmail() !== FROM) {
      sentCell.setValue('Error: ' + FROM + ' not set up yet; retried automatically every hour');
      return false;
    }

    var tz = sheet.getParent().getSpreadsheetTimeZone();
    var member = {
      first: String(values[cfg.first - 1] || '').trim(),
      org: cfg.org ? String(values[cfg.org - 1] || '').trim() : '',
      id: id,
      start: Utilities.formatDate(start, tz, 'yyyy-MM-dd'),
      end: Utilities.formatDate(end, tz, 'yyyy-MM-dd')
    };
    var msg = welcomeMessage_(member);
    GmailApp.sendEmail(email, msg.subject, msg.text, {
      htmlBody: msg.html, from: FROM, name: SENDER_NAME, replyTo: FROM
    });
    sentCell.setValue(new Date()).setNumberFormat('yyyy-mm-dd hh:mm');
    return true;
  } catch (err) {
    sheet.getRange(row, cfg.sent).setValue('Error: ' + err.message);
    return false;
  } finally {
    lock.releaseLock();
  }
}

function nextId_(sheet, cfg) {
  var last = sheet.getLastRow();
  var max = 0;
  if (last >= 2) {
    sheet.getRange(2, cfg.id, last - 1, 1).getValues().forEach(function (r) {
      var m = String(r[0]).match(new RegExp('^' + cfg.prefix + '-(\\d+)$'));
      if (m) max = Math.max(max, Number(m[1]));
    });
  }
  return cfg.prefix + '-' + ('000' + (max + 1)).slice(-4);
}

function welcomeMessage_(m) {
  var hiFr = m.first ? 'Bonjour ' + m.first + ',' : 'Bonjour,';
  var hiEn = m.first ? 'Hello ' + m.first + ',' : 'Hello,';
  var whoFr = m.org ? "l'adhésion de " + m.org : 'votre adhésion';
  var whoEn = m.org ? m.org + "'s membership" : 'your membership';
  var socialText = SOCIAL.map(function (s) { return '- ' + s[0] + ' : ' + s[1]; }).join('\n');
  var socialHtml = SOCIAL.map(function (s) { return '<a href="' + s[1] + '">' + s[0] + '</a>'; }).join(' · ');

  var fr = [
    hiFr, '',
    'Nous avons le plaisir de vous confirmer que ' + whoFr + " à l'Institut interculturel Matin a été acceptée. Bienvenue parmi nous!", '',
    'Numéro de membre : ' + m.id,
    "Début de l'adhésion : " + m.start,
    "Fin de l'adhésion : " + m.end, '',
    "L'adhésion est valide pendant un an et pourra ensuite être renouvelée.", '',
    'Merci de votre confiance et de votre soutien. Pour suivre nos activités et nos nouvelles, rejoignez-nous sur les réseaux sociaux :',
    socialText, '',
    'Au plaisir de vous voir bientôt,',
    "L'équipe de l'Institut interculturel Matin",
    FROM + ' · https://matincc.ca'
  ].join('\n');

  var en = [
    hiEn, '',
    'We are pleased to confirm that ' + whoEn + ' in the Matin Intercultural Institute has been approved. Welcome aboard!', '',
    'Member number: ' + m.id,
    'Membership start: ' + m.start,
    'Membership end: ' + m.end, '',
    'The membership is valid for one year and can then be renewed.', '',
    'Thank you for your trust and support. To follow our activities and news, join us on social media:',
    socialText.replace(/ : /g, ': '), '',
    'We look forward to seeing you soon,',
    'The Matin Intercultural Institute team',
    FROM + ' · https://matincc.ca'
  ].join('\n');

  var text = fr + '\n\n———\n\n' + en;
  var html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#222;max-width:600px">' +
    toHtml_(fr).replace(toHtml_(socialText), socialHtml) +
    '<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">' +
    toHtml_(en).replace(toHtml_(socialText.replace(/ : /g, ': ')), socialHtml) +
    '</div>';
  return {
    subject: "Bienvenue à l'Institut interculturel Matin · Welcome to the Matin Intercultural Institute",
    text: text,
    html: html
  };
}

function toHtml_(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}
