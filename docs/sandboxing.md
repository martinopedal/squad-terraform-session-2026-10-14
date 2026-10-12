# Sandboxing and Squad: four execution hosts

Audience: presenters and operators. Purpose: separate product availability, actual runtime evidence, blockers, and next actions. Status below uses the October 12 operator packet through 10:28 UTC, with the later supplied host-authentication read-back explicitly scoped to tokens.

Squad is coordination/configuration over the hosting Copilot session, not a sandbox product. Installed Squad 1.0.1 help contains no sandbox verb. Choose and qualify the execution host separately; a worktree/tool filter does not isolate credentials.

The four **demo lanes** are existing Online AKS, native ACA SandboxGroup MicroVMs,
hosted Squad ACA Jobs issue-to-PR, and local Copilot sandbox. They are independent.
Native ACA uses the existing Online placement but a separate group/resource group,
not AKS or the hosted Jobs/runner. Standard managed networking is the proposed
design if policy allows, not Corp BYO VNet/UAMI/FIC transplantation. No candidate
group has been created/deployed/tested here. The table below instead compares
four **sandbox execution hosts**, including the additional optional
GitHub-managed cloud lane; AKS is not a sandbox host in that comparison.

| Execution story | Ownership and boundary | Session status, October 12 |
| --- | --- | --- |
| Copilot local `/sandbox` | Host OS/MXC isolation, with local filesystem/network policy | Actual Windows startup failed before the command, exit 1; local policy blocked |
| GitHub-managed Copilot cloud sandboxes | Built on ACA, with GitHub identity, policy, and billing; preview | Help parse exited 0; account access, billing, and runtime remain unproved |
| Customer-managed ACA MicroVMs via `aca` | Customer Azure group, data-plane access, egress and lifecycle | New Corp qualification blocked; no apply performed. Existing Online placement is primary for eligible demos; the new separate native group/RG remains proposed and unqualified |
| Squad on ACA hosted Apps/Jobs | Queue-driven agent hosting with workload identity, Key Vault and KEDA | Historical hosted demonstration; fresh issue open, queue queued, runner registration blocked |

Hosted Apps/Jobs are not MicroVMs and do not use an ACA sandbox-group resource. Installing Copilot CLI, Squad, or `aca` on the host is not proof those programs ran inside a MicroVM. Full CLI+Squad process/agent/prompt proof requires actual in-MicroVM execution and separately consented supported sign-in, storage, and egress. Never copy host authentication into a sandbox.

