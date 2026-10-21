import type { MatinType } from '@/lib/matin';
import type { useTranslations } from '@/i18n/ui';

/** Default button label for each kind of Matin item. */
export function ctaFor(type: MatinType, t: ReturnType<typeof useTranslations>): string {
  switch (type) {
    case 'event':
      return t('home.ctaEvent');
    case 'poster':
      return t('home.ctaPoster');
    case 'video':
      return t('home.ctaVideo');
    case 'news':
    case 'report':
      return t('home.ctaRead');
    default:
      return t('common.learnMore');
  }
}
