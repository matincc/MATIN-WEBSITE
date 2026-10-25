/**
 * Optional AI help (Matin's choice on Oct 25 2026: option A).
 *   - Daily drafts: Claude Haiku 5.5 writes an English and French headline, a short summary,
 *     why it matters to Matin, and verification notes, from the publisher's own feed text.
 *   - After Matin approves the substance: Claude Sonnet 5.5 prepares the final French,
 *     English and Persian versions, on his request from the dashboard.
 *
 * It stays off until ANTHROPIC_API_KEY is set in Netlify. Cost controls: a monthly budget in
 * this code (NEWS_AI_MONTHLY_BUDGET_USD, default 5) on top of the spending limit Matin sets
 * in the Anthropic Console; at most 10 drafts a day; short outputs; usage is recorded.
 * AI text is always marked as an unreviewed draft, and nothing it writes is published
 * without Matin's approval.
 */
import Anthropic from '@anthropic-ai/sdk';
import { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
import type { Store } from '@netlify/blobs';
import { REGIONS, TOPICS, type Candidate } from './types';

export const DRAFT_MODEL = process.env.NEWS_AI_DRAFT_MODEL || 'claude-haiku-5-5';
export const FINAL_MODEL = process.env.NEWS_AI_FINAL_MODEL || 'claude-sonnet-5-5';

/** US$ per million tokens (Anthropic price list, checked Oct 25 2026; prompts under 100k). */
const PRICES: Record<string, { input: number; output: number }> = {
  'claude-haiku-5-5': { input: 0.1, output: 0.5 },
  'claude-sonnet-5-5': { input: 2, output: 10 },
};
const budget = () => Number(process.env.NEWS_AI_MONTHLY_BUDGET_USD || 5);

export const aiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

type Usage = { input: number; output: number; usd: number; calls: number };
const usageKey = () => `usage/${new Date().toISOString().slice(0, 7)}`;

export async function readUsage(store: Store): Promise<Usage> {
  return (
    ((await store.get(usageKey(), { type: 'json' })) as Usage | null) ?? {
      input: 0,
      output: 0,
      usd: 0,
      calls: 0,
    }
  );
}

async function record(store: Store, model: string, input: number, output: number) {
  const p = PRICES[model] ?? { input: 2, output: 10 };
  const u = await readUsage(store);
  u.input += input;
  u.output += output;
  u.usd += (input * p.input + output * p.output) / 1e6;
  u.calls += 1;
  await store.setJSON(usageKey(), u);
}

export async function budgetLeft(store: Store) {
  return budget() - (await readUsage(store)).usd;
}

const RULES = `You prepare news proposals for Matin Intercultural Institute, a non-profit in Montréal working on culture, intercultural dialogue, cultural participation, cultural planning and policy, arts and heritage, community cultural development, research, diversity and inclusion, and international cultural cooperation.

Strict rules:
- Use ONLY facts stated in the publisher's text given to you. Never add facts, names, quotes, numbers, dates or places that are not in it. If something important is not stated, say "not stated by the source" in the notes.
- Never copy sentences from the source; write a short, neutral, factual summary in your own words.
- Never suggest that Matin is involved in, endorses or is linked to the story.
- Never use the words course, class, training, teaching, school (EN) or cours, formation, enseignement, école (FR) to describe Matin.
- Canadian English and Québec French. Keep official names of organizations as written.`;

const DRAFT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'title_en',
    'title_fr',
    'summary_en',
    'summary_fr',
    'relevance',
    'topic',
    'region',
    'notes',
    'confidence',
  ],
  properties: {
    title_en: { type: 'string', description: 'Headline in English, at most 90 characters' },
    title_fr: { type: 'string', description: 'Titre en français du Québec, 90 caractères au plus' },
    summary_en: { type: 'string', description: '1 to 3 sentences, facts from the source only' },
    summary_fr: { type: 'string', description: '1 à 3 phrases, faits de la source seulement' },
    relevance: {
      type: 'string',
      description: 'One or two sentences in English: why this matters to Matin',
    },
    topic: { type: 'string', enum: [...TOPICS] },
    region: {
      type: 'string',
      enum: [...REGIONS],
      description: 'montreal, quebec (outside Montréal), canada (outside Québec) or international',
    },
    notes: {
      type: 'string',
      description:
        'Verification notes in English: what the source states, what is missing, anything uncertain',
    },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
} as const;

const FINAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title_fr', 'title_en', 'title_fa', 'summary_fr', 'summary_en', 'summary_fa', 'notes'],
  properties: {
    title_fr: { type: 'string' },
    title_en: { type: 'string' },
    title_fa: { type: 'string' },
    summary_fr: { type: 'string' },
    summary_en: { type: 'string' },
    summary_fa: { type: 'string' },
    notes: {
      type: 'string',
      description: 'Anything the editor should check, in English; empty if nothing',
    },
  },
} as const;

const sourceBlock = (c: Candidate) =>
  [
    `Publisher: ${c.source.name} (${c.source.kind})`,
    `Link: ${c.source.url}`,
    `Publication date: ${c.original.published.slice(0, 10)}`,
    `Publisher's headline: ${c.original.title}`,
    `Publisher's description: ${c.original.description || '(none)'}`,
  ].join('\n');

const client = () => new Anthropic({ maxRetries: 2, timeout: 60_000 });

/** Daily draft by the low-cost model. Returns false when skipped (budget, refusal, error). */
export async function draftWithAI(store: Store, c: Candidate) {
  if (!aiConfigured() || (await budgetLeft(store)) <= 0.05) return false;
  const res = await client().messages.parse({
    model: DRAFT_MODEL,
    max_tokens: 3000,
    output_config: { effort: 'low', format: jsonSchemaOutputFormat(DRAFT_SCHEMA) },
    system: RULES,
    messages: [
      {
        role: 'user',
        content: `Prepare an editorial proposal from this publisher's text. The region suggested by the feed is "${c.region}".\n\n${sourceBlock(c)}`,
      },
    ],
  });
  await record(store, DRAFT_MODEL, res.usage.input_tokens, res.usage.output_tokens);
  const out = res.parsed_output;
  if (res.stop_reason === 'refusal' || !out) return false;
  c.draft = {
    ...c.draft,
    title: { ...c.draft.title, en: out.title_en, fr: out.title_fr },
    summary: { ...c.draft.summary, en: out.summary_en, fr: out.summary_fr },
    relevance: out.relevance,
    notes: `[AI confidence: ${out.confidence}] ${out.notes}`,
    by: 'ai-draft',
    model: DRAFT_MODEL,
    preparedAt: new Date().toISOString(),
  };
  c.topic = out.topic;
  c.region = out.region;
  return { input: res.usage.input_tokens, output: res.usage.output_tokens };
}

/**
 * Final French, English and Persian versions by the stronger model, from the editor's current
 * text. Asked for from the dashboard only; the result still needs Matin's approval.
 */
export async function finalizeWithAI(store: Store, c: Candidate) {
  if (!aiConfigured()) throw new Error('AI is not configured (no API key).');
  if ((await budgetLeft(store)) <= 0.1) throw new Error('This month’s AI budget is used up.');
  const current = [
    `Editor's headline (EN): ${c.draft.title.en}`,
    `Editor's headline (FR): ${c.draft.title.fr}`,
    `Editor's summary (EN): ${c.draft.summary.en}`,
    `Editor's summary (FR): ${c.draft.summary.fr}`,
  ].join('\n');
  const res = await client().messages.parse({
    model: FINAL_MODEL,
    max_tokens: 6000,
    output_config: { effort: 'medium', format: jsonSchemaOutputFormat(FINAL_SCHEMA) },
    system: `${RULES}
- Persian: natural, professional Persian for a cultural institution; write Matin's name as «مؤسسه میان‌فرهنگی متین»; keep organization names in their official form, with a Persian rendering in parentheses when helpful; use Persian digits only where natural.
- The three versions must say exactly the same thing: same facts, same dates, same source.`,
    messages: [
      {
        role: 'user',
        content: `Write the final French, English and Persian headline and summary for publication. Keep the editor's meaning and choices; correct only language, clarity and consistency with the publisher's text.\n\n${current}\n\nPublisher's text, the only factual basis:\n${sourceBlock(c)}`,
      },
    ],
  });
  await record(store, FINAL_MODEL, res.usage.input_tokens, res.usage.output_tokens);
  const out = res.parsed_output;
  if (res.stop_reason === 'refusal' || !out)
    throw new Error('The AI did not return a usable answer.');
  c.draft = {
    ...c.draft,
    title: { fr: out.title_fr, en: out.title_en, fa: out.title_fa },
    summary: { fr: out.summary_fr, en: out.summary_en, fa: out.summary_fa },
    notes: out.notes ? `${c.draft.notes}\n[Final check] ${out.notes}` : c.draft.notes,
    by: 'ai-final',
    model: FINAL_MODEL,
    preparedAt: new Date().toISOString(),
  };
}
