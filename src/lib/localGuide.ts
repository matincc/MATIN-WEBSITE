/**
 * Local Guide (owner's request, Oct 30 2026: "the site should also be a smart directory
 * for its visitors"): LaSalle first, where Matin works, then Montréal, Québec and Canada.
 * Every figure and every place comes from an official source, linked beside it; nothing is
 * estimated or invented. Checked on 2026-10-30 (`checkedOn`). When Statistics Canada
 * publishes the 2026 Census, replace the 2021 figures and their sources here.
 * Persian texts are drafts until the owner reviews them.
 */
import type { UiLang } from '@/i18n/routes';

export type T3 = Record<UiLang, string>;
/** A link that may differ per language (FA uses the English page when there is no Persian one). */
export type Url3 = string | { fr: string; en: string };

export const urlFor = (u: Url3, lang: UiLang) =>
  typeof u === 'string' ? u : lang === 'fr' ? u.fr : u.en;

export const checkedOn = '2026-10-30';

export interface GuideSource {
  label: T3;
  url: Url3;
}

/* ------------------------------------------------------------------------ *
 * Official sources
 * ------------------------------------------------------------------------ */
const src = {
  lasalleCensus: {
    label: {
      fr: 'Ville de Montréal, Montréal en statistiques, profil de district (données : Statistique Canada, Recensement de 2021)',
      en: 'City of Montréal, Montréal en statistiques, district profile (data: Statistics Canada, 2021 Census)',
      fa: 'شهرداری مونترال، «مونترال در آمار»، نمایهٔ ناحیه (داده‌ها: ادارهٔ آمار کانادا، سرشماری ۲۰۲۱)',
    },
    url: 'https://ville.montreal.qc.ca/pls/portal/url/item/3907D308DFB42020E0630A9301322020',
  },
  lasalleAbout: {
    label: {
      fr: 'Ville de Montréal, « LaSalle » (montreal.ca)',
      en: 'City of Montréal, "LaSalle" (montreal.ca)',
      fa: 'شهرداری مونترال، صفحهٔ «لسال» (montreal.ca)',
    },
    url: { fr: 'https://montreal.ca/apropos/lasalle', en: 'https://montreal.ca/en/about/lasalle' },
  },
  montrealPopulation: {
    label: {
      fr: 'Ville de Montréal, « Évolution de la population entre 2016 et 2021 » (données : Statistique Canada, Recensement de 2021)',
      en: 'City of Montréal, "Évolution de la population entre 2016 et 2021" (data: Statistics Canada, 2021 Census)',
      fa: 'شهرداری مونترال، «تحول جمعیت میان ۲۰۱۶ و ۲۰۲۱» (داده‌ها: ادارهٔ آمار کانادا، سرشماری ۲۰۲۱)',
    },
    url: 'https://ville.montreal.qc.ca/pls/portal/url/item/D7B3C40A309A2026E0530A9301322026',
  },
  libraryNetwork: {
    label: {
      fr: 'Ville de Montréal, Réseau des bibliothèques',
      en: 'City of Montréal, Library network',
      fa: 'شهرداری مونترال، شبکهٔ کتابخانه‌ها',
    },
    url: {
      fr: 'https://montreal.ca/sujets/reseau-des-bibliotheques',
      en: 'https://montreal.ca/en/topics/library-network',
    },
  },
  canadaAtAGlance: {
    label: {
      fr: 'Statistique Canada, Le Canada en un coup d’œil 2022 (Recensement de 2021)',
      en: 'Statistics Canada, Canada at a Glance 2022 (2021 Census)',
      fa: 'ادارهٔ آمار کانادا، «کانادا در یک نگاه ۲۰۲۲» (سرشماری ۲۰۲۱)',
    },
    url: {
      fr: 'https://www150.statcan.gc.ca/n1/pub/12-581-x/2022001/sec1-fra.htm',
      en: 'https://www150.statcan.gc.ca/n1/pub/12-581-x/2022001/sec1-eng.htm',
    },
  },
  populationEstimates: {
    label: {
      fr: 'Statistique Canada, Le Quotidien, 23 septembre 2026 : estimations de la population au 1er juillet 2026',
      en: 'Statistics Canada, The Daily, September 23, 2026: population estimates on July 1, 2026',
      fa: 'ادارهٔ آمار کانادا، «دِیلی»، ۲۳ سپتامبر ۲۰۲۶: برآورد جمعیت در ۱ ژوئیهٔ ۲۰۲۶',
    },
    url: {
      fr: 'https://www150.statcan.gc.ca/n1/daily-quotidien/260923/dq260923b-fra.htm',
      en: 'https://www150.statcan.gc.ca/n1/daily-quotidien/260923/dq260923b-eng.htm',
    },
  },
} satisfies Record<string, GuideSource>;

