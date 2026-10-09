# NIC 2026 playbook: Copilot CLI + Squad for Terraform

Session: **Copilot CLI + Squad for Terraform**, October 14, 2026, Martin Opedal and Haflidi Fridthjofsson.

Use this as a copy-paste rehearsal script. Results are **repeatable enough for rehearsal**. The prompts and oracles are designed to make fresh runs converge often enough to demonstrate the workflow. They do not promise identical model text or diffs.

Verification tags in this file:

- **Verified 2026-10-08** means the command was executed in the playbook validation run or the B2 smoke run.
- **Needs interactive confirmation** means the command opens the Copilot CLI TUI or a gated Azure workflow and cannot honestly be proved headlessly here.
- **Not run** means intentionally not executed because it installs software, overwrites a prepared repo, or changes Azure.

## 1. Prerequisites

1. Windows 11 with PowerShell 7. Install or verify the tools.

```powershell
$wg = '--exact', '--source', 'winget', '--accept-package-agreements', '--accept-source-agreements', '--silent'
winget install --id Git.Git @wg
winget install --id GitHub.Copilot @wg
winget install --id bradygaster.Squad @wg
winget install --id TerraformLinters.tflint --version 0.64.0 @wg
```

Expected result: Git, Copilot CLI, Squad, and pinned TFLint `0.64.0` are on `PATH` in a new shell. **Not run 2026-10-08:** the laptop already had the tools; the install commands mutate the presenter machine.

```powershell
git --version; copilot --version; squad --version; terraform version; tflint --version; docker --version; gh --version
```

Expected result: versions print. Validation observed Copilot CLI `1.0.93`, Squad `1.0.1`, Terraform `1.16.5`, TFLint `0.64.0` with `ruleset.terraform (0.15.0-bundled)`, Docker `29.8.2`, and GitHub CLI `2.101.0`. **Verified 2026-10-09** for the TFLint version output; the other version checks were **verified 2026-10-08**.

Hard preflight for C7: do not continue unless `tflint --version` works in the session repo worktree and shows `TFLint version 0.64.0` plus `ruleset.terraform (0.15.0-bundled)`.

2. Keep Docker Desktop running before starting the Terraform MCP chapter.

```powershell
docker image inspect hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5 --format '{{.Id}} {{json .RepoDigests}}'
```

Expected result: the pinned digest is present locally. **Verified 2026-10-08.**

3. macOS/Linux were not rehearsed for this playbook. The Squad README (pinned reference 93aec83) lists `brew install --cask bradygaster/squad/squad` on macOS (the tap-qualified name is required), but this session script is Windows-first. **Not verified 2026-10-08.**

## 2. Bootstrap Squad from zero in a new repo

1. Start in a fresh Git repo.

```powershell
New-Item -ItemType Directory -Force $HOME\demo\squad-zero | Out-Null
Set-Location $HOME\demo\squad-zero
git init
Set-Content README.md '# squad zero'
git add README.md
git -c commit.gpgsign=false commit -m 'init sandbox'
```

Expected result: a one-commit repository. **Verified 2026-10-08** after adding `-c commit.gpgsign=false`; the first unsigned attempt failed because the presenter's Git signing key file was missing.

2. Initialize Squad. Use `--no-vscode-default` if you do not want `.vscode\settings.json` to set new Copilot Chat sessions to Squad.

```powershell
squad init
```

Expected result: `Squad initialized. Run copilot --agent squad and tell it what you're building.` **Verified 2026-10-08.**

```powershell
squad init
```

Expected result: existing files are skipped; the command remains safe to re-run. **Verified 2026-10-08.**

3. Confirm the files that appear.

```powershell
Get-ChildItem -Recurse -Force -File .squad,.github,.vscode,.gitattributes |
  Select-Object -ExpandProperty FullName |
  ForEach-Object { $_.Replace((Get-Location).Path + '\', '') } |
  Sort-Object
```

