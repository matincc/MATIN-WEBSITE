/**
 * Publication: approved stories become News files (src/content/news/*.yaml) in ONE commit,
 * made with the signed-in editor's own GitHub token. On matincc.ca the commit goes to `main`
 * and Netlify rebuilds the site once. On a Deploy Preview it goes to a separate test branch,
 * never to `main`, so testing can never publish anything.
 */
import { githubHeaders, REPO } from './auth';
import type { EditorialContext } from './store';
import type { Candidate } from './types';

export const publishBranch = (ctx: EditorialContext) =>
  ctx === 'production' ? 'main' : process.env.NEWS_TEST_BRANCH || 'test/news-publish-preview';

export function slugify(s: string) {
  const full = s
    .normalize('NFD')
    .replace(/\p{M}+/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  // At most 70 characters, cut between words.
  const short = full.length > 70 ? full.slice(0, 71).replace(/-[^-]*$/, '') : full;
  return short || 'news';
}

/** A JSON string is a valid YAML double-quoted scalar: no quoting surprises. */
const q = (s: string) => JSON.stringify(s);

/** What Publish checks before writing anything. */
export function readyToPublish(c: Candidate) {
  const d = c.draft;
  const missing = [
    !d.title.fr && 'French headline',
    !d.title.en && 'English headline',
    !d.summary.fr && 'French summary',
    !d.summary.en && 'English summary',
  ].filter(Boolean);
  return missing.length ? `Missing: ${missing.join(', ')}` : '';
}

export function newsYaml(c: Candidate, editor: string, today: string) {
  const d = c.draft;
  const body = (lang: 'fr' | 'en' | 'fa') => d.article[lang] || d.summary[lang];
  const lines = [
    `# Cultural News, approved by ${editor} in the editorial dashboard on ${today}`,
    `# (candidate ${c.id}, discovered ${c.discoveredAt.slice(0, 10)}). Summary in Matin's words;`,
    '# the original article is at the source link.',
    `date: ${c.original.published.slice(0, 10)}`,
    'category: recommends',
    `region: ${c.region}`,
    'source:',
    `  name: ${q(c.source.name)}`,
    `  url: ${q(c.source.url)}`,
    'author:',
    "  fr: 'Institut interculturel Matin'",
    "  en: 'Matin Intercultural Institute'",
    "  fa: 'مؤسسه میان‌فرهنگی متین'",
    'urlSlug:',
    `  fr: ${slugify(d.title.fr)}`,
    `  en: ${slugify(d.title.en)}`,
    'title:',
    `  fr: ${q(d.title.fr)}`,
    `  en: ${q(d.title.en)}`,
    ...(d.title.fa ? [`  fa: ${q(d.title.fa)}`] : []),
    'excerpt:',
    `  fr: ${q(d.summary.fr)}`,
    `  en: ${q(d.summary.en)}`,
    ...(d.summary.fa ? [`  fa: ${q(d.summary.fa)}`] : []),
    'body:',
    `  fr: ${q(body('fr'))}`,
    `  en: ${q(body('en'))}`,
    ...(body('fa') ? [`  fa: ${q(body('fa'))}`] : []),
    `tags: [${c.topic}]`,
    // Persian is shown, but marked for Matin's later language review.
    'faReviewed: false',
    '',
  ];
  return lines.join('\n');
}

async function gh<T>(token: string, path: string, init?: { method?: string; body?: unknown }) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method: init?.method ?? 'GET',
    headers: { ...githubHeaders(token), 'content-type': 'application/json' },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`GitHub ${init?.method ?? 'GET'} ${path}: HTTP ${res.status}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

async function headOf(token: string, branch: string) {
  try {
    return (await gh<{ object: { sha: string } }>(token, `/git/ref/heads/${branch}`)).object.sha;
  } catch (e) {
    if ((e as { status?: number }).status !== 404 || branch === 'main') throw e;
    // The preview test branch is created from main the first time.
    const main = (await gh<{ object: { sha: string } }>(token, '/git/ref/heads/main')).object.sha;
    await gh(token, '/git/refs', {
      method: 'POST',
      body: { ref: `refs/heads/${branch}`, sha: main },
    });
    return main;
  }
}

export async function commitStories(
  token: string,
  branch: string,
  files: { path: string; content: string }[],
  message: string,
) {
  const parent = await headOf(token, branch);
  const base = await gh<{ tree: { sha: string } }>(token, `/git/commits/${parent}`);
  const existing = new Set(
    (
      await gh<{ tree: { path: string }[] }>(
        token,
        `/git/trees/${base.tree.sha}:src/content/news`,
      ).catch(() => ({ tree: [] }))
    ).tree.map((t) => `src/content/news/${t.path}`),
  );
  const unique = files.map((f) =>
    existing.has(f.path)
      ? { ...f, path: f.path.replace(/\.yaml$/, `-${Date.now() % 100000}.yaml`) }
      : f,
  );
  const tree = await gh<{ sha: string }>(token, '/git/trees', {
    method: 'POST',
    body: {
      base_tree: base.tree.sha,
      tree: unique.map((f) => ({ path: f.path, mode: '100644', type: 'blob', content: f.content })),
    },
  });
  const commit = await gh<{ sha: string }>(token, '/git/commits', {
    method: 'POST',
    body: { message, tree: tree.sha, parents: [parent] },
  });
  await gh(token, `/git/refs/heads/${branch}`, { method: 'PATCH', body: { sha: commit.sha } });
  return { sha: commit.sha, paths: unique.map((f) => f.path) };
}
