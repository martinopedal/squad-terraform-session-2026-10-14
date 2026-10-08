import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { marked } from 'marked';
import { title, slides, escape, renderSection, applyNoteFactOverrides } from '../src/slides.mjs';
import { resolveMediaEntry } from './media-policy.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = async path => (await readFile(join(root, path), 'utf8')).replaceAll('\r\n', '\n');
const assetData = async (path, type) => `data:${type};base64,${(await readFile(join(root, path))).toString('base64')}`;
const fontFace = async (weight, file) =>
  `@font-face{font-family:'Roboto';font-style:normal;font-weight:${weight};font-display:block;src:url("${await assetData(file, 'font/woff2')}") format('woff2');}`;
const [talk, sessionize, theme, runtime, versionText, mediaText, evidenceText, core, coreCSS, highlight, highlightCSS, notes, licenses,
  nicLogoInk, nicLogoCyan, nicLogoLargeInk, roboto400, roboto500, roboto700] = await Promise.all([
  read('../docs/talk-track.md'), read('../docs/sessionize.md'), read('src/theme.css'), read('src/runtime.js'),
  read('src/version.json'), read('src/media.json'), read('src/evidence.json'),
  read('node_modules/reveal.js/dist/reveal.js'), read('node_modules/reveal.js/dist/reveal.css'),
  read('node_modules/reveal.js/plugin/highlight/highlight.js'), read('node_modules/reveal.js/plugin/highlight/monokai.css'),
  read('node_modules/reveal.js/plugin/notes/notes.js'), read('src/third-party-licenses.txt'),
  assetData('src/assets/nic26-logo-ink.png', 'image/png'),
  assetData('src/assets/nic26-logo-cyan.png', 'image/png'),
  assetData('src/assets/nic26-logo-large-ink.png', 'image/png'),
  fontFace(400, 'node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff2'),
  fontFace(500, 'node_modules/@fontsource/roboto/files/roboto-latin-500-normal.woff2'),
  fontFace(700, 'node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff2')
]);
const fontCSS = roboto400 + roboto500 + roboto700;
const assetCSS = `:root{--nic-logo-ink:url("${nicLogoInk}");--nic-logo-cyan:url("${nicLogoCyan}");--nic-logo-large-ink:url("${nicLogoLargeInk}");}`;
const version = JSON.parse(versionText);
const media = JSON.parse(mediaText);
const evidence = JSON.parse(evidenceText);
const highlightVersion = highlight.match(/versionString\s*[:=]\s*["']([^"']+)["']/)?.[1];
if (highlightVersion !== '11.9.0') throw new Error('Review the changed bundled highlighter before updating its version notice.');
if (!licenses.includes('Copyright (C) 2011-2024 Hakim El Hattab') ||
    !licenses.includes('Copyright (c) 2006, Ivan Sagalaev.') ||
    !licenses.includes('Copyright 2011 The Roboto Project Authors') ||
    !licenses.includes('SIL OPEN FONT LICENSE Version 1.1') ||
    !licenses.includes('Apache License') ||
    !licenses.includes('Version 2.0, January 2004') ||
    !licenses.includes('Redistribution and use in source and binary forms') ||
    licenses.includes('-->')) throw new Error('Complete reviewed bundle licenses are required.');
