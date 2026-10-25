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

### 2. Publier une actualité (Actualités)

La page **Actualités** a deux sections, jamais mélangées :

- **Actualité culturelle** (`category: recommends`) : des nouvelles externes choisies par Matin, en trois onglets (Montréal, Canada, Ailleurs dans le monde). Obligatoires : la `source` (nom et lien de l'article original) et la `region` (`montreal`, `canada` ou `international`). La `date` est celle de la publication par la source, pas celle d'un événement dont elle parle. Le résumé est court et écrit par Matin ; on ne copie jamais l'article. La carte mène directement à la source.
- **Nouvelles de Matin** (`category: matin-news`) : les nouvelles officielles de l'Institut, avec leur propre page.

**Seules les actualités approuvées par le président entrent dans le dépôt.** Le dépôt est public : les propositions en attente ou refusées n'y vont jamais, même en brouillon. Le déroulement complet (recherche, liste de propositions, approbation, publication) est décrit dans le guide `reports/news-workflow-guide-2026-10-25.md` des fichiers du projet.

**Le plus simple : la page d'administration** (`/admin`, collection « News · Actualités »). Chaque champ est expliqué. Chaque enregistrement publie le site en quelques minutes (une mise à jour Netlify).

**Sans l'administration :** dossier **`src/content/news`**, même méthode (Add file → Create new file), avec le modèle de `src/content/news/README.md`.

**Image :** seulement une image que Matin possède ou a le droit d'utiliser. Envoyez-la dans `src/assets/uploads/news`, puis ajoutez `image:`, `imageAlt:`, `imageCredit:` (auteur et licence) et `imagePermission: true`. Sans image, la carte montre le motif du dialogue.

**Retirer une actualité dépassée :** cochez « Archived » (ou ajoutez `archived: true`). Elle quitte le site mais reste dans l'historique.

**Brouillon :** `draft: true` ne montre l'article que sur l'aperçu local (`npm run dev`). Après une mise à jour importante, ajoutez `updated: AAAA-MM-JJ`.

**Persan :** ajoutez `fa:` dans `title`, `excerpt` et `body`, puis `faReviewed: true` après relecture par une personne qui parle persan couramment : l'actualité apparaît alors sur la page persane.

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

### 3. La galerie « Moments de Matin », la vidéo de présentation et le répertoire des ressources

Ces trois contenus se gèrent **sans toucher au code**, depuis l'espace d'administration :
**https://matincc.ca/admin/**

**Se connecter (une seule fois par appareil)**

1. Il faut un compte GitHub qui a le droit de modifier le dépôt `matincc/MATIN-WEBSITE`
   (le compte `matincc`, ou une personne invitée comme collaboratrice).
2. Sur GitHub : **Settings → Developer settings → Personal access tokens → Fine-grained
   tokens → Generate new token**. Dépôt : seulement `MATIN-WEBSITE`. Permission :
   **Contents : Read and write**. Copiez le jeton.
3. Sur https://matincc.ca/admin/, choisissez **« Sign In Using Access Token »** et collez
   le jeton. Ne le partagez jamais.

(Option : pour un bouton « Sign In with GitHub » sans jeton, ajoutez GitHub comme
fournisseur OAuth dans Netlify → Site configuration → Access & security → OAuth.)

**Chaque « Save » publie** : l'administration enregistre la modification sur GitHub
(branche `main`) et Netlify met le site à jour en quelques minutes. Chaque enregistrement
utilise des crédits de construction Netlify : regroupez vos modifications quand c'est
possible.

**Galerie (Gallery · Galerie)** : un album par activité : titre, date, lieu, courte
description, photos (JPEG, PNG ou WebP, avec une description « alt » pour chacune),
vidéos (lien YouTube recommandé, ou court fichier MP4/WebM de moins de 50 Mo), image de
couverture. Cochez **« Featured on the homepage »** sur les photos ou vidéos à montrer dans
« Moments de Matin » (les cinq premières sont affichées). Cochez **« Album of a Matin
event »** pour le filtre « Événements ». **Le consentement est obligatoire** : un album
n'apparaît sur le site que si la case de consentement est cochée (accord du ou de la
photographe et des personnes reconnaissables). « Unpublished » retire l'album du site.

**Vidéo de présentation (Intro video)** : collez le lien YouTube de « Matin is Born » (ou
téléversez le fichier). Elle s'affiche alors en grand sur la page d'accueil et en tête de
la Galerie.

