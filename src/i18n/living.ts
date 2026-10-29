/**
 * Interface strings of the Living homepage (owner's "Living Cultural Institution" brief,
 * Oct 29 2026). Only short interface words: every section text comes from the approved
 * strings in fr.ts / en.ts / fa.ts and from the content files. Every string exists in the
 * three languages.
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  tempPhoto: 'Photo temporaire',
  photoCredit: 'Photo : {author} / {source}',
  unsplashLicense: 'Licence Unsplash',
  tempNote:
    'Les photos marquées « Photo temporaire » illustrent des thèmes en attendant les photos de Matin. Elles ne montrent ni les activités ni les membres de Matin.',
  featured: 'À la une',
  readFullNote: 'Lire le mot complet',
  all: 'Tout',
  filterLabel: 'Filtrer par région',
  prev: 'Précédent',
  next: 'Suivant',
  programsAll: 'Découvrir nos programmes',
};

type LivingDict = typeof fr;

const en: LivingDict = {
  tempPhoto: 'Temporary photo',
  photoCredit: 'Photo: {author} / {source}',
  unsplashLicense: 'Unsplash License',
  tempNote:
    'Photos marked "Temporary photo" illustrate themes until Matin’s own photos replace them. They do not show Matin’s activities or members.',
  featured: 'Featured',
  readFullNote: 'Read the full note',
  all: 'All',
  filterLabel: 'Filter by region',
  prev: 'Previous',
  next: 'Next',
  programsAll: 'Explore our programs',
};

const fa: LivingDict = {
  tempPhoto: 'عکس موقت',
  photoCredit: 'عکس: {author} / {source}',
  unsplashLicense: 'مجوز Unsplash',
  tempNote:
    'عکس‌هایی که برچسب «عکس موقت» دارند، تا زمانی که عکس‌های خود متین جایگزینشان شود، فقط موضوع‌ها را نشان می‌دهند. این عکس‌ها فعالیت‌ها یا اعضای متین را نشان نمی‌دهند.',
  featured: 'برجسته',
  readFullNote: 'خواندن متن کامل',
  all: 'همه',
  filterLabel: 'پالایش بر اساس منطقه',
  prev: 'قبلی',
  next: 'بعدی',
  programsAll: 'برنامه‌های ما را ببینید',
};

const dicts: Record<UiLang, LivingDict> = { fr, en, fa };

/** The Living homepage strings of one language, French typography applied. */
export function livingStrings(lang: UiLang): LivingDict {
  const d = dicts[lang];
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typo(v, lang)])) as LivingDict;
}
