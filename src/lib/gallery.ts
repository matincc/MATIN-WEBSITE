/**
 * Gallery helpers: YouTube IDs, and the "Matin Moments" selection for the homepage
 * (Matin's introductory video when it is set, then the photos and videos marked
 * `featured`, newest albums first).
 */
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { href, type UiLang } from '@/i18n/routes';
import { pick } from '@/i18n/ui';

/** The 11-character ID from a YouTube link (watch, youtu.be, shorts, embed) or an ID. */
export function youtubeId(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^[\w-]{11}$/.test(value)) return value;
  return value.match(/(?:[?&]v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1];
}

export interface Moment {
  kind: 'photo' | 'video';
  title: string;
  /** Photo, or a video's thumbnail. */
  image?: ImageMetadata;
  alt: string;
  youtubeId?: string;
  file?: string;
  /** Where the tile leads: the album on the Gallery page. */
  href: string;
}

type Album = CollectionEntry<'gallery'>;
type IntroVideo = {
  title: { fr: string; en: string; fa?: string };
  youtube?: string;
  file?: string;
  thumbnail?: ImageMetadata;
};

export const albumAnchor = (album: Album) => `album-${album.id}`;

/** Up to `count` featured items: the introductory video first, when it is set. */
export function featuredMoments(
  albums: Album[],
  lang: UiLang,
  intro?: IntroVideo,
  count = 5,
): Moment[] {
  const gallery = href('gallery', lang);
  const moments: Moment[] = [];
  if (intro) {
    moments.push({
      kind: 'video',
      title: pick(intro.title, lang)!,
      image: intro.thumbnail,
      alt: '',
      youtubeId: youtubeId(intro.youtube),
      file: intro.file,
      href: gallery,
    });
  }
  for (const album of albums) {
    const albumHref = `${gallery}#${albumAnchor(album)}`;
    for (const v of album.data.videos.filter((v) => v.featured)) {
      moments.push({
        kind: 'video',
        title: pick(v.title, lang)!,
        image: v.thumbnail,
        alt: '',
        youtubeId: youtubeId(v.youtube),
        file: v.file,
        href: albumHref,
      });
    }
    for (const p of album.data.photos.filter((p) => p.featured)) {
      moments.push({
        kind: 'photo',
        title: pick(album.data.title, lang)!,
        image: p.image,
        alt: pick(p.alt, lang) ?? '',
        href: albumHref,
      });
    }
  }
  return moments.slice(0, count);
}
