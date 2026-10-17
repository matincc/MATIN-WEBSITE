# Actualités · News

One YAML file per article, e.g. `nouveau-partenariat.yaml`. Full guide: `GUIDE_ADMIN.md`.
Events do not go here: they have their own folder (`src/content/events`).

Five categories (a category appears on the site only once it has a published article):

- `matin-news`: **Matin News / Nouvelles de Matin**. The Institute's developments and announcements.
- `perspectives`: **Perspectives**. Articles on intercultural dialogue, cultural diversity and cultural planning.
- `culture-cities`: **Culture & Cities / Culture et villes**. Cultural policy, urban cultural development, public space.
- `research`: **Research & Publications / Recherche et publications**. Selected research, reports and publications.
- `partnerships`: **Partnerships & Initiatives / Partenariats et initiatives**. Confirmed collaborations only.

Add `draft: true` while an article is being reviewed: drafts appear only on the local preview
(`npm run dev`), never on the live site, in listings, feeds, the sitemap or search engines.

```yaml
date: 2027-03-02
author: "Équipe Matin"
category: matin-news # perspectives, culture-cities, research, partnerships
# updated: 2027-03-10   (optional, after a substantial update)
# draft: true          (while under review)
urlSlug:
  fr: titre-en-francais
  en: title-in-english
title:
  fr: "Titre de l'article"
  en: "Article title"
excerpt:
  fr: "Résumé en une ou deux phrases."
  en: "One- or two-sentence summary."
body:
  fr: |
    Texte complet.
  en: |
    Full text.

# Optional image. Use only photos Matin owns or has permission to publish
# (photographer's consent and consent of recognizable people):
# image: ../../assets/uploads/news/photo.jpg
# imageAlt: { fr: "Description", en: "Description" }
# imagePermission: true

# Optional source, when the article discusses an external event or issue:
# source:
#   name: "Nom de l'organisme ou du média"
#   url: https://…

# Persian (optional): add `fa:` to title, excerpt and body, then faReviewed: true
# once reviewed. Only then does the article appear on Persian pages.
```
