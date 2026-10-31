/**
 * Strings of « Mon histoire en 15 secondes » / "My Story in 15 Seconds" /
 * «داستان من در ۱۵ ثانیه» (owner's request, Oct 31 2026): the page, its upload form and the
 * clips on the homepage band « In Their Words ». Drafted by Claude for the owner's review.
 * Every string exists in the three languages.
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  nav: 'Mon histoire en 15 secondes',
  title: 'Mon histoire en 15 secondes',
  metaDescription:
    'Prenez votre téléphone, répondez à une question simple en quelques secondes et ajoutez votre voix au portrait de Montréal que dessine l’Institut interculturel Matin.',
  lede: 'Montréal est faite de milliers de parcours. Prenez votre téléphone, répondez à une question simple en quelques secondes et ajoutez votre voix au portrait de notre ville.',
  shareCta: 'Partager mon histoire',
  seeAll: 'Voir toutes les histoires',
  howTitle: 'Comment ça marche',
  step1Title: 'Choisissez une question',
  step1Text:
    'Prenez l’une des questions ci-dessous, ou racontez-nous autre chose qui vous tient à cœur.',
  step2Title: 'Filmez-vous',
  step2Text:
    'Téléphone à la verticale, dans un endroit calme et bien éclairé. Court : jusqu’à 15 secondes. Récit : jusqu’à 1 minute.',
  step3Title: 'Envoyez votre vidéo',
  step3Text:
    'Remplissez le formulaire et joignez votre vidéo. Elle n’est vue que par l’équipe de Matin.',
  step4Title: 'Nous regardons chaque histoire',
  step4Text:
    'Si elle est retenue, elle paraît ici et sur la chaîne YouTube de Matin, avec votre prénom et votre ville seulement.',
  promptsTitle: 'Les questions',
  clipsTitle: 'Leurs histoires',
  clipsEmpty: 'Les premières histoires paraîtront ici bientôt. La vôtre pourrait en faire partie.',
  play: 'Lire l’histoire de {name}',
  videoNotice: 'La vidéo se charge depuis YouTube quand vous cliquez.',
  formTitle: 'Envoyer mon histoire',
  formLede:
    'Deux minutes suffisent. Votre vidéo n’est envoyée qu’à l’équipe de Matin, qui regarde chaque histoire avant toute publication.',
  firstName: 'Prénom',
  firstNameHint: 'Seul votre prénom est affiché.',
  city: 'Ville ou quartier',
  cityHint: 'Par exemple : Villeray, Montréal',
  email: 'Courriel',
  emailHint: 'Jamais affiché. Seulement pour vous joindre au sujet de votre vidéo.',
  language: 'Langue parlée dans la vidéo',
  prompt: 'Votre question',
  format: 'Durée',
  formatShort: 'Court : jusqu’à 15 secondes (pour le site et YouTube)',
  formatLong: 'Récit : jusqu’à 1 minute (un Short YouTube, aussi présenté sur le site)',
  video: 'Votre vidéo',
  videoHint:
    'Filmée à la verticale avec votre téléphone (MP4 ou MOV). Court : 60 Mo au plus ; récit : 250 Mo au plus.',
  consentAge: 'J’ai 18 ans ou plus.',
  consentPeople:
    'C’est moi qui parle dans la vidéo. Personne d’autre n’y est reconnaissable, ou ces personnes ont donné leur accord et ont 18 ans ou plus.',
  consentPublish:
    'J’autorise l’Institut interculturel Matin à publier gratuitement cette vidéo, avec mon prénom et ma ville, sur matincc.ca et sur la chaîne YouTube de Matin. Je peux demander son retrait à tout moment en écrivant à info@matincc.ca.',
  consentPrivacy:
    'J’accepte que Matin conserve mes renseignements pour examiner ma vidéo ; si elle n’est pas publiée, elle est supprimée. Voir notre',
  privacyLink: 'politique de confidentialité',
  required: 'obligatoire',
  submit: 'Envoyer mon histoire',
  errorsIntro: 'Veuillez vérifier les points suivants :',
  errRequired: 'Veuillez remplir ce champ.',
  errEmail: 'Veuillez entrer une adresse courriel valide.',
  errConsent: 'Veuillez cocher cette case.',
  errVideo: 'Veuillez choisir une vidéo.',
  errType: 'Ce fichier n’est pas une vidéo.',
  errTooShort: 'Cette vidéo dure moins de 3 secondes.',
  errTooLongShort:
    'Cette vidéo dure {s} secondes. Le format court est limité à 15 secondes : choisissez « Récit » ou raccourcissez la vidéo.',
  errTooLongLong: 'Cette vidéo dure {s} secondes. Gardez-la à 1 minute ou moins.',
  errTooBig:
    'Ce fichier est trop lourd ({mb} Mo). Filmez en 1080p ou en 720p, ou choisissez une vidéo plus courte.',
  sending: 'Envoi de votre vidéo… {p} %',
  keepOpen: 'Gardez cette page ouverte jusqu’à la fin de l’envoi.',
  success:
    'Merci ! Votre histoire est bien arrivée à l’équipe de Matin. Nous regardons chaque vidéo ; si la vôtre est retenue, elle paraîtra ici avec votre prénom.',
  error: 'L’envoi n’a pas fonctionné. Vérifiez votre connexion et réessayez.',
  busy: 'Beaucoup d’histoires sont arrivées aujourd’hui. Merci de réessayer demain.',
  guidelinesTitle: 'Quelques repères simples',
  guide1: 'Parlez de votre propre expérience, avec vos mots, dans la langue de votre choix.',
  guide2: 'Filmez à la verticale, face à la caméra, dans un endroit calme et bien éclairé.',
  guide3:
    'Pas de publicité, et aucun message pour ou contre une personne, un groupe, une croyance ou un parti.',
  guide4: 'Pas d’enfants, et personne qui n’a pas accepté d’apparaître.',
  guide5:
    'Matin choisit les histoires publiées et peut raccourcir légèrement une vidéo. Sur simple demande, nous retirons la vôtre.',
};

type StoriesDict = typeof fr;

const en: StoriesDict = {
  nav: 'My Story in 15 Seconds',
  title: 'My Story in 15 Seconds',
  metaDescription:
    'Pick up your phone, answer one simple question in a few seconds, and add your voice to the portrait of Montréal that Matin Intercultural Institute is drawing.',
  lede: 'Montréal is made of thousands of journeys. Pick up your phone, answer one simple question in a few seconds, and add your voice to the portrait of our city.',
  shareCta: 'Share my story',
  seeAll: 'See all stories',
  howTitle: 'How It Works',
  step1Title: 'Choose a question',
  step1Text: 'Pick one of the questions below, or tell us something else that matters to you.',
  step2Title: 'Film yourself',
  step2Text:
    'Hold your phone upright, in a quiet place with good light. Short: up to 15 seconds. Story: up to 1 minute.',
  step3Title: 'Send your video',
  step3Text: 'Fill in the form and attach your video. Only Matin’s team sees it.',
  step4Title: 'We watch every story',
  step4Text:
    'If it is chosen, it appears here and on Matin’s YouTube channel, with your first name and city only.',
  promptsTitle: 'The Questions',
  clipsTitle: 'Their Stories',
  clipsEmpty: 'The first stories will appear here soon. Yours could be one of them.',
  play: 'Play {name}’s story',
  videoNotice: 'The video loads from YouTube when you click.',
  formTitle: 'Send My Story',
  formLede:
    'It takes two minutes. Your video goes only to Matin’s team, who watch every story before anything is published.',
  firstName: 'First name',
  firstNameHint: 'Only your first name is shown.',
  city: 'City or neighbourhood',
  cityHint: 'For example: Villeray, Montréal',
  email: 'Email',
  emailHint: 'Never shown. Only used to reach you about your video.',
  language: 'Language you speak in the video',
  prompt: 'Your question',
  format: 'Length',
  formatShort: 'Short: up to 15 seconds (for the website and YouTube)',
  formatLong: 'Story: up to 1 minute (a YouTube Short, also shown on the website)',
  video: 'Your video',
  videoHint:
    'Filmed upright on your phone (MP4 or MOV). Short: 60 MB at most; story: 250 MB at most.',
  consentAge: 'I am 18 or older.',
  consentPeople:
    'I am the person speaking in the video. No one else can be recognized in it, or they agreed and are 18 or older.',
  consentPublish:
    'I allow Matin Intercultural Institute to publish this video free of charge, with my first name and city, on matincc.ca and on Matin’s YouTube channel. I can ask for it to be removed at any time by writing to info@matincc.ca.',
  consentPrivacy:
    'I agree that Matin keeps my information to review my video; if it is not published, it is deleted. See our',
  privacyLink: 'Privacy Policy',
  required: 'required',
  submit: 'Send my story',
  errorsIntro: 'Please check the following:',
  errRequired: 'Please fill in this field.',
  errEmail: 'Please enter a valid email address.',
  errConsent: 'Please tick this box.',
  errVideo: 'Please choose a video.',
  errType: 'This file is not a video.',
  errTooShort: 'This video is shorter than 3 seconds.',
  errTooLongShort:
    'This video lasts {s} seconds. The short format is limited to 15 seconds: choose “Story” or shorten the video.',
  errTooLongLong: 'This video lasts {s} seconds. Please keep it to 1 minute or less.',
  errTooBig: 'This file is too large ({mb} MB). Film in 1080p or 720p, or choose a shorter video.',
  sending: 'Sending your video… {p}%',
  keepOpen: 'Please keep this page open until it finishes.',
  success:
    'Thank you! Your story has reached Matin’s team. We watch every video; if yours is chosen, it will appear here with your first name.',
  error: 'Sending did not work. Please check your connection and try again.',
  busy: 'Many stories arrived today. Please try again tomorrow.',
  guidelinesTitle: 'A Few Simple Guidelines',
  guide1: 'Speak about your own experience, in your own words, in any language.',
  guide2: 'Film upright, facing the camera, in a quiet place with good light.',
  guide3: 'No advertising, and no message for or against any person, group, belief or party.',
  guide4: 'No children, and no one who has not agreed to appear.',
  guide5:
    'Matin chooses which stories to publish and may shorten a video slightly. Just ask and we will remove yours.',
};

const fa: StoriesDict = {
  nav: 'داستان من در ۱۵ ثانیه',
  title: 'داستان من در ۱۵ ثانیه',
  metaDescription:
    'گوشی‌تان را بردارید، در چند ثانیه به یک پرسش ساده پاسخ دهید و صدای خود را به تصویری که مؤسسه میان‌فرهنگی متین از مونترال می‌سازد بیفزایید.',
  lede: 'مونترال از هزاران مسیر زندگی ساخته شده است. گوشی‌تان را بردارید، در چند ثانیه به یک پرسش ساده پاسخ دهید و صدای خود را به تصویر شهرمان بیفزایید.',
  shareCta: 'داستانم را بفرستم',
  seeAll: 'همهٔ داستان‌ها',
  howTitle: 'چگونه کار می‌کند',
  step1Title: 'یک پرسش انتخاب کنید',
  step1Text: 'یکی از پرسش‌های زیر را انتخاب کنید، یا از چیز دیگری بگویید که برایتان مهم است.',
  step2Title: 'از خودتان فیلم بگیرید',
  step2Text: 'گوشی را عمودی بگیرید، در جایی آرام و پرنور. کوتاه: تا ۱۵ ثانیه. روایت: تا ۱ دقیقه.',
  step3Title: 'ویدیو را بفرستید',
  step3Text: 'فرم را پر کنید و ویدیو را پیوست کنید. فقط تیم متین آن را می‌بیند.',
  step4Title: 'همهٔ داستان‌ها را می‌بینیم',
  step4Text:
    'اگر انتخاب شود، اینجا و در کانال یوتیوب متین منتشر می‌شود، فقط با نام کوچک و شهر شما.',
  promptsTitle: 'پرسش‌ها',
  clipsTitle: 'داستان‌های آن‌ها',
  clipsEmpty: 'نخستین داستان‌ها به‌زودی اینجا می‌آیند. شاید داستان شما یکی از آن‌ها باشد.',
  play: 'پخش داستان {name}',
  videoNotice: 'ویدیو با کلیک شما از یوتیوب بارگذاری می‌شود.',
  formTitle: 'فرستادن داستان من',
  formLede:
    'دو دقیقه بیشتر طول نمی‌کشد. ویدیوی شما فقط برای تیم متین فرستاده می‌شود و پیش از هر انتشاری همهٔ داستان‌ها را می‌بینیم.',
  firstName: 'نام کوچک',
  firstNameHint: 'فقط نام کوچک شما نمایش داده می‌شود.',
  city: 'شهر یا محله',
  cityHint: 'برای نمونه: ویلره، مونترال',
  email: 'ایمیل',
  emailHint: 'هرگز نمایش داده نمی‌شود. فقط برای تماس دربارهٔ ویدیوی شما.',
  language: 'زبانی که در ویدیو صحبت می‌کنید',
  prompt: 'پرسش شما',
  format: 'مدت',
  formatShort: 'کوتاه: تا ۱۵ ثانیه (برای سایت و یوتیوب)',
  formatLong: 'روایت: تا ۱ دقیقه (یک شورت یوتیوب که در سایت هم نمایش داده می‌شود)',
  video: 'ویدیوی شما',
  videoHint:
    'عمودی و با گوشی گرفته شده (MP4 یا MOV). کوتاه: حداکثر ۶۰ مگابایت؛ روایت: حداکثر ۲۵۰ مگابایت.',
  consentAge: '۱۸ سال یا بیشتر دارم.',
  consentPeople:
    'کسی که در ویدیو صحبت می‌کند خود من هستم. هیچ فرد دیگری در آن قابل شناسایی نیست، یا آن افراد موافقت کرده‌اند و ۱۸ سال یا بیشتر دارند.',
  consentPublish:
    'به مؤسسه میان‌فرهنگی متین اجازه می‌دهم این ویدیو را به‌رایگان، با نام کوچک و شهر من، در matincc.ca و کانال یوتیوب متین منتشر کند. هر زمان بخواهم می‌توانم با نوشتن به info@matincc.ca درخواست حذف آن را بدهم.',
  consentPrivacy:
    'موافقم که متین اطلاعات مرا برای بررسی ویدیو نگه دارد؛ اگر ویدیو منتشر نشود، حذف می‌شود. ببینید:',
  privacyLink: 'سیاست حریم خصوصی',
  required: 'الزامی',
  submit: 'فرستادن داستانم',
  errorsIntro: 'لطفاً این موارد را بررسی کنید:',
  errRequired: 'لطفاً این بخش را پر کنید.',
  errEmail: 'لطفاً یک نشانی ایمیل درست وارد کنید.',
  errConsent: 'لطفاً این گزینه را علامت بزنید.',
  errVideo: 'لطفاً یک ویدیو انتخاب کنید.',
  errType: 'این فایل ویدیو نیست.',
  errTooShort: 'این ویدیو کمتر از ۳ ثانیه است.',
  errTooLongShort:
    'این ویدیو {s} ثانیه است. قالب کوتاه حداکثر ۱۵ ثانیه است: «روایت» را انتخاب کنید یا ویدیو را کوتاه‌تر کنید.',
  errTooLongLong: 'این ویدیو {s} ثانیه است. لطفاً آن را ۱ دقیقه یا کمتر نگه دارید.',
  errTooBig:
    'این فایل خیلی بزرگ است ({mb} مگابایت). با کیفیت 1080p یا 720p فیلم بگیرید، یا ویدیوی کوتاه‌تری انتخاب کنید.',
  sending: 'در حال فرستادن ویدیو… {p}٪',
  keepOpen: 'لطفاً تا پایان ارسال این صفحه را باز نگه دارید.',
  success:
    'سپاسگزاریم! داستان شما به دست تیم متین رسید. همهٔ ویدیوها را می‌بینیم؛ اگر ویدیوی شما انتخاب شود، با نام کوچک شما اینجا منتشر می‌شود.',
  error: 'ارسال انجام نشد. اتصال اینترنت را بررسی کنید و دوباره امتحان کنید.',
  busy: 'امروز داستان‌های زیادی رسیده است. لطفاً فردا دوباره امتحان کنید.',
  guidelinesTitle: 'چند راهنمای ساده',
  guide1: 'از تجربهٔ خودتان، با کلمات خودتان و به هر زبانی که دوست دارید بگویید.',
  guide2: 'عمودی، رو به دوربین و در جایی آرام و پرنور فیلم بگیرید.',
  guide3: 'بدون تبلیغ، و بدون هیچ پیامی به سود یا زیان هیچ فرد، گروه، باور یا حزبی.',
  guide4: 'بدون کودکان، و بدون کسی که با حضور در ویدیو موافقت نکرده است.',
  guide5:
    'متین داستان‌های منتشرشده را انتخاب می‌کند و ممکن است ویدیو را کمی کوتاه کند. کافی است بخواهید تا ویدیوی شما را حذف کنیم.',
};

/** The questions visitors answer (keys stored in the Sheet and in each clip's YAML file). */
export const storyPrompts = ['home', 'word', 'sound', 'advice', 'free'] as const;
export type StoryPrompt = (typeof storyPrompts)[number];

