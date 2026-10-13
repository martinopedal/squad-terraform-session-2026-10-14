# Short talk track - prompt-first monitor

Use rendered Markdown (GitHub/editor preview); local HTTP serves `.md` as text.
Prompts below go to **host Copilot**, not PowerShell. Keep native permissions.
Full narration/clocks/recovery/close: [full track](talk-track.md).

**Order:** prepare → core C0-C7 → Online evidence/core wrap → optional hosted
Squad → optional native Sandbox last. Extras never use recovery/close time.
**Agent swaps:** use `/agent NAME` in the same Copilot TUI; do not start another
CLI just to change agents. `/new` creates a fresh conversation where specified.
Plan mode is separate from agent selection.
**Who drives:** Haflidi runs C0. Who types and speaks in C1-C7 is decided
between the two speakers and may swap between chapters (decided live, after rehearsal).

## Prepare once - Squad creates paths before you use them

**Fresh VM, Git/Copilot already installed, no public checkout yet:** run this
in PowerShell from an existing directory:

```powershell
if (Test-Path 'C:\demo\session-repo') { throw 'Checkout exists: verify it instead of cloning over it.' }
New-Item -ItemType Directory -Path 'C:\demo' -Force | Out-Null
git clone https://github.com/martinopedal/squad-terraform-session-2026-10-14.git 'C:\demo\session-repo'
if ($LASTEXITCODE -ne 0) { throw 'Clone failed; stop here.' }
Set-Location 'C:\demo\session-repo'
copilot --agent squad
```

