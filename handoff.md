# Public project handoff

Updated October 5, 2026. This file describes the public deliverables and the remaining release gates. Private environment inputs and operational evidence are intentionally absent.

## Current result

- Reveal.js presentation version **0.16**, with one opening slide, 25 main slides, and ten appendix slides (0.15 added the Online landing-zone variant and the rerunnable prompt pack; 0.16 adds Squad bootstrapping and use cases).
- Martin/Haflidi talk track: **5,504 main spoken words**, balanced 2,739 / 2,765, plus a separate 652-word prepared Q&A fallback.
- Exact session budget: **26 minutes of recorded chapters, 27 minutes of other live explanation, and seven minutes of Q&A**. Both speakers narrate the silent clips; that narration is already inside the 53 content minutes.
- Sessionize copy: 294-word description/outcomes, 52-word pitch, and both speaker names.
- Copilot CLI/Squad feature research with 34 first-party references and a C1-C7 operator runbook.
- Public reusable Terraform module and synthetic caller, locally qualified and privately Azure-validated through IaC.

The package is not stage-ready: **zero of seven native recordings are attached**. Azure deployment/read-back is complete only for the sanitized October 5 private IaC validation; native profile selection and full human rehearsal are still incomplete.

## Public locations

- [Live Reveal presentation](https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/)
- [Session repository](https://github.com/martinopedal/squad-terraform-session-2026-10-14)
- [Independent module repository](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp)
- [Module-copy manifest](terraform/module-source.json)
- [Full speaker script](docs/talk-track.md)
- [Sessionize text](docs/sessionize.md)
- [Feature guide](docs/feature-guide.md)
- [C1-C7 demo runbook](docs/demo-runbook.md)

The module is pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`. Its 35-file Git tree is `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8`. The copy under `terraform/modules/aks-automatic-corp` must retain that same tree.

## Verified and unverified

| Area | Evidence |
| --- | --- |
| Terraform local qualification | Terraform 1.16.4 / Windows AMD64, AzAPI 2.12.0, TFLint 0.64.0. Both roots passed formatting, validation, and lint. |
| Contract tests | 52 module cases and two caller cases passed, all plan-mode mocks. |
| Mutation proof | Wrong SKU and public-API mutations each failed the intended assertion; the unchanged 52-case suite passed after each exact restoration. |
| Module review | Independent static and publication-safety reviews passed for the qualified source. |
| Presentation checks | Ten media-policy tests, 99 browser/content checks, and slide/fragment captures across two resolutions. The updated evidence slide was visually inspected. |
| Hosted module CI | Terraform matrix run 36990206303 passed at b7133679a89b1e2b36677400d659a03907c0f3f6; native agent setup passed run 37286068987 at 00787f59ac19e3db0c3869a96ff45805c6cb523d; final module run 37286237657 passed at 02e10e56bc15cc30c3193dce3ddc8e608cb87daf; Azure-validation docs release run 37305768318 passed at b01256eb9b1ea6046b9bb8a403662f724a7b6fa7. |
| Azure | **Privately validated.** Private IaC PR workflow planned, environment-approved, applied, and read back runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; sanitized public facts only. |
| Recordings | Genuine clean runs are still required; no custom viewer footage is accepted. |

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

## Recording decision

The user approved **build first, then record a genuine clean run**. Stay in the normal Copilot CLI shell with Squad selected. Disclose the prepared checkpoint and record actual new execution, not a reconstruction presented as the first implementation.

Direct FFmpeg `gdigrab` capture of the GPU terminal produced black frames. Use an accepted normal window recorder after a real frame/motion check. Do not reopen the retired custom artifact viewer, capture unrelated desktop content, or auto-approve CLI permissions.

Follow `docs/demo-runbook.md`. Add only genuinely reviewed footage through `presentation/src/media.json`; preserve its native-surface, selected-agent, take-ID, and content-review requirements.

## Azure and private integration

Reuse the existing approved Corp platform. The public child receives resource IDs; a private consumer owns actual providers, credentials, state, and deployment wiring. Do not rebuild the ALZ, import platform state, move a subscription to avoid policy, or add an exemption for the demo.

The sanitized private validation used `swedencentral` and Kubernetes 1.35.8. Subscription, tenant, IPs, resource IDs, identity names, private run URLs, and FQDNs remain private. Changing code, planning another Azure environment, applying a saved plan, and publishing recordings are different approvals.

## Working rules

Back up before replacing a version. Keep one runtime writer per file and independent review. Preserve license notices in the module and single-file deck. Publish only reviewed files; use the manifest to keep both module copies identical.

The private coordinator handoff contains exact worktree paths, evidence locations, agent IDs, authentication blockers, and the remaining operational sequence. Do not copy those private records into this repository.
