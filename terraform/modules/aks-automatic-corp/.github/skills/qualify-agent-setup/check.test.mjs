import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import {
  copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync,
  symlinkSync, writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  COMMON_FILES, MODULE, SESSION_FILES, SESSION_LINKS, SHARED_FILES, SKILL,
  checkPublicPaths, checkRepository, compareModules, sourceFiles,
} from './check.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const moduleRoot = existsSync(join(root, 'main.tf')) ? root : join(root, ...MODULE.split('/'));
const fixtureFiles = sourceFiles(moduleRoot).filter(file => !file.startsWith('.github/workflows/'));
checkPublicPaths(fixtureFiles, 'module');
const coder = '.github/agents/terraform-coder.agent.md';
const validator = '.github/agents/terraform-validator.agent.md';
const reviewer = '.github/agents/terraform-reviewer.agent.md';

function path(rootPath, file) {
  return join(rootPath, ...file.split('/'));
}

function write(rootPath, file, content) {
  const target = path(rootPath, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

function change(rootPath, file, before, after) {
  const text = readFileSync(path(rootPath, file), 'utf8');
  if (before instanceof RegExp) {
    assert.ok(before.test(text), `Mutation anchor missing: ${file}`);
    write(rootPath, file, text.replace(before, after));
    return;
  }
  const crlfBefore = before.replaceAll('\n', '\r\n');
  const actualBefore = text.includes(before) ? before : crlfBefore;
  assert.ok(text.includes(actualBefore), `Mutation anchor missing: ${file}`);
  const actualAfter = actualBefore === crlfBefore ? after.replaceAll('\n', '\r\n') : after;
  write(rootPath, file, text.replace(actualBefore, actualAfter));
}

function inventory(rootPath, prefix = '') {
  return readdirSync(path(rootPath, prefix), { withFileTypes: true }).flatMap(entry => {
    const file = prefix ? `${prefix}/${entry.name}` : entry.name;
    return entry.isDirectory() ? inventory(rootPath, file) : [file];
  }).sort();
}

function area(t) {
  const parent = join(root, '.agentic-checks');
  mkdirSync(parent, { recursive: true });
  const folder = join(parent, randomUUID());
  mkdirSync(folder);
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  return folder;
}

function moduleCopy(folder) {
  mkdirSync(folder, { recursive: true });
  for (const file of fixtureFiles) {
    const target = path(folder, file);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(path(moduleRoot, file), target);
  }
  return folder;
}

function fixture(t) {
  return moduleCopy(join(area(t), 'module'));
}

function sessionFixture(t) {
  const folder = join(area(t), 'session');
  moduleCopy(path(folder, MODULE));
  for (const file of COMMON_FILES) write(folder, file, readFileSync(path(moduleRoot, file)));
  write(folder, 'README.md', `# Session fixture

[Contribute](CONTRIBUTING.md)
[Coder](${coder})
[Validator](${validator})
[Reviewer](${reviewer})
`);
  write(folder, 'AGENTS.md', `# Public fixture

[Contribute](CONTRIBUTING.md)
[Coder](${coder})
[Validator](${validator})
[Reviewer](${reviewer})
`);
  for (const file of SESSION_FILES) {
    const links = (SESSION_LINKS[file] ?? []).map(target =>
      `[Guidance](${relative(dirname(path(folder, file)), path(folder, target)).replaceAll('\\', '/')})`);
    write(folder, file, `# Public session fixture

${links.join('\n')}
`);
  }
  return folder;
}

test('real checkout has a complete public native setup', () => {
  assert.equal(checkRepository(root).outcome, 'pass');
});

test('standalone module and session-root fixtures both qualify', t => {
  const module = fixture(t);
  const session = sessionFixture(t);
  assert.equal(checkRepository(module, inventory(module)).kind, 'module');
  assert.equal(checkRepository(session, inventory(session)).kind, 'session');
});

for (const [name, file, before, after, expected] of [
  ['wildcard coder tools', coder, /^tools: \[.*\]\r?\n/m, 'tools: ["*"]\n', /Tool allowlist/],
  ['implicit all-tools fallback', coder, /^tools: \[.*\]\r?\n/m, '', /Missing required frontmatter key/],
  ['validator edit grant', validator, '["read", "search", "execute"]', '["read", "search", "execute", "edit"]', /Tool allowlist/],
  ['coder shell grant', coder, '"terraform/get_latest_module_version"]', '"terraform/get_latest_module_version", "execute"]', /Tool allowlist/],
  ['reviewer shell grant', reviewer, '"terraform/get_latest_module_version"]', '"terraform/get_latest_module_version", "execute"]', /Tool allowlist/],
  ['reviewer edit grant', reviewer, '["read", "search", "microsoft-learn/microsoft_docs_search"', '["read", "search", "edit", "microsoft-learn/microsoft_docs_search"', /Tool allowlist/],
  ['coder delegation grant', coder, '"terraform/get_latest_module_version"]', '"terraform/get_latest_module_version", "agent"]', /Tool allowlist/],
  ['unrecognized tool alias', coder, '"edit", "microsoft-learn/microsoft_docs_search"', '"apply_patch", "microsoft-learn/microsoft_docs_search"', /Tool allowlist/],
  ['invented YAML property', coder, 'tools: [', 'permissions: "all"\ntools: [', /Unsupported frontmatter entry/],
  ['duplicate tool key', coder, 'tools: [', 'tools: []\ntools: [', /Duplicate frontmatter key/],
  ['malformed YAML subset', validator, '["read", "search", "execute"]', "['read', 'search', 'execute']", /Invalid JSON-compatible YAML value/],
  ['skill pre-approval', `${SKILL}/SKILL.md`, 'name: "qualify-agent-setup"', 'name: "qualify-agent-setup"\nallowed-tools: "shell"', /Unsupported frontmatter entry/],
  ['missing test-file instruction scope', '.github/instructions/terraform.instructions.md', '**/*.tftest.hcl,', '', /instruction scope/],
  ['broken profile link', 'AGENTS.md', '.github/agents/terraform-coder.agent.md', '.github/agents/missing.agent.md', /Missing file or link target/],
  ['private-root link escape', 'AGENTS.md', '.github/agents/terraform-coder.agent.md', '../private.md', /Link escapes public root/],
  ['disposable-copy ignore removal', '.gitignore', '.agentic-checks/', '.other-copies/', /must be ignored/],
]) {
  test(`rejects ${name} in a disposable copy`, t => {
    const folder = fixture(t);
    change(folder, file, before, after);
    assert.throws(() => checkRepository(folder, inventory(folder)), expected);
  });
}

for (const [name, before, after, expected] of [
  ['MCP server not on allowlist', 'mcp-servers:\n  microsoft-learn:', 'mcp-servers:\n  private-docs:\n    type: "http"\n    url: "https://example.invalid/mcp"\n    tools: ["read_secret"]\n  microsoft-learn:', /MCP server allowlist/],
  ['missing Terraform MCP digest', 'hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5', 'hashicorp/terraform-mcp-server:1.3.0', /pinned registry-only launch|missing a digest|tag and digest/],
  ['latest Terraform MCP image', 'hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5', 'hashicorp/terraform-mcp-server:latest', /pinned registry-only launch|latest|missing a digest/],
  ['npx Terraform MCP wrapper', '    command: "docker"', '    command: "npx"', /docker stdio/],
  ['docker env flag', '["run", "-i", "--rm",', '["run", "-i", "--rm", "-e", "TFE_TOKEN=x",', /pinned registry-only launch|env/],
  ['docker volume flag', '["run", "-i", "--rm",', '["run", "-i", "--rm", "-v", "C:/x:/x",', /pinned registry-only launch|volumes/],
  ['docker host network flag', '["run", "-i", "--rm",', '["run", "-i", "--rm", "--network=host",', /pinned registry-only launch|host networking/],
  ['docker privileged flag', '["run", "-i", "--rm",', '["run", "-i", "--rm", "--privileged",', /pinned registry-only launch|privileged/],
  ['extra Terraform MCP toolset', '"--toolsets=registry"', '"--toolsets=registry,terraform"', /pinned registry-only launch|registry toolset/],
  ['non-Learn HTTP MCP URL', 'url: "https://learn.microsoft.com/api/mcp"', 'url: "https://example.invalid/mcp"', /Microsoft Learn MCP server must use the exact public endpoint/],
  ['env secret on MCP server', '    command: "docker"', '    command: "docker"\n    env: {"TFE_TOKEN":"${{ secrets.TFE_TOKEN }}"}', /env or secrets|secrets or environment/],
  ['extra Terraform MCP workspace tool', '"get_latest_module_version"]', '"get_latest_module_version", "list_workspaces"]', /Terraform MCP tools changed/],
]) {
  test(`rejects ${name} in a disposable copy`, t => {
    const folder = fixture(t);
    change(folder, coder, before, after);
    assert.throws(() => checkRepository(folder, inventory(folder)), expected);
  });
}

test('rejects validator with mcp-servers', t => {
  const folder = fixture(t);
  change(folder, validator, 'disable-model-invocation: true\n---', 'disable-model-invocation: true\nmcp-servers:\n  microsoft-learn:\n    type: "http"\n    url: "https://learn.microsoft.com/api/mcp"\n    tools: ["microsoft_docs_search"]\n---');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Validator must not configure mcp-servers/);
});

test('rejects validator without manual-only selection', t => {
  const folder = fixture(t);
  change(folder, validator, 'disable-model-invocation: true\n', '');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Validator must set disable-model-invocation/);
});