**Ressources et organismes culturels** : un organisme par fiche : nom officiel, catégorie,
site officiel (https://…), logo officiel, courte description, territoire, ordre. Il
n'apparaît que lorsque **« Published on the site »** est coché, après vérification du nom,
du site et du logo. **Ce répertoire n'est pas une liste de partenaires** : n'écrivez jamais
« partenaire » pour un organisme qui n'a pas d'entente avec Matin. Cinq organismes sont
déjà préparés (Ville de Montréal, Arrondissement de LaSalle, ministère de la Culture et
des Communications, MIFI, Conseil des arts de Montréal) : ajoutez leur logo officiel puis
cochez « Published ».

Sans l'administration, les mêmes fichiers YAML se modifient à la main dans
`src/content/gallery/`, `src/content/intro-video/` et `src/content/resources/`
(voir le README de chaque dossier).

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

### 2. Publish a news item (News)

The **News** page has two sections, never mixed:

- **Cultural News** (`category: recommends`): external stories selected by Matin, in three tabs (Montréal, Canada, Around the World). Required: the `source` (name and link of the original article) and the `region` (`montreal`, `canada` or `international`). `date` is the source's publication date, not the date of an event it mentions. The summary is short and in Matin's own words; never copy the article. The card links straight to the source.
- **Matin News** (`category: matin-news`): the institute's official news, each with its own page.

**Only news the President approved enters the repository.** It is public: pending or rejected proposals never go there, not even as drafts. The full workflow (research, shortlist, approval, publication) is in `reports/news-workflow-guide-2026-10-25.md` in the project files.

**Easiest: the admin page** (`/admin`, "News · Actualités" collection). Every field is explained. Each save publishes the site within a few minutes (one Netlify build).

**Without the admin:** the **`src/content/news`** folder, same method, with the template in `src/content/news/README.md`.

**Image:** only an image Matin owns or has the right to use. Upload it to `src/assets/uploads/news`, then add `image:`, `imageAlt:`, `imageCredit:` (author and licence) and `imagePermission: true`. Without an image, the card shows the dialogue motif.

**Take an outdated item off the site:** tick "Archived" (or add `archived: true`). It leaves the site but stays in the history.

**Draft:** `draft: true` shows an item only on the local preview (`npm run dev`). After a substantial update, add `updated: YYYY-MM-DD`.

**Persian:** add `fa:` in `title`, `excerpt` and `body`, then `faReviewed: true` once a fluent speaker has reviewed it: the item then appears on the Persian page.

### 2b. After an event: report and photos

Open the event's file and add the `report`, `highlights` and `photos` blocks (template in the French section, “2 bis”). Each part only appears when filled in. The event moves to “Past Matin events” automatically once it's over.

### 3. Gallery ("Matin Moments"), intro video and Resources directory

These are managed **without touching code**, in the admin: **https://matincc.ca/admin/**

- **Sign in** (once per device): a GitHub account with write access to
  `matincc/MATIN-WEBSITE`; create a fine-grained personal access token (repository
  `MATIN-WEBSITE` only, permission **Contents: Read and write**) and choose **"Sign In Using
  Access Token"**. Never share the token. Optional: add GitHub as an OAuth provider in
  Netlify (Site configuration → Access & security → OAuth) for a one-click sign-in.
- **Every "Save" publishes**: the change is committed to `main` and Netlify rebuilds the
  site in a few minutes (each save uses Netlify build credits; group changes).
- **Gallery**: one album per activity: title, date, place, description, photos (JPEG,
  PNG, WebP, each with alt text), videos (YouTube link recommended, or a short MP4/WebM
  under 50 MB), cover image. Tick **"Featured on the homepage"** for "Matin Moments" (the
  first five show). Tick **"Album of a Matin event"** for the Events filter. **Consent is
  required**: an album only appears once the consent box is ticked. "Unpublished" hides it.
- **Intro video**: paste the YouTube link of "Matin is Born" (or upload the file); it then
  appears large on the homepage and at the top of the Gallery.
- **Cultural Resources & Organizations**: one entry per organization (official name,
  category, https website, official logo, description, area, order). It appears only when
  **"Published on the site"** is ticked, once name, website and logo are verified. **Not a
  list of partners.** Five organizations are prepared and unpublished, waiting for their
  official logos.

Without the admin, edit the YAML files in `src/content/gallery/`,
`src/content/intro-video/` and `src/content/resources/` (see each folder's README).

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
