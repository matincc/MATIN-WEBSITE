# Homepage images: where each one lives and how to replace it

The Living homepage (Oct 29 2026) takes every photograph from **one file**:
`src/lib/media.ts`. Components never contain an image address; they name a *slot*. Change
the slot, and every place that uses it follows. The layout never depends on a photo's size:
each place crops the photo to its own shape (arch, circle, rounded rectangle, wide band).

## The slots

| Slot | Where on the homepage | Shape | Now | Kind |
| --- | --- | --- | --- | --- |
| `introConversation` | Who we are, large photo of the collage | arch, 4:5 | Young friends of different origins sitting together (photo chosen by Matin, Oct 29 2026) | temporary, local file `who-friends-group.jpg`, source to confirm |
| `introMaking` | Who we are, round photo | circle | Women making pottery (Sander Breneman) | temporary, Unsplash |
| `introGallery` | Who we are, third photo | rounded, 3:2 | Three people at the CDN-NDG participatory budget board (photo chosen by Matin, Oct 29 2026) | local file `intro-participatory-budget.jpg`, source to confirm |
| `montrealWide` | Full-width pause before Programs | 21:9 (4:3 on phones) | Mont-Royal bench over Montréal (Marion Lhn) | temporary, Unsplash |
| `areaDialogue` | Programs, area 1 | rounded, 5:4 | Friends laughing and talking (Priscilla Du Preez) | temporary, Unsplash |
| `areaCommunities` | Programs, area 2 | circle | Community garden (Haberdoedas) | temporary, Unsplash |
| `areaResearch` | Programs, area 3 | arch, 5:4 | Women and men mapping their city on a table map (photo chosen by Matin, Oct 29 2026) | temporary, local file `area-cultural-mapping.jpg`, source to confirm |
| `participation` | "Share Your Expertise with Matin" panel | arch, 4:5 | Discussion circle, Montréal (Iñaki LL) | openly licensed, Wikimedia Commons |

Not in the registry (they are Matin's own and stay where they are):

- Hero: Les Tam-Tams photo, `src/lib/heroMedia.ts` (owner's rule: same photo, same crop, nothing over it).
- Matin in Action: the event's poster (`src/content/events/…`) and the coming-soon posters (`src/content/coming-soon/`).
- President's note: `src/assets/photos/president-casual.jpg`.
- Matin's Picks: each event's own `image` in its YAML file.

## Replacing a temporary photo with a Matin photo

1. Put the photo in `src/assets/photos/` (JPEG; at least 2000 px wide for `montrealWide`,
   1600 px for the others). Only photos Matin may publish: for people who can be
   recognized, their consent.
2. In `src/lib/media.ts`, import it at the top:
   `import walk2026 from '@/assets/photos/walk-2026.jpg';`
3. In the slot, replace the line `unsplash: 'photo-…',` with `src: walk2026,`.
4. Set `temporary: false`, update `shows`,
   and the `credit`: photographer's name, `license: 'Tous droits réservés'`,
   `licenseUrl` and `source` pointing to https://matincc.ca/, `sourceName: 'Matin'`.
5. Adjust `focus` if needed: the point that must stay visible when the photo is cropped,
   as CSS `object-position` (`'50% 30%'` keeps faces near the top in view).

## Temporary photos (Unsplash)

- Licence: the [Unsplash License](https://unsplash.com/license): free for commercial and
  non-commercial use, no permission or payment needed. Unsplash asks that its photos be
  loaded from its own image server and credited; the site does both (the CSP in
  `astro.config.mjs` allows `https://images.unsplash.com` for this). Credits link to the
  photographer's Unsplash page.
- They illustrate themes only. They are never presented as Matin's events, members or
  partners. On Matin's request (Oct 29 2026) they carry no « Photo temporaire » label,
  only a very small credit.
- When the last one is replaced, `https://images.unsplash.com` can be removed from the CSP.

| Slot | Photographer | Unsplash page |
| --- | --- | --- |
| introMaking | Sander Breneman | https://unsplash.com/photos/a-group-of-women-sitting-at-a-table-working-on-pottery-kJiPUr1KQSE |
| montrealWide | Marion Lhn | https://unsplash.com/photos/two-people-sitting-on-a-bench-overlooking-a-city-LmCnmjT7fNI |
| areaDialogue | Priscilla Du Preez | https://unsplash.com/photos/people-laughing-and-talking-outside-during-daytime-nF8xhLMmg0c |
| areaCommunities | Haberdoedas | https://unsplash.com/photos/people-gathering-in-a-community-garden-with-trees-in-background-c9xGzxR8ego |
