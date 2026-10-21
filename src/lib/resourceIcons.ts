import { BookOpen, Building, Compass, Landmark, Palette, Users } from '@lucide/astro';
import type { ResourceCategory } from '@/lib/taxonomy';

/** One thin-line icon per directory category (homepage and Resources page). */
export const resourceIcons: Record<ResourceCategory, typeof Building> = {
  municipal: Building,
  government: Landmark,
  arts: Palette,
  community: Users,
  research: BookOpen,
  other: Compass,
};

/** Accent of each category, in the Matin palette. */
export const resourceAccents: Record<ResourceCategory, string> = {
  municipal: 'teal',
  government: 'navy',
  arts: 'coral',
  community: 'terracotta',
  research: 'mustard',
  other: 'teal',
};
