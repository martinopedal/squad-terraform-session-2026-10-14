# Bootstrap a clean demo VM

Run [`scripts\bootstrap-demo-vm.ps1`](..\scripts\bootstrap-demo-vm.ps1) manually during session preparation. You choose when to run this command file and handle its prompts. It does not run at startup or conduct a rehearsal for you. The live C0 chapter still uses the shorter path in [clean-machine-demo.md](clean-machine-demo.md).

Target: a Windows 11 x64 demo VM with WinGet (Microsoft App Installer) available.
The script can start in Windows PowerShell 5.1 and installs PowerShell 7 when
missing; use the PowerShell 7 profile for Copilot afterward. Use a GitHub account
with a Copilot plan and permission to use both the Copilot app and CLI.
Organization policy for the desktop app is separate from CLI policy. Review
installer/UAC prompts; keep native Copilot trust, tool, and plan approvals.

Audience: presenters preparing the host, not approving deployment. [The repo
map](repositories.md) separates session setup/teaching profiles, canonical
public modules, the live AKS consumer and Haflidi's hosted implementation/target.
Host setup is not either [product demo flow](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes)
running. Hosted issue-to-PR and host Copilot/Squad driving native MicroVM work
have independent preflight/trigger/handoff/evidence. Optional in-MicroVM
Copilot/Squad requires separate runtime/auth consent.

