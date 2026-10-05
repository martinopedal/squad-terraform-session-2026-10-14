import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SKILL = '.github/skills/qualify-agent-setup';
export const MODULE = 'terraform/modules/aks-automatic-corp';
export const TERRAFORM_MCP_COMMAND = 'docker';
export const TERRAFORM_MCP_IMAGE = 'hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5';
export const TERRAFORM_MCP_ARGS = ['run', '-i', '--rm', TERRAFORM_MCP_IMAGE, '--toolsets=registry'];
export const LEARN_TOOLS = ['microsoft_docs_search', 'microsoft_docs_fetch'];
export const TERRAFORM_TOOLS = [
  'search_providers', 'get_provider_details', 'get_latest_provider_version',
  'search_modules', 'get_module_details', 'get_latest_module_version',
];
export const PROFILES = {
  'terraform-coder': [
    'read', 'search', 'edit',
    ...LEARN_TOOLS.map(tool => `microsoft-learn/${tool}`),
    ...TERRAFORM_TOOLS.map(tool => `terraform/${tool}`),
  ],
  'terraform-validator': ['read', 'search', 'execute'],
  'terraform-reviewer': [
    'read', 'search',
    ...LEARN_TOOLS.map(tool => `microsoft-learn/${tool}`),
    ...TERRAFORM_TOOLS.map(tool => `terraform/${tool}`),
  ],
};
export const SHARED_FILES = [
  'CONTRIBUTING.md',
  '.github/copilot-instructions.md',
  '.github/instructions/terraform.instructions.md',
  '.github/pull_request_template.md',
  ...Object.keys(PROFILES).map(name => `.github/agents/${name}.agent.md`),
  `${SKILL}/SKILL.md`,
  `${SKILL}/check.mjs`,
  `${SKILL}/check.test.mjs`,
];
export const COMMON_FILES = ['AGENTS.md', 'README.md', '.gitignore', ...SHARED_FILES];
export const MODULE_FILES = [
  'main.tf', 'variables.tf', 'outputs.tf', 'terraform.tf',
  'tests/contract.tftest.hcl', 'examples/corp-existing/README.md',
];
export const SESSION_FILES = [
  'QUALITY.md', 'PUBLICATION.md', 'docs/demo-runbook.md',
  '.github/agents/squad.agent.md', '.squad/team.md', '.squad/routing.md',
  '.squad/agents/lead/charter.md', '.squad/agents/reviewer/charter.md',
];
const coder = '.github/agents/terraform-coder.agent.md';
const validator = '.github/agents/terraform-validator.agent.md';
const reviewer = '.github/agents/terraform-reviewer.agent.md';
const terraform = '.github/instructions/terraform.instructions.md';
const skill = `${SKILL}/SKILL.md`;
export const REQUIRED_LINKS = {
  'AGENTS.md': ['CONTRIBUTING.md', coder, validator, reviewer],
  'README.md': ['CONTRIBUTING.md', coder, validator, reviewer],
  'CONTRIBUTING.md': ['AGENTS.md', coder, validator, reviewer, skill],
  '.github/copilot-instructions.md': ['AGENTS.md', 'CONTRIBUTING.md', terraform],
  [terraform]: ['AGENTS.md', 'CONTRIBUTING.md'],
  '.github/pull_request_template.md': ['CONTRIBUTING.md'],
  [coder]: ['AGENTS.md', 'CONTRIBUTING.md', terraform, skill],
  [validator]: ['AGENTS.md', 'CONTRIBUTING.md', terraform, skill],
  [reviewer]: ['AGENTS.md', 'CONTRIBUTING.md', terraform, skill],
  [skill]: ['CONTRIBUTING.md', `${SKILL}/check.mjs`, `${SKILL}/check.test.mjs`],
};
export const SESSION_LINKS = {
  '.squad/team.md': [coder, validator, reviewer],
  '.squad/routing.md': [coder, validator, reviewer, 'CONTRIBUTING.md'],
  '.squad/agents/lead/charter.md': [coder],
  '.squad/agents/reviewer/charter.md': [reviewer],
  'docs/demo-runbook.md': ['CONTRIBUTING.md', validator],
};
const terraformScope = '**/*.tf,**/*.tfvars,**/*.tfvars.json,**/*.tfvars.example,**/*.tfvars.json.example,**/*.tftest.hcl,**/.terraform.lock.hcl';

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function sameArray(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function logicalPath(value) {
  const result = value.replaceAll('\\', '/');
  requireCondition(result && !isAbsolute(value) && !result.includes(':')
    && result.split('/').every(part => part && part !== '.' && part !== '..'),
  `Invalid source path: ${value}`);
  return result;
}

function safePath(root, file) {
  let target = resolve(root);
  for (const part of logicalPath(file).split('/')) {
    target = join(target, part);
    requireCondition(existsSync(target), `Missing file or link target: ${file}`);
    requireCondition(!lstatSync(target).isSymbolicLink(), `Symbolic link not allowed in checked source: ${file}`);
  }
  return target;
}

function bytes(root, file) {
  const target = safePath(root, file);
  requireCondition(lstatSync(target).isFile(), `Expected regular file: ${file}`);
  return readFileSync(target);
}

export function sourceFiles(root) {
  const output = execFileSync('git', [
    '-C', resolve(root), 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '.',
  ], { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  return [...new Set(output.split('\0').filter(Boolean).map(logicalPath))].sort();
}

export function checkPublicPaths(files, kind) {
  for (const source of files) {
    const file = logicalPath(source).toLowerCase();
    const parts = file.split('/');
    const name = parts.at(-1);
    const privateDirectory = parts.some(part => [
      '.git', '.copilot', '.azure', '.terraform', '.agentic-checks', '.validation',
      'node_modules', '__pycache__', '.cache', 'private', 'archive', 'workstreams', 'recordings',
    ].includes(part));
    const privateHandoff = name === 'handoff.md' && !(kind === 'session' && file === 'handoff.md');
    const privateName = privateHandoff || (name.startsWith('.env') && name !== '.env.example')
      || /(?:\.tfstate(?:\..*)?|\.tfplan(?:\.json)?|\.tfvars(?:\.json)?|\.tfbackend|\.backend\.hcl|\.pem|\.pfx|\.p12|\.key|\.tfrc)$/.test(name)
      || /^(?:backend\.hcl|tfplan|\.terraformrc|terraform\.rc|\.?mcp\.json|kubeconfig.*|id_rsa|id_ed25519)$/.test(name);
    const privateState = /(?:^|\/)\.squad\/(?:log|orchestration-log|sessions|\.scratch|\.cache|decisions\/inbox)\//.test(file)
      || /(?:^|\/)\.squad\/memory\/(?:index\.json|audit\.jsonl)$/.test(file)
      || (kind === 'module' && parts.includes('.squad'));
    requireCondition(!privateDirectory && !privateName && !privateState,
      `Private/local source path is not publishable: ${source}`);
  }
}

function parseScalar(value, file) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Invalid JSON-compatible YAML value: ${file}`);
  }
}

function parseBlock(lines, index, file) {
  const result = {};
  while (index < lines.length) {
    const server = lines[index].match(/^  ([a-zA-Z0-9_-]+):\s*$/);
    if (!server) break;
    requireCondition(!Object.hasOwn(result, server[1]), `Duplicate MCP server entry: ${file}`);
    index += 1;
    const config = {};
    while (index < lines.length) {
      if (/^[^\s]/.test(lines[index]) || /^  [a-zA-Z0-9_-]+:\s*$/.test(lines[index])) break;
      const property = lines[index].match(/^    ([a-zA-Z][a-zA-Z-]*): (.+)$/);
      requireCondition(property, `Unsupported mcp-servers entry: ${file}`);
      requireCondition(!Object.hasOwn(config, property[1]), `Duplicate MCP server property: ${file}`);
      config[property[1]] = parseScalar(property[2], file);
      index += 1;
    }
    result[server[1]] = config;
  }
  requireCondition(Object.keys(result).length > 0, `Empty mcp-servers block: ${file}`);
  return { value: result, next: index };
}

// Deliberately a small YAML subset, not a general YAML or CLI parser.
export function frontmatter(text, allowedKeys, file, requiredKeys = allowedKeys) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  requireCondition(match, `Missing frontmatter: ${file}`);
  const result = {};
  const lines = match[1].split(/\r?\n/);
  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    requireCondition(line.trim().length > 0, `Unsupported blank frontmatter entry: ${file}`);
    const block = line.match(/^([a-zA-Z][a-zA-Z-]*):\s*$/);
    if (block) {
      requireCondition(allowedKeys.includes(block[1]), `Unsupported frontmatter entry: ${file}`);
      requireCondition(!Object.hasOwn(result, block[1]), `Duplicate frontmatter key: ${file}`);
      const parsed = parseBlock(lines, index + 1, file);
      result[block[1]] = parsed.value;
      index = parsed.next;
      continue;
    }
    const entry = line.match(/^([a-zA-Z][a-zA-Z-]*): (.+)$/);
    requireCondition(entry && allowedKeys.includes(entry[1]), `Unsupported frontmatter entry: ${file}`);
    requireCondition(!Object.hasOwn(result, entry[1]), `Duplicate frontmatter key: ${file}`);
    result[entry[1]] = parseScalar(entry[2], file);
    index += 1;
  }
  requireCondition(requiredKeys.every(key => Object.hasOwn(result, key)), `Missing required frontmatter key: ${file}`);
  const body = text.slice(match[0].length).trim();
  requireCondition(body.length > 0 && body.length <= 30000, `Missing or oversized prompt: ${file}`);
  return result;
}

function localLinks(root, file) {
  const text = bytes(root, file).toString('utf8');
  const links = new Set();
  for (const match of text.matchAll(/\[[^\]\r\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const destination = match[1];
    if (/^https?:\/\//i.test(destination) || destination.startsWith('#')) continue;
    requireCondition(!/^[a-z][a-z0-9+.-]*:/i.test(destination),
      `Unsupported link scheme: ${file}`);
    const target = resolve(dirname(join(root, ...file.split('/'))),
      decodeURIComponent(destination.split('#')[0]).replaceAll('/', sep));
    const rel = relative(resolve(root), target);
    requireCondition(rel && !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`),
      `Link escapes public root: ${file}`);
    const logical = logicalPath(rel);
    safePath(root, logical);
    links.add(logical);
  }
  return links;
}

