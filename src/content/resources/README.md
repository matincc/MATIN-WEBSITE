# Cultural Resources & Organizations · Ressources et organismes culturels

A curated directory of public, cultural, community and research organizations, shown on
the Resources page (/fr/ressources/, /en/resources/) and summarized on the homepage.
**Listing an organization never means a partnership, endorsement, sponsorship or
affiliation with Matin.**

The easiest way to manage entries is the admin at **/admin/** (see `GUIDE_ADMIN.md`).
By hand: one YAML file per organization in this folder.

```yaml
name: 'Ville de Montréal' # official name
nameEn: 'City of Montréal' # optional: English form, only if the organization uses one
category: municipal # municipal, government, arts, community, research, other
url: https://montreal.ca/ # official website, https://
logo: ../../assets/uploads/resources/ville-de-montreal.png # official logo, optional
description: # optional, short
  fr: '…'
  en: '…'
location: Montréal # optional: jurisdiction or area
order: 10 # lower numbers first within a category
published: true # only once name, website and logo are verified
```

Only use an organization's official logo where it is permitted, unaltered (no recolouring
or cropping). Entries with `published: false` stay off the site.
