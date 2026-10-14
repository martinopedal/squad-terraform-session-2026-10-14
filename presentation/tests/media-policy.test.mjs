import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { marked } from 'marked';
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
    'source-provenance', 'talk-track', 'short-talk-track', 'talking-points', 'whats-new']
    .map(name => `docs/${name}.md`)
];
const documentText = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

function assertShortTrackC6Recording(text) {
  const cue = text.split('## C6 -')[1]?.split('\n## ')[0] ?? '';
  const canonicalCue = documentText('docs/prompt-pack.md').split('### C6 -')[1]?.split('\n### ')[0] ?? '';
  const prompt = canonicalCue.match(/```text\r?\n([\s\S]*?)\r?\n```/)?.[1];
  assert.ok(prompt?.startsWith('Scribe: record the public-only decision'), 'canonical C6 recording prompt exists');
  const typeIndex = cue.indexOf('`/agent squad`');
  const recordIndex = cue.indexOf('Scribe: record the public-only decision', typeIndex);
  const newIndex = cue.search(/\r?\n\/new\r?\n/);
  const resumeIndex = cue.indexOf('/resume guided-clean-run');
  const readIndex = cue.indexOf('Read the saved decision; cite its file and the constraints for the next change.');
  assert.ok(typeIndex >= 0 && recordIndex > typeIndex, 'C6 carries the bounded public-only recording prompt');
  assert.ok(newIndex > recordIndex && resumeIndex > newIndex && readIndex > resumeIndex,
    'C6 records the decision before starting a new session, resuming and reading it');
}

test('short monitor C6 records the public decision before resume and citation', () => {
  assertShortTrackC6Recording(documentText('docs/short-talk-track.md'));
});

test('short monitor C6 rejects an empty or late recording prompt', () => {
  const text = documentText('docs/short-talk-track.md');
  const recordingBlock = text.match(/Scribe: record the public-only decision[\s\S]*?evidence\r?\nlimits\. No private targets, histories, credentials or full conversations\./)[0];
  const readPrompt = 'Read the saved decision; cite its file and the constraints for the next change.';
  for (const [name, mutant] of [
    ['empty TYPE prompt', text.replace(recordingBlock, '``')],
    ['recording after resume/read', text.replace(recordingBlock, '').replace(readPrompt, `${readPrompt}\n${recordingBlock}`)]
  ]) {
    assert.notEqual(mutant, text, `${name} must change the actual short track`);
    assert.throws(() => assertShortTrackC6Recording(mutant), { name: 'AssertionError' }, name);
  }
});

