# Bootstrap a clean demo VM

Run [`scripts\bootstrap-demo-vm.ps1`](..\scripts\bootstrap-demo-vm.ps1) manually during session preparation. You choose when to run this command file and handle its prompts. It does not run at startup or conduct a rehearsal for you. The live C0 chapter still uses the shorter path in [clean-machine-demo.md](clean-machine-demo.md).

Target: a Windows 11 x64 demo VM with PowerShell 7 and WinGet available. Use a GitHub account with a Copilot plan and permission to use both the Copilot app and CLI. Organization policy for the desktop app is separate from CLI policy. Review installer/UAC prompts; keep native Copilot trust, tool, and plan approvals.

## What this bootstrap does

- Installs Git with WinGet if it is missing.
- Installs the **GitHub Copilot desktop app**, distinct from GitHub Desktop, Microsoft 365 Copilot, and VS Code extensions.
- Installs **Visual Studio Code** if it is missing.
- Installs GitHub Copilot CLI with WinGet if it is missing.
- Installs Squad **1.0.1** through the verified WinGet package.
- Signs in to Copilot CLI through `copilot login`.
- Clones a target repository if it is not already present.
- Runs `squad init` only when `.squad\` is not already there.
- Prints Git, VS Code, Copilot CLI, and Squad versions; Node/npm are reported when installed.
- Stops immediately on unexpected native exit codes, with an error such as `copilot failed with exit code 42.` It does not print **Next steps** after failure.

App launch and sign-in remain manual. The script neither opens a desktop app nor starts an agent session.

## Four products and validated install commands

The configured WinGet catalog was queried read-only on 2026-10-09. These are four separate products:

| Product | Exact WinGet identity | Catalog version observed |
| --- | --- | --- |
| GitHub Copilot desktop app | `GitHub.CopilotApp` | 1.1.28, Windows x64 installer |
| Squad | `bradygaster.Squad` | 1.0.1 available; session pin |
| Visual Studio Code | `Microsoft.VisualStudioCode` | 1.140.0 |
| GitHub Copilot CLI | `GitHub.Copilot` | v1.0.94 |

For a manual command-by-command setup, run each line separately and stop on any unexpected nonzero `$LASTEXITCODE`:

```powershell
winget install --id GitHub.CopilotApp --exact --source winget
winget install --id bradygaster.Squad --version 1.0.1 --exact --source winget
winget install --id Microsoft.VisualStudioCode --exact --source winget
winget install --id GitHub.Copilot --exact --source winget
```

The script checks exits for you. Git is the minimal shared prerequisite; no Node/npm installation is added. WinGet's already-current status (`0x8A15002B`) is accepted; other install errors stop the script. An installed Squad version other than 1.0.1 requires manual resolution, not an automatic downgrade.

Read-only `npm view @bradygaster/squad-cli@1.0.1 version` returned E404 on 2026-10-09. The legacy `-SquadInstallSource Npm` option now stops with an actionable error before any changes; it must not silently install npm's different release line.

## Verified safe checks in this repo

Controlled runtime checks execute the **actual script** in child PowerShell processes with isolated tool mocks that launch real native executables. They cover successful setup, exit-42 failures for every install/login/clone/init/version path, both login modes, existing tools/repository/Squad, expected nonzero detection, version mismatch, and `-WhatIf`. No real install, sign-in, repository clone, or Squad initialization is performed by these mocks.

From `presentation\`, run:

```powershell
node --test tests\bootstrap-demo-vm.test.mjs
```

From the repository root, check syntax separately:

```powershell
$tokens = $null
$errors = $null
$null = [System.Management.Automation.Language.Parser]::ParseFile(
    (Join-Path $PWD 'scripts\bootstrap-demo-vm.ps1'), [ref]$tokens, [ref]$errors)
