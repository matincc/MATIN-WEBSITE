/**
 * Every public page in French, English and Persian, so the sitemap can declare hreflang
 * alternates even when the URLs are translated (/fr/a-propos/ ↔ /en/about/).
 */
import { href, path, routes, siteAlternates, type RouteKey } from '@/i18n/routes';
import { getEvents, getNews, getPrograms, presidentProfileVisible, slugOf } from './content';

export interface PagePair {
  fr: string;
  en: string;
  /** Persian version, when one exists. */
  fa?: string;
  lastmod?: Date;
}

export async function allPagePairs(): Promise<PagePair[]> {
  const profile = await presidentProfileVisible();
  const keys = (Object.keys(routes) as RouteKey[]).filter(
    (k) => k !== 'search' && (k !== 'president' || profile),
  );
  const pairs: PagePair[] = keys.map((key) => siteAlternates(key));

  for (const p of await getPrograms()) {
    pairs.push({
      fr: path('programs', 'fr', slugOf(p, 'fr')),
      en: path('programs', 'en', slugOf(p, 'en')),
      fa: href('programs', 'fa', slugOf(p, 'en')),
    });
  }
  for (const e of await getEvents()) {
    pairs.push({
      fr: path('events', 'fr', slugOf(e, 'fr')),
      en: path('events', 'en', slugOf(e, 'en')),
      fa: href('events', 'fa', slugOf(e, 'en')),
    });
  }

  const posts = await getNews();
  for (const post of posts) {
    pairs.push({
      fr: path('news', 'fr', slugOf(post, 'fr')),
      en: path('news', 'en', slugOf(post, 'en')),
      fa: href('news', 'fa', slugOf(post, 'en')),
      lastmod: post.data.date,
    });
  }
  return pairs;
}
