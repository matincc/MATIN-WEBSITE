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

- **Nunito** (rounded, warm): the whole site, headings (bold) and body text, labels, buttons.
- **Playfair Display, extra bold:** only the "Matin" wordmark (`Lockup.astro`, `Wordmark.astro`, via `--font-brand`), to match the logo.
- **Playfair Display, bold italic:** only the homepage tagline "Cultures in Dialogue" (gold). Persian pages use Vazirmatn bold for it.
- **Vazirmatn:** Persian pages.
- All are self-hosted through `@fontsource` (imported in `src/styles/global.css`); the CSP blocks Google Fonts, so do not add a Google Fonts link.
- Desktop sizes: small-caps label about 22px; hero headline about 88px; hero paragraph about 22px. Scale down smoothly on tablet and mobile with `clamp()` so nothing overflows.

## 3. Colors: the Matin color system

The variables below, defined once in `:root` in `src/styles/global.css`. They are the ONLY colors on the site. The Tailwind tokens (`text-primary`, `bg-cream`, `bg-tint`, `var(--color-gold)`…) all point at them; use those tokens or the variables, never raw hex, rgb or named colors.

| Variable | Value | Use |
| --- | --- | --- |
| `--matin-blue` | `#103B59` | Deep petroleum blue, primary brand color: headings, footer, President band, main buttons, links, icons, small labels (token `primary`) |
| `--matin-gold` | `#C69C46` | Warm gold: thin lines, dividers, maple leaves, secondary-button borders, hover and active underlines, the homepage tagline (token `gold`) |
| `--matin-cream` | `#F7F3EA` | Soft warm cream: main page background (token `cream`) |
| `--matin-sand` | `#EFE4D2` | Warm sand: alternate section backgrounds (token `tint`); card borders are a light gold mix (token `line`) |
| `--matin-teal` | `#6BA8AC` | Secondary accent: illustrations only (token `turquoise`); no longer used for backgrounds |
| `--matin-ink` | `#293442` | Body text, also secondary text (tokens `ink`, `muted`) |
| `--matin-white` | `#FFFFFF` | Cards, inputs, text on blue (token `white`) |
| `--matin-red` | `#B33B42` | Maple red: use sparingly, only for the Canadian brand identity (token `maple`); not used yet |

- Warm palette (owner's choice, Oct 2026): proportions about 60% cream/white, 15% sand, 20% blue, 5% gold.
- Page background is cream; cards are white on cream; alternate sections use the warm sand `tint`. Long text is ink on cream or white.
- The footer, the President band and the homepage Get Involved band are blue with white or cream text (class `on-dark`). On blue bands the small label is gold, the title white, and `.btn-primary` becomes a gold button with blue text (4.6:1); this is the only place gold fills a button.
- **Gold is never a large background and never text on cream or white** (2.3:1, fails). Gold text is only allowed on blue (4.6:1), plus the homepage tagline "Cultures in Dialogue" (large bold italic on the photo, at the owner's request). Teal is never text on cream or white either (2.5:1).
- The old `gold-dark` token now maps to blue: use it (or `primary`) for small labels, dates and icons.
- No green and no dark green anywhere.
- Only exceptions to "variables only": `theme-color` in `BaseLayout.astro` and `site.webmanifest` (must be literal hex, `#103B59`), and the arrow color inside the select-box data URIs.

## 4. Style

- Clean, calm, lots of white space.
- No gradients, no heavy shadows or effects, no decorative patterns (no waves, rays or glows).
- **Cards:** one shared style for the whole site, the `.card` class: white, softly rounded corners, very light border, generous padding, no shadow.
- **Section titles:** always use `src/components/ui/SectionHeader.astro`: title centered, and under it a thin gold line on each side of a small gold maple leaf (`LeafRule.astro`, inline SVG). Use this same component for every section title.

## 5. Accessibility and responsiveness

- Real heading hierarchy: one `h1` per page, then `h2`/`h3` in order.
- Contrast (WCAG AA, checked): ink on cream 11.4, blue on cream 10.6, blue on white 11.7, white on blue 11.7, gold on blue 4.6. Never gold or teal small text on cream or white.
- Buttons (pill-shaped, gentle lift on hover): `.btn-primary` = petroleum blue with white text, darker blue on hover (gold with blue text inside `on-dark` bands); `.btn-outline` = secondary, light background with a thin gold border and blue text.
- Links: blue, gold underline on hover. Header navigation: blue text, a thin gold underline grows in on hover and stays under the current page.
- Everything works with the keyboard, with visible focus styles (blue outline; gold on blue sections).
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
