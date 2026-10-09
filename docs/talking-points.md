# Presenter talking points: 60-minute layout

Concise cheat-sheet for the Reveal deck. Full script: [talk-track.md](talk-track.md). Live demo runbook: [demo-runbook.md](demo-runbook.md). Product update detail: [whats-new.md](whats-new.md). Deck URL: <https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/>.

## Opening hooks / big news

- 60:00 total: 00:00-03:00 intro, 03:00-55:00 planned content and live chapters, 55:00-58:00 protected slack, 58:00-60:00 close plus "questions if time allows".
- No planned question block. Appendix is for hallway questions or early finish.
- Copilot CLI is GA; the terminal is a normal engineering surface.
- Squad 1.0.1 coordinates the demo team; npm/docs labels may lag.
- Computer use is public preview and is not used in this Terraform demo.
- Pre-show legal/futures notice is untimed: preview features may change; status is as of 14 Oct 2026; no warranties; dates are subject to change.
- The terminal and browser work is live. We disclose prepared checkpoints, inherited code, prompts, and fallback evidence.
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
- Identify the live and prepared parts, disclose fallback evidence, and scope runtime claims to the checks.
- Leave code and check output that the audience can inspect.

### 03:00-03:30, s03-baseline, Martin
- Public source, qualification revision, and clean live checkpoint are separate.
- Not first implementation; live run demonstrates one bounded change.
- Say what was prepared before the live run starts.

### 03:30-04:00, s04-news, Martin
- Lead with Auto model selection and Project HydraFusion.
- Pin `/model` to `claude-sonnet-5` on stage for eval parity, then describe Auto or HydraFusion as the cost lever.
- Keep the rest to anchors: CLI GA, Squad 1.0.1, Terraform MCP, Azure MCP, GitHub agent news, and one AKS line.
- Name the current controls and their limits.

### 04:00-05:00, s04-layers, Haflidi then Martin
- CLI runs work; Squad coordinates responsibilities; Terraform, Git, Learn, and MCP return evidence.
- MCP = Model Context Protocol, an external source/tool connection.
- The control spectrum is not a maturity ladder: Ask → edit → plan → agent → programmatic `-p` → Squad multi-agent with gates. Our chapters use different points on it: C0 setup/runway, C1 ask/compare, C2 plan, C3 route to agent, C4 tools + permissions, C5 edit/repair loop, C6 resume, C7 gated review. More automation is not better by default; human approvals remain at the gates. `-p` is appendix automation, not a live chapter.
- Show the files, decision record, and check output.

