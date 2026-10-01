import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveMediaEntry } from '../scripts/media-policy.mjs';
import { demoContent, slides } from '../src/slides.mjs';

const pending = {
  file: 'media/C1.mp4', reviewed: false, takeId: null, sourceSurface: null, selectedAgent: null
};
const approved = {
  ...pending, reviewed: true, takeId: 'reviewed-take-01', sourceSurface: 'native-copilot-cli', selectedAgent: 'squad'
};

test('missing unrecorded chapters stay pending', () => {
  assert.equal(resolveMediaEntry('C1', pending, false).available, false);
});
test('unreviewed files never attach automatically', () => {
  const entry = resolveMediaEntry('C1', pending, true);
  assert.equal(entry.available, false);
  assert.equal(entry.present, true);
  const html = demoContent(slides.find(slide => slide.chapter === 'C1'), { C1: entry });
  assert.doesNotMatch(html, /<video[^>]*\bsrc=/);
  assert.match(html, /Recording not attached yet/);
});
test('reviewed native CLI footage may attach', () => {
  assert.equal(resolveMediaEntry('C1', approved, true).available, true);
});
test('reviewed real integrated-terminal footage may attach', () => {
  assert.equal(resolveMediaEntry('C1', { ...approved, sourceSurface: 'integrated-terminal' }, true).available, true);
});
test('custom viewer surfaces are rejected regardless of review flag', () => {
  for (const reviewed of [false, true]) {
    assert.throws(() => resolveMediaEntry('C1', { ...approved, reviewed, sourceSurface: 'artifact-viewer' }, true),
      /only genuine Copilot CLI/);
  }
});
test('a reviewed clip requires the selected Squad agent', () => {
  assert.throws(() => resolveMediaEntry('C1', { ...approved, selectedAgent: 'other-agent' }, true), /show Squad selected/);
  assert.throws(() => resolveMediaEntry('C1', { ...approved, selectedAgent: null }, true), /attested native source/);
});
test('a reviewed clip requires an attested source surface', () => {
  assert.throws(() => resolveMediaEntry('C1', { ...approved, sourceSurface: null }, true), /attested native source/);
});
test('a reviewed clip requires a file and nonempty take ID', () => {
  assert.throws(() => resolveMediaEntry('C1', approved, false), /local file and take ID/);
  assert.throws(() => resolveMediaEntry('C1', { ...approved, takeId: ' ' }, true), /local file and take ID/);
});
test('only the expected local chapter path is allowed', () => {
  assert.throws(() => resolveMediaEntry('C1', { ...approved, file: '../C1.mp4' }, true), /Unexpected local media path/);
});
test('review approval cannot be a truthy string', () => {
  assert.throws(() => resolveMediaEntry('C1', { ...approved, reviewed: 'false' }, true), /must be a boolean/);
});
