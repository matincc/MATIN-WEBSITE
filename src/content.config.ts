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
  newsRegions,
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
 * Set to true once the Persian (fa) texts of an entry have been reviewed by the owner.
 * Persian pages show every entry either way (English text where Persian is missing).
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
        /** Day the event was announced and registration opened (YYYY-MM-DD): Google's
            `offers.validFrom`. Fill it for every event (owner's rule, Oct 30 2026). */
        announced: isoDate.optional(),
        /** "Matin's Picks": shown in the highlights row until this date (YYYY-MM-DD). */
        featuredUntil: isoDate.optional(),
        /** Large banner at the top of the homepage events section, until the event ends. */
        spotlight: z.boolean().default(false),
        /** Drafts appear only on the local preview (npm run dev), never on the live site. */
        draft: z.boolean().default(false),
        image: image().optional(),
        /** Selected events only: the organizer's official image, loaded from its own site
            (RemoteEventImage.astro; its host must be allowed in the CSP img-src). */
        remoteImage: z.object({ src: z.url(), credit: z.string(), source: z.url() }).optional(),
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
        /** recommends (Cultural News, external, with source and region) or matin-news (Matin News) */
        category: z.enum(newsCategories),
        /** Cultural News only: its tab, montreal, canada (the rest of Québec included) or international. */
        region: z.enum(newsRegions).optional(),
        tags: z.array(z.string()).default([]),
        image: image().optional(),
        imageAlt: biOpt,
        /**
         * Required with an image: confirm that Matin owns the photo or has permission
         * to publish it (photographer's consent, and consent of recognizable people).
         */
        imagePermission: z.boolean().optional(),
        /** Credit and licence shown with the image, e.g. "Photo: Jane Doe, CC BY 4.0". */
        imageCredit: z.string().optional(),
        /** When the article discusses an external event or issue: link and attribution. */
        source: z.object({ url: z.url(), name: z.string().min(1) }).optional(),
        /** Drafts appear only on the local preview (npm run dev): never listed, built or indexed. */
        draft: z.boolean().default(false),
        /** An outdated item taken off the site (kept in the history). */
        archived: z.boolean().default(false),
        faReviewed,
        placeholder: z.boolean().default(false),
      })
      .refine((n) => !n.image || n.imagePermission === true, {
        message: 'Set imagePermission: true to confirm Matin may use this image',
        path: ['imagePermission'],
      })
      .refine((n) => n.category !== 'recommends' || (n.source && n.region), {
        message: 'Cultural News needs its source (name and url) and its region',
        path: ['source'],
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

/**
 * Matin in Action, "coming soon" posters (owner's brief, Oct 27 2026): Matin's own
 * activities announced before they are scheduled. One poster image per language, no date,
 * place or registration details (none are confirmed). Remove the file, or set
 * `published: false`, once the activity has a real event page.
 */
const comingSoon = defineCollection({
  loader: yaml('coming-soon'),
  schema: ({ image }) =>
    z.object({
      title: bi,
      summary: bi,
      /** The poster in each language (Persian falls back to English). */
      poster: z.object({ fr: image(), en: image(), fa: image().optional() }),
      posterAlt: bi,
      order: z.number().int().default(0),
      published: z.boolean().default(true),
    }),
});

/**
 * "Cultures on Screen" (Matin Alive, owner's brief Oct 27 2026): a curated video collection
 * on the homepage. One YAML file per video; see src/content/screen/README.md. Only official
 * embeds (YouTube via youtube-nocookie, Instagram as a link to the original post) or a file
 * Matin may host, which requires documented written permission. Never a scraped or
 * downloaded social-media video. Creator and original source are always shown.
 */
const screen = defineCollection({
  loader: yaml('screen'),
  schema: ({ image }) =>
    z
      .object({
        kind: z.enum(['matin', 'partner', 'creator', 'documentary', 'community']),
        title: bi,
        summary: biOpt,
        creator: z.object({ name: z.string().min(1), url: z.url().optional() }),
        platform: z.enum(['youtube', 'instagram', 'file']),
        /** YouTube link or ID (platform: youtube). */
        youtube: youtube.optional(),
        /** The original post or page: always required, always linked. */
        sourceUrl: z.url(),
        /** A video file in public/media/ (platform: file), only with documented rights. */
        file: videoFile.optional(),
        /** Still image stored on this site (never copied from the platform without rights). */
        poster: image().optional(),
        posterAlt: biOpt,
        rights: z
          .object({
            /** Who gave permission, how (email, contract), and when (YYYY-MM-DD). */
            holder: z.string().min(1),
            permission: z.string().min(1),
            date: isoDate,
          })
          .optional(),
        order: z.number().default(100),
        published: z.boolean().default(true),
      })
      .refine((v) => v.platform !== 'file' || (v.file && v.rights), {
        message: 'A hosted video file needs `file` and documented `rights`.',
      })
      .refine((v) => v.platform !== 'youtube' || Boolean(v.youtube), {
        message: 'A YouTube video needs its `youtube` link.',
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
        representative: z.string(),
        website: z.url(),
        /** Official email, shown on the Legal Information page and in structured data. */
        email: z.string(),
        /** Street address of the head office. Not set: the site shows only the city (Matin's decision). */
        registeredAddress: z
          .object({
            street: z.string(),
            city: z.string(),
            province: z.string(),
            region: z.string(),
            postalCode: z.string(),
            country: z.string(),
          })
          .optional(),
        statement: z.object({ fr: z.string(), en: z.string(), fa: z.string() }),
      })
      .optional(),
    charityNumber: z.string().optional(),
    donateUrl: z.url(),
    donations: z
      .object({
        interacEmail: z.email().or(z.literal('')).default(''),
        onlineDonationUrl: z.url().or(z.literal('')).default(''),
      })
      .optional(),
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
      /** The name in Persian script, shown on the Persian page (optional). */
      nameFa: z.string().optional(),
      /** Official position or role. */
      role: bi,
      /** Short professional biography (two or three sentences), shown on the card. */
      bio: biOpt,
      /** Optional longer biography (Markdown), shown under « Read the full biography ». */
      fullBio: biOpt,
      /** Square portrait, supplied and approved by the person. */
      photo: image().optional(),
      linkedin: z.url().optional(),
      /**
       * Where the person appears on the Our Team page (owner's brief, Oct 24 2026):
       * executive = coordinates and manages day-to-day operations; advisor = Advisors &
       * Friends of Matin (voluntary, not staff or officers); board = governance, kept apart
       * and not shown yet; president = shown by the President section only.
       * « staff » is the former name of « executive » and is read the same way.
       */
      group: z.enum(['president', 'executive', 'advisor', 'board', 'staff']).default('executive'),
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

/**
 * Our impact (owner's request, Oct 30 2026, after the NGO review): a few REAL figures from
 * Matin's own activities (participants, languages, activities…). Never an estimate or an
 * invented number. The homepage band stays hidden while this folder has no entries.
 */
const impact = defineCollection({
  loader: yaml('impact'),
  schema: z.object({
    value: z.string().min(1),
    label: bi,
    /** Where the figure comes from (for the team, not shown): e.g. "sign-in sheet, Nov 7 2026". */
    source: z.string().min(1),
    order: z.number().default(100),
  }),
});

/**
 * Words of participants (owner's request, Oct 30 2026): a sentence or two said by someone
 * who took part, published only with their consent, first name only. Written in the
 * language it was said in (`original`); translations are optional. Hidden while empty.
 */
const testimonials = defineCollection({
  loader: yaml('testimonials'),
  schema: z.object({
    quote: z.object({ fr: z.string().optional(), en: z.string().optional(), fa: z.string().optional() }),
    original: z.enum(['fr', 'en', 'fa']),
    firstName: z.string().min(1),
    context: biOpt,
    consent: z.literal(true),
    order: z.number().default(100),
  }),
});

/**
 * « Mon histoire en 15 secondes » / "My Story in 15 Seconds" (owner's request, Oct 31 2026):
 * short videos visitors sent, published only after Matin approved them and put them on its
 * YouTube channel. First name only, the person's written consent (form on the page), no
 * minors. `archived: true` takes one off the site (removal on request).
 */
const stories = defineCollection({
  loader: yaml('stories'),
  schema: z.object({
    firstName: z.string().min(1),
    /** City or neighbourhood, as the person wrote it. */
    city: z.string().min(1),
    /** Language spoken in the video. */
    language: z.enum(['fr', 'en', 'fa', 'other']),
    /** The question answered (see storyPrompts in src/i18n/stories.ts). */
    prompt: z.enum(['home', 'word', 'sound', 'advice', 'free']),
    youtube,
    /** Day it was published on the site (YYYY-MM-DD), newest first. */
    published: z.coerce.date(),
    /** Optional one-line caption in the video's language or translated. */
    caption: biOpt,
    consent: z.literal(true),
    archived: z.boolean().default(false),
  }),
});

/**
 * Partners and supporters (owner's request, Oct 30 2026): only organizations that really
 * work with or fund Matin, shown with their written permission. Hidden while empty.
 */
const partners = defineCollection({
  loader: yaml('partners'),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      kind: z.enum(['partner', 'funder', 'sponsor']),
      logo: image().optional(),
      url: z.url().optional(),
      permission: z.literal(true),
      order: z.number().default(100),
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
      /**
       * The short, clickable name on the card (e.g. « CALQ », "NFB / ONF"), per language;
       * Persian falls back to English. Without it, the card shows the name.
       */
      label: biOpt,
      /** Short kind shown on the card (e.g. "Municipal public body"), only where useful. */
      kind: biOpt,
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
      /**
       * listed (default): simply listed in the directory. member: Matin is a member of it.
       * partner: a real, confirmed partnership. Set member or partner only with the owner's
       * confirmation; the directory notice still says a listing implies no partnership.
       */
      status: z.enum(['listed', 'member', 'partner']).default('listed'),
      order: z.number().default(100),
      /** Shown on the site only when true (once name, website and logo are verified). */
      published: z.boolean().default(false),
    }),
});

/**
 * International Cultural Networks (Resources page, #networks): networks and federations
 * of cities, institutions or professionals working on culture and intercultural dialogue.
 * A listing never means membership or partnership unless `status` says so.
 */
const networks = defineCollection({
  loader: yaml('networks'),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      nameEn: z.string().optional(),
      url: z.url().refine((u) => u.startsWith('https://'), 'Use the https:// address'),
      logo: image().optional(),
      description: biOpt,
      /** Where it works, e.g. « International », « Europe », « Canada ». */
      scope: z.string().optional(),
      status: z.enum(['listed', 'member', 'partner']).default('listed'),
      order: z.number().default(100),
      /** Shown only when true, once name, website and description are verified. */
      published: z.boolean().default(false),
    }),
});

