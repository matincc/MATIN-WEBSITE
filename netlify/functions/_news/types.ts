/**
 * Cultural news assistant: the shapes stored in the private editorial store (Netlify Blobs).
 * Nothing here is ever written to the public repository until Matin approves and publishes.
 */

export type Lang = 'fr' | 'en' | 'fa';
export type Text3 = { fr: string; en: string; fa: string };

/** The four Cultural News tabs of the public site (src/lib/taxonomy.ts culturalNewsRegions). */
export const REGIONS = ['montreal', 'quebec', 'canada', 'international'] as const;
export type Region = (typeof REGIONS)[number];

/** Matin's editorial themes (owner's brief, Oct 25 2026). */
export const TOPICS = [
  'policy',
  'dialogue',
  'participation',
  'arts-heritage',
  'community',
  'research',
  'inclusion',
  'cooperation',
] as const;
export type Topic = (typeof TOPICS)[number];

/**
 * The publication state machine. Only a signed-in editor action moves a story forward:
 *   pending ⇄ hold, pending|hold → rejected, pending|hold → approved,
 *   approved → pending (withdrawn), approved → published (Publish button only).
 * Discovery can only create `pending` items.
 */
export const STATES = ['pending', 'hold', 'approved', 'published', 'rejected'] as const;
export type State = (typeof STATES)[number];

export type SourceKind = 'official' | 'institution' | 'newsroom';

export type Draft = {
  title: Text3;
  summary: Text3;
  /** Why the story matters to Matin (internal, never published). */
  relevance: string;
  /** Optional longer text for the story's page; the summary is used when empty. */
  article: Text3;
  /** Verification and confidence notes (internal). */
  notes: string;
  /** Who wrote the current text: the publisher's own feed text, the AI, or the editor. */
  by: 'source' | 'ai-draft' | 'ai-final' | 'editor';
  /** AI model and time, when the AI wrote it. */
  model?: string;
  preparedAt?: string;
};

export type Candidate = {
  id: string;
  state: State;
  region: Region;
  topic: Topic;
  source: { name: string; url: string; feed: string; kind: SourceKind };
  /** What the publisher itself says (feed title and description), kept apart from Matin's text. */
  original: { title: string; description: string; published: string; language: string };
  discoveredAt: string;
  runId: string;
  score: number;
  reasons: string[];
  draft: Draft;
  updatedAt: string;
  /** Set once the story is in the repository. */
  publishedAs?: { path: string; commit: string; branch: string; at: string };
};

/** The light record kept in the index, enough to draw the dashboard lists. */
export type Summary = Pick<
  Candidate,
  'id' | 'state' | 'region' | 'topic' | 'score' | 'discoveredAt' | 'updatedAt'
> & {
  title: string;
  sourceName: string;
  url: string;
  published: string;
};

export type FeedResult = {
  id: string;
  ok: boolean;
  items: number;
  error?: string;
};

export type RunReport = {
  id: string;
  trigger: 'schedule' | 'manual';
  startedAt: string;
  finishedAt?: string;
  status: 'running' | 'done' | 'failed';
  feeds: FeedResult[];
  considered: number;
  skipped: { old: number; seen: number; excluded: number; lowScore: number; duplicate: number };
  proposed: string[];
  ai: { drafted: number; failed: number; inputTokens: number; outputTokens: number };
  notified?: 'sent' | 'not-configured' | 'nothing-new' | 'failed';
  error?: string;
};

export type AuditEntry = {
  at: string;
  by: string;
  action: string;
  id?: string;
  detail?: string;
};

export const emptyText = (): Text3 => ({ fr: '', en: '', fa: '' });