/* ------------------------------------------------------------------------ *
 * Figures and places
 * ------------------------------------------------------------------------ */
export interface GuideFigure {
  value: number;
  /** Digits after the decimal point (percentages, ages). */
  decimals?: number;
  unit?: '%' | 'km²';
  label: T3;
  source: GuideSource;
}

export type PlaceKind = 'culture' | 'library' | 'park' | 'community' | 'services' | 'data';

export interface GuidePlace {
  /** The place's or organization's official name, never translated. */
  name: string;
  kind: PlaceKind;
  note: T3;
  url: Url3;
}

export interface GuideFact {
  text: T3;
}

export interface GuideRegion {
  id: 'lasalle' | 'montreal' | 'quebec' | 'canada';
  kicker: T3;
  title: T3;
  intro: T3;
  introSource?: GuideSource;
  figures: GuideFigure[];
  /** Short facts from one official page (`factsSource`). */
  facts?: GuideFact[];
  factsSource?: GuideSource;
  /** A share breakdown shown as labelled bars. */
  shares?: { title: T3; items: { label: T3; value: number }[]; source: GuideSource };
  places: GuidePlace[];
}

export const regions: GuideRegion[] = [
  {
    id: 'lasalle',
    kicker: { fr: 'Notre quartier', en: 'Our neighbourhood', fa: 'محلهٔ ما' },
    title: { fr: 'LaSalle', en: 'LaSalle', fa: 'لسال' },
    intro: {
      fr: 'Constituée en municipalité en 1912, LaSalle est un arrondissement de Montréal depuis le 1er janvier 2002. Elle longe le fleuve, face aux rapides de Lachine, et a pour emblème le moulin Fleming, qui date de 1827.',
      en: 'Incorporated as a municipality in 1912, LaSalle has been a borough of Montréal since January 1, 2002. It runs along the river, facing the Lachine Rapids, and its symbol is the Fleming Mill, which dates back to 1827.',
      fa: 'لسال در سال ۱۹۱۲ شهرداری مستقل شد و از ۱ ژانویهٔ ۲۰۰۲ یکی از بخش‌های شهر مونترال است. در کنار رود سن‌لوران و روبه‌روی تندآب‌های لاشین قرار دارد و نمادش آسیاب بادی فلمینگ است که به سال ۱۸۲۷ برمی‌گردد.',
    },
    introSource: src.lasalleAbout,
    figures: [
      {
        value: 82235,
        label: { fr: 'habitants', en: 'residents', fa: 'نفر جمعیت' },
        source: src.lasalleCensus,
      },
      {
        value: 35.3,
        decimals: 1,
        unit: '%',
        label: {
          fr: 'des résidents sont des personnes immigrantes',
          en: 'of residents are immigrants',
          fa: 'از ساکنان، مهاجرند',
        },
        source: src.lasalleCensus,
      },
      {
        value: 35770,
        label: { fr: 'ménages', en: 'households', fa: 'خانوار' },
        source: src.lasalleCensus,
      },
      {
        value: 42.4,
        decimals: 1,
        label: { fr: 'ans : l’âge moyen', en: 'years: the average age', fa: 'سال: میانگین سن' },
        source: src.lasalleCensus,
      },
    ],
    shares: {
      title: {
        fr: 'Langue parlée le plus souvent à la maison',
        en: 'Language spoken most often at home',
        fa: 'زبانی که بیشتر در خانه صحبت می‌شود',
      },
      items: [
        { label: { fr: 'Français seulement', en: 'French only', fa: 'فقط فرانسوی' }, value: 35.3 },
        { label: { fr: 'Anglais seulement', en: 'English only', fa: 'فقط انگلیسی' }, value: 33.8 },
        {
          label: {
            fr: 'Une autre langue seulement',
            en: 'Another language only',
            fa: 'فقط زبانی دیگر',
          },
          value: 22.6,
        },
        {
          label: { fr: 'Plusieurs langues', en: 'Several languages', fa: 'چند زبان' },
          value: 8.3,
        },
      ],
      source: src.lasalleCensus,
    },
    facts: [
      {
        text: {
          fr: '16,3 km² de territoire',
          en: '16.3 km² of land',
          fa: '۱۶٫۳ کیلومتر مربع وسعت',
        },
      },
      {
        text: {
          fr: '40 parcs de quartier et un grand parc le long des rapides',
          en: '40 neighbourhood parks and one large park along the Rapids',
          fa: '۴۰ پارک محلی و یک پارک بزرگ در کنار تندآب‌ها',
        },
      },
      { text: { fr: '1 bibliothèque', en: '1 library', fa: '۱ کتابخانه' } },
      {
        text: {
          fr: '24 km de pistes cyclables',
          en: '24 km of bicycle paths',
          fa: '۲۴ کیلومتر مسیر دوچرخه‌سواری',
        },
      },
      {
        text: {
          fr: '2 jardins communautaires',
          en: '2 community gardens',
          fa: '۲ باغچهٔ اشتراکی',
        },
      },
    ],
    factsSource: src.lasalleAbout,
    places: [
      {
        name: 'Bibliothèque L’Octogone',
        kind: 'library',
        note: {
          fr: 'La bibliothèque de LaSalle : prêt gratuit, salles de travail, coin des tout-petits, plus de 1 150 jeux et jouets, un café et des terrasses.',
          en: 'LaSalle’s library: free borrowing, work rooms, a toddler corner, over 1,150 toys and games, a café and terraces.',
          fa: 'کتابخانهٔ لسال: امانت رایگان، اتاق‌های کار، گوشهٔ کودکان خردسال، بیش از ۱۱۵۰ بازی و اسباب‌بازی، کافه و تراس.',
        },
        url: {
          fr: 'https://montreal.ca/lieux/bibliotheque-loctogone',
          en: 'https://montreal.ca/en/places/bibliotheque-loctogone',
        },
      },
      {
        name: 'Centre culturel et communautaire Henri-Lemieux',
        kind: 'culture',
        note: {
          fr: 'Le Théâtre du Grand Sault (115 places), la galerie Les Trois C et des salles polyvalentes : spectacles, concerts et expositions, gratuits sauf indication contraire.',
          en: 'The Théâtre du Grand Sault (115 seats), the Les Trois C gallery and multi-use rooms: shows, concerts and exhibitions, free unless otherwise indicated.',
          fa: 'تئاتر گران‌سو (۱۱۵ صندلی)، نگارخانهٔ «له تروا سه» و سالن‌های چندمنظوره: نمایش، کنسرت و نمایشگاه، رایگان مگر خلافش اعلام شود.',
        },
        url: {
          fr: 'https://montreal.ca/lieux/centre-culturel-et-communautaire-henri-lemieux',
          en: 'https://montreal.ca/en/places/centre-culturel-et-communautaire-henri-lemieux',
        },
      },
      {
        name: 'Moulin Fleming',
        kind: 'culture',
        note: {
          fr: 'Érigé en 1827, classé monument historique en 1983 et restauré en 2024 : l’emblème de LaSalle.',
          en: 'Built in 1827, classified as a historic monument in 1983 and restored in 2024: the symbol of LaSalle.',
          fa: 'ساخته‌شده در ۱۸۲۷، ثبت‌شده به‌عنوان بنای تاریخی در ۱۹۸۳ و بازسازی‌شده در ۲۰۲۴: نماد لسال.',
        },
        url: {
          fr: 'https://montreal.ca/lieux/moulin-fleming',
          en: 'https://montreal.ca/en/places/moulin-fleming',
        },
      },
      {
        name: 'Programmation culturelle de LaSalle',
        kind: 'culture',
        note: {
          fr: 'Les spectacles, expositions et activités de la saison, publiés par l’arrondissement.',
          en: 'The season’s shows, exhibitions and activities, published by the borough.',
          fa: 'نمایش‌ها، نمایشگاه‌ها و فعالیت‌های فصل، به انتشار بخش لسال.',
        },
        url: {
          fr: 'https://montreal.ca/articles/programmation-culturelle-de-lasalle-61214',
          en: 'https://montreal.ca/en/articles/lasalle-cultural-program-61214',
        },
      },
      {
        name: 'Parc des Rapides',
        kind: 'park',
        note: {
          fr: 'Un havre de paix de 30 hectares face aux rapides de Lachine, où l’on aperçoit les grands hérons.',
          en: 'A 30-hectare haven of peace facing the Lachine Rapids, where great blue herons can be seen.',
          fa: 'پناهگاهی آرام به وسعت ۳۰ هکتار روبه‌روی تندآب‌های لاشین، جایی برای دیدن حواصیل‌های بزرگ.',
        },
        url: {
          fr: 'https://montreal.ca/lieux/parc-des-rapides',
          en: 'https://montreal.ca/en/places/parc-des-rapides',
        },
      },
      {
        name: 'Belvédères du parc des Rapides',
        kind: 'park',
        note: {
          fr: 'Des points de vue sur les rapides de Lachine, pour observer plus de 225 espèces d’oiseaux.',
          en: 'Lookouts over the Lachine Rapids, to watch more than 225 bird species.',
          fa: 'سکوهای تماشا رو به تندآب‌های لاشین، برای دیدن بیش از ۲۲۵ گونه پرنده.',
        },
        url: {
          fr: 'https://montreal.ca/lieux/belvederes-du-parc-des-rapides',
          en: 'https://montreal.ca/en/places/parc-des-rapides-lookouts',
        },
      },
      {
        name: 'Guide de la vie citoyenne et répertoire des organismes de LaSalle',
        kind: 'community',
        note: {
          fr: 'Le guide officiel de l’arrondissement (édition 2026-2027) : services municipaux, organismes reconnus, installations culturelles et sportives.',
          en: 'The borough’s official guide (2026-2027 edition, in French): municipal services, recognized organizations, cultural and sports facilities.',
          fa: 'راهنمای رسمی بخش لسال (ویرایش ۲۰۲۶-۲۰۲۷، به فرانسوی): خدمات شهری، سازمان‌های شناخته‌شده، مراکز فرهنگی و ورزشی.',
        },
        url: 'https://montreal.ca/articles/guide-de-la-vie-citoyenne-et-repertoire-des-organismes-de-lasalle-33949',
      },
      {
        name: 'Arrondissement de LaSalle',
        kind: 'services',
        note: {
          fr: 'Les services, les nouvelles et les avis de l’arrondissement.',
          en: 'The borough’s services, news and notices.',
          fa: 'خدمات، خبرها و اطلاعیه‌های بخش لسال.',
        },
        url: { fr: 'https://montreal.ca/lasalle', en: 'https://montreal.ca/en/lasalle' },
      },
    ],
  },
  {
    id: 'montreal',
    kicker: { fr: 'Notre ville', en: 'Our city', fa: 'شهر ما' },
    title: { fr: 'Montréal', en: 'Montréal', fa: 'مونترال' },
    intro: {
      fr: 'Montréal compte 19 arrondissements et un réseau de 46 bibliothèques municipales, ouvertes à toutes et à tous.',
      en: 'Montréal has 19 boroughs and a network of 46 municipal libraries, open to everyone.',
      fa: 'مونترال ۱۹ بخش (آروندیسمان) و شبکه‌ای از ۴۶ کتابخانهٔ شهری دارد که به روی همه باز است.',
    },
    introSource: src.libraryNetwork,
    figures: [
      {
        value: 1762949,
        label: {
          fr: 'habitants dans la ville de Montréal',
          en: 'residents in the City of Montréal',
          fa: 'نفر جمعیت شهر مونترال',
        },
        source: src.montrealPopulation,
      },
      {
        value: 2004265,
        label: {
          fr: 'habitants dans l’agglomération (l’île de Montréal)',
          en: 'residents in the agglomeration (the Island of Montréal)',
          fa: 'نفر جمعیت در مجموعهٔ شهری (جزیرهٔ مونترال)',
        },
        source: src.montrealPopulation,
      },
      {
        value: 4291732,
        label: {
          fr: 'habitants dans la région métropolitaine',
          en: 'residents in the metropolitan area',
          fa: 'نفر جمعیت در منطقهٔ کلان‌شهری',
        },
        source: src.canadaAtAGlance,
      },
    ],
    places: [
      {
        name: 'Bibliothèques de Montréal',
        kind: 'library',
        note: {
          fr: 'Les 46 bibliothèques de la ville, leurs horaires et l’abonnement gratuit.',
          en: 'The city’s 46 libraries, their hours and the free membership.',
          fa: '۴۶ کتابخانهٔ شهر، ساعت‌های کار و عضویت رایگان.',
        },
        url: {
          fr: 'https://montreal.ca/sujets/reseau-des-bibliotheques',
          en: 'https://montreal.ca/en/topics/library-network',
        },
      },
      {
        name: 'Maisons de la culture',
        kind: 'culture',
        note: {
          fr: 'Le réseau municipal de diffusion culturelle, dans les arrondissements.',
          en: 'The city’s network of cultural venues, across the boroughs.',
          fa: 'شبکهٔ شهری خانه‌های فرهنگ در بخش‌های مختلف شهر.',
        },
        url: {
          fr: 'https://montreal.ca/lieux?mtl_content.lieux.tags.code=PR004&orderBy=dc_title',
          en: 'https://montreal.ca/en/places?mtl_content.lieux.tags.code=PR004&orderBy=dc_title',
        },
      },
      {
        name: 'Conseil des arts de Montréal',
        kind: 'culture',
        note: {
          fr: 'Le soutien public aux artistes et aux organismes artistiques de l’île.',
          en: 'Public support for artists and arts organizations on the island.',
          fa: 'نهاد عمومی پشتیبانی از هنرمندان و سازمان‌های هنری جزیرهٔ مونترال.',
        },
        url: 'https://www.artsmontreal.org/',
      },
      {
        name: 'Tourisme Montréal',
        kind: 'culture',
        note: {
          fr: 'Le guide officiel de la ville : quartiers, festivals, musées et sorties.',
          en: 'The city’s official guide: neighbourhoods, festivals, museums and outings.',
          fa: 'راهنمای رسمی شهر: محله‌ها، جشنواره‌ها، موزه‌ها و برنامه‌ها.',
        },
        url: { fr: 'https://www.mtl.org/fr', en: 'https://www.mtl.org/en' },
      },
      {
        name: 'Service de la diversité et de l’inclusion sociale',
        kind: 'services',
        note: {
          fr: 'Le service de la Ville pour l’inclusion, notamment des personnes nouvellement arrivées.',
          en: 'The City’s department for inclusion, including of newcomers.',
          fa: 'ادارهٔ شهرداری برای همه‌شمولی اجتماعی، از جمله برای تازه‌واردان.',
        },
        url: 'https://montreal.ca/unites/service-de-la-diversite-et-de-linclusion-sociale',
      },
    ],
  },
  {
    id: 'quebec',
    kicker: { fr: 'Notre province', en: 'Our province', fa: 'استان ما' },
    title: { fr: 'Québec', en: 'Québec', fa: 'کبک' },
    intro: {
      fr: 'Le Québec, sa langue officielle, le français, ses institutions culturelles et ses services d’accueil pour les personnes immigrantes.',
      en: 'Québec, its official language, French, its cultural institutions and its welcome services for immigrants.',
      fa: 'کبک، با زبان رسمی‌اش، فرانسوی، نهادهای فرهنگی‌اش و خدماتش برای استقبال از مهاجران.',
    },
    figures: [
      {
        value: 8501833,
        label: {
          fr: 'habitants au Recensement de 2021',
          en: 'residents at the 2021 Census',
          fa: 'نفر جمعیت در سرشماری ۲۰۲۱',
        },
        source: src.canadaAtAGlance,
      },
      {
        value: 9067114,
        label: {
          fr: 'habitants estimés au 1er juillet 2026',
          en: 'estimated residents on July 1, 2026',
          fa: 'نفر جمعیت برآوردشده در ۱ ژوئیهٔ ۲۰۲۶',
        },
        source: src.populationEstimates,
      },
    ],
    places: [
      {
        name: 'Service d’intégration pour les personnes immigrantes',
        kind: 'services',
        note: {
          fr: 'Le service gratuit du gouvernement du Québec pour accompagner les personnes immigrantes dans leur installation.',
          en: 'The Québec government’s free service that helps immigrants settle in.',
          fa: 'خدمت رایگان دولت کبک برای همراهی مهاجران در استقرار و جاافتادن.',
        },
        url: {
          fr: 'https://www.quebec.ca/immigration/service-integration-personnes-immigrantes',
          en: 'https://www.quebec.ca/en/immigration/integration-service-for-immigrants',
        },
      },
      {
        name: 'Ministère de la Culture et des Communications',
        kind: 'culture',
        note: {
          fr: 'Le ministère responsable de la culture et du patrimoine au Québec.',
          en: 'The ministry responsible for culture and heritage in Québec.',
          fa: 'وزارتخانهٔ مسئول فرهنگ و میراث در کبک.',
        },
        url: 'https://www.quebec.ca/gouvernement/ministeres-organismes/culture-communications',
      },
      {
        name: 'Bibliothèque et Archives nationales du Québec (BAnQ)',
        kind: 'library',
        note: {
          fr: 'La Grande Bibliothèque, les archives du Québec et l’abonnement gratuit pour les résidents.',
          en: 'The Grande Bibliothèque, Québec’s archives and free membership for residents.',
          fa: 'کتابخانهٔ بزرگ، بایگانی ملی کبک و عضویت رایگان برای ساکنان.',
        },
        url: 'https://www.banq.qc.ca/',
      },
      {
        name: 'Institut de la statistique du Québec',
        kind: 'data',
        note: {
          fr: 'Les statistiques officielles du Québec, par région et par sujet.',
          en: 'Québec’s official statistics, by region and by topic.',
          fa: 'آمار رسمی کبک، بر پایهٔ منطقه و موضوع.',
        },
        url: 'https://statistique.quebec.ca/',
      },
    ],
  },
  {
    id: 'canada',
    kicker: { fr: 'Notre pays', en: 'Our country', fa: 'کشور ما' },
    title: { fr: 'Canada', en: 'Canada', fa: 'کانادا' },
    intro: {
      fr: 'Le Canada, ses deux langues officielles, ses institutions culturelles fédérales et ses services gratuits pour les nouveaux arrivants.',
      en: 'Canada, its two official languages, its federal cultural institutions and its free services for newcomers.',
      fa: 'کانادا، با دو زبان رسمی، نهادهای فرهنگی فدرال و خدمات رایگان برای تازه‌واردان.',
    },
    figures: [
      {
        value: 36991981,
        label: {
          fr: 'habitants au Recensement de 2021',
          en: 'residents at the 2021 Census',
          fa: 'نفر جمعیت در سرشماری ۲۰۲۱',
        },
        source: src.canadaAtAGlance,
      },
      {
        value: 41798407,
        label: {
          fr: 'habitants estimés au 1er juillet 2026',
          en: 'estimated residents on July 1, 2026',
          fa: 'نفر جمعیت برآوردشده در ۱ ژوئیهٔ ۲۰۲۶',
        },
        source: src.populationEstimates,
      },
    ],
    places: [
      {
        name: 'Immigration, Réfugiés et Citoyenneté Canada',
        kind: 'services',
        note: {
          fr: 'Trouver les services gratuits pour nouveaux arrivants près de chez soi.',
          en: 'Find free newcomer services near you.',
          fa: 'یافتن خدمات رایگان برای تازه‌واردان در نزدیکی محل زندگی.',
        },
        url: {
          fr: 'https://ircc.canada.ca/francais/nouveaux/services/index.asp',
          en: 'https://ircc.canada.ca/english/newcomers/services/index.asp',
        },
      },
      {
        name: 'Statistique Canada',
        kind: 'data',
        note: {
          fr: 'Le recensement et les statistiques officielles du pays.',
          en: 'The census and the country’s official statistics.',
          fa: 'سرشماری و آمار رسمی کشور.',
        },
        url: {
          fr: 'https://www12.statcan.gc.ca/census-recensement/index-fra.cfm',
          en: 'https://www12.statcan.gc.ca/census-recensement/index-eng.cfm',
        },
      },
      {
        name: 'Conseil des arts du Canada',
        kind: 'culture',
        note: {
          fr: 'Le soutien public fédéral aux arts.',
          en: 'Canada’s federal public support for the arts.',
          fa: 'نهاد فدرال پشتیبانی عمومی از هنر.',
        },
        url: 'https://canadacouncil.ca/',
      },
      {
        name: 'Patrimoine canadien',
        kind: 'culture',
        note: {
          fr: 'Le ministère fédéral de la culture, du patrimoine et des langues officielles.',
          en: 'The federal department for culture, heritage and official languages.',
          fa: 'وزارتخانهٔ فدرال فرهنگ، میراث و زبان‌های رسمی.',
        },
        url: {
          fr: 'https://www.canada.ca/fr/patrimoine-canadien.html',
          en: 'https://www.canada.ca/en/canadian-heritage.html',
        },
      },
      {
        name: 'Bibliothèque et Archives Canada',
        kind: 'library',
        note: {
          fr: 'La mémoire documentaire du pays : livres, archives, photos et généalogie.',
          en: 'The country’s documentary memory: books, archives, photos and genealogy.',
          fa: 'حافظهٔ مستند کشور: کتاب، بایگانی، عکس و تبارشناسی.',
        },
        url: {
          fr: 'https://www.canada.ca/fr/bibliotheque-archives.html',
          en: 'https://www.canada.ca/en/library-archives.html',
        },
      },
    ],
  },
];

