/**
 * Daily cultural news discovery at 10:00 UTC (06:00 in Montréal in summer, 05:00 in winter).
 * Netlify runs schedules only on the published production site, never on Deploy Previews.
 * It does nothing until Matin switches "Daily discovery" on in the editorial dashboard.
 * It only starts the background job, which can only create Pending candidates.
 */
import type { Config, Context } from '@netlify/functions';
import { contextOf, internalSecret, openStore, readSettings } from './_news/store';

export default async (_req: Request, context: Context) => {
  const store = openStore(contextOf(context.deploy.context));
  if (!(await readSettings(store)).dailyDiscovery) {
    console.log('Daily discovery is switched off in the editorial dashboard: nothing to do.');
    return new Response('off', { status: 200 });
  }
  const site = context.site.url || 'https://matincc.ca';
  const res = await fetch(`${site}/.netlify/functions/news-discover-background`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-news-secret': await internalSecret(store) },
    body: JSON.stringify({ trigger: 'schedule', dashboard: `${site}/editorial/` }),
  });
  console.log(`Daily discovery started: HTTP ${res.status}`);
  return new Response(null, { status: res.ok ? 200 : 502 });
};

export const config: Config = {
  schedule: '0 10 * * *',
};
