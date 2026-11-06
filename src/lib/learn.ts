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
];
