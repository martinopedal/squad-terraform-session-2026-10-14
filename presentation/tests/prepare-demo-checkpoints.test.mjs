import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const helper = join(root, 'scripts', 'prepare-demo-checkpoints.ps1');
test('checkpoint creator creates real pinned worktrees and rejects changed existing inputs without overwriting', {
  skip: process.platform !== 'win32' ? 'Windows VM helper requires Windows PowerShell paths' : false
}, () => {
  const fixture = join(root, '.artifacts', `checkpoint-test-${randomUUID()}`);
  const source = join(fixture, 'public-source');
  const mirror = join(fixture, 'qualified-mirror');
  const demo = join(fixture, 'demo');
  const take = join(demo, 'checkpoints', 'take-20261014');
  const run = (command, args, expected = 0) => {
    const result = spawnSync(command, args, { encoding: 'utf8', timeout: 60000 });
    assert.equal(result.status, expected, result.stdout + result.stderr);
    return (expected === 0 ? result.stdout : result.stdout + result.stderr).trim();
  };
  const git = args => run('git', ['-C', source, ...args]);
  const put = (path, text) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  try {
    mkdirSync(source, { recursive: true });
    git(['init', '-q']);
    git(['config', 'user.name', 'Checkpoint fixture']);
    git(['config', 'user.email', 'fixture@example.invalid']);
    git(['config', 'core.autocrlf', 'false']);
    git(['config', 'commit.gpgsign', 'false']);
    git(['remote', 'add', 'origin', 'https://github.com/martinopedal/squad-terraform-session-2026-10-14.git']);
    for (const file of ['AGENTS.md', '.github/agents/terraform-coder.agent.md',
      '.github/agents/terraform-validator.agent.md', '.github/agents/terraform-reviewer.agent.md',
      'terraform/modules/aks-automatic-corp/tests/contract.tftest.hcl',
      'terraform/modules/aks-automatic-corp/.terraform.lock.hcl'])
      put(join(source, file), 'public fixture\n');
    git(['add', '.']);
    git(['commit', '-q', '-m', 'Public creator fixture']);
    const pin = git(['rev-parse', 'HEAD']);
    const packagePath = join(mirror, 'registry.terraform.io', 'azure', 'azapi', 'terraform-provider-azapi_2.12.0_windows_amd64.zip');
    put(packagePath, 'FAKE archive: tests copying only, never init or provider validation\n');
    const invoke = (expected = 0, overrides = []) => run('pwsh', ['-NoProfile', '-File', helper,
      '-SourceRoot', source, '-DemoRoot', demo, '-ProviderMirror', mirror, '-Pin', pin, ...overrides], expected);
    assert.match(invoke(), /CREATED A\/B\/guided/);
    assert.match(invoke(), /VERIFIED existing pristine take/);
    const linuxMirror = join(fixture, 'linux-only-mirror');
    put(join(linuxMirror, 'registry.terraform.io', 'azure', 'azapi',
      'terraform-provider-azapi_2.12.0_linux_amd64.zip'), 'Linux fixture, not Windows\n');
    const linuxDemo = join(fixture, 'linux-demo');
    run('pwsh', ['-NoProfile', '-File', helper, '-SourceRoot', source, '-DemoRoot', linuxDemo,
      '-ProviderMirror', linuxMirror, '-Pin', pin], 1);
    assert.equal(existsSync(join(linuxDemo, 'checkpoints')), false);
    for (const name of ['A', 'B', 'guided']) {
      assert.equal(run('git', ['-C', join(take, name), 'rev-parse', 'HEAD']), pin);
      assert.equal(run('git', ['-C', join(take, name), 'status', '--porcelain']), '');
      assert.ok(existsSync(join(take, name, '.github', 'agents', 'terraform-validator.agent.md')));
    }
    const configPath = join(take, 'offline', 'terraform.tfrc');
    const config = readFileSync(configPath, 'utf8');
    assert.match(config, /filesystem_mirror/);
    assert.doesNotMatch(config, /\bdirect\b/);
    assert.equal(readFileSync(join(take, 'evidence', 'checkpoint.txt'), 'utf8').trim(), pin);
    const existingFile = join(take, 'A', 'AGENTS.md');
    put(existingFile, 'human edit: MUST survive\n');
    assert.match(invoke(1), /dirty, mismatched/);
    assert.equal(readFileSync(existingFile, 'utf8'), 'human edit: MUST survive\n');
    put(existingFile, 'public fixture\n');
    put(configPath, 'user config MUST survive\n');
    assert.match(invoke(1), /evidence\/config does not match/);
    assert.equal(readFileSync(configPath, 'utf8'), 'user config MUST survive\n');
    put(configPath, config);
    put(packagePath, 'changed package MUST survive\n');
    assert.match(invoke(1), /mirror bytes differ/);
    assert.equal(readFileSync(packagePath, 'utf8'), 'changed package MUST survive\n');
    put(packagePath, 'FAKE archive: tests copying only, never init or provider validation\n');
    put(join(source, 'AGENTS.md'), 'source human edit MUST survive\n');
    assert.match(invoke(1), /Source is dirty/);
    assert.equal(readFileSync(join(source, 'AGENTS.md'), 'utf8'), 'source human edit MUST survive\n');
    put(join(source, 'AGENTS.md'), 'public fixture\n');
    mkdirSync(join(demo, 'checkpoints', 'take-partial'), { recursive: true });
    put(join(demo, 'checkpoints', 'take-partial', 'keep.txt'), 'preserve\n');
    assert.match(invoke(1, ['-TakeName', 'take-partial']), /Partial\/existing take/);
    assert.equal(readFileSync(join(demo, 'checkpoints', 'take-partial', 'keep.txt'), 'utf8'), 'preserve\n');
    assert.match(invoke(), /VERIFIED existing pristine take/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
