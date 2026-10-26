import type { UiLang } from '@/i18n/routes';
import type { getSettings } from './content';

type Settings = Awaited<ReturnType<typeof getSettings>>;

/** schema.org NGO for the whole site (names, legal identity, logo, address, social profiles). */
export function organizationJsonLd(
  settings: Settings,
  lang: UiLang,
  site: URL,
  description: string,
) {
  const sameAs = Object.values(settings.social).filter(Boolean);
  const legal = settings.legal;
  const names = legal?.names ?? {
    fr: 'Institut interculturel Matin',
    en: 'Matin Intercultural Institute',
    fa: 'مؤسسه میان‌فرهنگی متین',
  };
  const a = legal?.registeredAddress;
  const email = legal?.email ?? settings.email;
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': new URL('/#organization', site).href,
    name: names[lang],
    alternateName: (['fr', 'en', 'fa'] as const).filter((l) => l !== lang).map((l) => names[l]),
    ...(legal
      ? {
          legalName: names.fr,
          founder: { '@type': 'Person', name: legal.representative },
        }
      : {}),
    slogan: lang === 'fr' ? 'Cultures en dialogue' : 'Cultures in Dialogue',
    url: new URL('/', site).href,
    logo: new URL('/icons/logo-512.png', site).href,
    image: new URL('/og-default.jpg', site).href,
    description,
    ...(email ? { email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(a
        ? {
            streetAddress: a.street,
            addressLocality: a.city,
            addressRegion: a.region,
            postalCode: a.postalCode,
          }
        : { addressLocality: 'Montréal', addressRegion: 'QC' }),
      addressCountry: 'CA',
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.url, site).href,
    })),
  };
}
