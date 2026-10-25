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

/**
 * Cultural Resources & Organizations, in the order of the page (owner's briefs, Oct 25 2026:
 * five categories, in this exact order). municipal = Canadian municipal cultural institutions
 * (cities' official cultural departments); quebec = Québec cultural institutions; federal =
 * Canadian federal cultural institutions; community = major cultural and community
 * organizations and public cultural bodies (Montréal); international = international
 * cultural organizations & networks.
 */
export const resourceCategories = [
  'municipal',
  'quebec',
  'federal',
  'community',
  'international',
] as const;
export type ResourceCategory = (typeof resourceCategories)[number];

/**
 * The two News categories (owner's brief, Oct 25 2026: "News", exactly two, never mixed):
 * `recommends` = Cultural News, external stories the President approved, each with a
 * `source` and a `region`; `matin-news` = Matin News, the institute's official news.
 */
export const newsCategories = ['recommends', 'matin-news'] as const;
export type NewsCategory = (typeof newsCategories)[number];

/** The three region tabs of Matin's Picks and Cultural News (owner's brief, Oct 25 2026):
 * Montréal, the rest of Canada (other Québec municipalities included), around the world. */
export const newsRegions = ['montreal', 'canada', 'international'] as const;
export type NewsRegion = (typeof newsRegions)[number];

/** The four region tabs of Cultural News (owner's brief, Oct 25 2026, news assistant):
 * Montréal, Québec (outside Montréal), Canada (outside Québec) and around the world.
 * Matin's Picks keep their three tabs above. */
export const culturalNewsRegions = ['montreal', 'quebec', 'canada', 'international'] as const;
export type CulturalNewsRegion = (typeof culturalNewsRegions)[number];

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
