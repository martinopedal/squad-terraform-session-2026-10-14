# Sessionize copy

Conference organizers can use this copy for the session listing. Attendees can use it to judge the topic, level, prerequisites, and expected outcomes. This is submission-ready copy, not a claim that full rehearsal is complete; the Azure deployment claim is limited to the sanitized private IaC validation described below.

## Title

From prompt to reusable Terraform: Copilot CLI and Squad

## Description and outcomes

A useful agent session should leave more than a convincing answer. It should leave code another engineer can understand, test, and consume.

In the past year, Copilot CLI became generally available, skills and MCP spread across Copilot surfaces, and Squad reached 1.0. Martin and Haflidi show how native GitHub Copilot CLI features and Squad work together on an existing AKS Terraform codebase. The outcome is a reusable infrastructure module, documented and tested around a clear contract, with a consumption example for an existing Azure landing zone. The primary path uses private Corp networking and pre-provisioned platform services, not a new public standalone environment.

We start with the files and decisions that shape the work. Native Plan mode makes the proposed change visible before implementation. Reviewed files, instructions, skills, and MCP lookups focus the agent. Squad adds roles, routing, ownership, handoffs, and repository-backed decisions. Three narrow agent profiles in the repository are a coder, a validator, and a separate reviewer. The validator has no `edit` tool, but its shell can still write files; instructions and native approval prompts enforce its command list. They narrow lanes without pretending they are sandboxes. Parallel work stays bounded; humans review changes.

Code qualification comes first. The live session shows genuine new Copilot CLI execution with Squad selected from a disclosed clean checkpoint, not the first-ever implementation. Both speakers narrate the decisions live. We'll inspect the plan, follow a handoff, read a meaningful failed check, and discuss the repair. We'll also use diff and review tools, resume with decisions intact, and explain model, context, and usage controls. Worktrees, recovery, bounded automation, and cloud delegation stay in a concise reference section.

You'll leave able to choose an appropriate CLI or Squad workflow, define a module boundary, and connect an agent's claim to evidence. You'll also know why passing local tests, a reviewed Terraform plan, and observed Azure behavior are different milestones.

Public code and examples stay separate from private inputs, identities, backend/state, and secrets. The October 5 Azure validation is cited only as sanitized, revision-bound evidence, not reusable environment data.

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
| Format | Two-speaker technical session with CLI chapters, live narration, and Q&A |
| Audience | Infrastructure engineers, platform engineers, and Terraform practitioners |
| Level | Intermediate |
| Prerequisites | Familiarity with Terraform modules, Git, Azure networking, and basic AKS concepts; no prior Squad experience required |
| Technology | GitHub Copilot CLI, Squad 1.0, custom agents, Terraform, AzAPI, Azure Kubernetes Service, Azure landing zones, MCP, and Reveal.js |

## Editorial status

The reusable module and private-network consumer are public and passed local qualification: 52 module mock cases, two caller cases, and both mutation proofs. The independent module repository passed hosted Linux CI on Terraform 1.14.8 and 1.16.4, native agent-setup CI, and release run 37305768318. A private IaC consumer deployed and read back runtime module commit `02e10e56bc15cc30c3193dce3ddc8e608cb87daf` on October 5, 2026, with sanitized ARM assertions for Automatic SKU, private API/VNet integration, UDR, OIDC/workload identity, custom private DNS, and Succeeded provisioning. Native profile selection and full rehearsal remain pending. Speaker names, titles, and employer are user-provided; no bios, handles, or emails are included.

Product demonstrations require genuine native CLI or real integrated-terminal use. Behind-the-scenes automation is external tooling, not a Squad feature.

**October 6 addition (appendix, question-driven):** the upstream module was also deployed to an Azure landing zone **Online** subscription through a human-gated GitHub Actions pipeline (OIDC, private Terraform state, ephemeral VNet runner, authorized-IP API server), with a demo app proven over HTTPS by the pipeline itself. That consumer run found seven issues: six fixed, five of them in the module with tests written first (including the SKU itself: the module now offers a true AKS Automatic SKU and the Online cluster was rebuilt on it), and one documented. Details: `docs/online-demo.md`; rerunnable prompts: `docs/prompt-pack.md`. The primary session path remains the private Corp cluster.
