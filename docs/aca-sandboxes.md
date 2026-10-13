# Azure Container Apps Sandboxes for this session

Audience: presenters and the approved sandbox operator. Purpose: show where qualification stops, what the full runtime test contract requires, and when the existing C4 substitution is safe.

**ACA SANDBOXES only:** native host-Squad -> hardware MicroVM runtime is not
**SQUAD ON ACA APPS/JOBS**. Both independent demos need accepted current proof.
The original hosted implementation remains working/previously shown and unchanged.
Owned fork/target/publisher source is accepted/merged, but publisher qualification/
human gate, owner-native Terraform/full QA/plan/image/auth and actual README bot
PR remain pending. Chosen owned mode is private scheduled poller, not new runner
registration/AppAdmin; native acceptance does not qualify hosted E2E.
Owner-native source preparation is under review; executable delivery remains
held, not deploy-on-merge or merely missing operator receipts.

Current status, October 12: Online is **primary placement for eligible demo components**, with a separate independently verified five-object SandboxGroup/RG deployment, not a fallback, AKS-hosted MicroVM or Haflidi Jobs/runner. All five exact bindings/current operator group access passed. A credential-free base probe verified exec/public filesystem/stop-resume/deletion and an empty cleanup list. Standard managed networking is not Corp BYO VNet/UAMI/FIC transplantation. Corp-required workloads remain Corp and untouched; its held blocked/no-apply qualification is separate history. Public visibility is not anonymous control-plane access.

The **corrected host Copilot/Squad runtime receipt passed its requested contracts**
in one 26.768-second sandbox run: LF/source-byte hash round trip, three positive
guest checks, returned JSON plus matching guest SHA256, actual guest/host exit 23,
and one HTTPS 403 correlated with a new same-sandbox `networkEgress.denied` audit
record. Exact deletion/empty list/NotFound and watchdog stop passed.
Independent parent evidence acceptance completed October 12 at 19:10 UTC:
all 85 evidence files were rehashed. The **ACA SANDBOXES engineering contract is
DONE**, and the native card is runtime-ready, not automatically human stage GO. Second-presenter
access, manual UI/login and timed rehearsal remain separate. No Copilot/Squad
agent or OAuth ran inside the guest. The earlier CRLF attempt is controlled
learning history, not the current failed lane or a globally broken ACA service.

Historical MicroVM execution checks succeeded in a Management-side group, not current Corp or Online qualification. The official plugin is installed and enabled; its earlier disabled state remains historical. Base C4 stays the default until an explicit target, approved plan/apply, access/policy read-back and prepared-sandbox rehearsal pass.

## What it is

Azure Container Apps Sandboxes are hardware-isolated microVM sandboxes exposed through the ARM resource type `Microsoft.App/SandboxGroups`. Azure Updates lists the feature as preview in June 2026 and generally available in September 2026. The Learn overview and quickstarts show three surfaces that matter for this talk:

- ARM and Bicep create the sandbox group
- the `aca` CLI creates and operates individual sandboxes
- the `aca-sandboxes` Copilot CLI skill teaches the agent how to drive the `aca` CLI with natural language

## Why it matters here

This talk already shows Copilot CLI and Squad helping with Terraform. ACA Sandboxes adds an execution example for a separate question: where do you run untrusted or AI-written code when you need isolation from the presenter laptop? A conditional C4 variant can demonstrate that without adding a chapter. It does not establish Azure acceptance of the AKS module.

## Verified facts

- Status: generally available in September 2026, after a June 2026 preview period
- Observed sandbox group region: Norway East; a succeeded group alone does not qualify the intended Corp target
- Required role: Container Apps SandboxGroup Data Owner for sandbox data-plane operations
- Authentication: Microsoft Entra ID only
- Networking: sandbox groups can attach to a delegated subnet with `Microsoft.App/sandboxGroups/vnetConnections`; no managed environment is required
- Egress model: rule-based allow and deny with `Allow`, `Deny`, `Transform`, and `Rewrite`, plus traffic inspection modes `Full`, `Partial`, `None`, and `Legacy`
- Recommended posture for untrusted code: default action `Deny` with an explicit allow list
- Public disks available on this machine included `copilot`, `azure-dev`, `ubuntu`, several Python disks, Node 22 and 24, and .NET 8 through 10
- Sandbox tiers from Learn: XS, S, M, L, XL
- Quota note from Learn: Sandboxes and Express are limited to 2,000 cores
- Cost note from Learn: suspended native MicroVM compute charges stop, but storage can continue; this runbook did not derive a bill-backed per-run amount. AutoSuspend is not a hard active timeout or credential revocation

