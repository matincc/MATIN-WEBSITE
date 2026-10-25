/**
 * Editor sign-in for the private dashboard.
 *
 * Matin signs in with the GitHub access token he already uses for /admin. The server asks
 * GitHub who owns the token and whether it can reach the website repository; only the
 * accounts in NEWS_EDITORS (default: matincc) are accepted. The server then keeps the token
 * in the private store (it is needed to publish) and gives the browser a random session id
 * in an HttpOnly, Secure, SameSite=Strict cookie. The token never goes back to the browser.
 */
import type { Store } from '@netlify/blobs';

export const REPO = 'matincc/MATIN-WEBSITE';
const COOKIE = '__Host-matin-editorial';
const SESSION_HOURS = 8;
const MAX_FAILURES = 5;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

export type Session = { login: string; token: string; created: string; expires: string };

const editors = () =>
  (process.env.NEWS_EDITORS || 'matincc')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Buffer.from(digest).toString('hex');
}

const cookieOf = (req: Request) =>
  (req.headers.get('cookie') ?? '')
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);

export const sessionCookie = (id: string) =>
  `${COOKIE}=${id}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`;
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export const githubHeaders = (token: string) => ({
  authorization: `Bearer ${token}`,
  accept: 'application/vnd.github+json',
  'x-github-api-version': '2022-11-28',
  'user-agent': 'matincc-editorial',
});

/** Too many wrong tokens from one address in 15 minutes → refused for a while. */
async function tooManyFailures(store: Store, ip: string, failed: boolean) {
  const key = `rl/${await sha256(ip)}`;
  const rec = ((await store.get(key, { type: 'json' })) as { n: number; since: number } | null) ?? {
    n: 0,
    since: Date.now(),
  };
  if (Date.now() - rec.since > FAILURE_WINDOW_MS) Object.assign(rec, { n: 0, since: Date.now() });
  if (failed) {
    rec.n += 1;
    await store.setJSON(key, rec);
  }
  return rec.n >= MAX_FAILURES;
}

export async function signIn(store: Store, token: string, ip: string) {
  if (await tooManyFailures(store, ip, false))
    return { error: 'Too many attempts. Please wait 15 minutes.', status: 429 } as const;
  const fail = async (error: string) => {
    await tooManyFailures(store, ip, true);
    return { error, status: 403 } as const;
  };
  if (!/^[\w-]{20,255}$/.test(token)) return fail('This does not look like a GitHub token.');

  const user = await fetch('https://api.github.com/user', { headers: githubHeaders(token) });
  if (!user.ok) return fail('GitHub did not accept this token.');
  const login = String(((await user.json()) as { login?: string }).login ?? '');
  if (!editors().includes(login.toLowerCase()))
    return fail('This GitHub account is not an editor of the Matin website.');
  const repo = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: githubHeaders(token),
  });
  if (!repo.ok) return fail('This token cannot reach the website repository.');

  const id = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
  const created = new Date();
  const session: Session = {
    login,
    token,
    created: created.toISOString(),
    expires: new Date(created.getTime() + SESSION_HOURS * 3600 * 1000).toISOString(),
  };
  await store.setJSON(`s/${await sha256(id)}`, session);
  return { id, session } as const;
}

/**
 * The session of a request, or undefined. Changing requests must also carry the
 * `x-editorial: 1` header (a cross-site page cannot add it without a CORS preflight, which
 * this API never grants) and, when the browser sends one, an Origin of this same site.
 */
export async function sessionOf(store: Store, req: Request) {
  const id = cookieOf(req);
  if (!id) return undefined;
  if (req.method !== 'GET') {
    if (req.headers.get('x-editorial') !== '1') return undefined;
    const origin = req.headers.get('origin');
    if (origin && origin !== new URL(req.url).origin) return undefined;
  }
  const key = `s/${await sha256(id)}`;
  const session = (await store.get(key, { type: 'json' })) as Session | null;
  if (!session) return undefined;
  if (Date.parse(session.expires) < Date.now()) {
    await store.delete(key);
    return undefined;
  }
  return { ...session, key };
}

export async function signOut(store: Store, req: Request) {
  const id = cookieOf(req);
  if (id) await store.delete(`s/${await sha256(id)}`);
}