Expected result includes `.squad\`, `.github\agents\squad.agent.md`, `.github\skills\`, `.github\workflows\squad-*.yml`, `.mcp.json`, `.gitattributes`, `.gitignore`, and usually `.vscode\settings.json` unless `--no-vscode-default` was used. **Verified 2026-10-08.**

4. Enter Squad and run Init Mode.

```powershell
copilot --agent squad
```

Expected result: interactive Copilot CLI opens with the Squad agent. **Needs interactive confirmation:** prompt mode can smoke-test agents, but the roster proposal is a live TUI flow.

Type this in the TUI:

```text
We maintain a reusable Terraform module for AKS Automatic on azapi that deploys into an existing Azure landing zone. Work is Terraform module code, terraform test contract tests, and consumer documentation. Propose a small team.
```

Expected result: Squad proposes a team and asks for confirmation. Nothing about the custom team is final until you accept the roster. **Needs interactive confirmation.**

5. Verify the installation.

```powershell
squad doctor
```

Expected result: required files and Copilot CLI checks pass. Validation observed `10 passed, 0 failed`. **Verified 2026-10-08.**

```powershell
squad health --json
```

Expected result after a real accepted team: JSON status `pass` (schema `squad-health/v1`). **Verified 2026-10-08 on Squad 1.0.1** in the prepared session repo. `squad health` is listed in `squad help`; the `--json` output is not described on the pinned reference page, so treat it as installed-CLI behavior and re-check it after any Squad upgrade. In a zero sandbox before accepting a generated team, validation correctly returned `fail` for empty registry/routing; do not present that as a broken install.

6. Preview a safe upgrade before applying it.

```powershell
squad upgrade --dry-run
```

Expected result: a list of Squad-owned files that would be created or overwritten. **Verified 2026-10-08 on Squad 1.0.1** (`squad upgrade --help` lists `--dry-run`: "Preview changes without writing"; the flag is not on the pinned reference page).

```powershell
squad upgrade
squad doctor
```

Expected result: Squad-owned files refresh, customized `squad.agent.md` is backed up if needed, and doctor still passes. **Not run 2026-10-08:** intentionally avoided overwriting prepared demo files; dry-run was verified.

## 3. Add and use our native Terraform agent profiles

Copy the three profiles into `.github\agents\`. In this repo they already exist at the root and inside the reusable module copy.

```powershell
New-Item -ItemType Directory -Force .github\agents | Out-Null
Copy-Item <session-repo>\.github\agents\terraform-coder.agent.md .github\agents\
Copy-Item <session-repo>\.github\agents\terraform-validator.agent.md .github\agents\
Copy-Item <session-repo>\.github\agents\terraform-reviewer.agent.md .github\agents\
Get-ChildItem .github\agents\*.agent.md | Select-Object -ExpandProperty Name | Sort-Object
```

Expected result: `squad.agent.md`, `terraform-coder.agent.md`, `terraform-validator.agent.md`, and `terraform-reviewer.agent.md`. **Verified 2026-10-08.**

Start Copilot CLI from the **session repo folder** or its checkpoint worktree. Do **not** start it from the coordinator/private folder.

```powershell
cd C:\git\squad-terraform-session-2026-10-14\public   # or the checkpoint worktree for this session
copilot --agent squad
```

Expected in `/agent`: `Squad` (user) plus `terraform-coder`, `terraform-reviewer`, `terraform-validator` marked `project`. **Verified 2026-10-09.**

```powershell
copilot --agent terraform-reviewer -p "Reply with exactly: READY"
```

Expected result: the literal reply `READY`. **Verified 2026-10-09** from the session repo worktree.

Frontmatter to show on slides:

```yaml
---
name: "terraform-coder"
description: "Implement bounded public Terraform module changes and related tests/docs; no shell, cloud execution, delegation, or publication. Uses read-only MCP documentation lookups only."
tools: ["read", "search", "edit", "microsoft-learn/microsoft_docs_search", "microsoft-learn/microsoft_docs_fetch", "terraform/search_providers", "terraform/get_provider_details", "terraform/get_latest_provider_version", "terraform/search_modules", "terraform/get_module_details", "terraform/get_latest_module_version"]
mcp-servers:
  microsoft-learn:
    type: "http"
    url: "https://learn.microsoft.com/api/mcp"
    tools: ["microsoft_docs_search", "microsoft_docs_fetch"]
  terraform:
    type: "stdio"
    command: "docker"
    args: ["run", "-i", "--rm", "hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5", "--toolsets=registry"]
    tools: ["search_providers", "get_provider_details", "get_latest_provider_version", "search_modules", "get_module_details", "get_latest_module_version"]
