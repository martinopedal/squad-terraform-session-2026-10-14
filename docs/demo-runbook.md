# Run C0-C7 live in the real CLI

Audience: both presenters and the approved operator. Purpose: run the bounded
live chapters and two separate product demo flows without implying that
the Windows VM, AKS, hosted Jobs and native MicroVMs are the same runtime.

C0 (from zero to a squad) runs live on the clean Windows 11 demo VM, not in this checkpoint shell. Follow [clean-machine-demo.md](clean-machine-demo.md) for C0. This file mirrors the C0 clock and then covers the live C1-C7 operator sequence.

**C0 Pre-staged:** VM recreated or verified clean; Bastion already connected; PowerShell 7 tab open; package source agreements accepted by flags; terminal zoom set; no secrets in clipboard.

**C0 slot 05:30-08:30. Cut at 07:45 (2:15 into C0):** If installs or login are not complete, state the live stall, show fallback evidence, and move to `s05-parallel`. Do not spend later content time on installing tools.

Use `qualify_then_run_clean_checkpoint` as the provenance rule: qualify the module first, then run genuine new execution from a disclosed checkpoint in the **current Copilot CLI shell**. Don't open another terminal or substitute a viewer. This live run adds a payload regression test and demonstrates a labeled mutation/repair, not the module's first-ever implementation.

Local module qualification passed: 52 module cases, two caller cases, and both mutation evidence checks. Hosted Terraform matrix CI run 36990206303 passed, native agent-setup CI passed in run 37286068987, final module verification passed in run 37286237657, and docs-only Azure-validation release CI passed in run 37305768318. A private IaC consumer deployed and read back the module on October 5, 2026, pinned to runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; sanitized facts are public, private inputs are not. These are instructions for the live run, not an executed transcript. Native profile selection and full rehearsal remain separate gates.

Source roles: the live demo consumer is `martinopedal/aks-automatic-demo-env`, pinning `martinopedal/terraform-azapi-aks-automatic` by `v0.6.0`. C1-C7 use this session's copied Corp teaching module from the independently reusable public `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp`, whose separate upstream pin/manifest stay unchanged. The [repo map](repositories.md) identifies what to clone/read/change and keeps Haflidi's hosted implementation separate from the private target.

