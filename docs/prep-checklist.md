# Haflidi prep checklist: live session Wed 14 Oct 2026, 10:00-11:00, Room 6

Primary host: clean Azure VM. Backup: Haflidi's laptop, prepared identically.
VM has Git, Copilot CLI and GitHub login pre-installed; C0 installs only Squad live.
Disclose: "Git and Copilot pre-installed; not a fully clean machine."
Tags: (source: file) = documented; UNKNOWN = needs Martin or no documented command.
All commands run in PowerShell 7.

## 1. Decisions to confirm with Martin

- [x] RESOLVED: checkpoint pin is `0abb202f34af385b7e0a34b1775643aa5b4871ed`, take `take-20261014` (source: demo-runbook.md "Create the disposable C1-C7 checkpoints"; short-talk-track.md Prepare once)
- [x] RESOLVED: layout is `C:\demo\session-repo`, `C:\demo\aks-automatic-demo-env`, `C:\demo\checkpoints\take-20261014` (source: demo-runbook.md "Create and verify the agreed VM layout"). Still unverified on the VM until the operator runs setup
- [ ] Who types on the VM during Martin's chapters. UNKNOWN (runbook C1 says Martin operates the worktrees, Haflidi leads; VM typist not stated)
- [x] RESOLVED: the demo URL stays in Sweden Central (`aks-online-demo.swedencentral...`), no new region (source: Haflidi, confirmed 2026-10-13)
- [x] Are the offline mirror and TFLint 0.64.0 already on the VM? Yes: both present. The mirror is built per take under `take\offline` (VM, 2026-10-13)
- [ ] `squad --version` is in the Essentials/versions list, but short-talk-track.md Prepare once starts Squad (`copilot --agent squad`) before C0 installs it, while C0 uses `winget install bradygaster.Squad`. Still conflicting: confirm with Martin whether Squad is pre-installed on the VM. UNKNOWN decision
- [ ] Switch-to-laptop-backup rule. UNKNOWN

## 2. VM base tools

- [ ] PowerShell 7: `$PSVersionTable.PSVersion` (source: short-talk-track.md C0)
- [x] Git and Copilot present: `git --version; copilot --version` (source: short-talk-track.md Essentials). Git 2.55.0, Copilot CLI 1.0.96 (VM, 2026-10-13)
- [x] Copilot signed in (pre-done per Haflidi; interactive `/login` is the documented route, source: short-talk-track.md C0) (VM, 2026-10-13)
- [ ] winget available (source: clean-machine-demo.md, "WinGet must already be" present)
- [x] TFLint 0.64.0 (source: demo-runbook.md Prepare the checkpoint) (VM, 2026-10-13):
  ```powershell
  winget install --id TerraformLinters.tflint --version 0.64.0 --exact --source winget --accept-package-agreements --accept-source-agreements --silent
  tflint --version
  ```
- [ ] STOP if `tflint --version` is not 0.64.0. Do not fix it during C7 (source: demo-runbook.md)
- [x] Terraform `>=1.14.8,<2.0`: no documented install command. Check with `terraform version` (source: README offline section). Terraform 1.16.5 (VM, 2026-10-13)
- [x] AzAPI provider: nothing to install by hand. Terraform must be installed (`>=1.14.8,<2.0`). The offline mirror comes from runbook block "Stage the filesystem-only mirror" (`terraform providers mirror -platform=windows_amd64`; public Registry access once, no Azure login). Result: `take-20261014\offline\providers` and `offline\terraform.tfrc` with no `direct` block (source: demo-runbook.md). AzAPI 2.12.0 mirror staged (VM, 2026-10-13)
- [ ] VM decision: no Docker Desktop on the VM (nested virtualization); the VM uses the remote Terraform MCP in the section below. Docker is for the laptop backup only (source: Haflidi). Laptop only: Docker Desktop installed and running. Install is opt-in: `.\scripts\bootstrap-demo-vm.ps1 -InstallDocker -SkipLogin` needs WSL 2 and licence review first (source: bootstrap.md)
- [ ] Laptop only: pull the pinned MCP image (source: demo-runbook.md):
  ```powershell
  docker pull hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5
  ```

### Optional: remote Terraform MCP (local-only, never pushed)