function assertShortTrackLocalPaths(text) {
  const section = heading => text.split(`## ${heading}`)[1]?.split('\n## ')[0] ?? '';
  for (const folder of ['public', 'demo-env', 'module-public', 'aca-sandboxes']) {
    assert.ok(section('Workstation').includes(`\`${folder}\``), `${folder} has a labeled preparation root`);
  }
  assert.match(section('Workstation'), /C:\\git\\squad-terraform-session-2026-10-14/);
  assert.match(section('Workstation'), /not VM stage commands/);
  assert.match(text, /canonical Corp[\s\S]*module \(read-only\)/);
  assert.match(text, /session checkpoint, \*\*not a native consumer/);
  assert.match(text, /Native consumer source: `demo-env\\deployments\\aca-sandboxes-online`/);
  assert.match(section('Prepare'), /Host Squad: prepare off-stage/);
  assert.match(section('Prepare'), /using git worktree add \(not Set-Location\)/);
  assert.match(section('Prepare'), /no unverified VM-path claim/);
  assert.match(section('Prepare'), /offline\/providers[\s\S]*terraform\.tfrc/);
  assert.ok(section('Essentials').includes(String.raw`Set-Location 'C:\demo\session-repo'`));
  assert.ok(section('Technical evidence').includes(String.raw`C:\demo\aks-automatic-demo-env\deployments\online\main.tf`));
  assert.doesNotMatch(text, /Set-Location 'C:\\git\\/);
  assert.match(section('C0'), /New `C:\\demo\\aks-module` clone/);
  assert.match(section('C1'), /preparation verified both roots at the same checkpoint/);
  assert.match(section('C2'), /after guided preparation passes/);
  assert.match(section('Squad on ACA'), /C:\\demo\\operator-targets\.json/);
  assert.match(section('Squad on ACA'), /hosted\.issueUrl[\s\S]*hosted\.workflowUrl[\s\S]*hosted\.workerUrl/);
  assert.match(section('Native'), /native\.sandboxId/);
  for (let chapter = 0; chapter < 8; chapter++) {
    const cue = section(`C${chapter}`);
    assert.match(cue, /\*\*(?:Shell|TUI)/, `C${chapter} names its surface`);
    assert.match(cue, /\*\*STOP:/, `C${chapter} has a stop cue`);
  }
  for (const chapter of ['C5', 'C7']) {
    assert.match(section(chapter), /whole|complete/);
    assert.match(section(chapter), /prompt-pack\.md#/);
  }
}

test('short monitor track distinguishes verified local roots from clean and unresolved checkpoints', () => {
  assertShortTrackLocalPaths(documentText('docs/short-talk-track.md'));
});

test('short monitor local-path contract rejects fake roots and unqualified checkpoints', () => {
  const text = documentText('docs/short-talk-track.md');
  const publicLocation = String.raw`Set-Location 'C:\demo\session-repo'`;
  const mutations = [
    ['workstation used on stage', text.replace(publicLocation, String.raw`Set-Location 'C:\git\squad-terraform-session-2026-10-14\public'`)],
    ['no path producer', text.replace('using git worktree add (not Set-Location)', 'use Set-Location only')],
    ['silent A/B checkpoint', text.replace('preparation verified both roots at the same checkpoint', 'use any roots')],
    ['no native binding stop', text.replaceAll('native.sandboxId', 'native.staleSandboxId')],
    ['wrong actual consumer entry', text.replace('C:\\demo\\aks-automatic-demo-env\\deployments\\online\\main.tf', 'C:\\demo\\session-repo\\main.tf')],
    ['checkpoint mislabeled consumer', text.replace('session checkpoint, **not a native consumer', 'live consumer')],
    ['missing stop cue', text.replace('**STOP:** unqualified clean host', '**NEXT:** unqualified clean host')],
    ['C0 clone omitted', text.replace('New `C:\\demo\\aks-module` clone', 'Existing caller checkout')]
  ];
  for (const [name, mutant] of mutations) {
    assert.notEqual(mutant, text, `${name} must change the actual short track`);
    assert.throws(() => assertShortTrackLocalPaths(mutant), { name: 'AssertionError' }, name);
  }
});

const fixtureHash = '75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5';
function assertPromptFirstTrack(text) {
  assert.doesNotMatch(text, /prepare-demo-checkpoints\.ps1/);
  assert.doesNotMatch(text.match(/^## Native ACA.*$/m)?.[0] ?? '', /\b(?:Martin|Haflidi)\b/);
  const rendered = marked(text);
  for (const heading of ['Squad on ACA (hosted Apps/Jobs)', 'Native ACA Sandboxes'])
    assert.ok(rendered.includes(`<h2>${heading}`), `${heading} is rendered H2`);
  const section = name => text.split(`## ${name}`)[1]?.split('\n## ')[0] ?? '';
  const hosted = section('Squad on ACA (hosted');
  const native = section('Native ACA');
  const extras = text.split('## Optional extras - only after the complete core flow')[1] ?? '';
  assert.ok(extras, 'optional cards exist');
  assert.ok(extras.trim().split('\n').length <= 150, 'both optional cards stay concise');
  assert.ok(extras.split(/\s+/).filter(Boolean).length <= 2200, 'both optional cards stay under 2200 words');
  assert.ok(text.indexOf('<a id="hosted-demo">') > text.indexOf('<a id="native-demo">'), 'Squad on ACA follows native');
  assert.equal(text.trimEnd().split('\n## ').length - 1, text.split('\n## ').findLastIndex(s => s.startsWith('Squad on ACA (hosted')), 'hosted is the final H2');
  const recommended = documentText('docs/aca-sandboxes.md').split('## Recommended live use')[1]?.split('\n## ')[0] ?? '';
  assert.ok(recommended.length > 0 && native.split(/\s+/).filter(Boolean).length <= 1100,
    'native card stays within its word budget');
  const prepare = native.split('Off-stage prepare prompt')[1]?.split('On-stage host Squad prompt')[0] ?? '';
  const run = native.split('On-stage host Squad prompt')[1] ?? '';
  assert.match(text, /C:\\demo\\operator-targets\.json/);
  assert.match(text, /Never commit or display it/);
  assert.doesNotMatch(`${hosted}\n${native}`, /\$targetRepo|\$demoIssue|\$sandboxId|\$nativeTarget/);
  for (const field of ['hosted.go', 'hosted.repo', 'hosted.issue', 'hosted.issueUrl',
    'hosted.workflowUrl', 'hosted.workerUrl']) assert.ok(hosted.includes(field), `private hosted binding: ${field}`);
  assert.doesNotMatch(hosted, /hosted\.pollerUrl/);
  assert.match(hosted, /hosted\.go=true/);
  assert.match(hosted, /Reread\/rebind on every shell\/tool call/);
  assert.ok((hosted.match(/\*\*STOP:/g) ?? []).length >= 1);
  assert.match(hosted, /README-only request/);
  assert.match(hosted, /squad:ripley` once/);
  assert.match(hosted, /message ID \+ issue \+ repository \+ agent/);
  assert.match(hosted, /actual ACA Job\/worker/);
  assert.match(hosted, /status-only run is not enqueue proof/);
  assert.match(hosted, /do not merge\/deploy/);
  assert.ok((native.match(/\*\*STOP:/g) ?? []).length >= 1);
  assert.match(prepare, /native\.prepareOneGuest=true/);
  assert.match(prepare, /native\.sandboxId/);
  assert.match(prepare, /1000m CPU, 2048Mi, Deny\/Full egress, no ports\/credentials\. If help cannot express/);
  assert.match(prepare, /aca sandbox lifecycle set --auto-suspend enable --idle-timeout-seconds 300/);
  assert.ok(prepare.indexOf('save it as native.sandboxId') < prepare.indexOf('lifecycle set'));
  assert.doesNotMatch(prepare.split('lifecycle set')[0], /auto-suspend/);
  assert.match(prepare, /delete exactly that ID/);
  assert.match(prepare, /--subscription, --resource-group, --region and command-specific --group/);
  assert.match(prepare, /not diagnostic --sandbox-group/);
  assert.match(prepare, /aca sandbox create --help/);
  assert.match(prepare, /run exactly one `aca sandbox create`/);
  assert.match(prepare, /Capture its UUID even if `-o json` prints text/);
  assert.match(prepare, /never create again to fix parsing/);
  assert.match(prepare, /aca sandbox fs write/);
  assert.ok(prepare.includes(fixtureHash), 'preparation prompt binds canonical source');
  assert.match(run, /native\.go=true/);
  assert.match(run, /native\.sandboxId/);
  assert.match(run, /--subscription, --resource-group, --region and command-specific --group/);
  assert.match(run, /native-squad-validation-v1/);
  assert.match(run, /https:\/\/example\.com\//);
  assert.match(run, /current timestamped audit before cleanup/);
  assert.match(run, /HTTP 403 alone, immediate empty audit or post-delete 404 is not proof/);
  assert.match(run, /\/agent terraform-validator.*\/new.*\/agent terraform-reviewer/);
  assert.match(native, /no guest URL or preview exists/);
  assert.match(native, /https:\/\/containerapps\.azure\.com\/sandbox-groups/);
  assert.match(native, /https:\/\/management\.swedencentral\.azuredevcompute\.io/);
  assert.match(native, /No issue\/queue/);
  const plan = section('C2');
  for (const pattern of [/native `\/plan`/, /displayed \*\*Plan\*\*/, /Revise only/,
    /I approve repository code only/, /\*\*Shift\+Tab\*\*/, /\*\*Interactive\*\*/,
    /\*\*before\*\* coder\/commands/, /CLI1\.0\.95/, /launcher\/help1\.0\.96/,
    /52\/52 source hashes unchanged/, /untested manual checks/]) assert.match(plan, pattern);
  for (const path of ['docs/short-talk-track.md', 'docs/talk-track.md']) {
    const source = path.endsWith('short-talk-track.md') ? text : documentText(path);
    for (const pattern of [/aks-automatic-demo-env\/blob\/main\/deployments\/online\/main\.tf/,
      /enable_private_cluster=false/, /api_server_authorized_ip_ranges/, /dependency/, /copied Corp/])
      assert.match(source, pattern, path);
  }
  for (const link of text.matchAll(/\]\(((?!https?:)[^)]+\.md)(#[^)]+)?\)/g)) {
    const target = documentText(`docs/${link[1]}`);
    if (!link[2] || target.includes(`<a id="${link[2].slice(1)}"`)) continue;
    const slug = value => value.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replaceAll(' ', '-');
    assert.ok([...target.matchAll(/^#{1,6} (.+)$/gm)].some(match => slug(match[1]) === link[2].slice(1)),
      `published source anchor resolves: ${link[0]}`);
  }
}
test('prompt-first ownerless track renders two exact flows, Plan sequence and actual consumer entry', () => {
  assertPromptFirstTrack(documentText('docs/short-talk-track.md'));
});
test('concise optional cards reject missing gates, stale guest IDs and lost queue correlation', () => {
  const text = documentText('docs/short-talk-track.md');
  for (const [name, before, after] of [
    ['missing native heading', '## Native ACA Sandboxes', 'Native ACA Sandboxes'],
    ['missing hosted GO', 'hosted.go', 'hosted.notReady'],
    ['missing native GO', 'native.go=true', 'native.stageReady=false'],
    ['stale guest ID', 'native.sandboxId', 'native.staleSandboxId'],
    ['lost queue correlation', 'message ID + issue + repository + agent', 'timestamp only'],
    ['duplicate issue routing', 'squad:ripley` once', 'squad:ripley` twice'],
    ['missing ACA worker', 'actual ACA Job/worker', 'manual status only'],
    ['guest issue queue', 'No issue/queue', 'enqueue an issue in the guest'],
    ['missing independent reviewer', 'then `/new` + `/agent terraform-reviewer`', 'then `/new` + `/agent terraform-validator`'],
    ['Plan mode not exited', '**Shift+Tab**', '`/exit`'],
    ['Plan exit after implementation', '**before** coder/commands', 'after coder/commands'],
    ['wrong consumer claim', 'enable_private_cluster=false', 'enable_private_cluster=true'],
    ['unverified manual checks', 'untested manual checks', 'UI proved'],
    ['wrong native heading ownership', 'Native ACA Sandboxes - optional', 'Native ACA Sandboxes - Martin optional']
  ]) {
    assert.ok(text.includes(before));
    const mutant = before === 'native.sandboxId' ? text.replaceAll(before, after) : text.replace(before, after);
    assert.throws(() => assertPromptFirstTrack(mutant), { name: 'AssertionError' }, name);
  }
});
function assertNativeFixture(bytes) {
  assert.equal(bytes.length, 684, 'accepted public fixture byte count');
  assert.ok(!bytes.includes(13), 'shell fixture must remain LF');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fixtureHash);
}

test('published native fixture is exactly the accepted nonsecret LF source, not a replacement helper', () => {
  const bytes = readFileSync(new URL('../../docs/fixtures/native-validation.sh', import.meta.url));
  assertNativeFixture(bytes);
  for (const mutant of [
    Buffer.from(bytes.toString().replaceAll('\n', '\r\n')),
    Buffer.from(bytes.toString().replace('17+25', '17+24')),
    Buffer.from(bytes.toString().replace('/root/native-result.json', '/root/other.json'))
  ]) assert.throws(() => assertNativeFixture(mutant), { code: 'ERR_ASSERTION' });
});

function assertRunningRecipes(text) {
  const hosted = text.split('### Card A:')[1]?.split('### Card B:')[0] ?? '';
  const native = text.split('### Card B:')[1]?.split('### Native procedure reference')[0] ?? '';
  for (const section of [hosted, native]) {
    assert.match(section, /Running it, short recipe/);
    assert.match(section, /1\. \*\*/);
    assert.match(section, /4\. \*\*/);
    assert.match(section, /SHOW/);
    assert.match(section, /EXPECT/);
    assert.match(section, /STOP/);
  }
  assert.match(hosted, /existing approved issue/);
  assert.match(hosted, /--add-label squad:ripley/);
  assert.match(hosted, /Squad Issue Queue[\s\S]*issues: labeled/);
  assert.match(hosted, /squad-work-queue/);
  assert.match(hosted, /Container App Jobs[\s\S]*Executions/);
  assert.match(hosted, /--head "squad\/ripley\/issue-\$demoIssue"/);
  assert.doesNotMatch(hosted, /gh issue create|gh workflow run\s+--|az containerapp job start\s+--/);
  assert.ok(native.includes(fixtureHash), 'running native card binds canonical source');
  assert.match(native, /Read-Host 'Operator-approved current prepared sandbox ID'/);
  assert.match(native, /aca sandbox get --id \$sandboxId/);
  assert.match(native, /aca sandbox exec --id \$sandboxId -c 'sh \/root\/native-validation\.sh'/);
  assert.match(native, /aca sandbox fs cat --id \$sandboxId --path '\/root\/native-result\.json'/);
  assert.match(native, /\$negativeExit -ne 23/);
  assert.match(native, /Decode filesystem response `\.content`/);
  assert.match(native, /networkEgress\.denied/);
  assert.match(native, /\$beforeEvents -notcontains/);
  assert.match(native, /\$stamp -ge \$probeStart -and \$stamp -le \$auditEnd/);
  assert.match(native, /curlExit=0[\s\S]*exec exit `0`/);
  assert.doesNotMatch(native, /--sandbox-group|8a6c3e9a-1723-459d-b5e6-179a35553a9b/);
}

test('actual running cards reject duplicate hosted triggers and wrong native result/denial contracts', () => {
  const text = documentText('docs/demo-runbook.md');
  assertRunningRecipes(text);
  for (const [before, after] of [
    ['--add-label squad:ripley', '--add-label squad:unknown'],
    ['squad-work-queue', 'status-workflow'],
    ['aca sandbox get --id $sandboxId', 'aca sandbox list'],
    ['sh /root/native-validation.sh', 'sh /root/invented-helper.sh'],
    ['$negativeExit -ne 23', '$negativeExit -ne 0'],
    ['Decode filesystem response `.content`', 'Hash the raw transport envelope'],
    ['$beforeEvents -notcontains', '$beforeEvents -contains'],
    ['$stamp -ge $probeStart -and $stamp -le $auditEnd', '$true'],
    ['curlExit=0', 'curlExit=23']
  ]) {
    const mutant = text.replaceAll(before, after);
    assert.notEqual(mutant, text, `mutant changes real running procedure: ${before}`);
    assert.throws(() => assertRunningRecipes(mutant), { code: 'ERR_ASSERTION' });
  }
});

test('actual native causal PowerShell accepts precise fresh denied JSON and rejects false positives', {
  skip: process.platform !== 'win32' ? 'PowerShell 7 presenter contract is Windows-specific' : false
}, () => {
  const mock = String.raw`
$ErrorActionPreference = 'Stop'
$text = Get-Content docs\demo-runbook.md -Raw
$blocks = [regex]::Matches($text, '(?ms)` + '```powershell\\r?\\n(.*?)\\r?\\n```' + String.raw`')
$block = ($blocks | Where-Object { $_.Groups[1].Value.Contains('$denyCommand =') }).Groups[1].Value
if (-not $block) { throw 'Actual causal block missing.' }
function Read-Host { 'mock-prepared-id' }
function Start-Sleep {}
function aca {
  $global:LASTEXITCODE = 0
  if ($args[1] -eq 'fs') {
    if ($args -contains '/root/native-egress-result.json') {
      $exit = if ($script:scenario -eq 'curl-failure') { 60 } else { 0 }
      @{content=(@{curlExit=$exit;host='example.com';url='https://example.com/'} | ConvertTo-Json -Compress)} | ConvertTo-Json -Compress
    } else {
      $http = if ($script:scenario -eq 'wrong-http') { 200 } else { 403 }
      @{content="CURL_HTTP_CODE=$http` + '`n' + String.raw`x-deny-reason: example.com:HEAD"} | ConvertTo-Json -Compress
    }
    return
  }
  if ($args[1] -ne 'egress') {
    if ($script:scenario -eq 'read-failure' -and $args[1] -eq 'get') { $global:LASTEXITCODE = 1 }
    '{"mock":true}'
    return
  }
  $script:auditReads++
  $stamp = [DateTimeOffset]::UtcNow
  if ($script:scenario -eq 'old-event') { $stamp = $stamp.AddHours(-1) }
  $hostName = if ($script:scenario -eq 'wrong-host') { 'wrong.example' } else { 'example.com' }
  $event = @{host=$hostName;method='HEAD';scheme='https';path='/';timestamp=$stamp.ToString('o')}
  $denied = @()
  if ($script:auditReads -gt 1 -and $script:scenario -notin @('empty','allowed-only')) { $denied = @($event) }
  @{networkEgress=@{denied=$denied;allowed=@($event)}} | ConvertTo-Json -Depth 8 -Compress
}
foreach ($script:scenario in @('new-denied','old-event','wrong-host','empty','allowed-only','read-failure','curl-failure','wrong-http')) {
  $script:auditReads = 0
  $passed = $true
  try { $null = & ([scriptblock]::Create($block)) } catch { $passed = $false }
  if ($passed -ne ($script:scenario -eq 'new-denied')) { throw "Wrong actual causal-block outcome: $script:scenario" }
}
'Eight actual-block mock cases passed; no ACA/Azure executable invoked.'
`;
  const result = spawnSync('pwsh', ['-NoProfile', '-NonInteractive', '-Command', mock], {
    cwd: new URL('../../', import.meta.url), encoding: 'utf8', timeout: 30_000
  });
  assert.equal(result.status, 0, `${result.error ?? ''}\n${result.stderr}\n${result.stdout}`);
  assert.match(result.stdout, /Eight actual-block mock cases passed/);
});

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

test('C4 stays base only and the final appendix retains selected-target gates', () => {
  const notes = applyNoteFactOverrides('demo-c4', '');
  const generated = documentText('presentation/index.html')
    .match(/<section\b[^>]*id="demo-c4"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(generated, 'generated deck must contain the actual C4 section');
  for (const [name, artifact] of [['source notes', notes], ['generated C4', generated]]) {
    for (const pattern of [
      /base skill\/MCP/, /final optional appendix/, /Cut at 32:30 \(75%\)/,
      /no second live attempt/, /55:00-58:00 protected slack/
    ]) assert.match(artifact, pattern, `${name} retains ${pattern}`);
    assert.doesNotMatch(artifact, /aca sandbox exec|Conditional ACA SANDBOXES variant|one bounded ACA prompt/);
  }
  const tail = applyNoteFactOverrides('a-use-cases', '');
  const emittedTail = documentText('presentation/index.html')
    .match(/<section\b[^>]*id="a-use-cases"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  for (const [name, artifact] of [['final source notes', tail], ['generated final appendix', emittedTail]]) {
    for (const pattern of [
      /independently approved selected-target IaC/, /effective-policy read-back/, /all checks PASS/,
      /actual authentication verified manually/, /prepared sandbox/,
      /Preliminary planning approval is not deployment or qualification/,
      /after C0-C7, technical explanation and core wrap/, /cut before 55:00/,
      /no second live attempt/,
      /Do not retry or spend 55:00-58:00 protected slack/,
      /Management-side execution evidence, not Corp validation/,
      /10 root negative-validation checks, not 52 child-module plus two caller cases/,
      /A 403 alone does not establish egress or Azure Policy enforcement/,
      /href="\.\.\/docs\/aca-sandboxes\.md#recommended-live-use"/,
      /href="\.\.\/docs\/demo-runbook\.md#native-procedure-reference---final-optional-tail-never-c4"/
    ]) assert.match(artifact, pattern, `${name} retains ${pattern}`);
    assert.doesNotMatch(artifact, /href="[^"]*#c4-invoke-guidance/);
  }
  const c4 = demoSlides.find(slide => slide.chapter === 'C4');
  assert.equal(c4.time, '29:30-33:30');
  assert.equal(c4.duration, 240);
  assert.match(codeBlocks(demoContent(c4))[0], /\/skills info test-discipline/);
});

test('active C4 operator schedule and native references cannot reintroduce a cloud substitution', () => {
  const plan = documentText('docs/run-plan.md');
  const scheduleRow = plan.split(/\r?\n/).find(line => line.startsWith('| `demo-c4` |'));
  const assertSchedule = row => {
    assert.ok(row, 'actual active C4 schedule row exists');
    assert.match(row, /Base skill \+ read-only source lookup \+ permissions only; cut at 32:30/);
    assert.doesNotMatch(row, /or independently qualified|selected-target ACA substitution/i);
  };
  assertSchedule(scheduleRow);
  const revertedRow = scheduleRow.replace('permissions only; cut at 32:30',
    'permissions, or independently qualified selected-target ACA substitution; cut at 32:30 either way');
  assert.notEqual(revertedRow, scheduleRow);
  assert.throws(() => assertSchedule(revertedRow), { code: 'ERR_ASSERTION' });

  const guide = documentText('docs/aca-sandboxes.md').split('## Recommended live use')[1]
    ?.split('## Fallback if capacity')[0];
  const assertFinalTail = text => {
    for (const pattern of [
      /Keep C4 base-only/, /Only after complete core wrap and a genuine early finish/,
      /hosted Apps\/Jobs, then native Sandboxes/, /independently approved selected-target IaC/,
      /Do not compress core content/, /Cut before \*\*55:00\*\*/,
      /never use \*\*55:00-58:00\*\* protected recovery or \*\*58:00-60:00\*\* close/,
      /not an allocated live slot/
    ]) assert.match(text, pattern);
    assert.doesNotMatch(text, /select the C4 variant|replaces part of the deeper MCP lookup|\| 29:30-30:00 \|/);
  };
  assertFinalTail(guide);
  const revertedGuide = guide.replace('Keep C4 base-only', 'The operator may select the C4 variant');
  assert.notEqual(revertedGuide, guide);
  assert.throws(() => assertFinalTail(revertedGuide), { code: 'ERR_ASSERTION' });

  const anchor = 'demo-runbook.md#native-procedure-reference---final-optional-tail-never-c4';
  assert.ok(documentText('docs/demo-runbook.md')
    .includes('### Native procedure reference - final optional tail, never C4'));
  const assertNativeLink = text => {
    assert.ok(text.includes(anchor), 'native references point to the actual final procedure');
    assert.doesNotMatch(text, /demo-runbook\.md#c4-invoke-guidance/);
  };
  for (const path of ['docs/aca-sandboxes.md', 'docs/talk-track.md', 'docs/talking-points.md']) {
    const text = documentText(path);
    assertNativeLink(text);
    const wrongLink = text.replace(anchor, 'demo-runbook.md#c4-invoke-guidance-and-a-source--2930-3330--4-minutes');
    assert.notEqual(wrongLink, text);
    assert.throws(() => assertNativeLink(wrongLink), { code: 'ERR_ASSERTION' });
  }
});

test('locally actionable Online runtime cues date historical full checks and qualify current evidence', () => {
  const planCue = documentText('docs/run-plan.md').split(/\r?\n/)
    .find(line => line.startsWith('| 1:00-2:10 | 51:00-52:10 |'));
  const appendixCue = documentText('docs/talking-points.md').split(/\r?\n/)
    .find(line => line.startsWith('- Runtime evidence:'));
  const assertCue = cue => {
    assert.ok(cue, 'actual stage runtime cue exists');
    for (const pattern of [
      /historical 2026-10-08[:,]?\s*29\/29/i,
      /Current recorded 2026-10-12: 26 PASS \/ 2 BLOCKED \/ 1 report-only under TLS bypass/,
      /no fresh suite, trusted TLS or full cluster health established/
    ]) assert.match(cue, pattern);
  };
  for (const cue of [planCue, appendixCue]) {
    assertCue(cue);
    for (const [before, after] of [
      [/historical 2026-10-08[:,]?\s*/i, ''],
      ['26 PASS / 2 BLOCKED / 1 report-only under TLS bypass', '29/29 PASS'],
      ['no fresh suite, trusted TLS or full cluster health established', 'fresh full health established']
    ]) {
      const reverted = cue.replace(before, after);
      assert.notEqual(reverted, cue);
      assert.throws(() => assertCue(reverted), { code: 'ERR_ASSERTION' });
    }
  }
});

test('every preserved PowerShell placeholder template has a local resolve-before-paste label', () => {
  const playbook = documentText('docs/playbook.md');
  const templateBlocks = text => [...text.matchAll(/^```powershell\r?\n([\s\S]*?)^```[ \t]*$/gm)]
    .filter(match => /<[^>\r\n]+>/.test(match[1]));
  const assertLabels = text => {
    const blocks = templateBlocks(text);
    assert.ok(blocks.length > 0, 'actual legacy templates remain in the playbook');
    for (const match of blocks) {
      const label = text.slice(0, match.index).trimEnd().split(/\r?\n\s*\r?\n/).at(-1);
      assert.match(label, /Legacy command template, resolve before paste:/);
      assert.match(label, /not runnable as written/);
      for (const token of new Set([...match[1].matchAll(/<[^>\r\n]+>/g)].map(item => item[0]))) {
        assert.ok(label.includes(token), `adjacent label explains ${token}`);
      }
    }
  };
  assertLabels(playbook);
  for (const match of templateBlocks(playbook)) {
    const label = playbook.slice(0, match.index).trimEnd().split(/\r?\n\s*\r?\n/).at(-1);
    const missingLabel = playbook.replace(label, 'Copy and paste the template.');
    assert.notEqual(missingLabel, playbook);
    assert.deepEqual(templateBlocks(missingLabel).map(item => item[0]),
      templateBlocks(playbook).map(item => item[0]), 'negative mutant preserves actual fenced commands');
    assert.throws(() => assertLabels(missingLabel), { code: 'ERR_ASSERTION' });
  }
  const unboundTag = playbook.replace('git checkout -b module/<tag>', 'git checkout -b module/<unbound-tag>');
  assert.notEqual(unboundTag, playbook);
  assert.throws(() => assertLabels(unboundTag), { code: 'ERR_ASSERTION' });
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
    ['final optional appendix notes', applyNoteFactOverrides('a-use-cases', '')]
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
    ['final optional appendix notes', applyNoteFactOverrides('a-use-cases', '')]
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
  for (const text of [guide, documentText('docs/feature-guide.md'), applyNoteFactOverrides('a-use-cases', '')]) {
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
    ['final optional appendix notes', applyNoteFactOverrides('a-use-cases', '')],
    ['generated final appendix', documentText('presentation/index.html')
      .match(/<section\b[^>]*id="a-use-cases"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '']
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
    ['final optional appendix notes', applyNoteFactOverrides('a-use-cases', '')]
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
    ['final optional appendix notes', applyNoteFactOverrides('a-use-cases', '')]
  ];
  for (const [name, text] of texts) {
    for (const pattern of [
      /Corp, Norway East placement/, /historical Oct 9/, /56 seconds/,
      /Manual/, /7200-second/, /no registered target runners/i,
      /current target rights|invitation (?:is |remains )?pending|private invitation pending/i,
      /fresh queue-driven readiness is not established/i,
      /README-only/, /Manual runner execution ended terminal Failed/,
      /associated issue queue workflow remains queued/,
      /55:00-58:00/, /Management-side MicroVM/,
      /historical (?:variable-cost )?estimate/i, /not a current.*(?:bill|measured)/i
    ]) assert.match(text, pattern, `${name} retains hosted placement/runtime/cost scope: ${pattern}`);
    assert.doesNotMatch(text,
      /current run evidence is under Management|current evidence is from Management|Norway East under Management/i);
    assert.doesNotMatch(text.replaceAll('caj-squad-aca-agent-corp-ne', ''),
      /caj-[a-z0-9-]+|\/subscriptions\/[0-9a-f-]{36}/i,
      `${name} permits only the explicitly approved demo worker name, not arbitrary private identifiers`);
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
    /Pool A1\/Dependabot/, /Released deck 0\.22\.6 on main\/Pages/i,
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
    ['released final optional appendix notes', applyNoteFactOverrides('a-use-cases', '')]
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
  const c4 = applyNoteFactOverrides('a-use-cases', '');
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
    /read-only prerequisite, not the demo/i, /not a four-minute promise/,
    /Hard cut before 55:00/, /Cut at 32:30/, /No-GO|NO-GO/,
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
  const genericStart = String.raw`Set-Location 'C:\demo\session-repo'`;
  for (const path of ['docs/demo-runbook.md', 'docs/playbook.md', 'docs/run-plan.md']) {
    assert.ok(documentText(path).includes(genericStart), `${path} uses a public checkout example`);
  }
  assert.ok(decodeHTML(applyNoteFactOverrides('demo-c3', '')).includes(String.raw`Set-Location 'C:\demo\checkpoints\take-20261014\guided'`));
  const version = '0.22.6'; // Published release is distinct from the new source candidate.
  for (const path of ['docs/run-plan.md', 'docs/feature-guide.md', 'docs/source-provenance.md',
    'docs/whats-new.md', 'presentation/README.md']) {
    assert.ok(documentText(path).toLowerCase().includes(`deck ${version}`), `${path} matches the current deck`);
  }
  assert.ok(documentText('handoff.md').includes(`Released Reveal.js **deck ${version}** on main/Pages`));
});

test('current public release fronts distinguish completed deck publication from local corrections', () => {
  const version = '0.22.6';
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
  ['docs/talking-points.md', '### Deferred operator context', null],
  ['docs/run-plan.md', '## Separate product demo flows, not one combined runtime', null]
];

for (const [path, start, end] of currentNativeStatusSurfaces) {
  test(`current native status in ${path} rejects stale opening claims`, () => {
    const text = documentText(path);
    assert.ok(!start || text.includes(start), `${path} retains its current status section`);
    const section = start ? text.split(start)[1] : text;
    if (end) assert.ok(section.includes(end), `${path} retains the next section boundary`);
    const current = (end ? section.split(end)[0] : section).replace(/\s+/g, ' ');
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
      assert.match(text, /ACA Sandboxes is a final optional extra/);
      assert.match(text, /C4 is the base skill, read-only MCP lookup and permissions flow only/);
      assert.match(text, /host-driven fixture engineering are independently accepted/);
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
  for (const id of ['a-use-cases']) {
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
  const hosted = applyNoteFactOverrides('a-use-cases', '');
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
  assert.doesNotMatch(news, /26\.768|one bounded ACA prompt/);
  assert.match(news, /optional cloud detail is deferred/);
});

test('product prompts require positive guest work, accountable handoff and original hosted ownership', () => {
  const text = documentText('docs/prompt-pack.md');
  const native = text.split('### Native host Squad isolated work')[1]?.split('### Original hosted Squad issue-to-PR work')[0];
  const hosted = text.split('### Original hosted Squad issue-to-PR work')[1]?.split('<a id="native-host-squad-isolated-work">')[0];
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
    /actual ACA Job.*bot\s+PR\/diff/s, /Correlate the same issue/,
    /Never modify\/delete the original hosted service/
  ]) assert.match(hosted, pattern);
  assert.doesNotMatch(documentText('docs/repositories.md'), /martinopedal\/squad-on-aca-demo-target/);
});

test('all current operator release carriers name published0226, not filename-classified history', () => {
  for (const [path, label, extract] of operatorReleaseSurfaces) {
    assertOperatorRelease(extract(documentText(path)), `${path} ${label}`);
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
      /source accepted\/merged/, /recovered ephemeral runner/,
      /unqualified existing private backend plan-prefix transport/,
      /No Azure login\/backend access, actual Terraform plan/,
      /VM last reported deallocated\/current disk binding differs/,
      /preserve both disks/i, /never swap back\/recreate\/delete either/,
      /Refresh binding\/baseline and runnable SYSTEM context/,
      /Bootstrap not installed/, /allows absent prior receipt/,
      /requires fresh successful receipt after first install/,
      /do not prove CPU\/RAM bottleneck or sustained causality/
    ]) assert.match(notes, pattern);
  };
  for (const id of ['s20-consumer', 's07-agent-setup', 'demo-c0', 'a-bootstrap', 'a-use-cases']) {
    const source = applyNoteFactOverrides(id, '');
    const emitted = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    assert.ok(emitted, `actual emitted ${id} exists`);
    if (id !== 'a-use-cases') {
      assertVmNotes(source);
      assertVmNotes(emitted);
    }
    if (id === 'a-use-cases') {
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
  /^One (?:existing )?approved(?: README)? issue$/i,
  /^(?:private scheduled poller|Actions OIDC enqueue workflow)$/,
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
const releaseParagraph = anchor => text => {
  const paragraphs = text.split(/\r?\n\s*\r?\n/).filter(paragraph => paragraph.includes(anchor));
  assert.equal(paragraphs.length, 1, `exactly one actual paragraph contains ${anchor}`);
  return paragraphs[0];
};
const releaseStatusCell = (prefix, column = -2) => text => {
  const rows = text.split(/\r?\n/).filter(line => line.startsWith(prefix));
  assert.equal(rows.length, 1, `exactly one actual status row starts ${prefix}`);
  const cells = rows[0].split('|');
  return cells.at(column);
};
const operatorReleaseSurfaces = [
  ['README.md', 'operator notes/status release', releaseParagraph('The directly coupled notes/status fix')],
  ['handoff.md', 'Current result release bullet', releaseParagraph('- Released Reveal.js')],
  ['haflidi-overview.html', 'presenter readiness paragraph', text => {
    const paragraphs = [...text.matchAll(/<p>([\s\S]*?)<\/p>/g)]
      .map(match => match[1]).filter(paragraph => paragraph.startsWith('Readiness is not all green:'));
    assert.equal(paragraphs.length, 1, 'exactly one actual presenter readiness paragraph');
    return paragraphs[0];
  }],
  ['docs/run-plan.md', 'clock/source baseline', releaseParagraph('Clock/source baseline:')],
  ['docs/run-plan.md', 'publication status cell', releaseStatusCell('| Deck / publication |', 2)],
  ['docs/source-provenance.md', 'component status cell', releaseStatusCell('| Session docs/deck/skills/native profiles |')],
  ['docs/source-provenance.md', 'release scope', releaseParagraph('Documentation/generated source and executed evidence are distinct.')],
  ['docs/talk-track.md', 'opening delivery contract', releaseParagraph('[two product demo flows]')],
  ['docs/talking-points.md', 'opening operator references', releaseParagraph('Operator references:')],
  ['docs/feature-guide.md', 'evidence release declaration', releaseParagraph('propagates accepted ACA SANDBOXES engineering')],
  ['docs/feature-guide.md', 'native host/current publication declaration', releaseParagraph('Current native host checks are')],
  ['docs/whats-new.md', 'current operator status', releaseParagraph('current operator status updated October 13.')],
  ['docs/whats-new.md', 'key updates release declaration', releaseParagraph('It adds no new headline, tour or slide.')],
  ['docs/demo-runbook.md', 'preflight/current publication declaration', releaseParagraph("October 12: one laptop's corrected read-only preflight")],
  ['docs/demo-runbook.md', 'exported notes release declaration', releaseParagraph('propagates these native/hosted status boundaries')]
];
const releaseBlocks = text => decodeHTML(text).replace(/<\/?(?:p|li|aside)\b[^>]*>/g, '\n\n')
  .split(/\r?\n\s*\r?\n/).map(block => block.replaceAll('*', '').trim()).filter(Boolean);
const isPrepublicationFreeze = block => {
  const freeze = block.match(/^(?:0\.22\.\d+ - )?(\d{4}-\d{2}-\d{2}(?:T[\d:.]+Z)?) pre-publication source freeze:/i);
  return Boolean(freeze && Date.parse(freeze[1]) < Date.parse('2026-10-13T03:57:48Z'));
};
const assertPublishedRelease = (text, name) => {
  assert.ok(text, `${name} contains its current release surface`);
  const current = releaseBlocks(text).filter(block => !isPrepublicationFreeze(block)).join(' ').replace(/\s+/g, ' ');
  assert.match(current, /(?:released|published)(?: Reveal\.js)?(?: main\/Pages)?(?: full\/short)?(?: deck| release)? 0\.22\.6/i, name);
  assert.match(current, /main\/Pages/i, name);
  assert.doesNotMatch(current,
    /local (?:candidate )?(?:deck |presentation version )?0\.22\.6|0\.22\.6 (?:is |remains )?(?:an? )?(?:unpublished|not (?:a )?published|candidate)|(?:released|live|published)[^.]{0,100}0\.22\.[245]|0\.22\.[245] (?:is )?(?:released|published|live)|live Pages remains (?:the previously released )?0\.22\.[245]/i,
    `${name} must not label the published version as a current candidate or keep the old live baseline`);
};
const assertOperatorRelease = (text, name) => {
  assertPublishedRelease(text, name);
  const current = releaseBlocks(text).filter(block => !isPrepublicationFreeze(block)).join(' ').replace(/\s+/g, ' ');
  assert.match(current, /later (?:local )?correction bytes remain unpublished/i, name);
  for (const pattern of [/review/i, /normal merge/i, /Pages byte verification/i]) {
    assert.match(current, pattern, `${name} preserves the correction publication gate`);
  }
  assert.doesNotMatch(current, /correction bytes (?:are |remain )?(?:live|published)|corrections (?:are |already )?(?:live|published)/i, name);
};

for (const [path, label, extract] of operatorReleaseSurfaces) {
  test(`actual current publication carrier: ${path} ${label}`, () => {
    assertOperatorRelease(extract(documentText(path)), `${path} ${label}`);
  });
}

test('every actual operator carrier rejects stale facts even beside valid prose and table decoys', () => {
  for (const [path, label, extract] of operatorReleaseSurfaces) {
    const text = documentText(path);
    const current = extract(text);
    const name = `${path} ${label}`;
    assertOperatorRelease(current, name);
    for (const mutation of [
      current.replaceAll('0.22.6', '0.22.5'),
      `${current} Local deck 0.22.6 is an unpublished candidate.`,
      `${current} Deck 0.22.5 is released on main/Pages.`,
      `${current} Released main/Pages stays 0.22.5.`,
      `${current} Live Pages remains the previously released 0.22.2.`,
      current.replace(/remain\s+unpublished/g, 'are published'),
      current.replace(/remain\s+unpublished/g, 'are live'),
      current.replaceAll('normal merge', 'automatic publication')
    ]) {
      assert.notEqual(mutation, current, `${name} mutation changes the actual carrier`);
      const mutatedDocument = text.replace(current, mutation);
      assert.notEqual(mutatedDocument, text, `${name} mutation reaches the actual document`);
      const withDecoy = `Released deck 0.22.6 on main/Pages.\n\n${mutatedDocument}`;
      assert.throws(() => assertOperatorRelease(extract(withDecoy), name), { code: 'ERR_ASSERTION' },
        `${name} rejects its actual mutated carrier: ${mutation}`);
      if (label.endsWith('status cell')) {
        const row = mutatedDocument.split(/\r?\n/).find(line => line.includes(mutation));
        const cells = row.split('|');
        cells[2] += ' Released deck 0.22.6 on main/Pages.';
        const tableDecoy = mutatedDocument.replace(row, cells.join('|'));
        assert.throws(() => assertOperatorRelease(extract(tableDecoy), name), { code: 'ERR_ASSERTION' });
      }
    }
  }
});

test('run-plan publication remaining-gate cell cannot hide stale facts behind a correct published cell', () => {
  const text = documentText('docs/run-plan.md');
  const row = text.split(/\r?\n/).find(line => line.startsWith('| Deck / publication |'));
  assertPublishedRelease(row, 'actual run-plan publication row');
  const gate = releaseStatusCell('| Deck / publication |', 3)(text);
  assert.match(gate, /fresh independent source\/export review/);
  assert.match(gate, /not publication, runtime or human stage GO/);
  for (const stale of [
    'Local deck 0.22.6 is an unpublished candidate.',
    'Deck 0.22.5 is released on main/Pages.',
    'Later correction bytes are live.'
  ]) {
    const mutation = text.replace(gate, ` ${stale} `);
    assertPublishedRelease(releaseStatusCell('| Deck / publication |', 2)(mutation), 'unchanged correct published cell');
    const mutatedRow = mutation.split(/\r?\n/).find(line => line.startsWith('| Deck / publication |'));
    assert.throws(() => assertOperatorRelease(mutatedRow, 'actual mutated publication row'), { code: 'ERR_ASSERTION' });
  }
});

test('historical release facts require an explicit pre-publication freeze in their own prose block', () => {
  const version = JSON.parse(readFileSync(new URL('../src/version.json', import.meta.url), 'utf8'));
  const historical = version.changes.find(change => change.startsWith('0.22.6 - '));
  assert.ok(isPrepublicationFreeze(historical), 'actual dated source-freeze record is historical');
  for (const [path, label, extract] of operatorReleaseSurfaces) {
    const current = extract(documentText(path));
    const name = `${path} ${label}`;
    for (const separator of ['\n\n', '</p><p>']) {
      assertPublishedRelease(`${current}${separator}${historical}`, name);
      const stale = 'Released main/Pages stays 0.22.5. Local deck 0.22.6 is an unpublished candidate.';
      const scoped = `2026-10-13T03:50:00Z pre-publication source freeze: ${stale}`;
      assertPublishedRelease(`${current}${separator}${scoped}`, name);
      for (const unscoped of [
        stale,
        historical.replace('2026-10-13 pre-publication source freeze: ', ''),
        `Updated October 13, 2026. ${stale}`,
        `Historical operator snapshot: ${stale}`,
        `2026-10-13 pre-publication source freeze:\n\n${stale}`,
        `${scoped}${separator}${stale}`,
        scoped.replace('03:50:00Z', '04:50:00Z')
      ]) {
        assert.throws(() => assertPublishedRelease(`${current}${separator}${unscoped}`, name), { code: 'ERR_ASSERTION' });
      }
      assert.throws(() => assertPublishedRelease(scoped, name), { code: 'ERR_ASSERTION' },
        'historical prose alone cannot satisfy a current release carrier');
    }
  }
});

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
  for (const id of ['s04-news', 'a-use-cases']) {
    const emitted = html.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    const notes = emitted?.match(/<aside class="notes">([\s\S]*?)<\/aside>/)?.[1];
    for (const [kind, current] of [['source', applyNoteFactOverrides(id, '')], ['emitted', notes]]) {
      const name = `${kind} ${id}`;
      assertPublishedRelease(current, name);
      if (id === 'a-use-cases') assert.match(current, /SQUAD ON ACA APPS\/JOBS fresh E2E separately BLOCKED/, name);
      else assert.match(current, /optional cloud detail is deferred/, name);
      assert.match(current, /human stage GO|Human stage\/rehearsal/, name);
      for (const mutation of [
        current.replaceAll('0.22.6', '0.22.5'),
        `${current}<p>Local deck 0.22.6 unpublished candidate.</p>`
      ]) assert.throws(() => assertPublishedRelease(mutation, name), { code: 'ERR_ASSERTION' });
    }
  }
});

test('actual candidate version and generated headers retain published0226 and source-freeze history', () => {
  const version = JSON.parse(readFileSync(new URL('../src/version.json', import.meta.url), 'utf8'));
  assert.equal(version.version, '0.22.7');
  const full = documentText('presentation/index.html');
  const short = documentText('presentation/short/index.html');
  for (const [name, current] of [
    ['version status', version.status],
    ['full generated header', full.match(/<!-- Document version: ([^\n]+)/)?.[1]],
    ['short generated header', short.match(/<!-- Document version: ([^\n]+)/)?.[1]]
  ]) {
    assert.match(current, /unpublished candidate 0\.22\.7/, name);
    assert.match(current, /released main\/Pages 0\.22\.6 remains verified/, name);
    assert.match(current, /2026-10-13/, name);
    assert.match(current, /independent semantic review/, name);
  }
  const freeze = version.changes.find(change => change.startsWith('0.22.6 - '));
  assert.match(freeze, /2026-10-13 pre-publication source freeze:/);
  assert.match(freeze, /candidate/);
  assert.match(freeze, /Released main\/Pages remains0\.22\.5 until exact review/);
  assert.match(full, /Source-build history below records dated source freezes, not current publication status\./);
  assert.ok(full.includes(freeze), 'actual full export retains the explicitly frozen historical entry');
});
