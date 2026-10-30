/**
 * Interface strings of the seasonal calendar band (`SeasonalBand.astro`, owner's idea,
 * Oct 30 2026). The greetings themselves live in src/content/seasons/. Every string exists
 * in the three languages.
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  label: 'Au fil du calendrier montréalais',
  eventsTitle: 'Sorties gratuites près de chez vous',
  notOurs:
    'Matin n’organise pas ces activités : nous les partageons avec vous. Elles sont gratuites et offertes par des organismes publics. Vérifiez les détails sur la page officielle avant de vous déplacer.',
  free: 'Gratuit',
  registration: 'Sur inscription',
  by: 'Organisé par {name}',
  details: 'Page officielle',
};

type SeasonsDict = typeof fr;

const en: SeasonsDict = {
  label: 'Through Montréal’s calendar',
  eventsTitle: 'Free outings near you',
  notOurs:
    'Matin does not organize these activities: we are sharing them with you. They are free and offered by public bodies. Check the details on the official page before you go.',
  free: 'Free',
  registration: 'Registration required',
  by: 'Organized by {name}',
  details: 'Official page',
};

const fa: SeasonsDict = {
  label: 'در گذر تقویم مونترال',
  eventsTitle: 'برنامه‌های رایگان نزدیک شما',
  notOurs:
    'متین این برنامه‌ها را برگزار نمی‌کند؛ فقط آن‌ها را با شما در میان می‌گذارد. همهٔ آن‌ها رایگان‌اند و نهادهای عمومی برگزارشان می‌کنند. پیش از رفتن، جزئیات را در صفحهٔ رسمی ببینید.',
  free: 'رایگان',
  registration: 'با ثبت‌نام',
  by: 'برگزارکننده: {name}',
  details: 'صفحهٔ رسمی',
};

const dicts: Record<UiLang, SeasonsDict> = { fr, en, fa };

/** The band's strings in one language, French typography applied. */
export function seasonStrings(lang: UiLang): SeasonsDict {
  const d = dicts[lang];
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typo(v, lang)])) as SeasonsDict;
}
