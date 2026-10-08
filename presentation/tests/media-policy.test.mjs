import test from 'node:test';
import assert from 'node:assert/strict';
import { applyNoteFactOverrides, demoContent, slides } from '../src/slides.mjs';

const demoSlides = slides.filter(slide => slide.kind === 'demo');
const bannedOnScreen = /recording slot|not attached|pending/i;
const abridgedLabel = '(abridged — full prompt in notes)';
const decodeHTML = value => value
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&amp;', '&');
const codeBlocks = html => [...html.matchAll(/<pre><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/g)]
  .map(match => decodeHTML(match[1]).trim());

test('each live demo slide renders a command block and expected result', () => {
  assert.equal(demoSlides.length, 8);
  for (const slide of demoSlides) {
    const html = demoContent(slide);
    assert.match(html, /<pre><code\b/);
    assert.match(html, /Expected result/);
    assert.doesNotMatch(html, bannedOnScreen);
    assert.doesNotMatch(html, /<video\b|attach-video|Open local MP4/i);
  }
});

test('each live demo slide has presenter notes with an offline fallback', () => {
  for (const slide of demoSlides) {
    const notes = applyNoteFactOverrides(slide.id, '');
    assert.ok(notes.length > 500, `${slide.id} notes should include commands and cues`);
    assert.match(notes, /<pre><code\b/);
    assert.match(notes, /Offline fallback:/);
    assert.match(notes, /Timing:/);
    assert.match(notes, /Pre-staged:/);
    assert.match(notes, /Cut at \d{2}:\d{2} \(75%\):/);
    assert.match(notes, /Point at:/);
    assert.match(notes, /Expected:/);
  }
});

test('demo on-screen prompts are exact excerpts or visibly abridged', () => {
  for (const slide of demoSlides) {
    const [screenBlock] = codeBlocks(demoContent(slide));
    const noteBlocks = codeBlocks(applyNoteFactOverrides(slide.id, ''));
    const noteText = noteBlocks.join('\n\n');

    assert.ok(noteText.length > 0, `${slide.id} notes should embed the full command block`);
    if (screenBlock.includes(abridgedLabel)) {
      assert.ok(noteText.length > screenBlock.replace(abridgedLabel, '').trim().length,
        `${slide.id} abridged screen should have fuller notes`);
    } else {
      assert.ok(noteText.includes(screenBlock), `${slide.id} screen command should be verbatim in notes`);
    }
  }
});

test('each live demo slide states the live provenance boundary', () => {
  for (const slide of demoSlides) {
    const notes = applyNoteFactOverrides(slide.id, '');
    assert.match(notes, /Genuine Copilot CLI with Squad selected/);
    assert.match(notes, /real integrated terminal/);
    assert.match(notes, /external, off-screen tooling/);
    assert.match(notes, /Qualify code first/);
    assert.match(notes, /disclosed clean checkpoint/);
  }
  assert.match(applyNoteFactOverrides('demo-c0', ''), /C0 starts before Squad exists/);
});

test('demo timings and chapter IDs follow the run plan', () => {
  assert.deepEqual(demoSlides.map(slide => [slide.chapter, slide.duration]), [
    ['C0', 180],
    ['C1', 180],
    ['C2', 240],
    ['C3', 240],
    ['C4', 240],
    ['C5', 300],
    ['C6', 180],
    ['C7', 180]
  ]);
});
