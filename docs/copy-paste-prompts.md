# Copy-paste prompts, Essentials and C0 to C7

Source of truth: short-talk-track.md. Slash commands go in the Copilot TUI, never PowerShell.

## Essentials

Where: PowerShell 7, only after preparation passes.

```powershell
Set-Location 'C:\demo\session-repo'
copilot --agent squad
```

Where: TUI.

```text
/cwd
/agent
/instructions
/permissions
```

## C0

Where: PowerShell 7, install block.

```powershell
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
# New tools are on PATH for new shells; refresh this one instead of opening another window.
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
git --version; copilot --version; squad --version
```

Where: TUI, after starting `copilot`.

```text
/login
/exit
```

Where: PowerShell 7, scaffold block.

```powershell
git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git C:\demo\aks-module
Set-Location C:\demo\aks-module
squad init
git status --short
```

Where: PowerShell 7, then TUI with the Squad agent (roster step).

```powershell
copilot --agent squad
```

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

Where: TUI, then PowerShell 7.

```text
/exit
```

```powershell
squad doctor
```

## C1

Where: PowerShell 7, once in each verified A and B root, then TUI with the Squad agent in Plan.

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\A'
copilot --agent squad --plan
```

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\B'
copilot --agent squad --plan
```

Where: TUI in A, then repeat in B with `/rename C1-B` and the same model.

```text
/cwd
/model
/rename C1-A
```

```text
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
```

## C2

Where: PowerShell 7, guided root, then TUI with the Squad agent in Plan.

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\guided'
copilot --agent squad --plan
```

Where: TUI. Already in a CLI? Use `/agent squad`, then native `/plan`.

```text
/cwd
/rename guided-clean-run
```

```text
Squad: plan only the alternate_network_payload regression in
terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl.
Use pod 172.21.0.0/16, service 10.241.0.0/16, DNS 10.241.0.10; four separate
requested-body/private-API assertions, existing AzAPI mocks and command=plan.
Coordinate read-only file/invariant/check planning, one future writer.
No edits/commands/implementation/Azure/deploy.
```

Where: TUI, after inspecting the actual plan.

```text
Revise only: keep the coder step limited to that test file, not README or redesign.
Unchanged assertions/offline checks first; separate labeled later
failure-and-repair step: enablePrivateCluster mutation/restoration.
Show criteria; no implementation.
```

Where: TUI, human sends the approval.

```text
I approve repository code only: The coder step may add the agreed four-assert
regression in tests\contract.tftest.hcl. The later failure-and-repair step may
separately change then restore only
body.properties.apiServerAccessProfile.enablePrivateCluster in main.tf,
in guided only. Preserve other source/mocks/locks. Do not implement yet.
No Azure/deploy/install/state/upgrade/publish/blanket or automatic approval.
```

Press Shift+Tab until the mode indicator visibly says Interactive, not Plan/Autopilot, before coder/commands. `/exit` exits the entire CLI.

## C3

Where: TUI, same guided CLI, now Interactive, Squad selected, then terraform-coder.

```text
/agent squad
```

```text
Squad: assign independent read-only source research and review preparation.
One coder owns the test; return actual task starts and accountable handoffs.
Do not run a concurrent writer on the shared test file.
```

```text
/agent terraform-coder
```

```text
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
```

## C4

Where: TUI, guided, Squad agent for step 1, then the reviewer agent for step 2 (read-only; check `/mcp` lists `microsoft-learn` connected). The MCP servers live on the profiles, Squad only coordinates.

```text
/agent squad
```

```text
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation.
```

```text
/agent terraform-reviewer
/mcp
```

```text
Through the configured Microsoft Learn MCP, perform only a read-only search/fetch
for AKS Automatic private/custom network requirements. Cite the source/version
relevant to private API access and hosted-system subnets. Don't contact an Azure
account or change providers.
```

## C5

Order: 1 validator (paste the prompt, `before` phase), 2 coder (mutation), 3 validator (`The coder step is done. Run seeded-failure.`), 4 coder (restore, `/diff`), 5 validator (`Restoration is done. Run repaired.`). The validator has no edit tool. The validator prompt refers to the PowerShell block below; it runs that block via `!` in the same guided CLI window, once per phase, with `$phase` edited each time (`before`, then `seeded-failure`, then `repaired`). Never rerun `before`; never run `seeded-failure` before the mutation.

```text
/agent terraform-validator
```

```text
Use docs/prompt-pack.md's complete C5 block: before, labeled coder-only mutation,
seeded-failure, restoration, repaired. Narrowly approve each offline command;
require intended private_automatic_contract failure/original hash. Stop on error.
No weakened checks/provider/lock/Azure/retry.
```

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

Where: TUI, coder agent, labeled DELIBERATE LAB MUTATION.

```text
/agent terraform-coder
```

```text
Native terraform-coder: in this disposable worktree only, change
body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
```

Where: TUI, after the seeded-failure rerun. Step 4, coder agent.

```text
Restore only enablePrivateCluster to true. Change nothing else.
```

```text
/diff
```

## C6

Where: TUI, guided, Squad agent.

```text
/agent squad
```

```text
Scribe: record the public-only decision under .squad\decisions\inbox\ for later
merge into .squad\decisions.md. Include private API, caller-owned provider/backend,
network regression, labeled mutation/restoration, exact checks and evidence
limits. No private targets, histories, credentials or full conversations.
```

Where: TUI, after the record is saved.

```text
/new
/resume guided-clean-run
/cwd
/context
/usage
```

```text
Read the saved decision; cite its file and the constraints for the next change.
```

## C7

Where: TUI, guided, validator agent. The validator prompt refers to the PowerShell Check block below; run it via `!` in the same isolated guided shell, approving each command.

```text
/agent terraform-validator
```

```text
Use the whole C7 block in docs/prompt-pack.md: local Check, qualified mirror,
logs/exits/module+caller tests. Narrowly approve commands, stop at first failure.
Return diff/revision/files/results; no Azure/upgrades.
```

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

Where: TUI, then the reviewer in a new context, then back to Squad for human acceptance.

```text
/diff
/new
/agent terraform-reviewer
```

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

```text
/agent squad
```

## Technical evidence (optional, at the end)

Where: TUI.

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
