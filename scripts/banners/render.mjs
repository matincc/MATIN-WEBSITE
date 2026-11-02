// Renders scripts/banners/first-activity.html to src/assets/uploads/news/first-activity/<lang>.jpg
// (1600 × 900). Run: node scripts/banners/render.mjs
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const page = pathToFileURL(path.join(here, 'first-activity.html')).href;
const dir = path.join(root, 'src/assets/uploads/news/first-activity');
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 800, height: 450 }, deviceScaleFactor: 2 });
for (const lang of ['fr', 'en', 'fa']) {
  await tab.goto(`${page}?lang=${lang}`);
  await tab.waitForSelector('body[data-ready="1"]');
  await tab.screenshot({ path: path.join(dir, `${lang}.jpg`), type: 'jpeg', quality: 88 });
}
await browser.close();
