import type { ImageMetadata } from 'astro';

/**
 * Download link for an official poster: the original file exactly as it was uploaded
 * (never resized or re-encoded), saved under a readable name, e.g.
 * matin-autumn-walk-2026-poster.jpg.
 */
export function posterFile(image: ImageMetadata, name: string) {
  const ext = image.format === 'jpeg' ? 'jpg' : image.format;
  return {
    href: image.src,
    filename: `matin-${name}-poster.${ext}`,
    format: ext === 'jpg' ? 'JPEG' : ext.toUpperCase(),
  };
}
