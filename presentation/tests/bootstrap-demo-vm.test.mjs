import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = resolve(root, '..', 'scripts', 'bootstrap-demo-vm.ps1');
const quote = value => `'${value.replaceAll("'", "''")}'`;

function runBootstrap({ failure = '', missing = '', existing = false, initialized = false,
  repoExit = 0, appInstalled = true, wingetExit = 0, squadVersion = '1.0.1',
  nativePreference = false, flags = [] } = {}) {
  const artifacts = join(root, '.test-artifacts');
  mkdirSync(artifacts, { recursive: true });
  const directory = mkdtempSync(join(artifacts, 'bootstrap-'));
  const repo = join(directory, 'repo');
  const log = join(directory, 'calls.jsonl');
  const mock = join(directory, 'native-mock.mjs');
  const runner = join(directory, 'runner.ps1');
  if (existing) mkdirSync(repo);
  if (initialized) mkdirSync(join(repo, '.squad'));
  writeFileSync(mock, `
import { appendFileSync, mkdirSync } from 'node:fs';
const [tool, ...args] = process.argv.slice(2);
appendFileSync(process.env.MOCK_LOG, JSON.stringify({ tool, args }) + '\\n');
const key = tool + ' ' + args[0];
if (key === process.env.MOCK_FAILURE) {
  console.error('safe native probe failed');
  process.exit(42);
}
if (key === 'winget list') {
  if (process.env.MOCK_APP_INSTALLED === 'true') console.log('GitHub.CopilotApp 1.1.28');
  else process.exit(-1978335212);
} else if (key === 'winget install' && process.env.MOCK_WINGET_EXIT !== '0') {
  process.exit(Number(process.env.MOCK_WINGET_EXIT));
} else if (tool === 'git' && args.includes('rev-parse')) {
  if (process.env.MOCK_REPO_EXIT !== '0') process.exit(Number(process.env.MOCK_REPO_EXIT));
  console.log('true');
} else if (key === 'git clone') {
  mkdirSync(args.at(-1), { recursive: true });
} else if (key === 'squad init') {
  mkdirSync('.squad', { recursive: true });
} else if (args[0] === '--version') {
  console.log(tool === 'squad' ? process.env.MOCK_SQUAD_VERSION : tool + ' mock 1.0.0');
}
`);
  const functions = ['winget', 'git', 'node', 'npm', 'copilot', 'squad', 'code']
    .map(tool => `function global:${tool} { & ${quote(process.execPath)} ${quote(mock)} ${quote(tool)} @args }`)
    .join('\n');
  writeFileSync(runner, `
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $${nativePreference}
${functions}
# Only tool discovery is mocked; every tool invocation runs a real native child.
function global:Get-Command {
    param([string]$Name, [string]$ErrorAction)
    if ($Name -eq $env:MOCK_MISSING) { return }
    [pscustomobject]@{ Source = 'safe-native-mock' }
}
& ${quote(script)} -RepoPath ${quote(repo)} ${flags.join(' ')}
`);
  try {
    const result = spawnSync('pwsh', ['-NoProfile', '-NonInteractive', '-File', runner], {
      encoding: 'utf8', timeout: 30000, cwd: root,
      env: { ...process.env, MOCK_LOG: log, MOCK_FAILURE: failure, MOCK_MISSING: missing,
        MOCK_REPO_EXIT: String(repoExit), MOCK_APP_INSTALLED: String(appInstalled),
        MOCK_WINGET_EXIT: String(wingetExit), MOCK_SQUAD_VERSION: squadVersion,
        TEMP: directory, TMP: directory }
    });
    assert.ifError(result.error);
    return {
      status: result.status, output: result.stdout + result.stderr,
      calls: existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse) : []
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

const failures = [
  { failure: 'winget install', missing: 'git' },
  { failure: 'winget install', missing: 'copilot' },
  { failure: 'winget install', missing: 'code' },
  { failure: 'winget install', appInstalled: false },
  { failure: 'winget list' },
  { failure: 'winget install', missing: 'squad', flags: ['-SquadInstallSource Winget'] },
  { failure: 'copilot login' },
  { failure: 'copilot login', flags: ['-CopilotLoginMode DeviceCode'] },
  { failure: 'git clone' },
  { failure: 'squad init' },
  ...['git', 'node', 'npm', 'copilot', 'squad', 'code'].map(tool => ({ failure: `${tool} --version` }))
];
for (const scenario of failures) {
  test(`bootstrap stops on native exit 42: ${JSON.stringify(scenario)}`, () => {
    const result = runBootstrap(scenario);
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /failed with exit code 42/, result.output);
    assert.doesNotMatch(result.output, /==> Next steps|Then describe the project/);
    assert.equal(`${result.calls.at(-1).tool} ${result.calls.at(-1).args[0]}`, scenario.failure,
      'no later native command may run after failure');
    if (scenario.failure.endsWith('install') || scenario.failure === 'winget list' || scenario.failure === 'copilot login') {
      assert.doesNotMatch(result.output, /==> Preparing repository/);
    }
  });
}

test('bootstrap success and repeated setup preserve clone/init idempotence', () => {
  const fresh = runBootstrap();
  assert.equal(fresh.status, 0, fresh.output);
  assert.match(fresh.output, /==> Next steps/);
  assert.equal(fresh.calls.filter(call => call.tool === 'git' && call.args[0] === 'clone').length, 1);
  assert.equal(fresh.calls.filter(call => call.tool === 'squad' && call.args[0] === 'init').length, 1);
  const repeated = runBootstrap({ existing: true, initialized: true, flags: ['-SkipLogin'] });
  assert.equal(repeated.status, 0, repeated.output);
  assert.match(repeated.output, /Skipping clone/);
  assert.match(repeated.output, /Skipping squad init/);
  assert.ok(!repeated.calls.some(call => ['clone', 'init', 'login'].includes(call.args[0])));
  assert.ok(!repeated.calls.some(call => call.args[0] === 'install'), 'available prerequisites are not installed again');
});

test('bootstrap rejects an existing non-repository without treating expected Git exit 128 as a crash', () => {
  const result = runBootstrap({ existing: true, repoExit: 128, flags: ['-SkipLogin'] });
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /RepoPath exists but is not a Git repository/);
  assert.doesNotMatch(result.output, /==> Next steps/);
  assert.ok(!result.calls.some(call => ['clone', 'init'].includes(call.args[0])));
});

