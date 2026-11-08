/**
 * « La culture en mots simples » / "Culture in Plain Words" / «فرهنگ به زبان ساده»
 * (owner's learning series, Nov 2026): short sheets by the President explaining, without
 * jargon, the ideas, rights and laws that shape our communities. One entry per sheet, oldest
 * first. Owner's standing writing rule (Nov 5 2026): very plain words and short sentences, as if
 * talking to someone in a park; real examples from our community; each part ends with « Et Matin ? »
 * (`matin`): what Matin has done or will do, facts only. Never « école(s) » / "school(s)" (site
 * rule). Persian: draft until he reviews it.
 */
import type { UiLang } from '@/i18n/routes';

type T = Record<UiLang, string>;

export type LearnSheet = {
  number: number;
  slug: string;
  date: string;
  title: T;
  inShort: T;
  sections: { heading: T; paragraphs?: T[]; points?: T[]; matin?: T }[];
  /** Official sources and real stories behind the examples (owner, Nov 8 2026). */
  sources?: { label: T; url: string }[];
  question: T;
  questionNote: T;
};

export const learnStrings = {
  title: { fr: 'La culture en mots simples', en: 'Culture in Plain Words', fa: 'فرهنگ به زبان ساده' },
  nav: { fr: 'La culture en mots simples', en: 'Culture in Plain Words', fa: 'فرهنگ به زبان ساده' },
  lede: {
    fr: 'Des fiches courtes qui expliquent les notions de la planification culturelle de façon simple et claire. Chaque fiche se lit en quelques minutes.',
    en: 'Short sheets that explain the ideas of cultural planning in a simple, clear way. Each sheet takes a few minutes to read.',
    fa: 'برگه‌هایی کوتاه که مفاهیم برنامه‌ریزی فرهنگی را به صورت ساده و روان توضیح می‌دهند. خواندن هر برگه چند دقیقه بیشتر طول نمی‌کشد.',
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
  matinLabel: { fr: 'Et Matin ?', en: 'And Matin?', fa: 'و متین؟' },
  write: { fr: 'Écrivez-nous', en: 'Write to us', fa: 'برای ما بنویسید' },
  sourcesLabel: { fr: 'Pour en savoir plus', en: 'Learn more', fa: 'برای دانستن بیشتر' },
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
      fr: 'Planifier la culture, c’est se demander ensemble : quelle vie culturelle voulons-nous près de chez nous, pour qui, et comment la rendre possible ?',
      en: 'Cultural planning means asking together: what cultural life do we want close to home, who is it for, and how do we make it happen?',
      fa: 'برنامه‌ریزی فرهنگی یعنی با هم بپرسیم: چه زندگی فرهنگی‌ای نزدیک خانه‌مان می‌خواهیم، برای چه کسانی، و چطور آن را ممکن کنیم؟',
    },
    sections: [
      {
        heading: { fr: 'Une image simple', en: 'A simple picture', fa: 'یک تصویر ساده' },
        paragraphs: [
          {
            fr: 'Une ville planifie ses rues, ses parcs et ses autobus. Elle peut aussi planifier la culture. Et la culture, ce n’est pas seulement le théâtre ou le musée. C’est aussi une fête de quartier, une bibliothèque, une chorale, les langues qu’on parle à la maison.',
            en: 'A city plans its streets, its parks and its buses. It can plan culture too. And culture is not only the theatre or the museum. It is also a street party, a library, a choir, the languages we speak at home.',
            fa: 'یک شهر برای خیابان‌ها، پارک‌ها و اتوبوس‌هایش برنامه می‌ریزد. برای فرهنگ هم می‌شود برنامه ریخت. فرهنگ هم فقط تئاتر و موزه نیست. جشن محله هم فرهنگ است، کتابخانه، گروه کُر، و زبانی که در خانه حرف می‌زنیم.',
          },
          {
            fr: 'Planifier, c’est simple à dire : on regarde ce qui existe, on écoute les gens, on choisit ensemble ce qui compte le plus, puis on vérifie si ça a marché.',
            en: 'Planning is simple to explain: look at what is already there, listen to people, choose together what matters most, then check whether it worked.',
            fa: 'برنامه‌ریزی را ساده می‌شود گفت: ببینیم چه چیزی هست، به حرف مردم گوش بدهیم، با هم انتخاب کنیم چه چیزی مهم‌تر است، و بعد ببینیم نتیجه داد یا نه.',
          },
        ],
        matin: {
          fr: 'Matin commence par écouter. Dans nos rencontres, comme le « Café des cultures », nous demanderons aux résidents ce qui leur manque.',
          en: 'Matin starts by listening. At our gatherings, such as the “Café des cultures”, we will ask residents what is missing for them.',
          fa: 'متین هم با شنیدن شروع می‌کند. در دیدارهایمان، مثل «کافهٔ فرهنگ‌ها»، از ساکنان می‌پرسیم چه چیزی کم دارند.',
        },
      },
      {
        heading: { fr: 'Un exemple près de chez nous', en: 'An example close to home', fa: 'نمونه‌ای نزدیک خودمان' },
        paragraphs: [
          {
            fr: 'Montréal a un réseau de maisons de la culture dans ses quartiers. On peut y voir un spectacle ou une exposition près de chez soi, souvent gratuitement. Pourquoi ? Parce que la Ville a fait un choix : la culture ne doit pas rester au centre-ville.',
            en: 'Montréal has a network of maisons de la culture in its neighbourhoods. You can see a show or an exhibition close to home, often for free. Why? Because the City made a choice: culture should not stay downtown.',
            fa: 'مونترال در محله‌هایش شبکه‌ای از «خانه‌های فرهنگ» دارد. آنجا می‌شود نزدیک خانه، اغلب رایگان، نمایش یا نمایشگاه دید. چرا؟ چون شهر تصمیم گرفته فرهنگ فقط مال مرکز شهر نباشد.',
          },
          {
            fr: 'Ailleurs au Canada, on voit la même idée. Chaque automne, les Journées de la culture au Québec, et Culture Days dans tout le pays, ouvrent gratuitement des ateliers d’artistes, des musées et des salles de spectacle, de Gaspé à Vancouver.',
            en: 'Elsewhere in Canada, you see the same idea. Every autumn, the Journées de la culture in Québec, and Culture Days across the country, open artists’ studios, museums and concert halls for free, from Gaspé to Vancouver.',
            fa: 'در جاهای دیگر کانادا هم همین فکر را می‌بینیم. هر پاییز، «روزهای فرهنگ» در کبک و «Culture Days» در سراسر کشور، کارگاه هنرمندان، موزه‌ها و سالن‌های نمایش را رایگان به روی مردم باز می‌کنند، از گاسپه تا ونکوور.',
          },
          {
            fr: 'À LaSalle, l’arrondissement a adopté un Plan d’action culturel pour 2026 à 2030. Il veut une vie culturelle « diversifiée, accessible, rassembleuse, innovante », partout sur son territoire.',
            en: 'In LaSalle, the borough has adopted a Cultural Action Plan for 2026 to 2030. It wants cultural life to be diverse, accessible, unifying and innovative, everywhere in the borough.',
            fa: 'در لاسال، شهرداری بخش برای سال‌های ۲۰۲۶ تا ۲۰۳۰ یک برنامهٔ اقدام فرهنگی تصویب کرده است. می‌خواهد زندگی فرهنگی در همه‌جای لاسال «متنوع، در دسترس، گردآورنده و نوآور» باشد.',
          },
        ],
        matin: {
          fr: 'Matin a choisi d’agir d’abord à LaSalle. Sur notre site, une page montre comment nos activités se rattachent à ce plan.',
          en: 'Matin has chosen to act in LaSalle first. A page on our site shows how our activities connect to this plan.',
          fa: 'متین تصمیم گرفته اول در لاسال کار کند. در سایت ما صفحه‌ای هست که نشان می‌دهد برنامه‌های ما چطور به این برنامه وصل می‌شوند.',
        },
      },
      {
        heading: { fr: 'Une idée reçue', en: 'A common mistake', fa: 'یک اشتباه رایج' },
        paragraphs: [
          {
            fr: '« Planifier la culture, c’est faire plus de fêtes. » Pas toujours. Parfois, il suffit d’une salle ouverte le soir, d’une affiche en plusieurs langues ou d’un chemin sûr jusqu’à la bibliothèque.',
            en: '“Cultural planning means more festivals.” Not always. Sometimes all it takes is a room open in the evening, a sign in several languages or a safe walk to the library.',
            fa: '«برنامه‌ریزی فرهنگی یعنی جشن بیشتر.» همیشه نه. گاهی کافی است یک سالن عصرها باز بماند، یک اطلاعیه به چند زبان باشد، یا راه رفتن تا کتابخانه امن باشد.',
          },
        ],
        matin: {
          fr: 'Matin publie ses textes en français d’abord, et aussi en anglais et en persan, pour que plus de gens se sentent invités.',
          en: 'Matin publishes its texts in French first, and also in English and Persian, so more people feel invited.',
          fa: 'متین نوشته‌هایش را اول به فرانسه، و بعد به انگلیسی و فارسی منتشر می‌کند تا آدم‌های بیشتری حس کنند دعوت شده‌اند.',
        },
      },
      {
        heading: { fr: 'À retenir', en: 'To remember', fa: 'یادمان بماند' },
        points: [
          {
            fr: 'La culture, c’est comme un parc : elle est à tout le monde, et elle se planifie.',
            en: 'Culture is like a park: it belongs to everyone, and it needs planning.',
            fa: 'فرهنگ مثل پارک است: مال همه است و برایش باید برنامه ریخت.',
          },
          {
            fr: 'On commence par écouter, pas par une liste de projets.',
            en: 'Start by listening, not with a list of projects.',
            fa: 'با گوش دادن شروع می‌کنیم، نه با فهرست پروژه‌ها.',
          },
          {
            fr: 'On pense aussi à ceux qui ne viennent jamais.',
            en: 'Think of the people who never come, too.',
            fa: 'به کسانی هم فکر می‌کنیم که هیچ‌وقت نمی‌آیند.',
          },
          {
            fr: 'La Ville n’est pas seule : organismes, artistes, établissements scolaires et résidents ont leur mot à dire.',
            en: 'The City is not alone: community groups, artists, educational institutions and residents all have a say.',
            fa: 'شهرداری تنها نیست: سازمان‌ها، هنرمندان، نهادهای آموزشی و ساکنان هم حرفی برای گفتن دارند.',
          },
        ],
      },
    ],
    question: {
      fr: 'Dans votre quartier, quel lieu rassemble des gens différents ? Et qu’est-ce qui manque encore ?',
      en: 'In your neighbourhood, which place brings different people together? And what is still missing?',
      fa: 'در محلهٔ شما کدام جا آدم‌های گوناگون را دور هم جمع می‌کند؟ و هنوز چه چیزی کم است؟',
    },
    questionNote: {
      fr: 'Je lis chaque message. Vos réponses nous aident à préparer nos prochaines rencontres.',
      en: 'I read every message. Your answers help us prepare our next gatherings.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم. پاسخ‌های شما به ما کمک می‌کند دیدارهای بعدی را آماده کنیم.',
    },
  },
  {
    number: 2,
    slug: 'interculturalisme',
    date: '2026-11-05',
    title: {
      fr: 'Qu’est-ce que l’interculturalisme ?',
      en: 'What is interculturalism?',
      fa: 'میان‌فرهنگ‌گرایی چیست؟',
    },
    inShort: {
      fr: 'L’interculturalisme, c’est quand des gens de cultures différentes ne vivent pas seulement côte à côte : ils se parlent, se connaissent et construisent quelque chose ensemble. Au Québec, ils le font en français, la langue commune.',
      en: 'Interculturalism is when people of different cultures do not just live side by side: they talk, get to know each other and build something together. In Québec, they do it in French, the common language.',
      fa: 'میان‌فرهنگ‌گرایی یعنی آدم‌هایی با فرهنگ‌های مختلف فقط کنار هم زندگی نکنند؛ با هم حرف بزنند، همدیگر را بشناسند و با هم چیزی بسازند. در کبک این کار به زبان فرانسه، زبان مشترک همه، انجام می‌شود.',
    },
    sections: [
      {
        heading: { fr: 'Une image simple', en: 'A simple picture', fa: 'یک تصویر ساده' },
        paragraphs: [
          {
            fr: 'Imaginez un banc dans un parc. Deux voisins s’y assoient chaque jour, mais ils ne se parlent jamais. Ils vivent côte à côte. Un jour, l’un dit bonjour. L’autre répond. Ils parlent de leurs enfants, de la neige, du pays où ils sont nés. Voilà l’interculturalisme : passer de « côte à côte » à « ensemble ».',
            en: 'Picture a bench in a park. Two neighbours sit there every day, but they never talk. They live side by side. One day, one says hello. The other answers. They talk about their children, the snow, the country where they were born. That is interculturalism: going from “side by side” to “together”.',
            fa: 'یک نیمکت در پارک را تصور کنید. دو همسایه هر روز رویش می‌نشینند، اما هیچ‌وقت با هم حرف نمی‌زنند. کنار هم زندگی می‌کنند. یک روز یکی سلام می‌کند. دیگری جواب می‌دهد. از بچه‌هایشان می‌گویند، از برف، از کشوری که در آن به دنیا آمده‌اند. میان‌فرهنگ‌گرایی همین است: رفتن از «کنار هم» به «با هم».',
          },
          {
            fr: 'Cela ne veut pas dire oublier sa culture. Chacun garde la sienne. Mais on cherche aussi ce qu’on a en commun.',
            en: 'It does not mean forgetting your culture. Everyone keeps their own. But we also look for what we share.',
            fa: 'این یعنی فرهنگ خودمان را فراموش کنیم؟ نه. هر کس فرهنگ خودش را نگه می‌دارد. اما دنبال چیزهای مشترکمان هم می‌گردیم.',
          },
        ],
        matin: {
          fr: 'C’est pour cela que Matin existe : créer des occasions de se parler. Notre devise le dit : « Cultures en dialogue ».',
          en: 'This is why Matin exists: to create chances to talk. Our motto says it: “Cultures in Dialogue”.',
          fa: 'متین برای همین ساخته شده: فرصت بسازد تا آدم‌ها با هم حرف بزنند. شعار ما هم همین را می‌گوید: «گفت‌وگوی فرهنگ‌ها».',
        },
      },
      {
        heading: {
          fr: 'Le rôle du Canada et du Québec',
          en: 'The role of Canada and Québec',
          fa: 'نقش دولت کانادا و دولت کبک',
        },
        paragraphs: [
          {
            fr: 'Le Canada a une loi sur le multiculturalisme depuis 1988 : chaque culture a sa place dans le pays. Le Québec, lui, parle d’interculturalisme : il met l’accent sur la rencontre entre les cultures et sur une langue commune.',
            en: 'Canada has had a multiculturalism law since 1988: every culture has its place in the country. Québec speaks of interculturalism: it puts the focus on cultures meeting and on a common language.',
            fa: 'کانادا از سال ۱۹۸۸ قانونی دربارهٔ چندفرهنگ‌گرایی دارد: هر فرهنگی در این کشور جایی دارد. کبک از میان‌فرهنگ‌گرایی حرف می‌زند: تأکیدش بر دیدار فرهنگ‌ها با هم و بر یک زبان مشترک است.',
          },
          {
            fr: 'Au Québec, le français est la langue commune. C’est elle qui permet à une personne venue du Mexique et à une autre venue du Vietnam de se parler. C’est pourquoi le gouvernement offre la francisation gratuite aux adultes, avec Francisation Québec.',
            en: 'In Québec, French is the common language. It lets someone from Mexico and someone from Vietnam talk to each other. That is why the government offers free French learning to adults, through Francisation Québec.',
            fa: 'در کبک، فرانسه زبان مشترک است. همین زبان است که به کسی از مکزیک و کسی از ویتنام اجازه می‌دهد با هم حرف بزنند. برای همین دولت از طریق «فرانسیزاسیون کبک» یادگیری رایگان فرانسه را به بزرگسالان ارائه می‌دهد.',
          },
          {
            fr: 'Chaque année, en novembre, le Québec tient aussi la Semaine québécoise des rencontres interculturelles. Partout au Québec, des organismes proposent des activités pour se rencontrer.',
            en: 'Every November, Québec also holds the Semaine québécoise des rencontres interculturelles (Québec Intercultural Week). Across Québec, local organizations offer activities to meet each other.',
            fa: 'هر سال در ماه نوامبر، کبک «هفتهٔ دیدارهای میان‌فرهنگی کبک» را هم برگزار می‌کند. در سراسر کبک سازمان‌ها برنامه‌هایی برای آشنایی مردم با هم اجرا می‌کنند.',
          },
        ],
        matin: {
          fr: 'En novembre 2026, Matin participe à cette semaine avec une marche interculturelle au parc Angrignon.',
          en: 'In November 2026, Matin is taking part in this week with an intercultural walk in Parc Angrignon.',
          fa: 'متین در نوامبر ۲۰۲۶ با یک پیاده‌روی میان‌فرهنگی در پارک آنگرینیون در این هفته شرکت می‌کند.',
        },
      },
      {
        heading: {
          fr: 'Le rôle de la Ville et de l’arrondissement',
          en: 'The role of the City and the borough',
          fa: 'نقش شهرداری مونترال و شهرداری بخش',
        },
        paragraphs: [
          {
            fr: 'La Ville de Montréal a un bureau qui aide les nouveaux arrivants à trouver leur place : le BINAM, le Bureau d’intégration des nouveaux arrivants à Montréal. Les maisons de la culture et les bibliothèques sont aussi des lieux où tout le monde se croise.',
            en: 'The City of Montréal has an office that helps newcomers find their place: BINAM, the Bureau d’intégration des nouveaux arrivants à Montréal. Maisons de la culture and libraries are also places where everyone crosses paths.',
            fa: 'شهرداری مونترال دفتری دارد که به تازه‌واردان کمک می‌کند جای خود را پیدا کنند: «بینام» (دفتر ادغام تازه‌واردان در مونترال). خانه‌های فرهنگ و کتابخانه‌ها هم جاهایی‌اند که همه در آن به هم برمی‌خورند.',
          },
          {
            fr: 'À LaSalle, le Plan d’action culturel 2026–2030 veut que plus de citoyens, de toutes origines, participent à la vie culturelle.',
            en: 'In LaSalle, the 2026–2030 Cultural Action Plan wants more residents, of every background, to take part in cultural life.',
            fa: 'در لاسال، برنامهٔ اقدام فرهنگی ۲۰۲۶–۲۰۳۰ می‌خواهد شهروندان بیشتری، با هر پیشینه‌ای، در زندگی فرهنگی شرکت کنند.',
          },
        ],
        matin: {
          fr: 'Matin aspire à contribuer à ce plan. Nous voulons travailler avec les organismes de LaSalle, pas à côté d’eux.',
          en: 'Matin aspires to contribute to this plan. We want to work with LaSalle’s organizations, not next to them.',
          fa: 'متین امیدوار است در این برنامه سهمی داشته باشد. می‌خواهیم با سازمان‌های لاسال کار کنیم، نه جدا از آن‌ها.',
        },
      },
      {
        heading: { fr: 'Le rôle de Matin', en: 'Matin’s role', fa: 'نقش متین' },
        paragraphs: [
          {
            fr: 'Matin est un institut interculturel né à Montréal en octobre 2026. Notre travail : faire se rencontrer les cultures, et les gens qui les portent.',
            en: 'Matin is an intercultural institute born in Montréal in October 2026. Our work: helping cultures meet, and the people who carry them.',
            fa: 'متین مؤسسه‌ای میان‌فرهنگی است که در اکتبر ۲۰۲۶ در مونترال متولد شد. کار ما این است که فرهنگ‌ها، و آدم‌هایی که آن‌ها را با خود دارند، به هم برسند.',
          },
        ],
        matin: {
          fr: 'Déjà fait : ces fiches « La culture en mots simples » et, sur notre site, un mot pour la fête nationale de nombreux pays. À venir : le « Café des cultures », pour se parler autour d’une table, et « Mon quartier, nos cultures », pour découvrir les cultures de nos voisins.',
          en: 'Already done: these “Culture in Plain Words” sheets and, on our site, a greeting for the national day of many countries. Coming soon: the “Café des cultures”, to talk around a table, and “Mon quartier, nos cultures”, to discover our neighbours’ cultures.',
          fa: 'انجام‌شده: همین برگه‌های «فرهنگ به زبان ساده» و، در سایت ما، پیام تبریک برای روز ملی کشورهای زیادی. به‌زودی: «کافهٔ فرهنگ‌ها» برای گفت‌وگو دور یک میز، و «محلهٔ من، فرهنگ‌های ما» برای آشنایی با فرهنگ همسایه‌هایمان.',
        },
      },
      {
        heading: { fr: 'À retenir', en: 'To remember', fa: 'یادمان بماند' },
        points: [
          {
            fr: 'Côte à côte, ce n’est pas encore ensemble.',
            en: 'Side by side is not yet together.',
            fa: '«کنار هم» هنوز «با هم» نیست.',
          },
          {
            fr: 'On garde sa culture, et on cherche ce qu’on a en commun.',
            en: 'We keep our culture, and we look for what we share.',
            fa: 'فرهنگ خودمان را نگه می‌داریم و دنبال چیزهای مشترک می‌گردیم.',
          },
          {
            fr: 'Au Québec, le français est la langue qui nous relie.',
            en: 'In Québec, French is the language that connects us.',
            fa: 'در کبک، فرانسه زبانی است که ما را به هم وصل می‌کند.',
          },
          {
            fr: 'Le gouvernement, la Ville, les organismes et chaque voisin ont un rôle.',
            en: 'The government, the City, local organizations and every neighbour have a part to play.',
            fa: 'دولت، شهرداری، سازمان‌ها و تک‌تک همسایه‌ها هر کدام نقشی دارند.',
          },
        ],
      },
    ],
    question: {
      fr: 'Avez-vous déjà eu une vraie conversation avec un voisin d’une autre culture ? Qu’avez-vous appris ?',
      en: 'Have you ever had a real conversation with a neighbour from another culture? What did you learn?',
      fa: 'تا حالا با همسایه‌ای از فرهنگی دیگر یک گفت‌وگوی واقعی داشته‌اید؟ چه چیزی یاد گرفتید؟',
    },
    questionNote: {
      fr: 'Je lis chaque message. Vos histoires pourront inspirer nos prochaines rencontres.',
      en: 'I read every message. Your stories may inspire our next gatherings.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم. داستان‌های شما می‌تواند الهام‌بخش دیدارهای بعدی ما باشد.',
    },
  },
  {
    number: 3,
    slug: 'desert-culturel',
    date: '2026-11-08',
    title: {
      fr: 'Qu’est-ce qu’un désert culturel ?',
      en: 'What is a cultural desert?',
      fa: 'بیابان فرهنگی چیست؟',
    },
    inShort: {
      fr: 'Un désert culturel, c’est un quartier où la culture est loin : pas de bibliothèque, pas de salle de spectacle, pas d’activité à distance de marche. Les gens ne manquent pas d’envie. Il leur manque des lieux.',
      en: 'A cultural desert is a neighbourhood where culture is far away: no library, no performance hall, no activity within walking distance. People do not lack interest. They lack places.',
      fa: 'بیابان فرهنگی محله‌ای است که فرهنگ در آن دور است: نه کتابخانه‌ای، نه سالن نمایشی، نه برنامه‌ای که پیاده بشود به آن رسید. مردم بی‌علاقه نیستند. جا ندارند.',
    },
    sections: [
      {
        heading: {
          fr: 'Une histoire vraie, au nord de Montréal',
          en: 'A true story, in the north of Montréal',
          fa: 'یک داستان واقعی، در شمال مونترال',
        },
        paragraphs: [
          {
            fr: 'Dans le nord de Montréal, la bibliothèque Belleville a fermé ses portes après 53 ans. Une famille de Montréal-Nord qui allait y chercher des livres chaque samedi, où va-t-elle maintenant ?',
            en: 'In the north of Montréal, the Belleville library closed its doors after 53 years. A family in Montréal-Nord that went there for books every Saturday: where does it go now?',
            fa: 'در شمال مونترال، کتابخانهٔ «بل‌ویل» بعد از ۵۳ سال درهایش را بست. خانواده‌ای در مونترال‌نُرد که هر شنبه برای گرفتن کتاب به آنجا می‌رفت، حالا کجا برود؟',
          },
          {
            fr: 'La Ville a trouvé une réponse simple : la Culture-Nomade, un véhicule électrique qui va dans les parcs d’Ahuntsic-Cartierville et de Montréal-Nord. On peut y emprunter des livres et participer à des activités, pour tous les âges. Et un nouveau lieu se construit : l’Espace du Cœur-Nomade, une bibliothèque et un espace culturel entre les deux arrondissements, prévu pour 2027.',
            en: 'The City found a simple answer: the Culture-Nomade, an electric vehicle that goes to parks in Ahuntsic-Cartierville and Montréal-Nord. People can borrow books there and join activities, for all ages. And a new place is being built: the Espace du Cœur-Nomade, a library and cultural space between the two boroughs, planned for 2027.',
            fa: 'شهرداری جوابی ساده پیدا کرد: «کولتور نُماد»، خودرویی برقی که به پارک‌های آهونتسیک-کارتیه‌ویل و مونترال‌نُرد می‌رود. آنجا می‌شود کتاب امانت گرفت و در برنامه‌هایی برای همهٔ سن‌ها شرکت کرد. یک جای تازه هم در حال ساخت است: «فضای کور-نُماد»، کتابخانه و فضای فرهنگی میان این دو بخش، که قرار است در ۲۰۲۷ باز شود.',
          },
          {
            fr: 'Voilà la leçon : quand la culture ne peut pas venir dans un bâtiment, elle peut aller vers les gens.',
            en: 'That is the lesson: when culture cannot be in a building, it can go to the people.',
            fa: 'درس این داستان همین است: وقتی فرهنگ نمی‌تواند در یک ساختمان باشد، می‌تواند به سراغ مردم برود.',
          },
        ],
      },
      {
        heading: {
          fr: 'Le rôle du Canada, du Québec et de la Ville',
          en: 'The role of Canada, Québec and the City',
          fa: 'نقش دولت کانادا، دولت کبک و شهرداری',
        },
        paragraphs: [
          {
            fr: 'Le gouvernement du Canada a le Fonds du Canada pour les espaces culturels. Il aide à construire et à rénover des lieux d’art et de patrimoine, pour que plus de Canadiens y aient accès dans leur propre communauté.',
            en: 'The Government of Canada has the Canada Cultural Spaces Fund. It helps build and renovate arts and heritage spaces, so that more Canadians can reach them in their own community.',
            fa: 'دولت کانادا «صندوق فضاهای فرهنگی کانادا» را دارد. این صندوق به ساختن و نوسازی مکان‌های هنری و میراثی کمک می‌کند تا کانادایی‌های بیشتری در محلهٔ خودشان به آن‌ها دسترسی داشته باشند.',
          },
          {
            fr: 'À Montréal, l’idée n’est pas nouvelle. En 1981, la Ville a ouvert sa première maison de la culture, à Maisonneuve. Le but, déjà : rendre la culture accessible au plus grand nombre de Montréalaises et de Montréalais, dans leur quartier. Le gouvernement du Québec a aidé à les installer avec les bibliothèques.',
            en: 'In Montréal, the idea is not new. In 1981, the City opened its first maison de la culture, in Maisonneuve. The goal, even then: to make culture accessible to as many Montrealers as possible, in their own neighbourhood. The Government of Québec helped set them up together with libraries.',
            fa: 'در مونترال این فکر تازه نیست. شهرداری در ۱۹۸۱ نخستین «خانهٔ فرهنگ» خود را در محلهٔ مزونوو باز کرد. هدف از همان موقع این بود: فرهنگ را در محلهٔ خود مردم به دست هر چه بیشتر مونترالی‌ها برساند. دولت کبک هم کمک کرد این خانه‌ها کنار کتابخانه‌ها ساخته شوند.',
          },
        ],
        matin: {
          fr: 'Matin fait pareil, à sa taille : nous allons là où sont les gens. Le 7 novembre 2026, notre première activité a eu lieu dans un parc, au parc Angrignon, gratuitement, près du métro. 21 personnes sont venues.',
          en: 'Matin does the same, at its own scale: we go where people are. On November 7, 2026, our first activity took place in a park, Parc Angrignon, free of charge, near the metro. 21 people came.',
          fa: 'متین هم به اندازهٔ خودش همین کار را می‌کند: به جایی می‌رویم که مردم هستند. ۷ نوامبر ۲۰۲۶ نخستین برنامهٔ ما در یک پارک برگزار شد، پارک آنگرینیون، رایگان و کنار مترو. ۲۱ نفر آمدند.',
        },
      },
      {
        heading: { fr: 'Le rôle de Matin', en: 'Matin’s role', fa: 'نقش متین' },
        paragraphs: [
          {
            fr: 'Matin n’a pas de bâtiment. Ce n’est pas un problème : un parc, une bibliothèque ou un café peuvent devenir un lieu de culture pour une heure.',
            en: 'Matin does not have a building. That is not a problem: a park, a library or a café can become a place of culture for an hour.',
            fa: 'متین ساختمانی ندارد. این مشکلی نیست: یک پارک، یک کتابخانه یا یک کافه می‌تواند برای یک ساعت جای فرهنگ شود.',
          },
        ],
        matin: {
          fr: 'À venir : le « Café des cultures », pour se parler autour d’une table, et « Mon quartier, nos cultures », pour que les habitants disent eux-mêmes ce qui manque dans leur quartier.',
          en: 'Coming soon: the “Café des cultures”, to talk around a table, and “Mon quartier, nos cultures”, so residents can say for themselves what their neighbourhood is missing.',
          fa: 'به‌زودی: «کافهٔ فرهنگ‌ها» برای گفت‌وگو دور یک میز، و «محلهٔ من، فرهنگ‌های ما» تا خود ساکنان بگویند محله‌شان چه کم دارد.',
        },
      },
      {
        heading: { fr: 'À retenir', en: 'To remember', fa: 'یادمان بماند' },
        points: [
          {
            fr: 'Un désert culturel, ce n’est pas un manque d’envie, c’est un manque de lieux.',
            en: 'A cultural desert is not a lack of interest, it is a lack of places.',
            fa: 'بیابان فرهنگی یعنی کمبود جا، نه کمبود علاقه.',
          },
          {
            fr: 'La culture peut aller vers les gens : dans un parc, avec un véhicule, dans un café.',
            en: 'Culture can go to the people: in a park, in a vehicle, in a café.',
            fa: 'فرهنگ می‌تواند به سراغ مردم برود: در پارک، با یک خودرو، در یک کافه.',
          },
          {
            fr: 'Le Canada, le Québec, la Ville et les organismes ont chacun un rôle.',
            en: 'Canada, Québec, the City and local organizations each have a part to play.',
            fa: 'دولت کانادا، دولت کبک، شهرداری و سازمان‌ها هر کدام نقشی دارند.',
          },
        ],
      },
    ],
    sources: [
      {
        label: {
          fr: 'Ville de Montréal : la Culture-Nomade',
          en: 'City of Montréal: the Culture-Nomade',
          fa: 'شهرداری مونترال: کولتور نُماد',
        },
        url: 'https://montreal.ca/articles/la-culture-nomade-poursuit-sa-route-109685',
      },
      {
        label: {
          fr: 'Ville de Montréal : l’Espace du Cœur-Nomade',
          en: 'City of Montréal: the Espace du Cœur-Nomade',
          fa: 'شهرداری مونترال: فضای کور-نُماد',
        },
        url: 'https://montreal.ca/articles/bibliotheque-et-espace-culturel-du-coeur-nomade-22147',
      },
      {
        label: {
          fr: 'MEM : la création des maisons de la culture',
          en: 'MEM: how the maisons de la culture began',
          fa: 'مرکز حافظهٔ مونترال: پیدایش خانه‌های فرهنگ',
        },
        url: 'https://ville.montreal.qc.ca/memoiresdesmontrealais/la-creation-des-maisons-de-la-culture-montreal-un-projet-ambitieux',
      },
      {
        label: {
          fr: 'Gouvernement du Canada : Fonds du Canada pour les espaces culturels',
          en: 'Government of Canada: Canada Cultural Spaces Fund',
          fa: 'دولت کانادا: صندوق فضاهای فرهنگی کانادا',
        },
        url: 'https://www.canada.ca/fr/patrimoine-canadien/services/financement/fonds-espaces-culturels/lignes-directrices.html',
      },
    ],
    question: {
      fr: 'Dans votre quartier, où allez-vous pour un livre, un spectacle ou une rencontre ? Est-ce loin ?',
      en: 'In your neighbourhood, where do you go for a book, a show or a gathering? Is it far?',
      fa: 'در محلهٔ شما، برای یک کتاب، یک نمایش یا یک دورهمی کجا می‌روید؟ دور است؟',
    },
    questionNote: {
      fr: 'Je lis chaque message. Vos réponses nous aident à choisir où organiser nos prochaines activités.',
      en: 'I read every message. Your answers help us choose where to hold our next activities.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم. پاسخ‌های شما کمک می‌کند جای برنامه‌های بعدی‌مان را انتخاب کنیم.',
    },
  },
  {
    number: 4,
    slug: 'equite',
    date: '2026-11-08',
    title: {
      fr: 'Qu’est-ce que l’équité ?',
      en: 'What is equity?',
      fa: 'برابری (Equity) چیست؟',
    },
    inShort: {
      fr: 'L’égalité, c’est donner la même chose à tout le monde. L’équité, c’est donner à chacun ce qu’il lui faut pour arriver au même endroit. Le but est le même. Le chemin, lui, change selon la personne.',
      en: 'Equality means giving everyone the same thing. Equity means giving each person what they need to reach the same place. The goal is the same. The path changes from one person to another.',
      fa: 'مساوات یعنی به همه یک چیز یکسان بدهیم. برابری یعنی به هر کس همان چیزی را بدهیم که لازم دارد تا به یک جا برسد. هدف یکی است. راه، بسته به آدم‌ها، فرق می‌کند.',
    },
    sections: [
      {
        heading: {
          fr: 'Une histoire vraie : les frais de retard',
          en: 'A true story: library late fees',
          fa: 'یک داستان واقعی: جریمهٔ دیرکرد کتابخانه',
        },
        paragraphs: [
          {
            fr: 'Pendant des années, à Montréal, rendre un livre en retard coûtait de l’argent. La règle était la même pour tous. Mais une mère avec quatre enfants et un petit budget pouvait vite avoir une grosse dette. Son dossier était bloqué. Alors, la famille ne revenait plus.',
            en: 'For years in Montréal, returning a book late cost money. The rule was the same for everyone. But a mother with four children and a small budget could quickly build up a big debt. Her account was blocked. So the family stopped coming back.',
            fa: 'سال‌ها در مونترال، دیر پس دادن کتاب جریمه داشت. قانون برای همه یکی بود. اما مادری با چهار بچه و درآمد کم خیلی زود بدهی بزرگی پیدا می‌کرد. حسابش بسته می‌شد. و خانواده دیگر به کتابخانه برنمی‌گشت.',
          },
          {
            fr: 'Le 6 octobre 2021, la Ville a aboli les frais de retard dans toutes ses bibliothèques. La mairesse de l’époque a expliqué que cela réduit les inégalités et facilite l’accès aux livres, à la culture et aux ordinateurs. La même règle pour tous n’était pas juste pour tous : voilà l’équité.',
            en: 'On October 6, 2021, the City abolished late fees in all its libraries. The mayor at the time explained that this reduces inequalities and makes it easier to reach books, culture and computers. The same rule for everyone was not fair to everyone: that is equity.',
            fa: 'در ۶ اکتبر ۲۰۲۱، شهرداری جریمهٔ دیرکرد را در همهٔ کتابخانه‌هایش برداشت. شهردار وقت توضیح داد که این کار نابرابری را کم می‌کند و رسیدن به کتاب، فرهنگ و رایانه را آسان‌تر می‌کند. قانونِ یکسان برای همه، برای همه منصفانه نبود: برابری یعنی همین.',
          },
        ],
      },
      {
        heading: {
          fr: 'Le rôle de la Ville et des gouvernements',
          en: 'The role of the City and the governments',
          fa: 'نقش شهرداری و دولت‌ها',
        },
        paragraphs: [
          {
            fr: 'À Montréal, le programme Accès-Loisirs permet aux résidents à faible revenu de s’inscrire gratuitement à des activités de sport, d’art et de culture. Les arrondissements le font avec les organismes du quartier.',
            en: 'In Montréal, the Accès-Loisirs program lets low-income residents sign up for free sports, arts and culture activities. Boroughs run it with local organizations.',
            fa: 'در مونترال، برنامهٔ «دسترسی به سرگرمی» (Accès-Loisirs) به ساکنان کم‌درآمد اجازه می‌دهد رایگان در برنامه‌های ورزشی، هنری و فرهنگی ثبت‌نام کنند. بخش‌های شهرداری این کار را همراه سازمان‌های محله انجام می‌دهند.',
          },
          {
            fr: 'Le gouvernement du Canada, dans son Fonds pour les espaces culturels, tient compte des besoins de groupes souvent oubliés : les peuples autochtones, les personnes sourdes ou handicapées, les communautés de langue officielle en situation minoritaire, et d’autres.',
            en: 'The Government of Canada, in its Cultural Spaces Fund, takes into account the needs of groups that are often left out: Indigenous peoples, Deaf and disabled people, official-language minority communities, and others.',
            fa: 'دولت کانادا در «صندوق فضاهای فرهنگی» نیازهای گروه‌هایی را در نظر می‌گیرد که اغلب فراموش می‌شوند: مردمان بومی، ناشنوایان و افراد دارای معلولیت، جامعه‌های اقلیت زبان رسمی، و دیگران.',
          },
        ],
        matin: {
          fr: 'Chez Matin, nos activités publiques sont gratuites. Notre promenade du 7 novembre 2026 était gratuite, ouverte à toutes et à tous, avec une boisson chaude, près du métro.',
          en: 'At Matin, our public activities are free. Our walk on November 7, 2026, was free, open to everyone, with a hot drink, near the metro.',
          fa: 'در متین، برنامه‌های عمومی ما رایگان است. پیاده‌روی ۷ نوامبر ۲۰۲۶ رایگان بود، برای همه باز بود، با نوشیدنی گرم، کنار مترو.',
        },
      },
      {
        heading: { fr: 'Le rôle de Matin', en: 'Matin’s role', fa: 'نقش متین' },
        paragraphs: [
          {
            fr: 'L’équité commence par une question simple : « Qui ne vient pas, et pourquoi ? » Le prix, la distance, la langue, l’horaire ou un escalier peuvent garder des gens dehors.',
            en: 'Equity starts with a simple question: “Who is not coming, and why?” Price, distance, language, timing or a staircase can keep people out.',
            fa: 'برابری با یک پرسش ساده شروع می‌شود: «چه کسی نمی‌آید، و چرا؟» قیمت، فاصله، زبان، ساعت برنامه یا یک راه‌پله می‌تواند آدم‌ها را بیرون نگه دارد.',
          },
        ],
        matin: {
          fr: 'Déjà fait : notre site existe en français, en anglais et en persan, et ces fiches sont écrites en mots simples. Nous voulons continuer à poser cette question avant chaque activité.',
          en: 'Already done: our site exists in French, English and Persian, and these sheets are written in plain words. We want to keep asking this question before every activity.',
          fa: 'انجام‌شده: سایت ما به فرانسوی، انگلیسی و فارسی است و این برگه‌ها به زبان ساده نوشته می‌شوند. می‌خواهیم پیش از هر برنامه همین پرسش را دوباره بپرسیم.',
        },
      },
      {
        heading: { fr: 'À retenir', en: 'To remember', fa: 'یادمان بماند' },
        points: [
          {
            fr: 'Égalité : la même chose pour tous. Équité : ce qu’il faut à chacun.',
            en: 'Equality: the same thing for everyone. Equity: what each person needs.',
            fa: 'مساوات: یک چیز برای همه. برابری: آنچه هر کس لازم دارد.',
          },
          {
            fr: 'Une règle égale peut être injuste pour certains.',
            en: 'An equal rule can be unfair to some.',
            fa: 'قانونی که برای همه یکسان است می‌تواند برای بعضی‌ها ناعادلانه باشد.',
          },
          {
            fr: 'Demandez toujours : qui ne vient pas, et pourquoi ?',
            en: 'Always ask: who is not coming, and why?',
            fa: 'همیشه بپرسید: چه کسی نمی‌آید، و چرا؟',
          },
        ],
      },
    ],
    sources: [
      {
        label: {
          fr: 'Cult MTL : fin des frais de retard (6 octobre 2021, en anglais)',
          en: 'Cult MTL: late fees abolished (October 6, 2021)',
          fa: 'کالت ام‌تی‌ال: لغو جریمهٔ دیرکرد (۶ اکتبر ۲۰۲۱، انگلیسی)',
        },
        url: 'https://cultmtl.com/2021/10/late-fees-have-been-abolished-in-all-montreal-libraries/',
      },
      {
        label: {
          fr: 'Ville de Montréal : programme Accès-Loisirs',
          en: 'City of Montréal: Accès-Loisirs program',
          fa: 'شهرداری مونترال: برنامهٔ Accès-Loisirs',
        },
        url: 'https://montreal.ca/programmes/acces-loisirs',
      },
      {
        label: {
          fr: 'Gouvernement du Canada : Fonds du Canada pour les espaces culturels',
          en: 'Government of Canada: Canada Cultural Spaces Fund',
          fa: 'دولت کانادا: صندوق فضاهای فرهنگی کانادا',
        },
        url: 'https://www.canada.ca/fr/patrimoine-canadien/services/financement/fonds-espaces-culturels/lignes-directrices.html',
      },
    ],
    question: {
      fr: 'Avez-vous déjà renoncé à une activité à cause du prix, de la distance ou de la langue ?',
      en: 'Have you ever given up on an activity because of the price, the distance or the language?',
      fa: 'تا حالا شده به‌خاطر قیمت، فاصله یا زبان از برنامه‌ای صرف‌نظر کنید؟',
    },
    questionNote: {
      fr: 'Je lis chaque message. Ce que vous nous dites change la façon dont nous préparons nos activités.',
      en: 'I read every message. What you tell us changes how we prepare our activities.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم. آنچه به ما می‌گویید شیوهٔ آماده کردن برنامه‌هایمان را تغییر می‌دهد.',
    },
  },
  {
    number: 5,
    slug: 'diversite',
    date: '2026-11-08',
    title: {
      fr: 'Qu’est-ce que la diversité ?',
      en: 'What is diversity?',
      fa: 'تنوع چیست؟',
    },
    inShort: {
      fr: 'La diversité, c’est le simple fait que nous sommes différents : nos origines, nos langues, nos âges, nos façons de vivre. Ce n’est pas un projet. C’est déjà là, dans notre rue.',
      en: 'Diversity is the simple fact that we are different: our origins, our languages, our ages, our ways of living. It is not a project. It is already here, on our street.',
      fa: 'تنوع یعنی همین واقعیت ساده که ما با هم فرق داریم: در ریشه، زبان، سن و شیوهٔ زندگی. تنوع یک پروژه نیست. همین حالا در کوچهٔ ما هست.',
    },
    sections: [
      {
        heading: {
          fr: 'Une image vraie : un autobus à LaSalle',
          en: 'A true picture: a bus in LaSalle',
          fa: 'یک تصویر واقعی: اتوبوسی در لسال',
        },
        paragraphs: [
          {
            fr: 'Montez dans un autobus à LaSalle et écoutez. Selon le recensement de 2021, à la maison, 35 % des gens de LaSalle parlent seulement français, 34 % seulement anglais, et 23 % seulement une autre langue. Plus d’un résident sur trois est une personne immigrante.',
            en: 'Get on a bus in LaSalle and listen. According to the 2021 Census, at home, 35% of LaSalle residents speak only French, 34% only English, and 23% only another language. More than one resident in three is an immigrant.',
            fa: 'سوار یک اتوبوس در لسال شوید و گوش کنید. طبق سرشماری ۲۰۲۱، در خانه ۳۵٪ مردم لسال فقط فرانسوی حرف می‌زنند، ۳۴٪ فقط انگلیسی و ۲۳٪ فقط زبانی دیگر. بیش از یک نفر از هر سه ساکن، مهاجر است.',
          },
          {
            fr: 'Et ce n’est pas que LaSalle. Au Canada, plus de 450 origines ethniques ou culturelles ont été déclarées en 2021, et presque une personne sur quatre (23 %) est immigrante.',
            en: 'And it is not only LaSalle. In Canada, more than 450 ethnic or cultural origins were reported in 2021, and almost one person in four (23%) is an immigrant.',
            fa: 'و این فقط لسال نیست. در کانادا در سال ۲۰۲۱ بیش از ۴۵۰ ریشهٔ قومی یا فرهنگی اعلام شد، و تقریباً از هر چهار نفر یک نفر (۲۳٪) مهاجر است.',
          },
          {
            fr: 'La diversité, ce n’est pas seulement l’origine. C’est aussi la grand-mère et l’adolescent, la personne en fauteuil roulant et le coureur, celle qui vit seule et la famille de six.',
            en: 'Diversity is not only about origin. It is also the grandmother and the teenager, the person in a wheelchair and the runner, the woman who lives alone and the family of six.',
            fa: 'تنوع فقط به ریشه و تبار مربوط نیست. مادربزرگ و نوجوان، کسی که روی ویلچر است و کسی که می‌دود، زنی که تنها زندگی می‌کند و خانوادهٔ شش‌نفره، همه بخشی از تنوع‌اند.',
          },
        ],
      },
      {
        heading: {
          fr: 'Le rôle du Canada, du Québec et de la Ville',
          en: 'The role of Canada, Québec and the City',
          fa: 'نقش دولت کانادا، دولت کبک و شهرداری',
        },
        paragraphs: [
          {
            fr: 'Statistique Canada compte cette diversité à chaque recensement. Ces chiffres aident les gouvernements et les villes à planifier : quelles langues dans les services, quels livres dans les bibliothèques, quelles activités dans les maisons de la culture.',
            en: 'Statistics Canada counts this diversity at every census. These figures help governments and cities plan: which languages in services, which books in libraries, which activities in the maisons de la culture.',
            fa: 'ادارهٔ آمار کانادا در هر سرشماری این تنوع را می‌شمارد. این عددها به دولت‌ها و شهرها کمک می‌کند برنامه بریزند: خدمات به چه زبان‌هایی باشد، چه کتاب‌هایی در کتابخانه‌ها باشد، چه برنامه‌هایی در خانه‌های فرهنگ.',
          },
          {
            fr: 'La Ville de Montréal publie ces chiffres, quartier par quartier, dans « Montréal en statistiques ». Chacun peut les consulter.',
            en: 'The City of Montréal publishes these figures, neighbourhood by neighbourhood, in “Montréal en statistiques”. Anyone can look them up.',
            fa: 'شهرداری مونترال این عددها را محله به محله در «مونترال در آمار» منتشر می‌کند. هر کسی می‌تواند آن‌ها را ببیند.',
          },
        ],
        matin: {
          fr: 'Matin a repris ces chiffres officiels dans son Guide local, avec le lien vers chaque source.',
          en: 'Matin has gathered these official figures in its Local Guide, with a link to each source.',
          fa: 'متین این عددهای رسمی را در «راهنمای محلی» خود آورده، با پیوند به منبع هر کدام.',
        },
      },
      {
        heading: { fr: 'Le rôle de Matin', en: 'Matin’s role', fa: 'نقش متین' },
        paragraphs: [
          {
            fr: 'La diversité est une richesse, mais elle ne suffit pas. On peut vivre dans une rue très diverse sans jamais parler à personne. C’est pour cela que la fiche suivante parle d’inclusion.',
            en: 'Diversity is a richness, but it is not enough. You can live on a very diverse street and never talk to anyone. That is why the next sheet is about inclusion.',
            fa: 'تنوع ثروت است، اما کافی نیست. می‌شود در کوچه‌ای بسیار متنوع زندگی کرد و هیچ‌وقت با کسی حرف نزد. برای همین برگهٔ بعدی دربارهٔ فراگیری است.',
          },
        ],
        matin: {
          fr: 'Déjà fait : notre promenade du 7 novembre 2026 proposait un cercle de conversation sur une tradition d’automne de son pays, en français, notre langue commune. Sur notre site, nous saluons aussi la fête nationale de nombreux pays.',
          en: 'Already done: our walk on November 7, 2026, offered a conversation circle about an autumn tradition from each person’s country, in French, our common language. On our site, we also greet the national day of many countries.',
          fa: 'انجام‌شده: پیاده‌روی ۷ نوامبر ۲۰۲۶ یک حلقهٔ گفت‌وگو داشت دربارهٔ رسم پاییزی سرزمین هر کس، به فرانسوی، زبان مشترک ما. در سایتمان هم روز ملی کشورهای زیادی را تبریک می‌گوییم.',
        },
      },
      {
        heading: { fr: 'À retenir', en: 'To remember', fa: 'یادمان بماند' },
        points: [
          {
            fr: 'La diversité est un fait : elle est déjà dans notre rue.',
            en: 'Diversity is a fact: it is already on our street.',
            fa: 'تنوع یک واقعیت است: همین حالا در کوچهٔ ماست.',
          },
          {
            fr: 'Ce n’est pas que l’origine : l’âge, la santé, la famille comptent aussi.',
            en: 'It is not only origin: age, health and family count too.',
            fa: 'فقط ریشه و تبار نیست: سن، سلامت و خانواده هم به حساب می‌آیند.',
          },
          {
            fr: 'Être divers ne veut pas dire être ensemble.',
            en: 'Being diverse does not mean being together.',
            fa: 'متنوع بودن به معنای با هم بودن نیست.',
          },
        ],
      },
    ],
    sources: [
      {
        label: {
          fr: 'Statistique Canada, Le Quotidien, 26 octobre 2022',
          en: 'Statistics Canada, The Daily, October 26, 2022',
          fa: 'ادارهٔ آمار کانادا، «لو کوتیدین»، ۲۶ اکتبر ۲۰۲۲',
        },
        url: 'https://www150.statcan.gc.ca/n1/daily-quotidien/221026/dq221026b-fra.htm',
      },
      {
        label: {
          fr: 'Ville de Montréal, Montréal en statistiques : profil de LaSalle (Recensement de 2021)',
          en: 'City of Montréal, Montréal en statistiques: LaSalle profile (2021 Census)',
          fa: 'شهرداری مونترال، «مونترال در آمار»: نمایهٔ لسال (سرشماری ۲۰۲۱)',
        },
        url: 'https://ville.montreal.qc.ca/pls/portal/url/item/3907D308DFB42020E0630A9301322020',
      },
    ],
    question: {
      fr: 'Combien de langues entendez-vous dans votre rue ou dans votre autobus ?',
      en: 'How many languages do you hear on your street or on your bus?',
      fa: 'در کوچه یا اتوبوستان چند زبان می‌شنوید؟',
    },
    questionNote: {
      fr: 'Je lis chaque message. Racontez-nous ce que vous entendez autour de vous.',
      en: 'I read every message. Tell us what you hear around you.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم. بگویید دور و برتان چه می‌شنوید.',
    },
  },
  {
    number: 6,
    slug: 'inclusion',
    date: '2026-11-08',
    title: {
      fr: 'Qu’est-ce que l’inclusion ?',
      en: 'What is inclusion?',
      fa: 'فراگیری چیست؟',
    },
    inShort: {
      fr: 'La diversité, c’est être invité à la fête. L’inclusion, c’est pouvoir entrer, être accueilli et avoir sa place à la table. Chacun peut participer, comme il est.',
      en: 'Diversity is being invited to the party. Inclusion is being able to get in, being welcomed and having a seat at the table. Everyone can take part, just as they are.',
      fa: 'تنوع یعنی به مهمانی دعوت شدن. فراگیری یعنی بتوانی وارد شوی، خوشامد بشنوی و سر میز جا داشته باشی. هر کس، همان‌طور که هست، بتواند شرکت کند.',
    },
    sections: [
      {
        heading: {
          fr: 'Une histoire vraie : la carte pour l’accompagnateur',
          en: 'A true story: the companion card',
          fa: 'یک داستان واقعی: کارت همراه',
        },
        paragraphs: [
          {
            fr: 'Imaginez un jeune homme en fauteuil roulant qui veut voir un spectacle. Il a besoin d’une personne pour l’aider. Sans aide, il faut payer deux billets. Pour beaucoup de familles, c’est trop.',
            en: 'Imagine a young man in a wheelchair who wants to see a show. He needs someone to help him. Without help, that means paying for two tickets. For many families, it is too much.',
            fa: 'جوانی را تصور کنید که روی ویلچر است و می‌خواهد نمایشی ببیند. به کسی نیاز دارد که کمکش کند. بدون کمک، یعنی دو بلیت بخرد. برای خیلی از خانواده‌ها این زیاد است.',
          },
          {
            fr: 'Au Québec, la Carte accompagnement loisir (CAL) règle ce problème : dans les lieux partenaires, l’accompagnateur d’une personne handicapée entre gratuitement. En 2024, le gouvernement du Québec a doublé son financement pour que plus de lieux l’acceptent.',
            en: 'In Québec, the Carte accompagnement loisir (CAL, companion leisure card) solves this: at partner venues, the companion of a person with a disability gets in free. In 2024, the Government of Québec doubled its funding so more venues would accept it.',
            fa: 'در کبک، «کارت همراه سرگرمی» (CAL) این مشکل را حل می‌کند: در مکان‌های همکار، همراهِ فرد دارای معلولیت رایگان وارد می‌شود. دولت کبک در ۲۰۲۴ بودجهٔ آن را دو برابر کرد تا مکان‌های بیشتری آن را بپذیرند.',
          },
          {
            fr: 'Le spectacle était déjà ouvert à tous. La carte a rendu l’entrée possible. Voilà l’inclusion.',
            en: 'The show was already open to all. The card made getting in possible. That is inclusion.',
            fa: 'نمایش از قبل برای همه باز بود. این کارت ورود را ممکن کرد. فراگیری یعنی همین.',
          },
        ],
      },
      {
        heading: {
          fr: 'Le rôle du Canada, du Québec et de la Ville',
          en: 'The role of Canada, Québec and the City',
          fa: 'نقش دولت کانادا، دولت کبک و شهرداری',
        },
        paragraphs: [
          {
            fr: 'Le Canada a la Loi canadienne sur l’accessibilité, en vigueur depuis le 11 juillet 2019. Son but : un Canada sans obstacles d’ici le 1er janvier 2040, d’abord dans tout ce qui relève du fédéral, comme les banques, les trains et les avions.',
            en: 'Canada has the Accessible Canada Act, in force since July 11, 2019. Its goal: a barrier-free Canada by January 1, 2040, starting with everything under federal responsibility, such as banks, trains and planes.',
            fa: 'کانادا «قانون دسترسی‌پذیری کانادا» را دارد که از ۱۱ ژوئیهٔ ۲۰۱۹ اجرا می‌شود. هدفش: کانادایی بدون مانع تا ۱ ژانویهٔ ۲۰۴۰، اول در هر چه زیر نظر دولت فدرال است، مثل بانک‌ها، قطارها و هواپیماها.',
          },
          {
            fr: 'À Montréal, les maisons de la culture ont été créées pour rendre la culture accessible au plus grand nombre, dans chaque quartier. Et depuis 2021, les bibliothèques n’imposent plus de frais de retard.',
            en: 'In Montréal, the maisons de la culture were created to make culture accessible to as many people as possible, in every neighbourhood. And since 2021, the libraries no longer charge late fees.',
            fa: 'در مونترال، خانه‌های فرهنگ ساخته شدند تا فرهنگ در هر محله به دست هر چه بیشتر مردم برسد. و از ۲۰۲۱ کتابخانه‌ها دیگر جریمهٔ دیرکرد نمی‌گیرند.',
          },
        ],
        matin: {
          fr: 'Le 7 novembre 2026, au parc Angrignon, nous avons choisi un point de rencontre près du métro et commencé par un accueil et une boisson chaude, pour que chacun se sente attendu.',
          en: 'On November 7, 2026, in Parc Angrignon, we chose a meeting point near the metro and began with a welcome and a hot drink, so everyone would feel expected.',
          fa: 'در ۷ نوامبر ۲۰۲۶ در پارک آنگرینیون، محل دیدار را کنار مترو گذاشتیم و برنامه را با خوشامد و نوشیدنی گرم شروع کردیم تا همه احساس کنند منتظرشان بوده‌ایم.',
        },
      },
      {
        heading: { fr: 'Le rôle de Matin', en: 'Matin’s role', fa: 'نقش متین' },
        paragraphs: [
          {
            fr: 'L’inclusion se joue dans les petits détails : un lieu sans marches, un mot d’accueil, une question posée à celui qui se tait, un texte facile à lire.',
            en: 'Inclusion is in the small details: a place without steps, a word of welcome, a question to the person who stays quiet, a text that is easy to read.',
            fa: 'فراگیری در جزئیات کوچک است: جایی بی‌پله، یک کلمهٔ خوشامد، پرسیدن نظر کسی که ساکت مانده، متنی که راحت خوانده شود.',
          },
        ],
        matin: {
          fr: 'Déjà fait : ces fiches en mots simples, en trois langues. À venir : pour chaque activité, nous voulons indiquer clairement si le lieu est accessible en fauteuil roulant.',
          en: 'Already done: these plain-word sheets, in three languages. Coming next: for every activity, we want to say clearly whether the place is wheelchair accessible.',
          fa: 'انجام‌شده: همین برگه‌های ساده، به سه زبان. قدم بعدی: برای هر برنامه می‌خواهیم روشن بنویسیم که آیا محل برای ویلچر قابل دسترس است یا نه.',
        },
      },
      {
        heading: { fr: 'À retenir', en: 'To remember', fa: 'یادمان بماند' },
        points: [
          {
            fr: 'Inviter ne suffit pas : il faut pouvoir entrer.',
            en: 'Inviting is not enough: people must be able to get in.',
            fa: 'دعوت کافی نیست: باید بشود وارد شد.',
          },
          {
            fr: 'Les petits détails font la différence.',
            en: 'Small details make the difference.',
            fa: 'جزئیات کوچک فرق را می‌سازند.',
          },
          {
            fr: 'Diversité, équité et inclusion vont ensemble. La prochaine fiche les réunit.',
            en: 'Diversity, equity and inclusion go together. The next sheet brings them together.',
            fa: 'تنوع، برابری و فراگیری با هم معنا پیدا می‌کنند. برگهٔ بعدی آن‌ها را کنار هم می‌گذارد.',
          },
        ],
      },
    ],
    sources: [
      {
        label: {
          fr: 'Gouvernement du Québec : financement doublé pour la Carte accompagnement loisir (3 octobre 2024)',
          en: 'Government of Québec: doubled funding for the Carte accompagnement loisir (October 3, 2024)',
          fa: 'دولت کبک: دو برابر شدن بودجهٔ کارت همراه سرگرمی (۳ اکتبر ۲۰۲۴)',
        },
        url: 'https://www.quebec.ca/nouvelles/actualites/details/un-financement-double-pour-favoriser-lacces-a-des-activites-de-loisir-touristiques-et-culturelles-pour-les-personnes-handicapees-58635',
      },
      {
        label: {
          fr: 'Gouvernement du Canada : résumé de la Loi canadienne sur l’accessibilité',
          en: 'Government of Canada: summary of the Accessible Canada Act',
          fa: 'دولت کانادا: خلاصهٔ قانون دسترسی‌پذیری کانادا',
        },
        url: 'https://www.canada.ca/fr/emploi-developpement-social/programmes/accessible-personnes-handicapees/loi-resume.html',
      },
      {
        label: {
          fr: 'MEM : la création des maisons de la culture',
          en: 'MEM: how the maisons de la culture began',
          fa: 'مرکز حافظهٔ مونترال: پیدایش خانه‌های فرهنگ',
        },
        url: 'https://ville.montreal.qc.ca/memoiresdesmontrealais/la-creation-des-maisons-de-la-culture-montreal-un-projet-ambitieux',
      },
    ],
    question: {
      fr: 'Qu’est-ce qui vous ferait sentir vraiment bienvenu dans une activité ?',
      en: 'What would make you feel truly welcome at an activity?',
      fa: 'چه چیزی باعث می‌شود در یک برنامه واقعاً احساس خوشامد کنید؟',
    },
    questionNote: {
      fr: 'Je lis chaque message. Vos idées nous aideront à mieux accueillir tout le monde.',
      en: 'I read every message. Your ideas will help us welcome everyone better.',
      fa: 'همهٔ پیام‌ها را خودم می‌خوانم. ایده‌های شما کمک می‌کند همه را بهتر پذیرا باشیم.',
    },
  },
];
