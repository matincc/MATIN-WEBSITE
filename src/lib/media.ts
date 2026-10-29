/**
 * Image registry of the Living homepage (owner's brief, Oct 29 2026). Every photograph the
 * homepage shows outside the posters, the event images and the President's portrait is
 * listed here ONCE, by the place it fills (its "slot"). Components only ever name a slot,
 * never a file or a URL, so a photo is replaced here and every place using it follows.
 *
 * Two kinds of entry:
 * - `src`: a file in src/assets/photos/ (Matin's own photos, or openly licensed ones), optimized
 *   by Astro at build time.
 * - `unsplash`: a TEMPORARY photo from Unsplash (Unsplash License: free for commercial and
 *   non-commercial use, no permission needed). Unsplash asks that its photos be loaded from
 *   its own image server (images.unsplash.com, allowed in the CSP in astro.config.mjs) and
 *   credited; each one is shown with a very small credit (owner's request, Oct 29 2026: no
 *   « Photo temporaire » label). Temporary photos illustrate themes only: they never show
 *   Matin's events or members.
 *
 * TO REPLACE A TEMPORARY PHOTO with a Matin photo (see docs/IMAGES.md):
 * 1. Put the file in src/assets/photos/ (JPEG, at least 2000px wide for `wide` slots).
 * 2. Import it below and, in that slot, replace `unsplash: '…'` with `src: theImport`.
 * 3. Set `temporary: false`, update `credit` (photographer's name; Matin's own photo:
 *    license « Tous droits réservés », source https://matincc.ca/), and `focus` (the point
 *    that must stay visible when the photo is cropped, e.g. '50% 30%' for faces near the top).
 * The layout never depends on the photo's size: each slot crops to its own shape.
 */
import type { ImageMetadata } from 'astro';
import { photos } from '@/lib/photos';
import whoFriendsGroup from '@/assets/photos/who-friends-group.jpg';

export interface MediaCredit {
  author: string;
  /** The photographer's page (Unsplash profile, or Matin's site). */
  authorUrl?: string;
  license: string;
  /** Set for the Unsplash License, whose name is shown in the page's language. */
  licenseKey?: 'unsplash';
  licenseUrl: string;
  /** The photo's own page at its source. */
  source: string;
  /** Name of the source shown in the credit, e.g. "Unsplash" or "Wikimedia Commons". */
  sourceName: string;
}

export interface MediaEntry {
  /** A local file (preferred, and always for Matin's own photos). */
  src?: ImageMetadata;
  /** Or an Unsplash image id ("photo-…"), served from images.unsplash.com. */
  unsplash?: string;
  /** The point kept in view when the photo is cropped (CSS object-position). */
  focus?: string;
  /** Temporary stand-in until Matin's own photo replaces it (not labelled on the page). */
  temporary: boolean;
  /** What the photo shows, for the person replacing it (not shown on the page). */
  shows: string;
  /** Left out only while the photo's source is unknown: the credit line then skips it. */
  credit?: MediaCredit;
}

const UNSPLASH_LICENSE = 'Unsplash License';
const UNSPLASH_LICENSE_URL = 'https://unsplash.com/license';
/** Unsplash's attribution guidelines ask for these referral parameters on credit links. */
const ref = (url: string) => `${url}?utm_source=matincc&utm_medium=referral`;
const unsplashCredit = (author: string, username: string, page: string): MediaCredit => ({
  author,
  authorUrl: ref(`https://unsplash.com/@${username}`),
  license: UNSPLASH_LICENSE,
  licenseKey: 'unsplash',
  licenseUrl: UNSPLASH_LICENSE_URL,
  source: ref(`https://unsplash.com/photos/${page}`),
  sourceName: 'Unsplash',
});

