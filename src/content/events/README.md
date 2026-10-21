# Événements · Events & Cultural Agenda

One YAML file per event, e.g. `2026-11-culture-montreal-forum.yaml`. Full guide: `GUIDE_ADMIN.md`.
Sources to watch: `EVENTS_WATCHLIST.md`.

Only real, verified events go here. Never invent an event, a date, a partner or a price.
Once an event's end time has passed it leaves the upcoming agenda automatically; only
Matin's own and co-organized events then appear in "Past Matin events".

There are three kinds of event:

- `selected`: an external event chosen for the agenda. It has no page on this site; its
  card names the real organizer and links to the organizer's own page.
- `matin`: organized by Matin. It gets its own page, an .ics file and, afterwards, an
  archive entry.
- `co-organized`: only when the co-organization is documented. Same as `matin`, and the
  partner is named as organizer.

## Selected external event

```yaml
kind: selected
organizer:
  name: "Culture Montréal" # the real organizer, exactly as they write it
  url: https://culturemontreal.ca
title: # keep the official title; translate only if the organizer does
  fr: "Titre officiel"
  en: "Official title"
summary: # 1–2 sentences written by Matin; never copy the organizer's text
  fr: "Résumé original."
  en: "Original summary."
whyItMatters: # one sentence: why Matin's audience should care
  fr: "Pourquoi c'est pertinent."
  en: "Why it matters."
subject: policy # dialogue, policy, cities, community, arts, research
region: montreal # montreal, quebec, canada, international
city: Montréal
# country: France          (only outside Canada)
format: in-person # in-person, online, hybrid
language: fr # fr, en, bilingual, other (only if stated by the organizer)
start: "2026-11-12T18:30" # local time of the event, 24 h
end: "2026-11-12T20:30"
# timeZone: Europe/Paris   (only if the event is not on Montréal time)
location: # leave out for online events
  name: "Nom du lieu"
  address: "Adresse, Montréal, QC"
price:
  type: unknown # free, paid or unknown; never guess
  # label: { fr: "15 $", en: "$15" }
eventUrl: https://… # the official event page (required)
# registrationUrl: https://…
sourceUrl: https://… # where you found / checked it
lastVerified: "2026-10-17" # date you last checked the organizer's page (required)
# status: postponed        (scheduled by default; or cancelled)
# featuredUntil: "2026-10-31"   adds it to "Matin's Picks" until that date (max 3 shown)
# draft: true                   visible only on the local preview, never on the live site
```

## Matin event (or documented co-organized event)

Same fields, with `kind: matin` (or `co-organized`), `organizer: { name: Matin }` (or the
partner's name), a full `body` in French and English, and optionally `urlSlug`, `image`
with `imageAlt`, and `registrationUrl`. `eventUrl`, `whyItMatters` and `lastVerified` are
not needed.

```yaml
kind: matin
organizer:
  name: Matin
urlSlug:
  fr: table-ronde-planification-culturelle
  en: cultural-planning-roundtable
title:
  fr: "Table ronde : planification culturelle et diversité"
  en: "Roundtable: Cultural Planning and Diversity"
summary:
  fr: "Une phrase qui présente l'événement."
  en: "One sentence introducing the event."
body:
  fr: |
    Description complète en français.
  en: |
    Full description in English.
subject: policy
region: montreal
city: Montréal
format: in-person
language: bilingual
start: "2027-03-21T14:00"
end: "2027-03-21T16:30"
location:
  name: "Nom du lieu"
  address: "Adresse complète, Montréal, QC"
price:
  type: free

# --- After the event (optional; each part appears only when filled in) ---
# report:
#   fr: |
#     Compte rendu complet…
#   en: |
#     Full report…
# highlights:
#   - fr: "Un moment fort ou un résultat"
#     en: "A highlight or outcome"
# --- Official poster (optional) ---
# image: ../../assets/uploads/events/nom-evenement/affiche.jpg
# imageAlt: { fr: "Affiche officielle…", en: "Official poster…", fa: "پوستر رسمی…" }
# imageIsPoster: true   shown whole (never cropped) on the homepage and the event page
#
# --- Persian page (optional) ---
# Add fa to title, summary and body, then faReviewed: true: the event gets a Persian page
# (/fa/events/<english-slug>/). A venue name can differ per language:
# location: { name: { fr: "Parc Angrignon", en: "Angrignon Park", fa: "پارک آنگرینیون" } }
#
# photos:
#   - image: ../../assets/uploads/events/nom-evenement/photo-1.jpg
#     alt: { fr: "Description de la photo", en: "Photo description" }
#     caption: { fr: "Légende", en: "Caption" }
```

## Persian (optional)

Add `fa:` next to `fr:`/`en:` in `title`, `summary` and `whyItMatters`, then set
`faReviewed: true` once a Persian speaker has reviewed it. Only then does the event appear
on Persian pages.
