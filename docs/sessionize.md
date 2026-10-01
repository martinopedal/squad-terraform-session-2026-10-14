# Sessionize copy

Conference organizers can use this copy for the session listing. Attendees can use it to judge the topic, level, prerequisites, and expected outcomes. This is submission-ready copy, not a claim that recordings, publication, or Azure deployment are complete.

## Title

From prompt to reusable Terraform: Copilot CLI and Squad

## Description and outcomes

A useful agent session should leave more than a convincing answer. It should leave code another engineer can understand, test, and consume.

Martin and Haflidi show how native GitHub Copilot CLI features and Squad work together on an existing AKS Terraform codebase. The outcome is a reusable infrastructure module, documented and tested around a clear contract, with a consumption example for an existing Azure landing zone. The primary path uses private Corp networking and pre-provisioned platform services, not a new public standalone environment.

We start with the files and decisions that shape the work. Native Plan mode makes the proposed change visible before implementation. Explicit file context, reviewed instructions, skills, and MCP lookups help the agent work with the right information. Squad adds roles, routing, ownership, handoffs, and repository-backed decisions. Parallel work stays bounded, and a human still reviews what changed.

Short recordings of genuine Copilot CLI sessions with Squad selected support live explanation by both speakers. We'll inspect the plan, follow a handoff, read a meaningful failed check, and discuss the repair. Along the way, we'll use diff and review tools, resume a session with its decisions intact, and explain model, context, and usage controls. Useful extras such as worktrees, recovery, bounded automation, and cloud delegation stay in a concise reference section.

You'll leave able to choose an appropriate CLI or Squad workflow, define a module boundary, and connect an agent's claim to evidence. You'll also know why passing local tests, a reviewed Terraform plan, and observed Azure behavior are different milestones.

Public module code and generic examples remain separate from environment inputs, identities, backend/state, and secrets. Live policy and deployment evidence depend on an authorized environment and remain explicit gates, not promises hidden in the demo.

## Elevator pitch

Turn an existing AKS codebase into a reusable Terraform module with GitHub Copilot CLI and Squad. Martin and Haflidi connect native planning, context, tools, and review with team ownership and handoffs. Learn practical habits for private Azure landing-zone consumption, readable evidence, and a clean boundary between public code and private environment configuration.

## Session details

| Field | Value |
| --- | --- |
| Speakers | Martin and Haflidi |
| Date | Wednesday, October 14, 2026 |
| Time | 10:00-11:00, UTC+02:00 |
| Room | Room 6 |
| Language | English |
| Format | Two-speaker technical session, recorded CLI chapters with live narration, and Q&A |
| Audience | Infrastructure engineers, platform engineers, and Terraform practitioners |
| Level | Intermediate |
| Prerequisites | Familiarity with Terraform modules, Git, Azure networking, and basic AKS concepts; no prior Squad experience required |
| Technology | GitHub Copilot CLI, Squad, Terraform, AzAPI, Azure Kubernetes Service, Azure landing zones, MCP, and Reveal.js |

## Editorial status

The module extraction and private-network consumer path supersede the earlier root-only scenario. The inherited source has real quality issues; the talk does not claim they were AI-caused or already repaired. Module validation, approved recordings, real policy/deployment evidence, and public release confirmation must be checked before advertising the session as fully recorded or deployed. No speaker biography, surname, or employer has been inferred.

Product demonstrations require genuine native CLI or real integrated-terminal footage. Recording automation is external, behind-the-scenes tooling, not a Squad feature.