if ($errors.Count) { throw ($errors | Out-String) }
```

Catalog resolution and mocked command execution do not prove installer success or interactive login on a clean VM. The presenter still needs to run the file on a clean VM and complete app onboarding and manual device-code login before stage. That rehearsal remains a separate evidence gate; no successful rehearsal is claimed here.

## Windows steps

Open **PowerShell 7** in the VM and start with a dry run:

```powershell
Set-Location C:\src\squad-terraform-session-2026-10-14
.\scripts\bootstrap-demo-vm.ps1 -WhatIf -SkipLogin -RepoPath "$HOME\demo\aks-module"
```

Run the real bootstrap:

```powershell
Set-Location C:\src\squad-terraform-session-2026-10-14
.\scripts\bootstrap-demo-vm.ps1 -RepoPath "$HOME\demo\aks-module"
```

Notes:

- The default Windows path uses the rehearsed WinGet Squad 1.0.1 package.
- Do not use `-SquadInstallSource Npm` for this session; that registry does not publish the rehearsed 1.0.1 CLI package.
- Use `-CopilotLoginMode DeviceCode` when browser callback flow is awkward through Bastion.

After a successful run, open **GitHub Copilot** from the Start menu, choose **Sign in to GitHub**, and complete onboarding yourself. Add the cloned repository via **Projects → Add project → Local folder or repository**. Follow the [official app quickstart](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app); the [official download page](https://github.com/features/ai/github-app) is an alternative installation route.

Open VS Code and the CLI yourself:

```powershell
Set-Location $HOME\demo\aks-module
code .
copilot --agent squad
```

Paste the same small-team prompt used in [playbook.md](playbook.md), confirm the roster, then run:

```powershell
squad doctor
```

### Manual clean-VM qualification checklist

1. Run `-WhatIf -SkipLogin` first. Expect only previewed changes and read-only version/package queries; no install, login, clone, or init.
2. Run the command file manually; complete installer and CLI login prompts. Use `-CopilotLoginMode DeviceCode` if needed; never record or publish a device code.
3. Expect a version summary, `SquadDirectory: True`, and **Next steps** only after successful setup. Check `git --version`, `code --version`, `copilot --version`, and `squad --version` (1.0.1). Verify desktop installation with `winget list --id GitHub.CopilotApp --exact --source winget`.
4. Open the desktop app and VS Code, sign in manually, and confirm the cloned folder opens. VS Code Copilot extensions are optional additional context, not a substitute for the desktop app.
5. Run `copilot --agent squad`, confirm the roster, and run `squad doctor`. Do not approve a deployment, blanket tool permissions, or automatic trust.
6. Rerun with `-SkipLogin` at the same path. Expect installed-tool/app, clone, and `.squad` skips. If any command fails, stop and resolve it before stage; no **Next steps** should follow an unexpected native failure.

Record actual versions, exits, and whether this operator rehearsal passed. The catalog's CLI version above does not replace the full deck's explicitly dated Copilot CLI 1.0.93 qualification.

## Manual live-session laptop preflight

After setup, run the tracked [`scripts\Test-PresenterLaptop.ps1`](..\scripts\Test-PresenterLaptop.ps1)
from the repository root. This is a separate, read-only operator check, not an installer,
automatic startup task, login, or completed rehearsal. OBS and recordings are not prerequisites.

```powershell
.\scripts\Test-PresenterLaptop.ps1
$preflightExit = $LASTEXITCODE
if ($preflightExit -ne 0) { throw "Presenter preflight failed: $preflightExit check(s)." }
```

The normal inventory is **18 checks**:

1. Copilot CLI in the existing `1.0.x` session line; no new patch minimum is imposed.
2. Squad exactly `1.0.1`.
3. VS Code CLI available.
4. Installed GitHub Copilot desktop app, queried with the exact `GitHub.CopilotApp` identity. A catalog listing is not installation evidence.
5. Parsed stable Terraform version `>= 1.14.8` and `< 2.0`.
6. TFLint `0.64.0`.
7. Docker daemon responding.
8. Expected Terraform MCP image digest present locally.
9. AzAPI `2.12.0` Windows AMD64 provider archive in the offline mirror.
10. Offline `terraform.tfrc` present without a `direct` installation block.
11. No inherited `ARM_`, non-`AZURE_CORE_` `AZURE_`, `TF_VAR_`, or `TF_CLI_ARGS` credentials/configuration; only matching variable names are printed.
12. GitHub CLI authenticated.
13. Microsoft Learn MCP initialization responds.
14. Configured hosted Terraform MCP rejects a request without its key.
15. The same hosted MCP accepts the operator's configured key.
16. Published full presentation reachable.
17. Published companion reachable with exactly five expected slide-section IDs, not counts of repeated data attributes.
18. At least 10 GiB free on drive C.

The mirror defaults to `C:\terraform-offline`. To use another already-prepared location:

```powershell
.\scripts\Test-PresenterLaptop.ps1 -OfflineMirrorRoot "$HOME\terraform-offline"
```

Keep the provider archive under `providers\registry.terraform.io\azure\azapi\` and the
configuration at the mirror root. This command does not download or copy providers.

Only a deliberate operator run reads `$HOME\.copilot\mcp-config.json` for the
`terraform-hosted` server and sends its configured headers to that endpoint.
Configure it privately, verify the endpoint yourself, and never publish the file, keys,
raw authentication output, or private provider caches. Unreadable, invalid, or absent
hosted configuration produces an explicit configuration failure instead of the two
network checks: **17 emitted checks, not a readiness pass**. Exceptions do not print
configuration content or header values.

The summary exit code is the number of failed checks. Continue only after **all checks
PASS** and exit `0`; fix any failure without weakening the gates. Installed products,
mock results, and successful network checks still do not establish app onboarding,
native agent selection, Azure authorization, or a completed dress rehearsal.
The October 5, 2026 **16/16** preflight result is historical only; it does not attest
to this revised inventory. The October 13 dress rehearsal/reset remains a separate
future operator/date gate.

### Safe preflight regression tests

From the repository root, run the standard-library test file:

```powershell
pwsh -NoLogo -NoProfile -File .\scripts\Test-PresenterLaptop.Tests.ps1
```

Windows PowerShell 5.1 is also supported:

```powershell
powershell -NoLogo -NoProfile -File .\scripts\Test-PresenterLaptop.Tests.ps1
```

These tests execute the actual tracked preflight in isolated child processes.
Product commands, filesystem inventory, and all HTTP responses are mocked; configuration
reads are restricted to a generated fixture with an obviously dummy header and an
`.invalid` endpoint. The fixture lives under `scripts\` and is removed afterward.
Three separate harmless `cmd.exe` checks exercise the production version helper's
actual native success, nonzero-exit, and missing-command behavior. They are not product
installation or authentication evidence.

The tests cover missing products, installed-app versus catalog detection, Terraform
`1.14.7` failure/`1.14.8` and `1.16.4` success/`2.0` failure, incorrect or missing short
decks, alternate and missing mirror paths, OBS absence, safe configuration failures,
and aggregate nonzero exits. No real install, login, credential read, MCP authentication,
or rehearsal is performed.

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

- Actions: Read-only
- Contents: Read and write
- Issues: Read and write
- Metadata: Read-only
- Pull requests: Read and write

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
