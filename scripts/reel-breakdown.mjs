#!/usr/bin/env node
// Reel breakdown: the mechanical half of reverse-engineering a source reel.
// No AI and no credits are used here. It cuts the video into shots, pulls the
// stills, and lays them out so an agent (or a person) only has to look and
// describe. A second command turns the filled-in notes into the breakdown PDF.
//
//   node scripts/reel-breakdown.mjs extract <video.mp4> <job-folder>
//   node scripts/reel-breakdown.mjs pdf <job-folder>
//
// extract writes into <job-folder>:
//   3 SOURCE/stills/S01_start.jpg, _mid.jpg, _end.jpg   full-size, per shot
//   3 SOURCE/grid/t_0000.50.jpg ...                      a frame every 0.5 s
//   3 SOURCE/sheets/sheet_01.png ...                     labelled contact sheets
//   3 SOURCE/audio.wav                                   for transcription
//   1 SCRIPT/shots.json                                  one entry per shot, to fill in
// pdf writes:
//   2 STORYBOARD + IMAGES/breakdown.pdf
//
// Options for extract:  --grid 0.5  (seconds between grid frames)
//                       --scene 0.30 (cut sensitivity, lower = more cuts)
// Needs ffmpeg/ffprobe on PATH and the playwright package (npm install).

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const DIR = { script: '1 SCRIPT', board: '2 STORYBOARD + IMAGES', source: '3 SOURCE' };

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.error) throw new Error(`${cmd} not found. Install ffmpeg and make sure it is on PATH.`);
  return r;
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const tc = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${(t % 60).toFixed(2).padStart(5, '0')}`;
const fileUrl = (p) => pathToFileURL(path.resolve(p)).href;

function probe(video) {
  const r = run('ffprobe', ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', video]);
  if (r.status !== 0) throw new Error(`Could not read ${video}: ${r.stderr.trim()}`);
  const j = JSON.parse(r.stdout);
  const v = j.streams.find((s) => s.codec_type === 'video');
  if (!v) throw new Error('No video stream in the file.');
  const [n, d] = (v.avg_frame_rate || v.r_frame_rate || '30/1').split('/').map(Number);
  return {
    duration: Number(j.format.duration),
    width: v.width,
    height: v.height,
    fps: d ? +(n / d).toFixed(2) : n,
    hasAudio: j.streams.some((s) => s.codec_type === 'audio'),
  };
}

function sceneCuts(video, threshold, duration) {
  const r = run('ffmpeg', ['-hide_banner', '-i', video, '-vf', `select='gt(scene,${threshold})',showinfo`, '-an', '-f', 'null', '-']);
  const times = [...r.stderr.matchAll(/pts_time:([0-9.]+)/g)].map((m) => Number(m[1]));
  const cuts = [0];
  for (const t of times) if (t - cuts[cuts.length - 1] >= 0.4 && duration - t >= 0.4) cuts.push(t);
  return cuts;
}

function still(video, t, out, width) {
  const vf = width ? ['-vf', `scale=${width}:-2`] : [];
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', t.toFixed(3), '-i', video, '-frames:v', '1', ...vf, '-q:v', '2', out]);
}

async function withPage(fn) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    try {
      ({ chromium } = createRequire(import.meta.url)('playwright'));
    } catch {
      throw new Error('The playwright package is missing. Run "npm install" in this repo, then "npx playwright install chromium".');
    }
  }
  const browser = await chromium.launch();
  try {
    return await fn(await browser.newPage({ viewport: { width: 1500, height: 1000 } }));
  } finally {
    await browser.close();
  }
}

async function extract(video, job, opts) {
  if (!existsSync(video)) throw new Error(`Video not found: ${video}`);
  const src = path.join(job, DIR.source);
  for (const d of ['stills', 'grid', 'sheets']) mkdirSync(path.join(src, d), { recursive: true });
  mkdirSync(path.join(job, DIR.script), { recursive: true });
  mkdirSync(path.join(job, DIR.board), { recursive: true });

  const info = probe(video);
  const cuts = sceneCuts(video, opts.scene, info.duration);
  const shots = cuts.map((start, i) => {
    const end = i + 1 < cuts.length ? cuts[i + 1] : info.duration;
    const dur = end - start;
    const id = `S${String(i + 1).padStart(2, '0')}`;
    const pad = Math.min(0.08, dur / 4);
    const at = { start: start + pad, mid: start + dur / 2, end: end - pad };
    const stills = {};
    for (const [k, t] of Object.entries(at)) {
      const rel = path.join(DIR.source, 'stills', `${id}_${k}.jpg`);
      still(video, t, path.join(job, rel));
      stills[k] = rel;
    }
    return {
      id,
      start: +start.toFixed(2),
      end: +end.toFixed(2),
      duration: +dur.toFixed(2),
      clip_length: dur <= 4 ? '4s' : dur <= 6 ? '6s' : dur <= 8 ? '8s' : 'split: over 8s',
      stills,
      framing: '',
      camera_move: '',
      action: '',
      lighting: '',
      dialogue: '',
      on_screen_text: '',
      props: [],
      notes: '',
    };
  });

  // Grid: a small frame every N seconds, so tilts, zooms and actions inside a shot are visible.
  const step = opts.grid;
  const gridTimes = [];
  for (let t = 0; t < info.duration - 0.02; t += step) gridTimes.push(+t.toFixed(2));
  for (const t of gridTimes) still(video, t, path.join(src, 'grid', `t_${t.toFixed(2).padStart(7, '0')}.jpg`), 360);

  if (info.hasAudio) run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-vn', '-ac', '1', '-ar', '16000', path.join(src, 'audio.wav')]);

  // Contact sheets: labelled thumbnails, 24 per sheet. Reading these is far cheaper than reading every frame.
  const shotAt = (t) => shots.find((s) => t >= s.start && t < s.end) ?? shots[shots.length - 1];
  const perSheet = 24;
  const sheetCount = Math.ceil(gridTimes.length / perSheet);
  await withPage(async (page) => {
    for (let n = 0; n < sheetCount; n++) {
      const cells = gridTimes.slice(n * perSheet, (n + 1) * perSheet).map((t) => {
        const s = shotAt(t);
        const first = Math.abs(t - gridTimes.find((g) => g >= s.start)) < 1e-6;
        return `<figure class="${first ? 'cut' : ''}"><img src="${fileUrl(path.join(src, 'grid', `t_${t.toFixed(2).padStart(7, '0')}.jpg`))}"><figcaption><b>${s.id}</b> ${tc(t)}</figcaption></figure>`;
      });
      const tmp = path.join(src, 'sheets', '.sheet.html');
      writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>
        body{margin:0;background:#111;font:600 15px system-ui,sans-serif;color:#fff}
        .g{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;padding:12px;background:#111}
        figure{margin:0;border:3px solid transparent} figure.cut{border-color:#ffd400}
        img{width:100%;display:block} figcaption{padding:3px 2px;background:#000} b{color:#ffd400}
      </style><div class="g">${cells.join('')}</div>`);
      await page.goto(fileUrl(tmp), { waitUntil: 'networkidle' });
      await page.locator('.g').screenshot({ path: path.join(src, 'sheets', `sheet_${String(n + 1).padStart(2, '0')}.png`) });
      rmSync(tmp, { force: true });
    }
  });

  const out = {
    source_file: path.basename(video),
    source_url: '',
    duration: +info.duration.toFixed(2),
    resolution: `${info.width}x${info.height}`,
    fps: info.fps,
    word_count: null,
    words_per_second: null,
    hook: '',
    summary: '',
    shots,
    recipe: { name: '', ingredients: [], steps: [], result_still: '' },
  };
  const jsonPath = path.join(job, DIR.script, 'shots.json');
  if (existsSync(jsonPath) && !opts.force) {
    console.log(`shots.json already exists, left untouched (use --force to overwrite): ${jsonPath}`);
  } else {
    writeFileSync(jsonPath, JSON.stringify(out, null, 2));
  }
  console.log(`${shots.length} shots, ${gridTimes.length} grid frames, ${sheetCount} contact sheets, ${info.duration.toFixed(1)}s${info.hasAudio ? ', audio.wav written' : ', NO AUDIO in source'}`);
  console.log(`Next: look at "${path.join(src, 'sheets')}", fill in "${jsonPath}", then run: pdf "${job}"`);
}

