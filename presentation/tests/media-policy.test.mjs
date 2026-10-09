import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyNoteFactOverrides, demoContent, slides } from '../src/slides.mjs';
import { createShortSlides } from '../src/short-slides.mjs';

const demoSlides = slides.filter(slide => slide.kind === 'demo');
const bannedOnScreen = /recording slot|not attached|pending/i;
const abridgedLabel = '(abridged; full prompt in notes)';
const decodeHTML = value => value
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&amp;', '&');
const codeBlocks = html => [...html.matchAll(/<pre><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/g)]
  .map(match => decodeHTML(match[1]).trim());
const bannedStylePatterns = [
  [/^Takeaway:\s/m, 'Takeaway label'],
  [/\b(?:Frank verdict|Honesty rule)\b/i, 'verdict or honesty label'],
  [/\b(?:reuse the code, not the environment|ownership beats more agents|artifact, reason, and check belong together|more agents cannot vote a contract into correctness)\b/i, 'banned slogan phrase'],
  [/\b(?:runtime evidence, not hope|the honest answer:)\b/i, 'banned verdict phrase'],
  [/[—–]/, 'dash punctuation'],
  [/(?:^-\s+\*\*[^*]+\.\*\*|<li>\s*<strong>[^<]+\.\s*<\/strong>)/mi, 'bold-lead bullet']
];
const slideSurfaces = slide => [
  ['title', slide.title],
  ['content', slide.content ?? ''],
  ['raw-notes', slide.notes ?? ''],
  ['presenter-notes', applyNoteFactOverrides(slide.id, '')]
];
const shortSlides = createShortSlides({ martinPhoto: 'martin', haflidiPhoto: 'haflidi' });
const documentPaths = [
  'README.md', 'handoff.md', 'haflidi-overview.html', 'presentation/README.md',
  ...['bootstrap', 'demo-runbook', 'feature-guide', 'online-demo', 'playbook',
    'prompt-pack', 'run-plan', 'sandboxing', 'security-case', 'sessionize',
    'source-provenance', 'talk-track', 'talking-points', 'whats-new']
    .map(name => `docs/${name}.md`)
];
const documentText = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

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

test('protected recovery block exists outside scripted content minutes', () => {
  const timedSlides = slides.filter(slide => !slide.preshow && !slide.id.startsWith('a-'));
  const toSeconds = value => value.split(':').reduce((sum, part) => sum * 60 + Number(part), 0);
  const bufferSlide = timedSlides.find(slide => slide.id === 'buffer-recovery');

  assert.ok(bufferSlide, 'buffer-recovery slide should exist');
  assert.equal(bufferSlide.time, '55:00-58:00');

  const scriptedSeconds = timedSlides
    .filter(slide => slide.id !== 'buffer-recovery' && slide.id !== 's22-questions')
    .reduce((sum, slide) => {
      const [start, end] = slide.time.split('-').map(toSeconds);
      return sum + (end - start);
    }, 0);

  assert.equal(scriptedSeconds, 55 * 60);
});

test('slide titles, on-screen copy, and speaker notes avoid banned writing patterns', () => {
  for (const slide of [...slides, ...shortSlides]) {
    for (const [surfaceName, text] of slideSurfaces(slide)) {
      for (const [pattern, label] of bannedStylePatterns) {
        assert.doesNotMatch(
          text,
          pattern,
          `${slide.id} ${surfaceName} contains ${label}`
        );
      }
    }
  }
});

test('public writing surfaces avoid banned patterns outside literal command examples', () => {
  for (const path of documentPaths) {
    const prose = documentText(path).replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*$/gm, '');
    for (const [pattern, label] of bannedStylePatterns) {
      assert.equal(pattern.test(prose), false, `${path} contains ${label}`);
    }
  }
});

test('writing preserves manual bootstrap, human confirmation, and the ACA evidence boundary', () => {
  const bootstrap = documentText('docs/bootstrap.md');
  for (const id of ['GitHub.CopilotApp', 'bradygaster.Squad', 'Microsoft.VisualStudioCode', 'GitHub.Copilot']) {
    assert.ok(bootstrap.includes(id), `bootstrap retains ${id}`);
  }
  assert.match(bootstrap, /manually/);
  assert.match(bootstrap, /mocked command execution do not prove installer success/);
  assert.match(bootstrap, /manual device-code login/);
  assert.match(bootstrap, /separate evidence gate/);
  const shortFlow = shortSlides.find(slide => slide.id === 'short-what-we-show');
  for (const product of ['Copilot desktop app', 'Squad', 'VS Code', 'Copilot CLI']) {
    assert.ok(shortFlow.content.includes(product), `short deck retains ${product}`);
  }
  assert.match(shortFlow.notes, /human confirms before team files are written/);
  assert.match(slides.find(slide => slide.id === 's07-agent-setup').content,
    /human confirms before team files are written/);
  for (const path of ['docs/run-plan.md', 'docs/talk-track.md', 'docs/talking-points.md', 'haflidi-overview.html']) {
    const text = documentText(path);
    assert.match(text, /Management/, `${path} must scope the ACA evidence`);
    assert.match(text, /Corp validation remains a separate gate|Corp gate remains open/,
      `${path} must keep the Corp gate`);
    assert.doesNotMatch(text, /Live-capable in Corp|current Corp proof|jobs in a corp landing zone/i);
  }
});

test('news dates, billing caveats, public checkout examples, and current versions stay qualified', () => {
  const news = slides.find(slide => slide.id === 's04-news');
  assert.match(news.content, /2026-06-02 \/ 2026-09-14 · Documentation/);
  assert.match(applyNoteFactOverrides(news.id, ''), /guide updated 2026-07-17/);
  assert.doesNotMatch(news.content, /2026-08-11/);
  for (const url of [
    'https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/overview',
    'https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/how-to/github-copilot-cloud-agent',
    'https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/'
  ]) assert.ok(news.sources.some(source => source.url === url), `news retains ${url}`);
  assert.match(news.content, /2026-09-04 · Research Preview/);
  assert.match(news.content, /Offline benchmark, estimated cost vs Opus 5/);
  assert.match(news.content, /2026-07-01 · Announced/);
  assert.match(news.content, /honors admin model policies/);
  assert.match(news.content, /Paid plans get a 10% discount/);
  assert.match(applyNoteFactOverrides(news.id, ''), /premium-request billing until expiry/);
  assert.match(documentText('docs/whats-new.md'), /2026-04-01 \| `\/fleet`/);
  const genericStart = String.raw`cd C:\git\session-repo`;
  for (const path of ['docs/demo-runbook.md', 'docs/playbook.md', 'docs/run-plan.md']) {
    assert.ok(documentText(path).includes(genericStart), `${path} uses a public checkout example`);
  }
  assert.ok(applyNoteFactOverrides('demo-c3', '').includes(genericStart));
  const version = JSON.parse(readFileSync(new URL('../src/version.json', import.meta.url), 'utf8')).version;
  for (const path of ['docs/run-plan.md', 'docs/feature-guide.md', 'docs/source-provenance.md',
    'docs/whats-new.md', 'presentation/README.md']) {
    assert.ok(documentText(path).toLowerCase().includes(`deck ${version}`), `${path} matches the current deck`);
  }
  assert.ok(documentText('handoff.md').includes(`presentation version **${version}**`));
});
