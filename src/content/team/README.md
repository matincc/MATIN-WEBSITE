# team · Notre équipe · Our Team

One YAML file per person, e.g. `02-prenom-nom.yaml` (the number sets the order).
The Our Team page (`/fr/equipe/`, `/en/team/`, `/fa/team/`) has three parts (owner's brief,
Oct 24 2026): the President (portrait and biography from `src/content/about/about.yaml`),
the **Executive Team** (`group: executive`, people who coordinate and manage day-to-day
operations) and the **Advisors & Friends of Matin** (`group: advisor`, voluntary
contributors, never presented as staff or officers). `group: board` (governance) is kept
apart and not shown yet. A part without published members shows one short line, never
empty cards.

Only real, approved profiles: never invent a name, a role, a photo or a biography.
Keep `draft: true` until the person has approved their photo and text; drafts appear only
on the local preview (`npm run dev`).

```yaml
name: 'Prénom Nom'
# nameFa: '…'        (optional, the name in Persian script)
role:
  fr: 'Titre officiel'
  en: 'Official title'
  # fa: '…'            (then faReviewed: true once reviewed)
group: executive # executive | advisor | board
bio: # optional, two or three sentences, shown on the card
  fr: '…'
  en: '…'
fullBio: # optional, the longer approved biography, under « Read the full biography »
  fr: '…'
  en: '…'
photo: ../../assets/uploads/team/prenom-nom.jpg # square portrait, approved by the person
linkedin: https://www.linkedin.com/in/… # optional, the person's own profile
order: 2
draft: true
```