test('rejects missing root profiles even when the nested module has them', t => {
  const folder = sessionFixture(t);
  rmSync(path(folder, coder));
  assert.throws(() => checkRepository(folder, inventory(folder)), /Required public source missing.*terraform-coder/);
});

test('missing-tools mutation is meaningful with LF and CRLF profiles', t => {
  for (const newline of ['\n', '\r\n']) {
    const folder = fixture(t);
    const text = readFileSync(path(folder, coder), 'utf8').replace(/\r?\n/g, newline);
    write(folder, coder, text);
    assert.equal(checkRepository(folder, inventory(folder)).outcome, 'pass');
    change(folder, coder, /^tools: \[.*\]\r?\n/m, '');
    assert.throws(() => checkRepository(folder, inventory(folder)), /Missing required frontmatter key/);
  }
});

test('rejects same-stem legacy profile that could shadow native selection', t => {
  const folder = fixture(t);
  write(folder, '.github/agents/terraform-coder.md', '# Duplicate fixture');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Duplicate native agent filename/);
});

test('rejects session and nested-module shared-profile drift', t => {
  const folder = sessionFixture(t);
  change(folder, coder, '# Bounded Terraform coding specialist', '# Different coding prompt');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Session\/module agent setup drift/);
});

test('rejects a missing Squad handoff link without replacing Squad', t => {
  const folder = sessionFixture(t);
  write(folder, '.squad/routing.md', '# Routes without the native handoff');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Required guidance link missing: \.squad\/routing.md/);
});