---
```

```yaml
---
name: "terraform-validator"
description: "Manual-only offline Terraform qualification runner for this public module and caller example; no edit tool, shell can still write files."
tools: ["read", "search", "execute"]
disable-model-invocation: true
---
```

```yaml
---
name: "terraform-reviewer"
description: "Read-only independent review of public Terraform diffs, tests, and supplied qualification evidence; no execution or edits. Uses read-only MCP documentation lookups only."
tools: ["read", "search", "microsoft-learn/microsoft_docs_search", "microsoft-learn/microsoft_docs_fetch", "terraform/search_providers", "terraform/get_provider_details", "terraform/get_latest_provider_version", "terraform/search_modules", "terraform/get_module_details", "terraform/get_latest_module_version"]
mcp-servers:
  microsoft-learn:
    type: "http"
    url: "https://learn.microsoft.com/api/mcp"
    tools: ["microsoft_docs_search", "microsoft_docs_fetch"]
  terraform:
    type: "stdio"
    command: "docker"
    args: ["run", "-i", "--rm", "hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5", "--toolsets=registry"]
    tools: ["search_providers", "get_provider_details", "get_latest_provider_version", "search_modules", "get_module_details", "get_latest_module_version"]
---
```

Use the lanes like this:

```text
/agent
# confirm Squad (user) plus terraform-coder, terraform-reviewer, and terraform-validator marked project
/agent terraform-coder
```

Expected result: `/agent` lists `Squad` (user) plus `terraform-coder`, `terraform-reviewer`, and `terraform-validator` marked `project`, then the interactive session switches to the writer lane. **Needs interactive confirmation.**

```powershell
copilot -C <repo> --add-dir <repo> --agent terraform-validator --disable-builtin-mcps --no-ask-user --no-color --allow-tool read --allow-tool search -p "Read README.md and report one sentence. Do not edit files, run shell commands, or use MCP."
```

Expected result: the validator profile runs and reports without edits. **Verified 2026-10-08.**

Why three lanes:

- `terraform-coder`: can edit bounded public Terraform/tests/docs, but has no shell and cannot prove commands passed.
- `terraform-validator`: can run approved offline commands, but has no `edit` tool and is manual-only.
- `terraform-reviewer`: read-only independent review; no shell and no edits.

## 4. MCP setup and verification

Microsoft Learn is configured as hosted HTTP in the coder/reviewer profiles. Terraform Registry grounding uses Docker because no official hosted HashiCorp Terraform MCP is documented for this demo.

```powershell
copilot mcp list --json
```

Expected result: user/workspace/plugin MCP servers print as JSON. **Verified 2026-10-08.** Do not paste secrets or header values from this output into public docs.

```text
/mcp
```

Expected result: the interactive MCP dashboard shows server status. **Needs interactive confirmation.**

Optional user-level hosted Terraform MCP, if you have one, must keep its header key outside source:

```powershell
copilot mcp add --transport http terraform-hosted https://<host>/mcp --header "<header-name>: <read from your secret store>"
```

Expected result: `terraform-hosted` appears in `copilot mcp list`. **Not run 2026-10-08:** this would alter the presenter user's MCP configuration and must never print the secret value.

For repeatability runs, disable unrelated user-level servers and built-ins, then allow only the profile tools you need:

```powershell
copilot -C <worktree> --agent terraform-coder --model claude-sonnet-5 --disable-builtin-mcps --no-ask-user --no-color --allow-tool read --allow-tool search --allow-tool write --allow-tool edit --allow-tool microsoft-learn --allow-tool terraform --disable-mcp-server <each unrelated user-level server> -p "<brief>"
```

Expected result: programmatic prompt mode exits with `Changes +.../-...` and usage summary. **Verified 2026-10-08** with the B2 smoke run.

## 5. Feature tour mapped to C0-C7

- **C0, clean machine:** install tools, clone, `squad init`, open `copilot --agent squad`, accept a proposed team.
- **C1, compare plans:** use Plan mode before edits.

```powershell
copilot --agent squad --plan
```

Expected result: Copilot starts in Plan mode. **Verified for flag existence 2026-10-08; TUI behavior needs interactive confirmation.**

- **C2, reviewable plan:** `/plan` and Shift+Tab plan mode are available in `copilot help commands`.

```text
/plan
```

Expected result: interactive planning flow starts. **Verified for command existence 2026-10-08; TUI behavior needs interactive confirmation.**

- **C3, one writer:** Squad routes; the human selects `/agent terraform-coder` for edits and `/agent terraform-validator` for checks.
- **C4, right context:** use skills and MCP.

```text
/skills info test-discipline
```

Expected result: Copilot shows the skill details and location. **Needs interactive confirmation.** Headless `copilot skill list` found `test-discipline` on 2026-10-08.

- **C5, fail-repair-check:** seed a private API regression, run the B2 repair command, then the oracle in section 6.
- **C6, continuity:** Scribe records decisions in `.squad\decisions\inbox\`; use `/new`, `/rename`, and `/tasks` to keep sessions organized. These commands exist in `copilot help commands`. **Verified for command existence 2026-10-08.**
- **C7, consumer:** reviewer reads the exact diff and sanitized validator evidence before any PR/gated apply.
- **C7 go/no-go:** before the chapter, `tflint --version` must work in the session repo worktree. If TFLint is missing, or if the TFLint step fails, stop the live suite and switch to the saved offline evidence and diff.
- **Reviewer lockout:** if the reviewer rejects an artifact, the original author is locked out of the revision; assign a different owner.
- **Ralph/watch:** Ralph is a built-in work monitor; `squad watch --help` and `squad triage --help` were verified. Do not use `--execute` in the session unless you intend to spawn work.

```powershell
squad watch --help
squad triage --help
```

Expected result: options include `--execute`, `--interval`, `--max-concurrent`, `--timeout`, `--decision-hygiene`, and monitoring flags. **Verified 2026-10-08.**

## 6. Repeatable prompts and scoring

Run fresh trials from a clean worktree at commit `4689d3c`. Disable unrelated MCP servers, keep the model fixed for the measurement, and score with the oracle. Repeatable means a target pass rate, not byte-identical output.

### B2: seeded repair

Seed this fault first in `terraform\modules\aks-automatic-corp\main.tf`: change the first `enablePrivateCluster = true` to `false`.

```text
Work only in terraform\modules\aks-automatic-corp.

