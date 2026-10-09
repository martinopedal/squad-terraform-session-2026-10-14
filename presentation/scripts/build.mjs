import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { marked } from 'marked';
import { title, slides, escape, renderSection, applyNoteFactOverrides } from '../src/slides.mjs';
import { shortTitle, createShortSlides } from '../src/short-slides.mjs';
import { resolveMediaEntry } from './media-policy.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = async path => (await readFile(join(root, path), 'utf8')).replaceAll('\r\n', '\n');
const assetData = async (path, type) => `data:${type};base64,${(await readFile(join(root, path))).toString('base64')}`;
const fontFace = async (weight, file) =>
  `@font-face{font-family:'Roboto';font-style:normal;font-weight:${weight};font-display:block;src:url("${await assetData(file, 'font/woff2')}") format('woff2');}`;
const [talk, sessionize, theme, runtime, versionText, mediaText, evidenceText, core, coreCSS, highlight, highlightCSS, notes, licenses,
  nicLogoInk, nicLogoCyan, nicLogoLargeInk, martinPhoto, haflidiPhoto, roboto400, roboto500, roboto700, cascadiaCode] = await Promise.all([
  read('../docs/talk-track.md'), read('../docs/sessionize.md'), read('src/theme.css'), read('src/runtime.js'),
  read('src/version.json'), read('src/media.json'), read('src/evidence.json'),
  read('node_modules/reveal.js/dist/reveal.js'), read('node_modules/reveal.js/dist/reveal.css'),
  read('node_modules/reveal.js/plugin/highlight/highlight.js'), read('node_modules/reveal.js/plugin/highlight/monokai.css'),
  read('node_modules/reveal.js/plugin/notes/notes.js'), read('src/third-party-licenses.txt'),
  assetData('src/assets/nic26-logo-ink.png', 'image/png'),
  assetData('src/assets/nic26-logo-cyan.png', 'image/png'),
  assetData('src/assets/nic26-logo-large-ink.png', 'image/png'),
  assetData('src/assets/speakers/martin.jpg', 'image/jpeg'),
  assetData('src/assets/speakers/haflidi.jpg', 'image/jpeg'),
  fontFace(400, 'node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff2'),
  fontFace(500, 'node_modules/@fontsource/roboto/files/roboto-latin-500-normal.woff2'),
  fontFace(700, 'node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff2'),
  fontFace(400, 'media/fonts/CascadiaCode.woff2')
]);
const fontCSS = roboto400 + roboto500 + roboto700 + cascadiaCode.replaceAll("font-family:'Roboto'", "font-family:'Cascadia Code'");
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
const qaWords = 0;
for (const [id, block] of blocks) {
  for (const name of Object.keys(speakers)) {
    const count = [...block.matchAll(new RegExp(`\\*\\*${name}:\\*\\* (.+)`, 'g'))].reduce((sum, match) => sum + words(match[1]), 0);
    if (!id.startsWith('a-') && id !== 's22-questions') speakers[name] += count;
  }
}
const spokenWords = speakers.Martin + speakers.Haflidi;
const descriptionWords = words(sessionize.split('## Description and outcomes\n')[1].split('\n## ')[0]);
const pitchWords = words(sessionize.split('## Elevator pitch\n')[1].split('\n## ')[0]);
if (slides.length !== 39 || slides.filter(slide => slide.preshow).length !== 2 ||
    slides.filter(slide => !slide.id.startsWith('a-') && !slide.preshow).length !== 26) {
  throw new Error('Expected two untimed pre-show slides, 26 timed main slides, and eleven appendix slides.');
}
const [openingSlide, legalSlide, firstTimedSlide] = slides;
if (openingSlide.id !== 'opening' || legalSlide.id !== 'legal-notice' || !legalSlide.preshow ||
    firstTimedSlide.id !== 's01-outcome' || firstTimedSlide.time !== '00:00-03:00') {
  throw new Error('Legal notice must be untimed, immediately after opening, and before s01 at 00:00.');
}
if (spokenWords < 1400 || spokenWords > 2200 || qaWords !== 0) throw new Error(`Spoken script length is out of range: ${spokenWords} main, ${qaWords} scheduled Q&A.`);
if (Math.abs(speakers.Martin - speakers.Haflidi) / spokenWords > .1) throw new Error('Speaker contributions differ by more than 10%.');
if (descriptionWords < 250 || descriptionWords > 350 || pitchWords < 45 || pitchWords > 65) throw new Error('Sessionize word count is out of range.');
if (new Set(slides.map(slide => slide.id)).size !== slides.length) throw new Error('Duplicate slide ID.');
for (const slide of slides) {
  const syntheticNotes = applyNoteFactOverrides(slide.id, '').trim();
  if (!slide.preshow && !slide.notes && !blocks.has(slide.id) && !syntheticNotes) {
    throw new Error(`Missing complete notes for ${slide.id}.`);
  }
}
const chapters = slides.filter(slide => slide.chapter).map(slide => ({ id: slide.chapter, title: slide.title, duration: slide.duration, slide: slide.id }));
const expectedChapterDurations = [180, 180, 240, 240, 240, 300, 180, 180];
if (chapters.reduce((sum, chapter) => sum + chapter.duration, 0) !== 1740 ||
    chapters.some((chapter, index) => chapter.id !== `C${index}` || chapter.duration !== expectedChapterDurations[index])) {
  throw new Error('Live demo chapter budget must be C0-C7 = 3/3/4/4/4/5/3/3 minutes, totaling 29 minutes.');
}
const protectedSlackSeconds = 180;
const closeBufferSeconds = 120;
const toSeconds = value => value.split(':').reduce((sum, component) => sum * 60 + Number(component), 0);
const clock = { intro: 0, demo: 0, explanation: 0, slack: 0, close: 0, qa: 0 };
let previousEnd = 0;
for (const slide of slides.filter(item => !item.id.startsWith('a-') && !item.preshow)) {
  const [start, end] = slide.time.split('-').map(toSeconds);
  if (start !== previousEnd || end <= start) throw new Error(`Discontinuous slide clock at ${slide.id}.`);
  if (slide.chapter && end - start !== slide.duration) throw new Error(`Clip and stage duration disagree at ${slide.id}.`);
  const bucket = slide.chapter ? 'demo'
    : slide.id === 's01-outcome' ? 'intro'
      : slide.id === 'buffer-recovery' ? 'slack'
        : slide.id === 's22-questions' ? 'close' : 'explanation';
  clock[bucket] += end - start;
  previousEnd = end;
}
if (previousEnd !== 3600 || clock.intro !== 180 || clock.demo !== 1740 || clock.explanation !== 1380 ||
    clock.slack !== protectedSlackSeconds || clock.close !== closeBufferSeconds || clock.qa !== 0 ||
    previousEnd - clock.close - clock.slack !== 3300) {
  throw new Error('The actual slide clock must retain 3 intro / 29 demo / 23 explanation / 3 protected slack / 0 scheduled Q&A / 2 close-buffer minutes, with content ending at 55:00.');
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
  version: version.version, openingSlides: 2, mainSlides: 26, appendixSlides: 11,
  demoMinutes: clock.demo / 60, introMinutes: clock.intro / 60, explanationMinutes: clock.explanation / 60,
  protectedSlackMinutes: clock.slack / 60, closeBufferMinutes: clock.close / 60,
  nonDemoSlideMinutes: (clock.intro + clock.explanation + clock.close) / 60,
  contentEnd: '55:00', mainFlowMinutes: (previousEnd - clock.close - clock.slack) / 60,
  qaMinutes: clock.qa / 60, closeStart: '58:00', questions: 'if time allows',
  timedSlideMinutes: previousEnd / 60,
  spokenWords, speakers, qaWords, descriptionWords, pitchWords,
  chapters, media, sourceRevision: evidence.sourceRevision, moduleRevision: evidence.moduleRevision,
  runtime: 'reveal.js 5.2.1', highlight: `highlight.js ${highlightVersion} (BSD-3-Clause)`,
  generatedAt: new Date().toISOString()
};
const shortSlides = createShortSlides({ martinPhoto, haflidiPhoto });
const shortBuild = {
  version: version.version,
  variant: 'short',
  slideCount: shortSlides.length,
  runtime: 'reveal.js 5.2.1',
  highlight: `highlight.js ${highlightVersion} (BSD-3-Clause)`,
  generatedAt: build.generatedAt
};
const scriptTag = (label, value) => `<script data-bundle="${label}">${value.replace(/\/\/# sourceMappingURL=.*$/gm, '').replace(/<\/script/gi, '<\\/script')}</script>`;
const navLink = slide => `<a href="#/${slide.id}" data-nav="${slide.id}">${escape(slide.chapter ? slide.chapter + ': ' + slide.title : slide.title)}</a>`;
const overviewIDs = ['s01-outcome', 's04-news', 's04-layers', 's07-agent-setup', 's06-contract', 's15-proof', 's20-consumer', 's22-questions'];
const navigation = `<dialog class="navigation-dialog" aria-labelledby="navigation-title"><header><h2 id="navigation-title">Go to a chapter or reference</h2><button type="button">Close</button></header>
  <div class="navigation-columns"><div><h3>Story</h3>${slides.filter(slide => overviewIDs.includes(slide.id)).map(navLink).join('')}</div>
  <div><h3>Live demo chapters</h3>${slides.filter(slide => slide.chapter).map(navLink).join('')}</div>
  <div><h3>Optional references</h3>${slides.filter(slide => slide.id.startsWith('a-')).map(navLink).join('')}</div></div>
  <p class="navigation-help">Arrow keys: slides and fragments. S: speaker notes. Escape: overview or close this menu. N: this menu.</p></dialog>`;
