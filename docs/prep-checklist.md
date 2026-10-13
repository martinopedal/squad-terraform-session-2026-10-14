# Haflidi prep checklist: live session Wed 14 Oct 2026, 10:00-11:00, Room 6

Primary host: clean Azure VM. Backup: Haflidi's laptop, prepared identically.
VM has Git, Copilot CLI and GitHub login pre-installed; C0 installs only Squad live.
Disclose: "Git and Copilot pre-installed; not a fully clean machine."
Tags: (source: file) = documented; UNKNOWN = needs Martin or no documented command.
All commands run in PowerShell 7.

## 1. Decisions to confirm with Martin

- [ ] Which commit is the approved checkpoint (the `$pin`). UNKNOWN
- [ ] Who types on the VM during Martin's chapters. UNKNOWN
- [ ] Sweden Central or a new region for the demo URL. UNKNOWN
- [ ] Do `C:\demo\...` paths match Martin's setup (short-talk-track context)? UNKNOWN
- [ ] Are the offline mirror and TFLint 0.64.0 already on the VM? UNKNOWN
- [ ] Sheet Essentials runs `squad --version` before C0, but C0 installs Squad on the VM. Reorder or drop it (source: short-talk-track.md Essentials vs C0). UNKNOWN decision

## 2. VM base tools

- [ ] PowerShell 7: `$PSVersionTable.PSVersion` (source: short-talk-track.md C0)
- [ ] Git and Copilot present: `git --version; copilot --version` (source: short-talk-track.md Essentials)
- [ ] Copilot signed in (pre-done per Haflidi; interactive `/login` is the documented route, source: short-talk-track.md C0)
- [ ] winget available (source: clean-machine-demo.md, "WinGet must already be" present)
- [ ] TFLint 0.64.0 (source: demo-runbook.md Prepare the checkpoint):
  ```powershell
  winget install --id TerraformLinters.tflint --version 0.64.0 --exact --source winget --accept-package-agreements --accept-source-agreements --silent
  tflint --version
  ```
- [ ] STOP if `tflint --version` is not 0.64.0. Do not fix it during C7 (source: demo-runbook.md)
- [ ] Terraform `>=1.14.8,<2.0`: no documented install command. Check with `terraform version` (source: README offline section)
- [ ] Docker Desktop installed and running. Install is opt-in: `.\scripts\bootstrap-demo-vm.ps1 -InstallDocker -SkipLogin` needs WSL 2 and licence review first (source: bootstrap.md)
- [ ] Pull the pinned MCP image (source: demo-runbook.md):
  ```powershell
  docker pull hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5
  ```

## 3. Clones

- [ ] `C:\demo\session-repo`: clone of martinopedal/squad-terraform-session-2026-10-14 at the committed checkpoint. No documented clone command; checkout the approved commit. UNKNOWN commit
- [ ] `C:\demo\aks-automatic-demo-env`: clone of martinopedal/aks-automatic-demo-env (public, evidence cue, read-only). No documented clone command
- [ ] `Set-Location C:\demo\session-repo; git status --short` is clean (source: short-talk-track.md Essentials)

## 4. Worktrees and offline mirror

- [ ] From `C:\demo\session-repo`, run the take/worktree A, B, guided block exactly as in demo-runbook.md "Prepare the checkpoint" (starts `$pin = (git rev-parse HEAD).Trim()`, ends with `$take`). It is long; do not retype, copy from the file
- [ ] Confirm it did not throw; note the printed `$take` path (keep private)
- [ ] One online staging step, from the module directory (source: demo-runbook.md):
  ```powershell
  terraform providers mirror -platform=windows_amd64 C:\terraform-offline\providers
  ```
