# Run C0-C7 live in the real CLI

C0 (from zero to a squad) runs live on the clean Windows 11 demo VM, not in this checkpoint shell. Follow [clean-machine-demo.md](clean-machine-demo.md) for C0. This file mirrors the C0 clock and then covers the live C1-C7 operator sequence.

**C0 Pre-staged:** VM recreated or verified clean; Bastion already connected; PowerShell 7 tab open; package source agreements accepted by flags; terminal zoom set; no secrets in clipboard.

**C0 slot 05:30-08:30. Cut at 07:45 (2:15 into C0):** If installs or login are not complete, state the live stall, show fallback evidence, and move to `s05-parallel`. Do not spend later content time on installing tools.

Use `qualify_then_run_clean_checkpoint` as the provenance rule: qualify the module first, then run genuine new execution from a disclosed checkpoint in the **current Copilot CLI shell**. Don't open another terminal or substitute a viewer. This live run adds a payload regression test and demonstrates a labeled mutation/repair, not the module's first-ever implementation.

Local module qualification passed: 52 module cases, two caller cases, and both mutation evidence checks. Hosted Terraform matrix CI run 36990206303 passed, native agent-setup CI passed in run 37286068987, final module verification passed in run 37286237657, and docs-only Azure-validation release CI passed in run 37305768318. A private IaC consumer deployed and read back the module on October 5, 2026, pinned to runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; sanitized facts are public, private inputs are not. These are instructions for the live run, not an executed transcript. Native profile selection and full rehearsal remain separate gates.

## Prepare the checkpoint

Martin operates; Haflidi checks evidence. In [feature-guide.md](feature-guide.md), H1-H4/S0 mean help probes; D means documented, not exercised. Follow [talk-track.md](talk-track.md) for the live 60-minute delivery: 00:00-03:00 intro, 03:00-55:00 planned content and live chapters, 55:00-58:00 protected slack, 58:00-60:00 close plus questions if time allows.

In the current CLI, use `/cwd` to confirm the public repository. Execute PowerShell blocks through the `!` shell escape in this same window. Each block is one shell invocation; shell variables don't carry into later CLI turns.

Start Copilot CLI from the public session repository folder or from one of its clean checkpoint worktrees. Do not start it from the coordinator/private folder. From the wrong folder, `/agent` only lists user-level agents plus Squad, without `terraform-coder`, `terraform-validator`, or `terraform-reviewer`.

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

Treat pinned TFLint as a hard preflight item. If it is missing or on the wrong version, install the approved build before the demo, then verify it:

```powershell
winget install --id TerraformLinters.tflint --version 0.64.0 --exact --source winget --accept-package-agreements --accept-source-agreements --silent
tflint --version
```

Stop here if `tflint --version` does not report 0.64.0. Do not spend C7 time installing or troubleshooting TFLint.

Wait for an approved qualification commit containing the module. From that checkpoint, create new sparse worktrees without resetting existing work. Copy public definitions, not histories, logs, or personal memory:

```powershell
$pin = (git rev-parse HEAD).Trim()
git cat-file -e "${pin}:terraform/modules/aks-automatic-corp/tests/contract.tftest.hcl"
if ($LASTEXITCODE) { throw 'The reviewed module checkpoint is not committed yet.' }
$take = Join-Path (Split-Path (Get-Location)) ('clean-run-' + [guid]::NewGuid().ToString('N'))
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
}
$pin | Set-Content "$take\evidence\checkpoint.txt"
git -C "$take\guided" ls-files -s -- 'terraform\modules\aks-automatic-corp' |
  Set-Content "$take\evidence\checkpoint-tree.txt"
$take
```

Review the checkpoint's public decision ledger before copying it; never substitute the coordinator's private `.squad`. Git sparse patterns use Git's slash syntax. Keep the printed take location private. Enter `/cwd` with the actual A, B, or guided path when instructed below.

Pre-stage a filesystem-only provider mirror and `offline\terraform.tfrc` beside the worktrees, following the module README. One online staging step populates the mirror: from the module directory, `terraform providers mirror -platform=windows_amd64 C:\terraform-offline\providers`. Then copy the README's `terraform.tfrc` to `$take\offline\`. Terraform subprocesses must be uncredentialed and network-restricted, separately from CLI/model access. Stop if isolation is unavailable. Never use cached Azure login, direct download fallback, or ordinary `terraform plan`.

## Quick troubleshooting

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
cd C:\git\session-repo   # your public repo clone or checkpoint worktree
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

**Pre-staged:** Docker Desktop running; required MCP servers already connected; fallback `c4-source` excerpt sanitized; one retry allowed, not a retry loop.

**Cut at 32:30 (3:00 into C4):** If MCP or Docker is not healthy, say the lookup is unavailable live, show the fallback excerpt, and do not pretend it succeeded.

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
- **0:30-1:00 (50:30-51:00):** open `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; the certificate warning is expected. Point at the pipeline flow, serving pod name, and speakers section.
- **1:00-2:10 (51:00-52:10):** say "gated pipeline PR → plan → human approval → apply" and state the 29/29 outside-in runtime checks.
- **2:10-3:00 (52:10-53:00):** restate the boundary. If the app is unreachable, use the offline screenshot plus apply runs 37771532872 and 37772290635 as fallback evidence.

## Protected slack | 55:00-58:00

Keep 55:00-58:00 for recovery only. Do not add a recap, new explanation, or extra Q&A. Start the close at 58:00.