const renderNotes = (slide, rawNotes) => {
  const completeNotes = marked.parse(rawNotes);
  return slide.id.startsWith('a-') ? completeNotes : completeNotes.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g,
    '<details class="operator-cues"><summary>Operator cues and timing</summary><blockquote>$1</blockquote></details>');
};
const sections = slides.map((slide, index) => {
  const rawNotes = slide.preshow ? (slide.notes || '') : (slide.notes || blocks.get(slide.id) || '');
  const noteHTML = renderNotes(slide, rawNotes);
  return renderSection(slide, index, applyNoteFactOverrides(slide.id, noteHTML), evidence, media);
}).join('\n');
const shortNavigation = `<dialog class="navigation-dialog" aria-labelledby="navigation-title"><header><h2 id="navigation-title">Go to a short-deck slide</h2><button type="button">Close</button></header>
  <div class="navigation-columns"><div><h3>Short deck</h3>${shortSlides.map(navLink).join('')}</div></div>
  <p class="navigation-help">Arrow keys: slides. S: speaker notes. Escape: overview or close this menu. N: this menu.</p></dialog>`;
const shortSections = shortSlides.map((slide, index) =>
  renderSection(slide, index, renderNotes(slide, slide.notes || ''), evidence, media)).join('\n');
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
const shortHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(shortTitle)}</title>
<!-- Document version: ${version.version} (${version.status})
Short deck build generated beside the full presentation.
Built with reveal.js 5.2.1 (MIT), highlight.js ${highlightVersion} (BSD-3-Clause), RevealHighlight and RevealNotes bundled with Reveal 5.2.1.
-->
<!--
${licenses}
-->
<meta name="author" content="Martin Opedal; Haflidi Fridthjofsson">
<meta name="description" content="Short conference deck for the Copilot CLI and Squad Terraform session.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2398F8FE'/%3E%3Ctext x='8' y='42' font-family='Arial,sans-serif' font-size='24' fill='%231A1B1B'%3ENIC%3C/text%3E%3C/svg%3E">
<style data-bundle="reveal-css">${coreCSS.replace(/\/\*# sourceMappingURL=.*?\*\//g, '')}</style>
<style data-bundle="highlight-css">${highlightCSS}</style><style data-bundle="roboto-fonts">${fontCSS}</style><style data-bundle="nic-assets">${assetCSS}</style><style data-bundle="nic-theme">${theme}</style>
</head><body>
<nav class="presentation-tools" aria-label="Presenter controls"><button id="open-notes" type="button" aria-keyshortcuts="S">Speaker notes</button><button id="open-navigation" type="button" aria-haspopup="dialog" aria-keyshortcuts="N">Slides</button></nav>
<main class="reveal" aria-label="Short conference presentation"><div class="slides">${shortSections}</div></main>
${shortNavigation}
<p id="navigation-status" class="visually-hidden" aria-live="polite" aria-atomic="true"></p>
<p id="runtime-error" class="runtime-error" role="alert" hidden></p>
${scriptTag('reveal', core)}
${scriptTag('highlight', highlight)}
${scriptTag('notes', notes)}
${scriptTag('metadata', `window.presentationBuild = ${JSON.stringify(shortBuild).replaceAll('<', '\\u003c')};`)}
${scriptTag('presenter', runtime)}
</body></html>`;
await mkdir(join(root, 'qa'), { recursive: true });
await mkdir(join(root, 'media'), { recursive: true });
await mkdir(join(root, 'short'), { recursive: true });
await writeFile(join(root, 'index.html'), html, 'utf8');
await writeFile(join(root, 'short/index.html'), shortHtml, 'utf8');
await writeFile(join(root, 'qa/build-manifest.json'), JSON.stringify({
  ...build, htmlBytes: Buffer.byteLength(html), htmlSHA256: createHash('sha256').update(html).digest('hex')
}, null, 2) + '\n');
await writeFile(join(root, 'short/build-manifest.json'), JSON.stringify({
  ...shortBuild, htmlBytes: Buffer.byteLength(shortHtml), htmlSHA256: createHash('sha256').update(shortHtml).digest('hex')
}, null, 2) + '\n');
console.log(`Built index.html: 2 pre-show + 26 timed main + 11 appendix; ${spokenWords} main words (${speakers.Martin}/${speakers.Haflidi}); ${qaWords} scheduled Q&A words.`);
console.log('Timing 3 intro / 29 demo / 23 explanation / 3 protected slack / 2 close buffer; questions if time allows.');
console.log(`Sessionize: ${descriptionWords}-word description; ${pitchWords}-word pitch. HTML ${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB.`);
console.log(`Built short/index.html: ${shortSlides.length} slides. HTML ${(Buffer.byteLength(shortHtml) / 1024).toFixed(0)} KiB.`);
