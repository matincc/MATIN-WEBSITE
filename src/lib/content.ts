import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import type { Lang } from '@/i18n/routes';
import { typo } from './frenchTypo';
import { montrealTime } from './dates';
import type { NewsRegion } from '@/lib/taxonomy';
import { baseLang, href, type UiLang } from '@/i18n/routes';
import { pick } from '@/i18n/ui';

/** URL slug of an entry in a given language (falls back to the file name). */
export function slugOf(
  entry: { id: string; data: { urlSlug?: { fr: string; en: string } } },
  lang: Lang,
) {
  return entry.data.urlSlug?.[lang] ?? entry.id;
}

/** Markdown from the CMS → HTML, with Québec typography applied to French. */
export function renderMarkdown(source: string, lang: UiLang): string {
  return marked.parse(typo(source, lang), { async: false, gfm: true, breaks: false });
}

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing src/content/settings/site.yaml');
  return entry.data;
}

export type EventEntry = CollectionEntry<'events'> & { startDate: Date; endDate: Date };

/** Venue name of an event in the page's language. */
export const placeName = (e: EventEntry, lang: UiLang) => {
  const n = e.data.location?.name;
  return typeof n === 'string' ? n : n ? (pick(n, lang) ?? n.en) : undefined;
};

/** City of an event in the page's language. */
export const cityOf = (e: EventEntry, lang: UiLang) =>
  typeof e.data.city === 'string' ? e.data.city : pick(e.data.city, lang)!;

/** Matin's own and co-organized events have a page on this site; selected events link out. */
export const isMatinEvent = (e: EventEntry) => e.data.kind !== 'selected';

/**
 * Every agenda entry with real Date objects; an event without an end lasts 2 h by default.
 * Drafts are only included on the local preview (npm run dev).
 */
export async function getAgendaEvents(): Promise<EventEntry[]> {
  const events = await getCollection('events', (e) => import.meta.env.DEV || !e.data.draft);
  return events.map((e) => {
    const startDate = montrealTime(e.data.start, e.data.timeZone);
    const endDate = e.data.end
      ? montrealTime(e.data.end, e.data.timeZone)
      : new Date(startDate.getTime() + 2 * 3600_000);
    return Object.assign(e, { startDate, endDate });
  });
}

/** Matin's own and co-organized events: the ones with a detail page, .ics file and archive. */
export async function getEvents(): Promise<EventEntry[]> {
  return (await getAgendaEvents()).filter(isMatinEvent);
}

/**
 * Upcoming agenda (all kinds) = not yet ended at build time. The site rebuilds daily
 * (scheduled function) and a small client script hides anything that ends between builds.
 */
