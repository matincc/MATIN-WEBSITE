/**
 * « La culture en mots simples » / "Culture in Plain Words" / «فرهنگ به زبان ساده»
 * (owner's learning series, Nov 2026): short sheets by the President explaining, without
 * jargon, the ideas, rights and laws that shape our communities. One entry per sheet, oldest
 * first. Sheet texts follow the President's sheets word for word, except that « écoles » /
 * "schools" become « établissements scolaires » / "educational institutions" (site rule) and
 * the closing line on the three languages is left out. Persian: draft until he reviews it.
 */
import type { UiLang } from '@/i18n/routes';

type T = Record<UiLang, string>;

export type LearnSheet = {
  number: number;
  slug: string;
  date: string;
  title: T;
  inShort: T;
  sections: { heading: T; paragraphs?: T[]; points?: T[] }[];
  question: T;
  questionNote: T;
};

export const learnStrings = {
  title: { fr: 'La culture en mots simples', en: 'Culture in Plain Words', fa: 'فرهنگ به زبان ساده' },
  nav: { fr: 'La culture en mots simples', en: 'Culture in Plain Words', fa: 'فرهنگ به زبان ساده' },
  lede: {
    fr: 'Des fiches courtes pour comprendre, simplement et sans jargon, les idées, les droits et les lois qui touchent nos communautés. Chaque fiche se lit en quelques minutes.',
    en: 'Short sheets that explain, simply and without jargon, the ideas, rights and laws that shape our communities. Each sheet takes a few minutes to read.',
    fa: 'برگه‌هایی کوتاه که ایده‌ها، حقوق و قوانینی را که بر زندگی جمعی ما اثر می‌گذارند، ساده و بی‌اصطلاحات دشوار توضیح می‌دهند. خواندن هر برگه چند دقیقه بیشتر طول نمی‌کشد.',
  },
  goal: {
    fr: 'Objectif : 100 fiches',
    en: 'Goal: 100 sheets',
    fa: 'هدف: ۱۰۰ برگه',
  },
  sheet: { fr: 'Fiche n° {n}', en: 'Sheet No. {n}', fa: 'برگهٔ شمارهٔ {n}' },
  by: {
    fr: 'Par Dr Reza Moafi, fondateur et président',
    en: 'By Dr. Reza Moafi, Founder and President',
    fa: 'نوشتهٔ دکتر رضا معافی، بنیان‌گذار و رئیس',
  },
  inShortLabel: { fr: 'En bref', en: 'In short', fa: 'به کوتاهی' },
  questionLabel: { fr: 'Une question pour vous', en: 'A question for you', fa: 'پرسشی از شما' },
  write: { fr: 'Écrivez-nous', en: 'Write to us', fa: 'برای ما بنویسید' },
  next: {
    fr: 'Prochaines fiches : bientôt',
    en: 'Next sheets: coming soon',
    fa: 'برگه‌های بعدی: به‌زودی',
  },
} satisfies Record<string, T>;

