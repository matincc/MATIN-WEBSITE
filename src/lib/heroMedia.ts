/**
 * Photo of the homepage hero (owner's hero brief, Oct 29 2026): Les Tam-Tams du
 * Mont-Royal, an openly licensed documentary photo of Montréal's public life
 * (src/lib/photos.ts), always shown with its credit. It is not a Matin activity.
 *
 * To use a Matin photo instead, add it to src/lib/photos.ts with its credit and point
 * heroPhoto at it. Keep the text area (the right half on wide screens) on sky, trees or
 * buildings, never on faces, and keep any landmark fully visible.
 */
import { photos, type Photo } from '@/lib/photos';

export const heroPhoto: Photo = photos.tamtams;
