import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
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

test('every emitted short-deck local link resolves from its actual nested URL', () => {
  const html = readFileSync(htmlPath, 'utf8');
  const renderedSlides = html.slice(html.indexOf('<main class="reveal"'), html.indexOf('</main>'));
  const localLinks = [...renderedSlides.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)]
    .map(match => match[1]).filter(href => !/^(?:https?:|#)/.test(href));
  const docLinks = localLinks.filter(href => href.includes('/docs/'));
  assert.equal(docLinks.length, 9, 'protect every short-deck documentation link');
  for (const href of localLinks) {
    assert.ok(existsSync(new URL(href, htmlPath)), `${href} must resolve from presentation/short/index.html`);
  }
});

test('short-deck manifest matches the generated HTML and source version', () => {
  const bytes = readFileSync(htmlPath);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const version = JSON.parse(readFileSync(new URL('../src/version.json', import.meta.url), 'utf8'));
  assert.equal(manifest.version, version.version);
  assert.equal(manifest.htmlBytes, bytes.length);
  assert.equal(manifest.htmlSHA256, createHash('sha256').update(bytes).digest('hex'));
});
