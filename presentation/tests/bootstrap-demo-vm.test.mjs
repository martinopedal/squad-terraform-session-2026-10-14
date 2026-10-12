import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = resolve(root, '..', 'scripts', 'bootstrap-demo-vm.ps1');
const fixture = join(root, 'tests', 'fixtures', 'bootstrap-fixture.ps1');
const manifestPath = resolve(root, '..', 'scripts', 'bootstrap-demo-vm.packages.json');
const machineManifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const tools = ['pwsh', 'git', 'code', 'copilot', 'az', 'gh', 'terraform', 'node', 'npm', 'squad', 'aca'];
const packages = {
  pwsh: 'Microsoft.PowerShell', git: 'Git.Git', code: 'Microsoft.VisualStudioCode',
  copilot: 'GitHub.Copilot', az: 'Microsoft.AzureCLI', gh: 'GitHub.cli',
  terraform: 'Hashicorp.Terraform', node: 'OpenJS.NodeJS.LTS', squad: 'bradygaster.Squad'
};
const authCalls = calls => calls.filter(call => call.args[0] === 'login' ||
  call.args[0] === 'auth' || (call.tool === 'az' && call.args[0] === 'account'));
const repoCalls = calls => calls.filter(call => ['clone', 'init'].includes(call.args[0]));

