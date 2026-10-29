/**
 * Interface strings of the "Matin Alive" homepage (owner's brief, Oct 27 2026): the new
 * hero, the "Coming up" strip, Faces & Voices of Matin, The Matin Question and Cultures
 * on Screen. Kept apart from fr.ts / en.ts / fa.ts while the design is a preview; every
 * string exists in the three languages.
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  heroPlace: 'Montréal · Québec',
  heroLine: 'Relier les personnes, les cultures et les communautés.',
  heroCtaPrimary: 'Découvrir Matin',
  heroCtaSecondary: 'Rejoindre la conversation',

  upcomingTitle: 'À venir',
  upcomingMatin: 'Matin',
  upcomingSelected: 'Sélection',
  upcomingPrev: 'Activités précédentes',
  upcomingNext: 'Activités suivantes',

  facesTitle: 'Visages et voix de Matin',
  facesLede:
    'Bientôt, les personnes qui font vivre Matin raconteront ici, avec leurs propres mots, ce que le dialogue entre les cultures signifie pour elles.',
  placeholder: 'Espace réservé',
  facesPortrait: 'Portrait',
  facesPortraitText: 'Un portrait authentique, publié avec le consentement de la personne.',
  facesReflection: 'Réflexion personnelle',
  facesReflectionText: 'Une réflexion personnelle, dans les mots exacts de la personne.',
  facesVoice: 'Voix de la communauté',
  facesVoiceText: 'Un court extrait audio (1 à 2 minutes), avec sa transcription.',
  facesListen: 'Écouter (bientôt disponible)',
  facesVideo: 'Récit vidéo',
  facesVideoText: 'Un court récit vidéo, sous-titré en français, en anglais et en persan.',
  facesPerspective: 'Regard culturel',
  facesPerspectiveText: 'Un regard sur une culture, une langue ou un quartier de Montréal.',
  facesPeople: 'Bénévoles et collaborateurs',
  facesPeopleText: 'Les personnes qui donnent de leur temps et de leur talent à Matin.',
  facesConsent:
    'Aucun nom, visage ni témoignage n’est inventé : chaque contribution sera authentique et publiée avec le consentement écrit de la personne.',
  facesCta: 'Proposer votre histoire',

  questionEyebrow: 'La question de Matin',
  question: 'Qu’est-ce qui vous fait sentir chez vous à Montréal ?',
  questionIntro: 'Un lieu, une langue, un geste, une rencontre… Prenez un instant pour y penser.',
  questionChips: ['Un lieu', 'Une langue', 'Une personne', 'Un son', 'Une saison'],
  questionChipsLabel: 'Pour commencer',
  questionLabel: 'Votre réponse',
  questionHint: 'Par exemple : un banc du parc La Fontaine, à l’automne',
  questionSubmit: 'Partager ma réponse',
  questionPrototype: 'Prototype · rien n’est envoyé',
  questionThanks:
    'Merci ! Dans cet aperçu, votre réponse n’est ni envoyée ni enregistrée. Les réponses seront ouvertes lorsque la modération, la confidentialité et le consentement auront été approuvés.',
  questionEmpty: 'Écrivez quelques mots avant de partager.',
  questionWall: 'Réponses de la communauté',
  questionWallEmpty: 'Les réponses approuvées apparaîtront ici, après modération.',

  screenTitle: 'Cultures à l’écran',
  screenLede:
    'Une sélection de vidéos : productions de Matin, organisations partenaires, créatrices et créateurs culturels, courts documentaires et projets communautaires. Chaque vidéo est présentée avec son auteur et un lien vers sa source.',
  screenAll: 'Tout',
  screenKinds: {
    matin: 'Production Matin',
    partner: 'Organisation partenaire',
    creator: 'Création culturelle',
    documentary: 'Court documentaire',
    community: 'Projet communautaire',
  },
  screenFilterLabel: 'Filtrer les vidéos',
  screenCreator: 'Auteur',
  screenSource: 'Source',
  screenRights: 'Autorisation documentée',
  screenPlaceholder: 'Une vidéo autorisée, avec son crédit et le lien vers l’original.',
  screenWatchOn: 'Voir sur {platform}',
  screenPlay: 'Lire la vidéo : {title}',
  screenRules:
    'Intégrations officielles YouTube et Instagram uniquement. Une vidéo hébergée par Matin exige une autorisation écrite et le crédit de son auteur. Aucune vidéo n’est téléchargée ni copiée sans autorisation.',
};

type AliveDict = typeof fr;

const en: AliveDict = {
  heroPlace: 'Montréal · Québec',
  heroLine: 'Connecting people, cultures, and communities.',
  heroCtaPrimary: 'Explore Matin',
  heroCtaSecondary: 'Join the Conversation',

  upcomingTitle: 'Coming up',
  upcomingMatin: 'Matin',
  upcomingSelected: 'Selected',
  upcomingPrev: 'Previous activities',
  upcomingNext: 'Next activities',

  facesTitle: 'Faces & Voices of Matin',
  facesLede:
    'Soon, the people who bring Matin to life will share here, in their own words, what dialogue between cultures means to them.',
  placeholder: 'Placeholder',
  facesPortrait: 'Portrait',
  facesPortraitText: "An authentic portrait, published with the person's consent.",
  facesReflection: 'Personal reflection',
  facesReflectionText: "A personal reflection, in the person's own words.",
  facesVoice: 'Community voice',
  facesVoiceText: 'A short audio piece (1 to 2 minutes), with its transcript.',
  facesListen: 'Listen (coming soon)',
  facesVideo: 'Video story',
  facesVideoText: 'A short video story, subtitled in French, English and Persian.',
  facesPerspective: 'Cultural perspective',
  facesPerspectiveText: 'A perspective on a culture, a language or a Montréal neighbourhood.',
  facesPeople: 'Volunteers & collaborators',
  facesPeopleText: 'The people who give Matin their time and talent.',
  facesConsent:
    "No name, face or testimony is invented: every contribution will be authentic and published with the person's written consent.",
  facesCta: 'Share your story',

  questionEyebrow: 'The Matin Question',
  question: 'What makes you feel at home in Montréal?',
  questionIntro: 'A place, a language, a gesture, an encounter… Take a moment to think about it.',
  questionChips: ['A place', 'A language', 'A person', 'A sound', 'A season'],
  questionChipsLabel: 'To begin',
  questionLabel: 'Your answer',
  questionHint: 'For example: a bench in La Fontaine Park, in autumn',
  questionSubmit: 'Share my answer',
  questionPrototype: 'Prototype · nothing is sent',
  questionThanks:
    'Thank you! In this preview, your answer is neither sent nor saved. Answers will open once moderation, privacy and consent have been approved.',
  questionEmpty: 'Write a few words before sharing.',
  questionWall: 'Community answers',
  questionWallEmpty: 'Approved answers will appear here, after moderation.',

  screenTitle: 'Cultures on Screen',
  screenLede:
    'A curated collection of videos: Matin productions, partner organizations, cultural creators, short documentaries and community projects. Every video is shown with its creator and a link to its original source.',
  screenAll: 'All',
  screenKinds: {
    matin: 'Matin production',
    partner: 'Partner organization',
    creator: 'Cultural creator',
    documentary: 'Short documentary',
    community: 'Community project',
  },
  screenFilterLabel: 'Filter the videos',
  screenCreator: 'Creator',
  screenSource: 'Source',
  screenRights: 'Permission documented',
  screenPlaceholder: 'An authorized video, with its credit and a link to the original.',
  screenWatchOn: 'Watch on {platform}',
  screenPlay: 'Play the video: {title}',
  screenRules:
    'Official YouTube and Instagram embeds only. A video hosted by Matin requires written permission and credit to its creator. No video is downloaded or copied without permission.',
};

const fa: AliveDict = {
  heroPlace: 'مونترال · کبک',
  heroLine: 'پیوند میان مردم، فرهنگ‌ها و جامعه‌ها.',
  heroCtaPrimary: 'با متین آشنا شوید',
  heroCtaSecondary: 'به گفت‌وگو بپیوندید',

  upcomingTitle: 'رویدادهای پیش رو',
  upcomingMatin: 'متین',
  upcomingSelected: 'برگزیده',
  upcomingPrev: 'فعالیت‌های قبلی',
  upcomingNext: 'فعالیت‌های بعدی',

  facesTitle: 'چهره‌ها و صداهای متین',
  facesLede:
    'به‌زودی کسانی که به متین جان می‌بخشند، در اینجا با کلمات خودشان می‌گویند گفت‌وگوی فرهنگ‌ها برایشان چه معنایی دارد.',
  placeholder: 'جای محتوا',
  facesPortrait: 'پرتره',
  facesPortraitText: 'پرتره‌ای واقعی، که با رضایت خود فرد منتشر می‌شود.',
  facesReflection: 'تأمل شخصی',
  facesReflectionText: 'تأملی شخصی، با کلمات دقیق خود فرد.',
  facesVoice: 'صدای جامعه',
  facesVoiceText: 'یک قطعهٔ صوتی کوتاه (۱ تا ۲ دقیقه)، همراه با متن نوشتاری آن.',
  facesListen: 'شنیدن (به‌زودی)',
  facesVideo: 'روایت ویدیویی',
  facesVideoText: 'یک روایت ویدیویی کوتاه، با زیرنویس فرانسوی، انگلیسی و فارسی.',
  facesPerspective: 'نگاه فرهنگی',
  facesPerspectiveText: 'نگاهی به یک فرهنگ، یک زبان یا یک محلهٔ مونترال.',
  facesPeople: 'داوطلبان و همکاران',
  facesPeopleText: 'کسانی که وقت و استعداد خود را به متین هدیه می‌دهند.',
  facesConsent:
    'هیچ نام، چهره یا روایتی ساختگی نیست: هر مشارکت واقعی خواهد بود و با رضایت کتبی خود فرد منتشر می‌شود.',
  facesCta: 'داستان خود را با ما در میان بگذارید',

  questionEyebrow: 'پرسش متین',
  question: 'چه چیزی در مونترال به شما حس خانه می‌دهد؟',
  questionIntro: 'یک مکان، یک زبان، یک رفتار، یک دیدار… لحظه‌ای به آن فکر کنید.',
  questionChips: ['یک مکان', 'یک زبان', 'یک آدم', 'یک صدا', 'یک فصل'],
  questionChipsLabel: 'برای شروع',
  questionLabel: 'پاسخ شما',
  questionHint: 'مثلاً: نیمکتی در پارک لافونتن، در پاییز',
  questionSubmit: 'پاسخم را به اشتراک بگذار',
  questionPrototype: 'نمونهٔ اولیه · چیزی ارسال نمی‌شود',
  questionThanks:
    'سپاس! در این پیش‌نمایش، پاسخ شما نه ارسال می‌شود و نه ذخیره. پاسخ‌ها پس از تأیید شیوهٔ بررسی، حریم خصوصی و رضایت‌نامه باز خواهند شد.',
  questionEmpty: 'پیش از اشتراک‌گذاری، چند کلمه بنویسید.',
  questionWall: 'پاسخ‌های جامعه',
  questionWallEmpty: 'پاسخ‌های تأییدشده پس از بررسی در اینجا نمایش داده می‌شوند.',

  screenTitle: 'فرهنگ‌ها بر پرده',
  screenLede:
    'مجموعه‌ای برگزیده از ویدیوها: تولیدات متین، سازمان‌های همکار، آفرینندگان فرهنگی، مستندهای کوتاه و پروژه‌های اجتماعی. هر ویدیو با نام سازنده و پیوند به منبع اصلی‌اش نمایش داده می‌شود.',
  screenAll: 'همه',
  screenKinds: {
    matin: 'تولید متین',
    partner: 'سازمان همکار',
    creator: 'آفرینندهٔ فرهنگی',
    documentary: 'مستند کوتاه',
    community: 'پروژهٔ اجتماعی',
  },
  screenFilterLabel: 'پالایش ویدیوها',
  screenCreator: 'سازنده',
  screenSource: 'منبع',
  screenRights: 'مجوز ثبت‌شده',
  screenPlaceholder: 'یک ویدیوی مجاز، با نام سازنده و پیوند به نسخهٔ اصلی.',
  screenWatchOn: 'تماشا در {platform}',
  screenPlay: 'پخش ویدیو: {title}',
  screenRules:
    'فقط نمایش رسمی یوتیوب و اینستاگرام. ویدیویی که روی سایت متین قرار می‌گیرد به مجوز کتبی و ذکر نام سازنده نیاز دارد. هیچ ویدیویی بدون اجازه دانلود یا کپی نمی‌شود.',
};

const dicts: Record<UiLang, AliveDict> = { fr, en, fa };

export type ScreenKind = keyof AliveDict['screenKinds'];

/** The Matin Alive strings of one language, French typography applied. */
export function aliveStrings(lang: UiLang): AliveDict {
  const fix = (v: unknown): unknown =>
    typeof v === 'string'
      ? typo(v, lang)
      : Array.isArray(v)
        ? v.map(fix)
        : v && typeof v === 'object'
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fix(x)]))
          : v;
  return fix(dicts[lang]) as AliveDict;
}

export const fill = (s: string, vars: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
