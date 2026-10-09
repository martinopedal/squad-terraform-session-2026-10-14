# Presenter talking points: 60-minute layout

Concise cheat-sheet for the Reveal deck. Full script: [talk-track.md](talk-track.md). Live demo runbook: [demo-runbook.md](demo-runbook.md). Product update detail: [whats-new.md](whats-new.md). Deck URL: <https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/>.

## Opening hooks / big news

- 60:00 total: 00:00-03:00 intro, 03:00-55:00 planned content and live chapters, 55:00-58:00 protected slack, 58:00-60:00 close plus "questions if time allows".
- No planned question block. Appendix is for hallway questions or early finish.
- Copilot CLI is GA; the terminal is a normal engineering surface.
- Squad 1.0.1 coordinates the demo team; npm/docs labels may lag.
- Computer use is public preview and is not used in this Terraform demo.
- Pre-show legal/futures notice is untimed: preview features may change; status is as of 14 Oct 2026; no warranties; dates are subject to change.
- The terminal and browser work is live. Prepared checkpoints, inherited code, prompts, and fallback evidence are disclosed.
- Use runtime check/evidence language. Never imply local mocks establish Azure acceptance.

## Clock checkpoints, cuts, and drop order

- Checkpoints: after C0 at 08:30; after C2 at 21:30; after C5 at 38:30; start `s20-consumer` at 50:00; finish planned content at 55:00; start close at 58:00.
- Live cut lines: C0 07:45, C1 14:45, C2 20:30, C3 25:00, C4 32:30, C5 37:15, C6 44:15, C7 49:15.
- Drop order if behind: compress `s21-limits`; trim `s18-memory`; trim `s15-proof`; trim `s13-test-gap`; trim `s05-parallel`; shorten `s20-consumer` while keeping the 50:30-51:00 reveal; use chapter fallback.

## Slide and chapter cues

### 00:00-03:00, s01-outcome, Martin then Haflidi
- Introduce Martin Opedal, Enterprise Cloud Solution Architect, Microsoft (`opedal.tech`).
- Introduce Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft.
- Audience promise: reusable Terraform module for private AKS in an existing landing zone.
- What they will see: Copilot CLI, Squad, three lanes, tests, mutation/repair, consumer reveal.
- Keep the live and prepared parts separate. Disclose fallback evidence. Scope runtime evidence to what it actually checks.
- Leave the audience with code and check output they can inspect.

### 03:00-03:30, s03-baseline, Martin
- Public source, qualification revision, and clean live checkpoint are separate.
- Not first implementation; live run demonstrates one bounded change.
- Say what was prepared before the live run starts.

### 03:30-04:00, s04-news, Martin
- Copilot CLI GA; terminal controls are normal engineering surface.
- Squad 1.0.1; Agent HQ/AI Credits/computer use status labels stay honest.
- Computer use is not part of this Terraform demo.
- Name the current controls and the current limits.

### 04:00-05:00, s04-layers, Haflidi then Martin
- CLI runs work; Squad coordinates responsibilities; Terraform, Git, Learn, and MCP return evidence.
- MCP = Model Context Protocol, an external source/tool connection.
- This session uses a few points on the control spectrum. C0 is setup and runway. C1 is ask and compare. C2 is plan mode. C3 routes to an agent. C4 uses tools and permissions. C5 is the edit and repair loop. C6 is resume. C7 is gated review. More automation is not better by default. Human approvals stay at the gates. Keep `-p` in the appendix because it is batch automation and not part of the live run.
- Show the files, the decision, and the check output.