- [ ] The VM uses the Azure Container Apps endpoint (no Docker on the VM). The repo's pinned Docker image (`hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e...`) stays the setup for the laptop backup. If the endpoint fails on the VM, there is no local fallback there: continue without the Terraform MCP (Microsoft Learn still works) or switch to the laptop (source: Haflidi; endpoint verified on the VM 2026-10-13: connected, HTTP 200 with key, 403 without)
- [ ] What it is: an ACA app running the same pinned server image behind a Caddy sidecar that requires header `X-MCP-Key` (otherwise 403). No IP restriction, no Easy Auth, so a VM managed identity does not help. `ENABLE_TF_OPERATIONS=false`, no TFE credentials (registry lookups only) (source: Haflidi, verified 2026-10-13 on laptop)
- [ ] Local edit only, in the VM's A, B, guided worktrees (and session repo if used): in `terraform-coder.agent.md` and `terraform-reviewer.agent.md`, replace the `terraform:` block (`type: stdio`, `command: docker`, `args`) with `type: http`, `url: https://<aca-fqdn>/mcp`, `headers:` `X-MCP-Key: "$TFMCP_KEY"`. Keep the `tools:` line and everything else. `squad.agent.md` and `terraform-validator.agent.md` need no change. Never commit or push these edits (source: Haflidi, verified 2026-10-13 on laptop)
- [ ] Conflict: the edited worktrees show a dirty git status, which conflicts with the runbook's expected empty status. Decide with Martin. UNKNOWN: needs Martin sign-off because the profile was qualified with Docker
- [x] Set `TFMCP_KEY` in the VM user environment, without printing it or leaving it in shell history: `$k = Read-Host 'TFMCP_KEY' -AsSecureString`, then `[Environment]::SetEnvironmentVariable('TFMCP_KEY', [System.Net.NetworkCredential]::new('', $k).Password, 'User')`. Open a new terminal, then check with `$env:TFMCP_KEY.Length` (length only). Use User scope, not Machine. The value is stored unencrypted in the registry and ends up in the VM snapshot, so keep the snapshot private and never show the environment on screen. Never paste the value into chat or files (source: Haflidi). Set, length 43 (VM, 2026-10-13)
- [x] Verify: start `copilot --agent terraform-reviewer` in that folder; `/mcp` shows `terraform` connected with the tools. Laptop: connected with key set, 403 with key cleared, so the profile edit and env expansion work (source: Haflidi, verified 2026-10-13 on laptop; VM verified, `terraform` and `microsoft-learn` connected) (VM, 2026-10-13)
- [ ] Rate limits: 10 req/s global, 5 req/s per session (source: Haflidi)

## 3. Clones

- [ ] Both clones, create/verify block: run the first PowerShell block under "Create and verify the agreed VM layout" in demo-runbook.md (clones `session-repo` and `aks-automatic-demo-env` with `--branch main --single-branch`, verifies root, origin, head, status and three required files; never reset or force). Copy it from the file
- [ ] Fresh VM, no checkout yet, session repo only (source: short-talk-track.md "Prepare once"):
  ```powershell
  if (Test-Path 'C:\demo\session-repo') { throw 'Checkout exists: verify it instead of cloning over it.' }
  New-Item -ItemType Directory -Path 'C:\demo' -Force | Out-Null
  git clone https://github.com/martinopedal/squad-terraform-session-2026-10-14.git 'C:\demo\session-repo'
  if ($LASTEXITCODE -ne 0) { throw 'Clone failed; stop here.' }
  Set-Location 'C:\demo\session-repo'
  copilot --agent squad
  ```
