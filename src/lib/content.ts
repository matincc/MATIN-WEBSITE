import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import type { Lang } from '@/i18n/routes';
import { typo } from './frenchTypo';
import { montrealTime } from './dates';
import { newsCategories as newsCategoryList, type NewsCategory } from '@/lib/taxonomy';
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

/** "Matin's Picks": up to 3 upcoming events featured until a date that has not passed. */
export function picksOf(upcoming: EventEntry[], now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  return upcoming
    .filter(
      (e) => e.data.status !== 'cancelled' && e.data.featuredUntil && e.data.featuredUntil >= today,
    )
    .slice(0, 3);
}

export async function getPrograms() {
  return (await getCollection('programs')).sort((a, b) => a.data.order - b.data.order);
}

/** Published articles, newest first (drafts only on the local preview). */
export async function getNews(limit?: number) {
  const list = (await getCollection('news', (p) => import.meta.env.DEV || !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return limit ? list.slice(0, limit) : list;
}

export const NEWS_PAGE_SIZE = 6;

/** An article has a Persian page once its Persian text is written and reviewed. */
export const hasPersian = (post: CollectionEntry<'news'>) =>
  post.data.faReviewed && !!post.data.body.fa;

/** Link to an article in the page's language (Persian page when it exists). */
export function articleHref(post: CollectionEntry<'news'>, lang: UiLang): string {
  if (lang === 'fa' && hasPersian(post)) return `/fa/news/${slugOf(post, 'en')}/`;
  return href('news', lang, slugOf(post, baseLang(lang)));
}

/** News categories that have at least one post, in the canonical order. */
export function newsCategories(posts: CollectionEntry<'news'>[]): NewsCategory[] {
  const used = new Set(posts.map((p) => p.data.category));
  return newsCategoryList.filter((c) => used.has(c));
}

/**
 * Entries shown on a page in this language. Persian pages only show entries whose
 * Persian translation has been reviewed (faReviewed: true).
 */
export function forLang<T extends { data: { faReviewed?: boolean } }>(
  items: T[],
  lang: UiLang,
): T[] {
  return lang === 'fa' ? items.filter((i) => i.data.faReviewed) : items;
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

export async function getAlbums() {
  return (await getCollection('gallery')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export async function getFaq() {
  return (await getCollection('faq')).sort((a, b) => a.data.order - b.data.order);
}

export async function getResources() {
  return (await getCollection('resources')).sort((a, b) => a.data.order - b.data.order);
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

/** Pages that are shown in the navigation only once they have content. */
export async function emptySections(): Promise<Set<'gallery' | 'faq' | 'resources'>> {
  const [gallery, faq, resources] = await Promise.all([
    getCollection('gallery'),
    getCollection('faq'),
    getCollection('resources'),
  ]);
  const empty = new Set<'gallery' | 'faq' | 'resources'>();
  if (gallery.length === 0) empty.add('gallery');
  if (faq.length === 0) empty.add('faq');
  if (resources.length === 0) empty.add('resources');
  return empty;
}
