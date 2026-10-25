/**
 * Editor sign-in for the private dashboard: "Sign in with GitHub" through Matin's own
 * GitHub App, which is installed on MATIN-WEBSITE only.
 *
 *   GITHUB_APP_CLIENT_ID      the App's client ID (not secret)
 *   GITHUB_APP_CLIENT_SECRET  the App's client secret (secret, Netlify only)
 *   GITHUB_APP_PRIVATE_KEY    the App's private key, .pem text (secret, Netlify only)
 *   NEWS_EDITORS              optional, accepted GitHub accounts (default: matincc)
 *
 * 1. /signin/start sends the editor to github.com with a one-time `state` and a PKCE
 *    challenge (both kept on the server, the state also in a short HttpOnly cookie).
 * 2. GitHub sends the editor back to /signin/callback. The server checks the state, trades
 *    the code for a user token, asks GitHub who the editor is and whether they can write to
 *    the repository, then revokes that user token at once. No GitHub token is ever kept,
 *    sent to the browser or logged.
 * 3. The browser only gets a random session id in an HttpOnly, Secure, SameSite=Strict
 *    cookie. Sessions end after 8 hours, or 60 minutes without use, or on sign-out.
 * 4. Publishing uses a one-hour token of the App itself, limited to writing content in
 *    MATIN-WEBSITE (see installationToken). Every 15 minutes, and before every publication,
 *    the server checks again with GitHub that the editor still has write access.
 *
 * Revoking access: remove the account from NEWS_EDITORS or from the repository, use "Sign
 * out all sessions", or uninstall the App on GitHub (then nothing can be published at all).
 */
import { createHash, createPrivateKey, sign } from 'node:crypto';
import type { Store } from '@netlify/blobs';

export const REPO = 'matincc/MATIN-WEBSITE';
const REPO_NAME = REPO.split('/')[1]!;
const COOKIE = '__Host-matin-editorial';
const FLOW_COOKIE = '__Host-matin-signin';
const SESSION_HOURS = 8;
const IDLE_MS = 60 * 60 * 1000;
const RECHECK_MS = 15 * 60 * 1000;
const FLOW_MS = 10 * 60 * 1000;
const MAX_STARTS = 10;
const START_WINDOW_MS = 15 * 60 * 1000;
export const CALLBACK_PATH = '/api/editorial/signin/callback';

export type Session = {
  login: string;
  created: string;
  expires: string;
  seen: string;
  verified: string;
};

export const appConfigured = () =>
  Boolean(
    process.env.GITHUB_APP_CLIENT_ID &&
    process.env.GITHUB_APP_CLIENT_SECRET &&
    process.env.GITHUB_APP_PRIVATE_KEY,
  );

const editors = () =>
  (process.env.NEWS_EDITORS || 'matincc')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
const isEditor = (login: string) => editors().includes(login.toLowerCase());

const b64url = (b: Buffer | string) => Buffer.from(b).toString('base64url');
const randomId = (bytes = 32) => b64url(Buffer.from(crypto.getRandomValues(new Uint8Array(bytes))));
const sha256 = (text: string) => createHash('sha256').update(text).digest('hex');

const cookieOf = (req: Request, name: string) =>
  (req.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);

