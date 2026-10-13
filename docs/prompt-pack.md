# Prompt pack: build a module like this, repeatably

Run these prompts in order to build or extend an AKS Automatic Terraform module with GitHub Copilot CLI, Squad, the three native agent profiles, and read-only MCP documentation lookups. They match the lanes in [AGENTS.md](../AGENTS.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) and the evidence rules in [QUALITY.md](../QUALITY.md). Step-by-step: [playbook](playbook.md).

Repeatable does not mean identical output. A model can choose differently on two runs. These prompts narrow the choices, make every claim checkable, and make a wrong turn visible early. Measure it: run a brief five times from the same checkpoint and count green runs (see [Measure repeatability](#measure-repeatability)).

Audience: public module contributors. [The repo map](repositories.md) separates
canonical reusable Automatic/Corp source, this session's teaching copy and the
live AKS consumer. These prompts do not approve a deployment or move private
values/state into public source.

## Essentials - start here

**Surface key:** PowerShell fences are shell commands. `text` fences containing
slash commands are individual Copilot CLI TUI actions; other text is a human
prompt. Never paste slash commands into PowerShell. Use the public session clone
or its disclosed, disposable checkpoint, not the private coordinator root.
Primary stage host is the VM: approved intended `C:\demo\session-repo`, **not
yet verified on that VM**. Run [VM source setup](demo-runbook.md#create-and-verify-the-agreed-vm-layout),
then create/qualify A, B, guided, `..\offline`, and `..\evidence` before C1.
Verified workstation `C:\git` roots aren't the VM's paths.
Keep native permissions; no secrets/state/private histories on screen, no
blanket approval. A code approval is not an Azure approval.

**Basic entry - PowerShell, public session root:**

```powershell
Set-Location 'C:\demo\session-repo'
git status --short
git --version; copilot --version; squad --version
copilot --agent squad
```

**TUI:** `/cwd`, `/agent`, `/model`, `/instructions`, `/permissions`.
Before these actions, complete [conditional HUMAN setup](demo-runbook.md#conditional-human-setup-before-plan)
only if the selected operation needs it. C1-C7 source/mocked checks need no
Azure login. Reuse the authorized session, don't repeat agent sign-in.
GitHub MCP's five exposed read/context tools are optional; keep working `gh`
for PR operations. No token retrieval, authentication MCP, or new permissions.
Confirm the public root and project profiles; pin `claude-sonnet-5` for eval
parity. Wrong root/missing profiles: stop, exit and restart in the right root.
Already prepared Squad 1.0.1: do not init/upgrade/regenerate the roster.

**Small task first - `/agent terraform-reviewer`, conversational prompt:**

```text
@terraform\modules\aks-automatic-corp\README.md
Read only. In five bullets explain what this module owns, what the caller owns,
the private API invariant, and which checks are local mocks rather than Azure
acceptance. Do not edit, run commands, or contact an Azure account.
```

Checkpoint: a bounded, sourced explanation; one CLI lane is enough for a small
edit. Squad is useful when independent owners and handoffs actually help.

## Walkthrough - C0-C7 before deeper technical work

### C0 - Haflidi, 05:30-08:30; cut 07:45

Surface: PowerShell 7 on a separately qualified clean Windows host, then TUI.
Use the exact install/PATH/clone blocks and roster brief in
[clean-machine-demo.md](clean-machine-demo.md#the-live-chapter-target-300).
The existing bootstrap is preparation, not an in-slot machine upgrade:
`.\scripts\bootstrap-demo-vm.ps1 -WhatIf -SkipLogin` is its preview.
Current VM preservation/Haflidi human gates remain; no power/disk/CSE/reset here.
Unqualified host: disclose prepared fallback or skip, never claim a clean install.
Shell sequence: `copilot`; TUI `/login`, `/exit`; shell `squad init`,
`git status --short`, `copilot --agent squad`; paste the small-team brief,
confirm roster explicitly; TUI `/exit`; shell `squad doctor`.
Checkpoint: actual team files and diagnostics, not Terraform correctness.

### C1 - Martin drives, Haflidi compares, 12:30-15:30; cut 14:45

After [checkpoint creation](demo-runbook.md#create-the-disposable-c1-c7-checkpoints),
start the two host terminals with these exact shell commands. These paths are
newly created by setup, not existing preparation roots:

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\A'
copilot --agent squad
```
```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\B'
copilot --agent squad
```

TUI in those independently prepared A/B worktrees: `/new`, `/agent` → Squad,
`/model`, `/plan`, `/rename C1-A`; repeat as `C1-B` with identical inputs:

```text
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
```

Checkpoint: one consequence, not verbosity. No edits or retry for different text.

### C2 - Martin, 17:30-21:30; cut 20:30

After the same setup, C2-C7 share this guided host session:

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\guided'
copilot --agent squad
```

TUI in guided: `/new`, `/rename guided-clean-run`, `/agent` → Squad,
`/instructions`, `/plan`. Paste:

```text
@terraform\modules\aks-automatic-corp\main.tf
@terraform\modules\aks-automatic-corp\variables.tf
@terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl
This is prepared, qualified code. Plan the C1 regression test and its README
explanation. Keep all eight inputs, six outputs, and the AzAPI resource intact.
Plan a separately labeled enablePrivateCluster mutation and repair.
No implementation, Azure lookup, apply, dependency upgrade, or state operation.
```

Revise: "Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign." Inspect `/session plan`.
Human approves only named repository changes, then leaves Plan mode via actual UI.

### C3 - Martin, 22:00-26:00; cut 25:00

TUI: `/agent squad`, `/tasks`, `/agent list`, `/mcp`.
Ask Squad to assign independent public-source research and read-only review
preparation while one writer owns the test. Observe actual starts and handoffs;
manual profile switches alone are not parallel Squad work. Stop if independent
work cannot be observed; label sequential execution honestly. No concurrent
writers or nested fleet. Submit this human coordination prompt:

```text
Squad: assign independent read-only source research and review preparation.
One coder owns the test; return actual task starts and accountable handoffs.
Do not run a concurrent writer on the shared test file.
```

Then select `/agent terraform-coder` and paste B1v2 exactly:

```text
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
```

Checkpoint: one changed test, four asserts/error messages; assignment is not completion.

### C4 - Martin, 29:30-33:30; cut 32:30 - base only

TUI: `/agent squad`, `/skills info test-discipline`, `/mcp`; paste:

```text
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation. Through the configured Microsoft Learn
MCP, perform only a read-only search/fetch for AKS Automatic private/custom
network requirements. Cite the source/version relevant to private API access
and hosted-system subnets. Don't contact an Azure account or change providers.
```

Inspect `/permissions`; approve only the read-only call. Checkpoint: URL/version,
actual skill/tool output. Missing lookup remains failed/blocked. No cloud extra here.

### C5 - Haflidi, 33:30-38:30; cut 37:15

TUI: `/agent terraform-validator`. PowerShell via `!` in the **same guided CLI
window**, approved uncredentialed/network-restricted subprocess, filesystem-only
provider mirror, pre-staged evidence folder. One block is one shell invocation:

```powershell
$PSNativeCommandUseErrorActionPreference = $false
$env:TF_CLI_CONFIG_FILE = (Resolve-Path '..\offline\terraform.tfrc').Path
$env:CHECKPOINT_DISABLE = '1'; $env:TF_IN_AUTOMATION = '1'
if (Get-ChildItem Env: | Where-Object Name -Match '^(ARM_|AZURE_(?!CORE_)|TF_VAR_|TF_CLI_ARGS)') {
  throw 'Remove inherited credentials/overrides in the isolated child, without displaying values.'
}
$phase = 'before' # Repeat as seeded-failure and repaired, using new log names.
$log = "..\evidence\c5-$phase.log"
if (Test-Path $log) { throw 'Keep the previous result; choose a new take.' }
terraform -chdir='terraform\modules\aks-automatic-corp' init -backend=false -input=false -lockfile=readonly
if ($LASTEXITCODE) { throw 'Offline initialization failed.' }
terraform -chdir='terraform\modules\aks-automatic-corp' test `
  -no-color 2>&1 | Tee-Object $log
$code = $LASTEXITCODE
$code | Set-Content "..\evidence\c5-$phase.exit.txt"
"Exit: $code"
if ($phase -ne 'seeded-failure' -and $code) { throw 'Clean check failed.' }
if ($phase -eq 'seeded-failure' -and -not $code) { throw 'Mutation was not detected.' }
```

Stop if `before` fails. Preserve `main.tf` and its SHA256 in private evidence.
TUI `/agent terraform-coder`; label **DELIBERATE LAB MUTATION**; paste:

```text
Native terraform-coder: in this disposable worktree only, change
body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
```

Rerun the same block as `seeded-failure`; require the intended private API
assertion and nonzero exit, not syntax/auth failure. `/review` is built-in review,
not the independent profile. Ask the coder to restore only that field; inspect
`/diff`; rerun as `repaired`, require exit zero and the original source hash.

### C6 - Haflidi, 42:00-45:00; cut 44:15

TUI `/agent squad`; public-only prompt:

```text
Scribe: record the public-only decision under .squad\decisions\inbox\ for later
merge into .squad\decisions.md. Include private API, caller-owned provider/backend,
network regression, labeled mutation/restoration, exact checks and evidence
limits. No private targets, histories, credentials or full conversations.
```

TUI `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`.
Prompt: `Read the saved decision; cite its file and the constraints for the next change.`
Checkpoint: actual cited reason; hide unrelated sessions. Missing resume: saved
decision fallback, no fabricated recovery.

### C7 - Haflidi, 47:00-50:00; cut 49:15

TUI `/agent terraform-validator`; same isolated guided shell; TFLint 0.64.0
must already work. Approve each command; stop on first failure:

```powershell
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
Check example terraform @("-chdir=$e",'test','-var-file','terraform.tfvars.example','-no-color')
Check diff git @('--no-pager','diff','--',$m)
```

Inspect `/diff`; preserve exact diff/revision and sanitized results.
TUI `/new`, `/agent terraform-reviewer`; use the independent review brief in
technical prompt 5 below. Return findings to `/agent squad` and the human.
Checkpoint: actual independent review, not a profile switch in author context.

## More technical - reference recipes, not the live C1-C7 procedure

The target-discovery and new-consumer recipes below are **reference only**.
C1-C7 add `alternate_network_payload` to the existing
`terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl` and temporarily
mutate/restore `main.tf` under separately labeled code-only approval. They do
not discover Azure policy, create a consumer, or deploy. Resolve any remaining
reference SHA/evidence markers from the actual accepted handoff before reuse.

Use the reusable recipes below only after the basic workflow. Root owns
providers/backend/auth/state. Keep typed inputs, deliberate null/default
semantics, provider pins/locks, lifecycle guards and the safe Automatic/Standard
SKU contract. No ordinary live plan/apply, import or state removal in this show.
Target-specific read commands need separate human consent; use private aliases,
not real environment values in public prompts.

## What makes results repeatable

Here, an **oracle** means the fixed checks/assertions and recorded exits that
decide pass/fail, not the model's verdict.

| Lever | How these prompts use it |
| --- | --- |
| Pinned inputs | One contract file, one baseline commit, named files only. |
| Pinned model and tools | Same `/model` per lane; MCP Terraform server pinned by image digest. |
| Narrow lanes | Coder edits, validator runs approved commands, reviewer reads. One writer per file. |
| Plan before code | Native Plan mode, human approval before any edit. |
| Sourced facts | Microsoft Learn and Terraform Registry through MCP, with URL and version in the handoff. |
| Guardrails first | Read the target's effective policy and RBAC before design (prompt 1). |
| An oracle | Offline checks with fixed commands and exit codes decide green, not the model's summary. |
| Evidence ladder | Mock tests, plan, apply, and read-back are separate claims. |

## Before you start

```powershell
copilot --agent squad --plan
```

Run `/model` and note the model for each lane. In `/mcp`, confirm `microsoft-learn` and `terraform` are connected. Keep native permission prompts on; do not use `--allow-all` or autopilot for these prompts.

Headless MCP check fallback: `copilot mcp list --json` confirms configured server names without adding or removing servers.

## 0. Frame the contract (Squad lead, Plan mode)

```text
@docs/module-contract.md @QUALITY.md @AGENTS.md

Plan, do not implement. Restate the module contract in at most 10 bullets:
inputs, outputs, what the module owns, what the caller owns (providers,
backend, network, identity, namespaces), and the private-by-default posture.
List open questions that would change the design. Name one owner per file.
Wait for my approval.
```

Why: the contract is the stable input every later prompt reads. Changing it is a design decision, not a coding detail.

## 1. Discover the target's guardrails (Squad lead, read-only)

```text
Plan, do not implement. For the target subscription I name, list the
effective deny and modify policies inherited from every management group,
their effects and parameters, and the roles the deployment identity holds.
Use only read commands I approve (az policy assignment list, az role
assignment list). For each guardrail, state which Terraform resource or
Kubernetes object it constrains and what the compliant shape is. Do not
propose exemptions.
```

Why: in the Online deployment, three failures were guardrails, not code. A Modify policy forced storage to private, `Deny-Subnet-Without-Nsg` rejected the AKS-managed VNet, and an RBAC role could not create namespaces. Reading guardrails first turns surprises into design inputs.

## 2. Ground the API facts (coder, MCP lookups only)

```text
/agent terraform-coder

Do not edit yet. Using the microsoft-learn and terraform MCP servers only,
confirm for AKS Automatic: the managedClusters API version in use, supported
outboundType values with BYO subnets, API server VNet integration subnet
requirements, and managedNamespaces availability. Cite URL and version for
each fact. Mark anything you could not source as unverified.
```

## 3. Implement one bounded change (coder)

```text
/agent terraform-coder

Implement only the approved alternate_network_payload test in
terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl. Keep providers and
backend in the root, the module provider-free, typed inputs with
validation, and lifecycle guards unchanged. Add or update the positive and
negative tests that verify the contract change. Hand off: changed files,
contract delta, the assertion that should fail without your change, and
sources. Do not run commands.
```

## 4. Run the oracle (validator, approved commands only)

```text
/agent terraform-validator

Run, stopping at the first failure, in the module root:
terraform fmt -check -recursive
terraform init -backend=false -input=false -lockfile=readonly
terraform validate -no-color
terraform test -no-color
Report each command, tool version, exit code, and relevant output as
pass, fail, blocked, or not applicable. Do not edit files.
```

## 5. Review independently (reviewer, new context)

```text
/new
/agent terraform-reviewer

Review the supplied exact baseline/current revision and diff for
terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl. Confirm the
separately labeled main.tf mutation is restored to its original SHA-256.
Use the supplied sanitized C5/C7 logs and numeric exits; if absent, stop as
blocked. Check caller/module ownership, unknown-at-plan
values in count or for_each, lifecycle guards, test intent, and the
private API and unchanged payload assertions. Return findings with severity, file and line,
consequence, and repair. Missing evidence is blocked, not passed.
```

## 6. Consume it like a customer (coder, then pipeline)

```text
/agent terraform-coder

Create a thin root in deployments/<env>/ that consumes the module with
source = "git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0". The root owns providers, a partial backend, the network
(NSG on every subnet, explicit egress), and anything the guardrails from
step 1 require. Pass IDs the module uses in count as values known at plan
time. Do not put environment values in the module.
```

Then deploy through the pipeline, never from a laptop: plan, read the plan, approve the environment gate, apply, and capture runtime evidence (HTTPS 200 by hostname, HTTP to HTTPS redirect, and DNS matching the App Routing controller Service address for the demo app). The Online example is in the demo-env repository under `deployments/online/` and `.github/workflows/deploy-online.yml`.

## 7. Record the reason (Squad, Scribe)

```text
Record each accepted decision from this change in .squad/decisions/inbox/
with what, why, and the evidence (commit, run ID, check). Public facts only:
no subscription, tenant, or principal IDs.
```

## Measure repeatability

Use the October 8 repeatability eval as a template: three briefs, five fresh runs each, from the same pinned base, model, tools, and allowed files. The harness oracle, not the model summary, marks a run green. Results were mixed: B1 `alternate_network_payload` was 0/5 because it used two assert blocks against a pre-registered `>= 3` rule despite passing all Terraform tests; B2 `seeded-mutation-repair` was 5/5; B3 `forbidden-tag-characters` was 4/5 after a disclosed post-hoc rescore from 0/5 (saved diffs, no rerun) following a harness `-AllowedFiles` bug fix; run 2 stayed red for an out-of-scope README edit. B1v2 re-measured a clarified B1 brief that states the four-assert acceptance shape explicitly and was 5/5 green under the same pinned conditions. The lesson is to state the oracle's rules in the brief, including the expected test shape. For this eval only, a brief met the pre-registered repeatability bar when at least four of five runs were green. Report misses as-is and do not rerun just to fish for green. See [the repeatability eval](determinism-eval.md).

## Lessons from the Online deployment

These came from the real pipeline runs and are now part of the prompts above:

- Private-only storage, NSG-required subnets, and RBAC limits shaped the design more than any code choice. Read guardrails first.
- The root owns the environment. Adding providers to the module would have broken another consumer, so a thin root fixed it.
- Keep the relevant IDs known at plan time. A module that checks `var.subnet_id != null` in `count` fails when the caller creates the subnet in the same root. Pass plan-time-known IDs, or give the module a boolean input.
- Skip module-level `depends_on`. It defers the module's data sources whenever a dependency has a pending change, which can force a resource replacement. Order with resource references instead.
- Read back the real resource. The module promised AKS Automatic but sent the Standard SKU. Only an Azure read-back caught it.
- Keep the public repo free of plan artifacts. Plan and apply run in one gated job, so a plan file is never downloadable.
- Use runtime evidence from the pipeline. The run fails unless the app answers over HTTPS by hostname, redirects HTTP, and the hostname resolves to the App Routing controller Service address.

## Core wrap - before any extra

Artifact + reason + checks + human acceptance. Reuse the module code, not private
inputs/state; deployment belongs to the reviewed consumer pipeline and its own
gates. C0-C7 and technical review are complete before the tail below.

## Optional final extras - only if time and live gates permit

Finish essentials, C0-C7, the technical explanation, consumer reveal and core
wrap **before** either extra. Only a genuine early finish creates spare time
before 55:00; do not shorten core content to manufacture it. Both extras may
be skipped. Stop before 55:00; 55:00-58:00 is protected recovery and
58:00-60:00 is the protected close, never appendix time. Hosted Apps/Jobs
comes first, native ACA Sandboxes last. No stage GO is inferred from source,
an engineering receipt or this reordering.

**Current live gate:** owned hosted source preparation is accepted/merged,
but successful publisher qualification, immutable image, genuine worker auth
and actual README bot PR remain unproved. The qualified attempt failed on
network/TLS/DNS/local Docker limits; live GO is **not** true. External authority,
owner, network, private-evidence and human stage gates remain separate.
No new issue, unsafe Job start or authentication mint while held.
Native 26.768-second fixture engineering/85 rehashes is accepted, not a human
rehearsal or guest-agent/OAuth proof. Both can SKIP.

The dated background retained below preserves the original content, including
earlier waiting/source-review stages. It is preparation history, not the latest
owned-runtime verdict or new permission. Follow the current live gate above.


For the separate product demos use [hosted Squad issue-to-PR versus host
Copilot/Squad-driven native ACA isolation](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).
Native Online five-object provisioning/current operator access/base probe were
independently verified October 12, not AKS/hosted Jobs or Corp network/identity
transplantation. A corrected 26.768-second host run returned three positive guest checks/JSON+SHA,
actual exit23 and causal HTTPS-denial/cleanup proof. Independent acceptance is
complete; native card runtime-ready after acceptance, stage GO still separate.
The earlier CRLF harness failure is learning history.
The installed ACA skill gives guidance, not acceptance. Advanced in-MicroVM
CLI/Squad runtime is optional and separately consented, not the basic host
orchestration prerequisite. Current [progress/coverage](aca-sandboxes.md#full-test-coverage-checklist)
must not be replaced by these example prompts.

## Two product demo prompt recipes

These recipes describe **host Squad isolated work** and **Haflidi's original
hosted issue-to-agent-to-PR flow**, not two VM paths. They are reusable briefs,
not transcripts or permission to create resources. Privately bind approved
targets and exact input revisions; retain raw commands/results outside public
source. Show sanitized source/check/handoff evidence, never tokens or private
context. [Operator cards](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes)
own the timing, fallback and cleanup.

<a id="original-hosted-squad-issue-to-pr-work"></a>

### Original hosted Squad issue-to-PR work: ACA APPS/JOBS

This **SQUAD ON ACA APPS/JOBS** path is hosted agent work, not a SandboxGroup/
MicroVM. Original Haflidi runtime remains working and unchanged; the owned MIT
fork/target handoff/publisher source is independently accepted/merged, not live
E2E. Fresh current end-to-end qualification remains pending; ACA SANDBOXES
success does not count as that proof.

| Field | Contract |
| --- | --- |
| Owner / roles | Haflidi explains his authored implementation; the approved target operator triggers; existing hosted Squad worker returns a bot PR; human reviewer owns acceptance |
| Repos / roots | Read [haflidif/squad-on-aca](https://github.com/haflidif/squad-on-aca) for completed original implementation; [martinopedal/squad-on-aca PR1](https://github.com/martinopedal/squad-on-aca/pull/1) is the owned MIT fork, @haflidif credit/license retained. Use a separately authorized `<approved-private-target>` clone, not the session clone/native group |
| Verified versus pending | Original implementation is completed/previously demonstrated and stays unchanged. Owned fork/target source accepted/merged, target runtimeProven false; credential-free manual status is source-prepared. Live E2E is BLOCKED on private publisher qualification/existing human gate, owner-native Terraform/full QA/real plan/image/auth and actual README bot PR, not new runner registration/AppAdmin |
| Before trigger | Existing human approvals/current target rights, accepted full owner-native Terraform source/exact plan, private publisher Docker/DNS/TLS qualification, immutable image and genuine worker authentication, then sanitized chain rehearsal. No token/cache copy, service rebuild or second standalone fork Bicep writer |
| Timing / fallback | Final optional tail after core wrap, only genuine spare time and fresh GO; hard cut before 55:00. Otherwise show dated original chain evidence or skip; no second issue or on-stage registration repair |
| Cleanup | Only the newly created owned test issue/PR/execution, after separate owner approval; verify queue drain. Never modify/delete the original hosted service or native group |

Use this bounded issue body after the target owner approves the exact README
change. It is a workload brief for the existing hosted flow, not a host terminal
instruction or a claim that work completed:

```text
Demo task: add one approved public-facing README paragraph explaining how this
repository hands a bounded issue to Squad and receives a reviewable bot PR.
Change only README.md; do not alter code, workflows, deployment or permissions.
Use no credentials, private environment values, personal context or copied logs.
Preserve existing instructions and attribution. Return one small PR with the
exact diff, checks actually run, missing checks and a human-review handoff.
Do not merge or deploy. Stop and report blocked access rather than rebuilding
the hosted service or changing the task to make it appear successful.
```

The operator resolves aliases privately and follows the accepted source-prepared
private scheduled poller mode: one existing approved issue -> existing queue -> genuine
Squad UID10001 worker -> trusted README App-bot PR. `gh auth status` and the
credential-free manual status check do not authorize a live trigger. Only after
all separate runtime/human gates pass, read the existing approved issue and
confirm it hasn't already been queued/attempted. Route it once with
`squad:ripley`, then inspect the matching private poller, durable queue, actual
ACA Job and bot PR/diff through [Card A](demo-runbook.md#card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr).
Do not create another issue. The target's `squad-queue.yml` is manual status
only, not enqueue or real-chain proof. Correlate the actual ACA Job and bot
PR/diff to this same approved issue; neither status alone nor an unrelated PR
passes.
Correlate the same issue across all four; a queued workflow, pulled image or
successful Job alone is not a complete issue-to-PR result. Error-only/missing-
agent PR stubs are failure artifacts, not successful Squad work; never substitute
them for the original implementation's confirmed demonstration or fresh E2E proof.
No new runner registration or AppAdmin is required by the chosen poller mode.
Leave the old zero-step queued run untouched, not cancelled or consumed as proof.
Private publisher qualification is waiting at its existing human gate with zero
executed steps; no image/push/digest yet. Owner-native Terraform remains the sole
whole-body writer; full source acceptance/delivery integration, real plan/auth/
budget/owner/image/Job/actual PR gates remain. These holds do not establish an
original hosted-service failure or reopen accepted ACA SANDBOXES engineering.
Owner-native source preparation is under review; executable delivery remains
held. Plan/apply/destroy paths are currently unconditionally disabled, with
signer/current-head/private-plan transport/executable integration not yet
provisioned. These are remaining implementation gates, not deploy-on-merge or
just missing operator receipts.

<a id="native-host-squad-isolated-work"></a>

### Native host Squad isolated work: ACA SANDBOXES

This is native hardware-isolated MicroVM work, not ACA Apps/Jobs hosting.
Both product paths need their own accepted current proof; this receipt does
not establish the hosted issue -> Job/agent -> PR chain.

| Field | Contract |
| --- | --- |
| Owner / roles | Martin/host Squad coordinates; one native operator/worker runs the bounded ACA calls; an independent validator/reviewer checks returned output and limits |
| Repos / roots | Public session clone for prompts/notes and approved public fixture; [demo-env](https://github.com/martinopedal/aks-automatic-demo-env) `deployments\aca-sandboxes-online` owns native provisioning source. CLI/Squad stay on the host; isolated work runs in the MicroVM |
| Verified now | Separate Online five-object deployment, current operator access and credential-free base exec/fs/stop-resume/delete passed; final list empty. This is not both-presenter or successful-work integration GO |
| Corrected current run | Actual host coordinator/worker/tools/guest-results/cleanup handoff. One 26.768-second sandbox: LF/source-byte hash round trip, three positive guest checks/JSON+SHA, actual exit23, one HTTPS403 with new exact-sandbox networkEgress.denied causal audit, exact cleanup/empty list/NotFound/watchdog stopped. Independent acceptance complete; card runtime-ready after acceptance, not stage GO |
| Learning history | Earlier CRLF shell failed positive work; downstream negatives were blocked and exact cleanup passed. Corrected LF/parser qualification resolved that local harness issue; do not keep it as the current failed runtime lane |
| Before reuse | Separately approved prepared sandbox or bounded preparation; explicit exact group/region/access; reviewed public LF fixture/source/hash; installed CLI help/output parser; permitted lifecycle and cost/cleanup owner. Reject CR bytes and parse-test locally before cloud work |
| Timing / fallback | Final optional tail after core wrap, genuine early-finish spare time only; cut before 55:00, one attempt, no on-stage create/upload/install/rule change. Engineering acceptance is complete; until human preflight/rehearsal GO, show the accepted trace or skip |
| Results | Actual host prompt, selected Squad/skill, inspected tool arguments, guest output and numeric exits, input/output hashes, validator/reviewer handoff; missing checks remain BLOCKED |

**Primary VM root:** `C:\demo\session-repo`, created/verified by the runbook;
native source navigation is `C:\demo\aks-automatic-demo-env\deployments\aca-sandboxes-online`.
The [accepted public LF fixture](fixtures/native-validation.sh) has source
SHA-256 `75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5`;
stage it off-stage at `C:\demo\native-fixture\native-validation.sh`, guest
`/root/native-validation.sh`, following [Card B](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad).
**Current prepared ID and human GO remain unbound.** The earlier run deleted its
sandbox. Don't invent an ID/create a replacement or call the Terraform archive
the accepted basic fixture.

**Basic fixture prompt, host Squad, only after HUMAN GO and exact bindings:**

```text
Invoke aca-sandboxes. Use only the operator-supplied, approved prepared sandbox
ID in Online rg-aca-sandboxes-online-swc-001 / sbg-squad-nic2026-online-swc-001,
region swedencentral. Confirm the explicit approved subscription binding.
Read docs/fixtures/native-validation.sh, the canonical 684-byte LF fixture,
SHA-256 75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5.
If the approved prepared ID or staged guest source is missing, STOP as blocked.
Inspect every exact-ID aca exec/filesystem request before approval.
Run sh /root/native-validation.sh once; read /root/native-result.json through
aca sandbox fs cat. Decode the response content, hash UTF-8 bytes including LF,
and compare RESULT_SHA256, sourceSha256, and all three true checks.
Run only the separately approved deliberate sh -c 'exit 23' negative once;
require actual guest/host numeric 23. Return JSON/stdout/stderr, exits and hashes.
Use the operator's approved causal-denial probe only if already bound; absence
is BLOCKED, not a 403-only enforcement claim.
Keep Copilot CLI/Squad on this host; no guest login or agent claim.
No create, upload, install, rule/port/auth change, host credential access,
retry, or broad cleanup. Hand actual results and limits to the validator and
independent reviewer. Stop at the operator cut before 55:00.
```

Expected: actual host prompt/skill/tool/guest/check/handoff evidence.
STOP on missing staged fixture/ID/consent, wrong target, error, or cut; show accepted
dated trace/SKIP. Status/doctor alone isn't a demo. [Card B](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad)
contains the exact known group binding and off-stage cleanup boundary.

**Separate Terraform variant, reference only until independently qualified:**
the retained archive/guest-Terraform recipe below isn't automatically qualified
by the basic shell engineering result. Before any separately approved preparation, the operator checks only the
reviewed public fixture, not credential/configuration files:

```powershell
$source = '<reviewed-public-shell-fixture>'
$bytes = [IO.File]::ReadAllBytes($source)
if ($bytes -contains 13) { throw 'Shell fixture must use LF, not CRLF.' }
$sourceHash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
aca --version
# Inspect installed exec/fs/apply help and parse its actual response shapes.
# Local fixture/parse checks do not authorize a cloud create or reuse.
```

Start the host CLI in the public session clone/disclosed checkpoint, select
`/agent squad`, confirm the ACA skill/tools are available in that session, then
submit this brief only after its private preparation gate:

```text
Squad: coordinate one approved public-only isolated-work check.
Copilot CLI/Squad and the worker stay on the host, not inside the MicroVM.
Invoke the aca-sandboxes skill; use the operator's approved prepared sandbox
and explicit subscription/resource-group/sandbox-group/region on every call.
Assign one native worker and an independent validator/reviewer.

Read the prevalidated UTF-8 LF public fixture and its source/hash manifest.
Confirm the prepared guest is 1 CPU/2 GiB, no ports, Deny/Full unchanged.
Execute the fixture once: transform only its public input, assert the expected
public output, and return its JSON check summary and SHA256. Capture immediate
numeric guest exits and the actual host process exit separately. Decode the
installed fs JSON content wrapper before comparing downloaded bytes.
If positive work fails, stop; do not count downstream checks as passed.
Run deliberate exit-23 and one HTTPS-denial check only if separately permitted
and the positive phase passed; attribute denial using configuration/diagnostics,
not just an HTTP status. Keep skipped/unattributed checks BLOCKED.

Do not create/upload/install/change egress or lifecycle during the timed demo.
Do not read/copy host auth, tokens, private state or context. Do not sign in or
run Copilot/Squad agents inside the guest. No anonymous ingress or snapshots.
Return actual prompt/skill/tool/output/exits/hash evidence, changed guest files,
failed or missing checks, and a validator/reviewer handoff. Stop at the cut;
no retry. The operator handles only separately approved exact-ID cleanup and
list/NotFound verification off-stage. Never delete the group or shared resources.
```

For a Terraform variant, first bind a separately qualified public archive commit,
hash, provider mirror, root/test files and numeric oracle. Do not assume the
historical ten root tests are the current upstream suite or the Corp copy's
52+2 cases. Neither a byte round trip nor an agent summary proves guest tests.
The earlier failed local harness is controlled preparation history, not a global
ACA SANDBOXES outage or the current runtime verdict. The corrected run proved the requested
public fixture work; it did not prove offline Terraform or inside-guest agents.
Another cloud attempt requires new approval, not an automatic retry.
