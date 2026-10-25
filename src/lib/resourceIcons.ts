import { Globe, Landmark, Library, Users } from '@lucide/astro';
import type { ResourceCategory } from '@/lib/taxonomy';

/** One thin-line icon per directory category (homepage and Resources page). */
export const resourceIcons: Record<ResourceCategory, typeof Landmark> = {
  federal: Landmark,
  quebec: Library,
  community: Users,
  international: Globe,
};

/** Accent of each category, in the Matin palette (the four directory modules). */
export const resourceAccents: Record<ResourceCategory, string> = {
  federal: 'navy',
  quebec: 'teal',
  community: 'mustard',
  international: 'teal',
};
