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
            name: z.string(),
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
        /** Drafts appear only on the local preview (npm run dev), never on the live site. */
        draft: z.boolean().default(false),
        image: image().optional(),
        imageAlt: biOpt,
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
      name: z.string(),
      role: bi,
      bio: bi,
      photo: image().optional(),
      group: z.enum(['staff', 'board']),
      order: z.number().default(100),
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

const gallery = defineCollection({
  loader: yaml('gallery'),
  schema: ({ image }) =>
    z.object({
      title: bi,
      date: z.coerce.date(),
      description: biOpt,
      photos: z
        .array(z.object({ image: image(), alt: bi, caption: biOpt }))
        .min(1, 'An album needs at least one photo'),
      videos: z
        .array(
          z.object({
            youtubeId: z.string().regex(/^[\w-]{11}$/, 'Paste the 11-character YouTube video ID'),
            title: bi,
          }),
        )
        .default([]),
      placeholder: z.boolean().default(false),
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

const resources = defineCollection({
  loader: yaml('resources'),
  schema: z
    .object({
      title: bi,
      description: bi,
      category: z.enum(resourceCategories),
      url: z.url().optional(),
      file: z.string().optional(), // e.g. /documents/guide-nouveaux-arrivants.pdf
      order: z.number().default(100),
      placeholder: z.boolean().default(false),
    })
    .refine((r) => r.url || r.file, { message: 'Provide either a link (url) or a file' }),
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
  settings,
  team,
  about,
  documents,
  gallery,
  faq,
  resources,
  involvement,
  legal,
};
