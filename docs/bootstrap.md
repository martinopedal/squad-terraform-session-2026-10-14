# Bootstrap a clean demo VM

Use this page when you want a repeatable setup pass before the live C0 chapter. The live talk still uses the shorter three-install path in [clean-machine-demo.md](clean-machine-demo.md). This guide is the fuller operator path with an idempotent script and a GitHub App checklist.

## What this bootstrap does

- Installs Git with WinGet if it is missing.
- Installs GitHub Copilot CLI with WinGet if it is missing.
- Installs Squad on Windows through npm by default with `@bradygaster/squad-cli`.
- Signs in to Copilot CLI through `copilot login`.
- Clones a target repository if it is not already present.
- Runs `squad init` only when `.squad\` is not already there.
- Prints the Git, Node, npm, Copilot CLI, and Squad versions.

Script path: [`scripts\bootstrap-demo-vm.ps1`](..\scripts\bootstrap-demo-vm.ps1)

## Verified safe checks in this repo

These checks were run safely on 2026-10-09:

```powershell
powershell -NoProfile -Command "$null = [System.Management.Automation.Language.Parser]::ParseFile('scripts\bootstrap-demo-vm.ps1', [ref]$null, [ref]$null)"

.\scripts\bootstrap-demo-vm.ps1 -WhatIf -SkipLogin -RepoPath "$HOME\demo\aks-module"
```

The real login and install steps remain interactive and machine-changing, so they were not replayed headlessly here.

## Windows steps

Open **PowerShell 7** in the VM and start with a dry run:

```powershell
Set-Location C:\git\squad-terraform-session-2026-10-14\public
.\scripts\bootstrap-demo-vm.ps1 -WhatIf -SkipLogin -RepoPath "$HOME\demo\aks-module"
```

Run the real bootstrap:

```powershell
Set-Location C:\git\squad-terraform-session-2026-10-14\public
.\scripts\bootstrap-demo-vm.ps1 -RepoPath "$HOME\demo\aks-module"
```

Notes:

- The default Windows path uses npm so the VM can install `@bradygaster/squad-cli` directly.
- If you want the same rehearsed binary path used in the current C0 slide, use `-SquadInstallSource Winget`.
- Use `-CopilotLoginMode DeviceCode` when browser callback flow is awkward through Bastion.

After the script finishes:

```powershell
Set-Location $HOME\demo\aks-module
copilot --agent squad
```

Paste the same small-team prompt used in [playbook.md](playbook.md), confirm the roster, then run:

```powershell
squad doctor
```

## macOS note

macOS was not re-run in this repo on 2026-10-09, but the pinned docs path remains:

```bash
brew install --cask bradygaster/squad/squad
```

Use the GitHub Copilot CLI install instructions from the product docs, then run `copilot login`, clone the target repository, `squad init`, and `copilot --agent squad`.

## GitHub App setup for the target repository

Use a private repository install only. Do not leave keys on the VM.

Recommended app name:

- `Squad Terraform Demo`

Recommended repository permissions:

- **Actions:** Read-only
- **Contents:** Read and write
- **Issues:** Read and write
- **Metadata:** Read-only
- **Pull requests:** Read and write

Recommended setup steps:

1. Create the app from a maintainer workstation. Keep app administration off the demo VM.
2. Set the app to **Only on this account**.
3. Install it on **Only select repositories**.
4. Select the one target repository for the demo.
5. Store the private key in your normal secret store or CI secret, never on the VM filesystem.
6. If the demo only needs local CLI work and `gh` auth, skip the app entirely.

## Related pages

- [README.md](..\README.md)
- [playbook.md](playbook.md)
- [clean-machine-demo.md](clean-machine-demo.md)
- [talk-track.md](talk-track.md)