/**
 * Cultural Policy & Strategic Documents (Resources page, #policy): official public
 * policies, plans and strategies, linked to the publisher's own page (or a PDF in
 * public/documents/ when the licence allows it). Never a summary presented as the text.
 */
const policies = defineCollection({
  loader: yaml('policies'),
  schema: z
    .object({
      /** Official title, in each language the publisher uses (fr and/or en). */
      title: z.object({ fr: z.string().optional(), en: z.string().optional() }),
      /** Publisher, e.g. « Gouvernement du Québec », « Ville de Montréal », « UNESCO ». */
      publisher: z.string().min(1),
      year: z.number().int().min(1900).max(2100),
      jurisdiction: z.enum(['montreal', 'quebec', 'canada', 'international']),
      url: z
        .url()
        .refine((u) => u.startsWith('https://'), 'Use the https:// address')
        .optional(),
      file: z
        .string()
        .regex(/^\/documents\/.+\.pdf$/, 'Use a path like /documents/policy.pdf')
        .optional(),
      description: biOpt,
      order: z.number().default(100),
      /** Shown only when true, once title, publisher, year and link are verified. */
      published: z.boolean().default(false),
    })
    .refine((d) => d.title.fr || d.title.en, 'Give the title in French or English')
    .refine((d) => d.url || d.file, 'Give a url or a file'),
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

/**
 * Notes from the President: short posts Reza Moafi first published on LinkedIn, shown as
 * LinkedIn-style cards (owner's request, Oct 27 2026). Written once, in the language he
 * posted in (`original`); a translation may be added for the other languages. No title.
 */
const notes = defineCollection({
  loader: yaml('notes'),
  schema: ({ image }) =>
    z
      .object({
        /** The day the note was published on LinkedIn. */
        date: z.coerce.date(),
        /** Language the President wrote the note in. */
        original: z.enum(['fr', 'en', 'fa']),
        /** Address of the note's own page (optional; defaults to the file name without
            its date, e.g. 2026-10-29-winter-story.yaml → /en/president-notes/winter-story/). */
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .optional(),
        /** The post's opening line, shown as the card's title (optional). */
        headline: z
          .object({
            fr: z.string().optional(),
            en: z.string().optional(),
            fa: z.string().optional(),
          })
          .optional(),
        /** The note's text, exactly as published (blank lines separate paragraphs). */
        text: z.object({
          fr: z.string().optional(),
          en: z.string().optional(),
          fa: z.string().optional(),
        }),
        image: image().optional(),
        imageAlt: biOpt,
        /** Credit shown with the image when it is not Matin's own photo. */
        imageCredit: z.string().optional(),
        /** Link to the post on LinkedIn. */
        linkedin: z.url().optional(),
        /** Layout examples: shown on local and deploy previews, never on the live site. */
        sample: z.boolean().default(false),
        archived: z.boolean().default(false),
      })
      .refine((n) => !!n.text[n.original], {
        message: 'Write the note in its original language (text.<original>)',
        path: ['text'],
      }),
});

/**
 * Careers page (owner's request, Oct 27 2026): paid positions at Matin, one YAML file per
 * position in src/content/jobs/ (see its README). Volunteering stays on Contact.
 */
const jobs = defineCollection({
  loader: yaml('jobs'),
  schema: z.object({
    title: bi,
    type: z.enum(['full-time', 'part-time', 'contract']),
    location: z.enum(['montreal', 'remote', 'hybrid']),
    /** Pay as it should read, e.g. « 22 $ de l'heure » / "$22 an hour". */
    pay: biOpt,
    /** Day the position was posted (YYYY-MM-DD). */
    posted: isoDate,
    /** Last day to apply (YYYY-MM-DD); the position leaves the page at the next build after it. */
    deadline: isoDate.optional(),
    /** One or two sentences shown on the card. */
    summary: bi,
    /** Full description (Markdown), shown when the visitor opens the card. */
    description: biOpt,
    order: z.number().default(100),
    /** Shown only when true. */
    published: z.boolean().default(false),
    faReviewed,
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

/**
 * The seasonal calendar (owner's idea, Oct 30 2026): the homepage greets the occasions
 * of Montréal's real life (Canadian days, the celebrations of its communities and faiths,
 * all treated alike) and lists a few FREE public activities from municipal or public
 * bodies only (LaSalle first, then the Ville de Montréal, libraries, maisons de la
 * culture). Matin never organizes them: it shares them, with the official link. One file
 * per occasion; each shows by itself between `showFrom` and `showUntil` (Montréal dates).
 * Never invent an occasion, a date or an activity: see README.md in the folder.
 */
const seasonEvent = z.object({
  title: z.object({ fr: z.string().min(1), en: z.string().min(1), fa: z.string().min(1) }),
  /** Matin's short original summary, never copied from the organizer. */
  summary: z.object({ fr: z.string().min(1), en: z.string().min(1), fa: z.string().min(1) }),
  start: localDateTime,
  end: localDateTime,
  place: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    /** Borough or city, e.g. « LaSalle ». */
    area: z.string().min(1),
  }),
  /** The public body that runs it (borough, city, library). Never Matin. */
  organizer: z.object({ name: z.string().min(1), url: z.url() }),
  /** A second body named by the official page as leading it (e.g. a Legion branch). */
  partner: z.object({ name: z.string().min(1), url: z.url().optional() }).optional(),
  /** The official page of the activity: the link shown, and the source. */
  url: z.url(),
  /** The official image on the organizer's site (structured data only, not shown). */
  image: z.url(),
  /** Only free activities are listed. */
  free: z.literal(true),
  registration: z.boolean().default(false),
  /** Since when it is offered (registration opening, or the day we checked it). */
  availableFrom: isoDate.optional(),
  lastVerified: isoDate,
});

const seasons = defineCollection({
  loader: yaml('seasons'),
  schema: z
    .object({
      /** The day (or first day) of the occasion. */
      date: isoDate,
      dateEnd: isoDate.optional(),
      showFrom: isoDate,
      /** Last day shown, included. */
      showUntil: isoDate,
      /** `solemn` for days of remembrance: quieter colours, no "celebrate" wording. */
      tone: z.enum(['festive', 'solemn']).default('festive'),
      /** The small drawing beside the greeting. */
      motif: z.enum(['lantern', 'poppy', 'diya', 'lights', 'moon', 'tree', 'sparkle']),
      kicker: z.object({ fr: z.string().min(1), en: z.string().min(1), fa: z.string().min(1) }),
      title: z.object({ fr: z.string().min(1), en: z.string().min(1), fa: z.string().min(1) }),
      greeting: z.object({ fr: z.string().min(1), en: z.string().min(1), fa: z.string().min(1) }),
      events: z.array(seasonEvent).default([]),
      /** Where the date of the occasion was checked. */
      dateSource: z.string().min(1),
      faReviewed,
    })
    .refine((s) => s.showFrom <= s.showUntil, {
      message: 'showFrom must be on or before showUntil',
      path: ['showUntil'],
    }),
});

export const collections = {
  seasons,
  programs,
  events,
  news,
  notes,
  highlights,
  comingSoon,
  screen,
  settings,
  team,
  about,
  documents,
  gallery,
  introVideo,
  faq,
  impact,
  testimonials,
  stories,
  partners,
  resources,
  networks,
  policies,
  involvement,
  jobs,
  legal,
};
