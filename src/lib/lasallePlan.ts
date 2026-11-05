/**
 * « Matin et le Plan d'action culturel de LaSalle 2026–2030 » (owner's approval, Nov 5 2026).
 * An evergreen page, not news: how Matin hopes to contribute to the borough's plan, axis by
 * axis. Matin is not the plan's author nor a recognized partner: always « aspire à contribuer ».
 * The plan itself is linked on montreal.ca (all rights reserved: never hosted here).
 * Axis titles are the borough's own wording (FR); EN and FA are translations.
 */
import type { UiLang } from '@/i18n/routes';

type T = Record<UiLang, string>;

export const lasallePlanUrl =
  'https://montreal.ca/articles/plan-daction-culturel-de-lasalle-2026-2030-121491';

export const lasallePlan: {
  title: T;
  eyebrow: T;
  lede: T;
  axesTitle: T;
  axesLede: T;
  axisLabel: T;
  axes: { name: T; contribution: T }[];
  disclaimer: T;
  cta: T;
  close: T;
  closeCta: T;
  homeLine: T;
  homeLink: T;
} = {
  title: {
    fr: 'Matin et le Plan d’action culturel de LaSalle',
    en: 'Matin and LaSalle’s Cultural Action Plan',
    fa: 'متین و برنامهٔ اقدام فرهنگی لاسال',
  },
  eyebrow: { fr: 'LaSalle · 2026–2030', en: 'LaSalle · 2026–2030', fa: 'لاسال · ۲۰۲۶–۲۰۳۰' },
  lede: {
    fr: 'L’Arrondissement de LaSalle s’est doté d’un Plan d’action culturel pour la période 2026–2030 : cinq axes, vingt et une actions et une vision, celle d’une vie culturelle « diversifiée, accessible, rassembleuse, innovante » sur l’ensemble du territoire. Établi à LaSalle, l’Institut interculturel Matin aspire à contribuer à sa mise en œuvre. Nous choisissons d’agir d’abord ici, dans notre arrondissement, avant d’élargir notre contribution à l’échelle de Montréal.',
    en: 'The Borough of LaSalle has adopted a Cultural Action Plan for 2026–2030: five priorities, twenty-one actions and a vision of cultural life that is diverse, accessible, unifying and innovative across the whole borough. Based in LaSalle, the Matin Intercultural Institute aspires to contribute to it. We have chosen to act here first, in our own borough, before extending our contribution across Montréal.',
    fa: 'بخش لاسال برای دورهٔ ۲۰۲۶ تا ۲۰۳۰ برنامهٔ اقدام فرهنگی تازه‌ای تصویب کرده است: پنج محور، بیست‌ویک اقدام و چشم‌اندازی برای زندگی فرهنگی «متنوع، در دسترس، گردآورنده و نوآور» در سراسر این بخش. مؤسسه میان‌فرهنگی متین که در لاسال مستقر است، امیدوار است در اجرای این برنامه سهمی داشته باشد. ما تصمیم گرفته‌ایم نخست همین‌جا، در بخش خودمان، کار کنیم و سپس سهم خود را به سطح مونترال گسترش دهیم.',
  },
  axesTitle: {
    fr: 'Ce que nous souhaitons apporter, axe par axe',
    en: 'What we hope to bring, priority by priority',
    fa: 'آنچه امیدواریم در هر محور عرضه کنیم',
  },
  axesLede: {
    fr: 'Les cinq axes du plan et ce que l’Institut peut y apporter, en lien avec ses objectifs.',
    en: 'The plan’s five priorities and what the Institute can bring to each, linked to its objectives.',
    fa: 'پنج محور برنامه و آنچه مؤسسه می‌تواند در هر یک، در پیوند با هدف‌های برنامه، عرضه کند.',
  },
  axisLabel: { fr: 'Axe', en: 'Priority', fa: 'محور' },
  axes: [
    {
      name: {
        fr: 'Développement et consolidation de l’offre de services en culture',
        en: 'Developing and strengthening cultural services',
        fa: 'گسترش و تقویت خدمات فرهنگی',
      },
      contribution: {
        fr: 'Des activités de proximité ouvertes à toutes et à tous : la série « Café des cultures », le projet « Mon quartier, nos cultures » et les fiches « La culture en mots simples », qui rendent accessibles les notions au cœur de la vie interculturelle.',
        en: 'Neighbourhood activities open to all: the “Café des cultures” series, the “Mon quartier, nos cultures” project and the “Culture in Plain Words” sheets, which make the core ideas of intercultural life accessible.',
        fa: 'فعالیت‌های محلی برای همه: مجموعهٔ «کافهٔ فرهنگ‌ها»، طرح «محلهٔ من، فرهنگ‌های ما» و برگه‌های «فرهنگ به زبان ساده» که مفاهیم اصلی زندگی میان‌فرهنگی را در دسترس همه قرار می‌دهند.',
      },
    },
    {
      name: {
        fr: 'Synergie entre les actrices et acteurs de l’horizon culturel de LaSalle',
        en: 'Building synergy among LaSalle’s cultural players',
        fa: 'هم‌افزایی میان فعالان فرهنگی لاسال',
      },
      contribution: {
        fr: 'Une démarche de rencontre avec les organismes culturels, communautaires et d’intégration de LaSalle, en vue de collaborations durables. Nous souhaitons participer aux rencontres annuelles des partenaires et des acteurs culturels prévues par le plan (objectif 2.2).',
        en: 'A steady effort to meet LaSalle’s cultural, community and integration organizations, with lasting collaborations in view. We hope to take part in the annual meetings of partners and cultural players set out in the plan (objective 2.2).',
        fa: 'دیدار و گفت‌وگو با سازمان‌های فرهنگی، اجتماعی و ادغام‌محور لاسال برای همکاری‌های پایدار. امیدواریم در نشست‌های سالانهٔ شرکا و فعالان فرهنگی که در برنامه پیش‌بینی شده است شرکت کنیم (هدف ۲.۲).',
      },
    },
    {
      name: {
        fr: 'Rayonnement de l’offre culturelle auprès de la population',
        en: 'Making the cultural offer better known to residents',
        fa: 'شناساندن بیشتر برنامه‌های فرهنگی به ساکنان',
      },
      contribution: {
        fr: 'La mise en valeur des cultures présentes dans l’arrondissement, en français et en anglais, et des projets de médiation culturelle participative avec les organismes, comme le « Café des cultures » (objectif 3.3).',
        en: 'Showcasing the cultures present in the borough, in French and English, and participatory cultural mediation projects with local organizations, such as the “Café des cultures” (objective 3.3).',
        fa: 'معرفی فرهنگ‌های حاضر در این بخش به فرانسه و انگلیسی، و طرح‌های مشارکتی میانجی‌گری فرهنگی با سازمان‌های محلی، مانند «کافهٔ فرهنگ‌ها» (هدف ۳.۳).',
      },
    },
    {
      name: {
        fr: 'Accompagnement et soutien aux organismes dans le développement de leurs offres de services',
        en: 'Supporting organizations as they develop their services',
        fa: 'همراهی و پشتیبانی از سازمان‌ها در گسترش خدماتشان',
      },
      contribution: {
        fr: 'Notre expertise en planification culturelle et en développement des communautés, offerte aux organismes qui souhaitent rejoindre des publics plus diversifiés.',
        en: 'Our expertise in cultural planning and community development, offered to organizations that wish to reach more diverse audiences.',
        fa: 'تجربهٔ ما در برنامه‌ریزی فرهنگی و توسعهٔ اجتماعات، در اختیار سازمان‌هایی که می‌خواهند به مخاطبان متنوع‌تری برسند.',
      },
    },
    {
      name: {
        fr: 'Augmentation de la participation et de l’inclusion des citoyen(ne)s dans l’offre culturelle',
        en: 'Increasing residents’ participation and inclusion in cultural life',
        fa: 'افزایش مشارکت و فراگیری شهروندان در زندگی فرهنگی',
      },
      contribution: {
        fr: 'Des activités conçues pour les nouveaux arrivants et les familles de toutes origines, comme la promenade d’automne au parc Angrignon. Nous pouvons aussi partager notre connaissance des pratiques culturelles des personnes immigrantes et accompagner les organismes qui veulent diversifier leurs publics (objectifs 5.1 et 5.2).',
        en: 'Activities designed for newcomers and families of every background, such as the autumn walk in Parc Angrignon. We can also share our knowledge of immigrants’ cultural practices and support organizations that want to diversify their audiences (objectives 5.1 and 5.2).',
        fa: 'فعالیت‌هایی برای تازه‌واردان و خانواده‌هایی با هر پیشینه، مانند پیاده‌روی پاییزی در پارک آنگرینیون. همچنین می‌توانیم شناخت خود از عادت‌های فرهنگی مهاجران را به اشتراک بگذاریم و سازمان‌هایی را که می‌خواهند مخاطبانشان را متنوع کنند همراهی کنیم (هدف‌های ۵.۱ و ۵.۲).',
      },
    },
  ],
  disclaimer: {
    fr: 'Le Plan d’action culturel est un document de l’Arrondissement de LaSalle. L’Institut n’en est pas l’auteur ; cette page présente la manière dont nos activités s’y rattachent.',
    en: 'The Cultural Action Plan is a document of the Borough of LaSalle (in French). The Institute is not its author; this page shows how our activities relate to it.',
    fa: 'برنامهٔ اقدام فرهنگی سندی از بخش لاسال است (به زبان فرانسه). مؤسسه نویسندهٔ آن نیست؛ این صفحه نشان می‌دهد فعالیت‌های ما چگونه با آن پیوند دارند.',
  },
  cta: {
    fr: 'Consulter le plan sur montreal.ca',
    en: 'View the plan on montreal.ca',
    fa: 'دیدن برنامه در montreal.ca',
  },
  close: {
    fr: 'Vous représentez un organisme de LaSalle et souhaitez collaborer avec nous ?',
    en: 'Do you represent a LaSalle organization and wish to work with us?',
    fa: 'نمایندهٔ سازمانی در لاسال هستید و می‌خواهید با ما همکاری کنید؟',
  },
  closeCta: { fr: 'Écrivez-nous', en: 'Write to us', fa: 'برای ما بنویسید' },
  homeLine: {
    fr: 'Établi à LaSalle, l’Institut aspire à contribuer au Plan d’action culturel de LaSalle 2026–2030.',
    en: 'Based in LaSalle, the Institute aspires to contribute to LaSalle’s Cultural Action Plan 2026–2030.',
    fa: 'مؤسسه که در لاسال مستقر است، امیدوار است در برنامهٔ اقدام فرهنگی لاسال ۲۰۲۶–۲۰۳۰ سهمی داشته باشد.',
  },
  homeLink: { fr: 'Découvrir', en: 'Learn more', fa: 'بیشتر بدانید' },
};
