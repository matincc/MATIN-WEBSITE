/**
 * Content schemas. Every entry is a YAML file with French and English fields side by side.
 * A missing required field (in either language) fails the build with a clear message,
 * instead of silently producing a broken page.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  categories,
  eventFormats,
  eventKinds,
  eventLanguages,
  eventRegions,
  eventStatuses,
  eventSubjects,
  faqTopics,
  newsCategories,
  priceTypes,
  resourceCategories,
} from './lib/taxonomy';

/**
 * A short text in French and English: both required (Bill 96: French never less complete).
 * `fa` (Persian) is optional; Persian pages fall back to English when it is missing.
 */
const bi = z.object({ fr: z.string().min(1), en: z.string().min(1), fa: z.string().optional() });
/** Optional multilingual text. */
const biOpt = z
  .object({ fr: z.string().default(''), en: z.string().default(''), fa: z.string().optional() })
  .optional();
/**
 * Set to true once the Persian (fa) texts of an entry have been reviewed; only then
 * does the entry appear on Persian pages.
 */
const faReviewed = z.boolean().default(false);
/** Localized URL slugs; fall back to the file name when absent. */
const slugs = z
  .object({
    fr: z.string().regex(/^[a-z0-9-]+$/),
    en: z.string().regex(/^[a-z0-9-]+$/),
  })
  .optional();
/** Local Montréal time without offset, e.g. 2026-10-24T19:00 */
const localDateTime = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, 'Use the format YYYY-MM-DDTHH:MM');

/** A YouTube link (any form: watch, youtu.be, shorts, embed) or the 11-character video ID. */
const youtube = z
  .string()
  .regex(
    /^(?:[\w-]{11}|https:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}\S*)$/,
    'Paste a YouTube link (https://www.youtube.com/watch?v=…) or the video ID',
  )
  .or(z.literal(''));
/** A video file uploaded to public/media/ (MP4 or WebM). */
const videoFile = z
  .string()
  .regex(/^\/media\/(?!.*\.\.)[\w./-]+\.(mp4|webm)$/i, 'Upload an MP4 or WebM file to /media/')
  .or(z.literal(''));

const yaml = (dir: string) => glob({ pattern: '**/*.{yaml,yml}', base: `./src/content/${dir}` });

const programs = defineCollection({
  loader: yaml('programs'),
  schema: ({ image }) =>
    z.object({
      title: bi,
      urlSlug: slugs,
      summary: bi,
      body: bi,
      category: z.enum(categories),
      audience: bi,
      schedule: bi,
      location: bi,
      fees: bi,
      instructor: z.string().optional(),
      image: image().optional(),
      imageAlt: biOpt,
      registrationUrl: z.url().optional(),
      order: z.number().default(100),
      placeholder: z.boolean().default(false),
    }),
});

/** Calendar date, e.g. 2026-10-17 */
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD');

/**
 * Events & Cultural Agenda. One file per event: Matin's own events (`matin`), events
 * Matin documentably co-organizes (`co-organized`), and external events Matin selects
 * for its agenda (`selected`). Only real, verified events: see GUIDE_ADMIN.md.
 */