The contract tests fail after a change in main.tf. Find and repair the cause in main.tf so every contract test passes. Do not edit any test file. Don't deploy, don't change providers or the lock file.
```

Expected result: only `main.tf` is repaired back to the private API setting. Five-run score: **B2 5/5**. One smoke run on 2026-10-08 also passed.

### B3: tag validation

```text
Work only in terraform\modules\aks-automatic-corp.

Azure tag names can't contain the characters < > % & \ ? /. Add validation to var.tags in variables.tf that rejects tag keys containing any of these, with a clear error message, and add one negative run block named reject_tag_key_forbidden_character to tests\contract.tftest.hcl using expect_failures = [var.tags]. Keep every existing validation and test unchanged. Don't deploy, don't change providers or the lock file.
```

Expected result: only `variables.tf` and `tests\contract.tftest.hcl` change. Five-run score: **B3 4/5**; one run also changed README and failed the scope oracle.

### B1v2: clarified alternate network payload

```text
Work only in terraform\modules\aks-automatic-corp.

Add one run block named alternate_network_payload to tests\contract.tftest.hcl. Reuse the existing AzAPI mock and command = plan. Use pod CIDR 172.21.0.0/16, service CIDR 10.241.0.0/16 and DNS service IP 10.241.0.10. Write four separate assert blocks, one each: the pod CIDR, the service CIDR and the DNS service IP propagate into the requested cluster body, and the API server stays private. Each assert gets its own error_message. Change only tests\contract.tftest.hcl. Don't deploy, don't change providers or the lock file.
```

Expected result: one new plan-mode test run with four separate asserts, each with its own `error_message`. Original **B1 scored 0/5** because the ambiguous brief did not specify the separate-assert shape required by the stricter pre-registered oracle; it was not rescored. B1v2 used the clarified brief above, the same command flags and `claude-sonnet-5`, and five fresh worktrees from base `4689d3c`: **B1v2 5/5 green, repeatable**, with runs between 61 and 114 seconds and no failure modes observed in those five runs. The measured result is narrower: the ambiguous brief failed the stricter oracle 5/5 times in the same way, while the separate B1v2 brief was 5/5 under the same pinned conditions. That suggests the explicit test shape mattered in this eval, but it does not prove causation for future runs. Per the October 5 plan, film the C3-C5 loop with this B1v2 brief because it met the `>=4/5` bar. Do not promise identical output.

### Programmatic command shape

```powershell
copilot -C <fresh-worktree> --agent terraform-coder --model claude-sonnet-5 --disable-builtin-mcps --no-ask-user --no-color --allow-tool read --allow-tool search --allow-tool write --allow-tool edit --allow-tool microsoft-learn --allow-tool terraform --disable-mcp-server <each unrelated user-level server> -p "<brief>"
```

Expected result: Copilot exits non-interactively. **Verified 2026-10-08** with B2.

### Oracle commands

```powershell
terraform -chdir=terraform\modules\aks-automatic-corp fmt -check -recursive
terraform -chdir=terraform\modules\aks-automatic-corp init -backend=false -input=false -lockfile=readonly
terraform -chdir=terraform\modules\aks-automatic-corp validate -no-color
terraform -chdir=terraform\modules\aks-automatic-corp test -no-color
terraform -chdir=terraform\modules\aks-automatic-corp\examples\corp-existing init -backend=false -input=false -lockfile=readonly
terraform -chdir=terraform\modules\aks-automatic-corp\examples\corp-existing test -no-color
```

Expected result for B2 baseline/repair: 52 contract runs and two example runs pass, with no lock-file drift. **Verified 2026-10-08** in the B2 smoke run.

```powershell
git diff --name-only 4689d3c --
git status --short
```

Expected result: only files allowed by the brief changed; after the B2 repair, the final diff was empty because the seeded defect was restored. **Verified 2026-10-08.**

To measure five fresh trials, run the same seed/brief/oracle in five separate worktrees and score green runs. Use **≥4/5** as the repeatability bar for the demo story.

## 7. From module to Azure through the demo-env repo

Public consumer repo: <https://github.com/martinopedal/aks-automatic-demo-env>. Operations runbook: <https://github.com/martinopedal/aks-automatic-demo-env/blob/main/docs/operations-runbook.md>. Do not copy subscription IDs, environment values, plan files, or private state into this session repo.

1. Open a PR that changes only the module `?ref=` tag in `deployments/online/main.tf` plus directly required docs.

```powershell
gh repo clone martinopedal/aks-automatic-demo-env
Set-Location aks-automatic-demo-env
git checkout -b module/<tag>
# edit deployments\online\main.tf to the reviewed module tag
git diff -- deployments\online\main.tf
gh pr create --base main --title "chore: consume module <tag>" --body "Plan-only run required before apply."
```

Expected result: a PR for the thin root. **Not run 2026-10-08:** would create a public PR.

2. Plan only, read the plan, then apply through the gated workflow.

```powershell
$env:AZURE_SUBSCRIPTION_ID_ONLINE = '<set in your shell only>'
.\scripts\Invoke-GatedRun.ps1 -Workflow deploy-online.yml -Inputs 'apply=false' -StartRunner
.\scripts\Invoke-GatedRun.ps1 -Workflow deploy-online.yml -Inputs 'apply=true' -StartRunner
.\scripts\Test-OnlineSecurity.ps1
```

Expected result: plan-only output reviewed before apply; apply re-plans and proves; `Test-OnlineSecurity.ps1` prints 29 checks and the public app URL `https://aks-online-demo.swedencentral.cloudapp.azure.com/`. **Not run 2026-10-08:** Azure changes and environment gates are intentionally out of scope.

