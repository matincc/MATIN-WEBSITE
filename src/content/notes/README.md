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

Never copy text the President did not publish, never invent a note. `archived: true`
takes a note off the site. `sample: true` files are layout examples: they show on
previews only, never on the live site, and are deleted once real notes exist.