const events = defineCollection({
  loader: yaml('events'),
  schema: ({ image }) =>
    z
      .object({
        kind: z.enum(eventKinds),
        /** The actual organizer, always shown. For Matin's own events: "Matin". */
        organizer: z.object({ name: z.string().min(1), url: z.url().optional() }),
        title: bi,
        urlSlug: slugs,
        /** Short original summary written by Matin (never copied from the organizer). */
        summary: bi,
        /** Why this event matters to Matin's audiences; required for selected events. */
        whyItMatters: biOpt,
        /** Full description, Markdown: Matin and co-organized events only. */
        body: biOpt,
        subject: z.enum(eventSubjects),
        region: z.enum(eventRegions),
        /** A name, or { fr, en } when it needs translating (e.g. « Partout au Québec »). */
        city: z.union([z.string().min(1), bi]),
        country: z.string().default('Canada'),
        format: z.enum(eventFormats).default('in-person'),
        /** Only when verified. */
        language: z.enum(eventLanguages).optional(),
        start: localDateTime,
        end: localDateTime.optional(),
        /** Festivals, weeks, fairs: show the dates only (put the hours in the summary). */
        allDay: z.boolean().default(false),
        /** Time zone of the times above; Montréal by default. */
        timeZone: z.string().default('America/Toronto'),
        /** Venue; leave out for online events and for multi-venue festivals (allDay). */
        location: z
          .object({
            /** One name, or { fr, en, fa } when it is written differently per language. */
            name: z.union([z.string(), bi]),
            address: z.string().optional(),
            mapUrl: z.url().optional(),
          })
          .optional(),
        /** Never guess: `unknown` until the organizer states it. */
        price: z
          .object({
            type: z.enum(priceTypes),
            label: biOpt, // e.g. « 15 $ / 10 $ étudiants »
          })
          .default({ type: 'unknown' }),
        status: z.enum(eventStatuses).default('scheduled'),
        /** Official event page at the organizer (required for selected events). */
        eventUrl: z.url().optional(),
        registrationUrl: z.url().optional(),
        /** Where the information was checked, and when (YYYY-MM-DD). */
        sourceUrl: z.url().optional(),
        lastVerified: isoDate.optional(),
        /** "Matin's Picks": shown in the highlights row until this date (YYYY-MM-DD). */
        featuredUntil: isoDate.optional(),
        /** Large banner at the top of the homepage events section, until the event ends. */
        spotlight: z.boolean().default(false),
        /** Drafts appear only on the local preview (npm run dev), never on the live site. */
        draft: z.boolean().default(false),
        image: image().optional(),
        imageAlt: biOpt,
        /** The image is the official poster: always shown whole, never cropped. */
        imageIsPoster: z.boolean().default(false),
        /* After a Matin event (each part is shown only when filled in): */
        report: biOpt, // full report, Markdown
        highlights: z.array(bi).default([]), // key highlights / outcomes
        photos: z
          .array(
            z.object({
              image: image(),
              alt: bi,
              caption: biOpt,
            }),
          )
          .default([]),
        faReviewed,
      })
      .refine((e) => !e.end || e.end > e.start, {
        message: 'End time must be after start time',
        path: ['end'],
      })
      .refine((e) => e.kind !== 'selected' || (e.eventUrl && e.lastVerified), {
        message: 'Selected events need eventUrl and lastVerified',
        path: ['eventUrl'],
      })
      .refine((e) => e.kind !== 'selected' || (e.whyItMatters?.fr && e.whyItMatters?.en), {
        message: 'Selected events need whyItMatters in French and English',
        path: ['whyItMatters'],
      })
      .refine((e) => e.kind === 'selected' || (e.body?.fr && e.body?.en), {
        message: 'Matin events need a body in French and English',
        path: ['body'],
      })
      .refine((e) => e.format === 'online' || e.allDay || e.location, {
        message: 'In-person and hybrid events need a location',
        path: ['location'],
      }),
});

const news = defineCollection({
  loader: yaml('news'),
  schema: ({ image }) =>
    z
      .object({
        title: bi,
        urlSlug: slugs,
        excerpt: bi,
        body: bi,
        /** Publication date (set it to the day the article is published). */
        date: z.coerce.date(),
        /** Date of a later substantive update, shown under the title. */
        updated: z.coerce.date().optional(),
        /** A name, or { fr, en, fa } for an institutional signature. */
        author: z.union([z.string(), bi]),
        /** matin-news, perspectives, culture-cities, research, partnerships */
        category: z.enum(newsCategories),
        tags: z.array(z.string()).default([]),
        image: image().optional(),
        imageAlt: biOpt,
        /**
         * Required with an image: confirm that Matin owns the photo or has permission
         * to publish it (photographer's consent, and consent of recognizable people).
         */
        imagePermission: z.boolean().optional(),
        /** When the article discusses an external event or issue: link and attribution. */
        source: z.object({ url: z.url(), name: z.string().min(1) }).optional(),
        /** Drafts appear only on the local preview (npm run dev): never listed, built or indexed. */
        draft: z.boolean().default(false),
        faReviewed,
        placeholder: z.boolean().default(false),
      })
      .refine((n) => !n.image || n.imagePermission === true, {
        message: 'Set imagePermission: true to confirm Matin may use this image',
        path: ['imagePermission'],
      }),
});

/**
 * Homepage highlights: Matin's own initiatives, posters, videos, announcements and
 * reports, shown in "Matin in Action" (the featured one) and "Latest From Matin".
 * Matin's own events and published news appear there automatically; use a highlight
 * for anything else. Only Matin's own content (organized, hosted or produced by Matin).
 */
const highlights = defineCollection({
  loader: yaml('highlights'),
  schema: ({ image }) =>
    z
      .object({
        type: z.enum(['initiative', 'event', 'news', 'announcement', 'report', 'video', 'poster']),
        title: bi,
        summary: bi,
        /** Photo, poster or video thumbnail. Posters are shown whole, never cropped. */
        image: image().optional(),
        imageAlt: biOpt,
        /** Confirm that Matin owns the image or has permission to publish it. */
        imagePermission: z.boolean().optional(),
        /** The date shown on the card (publication date, or start of the activity). */
        date: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        location: biOpt,
        /** Where the button leads: a page of this site (/fr/…) or an external link. */
        url: z.string().min(1),
        /** Button label; by default one that fits the type (Read more, View event…). */
        ctaLabel: biOpt,
        /** The one item shown large in "Matin in Action". */
        featured: z.boolean().default(false),
        /** Lower numbers first among items of the same date. */
        order: z.number().int().default(0),
        /** Hidden from the homepage after this date (e.g. once an activity is over). */
        until: z.coerce.date().optional(),
        /** Drafts appear only on the local preview (npm run dev). */
        draft: z.boolean().default(false),
        faReviewed,
      })
      .refine((h) => !h.image || h.imagePermission === true, {
        message: 'Set imagePermission: true to confirm Matin may use this image',
        path: ['imagePermission'],
      }),
});