3. Demo VM check/reset uses the same gated pattern.

```powershell
.\scripts\Invoke-GatedRun.ps1 -Workflow deploy-demo-vm.yml -Inputs 'action=plan' -StartRunner
.\scripts\Invoke-GatedRun.ps1 -Workflow deploy-demo-vm.yml -Inputs 'action=apply' -StartRunner
.\scripts\Test-DemoVm.ps1
.\scripts\Connect-DemoVm.ps1
```

Expected result: 14 demo VM checks pass and Bastion RDP opens. **Not run 2026-10-08:** Azure changes and RDP are not headless-safe.

## 8. Troubleshooting

| Symptom | Recovery | Verification |
| --- | --- | --- |
| MCP startup race or noisy user servers | Add `--disable-builtin-mcps` and `--disable-mcp-server <name>` for unrelated user servers; wait for `/mcp` to show the needed servers. | B2 command shape verified 2026-10-08. `/mcp` dashboard needs interactive confirmation. |
| Terraform MCP does not start | Start Docker Desktop; inspect the pinned image digest; rerun the agent. | Docker image inspect verified 2026-10-08. |
| Only user/plugin agents plus Squad are listed (no terraform-* project agents). | Copilot was started in the wrong folder (for example the coordinator root, which only has `squad.agent.md`) — `cd` to the session repo folder and restart. | `/agent` shows `terraform-coder`, `terraform-reviewer`, and `terraform-validator` as project agents. **Verified 2026-10-09.** |
| `squad health --json` fails right after `squad init` | Accept the Init Mode roster first, or treat the zero-repo health result as pre-team state. | Zero sandbox fail and prepared repo pass both verified 2026-10-08. |
| Git commit fails due signing setup | Use `git -c commit.gpgsign=false commit ...` for throwaway demo commits. | Verified 2026-10-08. |
| OIDC assertion expires during long Azure apply | The demo-env workflow re-runs `azure/login` before cluster calls. | Source-verified in demo-env runbook; not executed here. |
| Guest VM sign-in | Use demo-env's `Set-GuestLocalLogin.ps1` and `Connect-DemoVm.ps1 -LocalAccount`; transfer any generated credential out-of-band only. | Source-verified; not executed here. |
| Browser warns on the app certificate | Accept the self-signed certificate once before presenting. | Source-verified; not executed here. |

## Source list

Sources researched on **2026-10-08**:

- Squad pinned CLI reference: <https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/reference/cli.md>
- Squad current installation/init/upgrade docs: <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/get-started/installation.md>
- Squad current existing-repo scenario: <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/scenarios/existing-repo.md>
- Squad current skills docs: <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/skills.md>
- Squad current ceremonies docs: <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/ceremonies.md>
- Squad current Ralph/watch docs: <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/ralph.md>
- Squad current self-upgrade docs: <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/self-upgrade.md>
- GitHub Copilot CLI docs: <https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli>
- GitHub Copilot CLI command reference: <https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference>
- GitHub Copilot custom agents configuration: <https://docs.github.com/en/copilot/reference/custom-agents-configuration>
- GitHub Copilot CLI MCP servers: <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers>
- GitHub Copilot CLI skills: <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills>
- GitHub Copilot CLI custom instructions: <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions>
- Demo environment README: <https://github.com/martinopedal/aks-automatic-demo-env/blob/main/README.md>
- Demo environment operations runbook: <https://github.com/martinopedal/aks-automatic-demo-env/blob/main/docs/operations-runbook.md>