### 05:00-05:30, s07-agent-setup, Martin
- `AGENTS.md` and Copilot instructions are always-on guidance.
- `.squad\` owns roster, routing, decisions, charters, and handoffs.
- Three native lanes: `terraform-coder`, `terraform-validator`, `terraform-reviewer`.
- Tool filters are not a sandbox.
- Keep the lanes narrow and choose them explicitly.

### 05:30-08:30, C0 From zero to a squad, Haflidi
- Cut 07:45.
- Show tools absent; install Git, Copilot CLI, and Squad with WinGet.
- `copilot`; `/login`; `/exit`; clone public module.
- `squad init`; `git status --short`; `copilot --agent squad`; propose/confirm roster; `/exit`; `squad doctor`.
- Playbook depth: prerequisites/install, init, hire, verify, upgrade safely later.
- The team is reviewable in Git from minute one.

### 08:30-10:30, s05-parallel, Martin
- Three lanes: coder writes, validator runs fixed offline checks, reviewer reviews in fresh context.
- Handoff names file, check, next owner.
- One writer owns a shared Terraform surface.
- One writer per shared Terraform file keeps the run manageable.

### 10:30-12:30, s06-contract, Haflidi
- Module owns resources, inputs, outputs, and provider requirements.
- Caller owns provider, backend, auth, state, and environment values.
- Private Automatic consumes approved existing network inputs.
- Build the module around the platform the customer already runs.

### 12:30-15:30, C1 Compare two plans, Martin drives; Haflidi compares
- Cut 14:45.
- `/new`, `/agent` Squad, `/model`, `/plan`, `/rename C1-A`; repeat as C1-B.
- Use the same prompt and model. Compare one consequence. Do not compare verbosity.
- B1 0/5 because ambiguous brief produced two assert blocks; oracle expected four.
- B1v2 stated the rule and was 5/5. No causal claim. Live still has to pass.
- Fixed inputs make the comparison worth reading.

### 15:30-17:30, s08-plan-boundary, Haflidi
- Extract a reusable module. Keep the environment-specific setup in the consumer.
- Fresh consumer and existing deployment need different migration review.
- Public example must explain interface without private values.
- Put the approval boundary in place before implementation.

### 17:30-21:30, C2 Plan mode, Martin
- Cut 20:30; must be out by 21:30.
- `/new`, `/rename guided-clean-run`, `/agent` Squad, `/instructions`, `/plan`.
- Reference main, variables, and contract test; plan regression, README explanation, labeled mutation/repair.
- Revise to put unchanged assertions and offline checks before docs; inspect `/session plan`.
- Approval covers repository changes only.

### 21:30-22:00, s10-tool-roles, Haflidi
- Instructions = expectations; skills turn a repeated procedure into reusable, versioned guidance; MCP = source/tool connection.
- Second opinion from a different model (Rubber Duck, GA 2026-06-02, `/rubber-duck` in Copilot CLI) is review input. Our reviewer lane stays the gate.
- Give instructions, skills, and MCP different jobs.

### 22:00-26:00, C3 Assign one writer, Martin
- Cut 25:00.
- `/agent` Squad, `/tasks`, `/agent list`, `/mcp`, `/agent terraform-coder`.
- Use B1v2 brief: work only in module; add `alternate_network_payload`; four separate asserts; error messages; test file only.
- Assigning the work does not finish the work.

### 26:00-26:30, s12-source-check, Haflidi
- Follow source claim into resource body.
- Variable names do not establish contracts.
- Keep source versions with assertions.
- Show the resource body the claim depends on.

### 26:30-29:30, s13-test-gap, Haflidi
- Ambiguous brief: B1 0/5; oracle required separate asserts.
- Clarified brief: B1v2 5/5 under pinned conditions; no guarantee; live still must pass.
- Test the test with deliberate mutation.
- State the checker rule before the run.

### 29:30-33:30, C4 Guidance and source, Martin
- Cut 32:30.
- `/skills info test-discipline`, `/mcp`, invoke test-discipline.
- Read-only Microsoft Learn source for AKS Automatic private/custom network.
- Show citation/version and one narrow permission decision.
- Keep the source and version with the artifact.

### 33:30-38:30, C5 Seed, fail, repair, Haflidi
- Cut 37:15; must be out by 38:30.
- Validator runs before check.
- Coder makes deliberate lab mutation: `enablePrivateCluster` true to false.
- Validator detects intended assertion; review; restore only that field; rerun repaired.
- Preserve cause and effect. A local runtime check is not Azure acceptance evidence.

### 38:30-41:30, s15-proof, Haflidi with Martin
- Separate source inspection, local mocks, consumer checks, plan/apply, and read-back.
- A runtime check is evidence only for what it checks.
- Evidence feeds the gate; the gate doesn't care who typed the diff.
- Sanitized Azure read-back applies only to pinned runtime module revision.
- Keep every claim scoped to the evidence behind it.

### 41:30-42:00, s16-continuity, Martin
- Save the reason the next task needs. The transcript is not the artifact.
- Repository decision and CLI resume are different artifacts.
- Verify that continuity holds before you continue.

### 42:00-45:00, C6 Save and resume, Haflidi
- Cut 44:15.
- Agent writes public-only decision to `.squad\decisions\inbox\`.
- Scribe merges accepted entries into the shared decision ledger.
- `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`; cite decision file and constraints.
- Make the next task read the saved reason.

### 45:00-47:00, s18-memory, Martin
- Conversation context, native memory, and Squad knowledge have different owners.
- Keep private environment mapping out of public team history.
- Put requirements where the next owner can review them.

### 47:00-50:00, C7 Validate and review, Haflidi
- Cut 49:15.
- Validator runs C7 block; inspect `/diff`; `/new`; `/agent terraform-reviewer`.
- Supply exact diff, files, revision, MCP citations, and sanitized validator results.
- Approve a specific artifact and a specific scope.

### 50:00-53:00, s20-consumer, Martin
- 50:00-50:30: consumer-to-module diagram.
- 50:30-51:00: live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; branded page, pipeline flow, serving pod, speakers.
- 51:00-52:10: Whether a change is human-authored or agent-assisted, it goes through the same gates: GitHub identity, OIDC for Azure, scans, required review, branch protection, environment approval, and an Actions audit trail.
- Map: PR -> checks/scans -> review + protected main -> plan -> environment approval -> OIDC apply -> runtime check.
- 52:10-53:00: boundary; documented gaps stay visible: single-maintainer admin override, self-review setting, and environment gate before the apply job's plan; appendix handles Online/security depth.
- Show how to reuse the module code without copying the private environment.

### 53:00-55:00, s21-limits, Haflidi then Martin
- Plan mode for decisions before edits.
- Squad for ownership and handoffs.
- Skills and MCP with source provenance.
- When you hand work over, include the diff, the reason, and the check output.

### 55:00-58:00, protected slack, Martin owns the clock
- If we are on time, use 55:00 to 58:00 for a short recap or a quick question. If we are behind, use that time to catch up before the close.

### 58:00-60:00, s22-close, Martin
- Humans set direction and approve; agents help move work through the same gated loop.
- Day 2: the same loop for operations: detect, propose, review, approve, apply, verify.
- Close with public handoff and scoped evidence.
- Say appendix is available for hallway questions.
- "Questions if time allows" only if ahead.
- State the limits so the handoff stays useful.

## Top 5 points

1. Copilot CLI runs the work; Squad coordinates ownership and memory.
2. Use narrow native profiles, but do not treat tool filters as a sandbox.
3. Keep provider, backend, authentication, and state ownership outside the reusable module.
4. Separate local mocks, consumer checks, real plans, and Azure read-back.
5. Record decisions and evidence so the next engineer can resume without trusting a transcript.

## Likely questions with short answers

**When would you skip Squad?** Use one Copilot CLI session for a small, well-understood edit where context, diff, and review fit in one lane.

**Is rewind a rollback?** No. Rewind is CLI session or edit recovery. It is not Azure rollback and does not reverse external operations.

**Why not autopilot the whole task?** Autopilot can help with a finite task and clear permissions. It does not settle environment authority or deployment consent.

**Why are mocked tests not enough?** They check the contract you wrote. They do not establish subnet capacity, DNS, policy, identity, or service behavior in Azure.

**How do we share team knowledge safely?** Put public decisions with the module. Keep private scope mapping, state, credentials, and personal memory out of public artifacts.

## Appendix cues (question-driven, no scheduled time)

### a-bootstrap
- Prereqs, install, `squad init`, `copilot --agent squad`, confirm roster, `squad doctor`.
- Init Mode asks first; confirm before team files are written.
- Commit `.squad\`; back up before upgrade.
- The setup is five steps, and each step is reviewable in Git.

### a-use-cases
- CLI runs the work; Squad routing assigns owner and records why.
- Useful for cross-owner work, long-running work, backlog, and review.
- Skip for small single-lane edits.
- Use Squad when ownership and memory matter.

### a-online
- Same module, consumed by tag from a separate repo.
- Guardrails shape the design: private state, NSG on every subnet, limited API access.
- Runtime evidence: 29/29 outside-in checks for the Online path.
- The topology is simpler, and the boundary discipline stays the same.

### a-security
- GHAS baseline: CodeQL, secret scanning with push protection, Dependabot; zero open alerts at check time.
- Agent found silent gaps: disabled scans, parser misses, falsely green monitor, approval race, VM check blind spot.
- Claims re-checked with module cases, Online read-back checks, and VM checks.
- Scanners and scripted oracles catch different problems.

### a-prompts
- Guardrails first, source facts through MCP, one lane per step.
- B1 stayed 0/5; B1v2 was 5/5 under pinned conditions after the oracle rule was made explicit. Measured checkpoint, not a causal claim or guarantee; live still must pass.
- Live run still has to pass.
- Narrow the choices and make each claim checkable.