October 12: one laptop's corrected read-only preflight passed 18/18 with Copilot CLI 1.0.94, Squad 1.0.1, ACA CLI 1.0.0-preview.4 and enabled official plugin 0.0.5-beta. Clean-VM/manual sign-in, both presenter hosts, full rehearsal, invitation acceptance/current read-back and exact NIC listing remain separate gates. Released deck 0.22.6 on main/Pages followed PR22's normal merge October 13, successful Pages and initial full/short HTTP 200 byte verification. Later local correction bytes remain unpublished pending independent review, normal merge and Pages byte verification; publication does not close those gates. See [current readiness](run-plan.md#october-12-readiness-evidence).

October 13 current VM hold: consumer source is accepted/merged, including
Haflidi's changes; the existing plan attempt obtained a recovered ephemeral
runner, then failed closed because the existing private backend plan-prefix
transport was not qualified. This was **before Azure login/backend access,
actual Terraform plan, saved-plan approval, or apply**. Runner absence is no
longer that attempt's blocker; no VM/bootstrap success or installation follows.
The last deallocated/changed OS-disk attachment receipt is historical.
Fresh read-only VM metadata reports D8s_v5 and its same attached 127 GiB
Premium_LRS/Detach disk, but no DemoMachineBootstrap CSE. Resize actor/time
are unknown; don't attribute it to this attempt or downgrade it. Preserve both
disks; never swap back/recreate/delete either. Refresh current binding/baseline
and runnable SYSTEM context; retain original Haflidi/Online exact human gates.
Use disclosed host fallback or skip C0 if clean/manual-login prerequisites fail.

For component -> repo -> folder -> edit -> deploy -> status, use the canonical
[source/deployment table](source-provenance.md#source-and-deployment-table).
Fresh October 12 10:47 UTC reviewer result: branded app/source-matching assets
and two responding replicas passed with explicit TLS bypass. Canonical checks
26 PASS / 2 BLOCKED / 1 report-only, not 29/29. Corrected supplemental:
10 PASS / 1 FAIL (untrusted/mismatched TLS) / 1 NOT_APPLICABLE (external
`/healthz`; source requires direct-pod `/healthz` 200 `ok`, not that external route).
Native Kubernetes access unavailable/ResourceHealth provider unregistered;
full cluster health unproved. Eleven policy-noncompliant resources are in the
demo RG across AKS/network/state, not 11 cluster failures or subscription-wide.

Released deck 0.22.6 on main/Pages propagates these native/hosted status boundaries
into the initially accepted exported speaker notes. Later local correction bytes
remain unpublished pending independent review, normal merge and Pages byte
verification; they retain 0.22.6 and are not a new runtime/rehearsal proof.

## Prepare the checkpoint

Martin operates; Haflidi checks evidence. In [feature-guide.md](feature-guide.md), H1-H4/S0 mean help probes; D means documented, not exercised. Follow [talk-track.md](talk-track.md) for the live 60-minute delivery: 00:00-03:00 intro, 03:00-55:00 planned content and live chapters, 55:00-58:00 protected slack, 58:00-60:00 close plus questions if time allows.

In the current CLI, use `/cwd` to confirm the public repository. Execute PowerShell blocks through the `!` shell escape in this same window. Each block is one shell invocation; shell variables don't carry into later CLI turns.

Start Copilot CLI from the public session repository folder or from one of its clean checkpoint worktrees. Do not start it from the coordinator/private folder. From the wrong folder, `/agent` only lists user-level agents plus Squad, without `terraform-coder`, `terraform-validator`, or `terraform-reviewer`.

### Create and verify the agreed VM layout

**Primary on-stage host: the VM, using `C:\demo`.** The user approved this
layout; its actual directories/checkouts remain **unverified** until the
operator runs setup inside that VM. The verified `C:\git` directories in the
[monitor preparation map](short-talk-track.md) belong to the workstation,
not the VM. Never substitute them into VM commands.

Off-stage source preparation only, after VM/host setup is separately authorized
and Git is available. This creates missing **public source** clones and checks
existing ones without resetting, switching branches, or overwriting dirt:

```powershell
$ErrorActionPreference = 'Stop'
$repos = @(
  @{ Path = 'C:\demo\session-repo'; Url = 'https://github.com/martinopedal/squad-terraform-session-2026-10-14.git' },
  @{ Path = 'C:\demo\aks-automatic-demo-env'; Url = 'https://github.com/martinopedal/aks-automatic-demo-env.git' }
)
foreach ($repo in $repos) {
  if (-not (Test-Path $repo.Path)) {
    New-Item -ItemType Directory -Force 'C:\demo' | Out-Null
    git clone --branch main --single-branch $repo.Url $repo.Path
    if ($LASTEXITCODE) { throw 'Public source clone failed.' }
  }
  $root = git -C $repo.Path rev-parse --show-toplevel
  if ($LASTEXITCODE -or $root.Trim().Replace('/','\') -ne $repo.Path) {
    throw 'Existing directory is not the expected Git root; preserve it.'
  }
  $remote = git -C $repo.Path remote get-url origin
  if ($LASTEXITCODE -or $remote.Trim() -ne $repo.Url) { throw 'Wrong source origin.' }
  git -C $repo.Path log -1 --oneline
  git -C $repo.Path status --short --branch
}
foreach ($file in @(
  'C:\demo\session-repo\terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl',
  'C:\demo\session-repo\.github\agents\terraform-validator.agent.md',
  'C:\demo\aks-automatic-demo-env\manifests\online\ingress.yaml'
)) {
  if (-not (Test-Path -LiteralPath $file -PathType Leaf)) { throw "Required public file missing: $file" }
}
```

Expected: two distinct roots/origins, actual heads/status, named source files.
Record them; a successful clone isn't module/runtime qualification. Existing
local edits, stale heads, wrong origin, or absent files require operator review,
not `reset`, `checkout`, or forced pull. Preserve Haflidi's incoming source.
The separate clean C0 demonstration still needs actual absent tools/new clone
and manual login; this prepared layout doesn't establish those preconditions.

**Optional hosted checkout, off-stage and private:** `C:\demo\hosted-target`
is the agreed target path, not verified on the VM. Only its operator may create
it from the already approved private target URL. Never clone the implementation
repo here or copy the workstation coordinator. This template requests the
nonsecret approved URL; it neither signs in nor grants consent:

```powershell
$ErrorActionPreference = 'Stop'
$targetUrl = Read-Host 'Operator-approved existing private target Git URL'
if ([string]::IsNullOrWhiteSpace($targetUrl)) { throw 'Approved target binding missing.' }
if (-not (Test-Path 'C:\demo\hosted-target')) {
  git clone $targetUrl 'C:\demo\hosted-target'
  if ($LASTEXITCODE) { throw 'Authorized target clone failed.' }
}
$root = git -C 'C:\demo\hosted-target' rev-parse --show-toplevel
if ($LASTEXITCODE -or $root.Trim().Replace('/','\') -ne 'C:\demo\hosted-target') { throw 'Wrong target root.' }
$origin = git -C 'C:\demo\hosted-target' remote get-url origin
if ($LASTEXITCODE -or $origin.Trim() -ne $targetUrl) { throw 'Wrong approved target origin.' }
git -C 'C:\demo\hosted-target' log -1 --oneline
git -C 'C:\demo\hosted-target' status --short
```

Expected: the approved target origin/actual head and reviewed status. Confirm
current accepted poller transport/native setup before using Card A; a stale
clone/checker doesn't qualify worker runtime. Missing private binding or
existing dirt means STOP, not reset/copy/reinitialize. Keep this screen private.

### Conditional human setup before Plan

Use the existing authorized session. The HUMAN operator completes missing
sign-in before readiness, Plan, approval, and implementation, not once per
agent. Check the execution host, repository, intended operation, and required
permissions first.

| Lane | Setup and expected result | Stop condition |
| --- | --- | --- |
| Copilot | Existing signed-in session; HUMAN `/login` only if absent. The deliberate clean C0 login stays a separate demo step. | Missing session: no READY probe or Plan yet. |
| Source-only C1-C7 | Public source, filesystem provider mirror, credential-free mocked/backend-disabled checks. **No Azure login required.** | Missing mirror/isolation or inherited credentials: stop; Azure sign-in isn't a repair. |
| Authenticated GitHub work | HUMAN resolves missing GitHub CLI sign-in; check `gh auth status --active --hostname github.com` without token-display flags, then the selected operation's rights. | Wrong host/repo, failed readiness, or missing task permission: no issue/PR trigger. |
| Authorized local Azure operation | HUMAN completes missing Azure CLI sign-in in the separately scoped operator session; verify exact target and the approved nonsecret service read. | Cached account metadata or a token alone doesn't prove target/data-plane access. |

Agents must not start interactive/device login, retrieve/export tokens, copy
credential caches into guests, change RBAC/App permissions, or put private values
in prompts/logs. CI OIDC, hosted managed identity, GitHub App authorization, and
guest OAuth are distinct boundaries; authentication is not deployment or stage GO.

GitHub MCP is optional repository/code/Space context, not an "authentication
MCP". This session exposes five read/context tools: `get_copilot_space`,
`get_file_contents`, `list_copilot_spaces`, `search_code`, and `search_users`.
None mutates PRs, issues, or workflows. Keep working `gh` for the GitHub
lifecycle; don't install a duplicate MCP or widen permissions for these demos.
The isolated native MCP window below intentionally disables unrelated servers.

**20-second repo-folder preflight (hard stop):** from the public repo folder, run the headless check below and expect the literal reply `READY`. Then, interactively, open `/agent` and confirm that `terraform-coder`, `terraform-validator`, and `terraform-reviewer` all appear before you continue. If `/agent` only shows user-level agents plus Squad, exit, change to the public session repo folder or the selected checkpoint worktree, and restart Copilot there.

```powershell
copilot --agent terraform-reviewer -p "Reply with exactly: READY"
```

This was rechecked from the session repo checkout before this docs update. The literal reply was `READY`.

Programmatic `-p` is batch output, not interactive Plan-mode operation; don't use it for these live chapters.

The file-backed native coder, [validator](../.github/agents/terraform-validator.agent.md), reviewer, MCP (Model Context Protocol) grounding, and
[qualification skill](../.github/skills/qualify-agent-setup/SKILL.md) are described
in [CONTRIBUTING.md](../CONTRIBUTING.md). Before choosing a new take checkpoint,
have the operator run its Node readiness/negative checks. Inspect `/agent list`
and verify all three profiles: `terraform-coder`, `terraform-validator`, and
`terraform-reviewer`. Inspect `/instructions` and `/mcp`; `/mcp` should show the
`microsoft-learn` and `terraform` servers for coder/reviewer, not validator.
MCP policy is hosted first. Microsoft Learn is cloud-hosted. The demo uses a
Docker-run Terraform MCP server pinned for this session; HashiCorp documents
local deployment (including Docker) and self-hosted transports. Pre-flight Docker
Desktop and the exact pinned Terraform MCP image with:

```powershell
docker pull hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5
```

Start the demo window with only the profiles' own MCP servers. Every server in
your user-level `~/.copilot/mcp-config.json` starts in every session, so OAuth
servers open `localhost:<port>` sign-in tabs and slow startup enough that
agent-scoped tools can arrive after the first turn:

```powershell
$off = (Get-Content "$HOME\.copilot\mcp-config.json" -Raw | ConvertFrom-Json).mcpServers.PSObject.Properties.Name |
  ForEach-Object { '--disable-mcp-server', $_ }
copilot --disable-builtin-mcps @off
```

After selecting a profile, wait until `/mcp` lists `microsoft-learn` and
`terraform` as connected before the first prompt. In the October 5 dry run,
batch `-p` runs without this wait sometimes reported the MCP tools as missing
("tool catalog changed before tool could be invoked"). With user servers
disabled, the coder reached Microsoft Learn in 4 of 4 runs.

The native Terraform MCP binary is not used for this demo. MCP means Model Context Protocol: external tools or sources connected to the CLI. Restart Copilot in
this same window only if discovery is stale, then inspect again. Static checks and MCP discovery are not evidence of profile
activation. Squad remains the coordinator; the narrow-tool lane uses explicit
native selections, not an assumption that general-purpose Squad tasks inherit
profile tool filters.

Save `copilot --version`, `squad --version`, `terraform version`, and `tflint --version` in `evidence\versions.txt`; pin resolved executables/packages and hashes. Prior CLI probes differed between 1.0.88 and 1.0.89; `--no-auto-update` isn't version selection. The module requires Terraform `>=1.14.8,<2.0`, locked AzAPI 2.12.0, and configured TFLint 0.64.0.

Squad is coordination/configuration over its Copilot host, not a sandbox product; 1.0.1 help has no sandbox verb. [Four hosts](sandboxing.md) distinguishes local OS/MXC, GitHub-managed cloud preview, customer-managed ACA MicroVMs and hosted Squad Apps/Jobs. A worktree/tool filter does not isolate credentials. Documented cloud sessions are interactive-only; local 1.0.94 help does not expose `--cloud`, so do not turn the preview/account-build gate into an operator command here.

Treat pinned TFLint as a hard preflight item. If it is missing or on the wrong version, install the approved build before the demo, then verify it:

```powershell
winget install --id TerraformLinters.tflint --version 0.64.0 --exact --source winget --accept-package-agreements --accept-source-agreements --silent
tflint --version
```

Stop here if `tflint --version` does not report 0.64.0. Do not spend C7 time installing or troubleshooting TFLint.

### Create the disposable C1-C7 checkpoints

No existing A/B/guided paths were verified October 13. This **off-stage
operator recipe creates them**, not a claim that they already exist.
Use the reviewed public `0abb202f` checkpoint, not the private coordinator Git
history or the preparation clone's uncommitted files. The source worktree and
incoming Haflidi changes remain untouched. Each new detached worktree shares
only the public repository's object database; sparse files include reviewed
public team definitions/decisions, not private histories, captures, or memory.

Expected creation:
`C:\demo\checkpoints\take-20261014\A`,
`\B`, `\guided`, `\evidence`, and later `\offline`. If that take already exists,
STOP and have the operator select a newly approved take name everywhere,
never reset or reuse an earlier result.

```powershell
$ErrorActionPreference = 'Stop'
Set-Location 'C:\demo\session-repo'
$pin = '0abb202f34af385b7e0a34b1775643aa5b4871ed'
$take = 'C:\demo\checkpoints\take-20261014'
if ((git remote get-url origin).Trim() -ne 'https://github.com/martinopedal/squad-terraform-session-2026-10-14.git') {
  throw 'Wrong public source repository.'
}
git cat-file -e "${pin}:terraform/modules/aks-automatic-corp/tests/contract.tftest.hcl"
if ($LASTEXITCODE) { throw 'The reviewed module checkpoint is not committed yet.' }
if (Test-Path $take) { throw 'Take exists; preserve it and choose a new approved take.' }
New-Item -ItemType Directory "$take\evidence" | Out-Null
$paths = @('AGENTS.md','QUALITY.md','PUBLICATION.md','README.md','CONTRIBUTING.md','.gitignore',
  '.github\agents\','.github\skills\','.github\instructions\','.github\copilot-instructions.md',
  '.github\pull_request_template.md','docs\','presentation\README.md','presentation\index.html',
  'terraform\module-source.json','terraform\modules\aks-automatic-corp\',
  '.squad\team.md','.squad\routing.md','.squad\decisions.md','.squad\config.json',
  '.squad\casting\registry.json','.squad\casting\policy.json',
  '.squad\agents\*\charter.md','.squad\templates\')
$patterns = $paths | ForEach-Object { '/' + $_.Replace('\','/') }
foreach ($run in 'A','B','guided') {
  git worktree add --detach --no-checkout "$take\$run" $pin
  if ($LASTEXITCODE) { throw 'Worktree creation failed.' }
  git -C "$take\$run" sparse-checkout set --no-cone -- @patterns
  if ($LASTEXITCODE) { throw 'Sparse checkout failed.' }
  git -C "$take\$run" checkout -q --detach
  if ($LASTEXITCODE) { throw 'Checkout failed.' }
  git -C "$take\$run" rev-parse HEAD
  git -C "$take\$run" status --short
}
$pin | Set-Content "$take\evidence\checkpoint.txt"
git -C "$take\guided" ls-files -s -- 'terraform\modules\aks-automatic-corp' |
  Set-Content "$take\evidence\checkpoint-tree.txt"
$take
```

Expected: three identical printed commit IDs and empty status. Review the
checkpoint's public decision ledger before copying it; never substitute the
coordinator's private `.squad`. Git sparse patterns use Git's slash syntax.
In each new root, confirm `/cwd`, all three native profiles, and
`terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl` before Plan.
Don't start C1 if the test already contains `alternate_network_payload`.

### Stage the filesystem-only mirror

Off-stage operator preparation, not a C5/C7 validator command or Azure
operation: stage the locked Windows provider into this exact take. Public
Registry access is needed for this one staging step, **not Azure login**.
Preserve/check the AzAPI 2.12.0 lock hashes and follow the
[module's mirror policy](../terraform/modules/aks-automatic-corp/README.md#offline-qualification).
The block is self-contained:

```powershell
$ErrorActionPreference = 'Stop'
$take = 'C:\demo\checkpoints\take-20261014'
Set-Location "$take\guided"
if (Test-Path "$take\offline") { throw 'Mirror exists; qualify it without overwriting.' }
New-Item -ItemType Directory "$take\offline\providers" | Out-Null
terraform -chdir='terraform\modules\aks-automatic-corp' providers mirror `
  -platform=windows_amd64 "$take\offline\providers"
if ($LASTEXITCODE) { throw 'Locked provider staging failed.' }
$mirror = "$take\offline\providers".Replace('\','\\')
@"
provider_installation {
  filesystem_mirror {
    path = "$mirror"
    include = ["registry.terraform.io/azure/azapi"]
  }
}
"@ | Set-Content "$take\offline\terraform.tfrc" -Encoding utf8
```

Expected: mirror package and `offline\terraform.tfrc`, with no `direct` fallback.
Before live execution, qualify locked init/tests in a separately uncredentialed,
network-restricted Terraform subprocess. Stop if that isolation is unavailable.
The guard doesn't detect every host credential source. Never use cached Azure
login, direct downloads, or ordinary `terraform plan` as a substitute.

## Quick troubleshooting

### What the offline PowerShell checks do

C5 records the before/fail/repair loop; C7 records the final module and caller
suite. Paste each **whole** block through `!` in the guided CLI window. Variables,
environment assignments, and the local `Check` function don't persist across
CLI shell turns. `Check` is defined inside the C7 block, not an installed helper.

| Statement/check | Purpose and expected result | Failure means |
| --- | --- | --- |
| `$PSNativeCommandUseErrorActionPreference = $false` | Let the block capture the real native exit, including C5's deliberate nonzero result, before applying its explicit stop checks. | This doesn't suppress failures: every required clean step must still exit `0`. |
| `TF_CLI_CONFIG_FILE` | Select the qualified **filesystem-only** AzAPI 2.12.0 mirror policy. No direct-download fallback. | Missing configuration/package/hash: stop before tests. A plugin cache alone isn't isolation. |
| `CHECKPOINT_DISABLE` / `TF_IN_AUTOMATION` | Disable Terraform update checks and use automation-style output. | Neither variable isolates networking or credentials; the approved restricted subprocess remains required. |
| Credential/override guard | Reject inherited `ARM_`, relevant `AZURE_`, `TF_VAR_`, and `TF_CLI_ARGS` names without printing their values. | Stop. Resolve isolation off-stage; don't sign in or dump the environment. |
| `init -backend=false -input=false -lockfile=readonly` | Load locked providers/modules locally, without configuring remote state, prompting, or rewriting locks. Exit `0`. | Provider/lock/mirror problem, not permission to upgrade or contact Azure. Backend-disabled init alone isn't a network sandbox. |
| `fmt -check -recursive` | Check HCL layout without rewriting source. Exit `0`. | Formatting changes needed; no silent rewrite during validation. |
| `validate -no-color` | Check configuration/types against the installed provider schema. Exit `0`. | Syntax/schema error; not an Azure deployment result. |
| `tflint ... --config=.tflint.hcl` | Run the committed lint policy using TFLint 0.64.0. Exit `0`. | Tool/setup or lint failure: stop, don't remove rules or suppress diagnostics. |
| `test -no-color` | Execute the module's mock-AzAPI plan contract and the caller's separate mocked suite. Clean phases exit `0`; seeded C5 must fail on `private_automatic_contract`. | Auth/syntax failures don't prove the mutation was detected. Mocks don't prove Azure acceptance. |
| `Tee-Object`, captured `$LASTEXITCODE`, `.exit.txt` | Preserve actual command/output and numeric exit before another command can overwrite it. New filenames prevent overwriting a prior take. | Missing output/exit or preexisting logs: blocked, not passed. |
| `git diff`, before/after SHA-256 | Inspect the exact allowed test change and verify `main.tf` is restored byte-for-byte. | Unrelated edits, altered assertions, or changed source hash: no acceptance. |

| Symptom | Recovery | Verification |
| --- | --- | --- |
| Symptom: only user/plugin agents plus Squad are listed (no terraform-* project agents). | Recovery: Copilot was started in the wrong folder (e.g. the coordinator root, which only has squad.agent.md) -- cd to the session repo folder and restart. | Verification: `/agent` shows `terraform-coder`, `terraform-reviewer`, `terraform-validator` as project agents. |

## C1: Compare two plans | 12:30-15:30 | 3 minutes

**Pre-staged:** both C1 prompt blocks ready; sessions named C1-A/C1-B; same model and permission profile visible; saved excerpts ready if output drifts; Copilot started from the public repo folder or the selected checkpoint worktree, not the coordinator/private folder.

**Cut at 14:45 (2:15 into C1):** If C1-B is still generating, stop comparison at one clear C1-A consequence and use the saved C1-B excerpt.

Haflidi leads and narrates; Martin operates the two clean worktrees. In A, from the repo-root/worktree CLI window, use `/new`, `/agent` and select **Squad**, `/model`, `/plan`, and `/rename C1-A`. Repeat in B as `C1-B`, with identical model, instructions, permissions, and public starting team state:

```text
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
```

Save approved prompt/result excerpts as `c1-a.txt` and `c1-b.txt` under evidence. Compare one consequence, not verbosity. Identical outcomes are valid. Don't use `/fork` as a fresh comparison or retry until results differ. Start the guided pass separately.

## C2: Revise and approve | 17:30-21:30 | 4 minutes

**Pre-staged:** checkpoint shell open; file paths copied; approval language rehearsed; Plan-mode fallback screenshot ready; Copilot started from the public repo folder or the selected checkpoint worktree.

**Cut at 20:30 (3:00 into C2):** If the plan is not ready, use the saved approved plan and state that approval covers only repository changes.

Martin drives; Haflidi challenges scope. In guided, from the repo-root/worktree CLI window, use `/new`, `/rename guided-clean-run`, `/agent` and select Squad, `/instructions`, then `/plan`. Show the mode indicator.

Show only reviewed project instructions; keep global paths and unrelated session pickers off-screen.

```text
@terraform\modules\aks-automatic-corp\main.tf
@terraform\modules\aks-automatic-corp\variables.tf
@terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl
This is prepared, qualified code. Plan the C1 regression test and its README
explanation. Keep all eight inputs, six outputs, and the AzAPI resource intact.
Plan a separately labeled enablePrivateCluster mutation and repair.
No implementation, Azure lookup, apply, dependency upgrade, or state operation.
```

Inspect `/session plan`. Revise genuinely: "Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign." Save accepted criteria in `c2-approved-plan.md`. Explicitly approve only that scope, leave Plan mode through the actual UI, and show the new mode. Approval does not authorize deployment.

## C3: Assign one writer | 22:00-26:00 | 4 minutes

**Pre-staged:** B1v2 prompt copied exactly; checkpoint can be reset; fallback B1v2 eval excerpt ready; no causal claim from B1v2 to live result; from the session repo folder, start Copilot with the exact command below before C3.

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\guided'
copilot --agent squad
```

Expected in `/agent`: `Squad` (user) plus `terraform-coder`, `terraform-reviewer`, `terraform-validator` marked "project".

**Cut at 25:00 (3:00 into C3):** If the coder is still generating, stop the live turn, use the saved B1v2 excerpt, and move to C4 with the same boundary.

Martin operates; Haflidi reads returned evidence.

```text
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
```

This matches the B1v2 brief used for the live C3-C5 loop (5/5 green in the October 8 re-measurement); that is prior evidence only, and the live run still has to pass.

Show reviewed roster/charters, `/tasks`, `/agent list`, actual starts, and
handoffs. The list must include `terraform-coder`, `terraform-validator`, and
`terraform-reviewer`. Inspect `/mcp` while coder/reviewer are selected to show the
`microsoft-learn` and `terraform` servers, and note that validator has no MCP
servers. Then use `/agent terraform-coder` in this same repo-root/worktree window, supply the
accepted brief, and observe the actual edit tool and changed files. The validator,
not this profile, runs commands in C5/C7 after human approval of each command.
Return to `/agent squad` for C4 and coordination. Record `c3-handoffs.md`,
including actual profile selection; do not invent a task ID for manual selection
or treat assignment as completion. No nested fleet or concurrent writers on the
test file.

## C4: Invoke guidance and a source | 29:30-33:30 | 4 minutes

**Pre-staged:** Docker Desktop running; required MCP servers already connected; fallback `c4-source` excerpt sanitized. C4 is the base skill/MCP flow only. Both cloud extras are deferred until after all core work and wrap; their own human stage gates remain separate. No second live attempt.

**Cut at 32:30 (3:00 into C4):** Cut the base skill/MCP flow. State any missing live result, show reviewed fallback with its actual scope, and hand off by 33:30. Do not retry or spend 55:00-58:00 protected slack.

Martin drives; Haflidi explains the claim. Use `/skills info test-discipline`, then:

```text
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation. Through the configured Microsoft Learn
MCP, perform only a read-only search/fetch for AKS Automatic private/custom
network requirements. Cite the source/version relevant to private API access
and hosted-system subnets. Don't contact an Azure account or change providers.
```

Show the actual skill invocation, `/mcp` output with `microsoft-learn` and
`terraform`, the read-only MCP call/result, and one scoped permission decision.
Approve only the inspected read-only request, never blanket interpreter access.
Save `c4-source.md` with URL, retrieval time, tool, server/version, and
limitation. Missing skill/server or a failed lookup stays failed/pending, not
invented output.

## C5: Seed, fail, repair | 33:30-38:30 | 5 minutes

**Pre-staged:** validator shell ready; environment scrub command copied; three log names chosen; seeded mutation can be applied from fallback if the model turn runs long.

**Cut at 37:15 (3:45 into C5):** If the repair is not ready, stop live mutation work, show saved seeded-failure and repaired logs, then continue. Haflidi runs the validator.

Haflidi takes control; Martin explains the repair. Select
`/agent terraform-validator` in the same repo-root/worktree window, confirm its `read`, `search`, and `execute` tools,
and approve each command separately under native prompts. The validator has no
`edit` tool, but its shell can still write files; the command list is enforced
only by its instructions and native approval prompts. It must stop on failure.
Run this block before mutation:

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

Stop if the unmutated run fails. Preserve `main.tf` and its SHA-256 as `main.before-seed.tf` and `main.before-seed.sha256` in evidence. On screen, label **DELIBERATE LAB MUTATION, NOT AN AI-DISCOVERED DEFECT**:

```text
Native terraform-coder: in this disposable worktree only, change
body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
```

Rerun the identical block with phase `seeded-failure`. Require a nonzero exit and the `private_automatic_contract` assertion: "The API must remain private with public FQDN disabled and VNet integration enabled." Syntax/authentication failures do not satisfy this checkpoint.

Select `/agent terraform-coder` in the same repo-root/worktree window before the mutation/repair requests. Use `/review`:
"Read-only review of this labeled mutation; identify the violated assertion."
The built-in review command is distinct from the configured native reviewer;
do not claim it inherits that profile's tools. Ask the coder to restore only
that field, inspect `/diff`, and have the operator rerun as `repaired`.
Require exit zero and the original `main.tf` hash. Ordinary repair is not formal
Squad rejection. Return to `/agent squad` for C6. Hand controls back to Martin.

## C6: Resume with decisions intact | 42:00-45:00 | 3 minutes

**Driver:** Haflidi leads; Martin verifies the recovered reason.

**Live surface:** Genuine Copilot CLI with Squad selected in a real integrated terminal; capture controllers stay external, off-screen tooling; Qualify code first; execute from a disclosed clean checkpoint.

**Timing:** Slot 42:00-45:00. 0:35 decision record; 0:45 /new, /resume, /cwd; 0:35 /context and /usage; 0:50 cite constraints; 0:15 buffer.

**Pre-staged:** Decision excerpt sanitized and ready; unrelated personal memory or session list not shown; resume target known.

**Say:** Save the public reason, resume the right session, and verify the next task reads it. Keep this as a live demo and use the offline fallback only if the live step stalls.

**Type:**

```text
C6 live command / prompt
Scribe: record the public-only decision under .squad\decisions\inbox\ for later merge into .squad\decisions.md.
Decision: private API invariant, caller-owned provider/backend, added network-payload regression,
labeled mutation/restoration, exact checks, and the sanitized Azure-validation boundary without exposing private target details.
Do not copy histories, credentials, or full conversations.
/new
/resume guided-clean-run
/cwd
/context
/usage
Read the saved decision; cite its file and the constraints for the next change.
```

**Point at:** Point at the decision record, the resumed session name, the cited file, /context, and /usage.

**Expected:** The resumed task cites the decision file and constraints; context and usage are inspected before more work.

**Cut at 44:15 (75%):** If resume/search is slow, show the decision file and state the constraints directly.

**Hand-off:** Use the next slide transition line in the run plan.

**Offline fallback:** Use c6-decision.md and session screenshots; do not display personal memory or unrelated sessions.

**Working tip:** Verify that the reason reached the resumed task.

**Fallback:** If the live CLI stalls, use the Offline fallback line in these notes and keep the same chapter timing. Source links are optional reading, not online demo dependencies.

## C7: Validate the consumer and review | 47:00-50:00 | 3 minutes

**Pre-staged:** offline suite can run from a prepared shell; logs have no private IDs; reviewer prompt copied; no private plans or raw state on screen; `tflint --version` already confirmed as 0.64.0; Copilot started from the public repo folder or the selected checkpoint worktree.

**Cut at 49:15 (2:15 into C7):** If the full suite is not done, show the saved green exits and diff; do not run a second suite live.

**Go/no-go for C7:** if TFLint is missing, `tflint --version` does not report 0.64.0, or the live `Check lint` step fails for tool/setup reasons, stop the live suite and switch to the reviewed offline evidence for C7. Do not spend chapter time installing or debugging TFLint.

Haflidi leads validation and review; Martin supports and names the acceptance
boundary. Select `/agent terraform-validator` in the same repo-root/worktree window and approved isolated
context, approve each command separately, record commands, and stop at the first
failure:

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

Inspect `/diff` and `/review`. Preserve `c7-final.diff`, file hashes, and the human code-only acceptance. Both suites mock AzAPI and use plan-mode runs; `MockOnly` and `.invalid` outputs are not Azure results. Stop on unexpected providers, live authentication, dependency drift, unrelated edits, or any failed clean check.

For the independent native-profile acceptance, preserve the public handoff and
use `/new` followed by `/agent terraform-reviewer` in this same repo-root/worktree window. Supply
the exact diff, files, revision, MCP citations, and sanitized validator results.
Capture the actual review rather than treating a profile switch in the author's
context as independent. Return findings to Squad and the human maintainer. This
additional handoff must be rehearsed within the chapter budget; no completed take
or timing qualification is implied by adding the instructions.

## s20-consumer: An Online consumer | 50:00-53:00

This three-minute section follows C7. Keep it short and preserve the boundary
between reviewed module code and private environment inputs.

- **0:00-0:30 (50:00-50:30):** show the consumer-to-module diagram.
- **Within that same slot, source-only ingress cue:** the [full track](talk-track.md#s20-consumer--5000-5300--an-online-consumer) and [monitor sheet](short-talk-track.md) trace the public consumer manifests: Azure DNS label/LB -> dedicated App Routing NGINX -> `/` Ingress rule -> Service 80 -> two web pods 8080, with mounted site ConfigMap and namespace policy. Keep source topology distinct from current runtime/DNS/trusted-TLS proof; no kubeconfig/auth/secret reads or deployment.
- **0:30-1:00 (50:30-51:00):** open `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; the certificate warning is expected. Point at the pipeline flow, serving pod name, and speakers section.
- **1:00-2:10 (51:00-52:10):** say "gated pipeline PR → plan → human approval → apply"; label October 8 29/29 as historical. Current October 12 canonical counts are 26 PASS/2 BLOCKED/1 report-only, not renewed full health/trusted TLS.
- **2:10-3:00 (52:10-53:00):** restate the boundary. If the app is unreachable, use the offline screenshot plus apply runs 37771532872 and 37772290635 as fallback evidence.

## Protected slack | 55:00-58:00

Keep 55:00-58:00 for recovery only. Do not add a recap, new explanation, or extra Q&A. Start the close at 58:00.

## Optional final extras - only if time and live gates permit

Finish essentials, C0-C7, the technical explanation, consumer reveal and core
wrap **before** either extra. Only a genuine early finish creates spare time
before 55:00; do not shorten core content to manufacture it. Both extras may
be skipped. Stop before 55:00; 55:00-58:00 is protected recovery and
58:00-60:00 is the protected close, never appendix time. Native ACA Sandboxes
come first, Squad on ACA Apps/Jobs is the very last section. No stage GO is inferred from source,
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


## Two product demo flows: hosted Squad and native ACA Sandboxes

Source ownership: existing AKS remains demo-env `deployments\online`/
`deploy-online.yml`; native source is demo-env
`deployments\aca-sandboxes-online` with a separate sandbox-only workflow/protected
`online` environment. Approved one-time Owner bootstrap and five-object
deployment/current operator access/base probe were independently verified;
public source PR human review remains separate. Hosted implementation is
`haflidif/squad-on-aca`; its Jobs deployment remains private/protected. No
Corp/AKS/Jobs change is part of the native plan.

These cards are **operator recipes, not execution transcripts**. The Windows VM is the control
console detail, not either product flow's identity. Existing Online AKS, native ACA MicroVMs, hosted Squad ACA Jobs and
local Copilot sandbox stay independent. Optional GitHub-managed cloud is another
account/runtime lane. Do not run either card until its own private bindings,
access, rehearsal and consent pass. No deployment or mutation was performed by
this docs pass.

Native basic evidence: isolated five-object Online deployment, exact bindings,
current operator access and one credential-free Ubuntu 1 CPU/2 GiB base probe
were independently verified. Base exec/fs/stop-resume/delete and cleanup empty
passed. A corrected ACA SANDBOXES host run completed in 26.768 seconds: LF/source hash
round trip, three guest checks/JSON+SHA, actual exit23, HTTPS403/new exact-sandbox
causal denied audit, exact cleanup/empty list/NotFound/watchdog stopped.
Independent acceptance is complete; card runtime-ready after acceptance, stage GO
still requires manual preflight/rehearsal. Earlier CRLF is learning history. No automatic retry, inside-MicroVM OAuth or working AKS/Corp/
hosted Jobs changes. Use the [two reusable prompt recipes](prompt-pack.md#two-product-demo-prompt-recipes).

Online is primary placement for eligible demo components, not fallback/policy
escape. Corp-required private workloads stay Corp. Source repo visibility and
network/authenticated control-plane placement are separate; no anonymous
native ingress, exposed credentials or private-state publication.

<a id="card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr"></a>

### Card A: Haflidi hosted Squad on ACA Apps/Jobs, issue to bot PR

**Running it, short recipe.** PRECHECK: hosted image/auth/chain and human
rehearsal remain HELD. No live steps until the operator confirms the exact
current target/issue, publisher/worker gates and new GO. One fallback: dated
original hosted evidence, otherwise SKIP. Only genuine spare time after core
wrap; cut before 55:00.

1. **Haflidi + operator, VM PowerShell, `C:\demo\hosted-target`:** use the
   whole privately bound block below to **read the existing approved issue**
   and, only if never queued/attempted, add `squad:ripley` once. SHOW its
   approved README body/label in GitHub Issues. EXPECT one authorized task.
   STOP on prior attempt, missing binding or unexpected body; no issue creation.
2. **Operator, existing hosted service, no manual invocation:** WAIT for the
   private poller's five-minute UTC schedule. It checks that issue/approval,
   defers if the existing queue isn't empty, enqueues the bound task and marks
   processing. KEDA starts the existing **event Job** from that queue.
   SHOW the matching sanitized poller/queue receipt and worker execution.
   The queue is source-selected `squad-work-queue`, TTL600/visibility10.
   EXPECT the same issue throughout. STOP on absent/mismatched evidence;
   don't `gh workflow run`, `az ... job start`, or inspect secret queue payloads.
3. **Operator, Azure portal:** Container App Jobs ->
   source-selected `caj-squad-aca-agent-corp-ne` -> **Executions** ->
   matching execution/start/status. Its source RG is `rg-squad-aca-corp-swc`,
   environment Norway East; confirm owner-bound actual deployment first.
   The read-only CLI observation block below is an alternative.
   SHOW real Squad UID10001 worker result plus same-issue correlation.
   EXPECT genuine completion, not just an image pull. STOP on missing runtime.
4. **Haflidi, GitHub browser, approved target:** Pull requests -> matching
   App-bot PR linked to that issue -> **Files changed** -> `README.md`.
   SHOW actual paragraph/diff/checks, then independent human review handoff.
   EXPECT README only, no merge/deploy. STOP on stub/no PR/wrong author or cut.
   Owned cleanup is separately approved off-stage.

Both independent product paths must qualify: this **SQUAD ON ACA APPS/JOBS**
issue -> Job/agent -> bot PR path needs fresh current end-to-end evidence.
The corrected **ACA SANDBOXES** host-to-MicroVM receipt does not prove it.
The owned fork/target path is source-accepted; this does not authorize execution
or any change to the working original source/runtime.

The original implementation is completed and previously demonstrated. Leave
Haflidi's source/deployment unchanged. Owned MIT fork/target handoff and private
publisher source are accepted/merged, but live E2E remains pending publisher/
owner-native Terraform/image/auth/actual PR/human gates, not new runner
registration/AppAdmin. These holds do not block accepted native engineering.

| Field | Operator plan |
| --- | --- |
| Owner | Haflidi explains his authored implementation; Martin/hosted operator controls approved target trigger and verifies evidence |
| Repo / folder | Original `haflidif/squad-on-aca` is working/unchanged; [owned MIT fork PR1](https://github.com/martinopedal/squad-on-aca/pull/1) is source-accepted/merged, @haflidif credit/license preserved. Workstation public fork is `C:\git\squad-terraform-session-2026-10-14\worktrees\hosted-source-fork`, local `411bbf1`, not original main. VM `C:\demo\hosted-target` is an intended private target checkout, NOT verified until its operator setup above; never use the implementation/session clone as target |
| Login | Manually verify host sign-in/`gh auth status`/current target rights. Source-prepared credential-free manual status is not a trigger or runtime proof. Genuine worker authentication is separately gated; no host PAT/cache copy |
| Preflight / GO | Chosen private scheduled poller -> one approved issue -> existing queue -> genuine Squad UID10001 worker -> trusted README App-bot PR. Private publisher Docker/DNS/TLS qualification waits at existing human gate/zero steps; owner-native Terraform/full QA/plan, immutable image/auth/actual PR/rehearsal pending: **NO-GO**. No new registration/AppAdmin requirement |
| Expected proof | Correlate the same approved issue, queue workflow, actual ACA Job execution and bot-authored PR/diff. Job success or an image pull alone is not full chain proof and not native MicroVM/Squad proof |
| Timing / cut | Final optional tail after the complete core wrap, only if genuinely early and newly qualified. Hard cut before 55:00, skip before 55:00-58:00 recovery. No promise that queued work finishes in 90 seconds; full pre-stage chain testing is separate |
| Fallback | State source-accepted/runtime-held status and the actual publisher/owner-native Terraform/image/auth/PR gates; use dated original confirmed implementation evidence or skip. Missing-agent/error-only personal PR stubs are not successful Squad work. No second issue or on-stage repair |
| Cleanup | After separate owner approval, close only the created test issue/PR, stop only owned test execution and verify queue drain. No shared service, Corp resource or unrelated runner deletion |

**DO, only after new hosted GO:** use the **existing approved README issue**,
not a new issue. The operator binds its number/target/bot privately from the
accepted owner runbook and confirms it hasn't already been queued/attempted.
Current target `.github\squad-transport.json` selects `private-aca-poller`;
its `squad-queue.yml` is **manual status only**, not enqueue or chain evidence.
Read public implementation in the verified workstation fork's
`agents\base\poller-entrypoint.sh`, `entrypoint.sh`, and `docs\owned-runtime.md`.
The private owner-native Terraform runbook is the only infrastructure authority;
don't run the fork's Bicep/Quick Start as a second writer.

**TYPE, privately bound operator template, NOT runnable while held:** replace
each quoted marker with the existing owner-approved binding. The issue number
is not a newly invented demo issue. Stop before this block if any binding or
exactly-one-attempt permission is missing. No login/token/config operation:

```powershell
Set-Location 'C:\demo\hosted-target'
$targetRepo = '<approved-private-target>'
$demoIssue = '<existing-approved-issue-number>'
$botApp = '<approved-bot-app>'
gh issue view $demoIssue --repo $targetRepo --json title,body,labels,state
if ($LASTEXITCODE) { throw 'Existing approved issue read failed.' }
# STOP if already queued, attempted, processing, or the body isn't the approved README task.
gh issue edit $demoIssue --repo $targetRepo --add-label squad:ripley
if ($LASTEXITCODE) { throw 'Approved issue routing failed; no retry.' }
gh pr list --repo $targetRepo --head "squad/ripley/issue-$demoIssue" `
  --state open --json number,url,headRefName,author
if ($LASTEXITCODE) { throw 'Bot PR read failed.' }
```

**Read-only Job observation alternative, only after owner verifies this
source-selected target and permits the read.** This lists executions; it
doesn't start a Job or prove same-issue correlation:

```powershell
az containerapp job execution list `
  --subscription '9d5a5ae2-a09a-4691-9d2b-52a700bb07a7' `
  --resource-group 'rg-squad-aca-corp-swc' `
  --name 'caj-squad-aca-agent-corp-ne' `
  --query '[].{execution:name,status:properties.status,start:properties.startTime,end:properties.endTime}' -o table
if ($LASTEXITCODE) { throw 'Matching hosted execution read failed.' }
```

**SHOW:** correlate that SAME issue -> actual private scheduled poller ->
durable existing queue -> genuine UID10001 Squad worker/ACA Job -> trusted
README-only App-bot commit/PR. The operator reads the matching Job through the
existing reviewed owner procedure with its approved hosted target, not the
native SandboxGroup. Missing bound Job observation is STOP, not an invented
`az` command or a status-workflow substitute. Inspect the actual PR diff and
checks, then hand it to an independent human reviewer; don't merge.
The expected source branch is `squad/ripley/issue-$demoIssue`; verify actual
App-bot attribution and issue closure reference against `$botApp`, not a
personal/error-only stub.

**EXPECT:** one genuine README change, numeric worker result, same-issue
correlation and reviewable bot PR. Source CI/status/image pulls alone don't pass.
**STOP:** current image/auth/custody/rehearsal hold, old queued issue, missing
source/bindings/runtime receipt, failed command or no time = dated original
evidence/SKIP. No new issue, duplicate label/reset/retry or unsafe Job start.

Owner-native source preparation is under independent review; executable delivery
remains held. Plan/apply/destroy are currently unconditionally disabled; signer,
current-head/private-plan transport and executable integration remain
implementation work, not just operator receipts or deploy-on-merge.

The [original hosted workload brief](prompt-pack.md#original-hosted-squad-issue-to-pr-work)
defines the small README-only task and human-review handoff. Fresh target gating
applies to the new target, not to rebuilding Haflidi's completed implementation.

### Card B: native ACA Sandboxes for host Copilot CLI and Squad

**Running it, short recipe.** PRECHECK: basic engineering accepted, but actual
prepared ID and human stage GO must be supplied by the existing native operator.
The [exact accepted LF fixture](fixtures/native-validation.sh) is now published
as source, not installed on the VM/guest. One fallback:
accepted dated native trace, otherwise SKIP. Dead last, genuine spare time only,
cut before 55:00; status/doctor isn't the demo.

1. **Martin, VM PowerShell, `C:\demo\session-repo`:**
   `copilot --agent squad`. SHOW `/cwd`, selected Squad and approved prepared
   Online group/ID. EXPECT the host controls a MicroVM, not a guest agent.
   STOP if root, exact ID/fixture/hash, access or human GO is missing.
2. **Martin, Copilot TUI:** paste the
   [basic fixture prompt](prompt-pack.md#native-host-squad-isolated-work);
   invoke `aca-sandboxes`, inspect each exact-ID `exec`/filesystem request
   before narrow approval. SHOW actual tool arguments and guest output.
   EXPECT `sh /root/native-validation.sh` once and result readback below.
   STOP on a different script,
   target, create/upload/install/auth/rule request or error.
3. **Haflidi, returned guest results:** SHOW positive JSON and source/result
   SHA-256, immediate numeric exits including the deliberate `23` negative,
   and denial with its new exact-sandbox audit if that check is approved.
   EXPECT the accepted fixture's check contract, not a 403-only policy claim.
   STOP on missing/mismatched outputs; never relabel incomplete checks PASS.
4. **Martin, host handoff:** give actual prompt/tools/results/hash/exits to
   validator and fresh-context reviewer, then human acceptance. SHOW findings
   and limits. EXPECT no guest OAuth/Copilot claim or hosted-Job equivalence.
   STOP at the cut; exact owned lifecycle/cleanup happens off-stage only.

| Field | Operator plan |
| --- | --- |
| Owner | Martin drives; approved native sandbox operator prepares resources and evidence; Haflidi explains the limits |
| Repo / folder | VM host `C:\demo\session-repo` for notes/public fixture; VM consumer `C:\demo\aks-automatic-demo-env\deployments\aca-sandboxes-online` owns native source. Both must be created/verified during VM setup above. Target is separate Online `rg-aca-sandboxes-online-swc-001` / `sbg-squad-nic2026-online-swc-001`, `swedencentral`, not AKS or Card A's Jobs/runner. No Corp BYO VNet/UAMI/FIC transplant |
| Login | Supported manual Azure CLI/Entra login, then host ACA auth status; current token status exit 0 proves tokens only. Never copy host authentication into a MicroVM. Optional in-VM Copilot/Squad requires separate supported sign-in/storage/egress consent |
| Preflight / GO | Independent five-object provisioning/current operator access/base probe verified; second presenter and full [coverage](aca-sandboxes.md#full-test-coverage-checklist) remain. Prevalidate public UTF-8 LF source/hash and installed parsers; separately approve prepared runtime/lifecycle; verify exact target/access/egress and successful work/rehearsal. Corrected public-fixture runtime receipt PASS, independent acceptance complete; card runtime-ready after acceptance, **NO-GO** for stage until human preflight/rehearsal; doctor wrong-target remains a warning, not proof of absent service |
| Trigger | Host Copilot CLI with Squad coordinates a bounded public-only brief; invoke `aca-sandboxes`, inspect actual `aca` tool requests, and drive prepared MicroVM filesystem/offline Terraform work. No on-stage create/upload/install/egress/region changes |
| Expected proof | Actual host prompt -> selected Squad/skill -> inspected tool calls -> positive public guest output/numeric exits/hash -> validator/reviewer handoff citing target/source/time. Real failed output is retained, not edited into PASS. Standalone lifecycle checks are prerequisites, not successful integration. Full required source/result transport, negative exits and attributable egress must pass off-stage |
| Timing / cut | Final optional tail only, after hosted Apps/Jobs and the complete core wrap; cut before 55:00, no retry or protected-slack spend. Full runtime QA is pre-stage, not a four-minute promise. Base skill/MCP C4 remains default today |
| Fallback | Accepted corrected ACA SANDBOXES trace or skip; earlier CRLF is labeled learning history. Runtime evidence is not human stage GO or hosted Apps/Jobs proof. No fallback runtime execution or automatic retry |
| Cleanup | Record owned lifecycle and cleanup scope before preparation. Approved stop/delete and read-back off-stage only; separate group/RG, no AKS/hosted Jobs/Corp teardown. Oct 17 teardown/Oct 31 credential expiry scheduled, not done |

**Current exact binding, not stage GO:** October 13 09:33 UTC exact ARM GET
returned that Online group `Succeeded`. This isn't doctor, presenter access,
or new runtime evidence. The Online subscription GUID is approved in the
[narrow public demo matrix](stack-overview.md);
"Online" alone is a placement alias, not a verified CLI subscription name.

**DO:** human/operator binds the actual pre-approved prepared sandbox ID and
stages the exact [684-byte public LF fixture](fixtures/native-validation.sh)
off-stage. Accepted source SHA-256:
`75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5`.
Guest source is `/root/native-validation.sh`; result is `/root/native-result.json`.
The accepted run deleted its sandbox: **no current prepared ID is established**.
The operator supplies a separately approved current ID; never reuse the
historical deleted ID or create a replacement on stage.

**Off-stage fixture staging, only after separate preparation consent.**
Run on the VM after this reviewed source is available; this preserves the
canonical bytes and rejects CRLF/hash mismatch:

```powershell
$ErrorActionPreference = 'Stop'
$source = 'C:\demo\session-repo\docs\fixtures\native-validation.sh'
$bytes = [IO.File]::ReadAllBytes($source)
if ($bytes.Length -ne 684 -or $bytes -contains 13) { throw 'Expected canonical 684-byte LF fixture.' }
$expected = '75d8fc0f08005317bbdc21c8de9ad43f3b7e06736e419014e7cf8678b9cab2a5'
if ((Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) {
  throw 'Canonical fixture hash mismatch.'
}
if (Test-Path 'C:\demo\native-fixture\native-validation.sh') { throw 'Preserve existing staging; qualify it separately.' }
New-Item -ItemType Directory -Force 'C:\demo\native-fixture' | Out-Null
Copy-Item -LiteralPath $source -Destination 'C:\demo\native-fixture\native-validation.sh'
```

Expected: same bytes/hash, not guest deployment/readiness. The approved operator
uploads **off-stage only** using installed `aca sandbox fs write --id` with
`--path '/root/native-validation.sh' --file 'C:\demo\native-fixture\native-validation.sh'`
and the exact target flags below. That existing source-backed action doesn't
authorize a new sandbox, lifecycle, auth, egress, or installation.

**TYPE, read-only prerequisite, not the demo:** existing public host, exact
consented group. These commands don't create a sandbox or clear the human gate:

```powershell
Set-Location 'C:\demo\session-repo'
aca --version
$nativeTarget = @('--subscription', '714ac8e0-8874-428d-a4f3-79bd3765bfed',
  '--resource-group', 'rg-aca-sandboxes-online-swc-001',
  '--group', 'sbg-squad-nic2026-online-swc-001',
  '--region', 'swedencentral')
aca auth status @nativeTarget -o json
if ($LASTEXITCODE) { throw 'Native auth readiness failed.' }
aca doctor @nativeTarget
if ($LASTEXITCODE) { throw 'Native diagnostic failed.' }
# Compare printed target fields and independently read back the exact group ID.
# STOP on mismatch, missing group/access, or missing approval.
```

**TYPE, actual basic demo after all bindings and HUMAN GO:** host shell
`copilot --agent squad`; use the [basic fixture prompt](prompt-pack.md#native-host-squad-isolated-work),
invoke `aca-sandboxes`, inspect each exact-ID `exec`/filesystem request. One
approved LF public fixture only; no guest authentication. The skill is guidance,
not evidence or a new permission.
The inspected host requests must use these exact guest operations. This
**operator-input block** requests the approved current sandbox ID and checks
its exact-target readback before exec. Every block is one invocation; don't
assume an ID variable survives CLI turns. Empty/failed/mismatched readback means
STOP. The negative step expects host exit `23`, not success.

```powershell
$PSNativeCommandUseErrorActionPreference = $false
$sandboxId = Read-Host 'Operator-approved current prepared sandbox ID'
if ([string]::IsNullOrWhiteSpace($sandboxId)) { throw 'Current prepared ID missing; SKIP.' }
$nativeTarget = @('--subscription', '714ac8e0-8874-428d-a4f3-79bd3765bfed',
  '--resource-group', 'rg-aca-sandboxes-online-swc-001',
  '--region', 'swedencentral', '--group', 'sbg-squad-nic2026-online-swc-001')
aca sandbox get --id $sandboxId @nativeTarget -o json
if ($LASTEXITCODE) { throw 'Approved current sandbox readback failed; SKIP.' }
# Operator compares returned ID/target/source staging with the approved prepared receipt before exec.
aca sandbox exec --id $sandboxId -c 'sh /root/native-validation.sh' @nativeTarget -o json
$positiveExit = $LASTEXITCODE
if ($positiveExit) { throw "Positive fixture failed: $positiveExit" }
aca sandbox fs cat --id $sandboxId --path '/root/native-result.json' @nativeTarget -o json
if ($LASTEXITCODE) { throw 'Result filesystem readback failed.' }
aca sandbox exec --id $sandboxId -c "sh -c 'exit 23'" @nativeTarget -o json
$negativeExit = $LASTEXITCODE
if ($negativeExit -ne 23) { throw "Expected deliberate guest/host exit 23, got $negativeExit" }
```

**Expected visible result:** JSON `schema=native-squad-validation-v1`,
`arithmetic=true`, `uppercase=true`, `fixtureHash=true`; `sourceSha256` matches
the canonical source; stdout prints `RESULT_SHA256`.
Decode filesystem response `.content`, not the transport envelope, and hash
its UTF-8 bytes **including final LF**. Match stdout's `RESULT_SHA256`; the
accepted unchanged fixture's result hash is
`2e172d6dbe2d2c600c1f4935d8a4748ad519ec5e896e54d87be0c640cb7edb25`.
Preserve actual numeric exits/stdout/stderr and hand them to validator/reviewer.
Causal HTTPS denial needs its separately approved exact-sandbox audit probe;
run the source-backed block below only after the positive phase passes and
the operator separately approves that probe. Missing audit stays BLOCKED,
never "403 proves enforcement".

**Whole causal-denial block, same approved current sandbox, one HTTPS request.**
The installed `curl` is a prerequisite; no installation. This records before/
after exact-ID egress decisions and requires a new matching denied event.
`--insecure` is deliberately **per-request**, credential-free `example.com`
only, to isolate the policy check. It does not prove trusted TLS or change trust.

```powershell
$PSNativeCommandUseErrorActionPreference = $false
$sandboxId = Read-Host 'Operator-approved current prepared sandbox ID'
if ([string]::IsNullOrWhiteSpace($sandboxId)) { throw 'Current prepared ID missing; SKIP.' }
$target = @('--subscription', '714ac8e0-8874-428d-a4f3-79bd3765bfed',
  '--resource-group', 'rg-aca-sandboxes-online-swc-001',
  '--region', 'swedencentral', '--group', 'sbg-squad-nic2026-online-swc-001', '-o', 'json')
aca sandbox get --id $sandboxId @target
if ($LASTEXITCODE) { throw 'Approved current sandbox readback failed; SKIP.' }
# Operator verifies this exact ID/target is still the approved prepared sandbox before the probe.
aca sandbox exec --id $sandboxId -c 'command -v curl' @target
if ($LASTEXITCODE) { throw 'Preinstalled curl missing; no install.' }
$beforeText = aca sandbox egress decisions --id $sandboxId @target
if ($LASTEXITCODE) { throw 'Before-audit read failed.' }
$before = [Text.Json.JsonDocument]::Parse(($beforeText -join "`n"))
$beforeEvents = @($before.RootElement.GetProperty('networkEgress').GetProperty('denied').EnumerateArray() |
  ForEach-Object { $_.GetRawText() })
$denyCommand = 'set +e; curl --insecure --head --silent --show-error --connect-timeout 5 --max-time 12 --write-out ''\nCURL_HTTP_CODE=%{http_code}\n'' https://example.com/ > /root/native-egress-output.txt 2> /root/native-egress-error.txt; c=$?; printf ''{"curlExit":%s,"host":"example.com","url":"https://example.com/"}\n'' "$c" > /root/native-egress-result.json; cat /root/native-egress-result.json; cat /root/native-egress-output.txt; cat /root/native-egress-error.txt'
$probeStart = [DateTimeOffset]::UtcNow
aca sandbox exec --id $sandboxId -c $denyCommand @target
$probeExit = $LASTEXITCODE
if ($probeExit) { throw "Probe execution failed: $probeExit" }
$curlResultText = aca sandbox fs cat --id $sandboxId --path '/root/native-egress-result.json' @target
if ($LASTEXITCODE) { throw 'Probe result read failed.' }
$curlResult = ($curlResultText | ConvertFrom-Json).content | ConvertFrom-Json
if ($curlResult.curlExit -ne 0 -or $curlResult.host -ne 'example.com' -or $curlResult.url -ne 'https://example.com/') {
  throw 'Unexpected curl result; no denial success claim.'
}
$httpText = aca sandbox fs cat --id $sandboxId --path '/root/native-egress-output.txt' @target
if ($LASTEXITCODE) { throw 'HTTP observation read failed.' }
$http = ($httpText | ConvertFrom-Json).content
if ($http -notmatch '(?m)^CURL_HTTP_CODE=403\s*$' -or $http -notmatch '(?im)^x-deny-reason:\s*example\.com:HEAD\s*$') {
  throw 'Expected HTTP403 and exact deny reason missing.'
}
$curlResult | ConvertTo-Json -Compress
$http
$causal = @()
for ($read = 0; $read -lt 3; $read++) {
  if ($read) { Start-Sleep -Seconds 2 }
  $afterText = aca sandbox egress decisions --id $sandboxId @target
  if ($LASTEXITCODE) { throw 'After-audit read failed.' }
  $auditEnd = [DateTimeOffset]::UtcNow
  $after = [Text.Json.JsonDocument]::Parse(($afterText -join "`n"))
  $causal = @($after.RootElement.GetProperty('networkEgress').GetProperty('denied').EnumerateArray() | Where-Object {
    $stamp = [DateTimeOffset]::MinValue
    [DateTimeOffset]::TryParse($_.GetProperty('timestamp').GetString(), [ref]$stamp) -and
    $_.GetProperty('host').GetString() -eq 'example.com' -and $_.GetProperty('method').GetString() -eq 'HEAD' -and
    $_.GetProperty('scheme').GetString() -eq 'https' -and $_.GetProperty('path').GetString() -eq '/' -and
    $stamp -ge $probeStart -and $stamp -le $auditEnd -and
    $beforeEvents -notcontains $_.GetRawText()
  })
  if ($causal.Count) { break }
}
if (-not $causal.Count) { throw 'No new exact-sandbox causal denied event; BLOCKED.' }
$causal | ForEach-Object { $_.GetRawText() }
```

**SHOW/EXPECT:** `CURL_HTTP_CODE=403`, `x-deny-reason: example.com:HEAD`,
decoded result `curlExit=0`, actual exec exit `0`, and the new matching record
from `networkEgress.denied` between probe start/final read. HTTP403 can coexist
with shell/curl `0`; don't call that a numeric exit failure. Allowed-only,
old/wrong-host/missing events don't pass. No second HTTPS request or rule change.
Retain actual before/after/result/exits privately; show only the bounded
sanitized correlation and give it to validator/fresh reviewer.
The JSON DOM preserves the raw fractional timestamp. Casting a PowerShell
auto-decoded date to string can lose precision and reject a genuine fresh event.
**SHOW:** actual host prompt/selected Squad/skill/tool arguments, guest
JSON/stdout/stderr, numeric exits, source/result hashes and validator/reviewer
handoff. **EXPECT:** positive checks, deliberate negative exit, attributable
denial only with its exact-sandbox audit, then separately approved owned cleanup.
**STOP:** missing fixture/ID/consent, wrong target, failure or cut before 55:00.
Show the accepted dated trace or SKIP. Status/doctor isn't the demo.

**Separate Terraform variant, NOT the accepted basic fixture:** the following
prepared archive `/workspaces/module` recipe requires its own source/archive
hash, installed guest Terraform, mock/oracle/access, and human rehearsal
qualification. The 26.768-second shell engineering receipt doesn't qualify it.
The consumer's `runtime-procedure.md` is an older preparation proposal, not the
accepted fixture source or authority to replay.

**Primary Flow 2 integration, only after its own GO:** start the host CLI from
the public session clone or disclosed checkpoint with `copilot --agent squad`.
The separately inspected ACA session must have the skill/tools available; do
not grant ACA execution to the narrow Terraform validator. Ask Squad to scope
the public-only check and return an actual accountable handoff:

```text
Squad: coordinate only this approved public-module validation in the prepared
native ACA MicroVM. Invoke the aca-sandboxes skill and use the prepared-sandbox
prompt from docs/aca-sandboxes.md without broadening its target or permissions.
The operator supplies the explicit approved subscription/RG/group/region.
Keep the host CLI/Squad as orchestrator, not as a process claimed inside the VM.
Inspect each aca tool call. Read the public archive/source/hash and filesystem,
run offline Terraform validate and the mocked root tests once, and capture real
numeric exits inside the MicroVM. No create/upload/install/egress change/retry.
Return actual prompt/tool/output evidence and hand off to the validator/reviewer
with source revision, checks, evidence limits and missing results. Stop at the cut.
```

The [prepared final-native prompt](aca-sandboxes.md#recommended-live-use) is the exact
bounded remote-execution recipe. Show actual selected agent, skill invocation,
tool arguments, outputs and handoff, not just this text or agent summary. Accepted host-orchestration engineering is not human stage GO. The Online base and actual
corrected host trace are separate, observed milestones; acceptance is complete. Use the
[native public-work prompt](prompt-pack.md#native-host-squad-isolated-work)
for a separately approved prepared-runtime rehearsal.
Full filesystem round-trip/lifecycle/suspend/resume are pre-stage tests.
Running Copilot CLI/Squad **inside** the MicroVM is a distinct advanced optional
variant requiring separate install/auth/storage/egress consent and actual
in-VM process/agent/prompt evidence. It is not mandatory for the basic
host-orchestrated remote-work claim and not established by Card A.


### Native procedure reference - final optional tail, never C4

This is not a second chapter. Historical Management-side checks do not qualify
Corp or Online. The held Corp qualification was blocked on an unexpected
change-type check; no apply performed. Last baseline 8 present / 3 absent,
connection/two presenter Data Owner grants missing; effective access and runtime
unproved for that Corp lane. Separate Online provisioning/access/base is verified,
not AKS or hosted Jobs/runner. Standard managed network if policy allows; leave
Corp untouched. No successful Corp sandbox creation/runtime test or full
CLI+Squad execution inside a MicroVM is established. Host installs/plugin and
hosted Jobs do not supply that evidence; supported sign-in, storage and egress
require separate consent, never copied host authentication.

The corrected ACA SANDBOXES host worker returned three positive guest checks/
JSON+SHA, actual exit23 and causal HTTPS-denial/cleanup proof. Independent
acceptance is complete; card runtime-ready after acceptance, stage GO after
manual preflight/rehearsal. Earlier CRLF is controlled learning history.
This does not qualify hosted Apps/Jobs issue-to-PR.

Select this final optional extra only after core wrap, genuine early finish, and independently approved selected-target IaC,
effective access/policy read-back, full required runtime coverage and exact
presenter preflight. Auth tokens/doctor alone do not close the gate; actual doctor
was wrong-target. Compare printed subscription/RG/group/region with approved
target plus independent exact-ID read-back. Follow [the full
checklist](aca-sandboxes.md#full-test-coverage-checklist) and Card B above.

Martin manually selects the rehearsed, separately scoped ACA session. Keep the Terraform validator profile unchanged; this variant does not grant it ACA tools or wider shell authority. All setup, archive upload, dependency installation, and lifecycle preparation happen before the optional tail under the approved scope, not on stage. Earlier C4 sub-slot timings are superseded preparation history,
not the current run order. Use relative phases within genuine spare time and stop
before 55:00; never return to or replace C4.

1. **Phase 1 - guidance/prepared source:** Name the independently qualified selected scope and pre-staged resources. Show the skill and one prepared source citation. Say this source was fetched in preflight, not by a live MCP call.
2. **Phase 2 - one bounded prompt:** Submit the single [prepared-sandbox prompt](aca-sandboxes.md#recommended-live-use). Privately substitute reviewed group/resource-group/sandbox identifiers. Approve only inspected requests in the native permission flow. Run validation and the root negative-validation suite once; no create, upload, install, rule change, or retry.
3. **Phase 3 - inspect evidence:** Inspect completed output, actual numeric exits captured inside the sandbox, and HTTP observations. Confirm the archive revision/hash against preflight. Use the exact approved archive's oracle/count; historical ten root checks are not the Corp 52+2 qualification or a timeless count for current upstream. An agent summary, Boolean exit field, or 403 alone is not policy-enforcement evidence.
4. **Phase 4 - cut before 55:00:** Cut the live attempt even if the model is still running. State unfinished checks. Show only reviewed, target-qualified evidence if available, otherwise an excerpt labeled "Management-side execution evidence, not Corp validation" with its recorded limitations. It is not Online qualification either. The core C5-C7 flow is already complete; approved lifecycle stop/cleanup is off-stage.

The earlier fresh Copilot runs took about 2:58 and 1:47 in Management. They don't qualify Corp or guarantee a 90-second turn. If the gate is unmet, skip this final extra; capacity, plugin, or venue-network trouble does not authorize another target or infrastructure change.

Keep records private with generic pointers such as `evidence\aca-target-preflight.json`, `evidence\aca-target-checks.txt`, and `evidence\aca-management-session.txt`. These suggested names do not claim those files or target results already exist. Record target qualification, actual output/exits, source/hash, timing, failures, and evidence scope; publish only reviewed sanitized excerpts. USD 20 total through Oct 31 is a budget alert, not a hard cap; retained Corp costs remain.
