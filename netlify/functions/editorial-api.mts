/**
 * /api/editorial/*: the private editorial dashboard's only door to the data.
 * Every route except the two sign-in steps checks the signed-in session on the server first; changing
 * routes also need the `x-editorial: 1` header (see _news/auth). Every action is logged.
 *
 * State machine (the only transitions that exist):
 *   approve  pending|hold     → approved   (then, if AI is on, final FR/EN/FA by the strong model)
 *   hold     pending          → hold
 *   resume   hold|rejected    → pending
 *   withdraw approved         → pending
 *   reject   pending|hold|approved → rejected (the link is never proposed again)
 *   publish  approved         → published  (separate route, one commit for all)
 */
import type { Config, Context } from '@netlify/functions';
import {
  aiConfigured,
  budgetLeft,
  DRAFT_MODEL,
  FINAL_MODEL,
  finalizeWithAI,
  readUsage,
} from './_news/ai';
import {
  appConfigured,
  canWrite,
  clearCookie,
  clearFlowCookie,
  finishSignIn,
  installationToken,
  sessionCookie,
  sessionOf,
  signOut,
  signOutEverywhere,
  startSignIn,
} from './_news/auth';
import { linkId } from './_news/feeds';
import { notifyConfigured, sendCandidatesEmail } from './_news/notify';
import { commitStories, newsYaml, publishBranch, readyToPublish, slugify } from './_news/publish';
import {
  audit,
  contextOf,
  getCandidate,
  internalSecret,
  markSeen,
  openStore,
  readAudit,
  readIndex,
  readRuns,
  readSettings,
  saveCandidate,
  writeSettings,
} from './_news/store';
import {
  emptyText,
  REGIONS,
  TOPICS,
  type Candidate,
  type Region,
  type State,
  type Text3,
  type Topic,
} from './_news/types';

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      ...headers,
    },
  });

const TRANSITIONS: Record<string, { from: State[]; to: State }> = {
  approve: { from: ['pending', 'hold'], to: 'approved' },
  hold: { from: ['pending'], to: 'hold' },
  resume: { from: ['hold', 'rejected'], to: 'pending' },
  withdraw: { from: ['approved'], to: 'pending' },
  reject: { from: ['pending', 'hold', 'approved'], to: 'rejected' },
};

const clean = (v: unknown, max: number) =>
  String(v ?? '')
    // eslint-disable-next-line no-control-regex -- removing control characters is the point
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max);
const text3 = (v: unknown, max: number, base: Text3): Text3 => {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return {
    fr: 'fr' in o ? clean(o.fr, max) : base.fr,
    en: 'en' in o ? clean(o.en, max) : base.en,
    fa: 'fa' in o ? clean(o.fa, max) : base.fa,
  };
};

