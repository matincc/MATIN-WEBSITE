/**
 * « My Story in 15 Seconds » (owner's request, Oct 31 2026): published clips and the
 * address the upload form sends videos to.
 */
import { getCollection } from 'astro:content';
import { youtubeId } from './gallery';

/**
 * The institute's forms web app (google-sheets/Code.gs, the same deployment the
 * submission-created function uses). Videos go from the visitor's browser straight to it,
 * in 8 MB pieces, and from there to a Drive folder only the team can open.
 */
export const STORY_UPLOAD_URL =
  'https://script.google.com/macros/s/AKfycbw-Tpom1Ejxw9H0fOnyzp7YjM9_yLqtwFWjUcokD9vgYjRMqOHI9NcQyqn5bQuKbZq4EQ/exec';

/** Published clips with a YouTube video, newest first. */
export async function getStories(limit?: number) {
  const list = (await getCollection('stories', (s) => !s.data.archived))
    .map((s) => ({ ...s.data, id: s.id, videoId: youtubeId(s.data.youtube) }))
    .filter((s): s is typeof s & { videoId: string } => Boolean(s.videoId))
    .sort((a, b) => b.published.getTime() - a.published.getTime());
  return limit ? list.slice(0, limit) : list;
}

export type Story = Awaited<ReturnType<typeof getStories>>[number];
