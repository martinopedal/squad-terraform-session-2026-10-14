# GitHub Copilot CLI and Squad for Terraform

A two-speaker session by **Martin and Haflidi** on using GitHub Copilot CLI and Squad together to build, check, and review Terraform for Azure.

**Session:** October 14, 2026, 10:00-11:00, UTC+02:00, Room 6.

## What this repository contains

The presentation shell and speaker material are built and reviewed. The Terraform module is being implemented and qualified. Genuine demo recordings and Azure deployment evidence remain pending.

| Path | Content |
| --- | --- |
| [`presentation`](presentation/README.md) | Offline-capable Reveal.js presentation with speaker notes |
| [`docs\talk-track.md`](docs/talk-track.md) | Timed Martin/Haflidi script, handoffs, and prepared Q&A |
| [`docs\sessionize.md`](docs/sessionize.md) | Updated title, abstract, outcomes, pitch, and speaker metadata |
| [`docs\feature-guide.md`](docs/feature-guide.md) | Source-verified Copilot CLI and Squad features and practical use cases |
| `scripts\recording\` | Controlled-window capture and verification tools |
| `terraform\modules\aks-automatic-corp\` | Public source copy of the independently versioned demo module |

The module's separate repository is [terraform-azapi-aks-automatic-corp](https://github.com/alz-avm-tf-demo/terraform-azapi-aks-automatic-corp). The presentation copy will identify its source revision and matching file hashes.

## Open the presentation

The built [Reveal presentation](presentation/index.html) has 22 main slides and six appendix slides. Its 60-minute structure includes 26 minutes of silent recorded chapters with live narration, 27 minutes of other live explanation, and seven minutes of Q&A. The complete speaker script covers the content and includes a prepared Q&A fallback.

For speaker notes, serve the clone locally:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/presentation/` and press `S` for speaker view or `N` for named chapter navigation. Media slots are clearly pending until genuine reviewed recordings are attached. No custom file-viewer footage is presented as Copilot CLI or Squad.

## Public code, separate deployment configuration

The module and its generic examples are public. Real subscription/resource identifiers, environment inputs, credentials, private policy evidence, and Terraform state remain outside this repository.

The demonstration reuses an existing Azure Landing Zones Corp environment. The public module consumes approved platform resources; it does not deploy a new landing zone or import existing estate resources.

## Evidence boundary

The starting AKS root configuration has known validation and documentation issues. It is not a verified deployable module. The project records the actual implementation and repair work, then keeps code checks, Azure deployment evidence, and presentation evidence separate.

A successful format, lint, or mocked test does not prove Azure service acceptance or policy compliance. Deployment requires an approved nonproduction Corp target, verified prerequisites, and human review of the actual resource plan.

The user approved code-first qualification followed by a genuine clean recorded run from a disclosed checkpoint. Earlier unrecorded work will not be relabeled as footage.

No completed recordings or end-to-end Azure validation are claimed by the current build. Read [QUALITY.md](QUALITY.md) and [PUBLICATION.md](PUBLICATION.md) for the evidence and release boundaries.
