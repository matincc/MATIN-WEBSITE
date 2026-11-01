/**
 * « Cercle des conseillers de Matin » / "Matin Advisory Circle" / «حلقهٔ مشاوران متین»
 * (owner's request, Oct 31 2026): experts, researchers and practitioners anywhere in the
 * world join Matin's pool of advisors with a short form and their CV. Joining creates no
 * employment; Matin may later invite an advisor to a project under a separate written
 * contract, paid after the agreed work. Texts drafted by Claude for the owner's review
 * (the terms should also be read once by a lawyer). Every string exists in three languages.
 */
import type { UiLang } from './routes';
import { typo } from '@/lib/frenchTypo';

const fr = {
  nav: 'Cercle des conseillers',
  title: 'Cercle des conseillers de Matin',
  lede: 'Chercheuses et chercheurs, spécialistes, artistes et praticiens d’ici et d’ailleurs : joignez-vous au réseau d’expertise de Matin. Selon les projets, nous faisons appel à nos conseillers pour leur savoir en dialogue interculturel, en arts et culture, en recherche et en développement social.',
  how1Title: 'Vous vous inscrivez',
  how1Text: 'Un court formulaire et votre CV, de partout dans le monde.',
  how2Title: 'Nous lisons votre dossier',
  how2Text: 'Chaque inscription est lue par la direction de Matin. Vous recevez une confirmation, puis un courriel de bienvenue avec votre numéro de conseiller.',
  how3Title: 'Nous vous invitons à un projet',
  how3Text: 'Quand un projet correspond à votre expertise, nous vous proposons une collaboration, avec un contrat écrit distinct.',
  formTitle: 'Rejoindre le Cercle des conseillers',
  firstName: 'Prénom',
  lastName: 'Nom',
  phone: 'Téléphone (facultatif)',
  phoneCode: 'Indicatif du pays',
  phoneHint: 'Choisissez l’indicatif de votre pays, puis écrivez votre numéro.',
  degree: 'Plus haut diplôme',
  degreeChoose: 'Choisir',
  degrees: 'Baccalauréat (licence)|Maîtrise (master)|Doctorat|Expérience professionnelle reconnue|Autre',
  discipline: 'Discipline ou domaine d’études',
  expertise: 'Votre expertise',
  expertiseHint: 'En quelques lignes : vos domaines, vos travaux, vos réalisations.',
  areas: 'Domaines où vous aimeriez conseiller Matin',
  areaNames: 'Dialogue interculturel|Arts et culture|Recherche|Développement social et vie communautaire|Communication et médias|Droit, gouvernance et politiques publiques|Autre',
  languages: 'Langues de travail',
  linkedin: 'LinkedIn ou page professionnelle',
  linkedinHint: 'Le début de l’adresse est déjà écrit : ajoutez seulement votre nom de profil, par exemple https://www.linkedin.com/in/votre-nom',
  motivation: 'Pourquoi souhaitez-vous rejoindre le Cercle ?',
  cv: 'Votre CV',
  cvHint: 'PDF ou Word, 5 Mo au plus. Il n’est lu que par la direction de Matin.',
  cvTooBig: 'Ce fichier dépasse 5 Mo. Envoyez une version plus légère.',
  cvType: 'Envoyez un fichier PDF ou Word.',
  termsTitle: 'Conditions de collaboration',
  terms: [
    'L’inscription au Cercle des conseillers est libre et gratuite. Elle ne crée aucun lien d’emploi ni aucune obligation, ni pour Matin ni pour la personne inscrite.',
    'Matin peut inviter une conseillère ou un conseiller à collaborer à un projet précis. Toute collaboration rémunérée fait l’objet d’un contrat écrit distinct (mandat, résultats attendus, échéancier, honoraires), conforme aux lois du Québec et du Canada.',
    'Les honoraires prévus au contrat sont versés après la réalisation du travail convenu, selon les modalités de ce contrat.',
    'La conseillère ou le conseiller agit de façon autonome ; elle ou il ne représente pas Matin et ne parle pas en son nom sans autorisation écrite.',
    'Les renseignements non publics reçus de Matin restent confidentiels.',
    'Matin est neutre sur les plans religieux et politique ; ses conseillers respectent ses valeurs de respect et d’inclusion.',
    'Vos renseignements et votre CV sont conservés dans le registre des conseillers pendant trois ans au plus, utilisés seulement pour des collaborations avec Matin, jamais vendus ni partagés, et supprimés sur simple demande à info@matincc.ca.',
    'Votre nom n’est publié sur le site de Matin qu’avec votre accord écrit.',
  ].join('\n'),
  acceptTerms: 'J’ai lu et j’accepte les conditions de collaboration du Cercle des conseillers.',
  noEmployment: 'Je comprends que cette inscription ne crée aucun lien d’emploi et que toute collaboration se fera par contrat distinct.',
  retention: 'J’accepte que Matin conserve mes renseignements et mon CV dans son registre des conseillers pendant trois ans au plus.',
  consent: 'J’accepte que Matin utilise ces renseignements pour étudier mon inscription, conformément à la',
  submit: 'Envoyer mon inscription',
  success: 'Merci ! Votre inscription et votre CV nous sont bien parvenus. Notre équipe examinera votre dossier et vous enverra un courriel de confirmation dans un délai maximal de cinq jours ouvrables.',
  homeKicker: 'Experts d’ici et d’ailleurs',
  homeText: 'Vous êtes chercheur, spécialiste ou praticien et le dialogue entre les cultures vous tient à cœur ? Joignez-vous au réseau d’expertise de Matin.',
  homeCta: 'Rejoindre le Cercle',
  teamCta: 'Rejoindre le Cercle des conseillers',
};
type AdvisorsDict = typeof fr;

