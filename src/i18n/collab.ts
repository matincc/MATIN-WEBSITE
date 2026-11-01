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
  lede2: 'Choisissez votre façon de vous joindre à Matin : chaque case ouvre son formulaire.',
  volunteerTeaser: 'Donnez de votre temps et de vos talents aux activités de Matin, sur place ou en ligne.',
  advisorsTeaser: 'Chercheurs, spécialistes, artistes et praticiens : rejoignez le réseau d’expertise de Matin.',
  partnersTeaser: 'Organismes, conseils communautaires et entreprises : bâtissons des projets ensemble ou soutenez notre travail.',
  open: 'Ouvrir le formulaire',
  openPartners: 'Voir les détails',
  close: 'Fermer',
};
const en: typeof fr = {
  title: 'Collaborate with Matin',
  lede: 'Organizations, members, volunteers and experts: here are the ways to build bridges between cultures with us.',
  submenu: 'Show the sections of the Collaboration page',
  partners: 'Partners & Supporters',
  expertise: 'Share Your Expertise',
  lede2: 'Choose how you would like to join Matin: each box opens its form.',
  volunteerTeaser: 'Give your time and talents to Matin’s activities, in person or online.',
  advisorsTeaser: 'Researchers, specialists, artists and practitioners: join Matin’s network of expertise.',
  partnersTeaser: 'Organizations, community councils and businesses: build projects with us or support our work.',
  open: 'Open the form',
  openPartners: 'See details',
  close: 'Close',
};
const fa: typeof fr = {
  title: 'همکاری با متین',
  lede: 'سازمان‌ها، اعضا، داوطلبان و متخصصان: این‌ها راه‌هایی است که با هم میان فرهنگ‌ها پل بسازیم.',
  submenu: 'نمایش بخش‌های صفحهٔ همکاری',
  partners: 'همکاران و حامیان',
  expertise: 'تخصص خود را به اشتراک بگذارید',
  lede2: 'راه پیوستن خود به متین را انتخاب کنید: هر کادر فرم خودش را باز می‌کند.',
  volunteerTeaser: 'وقت و توانایی‌هایتان را، حضوری یا آنلاین، در فعالیت‌های متین به کار بگیرید.',
  advisorsTeaser: 'پژوهشگران، متخصصان، هنرمندان و کنشگران: به شبکهٔ تخصصی متین بپیوندید.',
  partnersTeaser: 'سازمان‌ها، شوراهای محلی و کسب‌وکارها: با هم پروژه بسازیم یا از کار ما حمایت کنید.',
  open: 'باز کردن فرم',
  openPartners: 'دیدن جزئیات',
  close: 'بستن',
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
