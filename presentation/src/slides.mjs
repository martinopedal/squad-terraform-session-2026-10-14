import { hero, layers, corp, memory, consumption, agentSetup } from './diagrams.mjs';

export const title = 'From prompt to reusable Terraform: Copilot CLI and Squad';
export const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const code = (value, label, language = 'hcl') => `<div class="code-panel"><p class="code-label">${escape(label)}</p><pre><code class="language-${language}">${escape(value)}</code></pre></div>`;
const fig = value => `<figure class="figure-svg">${value}</figure>`;
const source = (label, url) => ({ label, url });
const cli = source('Copilot CLI', 'https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli');
const squad = source('Squad source', 'https://github.com/bradygaster/squad/tree/93aec83accb44e08c39e4a799f13b55208215a13');
const upstream = source('Pinned public source', 'https://github.com/martinopedal/terraform-azapi-aks-automatic/tree/e9a9a481b9b5bf3a4af8046cb602895c89a9ac24');
const automatic = source('Private Automatic guidance', 'https://learn.microsoft.com/en-us/azure/aks/automatic/quick-automatic-private-custom-network');
const tests = source('Terraform tests', 'https://developer.hashicorp.com/terraform/language/tests');
const tfplan = source('Terraform plan', 'https://developer.hashicorp.com/terraform/cli/commands/plan');
const guide = source('Feature guide', '../docs/feature-guide.md');
const whatsNew = source('What is new', '../docs/whats-new.md');
const onlineDemo = source('Online variant', '../docs/online-demo.md');
const promptPack = source('Prompt pack', '../docs/prompt-pack.md');
const securityCase = source('Security case', '../docs/security-case.md');
const upstreamRepo = source('Module repository', 'https://github.com/martinopedal/terraform-azapi-aks-automatic');
const demoEnvRepo = source('Demo environment repository', 'https://github.com/martinopedal/aks-automatic-demo-env');
const cliGA = source('Copilot CLI GA', 'https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/');
const agentHQ = source('Agent HQ', 'https://github.blog/news-insights/company-news/welcome-home-agents/');
const agentHQAgents = source('Claude and Codex in Agent HQ', 'https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/');
const billing = source('AI Credits billing', 'https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/');
const limits = source('AI-credit session limits', 'https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/');
const skills = source('Agent Skills', 'https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/');
const reviewSkills = source('Code review skills and MCP GA', 'https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/');
const computerUse = source('Computer use preview', 'https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/');
const computerUseDocs = source('Computer use docs', 'https://docs.github.com/en/copilot/concepts/agents/computer-use');
const squad011 = source('Squad v0.11.0', 'https://github.com/bradygaster/squad/releases/tag/v0.11.0');
const squad012 = source('Squad v0.12.0', 'https://github.com/bradygaster/squad/releases/tag/v0.12.0');
const squad013 = source('Squad v0.13.0', 'https://github.com/bradygaster/squad/releases/tag/v0.13.0');
const squad100 = source('Squad v1.0.0', 'https://github.com/bradygaster/squad/releases/tag/v1.0.0');
const squad101 = source('Squad v1.0.1', 'https://github.com/bradygaster/squad/releases/tag/v1.0.1');
const squadHelp = source('Squad setup skill', '../.github/skills/squad-help/SKILL.md');
const cliInstall = source('Install Copilot CLI', 'https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli');
const cleanMachine = source('Clean-machine runbook', '../docs/clean-machine-demo.md');
const small = text => `<p class="supporting">${text}</p>`;
const row = (label, text, detail = '') => `<div class="reference-row"><div><h3>${label}</h3>${detail ? small(detail) : ''}</div><p>${text}</p></div>`;

const chapter = (number, duration, time, chapterTitle, layer, points, tip, sources) => ({
  id: `demo-c${number}`, title: chapterTitle, time, layer, kind: 'demo',
  chapter: `C${number}`, duration, points, tip, sources,
  treatment: 'SHOW target / footage pending'
});

