# Cultures on Screen (Écran des cultures / فرهنگ‌ها بر پرده)

A curated collection of videos on the homepage (Matin Alive, owner's brief, Oct 27 2026):
Matin's own productions, approved partner organizations, cultural creators, short
documentaries and community projects.

One YAML file per video. Nothing appears until a file exists; previews show labelled
placeholders instead.

## Rules

- **Only with permission.** Never scrape, download or re-upload a video from YouTube,
  Instagram or any other platform.
- **YouTube:** use the official embed. Paste the link in `youtube`. Nothing is loaded from
  YouTube until the visitor clicks Play (youtube-nocookie.com).
- **Instagram:** shown as a card linking to the original post (`sourceUrl`). No Instagram
  script is loaded on the site.
- **A file hosted by Matin** (`platform: file`, MP4 or WebM in `public/media/`): only with
  written permission, recorded in `rights` (who, how, when). The build fails without it.
- **Credit and source are always shown:** `creator` (name, link) and `sourceUrl`.
- Every title in French and English (Persian optional, falls back to English).

## Example

```yaml
kind: partner # matin | partner | creator | documentary | community
title:
  fr: Titre exact de la vidéo
  en: Exact title of the video
  fa: عنوان دقیق ویدیو
creator:
  name: Name of the organization or creator
  url: https://example.org
platform: youtube # youtube | instagram | file
youtube: https://www.youtube.com/watch?v=XXXXXXXXXXX
sourceUrl: https://www.youtube.com/watch?v=XXXXXXXXXXX
# For platform: file only:
# file: /media/video-name.mp4
# rights:
#   holder: Name of the rights holder
#   permission: Written permission by email to admin@matincc.ca
#   date: 2026-11-01
order: 10
```
