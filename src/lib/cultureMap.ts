/**
 * Living map of cultures (owner's request, Oct 31 2026): LaSalle first, where Matin works;
 * the rest of Montréal and other places come later (`comingSoon`). Only places and
 * organizations that are verified: each one is listed by the borough (`boroughDirectory`)
 * or by montreal.ca, has its own official page (`url`), and is placed at its public address
 * (never a home address: associations without a public venue go in `withoutVenue`).
 * Coordinates come from the Government of Canada geolocation service (geo.ca), checked on
 * 2026-10-31 (`checkedOn`). Nothing religious or political, no flags.
 * Persian texts are drafts until the owner reviews them.
 */
import type { UiLang } from '@/i18n/routes';

export type T3 = Record<UiLang, string>;
type Url3 = string | { fr: string; en: string };

export const urlFor = (u: Url3, lang: UiLang) =>
  typeof u === 'string' ? u : lang === 'fr' ? u.fr : u.en;

export const checkedOn = '2026-10-31';

/** Map layers, each in one colour of the palette. */
export type MapKind = 'heritage' | 'venue' | 'arts' | 'welcome';

export const kinds: { id: MapKind; label: T3 }[] = [
  {
    id: 'heritage',
    label: { fr: 'Patrimoine et nature', en: 'Heritage and nature', fa: 'میراث و طبیعت' },
  },
  {
    id: 'venue',
    label: { fr: 'Lieux de culture', en: 'Cultural venues', fa: 'مکان‌های فرهنگی' },
  },
  {
    id: 'arts',
    label: { fr: 'Associations artistiques', en: 'Arts associations', fa: 'انجمن‌های هنری' },
  },
  {
    id: 'welcome',
    label: {
      fr: 'Accueil et interculturel',
      en: 'Welcome and intercultural',
      fa: 'پذیرش و میان‌فرهنگی',
    },
  },
];

export interface MapOrg {
  /** Official name, never translated. */
  name: string;
  text: T3;
  url: string;
}

export interface MapSite {
  id: string;
  /** Official name, never translated. */
  name: string;
  kind: MapKind;
  /** Public street address as published by the place itself or montreal.ca. */
  address: string;
  lat: number;
  lon: number;
  text: T3;
  /** Short cultural elements, shown as tags. */
  elements: T3[];
  url: Url3;
  /** Associations based at this address (the borough hall). */
  orgs?: MapOrg[];
  schemaType: string;
}

export const boroughDirectory = {
  label: {
    fr: 'Arrondissement de LaSalle, Répertoire des organismes (montreal.ca)',
    en: 'Borough of LaSalle, Directory of organizations (montreal.ca)',
    fa: 'بخش لسال، فهرست سازمان‌ها (montreal.ca)',
  },
  url: 'https://montreal.ca/articles/repertoire-des-organismes-de-lasalle-105826',
};

export const area = {
  name: { fr: 'LaSalle', en: 'LaSalle', fa: 'لسال' },
  center: [45.4285, -73.628] as [number, number],
};

