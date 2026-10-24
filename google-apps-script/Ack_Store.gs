/**
 * DUPLICATE PREVENTION and LOGGING.
 * Script properties remember each Netlify submission id for 30 days:
 *   ack:<id>  {"s": status, "r": reference, "t": time}   status: sending | sent | failed | skipped
 *   ref:<reference>  <id>                                  (reference uniqueness)
 * "sending" is written BEFORE the email goes out, so even a crash can never cause a second
 * email for the same submission (at most once). The private log spreadsheet keeps one row
 * per decision, without names or messages, for LOG_RETENTION_DAYS.
 */

function ackGetRecord_(id) {
  const v = PropertiesService.getScriptProperties().getProperty('ack:' + id);
  return v ? JSON.parse(v) : null;
}

function ackSetRecord_(id, status, ref) {
  PropertiesService.getScriptProperties().setProperty('ack:' + id, JSON.stringify({ s: status, r: ref || '', t: Date.now() }));
}

/** A reference unique among the ids remembered; the same id always gets the same one. */
function ackUniqueReference_(id, createdAt) {
  const props = PropertiesService.getScriptProperties();
  for (let len = 6; len <= 12; len += 2) {
    const ref = ackReference_(id, createdAt, len);
    const owner = props.getProperty('ref:' + ref);
    if (!owner || owner === id) {
      props.setProperty('ref:' + ref, id);
      return ref;
    }
  }
  throw new Error('reference-clash');
}

let ACK_LOG_DISABLED_ = false; // set by the self-test

function ackLog_(row) {
  console.log('[ack] ' + row.status + ' ' + (row.reference || '-') + ' ' + row.form + ' ' + (row.detail || ''));
  if (ACK_LOG_DISABLED_) return;
  const id = ackProp_('ACK_LOG_SHEET_ID', '');
  if (!id) return;
  try {
    SpreadsheetApp.openById(id).getSheets()[0].appendRow([
      Utilities.formatDate(new Date(), ACK.TIME_ZONE, 'yyyy-MM-dd HH:mm:ss'),
      row.reference || '',
      row.id || '',
      row.form || '',
      row.lang || '',
      row.recipient || '',
      row.status,
      row.detail || '',
    ]);
  } catch (e) {
    console.error('[ack] log sheet unavailable: ' + e.message);
  }
}

/** Once a day: forgets old ids, old counters and old log rows. */
function ackPrune_(now) {
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(now), ACK.TIME_ZONE, 'yyyyMMdd');
  if (props.getProperty('ACK_LAST_PRUNE') === today) return;
  props.setProperty('ACK_LAST_PRUNE', today);
  const all = props.getProperties();
  const limit = now - ACK.DEDUPE_DAYS * 86400000;
  Object.keys(all).forEach((k) => {
    if (k.indexOf('ack:') === 0 && JSON.parse(all[k]).t < limit) props.deleteProperty(k);
    else if ((k.indexOf('cnt:') === 0 || k.indexOf('day:') === 0) && k.split(':')[1] < today) props.deleteProperty(k);
  });
  // ref:<reference> keys carry their date: MTN-yyyyMMdd-...
  const oldest = Utilities.formatDate(new Date(limit), ACK.TIME_ZONE, 'yyyyMMdd');
  Object.keys(all).forEach((k) => {
    if (k.indexOf('ref:MTN-') === 0 && k.substr(8, 8) < oldest) props.deleteProperty(k);
  });
  const sheetId = ackProp_('ACK_LOG_SHEET_ID', '');
  if (!sheetId || ACK_LOG_DISABLED_) return;
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const cutoff = Utilities.formatDate(new Date(now - ACK.LOG_RETENTION_DAYS * 86400000), ACK.TIME_ZONE, 'yyyy-MM-dd');
  const values = sheet.getDataRange().getValues();
  let old = 0;
  for (let i = 1; i < values.length && String(values[i][0]).slice(0, 10) < cutoff; i++) old++;
  if (old) sheet.deleteRows(2, old);
}