## Current qualification and target boundary

The Corp source correction is merged. The subsequent read-only qualification was blocked on an unexpected change-type check; no apply performed. Source success is not plan acceptance. No new sealed manifest or raw exact deltas are available; do not infer resource counts or correctness for that failed plan. Devrel is separately repairing private failed-plan diagnostic retention, not deploying or weakening the scope check.

Last recorded Corp baseline remains 8 present / 3 absent: the group exists, but the default VNet connection and both presenter Data Owner grants are missing. Full convergence, effective access and actual in-MicroVM CLI/Squad remain unproved. Preserve those resources untouched.

Native source is demo-env `deployments\aca-sandboxes-online`, with a separate
sandbox-only workflow/protected `online` lane. The verified five-object graph is
RG/SandboxGroup/two group Data Owner grants/one consumer RG Contributor grant.
The approved one-time Owner bootstrap and deployment/readbacks are independently
verified; public source PR human review is still separate and not claimed merged.
Read-only qualification uses the [official CLI quickstart](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli).
Source presence and a completed probe do not authorize another group, lifecycle or deployment.
Online is not anonymous ingress, credential exposure, Corp networking change or
moving the hosted service; no Corp/AKS/Jobs modification.

The original credential-free Ubuntu 1 CPU/2 GiB base probe completed in 375 seconds.
Independent fresh review confirmed deployment Succeeded, all five exact bindings,
current operator group data-plane access and an empty list. The earlier separately approved host attempt failed local CRLF work and cleaned
up in about 77 seconds. A corrected separately approved run then completed all
requested guest/exit/causal-denial/cleanup contracts in 26.768 seconds.
Independent evidence acceptance is complete. None of these probes grants another create/retry,
group/RG teardown, existing-workload changes or inside-MicroVM OAuth.

