# Matin Intercultural Institute website: standing rules

These rules apply to every page, now and in the future. Read them before changing anything.

## 1. Identity and wording

- Matin is an **INSTITUTE**, not a community centre. Its scope is culture, dialogue, research, and social development.
- The organization's legal objects do NOT allow teaching services. **Never use these words anywhere on the site** (text, buttons, alt text, meta tags, URLs, code comments visible to users):
  - EN: course, class, training, teaching, school
  - FR: cours, formation, enseignement, école
  - (CSS class names and code keywords such as `class=` are not user-facing and are fine.)
- Tone: professional and credible, but warm and human. Not stiff, not overly casual.
- No food or party imagery.
- Use the texts the institute provides **EXACTLY** as written: no rewording, no "improvements," same order, same punctuation (including French « » quotation marks and spaces before French colons and semicolons). `src/lib/frenchTypo.ts` only turns existing spaces into non-breaking ones; it never adds or removes punctuation.
- **Keep the languages in sync:** whenever text changes in one language (English, French or Persian), make the equivalent change in the same place in the other languages, in the same edit. Persian only where that page or string has a Persian version.
- No `[PLACEHOLDER]` tags and no placeholder or sample text anywhere. Content that is not provided yet is simply not shown (lists show a short empty-state message; optional settings such as address, phone, email and hours are hidden until set).

## 2. Typography

- **Nunito** (rounded, warm), via `--font-display`: headings (extra bold), navigation, buttons, small-caps labels, links with arrows, the "Intercultural Institute" lockup text.
- **DM Sans**, via `--font-sans`: body and reading text (400–500), forms, captions. Chosen in Oct 2026 after testing Nunito Sans, Plus Jakarta Sans, Manrope and Outfit on real pages: only Nunito keeps the soft, rounded character for headings; DM Sans reads best for long French text.
- **Playfair Display, extra bold:** only the "Matin" wordmark (`Lockup.astro`, `Wordmark.astro`, via `--font-brand`), to match the logo.
- **Playfair Display, bold italic:** only the homepage tagline "Cultures in Dialogue" (gold). Persian pages use Vazirmatn bold for it.
- **Vazirmatn:** Persian pages.
- All are self-hosted through `@fontsource` (imported in `src/styles/global.css`); the CSP blocks Google Fonts, so do not add a Google Fonts link.
- Desktop sizes: small-caps label about 22px; hero headline about 88px (on split layouts it scales with the panel so "Intercultural" / "interculturel" never breaks); hero paragraph about 22px. Scale down smoothly on tablet and mobile with `clamp()` so nothing overflows.

## 3. Colors: the Matin color system

The variables below, defined once in `:root` in `src/styles/global.css`. They are the ONLY colors on the site. The Tailwind tokens (`text-primary`, `bg-paper`, `bg-tint`, `bg-coral`, `var(--color-gold)`…) all point at them; use those tokens or the variables, never raw hex, rgb or named colors.