const blocks = new Map(talk.split(/^## /m).filter(part => /^(s\d\d-|demo-c|a-)/.test(part))
  .map(part => [part.split(' | ')[0], part.slice(part.indexOf('\n') + 1).trim()]));
const words = value => (value.match(/\b\w+(?:['-]\w+)*\b/g) || []).length;
const speakers = { Martin: 0, Haflidi: 0 };
let qaWords = 0;
for (const [id, block] of blocks) {
  for (const name of Object.keys(speakers)) {
    const count = [...block.matchAll(new RegExp(`\\*\\*${name}:\\*\\* (.+)`, 'g'))].reduce((sum, match) => sum + words(match[1]), 0);
    if (id === 's22-questions') qaWords += count;
    else if (!id.startsWith('a-')) speakers[name] += count;
  }
}
const spokenWords = speakers.Martin + speakers.Haflidi;
const descriptionWords = words(sessionize.split('## Description and outcomes\n')[1].split('\n## ')[0]);
const pitchWords = words(sessionize.split('## Elevator pitch\n')[1].split('\n## ')[0]);
if (slides.length !== 37 || slides.filter(slide => slide.preshow).length !== 1 ||
    slides.filter(slide => !slide.id.startsWith('a-') && !slide.preshow).length !== 25) {
  throw new Error('Expected one opening slide, 25 timed main slides, and eleven appendix slides.');
}
if (spokenWords < 5300 || spokenWords > 5900 || qaWords < 650 || qaWords > 800) throw new Error(`Spoken script length is out of range: ${spokenWords} main, ${qaWords} Q&A.`);
if (Math.abs(speakers.Martin - speakers.Haflidi) / spokenWords > .1) throw new Error('Speaker contributions differ by more than 10%.');
if (descriptionWords < 250 || descriptionWords > 350 || pitchWords < 45 || pitchWords > 65) throw new Error('Sessionize word count is out of range.');
if (new Set(slides.map(slide => slide.id)).size !== slides.length) throw new Error('Duplicate slide ID.');
for (const slide of slides) if (!slide.preshow && !blocks.has(slide.id)) throw new Error(`Missing complete notes for ${slide.id}.`);
const chapters = slides.filter(slide => slide.chapter).map(slide => ({ id: slide.chapter, title: slide.title, duration: slide.duration, slide: slide.id }));
if (chapters.reduce((sum, chapter) => sum + chapter.duration, 0) !== 1740) throw new Error('Live demo chapter budget must be 29 minutes.');
const protectedSlackSeconds = 300;
const toSeconds = value => value.split(':').reduce((sum, component) => sum * 60 + Number(component), 0);
const clock = { demo: 0, explanation: 0, qa: 0 };
let previousEnd = 0;
for (const slide of slides.filter(item => !item.id.startsWith('a-') && !item.preshow)) {
  const [start, end] = slide.time.split('-').map(toSeconds);
  if (start !== previousEnd || end <= start) throw new Error(`Discontinuous slide clock at ${slide.id}.`);
  if (slide.chapter && end - start !== slide.duration) throw new Error(`Clip and stage duration disagree at ${slide.id}.`);
  clock[slide.chapter ? 'demo' : slide.id === 's22-questions' ? 'qa' : 'explanation'] += end - start;
  previousEnd = end;
}
if (previousEnd !== 3600 || clock.demo !== 1740 || clock.explanation !== 1440 ||
    clock.explanation - protectedSlackSeconds !== 1140 || protectedSlackSeconds !== 300 || clock.qa !== 420 ||
    previousEnd - clock.qa !== 3180) {
  throw new Error('The actual slide clock must retain 29 demo / 19 explanation / 5 protected slack / 7 Q&A minutes, with Q&A at 53:00.');
}
for (const chapter of chapters) {
  const item = media[chapter.id];
  let present = false;
  try { await access(join(root, `media/${chapter.id}.mp4`), constants.R_OK); present = true; }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  media[chapter.id] = resolveMediaEntry(chapter.id, item, present);
  if (present && !media[chapter.id].available) console.warn(`${chapter.id}: local fallback video excluded because it is unreviewed.`);
}

const build = {
  version: version.version, openingSlides: 1, mainSlides: 25, appendixSlides: 11,
  demoMinutes: clock.demo / 60, explanationMinutes: (clock.explanation - protectedSlackSeconds) / 60,
  protectedSlackMinutes: protectedSlackSeconds / 60, nonDemoSlideMinutes: clock.explanation / 60,
  mainFlowMinutes: (previousEnd - clock.qa) / 60, qaMinutes: clock.qa / 60, qnaStart: '53:00',
  timedSlideMinutes: previousEnd / 60,
  spokenWords, speakers, qaWords, descriptionWords, pitchWords,
  chapters, media, sourceRevision: evidence.sourceRevision, moduleRevision: evidence.moduleRevision,
  runtime: 'reveal.js 5.2.1', highlight: `highlight.js ${highlightVersion} (BSD-3-Clause)`,
  generatedAt: new Date().toISOString()
};
const scriptTag = (label, value) => `<script data-bundle="${label}">${value.replace(/\/\/# sourceMappingURL=.*$/gm, '').replace(/<\/script/gi, '<\\/script')}</script>`;
const navLink = slide => `<a href="#/${slide.id}" data-nav="${slide.id}">${escape(slide.chapter ? slide.chapter + ': ' + slide.title : slide.title)}</a>`;
const overviewIDs = ['s01-outcome', 's04-news', 's04-layers', 's07-agent-setup', 's06-contract', 's15-proof', 's20-consumer', 's22-questions'];
const navigation = `<dialog class="navigation-dialog" aria-labelledby="navigation-title"><header><h2 id="navigation-title">Go to a chapter or reference</h2><button type="button">Close</button></header>
  <div class="navigation-columns"><div><h3>Story</h3>${slides.filter(slide => overviewIDs.includes(slide.id)).map(navLink).join('')}</div>
  <div><h3>Live demo chapters</h3>${slides.filter(slide => slide.chapter).map(navLink).join('')}</div>
  <div><h3>Optional references</h3>${slides.filter(slide => slide.id.startsWith('a-')).map(navLink).join('')}</div></div>
  <p class="navigation-help">Arrow keys: slides and fragments. S: speaker notes. Escape: overview or close this menu. N: this menu.</p></dialog>`;
const sections = slides.map((slide, index) => {
  const completeNotes = slide.preshow ? marked.parse(slide.notes || '') : marked.parse(blocks.get(slide.id));
  const noteHTML = slide.id.startsWith('a-') ? completeNotes : completeNotes.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g,
    '<details class="operator-cues"><summary>Operator cues and timing</summary><blockquote>$1</blockquote></details>');
  return renderSection(slide, index, applyNoteFactOverrides(slide.id, noteHTML), evidence, media);
}).join('\n');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title>
<!-- Document version: ${version.version} (${version.status})
${version.changes.join('\n')}
Promote to 1.0 only after presenter approval.
Built with reveal.js 5.2.1 (MIT), highlight.js ${highlightVersion} (BSD-3-Clause), RevealHighlight and RevealNotes bundled with Reveal 5.2.1.
Runtime, theme, notes, and small assets are inlined. Long local MP4s are the documented packaging exception.
-->
<!--
${licenses}
-->
<meta name="author" content="Martin Opedal; Haflidi Fridthjofsson">
<meta name="description" content="Practical Copilot CLI and Squad workflows for a reusable Terraform module and private Azure landing-zone consumption.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2398F8FE'/%3E%3Ctext x='8' y='42' font-family='Arial,sans-serif' font-size='24' fill='%231A1B1B'%3ENIC%3C/text%3E%3C/svg%3E">
<style data-bundle="reveal-css">${coreCSS.replace(/\/\*# sourceMappingURL=.*?\*\//g, '')}</style>
<style data-bundle="highlight-css">${highlightCSS}</style><style data-bundle="roboto-fonts">${fontCSS}</style><style data-bundle="nic-assets">${assetCSS}</style><style data-bundle="nic-theme">${theme}</style>
</head><body>
<nav class="presentation-tools" aria-label="Presenter controls"><button id="open-notes" type="button" aria-keyshortcuts="S">Speaker notes</button><button id="open-navigation" type="button" aria-haspopup="dialog" aria-keyshortcuts="N">Chapters</button></nav>
<main class="reveal" aria-label="Conference presentation"><div class="slides">${sections}</div></main>
${navigation}
<p id="navigation-status" class="visually-hidden" aria-live="polite" aria-atomic="true"></p>
<p id="runtime-error" class="runtime-error" role="alert" hidden></p>
${scriptTag('reveal', core)}
${scriptTag('highlight', highlight)}
${scriptTag('notes', notes)}
${scriptTag('metadata', `window.presentationBuild = ${JSON.stringify(build).replaceAll('<', '\\u003c')};`)}
${scriptTag('presenter', runtime)}
</body></html>`;
await mkdir(join(root, 'qa'), { recursive: true });
await mkdir(join(root, 'media'), { recursive: true });
await writeFile(join(root, 'index.html'), html, 'utf8');
await writeFile(join(root, 'qa/build-manifest.json'), JSON.stringify({
  ...build, htmlBytes: Buffer.byteLength(html), htmlSHA256: createHash('sha256').update(html).digest('hex')
}, null, 2) + '\n');
console.log(`Built index.html: 1 opening + 25 timed main + 11 appendix; ${spokenWords} main words (${speakers.Martin}/${speakers.Haflidi}); ${qaWords} Q&A words.`);
console.log('Timing 29 demo / 19 explanation / 5 protected slack / 7 Q&A; Q&A starts at 53:00.');
console.log(`Sessionize: ${descriptionWords}-word description; ${pitchWords}-word pitch. HTML ${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB.`);
