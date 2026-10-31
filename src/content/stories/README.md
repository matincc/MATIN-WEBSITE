# My Story in 15 Seconds (« Mon histoire en 15 secondes »)

Visitors send their video from the page `/en/my-story/`. It lands in Drive
(50_Members_Volunteers › « Histoires vidéo · Video Stories (à valider) ») and in the tab
« Histoires · Stories » of the Sheet « Matin – Formulaires du site ». Nothing is published
automatically.

To publish one, after the President approves it:

1. Upload the video to Matin's YouTube channel as a Short (title: first name and city).
2. Add one YAML file here, for example `2026-11-05-sara.yaml`:

```yaml
firstName: Sara
city: Villeray, Montréal
language: fr        # fr | en | fa | other (language spoken in the video)
prompt: home        # home | word | sound | advice | free
youtube: https://www.youtube.com/shorts/XXXXXXXXXXX
published: 2026-11-05
consent: true       # the person ticked the three consent boxes on the form
```

3. Write « Publié · Published » and the YouTube link in the Sheet row.

The homepage band « In Their Words » shows the three newest. Removal on request: set
`archived: true` (or delete the file), remove the YouTube video, and delete the Drive file.
A clip that is not published is deleted from the Drive folder. First names only; never
a minor; never a clip the person did not send themselves.