const en: AdvisorsDict = {
  nav: 'Advisory Circle',
  title: 'Matin Advisory Circle',
  lede: 'Researchers, specialists, artists and practitioners, here and around the world: join Matin’s network of expertise. Project by project, we call on our advisors for their knowledge of intercultural dialogue, arts and culture, research and social development.',
  how1Title: 'You sign up',
  how1Text: 'A short form and your CV, from anywhere in the world.',
  how2Title: 'We read your file',
  how2Text: 'Every application is read by Matin’s leadership. You receive a confirmation, then a welcome email with your advisor number.',
  how3Title: 'We invite you to a project',
  how3Text: 'When a project matches your expertise, we propose a collaboration, under a separate written contract.',
  formTitle: 'Join the Advisory Circle',
  firstName: 'First name',
  lastName: 'Last name',
  phone: 'Phone (optional)',
  phoneCode: 'Country code',
  phoneHint: 'Choose your country code, then type your number.',
  degree: 'Highest degree',
  degreeChoose: 'Choose',
  degrees: 'Bachelor’s degree|Master’s degree|Doctorate (PhD)|Recognized professional experience|Other',
  discipline: 'Discipline or field of study',
  expertise: 'Your expertise',
  expertiseHint: 'In a few lines: your fields, your work, your achievements.',
  areas: 'Areas where you would like to advise Matin',
  areaNames: 'Intercultural dialogue|Arts and culture|Research|Social development and community life|Communication and media|Law, governance and public policy|Other',
  languages: 'Working languages',
  linkedin: 'LinkedIn or professional page',
  linkedinHint: 'The start of the address is already there: just add your profile name, for example https://www.linkedin.com/in/your-name',
  motivation: 'Why would you like to join the Circle?',
  cv: 'Your CV',
  cvHint: 'PDF or Word, 5 MB at most. Only Matin’s leadership reads it.',
  cvTooBig: 'This file is larger than 5 MB. Please send a lighter version.',
  cvType: 'Please send a PDF or Word file.',
  termsTitle: 'Terms of collaboration',
  terms: [
    'Joining the Advisory Circle is voluntary and free. It creates no employment relationship and no obligation, either for Matin or for the person who joins.',
    'Matin may invite an advisor to collaborate on a specific project. Any paid collaboration is covered by a separate written contract (mandate, expected results, timeline, fees), in accordance with the laws of Québec and Canada.',
    'The fees set in the contract are paid after the agreed work is completed, under the terms of that contract.',
    'Advisors act independently; they do not represent Matin or speak on its behalf without written authorization.',
    'Non-public information received from Matin remains confidential.',
    'Matin is neutral on religion and politics; its advisors respect its values of respect and inclusion.',
    'Your information and CV are kept in the advisors’ register for at most three years, used only for collaborations with Matin, never sold or shared, and deleted on request at info@matincc.ca.',
    'Your name is published on Matin’s website only with your written agreement.',
  ].join('\n'),
  acceptTerms: 'I have read and accept the Advisory Circle’s terms of collaboration.',
  noEmployment: 'I understand that joining creates no employment relationship and that any collaboration will be under a separate contract.',
  retention: 'I agree that Matin keeps my information and CV in its advisors’ register for at most three years.',
  consent: 'I agree that Matin uses this information to review my application, in accordance with the',
  submit: 'Send my application',
  success: 'Thank you! We have received your application and CV. Our team will review your application and send you a confirmation email within five business days at most.',
  homeKicker: 'Experts here and around the world',
  homeText: 'Are you a researcher, specialist or practitioner who cares about dialogue between cultures? Join Matin’s network of expertise.',
  homeCta: 'Join the Circle',
  teamCta: 'Join the Advisory Circle',
};