export const sites: MapSite[] = [
  {
    id: 'moulin-fleming',
    name: 'Moulin Fleming',
    kind: 'heritage',
    address: '9675, boulevard LaSalle',
    lat: 45.42564,
    lon: -73.65943,
    text: {
      fr: 'Grand moulin à vent de type anglo-saxon, unique au Québec, bâti en 1827 par le meunier Fleming : l’emblème de LaSalle.',
      en: 'A large Anglo-Saxon-style windmill, unique in Québec, built in 1827 by the miller Fleming: the emblem of LaSalle.',
      fa: 'آسیاب بادی بزرگ به سبک انگلوساکسون، تنها نمونه در کبک، که آسیابان فلمینگ در سال ۱۸۲۷ ساخت: نماد لسال.',
    },
    elements: [
      { fr: 'Patrimoine bâti, 1827', en: 'Built heritage, 1827', fa: 'میراث معماری، ۱۸۲۷' },
      { fr: 'Aire de pique-nique', en: 'Picnic area', fa: 'محل پیک‌نیک' },
    ],
    url: {
      fr: 'https://montreal.ca/lieux/moulin-fleming',
      en: 'https://montreal.ca/en/places/moulin-fleming',
    },
    schemaType: 'LandmarksOrHistoricalBuildings',
  },
  {
    id: 'parc-des-rapides',
    name: 'Parc des Rapides',
    kind: 'heritage',
    address: '7770, boulevard LaSalle',
    lat: 45.42427,
    lon: -73.59863,
    text: {
      fr: 'Un havre de paix de 30 hectares au bord du fleuve, face aux rapides de Lachine.',
      en: 'A 30-hectare haven of peace on the river, facing the Lachine Rapids.',
      fa: 'پناهگاهی آرام به وسعت ۳۰ هکتار در کنار رود، روبه‌روی تندآب‌های لاشین.',
    },
    elements: [
      { fr: 'Fleuve Saint-Laurent', en: 'St. Lawrence River', fa: 'رود سن‌لوران' },
      { fr: 'Rapides de Lachine', en: 'Lachine Rapids', fa: 'تندآب‌های لاشین' },
    ],
    url: {
      fr: 'https://montreal.ca/lieux/parc-des-rapides',
      en: 'https://montreal.ca/en/places/parc-des-rapides',
    },
    schemaType: 'Park',
  },
  {
    id: 'octogone',
    name: 'Bibliothèque L’Octogone',
    kind: 'venue',
    address: '1080, avenue Dollard',
    lat: 45.42446,
    lon: -73.62291,
    text: {
      fr: 'La bibliothèque de LaSalle : prêt gratuit, salles de travail, coin des tout-petits, jeux et jouets, un café et des terrasses.',
      en: 'LaSalle’s library: free borrowing, work rooms, a toddler corner, toys and games, a café and terraces.',
      fa: 'کتابخانهٔ لسال: امانت رایگان، اتاق‌های کار، گوشهٔ کودکان خردسال، بازی و اسباب‌بازی، کافه و تراس.',
    },
    elements: [
      {
        fr: 'Livres en plusieurs langues',
        en: 'Books in many languages',
        fa: 'کتاب به زبان‌های گوناگون',
      },
      { fr: 'Gratuit', en: 'Free', fa: 'رایگان' },
    ],
    url: {
      fr: 'https://montreal.ca/lieux/bibliotheque-loctogone',
      en: 'https://montreal.ca/en/places/bibliotheque-loctogone',
    },
    schemaType: 'Library',
  },
  {
    id: 'henri-lemieux',
    name: 'Centre culturel et communautaire Henri-Lemieux',
    kind: 'venue',
    address: '7644, rue Édouard',
    lat: 45.431,
    lon: -73.59443,
    text: {
      fr: 'Le Théâtre du Grand Sault, la galerie Les Trois C et des salles polyvalentes : spectacles, concerts et expositions, gratuits sauf indication contraire.',
      en: 'The Théâtre du Grand Sault, the Les Trois C gallery and multi-use rooms: shows, concerts and exhibitions, free unless otherwise indicated.',
      fa: 'تئاتر گران‌سو، نگارخانهٔ «له تروا سه» و سالن‌های چندمنظوره: نمایش، کنسرت و نمایشگاه، رایگان مگر خلافش اعلام شود.',
    },
    elements: [
      { fr: 'Théâtre', en: 'Theatre', fa: 'تئاتر' },
      { fr: 'Galerie d’art', en: 'Art gallery', fa: 'نگارخانه' },
      { fr: 'Concerts', en: 'Concerts', fa: 'کنسرت' },
    ],
    url: {
      fr: 'https://montreal.ca/lieux/centre-culturel-et-communautaire-henri-lemieux',
      en: 'https://montreal.ca/en/places/centre-culturel-et-communautaire-henri-lemieux',
    },
    orgs: [
      {
        name: 'L’Avant-Scène de LaSalle',
        text: {
          fr: 'L’une des plus anciennes troupes francophones de théâtre amateur au Canada, fondée en 1952 : deux productions par année au Théâtre du Grand Sault.',
          en: 'One of the oldest French-language amateur theatre companies in Canada, founded in 1952: two productions a year at the Théâtre du Grand Sault.',
          fa: 'یکی از قدیمی‌ترین گروه‌های تئاتر آماتور فرانسوی‌زبان کانادا، بنیان‌گذاری‌شده در ۱۹۵۲: دو اجرا در سال در تئاتر گران‌سو.',
        },
        url: 'https://lavant-scene.ca',
      },
    ],
    schemaType: 'PerformingArtsTheater',
  },
  {
    id: 'mairie',
    name: 'Mairie d’arrondissement de LaSalle',
    kind: 'arts',
    address: '55, avenue Dupras',
    lat: 45.42865,
    lon: -73.66283,
    text: {
      fr: 'Le port d’attache de plusieurs associations artistiques reconnues par l’arrondissement.',
      en: 'The home base of several arts associations recognized by the borough.',
      fa: 'پایگاه چند انجمن هنری که بخش لسال به رسمیت شناخته است.',
    },
    elements: [
      { fr: 'Arts visuels', en: 'Visual arts', fa: 'هنرهای تجسمی' },
      { fr: 'Musique', en: 'Music', fa: 'موسیقی' },
      { fr: 'Photographie', en: 'Photography', fa: 'عکاسی' },
      { fr: 'Tambour d’acier', en: 'Steelpan', fa: 'استیل‌پن' },
    ],
    url: { fr: 'https://montreal.ca/lasalle', en: 'https://montreal.ca/en/lasalle' },
    orgs: [
      {
        name: 'Association des artistes de LaSalle',
        text: {
          fr: 'Promeut les arts visuels auprès des artistes et de la population lasalloise : Salon du printemps et Salon de l’automne.',
          en: 'Promotes the visual arts among artists and the people of LaSalle: a spring salon and an autumn salon.',
          fa: 'هنرهای تجسمی را میان هنرمندان و مردم لسال ترویج می‌کند: نمایشگاه بهاره و نمایشگاه پاییزه.',
        },
        url: 'https://artistesdelasalle.com',
      },
      {
        name: 'L’harmonie de l’AML (Association musicale de LaSalle)',
        text: {
          fr: 'Une harmonie qui réunit des musiciens de tous niveaux.',
          en: 'A concert band that brings together musicians of every level.',
          fa: 'ارکستر بادی که نوازندگان همهٔ سطح‌ها را گرد هم می‌آورد.',
        },
        url: 'https://harmonieaml.org',
      },
      {
        name: 'Club Photo LaSalle',
        text: {
          fr: 'Un défi photo par mois, des sorties, des conférences et des expositions annuelles.',
          en: 'A photo challenge every month, outings, talks and annual exhibitions.',
          fa: 'هر ماه یک چالش عکاسی، گردش‌ها، سخنرانی‌ها و نمایشگاه‌های سالانه.',
        },
        url: 'https://clubphotolasalle.ca',
      },
      {
        name: 'Savoys Atelier de Tambours Métalliques',
        text: {
          fr: 'Le steelpan, ou tambour d’acier, instrument né à Trinité-et-Tobago, pour tous les âges et tous les niveaux, les mardis et jeudis.',
          en: 'The steelpan, the steel drum born in Trinidad and Tobago, for every age and level, on Tuesdays and Thursdays.',
          fa: 'استیل‌پن یا طبل فلزی، سازی زادهٔ ترینیداد و توباگو، برای همهٔ سنین و همهٔ سطح‌ها، سه‌شنبه‌ها و پنجشنبه‌ها.',
        },
        url: 'https://albinomartin86.wixsite.com/savoys-atelier-de-ta',
      },
    ],
    schemaType: 'CivicStructure',
  },
  {
    id: 'air-som-prisme',
    name: 'AIR-SOM / Centre PRISME',
    kind: 'welcome',
    address: '414, avenue Lafleur',
    lat: 45.4319,
    lon: -73.6467,
    text: {
      fr: 'Accompagne les nouveaux arrivants dans leur intégration « dans un esprit LaSallois », avec des activités d’immersion socioculturelle et de promotion de la diversité.',
      en: 'Supports newcomers as they settle in, “in a LaSalle spirit”, with socio-cultural immersion activities and activities that celebrate diversity.',
      fa: 'تازه‌واردان را در جاافتادن همراهی می‌کند، «با روحیهٔ لسالی»، با برنامه‌های آشنایی اجتماعی‌فرهنگی و ترویج تنوع.',
    },
    elements: [
      { fr: 'Nouveaux arrivants', en: 'Newcomers', fa: 'تازه‌واردان' },
      { fr: 'Diversité', en: 'Diversity', fa: 'تنوع' },
      { fr: 'Expositions', en: 'Exhibitions', fa: 'نمایشگاه' },
    ],
    url: 'https://www.airsomprisme.org/',
    schemaType: 'Organization',
  },
  {
    id: 'lmrc',
    name: 'LaSalle Multicultural Resource Center',
    kind: 'welcome',
    address: '410, avenue Lafleur',
    lat: 45.43173,
    lon: -73.64678,
    text: {
      fr: 'Centre multiculturel de ressources de LaSalle : du soutien et un accès à des services en anglais pour les familles de toutes origines.',
      en: 'LaSalle’s multicultural resource centre: support and access to services in English for families of every background.',
      fa: 'مرکز منابع چندفرهنگی لسال: پشتیبانی و دسترسی به خدمات انگلیسی‌زبان برای خانواده‌هایی از هر پیشینه.',
    },
    elements: [
      { fr: 'Multiculturel', en: 'Multicultural', fa: 'چندفرهنگی' },
      { fr: 'Services en anglais', en: 'Services in English', fa: 'خدمات انگلیسی‌زبان' },
    ],
    url: 'https://lmrcenter.org',
    schemaType: 'Organization',
  },
  {
    id: 'bai',
    name: 'Bienvenue à l’immigrant (BAI)',
    kind: 'welcome',
    address: '7580, rue Centrale',
    lat: 45.43292,
    lon: -73.5973,
    text: {
      fr: 'Informe, oriente et accompagne les nouveaux arrivants à chaque étape de leur intégration.',
      en: 'Informs, guides and supports newcomers at every step of settling in.',
      fa: 'تازه‌واردان را در هر مرحلهٔ جاافتادن آگاه می‌کند، راهنمایی می‌کند و همراهی می‌کند.',
    },
    elements: [
      { fr: 'Nouveaux arrivants', en: 'Newcomers', fa: 'تازه‌واردان' },
      { fr: 'Familles et jeunes', en: 'Families and youth', fa: 'خانواده‌ها و جوانان' },
    ],
    url: 'https://bienvenueimmigrant.org',
    schemaType: 'Organization',
  },
];

