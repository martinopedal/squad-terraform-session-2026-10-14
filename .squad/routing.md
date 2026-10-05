# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Scope and module contract | lead | Bound a Terraform change, define inputs and acceptance criteria, resolve dependencies |
| Bounded Terraform implementation | lead | Prepare the owned-file brief for the operator's native terraform-coder selection |
| Code and evidence review | reviewer | Check the exact diff, tests, unsupported claims, and reproducibility |
| Demo and recording | devrel | Capture genuine work, prepare examples, preserve take provenance |
| Corp and public/private boundary | security | Review access, platform ownership, effective policy assumptions, and public artifacts |
| Presentation and narration | docs | Maintain Reveal slides, Martin/Haflidi talk tracks, Sessionize text, and sources |

Preset installation adds concrete routes for the configured team. Add or edit rows
here only when their agent names also exist in the casting registry.

Assign one runtime writer per Terraform file. Independent research, test authoring, and documentation can run in parallel after the interface is agreed. Separate agent contexts do not isolate the filesystem.

Do not infer current execution from this routing table. Show actual delegated tasks, owners, and results. Keep deployment and publication approvals separate from code review.

## Native profile handoff

Keep Squad selected for planning and coordination. For code changes, lead
prepares the scope, named files, preserved invariants, documentation sources,
and acceptance checks. The operator selects
[terraform-coder](../.github/agents/terraform-coder.agent.md) through
`/agent terraform-coder` in the same window and supplies that brief. The coder is
the sole writer for those files; other Squad tasks must not race it.

For offline qualification, follow [CONTRIBUTING.md](../CONTRIBUTING.md); the operator selects
[terraform-validator](../.github/agents/terraform-validator.agent.md). The
validator is manual-only and has `execute`. It has no `edit` tool, but its
shell can still write files; the command list is enforced only by its
instructions and native approval prompts. It stops and reports on the first
failure instead of repairing or relaxing tests.

For independent review, use `/new`, select
[terraform-reviewer](../.github/agents/terraform-reviewer.agent.md), and supply
the exact diff, changed-file list, source revision, MCP citations, and sanitized
validator results. Return to `/agent squad` for the real handoff and human
acceptance. Record observed profile selections and actual task IDs only where
tasks were really launched; a manual selection is not a delegated task.

Coder and reviewer include read-only MCP documentation lookups through Microsoft
Learn and Terraform Registry servers; validator has no MCP servers. MCP policy is
hosted first: Microsoft Learn is cloud-hosted, while Terraform MCP uses Docker
because HashiCorp has no documented hosted option. Docker Desktop, the pinned
image `hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5`, and network access are prerequisites. The native Terraform MCP
binary is not used for this demo. These native profiles are
not extra cast members. The unchanged coordinator can spawn general-purpose
tasks; linking a profile from a charter does not select it or narrow that task's
tools. Preserve permission prompts and never send private inputs to MCP servers.

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Lead |
| `squad:{name}` | Pick up issue and complete the work | Named member |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, the **Lead** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. The Lead handles all `squad` (base label) triage.

## Work Type → Agent

| Work Type | Primary | Secondary |
|-----------|---------|----------|
| lead | lead | — |
| reviewer | reviewer | — |
| devrel | devrel | — |
| security | security | — |
| docs | docs | — |
