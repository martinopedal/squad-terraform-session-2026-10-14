---
applyTo: "**/*.tf,**/*.tfvars,**/*.tfvars.json,**/*.tfvars.example,**/*.tfvars.json.example,**/*.tftest.hcl,**/.terraform.lock.hcl"
---

# Terraform engineering rules

Follow [AGENTS.md](../../AGENTS.md), [CONTRIBUTING.md](../../CONTRIBUTING.md),
and the module README's reviewed resource contract.

- Keep provider requirements in reusable modules, but configure providers, authentication, and backends in the private root consumer.
- Do not copy application/Kubernetes provider configuration into the infrastructure module.
- Use typed and documented variables, explicit unsupported-combination validation, stable addresses, and useful documented outputs.
- Preserve exact Azure API property casing. Do not decode an AzAPI object as JSON or silently suppress a required output error.
- Use approved dependency versions and readonly lock discipline. No silent upgrades, deleted locks, temporary overrides, or disabled validation to force a green check.
- Use ordinary resource references for dependencies. Justify ordering and lifecycle exceptions; preserve existing resource ownership and `prevent_destroy`.
- Have the operator or manually selected validator run formatting, validation, applicable lint, and isolated positive/negative tests. Inspect all providers and external effects before calling a test offline. The coder/reviewer profiles have no shell. The validator has no `edit` tool, but its shell can still write files; the command list is enforced only by its instructions and native approval prompts.
- Keep existing mocked providers and plan-mode test runs. A negative test must fail for the intended assertion; do not broaden expected failures, remove checks, or suppress exits.
- The Corp example must remain private and consume approved platform inputs. Do not add public access, create policy exemptions, or import platform state to simplify the demo.
- Keep real environment inputs, credentials, state, plans, and private policy evidence outside public source.
- Update directly related tests and documentation with interface changes; request independent review of the exact diff.
- Implementation and validation may precede filming. A recorded demonstration must be a genuine clean run from a disclosed checkpoint; do not claim earlier qualification was recorded.
- Azure plan/apply, role assignments, policy changes, cleanup, and publication are distinct human approvals. Never infer deployment authority from a code-generation request.
