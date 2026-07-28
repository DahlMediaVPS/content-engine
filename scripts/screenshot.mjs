#!/usr/bin/env node
// Design-review screenshot harness.
// Captures full-page desktop + mobile screenshots of one or more routes so
// Claude (or you) can inspect spacing / overflow / alignment before shipping.
//
// Usage:
//   npm run screenshot -- --url http://localhost:3000
//   npm run screenshot -- --url http://localhost:5173 --routes /,/services,/about
//   npm run screenshot -- --url http://localhost:3000 --out .design-screenshots
//
// Notes:
//   - Uses the Chromium already installed in this environment (PLAYWRIGHT_BROWSERS_PATH).
//   - Do NOT run `playwright install` here; the browser is pre-provisioned.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
  const args = { url: 'http://localhost:3000', routes: ['/'], out: '.design-screenshots' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') args.url = argv[++i];
    else if (a === '--routes') args.routes = argv[++i].split(',').map((r) => r.trim()).filter(Boolean);
    else if (a === '--out') args.out = argv[++i];
  }
  return args;
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
];

function slug(route) {
  const s = route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  return s || 'home';
}

async function main() {
  const { url, routes, out } = parseArgs(process.argv.slice(2));
  const base = url.replace(/\/+$/, '');
  await mkdir(out, { recursive: true });

  const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined;
  const browser = await chromium.launch({ executablePath }).catch(() => chromium.launch());

  const captured = [];
  const problems = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: !!vp.isMobile,
    });
    const page = await context.newPage();

    for (const route of routes) {
      const target = base + (route.startsWith('/') ? route : '/' + route);
      try {
        await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });
        // Let fonts settle and any entrance animations finish.
        await page.waitForTimeout(600);

        // Heuristic check: does the page scroll horizontally? (overflow tell)
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return {
            scrollW: doc.scrollWidth,
            clientW: doc.clientWidth,
            overflowing: doc.scrollWidth > doc.clientWidth + 1,
          };
        });
        if (overflow.overflowing) {
          problems.push(
            `[${vp.name}] ${route}: horizontal overflow (scrollWidth ${overflow.scrollW} > viewport ${overflow.clientW}).`
          );
        }

        const file = path.join(out, `${slug(route)}.${vp.name}.png`);
        await page.screenshot({ path: file, fullPage: true });
        captured.push(file);
        console.log(`captured ${file}`);
      } catch (err) {
        problems.push(`[${vp.name}] ${route}: failed to load — ${err.message}`);
        console.error(`FAILED ${target}: ${err.message}`);
      }
    }
    await context.close();
  }

  await browser.close();

  console.log(`\n${captured.length} screenshot(s) written to ${out}/`);
  if (problems.length) {
    console.log('\nAuto-detected issues to check:');
    for (const p of problems) console.log('  - ' + p);
  } else {
    console.log('\nNo automatic overflow issues detected. Still inspect the PNGs by eye.');
  }
  console.log('\nNext: Read the PNGs and run the design-review inspection checklist.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