Navy and cream carry the identity. Coral, mustard, teal and terracotta are the "cultures in dialogue" accents (owner's palette, Oct 2026): use them selectively, for accents, card stripes, icon tiles, bands and simple shapes, never all at full strength in one small area.

| Variable | Value | Use |
| --- | --- | --- |
| `--matin-blue` | `#193A53` | Deep navy, primary brand color: headings, hero panel, footer, President band, main buttons, links, icons, small labels (tokens `primary`, `navy`) |
| `--matin-cream` | `#F5EBDD` | Warm cream: alternate section backgrounds and page banners (tokens `tint`, `cream`) |
| `--matin-paper` | `#FFFCF7` | Warm white: main page background (token `paper`) |
| `--matin-gold` | `#D8A548` | Mustard gold: thin lines, maple leaves, the homepage tagline, the main button on navy (tokens `gold`, `mustard`) |
| `--matin-coral` | `#D86C58` | Coral: shapes, stripes, icon tiles only, never text (token `coral`) |
| `--matin-teal` | `#408C8D` | Teal: shapes, stripes, icon tiles; text only when large (token `teal`, alias `turquoise`) |
| `--matin-terracotta` | `#A95542` | Terracotta: the homepage Get Involved band, with white text (token `terracotta`) |
| `--matin-teal-deep` | `#2C6A6B` | Text-safe teal: labels on light backgrounds, the newsletter panel with white text (token `teal-deep`) |
| `--matin-terracotta-deep` | `#9A4636` | Text-safe terracotta: labels on light backgrounds, including coral-accented ones (token `terracotta-deep`) |
| `--matin-ink` | `#293442` | Body text, also secondary text (tokens `ink`, `muted`) |
| `--matin-white` | `#FFFFFF` | Cards, inputs, text on navy, terracotta and teal-deep (token `white`) |
| `--matin-red` | `#B33B42` | Maple red: use sparingly, only for the Canadian brand identity (token `maple`); not used yet |

- Proportions: about 55% paper/white, 15% cream, 20% navy, 10% accents.
- **Accent sets:** add `data-accent="coral|mustard|teal|terracotta|navy"` to a card or tile; it sets `--accent` (shapes, borders) and `--accent-ink` (text-safe label color). Homepage and About: Mission = coral, Vision = mustard, Values = teal; the three areas of work = coral, mustard, teal; event cards take the accent of their subject (`EventCard.astro`).
- **Bands:** navy (`on-dark`: mustard labels, white titles, mustard main button with navy text), terracotta (`on-terracotta`) and teal-deep (`on-teal`): white text, cream labels, navy main button. Focus rings: mustard on navy, white on terracotta and teal-deep.
- **Dialogue motif:** soft, translucent overlapping circles (`DialogueArt.astro`), the shapes of cultures meeting. It is the cover for any entry without a photo (`CoverArt.astro`: news, programs; event cards use it with the subject's icon), and the hero's two overlapping circular photos echo it. Flat colors only.
- **Mosaic:** the four short color bars (`.mosaic`, coral · mustard · teal · terracotta) are the site's signature: hero panel, page banners, footer edge, newsletter panel. Decorative, `aria-hidden`.
- **Mustard and coral are never text on paper, cream or white** (2.1 to 3.4:1, fails); teal only as large text. Use navy or the `-deep` variants for small labels, dates and icons.
- The old `gold-dark` token maps to navy: use it (or `primary`) for small labels, dates and icons.
- No green and no dark green anywhere.
- Only exceptions to "variables only": `theme-color` in `BaseLayout.astro` and `site.webmanifest` (must be literal hex, `#193A53`), and the arrow color inside the select-box data URIs.

## 4. Style

- Warm, human, editorial: a contemporary cultural magazine, not a corporate template. Generous but intentional white space; no narrow columns floating in empty space.
- No gradients, no heavy shadows or effects, no busy decorative patterns (no waves, rays or glows). Flat color blocks behind photos and the mosaic are the only graphic shapes.
- **Cards:** one shared base, the `.card` class: white, softly rounded corners, very light border, generous padding, no shadow at rest (`.card-lift` adds a soft one on hover). Cards may add a 5 to 6px accent stripe on top.
- **Motion and color (owner's request, Oct 2026):** the site should feel alive, not static. Allowed, always within the Matin palette above and never with gradients: a slow zoom on the hero photo and a staggered rise of its text; the navy "dialogue" ribbon under the hero (`CulturesRibbon.astro`); scroll fade-ins with `data-reveal` (optional `--reveal-delay`); a gentle lift with a soft navy shadow on hover for cards that are links (`.card-lift`); the slowly turning artwork in the homepage event banner (`SpotlightBanner.astro`). Every animation stops under `prefers-reduced-motion: reduce`.
- **Width:** `.container-site` is up to 90rem wide (about 1344px of content). Sections use full-width backgrounds and `.section-pad` for vertical rhythm. Long paragraphs keep a readable measure (about 40 to 46rem) inside two-column compositions rather than stretching across the screen.
- **Typography scale:** body 18px; section titles `clamp()` up to 56px, extra bold; page titles up to 72px; hero name about 88px.
- **Hero:** navy text panel on the reading side, the Montréal skyline photo to the edge of the screen on the other (photo on top on phones), with the two main calls to action (Get Involved, Explore All Events).
- **Highlighted event:** `spotlight: true` in an event's YAML file shows it as the large navy banner at the top of the homepage events section until it ends (one at a time).
- **Section titles:** always use `src/components/ui/SectionHeader.astro`, with under the title a thin gold line on each side of a small gold maple leaf (`LeafRule.astro`, inline SVG). Page sections pass `align="start"`, which puts the title on the reading side with the lede or link beside it on wide screens; `align="center"` is kept for short, isolated headings.
- **Inner page banners:** `PageLayout.astro`: cream band, breadcrumbs, large start-aligned title, lede beside it on wide screens, mosaic along the bottom edge.
- **Photography:** people first: authentic, candid, documentary photos, natural daylight where possible; never artificial-looking corporate stock, never identifiable politicians or public figures, and no food or party imagery. The site currently uses openly licensed Wikimedia Commons photos of Montréal's cultural life, all listed in `src/lib/photos.ts`. They illustrate themes and are NOT presented as Matin activities: each is always shown with its credit (`PhotoCredit.astro`: author, licence and source links). **To replace one** with a Matin photo, add the file to `src/assets/photos/`, point that entry's `src` at it and update its `credit`; every page using it follows. Illustrative photos use `alt=""`.
- **Footer:** the four-color mosaic on top, a quiet Montréal skyline silhouette (`MontrealSkyline.astro`: Mont-Royal, downtown, the Olympic Stadium tower, the Jacques-Cartier Bridge) standing on the copyright bar.

## 5. Accessibility and responsiveness

- Real heading hierarchy: one `h1` per page, then `h2`/`h3` in order.
- Contrast (WCAG AA, checked): ink on paper 11.8, navy on paper 11.1, navy on cream 10.1, navy on white 11.9, white on navy 11.9, mustard on navy 5.3, navy on mustard 5.3, white on terracotta 5.2, white on teal-deep 6.2, teal-deep on cream 5.3, terracotta-deep on cream 5.4. Never mustard, coral or teal small text on paper, cream or white.
- Buttons (pill-shaped, gentle lift on hover): `.btn-primary` = navy with white text, darker navy on hover (mustard with navy text inside `on-dark` bands; navy inside terracotta and teal bands); `.btn-outline` = secondary, light background with a thin mustard border and navy text (transparent with a white border and white text on colored bands).
- Links: blue, gold underline on hover. Header navigation: blue text, a thin gold underline grows in on hover and stays under the current page.
- Everything works with the keyboard, with visible focus styles (navy outline; mustard on navy sections; white on terracotta and teal-deep).
- Decorative icons, lines and maple leaves get `aria-hidden="true"`. Meaningful images get proper alt text in both languages.
- Set the `lang` attribute correctly on each language version (`BaseLayout.astro` does this: `fr-CA`, `en-CA`, `fa`).
- Fully responsive: desktop, tablet, mobile, with no horizontal scroll.
- English and French versions must have IDENTICAL layout and design. Only the text changes. (Each page is one view in `src/views/` rendered by both `src/pages/en/` and `src/pages/fr/`.)

## 6. Future pages

When asked for another page (Programs, Events, News, Get Involved, Contact), write its content in both English and French, in the same tone and design, following every rule above, especially the banned-words rule.

---

## How the project is organized

- **Stack:** Astro 7 (static), Tailwind CSS 4, TypeScript. Deployed on Netlify. `npm run dev` for local work, `npm run build` to check types, build and index search.
- **Pages:** `src/pages/{fr,en,fa}/…` are thin wrappers; the markup lives in `src/views/*.astro` and takes a `lang` prop.
- **Languages:** French (default) and English are complete; Persian (`fa`, RTL) covers Home, About (values only), Get Involved and Contact. Localized URLs are in `src/i18n/routes.ts`.
- **Interface strings:** `src/i18n/fr.ts` (defines the type), `en.ts`, `fa.ts`.
- **Editable content:** YAML in `src/content/` (schemas in `src/content.config.ts`). About page texts: `src/content/about/about.yaml`; mission and contact details: `src/content/settings/site.yaml`.
- **Logo:** the original files are `assets/logo-circle.jpg` and `assets/logo-vertical.jpg`. `npm run icons` cuts the circle into `src/assets/brand/logo-circle.png` (not currently shown on any page) and the favicons. Never redraw, recolor or add rings around the logo.
- **President photo:** add `src/assets/brand/president.jpg` (or .png / .webp) and it replaces the initials badge automatically.
- **Windows note:** don't rewrite French source files with PowerShell `Get-Content | Set-Content` (it corrupts UTF-8); use the editor tools or Node.

## Publishing

- The site is published automatically by Netlify whenever changes are pushed to the `main` branch on GitHub.
- The repo is public, so Netlify will build commits from any collaborator.
- Never deploy to Netlify manually or with the Netlify CLI. Just push to `main`.
- Always commit under the GitHub name `matincc` and email `matincc.mtl@gmail.com`, not `imaniman99`.
- Group several edits into one push when possible, because each push uses Netlify build credits.