- [ ] Origin guard: each VM clone's origin must match the runbook string exactly, including `.git` (`https://github.com/martinopedal/squad-terraform-session-2026-10-14.git`). If a clone lacks the suffix, run `git remote set-url origin <url>.git` before the preparation prompt. The consumer repo has the same guard (`https://github.com/martinopedal/aks-automatic-demo-env.git`, checked in the same runbook layout block, "Wrong source origin"); the session guard is also in the runbook C0/preparation block (source: demo-runbook.md)
- [x] Upstream module repo: do NOT pre-clone `terraform-azapi-aks-automatic` to `$HOME\demo\aks-module` (C0 clones it live, then `squad init`). Keep that path empty, with no `.squad` folder and no squad CLI there. Test GitHub reachability by cloning `martinopedal/terraform-azapi-aks-automatic` into a throwaway folder, then delete it. Optional backup copy outside the demo path (e.g. `C:\demo\backup\aks-module`) in case the network fails during C0. Path absent; throwaway clone worked and was deleted (VM, 2026-10-13)
- [ ] Never start Copilot from the private coordinator folder; existing checkouts are never overwritten (source: short-talk-track.md, demo-runbook.md)
- [ ] `Set-Location C:\demo\session-repo; git status --short` is clean (source: short-talk-track.md Essentials)
- [ ] Hosted checkout `C:\demo\hosted-target` only for optional Card A, by its operator from the approved private URL (source: demo-runbook.md). Not needed for core

## 4. Worktrees and offline mirror

