# Presenter talking points: 60-minute layout

Concise cheat-sheet for the Reveal deck. Full script: [talk-track.md](talk-track.md). Live demo runbook: [demo-runbook.md](demo-runbook.md). Product update detail: [whats-new.md](whats-new.md). Deck URL: <https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/>.

Operator references: [repo map](repositories.md), [progress matrix](sandboxing.md#october-12-progress-and-next-actions),
[full pre-stage coverage](aca-sandboxes.md#full-test-coverage-checklist) and
[two product operator cards](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).
Draft deck 0.22.4 source branch/PR is not merged or released; prior accepted draft 0.22.3 preserved.

## Opening hooks / big news

- 60:00 total: 00:00-03:00 intro, 03:00-55:00 planned content and live chapters, 55:00-58:00 protected slack, 58:00-60:00 close plus "questions if time allows".
- No planned question block. Appendix is for hallway questions or early finish.
- Copilot CLI is GA; the terminal is a normal engineering surface.
- Auto model selection and Project HydraFusion lead the approved news; retain status/cost qualifications and pin the stage model for eval parity.
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
- Live demo consumer: `martinopedal/aks-automatic-demo-env`, pinning `martinopedal/terraform-azapi-aks-automatic` at `v0.6.0`. The copied Corp teaching module retains its separate `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` pin/manifest.
- Not first implementation; live run demonstrates one bounded change.
- Say what was prepared before the live run starts.

### 03:30-04:00, s04-news, Martin
- Lead with Auto model selection and Project HydraFusion.
- Pin `/model` to `claude-sonnet-5` on stage for eval parity, then describe Auto or HydraFusion as the cost lever. Auto honors admin model policies and gives paid subscribers a 10% discount; legacy annual Pro/Pro+ plans use premium-request multipliers until expiry. HydraFusion is research preview, with offline benchmarks and estimated costs, not savings measured here.
- Keep the rest to anchors: CLI GA, Squad 1.0.1, Terraform MCP, Azure MCP, GitHub agent news, and one AKS line.
- ACA Sandboxes GA in September after June preview is additional context. C4 needs independently approved selected-target IaC, access/effective-policy read-back, full required coverage and presenter rehearsal. Online is proposed, not a promised live clip.
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
- Squad is coordination/configuration over Copilot, not a sandbox product; installed 1.0.1 help has no sandbox verb. A worktree/tool filter does not isolate credentials.
- Four hosts: local OS/MXC `/sandbox`; GitHub-managed Copilot cloud sandboxes built on ACA in preview; customer-managed ACA MicroVMs via `aca`; Squad hosted ACA Apps/Jobs, not MicroVMs. GitHub documents interactive-only `copilot --cloud --experimental`, never with `-p`/`-i`, but local 1.0.94 help does not expose `--cloud`; documented preview/account-build gate, not rehearsed availability.
- Host installs do not prove full CLI+Squad execution inside a MicroVM. Require actual process/agent/prompt evidence and separate sign-in/storage/egress consent; never copy host authentication.
- October 12 one-laptop read-only preflight 18/18 PASS: Copilot CLI 1.0.94, Squad 1.0.1, ACA CLI 1.0.0-preview.4, enabled plugin 0.0.5-beta. Both-host interactive checks, clean VM/manual sign-in, full rehearsal, invitation and exact NIC listing remain open. [Readiness](run-plan.md#october-12-readiness-evidence).
- Select each native profile explicitly and keep its scope narrow.
- Local `/sandbox` is off by default. On Windows, it needs a supported recent Windows 11 build and [update prerequisites](https://aka.ms/ghcp-sandbox-os-support). Proxy/host rules depend on supported features and apps honoring the proxy, not airtight protection for all processes; in-process file tools are best-effort and remote MCP is not sandboxed. [Details](aca-sandboxes.md#how-this-differs-from-the-other-sandbox-stories).
- Installed `copilot help sandbox` documents one-session `--sandbox`; actual Windows MXC startup failed before command, exit 1, on proxy/masking/auth loopback/private-network needs. Policy blocked, no bypass/global change; needs authorized policy review and backend/session preflight rerun. Build 26300 is OS metadata, not successful backend operation. Explicit cloud help parse exit 0 is not account/billing/runtime proof.

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
- Base flow stays default. Selected-target IaC, effective access/policy read-back, full required coverage and prepared-sandbox rehearsal permit substitution; Online is not qualified and Corp stays untouched.
- Variant clock: 29:30-30:00 guidance/prepared source; 30:00-32:00 one bounded ACA skill prompt; 32:00-32:30 inspect actual exits/HTTP observations; 32:30-33:30 cut and hand back to C5. No create/upload/install/retry on stage. [Procedure](demo-runbook.md#c4-invoke-guidance-and-a-source--2930-3330--4-minutes).
- Evidence is 10 root negative-validation checks, not 52 child-module plus two caller cases or an AKS deployment. A 403 alone proves neither egress nor Azure Policy enforcement.
- If not ready, use base C4 or explicitly labeled Management-side evidence, not Corp validation. Earlier runs took about 2:58 and 1:47; no 90-second guarantee and no use of 55:00-58:00 slack.
- Corp source merged, new qualification blocked on an unexpected change-type check; no apply performed. Last baseline 8 present / 3 absent, connection/two Data Owner grants missing; no new sealed manifest/raw exact deltas. Explicit Corp get Succeeded/no VNet connections, scoped list 403/exit 1. No successful Corp sandbox creation/runtime test or full CLI+Squad execution inside a MicroVM is established. Earlier 34/85/31 source/tooling checks are not runtime acceptance.
- Card B: VM `C:\demo\session-repo` is control console; `aca` targets a proposed separate Online group/RG, not AKS or hosted Jobs/runner. Standard managed network if policy allows, no Corp BYO VNet/UAMI/FIC transplant. Candidate RG absent; not created/deployed/tested/independently plan-approved. Official [quickstart](https://sandboxes.azure.com/docs/sandboxes/quickstart/setup-cli) and full QA are pre-stage, no four-minute promise.
- Token auth exit 0 only. Doctor 9/9 exit 0 resolved to cached Management despite explicit flags: WRONG TARGET. Compare printed subscription/RG/group/region with approved target plus independent exact-ID read-back. No config change, Management runtime fallback or creation permission.
- Exact preflight/login/trigger/proof/owned cleanup are in [Card B](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad); optional in-VM Copilot/Squad has separate consent and actual process/agent/prompt proof.
- Primary native flow is host Copilot CLI/Squad -> ACA skill -> inspected tool calls -> isolated public filesystem/offline Terraform/numeric exits -> validator/reviewer handoff. Standalone hello/lifecycle checks are prerequisites, not integration. No current integration readiness. Inside-MicroVM install/OAuth is advanced optional, not mandatory for basic host orchestration.

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
- October 12 both existing Online and Corp AKS clusters independently read through Azure MCP: Automatic SKU/Standard tier, Succeeded/Running; no redeploy indicated by metadata. Online app GET HTTP 200 with branded NIC/AKS text used explicit known-demo certificate bypass, not TLS certificate validation or a fresh 29-check suite. Nodepool/full-runtime gates stay separate.
- Fresh full Online cluster validation, corrected scoring: app/assets/two replicas PASS with TLS bypass; canonical 26 PASS/2 BLOCKED/1 report-only, not 29/29; supplemental 10 PASS/1 FAIL (TLS)/1 NOT_APPLICABLE (external `/healthz`; source requires direct-pod 200 `ok`). Native Kubernetes/ResourceHealth unavailable, full health unproved. Eleven noncompliant resources in demo RG incl AKS/network/state, not 11 cluster failures/subscription-wide. No renewed 29/29/full TLS.
- 50:00-50:30: consumer-to-module diagram.
- 50:30-51:00: live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; branded page, pipeline flow, serving pod, speakers.
- 51:00-52:10: Whether a change is human-authored or agent-assisted, it goes through the same gates: GitHub identity, OIDC for Azure, scans, required review, branch protection, environment approval, and an Actions audit trail.
- Map: PR -> checks/scans -> review + protected main -> plan -> environment approval -> OIDC apply -> runtime check.
- 52:10-53:00: boundary; documented gaps stay visible: single-maintainer admin override, self-review setting, and environment gate before the apply job's plan; appendix handles Online/security depth.
- Reuse the module without copying the private setup.

### Optional 53:00-54:30, Squad on ACA, use only if ahead
- Original Haflidi hosted implementation completed/previously demonstrated; leave source/deployment alone. New personal queue target registration/access/rehearsal pending is separate, not evidence original broken/missing and not native Sandbox prerequisite. Native integration remains build work.
- Keep it inside content time, compress `s21-limits` to 0:30 if needed, and skip it if it would touch 55:00-58:00.
- Haflidi's `haflidif/squad-on-aca` uses hosted ACA Apps/Jobs, not MicroVMs. Native October 12 inventory verified Corp, Norway East placement; two succeeded historical Oct 9 agent-job executions lasted 56 seconds. Placement only is updated, not a fresh queue-driven run. Corp validation remains a separate gate for MicroVMs.
- Benefit: workload identity, Key Vault and KEDA queue hosting, same PR gates. Historical variable-cost estimate under USD 0.01 per run plus holding costs is not a current measured bill or hard cap.
- Fresh queue-driven readiness is not established: Manual target runner job with 7200-second timeout, no registered target runners today, private target invitation pending. Today's scoped README-only smoke failed: existing Manual runner execution ended terminal Failed; associated issue queue workflow remains queued. No successful fresh issue-to-PR chain or effective-policy/routing proof. Historical Management-side MicroVM evidence stays separate.
- Two historical Oct 9 target-queue successes are shared-demonstration smoke evidence, not current full bot-PR readiness. Fresh issue open/queue queued, no open PR at 10:28 UTC. Actual image pull succeeded, then short-lived runner registration failed.
- The environment is in Norway East because Sweden Central hit ACA capacity errors.
- Card A: Haflidi's implementation is `haflidif/squad-on-aca`, not the private target. VM `C:\demo\hosted-target` is control console only; manually verify GitHub sign-in/accepted target access, then approved issue/label -> queue -> actual hosted Job -> bot PR. Use `<approved-private-target>` and `<approved-bot-app>` bindings from [Card A](demo-runbook.md#card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr), not public clone access as permission.
- Hard cut 54:30, no retry/registration repair on stage; owned issue/PR/execution cleanup is off-stage. Current NO-GO. Haflidi's authored role is documented, but no current Haflidi-authored technical confirmation in supplied evidence. Ask for implementation revision and fresh sanitized chain result.
- Fallback: show the finished proof chain and move on.

### Operator obligations, not new stage beats
- Online is primary placement for eligible demo components, not fallback/policy escape. Corp-required private workloads stay Corp; repo visibility and authenticated network/control-plane exposure are separate.
- Four demo lanes remain independent: existing Online AKS, native MicroVM group/RG, hosted Jobs issue-to-PR, local Copilot sandbox. GitHub-managed cloud remains an optional separate lane.
- USD 20 through Oct 31 is an alert, not a hard cap; retained Corp costs remain.
- C1 Oct 13 fresh OnlineSecurity 29/DemoVM; C2 MCP minreplicas 1/revert Oct 14; teardown Oct 17/credential expiry Oct 31 are scheduled, not complete.

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
