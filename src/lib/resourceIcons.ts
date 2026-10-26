import { Building, Globe, Landmark, Library, Users } from '@lucide/astro';
import type { ResourceCategory } from '@/lib/taxonomy';

/** One thin-line icon per directory category (homepage and Resources page). */
export const resourceIcons: Record<ResourceCategory, typeof Landmark> = {
  municipal: Building,
  federal: Landmark,
  quebec: Library,
  community: Users,
  international: Globe,
};

/** Accent of each category, in the Matin palette (the four directory modules). */
export const resourceAccents: Record<ResourceCategory, string> = {
  municipal: 'terracotta',
  federal: 'navy',
  quebec: 'teal',
  community: 'mustard',
  international: 'teal',
};
