/**
 * Media of the "Matin Alive" homepage hero (owner's brief, Oct 27 2026).
 *
 * Today: a slow cross-fade of openly licensed documentary photos of Montréal's public
 * life (src/lib/photos.ts), each always shown with its credit. They are not Matin's own
 * activities.
 *
 * A short background video can be added later, ONLY with documented rights (a Matin
 * production, or written permission from its author): put a silent, compressed file of
 * about 15 to 25 seconds in public/media/ (MP4 H.264, 1280 px wide, under 4 MB; an
 * optional WebM next to it), then fill `video` below. The video:
 *  - never plays sound (it has no audio track, and is muted anyway);
 *  - is requested only on wide screens, when the visitor allows motion and has not
 *    asked to save data; everyone else sees the photos;
 *  - shows the first photo as its still image while it loads, and can be paused.
 * Never download or republish a third-party video.
 */
import { photos, type Photo } from '@/lib/photos';

export interface HeroVideo {
  /** e.g. /media/matin-hero.mp4 */
  mp4: string;
  webm?: string;
  /** Author and permission, shown like a photo credit. */
  credit: Photo['credit'];
}

/** Set once a licensed video exists (see above). */
export const heroVideo: HeroVideo | null = null;

/** The cross-fading photos: public life, parks, conversations. The first is the still. */
export const heroSlides: Photo[] = [photos.tamtams, photos.placejc, photos.dialogueCircle];