### 05:00-05:30, s07-agent-setup, Martin
- `AGENTS.md` and Copilot instructions are always-on guidance.
- `.squad\` owns roster, routing, decisions, charters, and handoffs.
- Three native lanes: `terraform-coder`, `terraform-validator`, `terraform-reviewer`.
- Tool filters are not a sandbox.
- Select each native profile explicitly and keep its scope narrow.

### 05:30-08:30, C0 From zero to a squad, Haflidi
- Cut 07:45.
- Show tools absent; install Git, Copilot CLI, and Squad with WinGet.
- `copilot`; `/login`; `/exit`; clone public module.
- `squad init`; `git status --short`; `copilot --agent squad`; propose/confirm roster; `/exit`; `squad doctor`.
- Playbook depth: prerequisites/install, init, hire, verify, upgrade safely later.
- Show the team files in Git after the human confirms the roster.

### 08:30-10:30, s05-parallel, Martin
- Three lanes: coder writes, validator runs fixed offline checks, reviewer reviews in fresh context.
- Handoff names file, check, next owner.
- One writer owns a shared Terraform surface.
- One writer owns each shared Terraform file.

### 10:30-12:30, s06-contract, Haflidi
- Module owns resources, inputs, outputs, and provider requirements.
- Caller owns provider, backend, auth, state, and environment values.
- Private Automatic consumes approved existing network inputs.
- Show which approved platform inputs the module consumes.

### 12:30-15:30, C1 Compare two plans, Martin drives; Haflidi compares
- Cut 14:45.
- `/new`, `/agent` Squad, `/model`, `/plan`, `/rename C1-A`; repeat as C1-B.
- Use the same prompt and model. Compare one consequence rather than answer length.
- B1 failed because every run wrote two asserts against a pre-registered minimum of three.
- B1v2 was a separate, clarified brief that asks for four separate asserts. It was 5/5. No causal claim. Live still has to pass.
- Keep the inputs fixed so the comparison is worth reading.

### 15:30-17:30, s08-plan-boundary, Haflidi
- Extract the reusable module. Keep environment-specific setup in the consumer.
- Fresh consumer and existing deployment need different migration review.
- Public example must explain interface without private values.
- Agree the approval boundary before implementation.

### 17:30-21:30, C2 Plan mode, Martin
- Cut 20:30; must be out by 21:30.
- `/new`, `/rename guided-clean-run`, `/agent` Squad, `/instructions`, `/plan`.
- Reference main, variables, and contract test; plan regression, README explanation, labeled mutation/repair.
- Revise to put unchanged assertions and offline checks before docs; inspect `/session plan`.
- Plan approval authorizes only the named repository changes.

### 21:30-22:00, s10-tool-roles, Haflidi
- Instructions = expectations; skills turn a repeated procedure into reusable, versioned guidance; MCP = source/tool connection.
- Second opinion from a different model (Rubber Duck, GA 2026-06-02, `/rubber-duck` in Copilot CLI) is review input, not approval; our reviewer lane stays the gate.
- Explain what instructions, skills, and MCP each contribute.

### 22:00-26:00, C3 Assign one writer, Martin
- Cut 25:00.
- `/agent` Squad, `/tasks`, `/agent list`, `/mcp`, `/agent terraform-coder`.
- Use B1v2 brief: work only in module; add `alternate_network_payload`; four separate asserts; error messages; test file only.
- Inspect the actual diff before calling an assigned task complete.

### 26:00-26:30, s12-source-check, Haflidi
- Follow source claim into resource body.
- Variable names do not establish contracts.
- Keep source versions with assertions.
- Assert the generated resource body.

### 26:30-29:30, s13-test-gap, Haflidi
- B1 failed because every run wrote two asserts against a pre-registered minimum of three.
- B1v2 was a separate, clarified brief that asks for four separate asserts; 5/5 under pinned conditions; no guarantee; live still must pass.
- Test the test with deliberate mutation.
- State the checker rule before running the task.

### 29:30-33:30, C4 Guidance and source, Martin
- Cut 32:30.
- `/skills info test-discipline`, `/mcp`, invoke test-discipline.
- Read-only Microsoft Learn source for AKS Automatic private/custom network.
- Show citation/version and one narrow permission decision.
- Include the source and version with the change.

### 33:30-38:30, C5 Seed, fail, repair, Haflidi
- Cut 37:15; must be out by 38:30.
- Validator runs before check.
- Coder makes deliberate lab mutation: `enablePrivateCluster` true to false.
- Validator detects intended assertion; review; restore only that field; rerun repaired.
- Preserve the failing assertion and repair evidence. Local checks do not establish Azure acceptance.

### 38:30-41:30, s15-proof, Haflidi with Martin
- Separate source inspection, local mocks, consumer checks, plan/apply, and read-back.
- A runtime check is evidence only for what it checks.
- Human-authored and agent-assisted changes need the same evidence and approval.
- Sanitized Azure read-back applies only to pinned runtime module revision.
- State exactly what each check established.

### 41:30-42:00, s16-continuity, Martin
- Record the decision and why we made it.
- Repository decision and CLI resume are different artifacts.
- Check that the resumed task read the decision.

### 42:00-45:00, C6 Save and resume, Haflidi
- Cut 44:15.
- Agent writes public-only decision to `.squad\decisions\inbox\`.
- Scribe merges accepted entries into the shared decision ledger.
- `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`; cite decision file and constraints.
- The next task must read the recorded reason.

### 45:00-47:00, s18-memory, Martin
- Conversation context, native memory, and Squad knowledge have different owners.
- Keep private environment mapping out of public team history.
- Keep requirements where the next owner can review them.

### 47:00-50:00, C7 Validate and review, Haflidi
- Cut 49:15.
- Validator runs C7 block; inspect `/diff`; `/new`; `/agent terraform-reviewer`.
- Supply exact diff, files, revision, MCP citations, and sanitized validator results.
- Approve the exact artifact and scope.

### 50:00-53:00, s20-consumer, Martin
- 50:00-50:30: consumer-to-module diagram.
- 50:30-51:00: live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; branded page, pipeline flow, serving pod, speakers.
- 51:00-52:10: Whether a change is human-authored or agent-assisted, it goes through the same gates: GitHub identity, OIDC for Azure, scans, required review, branch protection, environment approval, and an Actions audit trail.
- Map: PR -> checks/scans -> review + protected main -> plan -> environment approval -> OIDC apply -> runtime check.
- 52:10-53:00: boundary; documented gaps stay visible: single-maintainer admin override, self-review setting, and environment gate before the apply job's plan; appendix handles Online/security depth.
- Reuse the module without copying the private setup.

### Optional 53:00-54:30, Squad on ACA, use only if ahead
- Keep it inside content time, compress `s21-limits` to 0:30 if needed, and skip it if it would touch 55:00-58:00.
- Haflidi's `haflidif/squad-on-aca` runs Squad agents as Azure Container Apps jobs. Current run evidence is under Management; Corp validation remains a separate gate. A GitHub issue labeled for an agent lands in a queue, an ACA job runs the agent, and a bot opens the PR.
- Benefit: unattended execution in our own Azure tenant, no presenter laptop, secrets in Key Vault, private networking available, managed identity for the run, same PR gates, variable cost per run well under USD 0.01, and separate fixed holding costs.
- Public-safe proof from 9 Oct: a second fresh end-to-end run passed. The presenter flow created and labeled a new issue, the enqueue workflow succeeded, the ACA agent job finished in 56 seconds, and the bot app opened the PR. Test issues and PRs were then closed, and the repo was clean.
- Safety and ops checks: an unlabeled issue triggered nothing; Terraform plan for the stack was unchanged; private networking and NSGs were checked; no secrets were found in the run logs.
- The environment is in Norway East because Sweden Central hit ACA capacity errors.
- Presenter procedure, validated 9 Oct: 1) `gh issue create --repo martinopedal/squad-on-aca-demo-target --title "Demo task" --body "Ask ripley to make a tiny README/doc change."` 2) `gh issue edit <n> --repo martinopedal/squad-on-aca-demo-target --add-label squad:ripley` 3) `gh run list --repo martinopedal/squad-on-aca-demo-target --workflow squad-queue.yml --limit 3` 4) watch the ACA job execution in the Azure portal or with `az containerapp job execution list` 5) `gh pr list --repo martinopedal/squad-on-aca-demo-target --author app/squad-on-aca-nic2026-demo --state open`
- Fallback: show the finished proof chain and move on.

### 53:00-55:00, s21-limits, Haflidi then Martin
- Plan mode for decisions before edits.
- Squad for ownership and handoffs.
- Skills and MCP with source provenance.
- Include the diff, reason, and check output in the handoff.

### 55:00-58:00, protected slack, Martin owns the clock
- Keep 55:00-58:00 for recovery only. Do not add a recap, new explanation, or extra Q&A. Start the close at 58:00.

### 58:00-60:00, s22-close, Martin
- Humans set direction and approve; agents help move work through the same gated loop.
- Day 2: the same loop for operations: detect, propose, review, approve, apply, verify.
- Close with public handoff and scoped evidence.
- Say appendix is available for hallway questions.
- "Questions if time allows" only if ahead.
- Keep unresolved limits visible in the public handoff.

## Five working rules

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
- Review the resulting team files in Git.

### a-use-cases
- CLI runs the work; Squad routing assigns owner and records why.
- Useful for cross-owner work, long-running work, backlog, and review.
- Skip for small single-lane edits.
- Use Squad for work that needs shared ownership and a decision record.

### a-online
- Same module, consumed by tag from a separate repo.
- Guardrails shape the design: private state, NSG on every subnet, limited API access.
- Runtime evidence: 29/29 outside-in checks for the Online path.
- Keep the same approval and evidence boundaries in the Online consumer.

### a-security
- GHAS baseline: CodeQL, secret scanning with push protection, Dependabot; zero open alerts at check time.
- Agent found silent gaps: disabled scans, parser misses, falsely green monitor, approval race, VM check blind spot.
- Claims re-checked with module cases, Online read-back checks, and VM checks.
- Explain which gaps scanners and scripted checks each cover.

### a-prompts
- Guardrails first, source facts through MCP, one lane per step.
- B1 failed because every run wrote two asserts against a pre-registered minimum of three. B1v2 was a separate, clarified brief that asks for four separate asserts and was 5/5 under pinned conditions. Measured checkpoint, not a causal claim or guarantee; live still must pass.
- Live run still has to pass.
- Keep the prompt bounded and its claims testable.
