/** SUBMISSION VALIDATION and LANGUAGE SELECTION. */

const ACK_EMAIL_ = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

function ackLanguage_(value) {
  return ACK.LANGS.indexOf(value) >= 0 ? value : ACK.DEFAULT_LANG;
}

/** Returns { submission } or { error }. Only four fields are ever read. */
function ackValidate_(payloadText, now) {
  let p;
  try {
    p = JSON.parse(payloadText);
  } catch (e) {
    return { error: 'bad-payload' };
  }
  const id = String(p.id || '');
  const form = String(p.form || '');
  const email = String(p.email || '').trim();
  const created = Date.parse(String(p.created_at || ''));
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) return { error: 'bad-id' };
  if (ACK.FORMS.indexOf(form) < 0) return { error: 'form-not-acknowledged' };
  if (email.length > 254 || !ACK_EMAIL_.test(email)) return { error: 'invalid-email' };
  if (isNaN(created) || now - created > ACK.MAX_SUBMISSION_AGE_MS || created - now > ACK.MAX_REQUEST_AGE_MS) {
    return { error: 'stale-submission' };
  }
  return { submission: { id: id, form: form, email: email, lang: ackLanguage_(p.lang), createdAt: created } };
}
