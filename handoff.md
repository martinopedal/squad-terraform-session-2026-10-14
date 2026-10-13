# Public project handoff

Haflidi original `haflidif/squad-on-aca` is implemented/previously demonstrated;
leave source/deployment alone. Owned fork/target/publisher source is accepted/
merged, but current runtime holds are separate, not proof original is broken/missing and not native
Sandbox prerequisite. Native Online provisioning/access/base is verified;
corrected ACA SANDBOXES host runtime passes, independent acceptance complete,
then runtime-ready. Human stage GO and fresh SQUAD ON ACA APPS/JOBS E2E remain
separate; earlier CRLF is learning history.

Updated October 13, 2026. This file describes the public deliverables and the remaining release gates. Private environment inputs and operational evidence are intentionally absent.

## Current result

- Released Reveal.js **deck 0.22.6** on main/Pages, **39 full / 5 short slides**: PR22 normally merged October 13, Pages succeeded and full/short HTTP 200 bodies matched the initially accepted exports. Later local correction bytes remain unpublished pending independent review, normal merge and Pages byte verification. Existing design/commands/media/IDs/clocks are unchanged; publication is not runtime or human stage GO.
- A five-slide companion deck is built at `presentation\short\index.html`.
- Current delivery contract: **3:00 intro; planned content to about 55:00; 55:00-58:00 protected recovery block; 58:00-60:00 close**. The planned content includes **29:00 of live C0-C7 demo chapters** and the rest as live explanation. Questions are only if time allows. There is no scheduled Q&A block. See [docs/run-plan.md](docs/run-plan.md) for the full minute-by-minute schedule.
- Live-demo rule: **C0-C7 are live**, with optional reviewed fallback evidence if a chapter fails live.
- Sessionize copy, feature guide, prompt pack, repeatability eval, and the C0-C7 operator runbook are present in the public repository.
- Public reusable Terraform module and synthetic caller remain locally qualified and privately Azure-validated through IaC.

Native profile selection and full human rehearsal remain separate verification gates. The presenter manually runs the four-product bootstrap file for the GitHub Copilot desktop app, Squad, VS Code, and GitHub Copilot CLI. Its controlled execution tests do not establish clean-VM installation or manual device-code login; that operator rehearsal remains required. Optional fallback evidence may still be refreshed later, but the live-first contract stays unchanged.

## Public locations

