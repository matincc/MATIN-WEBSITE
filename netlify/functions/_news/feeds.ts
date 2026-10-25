/**
 * Reads public RSS 2.0, RSS 1.0 (RDF) and Atom feeds. Only what the publisher puts in its
 * feed is kept: headline, link, date and its own short description (HTML removed, cut to
 * 600 characters). Article pages are never scraped.
 */
import { XMLParser } from 'fast-xml-parser';

export type FeedItem = { title: string; link: string; description: string; published: string };

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  textNodeName: '#text',
  processEntities: true,
  htmlEntities: true,
});

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  eacute: 'é',
  egrave: 'è',
  agrave: 'à',
  ccedil: 'ç',
  ecirc: 'ê',
  laquo: '«',
  raquo: '»',
};

/** Plain text from a feed field: tags, scripts and entities removed, spaces collapsed. */
export function plain(value: unknown, max = 600) {
  const raw =
    typeof value === 'string'
      ? value
      : value && typeof value === 'object' && '#text' in value
        ? String((value as Record<string, unknown>)['#text'])
        : value == null
          ? ''
          : String(value);
  const text = raw
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n: string) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text;
}

const asArray = <T>(v: T | T[] | undefined): T[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

function atomLink(link: unknown): string {
  const links = asArray(link as Record<string, string> | Record<string, string>[]);
  const alt = links.find((l) => typeof l === 'object' && (!l['@rel'] || l['@rel'] === 'alternate'));
  if (alt && typeof alt === 'object') return alt['@href'] ?? '';
  return typeof link === 'string' ? link : '';
}

const isoDate = (v: unknown) => {
  const t = Date.parse(plain(v, 100));
  return Number.isNaN(t) ? '' : new Date(t).toISOString();
};

export function parseFeed(xml: string): FeedItem[] {
  const doc = parser.parse(xml) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  if (doc.rss?.channel) {
    return asArray(doc.rss.channel.item).map((i) => ({
      title: plain(i.title, 300),
      link: plain(i.link, 1000) || plain(i.guid, 1000),
      description: plain(i.description ?? i['content:encoded']),
      published: isoDate(i.pubDate ?? i['dc:date']),
    }));
  }
  if (doc.feed) {
    return asArray(doc.feed.entry).map((e) => ({
      title: plain(e.title, 300),
      link: atomLink(e.link),
      description: plain(e.summary ?? e.content),
      published: isoDate(e.published ?? e.updated),
    }));
  }
  const rdf = doc['rdf:RDF'];
  if (rdf) {
    return asArray(rdf.item).map((i) => ({
      title: plain(i.title, 300),
      link: plain(i.link, 1000),
      description: plain(i.description),
      published: isoDate(i['dc:date']),
    }));
  }
  throw new Error('Not an RSS or Atom feed');
}

export async function fetchFeed(url: string, timeoutMs = 12000) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'MatinCulturalNewsBot/1.0 (+https://matincc.ca/)',
      accept:
        'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5',
    },
    signal: AbortSignal.timeout(timeoutMs),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  if (text.length > 5_000_000) throw new Error('Feed too large');
  return parseFeed(text).filter((i) => i.title && /^https:\/\//.test(i.link));
}

/** The article link without tracking parameters or fragment, as shown to readers. */
export function cleanLink(link: string) {
  const u = new URL(link);
  u.hash = '';
  for (const k of [...u.searchParams.keys()])
    if (/^(utm_|fbclid|gclid|mc_|cmp|ref$|xtor)/i.test(k)) u.searchParams.delete(k);
  return u.href;
}

/** One id per article: the clean link, without `www.` or a trailing slash. */
export async function linkId(link: string) {
  const u = new URL(cleanLink(link));
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, '');
  const normal = `${u.hostname}${u.pathname.replace(/\/+$/, '')}${u.search}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normal));
  return Buffer.from(digest).toString('hex').slice(0, 20);
}