async function pdf(job) {
  const jsonPath = path.join(job, DIR.script, 'shots.json');
  if (!existsSync(jsonPath)) throw new Error(`No shots.json in ${path.join(job, DIR.script)}. Run extract first.`);
  const d = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const empty = d.shots.filter((s) => !s.action && !s.framing).map((s) => s.id);
  const sheetsDir = path.join(job, DIR.source, 'sheets');
  const sheets = existsSync(sheetsDir) ? readdirSync(sheetsDir).filter((f) => f.endsWith('.png')).sort() : [];
  const img = (rel) => (rel && existsSync(path.join(job, rel)) ? `<img src="${fileUrl(path.join(job, rel))}">` : '<div class="missing">no still</div>');
  const row = (k, v) => (v && String(v).length ? `<tr><th>${k}</th><td>${esc(Array.isArray(v) ? v.join(', ') : v)}</td></tr>` : '');

  const shotsHtml = d.shots.map((s) => `
    <section class="shot">
      <h2><span>${esc(s.id)}</span> ${tc(s.start)} – ${tc(s.end)} <em>${s.duration}s · build as ${esc(s.clip_length)}</em></h2>
      <div class="stills">
        <figure>${img(s.stills?.start)}<figcaption>start frame</figcaption></figure>
        <figure>${img(s.stills?.mid)}<figcaption>middle</figcaption></figure>
        <figure>${img(s.stills?.end)}<figcaption>end frame</figcaption></figure>
      </div>
      <table>
        ${row('Says', s.dialogue)}${row('Action', s.action)}${row('Framing', s.framing)}${row('Camera', s.camera_move)}
        ${row('Lighting', s.lighting)}${row('On-screen text', s.on_screen_text)}${row('Props', s.props)}${row('Notes', s.notes)}
      </table>
    </section>`).join('');

  const r = d.recipe ?? {};
  const recipeHtml = r.name ? `
    <section class="recipe"><h1>Recipe: ${esc(r.name)}</h1>
      ${r.result_still ? `<div class="result">${img(r.result_still)}</div>` : ''}
      <h3>Ingredients</h3><ul>${(r.ingredients ?? []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      <h3>Steps</h3><ol>${(r.steps ?? []).map((i) => `<li>${esc(i)}</li>`).join('')}</ol>
    </section>` : '';

  const html = `<!doctype html><meta charset="utf-8"><style>
    @page{size:Letter;margin:14mm}
    body{font:13px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;margin:0}
    h1{font-size:24px;margin:0 0 6px} h2{font-size:15px;margin:0 0 8px;font-weight:700}
    h2 span{background:#111;color:#fff;padding:2px 8px;border-radius:4px;margin-right:6px}
    h2 em{font-style:normal;font-weight:400;color:#666;margin-left:8px} h3{margin:14px 0 4px}
    .meta{color:#555;margin-bottom:10px} .hook{font-size:16px;border-left:4px solid #111;padding:4px 12px;margin:12px 0}
    .warn{background:#fff3cd;border:1px solid #e0c060;padding:8px 12px;margin:10px 0}
    .sheet{width:100%;margin-top:10px;page-break-inside:avoid}
    .shot{page-break-inside:avoid;border-top:1px solid #ccc;padding:12px 0}
    .stills{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px}
    figure{margin:0} .stills img{width:100%;max-height:300px;object-fit:contain;background:#eee;display:block}
    figcaption{font-size:11px;color:#666;padding-top:2px} .missing{height:120px;background:#eee;display:grid;place-items:center;color:#999}
    table{border-collapse:collapse;width:100%} th{text-align:left;vertical-align:top;width:110px;color:#555;font-weight:600;padding:2px 8px 2px 0} td{padding:2px 0}
    .recipe{page-break-before:always} .result img{max-width:240px;display:block;margin:8px 0}
    .script{page-break-before:always} .script td:first-child{white-space:nowrap;color:#555;padding-right:12px}
  </style>
  <h1>Reel breakdown</h1>
  <div class="meta">${esc(d.source_file)}${d.source_url ? ` · ${esc(d.source_url)}` : ''}<br>
    ${d.duration}s · ${d.shots.length} shots · ${esc(d.resolution)} @ ${d.fps} fps${d.words_per_second ? ` · ${d.word_count} words · ${d.words_per_second} words/sec` : ''}</div>
  ${d.hook ? `<div class="hook"><b>Hook:</b> ${esc(d.hook)}</div>` : ''}
  ${d.summary ? `<p>${esc(d.summary)}</p>` : ''}
  ${empty.length ? `<div class="warn">Not described yet: ${empty.join(', ')}</div>` : ''}
  ${sheets.map((f) => `<img class="sheet" src="${fileUrl(path.join(sheetsDir, f))}">`).join('')}
  <div style="page-break-before:always"></div>
  ${shotsHtml}
  <section class="script"><h1>Script with timestamps</h1><table>
    ${d.shots.filter((s) => s.dialogue).map((s) => `<tr><td>${esc(s.id)} ${tc(s.start)}</td><td>${esc(s.dialogue)}</td></tr>`).join('')}
  </table></section>
  ${recipeHtml}`;

  const out = path.join(job, DIR.board, 'breakdown.pdf');
  mkdirSync(path.dirname(out), { recursive: true });
  const tmp = path.join(job, DIR.board, '.breakdown.html');
  writeFileSync(tmp, html);
  await withPage(async (page) => {
    await page.goto(fileUrl(tmp), { waitUntil: 'networkidle' });
    await page.pdf({ path: out, format: 'Letter', printBackground: true });
  });
  rmSync(tmp, { force: true });
  console.log(`Wrote ${out}${empty.length ? ` (still blank: ${empty.join(', ')})` : ''}`);
}

const [cmd, ...rest] = process.argv.slice(2);
const flags = { grid: 0.5, scene: 0.3, force: false };
const pos = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--grid') flags.grid = Number(rest[++i]);
  else if (rest[i] === '--scene') flags.scene = Number(rest[++i]);
  else if (rest[i] === '--force') flags.force = true;
  else pos.push(rest[i]);
}
try {
  if (cmd === 'extract' && pos.length === 2) await extract(pos[0], pos[1], flags);
  else if (cmd === 'pdf' && pos.length === 1) await pdf(pos[0]);
  else {
    console.log('Usage:\n  node scripts/reel-breakdown.mjs extract <video.mp4> <job-folder> [--grid 0.5] [--scene 0.30] [--force]\n  node scripts/reel-breakdown.mjs pdf <job-folder>');
    process.exit(cmd ? 1 : 0);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
