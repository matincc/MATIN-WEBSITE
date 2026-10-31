/**
 * « Collaboration » page (owner's request, Oct 31 2026: the homepage shows Matin itself,
 * never requests for collaboration; partners, membership, volunteering and the Advisory
 * Circle get their own page and menu item, before Contact). Texts drafted by Claude for
 * the owner's review.
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  title: 'Collaborer avec Matin',
  lede: 'Organismes, membres, bénévoles et spécialistes : voici les façons de bâtir avec nous des ponts entre les cultures.',
  submenu: 'Afficher les sections de la page Collaboration',
  partners: 'Partenaires et soutiens',
  expertise: 'Partagez votre savoir-faire',
};
const en: typeof fr = {
  title: 'Collaborate with Matin',
  lede: 'Organizations, members, volunteers and experts: here are the ways to build bridges between cultures with us.',
  submenu: 'Show the sections of the Collaboration page',
  partners: 'Partners & Supporters',
  expertise: 'Share Your Expertise',
};
const fa: typeof fr = {
  title: 'همکاری با متین',
  lede: 'سازمان‌ها، اعضا، داوطلبان و متخصصان: این‌ها راه‌هایی است که با هم میان فرهنگ‌ها پل بسازیم.',
  submenu: 'نمایش بخش‌های صفحهٔ همکاری',
  partners: 'همکاران و حامیان',
  expertise: 'تخصص خود را به اشتراک بگذارید',
};
const dicts: Record<UiLang, typeof fr> = { fr, en, fa };

export function collabStrings(lang: UiLang): typeof fr {
  const d = dicts[lang] ?? dicts.en;
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typo(v, lang)])) as typeof fr;
}

/** Anchors of the Collaboration page sections (old Contact anchors kept). */
export const collabAnchors = (lang: UiLang) => ({
  expertise: 'expertise',
  partners: 'partenaires',
  membership: lang === 'fr' ? 'adhesion' : 'membership',
  volunteer: lang === 'fr' ? 'benevolat' : 'volunteer',
  advisors: lang === 'fr' ? 'conseillers' : 'advisory-circle',
});
