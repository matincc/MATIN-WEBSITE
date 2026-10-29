/**
 * Notes from the President as a journal (owner's brief, Oct 29 2026): one page per note
 * with its own address, reading time from the text, and the welcome note pinned apart.
 */
import type { CollectionEntry } from 'astro:content';
import { href, type Alternates, type UiLang } from '@/i18n/routes';
import { typo } from '@/lib/frenchTypo';

type Note = CollectionEntry<'notes'>;

/** Address of a note's page: its `slug`, else its file name without the date. */
export const noteSlug = (note: Note) =>
  note.data.slug ?? (note.id.replace(/^\d{4}-\d{2}-\d{2}-?/, '') || note.id);

export const noteHref = (note: Note, lang: UiLang) => href('notes', lang, noteSlug(note));
export const noteAlternates = (note: Note): Alternates => ({
  fr: noteHref(note, 'fr'),
  en: noteHref(note, 'en'),
  fa: noteHref(note, 'fa'),
});

/** The President's welcome note (« Un mot personnel… »), pinned at the top of the journal. */
export const welcomeSlug = { fr: 'mot-de-bienvenue', en: 'welcome-note', fa: 'welcome-note' };
export const welcomeHref = (lang: UiLang) => href('notes', lang, welcomeSlug[lang]);
export const welcomeAlternates = (): Alternates => ({
  fr: welcomeHref('fr'),
  en: welcomeHref('en'),
  fa: welcomeHref('fa'),
});

export const splitParagraphs = (text: string) =>
  text
    .trim()
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean);

/** Reading time in minutes (about 200 words a minute), in the page's digits. */
export function readingTime(text: string, lang: UiLang): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : lang).format(
    Math.max(1, Math.round(words / 200)),
  );
}

/** The opening paragraphs, about two lines' worth, for previews (never rewritten). */
export function excerptOf(paragraphs: string[], min = 220): string {
  const out: string[] = [];
  for (const para of paragraphs) {
    out.push(para);
    if (out.join(' ').length >= min) break;
  }
  return out.join(' ');
}

/** What a page in `lang` shows of a note: its own text, or the original with a label. */
export function noteView(note: Note, lang: UiLang) {
  const n = note.data;
  const shownLang = n.text[lang] ? lang : n.original;
  const raw = n.text[shownLang]!;
  const text = shownLang === 'fr' ? typo(raw, 'fr') : raw;
  const headlineRaw = n.headline?.[shownLang];
  const headline = headlineRaw && shownLang === 'fr' ? typo(headlineRaw, 'fr') : headlineRaw;
  const paragraphs = splitParagraphs(text);
  return {
    shownLang,
    /** The page shows the original in another language (no translation yet). */
    foreign: shownLang !== lang,
    /** The page shows a translation of a note written in another language. */
    isTranslation: shownLang === lang && shownLang !== n.original,
    headline,
    paragraphs,
    /** The opening paragraphs, for previews (the text itself, never rewritten). */
    excerpt: excerptOf(paragraphs),
    minutes: readingTime(text, lang),
    datetime: n.date.toISOString().slice(0, 10),
  };
}