test('rejects private/local publication paths before inspecting their contents', t => {
  const folder = fixture(t);
  for (const file of ['.mcp.json', '.env.local', 'real.tfvars', 'saved.tfplan', '.squad/agents/lead/history.md']) {
    write(folder, file, 'Synthetic boundary fixture only');
    assert.throws(() => checkRepository(folder, inventory(folder)), /Private\/local source path/);
    rmSync(path(folder, file));
  }
});

test('allows only the session-root public handoff name, not module or nested handoffs', t => {
  const folder = sessionFixture(t);
  write(folder, 'handoff.md', '# Synthetic public project handoff');
  assert.equal(checkRepository(folder, inventory(folder)).kind, 'session');
  write(folder, `${MODULE}/handoff.md`, '# Synthetic misplaced handoff');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Private\/local source path/);
  const module = fixture(t);
  write(module, 'handoff.md', '# Synthetic coordinator handoff');
  assert.throws(() => checkRepository(module, inventory(module)), /Private\/local source path/);
});

test('rejects links through a directory junction or symbolic link', t => {
  const folder = fixture(t);
  const external = join(dirname(folder), 'outside');
  mkdirSync(external);
  write(external, 'notice.md', 'Synthetic outside-root fixture');
  symlinkSync(external, path(folder, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
  change(folder, 'AGENTS.md', '.github/agents/terraform-coder.agent.md', 'linked/notice.md');
  assert.throws(() => checkRepository(folder, inventory(folder)), /Symbolic link not allowed/);
});

test('compares full module inventories and detects drift and missing files', t => {
  const folder = area(t);
  const left = moduleCopy(join(folder, 'left'));
  const right = moduleCopy(join(folder, 'right'));
  assert.equal(compareModules(left, right, inventory(left), inventory(right)), fixtureFiles.length);
  const readme = readFileSync(path(right, 'README.md'));
  write(right, 'README.md', Buffer.concat([readme, Buffer.from('\nDrift fixture.\n')]));
  assert.throws(() => compareModules(left, right, inventory(left), inventory(right)), /Module source drift: README.md/);
  write(right, 'README.md', readme);
  rmSync(path(right, '.tflint.hcl'));
  assert.throws(() => compareModules(left, right, inventory(left), inventory(right)), /Module source inventory differs/);
});

test('a mirror cannot be the same checkout', t => {
  const folder = fixture(t);
  assert.throws(() => compareModules(folder, folder, inventory(folder), inventory(folder)), /distinct module checkout/);
});

test('required source excluded from the publication inventory fails', t => {
  const folder = fixture(t);
  assert.throws(() => checkRepository(folder, inventory(folder).filter(file => file !== coder)),
    /Required public source missing/);
});

test('CLI rejects unsupported arguments with a nonzero exit', () => {
  assert.throws(() => execFileSync(process.execPath, [path(root, `${SKILL}/check.mjs`), '--approve-all'],
    { stdio: 'pipe' }), error => error.status === 1 && error.stderr.toString().includes('Usage:'));
});

test('portable shared files include the checker, tests, and all three profiles', () => {
  for (const file of [coder, validator, reviewer, `${SKILL}/check.mjs`, `${SKILL}/check.test.mjs`]) {
    assert.ok(SHARED_FILES.includes(file));
  }
});
