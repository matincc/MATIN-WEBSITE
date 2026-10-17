# team · Notre équipe · Our Team

One YAML file per person, e.g. `02-prenom-nom.yaml` (the number sets the order).
The section "Our Team" on the About page shows the published members; it is hidden
while there are none. Room is planned for five portraits (more also works).

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