export const slides = [
  {
    id: 'opening', title: 'NIC 2026', time: 'Pre-show',
    layer: 'NIC 2026', kind: 'opening', preshow: true,
    tip: 'Hold here before the clock starts. Advance to the first content slide at 00:00.',
    sources: [],
    content: '',
    notes: 'Pre-show holding slide. Keep this visible while the room settles and before the timed session starts. It carries the official NIC 2026 template mark only, so it does not consume the 60-minute delivery clock.'
  },
  {
    id: 's01-outcome', title: 'A module worth reusing.', time: '00:00-01:00',
    layer: 'Copilot CLI / Squad / Terraform', kind: 'hero',
    tip: 'Define the useful artifact before choosing agents.', sources: [cli, squad],
    content: `<div class="hero-copy"><p class="hero-lede">Copilot CLI and Squad,<br>working together.</p>
      <p class="hero-description">Existing code. A reusable module.<br>A private Azure landing-zone consumer.</p>
      <div class="speakers" aria-label="Speakers"><span class="speaker-card"><strong>Martin Opedal</strong><em>Enterprise Cloud Solution Architect, Microsoft</em></span><span class="speaker-card"><strong>Haflidi Fridthjofsson</strong><em>Sr Cloud Solution Architect, Microsoft</em></span></div>
      <p class="session-meta">October 14, 2026 / 10:00-11:00 / Room 6</p></div>
      <div class="hero-art">${fig(hero())}<p class="diagram-caption">The intended boundary, not deployment evidence.</p></div>`
  },
  chapter(1, 180, '01:00-04:00', 'Same task, different agent choices', 'Native Copilot CLI',
    ['Same brief and reviewed starting state', 'Selected model and effective context', 'One decision and its consequence'],
    'Hold inputs fixed. Equal results are valid.', [cli]),
  {
    id: 's03-baseline', title: 'Start with the code you have.', time: '04:00-05:00',
    layer: 'Terraform / source evidence', kind: 'baseline', sources: [upstream],
    tip: 'Disclose the source, qualified reference, clean checkpoint, and recorded change.',
    content: `<div class="baseline-facts"><div class="source-pin"><span class="eyebrow">Inherited public source</span><strong>e9a9a48</strong></div>
      <div class="stat"><strong>10</strong><span>existing negative test cases<br><em>Not a passing test claim.</em></span></div>
      <p class="supporting">Root declarations overlap.<br>An active provider sits outside the mocks.</p></div>
      <div>${code('sku = {\n  name = "Base"\n  tier = "Standard"\n}', 'Inherited resource excerpt')}
      <p class="code-caption">Inherited mismatch, not AI-attributed.<br>Qualify first; disclose the later clean run.</p></div>`
  },
  {
    id: 's04-news', title: 'Big news this year.', time: '05:00-06:00',
    layer: 'GitHub Copilot / Squad timeline', kind: 'news',
    tip: 'Use the new controls deliberately. Computer use is not part of this Terraform demo.',
    sources: [whatsNew, cliGA, agentHQ, agentHQAgents, billing, limits, skills, reviewSkills, computerUse, computerUseDocs, squad011, squad012, squad013, squad100, squad101],
    content: `<div class="news-grid">
      <div><strong>2026-02-25</strong><span>Copilot CLI GA</span><em>Plan mode, agents, skills, plugins, MCP, and review controls ship for all subscribers.</em></div>
      <div><strong>2025-10-28 / 2026-02-04</strong><span>Agent HQ</span><em>Launched at Universe. Claude and Codex are public preview in Agent HQ.</em></div>
      <div><strong>2026-06-01 / 2026-07-01</strong><span>AI Credits and limits</span><em>Usage-based billing is effective. <code>/limits</code> and <code>--max-ai-credits</code> matter.</em></div>
      <div><strong>2025-12-18 / 2026-07-29</strong><span>Skills and MCP mature</span><em>Agent Skills launch. Skills plus MCP reach GA for Copilot code review.</em></div>
      <div><strong>2026-10-01</strong><span>Computer use, public preview</span><em><code>/computer on|show|off</code>, per-app approval, admin disable. We do not use it here.</em></div>
      <div><strong>2026-10-03 / 2026-10-04</strong><span>Squad 1.0 and 1.0.1</span><em>Stabilizes 0.11-0.13: presets, <code>squad_state</code>, and setup hardening. WinGet and Homebrew; npm latest <code>0.13.1</code> on Oct 5.</em></div>
    </div>`
  },
  {
    id: 's04-layers', title: 'One workflow. Three distinct layers.', time: '06:00-07:00',
    layer: 'Native CLI / Squad / external tools', kind: 'diagram', sources: [cli, squad],
    tip: 'Name the layer before troubleshooting the behavior.',
    content: fig(layers())
  },
  {
    id: 's07-agent-setup', title: 'Meet the agent setup.', time: '07:00-08:00',
    layer: 'Repository guidance / native profiles / MCP', kind: 'agent-setup',
    tip: 'Squad coordinates decisions. The operator selects narrow native profiles for narrow lanes.',
    sources: [guide],
    content: `${fig(agentSetup())}<div class="agent-notes-grid">
      <div><strong>Always-on guidance</strong><span><code>AGENTS.md</code>, repo instructions, and HCL <code>applyTo</code> rules.</span></div>
      <div><strong>Squad coordinates</strong><span><code>squad.agent.md</code> plus <code>.squad\\</code> owns routing and decisions.</span></div>
      <div><strong>Native profile lanes</strong><span><code>coder</code>, <code>validator</code>, and <code>reviewer</code> selected by the operator.</span></div>
      <div><strong>Tool boundary</strong><span>Filters limit availability, not sandboxing. Generic Squad tasks do not inherit them.</span></div>
    </div>`
  },
  chapter(0, 180, '08:00-11:00', 'From zero to a squad', 'Clean Windows 11 / WinGet / Copilot CLI / Squad',
    ['Clean VM reached only through Bastion; no Git, CLI, or Squad yet', 'WinGet installs, /login, then squad init in the repository', 'Init Mode proposes the roster; confirm, then squad doctor'],
    'Install, init, hire, verify. squad init is safe to rerun; roster writes wait for confirmation.', [cliInstall, squad101, cleanMachine]),
  {
    id: 's05-parallel', title: 'Give parallel work separate owners.', time: '11:00-12:00',
    layer: 'Native subagents / Squad routing', kind: 'ownership', sources: [cli, squad],
    tip: 'One writer per shared Terraform surface. Every task has a stop condition.',
    content: `<div role="table" aria-label="Artifact ownership and handoffs"><div class="lane-header" role="row"><span role="columnheader">Owner</span><span role="columnheader">Artifact</span><span role="columnheader">Handoff</span></div>
      <div class="lane" role="row"><strong role="rowheader">Module writer</strong><span role="cell">Infrastructure and interface</span><span role="cell">Diff and contract</span></div>
      <div class="lane" role="row"><strong role="rowheader">Test author</strong><span role="cell">Isolated contract cases</span><span role="cell">Commands and results</span></div>
      <div class="lane" role="row"><strong role="rowheader">Docs writer</strong><span role="cell">Consumption example</span><span role="cell">Inputs and prerequisites</span></div>
      <div class="lane" role="row"><strong role="rowheader">Reviewer</strong><span role="cell">Read-only inspection</span><span role="cell">Finding and next owner</span></div></div>
      <p class="ownership-note">CLI supplies subagents and <code>/fleet</code>. Squad adds roles and routing.<br>The lead integrates; Scribe records decisions.</p>`
  },
  {
    id: 's06-contract', title: 'Fit the platform you already have.', time: '12:00-14:00',
    layer: 'Terraform / Azure contract', kind: 'diagram', sources: [automatic],
    tip: 'Consume approved network inputs. Do not rebuild or import the landing zone.',
    content: `${fig(corp())}<p class="status-line"><span class="status pending">Environment validated</span>Private IaC run supplied sanitized plan, apply, and ARM read-back evidence.</p>`
  },
  chapter(2, 240, '14:00-18:00', 'Pin the brief and approve a plan', 'Native Plan mode / Squad',
    ['Actual Plan indicator and explicit file context', 'Plan artifact, proposed scope, and human revision', 'Approval, then visible implementation mode'],
    'Inspect the real Plan indicator and artifact before approving implementation.', [cli, guide]),
  {
    id: 's08-plan-boundary', title: 'Extract a module, not an environment.', time: '18:00-20:00',
    layer: 'Terraform / module boundary', kind: 'boundary', sources: [upstream, tests],
    tip: 'Make ownership testable before moving resources.',
    content: `<div class="boundary-panel public"><p class="eyebrow">Reusable module</p><h3>Own the infrastructure contract.</h3>
      <ul><li>Typed inputs and useful outputs</li><li>Provider requirements</li><li>Isolated resource assertions</li></ul></div>
      <div class="boundary-panel"><p class="eyebrow">Consumer and application roots</p><h3>Keep environment ownership outside.</h3>
      <ul><li>Provider configuration and backend</li><li>Private inputs and authentication</li><li>Separate Kubernetes resources</li></ul></div>
      <p class="boundary-warning fragment" data-fragment-index="0">Fresh workload only. Existing state migration needs a separate review.</p>`
  },
  chapter(3, 240, '20:00-24:00', 'Activate Squad and route independent work', 'Native custom agents / Squad',
    ['Selected agent, roster, charters, and routing', 'Actual task starts and owned file edits', 'A concrete result and a named handoff'],
    'Pass essential constraints explicitly. A role assignment is not completed work.', [cli, squad, guide]),
  {
    id: 's10-tool-roles', title: 'Give context the right job.', time: '24:00-25:00',
    layer: 'Native Copilot CLI / external tools', kind: 'context', sources: [cli],
    tip: 'A recipe, repository rule, and external fact are different inputs.',
    content: `<div class="context-column"><span class="large-index">01</span><h3>Instructions</h3><p>Persistent repository expectations.</p><code>@file /instructions</code></div>
      <div class="context-column"><span class="large-index">02</span><h3>Skills</h3><p>A focused procedure, invoked when useful.</p><code>/skills</code></div>
      <div class="context-column"><span class="large-index">03</span><h3>MCP</h3><p>Tools and information beyond the conversation.</p><code>/mcp</code></div>`
  },
  chapter(4, 240, '25:00-29:00', 'Ground the work with tools', 'Native skills / MCP / permissions',
    ['A skill invocation that affects the work', 'An authoritative source and relevant version', 'One narrow, visible permission decision'],
    'Tool availability and approval are separate controls.', [cli, automatic, guide]),
  {
    id: 's12-source-check', title: 'Turn the source into an assertion.', time: '29:00-30:00',
    layer: 'External source / Terraform tests', kind: 'assertion', sources: [upstream, tests],
    tip: 'Assert the generated resource, not the name of an input.',
    content: `<div class="assertion-source"><p class="eyebrow">Source claim</p><h3>Automatic is a resource contract.</h3>
      <p class="fragment" data-fragment-index="0">Choose the supported SKU, private API, and system-pool behavior.</p></div>
      <div class="fragment" data-fragment-index="1">${code('condition = (\n  azapi_resource.aks.body.sku.name == "Automatic"\n)', 'Illustrative assertion, not test output')}
      <p class="code-caption">The real case must match the reviewed module.</p></div>`
  },
  {
    id: 's13-test-gap', title: 'Test both sides of the boundary.', time: '30:00-32:00',
    layer: 'Terraform / test design', kind: 'test-design', sources: [tests],
    tip: 'Enumerate every loaded provider before calling a test isolated.',
    content: `<div class="test-pair"><div><p class="eyebrow">Negative cases</p><h3>Reject incompatible inputs.</h3><p>Preserve meaningful validation and precondition coverage.</p></div>
      <div><p class="eyebrow">Positive cases</p><h3>Inspect the resource and outputs.</h3><p>Check the supported private-network contract and consumer interface.</p></div></div>
      <div class="mutation-strip"><strong>Test the test.</strong><span>Deliberate mutation</span><span>Intended failure</span><span>Restore and rerun</span></div>`
  },
  chapter(5, 300, '32:00-37:00', 'Catch a mistake and repair it', 'Native review / Squad handoff / Terraform',
    ['A real command and nonzero result', 'A finding, owner, and focused repair diff', 'The same check rerun, with criteria intact'],
    'Ordinary test repair is not formal rejection. Preserve the actual repair evidence.', [cli, tests, guide]),
  {
    id: 's15-proof', title: 'Evidence has levels.', time: '37:00-40:00',
    layer: 'Source / local checks / Azure', kind: 'evidence', sources: [tests, tfplan],
    tip: 'A check proves only what it checks. Private validation and pending recordings stay distinct.',
    content: '',
    treatment: 'Current evidence register'
  },
  {
    id: 's16-continuity', title: 'Save the reason, not just the chat.', time: '40:00-41:00',
    layer: 'Native resume / Squad knowledge', kind: 'diagram', sources: [cli, squad],
    tip: 'Keep the accepted boundary and its reason close to the code.',
    content: `${fig(memory())}<p class="large-note">A saved conversation and a repository decision are different artifacts.</p>`
  },
  chapter(6, 180, '41:00-44:00', 'Resume with decisions intact', 'Native session controls / Squad Scribe',
    ['The actual decision record created in this work', 'A resumed task that reads the record', 'Context, usage, and deliberate model choice'],
    'Verify that the reason reached the resumed task.', [cli, squad, guide]),
  {
    id: 's18-memory', title: 'Three places to keep context.', time: '44:00-46:00',
    layer: 'Native CLI / Squad', kind: 'reference', sources: [cli, squad],
    tip: 'CLI compaction and team-state hygiene solve different problems.',
    content: `${row('Conversation', 'Resume the relevant task. Inspect context and usage.', '<code>/resume /context /usage /compact</code>')}
      ${row('Native memory', 'Manage remembered facts. Keep personal contents off screen.', '<code>/memory</code>')}
      ${row('Repository knowledge', 'Review decisions, histories, and learned testing recipes.', 'Squad / Scribe / reviewed evidence')}`
  },
  chapter(7, 180, '46:00-49:00', 'Reviewed diff to approved Terraform change', 'Native diff / Squad / Terraform',
    ['Module extraction and the consumer-facing diff', 'Meaningful checks and the exact approval', 'Sanitized plan/apply/read-back evidence, with private details omitted'],
    'Approve a specific artifact and scope, not a hopeful summary.', [cli, tfplan]),
  {
    id: 's20-consumer', title: 'Reuse the code, not the environment.', time: '49:00-51:00',
    layer: 'Public Terraform / private consumption', kind: 'diagram', sources: [tests, automatic],
    tip: 'Pin the reviewed module revision separately from environment inputs.',
    content: `${fig(consumption())}<p class="status-line"><span class="status pending">Consumer validated</span>Private inputs, state, identities, FQDNs, and run URLs stay out of public artifacts.</p>`
  },
  {
    id: 's21-limits', title: 'Make the next change easier to review.', time: '51:00-53:00',
    layer: 'Copilot CLI / Squad / engineering practice', kind: 'closing', sources: [cli, squad],
    tip: 'Keep the artifact, the reason, and the check together.',
    content: `<div class="closing-line"><span>01</span><p><strong>Bound the work.</strong><br>Plan, context, ownership, and stop conditions.</p></div>
      <div class="closing-line"><span>02</span><p><strong>Inspect what changed.</strong><br>Source, diff, tests, and human review.</p></div>
      <div class="closing-line"><span>03</span><p><strong>Leave a useful handoff.</strong><br>Module, consumer example, decisions, and open gates.</p></div>
      <p class="closing-statement">More agents cannot vote a contract into correctness.</p>`
  },
  {
    id: 's22-questions', title: 'Which part would you inspect?', time: '53:00-60:00',
    layer: 'Questions / seven minutes', kind: 'questions', sources: [guide],
    tip: 'Prepared Q&A fallback is in the speaker notes.',
    content: `<p class="questions-lede">Your repository. One bounded change.</p>
      <div class="appendix-links">
      <a href="#/a-cli-controls"><span>01</span>Branch and recover</a>
      <a href="#/a-automation"><span>02</span>Bounded automation</a>
      <a href="#/a-handoffs"><span>03</span>Local or cloud work</a>
      <a href="#/a-integrations"><span>04</span>Editor and tool context</a>
      <a href="#/a-squad-ops"><span>05</span>Squad operations</a>
      <a href="#/a-evidence"><span>06</span>Evidence and prerequisites</a>
      <a href="#/a-online"><span>07</span>Online landing zone</a>
      <a href="#/a-prompts"><span>08</span>Prompts you can rerun</a>
      <a href="#/a-bootstrap"><span>09</span>Start a squad</a>
      <a href="#/a-use-cases"><span>10</span>When Squad earns its place</a></div>`
  },
  {
    id: 'a-cli-controls', title: 'Branch and recover deliberately.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, guide],
    tip: 'A worktree separates files, not credentials. Rewind is not Azure rollback.',
    content: `${row('Explore an alternative', '<code>/fork</code> carries context.<br><code>/worktree</code> separates working files.')}
      ${row('Recover CLI work', '<code>/rewind</code><br>Inspect the resulting diff.')}
      ${row('Return to the task', '<code>/resume</code><br>Select the relevant session, not unrelated history.')}`
  },
  {
    id: 'a-automation', title: 'Automate bounded work.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, guide],
    tip: 'Keep the objective, permissions, and stopping point explicit.',
    content: `${row('Finish a finite task', '<code>/autopilot /limits</code><br>Soft credit limits, not financial or safety guarantees.')}
      ${row('Script a prompt', '<code>-p / --prompt</code><br>Programmatic work, not the interactive Plan-mode demo.')}
      ${row('Split independent work', '<code>/fleet /subagents</code><br>Give each task an artifact and owner.')}`
  },
  {
    id: 'a-handoffs', title: 'Choose where the work happens.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, guide],
    tip: 'Reference only. Cloud delegation and local-session steering are different operations.',
    content: `${row('Work locally', 'Use the local repository, review its diff, and retain ownership.')}
      ${row('Hand off a PR task', '<code>/delegate</code><br>Cloud-agent draft PR; review the resulting diff.')}
      ${row('Control a session remotely', '<code>/remote</code><br>Steer the running local session. Its host stays online.')}`
  },
  {
    id: 'a-integrations', title: 'Add the context you need.', time: 'Appendix',
    layer: 'Native Copilot CLI / external integrations', kind: 'reference', sources: [cli, guide],
    tip: 'Availability is not setup evidence. Review tools and sources before use.',
    content: `${row('Editor and code context', '<code>/ide /lsp</code><br>Useful with a configured editor or language service.')}
      ${row('Packaged capabilities', '<code>/plugin</code><br>Review trust, permissions, and dependencies.')}
      ${row('Investigate or challenge a claim', '<code>/research /rubber-duck</code><br>Sourced investigation or focused design critique.')}`
  },
  {
    id: 'a-squad-ops', title: 'Keep team state useful.', time: 'Appendix',
    layer: 'Squad 1.0.1 / native CLI distinction', kind: 'reference', sources: [squad, guide],
    tip: 'CLI /compact is conversation context. squad nap is team-state hygiene.',
    content: `${row('Check the setup', '<code>squad status / squad doctor</code><br>Team setup is not Terraform correctness.')}
      ${row('Move and maintain state', '<code>squad export / squad import / squad nap --dry-run</code><br>Back up before import. Preview maintenance.')}
      ${row('Run bounded loops or route issues', '<code>squad loop --init</code> / <code>squad triage</code><br>Configure first. Triage can change labels.')}`
  },
  {
    id: 'a-evidence', title: 'Know which gate you are reading.', time: 'Appendix',
    layer: 'Terraform / Azure / evidence', kind: 'reference', sources: [tests, tfplan, automatic],
    tip: 'Raw plans, state, private inputs, and credentials are not public artifacts.',
    content: `${row('Reproduce the source', '<code>e9a9a48</code><br>Keep the full pin and reviewed module revision.')}
      ${row('Check the code and example', 'Format, validate, lint, isolated tests, and a deliberate mutation.<br>Then verify the consumer interface.')}
      ${row('Read the real plan', '<code>0</code> unchanged / <code>2</code> changes / <code>1</code> error<br>October 5 private run supplied sanitized plan/apply/read-back; future targets need their own evidence.')}`
  },
  {
    id: 'a-online', title: 'Same module, Online landing zone.', time: 'Appendix',
    layer: 'Terraform / Azure landing zone / GitHub Actions', kind: 'reference', sources: [onlineDemo, demoEnvRepo, upstreamRepo],
    tip: 'Guardrails are design inputs. None were bypassed with exemptions.',
    content: `${row('Thin root, same module', 'Consumer repo pins the module by tag <code>v0.6.0</code>.<br><code>cluster_sku = "Automatic"</code>, BYO VNet, NAT Gateway egress, managed NGINX.')}
      ${row('Guardrails we hit', 'Private-only state storage. Subnets must have an NSG.<br>RBAC Writer cannot create namespaces: managed namespace via ARM.')}
      ${row('Secure chain and proof', 'OIDC, human gate, ephemeral VNet runner, no plan artifact.<br>API server allows only the runner IP. HTTPS 200 or the run fails.')}`
  },
  {
    id: 'a-security', title: 'What AI found that the scanners did not.', time: 'Appendix',
    layer: 'GHAS / MCP / skills / tests', kind: 'reference', sources: [securityCase, onlineDemo],
    tip: 'GHAS sees code, secrets, and advisories. Silent gaps need an agent and an oracle.',
    content: `${row('GHAS baseline, zero open', 'CodeQL, secret scanning with push protection, Dependabot.<br>Module: six checks. Demo env: Terraform Validate, Checkov, TFLint, Trivy.')}
      ${row('Found by the agent', 'Checkov skipped <code>main.tf</code> since August. A scan was off for inactivity.<br>A monitor was falsely green. Two approval and cleanliness races.')}
      ${row('Made checkable', 'Learn via MCP for product rules. Skills for secrets and review.<br>22 module tests, 28 read-back checks, a human on every merge.')}`
  },
  {
    id: 'a-prompts', title: 'Prompts you can rerun.', time: 'Appendix',
    layer: 'Copilot CLI / Squad / MCP', kind: 'reference', sources: [promptPack, guide],
    tip: 'Repeatable is measured, not assumed: five fresh runs, at least four green.',
    content: `${row('Guardrails first', 'Read effective policy and RBAC at the target before design.<br>Then ground API facts through Learn and Terraform MCP.')}
      ${row('One lane per step', 'Squad lead plans. <code>terraform-coder</code> edits.<br><code>terraform-validator</code> checks. <code>terraform-reviewer</code> reviews in <code>/new</code>.')}
      ${row('Consume like a customer', 'Thin root owns providers, backend, network.<br>Deploy through the pipeline and prove the result.')}`
  },
  {
    id: 'a-bootstrap', title: 'Start a squad in five steps.', time: 'Appendix',
    layer: 'Squad 1.0.1 / Copilot CLI', kind: 'reference', sources: [squad101, squadHelp, guide],
    tip: 'Init Mode proposes the team first. Nothing is written until you confirm.',
    content: `${row('Install and scaffold', '<code>winget install --id bradygaster.Squad --exact</code><br>Then <code>squad init</code> in the repository terminal. Use <code>--no-vscode-default</code> only to keep the diff smaller.')}
      ${row('Hire the team', '<code>copilot --agent squad</code>, describe the project.<br>Confirm the proposed roster; <code>.squad\\</code> is created and committed.')}
      ${row('Verify and keep current', '<code>squad doctor</code>.<br>Back up first: <code>squad upgrade</code> keeps team state, replaces templates.')}`
  },
  {
    id: 'a-use-cases', title: 'When Squad earns its place.', time: 'Appendix',
    layer: 'Copilot CLI runs the work / Squad decides who and remembers why', kind: 'reference', sources: [cli, squad, guide],
    tip: 'Small, well-understood edit? Use one Copilot CLI session and skip Squad.',
    content: `${row('Work across owners', 'Module, tests, and docs in parallel.<br>One writer per file, handoffs that name the next check.')}
      ${row('Work that outlives a session', 'Decisions in <code>.squad\\decisions.md</code>, histories per member.<br>Resume tomorrow, or hand over to a colleague.')}
      ${row('Backlog and review', 'Issues routed by <code>squad:{member}</code> labels; Ralph keeps it moving.<br>A rejected change is revised by a different author.')}`
  }
];

