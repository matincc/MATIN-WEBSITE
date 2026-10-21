# highlights · Matin en action · Matin in Action

One YAML file per item Matin wants on the homepage: an initiative, a poster, a video,
an announcement or a report. Only Matin's own content (organized, hosted or produced by
Matin), never invented, and never someone else's event.

Matin's own events (`src/content/events/`, `kind: matin` or `co-organized`) and published
news (`src/content/news/`) appear on the homepage automatically: you don't need a
highlight for them. Use a highlight to feature something else, or to choose exactly what
is shown large at the top of the homepage (`featured: true`).

What the homepage shows:

- **Matin in Action** (large, near the top): the highlight with `featured: true`; if there
  is none, Matin's next event; if there is none, the latest article.
- **Latest From Matin**: the next three items (upcoming events first, then the newest).
- Nothing yet? A short message invites visitors to subscribe to the newsletter.

```yaml
type: poster # initiative, event, news, announcement, report, video or poster
title:
  fr: 'Titre'
  en: 'Title'
  # fa: '…'          (then faReviewed: true once reviewed)
summary:
  fr: 'Une ou deux phrases.'
  en: 'One or two sentences.'
image: ../../assets/uploads/highlights/nom-du-fichier.jpg # photo, poster or video thumbnail
imageAlt:
  fr: 'Description de l’image'
  en: 'Image description'
imagePermission: true # Matin owns the image or has permission to publish it
date: 2026-11-15 # date shown on the card
# endDate: 2026-11-16
# location: { fr: 'Parc La Fontaine, Montréal', en: 'Parc La Fontaine, Montréal' }
url: /fr/evenements/ # where the button leads: a page of this site or a full https:// link
# ctaLabel: { fr: 'S’inscrire', en: 'Register' }   (optional: a label suited to the type is used)
featured: true # shown large in "Matin in Action" (one at a time)
# until: 2026-11-16  (hidden from the homepage after this date)
draft: true # remove once approved
```