export default async (req: Request, context: Context) => {
  const ctx = contextOf(context.deploy.context);
  const store = openStore(ctx);
  const route = new URL(req.url).pathname.replace(/^\/api\/editorial\/?/, '').replace(/\/$/, '');
  const dashboard = `${new URL(req.url).origin}/editorial/`;
  const body =
    req.method === 'POST' ? ((await req.json().catch(() => ({}))) as Record<string, unknown>) : {};

  /* ------------------------------------------------ sign-in with GitHub (no session yet) */
  const redirect = (location: string, cookies: string[]) => {
    const headers = new Headers({ location, 'cache-control': 'no-store' });
    for (const c of cookies) headers.append('set-cookie', c);
    return new Response(null, { status: 303, headers });
  };
  if (route === 'signin/start' && req.method === 'GET') {
    const result = await startSignIn(store, new URL(req.url).origin, context.ip);
    if ('error' in result) return redirect(`${dashboard}?signin=${result.error}`, []);
    return redirect(result.location, [result.cookie]);
  }
  if (route === 'signin/callback' && req.method === 'GET') {
    const result = await finishSignIn(store, req);
    if ('error' in result) {
      await audit(store, { by: 'unknown', action: 'sign-in-refused', detail: result.error });
      return redirect(`${dashboard}?signin=${result.error}`, [clearFlowCookie()]);
    }
    await audit(store, { by: result.login, action: 'sign-in' });
    return redirect(dashboard, [clearFlowCookie(), sessionCookie(result.id)]);
  }

  const session = await sessionOf(store, req);
  if (route === 'me' && !session)
    return json({ signedIn: false, context: ctx, signInReady: appConfigured() });
  if (!session) return json({ error: 'Please sign in.' }, 401);
  const by = session.login;

  switch (`${req.method} ${route}`) {
    case 'POST logout': {
      await signOut(store, req);
      await audit(store, { by, action: 'sign-out' });
      return json({ ok: true }, 200, { 'set-cookie': clearCookie() });
    }

    case 'POST logout-all': {
      const ended = await signOutEverywhere(store);
      await audit(store, { by, action: 'sign-out-everywhere', detail: `${ended} sessions ended` });
      return json({ ok: true }, 200, { 'set-cookie': clearCookie() });
    }

    case 'GET me': {
      const usage = await readUsage(store);
      return json({
        signedIn: true,
        login: by,
        context: ctx,
        publishBranch: publishBranch(ctx),
        settings: await readSettings(store),
        ai: {
          configured: aiConfigured(),
          draftModel: DRAFT_MODEL,
          finalModel: FINAL_MODEL,
          usageUsd: Number(usage.usd.toFixed(4)),
          calls: usage.calls,
          budgetLeftUsd: Number((await budgetLeft(store)).toFixed(4)),
        },
        email: { configured: notifyConfigured() },
      });
    }

    case 'GET candidates':
      return json({ items: Object.values(await readIndex(store)) });

    case 'GET candidate': {
      const found = await getCandidate(store, clean(new URL(req.url).searchParams.get('id'), 40));
      return found ? json({ ...found }) : json({ error: 'Not found' }, 404);
    }

    case 'POST action': {
      const action = clean(body.action, 20);
      const rule = TRANSITIONS[action];
      const found = await getCandidate(store, clean(body.id, 40));
      if (!rule || !found) return json({ error: 'Unknown action or story.' }, 400);
      const c = found.candidate;
      if (!rule.from.includes(c.state))
        return json({ error: `A story that is ${c.state} cannot be ${action}d.` }, 409);
      if (action === 'approve' && !(c.draft.title.fr || c.draft.title.en))
        return json({ error: 'Write a headline before approving.' }, 400);
      const before = c.state;
      c.state = rule.to;
      if (!(await saveCandidate(store, c, found.etag)))
        return json({ error: 'This story was changed meanwhile. Reload and try again.' }, 409);
      if (action === 'reject') await markSeen(store, c.id, 'rejected');
      await audit(store, { by, action, id: c.id, detail: `${before} → ${c.state}` });

      // After approval only: the strong model prepares the final FR/EN/FA versions.
      let ai = '';
      if (
        action === 'approve' &&
        aiConfigured() &&
        c.draft.by !== 'ai-final' &&
        c.draft.by !== 'editor'
      ) {
        try {
          const fresh = (await getCandidate(store, c.id))!;
          await finalizeWithAI(store, fresh.candidate);
          await saveCandidate(store, fresh.candidate, fresh.etag);
          await audit(store, { by: 'ai', action: 'final-versions', id: c.id, detail: FINAL_MODEL });
          ai = 'prepared';
        } catch (e) {
          ai = `not prepared: ${(e as Error).message}`;
        }
      }
      return json({ ok: true, state: c.state, ai });
    }

    case 'POST prepare': {
      // Asked by the editor on an approved story (for example after edits): FR/EN/FA again.
      const found = await getCandidate(store, clean(body.id, 40));
      if (!found) return json({ error: 'Not found' }, 404);
      if (found.candidate.state !== 'approved')
        return json({ error: 'Final versions are prepared only after approval.' }, 409);
      try {
        await finalizeWithAI(store, found.candidate);
      } catch (e) {
        return json({ error: (e as Error).message }, 400);
      }
      if (!(await saveCandidate(store, found.candidate, found.etag)))
        return json({ error: 'This story was changed meanwhile. Reload and try again.' }, 409);
      await audit(store, {
        by,
        action: 'final-versions',
        id: found.candidate.id,
        detail: FINAL_MODEL,
      });
      return json({ ok: true });
    }

    case 'POST edit': {
      const found = await getCandidate(store, clean(body.id, 40));
      if (!found) return json({ error: 'Not found' }, 404);
      const c = found.candidate;
      if (!['pending', 'hold', 'approved'].includes(c.state))
        return json({ error: `A ${c.state} story cannot be edited here.` }, 409);
      if (body.etag && body.etag !== found.etag)
        return json({ error: 'This story was changed meanwhile. Reload and try again.' }, 409);
      const d = (body.draft ?? {}) as Record<string, unknown>;
      c.draft = {
        ...c.draft,
        title: text3(d.title, 200, c.draft.title),
        summary: text3(d.summary, 1200, c.draft.summary),
        article: text3(d.article, 6000, c.draft.article),
        relevance: 'relevance' in d ? clean(d.relevance, 1000) : c.draft.relevance,
        notes: 'notes' in d ? clean(d.notes, 2000) : c.draft.notes,
        by: 'editor',
      };
      if (REGIONS.includes(body.region as Region)) c.region = body.region as Region;
      if (TOPICS.includes(body.topic as Topic)) c.topic = body.topic as Topic;
      if (!(await saveCandidate(store, c, found.etag)))
        return json({ error: 'This story was changed meanwhile. Reload and try again.' }, 409);
      await audit(store, { by, action: 'edit', id: c.id });
      return json({ ok: true });
    }

    case 'POST publish': {
      const index = await readIndex(store);
      const approved = Object.values(index).filter((s) => s.state === 'approved');
      if (!approved.length) return json({ error: 'No approved story to publish.' }, 400);
      const items = (await Promise.all(approved.map((s) => getCandidate(store, s.id)))).filter(
        (f): f is NonNullable<typeof f> => Boolean(f && f.candidate.state === 'approved'),
      );
      const problems = items
        .map((f) => [f.candidate, readyToPublish(f.candidate)] as const)
        .filter(([, p]) => p);
      if (problems.length)
        return json(
          {
            error: 'Some approved stories are not complete.',
            details: problems.map(([c, p]) => `${c.draft.title.en || c.original.title}: ${p}`),
          },
          400,
        );
      const today = new Date().toISOString().slice(0, 10);
      const files = items.map(({ candidate: c }) => ({
        path: `src/content/news/${c.original.published.slice(0, 7)}-${slugify(c.draft.title.en)}.yaml`,
        content: newsYaml(c, by, today),
      }));
      const branch = publishBranch(ctx);
      let result;
      try {
        // Checked again with GitHub right before writing: the editor must still have access.
        const token = await installationToken();
        if (!(await canWrite(by, token))) {
          await audit(store, { by, action: 'publish-refused', detail: 'no write access' });
          return json(
            { error: 'Your GitHub account no longer has access. Nothing was changed.' },
            403,
          );
        }
        result = await commitStories(
          token,
          branch,
          files,
          `News: publish ${files.length} approved cultural news ${files.length === 1 ? 'story' : 'stories'}\n\nApproved and published by ${by} in the editorial dashboard.`,
        );
      } catch (e) {
        await audit(store, { by, action: 'publish-failed', detail: (e as Error).message });
        return json(
          { error: `Publishing failed: ${(e as Error).message}. Nothing was changed.` },
          502,
        );
      }
      for (const [i, f] of items.entries()) {
        const c = f.candidate;
        c.state = 'published';
        c.publishedAs = {
          path: result.paths[i]!,
          commit: result.sha,
          branch,
          at: new Date().toISOString(),
        };
        await saveCandidate(store, c);
        await audit(store, {
          by,
          action: 'publish',
          id: c.id,
          detail: `${branch} ${result.sha.slice(0, 7)} ${result.paths[i]}`,
        });
      }
      return json({ ok: true, branch, commit: result.sha, files: result.paths });
    }

    case 'POST run': {
      const res = await fetch(
        `${new URL(req.url).origin}/.netlify/functions/news-discover-background`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-news-secret': await internalSecret(store),
          },
          body: JSON.stringify({ trigger: 'manual', dashboard }),
        },
      );
      await audit(store, { by, action: 'run-discovery', detail: `HTTP ${res.status}` });
      return res.ok
        ? json({
            ok: true,
            message: 'Discovery started. Results appear here within a few minutes.',
          })
        : json({ error: `Could not start discovery (HTTP ${res.status}).` }, 502);
    }

    case 'GET runs':
      return json({ runs: await readRuns(store) });

    case 'GET audit':
      return json({ entries: (await readAudit(store)).slice(0, 200) });

    case 'POST settings': {
      const settings = {
        ...(await readSettings(store)),
        dailyDiscovery: body.dailyDiscovery === true,
      };
      await writeSettings(store, settings);
      await audit(store, {
        by,
        action: 'settings',
        detail: `daily discovery ${settings.dailyDiscovery ? 'on' : 'off'}`,
      });
      return json({ ok: true, settings });
    }

    case 'POST test-email': {
      if (!notifyConfigured()) return json({ error: 'Email is not configured yet.' }, 400);
      try {
        await sendCandidatesEmail([], dashboard, true);
      } catch (e) {
        return json({ error: `Sending failed: ${(e as Error).message}` }, 502);
      }
      await audit(store, { by, action: 'test-email' });
      return json({ ok: true });
    }

    case 'POST import': {
      // Adds stories found by hand (for example the 25 Oct 2026 shortlist) as Pending.
      const list = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
      const added: string[] = [];
      for (const raw of list as Record<string, unknown>[]) {
        const url = clean(raw.url, 1000);
        const published = clean(raw.published, 30);
        if (!/^https:\/\/\S+$/.test(url) || Number.isNaN(Date.parse(published))) continue;
        const id = await linkId(url);
        if ((await readIndex(store))[id]) continue;
        const region = REGIONS.includes(raw.region as Region)
          ? (raw.region as Region)
          : 'international';
        const c: Candidate = {
          id,
          state: 'pending',
          region,
          topic: TOPICS.includes(raw.topic as Topic) ? (raw.topic as Topic) : 'policy',
          source: { name: clean(raw.sourceName, 200), url, feed: 'manual', kind: 'institution' },
          original: {
            title: clean(raw.originalTitle, 300),
            description: clean(raw.originalDescription, 1200),
            published: new Date(published).toISOString(),
            language: clean(raw.language, 5) || 'en',
          },
          discoveredAt: new Date().toISOString(),
          runId: 'import',
          score: 0,
          reasons: ['added by hand'],
          draft: {
            title: text3(raw.title, 200, emptyText()),
            summary: text3(raw.summary, 1200, emptyText()),
            article: emptyText(),
            relevance: clean(raw.relevance, 1000),
            notes: clean(raw.notes, 2000),
            by: 'editor',
          },
          updatedAt: '',
        };
        if (await saveCandidate(store, c, 'new')) {
          await markSeen(store, id, 'proposed');
          added.push(id);
        }
      }
      await audit(store, { by, action: 'import', detail: `${added.length} added` });
      return json({ ok: true, added: added.length });
    }
  }
  return json({ error: 'Not found' }, 404);
};

export const config: Config = {
  path: ['/api/editorial/*'],
};
