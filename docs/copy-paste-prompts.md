# Copy-paste prompts, C0 to C7

Slash commands go in the Copilot TUI, never PowerShell.

## C0 (Haflidi to start)

Where: PowerShell 7 for the install block.

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

Where: PowerShell 7 for the scaffold block.

```powershell
git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git $HOME\demo\aks-module
Set-Location $HOME\demo\aks-module
squad init
git status --short
```

Where: PowerShell 7, then TUI with the Squad agent.

```powershell
copilot --agent squad
```

```text
We maintain a reusable Terraform module for AKS Automatic on azapi that deploys into an
existing Azure landing zone. Work is Terraform module code, terraform test contract tests,
and consumer documentation. Propose a small team.
```

Where: TUI, then PowerShell 7.

```text
/exit
```

```powershell
squad doctor
```

## C1 (Martin drives, Haflidi compares)

Where: PowerShell 7, one terminal per worktree, then TUI with the Squad agent.

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\A'
copilot --agent squad
```

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\B'
copilot --agent squad
```

Where: TUI in A, then repeat in B with `/rename C1-B`.

```text
/new
/agent
/model
/plan
/rename C1-A
```

```text
Plan only: add alternate_network_payload to the existing module contract tests.
Use pod 172.21.0.0/16, service 10.241.0.0/16, and DNS 10.241.0.10.
Assert propagation into the requested body while preserving the private API.
Don't edit files or deploy. Identify affected files, one writer, and checks.
```

## C2 (Martin)

Where: PowerShell 7, then TUI with the Squad agent.

```powershell
Set-Location 'C:\demo\checkpoints\take-20261014\guided'
copilot --agent squad
```

Where: TUI in guided.

```text
/new
/rename guided-clean-run
/agent
/instructions
/plan
```

```text
@terraform\modules\aks-automatic-corp\main.tf
@terraform\modules\aks-automatic-corp\variables.tf
@terraform\modules\aks-automatic-corp\tests\contract.tftest.hcl
This is prepared, qualified code. Plan the C1 regression test and its README
explanation. Keep all eight inputs, six outputs, and the AzAPI resource intact.
Plan a separately labeled enablePrivateCluster mutation and repair.
No implementation, Azure lookup, apply, dependency upgrade, or state operation.
```

```text
Revise: "Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign."
```

```text
/session plan
```

## C3 (Martin)

Where: TUI, Squad agent first, then terraform-coder.

```text
/agent squad
/tasks
/agent list
/mcp
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

## C4 (Martin)

Where: TUI with the Squad agent.

```text
/agent squad
/skills info test-discipline
/mcp
```

```text
Invoke test-discipline now. Identify which existing contract assertions must
remain unchanged during the mutation. Through the configured Microsoft Learn
MCP, perform only a read-only search/fetch for AKS Automatic private/custom
network requirements. Cite the source/version relevant to private API access
and hosted-system subnets. Don't contact an Azure account or change providers.
```

```text
/permissions
```

## C5 (Haflidi)

Where: TUI in the same guided window with the validator agent. Run the PowerShell block via `!`. Rerun it with `$phase` set to `seeded-failure`, then `repaired`.

```text
/agent terraform-validator
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

Where: TUI with the coder agent, labeled DELIBERATE LAB MUTATION.

```text
/agent terraform-coder
```

```text
Native terraform-coder: in this disposable worktree only, change
body.properties.apiServerAccessProfile.enablePrivateCluster from true to false.
Change nothing else. Keep the tests, mocks, provider, and permissions unchanged.
```

Where: TUI, after the seeded-failure rerun.

```text
Ask the coder to restore only that field
```

```text
/diff
```

## C6 (Haflidi)

Where: TUI with the Squad agent.

```text
/agent squad
```

```text
Scribe: record the public-only decision under .squad\decisions\inbox\ for later
merge into .squad\decisions.md. Include private API, caller-owned provider/backend,
network regression, labeled mutation/restoration, exact checks and evidence
limits. No private targets, histories, credentials or full conversations.
```

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

## C7 (Haflidi)

Where: TUI with the validator agent. Run the PowerShell block via `!` in the same isolated guided shell, approving each command.

```text
/agent terraform-validator
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

Where: TUI, then the reviewer in a new context.

```text
/diff
/new
/agent terraform-reviewer
```