const settings = defineCollection({
  loader: yaml('settings'),
  schema: z.object({
    mission: bi,
    founded: z.number().int().optional(),
    /** Contact details are optional: each one appears on the site only once it is set. */
    address: z
      .object({
        street: z.string(),
        city: z.string().default('Montréal'),
        region: z.string().default('QC'),
        postalCode: z.string(),
        country: z.string().default('CA'),
      })
      .optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    hours: bi.optional(),
    social: z.object({
      facebook: z.url().optional(),
      instagram: z.url().optional(),
      youtube: z.url().optional(),
      linkedin: z.url().optional(),
    }),
    /** Legal identity (Legal Information page and structured data). */
    legal: z
      .object({
        names: z.object({ fr: z.string(), en: z.string(), fa: z.string() }),
        neq: z.string().regex(/^\d{10}$/),
        incorporated: z.coerce.date(),
        representative: z.string(),
        website: z.url(),
        /** Official email, shown on the Legal Information page and in structured data. */
        email: z.string(),
        /** Registered head office: shown only on the Legal Information page. */
        registeredAddress: z.object({
          street: z.string(),
          city: z.string(),
          province: z.string(),
          region: z.string(),
          postalCode: z.string(),
          country: z.string(),
        }),
        statement: z.object({ fr: z.string(), en: z.string(), fa: z.string() }),
      })
      .optional(),
    charityNumber: z.string().optional(),
    donateUrl: z.url(),
    /** Law 25: person in charge of the protection of personal information. */
    privacyOfficer: z
      .object({
        name: z.string(),
        title: bi,
        email: z.string(),
      })
      .optional(),
    /**
     * Turn on only once form submissions actually reach Matin (Netlify Forms detection
     * enabled and notifications set). While false, the interest and newsletter forms
     * show a "not open yet" message instead of accepting submissions.
     */
    formsEnabled: z.boolean().default(false),
    placeholder: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: yaml('team'),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** Official position or role. */
      role: bi,
      /** Short professional biography (two or three sentences). */
      bio: biOpt,
      /** Square portrait, supplied and approved by the person. */
      photo: image().optional(),
      linkedin: z.url().optional(),
      group: z.enum(['staff', 'board']).default('board'),
      order: z.number().default(100),
      /** Until a profile is complete and approved: visible only on the local preview. */
      draft: z.boolean().default(false),
      faReviewed,
      placeholder: z.boolean().default(false),
    }),
});

/** Page-level content for "About" (vision, values, story, President's message). */
const about = defineCollection({
  loader: yaml('about'),
  schema: z.object({
    vision: bi,
    values: z.array(
      z.object({
        title: bi,
        text: bi,
        icon: z.enum(['dialogue', 'respect', 'openness', 'creativity', 'community', 'equity']),
      }),
    ),
    history: z.array(z.object({ year: z.string(), title: bi, text: bi })),
    /** Photo: drop src/assets/brand/president.(jpg|png|webp) in place of the initials. */
    president: z.object({
      name: z.string(),
      title: bi,
      message: bi,
      /** Role line signed under the founder's message. */
      signature: biOpt,
      /** Name with credentials as it appears in the "Our President" section. */
      displayName: biOpt,
      /** Position line, e.g. « Fondateur et président | Institut interculturel Matin ». */
      position: biOpt,
      /** Approved biography (Markdown, one paragraph per blank line). */
      bio: biOpt,
      /** Personal LinkedIn profile (not the Institute's page). */
      linkedin: z.url().optional(),
      /**
       * The profile page (/en/about/reza-moafi/) is published only when this is true;
       * until then it exists only on the local preview. Fill in verified content only.
       */
      profilePublished: z.boolean().default(false),
      profile: z
        .object({
          summary: biOpt,
          education: z.array(bi).default([]),
          experience: z.array(bi).default([]),
          expertise: z.array(bi).default([]),
          leadership: z.array(bi).default([]),
          projects: z.array(bi).default([]),
          links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
        })
        .default({
          education: [],
          experience: [],
          expertise: [],
          leadership: [],
          projects: [],
          links: [],
        }),
    }),
    placeholder: z.boolean().default(false),
  }),
});