export const learnSheets: LearnSheet[] = [
  {
    number: 1,
    slug: 'planification-culturelle',
    date: '2026-11-03',
    title: {
      fr: 'Qu’est-ce que la planification culturelle ?',
      en: 'What is cultural planning?',
      fa: 'برنامه‌ریزی فرهنگی چیست؟',
    },
    inShort: {
      fr: 'La planification culturelle, c’est la façon dont une ville ou une communauté décide, ensemble, de la place de la culture dans la vie de tous les jours : où elle se vit, pour qui, et avec quels soutiens.',
      en: 'Cultural planning is the way a city or a community decides, together, how culture will be part of everyday life: where it happens, who it is for and how it is supported.',
      fa: 'برنامه‌ریزی فرهنگی یعنی شیوه‌ای که یک شهر یا یک جامعه با هم تصمیم می‌گیرند فرهنگ چه جایی در زندگی روزمره داشته باشد: کجا جریان پیدا کند، برای چه کسانی باشد و چگونه پشتیبانی شود.',
    },
    sections: [
      {
        heading: { fr: 'Une définition simple', en: 'A simple definition', fa: 'یک تعریف ساده' },
        paragraphs: [
          {
            fr: 'Quand je parle de « planification », on pense souvent aux routes, au logement ou aux parcs. La planification culturelle applique le même soin à la culture. Elle part d’une question simple : quelle culture existe déjà ici, et de quoi les résidents ont-ils besoin pour la vivre pleinement ? J’entends la culture au sens large : les arts et les bibliothèques, bien sûr, mais aussi les fêtes, les cuisines collectives, les lieux de culte, les langues parlées à la maison et la mémoire d’un quartier.',
            en: 'When I talk about "planning", people usually think of roads, housing or parks. Cultural planning brings the same care to culture. It starts with a simple question: what culture already exists here, and what do residents need to live it fully? I mean culture in the broad sense: the arts and libraries, of course, but also festivals, community kitchens, places of worship, the languages spoken at home and the memories of a neighbourhood.',
            fa: 'وقتی از «برنامه‌ریزی» حرف می‌زنم، بیشتر مردم به جاده، مسکن یا پارک فکر می‌کنند. برنامه‌ریزی فرهنگی همان دقت را برای فرهنگ به کار می‌برد. با یک پرسش ساده آغاز می‌شود: چه فرهنگی همین حالا اینجا وجود دارد، و ساکنان برای آنکه آن را به‌طور کامل زندگی کنند به چه نیاز دارند؟ منظورم فرهنگ به معنای گسترده است: هنرها و کتابخانه‌ها البته، اما همچنین جشن‌ها، آشپزخانه‌های جمعی، عبادتگاه‌ها، زبان‌هایی که در خانه گفته می‌شوند و خاطرهٔ یک محله.',
          },
          {
            fr: 'Elle suit généralement quatre étapes : repérer ce qui existe (lieux, groupes, savoir-faire, traditions), écouter les résidents, surtout ceux qu’on entend moins, choisir les priorités ensemble, puis faire le suivi pour voir ce qui a changé.',
            en: 'It usually follows four steps: mapping what exists (places, groups, skills, traditions), listening to residents, especially those we hear less often, choosing priorities together, and following up to see what has changed.',
            fa: 'معمولاً چهار گام دارد: شناسایی آنچه هست (مکان‌ها، گروه‌ها، مهارت‌ها، سنت‌ها)، شنیدن صدای ساکنان، به‌ویژه کسانی که کمتر شنیده می‌شوند، انتخاب اولویت‌ها با هم، و پیگیری برای دیدن آنچه تغییر کرده است.',
          },
        ],
      },
      {
        heading: { fr: 'Un exemple montréalais', en: 'A Montréal example', fa: 'نمونه‌ای از مونترال' },
        paragraphs: [
          {
            fr: 'Montréal compte un réseau de maisons de la culture réparties dans ses arrondissements : des lieux gratuits ou peu coûteux où l’on peut voir un spectacle, visiter une exposition ou participer à un atelier près de chez soi. Derrière ce réseau, il y a un choix de planification : la culture ne doit pas être réservée au centre-ville. Plusieurs arrondissements se dotent aussi de leur propre plan culturel ou de développement social, afin que les décisions ressemblent aux gens qui y vivent, y compris les nouveaux arrivants venus du monde entier.',
            en: 'Montréal has a network of maisons de la culture spread across its boroughs: free or low-cost venues where residents can see a show, visit an exhibition or join a workshop close to home. Behind this network is a planning choice: culture should not be reserved for downtown. Many boroughs also adopt their own cultural or social development plans, so that decisions reflect the people who actually live there, including newcomers from all over the world.',
            fa: 'مونترال شبکه‌ای از «خانه‌های فرهنگ» (maisons de la culture) دارد که در مناطق شهرداری پراکنده‌اند: مکان‌هایی رایگان یا کم‌هزینه که ساکنان می‌توانند نزدیک خانه نمایشی ببینند، از نمایشگاهی دیدن کنند یا در کارگاهی شرکت کنند. پشت این شبکه یک انتخاب برنامه‌ریزی است: فرهنگ نباید فقط از آنِ مرکز شهر باشد. بسیاری از مناطق نیز برنامهٔ فرهنگی یا توسعهٔ اجتماعی خود را دارند تا تصمیم‌ها بازتاب مردمی باشند که واقعاً آنجا زندگی می‌کنند، از جمله تازه‌واردانی از سراسر جهان.',
          },
        ],
      },
      {
        heading: { fr: 'À retenir', en: 'Key points', fa: 'نکته‌های کلیدی' },
        points: [
          {
            fr: 'La culture est une ressource commune, comme un parc : elle se planifie.',
            en: 'Culture is a shared resource, like a park: it needs to be planned for.',
            fa: 'فرهنگ مانند یک پارک، دارایی مشترک است: باید برایش برنامه‌ریزی کرد.',
          },
          {
            fr: 'Une bonne planification culturelle commence par l’écoute, pas par une liste de projets.',
            en: 'Good cultural planning starts with listening, not with a list of projects.',
            fa: 'برنامه‌ریزی فرهنگی خوب با شنیدن آغاز می‌شود، نه با فهرستی از پروژه‌ها.',
          },
          {
            fr: 'Elle s’intéresse aux absents : les personnes qui ne viennent jamais aux activités font partie du portrait.',
            en: 'It pays attention to who is missing: people who never come to events are part of the picture.',
            fa: 'به غایبان توجه می‌کند: کسانی که هرگز به برنامه‌ها نمی‌آیند هم بخشی از تصویرند.',
          },
          {
            fr: 'Ce n’est pas seulement l’affaire de la ville : organismes, artistes, établissements scolaires et résidents y participent.',
            en: 'It is not only the city’s job: community groups, artists, educational institutions and residents all take part.',
            fa: 'این فقط کار شهرداری نیست: گروه‌های محلی، هنرمندان، نهادهای آموزشی و ساکنان همه در آن سهم دارند.',
          },
        ],
      },
      {
        heading: { fr: 'Une idée reçue', en: 'A common misconception', fa: 'یک برداشت نادرست رایج' },
        paragraphs: [
          {
            fr: '« Planifier la culture, c’est organiser plus d’événements. » Pas tout à fait. Parfois, la meilleure réponse est une salle ouverte le soir, une affiche en plusieurs langues ou un trajet sécuritaire vers la bibliothèque. Planifier, c’est créer les conditions de la culture, pas seulement les activités.',
            en: '"Cultural planning means organising more events." Not quite. Sometimes the best answer is a room that stays open in the evening, a sign in several languages or a safe walk to the library. Planning is about the conditions for culture, not only the activities.',
            fa: '«برنامه‌ریزی فرهنگی یعنی برگزاری رویدادهای بیشتر.» نه دقیقاً. گاهی بهترین پاسخ، سالنی است که عصرها باز بماند، تابلویی به چند زبان یا مسیری امن تا کتابخانه. برنامه‌ریزی یعنی فراهم کردن شرایط فرهنگ، نه فقط برنامه‌ها.',
          },
        ],
      },
      {
        heading: {
          fr: 'Pourquoi c’est important pour la vie interculturelle',
          en: 'Why it matters for intercultural life',
          fa: 'چرا برای زندگی میان‌فرهنگی مهم است',
        },
        paragraphs: [
          {
            fr: 'Dans un quartier où des dizaines de cultures se côtoient, la planification aide à décider si elles vont simplement coexister ou vraiment se rencontrer. Je l’ai souvent constaté : quand des résidents de toutes origines participent à la vie culturelle, ils ne sont plus seulement un public, ils deviennent coauteurs de leur ville.',
            en: 'In a neighbourhood where dozens of cultures live side by side, planning helps decide whether they simply coexist or truly meet. I have seen it many times: when residents of different backgrounds help shape cultural life, they are no longer just an audience, they become co-authors of their city.',
            fa: 'در محله‌ای که ده‌ها فرهنگ کنار هم زندگی می‌کنند، برنامه‌ریزی کمک می‌کند تعیین شود که آیا آن‌ها فقط در کنار هم هستند یا به‌راستی با هم دیدار می‌کنند. بارها دیده‌ام: وقتی ساکنانی با پیشینه‌های گوناگون در شکل دادن به زندگی فرهنگی سهیم می‌شوند، دیگر فقط تماشاگر نیستند؛ هم‌نویسندگان شهر خود می‌شوند.',
          },
        ],
      },
    ],
    question: {
      fr: 'Dans votre quartier, quel lieu ou quelle activité rassemble des gens différents, et qu’est-ce qui manque encore ?',
      en: 'In your neighbourhood, which place or activity brings different people together, and what is still missing?',
      fa: 'در محلهٔ شما کدام مکان یا برنامه آدم‌های گوناگون را گرد هم می‌آورد، و هنوز چه چیزی کم است؟',
    },
    questionNote: {
      fr: 'Je lis chaque message, et vos réponses nourrissent nos prochains ateliers.',
      en: 'I read every message, and your answers help shape our next workshops.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم و پاسخ‌های شما به کارگاه‌های بعدی ما شکل می‌دهد.',
    },
  },
];