export async function getUpcomingEvents(limit?: number, now = new Date()) {
  const list = (await getAgendaEvents())
    .filter((e) => e.endDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return limit ? list.slice(0, limit) : list;
}

/** Past Matin events only: external events are never presented as Matin's history. */
export async function getPastEvents(now = new Date()) {
  return (await getEvents())
    .filter((e) => e.endDate < now)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

/** The Matin's Picks tab of an event: Montréal, Canada (the rest of Québec included) or
 *  around the world. */
export const pickRegionOf = (e: EventEntry): NewsRegion =>
  e.data.region === 'montreal'
    ? 'montreal'
    : e.data.region === 'international'
      ? 'international'
      : 'canada';

/** "Matin's Picks": upcoming events featured until a date that has not passed, at most 3
 *  per region tab. */
export function picksOf(upcoming: EventEntry[], now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const count: Partial<Record<NewsRegion, number>> = {};
  return upcoming.filter((e) => {
    if (e.data.status === 'cancelled' || !e.data.featuredUntil || e.data.featuredUntil < today)
      return false;
    const r = pickRegionOf(e);
    count[r] = (count[r] ?? 0) + 1;
    return count[r] <= 3;
  });
}

export async function getPrograms() {
  return (await getCollection('programs')).sort((a, b) => a.data.order - b.data.order);
}

/** Published articles, newest first (drafts only on the local preview). */
export async function getNews(limit?: number) {
  const list = (
    await getCollection('news', (p) => !p.data.archived && (import.meta.env.DEV || !p.data.draft))
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return limit ? list.slice(0, limit) : list;
}

/**
 * Notes from the President, newest first. Layout examples (`sample: true`) appear on local
 * and Netlify deploy previews only, never in a production build.
 */
export async function getNotes(limit?: number) {
  const live = process.env.CONTEXT === 'production';
  const list = (
    await getCollection('notes', (n) => !n.data.archived && !(live && n.data.sample))
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return limit ? list.slice(0, limit) : list;
}

/** An article has a Persian page once its Persian text is written and reviewed. */
export const hasPersian = (post: CollectionEntry<'news'>) =>
  post.data.faReviewed && !!post.data.body.fa;

/** Link to an article in the page's language. */
export function articleHref(post: CollectionEntry<'news'>, lang: UiLang): string {
  return href('news', lang, slugOf(post, baseLang(lang)));
}

/**
 * Entries shown on a page in this language. Every language shows the same approved
 * entries (owner's brief, Oct 25 2026: Persian mirrors English); a Persian page shows
 * the English text of an entry that has no Persian text yet. `faReviewed` only records
 * that the Persian text has been reviewed.
 */
export function forLang<T extends { data: { faReviewed?: boolean } }>(
  items: T[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept so callers stay language-aware
  _lang: UiLang,
): T[] {
  return items;
}

/** Published team members in display order (drafts only on the local preview). */
export async function getTeam() {
  return (await getCollection('team', (m) => import.meta.env.DEV || !m.data.draft)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** The President's profile page: built once approved, or on the local preview. */
export async function presidentProfileVisible() {
  const about = await getSingleton('about');
  return import.meta.env.DEV || about.president.profilePublished;
}

export async function getSingleton<C extends 'about' | 'involvement'>(collection: C) {
  const [entry] = await getCollection(collection);
  if (!entry) throw new Error(`Missing content in src/content/${collection}/`);
  return entry.data as CollectionEntry<C>['data'];
}

export async function getDocuments() {
  return (await getCollection('documents')).sort(
    (a, b) => a.data.order - b.data.order || b.data.year - a.data.year,
  );
}

/**
 * Published gallery albums: consent confirmed, not a draft (drafts only on the local
 * preview), with at least one photo or playable video; by `order`, then the most recent.
 */
export async function getAlbums() {
  const albums = await getCollection(
    'gallery',
    (a) => import.meta.env.DEV || (a.data.consent && !a.data.draft),
  );
  return albums
    .map((a) => {
      a.data.videos = a.data.videos.filter((v) => v.youtube || v.file);
      return a;
    })
    .filter((a) => a.data.photos.length + a.data.videos.length > 0)
    .sort((a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime());
}

export async function getFaq() {
  return (await getCollection('faq')).sort((a, b) => a.data.order - b.data.order);
}

/** Published directory entries (unpublished ones only on the local preview), by `order`. */
export async function getResources() {
  return (await getCollection('resources', (r) => import.meta.env.DEV || r.data.published)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** International Cultural Networks, published only (drafts on the local preview). */
export async function getNetworks() {
  return (await getCollection('networks', (r) => import.meta.env.DEV || r.data.published)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** Cultural Policy & Strategic Documents, newest first within the given order. */
export async function getPolicies() {
  return (await getCollection('policies', (r) => import.meta.env.DEV || r.data.published)).sort(
    (a, b) => a.data.order - b.data.order || b.data.year - a.data.year,
  );
}

/** Name of a directory entry: its English form on English pages when there is one. */
export const orgName = (r: CollectionEntry<'resources'>, lang: UiLang) =>
  (baseLang(lang) === 'en' && r.data.nameEn) || r.data.name;

/** Matin's introductory video, once its YouTube link or file has been added. */
export async function getIntroVideo() {
  const entry = await getEntry('introVideo', 'matin-is-born');
  return entry && (entry.data.youtube || entry.data.file) ? entry.data : undefined;
}

export async function getLegal(id: 'privacy' | 'terms' | 'accessibility') {
  const entry = await getEntry('legal', id);
  if (!entry) throw new Error(`Missing src/content/legal/${id}.yaml`);
  return entry.data;
}

/** Initials for avatar placeholders when a team member has no photo. */
export const initials = (name: string) =>
  name
    .replace(/\[[^\]]*\]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'M';

/** Pages that are linked only once they have content (the FAQ). */
export async function emptySections(): Promise<Set<'faq'>> {
  const faq = await getCollection('faq');
  return new Set(faq.length === 0 ? (['faq'] as const) : []);
}
