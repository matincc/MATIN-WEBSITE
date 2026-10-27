/**
 * Matin – website form entries → Google Sheet (owner's request, Oct 27 2026).
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
    return reply('ok');
  } catch (err) {
    console.error(err);
    return reply('error');
  } finally {
    lock.releaseLock();
  }
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
