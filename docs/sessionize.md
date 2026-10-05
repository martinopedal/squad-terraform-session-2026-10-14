# Sessionize copy

Conference organizers can use this copy for the session listing. Attendees can use it to judge the topic, level, prerequisites, and expected outcomes. This is submission-ready copy, not a claim that recordings, publication, or Azure deployment are complete.

## Title

From prompt to reusable Terraform: Copilot CLI and Squad

## Description and outcomes

A useful agent session should leave more than a convincing answer. It should leave code another engineer can understand, test, and consume.

In the past year, Copilot CLI became generally available, skills and MCP spread across Copilot surfaces, and Squad reached 1.0. Martin and Haflidi show how native GitHub Copilot CLI features and Squad work together on an existing AKS Terraform codebase. The outcome is a reusable infrastructure module, documented and tested around a clear contract, with a consumption example for an existing Azure landing zone. The primary path uses private Corp networking and pre-provisioned platform services, not a new public standalone environment.

We start with the files and decisions that shape the work. Native Plan mode makes the proposed change visible before implementation. Reviewed files, instructions, skills, and MCP lookups focus the agent. Squad adds roles, routing, ownership, handoffs, and repository-backed decisions. Three narrow agent profiles in the repository are a coder, a validator, and a separate reviewer. The validator has no `edit` tool, but its shell can still write files; instructions and native approval prompts enforce its command list. They narrow lanes without pretending they are sandboxes. Parallel work stays bounded; humans review changes.

Code qualification comes first. Later recordings show genuine new Copilot CLI execution with Squad selected from a disclosed clean checkpoint, not the first-ever implementation. Both speakers narrate the decisions live. We'll inspect the plan, follow a handoff, read a meaningful failed check, and discuss the repair. We'll also use diff and review tools, resume with decisions intact, and explain model, context, and usage controls. Worktrees, recovery, bounded automation, and cloud delegation stay in a concise reference section.

You'll leave able to choose an appropriate CLI or Squad workflow, define a module boundary, and connect an agent's claim to evidence. You'll also know why passing local tests, a reviewed Terraform plan, and observed Azure behavior are different milestones.

Public module code and generic examples remain separate from environment inputs, identities, backend/state, and secrets. Live policy and deployment evidence depend on an authorized environment and remain explicit gates, not promises hidden in the demo.

## Elevator pitch

Turn an existing AKS codebase into a reusable Terraform module with GitHub Copilot CLI and Squad. Martin and Haflidi connect native planning, context, tools, and review with team ownership and handoffs. Learn practical habits for private Azure landing-zone consumption, readable evidence, and a clean boundary between public code and private environment configuration.

## Session details

| Field | Value |
| --- | --- |
| Speakers | Martin Opedal, Enterprise Cloud Solution Architect, Microsoft; Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft |
| Date | Wednesday, October 14, 2026 |
| Time | 10:00-11:00, UTC+02:00 |
| Room | Room 6 |
| Language | English |
| Format | Two-speaker technical session, recorded CLI chapters with live narration, and Q&A |
| Audience | Infrastructure engineers, platform engineers, and Terraform practitioners |
| Level | Intermediate |
| Prerequisites | Familiarity with Terraform modules, Git, Azure networking, and basic AKS concepts; no prior Squad experience required |
| Technology | GitHub Copilot CLI, Squad 1.0, custom agents, Terraform, AzAPI, Azure Kubernetes Service, Azure landing zones, MCP, and Reveal.js |

## Editorial status

The reusable module and private-network consumer are public and passed local qualification: 52 module mock cases, two caller cases, and both mutation proofs. The independent module repository also passed hosted Linux CI on Terraform 1.14.8 and 1.16.4 in run 36990206303 at b7133679a89b1e2b36677400d659a03907c0f3f6; native agent-setup CI passed in run 37286068987 on commit 00787f59ac19e3db0c3869a96ff45805c6cb523d, and final module verification run 37286237657 passed on commit 02e10e56bc15cc30c3193dce3ddc8e608cb87daf. The session repository's module copy, genuine recordings, and Azure evidence remain pending. The approved `build_then_record_clean_run` approach permits qualification before filming; current qualification has not been filmed. Later footage must identify prepared code and its clean starting checkpoint. Speaker names, titles, and employer are user-provided; no bios, handles, or emails are included.

Product demonstrations require genuine native CLI or real integrated-terminal footage. Recording automation is external, behind-the-scenes tooling, not a Squad feature.
