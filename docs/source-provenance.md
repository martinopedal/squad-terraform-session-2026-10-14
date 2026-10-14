# Source provenance and publication copies

Audience: maintainers and presenters. Purpose: bind public source, copied
teaching material, and dated execution evidence without merging their lineages.
Use [the repository map](repositories.md) for clone/read/change instructions.

## Source and deployment table

Folders below belong to the named public clone or generic private operator
aliases. Native source, its still-pending public PR human review, the approved
one-time bootstrap and independently verified deployment are distinct milestones.
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
probe and owned test-ID deletion were independently verified October 12.
All five exact bindings and current operator group data-plane access passed;
the final list was empty. This is bounded base evidence, not complete runtime
coverage, host Copilot/Squad integration, rehearsal GO or inside-MicroVM OAuth.

| Component | Canonical repo / reference | Local folder | Where to edit | Where / how to deploy | Status |
| --- | --- | --- | --- | --- | --- |
| Session docs/deck/skills/native profiles | [Session repo](https://github.com/martinopedal/squad-terraform-session-2026-10-14) | Session clone `.\` | `docs`, `presentation\src`, `.github\skills`, `.github\agents` | Reviewed PR/normal main merge and existing Pages workflow; not Azure | Released deck 0.22.6 on main/Pages / 39 full / 5 short slides; PR22 normal merge/Pages/initial byte verification complete. Later correction bytes remain unpublished pending review/normal merge/Pages byte verification |
| Upstream AKS Automatic module | [Automatic module](https://github.com/martinopedal/terraform-azapi-aks-automatic) | `<automatic-module-clone>` | Canonical module/tests | Reviewed reusable release, consumed by demo-env `v0.6.0` | Module source, not live environment entry |
| Independent public Corp teaching module | [Corp module](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp) | `<corp-module-clone>`; session `terraform\modules\aks-automatic-corp` copy | Canonical source, then mirror/manifest through release owner | Separate private approved Corp workload consumer | Unchanged copy pin/manifest, not native MicroVM design |
| Existing Online AKS/demo VM | [Live consumer](https://github.com/martinopedal/aks-automatic-demo-env) | Consumer `deployments\online` and demo-VM root | Consumer roots/manifests/operator runbook | Existing gated workflow with private inputs/state/approval | Fresh app/2 replicas PASS under TLS bypass; canonical 26 PASS/2 BLOCKED/1 report-only, full health unproved |
| Haflidi hosted Squad ACA Jobs | [Hosted implementation](https://github.com/haflidif/squad-on-aca) | `<hosted-implementation-clone>` | Read completed authored source, leave it alone | Existing working protected service, no source/deployment change | Original SQUAD ON ACA APPS/JOBS implemented/previously demonstrated; fresh current E2E proof pending. New personal target readiness is separate; ACA SANDBOXES success does not qualify hosted Jobs |
| Owned hosted MIT fork | [martinopedal/squad-on-aca PR1](https://github.com/martinopedal/squad-on-aca/pull/1), @haflidif credit/license retained | `<owned-hosted-fork-clone>` | Accepted app/worker source | Existing owner-native Terraform is sole whole-body writer; standalone fork Bicep is not a second writer | Source accepted at `411bbf1810799bbfeea176e0c4123504a05430e8`; 71 tests/actual Linux image/UID/protected-publication CI SUCCESS; normal merge `623c1906c1b8cacd13ccd1890d3d77ad3241560`, not live E2E |
| Hosted issue/queue/bot-PR target | Private target, **not hosted source** | `<approved-target-clone>` | Approved target task/diff | One approved issue -> Actions OIDC enqueue workflow -> existing queue -> genuine Squad UID10001 worker -> trusted README App-bot PR. Deployed original mode (fresh issue #16 run observed, bot PRs left open); optional owned-fork private poller is a separate source-only lane | Original pipeline plus real ripley and fact-checker tasks observed; poller lane runtimeProven false, credential-free status-only; executed image digest unverified, no byte-identical or all-built-ins claim; historical snapshots unchanged |
| Presenter VM proposal | [Demo-env PR21](https://github.com/martinopedal/aks-automatic-demo-env/pull/21) | Approved private consumer root | Source accepted at `7b05803c81ccaf3390051cc43e13f96822e4960b`, not deployed | Haflidi/Online review and exact-plan gates unchanged, REVIEW_REQUIRED | Deallocated/current OS-disk attachment changed from earlier receipt. Preserve both disks, never swap back/recreate/delete either; refresh exact current binding/baseline/runnable SYSTEM context. No installation or VM/disk/CSE/power change |
| Native ACA SandboxGroup MicroVMs | [Demo-env](https://github.com/martinopedal/aks-automatic-demo-env) native root; [official CLI](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli) | `deployments\aca-sandboxes-online` | Separate Bicep root/sandbox-only protected lane | Primary Online; approved one-time Owner bootstrap independently verified; public source PR human review remains separate | Five exact bindings/current operator access/base probe verified October 12; cleanup empty; corrected host runtime PASS / independent acceptance complete; card runtime-ready after acceptance; second-presenter/rehearsal stage GO pending; working AKS/Corp/Jobs unchanged |
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
`b01256eb9b1ea6046b9bb8a403662f724a7b6fa7` records that sanitized result. Released
deck 0.22.6 on main/Pages has 39 full/five short slides and unchanged clocks:
PR22 normally merged October 13 at 03:57:48 UTC to
`1ed6486962362e84cbf4d7901be0154893f04ae2`; Pages run 38344163902 succeeded,
and full/short HTTP 200 bodies matched the initially accepted exports.
Older 0.22.2/0.22.3 checkpoints remain history. Later local correction bytes
remain unpublished pending independent review, normal merge and Pages byte
verification. They retain 0.22.6 and preserve design/commands/assets/39/5 slides
and clocks; a matching version or local regeneration does not publish them or
establish runtime/rehearsal readiness.

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
| Earlier hosted Jobs inventory/read-back, October 12 history | Corp, Norway East placement and two succeeded historical Oct 9 agent-job executions of 56 seconds. Earlier Manual target runner/7200-second timeout/no registered target runners and pending invitation do not describe the chosen owned poller blocker; fresh queue-driven readiness is not established |
| Earlier hosted readiness attempt, October 12 history | Scoped README-only smoke failed: Manual runner execution ended terminal Failed; associated issue queue workflow remains queued. Old zero-step queued run is untouched, not cancelled or fresh issue-to-PR success |
| Owned hosted source, October 13 | Public MIT fork/source CI accepted/normal merged with @haflidif credit; private target handoff accepted/merged with 42 source tests/runtimeProven false. Source-prepared private poller and credential-free manual status do not establish live E2E; no new registration/AppAdmin requirement |
| Private publisher / owner-native Terraform, October 13 | Publisher source accepted/merged with 18 tests, actual Docker/DNS/TLS qualification WAITING at existing human gate, zero executed steps; no image/push/digest. Combined owner-native draft has 38 Terraform mocks + 60 non-Terraform contracts PASS, full independent source review pending. Plan/apply/destroy currently unconditionally disabled; signer/current-head/private-plan transport/executable integration not provisioned. Source preparation only: executable delivery remains held, not deploy-on-merge or merely missing operator receipts; auth/budget/owner/image/Job/actual README App-bot PR pending |
| Original hosted implementation versus owned lane | Haflidi original implementation remains working/previously demonstrated; leave source/deployment unchanged. Owned fork/target source acceptance is not original-service failure or native Sandbox prerequisite. Native ACA fixture engineering is independently accepted, not hosted E2E |
| Independently verified primary Online target / base probe, October 12 | Separate demo-env `deployments\aca-sandboxes-online` source and sandbox-only protected lane. Approved one-time Owner bootstrap Succeeded; live exact five bindings, group configuration and operator data-plane list passed. Credential-free base exec/public-fs/stop-resume/delete verified; empty cleanup list. Standard managed network, no Corp BYO VNet/UAMI/FIC transplant. Public source PR human review remains separate; accepted host fixture engineering is recorded below, second-presenter/rehearsal/selected Terraform variant remain pending. Corp/AKS/Jobs untouched |
| Host ACA authentication and wrong-target doctor | Auth status exit 0, ARM/data-plane tokens authenticated only. Actual doctor 9/9 exit 0 printed cached Management/Norway East despite explicit target flags; not Corp/Online preflight. Compare printed target and independent exact-ID read-back; no config change/Management fallback/create |
| Actual local MXC / optional cloud help | Local startup exit 1 before command on proxy/masking/auth loopback/private-network requirement; no bypass/global change. Cloud explicit help parse exit 0 is not entitlement, billing or runtime |
| [Official ACA CLI quickstart](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli), full article retrieved October 12 | Install/version, Azure auth, group provisioning/Data Owner attempt/`--set-config`, doctor, label-based create/exec/delete and cleanup; agent-skill next step explicitly supports host Copilot-driven commands. Do not copy implicit default targeting, create/delete or stale auth examples. HTML canonical points to containerapps.azure.com same path, whose direct fetch returned 404 here |
| Fresh existing Online cluster validation, corrected scoring | App/source-matching assets/two replicas PASS with explicit TLS bypass. Canonical 26 PASS/2 BLOCKED/1 report-only, not 29/29; supplemental 10 PASS/1 FAIL (untrusted/mismatched TLS)/1 NOT_APPLICABLE (external `/healthz`; source requires direct-pod `/healthz` 200 `ok`). Native Kubernetes/ResourceHealth unavailable; full health unproved. Eleven policy-noncompliant resources are in the demo RG across AKS/network/state, not 11 cluster failures or subscription-wide |
| Earlier host Copilot/Squad attempt, controlled learning history | Approximately 77-second local CRLF failure: source transport/cleanup passed, positive work failed and downstream challenges blocked. Corrected source/parser qualification supersedes this as current runtime status; not a global ACA failure |
| Corrected host runtime receipt, October 12 | Actual host coordinator/worker/ACA tools/guest summary/cleanup handoff; one 26.768-second sandbox. LF/source-byte hash round trip, three guest checks/JSON+SHA, actual guest/host exit23, one HTTPS403 plus new exact-sandbox networkEgress.denied causal audit, exact deletion/empty list/NotFound/watchdog stopped. Independent evidence acceptance complete; card runtime-ready after acceptance, not human rehearsal/stage GO or inside-guest agents/OAuth |

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
