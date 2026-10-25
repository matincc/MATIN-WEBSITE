# Cultural Resources & Organizations · Ressources et organismes culturels

A curated directory of major cultural institutions and organizations, shown on the Resources
page (/fr/ressources/, /en/resources/, /fa/resources/) and summarized on the homepage.
**Listing an organization never means a partnership, endorsement, sponsorship or
affiliation with Matin.**

Four categories (owner's brief, Oct 25 2026): `federal` (Canadian federal cultural
institutions), `quebec` (Québec cultural institutions), `community` (major cultural and
community organizations and public cultural bodies), `international` (international
cultural organizations and networks).

The easiest way to manage entries is the admin at **/admin/** (see `GUIDE_ADMIN.md`).
By hand: one YAML file per organization in this folder.

```yaml
name: 'Conseil des arts et des lettres du Québec (CALQ)' # official name (French form)
nameEn: 'Canada Council for the Arts' # optional: English form, only if the organization uses one
category: quebec # federal, quebec, community, international
url: https://www.calq.gouv.qc.ca/ # the organization's own official page, https:// (never a generic portal)
label: # the short clickable name on the card (Persian uses the English one)
  fr: 'CALQ'
  en: 'CALQ'
kind: # optional small tag, e.g. to say a body is public or a nonprofit
  fr: 'Organisme public municipal'
  en: 'Municipal public body'
  fa: 'نهاد عمومی شهری'
logo: ../../assets/uploads/resources/calq.png # official logo, optional (see below)
description:
  fr: '…'
  en: '…'
  fa: '…'
order: 20 # lower numbers first within a category
published: true
```

**Logos:** only the organization's genuine official logo, taken from its own website or press
kit, unaltered (no recolouring, cropping or redrawing), with a transparent or white
background, at most about 600px wide. Until a verified logo is set, the card shows the
organization's short name as text: never an invented logo or a generic icon.
Entries with `published: false` stay off the site.
