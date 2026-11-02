/**
 * « Plan stratégique » page (owner's request, Nov 2 2026: an item under About; the PDF
 * comes later). Texts drafted by Claude for the owner's review. The page shows the PDF
 * once a file is added in public/documents/ (see STRATEGIC_PLAN_FILES in the view).
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  title: 'Plan stratégique de Matin',
  lede: 'Les orientations qui guident le travail de l’Institut interculturel Matin dans les années à venir.',
  docTitle: 'Plan stratégique de l’Institut interculturel Matin',
  intro: 'Ce document présente la mission de Matin, ses priorités et les objectifs qu’il se donne pour relier les personnes, les cultures et les communautés.',
  read: 'Lire le plan (PDF)',
  download: 'Télécharger',
  pdfNote: 'Document PDF, s’ouvre dans un nouvel onglet.',
  frenchOnly: 'Ce document est publié en français.',
  empty: 'Le plan stratégique de Matin sera publié sur cette page prochainement.',
  emptyCta: 'Nous écrire',
};
const en: typeof fr = {
  title: 'Matin Strategic Plan',
  lede: 'The directions that guide the work of the Matin Intercultural Institute in the years ahead.',
  docTitle: 'Strategic Plan of the Matin Intercultural Institute',
  intro: 'This document sets out Matin’s mission, its priorities and the goals it sets itself to connect people, cultures and communities.',
  read: 'Read the plan (PDF)',
  download: 'Download',
  pdfNote: 'PDF document, opens in a new tab.',
  frenchOnly: 'This document is published in French.',
  empty: 'Matin’s strategic plan will be published on this page soon.',
  emptyCta: 'Write to us',
};
const fa: typeof fr = {
  title: 'برنامهٔ راهبردی متین',
  lede: 'جهت‌گیری‌هایی که فعالیت‌های مؤسسه میان‌فرهنگی متین را در سال‌های پیش رو هدایت می‌کنند.',
  docTitle: 'برنامهٔ راهبردی مؤسسه میان‌فرهنگی متین',
  intro: 'این سند مأموریت متین، اولویت‌ها و هدف‌هایی را که برای پیوند میان مردم، فرهنگ‌ها و جامعه‌ها در نظر دارد، معرفی می‌کند.',
  read: 'خواندن برنامه (PDF)',
  download: 'دریافت فایل',
  pdfNote: 'فایل PDF، در برگهٔ تازه باز می‌شود.',
  frenchOnly: 'این سند به زبان فرانسوی منتشر شده است.',
  empty: 'برنامهٔ راهبردی متین به‌زودی در همین صفحه منتشر می‌شود.',
  emptyCta: 'برای ما بنویسید',
};
const dicts: Record<UiLang, typeof fr> = { fr, en, fa };

export function planStrings(lang: UiLang): typeof fr {
  const d = dicts[lang] ?? dicts.en;
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typo(v, lang)])) as typeof fr;
}
