// Renders the "coming soon" posters of Matin in Action (scripts/posters/poster.html) to
// src/assets/uploads/highlights/<poster>/<lang>.jpg at 1812 × 2560 (twice the size of the
// Walking Conversation poster). Run: node scripts/posters/render.mjs
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Playwright is not a project dependency: the globally installed one is used.
const { chromium } = createRequire(import.meta.url)('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const page = pathToFileURL(path.join(here, 'poster.html')).href;
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 906, height: 1280 }, deviceScaleFactor: 2 });
for (const poster of ['cafe', 'quartier']) {
  const dir = path.join(root, 'src/assets/uploads/highlights', poster);
  mkdirSync(dir, { recursive: true });
  for (const lang of ['fr', 'en', 'fa']) {
    await tab.goto(`${page}?poster=${poster}&lang=${lang}`);
    await tab.waitForSelector('body[data-ready="1"]');
    await tab.screenshot({ path: path.join(dir, `${lang}.jpg`), type: 'jpeg', quality: 88 });
  }
}
await browser.close();