/* ------------------------------------------------------------------------ *
 * Interface words
 * ------------------------------------------------------------------------ */
const fr = {
  title: 'Guide local',
  metaTitle: 'Guide local : LaSalle, Montréal, Québec, Canada',
  lede: 'LaSalle, Montréal, le Québec et le Canada en chiffres vérifiés et en adresses utiles : un guide que nous tenons à jour pour nos voisins, les personnes nouvellement arrivées et toutes celles et ceux qui font vivre leur quartier.',
  jumpLabel: 'Aller à',
  whyTitle: 'Pourquoi ce guide ?',
  whyText:
    'Matin est actif à LaSalle. Quand on arrive dans un quartier, ou quand on y travaille, on cherche d’abord les mêmes choses : qui vit ici, où lire, où se promener, où rencontrer les autres. Nous avons réuni l’essentiel au même endroit, avec, pour chaque chiffre, sa source officielle. Une adresse manque ? Écrivez-nous : ce guide grandira avec vous.',
  whySign: 'L’équipe de Matin',
  checked: 'Dernière vérification : {date}',
  filterLabel: 'Chercher dans le guide',
  filterPlaceholder: 'Une bibliothèque, un parc, un service…',
  filterNone: 'Aucun résultat pour cette recherche dans le guide.',
  kindAll: 'Tout',
  kind_culture: 'Culture',
  kind_library: 'Bibliothèques',
  kind_park: 'Parcs et nature',
  kind_community: 'Vie communautaire',
  kind_services: 'Services',
  kind_data: 'Statistiques',
  inNumbers: 'En chiffres',
  keyFacts: 'En bref',
  places: 'Lieux et ressources',
  source: 'Source',
  visit: 'Site officiel',
  censusNote:
    'Les chiffres du recensement sont ceux de 2021, le plus récent publié par Statistique Canada. Nous les remplacerons par ceux du Recensement de 2026 dès leur publication.',
  notice:
    'Ce guide est informatif : les lieux et organismes cités n’impliquent aucun partenariat ni affiliation avec Matin. Horaires et services peuvent changer ; vérifiez toujours sur le site officiel.',
  suggestTitle: 'Il manque un lieu ?',
  suggestText:
    'Proposez-nous une adresse utile, à LaSalle ou ailleurs : nous la vérifierons auprès de sa source officielle avant de l’ajouter.',
  suggestButton: 'Proposer un lieu',
  opensNewTab: '(nouvel onglet)',
  resourcesLink: 'Guide local',
};

