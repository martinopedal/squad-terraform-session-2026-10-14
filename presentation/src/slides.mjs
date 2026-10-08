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

const demoRuns = {
  C0: {
    goal: 'Install, initialize, hire, and verify Squad on a clean Windows 11 VM.',
    screenCommand: String.raw`Clean VM: prove Git, Copilot CLI, and Squad are absent.
winget install Git.Git, GitHub.Copilot, bradygaster.Squad
/login, clone the public module repo, then run squad init
copilot --agent squad; paste the small-team prompt; confirm roster
squad doctor`,
    command: String.raw`$PSVersionTable.PSVersion; Get-Command git, copilot, squad -ErrorAction SilentlyContinue
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
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
    fallback: 'Use evidence screenshots from Test-DemoVm.ps1 14/14 and the pre-connected VM; if install stalls past 60 seconds, state the stall and move on.'
  },
  C1: {
    goal: 'Compare two equivalent Plan-mode attempts without sharing later state.',
    screenCommand: String.raw`/new; /agent; select Squad; /model; /plan; /rename C1-A
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
    driver: 'Martin drives; Haflidi compares the two results.',
    pointAt: 'Point at /model, the selected Squad agent, equal inputs, and one consequence in the plans.',
    fallback: 'Use saved c1-a.txt and c1-b.txt excerpts from the prepared evidence; do not retry live until outputs differ.'
  },
  C2: {
    goal: 'Turn the scoped Terraform change into a reviewed native Plan-mode artifact.',
    screenCommand: String.raw`/new; /rename guided-clean-run; /agent; select Squad
/instructions; /plan; attach main.tf, variables.tf, and contract.tftest.hcl
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
    fallback: 'Use c2-approved-plan.md and screenshots of the Plan indicator; approval still does not authorize Azure apply. Speaker checks: direct project-write guards, ambiguous shell or MCP limits, A Markdown plan alone is not enforcement. Never use --plan --mode autopilot because it auto-approves.'
  },
  C3: {
    goal: 'Route one writing lane with the clarified B1v2 brief.',
    screenCommand: String.raw`/agent; select Squad; /tasks; /agent list; /mcp
/agent terraform-coder
Paste the B1v2 brief: add alternate_network_payload with four separate asserts, each with error_message.
/agent squad`,
    command: String.raw`/agent
# select Squad
/tasks
/agent list
/mcp
/agent terraform-coder
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
/agent squad`,
    expected: 'The writer lane starts, changed files are visible, and the handoff names owners, checks, and unresolved issues.',
    driver: 'Martin operates; Haflidi reads returned evidence.',
    pointAt: 'Point at Squad selection, roster/routing (team list and routing rules), terraform-coder selection, the four-assert test edit, and c3-handoffs.md.',
    fallback: 'Use B1v2 eval evidence: 5/5 under pinned conditions after the clarified four-assert brief; no causal claim and the live run still has to pass. Custom subagents don\'t inherit repository instructions by default; include-custom-instructions: true opts in. Confirm the behavior in this build.'
  },
  C4: {
    goal: 'Use a skill and a read-only source lookup to change the work, not just decorate it.',
    screenCommand: String.raw`/skills info test-discipline; /mcp
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
    fallback: 'Use c4-source.md with retrieval time, tool, server/version, and limitation; a failed live lookup stays failed. Permission checks: --available-tools controls visibility, --allow-tool approves, --deny-tool wins, and denying write doesn\'t block shell writes.'
  },
  C5: {
    goal: 'Run the offline oracle, seed one labeled mutation, repair narrowly, and rerun the same check.',
    screenCommand: String.raw`/agent terraform-validator
Run the C5 block three times: before, seeded-failure, repaired.
/agent terraform-coder: change enablePrivateCluster true -> false, then restore only that field.
/review; /diff; rerun the same validator block.`,
    command: [
      '/agent terraform-validator',
      '$PSNativeCommandUseErrorActionPreference = $false',
      String.raw`$env:TF_CLI_CONFIG_FILE = (Resolve-Path '..\offline\terraform.tfrc').Path`,
      String.raw`$env:CHECKPOINT_DISABLE = '1'; $env:TF_IN_AUTOMATION = '1'`,
      String.raw`if (Get-ChildItem Env: | Where-Object Name -Match '^(ARM_|AZURE_(?!CORE_)|TF_VAR_|TF_CLI_ARGS)') {`,
      String.raw`  throw 'Remove inherited credentials/overrides in the isolated child, without displaying values.'`,
      '}',
      String.raw`$phase = 'before' # Repeat as seeded-failure and repaired, using new log names.`,
      String.raw`$log = '..\evidence\c5-$phase.log'`,
      String.raw`if (Test-Path $log) { throw 'Keep the previous result; choose a new take.' }`,
      String.raw`terraform -chdir='terraform\modules\aks-automatic-corp' init -backend=false -input=false -lockfile=readonly`,
      String.raw`if ($LASTEXITCODE) { throw 'Offline initialization failed.' }`,
      "terraform -chdir='terraform\\modules\\aks-automatic-corp' test `",
      '  -no-color 2>&1 | Tee-Object $log',
      '$code = $LASTEXITCODE',
      String.raw`$code | Set-Content '..\evidence\c5-$phase.exit.txt'`,
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
    fallback: 'Use saved c5-before, c5-seeded-failure, and c5-repaired logs; B1v2 was 5/5 in eval, but the live run still must pass. Ordinary test repair isn\'t formal rejection; a formal rejection requires a different independent author, the rejected author doesn\'t produce or advise on that revision, and it is not a filesystem lock.'
  },
  C6: {
    goal: 'Save the public reason, resume the right session, and verify the next task reads it.',
    screenCommand: String.raw`Scribe: record the public-only decision in .squad\decisions.md.
/new; /resume guided-clean-run; /cwd; /context; /usage
Ask the resumed task to cite the decision and next constraints.`,
    command: String.raw`Scribe: record the public-only decision in .squad\decisions.md: private API
invariant, caller-owned provider/backend, added network-payload regression,
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
    fallback: 'Use c6-decision.md and session screenshots; do not display personal memory or unrelated sessions.'
  },
  C7: {
    goal: 'Validate the consumer-facing artifact, inspect the diff, and hand it to an independent reviewer.',
    screenCommand: String.raw`/agent terraform-validator
Run the C7 offline suite: fmt, init, validate, tflint, module test, example init/validate/test, diff.
/diff; /new; /agent terraform-reviewer`,
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
    fallback: 'Use c7-final.diff, saved exit logs, Online apply runs 37771532872/37772290635, Test-OnlineSecurity 29/29, and Test-DemoVm 14/14; no private IDs.'
  }
};

const notePlan = (driver, say, doText, point, handoff) => `<p><strong>Driver:</strong> ${escape(driver)}</p><ol class="presenter-plan"><li><strong>Say:</strong> ${escape(say)}</li><li><strong>Do:</strong> ${escape(doText)}</li><li><strong>Point at:</strong> ${escape(point)}</li><li><strong>Hand-off:</strong> ${escape(handoff)}</li></ol>`;
const demoBoundary = chapter => chapter === 'C0'
  ? 'C0 starts before Squad exists, then uses Genuine Copilot CLI with Squad selected in a real integrated terminal; capture controllers stay external, off-screen tooling; Qualify code first; execute from a disclosed clean checkpoint.'
  : 'Genuine Copilot CLI with Squad selected in a real integrated terminal; capture controllers stay external, off-screen tooling; Qualify code first; execute from a disclosed clean checkpoint.';
const demoNotes = chapter => {
  const run = demoRuns[chapter];
  return `<p><strong>Driver:</strong> ${escape(run.driver)}</p><p><strong>Live surface:</strong> ${escape(demoBoundary(chapter))}</p><ol class="presenter-plan"><li><strong>Say:</strong> ${escape(run.goal)} Keep this as a live demo; optional recordings are fallback evidence, not a dependency.</li><li><strong>Type:</strong></li></ol>${code(run.command, `${chapter} live command / prompt`, 'powershell')}<ol class="presenter-plan" start="3"><li><strong>Point at:</strong> ${escape(run.pointAt)}</li><li><strong>Expected:</strong> ${escape(run.expected)}</li><li><strong>Hand-off:</strong> ${escape(chapter === 'C5' ? 'Haflidi hands controls back to Martin for evidence levels.' : chapter === 'C7' ? 'Martin takes back the deck for the consumer slide.' : 'Use the next slide transition line in the run plan.')}</li></ol><p><strong>Offline fallback:</strong> ${escape(run.fallback)}</p>`;
};

const presenterNotes = new Map([
  ['opening', notePlan('Operator', 'Hold the NIC 2026 opening page while the room settles.', 'Confirm timer, speaker notes, and local deck server are ready.', 'NIC mark and blank stage clock.', 'Advance to s01-outcome at 00:00.')],
  ['s01-outcome', notePlan('Martin opens; Haflidi adds the honesty rule.', 'A useful agent session leaves a reusable Terraform module, not just a confident transcript.', 'Introduce both speakers and state that live demos will show commands and evidence boundaries.', 'Module outcome, private landing-zone consumer, and both speaker cards.', 'Martin hands to Haflidi for C1: compare two attempts without making it a competition.')],
  ['s03-baseline', notePlan('Martin', 'This starts from inherited public code. The source pin is evidence, not a quality claim.', 'Read the pin, say the module now exists, passed local qualification before delivery, and starts live demos from a disclosed clean checkpoint; avoid private paths and never claim first implementation.', 'e9a9a48, 10 existing negative cases, root/provider issues.', 'Martin hands to the news/product-map sequence.')],
  ['s04-news', notePlan('Martin with Haflidi status checks.', 'Copilot CLI is GA; Squad 1.0.1 is the demo install; computer use is preview and not used here.', 'Read only dated source tiles and status labels.', 'CLI GA, Agent HQ, AI Credits, Skills/MCP, Computer use preview, Squad 1.0.1.', 'Martin moves to the layer map.')],
  ['s04-layers', notePlan('Haflidi then Martin', 'Name the layer before troubleshooting: CLI runs work, Squad coordinates, Terraform and sources return evidence.', 'Trace arrows from CLI to Squad to external tools.', 'The three layers and artifact boundary.', 'Martin leads into agent setup.')],
  ['s07-agent-setup', notePlan('Martin', 'Always-on instructions, Squad, native profiles, and MCP are different controls.', 'Trace the diagram left to right and define coder, validator, and reviewer lanes.', 'AGENTS.md, .squad\\, terraform-coder, terraform-validator, terraform-reviewer.', 'Hand to Haflidi: show how we get here from nothing.')],
  ['s05-parallel', notePlan('Martin', 'Parallel work needs owners and handoffs, not more uncoordinated agents.', 'Read the lane table and name one writer per Terraform surface.', 'Owner, artifact, and handoff columns.', 'Hand to Haflidi for the module contract.')],
  ['s06-contract', notePlan('Haflidi', 'The module consumes approved existing network inputs; it does not create a landing zone.', 'Point from platform-owned network into the module.', 'Caller-owned provider/backend/state and private Automatic requirements.', 'Hand to Martin for native Plan mode.')],
  ['s08-plan-boundary', notePlan('Haflidi', 'Extract a module, not an environment. Existing estate migration is a separate review.', 'Reveal the warning and contrast module vs consumer root.', 'Typed inputs/outputs, provider requirements, and consumer-owned backend/auth.', 'Hand to Martin for Squad routing.')],
  ['s10-tool-roles', notePlan('Haflidi', 'Instructions, skills, and MCP each have a different job.', 'Keep all three columns visible; do not treat /mcp as source verification by itself.', 'Instructions, skills, MCP columns.', 'Hand to Martin for source grounding.')],
  ['s12-source-check', notePlan('Haflidi', 'An assertion should inspect the generated resource body, not a reassuring variable name.', 'Reveal the source claim, decision, and illustrative assertion.', 'Automatic SKU/private contract and the code example label.', 'Hand to Haflidi for test coverage.')],
  ['s13-test-gap', notePlan('Haflidi', 'Keep negative tests, add positive contract assertions, and test the test with a labeled mutation.', 'Explain oracle = the scripted pass/fail check, and say B1 failed 0/5 until the brief stated four asserts.', 'Negative/positive cases and mutation strip.', 'Haflidi takes live-demo control for C5.')],
  ['s15-proof', notePlan('Haflidi with Martin handoff.', 'Evidence has levels: 52 module cases, 2 caller cases, private IaC validation, Online 29/29, and VM 14/14 answer different questions.', 'Read status labels exactly and say runtime checks are evidence for checked behavior, not evidence for everything.', 'Inspected, 52 passed, 2 passed, Approved, Succeeded.', 'Martin takes continuity slide.')],
  ['s16-continuity', notePlan('Martin', 'Save the reason, not the whole chat. The next task must read the decision.', 'Trace decision into the next task.', 'Conversation, native memory, and repository knowledge distinction.', 'Hand to Haflidi for resume.')],
  ['s18-memory', notePlan('Martin', 'Conversation context, native memory, and Squad knowledge have different owners.', 'Keep personal memory closed and explain compaction versus team-state hygiene.', 'Conversation, Native memory, Repository knowledge rows.', 'Hand to Haflidi for final review.')],
  ['s20-consumer', notePlan('Martin', 'Reuse the module code, not the private environment.', 'Point from consumer root into the module and then to private configuration boundary.', 'Module pin, caller-owned inputs, and no private state/secrets.', 'Hand to Haflidi for operating rules.')],
  ['s21-limits', notePlan('Haflidi then Martin', 'Bound the work, inspect what changed, and leave a useful handoff.', 'Hold the three rules; say more agents cannot vote a contract into correctness.', 'Three closing rules and final statement.', 'Martin opens Q&A at 53:00.')],
  ['s22-questions', notePlan('Martin hosts; Haflidi answers selected technical questions.', 'Ask which part the audience wants to inspect. If quiet, use prepared questions.', 'Open only the relevant appendix, then return to this slide.', 'Appendix links for Online, security, prompts, bootstrap, and use cases.', 'Close at 11:00 with the public handoff and explicit evidence limits.')],
  ['a-cli-controls', notePlan('Martin', 'Use this appendix for branching and recovery questions.', 'Explain /fork, /worktree, /rewind, and /resume without promising Azure rollback.', 'Command rows and worktree caveat.', 'Return to Q&A.')],
  ['a-automation', notePlan('Martin', 'Use this appendix for bounded automation and cost-control questions.', 'Explain /autopilot, -p, /fleet, /subagents, /limits, and soft accounting, including five default continuations when relevant.', 'Soft credit limits, parent/subagents share accounting, and compaction can consume credits.', 'Return to Q&A.')],
  ['a-handoffs', notePlan('Haflidi', 'Use this appendix for local versus cloud-agent work.', 'Contrast local work, /delegate draft-PR cloud work, and /remote steering of a still-running local session.', 'host must remain online, and draft-PR output still needs review.', 'Return to Q&A.')],
  ['a-integrations', notePlan('Haflidi', 'Use this appendix for editor, plugin, and research questions.', 'Explain /ide, /lsp, /plugin, /research, and /rubber-duck as optional context sources.', 'Availability is not setup evidence.', 'Return to Q&A.')],
  ['a-squad-ops', notePlan('Martin', 'Use this appendix for Squad maintenance questions.', 'Mention status, doctor, export/import, nap --dry-run, loop, and triage.', 'Back up before import; round-trip fidelity is not guaranteed; triage can mutate labels without --execute; execution runners may use broad permission flags; distinguish .github\\skills from .squad\\skills.', 'Return to Q&A.')],
  ['a-evidence', notePlan('Haflidi', 'Use this appendix for evidence-gate questions.', 'Separate source reproduction, local checks, consumer example, private plan/apply, and read-back.', '0/2/1 Terraform plan exit meanings and no raw private plans.', 'Return to Q&A.')],
  ['a-online', notePlan('Martin', 'Use this appendix for Online landing-zone questions.', 'Cite the same module, thin root, guardrails, runtime checks, and runs 37771532872/37772290635.', 'HTTPS 200 by hostname, title verified, Test-OnlineSecurity 29/29, no private IDs.', 'Return to Q&A.')],
  ['a-security', notePlan('Haflidi', 'Use this appendix for security questions.', 'Explain GHAS baseline, silent gaps, oracle = scripted pass/fail check, and human approvals.', '52+2 local checks, 29/29 Online, 14/14 demo VM, zero open GHAS alerts on Oct 7.', 'Return to Q&A.')],
  ['a-prompts', notePlan('Martin', 'Use this appendix for repeatability and prompt questions.', 'State the measured eval: B1 0/5, B2 5/5, B3 4/5 after disclosed harness-bug rescore, B1v2 5/5 after clarified brief.', 'No identical-output claim; B1v2 changed the brief and the live run still has to pass.', 'Return to Q&A.')],
  ['a-bootstrap', notePlan('Haflidi', 'Use this appendix for starting Squad.', 'Walk the five steps: prerequisites, install, squad init, copilot --agent squad, confirm roster, squad doctor, backup before upgrade.', 'WinGet Squad 1.0.1 and docs/playbook.md after PR #7.', 'Return to Q&A.')],
  ['a-use-cases', notePlan('Martin', 'Use this appendix for when Squad earns its place.', 'Say Copilot CLI runs the work; Squad decides who does it and remembers why.', 'Cross-owner work, long-lived decisions, issue/review flow.', 'Return to Q&A.')]
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
    tip: 'Disclose the source, qualified reference, clean checkpoint, and live-demo change.',
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
      <div><strong>2026-10-03 / 2026-10-04</strong><span>Squad 1.0 and 1.0.1</span><em>Release tags exist; the demo uses 1.0.1. Pinned docs at <code>93aec83</code> may still carry Experimental/alpha wording.</em></div>
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
    ['Clean VM through Bastion; Haflidi uses a local VM account', 'WinGet installs, /login, then squad init in the repository', 'Init Mode proposes the roster; confirm, then squad doctor'],
    'Install, init, hire, verify. squad init is idempotent to rerun; roster writes wait for confirmation.', [cliInstall, squad101, cleanMachine]),
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
    ['Selected agent, roster (team list), charters (role instructions), and routing', 'Actual task starts and owned file edits', 'A concrete result and a named handoff'],
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
    tip: 'A check proves only what it checks. Private validation and live-demo evidence stay distinct.',
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
    layer: 'Terraform / Azure landing zone / GitHub Actions', kind: 'reference', sources: [demoEnvRepo, upstreamRepo],
    tip: 'Guardrails are design inputs. None were bypassed with exemptions.',
    content: `${row('Thin root, same module', 'Consumer repo pins the module by tag <code>v0.6.0</code>.<br><code>cluster_sku = "Automatic"</code>, BYO VNet, NAT Gateway egress, managed NGINX.')}
      ${row('Guardrails we hit', 'Private-only state storage. Subnets must have an NSG.<br>RBAC Writer cannot create namespaces: managed namespace via ARM.')}
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
      ${row('Measured repeatability', 'Oct 8 eval: original <code>alternate_network_payload</code> (B1) stayed 0/5 and was not rescored; B1v2 used a clarified brief with four separate assert blocks, each with its own <code>error_message</code>, and was 5/5 in this eval; <code>seeded-mutation-repair</code> 5/5; <code>forbidden-tag-characters</code> 4/5 after disclosed harness-bug rescore from saved diffs, no Copilot rerun; run 2 stayed red for an out-of-scope README edit.<br>B1v2 met the pre-registered at-least-four-of-five bar; brief changed; base, model, flags fixed; not a guarantee.')}`
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
    : isAppendix ? 'Answer from the verified reference, then return to Q&A. Do not start an unplanned live demonstration.'
      : 'Use the static slide and its spoken explanation. Keep any unresolved evidence labeled unresolved.';
  const captureRule = '';
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