**Existing checkout:** verify its origin and clean status using the
[public clone setup](demo-runbook.md#create-and-verify-the-agreed-vm-layout),
then start Squad there. Never overwrite it or launch from the private coordinator.
Cloning creates the repository directory. `squad init` creates team configuration
in the current repository; it does **not** create A/B/guided/offline/evidence.
The preparation task below creates/verifies those paths **before** any use.

**TUI:** confirm `/cwd` is `C:\demo\session-repo` and Squad is selected. Paste:

```text
Host Squad: prepare off-stage using docs/demo-runbook.md's existing VM layout,
disposable-checkpoint and filesystem-mirror blocks, not a new helper/deployment.
Create/verify C:\demo\session-repo and C:\demo\aks-automatic-demo-env: exact
published origins, heads, clean status; stop/preserve dirt or mismatched paths.
If the consumer is absent, clone https://github.com/martinopedal/aks-automatic-demo-env.git
into C:\demo\aks-automatic-demo-env; verify success/files before entering it.
From the public session repository use reviewed commit
0abb202f34af385b7e0a34b1775643aa5b4871ed. Create the parent take directory and
detached sparse Git worktrees C:\demo\checkpoints\take-20261014\A, B and guided
using git worktree add (not Set-Location). Require identical clean HEADs, profiles,
terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl without the new test.
Create sibling evidence/checkpoint.txt, checkpoint-tree.txt as documented.
Do NOT run the published terraform providers mirror download block.
Copy only the operator's qualified Windows AzAPI2.12.0 mirror packages into
take/offline/providers; write offline/terraform.tfrc using the published
filesystem_mirror structure, actual take path/AzAPI include, no direct fallback.
Verify locked package hashes. Missing mirror/isolation is BLOCKED.
Inspect each command for narrow approval. No downloads/install/Azure/credentials,
private-history copy/reset/force/delete/overwrite. Preserve contributor changes.
Return actual roots, pin/status/files/producers; no unverified VM-path claim.
```

Expect real **A/B/guided/offline/evidence** results; existing/dirty/mismatched take
= STOP. The published blocks create paths; **no new preparation script**.

## Essentials - start the verified VM root

**Shell, only after preparation passes:**

```powershell
Set-Location 'C:\demo\session-repo'
copilot --agent squad
```

**TUI:** `/cwd`, `/agent`, `/instructions`, `/permissions`; show root/Squad/profiles.
[Small read-only task](prompt-pack.md#essentials---start-here).
**STOP:** wrong root/profile; restart correctly, not reinstall/reinitialize.
[Human sign-in before Plan](demo-runbook.md#conditional-human-setup-before-plan);
source/mocked checks need no Azure login.

## C0 - install, initialize, confirm a team

**Shell/TUI:** [clean-host recipe](clean-machine-demo.md#the-live-chapter-target-300).
Repo: upstream clone `terraform-azapi-aks-automatic`; no code change.
New `C:\demo\aks-module` clone → `squad init` → roster → `squad doctor`.
At the roster step paste [Hire the team](prompt-pack.md#hire-the-team-c0-first-squad-demo-squad-coordinator-plan-mode):

```text
Cast the team from the Flaaklypa Grand Prix (Flåklypa Grand Prix) characters.
Use names only, no role-play: fun but professional.

Project: a reusable Terraform child module, terraform-azapi-aks-automatic,
that deploys an AKS Automatic cluster using the azapi provider. The module
has no provider blocks, backend or credentials; root consumers own those.
Needs: secure defaults, typed variables with validation, clear outputs, a
README with examples, offline tests (terraform validate and tftest, no
Azure), a security and policy review before shipping, and a consumer
example pinned to a released module version.

Roles needed: lead (architecture, task boundaries), Terraform module
author, tester, security reviewer, docs writer.
Rules: exactly one writer per file; the reviewer is never the author of
what they review.

Hint, not forced: Reodor Felgen as lead and architect (the inventor who
owns the design), Ludvig as the cautious security reviewer (the worrier),
Solan Gundersen as the upbeat docs writer. For the module author and
tester, pick further well-known Flaaklypa characters yourself.

Propose the team and wait for my confirmation before creating anything.
```

Show files/diagnostics, not correctness.
**STOP:** unqualified clean host or cut = dated fallback, no VM repair.

## C1 - compare two bounded plans

Continue only after preparation verified both roots at the same checkpoint.
Repo: Corp teaching copy `terraform\modules\aks-automatic-corp` in the session repo, disposable; nothing pushed upstream.
**Shell, each verified A/B root:** run `copilot --agent squad --plan`.
**TUI:** confirm `/cwd`, Squad and the **Plan** indicator; use sessions
`C1-A`/`C1-B` and the same model. Paste the exact A/B request
([source](prompt-pack.md#c1---martin-drives-haflidi-compares-1230-1530-cut-1445)):

```text
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
```

Show one consequence.
**STOP:** root/checkpoint/model mismatch or cut; identical plans are valid.

<a id="native-plan-with-squad"></a>

## C2 - native Plan with selected Squad, then code-only approval

1. **Shell, after guided preparation passes:**

   ```powershell
   Set-Location 'C:\demo\checkpoints\take-20261014\guided'
   copilot --agent squad --plan
   ```

   **TUI:** confirm `/cwd`, selected Squad and displayed **Plan**.
   Already in a CLI? Use `/agent squad`, then native `/plan` instead.
   Selecting Squad, asking “plan”, or `squad init` alone does not enter Plan.
   Paste:

   ```text
   Squad: plan only the alternate_network_payload regression in
   terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl.
   Use pod 172.21.0.0/16, service 10.241.0.0/16, DNS 10.241.0.10; four separate
   requested-body/private-API assertions, existing AzAPI mocks and command=plan.
   Coordinate read-only file/invariant/check planning, one future writer.
   No edits/commands/implementation/Azure/deploy.
   ```

2. **TUI:** inspect the actual plan; human revises scope, then inspect the re-plan:

   ```text
   Revise only: keep the coder step limited to that test file, not README or redesign.
   Unchanged assertions/offline checks first; separate labeled later
   failure-and-repair step: enablePrivateCluster mutation/restoration.
   Show criteria; no implementation.
   ```

3. **TUI:** human sends exact approval:

   ```text
   I approve repository code only: The coder step may add the agreed four-assert
   regression in tests\contract.tftest.hcl. The later failure-and-repair step may
   separately change then restore only
   body.properties.apiServerAccessProfile.enablePrivateCluster in main.tf,
   in guided only. Preserve other source/mocks/locks. Do not implement yet.
   No Azure/deploy/install/state/upgrade/publish/blanket or automatic approval.
   ```

4. **TUI:** **Shift+Tab** until the mode indicator visibly says **Interactive**,
   not Plan/Autopilot, **before** coder/commands. `/exit` exits the entire CLI.

**STOP:** missing indicator/approval/checkpoint/mirror or cut = [C2 fallback](demo-runbook.md#c2-revise-and-approve--1730-2130--4-minutes).
Actual batch check: bundled CLI1.0.95 (`--no-auto-update`), launcher/help1.0.96,
fresh child Squad1.0.1/native Plan events,52/52 source hashes unchanged.
Not parent reload: human revision/approval/visible indicator/exit remain
**untested manual checks**. Recheck the VM's actual launch version.

## C3 - one coder, actual handoffs

**TUI, same guided CLI, now Interactive:** keep Squad selected and paste the
coordination request ([source](prompt-pack.md#c3---martin-2200-2600-cut-2500)):

```text
Squad: assign independent read-only source research and review preparation.
One coder owns the test; return actual task starts and accountable handoffs.
Do not run a concurrent writer on the shared test file.
```

Then `/agent terraform-coder`; paste **B1v2** from that same section:

```text
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
```

Show actual starts/handoffs and one changed test/four asserts/error messages.
**STOP:** concurrent writers, missing handoffs or cut; switching profiles is not parallel work.

## C4 - base skill and source only

**TUI, guided:** `/agent squad`; paste the test-discipline request ([source](prompt-pack.md#c4---martin-2930-3330-cut-3230---base-only)):

```text
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation.
```

Then `/agent terraform-reviewer` (read-only; check `/mcp` lists `microsoft-learn` connected) and paste the Microsoft Learn lookup. The MCP servers live on the profiles, Squad only coordinates:

```text
Through the configured Microsoft Learn MCP, perform only a read-only search/fetch
for AKS Automatic private/custom network requirements. Cite the source/version
relevant to private API access and hosted-system subnets. Don't contact an Azure
account or change providers.
```

Show skill invocation, source URL/version and narrow permission.
**STOP:** missing skill/MCP, failed lookup or cut; BASE ONLY, no cloud extra.

## C5 - before, deliberate failure, repair

**TUI, guided:** `/agent terraform-validator`; paste:

```text
Use docs/prompt-pack.md's complete C5 block: before, labeled coder-only mutation,
seeded-failure, restoration, repaired. Narrowly approve each offline command;
require intended private_automatic_contract failure/original hash. Stop on error.
No weakened checks/provider/lock/Azure/retry.
```

Run this block via `!` in the same guided CLI window, once per phase (set `$phase` to `before`, then `seeded-failure`, then `repaired`)
([source](prompt-pack.md#c5---haflidi-3330-3830-cut-3715)):

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

Then `/agent terraform-coder`; paste the labeled **DELIBERATE LAB MUTATION**:

```text
Native terraform-coder: in this disposable worktree only, change
body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
```

After the seeded-failure rerun, ask the coder to restore only that field, inspect `/diff`, then rerun as `repaired`.
Show pass → intended fail → pass/hash. **STOP:** before/wrong failure/isolation/cut.

## C6 - save and resume the public reason

**TUI, guided:** `/agent squad`; paste the public Scribe request ([source](prompt-pack.md#c6---haflidi-4200-4500-cut-4415)):

```text
Scribe: record the public-only decision under .squad\decisions\inbox\ for later
merge into .squad\decisions.md. Include private API, caller-owned provider/backend,
network regression, labeled mutation/restoration, exact checks and evidence
limits. No private targets, histories, credentials or full conversations.
```

Record first, then the resume sequence:

```text
/new
/resume guided-clean-run
/cwd
/context
/usage
```

Then ask:

```text
Read the saved decision; cite its file and the constraints for the next change.
```
**STOP:** missing record/resume/citation or cut; hide unrelated sessions.

## C7 - offline checks, fresh reviewer

**TUI, guided:** `/agent terraform-validator`; paste:

```text
Use the whole C7 block in docs/prompt-pack.md: local Check, qualified mirror,
logs/exits/module+caller tests. Narrowly approve commands, stop at first failure.
Return diff/revision/files/results; no Azure/upgrades.
```

Run this Check block via `!` in the same isolated guided shell, approving each command
([source](prompt-pack.md#c7---haflidi-4700-5000-cut-4915)):

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

`/new`, `/agent terraform-reviewer`; paste the exact-diff brief:

```text
Review the supplied exact baseline/current revision and diff for
terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl. Confirm the
separately labeled main.tf mutation is restored to its original SHA-256.
Use the supplied sanitized failure-and-repair and final-check logs and numeric exits; if absent, stop as
blocked. Check caller/module ownership, unknown-at-plan
values in count or for_each, lifecycle guards, test intent, and the
private API and unchanged payload assertions. Return findings with severity, file and line,
consequence, and repair. Missing evidence is blocked, not passed.
```

`/agent squad` for human acceptance. **STOP:** tool/check/diff/cut; mocks aren't Azure evidence.

## Technical evidence - public source and browser

**TUI:** paste:

```text
Read C:\demo\aks-automatic-demo-env\deployments\online\main.tf FIRST: actual
Online caller/inputs/network+identity wiring. module aks consumes
git::https://github.com/martinopedal/terraform-azapi-aks-automatic.git?ref=v0.6.0,
a dependency, not live entry
or upstream authoring. enable_private_cluster=false; authorized_ip_ranges
uses env-owned var.api_server_authorized_ip_ranges, not Corp's private API.
The demo steps edit a disposable copied Corp test fixture, not this caller/upstream.
Then read manifests/online ingress-controller.yaml, ingress.yaml, service.yaml
for browser→LB→NGINX→Service→pods. No commands/private values/state/Azure.
```

[Actual caller](https://github.com/martinopedal/aks-automatic-demo-env/blob/main/deployments/online/main.tf);
verified consumer HEAD `dbb7e4c6f19a6c8fcd31ca61085e449d1a9fd87c`, recheck on VM.
**Browser:** `https://aks-online-demo.swedencentral.cloudapp.azure.com/`
(known certificate warning); show branded page, not renewed health/trusted TLS.
**STOP:** unavailable page = dated screenshot, no repair; [full core wrap](talk-track.md).

## Workstation preparation map - not VM stage commands

Verified `C:\git\squad-terraform-session-2026-10-14` roots:
`public` session source; `demo-env` consumer; `module-public` canonical Corp
module (read-only); `aca-sandboxes` session checkpoint, **not a native consumer**.
Native consumer source: `demo-env\deployments\aca-sandboxes-online`.
[Ownership](repositories.md). These roots prove neither VM paths nor live GO.

## Optional extras - only after the complete core flow

| Flow | Entry | Work/result |
| --- | --- | --- |
| [Hosted Squad](#hosted-demo) | Approved GitHub issue → label once → poller/queue | Hosted ACA agent Job → matching bot PR/README diff |
| [Native Sandbox](#native-demo) | Prompt host Squad on the VM; **no issue assignment or queue** | Host agent executes prepared MicroVM fixture → results → review |

Both recipes below require their own GO and genuine spare time; native is last.

<a id="hosted-demo"></a>

## Hosted Squad on ACA Apps/Jobs - optional final tail, first

**PREP:** operator creates/verifies `C:\demo\hosted-target` using
[existing hosted checkout/recipe](demo-runbook.md#card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr).
Privately supply approved target/issue/App, poller Job/execution/log view and
worker binding. Current image/auth/chain/human GO is **HELD**, not permission.

1. **TUI, host Squad in that verified root:** paste this RUN request only after fresh GO:

   ```text
   Host Squad: read C:\demo\session-repo\docs\demo-runbook.md's hosted recipe and
   C:\demo\session-repo\docs\prompt-pack.md's
   "Original hosted Squad issue-to-PR work" exact README body. Bind the owner's
   target/issue/App/poller/worker receipt; missing GO/binding is BLOCKED.
   Bind $targetRepo/$demoIssue to that receipt in each whole command invocation;
   don't assume shell variables survive TUI turns. Read:
   gh issue view $demoIssue --repo $targetRepo --json title,body,labels,state
   Compare exact README scope/prior-attempt receipt; stop if attempted. Only
   after explicit human one-attempt permission run
   gh issue edit $demoIssue --repo $targetRepo --add-label squad:ripley ONCE.
   No held execution/new issue/workflow dispatch/Job start/auth mint/retry.
   Return same issue/label; manual squad-queue.yml status isn't enqueue evidence.
   ```

2. **Browser:** approved issue → show the one label. Azure portal →
   Container App Jobs → **owner-bound poller Job** → Executions →
   approved execution → Logs (or supplied approved log URL). Wait for:
   `Approved issue #NUMBER accepted as queue message MESSAGE_ID; processing label recorded.`
   This is the **same-issue queue receipt**, not a guessed timestamp.

3. **Browser:** existing `caj-squad-aca-agent-corp-ne` → Executions →
   matching worker execution → Logs. Match
   `Queue message=MSG_ID; issue #ISSUE_NUMBER; agent=AGENT_TYPE; mode=MSG_TYPE; repo=GITHUB_REPO`.
   Require **message ID + issue + repository + agent**, then real worker/result.

4. **Browser:** that issue's linked approved App-bot PR → Files changed →
   `README.md`; show actual paragraph/diff/checks and human review handoff.
   Error-only stubs, unrelated PRs and Job success alone fail.

**STOP:** hold, prior attempt, missing log binding/correlation/result or spare time =
dated original evidence/SKIP; original implementation untouched, no merge/retry.

<a id="native-demo"></a>

## Native ACA Sandboxes - optional final tail, dead last

**PREP:** verified `C:\demo\session-repo`; separate Online target:
subscription `714ac8e0-8874-428d-a4f3-79bd3765bfed`,
`rg-aca-sandboxes-online-swc-001` / `sbg-squad-nic2026-online-swc-001`, `swedencentral`.
No current prepared ID/guest staging/human GO established; earlier sandbox deleted.

1. **TUI, host Squad:** paste this OFF-STAGE preparation/precheck request:

   ```text
   Read docs/demo-runbook.md's native recipe and docs/fixtures/native-validation.sh.
   Bind only the approved current ID/target above; match get to current receipt,
   not doctor/list. Missing ID/consent/source/hash is BLOCKED.
   Canonical fixture is684 LF bytes, source SHA256
   75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5.
   The published local staging block produces C:\demo\native-fixture\native-validation.sh.
   Only separately approved off-stage, bind $sandboxId/current ID and
   $nativeTarget/exact subscription/RG/group/region above; verify local684LF/SHA.
   Use --group for sandbox get/exec/fs/egress, NOT diagnostic --sandbox-group.
   Inspect get before the approved write:
   aca sandbox fs write --id $sandboxId --path '/root/native-validation.sh' --file 'C:\demo\native-fixture\native-validation.sh' @nativeTarget -o json
   Stop on error/unapproved staging; fs cat guest source, decode .content,
   verify684LF/SHA. Return ID/target/revision/hash. No create/install/auth-copy/
   retry or upload while held/on stage; missing stage GO stops RUN.
   ```

   [Existing canonical staging/operations](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad).

2. **TUI, after human GO:** confirm `/cwd`, use `/agent squad` in
   **Interactive** mode (not Plan); paste:

   ```text
   Invoke aca-sandboxes: host Squad/worker, not guest agents. Use captured
   approved ID/target/hash and docs/prompt-pack.md "Native host Squad isolated work".
   Inspect exact-ID calls/native permissions; use published basic-demo block:
   aca sandbox exec --id $sandboxId -c 'sh /root/native-validation.sh' @nativeTarget -o json
   aca sandbox fs cat --id $sandboxId --path '/root/native-result.json' @nativeTarget -o json
   Once: require0/three true checks/source+UTF-8-LF resultSHA/RESULT_SHA256.
   Separately approved only: deliberate sh -c 'exit 23' once, require23;
   whole published causal-denial block, one example.com HTTPS403 plus NEW
   same-ID timestamped denied audit (not403 alone). Missing audit BLOCKED.
   No issue queue/create/upload/install/auth/rule change/guest agents/retry.
   Return tools/JSON/exits/hashes/audit/limits.
   ```

3. **TUI/returned output:** show schema `native-squad-validation-v1`,
   `arithmetic=true`, `uppercase=true`, `fixtureHash=true`, matching SHA,
   exits0/23 and fresh same-ID denied audit. Status/doctor isn't the demo.

4. **TUI:** `/agent terraform-validator`; provide sanitized actual evidence,
   current ID/target/source revision (inline or approved host evidence path); paste:

   ```text
   Read-only host validation: cite evidence/ID/target/revision; schema/three
   checks/canonical source+UTF-8-LF resultSHA matching RESULT_SHA256/0+23 exits/
   NEW same-ID example.com denied audit within probe timestamps, using the
   published exact hashes. Missing evidence BLOCKED. Return per-check results/
   limits; no commands/edits/auth/guest agents/deploy/lifecycle/retry/acceptance.
   ```

5. **TUI:** `/new`, `/agent terraform-reviewer`; supply the saved handoff/evidence; paste:

   ```text
   Independently review supplied evidence/validator handoff. Cite ID/target/
   revision/evidence path; verify schema/three checks/source+resultSHA/0+23/
   fresh same-ID denied audit against published hashes. Missing evidence BLOCKED.
   Report consequence/limits to human; no commands/edits/guest agents/issue queue/
   deploy/retry/automatic acceptance.
   ```

**STOP:** missing current ID/staging/GO, mismatched target/hash/result/audit/error or
no spare time = accepted dated trace/SKIP; owned cleanup off-stage only.