/** Recognized associations with no public venue: listed, never pinned on a home address. */
export const withoutVenue: MapOrg[] = [
  {
    name: 'Associazione Messinese di Montreal',
    text: {
      fr: 'Fondée en 1981 par des personnes originaires de la province de Messine, en Sicile, pour préserver leur culture, leur langue et leurs traditions.',
      en: 'Founded in 1981 by people from the province of Messina, in Sicily, to preserve their culture, language and traditions.',
      fa: 'در سال ۱۹۸۱ به دست مردمی از استان مسینا در سیسیل بنیان گذاشته شد تا فرهنگ، زبان و سنت‌هایشان را پاس بدارند.',
    },
    url: 'https://associazionemessinesedimontreal.com/',
  },
];

/* ------------------------------------------------------------------------ *
 * Page texts (drafted by Claude for the owner's review; Persian is a draft)
 * ------------------------------------------------------------------------ */
export const strings = {
  nav: {
    fr: 'Carte vivante des cultures',
    en: 'Living Map of Cultures',
    fa: 'نقشهٔ زندهٔ فرهنگ‌ها',
  },
  title: {
    fr: 'Carte vivante des cultures',
    en: 'Living Map of Cultures',
    fa: 'نقشهٔ زندهٔ فرهنگ‌ها',
  },
  lede: {
    fr: 'Les lieux, les associations et les traditions qui font vivre les cultures de nos quartiers. Nous commençons par LaSalle, là où Matin travaille.',
    en: 'The places, associations and traditions that keep the cultures of our neighbourhoods alive. We begin with LaSalle, where Matin works.',
    fa: 'مکان‌ها، انجمن‌ها و سنت‌هایی که فرهنگ‌های محله‌های ما را زنده نگه می‌دارند. از لسال آغاز می‌کنیم، جایی که متین در آن کار می‌کند.',
  },
  description: {
    fr: 'Une carte interactive des lieux culturels, des associations artistiques et des organismes d’accueil et interculturels de LaSalle, à Montréal. Bientôt, tout Montréal.',
    en: 'An interactive map of the cultural venues, arts associations and welcome and intercultural organizations of LaSalle, in Montréal. All of Montréal coming soon.',
    fa: 'نقشه‌ای تعاملی از مکان‌های فرهنگی، انجمن‌های هنری و سازمان‌های پذیرش و میان‌فرهنگی لسال در مونترال. به‌زودی همهٔ مونترال.',
  },
  soonLabel: { fr: 'Bientôt', en: 'Coming soon', fa: 'به‌زودی' },
  soonTitle: {
    fr: 'LaSalle, pour commencer',
    en: 'LaSalle, to begin with',
    fa: 'لسال، برای آغاز',
  },
  soonText: {
    fr: 'Nous ajouterons bientôt les autres arrondissements de Montréal, puis d’autres villes du Québec et du Canada. Vous connaissez un lieu ou un organisme culturel qui devrait y figurer ? Écrivez-nous.',
    en: 'We will soon add the other boroughs of Montréal, then other cities in Québec and Canada. Do you know a cultural place or organization that should be on the map? Write to us.',
    fa: 'به‌زودی بخش‌های دیگر مونترال و سپس شهرهای دیگر کبک و کانادا را اضافه می‌کنیم. مکان یا سازمان فرهنگی‌ای می‌شناسید که باید روی نقشه باشد؟ برای ما بنویسید.',
  },
  soonCta: { fr: 'Proposer un lieu', en: 'Suggest a place', fa: 'پیشنهاد یک مکان' },
  regions: [
    { name: { fr: 'LaSalle', en: 'LaSalle', fa: 'لسال' }, live: true },
    { name: { fr: 'Montréal', en: 'Montréal', fa: 'مونترال' }, live: false },
    { name: { fr: 'Québec', en: 'Québec', fa: 'کبک' }, live: false },
    { name: { fr: 'Canada', en: 'Canada', fa: 'کانادا' }, live: false },
  ],
  filterLabel: { fr: 'Afficher', en: 'Show', fa: 'نمایش' },
  all: { fr: 'Tout', en: 'All', fa: 'همه' },
  mapLabel: {
    fr: 'Carte interactive de LaSalle',
    en: 'Interactive map of LaSalle',
    fa: 'نقشهٔ تعاملی لسال',
  },
  mapHint: {
    fr: 'Touchez un point ou une fiche pour le situer.',
    en: 'Tap a pin or a card to locate it.',
    fa: 'روی یک نقطه یا کارت بزنید تا جایش را ببینید.',
  },
  noScript: {
    fr: 'La carte a besoin de JavaScript ; la liste ci-dessous donne tous les lieux.',
    en: 'The map needs JavaScript; the list below gives every place.',
    fa: 'نقشه به جاوااسکریپت نیاز دارد؛ فهرست زیر همهٔ مکان‌ها را دارد.',
  },
  showOnMap: { fr: 'Voir sur la carte', en: 'Show on the map', fa: 'نمایش روی نقشه' },
  officialSite: { fr: 'Site officiel', en: 'Official website', fa: 'وبگاه رسمی' },
  basedHere: { fr: 'Basées ici', en: 'Based here', fa: 'مستقر در اینجا' },
  withoutVenueTitle: {
    fr: 'Aussi actives à LaSalle',
    en: 'Also active in LaSalle',
    fa: 'فعال در لسال',
  },
  withoutVenueText: {
    fr: 'Ces associations n’ont pas de lieu public : elles ne sont pas placées sur la carte.',
    en: 'These associations have no public venue, so they are not placed on the map.',
    fa: 'این انجمن‌ها مکان عمومی ندارند و به همین دلیل روی نقشه نیستند.',
  },
  sourcesTitle: { fr: 'Sources', en: 'Sources', fa: 'منابع' },
  sourcesText: {
    fr: 'Seuls des lieux et des organismes vérifiés figurent ici : ils sont reconnus par l’arrondissement ou par la Ville de Montréal et ont leur propre site officiel. Positions : service de géolocalisation du gouvernement du Canada (geo.ca). Fond de carte : © les contributeurs d’OpenStreetMap. Mention à titre informatif seulement : elle n’implique aucun partenariat.',
    en: 'Only verified places and organizations appear here: they are recognized by the borough or the City of Montréal and have their own official website. Positions: Government of Canada geolocation service (geo.ca). Base map: © OpenStreetMap contributors. Listed for information only: this does not imply any partnership.',
    fa: 'فقط مکان‌ها و سازمان‌های تأییدشده اینجا هستند: بخش لسال یا شهرداری مونترال آن‌ها را به رسمیت شناخته و هر کدام وبگاه رسمی خود را دارد. مختصات: سرویس مکان‌یابی دولت کانادا (geo.ca). نقشهٔ پایه: © مشارکت‌کنندگان اوپن‌استریت‌مپ. این فهرست تنها برای آگاهی است و به معنای همکاری یا شراکت نیست.',
  },
  checked: {
    fr: 'Vérifié le 31 octobre 2026',
    en: 'Checked on October 31, 2026',
    fa: 'بررسی‌شده در ۳۱ اکتبر ۲۰۲۶',
  },
} satisfies Record<string, unknown>;
