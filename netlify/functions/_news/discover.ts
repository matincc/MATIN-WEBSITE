/**
 * One discovery run: read every configured feed, keep recent and relevant items, drop
 * duplicates and links already proposed or rejected, rank, keep at most 10, store them as
 * Pending, optionally ask the low-cost AI model for drafts, then send one notification.
 * A run never approves or publishes anything.
 */
import type { Store } from '@netlify/blobs';
import { aiConfigured, draftWithAI } from './ai';
import { cleanLink, fetchFeed, linkId, type FeedItem } from './feeds';
import { notifyConfigured, sendCandidatesEmail, sendFailureEmail } from './notify';
import { regionOf, sameStory, scoreItem, titleWords } from './score';
import { SOURCES, type Source } from './sources';
import { audit, isSeen, markSeen, readIndex, saveCandidate, saveRun } from './store';
import { emptyText, type Candidate, type RunReport } from './types';

export const MAX_PER_DAY = 10;
const MAX_PER_SOURCE = 3;
const MIN_SCORE = 45;
const MAX_AGE_DAYS = 21;

type Found = {
  item: FeedItem;
  source: Source;
  id: string;
  score: ReturnType<typeof scoreItem>;
  age: number;
};

export async function runDiscovery(
  store: Store,
  trigger: RunReport['trigger'],
  dashboard: string,
): Promise<RunReport> {
  const started = new Date();
  const run: RunReport = {
    id: started.toISOString().replace(/[:.]/g, '-'),
    trigger,
    startedAt: started.toISOString(),
    status: 'running',
    feeds: [],
    considered: 0,
    skipped: { old: 0, seen: 0, excluded: 0, lowScore: 0, duplicate: 0 },
    proposed: [],
    ai: { drafted: 0, failed: 0, inputTokens: 0, outputTokens: 0 },
  };
  await saveRun(store, run);

  try {
    // 1. Read all feeds at once; a feed that fails is reported, the others go on.
    const results = await Promise.allSettled(SOURCES.map((s) => fetchFeed(s.url)));
    const found: Found[] = [];
    for (const [i, r] of results.entries()) {
      const source = SOURCES[i]!;
      if (r.status === 'rejected') {
        run.feeds.push({
          id: source.id,
          ok: false,
          items: 0,
          error: String(r.reason?.message ?? r.reason).slice(0, 200),
        });
        continue;
      }
      run.feeds.push({ id: source.id, ok: true, items: r.value.length });
      for (const item of r.value) {
        run.considered++;
        // 2. Only dated, recent items (the source's own publication date).
        const age = (Date.now() - Date.parse(item.published)) / 864e5;
        if (!item.published || age > MAX_AGE_DAYS || age < -1) {
          run.skipped.old++;
          continue;
        }
        const score = scoreItem(item.title, item.description, source.kind, Math.max(0, age));
        if (score.excluded) {
          run.skipped.excluded++;
          continue;
        }
        if (score.score < MIN_SCORE) {
          run.skipped.lowScore++;
          continue;
        }
        found.push({ item, source, id: await linkId(item.link), score, age });
      }
    }

    // 3. Best first; skip links already proposed or rejected, and the same story twice.
    found.sort((a, b) => b.score.score - a.score.score);
    const index = await readIndex(store);
    const recentTitles = Object.values(index)
      .filter((s) => Date.now() - Date.parse(s.discoveredAt) < 45 * 864e5)
      .map((s) => titleWords(s.title));
    const picked: Found[] = [];
    const perSource = new Map<string, number>();
    for (const f of found) {
      if (picked.length >= MAX_PER_DAY) break;
      if (index[f.id] || picked.some((p) => p.id === f.id) || (await isSeen(store, f.id))) {
        run.skipped.seen++;
        continue;
      }
      const words = titleWords(f.item.title);
      if (
        recentTitles.some((t) => sameStory(t, words)) ||
        picked.some((p) => sameStory(titleWords(p.item.title), words))
      ) {
        run.skipped.duplicate++;
        continue;
      }
      if ((perSource.get(f.source.id) ?? 0) >= MAX_PER_SOURCE) continue;
      perSource.set(f.source.id, (perSource.get(f.source.id) ?? 0) + 1);
      picked.push(f);
    }

    // 4. Store as Pending, with the publisher's own text as the starting draft.
    const candidates: Candidate[] = [];
    for (const f of picked) {
      const lang = f.source.language === 'fr' ? 'fr' : 'en';
      const title = emptyText();
      const summary = emptyText();
      title[lang] = f.item.title;
      summary[lang] = f.item.description;
      const c: Candidate = {
        id: f.id,
        state: 'pending',
        region:
          f.source.region === 'auto'
            ? regionOf(f.item.title, f.item.description, f.source.fallback)
            : f.source.region,
        topic: f.score.topic,
        source: {
          name: f.source.name,
          url: cleanLink(f.item.link),
          feed: f.source.id,
          kind: f.source.kind,
        },
        original: {
          title: f.item.title,
          description: f.item.description,
          published: f.item.published,
          language: f.source.language,
        },
        discoveredAt: new Date().toISOString(),
        runId: run.id,
        score: f.score.score,
        reasons: f.score.reasons,
        draft: {
          title,
          summary,
          relevance: '',
          article: emptyText(),
          notes: 'Text from the publisher’s feed; not yet rewritten.',
          by: 'source',
        },
        updatedAt: '',
      };
      if (await saveCandidate(store, c, 'new')) {
        await markSeen(store, c.id, 'proposed');
        candidates.push(c);
        run.proposed.push(c.id);
      }
    }
    await audit(store, {
      by: 'system',
      action: 'discovery',
      detail: `${trigger}: ${candidates.length} new candidates`,
    });

    // 5. Optional AI drafts (low-cost model), a few at a time.
    if (aiConfigured()) {
      for (let i = 0; i < candidates.length; i += 3) {
        await Promise.all(
          candidates.slice(i, i + 3).map(async (c) => {
            try {
              const used = await draftWithAI(store, c);
              if (!used) return void run.ai.failed++;
              run.ai.drafted++;
              run.ai.inputTokens += used.input;
              run.ai.outputTokens += used.output;
              await saveCandidate(store, c);
            } catch (e) {
              run.ai.failed++;
              console.error('AI draft failed', c.id, e);
            }
          }),
        );
      }
    }

    // 6. One notification per run, only when there is something new.
    if (!candidates.length) run.notified = 'nothing-new';
    else if (!notifyConfigured()) run.notified = 'not-configured';
    else {
      try {
        const latest = await readIndex(store);
        await sendCandidatesEmail(candidates.map((c) => latest[c.id]!).filter(Boolean), dashboard);
        run.notified = 'sent';
      } catch (e) {
        run.notified = 'failed';
        console.error('Notification failed', e);
      }
    }
    run.status = 'done';
  } catch (e) {
    run.status = 'failed';
    run.error = String((e as Error)?.message ?? e).slice(0, 500);
    if (notifyConfigured()) await sendFailureEmail(run.error, dashboard).catch(() => undefined);
  }
  run.finishedAt = new Date().toISOString();
  await saveRun(store, run);
  return run;
}
