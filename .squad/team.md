# Squad Team

> GitHub Copilot CLI and Squad for Terraform

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| lead | Terraform architecture and task boundaries | `.squad/agents/lead/charter.md` | Configured |
| reviewer | Code, evidence, and rehearsal review | `.squad/agents/reviewer/charter.md` | Configured |
| devrel | Demo experience and recording | `.squad/agents/devrel/charter.md` | Configured |
| security | Corp integration and publication boundaries | `.squad/agents/security/charter.md` | Configured |
| docs | Reveal presentation and speaker material | `.squad/agents/docs/charter.md` | Configured |
| Scribe | Shared decision recording | `.squad/agents/scribe/charter.md` | Configured |
| Rai | RAI reviewer for safety, privacy, and credential checks | `.squad/agents/rai/charter.md`; `.squad/rai/policy.md` | Configured policy/charter; triggered by coordinator or review ceremonies |
| Fact Checker | Verification and devil's-advocate claim checks | `.squad/agents/fact-checker/charter.md`; `.squad/fact-checker/policy.md` | Configured policy/charter; triggered by coordinator or pre-publish verification |
| Ralph | Optional work monitoring | `.squad/agents/ralph/charter.md` | Not enabled |

## Project Context

- **Project:** Public two-speaker Terraform session
- **Created:** 2026-09-30
- **Presenters:** Martin Opedal, Enterprise Cloud Solution Architect, Microsoft; Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft
- **Purpose:** Teach native Copilot CLI capabilities and Squad teamwork through a documented, tested Azure Terraform module.
- **Code boundary:** Generic module and examples are public. Real ALZ environment inputs, identities, credentials, policy evidence, and state are not.
- **Deployment:** Reuse approved Corp platform dependencies. No implicit Azure apply, policy exemptions, or estate imports.

Configured members are available for routing; this roster is not a claim that every member is currently running. Observe actual task IDs and results in the CLI. Rai and Fact Checker have charters and policies but are not listed in the casting registry as active preset members.

## Native Terraform executors

[terraform-coder](../.github/agents/terraform-coder.agent.md),
[terraform-validator](../.github/agents/terraform-validator.agent.md), and
[terraform-reviewer](../.github/agents/terraform-reviewer.agent.md) are native
profiles, not newly cast Squad members. Lead owns scope, validator owns the
offline command run, and reviewer owns the review handoff. The operator
explicitly selects the native profile when its narrow tools are desired; ordinary
Squad tasks retain their own tools. Keep the existing coordinator, casting, and
private-state boundaries unchanged.
