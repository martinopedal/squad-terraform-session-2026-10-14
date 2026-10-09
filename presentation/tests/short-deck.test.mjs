import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createShortSlides, shortTitle } from '../src/short-slides.mjs';

const shortSlides = createShortSlides({
  martinPhoto: 'data:image/jpeg;base64,martin',
  haflidiPhoto: 'data:image/jpeg;base64,haflidi'
});
const htmlPath = new URL('../short/index.html', import.meta.url);
const manifestPath = new URL('../short/build-manifest.json', import.meta.url);

test('short deck defines five focused slides', () => {
  assert.equal(shortSlides.length, 5);
  assert.deepEqual(shortSlides.map(slide => slide.id), [
    'short-who-we-are',
    'short-what-we-show',
    'short-snippets',
    'short-takeaways',
    'short-links'
  ]);
});

test('short deck build artifacts exist', () => {
  assert.ok(existsSync(htmlPath), 'short/index.html should exist after build');
  assert.ok(existsSync(manifestPath), 'short/build-manifest.json should exist after build');
});

test('short deck build includes metadata, photos, and key links', () => {
  const html = readFileSync(htmlPath, 'utf8');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  assert.equal(manifest.variant, 'short');
  assert.equal(manifest.slideCount, 5);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.ok(manifest.htmlBytes > 0);
  assert.match(html, new RegExp(`<title>${shortTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`));
  assert.equal((html.match(/<section id="short-/g) || []).length, 5);
  assert.match(html, /data:image\/jpeg;base64,/);
  assert.match(html, /Martin Opedal/);
  assert.match(html, /Haflidi Fridthjofsson/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/martin-opedal/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/haflidif/);
  assert.match(html, /https:\/\/azureviking\.com/);
  assert.match(html, /https:\/\/github\.com\/haflidif/);
  assert.match(html, /https:\/\/github\.com\/martinopedal/);
  assert.match(html, /docs\/bootstrap\.md/);
  assert.match(html, /docs\/sandboxing\.md/);
});

test('short deck build carries the gate map and B1v2 prompt excerpt', () => {
  const html = readFileSync(htmlPath, 'utf8');

  assert.match(html, /terraform-coder/);
  assert.match(html, /PR → checks\/scans/);
  assert.match(html, /alternate_network_payload/);
  assert.match(html, /DNS service IP 10\.241\.0\.10/);
});