- [Repository map: clone/read/change and private boundary](docs/repositories.md)
- [Live Reveal presentation](https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/)
- [Session repository](https://github.com/martinopedal/squad-terraform-session-2026-10-14)
- [Reusable module repository](https://github.com/martinopedal/terraform-azapi-aks-automatic)
- [Online/demo-VM environment repository](https://github.com/martinopedal/aks-automatic-demo-env)
- [Independent module repository](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp)
- [Module-copy manifest](terraform/module-source.json)
- [Full speaker script](docs/talk-track.md)
- [Sessionize text](docs/sessionize.md)
- [Feature guide](docs/feature-guide.md)
- [C0-C7 demo runbook](docs/demo-runbook.md)
- [Run plan: countdown, run sheet, preflight](docs/run-plan.md)
- [C0 clean-machine demo](docs/clean-machine-demo.md)
- [Bootstrap guide](docs/bootstrap.md)

The live demo consumer is `martinopedal/aks-automatic-demo-env`, pinning `martinopedal/terraform-azapi-aks-automatic` by `v0.6.0`. The separate copied Corp teaching module from `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` remains pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`. Its 35-file Git tree is `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8`. The copy under `terraform/modules/aks-automatic-corp` and its manifest must retain that same binding.

## Verified and unverified

| Area | Evidence |
| --- | --- |
| Terraform local qualification | Terraform 1.16.4 / Windows AMD64, AzAPI 2.12.0, TFLint 0.64.0. Both roots passed formatting, validation, and lint. |
| Contract tests | 52 module cases and two caller cases passed, all plan-mode mocks. |
| Mutation evidence | Wrong SKU and public-API mutations each failed the intended assertion; the unchanged 52-case suite passed after each exact restoration. |
| Module review | Independent static and publication-safety reviews passed for the qualified source. |
| Earlier presentation checks | Ten media-policy tests, 99 browser/content checks, and slide/fragment captures across two resolutions. The updated evidence slide was visually inspected. These counts describe earlier evidence, not the current revision's test run. |
| Earlier deck 0.22.0 checks, October 9 | 39 Node tests passed, including the actual bootstrap script with controlled native-executable mocks. The short deck passed 43 browser checks across 10 captures; the full deck passed 102 interaction/content checks across 88 captured states at two resolutions. The static setup checker and its 45 tests passed. These are local checks, not clean-VM/manual-login rehearsal or new Azure validation. |
| Earlier deck 0.22.1 checks, October 9 | 40 Node tests passed. The short deck passed 43 browser checks across 10 captures; the full deck passed 102 interaction/content checks across 88 captured states. The static setup checker and its 45 tests passed again. This revision corrects Azure MCP documentation dates and sources, qualifies legacy annual billing, and replaces machine-specific checkout examples. The separate clean-VM/manual-login and Corp gates remain open. |
| Earlier deck 0.22.2 checks, October 9 | 41 Node tests passed. The short deck passed 43 browser checks across 10 captures; the full deck passed 102 interaction/content checks across 88 captured states at two resolutions. Removing the C4 qualification note from the real source failed the new regression as intended; restoration passed. Generated hashes, five/39 slide counts, unchanged on-screen markup, and 55:00/3:00/2:00 timing were checked. These are local presentation checks, not a Corp deployment, actual-authentication check, or clean-VM/manual-login rehearsal. |
| Local deck 0.22.3 checks, October 12 | Build passed; 47 Node tests, 43 short-deck browser checks across 10 captures, and 102 full-deck interaction/content checks across 88 states at two resolutions passed. Static setup checker and 45 tests passed; exact non-note slide objects and all eight on-screen demo blocks match the previous source. Real-source mutations removing a host distinction, claiming Corp MicroVM runtime passed, and misplacing hosted Jobs under Management each failed the intended guard; all mutations were restored. Five/39 slides, 29 demo minutes, C4 32:30 cut and 55:00/3:00/2:00 clock are unchanged. These are presentation/source-safety checks, not runtime/authentication/rehearsal or release evidence. |
| Local deck 0.22.3 receipt follow-up, October 12 | Rebuild passed after installed-help/local-flag, source/proposal-only capture and failed hosted-smoke updates. All 23 targeted media/short-deck Node tests, 43 short-browser checks and 102 full-browser checks passed; on-screen slide objects/demo blocks, clocks and protected sources remain identical. The earlier 47-test full Node and 45-test static setup runs above remain separately scoped evidence. No new backend, Azure deployment, MicroVM runtime, hosted end-to-end success or publication is inferred. |
| Hosted module CI | Terraform matrix run 36990206303 passed at b7133679a89b1e2b36677400d659a03907c0f3f6; native agent setup passed run 37286068987 at 00787f59ac19e3db0c3869a96ff45805c6cb523d; final module run 37286237657 passed at 02e10e56bc15cc30c3193dce3ddc8e608cb87daf; Azure-validation docs release run 37305768318 passed at b01256eb9b1ea6046b9bb8a403662f724a7b6fa7. |
| AKS Azure, historical October 5 | **Privately validated for that run.** Private IaC PR workflow planned, environment-approved, applied, and read back runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; sanitized public facts only. Not current sandbox or hosted Jobs acceptance. |
| October 12 native tools / one laptop | Copilot CLI 1.0.94, Squad 1.0.1, ACA CLI 1.0.0-preview.4, enabled official plugin 0.0.5-beta; corrected read-only laptop preflight 18/18 PASS. Banner terminal-period helper fix passed 46/46 controlled regressions and three harmless native helper checks on each PowerShell 7 and 5.1. Not both hosts, clean VM/manual sign-in or rehearsal. |
| Installed local sandbox help | `copilot help sandbox` explicitly documents one-session `--sandbox` despite top-level-help omission. Needs actual backend/session preflight; Windows build 26300 is OS metadata, not successful backend operation. Native interactive `/sandbox enable` and `/sandbox status` remain documented controls. |
| October 12 current Corp qualification | Source correction merged; new qualification blocked on an unexpected change-type check; no apply performed. Last baseline 8 present / 3 absent: group exists, default VNet connection and two presenter Data Owner grants missing. No new sealed manifest/raw exact deltas; full convergence/access and in-MicroVM CLI/Squad unproved. Private diagnostic retention repair is separate, not deployment or scope weakening. |
| Independently verified native Online base | Separate five-object target from demo-env `deployments\aca-sandboxes-online`, not AKS/hosted Jobs or Corp BYO VNet/UAMI/FIC transplant. Approved one-time Owner bootstrap Succeeded; all exact bindings/current operator access/base credential-free exec/fs/stop-resume/delete verified; list empty. Public source PR human review and second-presenter remain separate. Corp untouched |
| Earlier host attempt, learning history | Approximately 77-second local CRLF failure/cleanup; downstream checks blocked. Corrected source/parser work supersedes this as the current runtime verdict |
| Corrected ACA SANDBOXES host runtime | One26.768-second host/worker/MicroVM trace: LF/source hash round trip, three guest checks/JSON+SHA, actual exit23, HTTPS403/new exact-sandbox causal denied audit, exact deletion/empty list/NotFound/watchdog stopped. Independent acceptance complete; runtime-ready after acceptance, not human stage GO or hosted Apps/Jobs proof |
| Earlier October 12 source/tooling checks | Contracts 34/34, artifact suite 85/85, runtime suite 31/31, workflow 17/17, checkout 10/10, toolchain 12/12 and GitHub-script 10/10 passed, two Linux smokes skipped on Windows. These precede the blocked qualification; no runtime/apply claim. |
| October 12 host auth / wrong-target doctor | ACA 1.0.0-preview.4 auth status exit 0: ARM/data-plane tokens authenticated. Doctor returned 9/9 exit 0 but printed cached Management/Norway East rather than requested Corp. Not selected-target acceptance; compare printed target and independent exact-ID read-back. No config change, Management fallback or create authorized. |
| October 12 local / optional GitHub cloud | Actual local Windows MXC startup exit 1 before command on proxy/masking/auth loopback/private-network requirement; policy blocked, no bypass/global change. Explicit cloud help parse exit 0 is not account/billing/runtime or full-Squad proof. |
| Earlier October 12 hosted history | `haflidif/squad-on-aca` original remains working/unchanged. Corp, Norway East placement and historical Oct 9/56 seconds are dated evidence. Earlier Manual/7200-second runner/no registered target runners/README-only Manual runner execution ended terminal Failed; associated issue queue workflow remains queued. Not chosen owned-mode blocker; fresh queue-driven readiness is not established. |
| October 13 owned hosted source | Public MIT [fork PR1](https://github.com/martinopedal/squad-on-aca/pull/1) accepted/normal merged, 71 tests plus actual Linux image/UID/protected-publication CI SUCCESS, @haflidif credit/license retained. Private target handoff accepted/merged with 42 source tests, runtimeProven false; source-prepared credential-free manual status/private scheduled poller. No new runner registration/AppAdmin. |
| October 13 hosted live holds | Private publisher source accepted/merged with 18 tests, actual Docker/DNS/TLS qualification waits at existing human gate/zero steps; no image/push/digest. Owner-native Terraform sole whole-body writer, combined draft 38 Terraform mocks + 60 non-Terraform contracts PASS, full source review pending. Plan/apply/destroy currently unconditionally disabled, signer/current-head/private-plan transport/executable integration not provisioned. Source preparation only; executable delivery remains held, not deploy-on-merge or merely operator receipts. Auth/budget/owner/image/Job/actual README App-bot PR pending; old zero-step queued run untouched. |
| October 13 VM preservation/SYSTEM hold | [Consumer PR21](https://github.com/martinopedal/aks-automatic-demo-env/pull/21) source accepted/REVIEW_REQUIRED, original Haflidi/Online gates unchanged. VM deallocated/current OS disk differs from earlier receipt; preserve both disks, never swap back/recreate/delete either. Refresh current binding/baseline/runnable SYSTEM context before plan/apply. Payload owner acceptance/harmless SYSTEM transport missing, no machine installation or VM/disk/CSE/power change. Sparse metrics do not prove CPU/RAM bottleneck or sustained causality. |
| October 12 AKS / app read-back | Both existing Online and Corp clusters independently read through Azure MCP: Automatic SKU/Standard tier, provisioning Succeeded, power Running; no redeploy indicated by metadata. Online app GET returned HTTP 200 and branded NIC/AKS text with explicit known-demo certificate bypass, not TLS certificate validation or a fresh 29-check security suite. Nodepool/full-runtime qualification remains separate. |
| Short deck | Five slides build from the same pinned runtime, theme, and public source links. |

See [the module evidence summary](terraform/modules/aks-automatic-corp/VALIDATION.md). Local mocks do not establish private DNS, firewall routing, RBAC, policy compliance, or Azure service acceptance.

Squad is coordination/configuration over the hosting Copilot session, not a sandbox product. [Four sandbox hosts](docs/sandboxing.md) distinguishes local OS/MXC, optional GitHub-managed cloud preview, native customer-managed ACA MicroVMs and hosted Apps/Jobs. Separately keep four demo lanes independent: existing Online AKS, native MicroVM group/RG, hosted Jobs issue-to-PR and local sandbox. Cloud account/runtime availability is unqualified. Squad inside a customer-managed ACA MicroVM is an intended in-MicroVM installation/execution variant, not currently executed or qualified. Host installation is not process/agent/prompt proof; supported sign-in/storage/egress need separate consent without copying host authentication.

The [official quickstart and full test checklist](docs/aca-sandboxes.md#full-test-coverage-checklist)
cover target/access/doctor, lifecycle/exec/fs/egress/suspend/resume, offline
Terraform and actual host prompt/skill/tool/guest result/validation/handoff.
Inside-MicroVM Copilot/Squad is advanced optional and separately consented. Auth status, green wrong-target doctor,
18/18 laptop checks, hosted Jobs or AKS metadata cannot close those runtime gates.
Earlier USD 20 is historical planning/alert context, not execution authority; retained Corp consumes
budget. Oct 13 C1 OnlineSecurity 29/DemoVM and C2 MCP minreplicas 1/revert Oct 14
remain scheduled. Teardown Oct 17/credential expiry Oct 31 require separate proof.

Two product demo flows have separate evidence and readiness: [hosted Squad agent work to
bot PR and host Copilot CLI/Squad-driven native isolation](docs/demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).
The host/VM is only presenter detail. Native acceptance needs actual host
prompt/selected Squad/ACA skill/tool/output/validation/reviewer handoff, not
standalone hello/lifecycle or hosted Jobs. Advanced CLI/Squad inside a MicroVM
has separate supported auth/install/runtime consent and proof; it is optional,
not required for the basic remote-orchestration claim. Native fixture engineering
is accepted; human/selected-Terraform stage GO remains pending.
Fresh full existing Online AKS validation at 10:47 UTC: app/source-matching
assets and two responding replicas PASS under explicit TLS bypass. Canonical
26 PASS/2 BLOCKED/1 report-only, not 29/29; corrected supplemental
10 PASS/1 FAIL (untrusted/mismatched TLS)/1 NOT_APPLICABLE (external `/healthz`;
source requires direct-pod `/healthz` 200 `ok`, not that external route).
Native Kubernetes access unavailable/ResourceHealth provider unregistered;
Full cluster health unproved. Eleven noncompliant resources are scoped to the
demo RG across AKS/network/state, not 11 cluster failures/subscription-wide.
No renewed 29/29/full TLS; C1 Oct 13 remains. Online is primary placement for
eligible demos, not fallback/policy escape; Corp-required private workloads
stay Corp. Repo visibility is separate from network/authenticated control-plane
scope. Preserve working AKS/Corp/hosted Jobs; no checklist redeploy or automatic
cluster repair. Five-object separate Online native setup and one credential-free
Ubuntu 1 CPU/2 GiB ten-minute probe/new-test-ID-only deletion have scope approval;
deployment/access/base probe independently verified. The corrected ACA SANDBOXES trace returns positive work/JSON/SHA/exit23/causal
denial/cleanup proof; independent acceptance complete, then runtime-ready.
Fresh hosted Apps/Jobs E2E and human stage GO remain separate.
Inside-VM OAuth/agents remain unproved and not authorized by these probes.

The [readiness table](docs/run-plan.md#october-12-readiness-evidence) retains B1 clean VM, B2 both-host interactive checks, B3 full 60-minute rehearsal, B4 pending invitation, B5 exact NIC listing unknown, Oct 13 warmup/reset, Oct 17 teardown and Oct 31 expiry. Pool A1/Dependabot are held for their own review, not auto-merged. No recording, full rehearsal, new corrected-doc Pages publication or full
selected-Terraform integration is claimed. The released deck and independently
verified bounded Online deployment are completed milestones, not new tasks.

## Resume presentation work

From the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/presentation/`. Use `S` for speaker notes, `N` for named navigation, and Escape for overview. Preserve the fixed keyboard-focus and overview behavior.

For the existing Windows development environment:

```powershell
Set-Location .\presentation
npm run build
npm test
```

For a fresh checkout, follow `presentation/README.md` to install the pinned dependencies and browser test environment. Never publish `node_modules`, `.venv`, QA screenshots, or private test artifacts.

## Resume source qualification

Use the module README's isolated local-provider setup and preserve its lock files. The synthetic caller is an offline fixture, not a deployment configuration with real IDs.

```powershell
Set-Location .\terraform\modules\aks-automatic-corp
terraform fmt -check -recursive
terraform init -backend=false -input=false -lockfile=readonly
terraform validate -no-color
tflint --config=.tflint.hcl --no-color
terraform test -filter=tests\contract.tftest.hcl -no-color
```

Run each command separately, inspect the exit code, and stop on failure. Initialize/test `examples\corp-existing` separately with its synthetic var-file as documented there.

Terraform 1.14.8 is a declared minimum and is covered by hosted Linux Terraform matrix run 36990206303 at b7133679a89b1e2b36677400d659a03907c0f3f6, alongside Terraform 1.16.4. The native agent-setup release published the module first, verified the agent-setup job in run 37286068987, and re-verified the final module documentation commit in run 37286237657. This Azure-validation release published the module first again and verified run 37305768318 before mirroring the module into this session repository. Do not claim Azure acceptance from credential-free checks alone; cite the separate private IaC validation.

## Azure and private integration

Reuse the existing approved Corp platform. The public child receives resource IDs; a private consumer owns actual providers, credentials, state, and deployment wiring. Do not rebuild the ALZ, import platform state, move a subscription to avoid policy, or add an exemption for the demo.

The sanitized private validation used `swedencentral` and Kubernetes 1.35.8. Subscription, tenant, IPs, resource IDs, identity names, private run URLs, and FQDNs remain private. Changing code, planning another Azure environment, and applying a saved plan are different approvals.

## Working rules

Back up before replacing a version. Keep one runtime writer per file and independent review. Preserve license notices in the module and single-file deck. Publish only reviewed files; use the manifest to keep both module copies identical.

The private coordinator handoff contains exact worktree paths, evidence locations, agent IDs, authentication blockers, and the remaining operational sequence. Do not copy those private records into this repository.