export const sessionCookie = (id: string) =>
  `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
// Lax, because GitHub's redirect back to the callback is a top-level navigation from github.com.
const flowCookie = (state: string) =>
  `${FLOW_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${FLOW_MS / 1000}`;
export const clearFlowCookie = () =>
  `${FLOW_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

export const githubHeaders = (token: string) => ({
  authorization: `Bearer ${token}`,
  accept: 'application/vnd.github+json',
  'x-github-api-version': '2022-11-28',
  'user-agent': 'matincc-editorial',
});

/* ------------------------------------------------------------ the App's own token */

/** The private key as pasted in Netlify: real line breaks, "\n" escapes or base64. */
function privateKey() {
  let pem = (process.env.GITHUB_APP_PRIVATE_KEY ?? '').trim().replace(/\\n/g, '\n');
  if (!pem.includes('BEGIN')) pem = Buffer.from(pem, 'base64').toString('utf8');
  return createPrivateKey(pem);
}

function appJwt() {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const body = b64url(
    JSON.stringify({ iat: now - 60, exp: now + 540, iss: process.env.GITHUB_APP_CLIENT_ID }),
  );
  const signature = sign('RSA-SHA256', Buffer.from(`${head}.${body}`), privateKey());
  return `${head}.${body}.${b64url(signature)}`;
}

/**
 * A one-hour token of the App, narrowed to MATIN-WEBSITE and to the two permissions the
 * dashboard needs (write content, read metadata), whatever else the App could be given.
 */
export async function installationToken() {
  const headers = githubHeaders(appJwt());
  const inst = await fetch(`https://api.github.com/repos/${REPO}/installation`, { headers });
  if (!inst.ok) throw new Error('The Matin GitHub App is not installed on MATIN-WEBSITE.');
  const { id } = (await inst.json()) as { id: number };
  const res = await fetch(`https://api.github.com/app/installations/${id}/access_tokens`, {
    method: 'POST',
    headers: { ...headers, 'content-type': 'application/json' },
    body: JSON.stringify({
      repositories: [REPO_NAME],
      permissions: { contents: 'write', metadata: 'read' },
    }),
  });
  if (!res.ok) throw new Error(`GitHub refused the App token (HTTP ${res.status}).`);
  return ((await res.json()) as { token: string }).token;
}

/** Whether a GitHub account can still write to the repository, asked with the App's token. */
export async function canWrite(login: string, appToken?: string) {
  if (!isEditor(login)) return false;
  const token = appToken ?? (await installationToken());
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/collaborators/${encodeURIComponent(login)}/permission`,
    { headers: githubHeaders(token) },
  );
  if (!res.ok) return false;
  const { permission } = (await res.json()) as { permission?: string };
  return permission === 'admin' || permission === 'write' || permission === 'maintain';
}

/* ------------------------------------------------------------ sign-in */

/** At most 10 sign-in starts per address in 15 minutes. */
async function tooManyStarts(store: Store, ip: string) {
  const key = `rl/${sha256(ip)}`;
  const rec = ((await store.get(key, { type: 'json' })) as { n: number; since: number } | null) ?? {
    n: 0,
    since: Date.now(),
  };
  if (Date.now() - rec.since > START_WINDOW_MS) Object.assign(rec, { n: 0, since: Date.now() });
  rec.n += 1;
  await store.setJSON(key, rec);
  return rec.n > MAX_STARTS;
}

export async function startSignIn(store: Store, origin: string, ip: string) {
  if (!appConfigured()) return { error: 'not-configured' } as const;
  if (await tooManyStarts(store, ip)) return { error: 'too-many' } as const;
  const state = randomId();
  const verifier = randomId(48);
  const challenge = b64url(createHash('sha256').update(verifier).digest());
  await store.setJSON(`flow/${sha256(state)}`, {
    verifier,
    expires: new Date(Date.now() + FLOW_MS).toISOString(),
  });
  const url = new URL('https://github.com/login/oauth/authorize');
  url.search = new URLSearchParams({
    client_id: process.env.GITHUB_APP_CLIENT_ID!,
    redirect_uri: origin + CALLBACK_PATH,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    allow_signup: 'false',
  }).toString();
  return { location: url.toString(), cookie: flowCookie(state) } as const;
}

type SignInError =
  'not-configured' | 'denied' | 'expired' | 'not-editor' | 'no-access' | 'not-installed' | 'failed';

/** Revokes a user token at once: it was only needed to learn who signed in. */
async function revoke(userToken: string) {
  const basic = Buffer.from(
    `${process.env.GITHUB_APP_CLIENT_ID}:${process.env.GITHUB_APP_CLIENT_SECRET}`,
  ).toString('base64');
  await fetch(`https://api.github.com/applications/${process.env.GITHUB_APP_CLIENT_ID}/token`, {
    method: 'DELETE',
    headers: {
      authorization: `Basic ${basic}`,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      'user-agent': 'matincc-editorial',
    },
    body: JSON.stringify({ access_token: userToken }),
  }).catch(() => undefined);
}

