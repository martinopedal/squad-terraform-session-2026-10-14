# Short talk track - prompt-first monitor

Use rendered Markdown (GitHub/editor preview); local HTTP serves `.md` as text.
Prompts below go to **host Copilot**, not PowerShell. Keep native permissions.
Full narration/clocks/recovery/close: [full track](talk-track.md).

**Order:** prepare → core C0-C7 → Online evidence/core wrap → optional hosted
Squad → optional native Sandbox last. Extras never use recovery/close time.
**Agent swaps:** use `/agent NAME` in the same Copilot TUI; do not start another
CLI just to change agents. `/new` creates a fresh conversation where specified.
Plan mode is separate from agent selection.

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
New `$HOME\demo\aks-module` clone → `squad init` → roster → `squad doctor`.
Show files/diagnostics, not correctness.
**STOP:** unqualified clean host or cut = dated fallback, no VM repair.

## C1 - compare two bounded plans

Continue only after preparation verified both roots at the same checkpoint.
**Shell, each verified A/B root:** run `copilot --agent squad --plan`.
**TUI:** confirm `/cwd`, Squad and the **Plan** indicator; use sessions
`C1-A`/`C1-B` and the same model. Paste the
[exact A/B request](prompt-pack.md#c1---martin-drives-haflidi-compares-1230-1530-cut-1445);
show one consequence.
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
   Revise only: keep C3 limited to that test file, not README or redesign.
   Unchanged assertions/offline checks first; separate labeled C5
   enablePrivateCluster mutation/restoration. Show criteria; no implementation.
   ```

3. **TUI:** human sends exact approval:

   ```text
   I approve repository code only: C3 may add the agreed four-assert regression
   in tests\contract.tftest.hcl. C5 may separately change then restore only
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

**TUI, same guided CLI, now Interactive:** keep Squad selected and paste
[coordination request](prompt-pack.md#c3---martin-2200-2600-cut-2500).
Then `/agent terraform-coder`; paste **B1v2** from that same section.
Show actual starts/handoffs and one changed test/four asserts/error messages.
**STOP:** concurrent writers, missing handoffs or cut; switching profiles is not parallel work.

## C4 - base skill and source only

**TUI, guided:** `/agent squad`; paste [test-discipline/MCP request](prompt-pack.md#c4---martin-2930-3330-cut-3230---base-only).
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

[Exact block/mutation](prompt-pack.md#c5---haflidi-3330-3830-cut-3715).
Show pass → intended fail → pass/hash. **STOP:** before/wrong failure/isolation/cut.

## C6 - save and resume the public reason

**TUI, guided:** `/agent squad`; paste [public Scribe request and resume sequence](prompt-pack.md#c6---haflidi-4200-4500-cut-4415).
Record first, then `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`;
ask `Read the saved decision; cite its file and the constraints for the next change.`
**STOP:** missing record/resume/citation or cut; hide unrelated sessions.

## C7 - offline checks, fresh reviewer

**TUI, guided:** `/agent terraform-validator`; paste:

```text
Use the whole C7 block in docs/prompt-pack.md: local Check, qualified mirror,
logs/exits/module+caller tests. Narrowly approve commands, stop at first failure.
Return diff/revision/files/results; no Azure/upgrades.
```

[Exact checks/review](prompt-pack.md#c7---haflidi-4700-5000-cut-4915).
`/new`, `/agent terraform-reviewer`; paste that section's exact-diff brief;
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
C1-C7 edit a disposable copied Corp test fixture, not this caller/upstream.
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

Both flows are optional after core wrap; hosted comes first, native last. Before either, the operator privately prepares `C:\demo\operator-targets.json` with current bindings, URLs, guest ID and GO for the selected flow. Include no credentials. Never commit or display it; each prompt rereads it because shell variables do not persist.

<a id="hosted-demo"></a>

## Hosted Squad on ACA Apps/Jobs - optional final tail, first

**Host Squad prompt, only after fresh hosted GO and one-attempt human approval:**

```text
Host Squad: read C:\demo\operator-targets.json privately; never print it. Require hosted.go=true, hosted.repo, hosted.issue, hosted.issueUrl, hosted.pollerUrl and hosted.workerUrl; missing/stale data means STOP. Reread/rebind on every shell/tool call. Read the existing issue with `gh issue view` using hosted.issue and hosted.repo. Verify the approved README-only request from docs/prompt-pack.md#original-hosted-squad-issue-to-pr-work and no prior queue/attempt/result. Only after one-attempt GO, add `squad:ripley` once; no new issue, manual dispatch, Job start, auth mint or retry. Open the exact file-bound URLs. Match the poller receipt's message ID + issue + repository + agent to the actual ACA Job/worker and its App-bot PR; require only README.md changed. Hand off for independent review; do not merge/deploy. Manual status is not enqueue proof.
```

**Show:** file-bound URLs; issue → actual queued ACA Job → matching bot PR/README diff. **STOP:** missing GO, old attempt, incomplete correlation, non-README change, error stub or no time; no retry.
[README-only issue brief](prompt-pack.md#original-hosted-squad-issue-to-pr-work); [full hosted procedure](demo-runbook.md#card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr).

<a id="native-demo"></a>

## Native ACA Sandboxes - optional final tail, dead last

**Off-stage prepare prompt, only after explicit permission for one guest and fixture staging:**

```text
Host Squad: read C:\demo\operator-targets.json privately. Require native.prepareOneGuest=true, exact native.subscription/resourceGroup/group/region, and no current native.sandboxId; else STOP. Use installed aca 1.0.0-preview.4 help. Verify exact group and empty current list; explicitly bind --subscription, --resource-group, --region and command-specific --group (not diagnostic --sandbox-group) from native.* on every target command. Inspect `aca sandbox create --help`; run exactly one `aca sandbox create` for an Ubuntu guest with 1000m CPU, 2048Mi, Deny/Full egress, no ports/credentials and 300-second auto-suspend. If help/schema cannot express and verify all properties, STOP before create. Capture its UUID even if `-o json` prints text; never create again to fix parsing. Verify target/config; `aca sandbox fs write` canonical 684-byte LF docs/fixtures/native-validation.sh to /root/native-validation.sh; read `.content` and verify SHA-256 75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5. Save only the new ID/hash privately. No group/role/install/network changes.
```

**On-stage host Squad prompt, after human stage GO:** use `/agent squad` in the host repo; never run the fixture on the host or install/sign in inside the guest.

```text
Host Squad: read C:\demo\operator-targets.json privately; require native.go=true, current native.sandboxId and exact native.subscription/resourceGroup/group/region, else STOP. Reread/rebind --subscription, --resource-group, --region and command-specific --group from native.* for every tool call. Invoke aca-sandboxes; exact-ID get, then execute `sh /root/native-validation.sh` once and fs cat /root/native-result.json, decoding `.content`. Require schema native-squad-validation-v1, three true checks, matching source/result SHA and actual exit 0. Use the linked runbook's single `https://example.com/` denial/audit probe with this ID; read the current timestamped audit before cleanup, allowing up to 10 seconds. HTTP 403 alone, immediate empty audit or post-delete 404 is not proof. Return real output/exits for `/agent terraform-validator`, then `/new` + `/agent terraform-reviewer` independent handoff. No issue/queue, guest agents, create/upload/install, auth/egress changes or retry.
```

**Show:** guest JSON/hash, one denied request/current audit; no guest URL or preview exists. Open authenticated [sandbox-group discovery](https://containerapps.azure.com/sandbox-groups) or [regional management](https://management.swedencentral.azuredevcompute.io); neither is a guest website. **STOP:** missing GO/ID, mismatch, failed check/audit or no time; use accepted evidence or skip.
[Full native operations and audit](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad).