test('bootstrap reports unexpected native failure during existing repository detection', () => {
  const result = runBootstrap({ existing: true, repoExit: 42, flags: ['-SkipLogin'] });
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /failed with exit code 42/);
  assert.doesNotMatch(result.output, /==> Next steps/);
});

test('bootstrap WhatIf performs no installs, login, clone, or init', () => {
  const result = runBootstrap({ flags: ['-WhatIf'] });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /What if:/);
  assert.ok(result.calls.every(call => ['--version', 'list'].includes(call.args[0])), JSON.stringify(result.calls));
});

test('bootstrap executes the four exact catalog identities and pins Squad 1.0.1', () => {
  const app = runBootstrap({ appInstalled: false });
  const vscode = runBootstrap({ missing: 'code' });
  const cli = runBootstrap({ missing: 'copilot' });
  const squad = runBootstrap({ missing: 'squad' });
  for (const [result, id] of [[app, 'GitHub.CopilotApp'], [vscode, 'Microsoft.VisualStudioCode'],
    [cli, 'GitHub.Copilot'], [squad, 'bradygaster.Squad']]) {
    assert.equal(result.status, 0, result.output);
    const install = result.calls.find(call => call.tool === 'winget' && call.args[0] === 'install');
    assert.equal(install.args[install.args.indexOf('--id') + 1], id);
    assert.ok(install.args.includes('--exact'));
    assert.equal(install.args[install.args.indexOf('--source') + 1], 'winget');
    if (id === 'bradygaster.Squad') {
      assert.equal(install.args[install.args.indexOf('--version') + 1], '1.0.1');
    }
  }
});

test('bootstrap accepts only WinGet already-current status, not installation failures', () => {
  const result = runBootstrap({ appInstalled: false, wingetExit: -1978335189, nativePreference: true });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /==> Next steps/);
  const failure = runBootstrap({ appInstalled: false, wingetExit: -1978335212 });
  assert.notEqual(failure.status, 0, failure.output);
  assert.match(failure.output, /failed with exit code -1978335212/);
  assert.doesNotMatch(failure.output, /==> Preparing repository|==> Next steps/);
});

test('bootstrap rejects an unexpected installed Squad version instead of silently changing stage parity', () => {
  const result = runBootstrap({ squadVersion: '0.13.1' });
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /not the rehearsed version 1\.0\.1/);
  assert.doesNotMatch(result.output, /==> Preparing repository|==> Next steps/);
});

test('the unsupported legacy npm option stops before any machine-changing command', () => {
  const result = runBootstrap({ flags: ['-SquadInstallSource Npm', '-SkipLogin'] });
  assert.notEqual(result.status, 0, result.output);
  assert.match(result.output, /not published as @bradygaster\/squad-cli/);
  assert.match(result.output, /SquadInstallSource Winget/);
  assert.deepEqual(result.calls, []);
  assert.doesNotMatch(result.output, /==> Next steps/);
});
