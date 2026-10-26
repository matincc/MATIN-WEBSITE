import fr, { type Dictionary } from './fr';
import en from './en';
import fa from './fa';
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

/** Persian has every page; any missing Persian key falls back to English. */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> };

const dictionaries: Record<UiLang, DeepPartial<Dictionary>> = { fr, en, fa };

// Dotted key paths into the dictionary, e.g. "nav.about".
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];
export type TKey = Leaves<Dictionary>;

const lookup = (dict: unknown, key: string): unknown => {
  let value = dict;
  for (const part of key.split('.')) value = (value as Record<string, unknown>)?.[part];
  return value;
};

/**
 * Returns a translator bound to one language.
 * `t('carousel.slideOf', { n: 1, total: 3 })` → "Témoignage 1 sur 3"
 */
export function useTranslations(lang: UiLang) {
  const dict = dictionaries[lang];
  return function t(key: TKey, vars?: Record<string, string | number>): string {
    let value = lookup(dict, key);
    if (typeof value !== 'string' && lang === 'fa') value = lookup(en, key);
    if (typeof value !== 'string') throw new Error(`Missing translation "${key}" for ${lang}`);
    const filled = vars
      ? value.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
      : value;
    return typo(filled, lang);
  };
}

/** True when the Persian dictionary has its own text for this key (no English fallback). */
export const hasFa = (key: TKey) => typeof lookup(fa, key) === 'string';

type Multilingual<T> = { fr: T; en: T; fa?: T };

/**
 * Pick the right language from a content field { fr, en, fa? }.
 * Persian falls back to English when no Persian text exists.
 */
export function pick<T>(field: Multilingual<T> | undefined, lang: UiLang): T | undefined {
  if (!field) return undefined;
  const value = lang === 'fa' ? (field.fa ?? field.en) : field[lang];
  return typeof value === 'string' ? (typo(value, lang) as T) : value;
}