function runBootstrap(engine, options = {}) {
  const artifacts = join(root, '.test-artifacts');
  mkdirSync(artifacts, { recursive: true });
  const directory = mkdtempSync(join(artifacts, 'bootstrap-'));
  const repo = join(directory, 'repo');
  const log = join(directory, 'calls.jsonl');
  const statePath = join(directory, 'state.json');
  const programFiles = join(directory, 'machine-program-files');
  const programData = join(directory, 'machine-program-data');
  mkdirSync(programFiles);
  mkdirSync(programData);
  const selectedScript = options.scriptText ? join(directory, 'mutated-bootstrap.ps1') : script;
  if (options.scriptText) {
    writeFileSync(selectedScript, options.scriptText);
    writeFileSync(join(directory, 'bootstrap-demo-vm.packages.json'), readFileSync(manifestPath));
  }
  const state = {
    missing: ['docker', ...options.missing ?? []], appInstalled: true,
    failure: '', repoExit: 0, wingetExit: 0, squadVersion: '1.0.1', acaInstallerExit: 0,
    downloadFailure: false, emptyInstaller: false, installerThrow: false,
    machineElevated: true, machineDownloadFailure: '', machineHashMismatch: '',
    machineInstallerPackage: 'Microsoft.PowerShell', machineInstallerExit: 0,
    machineBadVersion: '', machineVersionFailure: '', machineInstallNoop: false,
    machinePath: 'C:\\Windows\\System32;C:\\existing-machine-only',
    machinePathNoop: false, zipAttack: '', zipSymlink: false,
    machineUnsafeAcl: false,
    auth: { gh: 0, az: 0, aca: 0 }, wslFeatures: true, wslVersion: '2.6.1', wslExit: 0,
    ...options
  };
  const flags = options.flags ?? [];
  writeFileSync(statePath, JSON.stringify(state));
  if (options.machineInstalled) {
    for (const packageInfo of machineManifest.packages) {
      for (const tool of packageInfo.tools) {
        if (tool.name === options.machineMissingTool) continue;
        const path = join(programFiles, tool.path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, 'harmless existing machine fixture');
      }
    }
  }
  if (options.userOnlyTools) {
    const home = join(directory, 'fixture-home');
    mkdirSync(join(home, '.aca', 'bin'), { recursive: true });
    writeFileSync(join(home, '.aca', 'bin', 'aca.exe'), 'must not be treated as AllUsers');
  }
  if (options.preexistingPortable) {
    mkdirSync(join(programFiles, 'DemoBootstrap', 'GitHub.Copilot'), { recursive: true });
    writeFileSync(join(programFiles, 'DemoBootstrap', 'GitHub.Copilot', 'preserve-me'), 'preserve');
  }
  if (options.existing) mkdirSync(repo);
  const sentinel = join(repo, '.squad', 'preserved-state');
  if (options.initialized) {
    mkdirSync(dirname(sentinel), { recursive: true });
    writeFileSync(sentinel, 'preserve exactly');
  }
  if (options.profileOnly) {
    const profile = join(repo, '.github', 'agents', 'squad.agent.md');
    mkdirSync(dirname(profile), { recursive: true });
    writeFileSync(profile, 'preserve existing profile');
  }
  try {
    const result = spawnSync(engine, ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', fixture,
      '-Script', selectedScript, '-RepoPath', repo, ...(flags.length ? ['-Flags', flags.join(',')] : [])], {
      encoding: 'utf8', timeout: 60000, cwd: directory,
      env: { ...process.env, MOCK_NODE: process.execPath, MOCK_LOG: log, MOCK_STATE: statePath,
        MOCK_SESSION_PATH: join(directory, 'session-only'),
        MOCK_NATIVE_PREFERENCE: String(options.nativePreference ?? false),
        ProgramFiles: programFiles, ProgramData: programData,
        MOCK_PROGRAM_FILES: programFiles, MOCK_PROGRAM_DATA: programData,
        TEMP: directory, TMP: directory }
    });
    assert.ifError(result.error);
    const receiptPath = join(programData, 'DemoBootstrap', 'machine-bootstrap.json');
    const machineRoot = join(programFiles, 'DemoBootstrap');
    const receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8').replace(/^\uFEFF/, '')) : undefined;
    const finalState = JSON.parse(readFileSync(statePath, 'utf8').replace(/^\uFEFF/, ''));
    return {
      status: result.status, output: (result.stdout + result.stderr).replace(/\x1b\[[0-9;]*m/g, ''), repoExists: existsSync(repo),
      sentinel: existsSync(sentinel) ? readFileSync(sentinel, 'utf8') : undefined,
      machineReceipt: receipt, machinePath: finalState.machinePath, programFiles,
      machineRootExists: existsSync(machineRoot),
      machineLeftovers: existsSync(machineRoot) ? readdirSync(machineRoot).filter(name => name.startsWith('.bootstrap-')) : [],
      traversalEscaped: existsSync(join(machineRoot, 'escape.exe')) || existsSync(join(directory, 'escape.exe')),
      portableSentinel: existsSync(join(machineRoot, 'GitHub.Copilot', 'preserve-me')),
      leftovers: readdirSync(directory).filter(name => name.includes('.bootstrap-') || name.startsWith('.bootstrap-aca')),
      calls: existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse) : []
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

for (const engine of ['pwsh', ...(process.platform === 'win32' ? ['powershell'] : [])]) {
  const probe = spawnSync(engine, ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'], { encoding: 'utf8' });
  test(`${engine}: required test engine is available`, () => {
    assert.ifError(probe.error);
    assert.equal(probe.status, 0, probe.stderr);
  });
  const check = (name, action) => test(`${engine}: ${name}`, action);
  const run = options => runBootstrap(engine, options);

  check('clean VM installs the entire exact core bundle, verifies versions and initializes once', () => {
    const result = run({ missing: [...tools, 'docker'], appInstalled: false, flags: ['SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    const installs = result.calls.filter(call => call.tool === 'winget' && call.args[0] === 'install');
    assert.deepEqual(installs.map(call => call.args[call.args.indexOf('--id') + 1]),
      ['Microsoft.PowerShell', 'Git.Git', 'GitHub.CopilotApp', 'Microsoft.VisualStudioCode',
        'GitHub.Copilot', 'Microsoft.AzureCLI', 'GitHub.cli', 'Hashicorp.Terraform',
        'OpenJS.NodeJS.LTS', 'bradygaster.Squad']);
    for (const install of installs) {
      assert.ok(install.args.includes('--exact'));
      assert.equal(install.args[install.args.indexOf('--source') + 1], 'winget');
      assert.ok(!install.args.includes('--allow-reboot'));
    }
    const squad = installs.at(-1);
    assert.equal(squad.args[squad.args.indexOf('--version') + 1], '1.0.1');
    assert.equal(result.calls.filter(call => call.tool === 'download').length, 1);
    assert.equal(result.calls.filter(call => call.tool === 'aca-installer').length, 1);
    assert.equal(repoCalls(result.calls).length, 2);
    assert.match(result.output, /azure-cli|2\.91\.0/);
    for (const tool of tools) assert.match(result.output, new RegExp(`\\b${tool}\\b`));
    assert.deepEqual(authCalls(result.calls), []);
    assert.deepEqual(result.leftovers, []);
    assert.match(result.output, /Inventory only: not clean-VM/);
  });

  for (const [tool, id] of Object.entries(packages)) {
    check(`missing ${tool} installs only ${id} and preserves session PATH`, () => {
      const result = run({ missing: [tool], flags: ['SkipLogin'] });
      assert.equal(result.status, 0, result.output);
      const installs = result.calls.filter(call => call.tool === 'winget' && call.args[0] === 'install');
      assert.equal(installs.length, 1);
      assert.equal(installs[0].args[installs[0].args.indexOf('--id') + 1], id);
      const callsAfterInstall = result.calls.slice(result.calls.indexOf(installs[0]) + 1);
      assert.ok(callsAfterInstall.every(call => !call.path || call.path.includes('session-only')));
      assert.ok(callsAfterInstall.some(call => call.path?.includes('\\.aca\\bin')));
    });
  }

  check('missing ACA uses only the official installer and leaves no scratch files', () => {
    const result = run({ missing: ['aca'], flags: ['SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(result.calls.find(call => call.tool === 'download').args, ['https://aka.ms/aca-cli-install-ps']);
    assert.deepEqual(result.leftovers, []);
  });
  check('already installed tools, repository and Squad state are untouched', () => {
    const result = run({ existing: true, initialized: true, flags: ['SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(repoCalls(result.calls), []);
    assert.equal(result.sentinel, 'preserve exactly');
    assert.ok(!result.calls.some(call => call.args[0] === 'install' || call.tool === 'download'));
    assert.deepEqual(authCalls(result.calls), []);
  });
  check('package-only mode has zero auth/repository/profile initialization calls', () => {
    const result = run({ flags: ['SkipLogin', 'SkipRepository'] });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(authCalls(result.calls), []);
    assert.deepEqual(repoCalls(result.calls), []);
    assert.equal(result.repoExists, false);
    assert.match(result.output, /package-only; no clone or Squad init/);
    assert.match(result.output, /AllUsers\/SYSTEM completion is NOT established/);
    const alias = run({ flags: ['SkipLogin', 'PackageOnly'] });
    assert.equal(alias.status, 0, alias.output);
    assert.deepEqual(repoCalls(alias.calls), []);
  });
  check('a controlled SYSTEM identity takes the production fail-closed guard before all side effects', () => {
    const original = readFileSync(script, 'utf8');
    const controlled = original.replace('[Security.Principal.WindowsIdentity]::GetCurrent().IsSystem', '$true');
    assert.notEqual(controlled, original, 'substitute only the immutable OS identity probe in a disposable source copy');
    const result = run({ scriptText: controlled, flags: ['SkipLogin', 'SkipRepository'] });
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /LocalSYSTEM\/AllUsers bootstrap is blocked/);
    assert.deepEqual(result.calls, []);
    assert.equal(result.repoExists, false);
    assert.deepEqual(result.leftovers, []);
    const preview = run({ scriptText: controlled, missing: [...tools, 'winget', 'wsl', 'docker'],
      flags: ['WhatIf', 'SkipLogin', 'SkipRepository'] });
    assert.equal(preview.status, 0, preview.output);
    assert.deepEqual(preview.calls, []);
    assert.equal(preview.repoExists, false);
  });
  check('an existing Squad profile is never reinitialized even without .squad', () => {
    const result = run({ existing: true, profileOnly: true, flags: ['SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(repoCalls(result.calls), []);
  });
  check('WhatIf works without any installed tools including WinGet and WSL, with zero mutations/auth', () => {
    const result = run({ missing: [...tools, 'winget', 'wsl', 'docker'], appInstalled: false,
      flags: ['WhatIf', 'InstallDocker'] });
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /What if:/);
    assert.match(result.output, /missing \(installation previewed/);
    assert.deepEqual(result.calls, []);
    assert.equal(result.repoExists, false);
    assert.deepEqual(result.leftovers, []);
  });
  check('WhatIf on installed tools permits only read-only inventory/version checks', () => {
    const result = run({ flags: ['WhatIf'] });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(authCalls(result.calls), []);
    assert.ok(result.calls.every(call => ['--version', '-NoLogo', 'version', 'list'].includes(call.args[0])));
    assert.equal(result.repoExists, false);
    assert.ok(!result.calls.some(call => call.tool === 'winget'),
      'even source-agreement acceptance must be skipped in dry-run');
  });
  check('WhatIf preserves an unverifiable existing directory when Git is absent', () => {
    const result = run({ missing: ['git'], existing: true, flags: ['WhatIf', 'SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    assert.match(result.output, /cannot be verified without Git/);
    assert.deepEqual(repoCalls(result.calls), []);
  });

  const failures = [
    ...Object.keys(packages).map(tool => ({ failure: 'winget install', missing: [tool] })),
    { failure: 'winget install', appInstalled: false },
    { failure: 'winget list' },
    { failure: 'copilot login', auth: { gh: 1, az: 0, aca: 0 } },
    { failure: 'copilot login', auth: { gh: 1, az: 0, aca: 0 }, flags: ['CopilotLoginMode=DeviceCode'] },
    { failure: 'gh auth', auth: { gh: 1, az: 0, aca: 0 } },
    { failure: 'gh auth login', auth: { gh: 1, az: 0, aca: 0 } },
    { failure: 'az account' }, { failure: 'az login', auth: { gh: 0, az: 1, aca: 0 } },
    { failure: 'aca auth' },
    { failure: 'aca auth login', auth: { gh: 0, az: 0, aca: 1 } },
    { failure: 'git clone' }, { failure: 'squad init' },
    ...tools.filter(tool => !['az', 'pwsh'].includes(tool)).map(tool => ({ failure: `${tool} --version` })),
    { failure: 'az version' }, { failure: 'pwsh -NoLogo' }
  ];
  for (const scenario of failures) {
    check(`native exit 42 stops immediately: ${JSON.stringify(scenario)}`, () => {
      const result = run(scenario);
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /failed with exit code 42/);
      assert.doesNotMatch(result.output, /==> Next steps/);
      assert.ok(`${result.calls.at(-1).tool} ${result.calls.at(-1).args.join(' ')}`.startsWith(scenario.failure));
      if (!['git clone', 'squad init'].includes(scenario.failure)) {
        assert.deepEqual(repoCalls(result.calls), []);
        assert.equal(result.repoExists, false);
      }
      if (scenario.failure === 'git clone') assert.equal(result.repoExists, false);
      assert.deepEqual(result.leftovers, []);
    });
  }

  for (const scenario of [
    { downloadFailure: true, message: /safe download failed/ },
    { emptyInstaller: true, message: /installer download was empty/ },
    { installerThrow: true, message: /safe installer terminating failure/ },
    { acaInstallerExit: 42, message: /Official ACA installer failed with exit code 42/ },
    { installNoop: true, message: /Required command 'aca' is unavailable/ }
  ]) {
    check(`ACA download/installer fails closed: ${JSON.stringify(scenario)}`, () => {
      const result = run({ ...scenario, missing: ['aca'], flags: ['SkipLogin'] });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, scenario.message);
      assert.deepEqual(repoCalls(result.calls), []);
      assert.deepEqual(result.leftovers, []);
    });
  }
  check('failed installation cannot become success when the executable is still missing', () => {
    const result = run({ missing: ['gh'], installNoop: true, flags: ['SkipLogin'] });
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /Required command 'gh' is unavailable/);
    assert.deepEqual(repoCalls(result.calls), []);
  });
  check('missing npm is not masked by an existing Node binary', () => {
    const result = run({ missing: ['npm'], flags: ['SkipLogin'] });
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /Required command 'npm' is unavailable/);
    assert.deepEqual(repoCalls(result.calls), []);
  });
  check('real setup without WinGet fails actionably before any package or repository change', () => {
    const result = run({ missing: ['winget'], flags: ['SkipLogin'] });
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /WinGet is required.*Microsoft App Installer/);
    assert.deepEqual(repoCalls(result.calls), []);
    assert.deepEqual(authCalls(result.calls), []);
    assert.ok(!result.calls.some(call => call.args[0] === 'install'));
  });
  check('expected Git exit 128 rejects non-repository; unexpected 42 remains a native failure', () => {
    for (const repoExit of [128, 42]) {
      const result = run({ existing: true, repoExit, flags: ['SkipLogin'] });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, repoExit === 128 ? /RepoPath exists but is not a Git repository/ : /failed with exit code 42/);
      assert.deepEqual(repoCalls(result.calls), []);
      assert.equal(result.repoExists, true);
    }
  });
  check('all installed auth sessions avoid login; GH is not claimed as Copilot entitlement', () => {
    const result = run();
    assert.equal(result.status, 0, result.output);
    assert.ok(!result.calls.some(call => call.args.includes('login')));
    assert.match(result.output, /verify Copilot entitlement\/session manually/);
  });
  check('missing auth uses supported logins once, then status rechecks', () => {
    const result = run({ auth: { gh: 1, az: 1, aca: 1 }, flags: ['CopilotLoginMode=DeviceCode'] });
    assert.equal(result.status, 0, result.output);
    const logins = result.calls.filter(call => call.args.includes('login'));
    assert.deepEqual(logins.map(call => call.tool), ['copilot', 'gh', 'az', 'aca']);
    assert.deepEqual(logins[0].args, ['login', '--device-code']);
    assert.deepEqual(logins.at(-1).args, ['auth', 'login']);
    assert.equal(result.calls.filter(call => call.tool === 'az' && call.args[0] === 'account').length, 2);
    assert.equal(result.calls.filter(call => call.tool === 'aca' && call.args[1] === 'status').length, 2);
  });
  check('default Copilot login explicitly preserves WebFlow', () => {
    const result = run({ auth: { gh: 1, az: 0, aca: 0 } });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(result.calls.find(call => call.tool === 'copilot' && call.args[0] === 'login').args,
      ['login', '--web-flow']);
  });
  check('a zero-exit login without a valid status fails instead of proceeding to clone', () => {
    for (const tool of ['gh', 'az', 'aca']) {
      const result = run({ auth: { gh: 0, az: 0, aca: 0, [tool]: 1 }, authNoop: true });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, new RegExp(`${tool} failed with exit code 1`));
      assert.deepEqual(repoCalls(result.calls), []);
    }
  });
  check('only already-current WinGet status is accepted and verified', () => {
    const result = run({ missing: ['gh'], wingetExit: -1978335189, nativePreference: true });
    assert.equal(result.status, 0, result.output);
    const failed = run({ missing: ['gh'], wingetExit: -1978335212 });
    assert.notEqual(failed.status, 0, failed.output);
    assert.match(failed.output, /failed with exit code -1978335212/);
    assert.deepEqual(repoCalls(failed.calls), []);
  });
  check('reboot MSI/WinGet codes propagate visibly and stop before auth/clone/init', () => {
    for (const wingetExit of [3010, 1641, -1978334967, -1978334966, -1978334965]) {
      const result = run({ missing: ['gh'], wingetExit });
      assert.equal(result.status >>> 0, wingetExit >>> 0, result.output);
      assert.match(result.output, new RegExp(`Reboot required/reported.*exit code ${wingetExit}`));
      assert.deepEqual(authCalls(result.calls), []);
      assert.deepEqual(repoCalls(result.calls), []);
      assert.doesNotMatch(result.output, /==> Next steps/);
    }
  });
  check('Docker is opt-in, WSL/feature/license preparation is not implicit', () => {
    const result = run({ flags: ['InstallDocker', 'SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    const install = result.calls.find(call => call.tool === 'winget' && call.args[0] === 'install');
    assert.equal(install.args[install.args.indexOf('--id') + 1], 'Docker.DockerDesktop');
    assert.equal(install.args[install.args.indexOf('--override') + 1],
      'install --quiet --backend=wsl-2 --no-windows-containers');
    assert.ok(!install.args.join(' ').includes('--accept-license'));
    assert.ok(!install.args.includes('--accept-package-agreements'));
    assert.ok(result.calls.filter(call => call.tool === 'wsl').every(call => ['--version', '--status'].includes(call.args[0])));
  });
  for (const scenario of [
    { missing: ['docker', 'wsl'], message: /operator-prepared WSL 2/ },
    { missing: ['docker'], wslFeatures: false, message: /enabled WSL and VirtualMachinePlatform/ },
    { missing: ['docker'], wslVersion: '2.1.4', message: /WSL version 2.1.5 or newer/ },
    { missing: ['docker'], wslExit: 42, message: /failed with exit code 42/ }
  ]) {
    check(`Docker blocks missing/unready backend without any installation: ${JSON.stringify(scenario)}`, () => {
      const result = run({ ...scenario, flags: ['InstallDocker', 'SkipLogin'] });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, scenario.message);
      assert.ok(!result.calls.some(call => call.args[0] === 'install'));
      assert.deepEqual(repoCalls(result.calls), []);
    });
  }
  check('installed Docker is not reinstalled or made to initialize WSL', () => {
    const result = run({ missing: [], flags: ['InstallDocker', 'SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    assert.ok(!result.calls.some(call => ['winget', 'wsl'].includes(call.tool) && call.args[0] !== 'list'));
  });
  check('bad/empty inventory and version responses cannot produce a readiness summary', () => {
    for (const options of [{ badInventory: true }, { emptyVersion: 'terraform' }]) {
      const result = run({ ...options, flags: ['SkipLogin'] });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /did not report the exact package|empty version response/);
      assert.deepEqual(repoCalls(result.calls), []);
    }
  });
  check('Squad version mismatch and legacy npm source stop without upgrade/reinit', () => {
    for (const options of [{ squadVersion: '0.13.1' }, { squadVersion: '1.0.10' },
      { flags: ['SquadInstallSource=Npm', 'SkipLogin'] }]) {
      const result = run(options);
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /not the rehearsed version 1\.0\.1|not published as @bradygaster\/squad-cli/);
      assert.deepEqual(repoCalls(result.calls), []);
      assert.ok(!result.calls.some(call => call.args[0] === 'install' || call.args[0] === 'upgrade'));
    }
  });
  check('the zero-auth assertion catches a mutation of the actual SkipLogin gate', () => {
    const original = readFileSync(script, 'utf8');
    const mutated = original.replace("if ($SkipLogin) { Write-Host", "if ($false) { Write-Host");
    assert.notEqual(mutated, original, 'mutate the real source, not a fabricated behavior');
    const result = run({ scriptText: mutated, flags: ['SkipLogin'] });
    assert.equal(result.status, 0, result.output);
    assert.throws(() => assert.deepEqual(authCalls(result.calls), []),
      { name: 'AssertionError' }, 'the zero-auth contract must turn red when its gate is removed');
  });
  check('AllUsers installs exact native core without WinGet/auth/repository and emits a hashed receipt', () => {
    const result = run({ flags: ['AllUsers'], missing: [...tools, 'winget'] });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(authCalls(result.calls), []);
    assert.deepEqual(repoCalls(result.calls), []);
    assert.ok(!result.calls.some(call => call.tool === 'winget' || call.tool === 'aca-installer'));
    const receipt = result.machineReceipt;
    assert.equal(receipt.Core, 'pass');
    assert.equal(receipt.Mode, 'AllUsers');
    assert.equal(receipt.Packages.length, 11);
    assert.equal(receipt.ScriptSha256, createHash('sha256').update(readFileSync(script)).digest('hex').toUpperCase());
    assert.equal(receipt.ManifestSha256, createHash('sha256').update(readFileSync(manifestPath)).digest('hex').toUpperCase());
    assert.ok(receipt.Packages.every(tool => tool.Path.startsWith(result.programFiles)));
    assert.deepEqual(receipt.Packages.map(tool => tool.Tool), tools);
    assert.match(receipt.Authentication, /zero auth/);
    assert.match(receipt.Repository, /no clone\/init\/roster/);
    assert.ok(receipt.DeferredPerUser.some(value => value.includes('desktop')));
    assert.equal(result.repoExists, false);
    assert.deepEqual(result.machineLeftovers, []);
    const downloads = result.calls.filter(call => call.tool === 'download');
    assert.deepEqual(downloads.map(call => call.args[0]), machineManifest.packages.map(info => info.url));
    for (const packageInfo of machineManifest.packages) {
      const hashIndex = result.calls.findIndex(call => call.tool === 'machine-hash' && call.args[0] === packageInfo.id);
      const executionIndex = result.calls.findIndex(call =>
        (call.tool === 'machine-install' && call.args[0] === packageInfo.id) ||
        (call.tool === 'machine-version' && packageInfo.tools.some(tool => tool.name === call.args[0])));
      assert.ok(hashIndex >= 0 && hashIndex < executionIndex, `${packageInfo.id} hash precedes execution`);
    }
    for (const install of result.calls.filter(call => call.tool === 'machine-install')) {
      const argumentsText = install.nativeArgs.join(' ');
      assert.match(argumentsText, /\/norestart/i);
      assert.match(argumentsText, /ALLUSERS/i);
      assert.ok(!argumentsText.includes('ENABLE_PSREMOTING=1'));
    }
    assert.ok(result.calls.every(call => call.tool !== 'machine-acl' ||
      call.args[0].startsWith(result.programFiles) || call.args[0].includes('machine-program-data')));
  });
  check('AllUsers installed machine roots and exact versions avoid downloads/installers and preserve PATH', () => {
    const result = run({ flags: ['AllUsers'], machineInstalled: true });
    assert.equal(result.status, 0, result.output);
    assert.ok(!result.calls.some(call => ['download', 'machine-hash', 'machine-install'].includes(call.tool)));
    assert.equal(result.machineReceipt.Packages.length, 11);
    assert.ok(result.machinePath.includes('C:\\Windows\\System32;C:\\existing-machine-only'));
    assert.ok(result.machinePath.startsWith(result.programFiles), 'shared validated tools precede inherited PATH shadows');
    for (const row of result.machineReceipt.Packages) {
      assert.ok(result.machinePath.split(';').includes(dirname(row.Path)), row.Path);
    }
    assert.ok(!result.machinePath.includes('session-only'));
    assert.ok(!result.machinePath.includes('fixture-home'));
    assert.deepEqual(result.machineLeftovers, []);
  });
  check('AllUsers dry-run requires no tool/privilege proxy and creates no machine artifacts', () => {
    const result = run({ flags: ['AllUsers', 'WhatIf'], missing: [...tools, 'winget', 'whoami'],
      machineElevated: false });
    assert.equal(result.status, 0, result.output);
    assert.deepEqual(result.calls, []);
    assert.equal(result.machineRootExists, false);
    assert.equal(result.machineReceipt, undefined);
    assert.equal(result.machinePath, 'C:\\Windows\\System32;C:\\existing-machine-only');
    assert.match(result.output, /versions NOT verified/);
  });
  check('AllUsers never mistakes user/SYSTEM-profile availability for machine installations', () => {
    const result = run({ flags: ['AllUsers'], userOnlyTools: true });
    assert.equal(result.status, 0, result.output);
    assert.equal(result.calls.filter(call => call.tool === 'download').length, 10);
    assert.ok(result.machineReceipt.Packages.every(row => row.Path.startsWith(result.programFiles)));
    assert.ok(!result.machineReceipt.MachinePath.includes('fixture-home'));
  });
  for (const packageInfo of machineManifest.packages) {
    check(`AllUsers hash mismatch prevents execution: ${packageInfo.id}`, () => {
      const result = run({ flags: ['AllUsers'], machineHashMismatch: packageInfo.id });
      assert.notEqual(result.status, 0, result.output);
      assert.ok(result.output.includes(`${packageInfo.id} SHA-256 mismatch`));
      assert.ok(result.output.includes(packageInfo.url));
      assert.ok(!result.calls.some(call => call.tool === 'machine-install' && call.args[0] === packageInfo.id));
      assert.ok(!result.calls.some(call => call.tool === 'machine-version' &&
        packageInfo.tools.some(tool => tool.name === call.args[0])));
      assert.equal(result.machineReceipt, undefined);
      assert.deepEqual(result.machineLeftovers, []);
      assert.deepEqual(authCalls(result.calls), []);
    });
  }
  check('AllUsers download failure is named and stops before any later package or receipt', () => {
    const result = run({ flags: ['AllUsers'], machineDownloadFailure: 'Git.Git' });
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /Git.Git download failed from https:\/\/github.com/);
    assert.equal(result.calls.at(-1).tool, 'download');
    assert.deepEqual(result.machineLeftovers, []);
    assert.equal(result.machineReceipt, undefined);
  });
  check('AllUsers installer failure, no-op installation and version failures never emit a core PASS', () => {
    for (const options of [
      { machineInstallerExit: 42, message: /Microsoft.PowerShell failed with exit code 42/ },
      { machineInstallNoop: true, message: /Microsoft.PowerShell missing expected machine executable/ },
      { machineVersionFailure: 'pwsh', message: /Microsoft.PowerShell failed with exit code 42/ },
      { machineBadVersion: 'pwsh', message: /Microsoft.PowerShell expected pwsh version 7.6.6/ }
    ]) {
      const result = run({ flags: ['AllUsers'], ...options });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, options.message);
      assert.equal(result.machineReceipt, undefined);
      assert.deepEqual(result.machineLeftovers, []);
      assert.deepEqual(authCalls(result.calls), []);
      assert.deepEqual(repoCalls(result.calls), []);
      assert.doesNotMatch(result.output, /AllUsers core verified locally/);
    }
  });
  check('AllUsers reboot codes propagate without automatic restart and clean owned downloads', () => {
    for (const machineInstallerExit of [3010, 1641]) {
      const result = run({ flags: ['AllUsers'], machineInstallerExit });
      assert.equal(result.status, machineInstallerExit, result.output);
      assert.match(result.output, new RegExp(`Microsoft.PowerShell reboot required/reported.*exit code ${machineInstallerExit}`));
      assert.equal(result.machineReceipt, undefined);
      assert.deepEqual(result.machineLeftovers, []);
      assert.deepEqual(authCalls(result.calls), []);
    }
  });
  check('AllUsers incomplete, wrong-version or unowned portable installations are preserved, not overwritten', () => {
    for (const options of [
      { machineInstalled: true, machineMissingTool: 'npm', message: /OpenJS.NodeJS.LTS incomplete existing machine installation/ },
      { machineInstalled: true, machineBadVersion: 'squad', message: /bradygaster.Squad expected squad version 1.0.1/ },
      { preexistingPortable: true, message: /GitHub.Copilot existing portable directory is incomplete/ }
    ]) {
      const result = run({ flags: ['AllUsers'], ...options });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, options.message);
      assert.equal(result.machineReceipt, undefined);
      assert.deepEqual(result.machineLeftovers, []);
      if (options.preexistingPortable) assert.equal(result.portableSentinel, true);
    }
  });
  for (const zipAttack of ['../escape.exe', '/escape.exe', 'C:/escape.exe', 'safe/file.exe:stream', 'safe/../../escape.exe']) {
    check(`AllUsers ZIP extraction rejects traversal/ADS/rooted entries: ${zipAttack}`, () => {
      const result = run({ flags: ['AllUsers'], zipAttack });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /GitHub.Copilot unsafe ZIP entry/);
      assert.equal(result.traversalEscaped, false);
      assert.equal(result.machineReceipt, undefined);
      assert.deepEqual(result.machineLeftovers, []);
    });
  }
  check('AllUsers ZIP extraction rejects symlinks', () => {
    const result = run({ flags: ['AllUsers'], zipSymlink: true });
    assert.notEqual(result.status, 0, result.output);
    assert.match(result.output, /GitHub.Copilot duplicate\/symlink\/reparse ZIP entry/);
    assert.equal(result.machineReceipt, undefined);
    assert.deepEqual(result.machineLeftovers, []);
  });
  check('AllUsers privilege, Docker and failed machine PATH read-back gates are explicit', () => {
    for (const options of [
      { machineElevated: false, message: /requires an already-elevated Administrator or LocalSYSTEM token/ },
      { flags: ['AllUsers', 'InstallDocker'], message: /AllUsers does not install Docker/ },
      { machineInstalled: true, machinePathNoop: true, message: /Machine PATH read-back failed/ },
      { machineInstalled: true, machineUnsafeAcl: true, message: /directory is writable outside SYSTEM\/Administrators/ }
    ]) {
      const result = run({ flags: ['AllUsers'], ...options });
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, options.message);
      assert.equal(result.machineReceipt, undefined);
      assert.deepEqual(result.machineLeftovers, []);
      assert.deepEqual(authCalls(result.calls), []);
    }
  });
  check('the hash-before-execution assertion catches a mutation of the actual machine hash gate', () => {
    const original = readFileSync(script, 'utf8');
    const controlled = original.replace('if ($actualHash -ne $package.sha256)', 'if ($false)');
    assert.notEqual(controlled, original);
    const result = run({ flags: ['AllUsers'], scriptText: controlled, machineHashMismatch: 'Microsoft.PowerShell' });
    assert.equal(result.status, 0, result.output);
    assert.throws(() => assert.ok(!result.calls.some(call =>
      call.tool === 'machine-install' && call.args[0] === 'Microsoft.PowerShell')),
    { name: 'AssertionError' }, 'removing the real SHA gate must turn the no-execution assertion red');
  });
}