/** Downloadable governance documents (annual reports, bylaws…). PDFs go in public/documents/. */
const documents = defineCollection({
  loader: yaml('documents'),
  schema: z.object({
    title: bi,
    year: z.number().int(),
    file: z
      .string()
      .regex(/^\/documents\/.+\.pdf$/, 'Use a path like /documents/rapport-2025.pdf')
      .optional(),
    order: z.number().default(100),
    placeholder: z.boolean().default(false),
  }),
});

/**
 * Gallery ("Matin Moments"): one album per activity or theme. Only real Matin content,
 * published with the consent of the photographer and of the people who can be recognized.
 * Photos and videos marked `featured` appear on the homepage (the first five).
 */
const gallery = defineCollection({
  loader: yaml('gallery'),
  schema: ({ image }) =>
    z.object({
      title: bi,
      date: z.coerce.date(),
      location: biOpt,
      description: biOpt,
      /** An album of a Matin event: listed under the "Events" filter. */
      isEvent: z.boolean().default(false),
      /** Cover image; by default the first photo. */
      cover: image().optional(),
      coverAlt: biOpt,
      photos: z
        .array(
          z.object({
            image: image(),
            alt: bi,
            caption: biOpt,
            featured: z.boolean().default(false),
          }),
        )
        .default([]),
      videos: z
        .array(
          z.object({
            title: bi,
            youtube: youtube.optional(),
            file: videoFile.optional(),
            /** Still image shown before the video plays. */
            thumbnail: image().optional(),
            featured: z.boolean().default(false),
          }),
        )
        .default([]),
      /**
       * Matin may publish these photos and videos (consent of the photographer and of the
       * people who can be recognized). Albums without it stay off the site.
       */
      consent: z.boolean().default(false),
      /** Lower numbers first; then the most recent albums. */
      order: z.number().int().default(100),
      /** Drafts appear only on the local preview (npm run dev). */
      draft: z.boolean().default(false),
    }),
});

/**
 * Matin's introductory video ("Matin is Born"): the large item of "Matin Moments" on the
 * homepage and the first item of the Gallery page, shown once a YouTube link or a video
 * file is added (src/content/intro-video/matin-is-born.yaml, or the admin).
 */
const introVideo = defineCollection({
  loader: yaml('intro-video'),
  schema: ({ image }) =>
    z.object({
      title: bi,
      youtube: youtube.optional(),
      file: videoFile.optional(),
      /** Still image shown before the video plays. */
      thumbnail: image().optional(),
    }),
});

const faq = defineCollection({
  loader: yaml('faq'),
  schema: z.object({
    topic: z.enum(faqTopics),
    question: bi,
    answer: bi,
    order: z.number().default(100),
    placeholder: z.boolean().default(false),
  }),
});

/**
 * Cultural Resources & Organizations: a curated directory of public, cultural, community
 * and research organizations. A listing never means a partnership, endorsement or
 * affiliation. Publish an entry only once its name, website and logo have been checked.
 */
const resources = defineCollection({
  loader: yaml('resources'),
  schema: ({ image }) =>
    z.object({
      /** Official name (as the organization writes it). */
      name: z.string().min(1),
      /** English form of the name, only when the organization uses a different one. */
      nameEn: z.string().optional(),
      category: z.enum(resourceCategories),
      /** Official website (opens in a new tab). */
      url: z.url().refine((u) => u.startsWith('https://'), 'Use the https:// address'),
      /** Official logo (PNG, SVG, JPEG or WebP), used only where permitted. */
      logo: image().optional(),
      description: biOpt,
      /** Jurisdiction or area, e.g. « Montréal », « Québec », « Canada ». */
      location: z.string().optional(),
      /** A downloadable guide in public/documents/ instead of (or besides) the website. */
      file: z
        .string()
        .regex(/^\/documents\/.+\.pdf$/, 'Use a path like /documents/guide.pdf')
        .optional(),
      order: z.number().default(100),
      /** Shown on the site only when true (once name, website and logo are verified). */
      published: z.boolean().default(false),
    }),
});

/** Get Involved page content: volunteer roles and partnership text. */
const involvement = defineCollection({
  loader: yaml('involvement'),
  schema: z.object({
    volunteerIntro: bi.optional(),
    roles: z.array(z.object({ title: bi, text: bi })),
    partnersText: bi.optional(),
    placeholder: z.boolean().default(false),
  }),
});

/** Legal pages: privacy, terms, accessibility. Body is Markdown. */
const legal = defineCollection({
  loader: yaml('legal'),
  schema: z.object({
    title: bi,
    updated: z.coerce.date(),
    body: bi,
    placeholder: z.boolean().default(false),
  }),
});

export const collections = {
  programs,
  events,
  news,
  highlights,
  settings,
  team,
  about,
  documents,
  gallery,
  introVideo,
  faq,
  resources,
  involvement,
  legal,
};
