# Quality and evidence requirements

The public demonstration must satisfy the checks below before it is described as complete.

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

Passing static and mocked checks does not demonstrate Azure service acceptance.

## Corp integration

The module must support the declared private AKS Corp scenario rather than default to a public endpoint or a standalone network.

The workload consumer supplies approved network, DNS, identity, and monitoring inputs. Platform-owned resources and their state stay under platform ownership. Do not import existing estate resources into the demo module, duplicate shared services, or bypass policies with broad exceptions.

Repository-declared policy alignment and live effective Azure Policy compliance are different claims. Verify actual inheritance, definitions, parameters, enforcement, exclusions, and exemptions at the approved target before a deployment claim.

## Recorded demonstration

The user approved implementation and validation before filming. Record a genuine clean demonstration run afterward, using a declared checkpoint. Preserve its actual prompts, edits, handoffs, checks, and repairs. Label inherited code, earlier unrecorded qualification, deliberately seeded defects, off-screen evidence, accelerated waits, and retakes.

Do not fabricate native CLI screens, terminal output, deployment results, or a successful first run. Recordings preserve an example of agent behavior; they do not make the model deterministic.

## Presentation

The Reveal deck must have readable text/code, accurate diagrams, accessible contrast, keyboard navigation, speaker notes, working local media controls, and offline behavior.

The talk track for Martin Opedal and Haflidi Fridthjofsson must cover the content, including narration over the recorded chapters, with explicit timing and handoffs. Keep questions within the 60-minute slot.

## Release evidence

Record the source revision, tool versions, commands, actual exit codes, result summaries, and limitations. Use four outcomes: pass, fail, blocked, or not applicable with a reason.

A blocked Azure target does not prevent publishing clearly labeled generic source and local evidence. It does prevent describing the demo as deployed or validated end to end on Azure.