- [ ] Create `terraform.tfrc` per README (`C:\terraform-offline\terraform.tfrc`, `filesystem_mirror` for `registry.terraform.io/azure/azapi`, NO `direct` block) (source: module README)
- [ ] Copy that `terraform.tfrc` to `$take\offline\`. No documented copy command
- [ ] Terraform subprocesses uncredentialed and network-restricted. Stop if isolation is unavailable. No cached Azure login, no direct download, no ordinary `terraform plan` (source: demo-runbook.md)
- [ ] Offline commands, only for a full pre-check (source: README offline section; individually, stop on failure):
  ```powershell
  $env:TF_CLI_CONFIG_FILE = 'C:\terraform-offline\terraform.tfrc'
  $env:CHECKPOINT_DISABLE = '1'
  $env:TF_IN_AUTOMATION = '1'
  terraform version
  tflint --version
  terraform fmt -check -recursive
  terraform init -backend=false -input=false -lockfile=readonly
  terraform validate -no-color
  tflint --config=.tflint.hcl --no-color
  terraform test -no-color
  ```

## 5. Preflight

- [ ] From repo folder or a worktree (source: demo-runbook.md): `copilot --agent terraform-reviewer -p "Reply with exactly: READY"`; expect `READY`
- [ ] Interactive `/agent`: terraform-coder, terraform-validator, terraform-reviewer all listed. If not: exit, cd to repo or worktree, restart
- [ ] Start with user MCP servers disabled (source: demo-runbook.md):
  ```powershell
  $off = (Get-Content "$HOME\.copilot\mcp-config.json" -Raw | ConvertFrom-Json).mcpServers.PSObject.Properties.Name |
    ForEach-Object { '--disable-mcp-server', $_ }
  copilot --disable-builtin-mcps @off
  ```
- [ ] After selecting a profile, `/mcp` lists `microsoft-learn` and `terraform` as connected before the first prompt
- [ ] Save versions to `evidence\versions.txt`: `copilot --version`, `squad --version`, `terraform version`, `tflint --version`. Exact save command UNKNOWN; note Squad is not installed on the VM before C0
- [ ] `.\scripts\Test-PresenterLaptop.ps1` from repo root (source: bootstrap.md). Optional `-OfflineMirrorRoot "$HOME\terraform-offline"`. Default mirror `C:\terraform-offline`. Read-only; nonzero exit = failed checks
- [ ] Expect checks 16 and 17 (published deck, companion) to fail until the deck is published (source: bootstrap.md list). Also checks Squad exactly 1.0.1, so on the VM it fails before C0
- [ ] About T-30, from the demo-env repo: `$env:AZURE_SUBSCRIPTION_ID_ONLINE = '<online subscription id>'` (never on screen) then `.\scripts\Test-DemoVm.ps1` (source: clean-machine-demo.md). It expects "clean: no git/copilot/squad", which fails on this VM (Git and Copilot pre-installed). UNKNOWN how to read that result; ask Martin
- [ ] If the VM is not clean, do NOT run `recreate-vm` without separately reviewed destructive reset approval (source: clean-machine-demo.md)
- [ ] VM script rules about AllUsers/SYSTEM: only for the CSE install path (`-AllUsers` through 64-bit PowerShell, SYSTEM context); not needed for presenter-user setup (source: clean-machine-demo.md, bootstrap.md)

## 6. Rehearsal

- [ ] C0 install, Squad only (source: short-talk-track.md; the Git/Copilot lines stay out on this VM). The full block, for reference:
  ```powershell
  $wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
  winget install --id bradygaster.Squad @wg
  $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
  git --version; copilot --version; squad --version
  ```
- [ ] Clone upstream module and init:
  ```powershell
  git clone https://github.com/martinopedal/terraform-azapi-aks-automatic.git $HOME\demo\aks-module
  Set-Location $HOME\demo\aks-module
  squad init
  git status --short
  copilot --agent squad
  ```
- [ ] Paste the Flaaklypa roster prompt (docs\prompt-pack.md "Hire the team"; copy from that file)
- [ ] Human confirms roster; TUI `/exit`; shell `squad doctor` (docs expect `10 passed, 0 failed`, source: clean-machine-demo.md)
- [ ] Reset after test: delete `$HOME\demo`, then `winget uninstall --id bradygaster.Squad` (source: clean-machine-demo.md; its Git/Copilot uninstalls do NOT apply, they are pre-installed). Sign-out of GitHub in Edge is NOT wanted here
- [ ] C5 and C7 once in the guided worktree (commands in demo-runbook.md C5 and C7 sections; `/agent terraform-validator`, approve each command)
- [ ] Confirm the original hash is restored after C5 (check in the C5 log block, source: demo-runbook.md)
- [ ] Switch rule: if C0 is not done by 07:45 (cut line), show fallback evidence and move on (source: clean-machine-demo.md, short-talk-track.md). Switch to laptop backup rule: UNKNOWN, ask Martin

## 7. Leakage checklist

- [ ] Only the intended GitHub account signed in
- [ ] No `az login`; no cached Azure credentials
- [ ] No corporate browser profile
- [ ] Neutral prompt, hostname, username
- [ ] Shell history cleared. No documented command
- [ ] Notifications off; display scaling 125%; font size 16+; Windows Terminal PowerShell 7 profile (source: clean-machine-demo.md)
- [ ] Clipboard redirection off. No documented command; no secrets in clipboard
- [ ] Never show subscription or resource IDs
- [ ] Certificate warning on the demo page is expected (explicit TLS bypass noted in demo-runbook.md)
- [ ] No secrets or state; no blanket approval; no live plan/apply/import (source: short-talk-track.md)
- [ ] Never push from the VM (source: clean-machine-demo.md)

## 8. Laptop backup

- [ ] Repeat sections 2 to 6 on the laptop, same commit as the VM
- [ ] Laptop likely has Squad already: use a second clean user profile or uninstall (`winget uninstall --id bradygaster.Squad`), or skip C0 and show the result. UNKNOWN which
- [ ] `.\scripts\Test-PresenterLaptop.ps1` passes except unpublished-deck checks
- [ ] Leakage checklist (section 7) done on the laptop too; it is a corporate device, so mind browser profile and signed-in accounts

## 9. Day-of timeline

- [ ] T-60: VM reachable; Docker running; image pulled; `tflint --version` 0.64.0; clones clean; worktrees exist (UNKNOWN: exact T-60 items are not in the sources)
- [ ] T-30: `Test-DemoVm.ps1`, then `Connect-DemoVm.ps1` (Bastion RDP); notifications off, 125% scaling, PowerShell 7 tab open, terminal zoomed (source: clean-machine-demo.md)
- [ ] T-30: preflight `READY`, `/agent` three profiles, `/mcp` two servers
- [ ] T-10: Copilot started from `C:\demo\session-repo` or worktree, `/cwd` confirms; no secrets in clipboard; leakage checklist reviewed. T-10 timing itself UNKNOWN
- [ ] 07:45 session clock: C0 cut line. Do not spend recovery on installs
