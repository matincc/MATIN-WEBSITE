/**
 * Single source of truth for localized URLs.
 * Every page has a stable key; each language has its own translated slug.
 * The language toggle and hreflang tags read from here, so FR ↔ EN always
 * point to the *equivalent* page.
 */
export const languages = ['fr', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'fr';

export const routes = {
  home: { fr: '', en: '' },
  about: { fr: 'a-propos', en: 'about' },
  president: { fr: 'a-propos/reza-moafi', en: 'about/reza-moafi' },
  team: { fr: 'equipe', en: 'team' },
  programs: { fr: 'programmes', en: 'programs' },
  events: { fr: 'evenements', en: 'events' },
  eventsArchive: { fr: 'evenements/archives', en: 'events/past' },
  news: { fr: 'actualites', en: 'news' },
  gallery: { fr: 'galerie', en: 'gallery' },
  getInvolved: { fr: 's-impliquer', en: 'get-involved' },
  resources: { fr: 'ressources', en: 'resources' },
  contact: { fr: 'contact', en: 'contact' },
  faq: { fr: 'faq', en: 'faq' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
  terms: { fr: 'conditions-utilisation', en: 'terms-of-use' },
  accessibility: { fr: 'accessibilite', en: 'accessibility' },
  search: { fr: 'recherche', en: 'search' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Translated URL segments for news categories, e.g. /fr/actualites/categorie/nouvelles-matin/ */
export const categorySegment = { fr: 'categorie', en: 'category' } as const;
export const categorySlugs = {
  'matin-news': { fr: 'nouvelles-matin', en: 'matin-news' },
  perspectives: { fr: 'perspectives', en: 'perspectives' },
  'culture-cities': { fr: 'culture-et-villes', en: 'culture-cities' },
  research: { fr: 'recherche-et-publications', en: 'research-publications' },
  partnerships: { fr: 'partenariats-et-initiatives', en: 'partnerships-initiatives' },
} as const satisfies Record<string, Record<Lang, string>>;

/** Build a localized path, e.g. path('events', 'en', 'summer-fest') → /en/events/summer-fest/ */
export function path(key: RouteKey, lang: Lang, ...rest: (string | number)[]): string {
  const parts = [lang, routes[key][lang], ...rest.map(String)].filter(Boolean);
  return `/${parts.join('/')}/`;
}

/** Same page in both languages — feeds the toggle and hreflang. */
export function alternatesFor(key: RouteKey, ...rest: (string | number)[]): Record<Lang, string> {
  return { fr: path(key, 'fr', ...rest), en: path(key, 'en', ...rest) };
}

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

export const otherLang = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr');

/* ------------------------------------------------------------------------ *
 * Persian (فارسی): an additional access language.
 * French and English remain the main languages (every page exists in both).
 * Persian has its own versions of a few pages only; links to the others go
 * to the FA_FALLBACK version with ?from=fa, which shows a short Persian note.
 * ------------------------------------------------------------------------ */
export const uiLanguages = ['fr', 'en', 'fa'] as const;
export type UiLang = (typeof uiLanguages)[number];
export const FA_FALLBACK: Lang = 'en';

/** Pages that have a Persian version, and their slug under /fa/. */
export const faRoutes: Partial<Record<RouteKey, string>> = {
  home: '',
  about: 'about',
  president: 'about/reza-moafi',
  team: 'team',
  getInvolved: 'get-involved',
  contact: 'contact',
};

export const isRtl = (lang: UiLang) => lang === 'fa';
/** Language whose content/pages to use when a Persian version does not exist. */
export const baseLang = (lang: UiLang): Lang => (lang === 'fa' ? FA_FALLBACK : lang);

/**
 * Link to a page in any interface language. In Persian, pages without a
 * Persian version point to the fallback language with ?from=fa.
 */
export function href(key: RouteKey, lang: UiLang, ...rest: (string | number)[]): string {
  if (lang !== 'fa') return path(key, lang, ...rest);
  const slug = faRoutes[key];
  if (slug !== undefined && rest.length === 0) return slug ? `/fa/${slug}/` : '/fa/';
  return `${path(key, FA_FALLBACK, ...rest)}?from=fa`;
}

/** Equivalent URL of a page in each language; `fa` only when it exists. */
export type Alternates = { fr: string; en: string; fa?: string };

/** Alternates including Persian when the page has a Persian version. */
export function siteAlternates(key: RouteKey): Alternates {
  const alts: Alternates = alternatesFor(key);
  const slug = faRoutes[key];
  if (slug !== undefined) alts.fa = slug ? `/fa/${slug}/` : '/fa/';
  return alts;
}
