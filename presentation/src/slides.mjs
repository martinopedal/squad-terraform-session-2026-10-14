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
const cliProgrammatic = source('Copilot CLI programmatic reference', 'https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference');
const cliResume = source('Copilot CLI resume', 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/chronicle');
const cliReview = source('Copilot CLI review', 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review');
const cliDelegate = source('Copilot CLI delegate', 'https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca');
const agentHQ = source('Agent HQ', 'https://github.blog/news-insights/company-news/welcome-home-agents/');
const agentHQAgents = source('Claude and Codex in Agent HQ', 'https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/');
const billing = source('AI Credits billing', 'https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/');
const limits = source('AI-credit session limits', 'https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/');
const skills = source('Agent Skills', 'https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/');
const azureFunctionsSkills = source('Azure Functions skills', 'https://github.com/azure/azure-functions-skills');
const reviewSkills = source('Code review skills and MCP GA', 'https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/');
const rubberDuckGA = source('Rubber Duck GA', 'https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/');
const rubberDuckBlog = source('Rubber Duck second-opinion origin', 'https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/');
const computerUse = source('Computer use preview', 'https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/');
const computerUseDocs = source('Computer use docs', 'https://docs.github.com/en/copilot/concepts/agents/computer-use');
const aksAutomaticGA = source('AKS Automatic GA', 'https://azure.microsoft.com/en-us/blog/azure-kubernetes-service-automatic-fast-and-frictionless-kubernetes-for-all/');
const appRoutingDocs = source('AKS App Routing docs', 'https://learn.microsoft.com/en-us/azure/aks/app-routing-nginx-configuration');
const aksAbacDocs = source('AKS ABAC custom resources preview', 'https://learn.microsoft.com/en-us/azure/aks/entra-id-authorization');
const bastionEntraDocs = source('Bastion Entra authentication', 'https://learn.microsoft.com/en-us/azure/bastion/bastion-entra-id-authentication');
const terraform16 = source('Terraform 1.6 test release', 'https://github.com/hashicorp/terraform/releases/tag/v1.6.0');
const brandCopilot = source('GitHub Copilot brand permission guidance', 'https://brand.github.com/brand-identity/copilot');
const brandLogo = source('GitHub logo usage', 'https://brand.github.com/foundations/logo');
const cascadiaLicense = source('Cascadia Code OFL license', 'https://raw.githubusercontent.com/microsoft/cascadia-code/main/LICENSE');
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
export const featureLabels = {
  'Copilot CLI': { status: 'GA', date: '2026-02-25', source: cliGA.url },
  'Plan mode': { status: 'GA', date: '2026-02-25', source: cliGA.url },
  'custom agents': { status: 'GA', date: '2026-02-25', source: cliGA.url },
  MCP: { status: 'GA with CLI', date: '2026-02-25', source: cliGA.url },
  Skills: { status: 'Available', date: '2025-12-18', source: skills.url },
  '-p': { status: 'Docs', date: 'checked 2026-10-08', source: cliProgrammatic.url },
  '/resume': { status: 'Docs', date: 'checked 2026-10-08', source: cliResume.url },
  '/review': { status: 'Docs', date: 'checked 2026-10-08', source: cliReview.url },
  '/diff': { status: 'GA with CLI', date: '2026-02-25', source: cliGA.url },
  '/delegate': { status: 'Cloud handoff', date: 'checked 2026-10-08', source: cliDelegate.url },
  'Rubber Duck': { status: 'GA', date: '2026-06-02', source: rubberDuckGA.url },
  'AKS Automatic': { status: 'GA', date: '2025-09-16', source: aksAutomaticGA.url },
  'App Routing': { status: 'status: see docs', date: '', source: appRoutingDocs.url },
  'ABAC conditions for AKS custom resources': { status: 'Preview', date: '2026-08-18', source: aksAbacDocs.url },
  'Bastion Entra RDP': { status: 'Preview', date: '2026-08-11', source: bastionEntraDocs.url },
  'Terraform test': { status: 'Stable', date: '2023-10-04', source: terraform16.url },
  Squad: { status: 'v1.0.1', date: '2026-10-04', source: squad101.url }
};
const badge = name => {
  const item = featureLabels[name];
  if (!item) throw new Error(`Missing feature label: ${name}`);
  const label = `${item.status}${item.date ? ` · ${item.date}` : ''}`;
  return `<a class="feature-badge" href="${escape(item.source)}" target="_blank" rel="noopener noreferrer" data-feature="${escape(name)}">${escape(label)}</a>`;
};
const productName = () => '<p class="product-name">GitHub Copilot</p>';
const autonomySpectrum = () => `<div class="control-spectrum" aria-label="Control spectrum, not a maturity ladder">
  <span>Ask <b>C1</b></span><span>Edit <b>C5</b></span><span>Plan ${badge('Plan mode')} <b>C2</b></span><span>Agent ${badge('custom agents')} <b>C3</b></span><span>Tools + permissions ${badge('MCP')} <b>C4</b></span><span>Resume ${badge('/resume')} <b>C6</b></span><span>Gated review <b>C7</b></span>
  <em>Setup/runway <b>C0</b> · Programmatic ${badge('-p')} sits in the appendix: automation, not a live chapter. More automation is not better by default; human approvals remain at the gates.</em>
</div>`;

const demoRuns = {
  C0: {
    goal: 'Install, initialize, hire, and verify Squad on a clean Windows 11 VM.',
    screenCommand: String.raw`Clean VM: Git, Copilot CLI, and Squad are absent.
(abridged — full prompt in notes)
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
Run Copilot /login, clone the public module repo, then squad init.
copilot --agent squad
Paste the small-team prompt and confirm roster.
squad doctor`,
    command: String.raw`$PSVersionTable.PSVersion; Get-Command git, copilot, squad -ErrorAction SilentlyContinue
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
# New tools are on PATH for new shells; refresh this one instead of opening another window.
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
git --version; copilot --version; squad --version
copilot
/login
/exit
git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git $HOME\demo\aks-module
Set-Location $HOME\demo\aks-module
squad init
git status --short
copilot --agent squad
We maintain a reusable Terraform module for AKS Automatic on azapi that deploys into an
existing Azure landing zone. Work is Terraform module code, terraform test contract tests,
and consumer documentation. Propose a small team.
# Confirm the proposed roster, then /exit.
squad doctor`,
    expected: 'Tools install, Init Mode proposes a roster after confirmation, and squad doctor reports 10 passed.',
    driver: 'Haflidi drives on the clean VM; Martin watches time.',
    pointAt: 'Point at version output, the .squad\\ files from squad init, the roster confirmation, and the doctor pass count.',
    fallback: 'Use evidence screenshots from Test-DemoVm.ps1 14/14 and the pre-connected VM; if install stalls past 60 seconds, state the stall and move on.',
    timing: 'Slot 07:00-10:00. 0:20 clean check; 0:55 installs/version; 0:35 login; 0:35 clone/init/diff; 0:35 hire/doctor. Checkpoint: after C0 at 10:00.',
    preStaged: 'VM recreated or verified clean; Bastion connected; PowerShell 7 tab open; package-source agreements accepted by flags; terminal zoom set; no secrets in clipboard.',
    cutAt: '09:15',
    cut: 'If installs or login are not complete, state the live stall, show fallback evidence, and move to s05-parallel.'
  },
  C1: {
    goal: 'Compare two equivalent Plan-mode attempts without sharing later state.',
    screenCommand: String.raw`(abridged — full prompt in notes)
/new
/agent
# select Squad
/model
/plan
/rename C1-A
Paste the alternate_network_payload plan-only prompt.
Repeat as C1-B with the same model, permissions, and team state.`,
    command: String.raw`/new
/agent
# select Squad
/model
/plan
/rename C1-A
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
# Repeat as /rename C1-B with the same model, tools, permissions, and public team state.`,
    expected: 'Two plan artifacts expose one meaningful decision or show that both runs made the same sound choice.',
    driver: 'Haflidi leads/narrates; Martin types.',
    pointAt: 'Point at /model, the selected Squad agent, equal inputs, and one consequence in the plans.',
    fallback: 'Use saved c1-a.txt and c1-b.txt excerpts from the prepared evidence; do not retry live until outputs differ.',
    timing: 'Slot 14:00-17:00. 0:35 /new, Squad, /model, Plan; 0:55 C1-A prompt; 0:55 C1-B prompt; 0:35 compare one consequence.',
    preStaged: 'Both C1 prompt blocks ready; sessions named C1-A/C1-B; same model, permissions, and team state visible; saved excerpts ready.',
    cutAt: '16:15',
    cut: 'If C1-B is still generating, stop at one clear C1-A consequence and use the saved C1-B excerpt.'
  },
  C2: {
    goal: 'Turn the scoped Terraform change into a reviewed native Plan-mode artifact.',
    screenCommand: String.raw`(abridged — full prompt in notes)
/new
/rename guided-clean-run
/agent
# select Squad
/instructions
/plan
Attach main.tf, variables.tf, and contract.tftest.hcl.
Paste the scoped planning prompt, revise it, then inspect /session plan.`,
    command: String.raw`/new
/rename guided-clean-run
/agent
# select Squad
/instructions
/plan
@terraform\modules\aks-automatic-corp\main.tf
@terraform\modules\aks-automatic-corp\variables.tf
@terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl
This is prepared, qualified code. Plan the C1 regression test and its README
explanation. Keep all eight inputs, six outputs, and the AzAPI resource intact.
Plan a separately labeled enablePrivateCluster mutation and repair.
No implementation, Azure lookup, apply, dependency upgrade, or state operation.
Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign.
/session plan`,
    expected: 'The visible plan is revised by a human, approved only for code/test/docs scope, then implementation mode is shown.',
    driver: 'Martin drives; Haflidi challenges scope.',
    pointAt: 'Point at the Plan indicator, the @file context, /session plan, the real revision, and the exit from Plan mode.',
    fallback: 'Use c2-approved-plan.md and screenshots of the Plan indicator; approval still does not authorize Azure apply. Speaker checks: direct project-write guards, ambiguous shell or MCP limits, A Markdown plan alone is not enforcement. Never use --plan --mode autopilot because it auto-approves.',
    timing: 'Slot 19:00-23:00. 0:35 open clean run and attach files; 0:45 prompt; 1:20 inspect /session plan and revise; 0:45 approve boundary; 0:35 switching buffer. Checkpoint: must be out of C2 at 23:00.',
    preStaged: 'Checkpoint shell open; file paths copied; approval language rehearsed; Plan-mode fallback screenshot ready.',
    cutAt: '22:00',
    cut: 'If the plan is not ready, use the saved approved plan and state that approval covers only repository changes.'
  },
  C3: {
    goal: 'Route one writing lane with the clarified B1v2 brief.',
    screenCommand: String.raw`(abridged — full prompt in notes)
/agent
# select Squad
/tasks
/agent list
/mcp
/agent terraform-coder
Paste the B1v2 brief: add alternate_network_payload with four separate asserts, each with error_message.
/agent squad`,
    command: String.raw`/agent
# select Squad
/tasks
/agent list
/mcp
Squad: lead owns scope and prepares the bounded native terraform-coder brief for
main.tf and tests/contract.tftest.hcl. No general-purpose task edits those files.
The brief adds alternate_network_payload with the existing AzAPI mock and plan
mode. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16, and DNS
service IP 10.241.0.10. Write four separate assert blocks, one each: the pod
CIDR, the service CIDR, the DNS service IP, and the API server stays private.
Each assert gets its own error_message. Reviewer prepares read-only acceptance
criteria. Devrel owns only the README's test explanation after agreement. Return
actual task IDs where used, file owners, checks, and unresolved issues. No
deployment or other edits.
/agent terraform-coder
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
/agent squad`,
    expected: 'The writer lane starts, changed files are visible, and the handoff names owners, checks, and unresolved issues.',
    driver: 'Martin operates; Haflidi reads returned evidence.',
    pointAt: 'Point at Squad selection, roster/routing (team list and routing rules), terraform-coder selection, the four-assert test edit, and c3-handoffs.md.',
    fallback: 'Use B1v2 eval evidence: 5/5 under pinned conditions after the clarified four-assert brief; no causal or repeatability guarantee, and the live run still has to pass. Custom subagents don\'t inherit repository instructions by default; include-custom-instructions: true opts in. Confirm the behavior in this build.',
    timing: 'Slot 24:00-28:00. 0:40 show Squad, /tasks, /agent list, /mcp; 0:35 B1v2 brief; 1:30 coder run; 0:45 return and handoff; 0:30 buffer.',
    preStaged: 'B1v2 prompt copied exactly; checkpoint can be reset; fallback B1v2 eval excerpt ready; no causal or repeatability guarantee from eval to live result.',
    cutAt: '27:00',
    cut: 'If the coder is still generating, stop the live turn, use the saved B1v2 excerpt, and move to C4 with the same boundary.'
  },
  C4: {
    goal: 'Use a skill and a read-only source lookup to change the work, not just decorate it.',
    screenCommand: String.raw`(abridged — full prompt in notes)
/skills info test-discipline
/mcp
Paste the source-grounding prompt.
/permissions`,
    command: String.raw`/skills info test-discipline
/mcp
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation. Through the configured Microsoft Learn
MCP, perform only a read-only search/fetch for AKS Automatic private/custom
network requirements. Cite the source/version relevant to private API access
and hosted-system subnets. Don't contact an Azure account or change providers.
/permissions`,
    expected: 'The notes identify the invoked skill, the source URL/version, the narrow approval, and the limitation if lookup fails.',
    driver: 'Martin drives; Haflidi explains the source claim.',
    pointAt: 'Point at the skill invocation, the MCP server, the specific source result, and the scoped permission prompt.',
    fallback: 'Use c4-source.md with retrieval time, tool, server/version, and limitation; a failed live lookup stays failed. Permission checks: --available-tools controls visibility, --allow-tool approves, --deny-tool wins, and denying write doesn\'t block shell writes.',
    timing: 'Slot 32:00-36:00. 1:17 skill and /mcp status; 1:05 read-only lookup; 0:38 source/version and boundary; 0:35 /permissions; 0:25 buffer.',
    preStaged: 'Docker Desktop running; required MCP servers connected; fallback c4-source excerpt sanitized; one retry allowed, not a retry loop.',
    cutAt: '35:00',
    cut: 'If MCP/Docker is not healthy or the source/version is not visible by 3:00, say the lookup is unavailable live, show the fallback excerpt, and do not pretend it succeeded.'
  },
  C5: {
    goal: 'Run the offline oracle, seed one labeled mutation, repair narrowly, and rerun the same check.',
    screenCommand: String.raw`(abridged — full prompt in notes)
/agent terraform-validator
Run the C5 block three times: before, seeded-failure, repaired.
/agent terraform-coder
Ask for the enablePrivateCluster true -> false mutation, then restore only that field.
/review
/diff
Rerun the same validator block.`,
    command: [
      '/agent terraform-validator',
      '$PSNativeCommandUseErrorActionPreference = $false',
      String.raw`$env:TF_CLI_CONFIG_FILE = (Resolve-Path '..\offline\terraform.tfrc').Path`,
      String.raw`$env:CHECKPOINT_DISABLE = '1'; $env:TF_IN_AUTOMATION = '1'`,
      String.raw`if (Get-ChildItem Env: | Where-Object Name -Match '^(ARM_|AZURE_(?!CORE_)|TF_VAR_|TF_CLI_ARGS)') {`,
      String.raw`  throw 'Remove inherited credentials/overrides in the isolated child, without displaying values.'`,
      '}',
      String.raw`$phase = 'before' # Repeat as seeded-failure and repaired, using new log names.`,
      String.raw`$log = "..\evidence\c5-$phase.log"`,
      String.raw`if (Test-Path $log) { throw 'Keep the previous result; choose a new take.' }`,
      String.raw`terraform -chdir='terraform\modules\aks-automatic-corp' init -backend=false -input=false -lockfile=readonly`,
      String.raw`if ($LASTEXITCODE) { throw 'Offline initialization failed.' }`,
      "terraform -chdir='terraform\\modules\\aks-automatic-corp' test `",
      '  -no-color 2>&1 | Tee-Object $log',
      '$code = $LASTEXITCODE',
      String.raw`$code | Set-Content "..\evidence\c5-$phase.exit.txt"`,
      '"Exit: $code"',
      String.raw`if ($phase -ne 'seeded-failure' -and $code) { throw 'Clean check failed.' }`,
      String.raw`if ($phase -eq 'seeded-failure' -and -not $code) { throw 'Mutation was not detected.' }`,
      '/agent terraform-coder',
      'Native terraform-coder: in this disposable worktree only, change',
      'body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.',
      'Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.',
      "# Rerun the same block with $phase = 'seeded-failure'.",
      '/review',
      'Read-only review of this labeled mutation; identify the violated assertion.',
      '/agent terraform-coder',
      'Restore only body.properties.apiServerAccessProfile.enablePrivateCluster to true.',
      'Change nothing else.',
      '/diff',
      '/agent terraform-validator',
      "# Rerun the same block with $phase = 'repaired'."
    ].join('\n'),
    expected: 'Before and repaired runs exit zero; seeded-failure exits nonzero for the private API assertion, with the original hash restored.',
    driver: 'Haflidi takes control; Martin explains the repair.',
    pointAt: 'Point at command, exit code, deliberate mutation label, failing assertion, /review, /diff, and the repaired rerun.',
    fallback: 'Use saved c5-before, c5-seeded-failure, and c5-repaired logs; B1v2 was 5/5 in eval, but the live run still must pass. Ordinary test repair isn\'t formal rejection; a formal rejection requires a different independent author, the rejected author doesn\'t produce or advise on that revision, and it is not a filesystem lock.',
    timing: 'Slot 36:00-41:00. 0:40 clean check; 1:10 seed mutation; 0:40 intended failure; 1:15 review/restore/diff; 0:45 repaired rerun; 0:30 buffer. Checkpoint: must be out of C5 at 41:00.',
    preStaged: 'Validator shell ready; environment scrub command copied; three log names chosen; seeded mutation can be applied from fallback if the model turn runs long.',
    cutAt: '39:45',
    cut: 'If the repair is not ready, stop live mutation work, show saved seeded-failure and repaired logs, then continue.'
  },
  C6: {
    goal: 'Save the public reason, resume the right session, and verify the next task reads it.',
    screenCommand: String.raw`(abridged — full prompt in notes)
Scribe: record the public-only decision under .squad\decisions\inbox\ (Scribe later merges decisions.md).
/new
/resume guided-clean-run
/cwd
/context
/usage
Ask the resumed task to cite the decision and next constraints.`,
    command: String.raw`Scribe: record the public-only decision under .squad\decisions\inbox\ for later merge into .squad\decisions.md.
Decision: private API invariant, caller-owned provider/backend, added network-payload regression,
labeled mutation/restoration, exact checks, and the sanitized Azure-validation boundary without exposing private target details.
Do not copy histories, credentials, or full conversations.
/new
/resume guided-clean-run
/cwd
/context
/usage
Read the saved decision; cite its file and the constraints for the next change.`,
    expected: 'The resumed task cites the decision file and constraints; context and usage are inspected before more work.',
    driver: 'Haflidi leads; Martin verifies the recovered reason.',
    pointAt: 'Point at the decision record, the resumed session name, the cited file, /context, and /usage.',
    fallback: 'Use c6-decision.md and session screenshots; do not display personal memory or unrelated sessions.',
    timing: 'Slot 45:00-48:00. 0:35 decision record; 0:45 /new, /resume, /cwd; 0:35 /context and /usage; 0:50 cite constraints; 0:15 buffer.',
    preStaged: 'Decision excerpt sanitized and ready; unrelated personal memory or session list not shown; resume target known.',
    cutAt: '47:15',
    cut: 'If resume/search is slow, show the decision file and state the constraints directly.'
  },
  C7: {
    goal: 'Validate the consumer-facing artifact, inspect the diff, and hand it to an independent reviewer.',
    screenCommand: String.raw`(abridged — full prompt in notes)
/agent terraform-validator
Run the C7 offline suite: fmt, init, validate, tflint, module test, example init/validate/test, diff.
/diff
/new
/agent terraform-reviewer`,
    command: String.raw`/agent terraform-validator
$PSNativeCommandUseErrorActionPreference = $false
$env:TF_CLI_CONFIG_FILE = (Resolve-Path '..\offline\terraform.tfrc').Path
$env:CHECKPOINT_DISABLE = '1'; $env:TF_IN_AUTOMATION = '1'
if (Get-ChildItem Env: | Where-Object Name -Match '^(ARM_|AZURE_(?!CORE_)|TF_VAR_|TF_CLI_ARGS)') {
  throw 'Inherited credentials/overrides are not permitted.'
}
function Check($id, $exe, [string[]]$argv) {
  $log = "..\evidence\c7-$id.log"
  if (Test-Path $log) { throw 'Result already exists.' }
  "$exe $($argv -join ' ')" | Set-Content $log
  & $exe @argv 2>&1 | Tee-Object -FilePath $log -Append
  $code = $LASTEXITCODE
  $code | Set-Content "$log.exit.txt"
  if ($code) { throw "$id failed: $code" }
}
$m = 'terraform\modules\aks-automatic-corp'
$e = "$m\examples\corp-existing"
Check fmt terraform @("-chdir=$m",'fmt','-check','-recursive')
Check init terraform @("-chdir=$m",'init','-backend=false','-input=false','-lockfile=readonly')
Check validate terraform @("-chdir=$m",'validate','-no-color')
Check lint tflint @("--chdir=$m",'--config=.tflint.hcl','--no-color')
Check module terraform @("-chdir=$m",'test','-no-color')
Check example-init terraform @("-chdir=$e",'init','-backend=false','-input=false','-lockfile=readonly')
Check example-validate terraform @("-chdir=$e",'validate','-no-color')
Check example terraform @("-chdir=$e",'test','-no-color','-var-file=terraform.tfvars.example')
Check diff git @('--no-pager','diff','--',$m)
/diff
/new
/agent terraform-reviewer`,
    expected: 'Offline checks pass, the diff is reviewed with sanitized evidence, and the human approves a specific artifact and scope.',
    driver: 'Haflidi leads review; Martin drives the validator/reviewer handoff.',
    pointAt: 'Point at offline check exits, c7-final.diff, file hashes, reviewer findings, and the code-only human acceptance.',
    fallback: 'Use c7-final.diff, saved exit logs, Online apply runs 37771532872/37772290635, Test-OnlineSecurity 29/29, and Test-DemoVm 14/14; no private IDs.',
    timing: 'Slot 50:00-53:00. 1:10 offline suite or already-running exits; 0:45 /diff and sanitized boundary; 0:50 reviewer scope; 0:15 buffer. Checkpoint: s20-consumer must start at 53:00.',
    preStaged: 'Offline suite can run from a prepared shell; logs have no private IDs; reviewer prompt copied; no private plans or raw state on screen.',
    cutAt: '52:15',
    cut: 'If the full suite is not done, show the saved green exits and diff; do not run a second suite live.'
  }
};

const notePlan = (driver, say, doText, point, handoff) => `<p><strong>Driver:</strong> ${escape(driver)}</p><ol class="presenter-plan"><li><strong>Say:</strong> ${escape(say)}</li><li><strong>Do:</strong> ${escape(doText)}</li><li><strong>Point at:</strong> ${escape(point)}</li><li><strong>Hand-off:</strong> ${escape(handoff)}</li></ol>`;
const demoBoundary = chapter => chapter === 'C0'
  ? 'C0 starts before Squad exists, then uses Genuine Copilot CLI with Squad selected in a real integrated terminal; capture controllers stay external, off-screen tooling; Qualify code first; execute from a disclosed clean checkpoint.'
  : 'Genuine Copilot CLI with Squad selected in a real integrated terminal; capture controllers stay external, off-screen tooling; Qualify code first; execute from a disclosed clean checkpoint.';
const demoNotes = chapter => {
  const run = demoRuns[chapter];
  return `<p><strong>Driver:</strong> ${escape(run.driver)}</p><p><strong>Live surface:</strong> ${escape(demoBoundary(chapter))}</p><p><strong>Timing:</strong> ${escape(run.timing)}</p><p><strong>Pre-staged:</strong> ${escape(run.preStaged)}</p><ol class="presenter-plan"><li><strong>Say:</strong> ${escape(run.goal)} Keep this as a live demo; optional recordings are fallback evidence, not a dependency.</li><li><strong>Type:</strong></li></ol>${code(run.command, `${chapter} live command / prompt`, 'powershell')}<ol class="presenter-plan" start="3"><li><strong>Point at:</strong> ${escape(run.pointAt)}</li><li><strong>Expected:</strong> ${escape(run.expected)}</li><li><strong>Cut at ${escape(run.cutAt)} (75%):</strong> ${escape(run.cut)}</li><li><strong>Hand-off:</strong> ${escape(chapter === 'C5' ? 'Haflidi hands controls back to Martin for evidence levels.' : chapter === 'C7' ? 'Martin takes back the deck for the consumer slide.' : 'Use the next slide transition line in the run plan.')}</li></ol><p><strong>Offline fallback:</strong> ${escape(run.fallback)}</p>`;
};

const presenterNotes = new Map([
  ['opening', notePlan('Operator', 'Hold the NIC 2026 opening page while the room settles.', 'Confirm timer, speaker notes, and local deck server are ready.', 'NIC mark and blank stage clock.', 'Advance to s01-outcome at 00:00.')],
  ['s01-outcome', notePlan('Martin opens; Haflidi adds the honesty rule.', 'Martin: welcome, name and title, opedal.tech, and the promise: live terminal and browser work on a reusable Terraform module with checks and decisions. Haflidi: name and title, then state the honesty rule: what is live vs pre-staged, inherited, or earlier-run evidence.', '00:00-01:00 Martin intro and audience takeaways; 01:00-02:15 walk the visual and what they will see; 02:15-03:00 Haflidi says live terminal and browser work is live; pre-staged checkpoints, inherited module code, and earlier-run evidence are disclosed fallback evidence.', 'Martin Opedal, Enterprise Cloud Solution Architect, Microsoft; opedal.tech. Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft. Takeaways and honesty rule.', 'Martin hands to baseline: First, here is the code and checkpoint we are not hiding.')],
  ['s03-baseline', notePlan('Martin', 'This starts from inherited public code. The source pin is evidence, not a quality claim.', 'Timing: speak 0:30 and bank 0:30. Read the pin, say the module now exists, passed local qualification before delivery, and starts live demos from a disclosed clean checkpoint; never claim first implementation.', 'e9a9a48 and the inherited findings only.', 'Martin hands to the news/product-map sequence.')],
  ['s04-news', notePlan('Martin with Haflidi status checks.', 'Copilot CLI is GA; Squad 1.0.1 is the demo install; computer use is preview and not used here.', 'Keep to 1:00. Read one headline plus Squad 1.0.1; leave product-tile detail to the appendix or hallway.', 'CLI GA and Squad 1.0.1; status labels only.', 'Martin moves to the layer map.')],
  ['s04-layers', notePlan('Haflidi then Martin', 'Name the layer before troubleshooting: CLI runs work, Squad coordinates, Terraform and sources return evidence.', 'Trace arrows from CLI to Squad to external tools, then read the control spectrum as modes, not a maturity ladder inside the existing one-minute slot: Ask C1, edit C5, plan C2, agent C3, tools and permissions C4, resume C6, gated review C7; C0 is setup/runway and -p is appendix automation, not a live chapter.', 'The three layers, artifact boundary, and the C0-C7 placement on the control spectrum.', 'Martin leads into agent setup.')],
  ['s07-agent-setup', notePlan('Martin', 'We will show the bootstrap path before the team does Terraform work.', 'Name the exact playbook sequence: prerequisites/install, `squad init`, `copilot --agent squad`, roster and charters after human confirmation, then `squad doctor`.', 'Install/prereq card, `squad init`, roster/charters, and `squad doctor` health check.', 'Hand to Haflidi for C0: Now do those steps from a clean machine.')],
  ['s05-parallel', notePlan('Martin', 'Parallel work needs three accountable lanes: terraform-coder writes, terraform-validator runs fixed offline checks, and terraform-reviewer reviews in a fresh context.', 'Read each lane and its handoff. Add that Squad/Scribe records decisions under `.squad\decisions\inbox\` for later merge.', 'terraform-coder, terraform-validator, terraform-reviewer, and the decision inbox row.', 'Hand to Haflidi for the module contract.')],
  ['s06-contract', notePlan('Haflidi', 'The module consumes approved existing network inputs; it does not create a landing zone.', 'Point from platform-owned network into the module.', 'Caller-owned provider/backend/state and private Automatic requirements.', 'Hand to Martin for native Plan mode.')],
  ['s08-plan-boundary', notePlan('Haflidi', 'Extract a module, not an environment. Existing estate migration is a separate review.', 'Reveal the warning and contrast module vs consumer root.', 'Typed inputs/outputs, provider requirements, and consumer-owned backend/auth.', 'Hand to Martin for Squad routing.')],
  ['s10-tool-roles', notePlan('Haflidi', 'Instructions, skills, and MCP each have a different job. Skills turn a repeated procedure into reusable, versioned guidance.', 'Keep to 1:00. Name the three controls, say a connected MCP server is not itself source verification, and use the Azure Functions skills source only for the weakened claim that Azure Functions-specific skills improve task guidance. Second opinion from a different model is review input, not approval; our reviewer lane stays the gate.', 'Instructions, skills, MCP columns and the GA Rubber Duck badge in the appendix.', 'Hand to Martin for source grounding.')],
  ['s12-source-check', notePlan('Haflidi', 'An assertion should inspect the generated resource body, not a reassuring variable name.', 'Reveal the source claim, decision, and illustrative assertion.', 'Automatic SKU/private contract and the code example label.', 'Hand to Haflidi for test coverage.')],
  ['s13-test-gap', notePlan('Haflidi', 'The repeatability lesson is B1 0/5, then B1v2 5/5 after the brief stated the oracle rule.', 'Use the full 3:00: 0:45 B1 was ambiguous and stayed 0/5; 0:45 oracle required separate assert blocks; 0:45 B1v2 stated four asserts with error_message and reached 5/5 in the eval; 0:45 no causal or repeatability guarantee, and the live run still has to pass. Drop-order cue: if behind, keep only B1 0/5 and B1v2 5/5.', 'B1 0/5, oracle rule, B1v2 5/5, and live still must pass.', 'Haflidi takes live-demo control for C5 after C4.')],
  ['s15-proof', notePlan('Haflidi with Martin handoff.', 'Evidence has levels: local module tests, caller examples, private IaC validation, Online 29/29 runtime checks, and VM 14/14 answer different questions. Evidence feeds the gate; the gate doesn\'t care who typed the diff.', 'Use 3:00. Read status labels exactly, say runtime checks/evidence only, and explain which question each level answers. Drop-order cue: if behind, read the ladder only and move depth to appendix.', 'Inspected, 52 passed, 2 passed, Approved, Succeeded, and the bridge sentence under the ladder.', 'Martin takes continuity slide.')],
  ['s16-continuity', notePlan('Martin', 'Save the reason, not the whole chat. The next task must read the decision.', 'Trace decision into the next task.', 'Conversation, native memory, and repository knowledge distinction.', 'Hand to Haflidi for resume.')],
  ['s18-memory', notePlan('Martin', 'Conversation context, native memory, and Squad knowledge have different owners.', 'Use 2:00. Keep personal memory closed. Say agents write public decisions into `.squad\decisions\inbox\`; Scribe merges the reviewed record later. Drop-order cue: if behind, keep only three stores, three owners.', 'Conversation, Native memory, Repository knowledge rows and the decision-inbox path.', 'Hand to Haflidi for final review.')],
  ['s20-consumer', notePlan('Martin', 'Reuse the module code, not the private environment. Whether a change is human-authored or agent-assisted, it goes through the same gates.', 'Timing: 0:00-0:30 diagram at 53:00; 0:30-1:00 live reveal at 53:30-54:00: https://aks-online-demo.swedencentral.cloudapp.azure.com/; 1:00-2:10 say the verified gate map: PR to checks/scans (fmt, validate, TFLint, Trivy, Checkov), required review plus protected main, Terraform plan, online environment approval, OIDC apply, runtime check; 2:10-3:00 boundary and appendix/hallway depth. The audit is the PR/review/check/environment/Actions trace. Documented gap: the security case says a single maintainer used an admin override and prevent_self_review is off; say that honestly if asked. The self-signed cert warning is expected and pre-accepted in the pre-staged browser tab. Drop-order cue: if behind, keep the 30s reveal and gate line, drop depth.', 'Consumer diagram, branded page, pipeline flow, serving pod name, speakers section, gate map, audit trace, and the documented maintainer-gap caveat.', 'Hand to Haflidi: same module, guarded consumer, now three rules for the next change.') + '<p><strong>Offline fallback:</strong> Use the prepared screenshot plus apply runs 37771532872/37772290635 and Test-OnlineSecurity 29/29 at 13:48 on Oct 8.</p>'],
  ['s21-limits', notePlan('Haflidi then Martin', 'Bound the work, inspect what changed, and leave a useful handoff.', 'Use 2:00 for three rules only; no new examples. Drop-order cue: if behind, compress to 0:30 and move the three rules into the close.', 'Three closing rules and final statement.', 'Martin starts the 58:00 close.')],
  ['s22-questions', notePlan('Martin closes; Haflidi available for questions if time allows.', 'Humans set direction and approve; agents help move work through the same gated loop. Day 2: the same loop for operations: detect, propose, review, approve, apply, verify.', '58:00-59:15 Martin closes and points to repository/module; 59:15-59:45 Haflidi says appendix/hallway questions are available; 59:45-60:00 stop. If ahead, take one question; otherwise end cleanly.', 'Close message, text-only GitHub Copilot product name, day-2 line, questions-if-time-allows line, and appendix links.', 'Stop by 60:00; appendix remains available afterwards.')],
  ['a-cli-controls', notePlan('Martin', 'Use this appendix for branching and recovery questions.', 'Explain /fork, /worktree, /rewind, and /resume without promising Azure rollback.', 'Command rows and worktree caveat.', 'Return to the close slide.')],
  ['a-automation', notePlan('Martin', 'Use this appendix for bounded automation and cost-control questions.', 'Explain /autopilot, -p, /fleet, /subagents, /limits, and soft accounting, including five default continuations when relevant.', 'Soft credit limits, parent/subagents share accounting, and compaction can consume credits.', 'Return to the close slide.')],
  ['a-handoffs', notePlan('Haflidi', 'Use this appendix for local versus cloud-agent work.', 'Contrast local work, /delegate draft-PR cloud work, and /remote steering of a still-running local session.', 'host must remain online, and draft-PR output still needs review.', 'Return to the close slide.')],
  ['a-integrations', notePlan('Haflidi', 'Use this appendix for editor, plugin, and research questions.', 'Explain /ide, /lsp, /plugin, /research, and /rubber-duck as optional context sources.', 'Availability is not setup evidence.', 'Return to the close slide.')],
  ['a-squad-ops', notePlan('Martin', 'Use this appendix for Squad maintenance questions.', 'Mention status, doctor, export/import, nap --dry-run, loop, and triage.', 'Back up before import; round-trip fidelity is not guaranteed; triage can mutate labels without --execute; execution runners may use broad permission flags; distinguish .github\\skills from .squad\\skills.', 'Return to the close slide.')],
  ['a-evidence', notePlan('Haflidi', 'Use this appendix for evidence-gate questions.', 'Separate source reproduction, local checks, consumer example, private plan/apply, and read-back.', '0/2/1 Terraform plan exit meanings and no raw private plans.', 'Return to the close slide.')],
  ['a-online', notePlan('Martin', 'Use this appendix for Online landing-zone questions.', 'Cite the same module, thin root, guardrails, runtime checks, and runs 37771532872/37772290635.', 'HTTPS 200 by hostname, title verified, Test-OnlineSecurity 29/29, no private IDs.', 'Return to the close slide.')],
  ['a-security', notePlan('Haflidi', 'Use this appendix for security questions.', 'Explain GHAS baseline, silent gaps, oracle = scripted pass/fail check, and human approvals.', '52+2 local checks, 29/29 Online, 14/14 demo VM, zero open GHAS alerts on Oct 7.', 'Return to the close slide.')],
  ['a-prompts', notePlan('Martin', 'Use this appendix for repeatability and prompt questions.', 'State the measured eval: B1 0/5, B2 5/5, B3 4/5 (rescored from 0/5 after a disclosed harness bug; saved diffs, no rerun), B1v2 5/5 after clarified brief.', 'No identical-output claim; B1v2 changed the brief and the live run still has to pass.', 'Return to the close slide.')],
  ['a-bootstrap', notePlan('Haflidi', 'Use this appendix for starting Squad.', 'Walk the five steps: prerequisites, install, squad init, copilot --agent squad, confirm roster, squad doctor, backup before upgrade.', 'WinGet Squad 1.0.1 and docs/playbook.md after PR #7.', 'Return to the close slide.')],
  ['a-use-cases', notePlan('Martin', 'Use this appendix for when Squad earns its place.', 'Say Copilot CLI runs the work; Squad routing assigns an accountable owner and records why.', 'Cross-owner work, long-lived decisions, issue/review flow.', 'Return to the close slide.')]
]);

export function applyNoteFactOverrides(slideId, noteHTML) {
  if (/^demo-c[0-7]$/.test(slideId)) return demoNotes(`C${slideId.at(-1)}`);
  return presenterNotes.get(slideId) || noteHTML;
}

const chapter = (number, duration, time, chapterTitle, layer, points, tip, sources) => ({
  id: `demo-c${number}`, title: chapterTitle, time, layer, kind: 'demo',
  chapter: `C${number}`, duration, points, tip, sources,
  treatment: 'LIVE demo'
});

export const slides = [
  {
    id: 'opening', title: 'NIC 2026', time: 'Pre-show',
    layer: 'NIC 2026', kind: 'opening', preshow: true,
    tip: 'Hold here before the clock starts. Advance to the first content slide at 00:00.',
    sources: [brandCopilot, brandLogo],
    content: productName(),
    notes: 'Pre-show holding slide. Keep this visible while the room settles and before the timed session starts. It carries the official NIC 2026 template mark and a text-only GitHub Copilot product name, so it does not consume the 60-minute delivery clock.'
  },
  {
    id: 'legal-notice', title: 'Legal and futures notice', time: 'Pre-show',
    layer: 'Public-source notice', kind: 'legal', preshow: true,
    tip: 'Show briefly before starting the clock; the clock still starts at s01 00:00.',
    sources: [],
    content: `<div class="legal-card"><p>Feature status reflects public sources as of 14 October 2026.</p>
      <p>Preview features can change or be withdrawn.</p>
      <p>Dates and availability are not commitments.</p>
      <p>Demo code and evidence are provided as-is, without warranty.</p></div>`,
    notes: 'Untimed legal and futures notice. It appears after the opening page and before s01; the session clock still starts at s01-outcome 00:00.'
  },
  {
    id: 's01-outcome', title: 'A module worth reusing.', time: '00:00-03:00',
    layer: 'Copilot CLI / Squad / Terraform', kind: 'hero',
    tip: 'Introduce the speakers, the artifact, the live surfaces, and the honesty rule.', sources: [cli, squad, onlineDemo],
    content: `<div class="hero-copy intro-grid"><div class="intro-promise"><p class="hero-lede">Copilot CLI and Squad,<br>working together.</p>
      <p class="hero-description">You will see a reusable Terraform module emerge from live terminal and browser work, checked evidence, and explicit handoffs.</p>
      <ul class="intro-takeaways"><li>How to bootstrap a Squad-backed Copilot CLI workflow.</li><li>How to split writer, validator, and reviewer lanes.</li><li>How to carry decisions and evidence into the next change.</li></ul>
      <p class="honesty-rule"><strong>Honesty rule:</strong> live terminal and browser work first; prepared checkpoints, inherited module code, and earlier-run evidence are disclosed fallbacks.</p>
      <p class="session-meta">October 14, 2026 / 10:00-11:00 / Room 6</p></div>
      <div class="live-speakers" aria-label="Speakers, recreated from the live demo page without external requests">
        <div class="live-speaker-card martin"><span class="speaker-initials">MO</span><div><h3>Martin Opedal</h3><p>Enterprise Cloud Solution Architect, Microsoft</p><a href="https://www.opedal.tech">opedal.tech</a></div></div>
        <div class="live-speaker-card"><span class="speaker-initials">HF</span><div><h3>Haflidi Fridthjofsson</h3><p>Sr Cloud Solution Architect, Microsoft</p><a href="https://github.com/haflidif">@haflidif</a></div></div>
      </div></div>`
  },
  {
    id: 's03-baseline', title: 'Start with the code you have.', time: '03:00-04:00',
    layer: 'Terraform / source evidence', kind: 'baseline', sources: [upstream],
    tip: 'Disclose the source, qualified reference, clean checkpoint, and live-demo change.',
    content: `<div class="baseline-facts"><div class="source-pin"><span class="eyebrow">Inherited public source</span><strong>e9a9a48</strong></div>
      <div class="stat"><strong>10</strong><span>existing negative test cases<br><em>Not a passing test claim.</em></span></div>
      <p class="supporting">Root declarations overlap.<br>An active provider sits outside the mocks.</p></div>
      <div>${code('sku = {\n  name = "Base"\n  tier = "Standard"\n}', 'Inherited resource excerpt')}
      <p class="code-caption">Inherited mismatch, not AI-attributed.<br>Qualify first; disclose the later clean run.</p></div>`
  },
  {
    id: 's04-news', title: 'Big news this year.', time: '04:00-05:00',
    layer: 'GitHub Copilot / Squad timeline', kind: 'news',
    tip: 'Use the new controls deliberately. Computer use is not part of this Terraform demo.',
    sources: [whatsNew, cliGA, agentHQ, agentHQAgents, billing, limits, skills, reviewSkills, computerUse, computerUseDocs, squad011, squad012, squad013, squad100, squad101],
    content: `<div class="news-grid">
      <div><strong>2026-02-25</strong><span>Copilot CLI ${badge('Copilot CLI')}</span><em>Plan mode ${badge('Plan mode')}, custom agents ${badge('custom agents')}, Skills ${badge('Skills')}, MCP ${badge('MCP')}, and review controls ship for all subscribers.</em></div>
      <div><strong>2025-10-28 / 2026-02-04</strong><span>Agent HQ</span><em>Launched at Universe. Claude and Codex are public preview in Agent HQ.</em></div>
      <div><strong>2026-06-01 / 2026-07-01</strong><span>AI Credits and limits</span><em>Usage-based billing is effective. <code>/limits</code> and <code>--max-ai-credits</code> matter.</em></div>
      <div><strong>2025-12-18 / 2026-07-29</strong><span>Skills and MCP mature</span><em>Agent Skills launch. Skills plus MCP reach GA for Copilot code review.</em></div>
      <div><strong>2026-10-01</strong><span>Computer use, public preview</span><em><code>/computer on|show|off</code>, per-app approval, admin disable. We do not use it here.</em></div>
      <div><strong>2026-10-03 / 2026-10-04</strong><span>Squad ${badge('Squad')}</span><em>Release tags exist; the demo uses 1.0.1. Pinned docs at <code>93aec83</code> may still carry Experimental/alpha wording.</em></div>
    </div>`
  },
  {
    id: 's04-layers', title: 'One workflow. Three distinct layers.', time: '05:00-06:00',
    layer: 'Native CLI / Squad / external tools', kind: 'diagram',     sources: [cli, squad, cliProgrammatic, cliResume],
    tip: 'Name the layer before troubleshooting the behavior.',
    content: `${fig(layers())}${autonomySpectrum()}`
  },
  {
    id: 's07-agent-setup', title: 'Meet the agent setup.', time: '06:00-07:00',
    layer: 'Repository guidance / native profiles / MCP', kind: 'agent-setup',
    tip: 'Show the bootstrap path before showing the team at work.',
    sources: [guide, cleanMachine],
    content: `${fig(agentSetup())}<div class="agent-notes-grid">
      <div><strong>Prereqs and install</strong><span>Git, Copilot CLI, Squad 1.0.1, login, and a clean repository clone.</span></div>
      <div><strong><code>squad init</code></strong><span>Scaffolds coordinator files, built-ins, workflows, skills, and <code>.squad\\</code> state.</span></div>
      <div><strong><code>copilot --agent squad</code></strong><span>Init Mode proposes roster and charters; the human confirms before team files are written.</span></div>
      <div><strong><code>squad doctor</code></strong><span>Verifies setup health. It is not Terraform correctness or deployment evidence.</span></div>
    </div>`
  },
  chapter(0, 180, '07:00-10:00', 'From zero to a squad', 'Clean Windows 11 / WinGet / Copilot CLI / Squad',
    ['Clean VM through Bastion; Haflidi uses a local VM account', 'WinGet installs, /login, then squad init in the repository', 'Init Mode proposes the roster; confirm, then squad doctor'],
    'Install, init, hire, verify. squad init is idempotent to rerun; roster writes wait for confirmation.', [cliInstall, squad101, cleanMachine]),
  {
    id: 's05-parallel', title: 'Give parallel work separate owners.', time: '10:00-12:00',
    layer: 'Native subagents / Squad routing', kind: 'ownership', sources: [cli, squad],
    tip: 'One lane owns writing, one lane owns fixed checks, one lane reviews from fresh context.',
    content: `<div role="table" aria-label="Agent lanes and handoffs"><div class="lane-header" role="row"><span role="columnheader">Lane</span><span role="columnheader">Owns</span><span role="columnheader">Hands off</span></div>
      <div class="lane" role="row"><strong role="rowheader"><code>terraform-coder</code></strong><span role="cell">Writes the scoped Terraform diff and no other files.</span><span role="cell">Changed files, assumptions, and unresolved questions.</span></div>
      <div class="lane" role="row"><strong role="rowheader"><code>terraform-validator</code></strong><span role="cell">Runs fixed offline checks: fmt, init -backend=false, validate, tflint, tests.</span><span role="cell">Exit codes, logs, and the exact command block.</span></div>
      <div class="lane" role="row"><strong role="rowheader"><code>terraform-reviewer</code></strong><span role="cell">Reviews in a fresh read-only context after the diff exists.</span><span role="cell">Findings, accepted scope, and next owner if rejected.</span></div>
      <div class="lane" role="row"><strong role="rowheader">Squad / Scribe</strong><span role="cell">Routes work and records public decisions.</span><span role="cell"><code>.squad\\decisions\\inbox\\</code> entry for later merge.</span></div></div>
      <p class="ownership-note">Parallel means accountable lanes, not hidden consensus.<br>One writer per shared surface; validation and review stay independent.</p>`
  },
  {
    id: 's06-contract', title: 'Fit the platform you already have.', time: '12:00-14:00',
    layer: 'Terraform / Azure contract', kind: 'diagram', sources: [automatic, aksAutomaticGA],
    tip: 'Consume approved network inputs. Do not rebuild or import the landing zone.',
    content: `${fig(corp())}<p class="status-line"><span class="status pending">Environment validated</span>AKS Automatic ${badge('AKS Automatic')} with sanitized plan, apply, and ARM read-back evidence.</p>`
  },
  chapter(1, 180, '14:00-17:00', 'Same task, different agent choices', 'Native Copilot CLI',
    ['Same brief and reviewed starting state', 'Selected model and effective context', 'One decision and its consequence'],
    'Hold inputs fixed. Equal results are valid.', [cli]),
  {
    id: 's08-plan-boundary', title: 'Extract a module, not an environment.', time: '17:00-19:00',
    layer: 'Terraform / module boundary', kind: 'boundary', sources: [upstream, tests],
    tip: 'Make ownership testable before moving resources.',
    content: `<div class="boundary-panel public"><p class="eyebrow">Reusable module</p><h3>Own the infrastructure contract.</h3>
      <ul><li>Typed inputs and useful outputs</li><li>Provider requirements</li><li>Isolated resource assertions</li></ul></div>
      <div class="boundary-panel"><p class="eyebrow">Consumer and application roots</p><h3>Keep environment ownership outside.</h3>
      <ul><li>Provider configuration and backend</li><li>Private inputs and authentication</li><li>Separate Kubernetes resources</li></ul></div>
      <p class="boundary-warning fragment" data-fragment-index="0">Fresh workload only. Existing state migration needs a separate review.</p>`
  },
  chapter(2, 240, '19:00-23:00', 'Pin the brief and approve a plan', 'Native Plan mode / Squad',
    ['Actual Plan indicator and explicit file context', 'Plan artifact, proposed scope, and human revision', 'Approval, then visible implementation mode'],
    'Inspect the real Plan indicator and artifact before approving implementation.', [cli, guide]),
  {
    id: 's10-tool-roles', title: 'Give context the right job.', time: '23:00-24:00',
    layer: 'Native Copilot CLI / external tools', kind: 'context', sources: [cli, skills, azureFunctionsSkills, rubberDuckGA],
    tip: 'A recipe, repository rule, and external fact are different inputs.',
    content: `<div class="context-column"><span class="large-index">01</span><h3>Instructions</h3><p>Persistent repository expectations.</p><code>@file /instructions</code></div>
      <div class="context-column"><span class="large-index">02</span><h3>Skills ${badge('Skills')}</h3><p>Skills turn a repeated procedure into reusable, versioned guidance.</p><code>/skills</code></div>
      <div class="context-column"><span class="large-index">03</span><h3>MCP ${badge('MCP')}</h3><p>Tools and information beyond the conversation.</p><code>/mcp</code></div>`
  },
  chapter(3, 240, '24:00-28:00', 'Activate Squad and route independent work', 'Native custom agents / Squad',
    ['Selected agent, roster (team list), charters (role instructions), and routing', 'Actual task starts and owned file edits', 'A concrete result and a named handoff'],
    'Pass essential constraints explicitly. A role assignment is not completed work.', [cli, squad, guide]),
  {
    id: 's12-source-check', title: 'Turn the source into an assertion.', time: '28:00-29:00',
    layer: 'External source / Terraform tests', kind: 'assertion', sources: [upstream, tests],
    tip: 'Assert the generated resource, not the name of an input.',
    content: `<div class="assertion-source"><p class="eyebrow">Source claim</p><h3>Automatic is a resource contract.</h3>
      <p class="fragment" data-fragment-index="0">Choose the supported SKU, private API, and system-pool behavior.</p></div>
      <div class="fragment" data-fragment-index="1">${code('condition = (\n  azapi_resource.aks.body.sku.name == "Automatic"\n)', 'Illustrative assertion, not test output')}
      <p class="code-caption">The real case must match the reviewed module.</p></div>`
  },
  {
    id: 's13-test-gap', title: 'Test both sides of the boundary.', time: '29:00-32:00',
    layer: 'Terraform / test design', kind: 'test-design', sources: [tests],
    tip: 'Enumerate every loaded provider before calling a test isolated.',
    content: `<div class="test-pair"><div><p class="eyebrow">B1, ambiguous brief</p><h3>0/5 green.</h3><p>The oracle expected separate assertion blocks; do not rescore or hide it.</p></div>
      <div><p class="eyebrow">B1v2, clarified brief</p><h3>5/5 green.</h3><p>State the oracle rule in the brief: four separate asserts, each with an <code>error_message</code>.</p></div></div>
      <div class="mutation-strip"><strong>Lesson.</strong><span>Brief changed</span><span>No causal or repeatability guarantee</span><span>Live run still must pass</span></div>`
  },
  chapter(4, 240, '32:00-36:00', 'Ground the work with tools', 'Native skills / MCP / permissions',
    ['A skill invocation that affects the work', 'An authoritative source and relevant version', 'One narrow, visible permission decision'],
    'Tool availability and approval are separate controls.', [cli, automatic, guide]),
  chapter(5, 300, '36:00-41:00', 'Catch a mistake and repair it', 'Native review / Squad handoff / Terraform',
    ['A real command and nonzero result', 'A finding, owner, and focused repair diff', 'The same check rerun, with criteria intact'],
    'Ordinary test repair is not formal rejection. Preserve the actual repair evidence.', [cli, tests, guide]),
  {
    id: 's15-proof', title: 'Evidence has levels.', time: '41:00-44:00',
    layer: 'Source / local checks / Azure', kind: 'evidence', sources: [tests, tfplan],
    tip: 'A check is evidence only for what it checks. Private validation and live-demo evidence stay distinct.',
    content: '',
    treatment: 'Current evidence register'
  },
  {
    id: 's16-continuity', title: 'Save the reason, not just the chat.', time: '44:00-45:00',
    layer: 'Native resume / Squad knowledge', kind: 'diagram', sources: [cli, squad],
    tip: 'Keep the accepted boundary and its reason close to the code.',
    content: `${fig(memory())}<p class="large-note">A saved conversation and a repository decision are different artifacts.</p>`
  },
  chapter(6, 180, '45:00-48:00', 'Resume with decisions intact', 'Native session controls / Squad Scribe',
    ['The actual decision record created in this work', 'A resumed task that reads the record', 'Context, usage, and deliberate model choice'],
    'Verify that the reason reached the resumed task.', [cli, squad, guide]),
  {
    id: 's18-memory', title: 'Three places to keep context.', time: '48:00-50:00',
    layer: 'Native CLI / Squad', kind: 'reference', sources: [cli, squad],
    tip: 'CLI compaction and team-state hygiene solve different problems.',
    content: `${row('Conversation', 'Resume the relevant task. Inspect context and usage before continuing.', '<code>/resume /context /usage /compact</code>')}
      ${row('Native memory', 'Manage remembered facts. Keep personal contents off screen.', '<code>/memory</code>')}
      ${row('Repository knowledge', 'Agents write public decisions to <code>.squad\\decisions\\inbox\\</code>; Scribe later merges the reviewed record.', 'Squad / Scribe / reviewed evidence')}`
  },
  chapter(7, 180, '50:00-53:00', 'Reviewed diff to approved Terraform change', 'Native diff / Squad / Terraform',
    ['Module extraction and the consumer-facing diff', 'Meaningful checks and the exact approval', 'Sanitized plan/apply/read-back evidence, with private details omitted'],
    'Approve a specific artifact and scope, not a hopeful summary.', [cli, tfplan]),
  {
    id: 's20-consumer', title: 'Reuse the code, not the environment.', time: '53:00-56:00',
    layer: 'Public Terraform / private consumption', kind: 'diagram', sources: [tests, automatic, onlineDemo, demoEnvRepo, securityCase],
    tip: 'Keep the live reveal to 53:30-54:00, then explain gate, evidence, and boundary.',
    content: `${fig(consumption())}<div class="consumer-reveal"><p class="online-url">https://aks-online-demo.swedencentral.cloudapp.azure.com/</p>
      <p>Whether a change is human-authored or agent-assisted, it goes through the same gates: GitHub identity, OIDC for Azure, scans, required review, branch protection, environment approval, and an Actions audit trail.</p>
      <p class="gate-map">PR → checks/scans (fmt, validate, TFLint, Trivy, Checkov) → review + protected main → Terraform plan → online environment approval → OIDC apply → runtime check</p></div>
      <p class="status-line"><span class="status pending">Consumer runtime evidence</span>Private inputs, state, identities, and run URLs stay out.</p>`
  },
  {
    id: 's21-limits', title: 'Make the next change easier to review.', time: '56:00-58:00',
    layer: 'Copilot CLI / Squad / engineering practice', kind: 'closing', sources: [cli, squad],
    tip: 'Keep the artifact, the reason, and the check together.',
    content: `<div class="closing-line"><span>01</span><p><strong>Bound the work.</strong><br>Plan, context, ownership, and stop conditions.</p></div>
      <div class="closing-line"><span>02</span><p><strong>Inspect what changed.</strong><br>Source, diff, tests, and human review.</p></div>
      <div class="closing-line"><span>03</span><p><strong>Leave a useful handoff.</strong><br>Module, consumer example, decisions, and open gates.</p></div>
      <p class="closing-statement">More agents cannot vote a contract into correctness.</p>`
  },
  {
    id: 's22-questions', title: 'Close.', time: '58:00-60:00',
    layer: 'Close / questions if time allows', kind: 'questions', sources: [guide, brandCopilot],
    tip: 'Close by 60:00. Questions happen only if time allows.',
    content: `${productName()}<p class="questions-lede">Humans set direction and approve; agents help move work through the same gated loop.</p>
      <p class="close-buffer-line">Day 2: the same loop for operations: detect, propose, review, approve, apply, verify.</p>
      <p class="close-buffer-line">We stop at 60:00. Questions if time allows; appendix links stay useful afterwards and in the hallway.</p>
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
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, cliResume, cliReview, guide],
    tip: 'A worktree separates files, not credentials. Rewind is not Azure rollback.',
    content: `${row('Explore an alternative', '<code>/fork</code> carries context.<br><code>/worktree</code> separates working files.')}
      ${row('Recover CLI work', `<code>/rewind</code><br>Inspect with <code>/diff</code> ${badge('/diff')} and request <code>/review</code> ${badge('/review')}.`)}
      ${row('Return to the task', `<code>/resume</code> ${badge('/resume')}<br>Select the relevant session, not unrelated history.`)}`
  },
  {
    id: 'a-automation', title: 'Automate bounded work.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, cliProgrammatic, guide],
    tip: 'Keep the objective, permissions, and stopping point explicit.',
    content: `${row('Finish a finite task', '<code>/autopilot /limits</code><br>Soft credit limits, not financial or safety guarantees.')}
      ${row('Script a prompt', `<code>-p / --prompt</code> ${badge('-p')}<br>Programmatic work, not the interactive Plan-mode demo.`)}
      ${row('Split independent work', '<code>/fleet /subagents</code><br>Give each task an artifact and owner.')}`
  },
  {
    id: 'a-handoffs', title: 'Choose where the work happens.', time: 'Appendix',
    layer: 'Native Copilot CLI', kind: 'reference', sources: [cli, cliDelegate, rubberDuckGA, rubberDuckBlog, guide],
    tip: 'Reference only. Cloud delegation and local-session steering are different operations.',
    content: `${row('Work locally', 'Use the local repository, review its diff, and retain ownership.')}
      ${row('Hand off a PR task', `<code>/delegate</code> ${badge('/delegate')}<br>Cloud-agent draft PR; review the resulting diff.`)}
      ${row('Ask for critique', `<code>/rubber-duck</code> ${badge('Rubber Duck')}<br>Second opinion from a different model is review input, not approval.`)}`
  },
  {
    id: 'a-integrations', title: 'Add the context you need.', time: 'Appendix',
    layer: 'Native Copilot CLI / external integrations', kind: 'reference', sources: [cli, skills, azureFunctionsSkills, guide],
    tip: 'Availability is not setup evidence. Review tools and sources before use.',
    content: `${row('Editor and code context', '<code>/ide /lsp</code><br>Useful with a configured editor or language service.')}
      ${row('Packaged capabilities', '<code>/plugin</code><br>Review trust, permissions, and dependencies.')}
      ${row('Skills for repeatability', `Azure Functions-specific skills improve task guidance. ${badge('Skills')}<br>Do not claim model-independent consistency.`)}`
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
    layer: 'Terraform / Azure / evidence', kind: 'reference', sources: [tests, tfplan, terraform16, automatic],
    tip: 'Raw plans, state, private inputs, and credentials are not public artifacts.',
    content: `${row('Reproduce the source', '<code>e9a9a48</code><br>Keep the full pin and reviewed module revision.')}
      ${row('Check the code and example', `Format, validate, lint, isolated Terraform test ${badge('Terraform test')}, and a deliberate mutation.<br>Then verify the consumer interface.`)}
      ${row('Read the real plan', '<code>0</code> unchanged / <code>2</code> changes / <code>1</code> error<br>October 5 private run supplied sanitized plan/apply/read-back; future targets need their own evidence.')}`
  },
  {
    id: 'a-online', title: 'Same module, Online landing zone.', time: 'Appendix',
    layer: 'Terraform / Azure landing zone / GitHub Actions', kind: 'reference', sources: [demoEnvRepo, upstreamRepo, aksAutomaticGA, appRoutingDocs, aksAbacDocs, bastionEntraDocs],
    tip: 'Guardrails are design inputs. None were bypassed with exemptions.',
    content: `${row('Thin root, same module', `Consumer repo pins the module by tag <code>v0.6.0</code>.<br><code>cluster_sku = "Automatic"</code> ${badge('AKS Automatic')}, BYO VNet, NAT Gateway egress, managed NGINX ${badge('App Routing')}.`)}
      ${row('Guardrails we hit', `Private-only state storage. Subnets must have an NSG.<br>ABAC conditions for AKS custom resources ${badge('ABAC conditions for AKS custom resources')}; Bastion Entra RDP ${badge('Bastion Entra RDP')}.`)}
      ${row('Branded app and runtime check', 'NIC 2026 page with speakers section at <code>aks-online-demo.swedencentral.cloudapp.azure.com</code>; default NGINX self-signed warning expected because no trusted certificate is configured.<br>Runs 37771532872 and 37772290635: No changes, HTTPS 200 by hostname, title verified; the check reads the App Routing controller Service, Azure&#39;s managed NGINX ingress add-on for AKS.')}`
  },
  {
    id: 'a-security', title: 'What AI found that the scanners did not.', time: 'Appendix',
    layer: 'GHAS / MCP / skills / tests', kind: 'reference', sources: [securityCase, onlineDemo],
    tip: 'GHAS sees code, secrets, and advisories. Silent gaps need an agent and an oracle.',
    content: `${row('GHAS baseline, zero open', 'CodeQL, secret scanning with push protection, Dependabot.<br>Module: six checks. Demo env: Terraform Validate, Checkov, TFLint, Trivy.')}
      ${row('Found by the agent', 'Checkov skipped <code>main.tf</code> since August. A scan was off for inactivity.<br>A monitor was falsely green. Two approval and cleanliness races.')}
      ${row('Made checkable', 'Learn via MCP for product rules. Skills for secrets and review.<br>52 module contract cases plus 2 caller/example cases, 29/29 Online security checks, a human on every merge.')}`
  },
  {
    id: 'a-prompts', title: 'Prompts you can rerun.', time: 'Appendix',
    layer: 'Copilot CLI / Squad / MCP', kind: 'reference', sources: [promptPack, guide],
    tip: 'Measure repeatability; do not assume it. Oct 8: B1v2 was 5/5 in this eval after the brief stated the oracle rules.',
    content: `${row('Guardrails first', 'Read effective policy and RBAC at the target before design.<br>Then ground API facts through Learn and Terraform MCP.')}
      ${row('One lane per step', 'Squad lead plans. <code>terraform-coder</code> edits.<br><code>terraform-validator</code> checks. <code>terraform-reviewer</code> reviews in <code>/new</code>.')}
      ${row('Measured repeatability', 'Oct 8 eval: original <code>alternate_network_payload</code> (B1) stayed 0/5 and was not rescored; B1v2 used a clarified brief with four separate assert blocks, each with its own <code>error_message</code>, and was 5/5 in this eval; <code>seeded-mutation-repair</code> 5/5; <code>forbidden-tag-characters</code> B3 4/5*.<br><em>*B3 4/5 (rescored from 0/5 after a disclosed harness bug; saved diffs, no rerun); run 2 stayed red for an out-of-scope README edit.</em><br>B1v2 met the pre-registered at-least-four-of-five bar; brief changed; base, model, flags fixed; not a guarantee; the live run still has to pass.')}`
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
    layer: 'Copilot CLI runs the work / Squad routing assigns owner and records why', kind: 'reference', sources: [cli, squad, guide],
    tip: 'Small, well-understood edit? Use one Copilot CLI session and skip Squad.',
    content: `${row('Work across owners', 'Module, tests, and docs in parallel.<br>One writer per file, handoffs that name the next check.')}
      ${row('Work that outlives a session', 'Decision inbox entries under <code>.squad\\decisions\\inbox\\</code>; Scribe later merges <code>decisions.md</code>.<br>Resume tomorrow, or hand over to a colleague.')}
      ${row('Backlog and review', 'Issues routed by <code>squad:{member}</code> labels; Ralph keeps it moving.<br>A rejected change is revised by a different author.')}`
  }
];

export function evidenceContent(evidence) {
  return `<div role="table" aria-label="Current evidence and remaining gates"><div class="evidence-heading" role="row"><span role="columnheader">Evidence</span><span role="columnheader">Current status</span><span role="columnheader">What it establishes</span></div>
    ${evidence.checks.map((item, index) => `<div class="evidence-row" role="row"><strong role="rowheader"><span class="evidence-index" aria-hidden="true">${index + 1}</span>${escape(item.label)}</strong>
      <span role="cell" class="status ${item.status === 'Pending' ? 'pending' : 'observed'}">${escape(item.status)}</span><p role="cell">${escape(item.detail)}</p></div>`).join('')}</div>
    <p class="evidence-bridge">Evidence feeds the gate; the gate doesn't care who typed the diff.</p>`;
}

export function demoContent(slide) {
  const run = demoRuns[slide.chapter];
  return `<div class="live-demo-card" data-chapter="${slide.chapter}">
    <p class="demo-goal"><span>Goal</span>${escape(run.goal)}</p>
    ${code(run.screenCommand || run.command, `${slide.chapter} live command / prompt`, 'powershell')}
    <p class="demo-expected"><span>Expected result</span>${escape(run.expected)}</p>
  </div>`;
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
    ? 'If the live CLI stalls, use the Offline fallback line in these notes and keep the same chapter timing.'
    : isAppendix ? 'Answer from the verified reference, then return to the close slide. Do not start an unplanned live demonstration.'
      : 'Use the static slide and its spoken explanation. Keep any unresolved evidence labeled unresolved.';
  const captureRule = '';
  if (slide.preshow) {
    return `<section id="${slide.id}" class="${className}" role="region" aria-label="${escape(slide.title)}" data-stage-time="Pre-show" data-preshow="true">
    <div class="slide-content">${slide.content || ''}</div>
    <aside class="notes"><h2>Pre-show / NIC 2026 opening page</h2>${noteHTML}<p><strong>Working tip:</strong> ${escape(slide.tip)}</p><p><strong>Fallback:</strong> Advance to the first content slide before the session clock starts.</p></aside>
  </section>`;
  }
  const headingTag = slide.id === 's01-outcome' ? 'h1' : 'h2';
  return `<section id="${slide.id}" class="${className}" role="region" aria-labelledby="${slide.id}-title" data-stage-time="${slide.time}" ${isAppendix ? 'data-appendix="true"' : ''}>
    <div class="slide-content">
      <div class="slide-meta"><span class="eyebrow">${escape(slide.layer)}</span><span class="stage-time">${isAppendix ? 'APPENDIX / reference only' : escape(slide.time)}</span></div>
      <header class="slide-header">${slide.chapter ? `<span class="chapter-id">${slide.chapter}</span>` : ''}<${headingTag} id="${slide.id}-title">${escape(slide.title)}</${headingTag}></header>
      <div class="slide-body">${content}</div>
      <footer class="slide-footer"><p class="tip"><span>Working tip</span>${escape(slide.tip)}</p><div class="source-links">${isAppendix ? '<a href="#/s22-questions">Back to close</a>' : ''}${slide.sources.map(item => `<a href="${escape(item.url)}"${item.url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(item.label)}</a>`).join('')}</div></footer>
    </div>
    <aside class="notes"><h2>${escape(slide.time)} / ${escape(slide.chapter ? slide.chapter + ': ' + slide.title : slide.title)}</h2>${noteHTML}<p><strong>Working tip:</strong> ${escape(slide.tip)}</p>${captureRule}<p><strong>Fallback:</strong> ${escape(fallback)} Source links are optional reading, not online demo dependencies.</p></aside>
  </section>`;
}