export function evidenceContent(evidence) {
  return `<div role="table" aria-label="Current evidence and remaining gates"><div class="evidence-heading" role="row"><span role="columnheader">Evidence</span><span role="columnheader">Current status</span><span role="columnheader">What it establishes</span></div>
    ${evidence.checks.map((item, index) => `<div class="evidence-row" role="row"><strong role="rowheader"><span class="evidence-index" aria-hidden="true">${index + 1}</span>${escape(item.label)}</strong>
      <span role="cell" class="status ${item.status === 'Pending' ? 'pending' : 'observed'}">${escape(item.status)}</span><p role="cell">${escape(item.detail)}</p></div>`).join('')}</div>`;
}

export function demoContent(slide, media) {
  const file = media[slide.chapter];
  const attached = Boolean(file.available);
  const status = attached ? 'Reviewed native recording attached' : 'Recording not attached yet';
  return `<div class="media-well" data-chapter="${slide.chapter}">
    <div class="media-pending"${attached ? ' hidden' : ''}>
      <div class="chapter-art" aria-hidden="true">${slide.chapter}</div>
      <div class="pending-copy"><p class="recording-label">Native CLI recording slot / ${String(slide.duration / 60).padStart(2, '0')}:00</p>
        <h3>Recording not attached yet</h3><p class="pending-explanation">Viewing guide, not executed evidence.</p>
        <ol>${slide.points.map(point => `<li>${point}</li>`).join('')}</ol></div>
    </div>
    <video controls playsinline preload="metadata" aria-label="${escape(slide.chapter + ': ' + slide.title)}" ${attached ? `src="${escape(file.file)}"` : 'hidden'}></video>
  </div>
  <div class="media-tools"><p class="media-status" role="status">${escape(status)}</p>
    <button type="button" class="attach-video" data-chapter="${slide.chapter}">Open local MP4<span class="visually-hidden"> for ${slide.chapter}</span></button>
    <input type="file" accept="video/mp4,.mp4" data-chapter="${slide.chapter}" class="video-file" hidden>
    <span class="local-only">Local only. Nothing uploads.</span></div>`;
}

