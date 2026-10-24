/**
 * WEB APP ENTRY POINT. Called only by the website's Netlify function
 * (netlify/functions/_shared/acknowledge.ts) after Netlify has stored a verified
 * submission. Every request must be signed (Ack_Security.gs). The answer never echoes
 * the visitor's data: { ok, status, reference }.
 */
function doPost(e) {
  const result = ackHandle_(e && e.postData ? e.postData.contents : '', Date.now());
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function ackHandle_(body, now) {
  const secret = ackProp_('ACK_SECRET', '');
  if (!secret) return { ok: false, status: 'not-configured' };

  const req = ackVerifyRequest_(body, secret, now);
  if (req.error) {
    console.warn('[ack] refused: ' + req.error); // nothing else is recorded for unsigned requests
    return { ok: false, status: req.error };
  }
  const v = ackValidate_(req.payload, now);
  if (v.error) {
    ackLog_({ status: 'skipped', detail: v.error, form: '' });
    return { ok: false, status: v.error };
  }
  const s = v.submission;
  const mode = ackProp_('ACK_MODE', 'off');

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { ok: false, status: 'busy' };
  try {
    const previous = ackGetRecord_(s.id);
    if (previous) return { ok: true, status: 'duplicate', reference: previous.r };

    const ref = ackUniqueReference_(s.id, s.createdAt);
    const row = { reference: ref, id: s.id, form: s.form, lang: s.lang, recipient: ackMask_(s.email) };

    let reason = mode === 'off' ? 'mode-off' : '';
    if (!reason && mode === 'test') {
      const allow = ackProp_('ACK_TEST_ALLOWLIST', '').toLowerCase().split(',').map((x) => x.trim());
      if (allow.indexOf(s.email.toLowerCase()) < 0) reason = 'test-mode-not-allowlisted';
    }
    if (!reason) reason = ackCheckLimits_(s.email, secret, now);
    if (reason) {
      ackSetRecord_(s.id, 'skipped', ref);
      ackLog_(Object.assign(row, { status: 'skipped', detail: reason }));
      return { ok: true, status: 'skipped:' + reason, reference: ref };
    }

    ackSetRecord_(s.id, 'sending', ref); // before sending: at most one email per submission
    try {
      ackSend_(s.email, s.lang, ref);
    } catch (err) {
      ackSetRecord_(s.id, 'failed', ref);
      ackLog_(Object.assign(row, { status: 'failed', detail: String(err.message).slice(0, 120) }));
      return { ok: false, status: 'send-failed', reference: ref };
    }
    ackSetRecord_(s.id, 'sent', ref);
    ackCountSend_(s.email, secret, now);
    ackLog_(Object.assign(row, { status: 'sent', detail: mode }));
    try {
      ackPrune_(now);
    } catch (err) {
      console.error('[ack] prune: ' + err.message);
    }
    return { ok: true, status: 'sent', reference: ref };
  } finally {
    lock.releaseLock();
  }
}
