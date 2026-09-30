# GitHub Copilot CLI and Squad for Terraform

A two-speaker session by **Martin and Haflidi** on using GitHub Copilot CLI and Squad together to build, check, and review Terraform for Azure.

**Session:** October 14, 2026, 10:00-11:00, UTC+02:00, Room 6.

## What this repository contains

The delivery package is being built. The intended layout is:

| Path | Content |
| --- | --- |
| `presentation\` | Offline-capable Reveal.js presentation with speaker notes |
| `docs\talk-track.md` | Timed Martin/Haflidi script, handoffs, and prepared Q&A |
| `docs\sessionize.md` | Updated title, abstract, outcomes, pitch, and speaker metadata |
| `docs\feature-guide.md` | Source-verified Copilot CLI and Squad features and practical use cases |
| `scripts\recording\` | Controlled-window capture and verification tools |
| `terraform\modules\aks-automatic-corp\` | Public source copy of the independently versioned demo module |

The module's separate repository is [terraform-azapi-aks-automatic-corp](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp). The presentation copy will identify its source revision and matching file hashes.

## Public code, separate deployment configuration

The module and its generic examples are public. Real subscription/resource identifiers, environment inputs, credentials, private policy evidence, and Terraform state remain outside this repository.

The demonstration reuses an existing Azure Landing Zones Corp environment. The public module consumes approved platform resources; it does not deploy a new landing zone or import existing estate resources.

## Evidence boundary

The starting AKS root configuration has known validation and documentation issues. It is not a verified deployable module. The project records the actual implementation and repair work, then keeps code checks, Azure deployment evidence, and presentation evidence separate.

A successful format, lint, or mocked test does not prove Azure service acceptance or policy compliance. Deployment requires an approved nonproduction Corp target, verified prerequisites, and human review of the actual resource plan.

No completed recordings or end-to-end Azure validation are claimed by this initial repository scaffold.
