# Source provenance and publication copies

The demo starts from an existing public AKS Terraform root configuration. Its inherited code and known issues are not presented as newly generated work.

| Material | Source |
| --- | --- |
| Starting AKS root configuration | `martinopedal/terraform-azapi-aks-automatic`, commit `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24` |
| New reusable module | `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` |
| Presentation and source copy | `martinopedal/squad-terraform-session-2026-10-14` |
| Squad starter | Historical starter provenance: Squad CLI 0.13.0; generated separately without copying private team histories. Current validation is Squad 1.0.1 (2026-10-08). |
| Squad CLI reference | https://raw.githubusercontent.com/bradygaster/squad/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/reference/cli.md at commit `93aec83accb44e08c39e4a799f13b55208215a13`; checked 2026-10-08; used to audit command and flag mentions |

The original root mixed infrastructure and Kubernetes application configuration. Local checks identified structural, formatting, lint, and test-isolation failures. The public reusable module must establish its own clean boundary and validation evidence rather than carry those failures into a new repository.

The independently published module is pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`. Its source tree `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8` and the copy under `terraform\modules\aks-automatic-corp\` must match. [The publication manifest](../terraform/module-source.json) records the exact revision, Git tree, and file blob hashes.

The independent module repository has a credential-free workflow. Terraform matrix run 36990206303 passed on the first CI commit; native agent setup passed in run 37286068987; final module verification passed in run 37286237657; and the Azure-validation documentation release passed in run 37305768318.

The existing landing-zone implementation is a dependency of the private deployment environment, not source to copy into this repository. Public examples use placeholders and explicit platform-owned inputs. No real environment identifiers, state, secrets, or private policy evidence are included here.

Documentation and generated source are different from executed evidence. The private Azure deployment/read-back pinned runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; the public module revision `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7` records that sanitized result. Deck 0.19 presents live C0-C7 chapters; optional fallback recordings/screenshots are not source evidence unless separately reviewed and labeled.