export async function finishSignIn(
  store: Store,
  req: Request,
): Promise<{ error: SignInError } | { id: string; login: string }> {
  if (!appConfigured()) return { error: 'not-configured' };
  const url = new URL(req.url);
  const state = url.searchParams.get('state') ?? '';
  const cookieState = cookieOf(req, FLOW_COOKIE) ?? '';
  if (url.searchParams.get('error')) return { error: 'denied' };
  if (!state || state !== cookieState) return { error: 'expired' };
  const flowKey = `flow/${sha256(state)}`;
  const flow = (await store.get(flowKey, { type: 'json' })) as {
    verifier: string;
    expires: string;
  } | null;
  await store.delete(flowKey); // one use only
  if (!flow || Date.parse(flow.expires) < Date.now()) return { error: 'expired' };

  const exchange = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_APP_CLIENT_ID,
      client_secret: process.env.GITHUB_APP_CLIENT_SECRET,
      code: url.searchParams.get('code') ?? '',
      redirect_uri: url.origin + CALLBACK_PATH,
      code_verifier: flow.verifier,
    }),
  }).catch(() => undefined);
  const userToken = exchange?.ok
    ? ((await exchange.json()) as { access_token?: string }).access_token
    : undefined;
  if (!userToken) return { error: 'failed' };

  let login: string;
  try {
    const user = await fetch('https://api.github.com/user', { headers: githubHeaders(userToken) });
    if (!user.ok) return { error: 'failed' };
    login = String(((await user.json()) as { login?: string }).login ?? '');
  } finally {
    await revoke(userToken);
  }
  if (!isEditor(login)) return { error: 'not-editor' };
  let appToken: string;
  try {
    appToken = await installationToken();
  } catch {
    return { error: 'not-installed' };
  }
  if (!(await canWrite(login, appToken))) return { error: 'no-access' };

  await pruneSessions(store);
  const id = randomId();
  const now = new Date();
  const session: Session = {
    login,
    created: now.toISOString(),
    expires: new Date(now.getTime() + SESSION_HOURS * 3600 * 1000).toISOString(),
    seen: now.toISOString(),
    verified: now.toISOString(),
  };
  await store.setJSON(`s/${sha256(id)}`, session);
  return { id, login };
}

/* ------------------------------------------------------------ sessions */

const expired = (s: Session, now = Date.now()) =>
  Date.parse(s.expires) < now || now - Date.parse(s.seen) > IDLE_MS;

/** Deletes ended sessions and abandoned sign-in attempts. */
async function pruneSessions(store: Store) {
  const now = Date.now();
  for (const prefix of ['s/', 'flow/']) {
    const { blobs } = await store.list({ prefix });
    for (const { key } of blobs) {
      const rec = (await store.get(key, { type: 'json' })) as
        (Partial<Session> & { expires?: string }) | null;
      const done =
        !rec ||
        (prefix === 's/' ? expired(rec as Session, now) : Date.parse(rec.expires ?? '') < now);
      if (done) await store.delete(key);
    }
  }
}

/**
 * The session of a request, or undefined. Changing requests must also carry the
 * `x-editorial: 1` header (a cross-site page cannot add it without a CORS preflight, which
 * this API never grants) and, when the browser sends one, an Origin of this same site.
 */
export async function sessionOf(store: Store, req: Request) {
  const id = cookieOf(req, COOKIE);
  if (!id) return undefined;
  if (req.method !== 'GET') {
    if (req.headers.get('x-editorial') !== '1') return undefined;
    const origin = req.headers.get('origin');
    if (origin && origin !== new URL(req.url).origin) return undefined;
  }
  const key = `s/${sha256(id)}`;
  const session = (await store.get(key, { type: 'json' })) as Session | null;
  if (!session) return undefined;
  const now = Date.now();
  if (expired(session, now) || !isEditor(session.login)) {
    await store.delete(key);
    return undefined;
  }
  let changed = false;
  if (now - Date.parse(session.verified) > RECHECK_MS) {
    // Access removed on GitHub ends the session within 15 minutes.
    if (!(await canWrite(session.login).catch(() => false))) {
      await store.delete(key);
      return undefined;
    }
    session.verified = new Date(now).toISOString();
    changed = true;
  }
  if (now - Date.parse(session.seen) > 5 * 60 * 1000) {
    session.seen = new Date(now).toISOString();
    changed = true;
  }
  if (changed) await store.setJSON(key, session);
  return { ...session, key };
}

export async function signOut(store: Store, req: Request) {
  const id = cookieOf(req, COOKIE);
  if (id) await store.delete(`s/${sha256(id)}`);
}

/** Ends every session, on every device. */
export async function signOutEverywhere(store: Store) {
  const { blobs } = await store.list({ prefix: 's/' });
  for (const { key } of blobs) await store.delete(key);
  return blobs.length;
}