Squad inside a customer-managed ACA MicroVM is an intended in-MicroVM installation/execution variant, not a fifth product. It is not currently executed or qualified. See [its installation, sign-in and process-evidence gates](aca-sandboxes.md#intended-variant-squad-inside-a-customer-managed-aca-microvm); it is separate from hosted Apps/Jobs and from C4's uncredentialed Terraform checks.

## Copilot local sandboxing

- GitHub announced local sandboxing as generally available on 2026-10-07 for Copilot CLI, the Copilot app, and VS Code sessions that use Agent Host.
- The feature is powered by [Microsoft eXecution Container (MXC)](https://github.com/microsoft/mxc).
- In the native interactive UI, use `/sandbox enable`, `/sandbox status`, and policy controls. Standalone `copilot sandbox --help` on 1.0.94 offers `ca`, not `status`; slash commands are not shell subcommands.
- Installed `copilot help sandbox` explicitly documents the one-session `--sandbox` flag despite top-level-help omission. It is documented by installed help, but needs actual backend/session preflight. Windows host build 26300 is OS metadata, not successful sandbox backend operation.
- Actual native Windows local-MXC startup exited 1 before the requested command. Proxy/masking/authentication need host loopback/private-network allowance, while local network access is denied by current policy. No policy bypass or global setting change was made. The policy owner must approve any bounded change and the operator must rerun an actual sandboxed command before claiming success.
- Local sandboxing is off by default.
- By default, sandboxed commands can write inside the current working directory and temporary folders. Outbound internet access is on by default. Local network access is off by default.
- On Windows, local sandboxing requires Windows 11 25H2 with KB5124010 or later, or Windows 11 26H1 with KB5124006 or later.
- On Windows, proxy rules require Allow local network and applications honoring the proxy. Built-in file tools honor policy best-effort; remote MCP servers are not sandboxed.

## GitHub-managed cloud sandboxes

[GitHub's documentation](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes) describes `copilot --cloud --experimental` for interactive-only cloud sessions. Never combine it with `-p` or `-i`. Organization/enterprise Cloud Sandbox access is off by default and paid usage includes stopped storage.

Neither `copilot --help` nor `copilot --experimental --help` exposed `--cloud` in the local 1.0.94 checks on October 12. The explicit `copilot --cloud --experimental --help` parse exited 0. That is not an account-access, billing, entitlement, UI/login, runtime, or full-Squad test. Treat this as a documented preview/account-build gate, not qualified availability. It remains a separate optional lane.

## October 12 progress and next actions

Read [the repo map](repositories.md) before choosing a clone. The session repo owns public teaching material; demo-env owns the live Online AKS consumer. The public Corp module is independently reusable. Haflidi's implementation is `haflidif/squad-on-aca`; the private issue/queue/bot-PR target is not that implementation.

| Lane / gate | Owner | Date / state | Actual evidence and proof limit | Blocker / next action |
| --- | --- | --- | --- | --- |
| Customer-managed Corp ACA MicroVM | Operator + independent reviewer | Oct 12, BLOCKED | Corp source correction merged. New qualification blocked on an unexpected change-type check; no apply performed. Last recorded baseline: 8 present / 3 absent, with group present, default VNet connection and two presenter Data Owner grants missing | Devrel repairs private failed-plan diagnostic retention separately; no scope weakening. New sealed manifest/exact deltas and full convergence/effective access remain unavailable |
| Primary Online ACA placement / new implementation | Native implementation owner + operator + reviewer | Oct 12, SCOPE APPROVED / SOURCE PREPARING | Separate group/RG; new demo-env `deployments\aca-sandboxes-online` Bicep/sandbox-only protected lane preparing. Five-object setup and one credential-free Ubuntu 1 CPU/2 GiB ten-minute probe/delete-only-new-test-ID approved | Actor authority/policy/budget/source/new plan/exact manifest pending; no deployment/runtime/integration PASS or inside-VM OAuth. No AKS/Jobs/Corp modification |
| Native MicroVM runtime / in-VM Copilot + Squad | Operator + consenting presenter | Oct 12, BLOCKED | No successful Corp sandbox creation/runtime test or full CLI+Squad execution inside a MicroVM is established | Complete [the full coverage checklist](aca-sandboxes.md#full-test-coverage-checklist); actual lifecycle/exec/fs/egress/suspend/resume/offline Terraform and in-VM process/agent/prompt evidence required |
| Host Copilot CLI/Squad driving native isolated work | Presenter + native operator | Oct 12, BLOCKED | Official quickstart supports agent-skill-driven commands, but no working Online MicroVM/prompt-tool-validation-handoff trace exists | Qualify native target/runtime, then actual host Squad brief/ACA skill/tool requests/in-MicroVM public filesystem/offline tests/numeric exits/reviewer handoff. Advanced in-VM CLI/Squad OAuth/install is optional, not a prerequisite for this basic claim |
| Native target/auth/doctor | Lead + operator | Oct 12, WRONG TARGET / BLOCKED | Host auth status exit 0 proves tokens only. Actual doctor 9/9 exit 0 printed cached Management/Norway East, not requested Corp despite explicit flags | Compare printed subscription/RG/group/region with approved target and independent exact-ID read-back. Resolve flag/config behavior read-only; no config change, Management fallback or create authorized |
| Original Haflidi hosted implementation | Haflidi | DONE / PREVIOUSLY DEMONSTRATED | `haflidif/squad-on-aca` is implemented and previously demonstrated | Leave original source/deployment alone; separate new target smoke is not evidence it is broken/missing, and not native Sandbox prerequisite |
| Separate personal hosted target/rehearsal | Target operator + presenters | Oct 12, ACCESS/REGISTRATION PENDING | Historical target queue successes do not establish this new target/rehearsal. Fresh issue open, associated issue queue workflow remains queued/no PR at 10:28 UTC | New target runner image pulled then short-lived registration failed. Qualify only separate target access/registration/rehearsal if selected; do not rebuild/change original implementation |
| Haflidi current technical confirmation | Haflidi + presenter coordinator | Oct 12, UNKNOWN | Historical shared-demonstration records exist; no newly confirmed Haflidi-authored current technical update was found in the supplied bounded search | Ask Haflidi to confirm the implementation revision and a fresh sanitized chain result. Do not attribute Martin's historical status reports to him |
| Local Windows OS/MXC | Policy owner + operator | Oct 12, BLOCKED | Actual startup exit 1 before command; proxy/masking/auth loopback/private-network requirement | Only an authorized policy-scope change followed by a real runtime rerun can close this; no global change or bypass |
| GitHub-managed cloud | Account owner + operator | Oct 12, PENDING | Explicit help parse exit 0 only, not launched | Check account policy, entitlement, billing and an actual interactive session if selected; cannot stand in for customer-owned MicroVM readiness |
| Presenter setup | Both presenters | Oct 12, PARTIAL | One laptop 18/18; helper 46 scenarios + 3 native checks per PowerShell engine | Second host, manual agents/MCP/login, clean-VM setup and timed 60-minute rehearsal remain pending |
| Hosted target invitation | Haflidi + operator | Oct 12, NEEDS ACCEPTANCE / CURRENT READ-BACK | Existing WRITE invitation was pending in last read-back, not accepted permission | Accept the existing invitation, then verify collaborator rights; do not reinvite for checklist completion |
| Online/Corp AKS and app | Operator | Earlier Oct 12, METADATA ONLY | Both AKS Succeeded/Running; branded Online HTTP 200 with explicitly known TLS bypass | Not current TLS/security suite or MicroVM readiness; C1 fresh OnlineSecurity 29 + DemoVM checks scheduled Oct 13 |
| Fresh full Online AKS health | Separate cluster reviewer | Oct 12, PARTIAL / BLOCKED, corrected scoring | App/source-matching assets/two replicas PASS with TLS bypass; canonical 26 PASS/2 BLOCKED/1 report-only, supplemental 10 PASS/1 FAIL (TLS)/1 NOT_APPLICABLE (external `/healthz`; source requires direct-pod 200 `ok`) | Native Kubernetes/ResourceHealth unavailable; full health unproved. Eleven noncompliant resources within demo RG incl AKS/network/state, not 11 cluster failures/subscription-wide. No renewed 29/29/full TLS or native readiness; C1 Oct 13 remains |
| MCP warmup / cleanup / expiry | Martin + resource owners | SCHEDULED | C2 minreplicas 1 Oct 13, revert Oct 14; teardown Oct 17, credential expiry Oct 31 | Exact reviewed changes/deletion and cost stop need separate proof; dates are not completion |

The USD 20 total budget through October 31 is an **alert, not a hard cap**. Retained Corp resources consume budget; primary Online placement is not promised free. Five-minute autoSuspend is not a hard active timeout or credential revocation. Suspended native MicroVM compute charges stop; storage can continue. GitHub cloud billing and hosted Jobs costs are separate. Repo visibility is not network placement; Online primary eligible demos do not move Corp-required private workloads.

## Current evidence boundary

One laptop's corrected read-only preflight passed 18/18: Copilot CLI 1.0.94, Squad 1.0.1, ACA CLI 1.0.0-preview.4, and the installed enabled official `sandboxes@Azure-Container-Apps` plugin 0.0.5-beta. Controlled helper regressions and harmless native helper checks passed on PowerShell 7 and 5.1. This does not qualify both presenters, a clean VM, manual sign-in, full rehearsal, or MicroVM execution.

The scoped README-only hosted smoke failed: existing Manual runner execution ended terminal Failed; associated issue queue workflow remains queued. Fresh queue-driven readiness is not established. Historical Oct 9 successes do not prove today's chain. Earlier contracts 34/34, artifact suite 85/85 and runtime suite 31/31 are source/tooling checks, not Azure sandbox execution. The subsequent read-only qualification was attempted and blocked; there is no new sealed manifest/raw exact delta or apply result.

The [two product flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes)
are hosted Squad agent work to bot PR, and native isolation for host Copilot/
Squad-driven work. VM location is presenter-host detail. Standalone lifecycle/
hello checks are pre-stage prerequisites, not integration; in-MicroVM CLI/Squad
is a separate advanced optional variant. No current Online integration GO.

Use [ACA evidence and the C4 gate](aca-sandboxes.md) for customer-managed MicroVMs and [the readiness table](run-plan.md#october-12-readiness-evidence) for stage decisions. Base C4 remains the default; all four runtime lanes are separate.

Sources:

- <https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/>
- <https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing>
- <https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes>
- <https://github.com/bradygaster/squad/blob/main/docs/src/content/docs/scenarios/azure-container-apps.md>
- <https://github.com/bradygaster/squad/blob/main/docs/src/content/docs/reference/container-image.md>
- <https://github.com/haflidif/squad-on-aca>
- <https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli>
