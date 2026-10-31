/**
 * « What Culture Means to Us » on the Our Team page (owner's brief, Oct 29 2026): three
 * members of the Executive Team each answer, in their own words, the question « Hey, what
 * does culture mean to you? ». The English texts are the owner's, word for word: never
 * rewrite, shorten or formalize them. The French and Persian texts are DRAFT translations
 * awaiting the owner's review (see TRANSLATIONS_FOR_REVIEW.md); keep their spoken tone.
 *
 * `member` is the file name of the person's entry in src/content/team/ (name, Persian
 * name, role and photo come from there). A member who is no longer published is skipped.
 * `tone` picks the composition's warm colours and layout in CultureVoices.astro.
 */
import type { UiLang } from '@/i18n/routes';

type Text = Record<UiLang, string>;

export const cultureVoicesStrings: Record<'title' | 'subtitle' | 'question' | 'asked' | 'answer', Text> = {
  title: {
    fr: 'Ce que la culture signifie pour nous',
    en: 'What Culture Means to Us',
    fa: 'فرهنگ برای ما یعنی چه',
  },
  subtitle: {
    fr: 'Trois personnes. Trois voix différentes. Un même amour pour rassembler les gens.',
    en: 'Three people. Three different voices. One shared love for bringing people together.',
    fa: 'سه نفر. سه صدای متفاوت. یک عشق مشترک به گرد هم آوردن آدم‌ها.',
  },
  asked: {
    fr: 'Nous leur avons demandé',
    en: 'We asked',
    fa: 'از آن‌ها پرسیدیم',
  },
  question: {
    fr: 'Dis, pour toi, la culture, c’est quoi ?',
    en: 'Hey, what does culture mean to you?',
    fa: 'راستی، فرهنگ برای تو یعنی چه؟',
  },
  // Owner, Oct 31 2026: the question box invites visitors to answer through « Write to us ».
  answer: {
    fr: 'Et pour vous ? Écrivez-nous',
    en: 'And for you? Write to us',
    fa: 'برای شما چه؟ برای ما بنویسید',
  },
};

export interface CultureVoice {
  member: string;
  tone: 'apricot' | 'sand' | 'rose';
  text: Text;
}

