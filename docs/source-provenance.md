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

The original source release contained 23 files. The independent module repository now has a credential-free workflow; Terraform matrix run 36990206303 passed on commit b7133679a89b1e2b36677400d659a03907c0f3f6. This release adds the native agent setup files and agent-setup workflow job. Agent setup passed in run 37286068987 on commit 00787f59ac19e3db0c3869a96ff45805c6cb523d, and final module verification passed in run 37286237657 on commit 02e10e56bc15cc30c3193dce3ddc8e608cb87daf.

The existing landing-zone implementation is a dependency of the private deployment environment, not source to copy into this repository. Public examples use placeholders and explicit platform-owned inputs. No real environment identifiers, state, secrets, or private policy evidence are included here.

Documentation and generated source are different from executed evidence. Recorded implementation, local checks, and later Azure deployment/read-back each retain their own revision and status.
