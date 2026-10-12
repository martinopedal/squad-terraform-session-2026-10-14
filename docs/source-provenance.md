# Source provenance and publication copies

Audience: maintainers and presenters. Purpose: bind public source, copied
teaching material, and dated execution evidence without merging their lineages.
Use [the repository map](repositories.md) for clone/read/change instructions.

## Source and deployment table

Folders below belong to the named public clone or generic private operator
aliases. Lead's proposed native source folder/workflow is explicitly not
existing/deployed; authority and new exact-plan qualification are pending.
The [README entry table](../README.md#source-and-deployment-table)
mirrors this map.

**Repo visibility is separate from network placement:** linked source repos are
public, but secrets/state/approvals are not. Eligible demo components use Online
as primary placement, not fallback/policy avoidance. Corp-required private
workloads stay Corp. AKS public-app ingress does not make native SandboxGroup
control-plane access anonymous; its authenticated scope may remain private.
Existing working AKS/Corp/hosted Jobs remain unchanged. Do not redeploy for a
checklist or infer repair authorization from TLS/native-API limits. The new
native five-object Online setup/credential-free Ubuntu 1 CPU/2 GiB ten-minute
probe and owned test-ID deletion have scope consent. Source is being prepared;
actor authority/policy/budget/new plan/exact manifest approval remain pending.
No deployment/runtime/integration or inside-MicroVM OAuth approval is inferred.

| Component | Canonical repo / reference | Local folder | Where to edit | Where / how to deploy | Status |
| --- | --- | --- | --- | --- | --- |
| Session docs/deck/skills/native profiles | [Session repo](https://github.com/martinopedal/squad-terraform-session-2026-10-14) | Session clone `.\` | `docs`, `presentation\src`, `.github\skills`, `.github\agents` | Reviewed PR/normal main merge and existing Pages workflow; not Azure | Draft 0.22.4; branch/PR differs from released Pages |
| Upstream AKS Automatic module | [Automatic module](https://github.com/martinopedal/terraform-azapi-aks-automatic) | `<automatic-module-clone>` | Canonical module/tests | Reviewed reusable release, consumed by demo-env `v0.6.0` | Module source, not live environment entry |
| Independent public Corp teaching module | [Corp module](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp) | `<corp-module-clone>`; session `terraform\modules\aks-automatic-corp` copy | Canonical source, then mirror/manifest through release owner | Separate private approved Corp workload consumer | Unchanged copy pin/manifest, not native MicroVM design |
| Existing Online AKS/demo VM | [Live consumer](https://github.com/martinopedal/aks-automatic-demo-env) | Consumer `deployments\online` and demo-VM root | Consumer roots/manifests/operator runbook | Existing gated workflow with private inputs/state/approval | Fresh app/2 replicas PASS under TLS bypass; canonical 26 PASS/2 BLOCKED/1 report-only, full health unproved |
| Haflidi hosted Squad ACA Jobs | [Hosted implementation](https://github.com/haflidif/squad-on-aca) | `<hosted-implementation-clone>` | Read completed authored source, leave it alone | Existing working protected service, no source/deployment change | Implemented/previously demonstrated; new target/rehearsal pending is separate |
| Hosted issue/queue/bot-PR target | Intended private target, **not hosted source** | `<approved-target-clone>` | Approved target task/diff | Issue/label -> existing hosted queue/Job -> bot PR | Access acceptance/current read-back and fresh chain pending |
| Native ACA SandboxGroup MicroVMs | [Demo-env](https://github.com/martinopedal/aks-automatic-demo-env) new native root; [official CLI](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli) | New `deployments\aca-sandboxes-online`, implementation preparing | Separate Bicep root/sandbox-only protected lane | Primary Online; five-object setup/credential-free probe scope approved, but actor/policy/budget/source/new plan/exact manifest qualify separately | Source repair in progress, not deployed/runtime-tested/plan-approved; preserve working AKS/Corp/Jobs, no integration GO |
| Local Copilot sandbox | [GitHub local sandbox docs](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing) | Presenter host cwd | Approved local sandbox policy, not repo guidance as enforcement | Native MXC, not Azure deployment | Startup exit 1/policy blocked; no global change/bypass |

The demo starts from an existing public AKS Terraform root configuration. Its inherited code and known issues are not presented as newly generated work.

| Material | Source |
| --- | --- |
| Starting AKS root configuration | `martinopedal/terraform-azapi-aks-automatic`, commit `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24` |
| Live demo consumer | `martinopedal/aks-automatic-demo-env`; pins `martinopedal/terraform-azapi-aks-automatic` by tag `v0.6.0` |
| Copied Corp teaching module, separate lineage | `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp`; unchanged source-copy manifest, not the live demo consumer binding |
| Presentation and source copy | `martinopedal/squad-terraform-session-2026-10-14` |
| Haflidi hosted implementation | [haflidif/squad-on-aca](https://github.com/haflidif/squad-on-aca); public GitHub metadata checked October 12, description identifies event-driven Squad agents on ACA Jobs |
| Hosted demo issue/queue/bot-PR target | Intended private target, not hosted implementation source; generic `<approved-private-target>` operator binding, not runnable from public session docs alone |
| Squad starter | Historical starter provenance: Squad CLI 0.13.0; generated separately without copying private team histories. Current validation is Squad 1.0.1 (2026-10-08). |
| Squad CLI reference | https://raw.githubusercontent.com/bradygaster/squad/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/reference/cli.md at commit `93aec83accb44e08c39e4a799f13b55208215a13`; checked 2026-10-08; used to audit command and flag mentions |
| Rubber Duck GA badge and appendix note | https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/; dated 2026-06-02; used only for `GA · 2026-06-02` and `/rubber-duck` availability. Background second-opinion wording cross-checked against https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/ (2026-04-06). |
| Azure Functions skills source chip | https://github.com/azure/azure-functions-skills; fetched 2026-10-08 through the Fact Checker; used only for the weakened wording that Azure Functions-specific skills improve task guidance, not for a model-independent consistency claim. |
| GitHub Copilot product name and logo permission boundary | https://brand.github.com/brand-identity/copilot and https://brand.github.com/foundations/logo; fetched 2026-10-08. Deck uses a text-only product name; official logo use requires GitHub brand permission. |
| Cascadia Code command font | https://github.com/microsoft/cascadia-code/releases/tag/v2407.24 for `CascadiaCode.woff2`; license from https://raw.githubusercontent.com/microsoft/cascadia-code/main/LICENSE and OFL FAQ from https://raw.githubusercontent.com/microsoft/cascadia-code/main/OFL-FAQ.txt; fetched 2026-10-08; bundled under `presentation\media\fonts\`. |

The original root mixed infrastructure and Kubernetes application configuration. Local checks identified structural, formatting, lint, and test-isolation failures. The public reusable module must establish its own clean boundary and validation evidence rather than carry those failures into a new repository.

The independently published copied teaching module is pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`. Its source tree `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8` and the copy under `terraform\modules\aks-automatic-corp\` must match. [The publication manifest](../terraform/module-source.json) records the exact revision, Git tree, and file blob hashes. This pin must not be substituted for the separate live consumer's `v0.6.0` module pin.

The independent module repository has a credential-free workflow. Terraform matrix run 36990206303 passed on the first CI commit; native agent setup passed in run 37286068987; final module verification passed in run 37286237657; and the Azure-validation documentation release passed in run 37305768318.

The existing landing-zone implementation is a dependency of the private deployment environment, not source to copy into this repository. Public examples use placeholders and explicit platform-owned inputs. No real environment identifiers, state, secrets, or private policy evidence are included here.

Documentation/generated source and executed evidence are distinct. Private Azure
deployment/read-back pinned runtime module commit
`02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; public Corp module revision
`b01256eb9b1ea6046b9bb8a403662f724a7b6fa7` records that sanitized result. Deck 0.22.4
preserves accepted 0.22.3 and completes the repo-map/progress/product-flow
pass with unchanged on-screen markup, five/39 slides and clocks. It is local
pending review/release; live Pages remains 0.22.2.

## October 12 sandbox and readiness sources

| Source / observation | Scope, not inferred acceptance |
| --- | --- |
| [GitHub cloud/local sandbox concepts](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes), fetched October 12 | Local default off; Windows proxy/file-tool/remote-MCP limits. GitHub-managed cloud is ACA-backed preview with GitHub identity/policy/billing, interactive-only `copilot --cloud --experimental`, never `-p`/`-i`; organization/enterprise access off by default and stopped storage billed |
| Native Copilot CLI 1.0.94 help and experimental help | Neither exposes `--cloud` here; documented preview/account-build gate, not rehearsed availability. Standalone sandbox help offers `ca`, not interactive `/sandbox status` |
| Installed `copilot help sandbox` | Explicit one-session `--sandbox` documentation despite top-level-help omission; needs actual backend/session preflight. Windows build 26300 is OS metadata, not successful backend operation |
| [Squad ACA scenario](https://github.com/bradygaster/squad/blob/main/docs/src/content/docs/scenarios/azure-container-apps.md) and [container-image reference](https://github.com/bradygaster/squad/blob/main/docs/src/content/docs/reference/container-image.md), read October 12 | Hosted Apps/Jobs with workload identity, Key Vault and KEDA; not MicroVMs or an ACA sandbox-group resource. Squad 1.0.1 help has no sandbox verb |
| Operator's native laptop result | Corrected read-only preflight 18/18 on one laptop; 46/46 controlled helper regressions plus three harmless native checks on each PowerShell 7 and 5.1; not both presenters, clean VM/manual sign-in or full rehearsal |
| Operator's current sanitized Corp qualification | Source merged, new qualification blocked on an unexpected change-type check; no apply performed. Last 8 present / 3 absent baseline still lacks connection/two presenter Data Owner grants; no new sealed manifest/raw exact deltas. Fresh explicit ARM get Succeeded/no VNet connections, native scoped list 403/exit 1; convergence/access/runtime remain unproved |
| Earlier source-only correction receipt | Contracts 34/34, artifacts 85/85, runtime 31/31, workflow 17/17, checkout 10/10, toolchain 12/12 and GitHub-script 10/10 PASS as source/tooling checks, two Linux smokes skipped on Windows. These precede blocked live qualification; no apply/runtime claim |
| Current Azure MCP AKS read-back | Both existing Online and Corp clusters Automatic SKU/Standard tier, provisioning Succeeded and power Running; no redeploy indicated by metadata, not full nodepool/runtime qualification. Online app HTTP 200 with branded NIC/AKS text used explicit known-demo certificate bypass, not TLS certificate validation or a fresh 29-check security suite |
| Operator's native hosted Jobs inventory/read-back | Corp, Norway East placement and two succeeded historical Oct 9 agent-job executions of 56 seconds. Manual target runner, 7200-second timeout, no registered target runners and pending private invitation; fresh queue-driven readiness is not established |
| Operator's fresh hosted readiness attempt | Scoped README-only smoke failed: existing Manual runner execution ended terminal Failed; associated issue queue workflow remains queued, not fresh issue-to-queue-to-job-to-PR success |
| Supplied hosted progress / attribution | Two historical Oct 9 queue successes are shared-demonstration smoke, not current health/full bot PR. Fresh issue open, queue queued, no open PR at 10:28 UTC; image pull then short-lived registration failure. No newly confirmed Haflidi-authored technical update in supplied bounded search; request revision/fresh sanitized chain evidence |
| Original hosted implementation versus new target | Haflidi original implementation completed/previously demonstrated; leave source/deployment unchanged. Fresh personal target registration/access/rehearsal failure is not evidence that original is missing/broken and is not native Sandbox prerequisite. Native ACA integration is remaining build |
| Native Online target direction / forwarded lead plan | Proposed demo-env `deployments\aca-sandboxes-online` plus separate sandbox-only workflow/protected `online` environment; neither exists/deployed yet. Separate group/RG, standard managed network if policy allows, no Corp BYO VNet/UAMI/FIC transplant. Candidate RG read-back 404. Graph proposal: RG + SandboxGroup + two group Data Owner grants; conditional RG Contributor for existing GitHub actor if needed. Actor authority/exact new scope/source/plan qualification pending; no apply approval. Corp/AKS/Jobs untouched |
| Host ACA authentication and wrong-target doctor | Auth status exit 0, ARM/data-plane tokens authenticated only. Actual doctor 9/9 exit 0 printed cached Management/Norway East despite explicit target flags; not Corp/Online preflight. Compare printed target and independent exact-ID read-back; no config change/Management fallback/create |
| Actual local MXC / optional cloud help | Local startup exit 1 before command on proxy/masking/auth loopback/private-network requirement; no bypass/global change. Cloud explicit help parse exit 0 is not entitlement, billing or runtime |
| [Official ACA CLI quickstart](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli), full article retrieved October 12 | Install/version, Azure auth, group provisioning/Data Owner attempt/`--set-config`, doctor, label-based create/exec/delete and cleanup; agent-skill next step explicitly supports host Copilot-driven commands. Do not copy implicit default targeting, create/delete or stale auth examples. HTML canonical points to containerapps.azure.com same path, whose direct fetch returned 404 here |
| Fresh existing Online cluster validation, corrected scoring | App/source-matching assets/two replicas PASS with explicit TLS bypass. Canonical 26 PASS/2 BLOCKED/1 report-only, not 29/29; supplemental 10 PASS/1 FAIL (untrusted/mismatched TLS)/1 NOT_APPLICABLE (external `/healthz`; source requires direct-pod `/healthz` 200 `ok`). Native Kubernetes/ResourceHealth unavailable; full health unproved. Eleven policy-noncompliant resources are in the demo RG across AKS/network/state, not 11 cluster failures or subscription-wide |

Public GitHub metadata independently confirmed all five linked source/consumer
repos as public, including the Corp module and Haflidi implementation. Metadata
does not confirm collaborator rights or runtime. [Progress/next actions](sandboxing.md#october-12-progress-and-next-actions)
and [two product flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes)
keep source ownership and acceptance separate.

These observations update placement/readiness only. Historical Management-side MicroVM 10/10 tests, Boolean-exit limitations and HTTP 200/403 observations remain historical. Host installation is not in-MicroVM execution; sign-in/storage/egress need separate consent without copying host authentication. No raw private identifiers, policy records or run URLs are published.

## Playbook reference sources

The verified session playbook in [`docs/playbook.md`](playbook.md) was researched on 2026-10-08 from these public references:

| Topic | Source |
| --- | --- |
| Squad pinned CLI behavior | <https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/reference/cli.md> |
| Squad installation, init, and upgrade | <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/get-started/installation.md> |
| Squad current existing-repo scenario | <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/scenarios/existing-repo.md> |
| Squad skills | <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/skills.md> |
| Squad ceremonies | <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/ceremonies.md> |
| Squad Ralph/watch | <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/ralph.md> |
| Squad self-upgrade | <https://raw.githubusercontent.com/bradygaster/squad/main/docs/src/content/docs/features/self-upgrade.md> |
| Copilot CLI usage | <https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli> |
| Copilot CLI command reference | <https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference> |
| Copilot custom agents | <https://docs.github.com/en/copilot/reference/custom-agents-configuration> |
| Copilot CLI MCP servers | <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers> |
| Copilot CLI skills | <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills> |
| Copilot CLI custom instructions | <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions> |
| Demo environment README | <https://github.com/martinopedal/aks-automatic-demo-env/blob/main/README.md> |
| Demo environment operations runbook | <https://github.com/martinopedal/aks-automatic-demo-env/blob/main/docs/operations-runbook.md> |
