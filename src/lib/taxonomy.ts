/** Fixed lists shared by the content schemas, the CMS and the pages. */
export const categories = [
  'language',
  'arts',
  'youth',
  'community',
  'newcomers',
  'lectures',
  'music',
  'celebration',
] as const;
export type Category = (typeof categories)[number];

export const faqTopics = ['general', 'programs', 'events', 'volunteering', 'donations'] as const;

/** Cultural Resources & Organizations, in the order of the page. */
export const resourceCategories = [
  'municipal',
  'government',
  'arts',
  'community',
  'research',
  'other',
] as const;
export type ResourceCategory = (typeof resourceCategories)[number];

/**
 * News & Insights categories. A category appears on the site only once it has a
 * published article. `recommends` = Matin Recommends: selected external news, each with
 * a `source` and a `region` (Québec, Canada or International).
 */
export const newsCategories = [
  'matin-news',
  'perspectives',
  'culture-cities',
  'research',
  'partnerships',
  'recommends',
] as const;
export type NewsCategory = (typeof newsCategories)[number];

/**
 * The three headings of News & Insights (owner's choice, Oct 25 2026, option A): the five
 * original categories are kept and grouped, so no link changes. Each heading always has
 * a page, linked from the News menu.
 */
export const newsSections = {
  'matin-news': ['matin-news'],
  insights: ['perspectives', 'culture-cities', 'research', 'partnerships'],
  recommends: ['recommends'],
} as const satisfies Record<string, readonly NewsCategory[]>;
export type NewsSection = keyof typeof newsSections;
/** A category page or a heading page. */
export type NewsListKey = NewsCategory | NewsSection;

/** Regions of Matin Recommends. */
export const newsRegions = ['quebec', 'canada', 'international'] as const;
export type NewsRegion = (typeof newsRegions)[number];

/* Events & Cultural Agenda */

/** Who runs the event. Only `matin` and `co-organized` events get a page on this site. */
export const eventKinds = ['matin', 'co-organized', 'selected'] as const;
export type EventKind = (typeof eventKinds)[number];

/** Subjects of the agenda; keep this list short. */
export const eventSubjects = [
  'dialogue',
  'policy',
  'cities',
  'community',
  'arts',
  'research',
] as const;
export type EventSubject = (typeof eventSubjects)[number];

/** Montréal and Québec come first; the order is the order of the filter. */
export const eventRegions = ['montreal', 'quebec', 'canada', 'international'] as const;
export type EventRegion = (typeof eventRegions)[number];

export const eventFormats = ['in-person', 'online', 'hybrid'] as const;
export const eventLanguages = ['fr', 'en', 'bilingual', 'other'] as const;
export const eventStatuses = ['scheduled', 'postponed', 'cancelled'] as const;
export const priceTypes = ['free', 'paid', 'unknown'] as const;

/** Decorative cover art (built for program categories) used when an event has no image. */
export const subjectCover: Record<EventSubject, Category> = {
  dialogue: 'community',
  policy: 'lectures',
  cities: 'community',
  community: 'community',
  arts: 'arts',
  research: 'lectures',
};