October 12: one laptop 18/18 and helper 46 scenarios + 3 native checks per
PowerShell engine, not second-host interactive checks, clean VM/manual login or
rehearsal. Actual local MXC startup failed before command, exit 1; policy blocked,
no bypass/global change. ACA host token auth passed, but wrong-target doctor
cannot qualify Corp/Online. Separate native Online five-object deployment/current
operator access/base 375-second probe are independently verified, not AKS or
hosted Jobs. Corrected 26.768-second host Copilot/Squad fixture engineering is
independently accepted and runtime-ready. Human preflight/rehearsal,
second-presenter sign-in and any selected Terraform variant remain separate
gates. Fresh hosted Apps/Jobs E2E remains BLOCKED: owned fork/target source is
accepted, but private publisher qualification, owner-native Terraform, immutable
image, authentication and actual README bot PR remain unproved. These native checks do not
prove bootstrap installation or live SYSTEM/CSE execution.
See [the progress matrix](sandboxing.md#october-12-progress-and-next-actions).
Owner-native hosted source preparation is under review; executable delivery
remains held, not deploy-on-merge or only missing operator receipts.

October 13 VM hold: [demo-env PR21](https://github.com/martinopedal/aks-automatic-demo-env/pull/21)
is independently source-accepted and awaiting Haflidi/Online human review and
execution approval, not deployed. Its D8s_v5 (8 vCPU/32 GiB), in-place Premium SSD
and AllUsers SYSTEM bootstrap proposal must preserve the exact currently attached
disk. Fresh read-back found the VM deallocated and its OS-disk attachment different
from the earlier receipt. Preserve both disks: never swap back, recreate or delete
either. Refresh the current binding/baseline and runnable SYSTEM context before
any plan/apply. Sparse metrics do not prove a CPU/RAM bottleneck; HDD responsiveness
is only a candidate, not sustained causality.
The current creation-semantic precondition is met. Accepted source already
sequences IaC deallocate -> VM update -> disk update -> start -> CSE; no missing
start implementation or imperative power workaround. If SYSTEM owner evidence
is absent, a separately gated harmless SYSTEM preflight may be reviewed; it is
not deployed or permission to start the VM here.

## What this bootstrap does

- Installs/checks Git, Visual Studio Code, GitHub Copilot CLI and desktop app,
  Azure CLI, GitHub CLI, Terraform, Node.js LTS including npm, PowerShell 7,
  and Squad **1.0.1**. Node/npm support the presentation tests/build and integrations.
- Installs the ACA sandbox CLI from Microsoft's official Windows installer,
  which verifies the downloaded binary's release SHA-256, in presenter mode.
- With explicit `-AllUsers`, uses pinned native MSI/EXE/ZIP payloads instead
  of WinGet. It verifies SHA-256 before execution and checks fixed Program
  Files executable paths and exact CLI versions. LocalSYSTEM uses this mode.
- Checks supported GitHub, Azure and ACA authentication before interactive
  login. Reuses GitHub CLI authentication for Copilot where available; this
  does not prove Copilot entitlement or the selected UI account.
- With `-SkipLogin`, makes **zero authentication calls**, including status
  checks. Installation and public repository setup need no copied credentials.
- With `-SkipRepository` (alias `-PackageOnly`), also skips cloning, repository
  checks and Squad init. This is a credential-free **package-only** contract
  for a supported presenter context, not SYSTEM/AllUsers certification.
- Clones a target repository if it is not already present.
- Runs `squad init` only when neither `.squad\` nor an existing Squad agent
  profile is present. Existing state, source URL/path choices and repositories
  are not upgraded, reset, replaced or reinitialized.
- Prints every required CLI version, desktop-app inventory, and explicit
  authentication, optional Docker/WSL and restart limitations.
- Stops immediately on unexpected native exit codes, with an error such as `copilot failed with exit code 42.` It does not print **Next steps** after failure.
- Preserves the current VM and OS/data disks. It never recreates a VM, enables
  Windows features, reboots, changes network/agent policy or copies credentials.

App launch and sign-in remain manual. The script neither opens a desktop app nor
starts an agent session. Existing tools are checked, not silently upgraded.
An installed tool with a broken CLI/version response stops setup.

## Required bundle and verified official sources

Exact IDs were rechecked read-only on October 12, 2026 against
[Microsoft's WinGet manifests](https://github.com/microsoft/winget-pkgs/tree/master/manifests).
In default presenter mode, only Squad is version-pinned; other missing tools
use the current stable catalog package. `-AllUsers` pins **every** payload and
tool version in the sibling [machine manifest](../scripts/bootstrap-demo-vm.packages.json).
Record actual installed versions during rehearsal.

| Product | Exact WinGet identity | Purpose |
| --- | --- | --- |
| Git | `Git.Git` | Public source clone |
| Visual Studio Code | `Microsoft.VisualStudioCode` | Native editor |
| GitHub Copilot CLI | `GitHub.Copilot` | Native CLI agent |
| GitHub Copilot desktop app | `GitHub.CopilotApp` | Separate desktop surface, not GitHub Desktop or Microsoft 365 Copilot |
| Azure CLI | `Microsoft.AzureCLI` | Azure/ACA authentication and operator CLI |
| GitHub CLI | `GitHub.cli` | GitHub operations and supported Copilot auth fallback |
| Terraform | `Hashicorp.Terraform` | Native Terraform toolchain |
| Node.js LTS and npm | `OpenJS.NodeJS.LTS` | Presentation build/tests and integrations |
| PowerShell 7 | `Microsoft.PowerShell` | Copilot's Windows shell prerequisite |
| Squad | `bradygaster.Squad` | Exact session pin **1.0.1** |

ACA is not a guessed WinGet package. Its official Windows install path is
`irm https://aka.ms/aca-cli-install-ps | iex`, resolving to
[Microsoft's ACA installer](https://github.com/microsoft/azure-container-apps/blob/main/aca-cli/preview/install.ps1).
The existing bootstrap wraps that installer with `ShouldProcess`, download
failure checks and isolated scratch cleanup; do not run both installers.
this same install path is also used inside sandboxes and containers for agent-driven self-installs.

VS Code Copilot extensions are optional in the current demo and are not installed.
Bicep is not a dependency of the tracked Terraform quickstart (no tracked Bicep
source); a separately approved future Bicep sandbox lane must prepare its own
`az bicep` dependency, not change this core bundle silently.

WinGet's already-current status (`0x8A15002B`) is accepted only with a usable
installed command/package afterward. MSI restart codes `3010`/`1641` and
WinGet's restart-required/restart-reported HRESULTs stop setup, print the exact
code and propagate it to the caller. No authentication, clone or init follows.
Check `$LASTEXITCODE`; obtain approval for any restart and rerun afterward.
An installed Squad version other than 1.0.1 requires manual resolution, not an
automatic downgrade or upgrade.

Read-only `npm view @bradygaster/squad-cli@1.0.1 version` returned E404 on 2026-10-09. The legacy `-SquadInstallSource Npm` option now stops with an actionable error before any changes; it must not silently install npm's different release line.

## Verified safe checks in this repo

Controlled runtime checks execute the **actual script** in child PowerShell 7
and Windows PowerShell 5.1 processes with isolated native mocks and a fixture
home directory. They cover a missing core bundle, missing individual tools,
session-only PATH preservation, ACA download/installer failures and cleanup,
native command failures, auth status/rechecks, both Copilot login modes,
zero-auth `-SkipLogin`, dry-run without even WinGet, existing repository/Squad,
restart propagation and explicit Docker/WSL gates. Mock clone staging is
removed after failure; real repository/state is never touched. No real
installation, sign-in, cloud call, repository clone or Squad init is performed.
The full suite also covers the exact AllUsers branch: clean and existing machine
roots, enforced zero auth/repository calls, user-profile false-green rejection,
hash-before-execution for every payload, native installer/version/download
failures, reboot propagation/cleanup, protected directory and MACHINE PATH
read-back gates, receipt hashes, and ZIP traversal/ADS/symlink rejection.
Filesystem writes, installers, ACL/registry operations and HTTP calls are
bounded to disposable project fixtures or mocked; no actual host install runs.

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

Open an existing PowerShell terminal in the VM and start with a dry run:

```powershell
Set-Location C:\src\squad-terraform-session-2026-10-14
.\scripts\bootstrap-demo-vm.ps1 -WhatIf -SkipLogin -RepoPath "$HOME\demo\aks-module"
```

Run the real bootstrap:

```powershell
Set-Location C:\src\squad-terraform-session-2026-10-14
.\scripts\bootstrap-demo-vm.ps1 -RepoPath "$HOME\demo\aks-module"
```

For credential-free unattended setup (subject to the VM's installer/UAC policy):

```powershell
.\scripts\bootstrap-demo-vm.ps1 -SkipLogin -RepoPath "$HOME\demo\aks-module"
if (-not $? -or $LASTEXITCODE -ne 0) { throw "Bootstrap stopped: $LASTEXITCODE" }
```

For packages only, without repository/profile initialization:

```powershell
.\scripts\bootstrap-demo-vm.ps1 -SkipLogin -SkipRepository
```

`-WhatIf` does not require Git, Node, Azure CLI, ACA or the predicted installers
to exist. It previews side effects without creating directories, downloading,
installing, authenticating, cloning, initializing or changing PATH. A previewed
tool is reported as missing/unverified, not successfully installed.
The real run merges machine/user/ACA paths while retaining session-only additions.

Notes:

- The default Windows path uses the rehearsed WinGet Squad 1.0.1 package.
- Do not use `-SquadInstallSource Npm` for this session; that registry does not publish the rehearsed 1.0.1 CLI package.
- Use `-CopilotLoginMode DeviceCode` when browser callback flow is awkward through Bastion.
- Without `-SkipLogin`, the script calls `copilot login --web-flow` (or
  `--device-code`) only when no authenticated GitHub CLI session is available,
  then checks/signs in to GitHub, Azure and ACA as needed. There is no invented
  standalone Copilot status command and no credential/config read.
- [GitHub documents automatic GitHub CLI token fallback](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/authenticate-copilot-cli#authenticating-with-github-cli).
  Higher-priority stored credentials or environment tokens can select another
  account. Check `/user` in Copilot manually; if fallback does not work, run
  `copilot login --web-flow` or `copilot login --device-code` yourself.
- GitHub auth availability is not a Copilot entitlement/UI readiness PASS.
  Desktop onboarding remains separate. Never record device codes or copy auth caches.

### Optional local Terraform MCP: Docker and WSL

The native Terraform MCP lane requires a running Docker engine; basic CLI,
hosted documentation MCP and ACA CLI installation do not. Docker Desktop is
therefore opt-in through the verified `Docker.DockerDesktop` package:

```powershell
.\scripts\bootstrap-demo-vm.ps1 -InstallDocker -SkipLogin -WhatIf
# Only after separately preparing WSL 2 and reviewing Docker licensing:
.\scripts\bootstrap-demo-vm.ps1 -InstallDocker -SkipLogin
```

The real optional run requires enabled WSL/VirtualMachinePlatform features,
WSL **2.1.5+** and a successful `wsl --status`. It blocks before installation
if those prerequisites are missing. It never runs `wsl --install`/`--update`,
enables features, requests a reboot, modifies virtualization/network policy,
starts Docker or pulls the MCP image. Azure VM nested virtualization and
[Docker Business/VM licensing requirements](https://docs.docker.com/desktop/setup/install/windows-install/)
need independent operator verification. Installer/UAC consent stays human;
the script overrides the catalog's `--accept-license` flag so GUI license
acceptance remains manual. After starting Docker Desktop and accepting the
app terms, follow the pinned MCP-image preflight in [CONTRIBUTING.md](../CONTRIBUTING.md).

### ACA install versus target readiness

Check the local CLI with `aca --version`. After a `-SkipLogin` install, use
status-aware interactive sign-in, not copied credentials:

```powershell
az account show -o none 2>$null
if ($LASTEXITCODE -ne 0) { az login }
aca auth status *> $null
if ($LASTEXITCODE -ne 0) { aca auth login }
# Only with independently reviewed explicit target values:
aca doctor --subscription '<approved-subscription>' `
  --resource-group '<approved-resource-group>' `
  --sandbox-group '<approved-sandbox-group>' --region '<approved-region>'
```

Compare the doctor's printed target with the approved target. Even a green
doctor on a different cached target is not target qualification. The bootstrap
does not set an Azure subscription, configure/create a sandbox group, grant
roles or claim MicroVM access.

### Existing-VM Custom Script Extension contract: AllUsers

Windows Custom Script Extension runs as **LocalSYSTEM**, not either presenter.
The existing script now has an explicit native `-AllUsers` adapter; default
presenter mode remains fail-closed under SYSTEM. Machine mode **never invokes
WinGet**, registers user MSIX, installs under the SYSTEM profile, authenticates,
clones, initializes a roster/repository, enables features or installs Docker.
It enforces package-only/zero-auth behavior even if login/repository switches
were omitted. No credentials or user caches are copied.

Stage **both** `bootstrap-demo-vm.ps1` and sibling
`bootstrap-demo-vm.packages.json` from the same reviewed immutable source.
The consumer must verify each staged file's separately pinned SHA-256. The
approved 64-bit CSE invocation is:

```powershell
& "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe" `
  -NoLogo -NoProfile -NonInteractive -File .\bootstrap-demo-vm.ps1 -AllUsers
```

The CSE consumer must launch **64-bit** PowerShell, using the Sysnative route
if its caller is 32-bit. An unapproved effective execution policy, non-elevated
token or WOW64 process blocks setup; the script does not request elevation or
change policy. For safe source preview only:

```powershell
.\scripts\bootstrap-demo-vm.ps1 -AllUsers -WhatIf
```

That preview works without WinGet or installed product CLIs, performs no
download/native command/directory/PATH/receipt/auth changes and does not claim
verified versions.

The fixed October 12 native x64 bundle is:

| Core dependency | Pinned native version | Verified payload |
| --- | --- | --- |
| PowerShell | MSI 7.6.6.0 / CLI 7.6.6 | Microsoft MSI, not per-user MSIX |
| Git | 2.55.0.5 / CLI 2.55.0.windows.5 | Git for Windows machine EXE |
| VS Code | 1.141.0 | Microsoft system EXE |
| Copilot CLI | 1.0.95 | GitHub portable ZIP |
| Azure CLI | 2.91.0 | Microsoft x64 MSI |
| GitHub CLI | 2.102.0 | GitHub x64 MSI |
| Terraform | 1.16.5 | HashiCorp Windows AMD64 ZIP |
| Node LTS / npm | 24.20.0 / 11.19.0 | Node.js x64 MSI; bundled npm checked too |
| Squad | **1.0.1** | Official ZIP; preserves its nested executable path |
| ACA | 1.0.0-preview.4 | Official release ZIP and pinned Windows SHA-256 |

Every payload URL, SHA-256, source reference, argument and expected executable
is in the small static manifest. Machine mode downloads no mutable `latest`
installer; ACA uses the fixed release ZIP/digest observed in the official
installer's release pin, avoiding its unconditional user-PATH write.
`aca-cli` is an internal release identifier, **not** a claimed WinGet package.

Native MSI uses quiet/no-restart/AllUsers options. Inno uses documented
administrative/very-silent/no-restart flags, returns `3010` when a restart is
required, and does not force-close/restart existing applications. PowerShell's
MSI does not enable remoting or newly opt into Microsoft Update. Download and
hash errors identify the package and URL; installers/versions identify the
package and exit code. Unexpected codes stop setup; `3010`/`1641` propagate
without the script requesting a restart.

Portable packages live under `Program Files\DemoBootstrap\<package-id>`;
MSI/EXE tools use their fixed native Program Files locations. Existing matching
paths/versions skip downloads. Wrong versions, incomplete/unowned directories,
reparse points or unsafe bootstrap directory permissions stop rather than
overwrite existing state. ZIP entries are validated before extraction.
Validated shared tool directories precede old MACHINE PATH shadows while all
other existing machine entries remain; session/user/SYSTEM-profile PATH
additions are not copied into machine configuration. Cleanup removes only the
new, owned protected scratch directory and staged receipt file.

Success requires **exit 0 plus a fresh**
`C:\ProgramData\DemoBootstrap\machine-bootstrap.json`. Its exact fields are:
`SchemaVersion`, `Mode` (`AllUsers`), `Core` (`pass`), `Architecture`,
`VerifiedAtUtc`, `RunId`, `ScriptSha256`, `ManifestSha256`, `Packages`,
`MachinePath`, `Authentication`, `Repository`, `DeferredPerUser`, `Reboot`
and `Readiness`. Each of the 11 tool rows has `Package`, `Tool`, `Version`,
`PinnedVersion`, `Path` and `Result`. The separate IaC consumer must check
freshness/run ID, exact staged hashes and complete expected rows; an old receipt
never turns a nonzero run into success.

**Deferred per user, not machine core PASS:** Copilot desktop app
installation/onboarding, optional VS Code Copilot extensions/sign-in, Copilot
`/user`/entitlement, GitHub/Azure/ACA sign-in and reviewed explicit-target doctor.
After a real approved run, both humans need fresh Windows sign-in sessions and
independent command-path/version checks; existing terminals can retain stale
PATH. Use the normal presenter bootstrap with `-SkipRepository` after logon
when the separate desktop installation/sign-in steps are wanted.

Controlled source/mocked validation is not live CSE or both-presenter evidence.
The demo-env IaC owner retains immutable binding, execution and receipt
qualification; Haflidi's approval remains required before future VM apply.
The existing VM and both disks stay unchanged by this source task. Actual owner
attestations `system_payload_accepted` and `upgrade.bootstrap.system_accepted`
mean acceptance of the exact reviewed payload, not prior installation. A genuine
harmless LocalSYSTEM transport check is still required. The launcher allows an
absent prior receipt, then requires a fresh successful receipt after first install;
no fabricated acceptance or ordinary CI substitute. Bootstrap is not installed.
No deployment, size/disk change, power operation or execution approval is implied.

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

1. Run `-WhatIf -SkipLogin` first. Expect only previewed changes and read-only version checks; no install, download, login, clone, init or PATH change.
2. Run the command file manually; complete installer and CLI login prompts. Use `-CopilotLoginMode DeviceCode` if needed; never record or publish a device code.
3. Expect the complete version inventory, `SquadDirectory: True`, and **Next steps** only after successful setup. Check Git, editor, Copilot, Squad (1.0.1), Azure CLI, GitHub CLI, Terraform, Node/npm, PowerShell 7 and ACA. Verify desktop installation with `winget list --id GitHub.CopilotApp --exact --source winget`. Inventory does not close the separate presenter preflight, offline mirror/TFLint, UI, MCP or rehearsal gates.
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