- [ ] A/B checkpoint prerequisite: do not start C1 until preparation verified A and B at the same checkpoint with identical clean HEADs (source: short-talk-track.md C1). Do not start C1 if `contract.tftest.hcl` already contains `alternate_network_payload` (source: demo-runbook.md)
- [ ] Take `C:\demo\checkpoints\take-20261014` creates `A`, `B`, `guided`, `evidence`, later `offline`. If the take exists, STOP and choose a new approved take name everywhere; never reset or reuse (source: demo-runbook.md "Create the disposable C1-C7 checkpoints")
- [ ] Run that runbook block exactly (`$pin = '0abb202f34af385b7e0a34b1775643aa5b4871ed'`, sparse detached worktrees via `git worktree add --detach --no-checkout`, writes `evidence\checkpoint.txt` and `checkpoint-tree.txt`). Copy from the file, do not retype
- [ ] Expect three identical commit IDs and empty status per root. In each root confirm `/cwd`, all three profiles, and the contract test file (source: demo-runbook.md)
- [ ] Preferred route: paste the Squad preparation prompt from short-talk-track.md "Prepare once" (TUI, `/cwd` = `C:\demo\session-repo`, Squad selected). It creates/verifies the clones and A/B/guided/evidence, with no new helper script (source: short-talk-track.md). Inspect each command for narrow approval
- [ ] Mirror, runbook "Stage the filesystem-only mirror" (off-stage operator, needs public Registry only, no Azure login): from `$take\guided` it runs `terraform -chdir='terraform\modules\aks-automatic-corp' providers mirror -platform=windows_amd64 "$take\offline\providers"` and writes `$take\offline\terraform.tfrc` (`filesystem_mirror`, azapi include, no `direct`). Copy the block from the file; it refuses if `offline` exists
- [x] The short track says do NOT run that mirror download block in the Squad prompt: the operator copies the qualified Windows AzAPI 2.12.0 packages into `take\offline\providers`, and the prompt writes `offline\terraform.tfrc` (source: short-talk-track.md). So stage the mirror yourself beforehand; missing mirror/isolation = BLOCKED. Verify lock hashes (VM, 2026-10-13: AzAPI 2.12.0 staged; locked init succeeded)
- [ ] Terraform subprocesses uncredentialed and network-restricted. Stop if isolation is unavailable. No cached Azure login, no direct download, no ordinary `terraform plan` (source: demo-runbook.md)
- [ ] Hosted/native preparation links: hosted `C:\demo\hosted-target` recipe is demo-runbook.md "Card A"; native fixture prep is "Card B" plus `docs\fixtures\native-validation.sh` (source: short-talk-track.md optional extras, PREP). Both are optional, need their own GO, and are separate from core
- [ ] Offline commands, only for a full pre-check (source: README offline section; individually, stop on failure). Point the config at `$take\offline\terraform.tfrc`:
  ```powershell
  $env:TF_CLI_CONFIG_FILE = 'C:\demo\checkpoints\take-20261014\offline\terraform.tfrc'
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

- [x] From repo folder or a worktree (source: demo-runbook.md): `copilot --agent terraform-reviewer -p "Reply with exactly: READY"`; expect `READY` (VM, 2026-10-13)
- [x] Interactive `/agent`: terraform-coder, terraform-validator, terraform-reviewer all listed. If not: exit, cd to repo or worktree, restart (VM, 2026-10-13: Squad plus the three)
- [ ] Start with user MCP servers disabled (source: demo-runbook.md):
  ```powershell
  $off = (Get-Content "$HOME\.copilot\mcp-config.json" -Raw | ConvertFrom-Json).mcpServers.PSObject.Properties.Name |
    ForEach-Object { '--disable-mcp-server', $_ }
  copilot --disable-builtin-mcps @off
  ```
- [x] After selecting a profile, `/mcp` lists `microsoft-learn` and `terraform` as connected before the first prompt (VM, 2026-10-13, under terraform-reviewer)
- [ ] Save versions to `evidence\versions.txt`: `copilot --version`, `squad --version`, `terraform version`, `tflint --version`. Exact save command UNKNOWN; Squad may not be installed on the VM before C0 (see section 1)
- [ ] `.\scripts\Test-PresenterLaptop.ps1` from repo root (source: bootstrap.md). Optional `-OfflineMirrorRoot "$HOME\terraform-offline"`. Default mirror `C:\terraform-offline`. Read-only; nonzero exit = failed checks
- [ ] Expect checks 16 and 17 (published deck, companion) to fail until the deck is published (source: bootstrap.md list). Also checks Squad exactly 1.0.1, so on the VM it fails before C0
- [ ] About T-30, from the demo-env repo: `$env:AZURE_SUBSCRIPTION_ID_ONLINE = '<online subscription id>'` (never on screen) then `.\scripts\Test-DemoVm.ps1` (source: clean-machine-demo.md). It expects "clean: no git/copilot/squad", which fails on this VM (Git and Copilot pre-installed). UNKNOWN how to read that result; ask Martin
- [ ] If the VM is not clean, do NOT run `recreate-vm` without separately reviewed destructive reset approval (source: clean-machine-demo.md)
- [ ] VM script rules about AllUsers/SYSTEM: only for the CSE install path (`-AllUsers` through 64-bit PowerShell, SYSTEM context); not needed for presenter-user setup (source: clean-machine-demo.md, bootstrap.md)

## 6. Rehearsal

- [ ] Rehearse the Squad preparation prompt first (short-talk-track.md "Prepare once"), then confirm the A/B checkpoint prerequisite (section 4) before C1. Existing/dirty/mismatched take = STOP
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
- [ ] Paste the Flaaklypa roster prompt, now inline in short-talk-track.md C0 (copy from that file; the same text is in docs\prompt-pack.md "Hire the team")
- [ ] Human confirms roster; TUI `/exit`; shell `squad doctor` (docs expect `10 passed, 0 failed`, source: clean-machine-demo.md)
- [ ] Reset after test: delete `$HOME\demo`, then `winget uninstall --id bradygaster.Squad` (source: clean-machine-demo.md; its Git/Copilot uninstalls do NOT apply, they are pre-installed). Sign-out of GitHub in Edge is NOT wanted here
- [ ] C5 and C7 once in the guided worktree (commands in demo-runbook.md C5 and C7 sections; `/agent terraform-validator`, approve each command)
- [ ] C6 rehearsal: the guided session must be named `guided-clean-run` (`/rename guided-clean-run` at C2 start, source: demo-runbook.md C2). Then Scribe records the public decision under `.squad\decisions\inbox\` BEFORE `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`; ask it to cite the file (source: demo-runbook.md C6, short-talk-track.md C6). Keep unrelated sessions off screen; sanitized decision excerpt ready; offline fallback `c6-decision.md`
- [ ] Runbook has no section titled "VM demo cues"; C6 is the only such cue found, covered above. Confirm with Martin whether another cue list exists. UNKNOWN
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

- [ ] Repeat sections 2 to 6 on the laptop, same commit as the VM (including the origin `.git` check and the upstream module rule: not pre-cloned)
- [ ] Laptop: optional backup copy of the upstream module outside the demo path (e.g. `C:\demo\backup\aks-module`) for network failure during C0
- [ ] Laptop likely has Squad already: use a second clean user profile or uninstall (`winget uninstall --id bradygaster.Squad`), or skip C0 and show the result. UNKNOWN which
- [ ] `.\scripts\Test-PresenterLaptop.ps1` passes except unpublished-deck checks
- [ ] Leakage checklist (section 7) done on the laptop too; it is a corporate device, so mind browser profile and signed-in accounts

## 9. Snapshot and rehearsal

Order: pre-snapshot checks, snapshot, rehearse C0-C7 once, restore, post-restore check. Take the snapshot BEFORE rehearsing C0-C7.

- [ ] Pre-snapshot state, all must hold:
  - `TFMCP_KEY` set as a User environment variable, length 43 (check length only, never print it)
  - terraform 1.16.5, TFLint 0.64.0, Git and Copilot CLI present
  - squad CLI NOT installed (host prep prompt runs without the Squad CLI by design, confirmed by Haflidi)
  - `$HOME\demo\aks-module` absent
  - `C:\demo\checkpoints\take-20261014` has `A`, `B`, `guided`, `evidence`, `offline`
  - `terraform.tfrc` is `filesystem_mirror` only (no `direct`)
  - no `ARM_`, `AZURE_`, `TF_VAR_` or `TF_CLI_ARGS` environment variables
  - `git status` in `C:\demo\session-repo` shows only the two locally modified profiles (`terraform-coder`, `terraform-reviewer`, remote MCP edit, never pushed)
  - `gh` is not installed on the VM and is not needed (C0 clones public repos anonymously)
  - Copilot CLI is logged in
  - remote Terraform MCP (ACA) for the VM is known and agreed by Martin (confirmed by Haflidi); keep the endpoint up and do not rotate the key until after the session
  - throwaway clone of `terraform-azapi-aks-automatic` worked and was deleted
- [x] Under Squad, `/agent` shows Squad plus the three `terraform-*` project agents (VM, 2026-10-13)
- [ ] Under Squad, `/mcp` shows only the built-in GitHub server (expected). The `terraform` and `microsoft-learn` servers appear only under `terraform-coder` or `terraform-reviewer`
- [ ] Close all Copilot and PowerShell windows
- [x] Take the VM snapshot. Real name: `demo-ready-20261310-133943` (the suggested `pre-session-20261013` was not used). Taken 2026-10-13 13:43 UTC (15:43 CEST) from the VM OS disk; VM left deallocated afterwards (VM, 2026-10-13)
- [ ] The snapshot contains `TFMCP_KEY`: keep it private, never share it, rotate the key after the session
- [ ] Rehearsal: Haflidi runs the C0-C7 prompts once on the VM and records how long each chapter takes (table below, fill in the minutes). Takes are never reused, so a used take cannot be re-run. Then restore the snapshot and re-run the READY check (next item)

  | Chapter | Time taken |
  | --- | --- |
  | C0 | |
  | C1 | |
  | C2 | |
  | C3 | |
  | C4 | |
  | C5 | |
  | C6 | |
  | C7 | |
  | Total | |

- [ ] After restore, from `C:\demo\session-repo`: `copilot --agent terraform-reviewer -p "Reply with exactly: READY"`; expect `READY`
- [ ] The runbook wording "network-restricted" does not mean real network isolation in this demo; it only shows wrong parameters or changes. Network isolation is not a prep step here (runbook left unchanged)
- [ ] Open questions for Martin (none block the snapshot):
  - Who types on the VM during Martin's chapters?
  - Rule for switching to the laptop backup
  - C7 driver: the short sheet says Haflidi, `run-plan.md:90` says Martin drives the handoff

## 10. Day-of timeline

- [ ] T-60: VM reachable; remote Terraform MCP connected (`/mcp`, key set); laptop only: Docker running, image pulled; `tflint --version` 0.64.0; clones clean; take A/B/guided and `offline` mirror exist (UNKNOWN: exact T-60 items are not in the sources)
- [ ] T-30: `Test-DemoVm.ps1`, then `Connect-DemoVm.ps1` (Bastion RDP); notifications off, 125% scaling, PowerShell 7 tab open, terminal zoomed (source: clean-machine-demo.md)
- [ ] T-30: preflight `READY`, `/agent` three profiles; `/mcp` under Squad shows only the built-in GitHub server, and `microsoft-learn` and `terraform` appear connected only under `terraform-coder` or `terraform-reviewer`
- [ ] T-10: Copilot started from `C:\demo\session-repo` or worktree, `/cwd` confirms; no secrets in clipboard; leakage checklist reviewed. T-10 timing itself UNKNOWN
- [ ] 07:45 session clock: C0 cut line. Do not spend recovery on installs
