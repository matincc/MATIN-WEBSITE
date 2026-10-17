/**
 * Every public page as a FR/EN pair, so the sitemap can declare hreflang
 * alternates even when the URLs are translated (/fr/a-propos/ ↔ /en/about/).
 */
import {
  categorySegment,
  categorySlugs,
  path,
  routes,
  siteAlternates,
  type RouteKey,
} from '@/i18n/routes';
import { getEvents, getNews, getPrograms, NEWS_PAGE_SIZE, newsCategories, slugOf } from './content';

export interface PagePair {
  fr: string;
  en: string;
  /** Persian version, when one exists. */
  fa?: string;
  lastmod?: Date;
}

export async function allPagePairs(): Promise<PagePair[]> {
  const keys = (Object.keys(routes) as RouteKey[]).filter((k) => k !== 'search');
  const pairs: PagePair[] = keys.map((key) => siteAlternates(key));

  for (const p of await getPrograms()) {
    pairs.push({
      fr: path('programs', 'fr', slugOf(p, 'fr')),
      en: path('programs', 'en', slugOf(p, 'en')),
    });
  }
  for (const e of await getEvents()) {
    pairs.push({
      fr: path('events', 'fr', slugOf(e, 'fr')),
      en: path('events', 'en', slugOf(e, 'en')),
    });
  }

  const posts = await getNews();
  for (const post of posts) {
    pairs.push({
      fr: path('news', 'fr', slugOf(post, 'fr')),
      en: path('news', 'en', slugOf(post, 'en')),
      lastmod: post.data.date,
    });
  }
  for (const c of newsCategories(posts)) {
    pairs.push({
      fr: path('news', 'fr', categorySegment.fr, categorySlugs[c].fr),
      en: path('news', 'en', categorySegment.en, categorySlugs[c].en),
    });
  }
  const pages = Math.ceil(posts.length / NEWS_PAGE_SIZE);
  for (let n = 2; n <= pages; n++) {
    pairs.push({ fr: path('news', 'fr', 'page', n), en: path('news', 'en', 'page', n) });
  }
  return pairs;
}
