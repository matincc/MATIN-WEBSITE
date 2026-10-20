/**
 * Illustrative photographs of Montréal's cultural life. They are openly licensed
 * documentary photos from Wikimedia Commons, NOT pictures of Matin's own activities, so
 * each one is always shown with its credit (author, licence, source link).
 *
 * To replace one with a photo of a real Matin activity: put the new file in
 * src/assets/photos/, point `src` at it and update `credit` (for Matin's own photos,
 * use the photographer's name and a link to Matin). Every page using that key follows.
 */
import type { ImageMetadata } from 'astro';
import tamtams from '@/assets/photos/tamtams.jpg';
import library from '@/assets/photos/library.jpg';
import publicart from '@/assets/photos/publicart.jpg';
import nuitblanche from '@/assets/photos/nuitblanche.jpg';
import placejc from '@/assets/photos/placejc.jpg';

export interface Photo {
  src: ImageMetadata;
  /** CSS object-position used when the photo is cropped. */
  focus?: string;
  credit: { author: string; license: string; licenseUrl: string; source: string };
}

const CC_BY_SA_2 = 'https://creativecommons.org/licenses/by-sa/2.0/';
const CC_BY_SA_3 = 'https://creativecommons.org/licenses/by-sa/3.0/';
const CC_BY_2 = 'https://creativecommons.org/licenses/by/2.0/';

export const photos = {
  /** Les Tam-Tams du Mont-Royal, the Sunday gathering at the Sir George-Étienne Cartier monument. */
  tamtams: {
    src: tamtams,
    focus: '50% 70%',
    credit: {
      author: 'Matias Garabedian',
      license: 'CC BY-SA 2.0',
      licenseUrl: CC_BY_SA_2,
      source: 'https://commons.wikimedia.org/wiki/File:Les_Tam-Tams_du_Mont_Royal_(9398591674).jpg',
    },
  },
  /** Grande Bibliothèque (BAnQ), Montréal: interior stairs. */
  library: {
    src: library,
    focus: '40% 50%',
    credit: {
      author: 'Mourial',
      license: 'CC BY-SA 3.0',
      licenseUrl: CC_BY_SA_3,
      source: 'https://commons.wikimedia.org/wiki/File:Grande_Bibliotheque_Quebec_Interieur.JPG',
    },
  },
  /** Public art in the Quartier latin: "Roue de vélo" by Alexandre Castonguay (2017). */
  publicart: {
    src: publicart,
    focus: '45% 55%',
    credit: {
      author: 'art_inthecity',
      license: 'CC BY 2.0',
      licenseUrl: CC_BY_2,
      source:
        'https://commons.wikimedia.org/wiki/File:Alexandre_Castonguay,_Roue_de_v%C3%A9lo,_2017_(36606693183).jpg',
    },
  },
  /** Nuit blanche, Montréal en Lumière, Quartier des spectacles. */
  nuitblanche: {
    src: nuitblanche,
    focus: '45% 60%',
    credit: {
      author: 'Matias Garabedian',
      license: 'CC BY-SA 2.0',
      licenseUrl: CC_BY_SA_2,
      source:
        'https://commons.wikimedia.org/wiki/File:Nuit_blanche_%C3%A0_Montr%C3%A9al_-_MONTR%C3%89AL_EN_LUMI%C3%88RE_(12889789765).jpg',
    },
  },
  /** Place Jacques-Cartier, Old Montréal, on a sunny day. */
  placejc: {
    src: placejc,
    focus: '40% 60%',
    credit: {
      author: 'Ken Lund',
      license: 'CC BY-SA 2.0',
      licenseUrl: CC_BY_SA_2,
      source:
        'https://commons.wikimedia.org/wiki/File:Place_Jacques-Cartier,_Vieux-Montr%C3%A9al,_Montreal,_Quebec_(29773761810).jpg',
    },
  },
} satisfies Record<string, Photo>;