type GuideDict = typeof fr;

const en: GuideDict = {
  title: 'Local Guide',
  metaTitle: 'Local Guide: LaSalle, Montréal, Québec, Canada',
  lede: 'LaSalle, Montréal, Québec and Canada in verified figures and useful addresses: a guide we keep up to date for our neighbours, for newcomers and for everyone who brings their neighbourhood to life.',
  jumpLabel: 'Go to',
  whyTitle: 'Why this guide?',
  whyText:
    'Matin is active in LaSalle. When you arrive in a neighbourhood, or work in one, you first look for the same things: who lives here, where to read, where to walk, where to meet others. We gathered the essentials in one place, with the official source of every figure. Is an address missing? Write to us: this guide will grow with you.',
  whySign: 'The Matin team',
  checked: 'Last checked: {date}',
  filterLabel: 'Search the guide',
  filterPlaceholder: 'A library, a park, a service…',
  filterNone: 'Nothing in the guide matches this search.',
  kindAll: 'All',
  kind_culture: 'Culture',
  kind_library: 'Libraries',
  kind_park: 'Parks and nature',
  kind_community: 'Community life',
  kind_services: 'Services',
  kind_data: 'Statistics',
  inNumbers: 'In numbers',
  keyFacts: 'At a glance',
  places: 'Places and resources',
  source: 'Source',
  visit: 'Official website',
  censusNote:
    'Census figures are from 2021, the most recent census published by Statistics Canada. We will replace them with the 2026 Census figures as soon as they are published.',
  notice:
    'This guide is for information only: listing a place or organization does not imply any partnership or affiliation with Matin. Hours and services may change; always check the official website.',
  suggestTitle: 'Is a place missing?',
  suggestText:
    'Suggest a useful address, in LaSalle or elsewhere: we will check it against its official source before adding it.',
  suggestButton: 'Suggest a place',
  opensNewTab: '(opens in a new tab)',
  resourcesLink: 'Local Guide',
};

