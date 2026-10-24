/**
 * SETUP AND CHECKS, run by hand from the editor (function menu > Run).
 * None of them publishes the web app or creates a trigger.
 */

/** 1. Creates the secret and the private log sheet; mode stays "off". Safe to run again. */
function ackSetup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ACK_SECRET')) {
    const raw = [1, 2, 3].map(() => Utilities.getUuid()).join('') + Date.now();
    props.setProperty('ACK_SECRET', ackHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw)) +
      Utilities.getUuid().replace(/-/g, ''));
  }
  if (!props.getProperty('ACK_MODE')) props.setProperty('ACK_MODE', 'off');
  if (!props.getProperty('ACK_SENDER')) props.setProperty('ACK_SENDER', 'forms');
  if (!props.getProperty('ACK_SIMULATE_FAILURE')) props.setProperty('ACK_SIMULATE_FAILURE', 'off');
  if (!props.getProperty('ACK_LOG_SHEET_ID')) {
    const ss = SpreadsheetApp.create('Matin — acknowledgements log (private)');
    const sh = ss.getSheets()[0];
    sh.appendRow(['Logged at (Montréal)', 'Reference', 'Netlify submission id', 'Form', 'Language', 'Recipient (masked)', 'Status', 'Detail']);
    sh.setFrozenRows(1);
    props.setProperty('ACK_LOG_SHEET_ID', ss.getId());
  }
  console.log('Mode: ' + props.getProperty('ACK_MODE') + ' | Sender: ' + props.getProperty('ACK_SENDER'));
  console.log('Log sheet: https://docs.google.com/spreadsheets/d/' + props.getProperty('ACK_LOG_SHEET_ID'));
  ackReportQuota();
}

/** 2. Shows the secret ONCE, to paste into Netlify as ACK_SHARED_SECRET. Never send it to anyone. */
function ackShowSecretForNetlify() {
  console.log(ackProp_('ACK_SECRET', '(run ackSetup first)'));
}

/** Replaces the secret (then update ACK_SHARED_SECRET in Netlify). */
function ackRotateSecret() {
  PropertiesService.getScriptProperties().deleteProperty('ACK_SECRET');
  ackSetup();
  console.log('New secret created: copy it to Netlify with ackShowSecretForNetlify.');
}

function ackReportQuota() {
  console.log('Remaining daily email quota (Google): ' + MailApp.getRemainingDailyQuota() +
    ' | our daily cap: ' + ACK.DAILY_CAP + ' | reserve kept: ' + ACK.QUOTA_RESERVE);
}

/** Sends the three approved emails to the FIRST address of ACK_TEST_ALLOWLIST only. */
function ackSendPreviewToMe() {
  const to = ackProp_('ACK_TEST_ALLOWLIST', '').split(',')[0].trim();
  if (!to) throw new Error('Set ACK_TEST_ALLOWLIST first (your own address).');
  ACK.LANGS.forEach((lang) => ackSend_(to, lang, 'MTN-TEST-' + lang.toUpperCase()));
  console.log('3 previews sent to ' + to);
}

/**
 * Checks the logic without sending any email and without writing the log sheet:
 * signature, expiry, validation, language, duplicates, rate limit, test mode and a
 * simulated failure. Prints PASS or FAIL for each case.
 */
