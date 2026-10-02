# Source provenance and publication copies

The demo starts from an existing public AKS Terraform root configuration. Its inherited code and known issues are not presented as newly generated work.

| Material | Source |
| --- | --- |
| Starting AKS root configuration | `martinopedal/terraform-azapi-aks-automatic`, commit `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24` |
| New reusable module | `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` |
| Presentation and source copy | `martinopedal/squad-terraform-session-2026-10-14` |
| Squad starter | Squad CLI 0.13.0; generated separately without copying private team histories |

The original root mixed infrastructure and Kubernetes application configuration. Local checks identified structural, formatting, lint, and test-isolation failures. The public reusable module must establish its own clean boundary and validation evidence rather than carry those failures into a new repository.

The independently published module is pinned to `883795608d7c873e7b47b3acd375e0b58819458a`. Its source tree and the copy under `terraform\modules\aks-automatic-corp\` must match. [The publication manifest](../terraform/module-source.json) records the exact revision, Git tree, and file blob hashes.

The source release contains 23 files. A credential-free CI workflow is prepared locally but is not published because the current GitHub login lacks workflow permission. Neither source copy includes that unactivated workflow.

The existing landing-zone implementation is a dependency of the private deployment environment, not source to copy into this repository. Public examples use placeholders and explicit platform-owned inputs. No real environment identifiers, state, secrets, or private policy evidence are included here.

Documentation and generated source are different from executed evidence. Recorded implementation, local checks, and later Azure deployment/read-back each retain their own revision and status.