const prompts: Record<UiLang, Record<StoryPrompt, string>> = {
  fr: {
    home: 'Quel est le premier moment où Montréal vous a semblé être chez vous ?',
    word: 'Un mot de votre langue que vous aimeriez que tout le monde connaisse',
    sound: 'Une chanson, un son ou un lieu qui vous rappelle d’où vous venez',
    advice: 'Un conseil pour quelqu’un qui arrive demain à Montréal',
    free: 'Autre chose que vous souhaitez partager',
  },
  en: {
    home: 'What was the first moment Montréal felt like home?',
    word: 'A word from your language you wish everyone knew',
    sound: 'A song, a sound or a place that reminds you of where you come from',
    advice: 'One piece of advice for someone arriving in Montréal tomorrow',
    free: 'Something else you want to share',
  },
  fa: {
    home: 'اولین لحظه‌ای که مونترال برایتان حس خانه داشت کی بود؟',
    word: 'کلمه‌ای از زبان شما که دوست دارید همه بدانند',
    sound: 'آهنگ، صدا یا مکانی که شما را به یاد جایی که از آن آمده‌اید می‌اندازد',
    advice: 'یک توصیه برای کسی که فردا به مونترال می‌رسد',
    free: 'چیز دیگری که دوست دارید بگویید',
  },
};

/** Languages a video can be in, each written in its own language. */
export const storyLanguages = { fr: 'Français', en: 'English', fa: 'فارسی' } as const;
const otherLanguage: Record<UiLang, string> = {
  fr: 'Une autre langue',
  en: 'Another language',
  fa: 'زبانی دیگر',
};

const dicts: Record<UiLang, StoriesDict> = { fr, en, fa };

/** The strings of one language, French typography applied. */
export function storyStrings(lang: UiLang): StoriesDict {
  const d = dicts[lang];
  return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typo(v, lang)])) as StoriesDict;
}

export const storyPrompt = (key: StoryPrompt, lang: UiLang) => typo(prompts[lang][key], lang);

/** Options of the language field: value sent to the Sheet, label shown. */
export const storyLanguageOptions = (lang: UiLang) => [
  ...Object.entries(storyLanguages).map(([value, label]) => ({ value, label })),
  { value: 'other', label: otherLanguage[lang] },
];
