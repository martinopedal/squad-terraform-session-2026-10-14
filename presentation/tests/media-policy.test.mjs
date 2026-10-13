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
  ...['aca-sandboxes', 'bootstrap', 'demo-runbook', 'feature-guide', 'online-demo', 'overview', 'playbook',
    'prompt-pack', 'repositories', 'run-plan', 'sandboxing', 'security-case', 'sessionize',
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

test('C4 source and generated notes retain the conditional selected-target gate and unchanged cut', () => {
  const notes = applyNoteFactOverrides('demo-c4', '');
  const generated = documentText('presentation/index.html')
    .match(/<section\b[^>]*id="demo-c4"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(generated, 'generated deck must contain the actual C4 section');
  for (const [name, artifact] of [['source notes', notes], ['generated C4', generated]]) {
    for (const pattern of [
      /independently approved selected-target IaC/, /effective-policy read-back/, /all checks PASS/,
      /actual authentication verified manually/, /prepared sandbox/,
      /Preliminary planning approval is not deployment or qualification/,
      /29:30-30:00/, /30:00-32:00/, /32:00-32:30/, /32:30-33:30/,
      /Cut at 32:30 \(75%\)/, /no second live attempt/,
      /Do not retry or spend 55:00-58:00 protected slack/,
      /Management-side execution evidence, not Corp validation/,
      /10 root negative-validation checks, not 52 child-module plus two caller cases/,
      /A 403 alone does not establish egress or Azure Policy enforcement/,
      /href="\.\.\/docs\/aca-sandboxes\.md#recommended-live-use"/,
      /href="\.\.\/docs\/demo-runbook\.md#c4-invoke-guidance-and-a-source--2930-3330--4-minutes"/
    ]) assert.match(artifact, pattern, `${name} retains ${pattern}`);
  }
  const c4 = demoSlides.find(slide => slide.chapter === 'C4');
  assert.equal(c4.time, '29:30-33:30');
  assert.equal(c4.duration, 240);
  assert.match(codeBlocks(demoContent(c4))[0], /\/skills info test-discipline/);
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
    assert.doesNotMatch(text, /Live-capable in Corp|current Corp proof/i);
    assert.match(text, /Corp, Norway East placement/, `${path} separates hosted Jobs placement`);
    assert.match(text, /fresh queue-driven readiness is not established/i,
      `${path} does not infer a fresh hosted run from placement`);
    assert.doesNotMatch(text,
      /current run evidence is under Management|current evidence is from Management|Norway East under Management/i,
      `${path} must not misplace current hosted Jobs under Management`);
  }
});

test('sandbox guides and presenter notes distinguish all four execution hosts and host credentials', () => {
  for (const [name, text] of [
    ['sandbox guide', documentText('docs/sandboxing.md')],
    ['ACA guide', documentText('docs/aca-sandboxes.md')],
    ['setup notes', applyNoteFactOverrides('s07-agent-setup', '')],
    ['C4 notes', applyNoteFactOverrides('demo-c4', '')],
    ['handoff appendix notes', applyNoteFactOverrides('a-handoffs', '')]
  ]) {
    for (const pattern of [
      /OS\/MXC/, /GitHub-managed Copilot cloud sandboxes/,
      /customer-managed ACA MicroVMs/i, /hosted Apps\/Jobs/,
      /not MicroVMs/, /coordination\/configuration/, /not a sandbox product/,
      /no sandbox verb/, /worktree\/tool filter does not isolate credentials/,
      /sign-in, storage.*egress/i, /never copy host authentication/i
    ]) assert.match(text, pattern, `${name} retains ${pattern}`);
    assert.doesNotMatch(text, /(?:^|\n|`|<code>)\s*(?:squad sandbox|\/squad sandbox)\b/i,
      `${name} must not offer an unsupported Squad sandbox command`);
  }
});

test('documented cloud preview is not claimed available in local 1.0.94 help', () => {
  for (const [name, text] of [
    ['sandbox guide', documentText('docs/sandboxing.md')],
    ['feature guide', documentText('docs/feature-guide.md')],
    ['setup notes', applyNoteFactOverrides('s07-agent-setup', '')]
  ]) {
    for (const pattern of [
      /1\.0\.94/, /does not expose|Neither.*(?:exposes|exposed)/, /--cloud/,
      /documented preview\/account-build gate/i, /interactive-only/,
      /never (?:with|combine it with)/i
    ]) assert.match(text, pattern, `${name} retains documented-versus-installed availability: ${pattern}`);
    const literalCommands = [
      ...codeBlocks(text),
      ...[...text.matchAll(/^```[^\n]*\n([\s\S]*?)^```[ \t]*$/gm)].map(match => match[1])
    ];
    for (const command of literalCommands) {
      assert.doesNotMatch(command, /copilot --cloud[^\n]*\s-(?:p|i)\b/,
        `${name} must not recommend cloud batch/initial-prompt mode`);
    }
  }
  const guide = documentText('docs/sandboxing.md');
  for (const pattern of [
    /off by default/, /Allow local network/, /honoring the proxy/,
    /best-effort/, /remote MCP servers are not sandboxed/,
    /offers `ca`, not `status`/, /paid usage includes stopped storage/,
    /not a hard active timeout or credential revocation/,
    /saved base autoSuspend interval was 600 seconds/
  ]) assert.match(guide, pattern);
  for (const text of [guide, documentText('docs/feature-guide.md'), applyNoteFactOverrides('s07-agent-setup', '')]) {
    for (const pattern of [
      /copilot help sandbox/, /one-session/, /--sandbox/, /backend\/session preflight/,
      /26300/, /OS metadata, not successful.*backend operation/
    ]) assert.match(text, pattern, `local flag is installed-help documentation, not backend proof: ${pattern}`);
  }
});

test('blocked Corp qualification and intended in-VM Squad variant stay explicitly unqualified', () => {
  for (const [name, text] of [
    ['ACA guide', documentText('docs/aca-sandboxes.md')],
    ['run plan', documentText('docs/run-plan.md')],
    ['C4 notes', applyNoteFactOverrides('demo-c4', '')],
    ['generated C4', documentText('presentation/index.html')
      .match(/<section\b[^>]*id="demo-c4"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '']
  ]) {
    for (const pattern of [
      /qualification blocked|blocked on an unexpected change-type check/i,
      /no apply performed/, /8\/11|8 present/, /Data Owner grants(?: were)? absent|Data Owner grants.*missing/,
      /403\/exit 1|403 with exit 1/,
      /no successful Corp sandbox creation\/runtime test/i,
      /full CLI\+Squad execution inside a MicroVM/,
      /host(?:ed| installs| installation)/i
    ]) assert.match(text, pattern, `${name} must not relabel host/partial deployment as MicroVM success: ${pattern}`);
    assert.doesNotMatch(text,
      /Corp (?:MicroVM|sandbox) (?:creation|runtime(?: test)?|acceptance|qualification) (?:passed|succeeded|qualified|validated)|full CLI\+Squad (?:ran|executed) inside (?:a |the )?(?:Corp )?MicroVM/i,
      `${name} must not add affirmative Corp runtime/full CLI claims`);
  }
  for (const [name, text] of [
    ['sandbox guide', documentText('docs/sandboxing.md')],
    ['ACA guide', documentText('docs/aca-sandboxes.md')],
    ['C4 notes', applyNoteFactOverrides('demo-c4', '')]
  ]) {
    assert.match(text, /intended in-MicroVM installation\/execution variant/,
      `${name} keeps the requested potential variant`);
    assert.match(text, /not a fifth product/);
    assert.match(text, /not currently executed or qualified/);
  }
});

test('hosted Jobs notes keep current placement separate from historical runs and runner readiness', () => {
  const texts = [
    ...['docs/run-plan.md', 'docs/talk-track.md', 'docs/talking-points.md', 'haflidi-overview.html']
      .map(path => [path, documentText(path)]),
    ['consumer notes', applyNoteFactOverrides('s20-consumer', '')]
  ];
  for (const [name, text] of texts) {
    for (const pattern of [
      /Corp, Norway East placement/, /historical Oct 9/, /56 seconds/,
      /Manual/, /7200-second/, /no registered target runners/i,
      /current target rights|invitation (?:is |remains )?pending|private invitation pending/i,
      /fresh queue-driven readiness is not established/i,
      /README-only/, /Manual runner execution ended terminal Failed/,
      /associated issue queue workflow remains queued/,
      /53:00-54:30/, /55:00-58:00/, /Management-side MicroVM/,
      /historical (?:variable-cost )?estimate/i, /not a current.*(?:bill|measured)/i
    ]) assert.match(text, pattern, `${name} retains hosted placement/runtime/cost scope: ${pattern}`);
    assert.doesNotMatch(text,
      /current run evidence is under Management|current evidence is from Management|Norway East under Management/i);
    assert.doesNotMatch(text, /caj-[a-z0-9-]+|\/subscriptions\/[0-9a-f-]{36}/i,
      `${name} must not publish raw private job/workflow identifiers`);
  }
});

test('live consumer provenance stays distinct from the unchanged copied teaching module', () => {
  for (const [name, text] of [
    ...['README.md', 'docs/source-provenance.md', 'docs/run-plan.md', 'handoff.md']
      .map(path => [path, documentText(path)]),
    ['baseline notes', applyNoteFactOverrides('s03-baseline', '')],
    ['consumer notes', applyNoteFactOverrides('s20-consumer', '')]
  ]) {
    for (const pattern of [
      /live demo consumer/i, /martinopedal\/aks-automatic-demo-env/,
      /martinopedal\/terraform-azapi-aks-automatic/, /v0\.6\.0/,
      /teaching module/, /alz-avm-tf-demo\/terraform-azapi-aks-automatic-corp/,
      /pin.*manifest|manifest.*pin/
    ]) assert.match(text, pattern, `${name} must retain consumer/source-copy roles`);
  }
  const readme = documentText('README.md');
  assert.ok(readme.indexOf('The live demo consumer') < readme.indexOf('b01256eb'),
    'README foregrounds the live consumer without replacing the teaching-copy pin');
  for (const value of ['b01256eb9b1ea6046b9bb8a403662f724a7b6fa7', '068e88ecc484ba4b4c4353653c1be7a99e8b5ab8']) {
    assert.ok(documentText('terraform/module-source.json').includes(value),
      `source-copy manifest retains ${value}`);
  }
});

test('readiness does not turn one laptop, historical checks or dated obligations into all green', () => {
  const text = documentText('docs/run-plan.md');
  for (const pattern of [
    /one laptop|one host/, /18\/18/, /46\/46/, /PowerShell 7 and 5\.1/,
    /B1 clean VM/, /B2 both presenter hosts/, /B3 full 60-minute rehearsal/,
    /B4 private target invitation/, /B5 current NIC listing/, /Unknown/,
    /Oct 13 warmup\/reset/, /Oct 17 teardown \/ Oct 31 expiry/,
    /Pool A1\/Dependabot/, /Released 0\.22\.5 on main\/Pages/i,
    /source-only correction/, /34\/34/, /not a new Azure plan or deployment/,
    /artifact suite 85\/85/, /runtime suite 31\/31/, /source\/tooling checks/,
    /no new sealed manifest\/raw exact deltas/i, /no new apply established/,
    /workflow 17\/17/, /checkout 10\/10/, /toolchain 12\/12/, /GitHub-script 10\/10/,
    /two Linux smokes skipped on Windows/,
    /both existing clusters independently read back through Azure MCP/i,
    /not TLS certificate validation or a fresh 29-check security suite/i
  ]) assert.match(text, pattern);
  assert.doesNotMatch(text, /all (?:infrastructure|sandboxes|readiness gates) (?:is |are )?(?:deployed|passed|green)/i);
});

test('repo map identifies canonical public sources and private target boundaries', () => {
  const map = documentText('docs/repositories.md');
  for (const repo of [
    'martinopedal/squad-terraform-session-2026-10-14',
    'martinopedal/aks-automatic-demo-env',
    'martinopedal/terraform-azapi-aks-automatic',
    'alz-avm-tf-demo/terraform-azapi-aks-automatic-corp',
    'haflidif/squad-on-aca'
  ]) assert.ok(map.includes(`https://github.com/${repo}`), `map links ${repo}`);
  for (const pattern of [
    /not the live environment deployment entry/,
    /independently reusable \*\*public\*\* Corp/i,
    /module-public/, /target, not the hosted service implementation/i,
    /Public docs alone cannot run/, /private deployment boundary/,
    /five-object deployment.*independently verified/i, /Leave Corp resources untouched/,
    /separate.*resource group/i, /Standard managed networking/i,
    /not a transplant of Corp BYO VNet\/UAMI\/FIC/,
    /public\s+source PR.*human review/is
  ]) assert.match(map, pattern);
});

test('current placement and corrected cluster scoring preserve working resources and evidence limits', () => {
  const nativeRows = documentText('docs/sandboxing.md').split(/\r?\n/)
    .filter(line => /^\| Customer-managed ACA MicroVMs via `aca` \|/.test(line));
  assert.equal(nativeRows.length, 1, 'execution-host table has one customer-managed native ACA row');
  const [nativeRow] = nativeRows;
  const nativeStatus = nativeRow.split('|')[3].trim();
  const assertNativePlacement = row => {
    const status = row.split('|')[3].trim();
    assert.match(status, /Existing Online placement is primary for eligible demos/i,
      'native ACA status keeps the primary placement decision');
    assert.match(status, /five-object deployment\/current operator access\/base probe independently verified/i,
      'bounded current native milestones are established, not proposed-only');
    assert.match(status, /Corrected host runtime PASS \/ independent acceptance complete/,
      'actual corrected runtime proof is independently accepted');
    assert.match(status, /native card runtime-ready after acceptance/,
      'runtime card readiness is conditional, not an acceptance bypass');
    assert.match(status, /stage GO pending manual preflight\/rehearsal/,
      'corrected runtime proof does not establish human stage readiness');
    assert.doesNotMatch(status, /proposed and unqualified|not deployed|integration PASS/i,
      'reject stale no-deployment and overclaimed successful-integration status');
    assert.doesNotMatch(status, /\bfallback\b/i,
      'native ACA status must not reclassify primary Online placement as fallback');
  };
  assertNativePlacement(nativeRow);
  for (const [name, wrongStatus] of [
    ['rejected row with nonadjacent Online/fallback', nativeStatus.replace(
      /Existing Online placement.*$/,
      'Existing Online placement is a proposed, unqualified fallback')],
    ['reordered fallback placement', nativeStatus.replace(
      'Existing Online placement is primary for eligible demos',
      'Fallback placement for eligible demos is Online')],
    ['contradictory fallback despite a primary claim', `${nativeStatus} Online placement is a fallback.`],
    ['stale proposed-only status', nativeStatus.replace(
      'five-object deployment/current operator access/base probe independently verified',
      'new separate native group/RG remains proposed and unqualified')],
    ['superseded failure kept as current verdict', nativeStatus.replace(
      'Corrected host runtime PASS / independent acceptance complete', 'Current host runtime FAILED')],
    ['wrong product reclassification', nativeStatus.replace(
      'native card runtime-ready after acceptance', 'hosted Apps/Jobs runtime-ready now')],
    ['unproved stage GO', nativeStatus.replace(
      'stage GO pending manual preflight/rehearsal', 'stage GO passed')]
  ]) {
    assert.notEqual(wrongStatus, nativeStatus, `${name} mutates the actual native ACA status`);
    assert.throws(() => assertNativePlacement(nativeRow.replace(nativeStatus, wrongStatus)),
      { code: 'ERR_ASSERTION' }, `${name} must be rejected by the same row assertions`);
  }
  for (const [name, text] of [
    ...['README.md', 'docs/source-provenance.md', 'docs/run-plan.md', 'docs/talk-track.md',
      'docs/talking-points.md', 'docs/sandboxing.md', 'haflidi-overview.html']
      .map(path => [path, documentText(path)]),
    ['released consumer notes', applyNoteFactOverrides('s20-consumer', '')],
    ['released C4 notes', applyNoteFactOverrides('demo-c4', '')]
  ]) {
    const prose = text.replace(/\s+/g, ' ');
    assert.match(prose, /primary (?:Online )?(?:eligible demo )?placement|Online is primary|Online.*primary/i, name);
    assert.doesNotMatch(prose, /Online (?:ACA )?fallback/i, name);
    if (name !== 'released C4 notes') {
      for (const pattern of [
        /26 PASS\s*\/\s*2 BLOCKED\s*\/\s*1 report-only/,
        /10 PASS\s*\/\s*1 FAIL/, /1 NOT_APPLICABLE/,
        /direct-pod/, /demo RG/, /not 11 cluster failures/,
        /full (?:cluster )?health.*unproved/i
      ]) assert.match(prose, pattern, `${name} retains ${pattern}`);
      assert.doesNotMatch(prose, /10 PASS\s*\/\s*2 FAIL/);
    }
  }
  for (const path of ['README.md', 'docs/source-provenance.md', 'docs/demo-runbook.md']) {
    assert.match(documentText(path), /visibility.*placement|placement.*visibility/is, path);
  }
  assert.match(documentText('README.md'), /Preserve existing working AKS, Corp and hosted Jobs/);
});

test('native coverage rejects wrong-target doctor and separates basic host orchestration from optional in-VM execution', () => {
  const guide = documentText('docs/aca-sandboxes.md');
  for (const pattern of [
    /https:\/\/sandboxes\.azure\.com\/docs\/sandboxes\/quickstart\/setup-cli/,
    /Host CLI version/, /Host token authentication/, /tokens only/,
    /WRONG TARGET|Wrong-target warning/, /9\/9.*exit 0/,
    /cached Management\/Norway East/, /Compare the printed/,
    /independently read back the exact resource ID/, /no config change/i,
    /Explicit Online target/, /Effective Data Owner/, /Targeted doctor/,
    /MicroVM create\/list\/get\/delete/, /Exec \//, /Filesystem \//,
    /Egress \//, /Suspend\/resume/, /Offline Terraform/,
    /Host Copilot CLI\/Squad remote orchestration/, /Optional in-VM Copilot/,
    /COMPLETED/, /BLOCKED/, /PENDING/,
    /need not themselves run inside the MicroVM/,
    /Online basic provisioning\/access\/runtime is verified/,
    /ACCEPTED ACA SANDBOXES ENGINEERING CONTRACT \/ RUNTIME READY/,
    /CRLF/,
    /actual guest\/CLI exit-23 propagation passed/,
    /stage GO.*manual preflight\/rehearsal/is
  ]) assert.match(guide, pattern, `coverage retains ${pattern}`);
  const c4 = applyNoteFactOverrides('demo-c4', '');
  for (const pattern of [
    /separate group\/RG/, /not inside AKS or hosted Jobs\/runner/,
    /WRONG TARGET/, /no apply performed/, /host.*orchestrat/i,
    /prompt.*tool.*trace/i, /not a four-minute promise/
  ]) assert.match(c4, pattern);
});

test('two product flows retain separate triggers, integration evidence, cuts and ownership', () => {
  const cards = documentText('docs/demo-runbook.md');
  for (const pattern of [
    /Two product demo flows: hosted Squad and native ACA Sandboxes/,
    /Card A: Haflidi hosted Squad on ACA Apps\/Jobs, issue to bot PR/,
    /Card B: native ACA Sandboxes/,
    /haflidif\/squad-on-aca/, /<approved-private-target>/,
    /selected Squad\/skill/, /validator\/reviewer handoff/,
    /standalone.*prerequisite tests/i, /not a four-minute promise/,
    /Hard cut 54:30/, /cut 32:30/, /No-GO|NO-GO/,
    /advanced optional/, /not mandatory for the basic/,
    /Cleanup/, /Login/, /Expected proof/
  ]) assert.match(cards, pattern, `operator cards retain ${pattern}`);
  for (const path of ['docs/run-plan.md', 'docs/talk-track.md', 'docs/talking-points.md', 'haflidi-overview.html']) {
    const text = documentText(path);
    for (const pattern of [
      /Card A|operator cards/i, /Card B|native ACA/i,
      /host.*(?:orchestrat|Copilot)/i, /in-MicroVM|inside.*MicroVM/,
      /registration/, /no.*current.*Haflidi-authored|no current Haflidi-authored/i,
      /fresh.*(?:cluster validation|full Online.*validation)/i,
      /no.*(?:renewed 29\/29|full TLS)/i
    ]) assert.match(text, pattern, `${path} retains ${pattern}`);
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

test('current public release fronts distinguish completed deck publication from local corrections', () => {
  const version = JSON.parse(readFileSync(new URL('../src/version.json', import.meta.url), 'utf8')).version;
  for (const path of [
    'README.md', 'handoff.md', 'PUBLICATION.md', 'presentation/README.md',
    'docs/run-plan.md', 'docs/source-provenance.md', 'docs/talk-track.md',
    'docs/talking-points.md', 'docs/feature-guide.md', 'docs/whats-new.md',
    'docs/demo-runbook.md'
  ]) {
    const text = documentText(path);
    assert.ok(text.includes(version), `${path} names the released deck version`);
    assert.match(text, /released.*main\/Pages|main\/Pages publication is complete/is, path);
    assert.match(text, /later.*(?:local|correction)|local.*(?:correction|change)/is, path);
    assert.doesNotMatch(text, /Live Pages remains 0\.22\.2|neither is\s+published|0\.22\.4.*not merged or released/i, path);
  }
});

const currentNativeStatusSurfaces = [
  ['docs/whats-new.md', '', '## Key updates'],
  ['docs/bootstrap.md', '', '## What this bootstrap does'],
  ['docs/clean-machine-demo.md', '', '## Automated dependency setup'],
  ['docs/talking-points.md', '### 03:30-04:00, s04-news, Martin', '### 04:00-05:00'],
  ['docs/run-plan.md', '## Separate product demo flows, not one combined runtime', '## Timing contract']
];

for (const [path, start, end] of currentNativeStatusSurfaces) {
  test(`current native status in ${path} rejects stale opening claims`, () => {
    const text = documentText(path);
    assert.ok(!start || text.includes(start), `${path} retains its current status section`);
    const section = start ? text.split(start)[1] : text;
    assert.ok(section.includes(end), `${path} retains the next section boundary`);
    const current = section.split(end)[0].replace(/\s+/g, ' ');
    for (const pattern of [
      /host Copilot\/Squad.*independently accepted/i,
      /26\.768-second/, /runtime-ready|runtime readiness/,
      /human (?:stage GO|preflight\/rehearsal)/i,
      /second-presenter sign-in/, /selected Terraform variant/,
      /remain separate gates/,
      /hosted Apps\/Jobs.*(?:E2E.*BLOCKED|BLOCKED.*E2E)/i,
      /owned fork\/target source is accepted/,
      /private publisher qualification/, /owner-native Terraform/,
      /actual README bot PR remain unproved/
    ]) assert.match(current, pattern, `${path} current prose retains ${pattern}`);
    assert.doesNotMatch(current,
      /Native ACA integration remains build work|(?:Online|native)[^.]*\b(?:proposed|unqualified)\b|No current integration readiness|runtime PASS awaits independent acceptance|(?:prompt\/tool\/validation\/)?handoff evidence still missing|independent acceptance pending|stage GO (?:passed|complete)|all ACA (?:products )?(?:are )?ready|BLOCKED on registration404|BLOCKED on runner registration|custom-agent-profile qualification/i,
      `${path} current prose must not contradict accepted fixture engineering or overclaim stage readiness`);
    if (path !== 'docs/run-plan.md') {
      for (const pattern of [
        /five-object deployment/, /current operator access/,
        /375-second/, /independently verified/
      ]) assert.match(current, pattern, `${path} opening preserves verified provisioning: ${pattern}`);
    } else {
      for (const pattern of [
        /actual coordinator prompt, worker\/ACA tools, guest results, validation and reviewer handoff evidence is independently accepted/,
        /LF\/source\+result SHA/, /three positive guest checks\/JSON/,
        /exact guest\/host exit23/,
        /causal HTTPS403 with new exact-sandbox networkEgress\.denied audit/,
        /exact-ID cleanup\/empty list\/NotFound/,
        /85 evidence files were independently rehashed/,
        /credential-free policy challenge alone used per-request curl --insecure/,
        /trusted TLS and inside-MicroVM agents\/OAuth remain unproved/
      ]) assert.match(current, pattern, `${path} accepted host evidence retains ${pattern}`);
      const timingCue = text.split(/\r?\n/).find(line => line.startsWith('- ACA Sandboxes is a conditional C4 variant'));
      assert.ok(timingCue, `${path} retains the conditional C4 timing cue`);
      assert.match(timingCue, /host-driven fixture engineering are independently accepted/);
      assert.doesNotMatch(timingCue, /successful-work integration\/rehearsal remains pending/);
    }
    if (path === 'docs/whats-new.md') {
      const relatedCues = text.split(/\r?\n/).filter(line =>
        line.startsWith('| 9 |') || line.startsWith("- Native ACA's official quickstart"));
      assert.equal(relatedCues.length, 2, `${path} retains both current native news cues`);
      for (const cue of relatedCues) {
        assert.match(cue, /fixture engineering (?:are|is) independently accepted/);
        assert.doesNotMatch(cue, /Online.*remains proposed|Neither is currently proved for Online/);
      }
    }
  });
}

test('source and exported speaker notes carry accepted Sandbox proof without qualifying hosted Jobs or human stage', () => {
  const generated = documentText('presentation/index.html');
  const assertNativeNotes = notes => {
    for (const pattern of [
      /ACA SANDBOXES/, /26\.768/, /three positive guest checks\/JSON\+SHA/,
      /actual guest and host exit23/, /networkEgress\.denied/,
      /85 evidence files/, /independently accepted/,
      /empty list\/NotFound/, /watchdog stop/,
      /per-request curl --insecure/, /not trusted-TLS readiness/,
      /not human stage GO/, /inside-guest agents\/OAuth/,
      /not inside AKS or hosted Jobs\/runner/,
      /Earlier CRLF failure is controlled learning history/
    ]) assert.match(notes, pattern);
    assert.doesNotMatch(notes, /Not deployed\/runtime-tested\/plan-approved|remains proposed\/unqualified|No current Online integration GO|Native ACA integration is remaining build/);
  };
  for (const id of ['demo-c4', 's07-agent-setup', 's20-consumer']) {
    const source = applyNoteFactOverrides(id, '');
    const emitted = generated.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    assert.ok(emitted, `actual emitted ${id} exists`);
    assertNativeNotes(source);
    assertNativeNotes(emitted);
    for (const [before, after] of [
      ['independently accepted', 'acceptance pending'],
      ['actual guest and host exit23', 'exit propagation untested'],
      ['networkEgress.denied', 'HTTP403 alone'],
      ['not human stage GO', 'human stage GO passed'],
      ['ACA SANDBOXES', 'all ACA products']
    ]) {
      assert.ok(emitted.includes(before), `${id} mutation targets emitted fact: ${before}`);
      assert.throws(() => assertNativeNotes(emitted.replaceAll(before, after)), { code: 'ERR_ASSERTION' });
    }
  }
  const hosted = applyNoteFactOverrides('s20-consumer', '');
  for (const pattern of [
    /SQUAD ON ACA APPS\/JOBS/, /qualification is BLOCKED/,
    /owned MIT fork.*source independently accepted\/normal merged/,
    /No new runner registration or AppAdmin/,
    /actual Docker\/DNS\/TLS qualification WAITING at existing human gate with zero executed steps/,
    /checker runtimeProven false/,
    /Original haflidif\/squad-on-aca implementation is user-confirmed/,
    /missing-agent\/error-only closed PR stubs are failure artifacts/,
    /native Sandbox success does not qualify this hosted chain/
  ]) assert.match(hosted, pattern);
  const news = applyNoteFactOverrides('s04-news', '');
  assert.match(news, /ACA SANDBOXES.*26\.768/s);
  assert.match(news, /SQUAD ON ACA APPS\/JOBS fresh E2E separately BLOCKED/);
});

test('product prompts require positive guest work, accountable handoff and original hosted ownership', () => {
  const text = documentText('docs/prompt-pack.md');
  const native = text.split('### Native host Squad isolated work')[1]?.split('### Original hosted Squad issue-to-PR work')[0];
  const hosted = text.split('### Original hosted Squad issue-to-PR work')[1]?.split('## What makes results repeatable')[0];
  assert.ok(native && hosted, 'two runnable public product recipes have distinct sections');
  const assertNativeRecipe = recipe => {
    for (const pattern of [
      /Copilot CLI\/Squad and the worker stay on the host/,
      /Invoke the aca-sandboxes skill/, /explicit subscription\/resource-group\/sandbox-group\/region/,
      /independent validator\/reviewer/, /UTF-8 LF/, /throw 'Shell fixture must use LF/,
      /positive work fails, stop/, /numeric guest exits.*host process exit/s,
      /Decode the.*fs JSON content wrapper/s,
      /No anonymous ingress/, /No.*sign in|Do not sign in/,
      /separately approved exact-ID cleanup/,
      /ACA SANDBOXES/,
      /three positive guest checks\/JSON\+SHA/,
      /actual exit23/,
      /one HTTPS403 with new exact-sandbox networkEgress\.denied causal audit/,
      /Independent acceptance complete; card runtime-ready after acceptance/,
      /Earlier CRLF shell failed positive work/,
      /not a global\s+ACA SANDBOXES outage/,
      /no retry/i
    ]) assert.match(recipe, pattern);
  };
  assertNativeRecipe(native);
  for (const [before, after] of [
    ['positive work fails, stop', 'positive work fails, continue'],
    ['three positive guest checks/JSON+SHA', 'three positive guest checks BLOCKED'],
    ['one HTTPS403 with new exact-sandbox networkEgress.denied causal audit', 'one HTTPS403 alone'],
    ['Independent acceptance complete; card runtime-ready after acceptance', 'Independent acceptance pending; card ready now'],
    ['Copilot CLI/Squad and the worker stay on the host', 'Copilot CLI/Squad and the worker run inside the MicroVM'],
    ['separately approved exact-ID cleanup', 'delete all groups']
  ]) {
    assert.ok(native.includes(before), `mutation changes actual native recipe: ${before}`);
    assert.throws(() => assertNativeRecipe(native.replace(before, after)), { code: 'ERR_ASSERTION' });
  }
  for (const pattern of [
    /haflidif\/squad-on-aca/, /<approved-private-target>/,
    /Original implementation is completed\/previously demonstrated/,
    /Owned fork\/target source accepted\/merged/,
    /Live E2E is BLOCKED on private publisher qualification/,
    /No new runner registration or AppAdmin/,
    /ACA APPS\/JOBS/,
    /Fresh current end-to-end qualification remains pending/i,
    /ACA SANDBOXES\s+success does not count as that proof/,
    /Change only README\.md/, /Do not merge or deploy/,
    /actual ACA Job.*bot PR\/diff/s, /Correlate the same issue/,
    /Never modify\/delete the original hosted service/
  ]) assert.match(hosted, pattern);
  assert.doesNotMatch(documentText('docs/repositories.md'), /martinopedal\/squad-on-aca-demo-target/);
});

test('reconciled release fronts name published0226 while frozen operator snapshots retain their source-stage boundary', () => {
  for (const path of [
    'README.md', 'PUBLICATION.md', 'handoff.md', 'haflidi-overview.html',
    'presentation/README.md', 'docs/run-plan.md', 'docs/source-provenance.md',
    'docs/talk-track.md', 'docs/talking-points.md', 'docs/feature-guide.md',
    'docs/whats-new.md', 'docs/demo-runbook.md'
  ]) {
    const text = documentText(path).replace(/\s+/g, ' ');
    if (['README.md', 'PUBLICATION.md', 'presentation/README.md'].includes(path)) {
      assertPublishedRelease(currentReleaseFront(path), path);
      continue;
    }
    assert.match(text, /(?:Released|released|live)[^.]{0,100}(?:\*\*)?0\.22\.5|0\.22\.5[^.]{0,80}(?:released|main\/Pages)/, path);
    assert.match(text, /(?:Local|local)[^.]{0,80}(?:\*\*)?0\.22\.6/, path);
    assert.match(text, /candidate|review.*publication|unpublished/, path);
    assert.doesNotMatch(text,
      /(?:Released|released) main\/Pages (?:stays|baseline is deck|baseline is) (?:\*\*)?0\.22\.4|live Pages remains (?:the previously released )?0\.22\.[24]|0\.22\.6 is released on main\/Pages/i, path);
  }
});

test('current hosted prose distinguishes accepted owned source from pending publisher and live proof', () => {
  for (const path of [
    'README.md', 'PUBLICATION.md', 'handoff.md', 'haflidi-overview.html',
    'presentation/README.md', 'docs/run-plan.md', 'docs/source-provenance.md',
    'docs/repositories.md', 'docs/sandboxing.md', 'docs/demo-runbook.md',
    'docs/prompt-pack.md', 'docs/talk-track.md', 'docs/talking-points.md',
    'docs/feature-guide.md', 'docs/whats-new.md', 'docs/overview.md',
    'docs/aca-sandboxes.md', 'docs/bootstrap.md', 'docs/clean-machine-demo.md'
  ]) {
    const text = documentText(path).replace(/\s+/g, ' ');
    assert.match(text, /owned.{0,120}(?:fork|source).{0,100}accepted/i, path);
    assert.match(text, /publisher.{0,80}(?:qualification|Docker)/i, path);
    assert.match(text, /owner-native Terraform/i, path);
    assert.match(text, /(?:actual|genuine).{0,40}(?:README|bot PR)|actual PR/i, path);
    assert.doesNotMatch(text, /(?:current|fresh).{0,70}(?:registration404|missing-agent-profile)|Hosted GO (?:passed|complete)|owned.{0,60}live E2E (?:proved|passed)/i, path);
  }
  for (const path of ['README.md', 'docs/source-provenance.md', 'docs/repositories.md']) {
    const text = documentText(path);
    for (const pattern of [
      /https:\/\/github\.com\/martinopedal\/squad-on-aca\/pull\/1/,
      /411bbf1810799bbfeea176e0c4123504a05430e8/,
      /623c1906c1b8cacd13ccd1890d3d77ad3241560/,
      /@haflidif/, /(?:MIT|license)/, /71 tests/,
      /(?:sole whole-body|sole whole-body infrastructure) writer|sole whole-body writer/,
      /standalone fork Bicep/i
    ]) assert.match(text, pattern, `${path} binds the owned source contract`);
  }
});

test('current VM prose retains fresh disk binding, human approval and uninstalled SYSTEM holds', () => {
  for (const path of [
    'README.md', 'handoff.md', 'haflidi-overview.html', 'presentation/README.md',
    'docs/run-plan.md', 'docs/source-provenance.md', 'docs/sandboxing.md',
    'docs/bootstrap.md', 'docs/clean-machine-demo.md', 'docs/demo-runbook.md',
    'docs/talk-track.md', 'docs/talking-points.md', 'docs/playbook.md', 'docs/security-case.md'
  ]) {
    const text = documentText(path).replace(/\s+/g, ' ');
    for (const pattern of [
      /deallocated/i, /(?:disk|attachment).{0,60}(?:differs|different|changed)|changed OS-disk attachment/i,
      /preserve both disks/i, /never swap back(?:\/recreate\/delete|, recreate or delete) either|No disk swap, recreation\/deletion/i,
      /(?:current|exact).{0,30}binding.{0,40}baseline.{0,50}(?:runnable )?SYSTEM context/i,
      /Haflidi\/Online/, /(?:not installed|no (?:machine )?installation|No installation)/i
    ]) assert.match(text, pattern, `${path} retains VM hold ${pattern}`);
    assert.doesNotMatch(text, /(?:current )?bootstrap is installed|VM upgrade (?:deployed|complete)|swap back to (?:the )?(?:old|previous) disk/i, path);
  }
  const bootstrap = documentText('docs/bootstrap.md').replace(/\s+/g, ' ');
  for (const pattern of [
    /system_payload_accepted/, /upgrade\.bootstrap\.system_accepted/,
    /not prior installation/, /harmless LocalSYSTEM transport/,
    /allows an absent prior receipt/, /fresh successful receipt after first install/
  ]) assert.match(bootstrap, pattern);
});

test('actual exported notes preserve source-only owned mode and VM hold boundaries', () => {
  const html = documentText('presentation/index.html');
  const assertOwnedNotes = notes => {
    for (const pattern of [
      /private scheduled poller/, /one approved issue/, /genuine Squad UID10001 worker/,
      /trusted README App-bot PR/, /No new runner registration or AppAdmin/,
      /source independently accepted\/normal merged/, /checker runtimeProven false/,
      /actual Docker\/DNS\/TLS qualification WAITING at existing human gate with zero executed steps/,
      /no image\/push\/digest/, /Owner-native Terraform is sole whole-body writer/,
      /not full source acceptance/, /actual README bot PR remain pending/,
      /Owner-native source preparation is under independent review/,
      /Executable delivery remains held/,
      /Plan\/apply\/destroy paths are currently unconditionally disabled/,
      /actual private-plan transport and executable integration are not provisioned/,
      /Old zero-step queued run remains untouched, not cancelled\/proof/,
      /original.*working and unchanged|Original.*working and unchanged/i
    ]) assert.match(notes, pattern);
    assert.doesNotMatch(notes, /E2E passed|runtimeProven true|new-target registration\/custom-agent|runner-registration404|AppAdmin approval required/);
  };
  const assertVmNotes = notes => {
    for (const pattern of [
      /REVIEW_REQUIRED/, /VM is deallocated/, /OS-disk attachment differs/,
      /Preserve both disks/, /never swap back\/recreate\/delete either/,
      /Refresh current binding\/baseline and runnable SYSTEM context/,
      /Bootstrap not installed/, /allows absent prior receipt/,
      /requires fresh successful receipt after first install/,
      /CPU\/RAM bottleneck and sustained causality unproved/
    ]) assert.match(notes, pattern);
  };
  for (const id of ['s20-consumer', 's07-agent-setup', 'demo-c0', 'a-bootstrap']) {
    const source = applyNoteFactOverrides(id, '');
    const emitted = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    assert.ok(emitted, `actual emitted ${id} exists`);
    assertVmNotes(source);
    assertVmNotes(emitted);
    if (id === 's20-consumer') {
      assertOwnedNotes(source);
      assertOwnedNotes(emitted);
      for (const [before, after] of [
        ['checker runtimeProven false', 'checker runtimeProven true'],
        ['actual README bot PR remain pending', 'actual README bot PR passed'],
        ['No new runner registration or AppAdmin', 'AppAdmin approval required'],
        ['Old zero-step queued run remains untouched, not cancelled/proof', 'Old queued run cancelled'],
        ['Owner-native Terraform is sole whole-body writer', 'Standalone fork Bicep is another whole-body writer']
      ]) {
        assert.ok(emitted.includes(before), `${id} mutation targets actual emitted fact`);
        assert.throws(() => assertOwnedNotes(emitted.replaceAll(before, after)), { code: 'ERR_ASSERTION' });
      }
    }
  }
});

test('owner delivery is code preparation under review and VM source already sequences start before CSE', () => {
  for (const path of [
    'README.md', 'handoff.md', 'docs/run-plan.md', 'docs/source-provenance.md',
    'docs/sandboxing.md', 'docs/repositories.md', 'docs/prompt-pack.md',
    'docs/demo-runbook.md', 'docs/talk-track.md', 'docs/talking-points.md',
    'haflidi-overview.html'
  ]) {
    const text = documentText(path).replace(/\s+/g, ' ');
    assert.match(text, /(?:source preparation.{0,50}under.{0,20}review|full (?:independent )?(?:source )?review pending)/i, path);
    assert.match(text, /plan\/apply\/destroy.{0,60}unconditionally disabled/i, path);
    assert.match(text, /signer.{0,100}(?:private-plan transport|private plan transport)/i, path);
    assert.match(text, /executable (?:delivery.{0,20}remains held|integration.{0,35}not provisioned)/i, path);
    assert.doesNotMatch(text, /owner-native.{0,50}(?:source fully accepted|delivery working|deployment complete)/i, path);
  }
  for (const text of [
    documentText('docs/bootstrap.md').replace(/\s+/g, ' '),
    documentText('docs/run-plan.md').replace(/\s+/g, ' '),
    applyNoteFactOverrides('demo-c0', ''),
    applyNoteFactOverrides('s20-consumer', '')
  ]) {
    assert.match(text, /creation-semantic precondition is (?:now |currently )?met/);
    assert.match(text, /IaC deallocate -> VM update -> disk update -> start -> CSE/);
    assert.match(text, /no missing[- ]start implementation or imperative power workaround/i);
  }
});

test('both current source tables reject stale no-apply and unproved integration GO', () => {
  const assertNativeTable = row => {
    for (const pattern of [
      /Primary Online/, /five-object|five exact bindings/i,
      /current operator access/, /base probe verified/i,
      /cleanup empty/,
      /corrected host runtime PASS \/ independent acceptance complete/i,
      /stage GO pending/
    ]) assert.match(row, pattern);
    assert.doesNotMatch(row, /no apply|not deployed|not runtime-tested|source repair in progress|integration PASS|stage GO passed/i);
  };
  for (const path of ['README.md', 'docs/source-provenance.md']) {
    const row = documentText(path).split(/\r?\n/)
      .find(line => line.startsWith('| Native ACA SandboxGroup MicroVMs |'));
    assert.ok(row, `${path} has the real native component row`);
    assertNativeTable(row);
    for (const mutation of [
      `${row} no apply performed`,
      `${row} integration PASS`,
      row.replace(/base probe verified/i, 'base probe proposed'),
      row.replace('cleanup empty', 'cleanup unverified')
    ]) {
      assert.notEqual(mutation, row, `${path} mutation changes the actual row`);
      assert.throws(() => assertNativeTable(mutation), { code: 'ERR_ASSERTION' });
    }
  }
});

const hostedFlowSurfaces = [
  ['README.md', '| Hosted issues / queue / bot PRs |', 5],
  ['docs/source-provenance.md', '| Hosted issue/queue/bot-PR target |', 5],
  ['docs/run-plan.md', '| A, hosted Squad ACA Jobs |', 3]
];
const hostedFlowStages = [
  /^One approved(?: README)? issue$/i,
  /^private scheduled poller$/,
  /^existing queue$/,
  /^genuine Squad UID10001 worker$/,
  /^trusted (?:README )?App-bot PR(?:\/diff)?$/
];
const hostedFlowColumn = (text, prefix, column) => {
  const rows = text.split(/\r?\n/).filter(line => line.startsWith(prefix));
  assert.equal(rows.length, 1, `${prefix} identifies one actual hosted row`);
  const cell = rows[0].split('|')[column]?.trim();
  assert.ok(cell, `${prefix} contains its flow column`);
  return cell.split('. ')[0];
};
const assertHostedFlow = (text, prefix, column) => {
  const stages = hostedFlowColumn(text, prefix, column).split(' -> ');
  assert.equal(stages.length, hostedFlowStages.length, 'hosted flow has exactly five stages');
  stages.forEach((stage, index) =>
    assert.match(stage, hostedFlowStages[index], `hosted stage ${index + 1} is in causal order`));
};

for (const [path, prefix, column] of hostedFlowSurfaces) {
  test(`actual hosted flow in ${path} orders issue, poller, queue, worker and App-bot PR`, () => {
    assertHostedFlow(documentText(path), prefix, column);
  });

  test(`actual hosted flow in ${path} rejects reversed stages even beside a correct chain`, () => {
    const text = documentText(path);
    assertHostedFlow(text, prefix, column);
    const flow = hostedFlowColumn(text, prefix, column);
    const stages = flow.split(' -> ');
    for (let index = 0; index < stages.length - 1; index++) {
      const reversed = [...stages];
      [reversed[index], reversed[index + 1]] = [reversed[index + 1], reversed[index]];
      const mutation = text.replace(flow, reversed.join(' -> '));
      assert.notEqual(mutation, text, `${path} changes the actual flow at stage ${index + 1}`);
      assert.throws(() => assertHostedFlow(mutation, prefix, column), { code: 'ERR_ASSERTION' });
      if (index === 1) {
        const decoy = mutation.replace(prefix, `${prefix} ${flow}; `);
        assert.throws(() => assertHostedFlow(decoy, prefix, column), { code: 'ERR_ASSERTION' });
      }
    }
  });
}

const currentReleaseFront = path => {
  const text = documentText(path);
  if (path === 'README.md') return text.split('## What this repository contains')[0];
  if (path === 'PUBLICATION.md') return text.split('Owned hosted fork/target/publisher source')[0];
  return text.split('Source qualification may finish before delivery.')[1]
    ?.split('The live demo consumer is')[0];
};
const assertPublishedRelease = (text, name) => {
  assert.ok(text, `${name} contains its current release surface`);
  const current = text.replaceAll('*', '').replace(/\s+/g, ' ');
  assert.match(current, /(?:released|published)(?: main\/Pages)?(?: full\/short)?(?: deck| release)? 0\.22\.6/i, name);
  assert.match(current, /main\/Pages/i, name);
  assert.doesNotMatch(current,
    /local (?:candidate )?(?:deck )?0\.22\.6|0\.22\.6 (?:is )?(?:an? )?(?:unpublished|not (?:a )?published|candidate)|(?:released|live)(?: main\/Pages)?(?: baseline)?(?: (?:is|stays|remains))?(?: deck)? 0\.22\.[245]|live Pages remains (?:the previously released )?0\.22\.[245]/i,
    `${name} must not label the published version as a current candidate or keep the old live baseline`);
};

test('actual current release fronts and the entry table reject stale publication state beside valid release text', () => {
  const surfaces = ['README.md', 'PUBLICATION.md', 'presentation/README.md']
    .map(path => [path, currentReleaseFront(path)]);
  const row = documentText('README.md').split(/\r?\n/)
    .find(line => line.startsWith('| Session docs, deck, skills/native profiles |'));
  surfaces.push(['README.md session deployment status', row?.split('|')[6]]);
  for (const [name, current] of surfaces) {
    assertPublishedRelease(current, name);
    for (const mutation of [
      current.replaceAll('0.22.6', '0.22.5'),
      `${current} Local deck 0.22.6 unpublished candidate.`,
      `${current} Released main/Pages stays 0.22.4.`,
      `${current} Live Pages remains the previously released 0.22.2.`
    ]) {
      assert.notEqual(mutation, current, `${name} mutation changes the actual current surface`);
      assert.throws(() => assertPublishedRelease(mutation, name), { code: 'ERR_ASSERTION' });
    }
  }
});

test('actual source and emitted presenter notes call the published version released without clearing runtime gates', () => {
  const html = documentText('presentation/index.html');
  for (const id of ['s04-news', 's07-agent-setup']) {
    const emitted = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    const notes = emitted?.match(/<aside class="notes">([\s\S]*?)<\/aside>/)?.[1];
    for (const [kind, current] of [['source', applyNoteFactOverrides(id, '')], ['emitted', notes]]) {
      const name = `${kind} ${id}`;
      assertPublishedRelease(current, name);
      assert.match(current, /SQUAD ON ACA APPS\/JOBS fresh E2E separately BLOCKED/, name);
      assert.match(current, /human stage GO|Human stage\/rehearsal/, name);
      for (const mutation of [
        current.replaceAll('0.22.6', '0.22.5'),
        `${current}<p>Local deck 0.22.6 unpublished candidate.</p>`
      ]) assert.throws(() => assertPublishedRelease(mutation, name), { code: 'ERR_ASSERTION' });
    }
  }
});

test('actual version status and both generated headers separate published0226 from dated source-freeze history', () => {
  const version = JSON.parse(readFileSync(new URL('../src/version.json', import.meta.url), 'utf8'));
  assert.equal(version.version, '0.22.6');
  const full = documentText('presentation/index.html');
  const short = documentText('presentation/short/index.html');
  for (const [name, current] of [
    ['version status', version.status],
    ['full generated header', full.match(/<!-- Document version: ([^\n]+)/)?.[1]],
    ['short generated header', short.match(/<!-- Document version: ([^\n]+)/)?.[1]]
  ]) {
    assertPublishedRelease(current, name);
    assert.match(current, /2026-10-13/, name);
    for (const mutation of [
      current.replaceAll('0.22.6', '0.22.5'),
      `${current} Local deck 0.22.6 unpublished candidate.`
    ]) assert.throws(() => assertPublishedRelease(mutation, name), { code: 'ERR_ASSERTION' });
  }
  const freeze = version.changes.find(change => change.startsWith('0.22.6 - '));
  assert.match(freeze, /2026-10-13 pre-publication source freeze:/);
  assert.match(freeze, /candidate/);
  assert.match(freeze, /Released main\/Pages remains0\.22\.5 until exact review/);
  assert.match(full, /Source-build history below records dated source freezes, not current publication status\./);
  assert.ok(full.includes(freeze), 'actual full export retains the explicitly frozen historical entry');
});
