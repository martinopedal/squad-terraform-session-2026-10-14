import test from 'node:test';
import assert from 'node:assert/strict';
import { applyNoteFactOverrides, demoContent, slides } from '../src/slides.mjs';

const demoSlides = slides.filter(slide => slide.kind === 'demo');
const bannedOnScreen = /recording slot|not attached|pending/i;

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
    assert.match(notes, /Point at:/);
    assert.match(notes, /Expected:/);
  }
});

test('demo timings and chapter IDs remain unchanged', () => {
  assert.deepEqual(demoSlides.map(slide => [slide.chapter, slide.duration]), [
    ['C1', 180],
    ['C0', 180],
    ['C2', 240],
    ['C3', 240],
    ['C4', 240],
    ['C5', 300],
    ['C6', 180],
    ['C7', 180]
  ]);
});
