import type { UiLang as Lang } from '@/i18n/routes';
import { NBSP } from './frenchTypo';

export const TIME_ZONE = 'America/Toronto'; // Montréal uses Eastern Time.

/**
 * Event times are entered as local time without an offset ("2026-10-24T19:00"),
 * Montréal by default. Convert them to a real instant, accounting for daylight saving.
 */
export function montrealTime(local: string, timeZone = TIME_ZONE): Date {
  const [datePart, timePart = '00:00'] = local.split('T');
  const [y, m, d] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const asUtc = Date.UTC(y, m - 1, d, hh, mm);
  // Offset of Montréal at (approximately) that instant, in minutes.
  const offset = tzOffsetMinutes(new Date(asUtc), timeZone);
  const guess = new Date(asUtc - offset * 60_000);
  // Re-check once in case the guess crossed a DST boundary.
  const offset2 = tzOffsetMinutes(guess, timeZone);
  return offset2 === offset ? guess : new Date(asUtc - offset2 * 60_000);
}

function tzOffsetMinutes(date: Date, timeZone: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
  return Math.round((local - date.getTime()) / 60_000);
}

// Persian: Gregorian calendar (Montréal dates) with Persian digits and month names.
const locale = (lang: Lang) =>
  lang === 'fr' ? 'fr-CA' : lang === 'fa' ? 'fa-IR-u-ca-gregory' : 'en-CA';

/**
 * « 4 octobre 2026 » / "October 4, 2026".
 * `dateOnly` for calendar dates parsed from YAML (stored as UTC midnight).
 */
export function formatDate(date: Date, lang: Lang, dateOnly = true): string {
  return new Intl.DateTimeFormat(locale(lang), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: dateOnly ? 'UTC' : TIME_ZONE,
  }).format(date);
}

/** « samedi 24 octobre 2026 » / "Saturday, October 24, 2026" */
export function formatLongDate(date: Date, lang: Lang, timeZone = TIME_ZONE): string {
  return new Intl.DateTimeFormat(locale(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(date);
}

/** Québec 24 h style « 19 h » / « 19 h 30 »; English "7:00 p.m." */
export function formatTime(date: Date, lang: Lang, timeZone = TIME_ZONE): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  if (lang === 'fr') {
    const h = String(Number(parts.hour));
    return parts.minute === '00' ? `${h}${NBSP}h` : `${h}${NBSP}h${NBSP}${parts.minute}`;
  }
  return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-CA', {
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: lang === 'fa' ? 'h23' : undefined,
    timeZone,
  }).format(date);
}

export function formatTimeRange(
  start: Date,
  end: Date | undefined,
  lang: Lang,
  timeZone = TIME_ZONE,
): string {
  return end
    ? `${formatTime(start, lang, timeZone)} – ${formatTime(end, lang, timeZone)}`
    : formatTime(start, lang, timeZone);
}

/**
 * When an event happens: one day with its hours (« samedi 24 octobre 2026 · 19 h – 21 h HAE »),
 * or a date range for multi-day and all-day events (« 2 nov. – 8 nov. 2026 »).
 */
export function formatWhen(
  start: Date,
  end: Date | undefined,
  lang: Lang,
  { allDay = false, timeZone = TIME_ZONE } = {},
): string {
  const day = (d: Date) => d.toLocaleDateString('en-CA', { timeZone });
  if (end && day(end) !== day(start)) {
    const fmt = new Intl.DateTimeFormat(locale(lang), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    });
    return fmt.formatRange(start, end);
  }
  const date = formatLongDate(start, lang, timeZone);
  if (allDay) return date;
  const range = formatTimeRange(start, end, lang, timeZone);
  // Persian has no common short name for Montréal's time zone (only « −۵ گرینویچ »).
  if (lang === 'fa') return `${date} · ${range}`;
  return `${date} · ${range} ${formatZone(start, lang, timeZone)}`;
}

/** Short time-zone name for that date: « HAE » / "EDT", "CET"… */
export function formatZone(date: Date, lang: Lang, timeZone = TIME_ZONE): string {
  return (
    new Intl.DateTimeFormat(locale(lang), { timeZone, timeZoneName: 'short' })
      .formatToParts(date)
      .find((p) => p.type === 'timeZoneName')?.value ?? ''
  );
}

/** Short pieces for date badges: { day: "24", month: "oct." } */
export function dateBadge(date: Date, lang: Lang, timeZone = TIME_ZONE) {
  const day = new Intl.DateTimeFormat(locale(lang), { day: 'numeric', timeZone }).format(date);
  const month = new Intl.DateTimeFormat(locale(lang), {
    month: 'short',
    timeZone,
  }).format(date);
  return { day, month };
}
