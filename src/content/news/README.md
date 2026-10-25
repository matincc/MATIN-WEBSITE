# Actualités · News

One YAML file per **approved** item, e.g. `2026-11-nouveau-partenariat.yaml`. Full guide: `GUIDE_ADMIN.md`.
Events do not go here: they have their own folder (`src/content/events`).

**Only approved items enter this folder.** The repository is public, so proposed, pending or
rejected stories never go here, not even as drafts: they stay in the private shortlist that
Claude prepares for the President. Once he approves an item, it is added here.

Two sections, never mixed (owner's brief, Oct 25 2026):

- `recommends`: **Cultural News / Actualité culturelle / اخبار فرهنگی**. External stories selected
  by Matin. Required: `source` (name and link of the original article) and `region`
  (`montreal`, `canada` with the rest of Québec, or `international`). `date` is the source's
  publication date, not the date of an event it mentions. The summary is short and in Matin's
  own words; never copy the article. The card links straight to the source.
- `matin-news`: **Matin News / Nouvelles de Matin / اخبار متین**. The institute's official news,
  with its own article page.

Other fields: `archived: true` takes an outdated item off the site (kept in the history);
`draft: true` shows an item only on the local preview (`npm run dev`); `updated` after a
substantial change. Images: only with the right to use them (`imagePermission: true`), with
`imageCredit` for anything Matin did not make itself.

```yaml
date: 2027-03-02
author:
  fr: 'Institut interculturel Matin'
  en: 'Matin Intercultural Institute'
  fa: 'مؤسسه میان‌فرهنگی متین'
category: matin-news # or recommends
# region: montreal    (Cultural News only: montreal, canada, international)
# source:             (Cultural News only)
#   name: "Nom du média ou de l'organisme"
#   url: https://…
# updated: 2027-03-10
# archived: true
urlSlug:
  fr: titre-en-francais
  en: title-in-english
title:
  fr: "Titre"
  en: "Title"
excerpt:
  fr: "Résumé en une ou deux phrases."
  en: "One- or two-sentence summary."
body:
  fr: |
    Texte.
  en: |
    Text.

# Optional image:
# image: ../../assets/uploads/news/photo.jpg
# imageAlt: { fr: "Description", en: "Description" }
# imageCredit: "Photo : Nom, CC BY 4.0"
# imagePermission: true

# Persian (optional): add `fa:` to title, excerpt and body, then faReviewed: true once a
# fluent speaker has reviewed it. Only then does the item appear on the Persian pages.
```
