# Quality and evidence requirements

The public demonstration must satisfy the checks below before it is described as complete.

Audience: maintainers and presenters. Purpose: require evidence for the exact
artifact and claim. [The repo map](docs/repositories.md) identifies source and
deployment ownership; [the four-lane progress matrix](docs/sandboxing.md#october-12-progress-and-next-actions)
and [full MicroVM checklist](docs/aca-sandboxes.md#full-test-coverage-checklist)
separate completed checks from blocked and pending runtime work.

Online is primary placement for eligible demo components; the separate native
five-object target and credential-free base probe were independently verified
October 12, not a fallback. Corp-required private workloads stay in
Corp. Repo visibility and network/control-plane exposure are different facts.
Leave Corp resources untouched.
The held Corp qualification was blocked on an unexpected change-type check; no
apply performed in that qualification. This is not a proven Corp policy restriction.
Help, doctor, token authentication, host preflight, hosted Jobs and AKS read-back
cannot replace target-specific evidence. Basic host orchestration requires the
actual host prompt/selected Squad/ACA skill/tool/output/validation/handoff trace;
Copilot/Squad inside the MicroVM is advanced optional and needs separate consent.
The verified base probe is not full integration or stage GO. Corrected host
runtime evidence now passes its public fixture/JSON/SHA/exit23/causal-denial/
cleanup contracts; independent acceptance is complete. Runtime-ready card after
acceptance is distinct from second-presenter/manual UI/login/timed rehearsal.

## Terraform source

Use the [HashiCorp style guide](https://developer.hashicorp.com/terraform/language/style), appropriate [module structure](https://developer.hashicorp.com/terraform/language/modules/develop/structure), and [provider ownership](https://developer.hashicorp.com/terraform/language/modules/develop/providers).

- Format and validate the exact published source.
- Use typed, documented inputs, intentional defaults, explicit unsupported-combination checks, and useful outputs.
- Keep reusable child-module provider requirements separate from root provider configuration, authentication, and backend/state.
- Use reviewed Terraform/provider constraints and lock files for executable root examples and tests. Do not upgrade dependencies silently.
- Run the applicable linter and isolated positive/negative tests. Confirm that tests cannot invoke unmocked cloud providers, authentication executables, or unrelated application deployments.
- Assert the configured resource contract, not only fabricated mock responses. Preserve the intended reason for each negative test.
- Document the example's prerequisites and run it from a clean root. Environment-specific overrides are not public sample values.
- Require explicit review of changes to tests, lint suppressions, lifecycle guards, expected failures, and resource addresses.

Passing static and mocked checks does not demonstrate Azure service acceptance. A separate private IaC validation may be cited only with its exact revision, sanitized read-back facts, and remaining limits.

## Corp integration

The module must support the declared private AKS Corp scenario rather than default to a public endpoint or a standalone network.

The workload consumer supplies approved network, DNS, identity, and monitoring inputs. Platform-owned resources and their state stay under platform ownership. Do not import existing estate resources into the demo module, duplicate shared services, or bypass policies with broad exceptions.

Repository-declared policy alignment and live effective Azure Policy compliance are different claims. Verify actual inheritance, definitions, parameters, enforcement, exclusions, and exemptions at the approved target before a deployment claim.

## Recorded demonstration

The user approved implementation and validation before filming. Record a genuine clean demonstration run afterward, using a declared checkpoint. Preserve its actual prompts, edits, handoffs, checks, and repairs. Label inherited code, earlier unrecorded qualification, deliberately seeded defects, off-screen evidence, accelerated waits, and retakes.

Do not fabricate native CLI screens, terminal output, deployment results, or a successful first run. Recordings preserve an example of agent behavior; they do not make the model deterministic.

## Presentation

The Reveal deck must have readable text/code, accurate diagrams, accessible contrast, keyboard navigation, speaker notes, working local media controls, and offline behavior.

The talk track for Martin Opedal and Haflidi Fridthjofsson is live-first C0-C7,
with explicit timing and handoffs. Keep 55 minutes of content, 3 minutes of
protected recovery and a 2-minute close; questions only if time allows.
Recordings are optional reviewed fallback, not required chapter media.

## Release evidence

Record the source revision, tool versions, commands, actual exit codes, result summaries, and limitations. Use four outcomes: pass, fail, blocked, or not applicable with a reason.

A blocked Azure target does not prevent publishing clearly labeled generic source and local evidence. The October 5 private validation permits the limited claim that this module revision was deployed and read back through the approved private consumer path; it still does not complete recordings, native profile selection, full rehearsal, or future-environment approval.
