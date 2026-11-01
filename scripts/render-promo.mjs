#!/usr/bin/env node
// Deterministic renderer for HTML motion compositions.
// The composition must expose window.seek(t) (t in seconds) and be a pure function of t.
// Each frame is captured with Playwright and piped into ffmpeg → H.264 MP4.
//
// Usage:
//   npm run render-promo
//   node scripts/render-promo.mjs --html demo/castor-oil-promo/index.html \
//        --out demo/castor-oil-promo/castor-oil-promo.mp4 --duration 12 --fps 30
//
// Notes:
//   - Uses the pre-installed Chromium (do NOT run `playwright install`).
//   - Requires ffmpeg on PATH.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { once } from 'node:events';
import path from 'node:path';

function parseArgs(argv) {
  const a = {
    html: 'demo/castor-oil-promo/index.html',
    out: 'demo/castor-oil-promo/castor-oil-promo.mp4',
    duration: 12,
    fps: 30,
    width: 1080,
    height: 1920,
  };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k === '--html') a.html = v, i++;
    else if (k === '--out') a.out = v, i++;
    else if (k === '--duration') a.duration = Number(v), i++;
    else if (k === '--fps') a.fps = Number(v), i++;
    else if (k === '--width') a.width = Number(v), i++;
    else if (k === '--height') a.height = Number(v), i++;
  }
  return a;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const htmlPath = path.resolve(args.html);
  const outPath = path.resolve(args.out);
  const totalFrames = Math.round(args.duration * args.fps);

  // Prefer the pre-provisioned Chromium when present (cloud sandbox); otherwise Playwright's default.
  const preinstalled = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
  const launchOpts = existsSync(preinstalled)
    ? { executablePath: preinstalled, args: ['--no-sandbox'] }
    : {};
  const browser = await chromium.launch(launchOpts);
  const page = await browser.newPage({
    viewport: { width: args.width, height: args.height },
    deviceScaleFactor: 1,
  });
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => typeof window.seek === 'function');

  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(args.fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', outPath,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const exited = once(ff, 'close');
  for (let f = 0; f < totalFrames; f++) {
    await page.evaluate((t) => window.seek(t), f / args.fps);
    const png = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await once(ff.stdin, 'drain');
    if (f % 60 === 0) process.stdout.write(`frame ${f}/${totalFrames}\n`);
  }
  ff.stdin.end();
  const [code] = await exited;
  await browser.close();
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
  console.log(`wrote ${outPath} (${totalFrames} frames @ ${args.fps}fps)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
