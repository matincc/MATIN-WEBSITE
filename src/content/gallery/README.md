# gallery · Matin Moments

One YAML file per album. Easiest: the admin, **/admin/** (see `GUIDE_ADMIN.md`).

Only real Matin photos and videos, published with consent: an album appears on the site
only with `consent: true`. No sample or placeholder entries; while this folder has no
published album, the homepage and the Gallery show a short "coming soon" message.

```yaml
title: { fr: 'Promenade d’automne', en: 'Autumn Walk' }
date: 2026-11-07
location: { fr: 'Parc Angrignon, LaSalle', en: 'Angrignon Park, LaSalle' }
description: { fr: '…', en: '…' }
isEvent: true # listed under the "Events" filter
cover: ../../assets/uploads/gallery/walk-cover.jpg # optional
photos:
  - image: ../../assets/uploads/gallery/walk-1.jpg
    alt: { fr: '…', en: '…' } # short description for people who cannot see it
    featured: true # shown in "Matin Moments" on the homepage
videos:
  - title: { fr: '…', en: '…' }
    youtube: https://www.youtube.com/watch?v=XXXXXXXXXXX # or file: /media/clip.mp4
    featured: false
consent: true
order: 100
draft: false
```
