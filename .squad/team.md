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
| Ralph | Optional work monitoring | `.squad/agents/ralph/charter.md` | Not enabled |

## Project Context

- **Project:** Public two-speaker Terraform session
- **Created:** 2026-09-30
- **Presenters:** Martin and Haflidi
- **Purpose:** Teach native Copilot CLI capabilities and Squad teamwork through a documented, tested Azure Terraform module.
- **Code boundary:** Generic module and examples are public. Real ALZ environment inputs, identities, credentials, policy evidence, and state are not.
- **Deployment:** Reuse approved Corp platform dependencies. No implicit Azure apply, policy exemptions, or estate imports.

Configured members are available for routing; this roster is not a claim that every member is currently running. Observe actual task IDs and results in the CLI.
