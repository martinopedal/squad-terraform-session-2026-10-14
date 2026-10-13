# C0: From zero to a squad (clean Windows 11 demo VM)

C0 is a 3-minute live chapter (deck slide `demo-c0`, 05:30-08:30, Haflidi leads). It shows the from-zero install of Copilot CLI and Squad on a machine that has never had them, which a presenter laptop cannot show.

The historical C0 flow and VM snapshot below were checked on 2026-10-07 against
the deployed VM and a throwaway clone. The later automated dependency setup is
validated with controlled mocks, not a fresh-VM installation. Re-run the
preflight before the live demo because package versions move.

That is historical setup evidence, not a completed current clean-VM/manual-login
rehearsal. October 12 one laptop 18/18 does not close those gates. See [current
readiness](run-plan.md#october-12-readiness-evidence) and [the repo map](repositories.md).
VM deployment/access belongs to the live `martinopedal/aks-automatic-demo-env`
consumer, not this session clone. Hosted Squad issue-to-PR and Copilot/Squad
driving native ACA MicroVMs are separate [product demo flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes);
the VM is only a presenter host. Native separate Online five-object deployment/current
operator access/base 375-second probe are independently verified, not AKS/hosted
Jobs. Corrected 26.768-second host Copilot/Squad fixture engineering is
independently accepted and runtime-ready. Human preflight/rehearsal,
second-presenter sign-in and any selected Terraform variant remain separate
gates. Fresh hosted Apps/Jobs E2E remains BLOCKED: owned fork/target source is
accepted, but private publisher qualification, owner-native Terraform, immutable
image, authentication and actual README bot PR remain unproved; none of this proves a
current clean-VM install/manual-login rehearsal.
Owner-native hosted source preparation is under review; executable delivery
remains held, not deploy-on-merge or only missing operator receipts.
For the fuller operator setup with `-WhatIf`, repo clone, `copilot login`, `squad init`, and a GitHub App checklist, see [bootstrap.md](bootstrap.md) and [`scripts\bootstrap-demo-vm.ps1`](..\scripts\bootstrap-demo-vm.ps1). Keep the live chapter on the shorter flow below.

## Automated dependency setup (preparation, not a clean C0 take)

Use the **existing** bootstrap for the complete host toolchain: Git, VS Code,
Copilot CLI and desktop app, Azure CLI, GitHub CLI, Terraform, Node.js LTS/npm,
PowerShell 7, Squad 1.0.1 and the official ACA CLI. WinGet must already be
available for default presenter mode; Windows PowerShell 5.1 can start the
setup. Explicit machine mode uses pinned native payloads without WinGet.
From a staged checkout:

```powershell
Set-Location C:\src\squad-terraform-session-2026-10-14
# Preview safely even when the predicted tools are not installed.
.\scripts\bootstrap-demo-vm.ps1 -WhatIf -SkipLogin
# Default: install/check, supported status-aware interactive sign-in, clone/init.
.\scripts\bootstrap-demo-vm.ps1
# Unattended credential-free variant: absolutely no auth calls.
.\scripts\bootstrap-demo-vm.ps1 -SkipLogin
# Packages only; no clone, repository check or Squad/profile initialization.
.\scripts\bootstrap-demo-vm.ps1 -SkipLogin -SkipRepository
# Optional local Terraform MCP backend, only after operator-prepared WSL 2.
.\scripts\bootstrap-demo-vm.ps1 -InstallDocker -SkipLogin
if (-not $? -or $LASTEXITCODE -ne 0) { throw "Bootstrap stopped: $LASTEXITCODE" }
```

Choose **one** real-run variant. Repeated runs preserve the same host, VM,
OS/data disks, existing repository and Squad state; they do not recreate or
reset anything. `-RepoUrl`/`-RepoPath` remain configurable. Restart installer
codes stop visibly; no reboot is requested. Docker/WSL are optional for the
local Terraform MCP lane, not silently installed/enabled: missing WSL 2 blocks
`-InstallDocker`, and VM virtualization, admin and Docker license approval
remain operator responsibilities. See [the optional setup gates](bootstrap.md#optional-local-terraform-mcp-docker-and-wsl).

Desktop sign-in/onboarding, Copilot `/user`/entitlement, native permissions,
explicit-target `aca doctor`, presenter preflight and rehearsal still need
human qualification. GitHub CLI auth availability is not Copilot readiness.
If needed, use `copilot login --device-code` manually; never copy credentials.
The version inventory and controlled tests are not a fresh-VM execution claim.
Preparing this bundle also makes the machine unsuitable for claiming the
three tools were absent during C0; disclose the checkpoint instead of resetting
the current VM under this setup task.
For the separately reviewed existing-VM CSE lane, stage the same script plus
`scripts\bootstrap-demo-vm.packages.json`, verify both immutable source hashes,
then use explicit **`-AllUsers`** through 64-bit PowerShell. Preview only:

```powershell
.\scripts\bootstrap-demo-vm.ps1 -AllUsers -WhatIf
```

That mode enforces zero auth/no repository or roster initialization, checks
fixed Program Files roots/pinned versions, preserves MACHINE PATH entries and
writes a fresh machine-core receipt only after successful verification.
Desktop app installation/onboarding, optional extensions and all user sign-ins
remain **deferred per user**, not machine core PASS. See [the CSE invocation,
pins and receipt contract](bootstrap.md#existing-vm-custom-script-extension-contract-allusers).
No live CSE deployment or both-presenter qualification is claimed by source
tests. October 13: [consumer PR21](https://github.com/martinopedal/aks-automatic-demo-env/pull/21)
is source-accepted, still awaiting Haflidi/Online human review and execution
approval. The VM is deallocated; its currently attached OS disk differs from
the earlier receipt. Preserve both disks, never swap back/recreate/delete either.
Refresh the exact current binding/baseline and runnable SYSTEM context before
plan/apply. Owner payload acceptance and harmless SYSTEM transport are not prior
installation; the first install may start without an old receipt but must produce
a fresh success afterward. Machine bootstrap is not installed; sign-in remains
deferred per user. No power/reset action is authorized by this guide.

## What the machine is

| Item | Value |
|---|---|
| VM | Windows 11 25H2, Entra-joined, no public IP, deployed by the gated `deploy-demo-vm.yml` pipeline in the demo-env repo |
| Access | Azure Bastion Standard only; RDP via `scripts\Connect-DemoVm.ps1` from the demo-env repo. Martin uses Entra sign-in with MFA; Haflidi uses a local VM account because B2B guests cannot use Entra VM sign-in. |
| Egress | NAT Gateway; GitHub, WinGet, and npm reachable; inbound denied |
| Preinstalled | WinGet, Windows Terminal 1.24, PowerShell 7.6.6 (pipeline-installed, hash- and signature-verified; Copilot CLI needs PowerShell 6+) |
| Not installed | Git, Copilot CLI, Squad, Node (Squad's standalone bundle carries its own runtime; `squad doctor` passes without system Node) |
| Auto-shutdown | 19:00 W. Europe |

Verified package versions by 2026-10-08: `Git.Git` 2.55.0.5, `GitHub.Copilot` 1.0.93 at validation; read whatever `copilot --version` reports during rehearsal, `bradygaster.Squad` 1.0.1, `Microsoft.PowerShell` 7.6.6.0.

## Preflight (T-30 minutes)

From the demo-env repository on the operator machine:

```powershell
$env:AZURE_SUBSCRIPTION_ID_ONLINE = '<online subscription id>'   # never on screen
.\scripts\Test-DemoVm.ps1           # expect all checks pass, including "clean: no git/copilot/squad"
.\scripts\Connect-DemoVm.ps1        # opens the Bastion RDP session
```

If the VM is not clean, stop and obtain the separately reviewed destructive
reset approval before `deploy-demo-vm.yml` action `recreate-vm`. A documentation
task, healthy AKS metadata or proposed MicroVM placement does not grant it.
Verify backups/scope and the `online` gate, then inspect the actual verification
job. The historical 15-20 minute reset estimate needs timing in rehearsal.

On the VM: close notifications, set display scaling to 125%, open **Windows Terminal**, and pick the **PowerShell** (7) profile from the dropdown, not Windows PowerShell. Font size 16 or larger. Hide the Bastion toolbar.

## The live chapter (target 3:00)

Pre-staged before session: VM recreated or verified clean; Bastion already connected; PowerShell 7 tab open; package source agreements accepted by the install flags; terminal zoom set; no secrets in clipboard.

| Clip time | Show | Command |
|---|---|---|
| 00:00 | Clean machine | `$PSVersionTable.PSVersion; Get-Command git, copilot, squad -ErrorAction SilentlyContinue` (prints only the version) |
| 00:30 | Three installs | see block 1 (cut the waits, overlay "install time compressed") |
| 01:15 | Sign in | `copilot`, then `/login`, device flow in Edge, then `/exit` |
| 01:50 | Scaffold | block 2: clone the public module repo, `squad init` |
| 02:15 / 07:45 cut | Hire | `copilot --agent squad`, describe the project, confirm the proposed roster |
| 02:45 | Verify | `squad doctor` (expect `10 passed, 0 failed`) |

Cut at 07:45 (2:15 into the slot): if installs or login are not complete, state the live stall, show fallback evidence, and move to `s05-parallel`. Do not spend the protected recovery window on installing tools.

Block 1, installs:

```powershell
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
# New tools are on PATH for new shells; refresh this one instead of opening another window.
$env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
git --version; copilot --version; squad --version
```

Block 2, scaffold (after `/login` and `/exit`):

```powershell
git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git C:\demo\aks-module
Set-Location C:\demo\aks-module
squad init
git status --short
```

`squad init` is a terminal command, not a prompt. It is non-interactive (about 2 seconds), idempotent, and writes `.squad\` with the built-ins (Scribe, Ralph, Rai, Fact Checker), `.github\agents\squad.agent.md`, Squad skills, four `squad-*` workflows, and `.mcp.json` for the `squad_state` MCP server. It does not hire the team. If `.vscode\settings.json` would distract from the live-demo diff, prefer `squad init --no-vscode-default`; plain `squad init` remains valid.

Hire prompt (paste after `copilot --agent squad`):

```text
We maintain a reusable Terraform module for AKS Automatic on azapi that deploys into an
existing Azure landing zone. Work is Terraform module code, terraform test contract tests,
and consumer documentation. Propose a small team.
```

Init Mode proposes a roster and asks for confirmation. Nothing is written until you choose **Yes, hire this team**. Then `/exit` and run `squad doctor`.

Never push from the VM. The clone is a local demo copy; the four generated workflows must not reach the public repository.

## Reset between takes

- Fast reset (same VM): delete `C:\demo`, then `winget uninstall --id bradygaster.Squad`, `GitHub.Copilot`, `Git.Git`; sign out of GitHub in Edge. Use this only for rehearsal.
- Clean reset (for rehearsal, delivery, or fallback capture): `deploy-demo-vm.yml` action `recreate-vm` in the demo-env repo. It replaces the VM, OS disk, and VM-scoped extensions and re-checks the clean state.

## Offline fallback (if the live chapter stalls)

1. `scripts\Connect-DemoVm.ps1` from the demo-env repo on the presenter machine (pre-connected at T-15).
2. Run block 1 with the waits visible and narrate over them, or skip to block 2 on a VM that already has the tools installed from rehearsal (say so).
3. Keep to 3 minutes. If install stalls past 60 seconds, say "we will use the fallback evidence for this step" and move to slide `s05-parallel`.

## Never show

The admin password (ephemeral, workflow-generated), subscription and tenant IDs, Bastion resource IDs, the device-flow code after it is used, or any private repository. Guests (B2B) cannot use Entra sign-in to VMs; Haflidi uses a local account provisioned by the operator script and handed over out of band. Never put that password in chat or files.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `copilot` asks for PowerShell 6+ | Windows PowerShell 5.1 tab | Open the PowerShell 7 profile |
| `squad` not recognized after install | Current shell PATH is stale | Run the PATH refresh line from block 1 |
| `squad.ps1 cannot be loaded` | Execution policy in a 5.1 tab | Use PowerShell 7 (`RemoteSigned`), or run `squad.exe` directly |
| WinGet source agreement prompt | First WinGet use for the profile | The `--accept-*` flags in block 1 handle it |
| VM stuck "Updating" after recreate | Landing-zone policy is adding AMA, ChangeTracking, and other extensions | Wait; the pipeline verification waits for a terminal state |
| Bastion RDP fails | CLI `bastion` extension missing or MFA token expired | `az extension add -n bastion`; rerun `Connect-DemoVm.ps1` |
