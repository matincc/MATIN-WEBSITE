# Through Montréal's calendar (seasonal greetings and free outings)

Owner's idea (Oct 30 2026): the homepage reacts to the real life of Montréal. One YAML
file per occasion; `SeasonalBand.astro` shows it by itself from `showFrom` to `showUntil`
(Montréal dates, both included), right under "Coming up" on the homepage, in FR, EN and FA.
Several occasions on the same day are shown one under the other. Nothing to rebuild:
every future occasion is already in the page and the visitor's browser picks the day's.

## Rules

- Greet every community and faith alike, warmly and briefly: no theology, no politics,
  nothing that could hurt anyone (religion, origin, sex, colour, language). No LGBTQ
  content (owner's standing rule). Days of remembrance use `tone: solemn`.
- Never invent an occasion, a date or an activity. Check the date (`dateSource`).
- Outings: FREE only, from municipal or public bodies only (LaSalle borough first, then the
  Ville de Montréal and its boroughs, libraries, maisons de la culture). Never private,
  paid, or unknown-organizer events. `organizer` is the public body, never Matin.
  `url` is the official page; `image` is the official image (used only in Google's
  structured data); `lastVerified` is the day it was checked. The summary is written by
  Matin, never copied. Outings disappear by themselves once they end.
- Each outing gets complete schema.org Event data automatically (owner's rule).

## Planned next (dates to check before adding)

Lunar New Year, Valentine's Day, March 8, Nowruz, Eid al-Fitr, Easter, Passover,
Vaisakhi, National Indigenous Peoples Day (June 21), Fête nationale (June 24),
Canada Day (July 1), Eid al-Adha, Mid-Autumn Festival.
