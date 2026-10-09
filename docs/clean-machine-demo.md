# C0: From zero to a squad (clean Windows 11 demo VM)

C0 is a 3-minute live chapter (deck slide `demo-c0`, 05:30-08:30, Haflidi leads). It shows the from-zero install of Copilot CLI and Squad on a machine that has never had them, which a presenter laptop cannot show. Optional recordings/screenshots are fallback evidence only.

Everything below was checked on 2026-10-07 against the deployed VM and a throwaway clone. Re-run the preflight before the live demo because package versions move.

For the fuller operator setup with `-WhatIf`, repo clone, `copilot login`, `squad init`, and a GitHub App checklist, see [bootstrap.md](bootstrap.md) and [`scripts\bootstrap-demo-vm.ps1`](..\scripts\bootstrap-demo-vm.ps1). Keep the live chapter on the shorter flow below.

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

If `Test-DemoVm.ps1` reports the VM is not clean (an earlier take installed tools), reset it first: run `deploy-demo-vm.yml` in the demo-env repo with action `recreate-vm`, approve the `online` gate, and wait for the verification job (estimate; time it in rehearsal 1: about 15-20 minutes including policy-driven extensions).

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
git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git $HOME\demo\aks-module
Set-Location $HOME\demo\aks-module
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

- Fast reset (same VM): delete `$HOME\demo`, then `winget uninstall --id bradygaster.Squad`, `GitHub.Copilot`, `Git.Git`; sign out of GitHub in Edge. Use this only for rehearsal.
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