function validateMcpServers(config, file) {
  const servers = config['mcp-servers'];
  requireCondition(servers && typeof servers === 'object' && !Array.isArray(servers), `Missing mcp-servers: ${file}`);
  requireCondition(sameArray(Object.keys(servers).sort(), ['microsoft-learn', 'terraform']),
    `MCP server allowlist mismatch: ${file}`);
  for (const [serverName, server] of Object.entries(servers)) {
    requireCondition(!Object.hasOwn(server, 'env'), `MCP server must not declare env or secrets: ${file}`);
    requireCondition(!Object.keys(server).some(key => /secret|token|password/i.test(key)),
      `MCP server must not declare secrets: ${file}`);
    requireCondition(Object.values(server).every(value => !JSON.stringify(value).match(/secrets\.|\$\{|TOKEN|SECRET|PASSWORD/i)),
      `MCP server must not reference secrets or environment variables: ${file}`);
    if (serverName === 'microsoft-learn') {
      requireCondition(server.type === 'http' && server.url === 'https://learn.microsoft.com/api/mcp',
        `Microsoft Learn MCP server must use the exact public endpoint: ${file}`);
      requireCondition(sameArray(server.tools, LEARN_TOOLS), `Microsoft Learn MCP tools changed: ${file}`);
    } else {
      requireCondition(server.type === 'stdio' && server.command === TERRAFORM_MCP_COMMAND,
        `Terraform MCP server must use docker stdio with the pinned image: ${file}`);
      requireCondition(Array.isArray(server.args), `Terraform MCP args missing: ${file}`);
      requireCondition(sameArray(server.args, TERRAFORM_MCP_ARGS),
        `Terraform MCP docker args changed from reviewed pinned registry-only launch: ${file}`);
      requireCondition(!['npx', 'uvx', 'cmd', 'powershell', 'pwsh', 'sh', 'bash'].includes(server.command),
        `Terraform MCP server must not use a wrapper command: ${file}`);
      requireCondition(!server.args.some(arg => /^-e$|^--env(?:=|$)|^-v$|^--volume(?:=|$)|^--network$|^--network=host$|^--privileged$/.test(arg)),
        `Terraform MCP docker args must not expose env, volumes, host networking, or privileged mode: ${file}`);
      requireCondition(server.args.includes(TERRAFORM_MCP_IMAGE) && TERRAFORM_MCP_IMAGE.includes('@sha256:'),
        `Terraform MCP Docker image must include the reviewed tag and digest: ${file}`);
      requireCondition(!server.args.some(arg => /^hashicorp\/terraform-mcp-server(?::latest|:1\.3\.0)?$/.test(arg)),
        `Terraform MCP Docker image must not be unpinned, latest, or missing a digest: ${file}`);
      requireCondition(!server.args.some(arg => arg.startsWith('--toolsets=') && arg !== '--toolsets=registry'),
        `Terraform MCP server must use only the registry toolset: ${file}`);
      requireCondition(sameArray(server.tools, TERRAFORM_TOOLS), `Terraform MCP tools changed: ${file}`);
    }
  }
}

function validateProfile(config, name, expectedTools, file) {
  requireCondition(config.name === name && typeof config.description === 'string'
    && config.description.trim().length > 0, `Invalid agent identity: ${file}`);
  requireCondition(sameArray(config.tools, expectedTools),
    `Tool allowlist must be exactly ${expectedTools.join(', ')}: ${file}`);
  if (name === 'terraform-validator') {
    requireCondition(config['disable-model-invocation'] === true,
      `Validator must set disable-model-invocation: true: ${file}`);
    requireCondition(!Object.hasOwn(config, 'mcp-servers'), `Validator must not configure mcp-servers: ${file}`);
  } else {
    requireCondition(!Object.hasOwn(config, 'disable-model-invocation'),
      `Only the validator should set disable-model-invocation: ${file}`);
    validateMcpServers(config, file);
  }
}

export function checkRepository(root, files = sourceFiles(root)) {
  root = resolve(root);
  const moduleHere = existsSync(join(root, 'main.tf'));
  const moduleBelow = existsSync(join(root, ...MODULE.split('/'), 'main.tf'));
  requireCondition(moduleHere !== moduleBelow, 'Expected one public module or session root, not an ambiguous/private workspace');
  const kind = moduleHere ? 'module' : 'session';
  checkPublicPaths(files, kind);
  const required = [...COMMON_FILES, ...(kind === 'module' ? MODULE_FILES : SESSION_FILES)];
  for (const file of required) {
    requireCondition(files.includes(file), `Required public source missing from Git-selected inventory: ${file}`);
    safePath(root, file);
  }
  for (const [name, tools] of Object.entries(PROFILES)) {
    const file = `.github/agents/${name}.agent.md`;
    requireCondition(!files.includes(`.github/agents/${name}.md`), `Duplicate native agent filename: ${name}`);
    const config = frontmatter(bytes(root, file).toString('utf8'),
      ['name', 'description', 'tools', 'disable-model-invocation', 'mcp-servers'], file,
      ['name', 'description', 'tools']);
    validateProfile(config, name, tools, file);
  }
  const skillConfig = frontmatter(bytes(root, skill).toString('utf8'), ['name', 'description'], skill);
  requireCondition(skillConfig.name === 'qualify-agent-setup'
    && typeof skillConfig.description === 'string' && skillConfig.description.trim(),
  'Invalid skill identity');
  const scope = frontmatter(bytes(root, terraform).toString('utf8'), ['applyTo'], terraform);
  requireCondition(scope.applyTo === terraformScope, 'Terraform instruction scope differs from the reviewed file types');
  const edges = { ...REQUIRED_LINKS, ...(kind === 'session' ? SESSION_LINKS : {}) };
  for (const [file, targets] of Object.entries(edges)) {
    const actual = localLinks(root, file);
    for (const target of targets) {
      requireCondition(actual.has(target), `Required guidance link missing: ${file} -> ${target}`);
    }
  }
  requireCondition(bytes(root, '.gitignore').toString('utf8').split(/\r?\n/).includes('.agentic-checks/'),
    'Disposable .agentic-checks/ copies must be ignored');
  const moduleRoot = kind === 'module' ? root : join(root, ...MODULE.split('/'));
  if (kind === 'session') {
    const nestedFiles = files.filter(file => file.startsWith(`${MODULE}/`)).map(file => file.slice(MODULE.length + 1));
    checkRepository(moduleRoot, nestedFiles);
    for (const file of SHARED_FILES) {
      requireCondition(bytes(root, file).equals(bytes(moduleRoot, file)), `Session/module agent setup drift: ${file}`);
    }
  }
  return { outcome: 'pass', kind, configuredFiles: required.length, moduleRoot };
}

export function compareModules(left, right, leftFiles = sourceFiles(left), rightFiles = sourceFiles(right)) {
  requireCondition(realpathSync(left) !== realpathSync(right), 'Mirror must be a distinct module checkout');
  requireCondition(checkRepository(left, leftFiles).kind === 'module'
    && checkRepository(right, rightFiles).kind === 'module', 'Compare module roots, not entire session repositories');
  const a = [...leftFiles].sort();
  const b = [...rightFiles].sort();
  requireCondition(JSON.stringify(a) === JSON.stringify(b), 'Module source inventory differs (missing or extra public files)');
  for (const file of a) {
    requireCondition(bytes(left, file).equals(bytes(right, file)), `Module source drift: ${file}`);
  }
  return a.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    requireCondition(args.length === 0 || (args.length === 2 && args[0] === '--mirror' && !args[1].startsWith('--')),
      'Usage: node check.mjs [--mirror <independent-module-or-source-copy-path>]');
    const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
    const result = checkRepository(root);
    if (args.length) result.identicalModuleFiles = compareModules(result.moduleRoot, resolve(args[1]));
    console.log(JSON.stringify({ ...result, limitation: 'Static readiness only; native selection, MCP startup, independent review, hosted CI and Azure remain separate.' }));
  } catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  }
}
