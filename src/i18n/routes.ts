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
  notes: { fr: 'notes-du-president', en: 'president-notes' },
  gallery: { fr: 'galerie', en: 'gallery' },
  resources: { fr: 'ressources', en: 'resources' },
  contact: { fr: 'contact', en: 'contact' },
  faq: { fr: 'faq', en: 'faq' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
  terms: { fr: 'conditions-utilisation', en: 'terms-of-use' },
  accessibility: { fr: 'accessibilite', en: 'accessibility' },
  legalInfo: { fr: 'informations-legales', en: 'legal-information' },
  search: { fr: 'recherche', en: 'search' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Anchors of the two News sections on the News page (the former category pages redirect there). */
export const newsAnchors = { recommends: 'cultural-news', 'matin-news': 'matin-news' } as const;

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
 * Persian (فارسی): a full interface language (owner's brief, Oct 25 2026).
 * Every page exists in Persian under /fa/, with the English slug, so the
 * Persian site always has the same pages, menus and links as English and
 * French. A new route above gets its Persian page automatically here; only
 * its thin wrapper in src/pages/fa/ has to be added (see CLAUDE.md).
 * Content without a Persian text yet falls back to English (`pick`).
 * ------------------------------------------------------------------------ */
export const uiLanguages = ['fr', 'en', 'fa'] as const;
export type UiLang = (typeof uiLanguages)[number];
/** Language whose slugs Persian URLs reuse, and whose text fills in missing Persian. */
export const FA_FALLBACK: Lang = 'en';

/** Slug of each page under /fa/ (the English slug). */
export const faRoutes = Object.fromEntries(
  Object.entries(routes).map(([key, slugs]) => [key, slugs[FA_FALLBACK]]),
) as Record<RouteKey, string>;

export const isRtl = (lang: UiLang) => lang === 'fa';
/** Language whose content slugs and calendar files a page in this language uses. */
export const baseLang = (lang: UiLang): Lang => (lang === 'fa' ? FA_FALLBACK : lang);

/** Link to a page in any interface language, e.g. href('events', 'fa', 'autumn-walk-2026'). */
export function href(key: RouteKey, lang: UiLang, ...rest: (string | number)[]): string {
  if (lang !== 'fa') return path(key, lang, ...rest);
  const parts = ['fa', faRoutes[key], ...rest.map(String)].filter(Boolean);
  return `/${parts.join('/')}/`;
}

/** Equivalent URL of a page in each language. */
export type Alternates = { fr: string; en: string; fa?: string };

/** Alternates of a page in French, English and Persian. */
export function siteAlternates(key: RouteKey): Alternates {
  return { ...alternatesFor(key), fa: href(key, 'fa') };
}