const fa: AdvisorsDict = {
  nav: 'حلقهٔ مشاوران',
  title: 'حلقهٔ مشاوران متین',
  lede: 'پژوهشگران، متخصصان، هنرمندان و کنشگران، در کانادا و در هر جای جهان: به شبکهٔ تخصصی متین بپیوندید. ما در هر پروژه، از دانش مشاورانمان در گفت‌وگوی بین‌فرهنگی، هنر و فرهنگ، پژوهش و توسعهٔ اجتماعی کمک می‌گیریم.',
  how1Title: 'ثبت‌نام می‌کنید',
  how1Text: 'یک فرم کوتاه و رزومهٔ شما، از هر جای جهان.',
  how2Title: 'پروندهٔ شما را می‌خوانیم',
  how2Text: 'مدیریت متین هر درخواست را می‌خواند. ابتدا یک تأیید دریافت و سپس یک ایمیل خوشامد با شمارهٔ مشاور برایتان فرستاده می‌شود.',
  how3Title: 'شما را به یک پروژه دعوت می‌کنیم',
  how3Text: 'هر وقت پروژه‌ای با تخصص شما هماهنگ باشد، همکاری را با یک قرارداد کتبی جداگانه پیشنهاد می‌کنیم.',
  formTitle: 'پیوستن به حلقهٔ مشاوران',
  firstName: 'نام',
  lastName: 'نام خانوادگی',
  phone: 'تلفن (اختیاری)',
  phoneCode: 'کد کشور',
  phoneHint: 'کد کشور خود را انتخاب کنید و بعد شماره را بنویسید.',
  degree: 'بالاترین مدرک',
  degreeChoose: 'انتخاب کنید',
  degrees: 'کارشناسی|کارشناسی ارشد|دکترا|تجربهٔ حرفه‌ای شناخته‌شده|دیگر',
  discipline: 'رشته یا حوزهٔ تحصیلی',
  expertise: 'تخصص شما',
  expertiseHint: 'در چند خط: حوزه‌ها، کارها و دستاوردهای شما.',
  areas: 'حوزه‌هایی که دوست دارید در آن‌ها به متین مشاوره دهید',
  areaNames: 'گفت‌وگوی بین‌فرهنگی|هنر و فرهنگ|پژوهش|توسعهٔ اجتماعی و زندگی جمعی|ارتباطات و رسانه|حقوق، حکمرانی و سیاست‌گذاری عمومی|دیگر',
  languages: 'زبان‌های کاری',
  linkedin: 'لینکدین یا صفحهٔ حرفه‌ای',
  linkedinHint: 'ابتدای نشانی از پیش نوشته شده است؛ فقط نام پروفایل خود را اضافه کنید، مثلاً https://www.linkedin.com/in/your-name',
  motivation: 'چرا می‌خواهید به حلقهٔ مشاوران بپیوندید؟',
  cv: 'رزومهٔ شما',
  cvHint: 'PDF یا Word، حداکثر ۵ مگابایت. فقط مدیریت متین آن را می‌خواند.',
  cvTooBig: 'حجم این فایل بیش از ۵ مگابایت است. لطفاً نسخهٔ سبک‌تری بفرستید.',
  cvType: 'لطفاً یک فایل PDF یا Word بفرستید.',
  termsTitle: 'شرایط همکاری',
  terms: [
    'پیوستن به حلقهٔ مشاوران داوطلبانه و رایگان است و هیچ رابطهٔ استخدامی یا تعهدی، نه برای متین و نه برای فرد ثبت‌نام‌کننده، ایجاد نمی‌کند.',
    'متین ممکن است مشاوری را برای همکاری در یک پروژهٔ مشخص دعوت کند. هر همکاری دارای حق‌الزحمه با یک قرارداد کتبی جداگانه (شرح کار، نتایج مورد انتظار، زمان‌بندی، حق‌الزحمه) و مطابق قوانین کبک و کانادا انجام می‌شود.',
    'حق‌الزحمهٔ تعیین‌شده در قرارداد، پس از انجام کار توافق‌شده و طبق شرایط همان قرارداد پرداخت می‌شود.',
    'مشاور به‌صورت مستقل کار می‌کند و بدون اجازهٔ کتبی، نمایندهٔ متین نیست و از طرف آن سخن نمی‌گوید.',
    'اطلاعات غیرعمومی که از متین دریافت می‌شود محرمانه می‌ماند.',
    'متین از نظر دینی و سیاسی بی‌طرف است و مشاوران آن به ارزش‌های احترام و فراگیری متین پایبندند.',
    'اطلاعات و رزومهٔ شما حداکثر سه سال در دفتر مشاوران نگهداری می‌شود، فقط برای همکاری با متین به کار می‌رود، هرگز فروخته یا به دیگران داده نمی‌شود و با یک درخواست ساده به info@matincc.ca پاک می‌شود.',
    'نام شما فقط با موافقت کتبی خودتان در وب‌سایت متین منتشر می‌شود.',
  ].join('\n'),
  acceptTerms: 'شرایط همکاری حلقهٔ مشاوران را خوانده‌ام و می‌پذیرم.',
  noEmployment: 'می‌دانم که این ثبت‌نام هیچ رابطهٔ استخدامی ایجاد نمی‌کند و هر همکاری با قرارداد جداگانه خواهد بود.',
  retention: 'موافقم که متین اطلاعات و رزومهٔ مرا حداکثر سه سال در دفتر مشاوران خود نگهداری کند.',
  consent: 'موافقم که متین از این اطلاعات برای بررسی درخواست من استفاده کند، مطابق',
  submit: 'ارسال درخواست',
  success: 'سپاسگزاریم! درخواست و رزومهٔ شما به دست ما رسید. تیم ما درخواست شما را بررسی می‌کند و حداکثر ظرف پنج روز کاری یک ایمیل تأیید برایتان می‌فرستد.',
  homeKicker: 'متخصصان از کانادا و سراسر جهان',
  homeText: 'پژوهشگر، متخصص یا کنشگری هستید که گفت‌وگوی فرهنگ‌ها برایتان مهم است؟ به شبکهٔ تخصصی متین بپیوندید.',
  homeCta: 'پیوستن به حلقه',
  teamCta: 'پیوستن به حلقهٔ مشاوران',
};

const dicts: Record<UiLang, AdvisorsDict> = { fr, en, fa };

/** The strings of one language, French typography applied. */
export function advisorStrings(lang: UiLang): AdvisorsDict {
  const d = dicts[lang] ?? dicts.en;
  return Object.fromEntries(
    Object.entries(d).map(([k, v]) => [k, typo(v, lang)]),
  ) as AdvisorsDict;
}

/** The section's anchor on the Contact page. */
export const advisorsAnchor = (lang: UiLang) => (lang === 'fr' ? 'conseillers' : 'advisory-circle');

/** Values sent to the Sheet (English, so every row reads the same), with each label. */
export const DEGREE_VALUES = ['Bachelor', 'Master', 'Doctorate', 'Professional experience', 'Other'];
export const AREA_VALUES = [
  'Intercultural dialogue',
  'Arts and culture',
  'Research',
  'Social development',
  'Communication and media',
  'Law, governance and public policy',
  'Other',
];
