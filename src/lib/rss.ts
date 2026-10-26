import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getNews, slugOf } from './content';
import { baseLang, href, type UiLang } from '@/i18n/routes';
import { pick, useTranslations } from '@/i18n/ui';

/** RSS feed of news posts in one language: /fr/rss.xml, /en/rss.xml, /fa/rss.xml */
export function rssFeed(lang: UiLang): APIRoute {
  return async ({ site }) => {
    const t = useTranslations(lang);
    const posts = await getNews();
    return rss({
      title: `${t('meta.siteName')} — ${t('nav.news')}`,
      description: t('news.lede'),
      site: site!,
      items: posts.map((post) => ({
        title: pick(post.data.title, lang),
        description: pick(post.data.excerpt, lang),
        pubDate: post.data.date,
        link: href('news', lang, slugOf(post, baseLang(lang))),
        author:
          typeof post.data.author === 'string' ? post.data.author : pick(post.data.author, lang),
        categories: [t(`newsCategories.${post.data.category}`)],
      })),
      customData: `<language>${lang === 'fr' ? 'fr-ca' : lang === 'fa' ? 'fa' : 'en-ca'}</language>`,
    });
  };
}
