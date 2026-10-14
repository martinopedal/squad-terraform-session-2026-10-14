# Short talk track - prompt-first monitor

> **FINAL short talk track for 2026-10-14 - last updated 2026-10-14 07:36 CEST. Evidence is pinned to immutable run IDs and SHAs in the [evidence table](#evidence-links); run `git pull` on `main` and check `git log -1 docs/short-talk-track.md` for the newest edit.**
> This is the **one** file to open on the presenter monitor tomorrow. Everything else
> ([prompt-pack](prompt-pack.md), [full talk track](talk-track.md), [runbook](demo-runbook.md),
> [cue sheet](demo-talking-topics.md), [talking points](talking-points.md)) is supporting
> material and points back here. Open: `C:\git\pub-talk\docs\short-talk-track.md` after `git pull` on `main`,
> or <https://github.com/martinopedal/squad-terraform-session-2026-10-14/blob/main/docs/short-talk-track.md>.

Use rendered Markdown (GitHub/editor preview); local HTTP serves `.md` as text.
Prompts below go to **host Copilot**, not PowerShell. Keep native permissions.
Full narration/clocks/recovery/close: [full track](talk-track.md).

**Order:** prepare → core C0-C7 → Online evidence/core wrap → optional
[native ACA Sandboxes](#native-demo) → optional [Squad on ACA](#hosted-demo), the
very last section. Extras never use recovery/close time.
**Agent swaps:** use `/agent NAME` in the same Copilot TUI; do not start another
CLI just to change agents. `/new` creates a fresh conversation where specified.
Plan mode is separate from agent selection.

<a id="evidence-links"></a>

## Evidence links - open these

Verified 2026-10-13 (links open in rendered preview). Presenter: open the row, say the
"proves" column, never more.

| Evidence | What it proves (and does not) | Date (UTC) | Link |
| --- | --- | --- | --- |
| **AKS Automatic cluster creation + app deploy (primary)** | Module repo `martinopedal/terraform-azapi-aks-automatic`, workflow "Deploy Online", success. Plan shows SKU `name = "Automatic"`; Terraform Apply created `module.aks.azapi_resource.aks` (started 07:17Z, "Creation complete after 10m4s" at 07:27Z) as `aks-online-demo` in `rg-aks-online-demo`, sub `714ac8e0-8874-428d-a4f3-79bd3765bfed`; "Apply complete! 4 added, 1 changed, 2 destroyed" at 07:32Z; then Deploy the demo app and "Prove the app is reachable over HTTPS only" succeeded | 2026-10-07 07:14 | [run 37586137417](https://github.com/martinopedal/terraform-azapi-aks-automatic/actions/runs/37586137417) |
| Later apply run (not the original creation) | Same workflow, success, Apply 1 added/1 changed/0 destroyed plus app deploy and HTTPS proof; a later plan removes the Automatic lines, so do not present it as the Automatic creation | 2026-10-07 07:49 | [run 37589702715](https://github.com/martinopedal/terraform-azapi-aks-automatic/actions/runs/37589702715) |
| **Latest website deploy + HTTPS proof (consumer)** | `aks-automatic-demo-env` "Deploy Online": plan, kubectl deploy of the demo app, step "Prove the app is reachable over HTTPS only" green. Terraform Apply was **skipped** (the cluster already existed), so this is deploy-and-prove, not cluster creation | 2026-10-09 13:39 | [run 37938422464](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37938422464) |
| AKS deploy history (same workflow, same steps green) | Five more successful runs, newest first | 2026-10-08 to 10-09 | [37926600486](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37926600486), [37925167869](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37925167869), [37923904591](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37923904591), [37905403525](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37905403525), [37772290635](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37772290635) |
| Workflow and source | [Deploy Online workflow page](https://github.com/martinopedal/aks-automatic-demo-env/actions/workflows/deploy-online.yml), [workflow file](https://github.com/martinopedal/aks-automatic-demo-env/blob/main/.github/workflows/deploy-online.yml), [deployments/online/main.tf](https://github.com/martinopedal/aks-automatic-demo-env/blob/main/deployments/online/main.tf) (consumes the AKS Automatic module); the consumer runs do not print the SKU, so the Automatic SKU proof is the creation run above | - | links in row |
| **Live website** | HTTP 200 on 2026-10-13 and again 2026-10-14 (only with the known certificate warning bypassed), so show the branded page, not trusted TLS. Live control-plane readback 2026-10-14: `az aks show` for `aks-online-demo` in `rg-aks-online-demo` (sub `714ac8e0-8874-428d-a4f3-79bd3765bfed`) returns kind `Automatic`, sku name `Automatic`, tier `Standard`, swedencentral, powerState Running, provisioningState Succeeded; control plane only, not pod health | 2026-10-14 | [aks-online-demo.swedencentral.cloudapp.azure.com](https://aks-online-demo.swedencentral.cloudapp.azure.com/) |
| Native ACA Sandboxes, read-only qualification | Workflow "ACA Sandboxes Online - source and read-only native qualification" succeeded twice. It proves read-only qualification of the separate Online sandbox group, **not** a guest run or a website; [open PR #20](https://github.com/martinopedal/aks-automatic-demo-env/pull/20) | 2026-10-12 15:22 / 11:26 | [run 38269775990](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/38269775990), [run 38242636237](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/38242636237) |
| **Squad on ACA image build, green** (**private, needs org access**) | `alz-avm-tf-demo/alz-prod` "Squad on ACA Image Build" publish job succeeded (Kaniko build, push to the private ACR, post-push smoke) after the umask, stale-pin, readiness and smoke fixes. Image path only: not an issue → agent → PR run | 2026-10-13 22:11 | [run 38476043081](https://github.com/alz-avm-tf-demo/alz-prod/actions/runs/38476043081) (earlier qualify-only success [38422445270](https://github.com/alz-avm-tf-demo/alz-prod/actions/runs/38422445270), 2026-10-13 15:29) |
| **Squad on ACA multi-agent issue → queue → ACA Job → App-bot PR, PRIMARY hosted proof (private repo, needs access)** | [Issue #16](https://github.com/martinopedal/squad-on-aca-demo-target/issues/16) (label `squad:ripley`) → "Squad Issue Queue" enqueue [run 38516269166](https://github.com/martinopedal/squad-on-aca-demo-target/actions/runs/38516269166) (success; message `4664f95f-bb0b-4bf8-96ed-dc12a6be0edf` inserted 05:27:23Z) → ACA Job execution `caj-squad-aca-agent-corp-ne-5fr95` (Succeeded; logged the message delete 05:28:07Z, then `Squad Agent: ripley`, `Starting ripley via task` 05:28:40Z) → real independent read-only fact-checker `task` subagent → App bot `squad-on-aca-nic2026-demo` [PR #17](https://github.com/martinopedal/squad-on-aca-demo-target/pull/17), README.md only, **left open, do not merge**. Matches Haflidi's label → GitHub Actions OIDC → queue → KEDA → worker → Copilot/Squad → App-bot PR design; no separate poller is required, and the self-hosted ephemeral enqueuer (vs `ubuntu-latest`) is only a placement difference. Honest limits: the fact-checker is a generic task given a charter, not a special built-in; no team-decision, Scribe, Ralph or Rai proof; existing `squad-agent:latest` image; target source-helper tests are not claimed green | 2026-10-14 05:22 UTC | [issue #16](https://github.com/martinopedal/squad-on-aca-demo-target/issues/16), [run 38516269166](https://github.com/martinopedal/squad-on-aca-demo-target/actions/runs/38516269166), [PR #17](https://github.com/martinopedal/squad-on-aca-demo-target/pull/17), [receipt](https://github.com/martinopedal/squad-on-aca-demo-target/blob/main/docs/receipts/hosted-multi-agent-issue16.md) |
| **Squad on ACA one-worker cycle (history, older)** | [Issue #12](https://github.com/martinopedal/squad-on-aca-demo-target/issues/12) (label `squad:ripley`, opened 22:44Z) → "Squad Issue Queue" enqueue workflow [run 38479777642](https://github.com/martinopedal/squad-on-aca-demo-target/actions/runs/38479777642) (success; self-hosted ephemeral runner `caj-squad-aca-runner-target-wdizymj`, OIDC) → ACA Job execution `caj-squad-aca-agent-corp-ne-ghxxz` (Succeeded 22:45:09-22:46:17Z; env `cae-squad-aca-corp-ne`, RG `rg-squad-aca-corp-swc`, sub -6; queue `squad-work-queue` on `stsquadacacorpazthp0`, KEDA) → App bot `squad-on-aca-nic2026-demo` [PR #13](https://github.com/martinopedal/squad-on-aca-demo-target/pull/13), README.md only, **left open, do not merge**. The PR's own activity text says the hosted Copilot/Squad session made the one-line edit directly instead of dispatching Ripley, so this proves one ACA-hosted Copilot/Squad session producing an App-bot PR, **not** parallel specialists or a Ripley subagent dispatch. Execution status checked with `az containerapp job execution list`. The worker is the **existing** `squad-agent:latest` Job image, **not** the newly published owned image, and no live poller is claimed | 2026-10-13 22:44 | [issue #12](https://github.com/martinopedal/squad-on-aca-demo-target/issues/12), [run 38479777642](https://github.com/martinopedal/squad-on-aca-demo-target/actions/runs/38479777642), [PR #13](https://github.com/martinopedal/squad-on-aca-demo-target/pull/13), [public correlation receipt](https://github.com/martinopedal/squad-on-aca-demo-target/blob/main/docs/receipts/hosted-run-38479777642.md) (queue message `77a6298d-0f36-48a0-892c-98f0885a37fa`, enqueued 22:44:59Z, worker delete 22:45:36Z; the worker's dequeue did not log the ID) |
| Squad on ACA issue → agent → bot PR (earlier, private repo, needs access) | Two earlier end-to-end proofs on the same target: issue → ACA agent Job → bot-authored PR changing one file. Dated 2026-10-09 | 2026-10-09 | [issue #2](https://github.com/martinopedal/squad-on-aca-demo-target/issues/2) → [PR #3](https://github.com/martinopedal/squad-on-aca-demo-target/pull/3); [issue #4](https://github.com/martinopedal/squad-on-aca-demo-target/issues/4) → [PR #5](https://github.com/martinopedal/squad-on-aca-demo-target/pull/5) |
| **Native ACA Sandbox runtime proof as a GitHub Actions run (Online group)** | Workflow "ACA Sandbox Online - create, validate, audit, delete" succeeded: real OIDC (environment `online`, ubuntu-latest), created one sandbox `50dfe2a8-a1e1-4c9f-b98a-2d9850abd8c2` in `sbg-squad-nic2026-online-swc-001`, ran the public fixture pinned to commit `37a3a404` with SHA-256 verified, three JSON checks true, `example.com` returned HTTP 403 with a denied-egress audit event, deleted the exact ID, remaining list empty. This is a real create-validate-delete run, not read-only qualification | 2026-10-13 22:39 | [run 38479216856](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/38479216856) |
| Native sandbox guest run (earlier, operator-run, no Actions run) | One Online-group sandbox (historical UUID, deleted: see the note under Named instances) ran the public fixture: exit 0, `native-squad-validation-v1`, three checks true; one `example.com` request denied (HTTP 403) with a same-ID audit event; deleted afterwards (get → 404). Local `aca` CLI, no run URL | 2026-10-13 20:31 | [fixture](https://github.com/martinopedal/squad-terraform-session-2026-10-14/blob/main/docs/fixtures/native-validation.sh); [ACA sandbox-group discovery](https://containerapps.azure.com/sandbox-groups) |
| Squad on ACA source and secrets runs (**private, needs org access**) | Earlier green runs: "Corp Squad source and private gated delivery" (source checks) and "Squad on ACA Secrets" (Key Vault upload). Setup history, not an end-to-end run | 2026-10-09 / 10-13 | [37920348866](https://github.com/alz-avm-tf-demo/alz-prod/actions/runs/37920348866), [38343284044](https://github.com/alz-avm-tf-demo/alz-prod/actions/runs/38343284044) |
| **Corp ACA Sandboxes apply (primary Corp deploy proof, private, needs org access)** | `alz-avm-tf-demo/alz-prod` "ACA Sandboxes Corp" **apply** job succeeded (not skipped; its plan jobs are skipped by design), consuming the independently approved [plan run 38488161323](https://github.com/alz-avm-tf-demo/alz-prod/actions/runs/38488161323) ([approval comment](https://github.com/alz-avm-tf-demo/alz-prod/pull/444#issuecomment-6158125576)). Result: SandboxGroup `sbg-squad-nic2026-corp-swc-001` and `vnetConnections/default` both Succeeded, all 11 exact resource/config/principal checks pass, the original 8 objects preserved. Afterwards one credential-free native sandbox ran the public fixture on the new default connection (result SHA-256 `2e172d6d…db25`, causal HTTPS HEAD 403 plus a fresh deny audit event 2026-10-14 00:57Z, exact guest deleted → 404, remaining 0). That sandbox was operator-driven, not a GitHub run. The earlier plan run 38484755776 was rejected and is not linked | 2026-10-14 00:39 | [apply run 38491383605](https://github.com/alz-avm-tf-demo/alz-prod/actions/runs/38491383605) |
| Squad on ACA image build fixes (**private, needs org access**) | Root cause of the Kaniko failures: build steps inherited `umask 077` (apt `NO_PUBKEY`), the post-push cleanup used a missing `rm`, the private-route peering was disconnected and the smoke step used a missing `timeout`. Fixed by alz-prod PRs #433, #434, #436, #437, #438; the green run is 38476043081 above | 2026-10-13 | [PRs](https://github.com/alz-avm-tf-demo/alz-prod/pulls?q=is%3Apr+is%3Amerged+kaniko) |

**Honest gaps:** (1) The fresh Squad-on-ACA cycle (issue #12 → enqueue run → Job execution → PR #13) runs on the **existing** `squad-agent:latest` Job image; the owned-image publish (run 38476043081) does not prove it and no live poller is claimed. PR #13 stays open. (2) Corp ACA Sandboxes: the apply run above is the deploy proof; the Corp native sandbox check was operator-driven, not a GitHub run, and the Online path stays the default optional demo. (3) The Online read-only qualification runs prove only qualification; the create-validate-delete proof is run 38479216856. (4) AKS: a live `az aks show` readback on 2026-10-14 (`aks-online-demo`: kind and sku name `Automatic`, tier `Standard`, swedencentral, Running, Succeeded) is a control-plane fact, not a pod or full cluster health claim; the website returned HTTP 200 only with the known TLS-warning bypass. Say exactly this.

### Named instances (read with `az graph query`, 2026-10-13)

Subscription names are `ME-MngEnvMCAP464621-martinopedal-N`.

| Service | Resource (type) | Resource group | Region | Subscription (name, ID) |
| --- | --- | --- | --- | --- |
| AKS Automatic demo (public) | `aks-online-demo` (managed cluster) | `rg-aks-online-demo` | swedencentral | -5, `714ac8e0-8874-428d-a4f3-79bd3765bfed` |
| AKS Corp (private) | `aks-corp-automatic-swc` (managed cluster) | `rg-corp-aks-automatic-swc` | swedencentral | -6, `9d5a5ae2-a09a-4691-9d2b-52a700bb07a7` |
| Squad on ACA | Container Apps environment `cae-squad-aca-corp-ne` | `rg-squad-aca-corp-swc` | norwayeast | -6, `9d5a5ae2-a09a-4691-9d2b-52a700bb07a7` |
| Squad on ACA | Jobs `caj-squad-aca-agent-corp-ne`, `caj-squad-aca-runner-target`, `caj-squad-aca-runner-alz-prod`, `caj-squad-aca-kaniko-build`, `caj-squad-aca-kv-probe` (no Container Apps, Jobs only) | `rg-squad-aca-corp-swc` | norwayeast | -6, `9d5a5ae2-a09a-4691-9d2b-52a700bb07a7` |
| Squad on ACA | ACR `crsquadacaazthp0` | `rg-squad-aca-corp-swc` | swedencentral | -6, `9d5a5ae2-a09a-4691-9d2b-52a700bb07a7` |
| ACA Sandboxes, Online (native demo group) | SandboxGroup `sbg-squad-nic2026-online-swc-001` | `rg-aca-sandboxes-online-swc-001` | swedencentral | -5, `714ac8e0-8874-428d-a4f3-79bd3765bfed` |
| ACA Sandboxes, Corp (verified alternative, apply run 38491383605) | SandboxGroup `sbg-squad-nic2026-corp-swc-001` (with `id-aca-sandboxes-corp-swc-001`; `vnetConnections/default` Succeeded) | `rg-aca-sandboxes-corp-swc-001` | swedencentral | -6, `9d5a5ae2-a09a-4691-9d2b-52a700bb07a7` |
| ACA Sandboxes, Corp Norway | SandboxGroup `sbg-squad-nic2026-corp-ne-002` | `rg-aca-sandboxes-corp-ne-002` | norwayeast | -1, `7ebcc54a-6228-410d-acec-9efffa9ed693` |

**Sandbox IDs:** no sandbox is live; every proof guest was deleted (historical only, never use in a command: Actions run `50dfe2a8-a1e1-4c9f-b98a-2d9850abd8c2`, operator Online `963e3f0e-6cbb-4c52-b1dd-60daf6ac8da9`, operator Corp `d9a7bef0-583b-4ff8-a7b1-a0f3de9cddb0` and the post-apply Corp guest `abf07787-3dbb-4a49-aa2c-3504f202be5e`). The operator creates exactly one new guest in the off-stage prepare step; bind the new ID only in `operator-targets.json`. The Corp Sweden group is live (Succeeded) and applied; Corp is a verified alternative bound to that exact subscription, resource group, group and default connection, with no auth or location switch and no deployment command on stage. The Online group stays the default native demo.

## Agent cheat-sheet

| Agent | Used in | Switch (TUI) |
| --- | --- | --- |
| `squad` | Prepare, Essentials, C0-C2, C4, C6, close of C7, extras | Shell: `copilot --agent squad` (add `--plan` for C1/C2); in TUI `/agent squad` |
| `terraform-coder` | C3 test, C5 mutation and restore (the only writer) | `/agent terraform-coder` |
| `terraform-validator` | C5 before/seeded-failure/repaired, C7 checks (runs, never edits) | `/agent terraform-validator` |
| `terraform-reviewer` | C4 Learn lookup, C7 independent review (read-only, fresh `/new`) | `/agent terraform-reviewer` |

Slash commands go in the Copilot **TUI**; `Set-Location`/`copilot` go in the **Shell**.
Every step below names agent, surface, expected result and **STOP**.
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

**TUI, guided CLI:** the validator has no edit tool: it checks, the coder makes the one lab change. Follow the steps in order; the PowerShell block at the end of this section is what the validator runs each time.

1. **Agent:** `/agent terraform-validator`. **Do:** paste:

   ```text
   Use docs/prompt-pack.md's complete C5 block: before, labeled coder-only mutation,
   seeded-failure, restoration, repaired. Narrowly approve each offline command;
   require intended private_automatic_contract failure/original hash. Stop on error.
   No weakened checks/provider/lock/Azure/retry.
   ```

   It runs a read-only preflight, then the `before` phase, then stops because it cannot edit.
   **Say:** the validator checks, it does not edit.
   **Expect:** exit 0, 53 passed 0 failed including `alternate_network_payload`; `main.tf` SHA-256 recorded (original hash, do not show it in full); init uses the lock read-only and the filesystem mirror (azapi v2.12.0); `git status` may show the two `.github\agents` profile edits (local MCP profile edit, never commit, never show the URL or key).

2. **Agent:** `/agent terraform-coder`. **Do:** paste the labeled **DELIBERATE LAB MUTATION**:

   ```text
   Native terraform-coder: in this disposable worktree only, change
   body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
   Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
   ```

   **Say:** one deliberate change, labeled, in the disposable worktree only.
   **Expect:** Edit `main.tf` +1 -1, `enablePrivateCluster` true to false, nothing else.

3. **Agent:** `/agent terraform-validator`. **Do:** say `The coder step is done. Run seeded-failure.` and approve its command.
   **Say:** the check must fail, and fail for the intended reason.
   **Expect:** nonzero exit, 51 passed 2 failed; only `private_automatic_contract` and `alternate_network_payload` assert 4 fail; the printed condition shows `enablePrivateCluster == true` is false. Stop on any other failure, no retry.

4. **Agent:** `/agent terraform-coder`. **Do:** ask `Restore only enablePrivateCluster to true. Change nothing else.` then run `/diff`.
   **Say:** the repair is the same one field, back to its original value.
   **Expect:** `main.tf` diff empty relative to baseline for that file (profile edits may still show; check the specific path).

5. **Agent:** `/agent terraform-validator`. **Do:** say `Restoration is done. Run repaired.` and approve its command.
   **Say:** pass, intended fail, pass, with the original hash back.
   **Expect:** exit 0, 53/53, `main.tf` hash equals the original.

**STOP:** before/wrong failure/isolation/cut.

Block run by the validator via `!` in the same guided CLI window, once per phase, with `$phase` edited each time to `before`, then `seeded-failure`, then `repaired`
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

**Guard:** edit `$phase` before every run (`before`, `seeded-failure`, `repaired`); never rerun `before`. Do not run `seeded-failure` before the mutation. If the block is run manually via `!` with the wrong phase it throws `Keep the previous result; choose a new take.`, and a stray log then blocks the real run. Restore the snapshot rather than deleting logs on stage.

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
**Evidence:** open [AKS creation run, deploy runs and live website](#evidence-links) here (creation proof: [run 37586137417](https://github.com/martinopedal/terraform-azapi-aks-automatic/actions/runs/37586137417); latest deploy+HTTPS proof: [run 37938422464](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/37938422464), apply skipped; agent: Squad, surface: TUI for the paste, browser for the page).

## Workstation preparation map - not VM stage commands

Verified `C:\git\squad-terraform-session-2026-10-14` roots:
`public` session source; `demo-env` consumer; `module-public` canonical Corp
module (read-only); `aca-sandboxes` session checkpoint, **not a native consumer**.
Native consumer source: `demo-env\deployments\aca-sandboxes-online`.
[Ownership](repositories.md). These roots prove neither VM paths nor live GO.

## Optional extras - only after the complete core flow

Both flows are optional after core wrap; native Sandboxes come first, Squad on ACA is the very last section. Before either, the operator privately prepares `C:\demo\operator-targets.json` with current bindings, URLs, guest ID and GO for the selected flow. Include no credentials. Never commit or display it; each prompt rereads it because shell variables do not persist.
Evidence rows for both: [Evidence links](#evidence-links).

<a id="native-demo"></a>

## Native ACA Sandboxes - optional tail (Squad sandboxes), native first

**What we are showing (2-3 min):** Copilot/Squad runs on the HOST; it drives a hardware-isolated Ubuntu guest through visible `aca` tool calls (no new CLI; Copilot/Squad is never installed in the guest). Trigger: your paste. Useful output: real shell checks (JSON, hash) and one causally denied outbound request with its audit line. No Terraform, no AI inside the guest.

**Showcards - Paste → Say → Open → Expected:** (1) off-stage: `/agent squad`, paste prepare prompt → "one disposable guest" → terminal → ID saved privately. (2) stage: paste on-stage prompt → "host drives, guest isolated" → aca output → 3 true checks, 403 + audit. (3) cleanup: paste the cleanup prompt below → "exact ID only" → empty list.

**Prerequisites checklist (off-stage, tick all or SKIP):**
- [ ] `aca` CLI **1.0.0-preview.4** installed (`aca --version`); Azure CLI signed in by the human.
- [ ] `C:\demo\operator-targets.json` has `native.subscription`, `native.resourceGroup`, `native.group`, `native.region`, `native.prepareOneGuest` (prepare) and `native.go` + `native.sandboxId` (stage). No credentials in it; never printed.
- [ ] Exact sandbox group exists in that resource group and region; current list is empty before prepare.
- [ ] Explicit permission for one guest and fixture staging; independent stage GO obtained.

**Part 1 - off-stage prepare (agent: `squad`, surface: Copilot TUI in the host repo)**

1. **Presenter does:** `/agent squad`; paste the prepare prompt below after the human grants one-guest permission.
   **Expect:** file created or verified, one guest (ID saved first), 300 s auto-suspend set after create, fixture hash verified. **STOP:** help cannot express create properties, group not empty, any mismatch; failed upload means exact-ID delete. No second create.

**Off-stage prepare prompt, only after explicit permission for one guest and fixture staging:**

```text
Host Squad: I approve exactly one disposable guest now. Create C:\demo\operator-targets.json if missing; add or verify only these keys, keep all others, never overwrite a mismatch (STOP), never print it, no credentials: native.subscription=714ac8e0-8874-428d-a4f3-79bd3765bfed (ME-MngEnvMCAP464621-martinopedal-5), native.resourceGroup=rg-aca-sandboxes-online-swc-001, native.group=sbg-squad-nic2026-online-swc-001, native.region=swedencentral, native.prepareOneGuest=true, native.go=false. Require no current native.sandboxId, else STOP. Use installed aca 1.0.0-preview.4 help. Verify exact group and empty current list; explicitly bind --subscription, --resource-group, --region and command-specific --group (not diagnostic --sandbox-group) from native.* on every target command. Inspect `aca sandbox create --help`; run exactly one `aca sandbox create` for an Ubuntu guest with 1000m CPU, 2048Mi, Deny/Full egress, no ports/credentials. If help cannot express those, STOP before create. Capture its UUID even if `-o json` prints text and save it as native.sandboxId privately before any other step; never create again to fix parsing. Then `aca sandbox lifecycle set --auto-suspend enable --idle-timeout-seconds 300` on that exact ID and verify with `lifecycle show`. Then `aca sandbox fs write` canonical 684-byte LF docs/fixtures/native-validation.sh to /root/native-validation.sh; read `.content` and verify SHA-256 75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5. On any failure after create: print the ID, delete exactly that ID, verify empty list, clear native.sandboxId, STOP. Success: print only the ID. No group/role/install/network changes.
```

**Part 2 - on-stage (agent: `squad`, then `terraform-validator`, then `terraform-reviewer`; surface: Copilot TUI)**

1. **Presenter does:** after human stage GO, `/agent squad` in the host repo; paste the on-stage prompt below. Never run the fixture on the host or install/sign in inside the guest.
   **Say:** "A hardware-isolated sandbox, driven from my host Copilot; the host never runs the fixture."
   **Show:** actual aca output: exact-ID get, one `sh /root/native-validation.sh`, decoded `native-result.json`.
2. **Presenter does:** wait for the single `https://example.com/` denial probe and the current timestamped audit (up to 10 seconds).
   **Say:** "One request is denied, and the audit shows it."
   **Show:** guest JSON (schema `native-squad-validation-v1`, three true checks, matching SHA, exit 0), denied request, current audit. HTTP 403 alone, an immediate empty audit or a post-delete 404 is not proof.
3. **Presenter does:** `/agent terraform-validator` with the real output/exits, then `/new` and `/agent terraform-reviewer` for the independent handoff.
   **Expect:** reviewer cites actual outputs. **STOP:** missing GO/ID, mismatch, failed check/audit or no time.

**Open:** the terminal running aca, then the [2026-10-13 dry-run evidence row](#evidence-links) as backup. **What the audience sees:** guest JSON/hash, one denied request and its audit line; no guest URL or preview exists. Open authenticated [sandbox-group discovery](https://containerapps.azure.com/sandbox-groups) or [regional management](https://management.swedencentral.azuredevcompute.io); neither is a guest website.

**On-stage host Squad prompt, after human stage GO:**

```text
Host Squad: read C:\demo\operator-targets.json privately. Expected native bindings (STOP on any mismatch with operator-targets.json): subscription ME-MngEnvMCAP464621-martinopedal-5 (714ac8e0-8874-428d-a4f3-79bd3765bfed), resource group rg-aca-sandboxes-online-swc-001, group sbg-squad-nic2026-online-swc-001, region swedencentral. Require native.go=true, current native.sandboxId and exact native.subscription/resourceGroup/group/region, else STOP. Reread/rebind --subscription, --resource-group, --region and command-specific --group from native.* for every tool call. Invoke aca-sandboxes; exact-ID get, then execute `sh /root/native-validation.sh` once and fs cat /root/native-result.json, decoding `.content`. Require schema native-squad-validation-v1, three true checks, matching source/result SHA and actual exit 0. Use the linked runbook's single `https://example.com/` denial/audit probe with this ID; read the current timestamped audit before cleanup, allowing up to 10 seconds. HTTP 403 alone, immediate empty audit or post-delete 404 is not proof. Return real output/exits for `/agent terraform-validator`, then `/new` + `/agent terraform-reviewer` independent handoff. No issue/queue, guest agents, create/upload/install, auth/egress changes or retry.
```

**Cleanup prompt (after the stage, exact ID only):**

```text
Host Squad: read C:\demo\operator-targets.json privately, never print it. Require exact native.subscription/resourceGroup/group/region and native.sandboxId, else STOP. Delete exactly that ID with `aca sandbox delete --id <native.sandboxId> --yes` (bind --subscription, --resource-group, --group, --region), verify the group list is empty and get returns 404, then clear native.sandboxId and set native.go=false. No other deletes.
```

**If it fails (exact fallback):** do not retry or create another guest. Say it is optional, open the green runtime [run 38479216856](https://github.com/martinopedal/aks-automatic-demo-env/actions/runs/38479216856) (OIDC create, fixture, 403 audit, exact-ID delete) from [Evidence links](#evidence-links), say it is the recorded proof, and move on or skip.
[Full native operations and audit](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad).

<a id="hosted-demo"></a>

## Squad on ACA (hosted Apps/Jobs) - optional tail, the very last section

**What we are showing (3 min):** Haflidi's design, running in our Azure: label → GitHub Actions OIDC → queue → KEDA → ephemeral ACA Job (managed identity) → Copilot/Squad with charters → App-bot PR. The work runs in the Job, not on the host; your host Squad only prepares and observes. Showcards - Paste → Say → Open → Expected: (1) off-stage: prepare prompt → "one unlabelled issue" → issue page → no label. (2) stage: stage prompt → "a label starts a hosted team" → enqueue run, execution, PR → matching message/issue/execution and README-only PR.

**Prerequisites checklist (off-stage, tick all or SKIP):**
- [ ] **Off-stage prepare, never trigger (tick all or SKIP):** `C:\demo\operator-targets.json` has the hosted go flag (false until stage GO), `hosted.repo` = `martinopedal/squad-on-aca-demo-target`, `hosted.issue` (a NEW **unlabelled** README-only issue; never reuse #12, #2 or #4), `hosted.issueUrl`, `hosted.workflowUrl` (the [Squad Issue Queue workflow page](https://github.com/martinopedal/squad-on-aca-demo-target/actions/workflows/squad-queue.yml), not a run URL; the enqueue run only exists after the label) and `hosted.workerUrl` (Job link below). Use the prepare prompt below; it must never add a `squad:*` label.
- [ ] Issue has no `squad:*`/`squad:processing` label, PR or branch; `gh` signed in by the human; workflow enabled; stage GO and one-attempt approval given. Private evidence needs org access: [Evidence links](#evidence-links).

**Deployed path (target `squad-queue.yml`, read 2026-10-14):** "Squad Issue Queue" fires on `issues: labeled` for any `squad:*` label except `squad:processing`, on the self-hosted `squad-on-aca-demo` runner (OIDC). It skips an already-processing issue, adds `squad:processing`, and queues one message on `squad-work-queue`; KEDA starts `caj-squad-aca-agent-corp-ne`. No live poller, no manual dispatch.

**Off-stage prepare prompt (agent: `squad`, TUI; never labels):**

```text
Host Squad: prepare, do not trigger. Read C:\demo\operator-targets.json privately; never print it. Repo martinopedal/squad-on-aca-demo-target. Create or confirm exactly one README-only issue (one sentence in README.md; no code, workflows or secrets) with NO labels; its body asks for a named specialist ripley plus an independent read-only fact-checker as real task subagents (no roleplay) for that one-sentence change. Save only hosted.repo, hosted.issue and hosted.issueUrl privately; keep the go flag false. Confirm no squad:* label, no linked PR or branch and no workflow run for it. Do not add a label, dispatch a workflow, start a Job or retry. Report the issue URL.
```

1. **Presenter does:** `/agent squad` (TUI); paste the stage prompt below after fresh hosted GO (the go flag set true) and one-attempt approval.
   **Say:** "An issue label queues a hosted Job; one hosted Copilot/Squad session runs a named specialist plus an independent read-only check and answers with a bot PR. Not every built-in role is exercised."
   **Show:** the unlabelled issue, then the label added once, the new enqueue run for that issue, the actual ACA Job execution and the bot PR/README diff.
   **Open in order:** the issue (`hosted.issueUrl`), the new "Squad Issue Queue" enqueue run discovered from `hosted.workflowUrl` for that exact issue, the worker execution of `caj-squad-aca-agent-corp-ne` in [Azure portal](https://portal.azure.com/#@500bedc4-517a-4594-95f9-ff240f25bb12/resource/subscriptions/9d5a5ae2-a09a-4691-9d2b-52a700bb07a7/resourceGroups/rg-squad-aca-corp-swc/providers/Microsoft.App/jobs/caj-squad-aca-agent-corp-ne/overview) (`hosted.workerUrl`), then the bot PR. **Audience sees:** the label queues one execution and a PR touching README.md only. **Expect:** the enqueue receipt, the actual Job/worker and the App-bot PR all match on one message, issue, repository and agent; only README.md changed. Allow a few minutes for the runner and the Job; **STOP** if nothing appears by the time cut.
2. **Presenter does:** hand off for independent review (`/new`, `/agent terraform-reviewer`); do not merge/deploy.
   **If it fails:** **STOP:** missing GO, old attempt, incomplete correlation, non-README change, error stub or no time; no retry. Fallback: say it is the recorded run; open [issue #16](https://github.com/martinopedal/squad-on-aca-demo-target/issues/16), enqueue [run 38516269166](https://github.com/martinopedal/squad-on-aca-demo-target/actions/runs/38516269166), [PR #17](https://github.com/martinopedal/squad-on-aca-demo-target/pull/17) and the [multi-agent receipt](https://github.com/martinopedal/squad-on-aca-demo-target/blob/main/docs/receipts/hosted-multi-agent-issue16.md) (private, needs access; execution `caj-squad-aca-agent-corp-ne-5fr95`; do not merge or retrigger #16/#12); older one-worker history: [issue #12](https://github.com/martinopedal/squad-on-aca-demo-target/issues/12), [run 38479777642](https://github.com/martinopedal/squad-on-aca-demo-target/actions/runs/38479777642), [PR #13](https://github.com/martinopedal/squad-on-aca-demo-target/pull/13) ([receipt](https://github.com/martinopedal/squad-on-aca-demo-target/blob/main/docs/receipts/hosted-run-38479777642.md)), or skip.

**Stage prompt (host Squad), only after fresh hosted GO and one-attempt human approval:**

```text
Host Squad: read C:\demo\operator-targets.json privately; never print it. Expected hosted bindings (STOP on mismatch): repo martinopedal/squad-on-aca-demo-target; Jobs/queue in subscription ME-MngEnvMCAP464621-martinopedal-6 (9d5a5ae2-a09a-4691-9d2b-52a700bb07a7), resource group rg-squad-aca-corp-swc, Container Apps environment cae-squad-aca-corp-ne (norwayeast), worker Job caj-squad-aca-agent-corp-ne, ACR crsquadacaazthp0, workflow Squad Issue Queue (.github/workflows/squad-queue.yml, trigger issues labeled). Require hosted.go=true, hosted.repo, hosted.issue, hosted.issueUrl, hosted.workflowUrl and hosted.workerUrl; missing/stale data means STOP. Do not require a run URL before the event. Reread/rebind on every shell/tool call. Read the existing issue with `gh issue view` using hosted.issue and hosted.repo. Verify the approved README-only request from docs/prompt-pack.md#original-hosted-squad-issue-to-pr-work (named specialist ripley plus an independent read-only fact-checker, real task subagents, no roleplay), no squad:* label, no squad:processing, no prior queue/attempt/result or PR for it. Only after one-attempt GO, add `squad:ripley` once with `gh issue edit`; no new issue, manual dispatch, Job start, auth mint or retry. Then discover the new Squad Issue Queue run created by that label event for this exact issue (`gh run list --workflow squad-queue.yml`, newest run after the label time, confirm via its issue/event) and wait for it to finish. Match the enqueue receipt's message ID + issue + repository + agent to the actual ACA Job/worker execution of caj-squad-aca-agent-corp-ne (read-only `az containerapp job execution list`) and its App-bot PR; require only README.md changed. Show the issue, enqueue run, execution, worker log lines for the specialist and the independent check, and the PR. Hand off for independent review; do not merge/deploy. A status-only run is not enqueue proof; no live poller is claimed.
```

[README-only issue brief](prompt-pack.md#original-hosted-squad-issue-to-pr-work); [full hosted procedure](demo-runbook.md#card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr).

