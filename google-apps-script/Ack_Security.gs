/** SECURITY: request signatures and reference numbers. */

function ackHex_(bytes) {
  return bytes.map((b) => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function ackHmacHex_(message, secret) {
  return ackHex_(Utilities.computeHmacSha256Signature(message, secret, Utilities.Charset.UTF_8));
}

/** Constant-time comparison of two hex strings. */
function ackSafeEqual_(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Checks the signature and age of a request body; returns the inner payload text or an error. */
function ackVerifyRequest_(body, secret, now) {
  if (!body || body.length > ACK.MAX_BODY_CHARS) return { error: 'bad-request' };
  let req;
  try {
    req = JSON.parse(body);
  } catch (e) {
    return { error: 'bad-request' };
  }
  const ts = String(req.ts || '');
  const payload = String(req.payload || '');
  if (!/^\d{13}$/.test(ts) || !payload) return { error: 'bad-request' };
  if (!ackSafeEqual_(ackHmacHex_(ts + '.' + payload, secret), String(req.sig || ''))) return { error: 'bad-signature' };
  if (Math.abs(now - Number(ts)) > ACK.MAX_REQUEST_AGE_MS) return { error: 'expired' };
  return { payload: payload };
}

const ACK_BASE32_ = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I

/**
 * Reference such as MTN-20261024-K7Q2XD: the submission date (Montréal) and a code
 * derived only from Netlify's submission id, so retries get the same reference and it
 * reveals nothing about the visitor. A clash with another id gets a longer code.
 */
function ackReference_(id, createdAt, length) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'matin-ref:' + id, Utilities.Charset.UTF_8);
  let code = '';
  for (let i = 0; i < (length || 6); i++) code += ACK_BASE32_[(digest[i] & 0xff) % 32];
  return 'MTN-' + Utilities.formatDate(new Date(createdAt), ACK.TIME_ZONE, 'yyyyMMdd') + '-' + code;
}
