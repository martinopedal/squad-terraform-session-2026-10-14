# Public demo workspace

This repository contains a public Reveal presentation, two-speaker material, recording tools, and generic Terraform source. Keep it reusable and free of environment-specific data.

## Working rules

- Read `QUALITY.md` and `PUBLICATION.md` before changing code or public evidence.
- Use native Copilot CLI Plan mode when agreeing a nontrivial change. Show facts, assumptions, affected files, ownership, and checks before implementation.
- Squad roles and routing are in `.squad\`. Use real tasks for delegated work; do not simulate specialist results.
- Give each changed file one owner. Separate research or test files can be worked on independently.
- Build and validate the source first. The user approved a genuine clean recorded run afterward; disclose its checkpoint and distinguish inherited code, qualification work, and new recorded work.
- Keep providers/backends/authentication in root consumers, not the reusable child module.
- Real Azure inputs, credentials, state, policy snapshots, and unreviewed recordings must not enter this repository.
- Do not copy deployment workflows or imports from an existing estate.
- Validate the exact artifact, report failures plainly, and do not claim a mock or planned action was executed on Azure.
- Back up a deliverable before replacing its current version.

## File-backed native coding, validation, review, and MCP grounding

Use [CONTRIBUTING.md](CONTRIBUTING.md) for
[terraform-coder](.github/agents/terraform-coder.agent.md),
[terraform-validator](.github/agents/terraform-validator.agent.md),
[terraform-reviewer](.github/agents/terraform-reviewer.agent.md), and the
[qualification skill](.github/skills/qualify-agent-setup/SKILL.md). The profiles
are placed at this repository root for native discovery as well as inside the
independently reusable module copy.

The native lane is explicit: Squad lead scopes the change, `/agent terraform-coder`
edits, `/agent terraform-validator` runs only approved offline checks under native
permission prompts, `/new` plus `/agent terraform-reviewer` reviews in a separate
context, and `/agent squad` receives the handoff for human acceptance. Squad
retains its own tools; links to profiles do not narrow a general-purpose Squad
task. Do not replace or reinitialize Squad.

Coder and reviewer include read-only MCP documentation lookups for Microsoft
Learn and the public Terraform Registry. MCP policy is hosted first: Microsoft
Learn is cloud-hosted, while HashiCorp has no documented hosted Terraform MCP,
so Terraform MCP uses Docker with the pinned image `hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5`. Docker Desktop and
network access are prerequisites. Copilot CLI and Copilot cloud agent honor
`mcp-servers`; VS Code ignores that frontmatter. Never send private inputs to an
MCP server. The native Terraform MCP binary is not used for this demo.

Keep native permission prompts. Instructions, ignores, and tool allowlists are
not a sandbox; static readiness does not prove native selection, execution, MCP
startup, review, or deployment.

## Start the native planning experience

From this repository, start the CLI with:

```powershell
copilot --agent squad --plan
```

Review the active instructions and permissions. Approve a bounded plan before leaving Plan mode. Do not combine this example with automatic plan approval or blanket tool permissions.