export function renderSection(slide, index, noteHTML, evidence, media) {
  const isAppendix = slide.id.startsWith('a-');
  const layoutClasses = slide.preshow ? ['layout-opening', 'layout-light']
    : slide.kind === 'demo' ? ['layout-media', 'layout-dark']
      : slide.kind === 'questions' ? ['layout-dark']
        : slide.kind === 'hero' ? ['layout-speaker', 'layout-light']
          : ['layout-light'];
  const className = [`slide-${slide.kind}`, ...layoutClasses].join(' ');
  let content = slide.kind === 'demo' ? demoContent(slide, media)
    : slide.kind === 'evidence' ? evidenceContent(evidence) : slide.content;
  const fallback = slide.kind === 'demo'
    ? 'If media is absent or fails, keep the clearly labeled viewing guide. Do not narrate an unobserved result.'
    : isAppendix ? 'Answer from the verified reference, then return to Q&A. Do not start an unplanned live demonstration.'
      : 'Use the static slide and its spoken explanation. Keep any unresolved evidence labeled pending.';
  const captureRule = slide.kind === 'demo'
    ? '<p><strong>Capture surface:</strong> Genuine Copilot CLI with Squad selected, standalone or in a real integrated terminal. Recording automation is external, off-screen tooling, not a Squad feature. Qualify code before filming, then capture genuine new execution from a disclosed clean checkpoint. Do not present preparation as filmed first-ever implementation.</p>'
    : '';
  if (slide.preshow) {
    return `<section id="${slide.id}" class="${className}" role="region" aria-label="NIC 2026 opening page" data-stage-time="Pre-show" data-preshow="true">
    <div class="slide-content" aria-hidden="true"></div>
    <aside class="notes"><h2>Pre-show / NIC 2026 opening page</h2>${noteHTML}<p><strong>Working tip:</strong> ${escape(slide.tip)}</p><p><strong>Fallback:</strong> Advance to the first content slide before the session clock starts.</p></aside>
  </section>`;
  }
  const headingTag = slide.id === 's01-outcome' ? 'h1' : 'h2';
  return `<section id="${slide.id}" class="${className}" role="region" aria-labelledby="${slide.id}-title" data-stage-time="${slide.time}" ${isAppendix ? 'data-appendix="true"' : ''}>
    <div class="slide-content">
      <div class="slide-meta"><span class="eyebrow">${escape(slide.layer)}</span><span class="stage-time">${isAppendix ? 'APPENDIX / reference only' : escape(slide.time)}</span></div>
      <header class="slide-header">${slide.chapter ? `<span class="chapter-id">${slide.chapter}</span>` : ''}<${headingTag} id="${slide.id}-title">${escape(slide.title)}</${headingTag}></header>
      <div class="slide-body">${content}</div>
      <footer class="slide-footer"><p class="tip"><span>Working tip</span>${escape(slide.tip)}</p><div class="source-links">${isAppendix ? '<a href="#/s22-questions">Back to Q&amp;A</a>' : ''}${slide.sources.map(item => `<a href="${escape(item.url)}"${item.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(item.label)}</a>`).join('')}</div></footer>
    </div>
    <aside class="notes"><h2>${escape(slide.time)} / ${escape(slide.chapter ? slide.chapter + ': ' + slide.title : slide.title)}</h2>${noteHTML}<p><strong>Working tip:</strong> ${escape(slide.tip)}</p>${captureRule}<p><strong>Fallback:</strong> ${escape(fallback)} Source links are optional reading, not online demo dependencies.</p></aside>
  </section>`;
}
