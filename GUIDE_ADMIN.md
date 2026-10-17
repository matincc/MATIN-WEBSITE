# Guide de gestion du contenu · Content editing guide

**[Français](#français)** · **[English](#english)**

---

## Français

Ce guide explique comment mettre à jour le site de Matin **sans installer aucun logiciel** : tout se fait dans votre navigateur, sur GitHub.

### Comment ça fonctionne

- Chaque événement, actualité, programme ou membre de l'équipe est un **petit fichier texte** dans le dossier `src/content/`.
- Vous modifiez ces fichiers sur GitHub, puis vous cliquez sur **« Commit changes »** (enregistrer).
- Le site se met à jour **tout seul en 1 à 3 minutes**.
- **Si une erreur se glisse** (un champ oublié, par exemple), la mise à jour est refusée et **l'ancienne version reste en ligne**. Rien ne casse. Vous recevez un courriel de Netlify et il suffit de corriger le fichier.
- Les événements terminés quittent l'agenda automatiquement chaque matin ; ceux de Matin passent dans « Événements passés de Matin ».

### Avant de commencer

1. Ouvrez le dépôt du site : **<https://github.com/imaniman99/matin-website>**.
2. Connectez-vous avec votre compte GitHub (demandez l'accès à la personne responsable technique).

### Les règles d'or

1. **Toujours les deux langues :** chaque texte a une ligne `fr:` et une ligne `en:`. Les deux sont obligatoires.
2. **Mettez le texte entre guillemets droits** `"comme ceci"`, surtout s'il contient `:` ou `#`.
3. **Respectez les espaces au début des lignes** (le retrait). Utilisez la barre d'espace, jamais la touche Tab. Copiez un modèle de ce guide plutôt que de partir de zéro.
4. **Les dates s'écrivent** `2026-10-24` et **les heures** `2026-10-24T19:00` (heure de Montréal, format 24 h).
5. **Le nom du fichier** : minuscules, sans accents ni espaces, avec des tirets. Par exemple `soiree-musiques-du-monde.yaml`.
6. **Retirez `placeholder: true`** (ou mettez `placeholder: false`) quand le contenu est réel.

Pas besoin de vous soucier des espaces avant « : » ou à l'intérieur des « guillemets » : le site applique automatiquement la typographie québécoise.

---

### 1. Ajouter un événement à l'agenda

L'agenda culturel réunit trois sortes d'événements :

- **Événement sélectionné** (`kind: selected`) : un événement organisé par quelqu'un d'autre, que Matin recommande. Il n'a pas de page sur notre site : sa fiche nomme le vrai organisateur et renvoie vers la page officielle de l'organisateur.
- **Événement de Matin** (`kind: matin`) : organisé par Matin. Il a sa propre page.
- **Coorganisé** (`kind: co-organized`) : seulement si la coorganisation est confirmée par écrit.

**Avant d'ajouter un événement sélectionné, vérifiez :**

1. qu'il a un lien réel avec la mission de Matin (dialogue interculturel, politiques et planification culturelles, villes, communautés, recherche, initiatives artistiques pertinentes) ;
2. que l'organisateur est crédible ;
3. la date, l'heure, le lieu, le prix et le statut **sur la page officielle de l'organisateur**, le jour même ;
4. que vous écrivez **votre propre résumé** (n'utilisez pas le texte ni les images de l'organisateur).

Priorité à Montréal et au Québec (environ les trois quarts de l'agenda), puis le reste du Canada, et parfois l'international quand le lien avec notre mission est clair. Sources à surveiller : `EVENTS_WATCHLIST.md`.

**Marche à suivre :**

1. Allez dans le dossier **`src/content/events`**.
2. Cliquez sur **Add file → Create new file**.
3. Nommez le fichier avec la date et un mot-clé, par exemple `2026-11-forum-culture-montreal.yaml`.
4. Copiez le modèle qui convient depuis **`src/content/events/README.md`** (« Selected external event » ou « Matin event ») et remplacez les textes.
5. Remplissez `lastVerified` avec la date du jour où vous avez vérifié la page de l'organisateur.
6. Prix : `free` (gratuit), `paid` (payant, avec un `label` si le montant est connu) ou `unknown` (inconnu). **Ne devinez jamais.**
7. Pour le mettre dans **« Les choix de Matin »**, ajoutez `featuredUntil: "AAAA-MM-JJ"` (au plus 3 sont affichés).
8. Un événement reporté ou annulé : ajoutez `status: postponed` ou `status: cancelled`.
9. Pour préparer un événement sans le publier : ajoutez `draft: true`. Il reste invisible sur le site.
10. Cliquez sur **Commit changes…**, puis de nouveau sur **Commit changes**.

Il manque une information obligatoire (par exemple le lien officiel ou la date de vérification) ? La mise à jour est refusée, la version précédente reste en ligne, et le courriel de Netlify indique le champ manquant.

**Chaque semaine (suggestion) :** revérifiez les événements à venir (dates, annulations, liens) et mettez à jour `lastVerified`. Les événements terminés quittent l'agenda automatiquement.

### 2. Publier un article (Actualités et perspectives)

Dossier **`src/content/news`**, même méthode (Add file → Create new file), puis ce modèle :

```yaml
date: 2026-11-02
author: "Équipe Matin"
category: matin-news # matin-news, perspectives, culture-cities, research, partnerships
tags: [bénévolat, fête]
urlSlug:
  fr: retour-sur-la-fete
  en: festival-recap
title:
  fr: "Retour sur la fête"
  en: "Festival recap"
excerpt:
  fr: "Le résumé affiché sur les cartes (1 ou 2 phrases)."
  en: "The summary shown on cards (1 or 2 sentences)."
body:
  fr: |
    Le texte complet de l'article.
  en: |
    The full article text.
```

**Ajouter une image :**

1. Envoyez la photo dans le dossier `src/assets/uploads/news` avec **Add file → Upload files**.
2. Ajoutez ces lignes dans l'article :

```yaml
image: ../../assets/uploads/news/nom-de-la-photo.jpg
imageAlt:
  fr: "Description de la photo pour les personnes aveugles"
  en: "Description of the photo for blind visitors"
imagePermission: true # obligatoire avec une image : Matin a le droit de publier cette photo
```

N'utilisez que des photos que Matin possède ou qu'il a la permission de publier (accord de la personne qui a pris la photo et des personnes reconnaissables).

**Article sur un événement ou un sujet externe :** indiquez la source, elle s'affiche sous l'article.

```yaml
source:
  name: "Nom de l'organisme ou du média"
  url: https://exemple.org/page
```

**Les cinq catégories** (une catégorie n'apparaît sur le site qu'une fois qu'elle contient un article publié) :

- `matin-news` : **Nouvelles de Matin**. Développements et annonces de l'Institut.
- `perspectives` : **Perspectives**. Articles sur le dialogue interculturel, la diversité culturelle et la planification culturelle.
- `culture-cities` : **Culture et villes**. Politiques culturelles, développement culturel urbain, espaces publics.
- `research` : **Recherche et publications**. Recherches, rapports et publications choisis.
- `partnerships` : **Partenariats et initiatives**. Seulement des collaborations confirmées.

**Brouillon :** ajoutez `draft: true` pour préparer un article sans le publier (il n'apparaît nulle part sur le site ni dans les moteurs de recherche). Le jour de la publication, retirez cette ligne et mettez `date` à la date du jour. Après une mise à jour importante, ajoutez `updated: AAAA-MM-JJ`.

**Persan :** ajoutez `fa:` dans `title`, `excerpt` et `body`, puis `faReviewed: true` après relecture : l'article aura alors sa page en persan.

Les événements ne vont **pas** dans les actualités : ils ont leur propre dossier.

### 2 bis. Après un événement : compte rendu et photos

Ouvrez le fichier de l'événement (dossier `src/content/events`) et ajoutez ce qui suit. Chaque partie n'apparaît que si elle est remplie. Une fois terminé, l'événement passe automatiquement dans « Événements passés de Matin ».

```yaml
report:
  fr: |
    Compte rendu complet de l'événement.
  en: |
    Full report of the event.
highlights:
  - fr: "Un moment fort ou un résultat"
    en: "A highlight or outcome"
photos:
  - image: ../../assets/uploads/events/nom-evenement/photo-1.jpg
    alt:
      fr: "Description de la photo"
      en: "Photo description"
    caption:
      fr: "Légende (facultatif)"
      en: "Caption (optional)"
```

### 3. Ajouter des photos à la galerie

1. Allez dans **`src/assets/uploads/gallery`** et créez un dossier pour l'album. Astuce : dans **Add file → Upload files**, vous pouvez glisser plusieurs photos d'un coup.
2. Vous pouvez envoyer les photos **directement depuis votre téléphone**. Le site les réduit à 2000 pixels, les compresse et **efface la localisation GPS** automatiquement.
3. Dans **`src/content/gallery`**, créez le fichier de l'album :

```yaml
date: 2026-11-21
title:
  fr: "Atelier cuisines du monde"
  en: "World Cuisines Workshop"
description:
  fr: "Une phrase sur l'album."
  en: "One sentence about the album."
photos:
  - image: ../../assets/uploads/gallery/atelier-cuisine/photo-1.jpg
    alt:
      fr: "Deux participantes préparent des dumplings"
      en: "Two participants making dumplings"
  - image: ../../assets/uploads/gallery/atelier-cuisine/photo-2.jpg
    alt:
      fr: "…"
      en: "…"
videos: []
```

**Ajouter une vidéo YouTube** : copiez l'identifiant de la vidéo, soit les 11 caractères après `v=` dans l'adresse YouTube.

```yaml
videos:
  - youtubeId: "AbCdEfGhIjK" # exemple : remplacez par le vrai identifiant
    title:
      fr: "Titre de la vidéo"
      en: "Video title"
```

**Le texte « alt »** décrit la photo pour les personnes qui ne la voient pas. Soyez bref et concret.

**Consentement :** publiez seulement des photos de personnes qui ont accepté d'apparaître en ligne.

### 4. Modifier l'équipe

Dossier **`src/content/team`** : un fichier par personne.

```yaml
group: staff # staff = équipe, board = conseil d'administration
order: 3 # ordre d'affichage
name: "Prénom Nom"
role:
  fr: "Coordination des bénévoles"
  en: "Volunteer Coordinator"
bio:
  fr: "Deux ou trois phrases."
  en: "Two or three sentences."
photo: ../../assets/uploads/team/prenom-nom.jpg # facultatif : sans photo, les initiales s'affichent
```

**Pour retirer quelqu'un** : ouvrez son fichier, cliquez sur **⋯ → Delete file**, puis sur **Commit changes**.

### 5. Modifier un texte existant

1. Ouvrez le fichier.
2. Cliquez sur l'icône **crayon** (Edit).
3. Modifiez le texte.
4. Cliquez sur **Commit changes**.

Où trouver quoi :

| Je veux modifier…                                                                 | Fichier                                                                                |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Adresse, téléphone, courriel, heures, réseaux sociaux, mission, formulaires actifs | `src/content/settings/site.yaml`                                                       |
| Vision, valeurs, historique, mot de la direction                                  | `src/content/about/about.yaml`                                                         |
| Rôles bénévoles, texte sur les partenariats                                       | `src/content/involvement/involvement.yaml`                                             |
| Programmes                                                                        | `src/content/programs/`                                                                |
| Questions fréquentes                                                              | `src/content/faq/`                                                                     |
| Ressources                                                                        | `src/content/resources/`                                                               |
| Rapports annuels                                                                  | `src/content/documents/` (le PDF va dans `public/documents/`)                          |
| Pages légales                                                                     | `src/content/legal/`                                                                   |
| Textes de l'interface (boutons, titres de sections)                               | `src/i18n/fr.ts`, `src/i18n/en.ts`, `src/i18n/fa.ts` (à confier de préférence à la personne technique) |

### Formulaires (intérêt, infolettre, contact, bénévolat)

Les formulaires ne s'affichent comme actifs que lorsque `formsEnabled: true` dans `src/content/settings/site.yaml`. Tant que la réception des messages n'est pas confirmée, laissez `false` : le site affiche alors un message invitant à écrire par courriel. N'activez qu'après avoir testé qu'un envoi arrive bien.

### Persan (فارسی)

Le persan est une langue d'accès supplémentaire : seules l'accueil, « Qui sommes-nous » (mission, vision, valeurs), « S'impliquer » et « Contact » existent en persan. Les autres pages s'ouvrent en anglais avec une courte note.

Pour qu'un événement ou une actualité apparaisse sur le site persan, ajoutez une traduction **révisée par une personne qui parle couramment le persan** :

```yaml
title:
  fr: "…"
  en: "…"
  fa: "…"
faReviewed: true # seulement après révision
```

Liste des traductions à faire réviser : `TRANSLATIONS_FOR_REVIEW.md` (à régénérer avec `npm run translations`).

### Vérifier que la mise à jour est en ligne

- Attendez 1 à 3 minutes, puis rechargez la page du site.
- **Si rien ne change :** vérifiez votre courriel. Netlify écrit quand une mise à jour est refusée, et le message indique **le fichier et le champ en cause** (par exemple `events → atelier-cuisine: title.en: Required`). Corrigez ce fichier.
- **Pour annuler une modification :** ouvrez le fichier, cliquez sur **History**, retrouvez l'ancienne version, puis recopiez-la. En cas de doute, demandez à la personne responsable technique.

### Besoin d'aide ?

Personne-ressource technique : **[NOM ET COURRIEL — à fournir]**.

---

## English

This guide explains how to update the Matin website **without installing any software**: everything happens in your web browser, on GitHub.

### How it works

- Each event, news post, program or team member is a **small text file** in the `src/content/` folder.
- You edit these files on GitHub, then click **"Commit changes"** (save).
- The website **updates itself within 1–3 minutes**.
- **If there's a mistake** (a missing field, for example), the update is rejected and **the previous version stays online**. Nothing breaks. Netlify emails you, and you simply fix the file.
- Events that have ended leave the agenda automatically every morning; Matin's own move to "Past Matin events".

### Before you start

1. Open the website repository: **<https://github.com/imaniman99/matin-website>**.
2. Sign in with your GitHub account (ask the technical contact for access).

### Golden rules

1. **Always both languages:** every text has an `fr:` line and an `en:` line. Both are required.
2. **Put text between straight quotes** `"like this"`, especially if it contains `:` or `#`.
3. **Keep the spaces at the start of lines** (the indentation). Use the space bar, never the Tab key. Copy a template from this guide rather than starting from scratch.
4. **Dates are written** `2026-10-24` and **times** `2026-10-24T19:00` (Montréal time, 24-hour clock).
5. **File names:** lowercase, no accents or spaces, with hyphens. For example `world-music-night.yaml`.
6. **Remove `placeholder: true`** (or set `placeholder: false`) once the content is real.

### 1. Add an event to the agenda

The cultural agenda has three kinds of event:

- **Selected event** (`kind: selected`): organized by someone else and recommended by Matin. It has no page on our site; its card names the real organizer and links to the organizer's official page.
- **Matin event** (`kind: matin`): organized by Matin. It gets its own page.
- **Co-organized** (`kind: co-organized`): only when the co-organization is confirmed in writing.

**Before adding a selected event, check:**

1. that it is genuinely related to Matin's mission (intercultural dialogue, cultural policy and planning, cities, communities, research, relevant arts initiatives);
2. that the organizer is credible;
3. the date, time, place, price and status **on the organizer's official page**, on the same day;
4. that you write **your own summary** (don't reuse the organizer's text or images).

Montréal and Québec first (about three quarters of the agenda), then the rest of Canada, and occasionally international events with a clear link to our mission. Sources to watch: `EVENTS_WATCHLIST.md`.

**Steps:**

1. Go to the **`src/content/events`** folder.
2. Click **Add file → Create new file**.
3. Name the file with the date and a keyword, e.g. `2026-11-culture-montreal-forum.yaml`.
4. Copy the right template from **`src/content/events/README.md`** ("Selected external event" or "Matin event") and replace the texts.
5. Set `lastVerified` to the date you checked the organizer's page.
6. Price: `free`, `paid` (with a `label` if the amount is known) or `unknown`. **Never guess.**
7. To show it in **"Matin's Picks"**, add `featuredUntil: "YYYY-MM-DD"` (3 at most are shown).
8. Postponed or cancelled: add `status: postponed` or `status: cancelled`.
9. To prepare an event without publishing it, add `draft: true`. It stays invisible on the site.
10. Click **Commit changes…**, then **Commit changes** again.

Missing a required field (the official link or the check date, for example)? The update is rejected, the previous version stays online, and Netlify's email names the missing field.

**Every week (suggested):** re-check upcoming events (dates, cancellations, links) and update `lastVerified`. Events that have ended leave the agenda automatically.

### 2. Publish an article (News & Insights)

In the **`src/content/news`** folder, use the same method with the **news template** above.

Choose the `category` (a category appears on the site only once it has a published article): `matin-news` (**Matin News**: the Institute's developments and announcements), `perspectives` (**Perspectives**: articles on intercultural dialogue, cultural diversity and cultural planning), `culture-cities` (**Culture & Cities**: cultural policy, urban cultural development, public space), `research` (**Research & Publications**: selected research, reports and publications) or `partnerships` (**Partnerships & Initiatives**: confirmed collaborations only). Events don't go in News & Insights; they have their own folder.

**Draft:** add `draft: true` to prepare an article without publishing it (it appears nowhere on the site or in search engines). On publication day, remove that line and set `date` to that day. After a substantial update, add `updated: YYYY-MM-DD`.

**Persian:** add `fa:` in `title`, `excerpt` and `body`, then `faReviewed: true` once reviewed: the article then gets its Persian page.

To add a picture, upload it to `src/assets/uploads/news` (**Add file → Upload files**), then add the `image:`, `imageAlt:` and `imagePermission: true` lines. Only use photos Matin owns or has permission to publish. For a post about an outside event or topic, add the `source:` block (name and address); it is shown under the post.

### 2b. After an event: report and photos

Open the event's file and add the `report`, `highlights` and `photos` blocks (template in the French section, “2 bis”). Each part only appears when filled in. The event moves to “Past Matin events” automatically once it's over.

### 3. Add photos to the gallery

1. Upload the photos to a new folder in **`src/assets/uploads/gallery`**. You can drag in several at once.
2. Photos can come **straight from a phone**. The site shrinks them to 2000 pixels, compresses them and **removes GPS location** automatically.
3. Create the album file in **`src/content/gallery`** with the **gallery template** above. Give every photo an `alt` text: a short, concrete description for people who can't see it.
4. For a YouTube video, copy its 11-character ID (after `v=` in the YouTube address).
5. Only publish photos of people who agreed to appear online.

### 4. Edit the team

In **`src/content/team`**, there is one file per person (see the **team template** above). Use `group: staff` for staff or `group: board` for the board.

**To remove someone:** open their file, click **⋯ → Delete file**, then **Commit changes**.

### 5. Edit existing text

1. Open the file.
2. Click the **pencil** icon (Edit).
3. Change the text.
4. Click **Commit changes**.

The table in the French section shows **which file holds what** (contact details and social links are in `src/content/settings/site.yaml`).

### Forms

The forms (interest, newsletter, contact, volunteer) only appear active when `formsEnabled: true` in `src/content/settings/site.yaml`. Keep it `false` until you have confirmed that a test submission really arrives; until then the site invites people to write by email.

### Persian (فارسی)

Persian is an additional access language: only Home, About (mission, vision, values), Get Involved and Contact exist in Persian. Other pages open in English with a short note. For an event or news post to appear on the Persian site, add `fa:` texts **reviewed by a fluent Persian speaker** and `faReviewed: true`. The list of translations to review is in `TRANSLATIONS_FOR_REVIEW.md` (regenerate with `npm run translations`).

### Checking that your update is live

- Wait 1–3 minutes and reload the website.
- **If nothing changed:** check your email. Netlify writes when an update is rejected, and the message names **the file and the field** (e.g. `events → cooking-workshop: title.en: Required`). Fix that file.
- **To undo a change:** open the file, click **History**, find the old version and copy it back. If in doubt, ask the technical contact.

### Need help?

Technical contact: **[NAME AND EMAIL — to be provided]**.
