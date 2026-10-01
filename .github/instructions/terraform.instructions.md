---
applyTo: "**/*.tf,**/*.tfvars,**/*.tfvars.json,**/*.tftest.hcl,**/.terraform.lock.hcl"
---

# Terraform engineering rules

Follow `QUALITY.md` and the reviewed module contract.

- Keep provider requirements in reusable modules, but configure providers, authentication, and backends in the root consumer.
- Do not copy application/Kubernetes provider configuration into the infrastructure module.
- Use typed and documented variables, explicit unsupported-combination validation, stable addresses, and useful documented outputs.
- Preserve exact Azure API property casing. Do not decode an AzAPI object as JSON or silently suppress a required output error.
- Use approved dependency versions and lock discipline. No silent upgrades, deleted locks, temporary overrides, or disabled validation to force a green check.
- Use ordinary resource references for dependencies. Justify ordering and lifecycle exceptions; preserve existing resource ownership.
- Run formatting, validation, applicable lint, and isolated positive/negative tests. Inspect all providers and external effects before calling a test offline.
- A negative test must fail for the intended reason. Do not broaden expected failures, remove checks, or suppress error exits.
- The Corp example must remain private and consume approved platform inputs. Do not add public access, create policy exemptions, or import platform state to simplify the demo.
- Keep real environment inputs, credentials, state, plans, and private policy evidence outside the public repository.
- Implementation and validation are authorized before filming. The final recorded demonstration must be a genuine clean run from a disclosed checkpoint; do not claim earlier qualification work was recorded. No fabricated terminal or deployment evidence.
- Azure planning/apply, role assignments, policy changes, cleanup, and publication are distinct approvals. Never infer deployment authority from a code-generation request.
