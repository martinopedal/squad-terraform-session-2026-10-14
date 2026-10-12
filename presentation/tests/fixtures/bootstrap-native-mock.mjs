import { appendFileSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [tool, ...args] = process.argv.slice(2);
const state = JSON.parse(readFileSync(process.env.MOCK_STATE, 'utf8').replace(/^\uFEFF/, ''));
const key = `${tool} ${args[0]}`;
appendFileSync(process.env.MOCK_LOG, JSON.stringify({ tool, args, path: process.env.PATH,
  cwd: process.cwd() }) + '\n');
const save = () => writeFileSync(process.env.MOCK_STATE, JSON.stringify(state));
if (key === 'git clone') mkdirSync(args.at(-1), { recursive: true });
if (key === state.failure || `${key} ${args[1]}` === state.failure) {
  console.error('safe native probe failed');
  process.exit(42);
}
if (key === 'winget list') {
  if (!state.appInstalled) process.exit(-1978335212);
  console.log(state.badInventory ? 'Other.Package 9.0' : 'GitHub.CopilotApp 1.1.28');
} else if (key === 'winget install') {
  const id = args[args.indexOf('--id') + 1];
  if (![0, -1978335189].includes(state.wingetExit)) process.exit(state.wingetExit);
  if (!state.installNoop) {
    const commands = {
      'Git.Git': ['git'], 'Microsoft.VisualStudioCode': ['code'],
      'GitHub.Copilot': ['copilot'], 'Microsoft.AzureCLI': ['az'],
      'GitHub.cli': ['gh'], 'Hashicorp.Terraform': ['terraform'],
      'OpenJS.NodeJS.LTS': ['node', 'npm'], 'Microsoft.PowerShell': ['pwsh'],
      'bradygaster.Squad': ['squad'], 'Docker.DockerDesktop': ['docker']
    };
    if (id === 'GitHub.CopilotApp') state.appInstalled = true;
    state.missing = state.missing.filter(name => !(commands[id] ?? []).includes(name));
    save();
  }
  process.exit(state.wingetExit);
} else if (key === 'aca-installer install') {
  if (state.installerThrow) throw new Error('safe installer terminating failure');
  if (!state.installNoop) {
    state.missing = state.missing.filter(name => name !== 'aca');
    save();
  }
  process.exit(state.acaInstallerExit);
} else if (tool === 'git' && args.includes('rev-parse')) {
  if (state.repoExit) process.exit(state.repoExit);
  console.log('true');
} else if (key === 'git clone') {
  // The staging directory was created before the failure gate.
} else if (key === 'squad init') {
  mkdirSync('.squad', { recursive: true });
  writeFileSync(join('.squad', 'fixture-squad'), 'new mock state');
} else if ((key === 'gh auth' || key === 'aca auth') && args[1] === 'status') {
  process.exit(state.auth[tool]);
} else if (key === 'az account') {
  process.exit(state.auth.az);
} else if (key === 'copilot login' ||
  ((tool === 'gh' || tool === 'aca') && args[1] === 'login') || key === 'az login') {
  if (!state.authNoop) state.auth[tool] = 0;
  save();
} else if (tool === 'wsl') {
  if (args[0] === '--status') process.exit(state.wslExit);
  console.log(`WSL version: ${state.wslVersion}`);
} else if (tool === 'whoami') {
  console.log('"Administrators","Group","S-1-5-32-544","Enabled"');
  console.log(`"Integrity","Label","S-1-16-${state.machineElevated ? '16384' : '8192'}","Mandatory"`);
} else if (tool === 'az' && args[0] === 'version') {
  console.log(JSON.stringify({ 'azure-cli': '2.91.0' }));
} else if (tool === 'pwsh') {
  console.log('7.6.6');
} else if (args[0] === '--version') {
  if (state.emptyVersion === tool) process.exit(0);
  console.log(tool === 'squad' ? state.squadVersion : `${tool} mock 1.0.0`);
} else {
  throw new Error(`Unexpected mocked command: ${tool} ${args.join(' ')}`);
}
