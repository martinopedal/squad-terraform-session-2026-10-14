# Source provenance and publication copies

The demo starts from an existing public AKS Terraform root configuration. Its inherited code and known issues are not presented as newly generated work.

| Material | Source |
| --- | --- |
| Starting AKS root configuration | `martinopedal/terraform-azapi-aks-automatic`, commit `e9a9a481b9b5bf3a4af8046cb602895c89a9ac24` |
| New reusable module | `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` |
| Presentation and source copy | `martinopedal/squad-terraform-session-2026-10-14` |
| Squad starter | Squad CLI 0.13.0; generated separately without copying private team histories |

The original root mixed infrastructure and Kubernetes application configuration. Local checks identified structural, formatting, lint, and test-isolation failures. The public reusable module must establish its own clean boundary and validation evidence rather than carry those failures into a new repository.

The independently published module is pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`. Its source tree `068e88ecc484ba4b4c4353653c1be7a99e8b5ab8` and the copy under `terraform\modules\aks-automatic-corp\` must match. [The publication manifest](../terraform/module-source.json) records the exact revision, Git tree, and file blob hashes.

The independent module repository has a credential-free workflow. Terraform matrix run 36990206303 passed on the first CI commit; native agent setup passed in run 37286068987; final module verification passed in run 37286237657; and the Azure-validation documentation release passed in run 37305768318.

The existing landing-zone implementation is a dependency of the private deployment environment, not source to copy into this repository. Public examples use placeholders and explicit platform-owned inputs. No real environment identifiers, state, secrets, or private policy evidence are included here.

Documentation and generated source are different from executed evidence. The private Azure deployment/read-back pinned runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf`; the public module revision `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7` records that sanitized result. Recorded implementation and native profile selection remain pending.

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
