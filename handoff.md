# Public project handoff

Updated October 9, 2026. This file describes the public deliverables and the remaining release gates. Private environment inputs and operational evidence are intentionally absent.

## Current result

- Reveal.js presentation version **0.22.2**. Presentation metadata reports **39 slides total**, including the untimed legal/pre-show slide, the timed main flow, and the appendix.
- A five-slide companion deck is built at `presentation\short\index.html`.
- Current delivery contract: **3:00 intro; planned content to about 55:00; 55:00-58:00 protected recovery block; 58:00-60:00 close**. The planned content includes **29:00 of live C0-C7 demo chapters** and the rest as live explanation. Questions are only if time allows. There is no scheduled Q&A block. See [docs/run-plan.md](docs/run-plan.md) for the full minute-by-minute schedule.
- Live-demo rule: **C0-C7 are live**, with optional reviewed fallback evidence if a chapter fails live.
- Sessionize copy, feature guide, prompt pack, repeatability eval, and the C0-C7 operator runbook are present in the public repository.
- Public reusable Terraform module and synthetic caller remain locally qualified and privately Azure-validated through IaC.

Native profile selection and full human rehearsal remain separate verification gates. The presenter manually runs the four-product bootstrap file for the GitHub Copilot desktop app, Squad, VS Code, and GitHub Copilot CLI. Its controlled execution tests do not establish clean-VM installation or manual device-code login; that operator rehearsal remains required. Optional fallback evidence may still be refreshed later, but the live-first contract stays unchanged.

## Public locations

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

The module is pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`. Its 35-file Git tree is `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8`. The copy under `terraform/modules/aks-automatic-corp` must retain that same tree.

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
| Deck 0.22.2 checks, October 9 | 41 Node tests passed. The short deck passed 43 browser checks across 10 captures; the full deck passed 102 interaction/content checks across 88 captured states at two resolutions. Removing the C4 qualification note from the real source failed the new regression as intended; restoration passed. Generated hashes, five/39 slide counts, unchanged on-screen markup, and 55:00/3:00/2:00 timing were checked. These are local presentation checks, not a Corp deployment, actual-authentication check, or clean-VM/manual-login rehearsal. |
| Hosted module CI | Terraform matrix run 36990206303 passed at b7133679a89b1e2b36677400d659a03907c0f3f6; native agent setup passed run 37286068987 at 00787f59ac19e3db0c3869a96ff45805c6cb523d; final module run 37286237657 passed at 02e10e56bc15cc30c3193dce3ddc8e608cb87daf; Azure-validation docs release run 37305768318 passed at b01256eb9b1ea6046b9bb8a403662f724a7b6fa7. |
| Azure | **Privately validated.** Private IaC PR workflow planned, environment-approved, applied, and read back runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; sanitized public facts only. |
| Short deck | Five slides build from the same pinned runtime, theme, and public source links. |

See [the module evidence summary](terraform/modules/aks-automatic-corp/VALIDATION.md). Local mocks do not establish private DNS, firewall routing, RBAC, policy compliance, or Azure service acceptance.

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
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
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
