/**
 * National days greeting strip (owner's National Days project, Nov 2026): on a country's
 * national day, the homepage greets it under the menu with its flag, one sentence in the
 * country's own language and a translation in the page's language.
 *
 * Rules (owner): civic national days only; excluded countries are never listed; sensitive
 * countries only after the President's word, a week before. Greetings in the country's
 * language are drafts until checked (embassy or a native speaker). Flags: flag-icons (MIT),
 * files in public/flags/, never altered.
 */
import type { UiLang } from '@/i18n/routes';

export type NationalDay = {
  /** MM-DD, Montréal time. */
  day: string;
  /** ISO 3166-1 alpha-2, the flag file in public/flags/. */
  code: string;
  country: Record<UiLang, string>;
  /** The greeting in the country's own language. */
  greeting: { text: string; lang: string; dir: 'ltr' | 'rtl' };
  /** The same greeting in the page's language. */
  translation: Record<UiLang, string>;
};

export const nationalDays: NationalDay[] = [
  {
    day: '11-09',
    code: 'kh',
    country: { fr: 'Cambodge', en: 'Cambodia', fa: 'کامبوج' },
    greeting: { text: 'សូមអបអរសាទរ ទិវាបុណ្យឯករាជ្យជាតិ!', lang: 'km', dir: 'ltr' },
    translation: {
      fr: 'Bonne fête de l’Indépendance au Cambodge !',
      en: 'Happy Independence Day, Cambodia!',
      fa: 'روز استقلال کامبوج خجسته باد!',
    },
  },
  {
    day: '11-18',
    code: 'lv',
    country: { fr: 'Lettonie', en: 'Latvia', fa: 'لتونی' },
    greeting: { text: 'Daudz laimes Latvijas dzimšanas dienā!', lang: 'lv', dir: 'ltr' },
    translation: {
      fr: 'Joyeux anniversaire, Lettonie !',
      en: 'Happy birthday, Latvia!',
      fa: 'زادروز لتونی خجسته باد!',
    },
  },
  {
    day: '11-19',
    code: 'mc',
    country: { fr: 'Monaco', en: 'Monaco', fa: 'موناکو' },
    greeting: { text: 'Bonne fête nationale, Monaco !', lang: 'fr', dir: 'ltr' },
    translation: {
      fr: 'Bonne fête nationale, Monaco !',
      en: 'Happy National Day, Monaco!',
      fa: 'روز ملی موناکو خجسته باد!',
    },
  },
  {
    day: '11-20',
    code: 'om',
    country: { fr: 'Oman', en: 'Oman', fa: 'عمان' },
    greeting: { text: 'كل عام وسلطنة عُمان بخير', lang: 'ar', dir: 'rtl' },
    translation: {
      fr: 'Bonne fête nationale au Sultanat d’Oman !',
      en: 'Happy National Day to the Sultanate of Oman!',
      fa: 'روز ملی سلطنت عمان خجسته باد!',
    },
  },
  {
    day: '11-22',
    code: 'lb',
    country: { fr: 'Liban', en: 'Lebanon', fa: 'لبنان' },
    greeting: { text: 'عيد استقلال سعيد يا لبنان', lang: 'ar', dir: 'rtl' },
    translation: {
      fr: 'Bonne fête de l’Indépendance, Liban !',
      en: 'Happy Independence Day, Lebanon!',
      fa: 'روز استقلال لبنان خجسته باد!',
    },
  },
];

export const nationalDayStrings = {
  label: {
    fr: 'Fête nationale',
    en: 'National Day',
    fa: 'روز ملی',
  },
  from: {
    fr: 'Avec les salutations de l’Institut interculturel Matin',
    en: 'With greetings from Matin Intercultural Institute',
    fa: 'با شادباش مؤسسه میان‌فرهنگی متین',
  },
  close: { fr: 'Fermer', en: 'Close', fa: 'بستن' },
  flagAlt: { fr: 'Drapeau : {country}', en: 'Flag of {country}', fa: 'پرچم {country}' },
} satisfies Record<string, Record<UiLang, string>>;
