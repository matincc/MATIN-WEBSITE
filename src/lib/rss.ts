import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getNews, slugOf } from './content';
import { path, type Lang } from '@/i18n/routes';
import { useTranslations } from '@/i18n/ui';

/** RSS feed of news posts in one language: /fr/rss.xml, /en/rss.xml */
export function rssFeed(lang: Lang): APIRoute {
  return async ({ site }) => {
    const t = useTranslations(lang);
    const posts = await getNews();
    return rss({
      title: `${t('meta.siteName')} — ${t('nav.news')}`,
      description: t('news.lede'),
      site: site!,
      items: posts.map((post) => ({
        title: post.data.title[lang],
        description: post.data.excerpt[lang],
        pubDate: post.data.date,
        link: path('news', lang, slugOf(post, lang)),
        author: typeof post.data.author === 'string' ? post.data.author : post.data.author[lang],
        categories: [t(`newsCategories.${post.data.category}`)],
      })),
      customData: `<language>${lang === 'fr' ? 'fr-ca' : 'en-ca'}</language>`,
    });
  };
}
