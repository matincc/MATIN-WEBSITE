/**
 * The private editorial store (Netlify Blobs). Candidates, their states, the list of links
 * already proposed or rejected, run reports, the audit log and the settings live here, never
 * in the public repository.
 *
 * Netlify Blobs site stores are shared by every deploy (production and Deploy Previews), so
 * test data and real data are kept apart: production uses `editorial-production`, every
 * other context (Deploy Previews, branch deploys, local dev) uses `editorial-preview`.
 */
import { getStore, type Store } from '@netlify/blobs';
import type { AuditEntry, Candidate, RunReport, Summary } from './types';

export type EditorialContext = 'production' | 'preview';

export const contextOf = (deployContext: string | undefined): EditorialContext =>
  deployContext === 'production' ? 'production' : 'preview';

export const openStore = (ctx: EditorialContext): Store =>
  getStore({ name: `editorial-${ctx}`, consistency: 'strong' });

const now = () => new Date().toISOString();

/** Read-modify-write with the blob's ETag, retried when another writer got there first. */
async function mutateJSON<T>(store: Store, key: string, empty: T, change: (v: T) => T | void) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const found = await store.getWithMetadata(key, { type: 'json' });
    const value = (found?.data as T | undefined) ?? structuredClone(empty);
    const next = change(value) ?? value;
    const res = !found
      ? await store.setJSON(key, next, { onlyIfNew: true })
      : found.etag
        ? await store.setJSON(key, next, { onlyIfMatch: found.etag })
        : await store.setJSON(key, next);
    if (res.modified) return next;
    await new Promise((r) => setTimeout(r, 80 * (attempt + 1)));
  }
  throw new Error(`Could not update ${key}: too many concurrent writes`);
}

/* ---------------------------------------------------------------- candidates */

const toSummary = (c: Candidate): Summary => ({
  id: c.id,
  state: c.state,
  region: c.region,
  topic: c.topic,
  score: c.score,
  discoveredAt: c.discoveredAt,
  updatedAt: c.updatedAt,
  title: c.draft.title.en || c.draft.title.fr || c.original.title,
  sourceName: c.source.name,
  url: c.source.url,
  published: c.original.published,
});

export async function getCandidate(store: Store, id: string) {
  const found = await store.getWithMetadata(`c/${id}`, { type: 'json' });
  return found ? { candidate: found.data as Candidate, etag: found.etag } : undefined;
}

/**
 * Saves a candidate and its index line. With `etag`, the write only succeeds when nobody
 * changed the candidate since it was read (returns false otherwise).
 */
export async function saveCandidate(store: Store, c: Candidate, etag?: string | 'new') {
  c.updatedAt = now();
  const res =
    etag === 'new'
      ? await store.setJSON(`c/${c.id}`, c, { onlyIfNew: true })
      : etag
        ? await store.setJSON(`c/${c.id}`, c, { onlyIfMatch: etag })
        : await store.setJSON(`c/${c.id}`, c);
  if (!res.modified) return false;
  await mutateJSON<Record<string, Summary>>(store, 'index', {}, (index) => {
    index[c.id] = toSummary(c);
  });
  return true;
}

export async function readIndex(store: Store) {
  return ((await store.get('index', { type: 'json' })) as Record<string, Summary> | null) ?? {};
}

/* ---------------------------------------------------------------- seen links */

/** A link proposed once (whatever happened next, rejection included) is never proposed again. */
export const isSeen = async (store: Store, id: string) =>
  (await store.getMetadata(`seen/${id}`)) !== null;

export const markSeen = (store: Store, id: string, why: string) =>
  store.set(`seen/${id}`, why, { metadata: { at: now() } });

/* ---------------------------------------------------------------- audit log */

export async function audit(store: Store, entry: Omit<AuditEntry, 'at'>) {
  const month = now().slice(0, 7);
  await mutateJSON<AuditEntry[]>(store, `audit/${month}`, [], (log) => {
    log.push({ at: now(), ...entry });
  });
}

export async function readAudit(store: Store, months = 2) {
  const out: AuditEntry[] = [];
  const d = new Date();
  for (let i = 0; i < months; i++) {
    const key = `audit/${new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1)).toISOString().slice(0, 7)}`;
    out.push(...(((await store.get(key, { type: 'json' })) as AuditEntry[] | null) ?? []));
  }
  return out.sort((a, b) => b.at.localeCompare(a.at));
}

/* ---------------------------------------------------------------- run reports */

export async function saveRun(store: Store, run: RunReport) {
  await store.setJSON(`runs/${run.id}`, run);
  await mutateJSON<string[]>(store, 'runs-index', [], (ids) => {
    const next = [run.id, ...ids.filter((x) => x !== run.id)].slice(0, 30);
    return next;
  });
}

export async function readRuns(store: Store, count = 10) {
  const ids = (((await store.get('runs-index', { type: 'json' })) as string[] | null) ?? []).slice(
    0,
    count,
  );
  const runs = await Promise.all(ids.map((id) => store.get(`runs/${id}`, { type: 'json' })));
  return runs.filter(Boolean) as RunReport[];
}

/* ---------------------------------------------------------------- settings and secret */

export type Settings = {
  /** The daily schedule runs discovery only when Matin has switched it on. Off by default. */
  dailyDiscovery: boolean;
};

export const readSettings = async (store: Store): Promise<Settings> => ({
  dailyDiscovery: false,
  ...(((await store.get('settings', { type: 'json' })) as Partial<Settings> | null) ?? {}),
});

export const writeSettings = (store: Store, s: Settings) => store.setJSON('settings', s);

/**
 * A random secret created on first use and kept only in the private store. It lets the
 * scheduled and dashboard functions start the background discovery job; a request without
 * it is ignored. No environment variable or manual setup is needed.
 */
export async function internalSecret(store: Store) {
  const existing = await store.get('internal/secret', { type: 'text' });
  if (existing) return existing;
  const fresh = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url');
  await store.set('internal/secret', fresh, { onlyIfNew: true });
  return (await store.get('internal/secret', { type: 'text' })) ?? fresh;
}
