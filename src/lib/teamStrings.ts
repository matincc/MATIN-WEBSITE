/**
 * Interface words of the Our Team redesign (owner's brief « The People Behind Matin »,
 * Oct 29 2026), kept here rather than in src/i18n so this page can ship on its own.
 * French and Persian are drafts for the owner's review.
 */
import type { UiLang } from '@/i18n/routes';

type Text = Record<UiLang, string>;

export const teamStrings: Record<'peopleBehind' | 'inWords' | 'readNotes', Text> = {
  peopleBehind: {
    fr: 'Les personnes derrière Matin',
    en: 'The People Behind Matin',
    fa: 'کسانی که متین را می‌سازند',
  },
  /** Under Mina's, Hakan's and Benoît's names: a link down to their own words on culture. */
  inWords: {
    fr: 'Dans les mots de {name}',
    en: 'In {name}’s words',
    fa: 'از زبان {name}',
  },
  readNotes: {
    fr: 'Lire ses notes',
    en: 'Read his notes',
    fa: 'یادداشت‌هایش را بخوانید',
  },
};

export const teamText = (
  key: keyof typeof teamStrings,
  lang: UiLang,
  vars: Record<string, string> = {},
) =>
  Object.entries(vars).reduce((text, [k, v]) => text.replace(`{${k}}`, v), teamStrings[key][lang]);
