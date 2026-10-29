# Notes from the President

Short posts that Reza Moafi first published on LinkedIn, shown on the
« Notes du président » / "Notes from the President" / «یادداشت‌های رئیس مؤسسه» page
(under News) and, the two latest, on the homepage. One YAML file per note:

```yaml
date: 2026-10-27            # day it was published on LinkedIn
original: fa                # language he wrote it in: fr, en or fa
text:
  fa: |
    The text exactly as published.

    A blank line starts a new paragraph.
  # fr: / en: optional translations; without one, the page shows the original with a label
image: ./images/2026-10-27.jpg   # optional, the post's own photo
imageAlt: { fr: '…', en: '…', fa: '…' }
imageCredit: 'Photo: …'          # only when the photo is not Matin's
linkedin: https://www.linkedin.com/posts/…   # link to the post
```

Each note gets its own page automatically: `/fr/notes-du-president/<slug>/`,
`/en/president-notes/<slug>/`, `/fa/president-notes/<slug>/`, where `<slug>` is the file
name without its date (`2026-10-29-winter-story.yaml` → `winter-story`) or an optional
`slug:` line. The newest note is featured at the top of the journal; the older ones move
to « D'autres réflexions et histoires » by themselves. The reading time is computed from
the text. `headline:` (fr/en/fa) is the note's title.

**Adding the next note:** copy the last file, rename it with the new date and a short
English name, paste his exact text under his language, add translations if wanted (they
are labelled as translations), and push. Nothing else to change.

Never copy text the President did not publish, never invent a note. `archived: true`
takes a note off the site. `sample: true` files are layout examples: they show on
previews only, never on the live site, and are deleted once real notes exist.
