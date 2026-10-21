/**
 * The homepage feed of Matin's own content: highlights (src/content/highlights/),
 * Matin's own and co-organized events, and published news, all turned into one card
 * shape. External "selected" events are never part of it.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { baseLang, href, type UiLang } from '@/i18n/routes';
import { pick } from '@/i18n/ui';
import {
  articleHref,
  cityOf,
  forLang,
  getNews,
  getUpcomingEvents,
  isMatinEvent,
  slugOf,
  type EventEntry,
} from '@/lib/content';
import { formatDate, formatWhen } from '@/lib/dates';

export type MatinType = CollectionEntry<'highlights'>['data']['type'];

export interface MatinItem {
  id: string;
  type: MatinType;
  title: string;
  summary: string;
  image?: ImageMetadata;
  imageAlt: string;
  /** Date line, already formatted for the language. */
  when: string;
  datetime: string;
  location?: string;
  url: string;
  external: boolean;
  /** Custom button label; otherwise the label that fits the type. */
  ctaLabel?: string;
  featured: boolean;
  /** Sort keys: upcoming activities first (soonest first), then the newest. */
  upcoming: boolean;
  time: number;
  order: number;
}

const isExternal = (url: string) => /^https?:\/\//.test(url);

/** Published highlights still current today (drafts only on the local preview). */
async function getHighlights(now: Date) {
  const list = await getCollection(
    'highlights',
    (h) => (import.meta.env.DEV || !h.data.draft) && (!h.data.until || h.data.until >= now),
  );
  return list;
}

function fromHighlight(h: CollectionEntry<'highlights'>, lang: UiLang, now: Date): MatinItem {
  const d = h.data;
  const when = d.endDate
    ? formatWhen(d.date, d.endDate, lang, { allDay: true, timeZone: 'UTC' })
    : formatDate(d.date, lang);
  const end = d.endDate ?? d.date;
  return {
    id: `highlight-${h.id}`,
    type: d.type,
    title: pick(d.title, lang)!,
    summary: pick(d.summary, lang)!,
    image: d.image,
    imageAlt: pick(d.imageAlt, lang) ?? '',
    when,
    datetime: d.date.toISOString().slice(0, 10),
    location: pick(d.location, lang) || undefined,
    url: d.url,
    external: isExternal(d.url),
    ctaLabel: pick(d.ctaLabel, lang) || undefined,
    featured: d.featured,
    upcoming: ['event', 'initiative'].includes(d.type) && end >= now,
    time: d.date.getTime(),
    order: d.order,
  };
}

function fromEvent(e: EventEntry, lang: UiLang): MatinItem {
  const d = e.data;
  return {
    id: `event-${e.id}`,
    type: 'event',
    title: pick(d.title, lang)!,
    summary: pick(d.summary, lang)!,
    image: d.image,
    imageAlt: pick(d.imageAlt, lang) ?? '',
    when: formatWhen(e.startDate, d.end ? e.endDate : undefined, lang, {
      allDay: d.allDay,
      timeZone: d.timeZone,
    }),
    datetime: e.startDate.toISOString(),
    location: d.format === 'online' ? undefined : cityOf(e, lang) || undefined,
    url: href('events', lang, slugOf(e, baseLang(lang))),
    external: false,
    featured: false,
    upcoming: true,
    time: e.startDate.getTime(),
    order: 0,
  };
}

function fromNews(p: CollectionEntry<'news'>, lang: UiLang): MatinItem {
  const d = p.data;
  return {
    id: `news-${p.id}`,
    type: 'news',
    title: pick(d.title, lang)!,
    summary: pick(d.excerpt, lang)!,
    image: d.image,
    imageAlt: pick(d.imageAlt, lang) ?? '',
    when: formatDate(d.date, lang),
    datetime: d.date.toISOString().slice(0, 10),
    url: articleHref(p, lang),
    external: false,
    featured: false,
    upcoming: false,
    time: d.date.getTime(),
    order: 0,
  };
}

/**
 * The featured item ("Matin in Action") and up to `limit` more ("Latest From Matin").
 * Featured: the highlight marked `featured`, else Matin's next event, else the latest
 * article. Persian pages only list entries whose Persian text has been reviewed.
 */
export async function getMatinFeed(lang: UiLang, limit = 3, now = new Date()) {
  const [highlights, events, news] = await Promise.all([
    getHighlights(now),
    getUpcomingEvents(),
    getNews(),
  ]);
  const matinEvents = forLang(events, lang).filter(
    (e) => isMatinEvent(e) && e.data.status !== 'cancelled',
  );
  const items: MatinItem[] = [
    ...forLang(highlights, lang).map((h) => fromHighlight(h, lang, now)),
    ...matinEvents.map((e) => fromEvent(e, lang)),
    ...forLang(news, lang).map((p) => fromNews(p, lang)),
  ].sort(
    (a, b) =>
      Number(b.upcoming) - Number(a.upcoming) ||
      (a.upcoming ? a.time - b.time : b.time - a.time) ||
      a.order - b.order,
  );

  const featured =
    items.find((i) => i.featured) ??
    items.find((i) => i.type === 'event' && i.upcoming) ??
    items.find((i) => i.type === 'news') ??
    items[0];
  const rest = items.filter((i) => i !== featured).slice(0, limit);
  return { featured, items: rest };
}