const fa: GuideDict = {
  title: 'راهنمای محلی',
  metaTitle: 'راهنمای محلی: لسال، مونترال، کبک، کانادا',
  lede: 'لسال، مونترال، کبک و کانادا با آمار تأییدشده و نشانی‌های کاربردی: راهنمایی که برای همسایه‌هایمان، تازه‌واردان و همهٔ کسانی که به محلهٔ خود جان می‌دهند به‌روز نگه می‌داریم.',
  jumpLabel: 'رفتن به',
  whyTitle: 'چرا این راهنما؟',
  whyText:
    'متین در لسال فعال است. وقتی به محله‌ای تازه می‌رسیم یا در آن کار می‌کنیم، اول دنبال همین چیزها هستیم: چه کسانی اینجا زندگی می‌کنند، کجا می‌شود کتاب خواند، کجا قدم زد، کجا با دیگران آشنا شد. ما مهم‌ترین‌ها را یک‌جا گرد آورده‌ایم و برای هر عدد، منبع رسمی‌اش را هم آورده‌ایم. نشانی‌ای جا افتاده؟ برایمان بنویسید: این راهنما همراه شما بزرگ‌تر می‌شود.',
  whySign: 'تیم متین',
  checked: 'آخرین بررسی: {date}',
  filterLabel: 'جست‌وجو در راهنما',
  filterPlaceholder: 'یک کتابخانه، یک پارک، یک خدمت…',
  filterNone: 'چیزی در راهنما با این جست‌وجو پیدا نشد.',
  kindAll: 'همه',
  kind_culture: 'فرهنگ',
  kind_library: 'کتابخانه‌ها',
  kind_park: 'پارک و طبیعت',
  kind_community: 'زندگی اجتماعی',
  kind_services: 'خدمات',
  kind_data: 'آمار',
  inNumbers: 'به زبان اعداد',
  keyFacts: 'در یک نگاه',
  places: 'مکان‌ها و منابع',
  source: 'منبع',
  visit: 'وب‌سایت رسمی',
  censusNote:
    'آمار سرشماری مربوط به سال ۲۰۲۱ است، تازه‌ترین سرشماری‌ای که ادارهٔ آمار کانادا منتشر کرده است. به‌محض انتشار نتایج سرشماری ۲۰۲۶، آن‌ها را جایگزین می‌کنیم.',
  notice:
    'این راهنما فقط برای اطلاع‌رسانی است: آمدن نام یک مکان یا سازمان در آن به معنای همکاری یا وابستگی به متین نیست. ساعت‌ها و خدمات ممکن است تغییر کنند؛ همیشه وب‌سایت رسمی را ببینید.',
  suggestTitle: 'مکانی جا افتاده؟',
  suggestText:
    'نشانی کاربردی‌ای را، در لسال یا هر جای دیگر، به ما پیشنهاد کنید: پیش از افزودن، آن را با منبع رسمی‌اش بررسی می‌کنیم.',
  suggestButton: 'پیشنهاد یک مکان',
  opensNewTab: '(در زبانهٔ تازه باز می‌شود)',
  resourcesLink: 'راهنمای محلی',
};

const dicts: Record<UiLang, GuideDict> = { fr, en, fa };

export function guideStrings(lang: UiLang): GuideDict {
  return dicts[lang];
}
