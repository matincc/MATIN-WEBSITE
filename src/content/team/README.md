# team · Notre équipe · Our Team

One YAML file per person, e.g. `02-prenom-nom.yaml` (the number sets the order).
The "Team" section of the Our Team page (`/fr/equipe/`, `/en/team/`, `/fa/team/`) shows
the published members first, then empty places with a woman or man silhouette up to five
in all: each published member takes the next empty place. More than five also works.
The President's portrait and biography are shown above, from `src/content/about/about.yaml`.

Only real, approved profiles: never invent a name, a role, a photo or a biography.
Keep `draft: true` until the person has approved their photo and text; drafts appear only
on the local preview (`npm run dev`).

```yaml
name: 'Prénom Nom'
role:
  fr: 'Titre officiel'
  en: 'Official title'
  # fa: '…'            (then faReviewed: true once reviewed)
bio: # optional, two or three sentences
  fr: '…'
  en: '…'
photo: ../../assets/uploads/team/prenom-nom.jpg # square portrait, approved by the person
linkedin: https://www.linkedin.com/in/… # optional, the person's own profile
order: 2
draft: true
```