Read [the repository map](repositories.md) and [four-lane progress matrix](sandboxing.md#october-12-progress-and-next-actions). The public session clone is not the live AKS consumer or a runnable private hosted target.

## Full test coverage checklist

Use the full [official CLI setup quickstart](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli), not a search-card excerpt or an old skill reference. Its rendered article was independently read on October 12: install, version, Azure login, resource/group provisioning, Data Owner note, doctor, sandbox create/exec/delete and optional teardown. Its next step explicitly offers an agent skill so GitHub Copilot or Claude Code can drive those same commands. Its HTML canonical URL is `https://containerapps.azure.com/docs/sandboxes/quickstart/setup-cli`, but direct retrieval of that canonical returned HTTP 404 in this pass. The supplied `sandboxes.azure.com` URL returned the full article with normal TLS verification.

That quickstart is generic, not authorization to run its create/delete examples here. Its sample derives the current default subscription and uses `--set-config`; do **not** copy that implicit-target pattern. The host default is Management, not selected Online. Every target-sensitive command must supply the reviewed subscription, resource group, sandbox group and region explicitly. The native help confirms those flags for `aca auth status` and `aca doctor`.

Read-only example after privately resolving approved aliases:

```powershell
$target = @('--subscription', '<approved-subscription>',
  '--resource-group', '<approved-resource-group>',
  '--sandbox-group', '<approved-sandbox-group>',
  '--region', '<approved-region>')
aca auth status @target -o json
aca doctor @target
```

The actual host `aca auth status -o json` returned exit 0, ARM authenticated true via Azure CLI and data-plane authenticated true. This establishes **token authentication only**, not selected Online targeting, Data Owner access, doctor or lifecycle. Do not repeat an implicit-default command as qualification. Do not publish account/token output. Do not use an old `--email` auth example: the corrected skill uses Entra `--auth entra --allow-principal`; any actual configuration needs the installed command help and a separately reviewed target/identity contract.

**Wrong-target warning:** an actual `aca doctor` returned 9/9 and exit 0 but
printed the cached Management/Norway East group instead of the explicitly
requested target; the lead reproduced this with Online flags too. It did not
qualify Corp or Online. Compare the printed
subscription, resource group, group and region with the approved target and
independently read back the exact resource ID before treating doctor as scoped
preflight evidence. A green result for the wrong group is BLOCKED, not creation
permission. Resolve the flag/config behavior read-only; no config change,
Management MicroVM fallback or create is authorized.

States below are **COMPLETED**, **BLOCKED**, or **PENDING**. A pending row has no current execution evidence. Blocked runtime rows depend on target/access/consent; none was run by this documentation pass.

| Test / owner | State, October 12 | Actual evidence / required acceptance |
| --- | --- | --- |
| Host CLI version / operator | COMPLETED, host only | `aca` 1.0.0-preview.4; host Copilot 1.0.94, Squad 1.0.1, plugin 0.0.5-beta enabled. Not inside a MicroVM |
| Host token authentication / operator | COMPLETED, tokens only | Auth status exit 0, ARM/data-plane authenticated true. Not group Data Owner or correct target |
| Explicit Online target and approved separate group/RG / lead + reviewer | COMPLETED, exact target | Independent fresh five-object bindings/configuration and terminal Succeeded matched the approved Online graph; no implicit host default |
| Effective Data Owner / operator + reviewer | COMPLETED for operator; PENDING for second presenter | Fresh exact-group data-plane list passed and was empty. Exact grants exist; second presenter must independently authenticate/test access |
| Targeted doctor / operator | BLOCKED, WRONG TARGET | Actual 9/9 exit 0 resolved to cached Management/Norway East, not requested target; lead reproduced with Online flags. Compare printed subscription/RG/group/region with approved target plus independent exact-ID read-back; resolve targeting read-only before retry. No Corp/Online doctor acceptance |
| Approved group configuration / operator + reviewer | COMPLETED, bounded provisioning | Exact approved graph and current configuration matched independent readbacks. This is not universal effective-policy/full demo acceptance; held Corp no-apply result stays separate |
| MicroVM create/list/get/delete / operator | COMPLETED, bounded owned probes | Base lifecycle and later exact new-ID cleanup verified; final group list empty and later probe NotFound. No shared/group/RG deletion |
| Exec / operator | COMPLETED base; corrected runtime PASS, acceptance complete | Three positive guest checks returned JSON; actual guest/CLI exit-23 propagation passed. Earlier CRLF host-exit-2 failure remains labeled learning history |
| Filesystem / operator | Corrected runtime PASS, acceptance complete | LF source-byte SHA256 round trip and returned JSON/guest-computed result SHA256 matched. This is public fixture evidence, not a Terraform archive or credentials |
| Egress / operator + reviewer | Corrected runtime PASS, acceptance complete | Deny/Full/no ports plus one actual HTTPS403 and new timestamped exact-sandbox networkEgress.denied record prove this bounded denial. Per-request TLS bypass on public credential-free endpoint is not trusted-TLS readiness |
| Suspend/resume / operator | COMPLETED, base probe | Stop/resume and preserved public state verified in the base probe; not rerun or inferred from documentation in the later integration attempt |
| Offline Terraform / operator | BLOCKED | Reviewed public archive revision/hash, isolated provider mocks, backend-disabled init, validate, root tests and real numeric exits inside selected MicroVM. Historical Management 10/10 is not current target or 52+2 module qualification |
| Host Copilot CLI/Squad remote orchestration / presenter + operator | ACCEPTED ACA SANDBOXES ENGINEERING CONTRACT / RUNTIME READY | Actual host coordinator/worker -> ACA tools -> three positive guest checks/JSON+SHA -> exit23/causal denial -> exact cleanup -> handoff. Native card runtime-ready after acceptance; stage GO still requires manual preflight/rehearsal. No inside-guest agents/OAuth |
| Optional in-VM Copilot + Squad / consenting presenter + operator | BLOCKED, advanced optional | Separate supported install/sign-in/entitlement, runtime egress and safe auth storage; actual in-VM paths/versions/process/selected agent/prompt/output. No host auth-cache copy; not a prerequisite for basic host orchestration |
| Presenter C4 rehearsal / both presenters | PENDING | Chosen target qualified, all required checks PASS, actual manual auth and one prepared-sandbox prompt within 29:30-33:30/cut 32:30; no stage provisioning or retry |
| Teardown / expiry / resource owner | PENDING, scheduled | Exact separately approved owned-resource cleanup Oct 17; credential expiry Oct 31. Verified deletion/cost stop, not dates alone |

Corrected bounded successful-work evidence exists; independent acceptance is complete; human stage GO remains pending. Doctor/help/config parse,
laptop 18/18, hosted Jobs and AKS metadata are different checks. Earlier USD 20
is historical planning/alert context, not current execution authority; scoped
cost consent stays private and retained costs/storage still need cleanup proof.
The saved base auto-suspend interval was 600 seconds, not a hard active timeout.

## Copilot CLI and Squad integration: two distinct meanings

**Primary Flow 2 is host-orchestrated isolated work:** host Copilot CLI/Squad
scopes a public task, invokes the installed `aca-sandboxes` skill, inspects actual
`aca` calls, runs work inside the native MicroVM and returns outputs/exits with a
validator/reviewer handoff. This follows the official quickstart's agent-skill
next step. The CLI/Squad need not themselves run inside the MicroVM for that
bounded remote-work claim.

Integration acceptance needs an actual prompt/selected agent/skill/tool/output/
handoff trace tied to the separately qualified target and archive revision.
Standalone hello, filesystem and lifecycle checks are prerequisites, not this
demo. Online basic provisioning/access/runtime is verified; the corrected
host-orchestrated run returned positive guest JSON/SHA, actual exit23 and causal
denial/cleanup evidence. Parent acceptance is complete; the earlier failed attempt
is history, not the current runtime verdict.
Use [the reusable native prompt](prompt-pack.md#native-host-squad-isolated-work)
only after its preparation/approval gate; a real failed trace is not full GO.
See [the two product demo flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).

**Advanced optional variant is in-MicroVM CLI/Squad:** installation, supported
authentication/entitlement, safe storage and actual in-VM process/agent/prompt
execution need separate consent and proof. Those OAuth/install gates do not
block the basic host-orchestration story, but are mandatory before claiming this
advanced variant. Hosted Squad ACA Jobs do not prove either native variant.

## Historical October 12 Corp recovery: failed, not runtime acceptance

The human-approved immutable apply passed same-job OIDC, preflight, and manifest verification, then failed on the default VNet connection with HTTP 400 requiring missing `location`. The July 2026 template/schema documentation omitted that field.

Source-only correction is now locally qualified: the native connection source adds root `location` from the exact parent region with an explicit pinned service correction and strict 8/3 v2 ownership model. Actual compiler and closed official-schema contracts passed 34/34 using unchanged verified immutable cache bytes. The initial anonymous fetch hit a 403 rate limit and failed before tests; it was not a failed contract run. Artifact suite 85/85 and runtime suite 31/31 passed as source/tooling checks, not Azure sandbox execution. Remaining workflow 17/17, checkout 10/10, toolchain 12/12 and GitHub-script 10/10 suites passed; two Linux smokes were skipped on Windows in the existing toolchain suite.

Those source/tooling results preceded the merged correction and subsequently blocked qualification described above. They are not the new plan's manifest, exact deltas or a runtime pass. No new apply established; the absent connection/two grants and scoped native ACA 403 remain unresolved.

Fresh native read-back checked all 11 expected resource IDs: 8 present and 3 absent. The group was `Succeeded`, but the default connection and both presenter Data Owner grants were absent. Native `aca auth status` passed ARM/data authentication checks; the correctly scoped `aca sandbox list` returned 403 with exit 1. Data Owner access remains unqualified.

No successful Corp sandbox creation/runtime test or full CLI+Squad execution inside a MicroVM is established. Host installs and plugin enablement do not prove in-MicroVM process/agent/prompt execution. Supported sign-in, storage, egress, and credential consent are separate gates; never copy host authentication. Keep the base C4 flow and do not retry on stage.

Fresh forwarded read-only checks confirm the explicitly targeted Corp group is
Succeeded with no VNet connections and the actual scoped sandbox list returned
403/exit 1. That access failure overrides no green result: wrong-target doctor
cannot replace it. The earlier Online candidate RG 404 is superseded by the independently verified
separate Online deployment and base probe. It was an absence observation, not
creation authority. Corp remains held; current Online successful-work integration
acceptance is complete; only human stage preflight/rehearsal and hosted Apps/Jobs qualification remain separate.

## Intended variant: Squad inside a customer-managed ACA MicroVM

This is an intended in-MicroVM installation/execution variant, not a fifth product or a new Squad sandbox command. It is not currently executed or qualified. `aca` operates the customer-owned MicroVM; Copilot CLI and Squad would run inside it after separate approvals. A `copilot` disk label or host-installed programs do not establish that runtime.

Before attempting it, the operator must close the separately approved selected-target deployment/access/policy gate above, review supported in-MicroVM installation and pinned Linux-compatible packages, and approve model-service/GitHub egress, sign-in, persistent storage, expiry and cleanup. The verified Online group is separate from AKS and hosted Jobs. Do not copy host auth caches, tokens, personal memory or private team histories. Keep supported sign-in human-driven and separate from the uncredentialed Terraform check lane.

Qualification must record sanitized output from inside the MicroVM: process/OS context, resolved executable paths and versions, the actual `copilot --agent squad` process, selected agent/team and a bounded public-only prompt with its real output and exit. Link this to the approved sandbox and source revision in private evidence. Host `copilot --version`, `squad --version`, `aca auth status`, a worktree, or a tool filter cannot replace these checks. Do not add installation/sign-in to timed C4; it remains the prepared uncredentialed validation variant only.

## Historical Management deployment and intended Corp gate

Read-back on 9 October 2026 found a sandbox group in Norway East with provisioning state `Succeeded`. Its subscription was under Management > Platform, not Corp. `aca doctor` passed 9/9 checks, and the sandbox list was empty at that time. These are historical Management-side observations, not current Corp deployment or policy-compliance results.

The earlier Corp-only direction is historical, superseded by the confirmed separate Online group/RG direction. Neither that direction nor historical Management checks qualifies a new target. The intended live moment stays gated until independently reviewed target-specific IaC, access/effective-policy read-back and the full required test coverage pass. Corp remains untouched and unqualified.

## How this differs from the other sandbox stories

| Surface | Where it runs | Isolation and control | Best fit in this session |
| --- | --- | --- | --- |
| Copilot CLI local `/sandbox` | On the presenter machine | Host OS/MXC isolation with filesystem and network policy | Mention as context only |
| GitHub-managed Copilot cloud sandboxes | GitHub-managed ACA, preview | GitHub identity, policy and billing | Documented preview/account-build gate; explicit help parse exit 0 is not account/runtime proof |
| Customer-managed ACA MicroVMs via `aca` | Customer Azure sandbox group | MicroVM isolation, configurable egress, suspend and resume, explicit lifecycle | Online deployment/access/base verified; successful-work integration/rehearsal pending, conditional C4 only after its full gate |
| Squad on ACA hosted Apps/Jobs | Azure Container Apps Jobs and supporting Azure services | Queue workflow, workload identity, Key Vault and KEDA; not MicroVMs | Corp, Norway East placement read back; fresh queue-driven readiness is not established |

Squad is coordination/configuration over the hosting Copilot session, not a sandbox product; installed 1.0.1 help has no sandbox verb. A worktree/tool filter does not isolate credentials. Hosted Jobs placement is distinct from Corp MicroVM acceptance and from effective-policy/runtime qualification. See [all four execution hosts](sandboxing.md).

`/sandbox` manages local filesystem and network policy; local sandboxing is off by default and enabled with `/sandbox enable`. On Windows, it requires a supported recent Windows 11 build and the applicable update prerequisites in the official [OS support information](https://aka.ms/ghcp-sandbox-os-support). Feature support, including denied paths, localhost, and proxying, depends on that Windows version. MXC process isolation runs on the host, not in a separate VM or container. Built-in in-process file tools honor policy on a best-effort basis, and remote MCP servers are not sandboxed.

Installed `copilot help sandbox` documents one-session `--sandbox` despite top-level-help omission. Actual local-MXC startup exited 1 before the command because proxy/masking/auth require loopback/private-network allowance under currently blocking policy. No bypass/global change was made; authorized policy review and actual backend/session preflight rerun are needed. Windows host build 26300 is OS metadata, not successful backend operation. Interactive `/sandbox enable` and `/sandbox status` remain the native controls.

Windows proxy and host rules require supported features and **Allow local network**. They rely on applications honoring proxy settings, so they are not an airtight restriction on every process's direct connections. This is brief context, not a substitute for ACA microVM isolation or evidence that the intended Corp target is ready ([GitHub documentation](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes)).

## Preflight

These are manual operator prerequisites, not actions performed by this documentation revision. Complete them before the room; any unmet item keeps the selected-target live variant gated:

October 12 native host checks: Copilot CLI 1.0.94, Squad 1.0.1, ACA CLI 1.0.0-preview.4, enabled plugin 0.0.5-beta, and corrected laptop preflight 18/18 PASS. This is one laptop's read-only result, not both presenters, manual sign-in, full rehearsal, or MicroVM acceptance. A prior false failure on the CLI banner's terminal period was repaired; 46/46 controlled regression scenarios and three harmless native helper checks on each PowerShell 7 and 5.1 passed.

1. Install the plugin from Learn:
   - `/plugin marketplace add microsoft/azure-container-apps`
   - `/plugin install sandboxes@Azure-Container-Apps`
2. Run `copilot plugin list`.
3. If the plugin shows `[disabled]`, run `copilot plugin enable sandboxes@Azure-Container-Apps`.
4. Install the `aca` CLI from Learn and verify `aca --help`.
5. Confirm the explicit selected target and exact private IaC change, reviewed plan, and human environment approval. For the verified Online target, recheck current exact-group access and the separately approved prepared-runtime scope; do not transplant Corp network/identity wiring. Read back provisioning, approved deny-by-default egress and effective policy inheritance, parameters, enforcement, exclusions, and exemptions. Confirm the approved group exists and targeted `aca doctor` passes. A green doctor result is connectivity evidence, not this policy gate.
6. Confirm the approved data-plane scope, operator access, capacity, budget, expiry, and cleanup owner. Prepare one sandbox, its Terraform 1.16.5 installation, dependencies, and a reviewed public-only archive before the timed chapter. Run `/workspaces/bin/terraform init -backend=false -input=false` in `/workspaces/module` during this preflight, not on stage. Keep sandbox checks uncredentialed for Azure, with the reviewed mocked test suite. Do not provision a group or change networking on stage.
7. Record the archive's source revision and hash. It must contain the intended root `tests\validation.tftest.hcl` suite, not private inputs, credentials, backend/state, or a saved plan. Keep the archive at a generic operator-resolved path such as `<reviewed-module-archive.zip>`.
8. Require all presenter checks PASS, with actual authentication verified manually. Rehearse the exact prepared-sandbox prompt below on the separately approved selected target, retaining real numeric process exits and sanitized output. Prepare labeled fallback evidence and confirm no identifiers appear on screen. Preliminary planning approval, plugin enablement, `aca doctor`, and the Management-side runs alone do not qualify this variant.

## Prior fresh-sandbox prompt and scoped observed outcomes

Generic form of the prompt used for the successful skill-based Management-side run:

This describes the earlier Management-side run, not the timed C4 procedure. Before any separately approved reuse, the operator supplies the explicit approved target, reviewed sandbox group, resource group, and module archive path for that scope. The historical prompt is not a current command recipe: it lacks explicit subscription/region flags. The observed Management-side group does not qualify the new Online target or Corp.

```text
Use the aca-sandboxes skill. Add $env:USERPROFILE\.aca\bin to PATH when you invoke shell commands. In sandbox group <reviewed-sandbox-group> and resource group <reviewed-resource-group>, create a fresh sandbox labeled name=livecopilot3 on the copilot disk with egress Deny and these allow rules only: *.hashicorp.com, registry.terraform.io, github.com, objects.githubusercontent.com, release-assets.githubusercontent.com, *.githubusercontent.com. Install Terraform 1.16.5 under /workspaces/bin. Upload <reviewed-module-archive.zip>, unzip to /workspaces/module, run /workspaces/bin/terraform init -backend=false -input=false, /workspaces/bin/terraform validate -no-color, and /workspaces/bin/terraform test -test-directory=tests -no-color. Then print HTTP status for https://example.com and https://registry.terraform.io, report the sandbox id, and stop without deleting it.
```

Sanitized outcome from the recovered skill-driven Management-side session (execution success, not Corp acceptance):

- `skill(aca-sandboxes)` was invoked
- sandbox created on the `copilot` disk with default egress `Deny`
- Terraform 1.16.5 installed inside the sandbox
- module zip uploaded and expanded under `/workspaces/module`
- `terraform init -backend=false -input=false` passed
- `terraform validate -no-color` passed
- `terraform test -test-directory=tests -no-color` passed with 10 root negative-validation checks passed and 0 failed
- `https://example.com` returned HTTP 403
- `https://registry.terraform.io` returned HTTP 200

The same workflow also ran successfully in Management from a fresh Copilot CLI session before the plugin was enabled. In that run, the agent fell back to the `aca` CLI directly after reporting that the skill was unavailable. Both recovered sessions show successful initialization and validation, 10 passed and 0 failed tests, and the HTTP 200/403 observations. That fallback is useful to keep in reserve.

These notes do not establish exact numeric process exit codes: the skill-driven session printed fields such as `INIT=True` because of local shell-variable expansion, not actual numeric exits. The fallback session explicitly did not identify the origin of HTTP 403. An observed 403 alone does not prove sandbox egress-policy enforcement or Azure Policy enforcement. Neither session validates Corp placement or effective policy compliance.

## Correct Terraform command for this module checkout

For `martinopedal/terraform-azapi-aks-automatic`, the working offline test command was:

```powershell
terraform test -test-directory=tests -no-color
```

This repository's `-filter` form did not select the file correctly in our run. The test directory form executed `tests\validation.tftest.hcl` and passed 10 of 10 root negative-validation checks. These are not the session's 52 child-module cases plus two caller cases, and they do not establish that C3's live edit was included in the archived source.

## Timing

Two fresh Copilot CLI runs completed end to end in Management:

- First fresh session: successful validation and observed HTTP responses, about 2:58 total
- Second fresh session after enabling the plugin and tightening the prompt: successful validation and observed HTTP responses, about 1:47 total

The prepared shell-only path was faster, but that does not predict a fresh Copilot turn. Model/tool discovery and command shaping vary. Neither Management-side duration qualifies a Corp run or guarantees a 90-second clip. Rehearse the prepared-resource variant below and obey the cut even if the model is still working.

## Recommended live use

Keep the base C4 skill, read-only MCP lookup, and permission flow when the selected-target successful-work integration/rehearsal gate is unmet. If useful, show a sanitized saved excerpt explicitly labeled **Management-side execution evidence, not Corp validation**. Never rerun the Management target to stand in for Corp.

Only after approved selected-target IaC, access/policy read-back, full required runtime coverage and the exact presenter preflight pass may the operator select the C4 variant. Online basic provisioning/access/probe is verified, but full integration/rehearsal remains unqualified; approved Corp IaC was the earlier condition, not the current exclusive placement rule. It replaces part of the deeper MCP lookup inside **29:30-33:30**, with the same **32:30 cut**. It adds no chapter, changes no other slide budgets, and uses none of the 55:00-58:00 protected slack. See [the C4 operator procedure](demo-runbook.md#c4-invoke-guidance-and-a-source--2930-3330--4-minutes).

| Wall clock | Budget | Operator action |
| --- | --- | --- |
| 29:30-30:00 | 0:30 | Name the selected variant and approved scope; show the skill and one prepared, cited read-only source. Label the source as preflight evidence, not a live MCP call. |
| 30:00-32:00 | 2:00 | Manually select the rehearsed, separately scoped ACA session and submit the single prompt below against the prepared sandbox. Inspect each native permission request. No creation, upload, dependency installation, or retry on stage. |
| 32:00-32:30 | 0:30 | Inspect completed checks, actual numeric exits, and HTTP observations; if unfinished, state that and use labeled fallback. |
| 32:30-33:30 | 1:00 | Cut the live attempt, state evidence limits, and hand back to the base Terraform checkpoint for C5. |

The operator privately resolves all explicit target values before rehearsal. Do not display their real values or an unreviewed raw response. The ACA session uses its own inspected tools and permissions; do not broaden the native Terraform validator to run it.

```text
Use the aca-sandboxes skill in the separately approved, preflight-qualified target only. Every target-sensitive aca command must explicitly pass subscription <approved-subscription>, resource group <reviewed-resource-group>, sandbox group <reviewed-sandbox-group>, and region <approved-region>; never use host defaults. Use the existing prepared sandbox <reviewed-sandbox-id>. Keep Copilot CLI/Squad on the host as orchestrator; do not claim they are running inside the MicroVM. Do not create resources, upload files, install dependencies, change egress, contact Azure deployment APIs, or change the approved lifecycle. Read only the prepared public archive manifest/hash and public module README to confirm the expected filesystem/source. In /workspaces/module, run /workspaces/bin/terraform validate -no-color and /workspaces/bin/terraform test -test-directory=tests -no-color once. Capture each real numeric exit immediately inside the sandbox, not a PowerShell success Boolean. Report the root negative-validation test count, archive source revision, sanitized output and actual prompt/skill/tool trace for validator/reviewer handoff. Then report HTTP observations for https://example.com and https://registry.terraform.io without changing rules. Do not print real Azure identifiers, credentials, or private paths. Stop the task after this single attempt; do not retry or change the sandbox lifecycle.
```

Evidence is the actual output tied to the approved target, archive revision/hash, time, and numeric exits, not the agent's summary alone. A fresh `validate` and 10/10 root negative-validation result do not deploy AKS. A 403 is an HTTP observation; attribute it to egress enforcement only if separately corroborated by inspected configuration and diagnostic evidence. Corp policy qualification remains a separate private read-back.

Keep operator records outside public source. Generic rehearsal pointers are `evidence\aca-target-preflight.json`, `evidence\aca-target-checks.txt`, and `evidence\aca-management-session.txt`; these are suggested names, not claims that target evidence already exists. Preserve timing, failures, and the exact source revision. The operator handles approved stop/cleanup off-stage under the recorded expiry and cleanup ownership.

## Fallback if capacity, plugin, or network misbehaves

- Resolve a disabled plugin before rehearsal. The disabled state was a local observation, not a universal installation default.
- If selected-target successful-work integration or prepared-resource rehearsal is incomplete, keep base C4. A saved Management-side excerpt must retain that label and its Boolean-exit/403 limitations.
- If the chosen live variant fails or reaches the cut, do not retry, switch regions, change allow rules, or start the historical fresh-sandbox flow. Show already reviewed evidence with its actual scope, or return to the original MCP demonstration.
- Direct `aca` operation is a separate manually rehearsed option, not an unrehearsed rescue during C4. No capacity or venue-network failure authorizes changes to existing infrastructure.