function ackSelfTest() {
  const props = PropertiesService.getScriptProperties();
  const saved = props.getProperties();
  const secret = 'selftest-secret';
  const now = Date.now();
  ACK_FAKE_SENDS_ = [];
  ACK_LOG_DISABLED_ = true;
  const results = [];
  const check = (name, cond) => results.push((cond ? 'PASS ' : 'FAIL ') + name);
  const signed = (obj, ts) => {
    const payload = JSON.stringify(obj);
    const t = String(ts || now);
    return JSON.stringify({ ts: t, payload: payload, sig: ackHmacHex_(t + '.' + payload, secret) });
  };
  const sub = (id, extra) =>
    Object.assign({ id: id, form: 'contact', lang: 'fr', email: 'test@example.org', created_at: new Date(now).toISOString() }, extra || {});
  try {
    props.setProperties({ ACK_SECRET: secret, ACK_MODE: 'test', ACK_TEST_ALLOWLIST: 'test@example.org,org@example.org,fa@example.org,vol@example.org,fail@example.org', ACK_SIMULATE_FAILURE: 'off' });
    let r = ackHandle_(signed(sub('selftest-fr-1')), now);
    check('French individual is sent', r.status === 'sent' && ACK_FAKE_SENDS_.length === 1 && ACK_FAKE_SENDS_[0].lang === 'fr');
    check('Reference format', /^MTN-\d{8}-[A-Z2-9]{6}$/.test(r.reference));
    const firstRef = r.reference;
    r = ackHandle_(signed(sub('selftest-fr-1')), now);
    check('Duplicate event: no second email, same reference', r.status === 'duplicate' && r.reference === firstRef && ACK_FAKE_SENDS_.length === 1);
    r = ackHandle_(signed(sub('selftest-en-1', { lang: 'en', email: 'org@example.org' })), now);
    check('English organization is sent in English', r.status === 'sent' && ACK_FAKE_SENDS_[1].lang === 'en');
    r = ackHandle_(signed(sub('selftest-fa-1', { lang: 'fa', email: 'fa@example.org' })), now);
    check('Persian is sent in Persian (RTL)', r.status === 'sent' && ackBuildMessage_('fa', 'X').html.indexOf('dir="rtl"') > 0);
    r = ackHandle_(signed(sub('selftest-vol-1', { form: 'benevolat', email: 'vol@example.org', lang: 'en' })), now);
    check('Volunteer form is sent', r.status === 'sent');
    r = ackHandle_(signed(sub('selftest-news-1', { form: 'newsletter' })), now);
    check('Newsletter is never acknowledged', r.status === 'form-not-acknowledged');
    r = ackHandle_(JSON.stringify({ ts: String(now), payload: JSON.stringify(sub('selftest-x')), sig: '00'.repeat(32) }), now);
    check('Unsigned or forged request refused', r.status === 'bad-signature');
    r = ackHandle_(signed(sub('selftest-old'), now - 10 * 60000), now);
    check('Request older than 5 minutes refused', r.status === 'expired');
    r = ackHandle_(signed(sub('selftest-bad', { email: 'not an email' })), now);
    check('Invalid email refused', r.status === 'invalid-email');
    r = ackHandle_(signed(sub('selftest-multi', { email: 'a@example.org,b@example.org' })), now);
    check('Several recipients refused', r.status === 'invalid-email');
    r = ackHandle_(signed(sub('selftest-stale', { created_at: new Date(now - 3 * 86400000).toISOString() })), now);
    check('Old submission (over 48 h) refused', r.status === 'stale-submission');
    r = ackHandle_(signed(sub('selftest-fr-2')), now);
    check('Same address within 10 minutes: no email', r.status === 'skipped:rate-limited-10min');
    r = ackHandle_(signed(sub('selftest-outsider', { email: 'stranger@example.org' })), now);
    check('Test mode: other addresses never receive email', r.status === 'skipped:test-mode-not-allowlisted');
    props.setProperty('ACK_SIMULATE_FAILURE', 'on');
    r = ackHandle_(signed(sub('selftest-fail', { email: 'fail@example.org' })), now);
    check('Simulated sending failure is recorded', r.status === 'send-failed');
    r = ackHandle_(signed(sub('selftest-fail', { email: 'fail@example.org' })), now);
    check('A failed submission is never emailed twice', r.status === 'duplicate');
    check('Language fallback to French', ackLanguage_('xx') === 'fr');
    check('Texts contain the reference', ackBuildMessage_('en', 'MTN-1').text.indexOf('Reference: MTN-1') >= 0);
  } catch (err) {
    results.push('FAIL unexpected error: ' + err.message);
  } finally {
    // Restore the real properties exactly as they were.
    props.deleteAllProperties();
    props.setProperties(saved);
    ACK_FAKE_SENDS_ = null;
    ACK_LOG_DISABLED_ = false;
  }
  console.log(results.join('\n'));
  return results;
}
