# Source provenance and publication copies

The demo starts from an existing public AKS Terraform root configuration. Its inherited code and known issues are not presented as newly generated work.

| Material | Source |
| --- | --- |
| Starting AKS root configuration | `martinopedal/terraform-azapi-aks-automatic`, commit `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24` |
| New reusable module | `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` |
| Presentation and source copy | `martinopedal/squad-terraform-session-2026-10-14` |
| Squad starter | Squad CLI 0.13.0; generated separately without copying private team histories |

The original root mixed infrastructure and Kubernetes application configuration. Local checks identified structural, formatting, lint, and test-isolation failures. The public reusable module must establish its own clean boundary and validation evidence rather than carry those failures into a new repository.

The authoritative module release and the copy under `terraform\modules\aks-automatic-corp\` must match. A publication manifest will record the exact module revision and file hashes when source is published.

The existing landing-zone implementation is a dependency of the private deployment environment, not source to copy into this repository. Public examples use placeholders and explicit platform-owned inputs. No real environment identifiers, state, secrets, or private policy evidence are included here.

Documentation and generated source are different from executed evidence. Recorded implementation, local checks, and later Azure deployment/read-back each retain their own revision and status.
