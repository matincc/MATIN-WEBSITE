/** "Add to calendar" helpers: .ics files (RFC 5545) and Google Calendar links. */
import { cityOf, type EventEntry } from './content';
import type { Lang } from '@/i18n/routes';

/** 20261024T230000Z */
const utcStamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');

/** Escape text per RFC 5545 §3.3.11. */
const esc = (s: string) =>
  s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/([,;])/g, '\\$1');

/** Fold lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  for (const ch of line) {
    if (new TextEncoder().encode(current + ch).length > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = ch;
    } else current += ch;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function eventIcs(event: EventEntry, lang: Lang, url: string): string {
  const d = event.data;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Matin Institut interculturel//Site//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@matin-institut`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(event.startDate)}`,
    `DTEND:${utcStamp(event.endDate)}`,
    `SUMMARY:${esc(d.title[lang])}`,
    `DESCRIPTION:${esc(`${d.summary[lang]}\n\n${url}`)}`,
    `LOCATION:${esc(placeOf(event, lang))}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function googleCalendarUrl(event: EventEntry, lang: Lang, url: string): string {
  const d = event.data;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: d.title[lang],
    dates: `${utcStamp(event.startDate)}/${utcStamp(event.endDate)}`,
    details: `${d.summary[lang]}\n\n${url}`,
    location: placeOf(event, lang),
    ctz: d.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/** Venue, address and city on one line; "Online" events have only their city. */
function placeOf(event: EventEntry, lang: Lang): string {
  const { location, format } = event.data;
  const city = cityOf(event, lang);
  if (format === 'online' || !location) return city;
  return [location.name, location.address ?? city].join(', ');
}

export function mapUrl(location: { name: string; address?: string; mapUrl?: string }): string {
  return (
    location.mapUrl ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address ?? location.name)}`
  );
}