export const cultureVoices: CultureVoice[] = [
  {
    member: '02-mina-karimian',
    tone: 'apricot',
    text: {
      en: 'You know what I really like? When people feel comfortable enough to just be themselves. I think that’s where everything starts. We all come from different places, we have different stories, and that’s actually a beautiful thing. I love those little moments when someone feels welcome, when a conversation turns into a friendship, or when a person who was quiet suddenly feels ready to share an idea. That’s the kind of place I’d love Matin to be. Somewhere you walk in, feel at home, and know that you belong.',
      fr: 'Tu sais ce que j’aime vraiment ? Quand les gens se sentent assez à l’aise pour être simplement eux-mêmes. Je pense que c’est là que tout commence. On vient tous d’endroits différents, on a des histoires différentes, et c’est justement quelque chose de beau. J’adore ces petits moments où quelqu’un se sent bienvenu, où une conversation devient une amitié, ou quand une personne restée silencieuse se sent tout à coup prête à partager une idée. C’est ce genre d’endroit que j’aimerais que Matin soit. Un lieu où l’on entre, où l’on se sent chez soi, et où l’on sait qu’on a sa place.',
      fa: 'می‌دانی چه چیزی را واقعاً دوست دارم؟ وقتی آدم‌ها آن‌قدر راحت باشند که بتوانند خودِ خودشان باشند. فکر می‌کنم همه‌چیز از همین‌جا شروع می‌شود. ما همه از جاهای مختلفی آمده‌ایم و قصه‌های متفاوتی داریم، و این در واقع چیز قشنگی است. آن لحظه‌های کوچک را دوست دارم؛ وقتی کسی حس می‌کند با آغوش باز پذیرفته شده، وقتی یک گفت‌وگو به دوستی تبدیل می‌شود، یا وقتی کسی که ساکت بود ناگهان آماده می‌شود ایده‌اش را با بقیه در میان بگذارد. دوست دارم متین چنین جایی باشد. جایی که واردش می‌شوی، حس می‌کنی در خانهٔ خودت هستی و می‌دانی که به آن تعلق داری.',
    },
  },
  {
    member: '03-hakan',
    tone: 'sand',
    text: {
      en: 'Oh, culture? I love it! I mean, think about it. You meet someone from another country, you start talking about music, food, family, or whatever, and suddenly you’ve got so much to talk about! That’s what I enjoy. I don’t think we need to agree on everything or even speak the same language perfectly to get along. Sometimes all it takes is a little curiosity. I’d love to see Matin bring people together from different corners of the world. New faces, new ideas, good conversations, and who knows? Maybe some great friendships along the way.',
      fr: 'Oh, la culture ? J’adore ça ! Enfin, pense un peu : tu rencontres quelqu’un d’un autre pays, vous commencez à parler de musique, de cuisine, de famille ou de n’importe quoi, et tout à coup vous avez plein de choses à vous dire ! C’est ça que j’aime. Je ne pense pas qu’on doive être d’accord sur tout, ni même parler parfaitement la même langue, pour bien s’entendre. Parfois, un peu de curiosité suffit. J’aimerais voir Matin rassembler des gens des quatre coins du monde. De nouveaux visages, de nouvelles idées, de bonnes conversations, et qui sait ? Peut-être de belles amitiés en chemin.',
      fa: 'فرهنگ؟ وای، عاشقش هستم! یعنی خودت فکرش را بکن. با کسی از یک کشور دیگر آشنا می‌شوی، از موسیقی و غذا و خانواده یا هر چیز دیگری حرف می‌زنید، و یک‌دفعه کلی حرف برای گفتن دارید! این همان چیزی است که از آن لذت می‌برم. فکر نمی‌کنم برای اینکه با هم کنار بیاییم لازم باشد دربارهٔ همه‌چیز هم‌نظر باشیم، یا حتی یک زبان را بی‌نقص حرف بزنیم. گاهی فقط کمی کنجکاوی کافی است. دوست دارم ببینم متین آدم‌ها را از گوشه‌وکنار دنیا کنار هم جمع می‌کند. چهره‌های تازه، ایده‌های تازه، گفت‌وگوهای خوب، و کسی چه می‌داند؟ شاید در این مسیر دوستی‌های قشنگی هم شکل بگیرد.',
    },
  },
  {
    member: '04-benoit-akpaki',
    tone: 'rose',
    text: {
      en: 'For me, it’s pretty simple. A good community is one where people look out for each other. That’s it. You don’t need a big project or a fancy plan to make someone’s day better. Sometimes you just show up, listen, help out, or invite someone to join in. I especially love seeing young people get involved because they bring so much energy and so many fresh ideas. And I think we need more of that. At Matin, I’d really like us to try things together, have some fun, make mistakes, learn, and actually do something good for the people around us.',
      fr: 'Pour moi, c’est assez simple. Une bonne communauté, c’est une communauté où les gens veillent les uns sur les autres. C’est tout. Pas besoin d’un grand projet ou d’un plan compliqué pour illuminer la journée de quelqu’un. Parfois, il suffit d’être là, d’écouter, de donner un coup de main ou d’inviter quelqu’un à se joindre à nous. J’aime particulièrement voir les jeunes s’impliquer, parce qu’ils apportent tellement d’énergie et tellement d’idées nouvelles. Et je pense qu’on en a besoin de plus. Chez Matin, j’aimerais vraiment qu’on essaie des choses ensemble, qu’on s’amuse, qu’on fasse des erreurs, qu’on apprenne, et qu’on fasse vraiment quelque chose de bien pour les gens autour de nous.',
      fa: 'برای من خیلی ساده است. یک جامعهٔ خوب جایی است که آدم‌ها هوای همدیگر را دارند. همین. برای اینکه روز کسی را بهتر کنی، به یک پروژهٔ بزرگ یا برنامهٔ پرزرق‌وبرق نیاز نداری. گاهی کافی است فقط باشی، گوش بدهی، کمکی بکنی یا از کسی دعوت کنی که به جمع بپیوندد. به‌خصوص دوست دارم ببینم جوان‌ها پا پیش می‌گذارند، چون این‌همه انرژی و این‌همه ایدهٔ تازه با خودشان می‌آورند. و فکر می‌کنم بیشتر از این‌ها لازم داریم. در متین واقعاً دوست دارم با هم چیزهای تازه را امتحان کنیم، خوش بگذرانیم، اشتباه کنیم، یاد بگیریم و واقعاً کار خوبی برای آدم‌های اطرافمان انجام دهیم.',
    },
  },
];
