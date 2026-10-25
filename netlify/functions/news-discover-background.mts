/**
 * Background job (up to 15 minutes) that runs one cultural news discovery. It is started by
 * the daily schedule (news-daily) or by "Run discovery now" in the editorial dashboard, both
 * of which send the private internal secret; any other request is ignored.
 */
import type { Config, Context } from '@netlify/functions';
import { runDiscovery } from './_news/discover';
import { contextOf, internalSecret, openStore } from './_news/store';

export default async (req: Request, context: Context) => {
  const store = openStore(contextOf(context.deploy.context));
  const secret = await internalSecret(store);
  if (req.method !== 'POST' || req.headers.get('x-news-secret') !== secret) {
    console.warn('news-discover-background: request without the internal secret ignored');
    return;
  }
  const { trigger, dashboard } = (await req.json().catch(() => ({}))) as {
    trigger?: 'schedule' | 'manual';
    dashboard?: string;
  };
  const run = await runDiscovery(
    store,
    trigger === 'schedule' ? 'schedule' : 'manual',
    dashboard && /^https:\/\//.test(dashboard) ? dashboard : 'https://matincc.ca/editorial/',
  );
  console.log(`Discovery ${run.id}: ${run.status}, ${run.proposed.length} proposed`);
};

export const config: Config = {
  background: true,
};