export const media = {
  /** Who we are, large photo of the collage: a group of young friends of different origins
      sitting together outdoors (photo chosen by the owner, Oct 29 2026; source not yet
      known, so no credit is shown until it is). */
  introConversation: {
    src: whoFriendsGroup,
    focus: '50% 30%',
    temporary: true,
    shows: 'Eight smiling young friends of different origins sitting together outdoors.',
  },
  /** Who we are, second photo of the collage: people making pottery around a table. */
  introMaking: {
    unsplash: 'photo-1682868067843-11fbc221174a',
    focus: '50% 50%',
    temporary: true,
    shows: 'A group of women working on pottery around a table.',
    credit: unsplashCredit(
      'Sander Breneman',
      'brenesan',
      'a-group-of-women-sitting-at-a-table-working-on-pottery-kJiPUr1KQSE',
    ),
  },
  /** Who we are, third photo of the collage: visitors in front of a painting. */
  introGallery: {
    unsplash: 'photo-1569783721854-33a99b4c0bae',
    focus: '50% 50%',
    temporary: true,
    shows: 'Visitors looking at a painting in a museum (New York).',
    credit: unsplashCredit(
      'Jessica Pamp',
      'yessijes',
      'a-group-of-people-standing-in-front-of-a-painting-JNTSoyb_bbw',
    ),
  },
  /** Full-width pause between sections: Montréal seen from Mont-Royal. */
  montrealWide: {
    unsplash: 'photo-1683624668626-2fce96bf73a9',
    focus: '50% 60%',
    temporary: true,
    shows: 'Two people on a bench on Mont-Royal, looking over Montréal in summer.',
    credit: unsplashCredit(
      'Marion Lhn',
      'marionlhn',
      'two-people-sitting-on-a-bench-overlooking-a-city-LmCnmjT7fNI',
    ),
  },
  /** Programs, area 1 (intercultural dialogue and community engagement). */
  areaDialogue: {
    unsplash: 'photo-1491438590914-bc09fcaaf77a',
    focus: '50% 35%',
    temporary: true,
    shows: 'Friends laughing and talking outdoors (Priscilla Du Preez, Canada).',
    credit: unsplashCredit(
      'Priscilla Du Preez',
      'priscilladupreez',
      'people-laughing-and-talking-outside-during-daytime-nF8xhLMmg0c',
    ),
  },
  /** Programs, area 2 (cultural planning and community development). */
  areaCommunities: {
    unsplash: 'photo-1781785161788-a906202dba8f',
    focus: '50% 55%',
    temporary: true,
    shows: 'People gathering in a community garden.',
    credit: unsplashCredit(
      'Haberdoedas',
      'haberdoedas',
      'people-gathering-in-a-community-garden-with-trees-in-background-c9xGzxR8ego',
    ),
  },
  /** Programs, area 3 (research, cultural policy and public dialogue). */
  areaResearch: {
    unsplash: 'photo-1553714155-2ee64b8575e6',
    focus: '50% 50%',
    temporary: true,
    shows: 'People reading in a public library (Stuttgart).',
    credit: unsplashCredit('Sara Kurfeß', 'stereophototyp', 'people-inside-library-5H08Y81JF_M'),
  },
  /** Participation: a discussion circle in Montréal, openly licensed (already on the site). */
  participation: {
    src: photos.dialogueCircle.src,
    focus: photos.dialogueCircle.focus,
    temporary: false,
    shows: 'A discussion circle at Wikimania 2017 in Montréal (Wikimedia Commons).',
    credit: {
      author: photos.dialogueCircle.credit.author,
      license: photos.dialogueCircle.credit.license,
      licenseUrl: photos.dialogueCircle.credit.licenseUrl,
      source: photos.dialogueCircle.credit.source,
      sourceName: 'Wikimedia Commons',
    },
  },
} satisfies Record<string, MediaEntry>;

export type MediaSlot = keyof typeof media;

/** Address of an Unsplash image at a given width, cropped to a ratio around faces. */
export function unsplashUrl(id: string, width: number, ratio?: number): string {
  const params = new URLSearchParams({
    w: String(width),
    q: '72',
    auto: 'format',
    fit: 'crop',
    crop: 'faces,entropy',
  });
  if (ratio) params.set('h', String(Math.round(width / ratio)));
  return `https://images.unsplash.com/${id}?${params}`;
}

/** True while at least one slot still shows a temporary photo. */
