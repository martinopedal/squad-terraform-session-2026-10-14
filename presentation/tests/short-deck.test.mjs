import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createShortSlides, shortTitle } from '../src/short-slides.mjs';

const shortSlides = createShortSlides({
  martinPhoto: 'data:image/jpeg;base64,martin',
  haflidiPhoto: 'data:image/jpeg;base64,haflidi',
  martinQr: 'data:image/svg+xml;base64,martinqr',
  haflidiQr: 'data:image/svg+xml;base64,haflidiqr'
});
const htmlPath = new URL('../short/index.html', import.meta.url);
const manifestPath = new URL('../short/build-manifest.json', import.meta.url);

test('short deck defines six focused slides', () => {
  assert.equal(shortSlides.length, 6);
  assert.deepEqual(shortSlides.map(slide => slide.id), [
    'short-nic26-title',
    'short-who-we-are',
    'short-what-we-show',
    'short-snippets',
    'short-takeaways',
    'short-thank-you'
  ]);
});

test('first short slide is the NIC26 title slide with only the logo and session name', () => {
  const first = shortSlides[0];
  const sessionName = 'No More Spec-ulation: AI Agent Teams Building Production-Grade IaC';
  assert.equal(first.id, 'short-nic26-title');
  assert.equal(first.title, sessionName);
  assert.equal(first.content, '<div class="short-title-logo" role="img" aria-label="NIC26 logo"></div>');
  assert.doesNotMatch(first.content, /<a\b|<img\b|Martin|Haflidi|TODO/);
  assert.doesNotMatch(first.notes, /TODO/);
  assert.equal(first.sources.length, 0);
  assert.doesNotMatch(JSON.stringify(first), /\u2014/);
  assert.equal(shortSlides[1].id, 'short-who-we-are');
  const html = readFileSync(htmlPath, 'utf8');
  assert.ok(html.indexOf('id="short-nic26-title"') < html.indexOf('id="short-who-we-are"'));
  assert.match(html, /--nic-logo-large-ink:url\("data:image\/png;base64,/);
  assert.match(html, /<h2 id="short-nic26-title-title">No More Spec-ulation: AI Agent Teams Building Production-Grade IaC<\/h2>/);
});

test('short deck build artifacts exist', () => {
  assert.ok(existsSync(htmlPath), 'short/index.html should exist after build');
  assert.ok(existsSync(manifestPath), 'short/build-manifest.json should exist after build');
});

test('short deck build includes metadata, photos, and key links', () => {
  const html = readFileSync(htmlPath, 'utf8');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  assert.equal(manifest.variant, 'short');
  assert.equal(manifest.slideCount, 6);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.ok(manifest.htmlBytes > 0);
  assert.match(html, new RegExp(`<title>${shortTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`));
  assert.equal((html.match(/<section id="short-/g) || []).length, 6);
  assert.match(html, /data:image\/jpeg;base64,/);
  assert.match(html, /Martin Opedal/);
  assert.match(html, /Haflidi Fridthjofsson/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/martin-opedal/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/haflidif/);
  assert.match(html, /https:\/\/azureviking\.com/);
  assert.match(html, /https:\/\/github\.com\/haflidif/);
  assert.match(html, /https:\/\/github\.com\/martinopedal/);
  assert.match(html, /docs\/sandboxing\.md/);
});

test('last short slide is the closing slide with feedback, LinkedIn QR codes, and public links', () => {
  const closing = shortSlides.at(-1);
  assert.equal(closing.id, 'short-thank-you');
  assert.match(closing.title, /Thank you/);
  assert.match(closing.content, /evaluate this session in the NIC Event App/);
  assert.match(closing.content, /QR code on the back of your badge/);
  assert.doesNotMatch(closing.content, /Feedback QR code placeholder/);
  assert.doesNotMatch(closing.content, /QR placeholder|placeholder/);
  assert.doesNotMatch(closing.notes, /TODO/);
  assert.match(closing.notes, /two QR codes/);
  assert.match(closing.notes, /evaluate this session in the NIC Event App/);
  const qrImages = [...closing.content.matchAll(/<img class="short-qr" src="([^"]+)" alt="([^"]+)"/g)].map(m => [m[1], m[2]]);
  assert.deepEqual(qrImages, [
    ['data:image/svg+xml;base64,martinqr', 'Martin Opedal LinkedIn QR code'],
    ['data:image/svg+xml;base64,haflidiqr', 'Haflidi Fridthjofsson LinkedIn QR code']
  ]);
  const cards = closing.content.split('<div class="short-close-card"').slice(1);
  assert.equal(cards.length, 3);
  assert.doesNotMatch(cards[0], /<img/);
  for (const [i, [photo, name]] of [['data:image/jpeg;base64,martin', 'Martin Opedal'], ['data:image/jpeg;base64,haflidi', 'Haflidi Fridthjofsson']].entries()) {
    const card = cards[i + 1];
    assert.ok(card.includes(`<img class="short-close-photo" src="${photo}" alt="${name}"`), `${name} photo`);
    assert.ok(card.includes(`alt="${name} LinkedIn QR code"`), `${name} QR in same card`);
  }
  for (const url of [
    'https://github.com/martinopedal/squad-terraform-session-2026-10-14',
    'https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/',
    'https://github.com/martinopedal/terraform-azapi-aks-automatic',
    'https://www.linkedin.com/in/martin-opedal',
    'https://www.linkedin.com/in/haflidif'
  ]) assert.ok(closing.content.includes(url), url);
  assert.doesNotMatch(JSON.stringify(closing), /\u2014/);
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
  assert.equal(docLinks.length, 7, 'protect every short-deck documentation link');
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
