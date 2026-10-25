/**
 * The news sources: public RSS/Atom feeds that publishers offer for this purpose. To add or
 * remove a source, edit this list. `region: 'auto'` (national or general publishers) places a
 * story by the places it names, otherwise in `fallback`.
 */
import type { Region, SourceKind } from './types';

export type Source = {
  id: string;
  name: string;
  url: string;
  kind: SourceKind;
  region: Region | 'auto';
  fallback: Region;
  language: 'fr' | 'en';
};

/*
 * Checked on Oct 25 2026. "verified" = the feed was read and had dated items that week;
 * "to confirm" = the publisher blocks our research tool, so the first run on Netlify shows
 * whether it answers (the run report lists every feed that failed). Publishers with no
 * public feed (CALQ, Conseil des arts de Montréal, Canada Council for the Arts, IFACCA,
 * quebec.ca, unesco.org, Council of Europe, European Commission) are not scraped.
 */
export const SOURCES: Source[] = [
  // Montréal
  {
    id: 'montreal-ville',
    name: 'Ville de Montréal',
    url: 'https://montreal.ca/diffusion/rss/communiques.xml',
    kind: 'official',
    region: 'montreal',
    fallback: 'montreal',
    language: 'fr',
  }, // verified
  {
    id: 'mediation-culturelle',
    name: 'La médiation culturelle (Montréal)',
    url: 'https://montreal.mediationculturelle.org/feed/',
    kind: 'institution',
    region: 'montreal',
    fallback: 'montreal',
    language: 'fr',
  }, // verified
  {
    id: 'global-montreal',
    name: 'Global News Montreal',
    url: 'https://globalnews.ca/montreal/feed/',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'montreal',
    language: 'en',
  }, // verified
  {
    id: 'cbc-montreal',
    name: 'CBC News Montreal',
    url: 'https://www.cbc.ca/webfeed/rss/rss-canada-montreal',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'montreal',
    language: 'en',
  }, // to confirm
  {
    id: 'montreal-gazette',
    name: 'Montreal Gazette',
    url: 'https://www.montrealgazette.com/feed',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'montreal',
    language: 'en',
  }, // to confirm
  {
    id: 'lapresse-regional',
    name: 'La Presse',
    url: 'https://www.lapresse.ca/actualites/regional/rss',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'montreal',
    language: 'fr',
  }, // to confirm
  // Québec
  {
    id: 'sodec',
    name: 'SODEC',
    url: 'https://sodec.gouv.qc.ca/feed/',
    kind: 'official',
    region: 'quebec',
    fallback: 'quebec',
    language: 'fr',
  }, // verified, posts rarely
  {
    id: 'le-devoir',
    name: 'Le Devoir',
    url: 'http://feeds2.feedburner.com/fluxdudevoir',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'quebec',
    language: 'fr',
  }, // verified (all sections; the ranking keeps culture)
  {
    id: 'radio-canada',
    name: 'Radio-Canada',
    url: 'https://ici.radio-canada.ca/rss/4159',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'canada',
    language: 'fr',
  }, // to confirm
  // Canada
  {
    id: 'canadian-heritage',
    name: 'Patrimoine canadien / Canadian Heritage',
    url: 'https://api.io.canada.ca/io-server/gc/news/fr/v2?dept=canadianheritage&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Patrimoine%20canadien',
    kind: 'official',
    region: 'auto',
    fallback: 'canada',
    language: 'fr',
  }, // verified
  {
    id: 'lac',
    name: 'Library and Archives Canada',
    url: 'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=libraryarchives&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Library%20and%20Archives%20Canada',
    kind: 'official',
    region: 'canada',
    fallback: 'canada',
    language: 'en',
  }, // verified, posts rarely
  {
    id: 'cbc-arts',
    name: 'CBC Arts',
    url: 'https://www.cbc.ca/webfeed/rss/rss-arts',
    kind: 'newsroom',
    region: 'auto',
    fallback: 'canada',
    language: 'en',
  }, // to confirm
  // International
  {
    id: 'unesco-whc',
    name: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/news/rss',
    kind: 'institution',
    region: 'international',
    fallback: 'international',
    language: 'en',
  }, // verified
  {
    id: 'uclg-culture21',
    name: 'UCLG – Agenda 21 for culture',
    url: 'https://www.agenda21culture.net/rss.xml',
    kind: 'institution',
    region: 'international',
    fallback: 'international',
    language: 'en',
  }, // verified
  {
    id: 'un-news-culture',
    name: 'UN News',
    url: 'https://news.un.org/feed/subscribe/en/news/topic/culture-and-education/feed/rss.xml',
    kind: 'institution',
    region: 'international',
    fallback: 'international',
    language: 'en',
  }, // to confirm
];
