# Presenter talking points — Martin Opedal, Enterprise Cloud Solution Architect, Microsoft; Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft

Concise cheat-sheet for the Reveal deck. Full script: [talk-track.md](talk-track.md). Live demo runbook: [demo-runbook.md](demo-runbook.md). Product update detail: [whats-new.md](whats-new.md). Deck URL: <https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/>.

## Opening hooks / big news

- Copilot CLI is GA as of 2026-02-25. This is the reason the talk treats the terminal as a normal engineering surface.
- Agent HQ is GitHub's multi-agent control plane. Claude and Codex are public preview in Agent HQ.
- AI Credits are effective from 2026-06-01. Mention `/limits` and `--max-ai-credits` as session controls, not hard financial guarantees.
- Computer use is public preview as of 2026-10-01. Say clearly that this Terraform demo does not use computer use.
- Squad is 1.0.1 for the demo. GitHub Releases, WinGet, and Homebrew have moved, while npm latest is still 0.13.1 as of 2026-10-05. Pinned docs may still carry Experimental/alpha wording.

## Slide and chapter cues

### 00:00-01:00, s01-outcome, Martin
- Define the useful artifact: reusable Terraform module.
- Name the boundary: private AKS in an existing landing zone.
- Set the live-demo honesty rule before any demo.
- Introduce both speakers with full name, title, and Microsoft employer.
Takeaway: the output must be inspectable by another engineer.
Demo cue: none.
Say: Azure validation happened only through the private IaC consumer, with sanitized read-back facts. Don't expose private IDs or imply public examples are deployable.

### 01:00-04:00, C1, Haflidi lead
- Who drives: Haflidi narrates; Martin types in A and B.
- Cut at 2:15: if C1-B is still generating, use one C1-A consequence and the saved C1-B excerpt.
- Type: `/new`, `/agent` Squad, `/model`, `/plan`, `/rename C1-A`; repeat as `C1-B`.
- Prompt: `Plan only: add alternate_network_payload...` with pod `172.21.0.0/16`, service `10.241.0.0/16`, DNS `10.241.0.10`, preserve private API, no edits or deploy.
- Point at: selected model, same prompt, selected agent, one consequence in the plan.
- Handoff: "Martin, take the controlled brief into Plan mode."
- Offline fallback: `c1-a.txt`, `c1-b.txt`, eval results B1 0/5, B2 5/5, B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun), B1v2 5/5.
Takeaway: two attempts are useful only when the inputs are controlled.
Don't say: two runs establish a model error rate.

### 04:00-04:30, s03-baseline, Martin
- Source pin, inherited issues, and live checkpoint are separate.
- Qualification happened before the live run.
- Bank 04:30-05:00 as slack.
Takeaway: disclose preparation before you run the clean demo.
Demo cue: source pin and mismatch excerpt.
Don't say: this was the first implementation.

### 05:00-05:30, s04-news, Martin
- Copilot CLI is GA; the terminal is a normal engineering surface.
- Squad 1.0.1 is the demo version; docs and npm may lag release tags.
- Computer use is not part of this Terraform demo.
- Bank 05:30-06:00 as slack.
Takeaway: use the current controls, but keep status labels honest.
Demo cue: one headline plus the Squad tile.
Don't say: computer use is GA, or part of this Terraform live demo; npm latest is 1.0.1.

### 06:00-07:00, s04-layers, Haflidi then Martin
- CLI hosts execution.
- Squad coordinates responsibilities.
- Terraform, Git, Learn, and MCP (Model Context Protocol) provide evidence.
- Name the layer before troubleshooting.
Takeaway: a good agent workflow returns files, decisions, and checks.
Demo cue: trace the diagram arrows.
Don't say: Squad replaces Terraform or Copilot CLI.

### 07:00-08:00, s07-agent-setup, Martin
- `AGENTS.md` and Copilot instructions are always-on repo guidance.
- Squad owns routing and decisions through `.squad\`.
- Operator explicitly selects `terraform-coder`, `terraform-validator`, and `terraform-reviewer`.
- MCP (Model Context Protocol) is used for read-only docs and Squad memory.
Takeaway: profiles create narrow lanes, not a sandbox.
Demo cue: point left to right through the setup diagram.
Don't say: generic Squad tasks inherit the profile filters.
Handoff: "Haflidi, show them how you get here from nothing."

### 08:00-11:00, C0 From zero to a squad, Haflidi lead
- Who drives: Haflidi on the clean Windows 11 VM; Martin keeps credentials off-screen.
- Cut at 2:15: if installs or login are not complete, state the stall, show fallback evidence, and move on.
- Type: show Git/Copilot/Squad are absent; run `$wg = ...`; install `Git.Git`, `GitHub.Copilot`, and `bradygaster.Squad` with `@wg`; refresh `PATH`; show versions; `copilot`; `/login`; `/exit`; clone the public module; `squad init`; `git status --short`; `copilot --agent squad`; confirm roster; `/exit`; `squad doctor`.
- Prompt: `We maintain a reusable Terraform module for AKS Automatic on AzAPI (Terraform provider for Azure ARM/preview resources)... Propose a small team.`
- Point at: no tools installed, versions, `squad init` output, `git status --short`, proposed roster, confirmation, `squad doctor` pass.
- Handoff: "Martin, we have a reviewable team in Git; now show bounded work."
- Offline fallback: same VM via `scripts\Connect-DemoVm.ps1`; if unavailable, use `Test-DemoVm.ps1` 14/14 and setup screenshots.
Takeaway: install, init, hire, verify. The team is reviewable in Git from minute one.
Don't say: `squad init` is an agent request; npm gives you 1.0; the VM is a presenter laptop.

### 11:00-12:00, s05-parallel, Martin
- Parallel work needs independent artifacts.
- One writer owns a shared Terraform surface.
- Handoffs name file, check, and next owner.
Takeaway: ownership beats more agents.
Demo cue: read the lane table.
Don't say: four agents are automatically better than one.

### 12:00-14:00, s06-contract, Haflidi
- The module consumes approved existing network inputs.
- The consumer owns provider, backend, auth, and state.
- Private Automatic has specific subnet and API requirements.
Takeaway: build a module for the platform you already have.
Demo cue: point from platform-owned network into module.
Don't say: the demo creates a landing zone.

### 14:00-18:00, C2, Martin lead
- Who drives: Martin types; Haflidi challenges scope.
- Cut at 3:00: if the plan is not ready, use the saved approved plan and name the repository-change boundary.
- Type: `/new`, `/rename guided-clean-run`, `/agent` Squad, `/instructions`, `/plan`.
- Prompt: reference `main.tf`, `variables.tf`, and `tests\contract.tftest.hcl`; plan the C1 regression and README explanation; keep eight inputs, six outputs, and AzAPI intact; plan labeled mutation and repair; no implementation, Azure lookup, apply, dependency upgrade, or state operation.
- Revise: `Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign.` Then inspect `/session plan`.
- Point at: Plan indicator, effective instructions, file references, accepted criteria, visible exit from Plan mode.
- Handoff: "Haflidi, the scope is approved; next we assign one writer."
- Offline fallback: `c2-approved-plan.md` and screenshots of Plan mode, `/instructions`, and `/session plan`.
Takeaway: approval authorizes a code change, not an Azure apply.
Don't say: `--plan --mode autopilot` is safe for this chapter.

### 18:00-20:00, s08-plan-boundary, Haflidi
- Reusable module owns infrastructure contract.
- Consumer root owns providers and backend.
- Existing deployments need migration review.
Takeaway: extract a module, not an environment.
Demo cue: reveal boundary warning.
Don't say: deleting awkward root files is a repair.

### 20:00-24:00, C3, Martin lead
- Who drives: Martin operates Squad and `terraform-coder`; Haflidi checks handoff evidence.
- Cut at 3:00: if the coder is still generating, stop live work and use the saved B1v2 excerpt.
- Type: `/agent` Squad, `/tasks`, `/agent list`, `/mcp`, `/agent terraform-coder`.
- Prompt: B1v2 brief exactly: work only in `terraform\modules\aks-automatic-corp`; add `alternate_network_payload` in `tests\contract.tftest.hcl`; reuse AzAPI mock and `command = plan`; pod `172.21.0.0/16`, service `10.241.0.0/16`, DNS `10.241.0.10`; four separate asserts; each has `error_message`; change only the test; no deploy, provider, or lock-file change.
- Point at: selected Squad agent, relevant roster/routing, coder profile, changed test file, handoff.
- Handoff: "Haflidi, the writer returned a file change; now ground the requirement."
- Offline fallback: `c3-handoffs.md`, saved diff, B1 0/5 -> B1v2 5/5. The live run still has to pass.
Takeaway: assignment is not completion.
Don't say: a profile switch establishes correctness.

### 24:00-24:30, s10-tool-roles, Haflidi
- Instructions are persistent expectations.
- Skills are repeatable procedures.
- MCP is a source or tool connection.
- Bank 24:30-25:00 as slack.
Takeaway: context types have different jobs.
Demo cue: keep three columns visible.
Don't say: opening `/mcp` is source verification.

### 25:00-29:00, C4, Martin lead
- Who drives: Martin types; Haflidi checks source fit.
- Cut at 3:00: if MCP or Docker is not healthy, show the fallback excerpt and say the lookup failed live.
- Type: `/skills info test-discipline`, `/mcp`, then `/permissions`.
- Prompt: invoke test-discipline; identify unchanged contract assertions; use Microsoft Learn MCP only for read-only AKS Automatic private/custom-network source; cite source/version; no Azure account, provider change, or write.
- Point at: skill invocation, MCP result, source URL/version, one narrow permission approval.
- Handoff: "Haflidi, we have the source and invariant; take the fail-repair loop."
- Offline fallback: `c4-source.md` with retrieval time, tool, server/version, and limitation. If lookup fails live, say it failed.
Takeaway: source provenance is part of the engineering artifact.
Don't say: a failed lookup succeeded.

### 29:00-30:00, s12-source-check, Haflidi
- Follow source claim into the resource body.
- A variable name does not establish the generated contract.
- Keep source versions with the assertion.
Takeaway: assert the resource, not the reassurance.
Demo cue: reveal code example.
Don't say: illustrative assertion is passing output.

### 30:00-31:00, s13-test-gap, Haflidi
- Keep negative cases.
- Add positive contract assertions.
- Test the test with a deliberate mutation.
- Bank 31:00-32:00 as slack.
Takeaway: a mock suite is useful only when it can fail for the right reason.
Demo cue: hand control to Haflidi.
Don't say: plan-mode tests isolate every provider automatically.

### 32:00-37:00, C5, Haflidi lead
- Who drives: Haflidi runs `terraform-validator`; Martin explains the repair.
- Cut at 3:45: if repair is not ready, show saved seeded-failure and repaired logs; Haflidi runs the validator.
- Type: `/agent terraform-validator`; run the C5 PowerShell block with `$phase = 'before'`; `/agent terraform-coder`; seed `enablePrivateCluster` from `true` to `false`; rerun with `$phase = 'seeded-failure'`; `/review`; restore only that field; `/diff`; rerun with `$phase = 'repaired'`.
- Point at: command, exit status, failure assertion, labeled mutation, review, repair diff, identical rerun.
- Handoff: "Martin, the local check caught and repaired this mutation; separate that from Azure evidence."
- Offline fallback: preserved C5 logs, file hashes, B2 5/5 seeded-repair eval, B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun).
Takeaway: preserve cause and effect. A runtime check is not Azure acceptance evidence.
Don't say: the mutation was an AI-discovered defect.

### 37:00-39:00, s15-proof, Haflidi
- Source inspection, local mocks, consumer checks, plan/apply, and read-back are separate gates.
- A runtime check is evidence only for what it checks.
- Private consumer read-back applies only to the pinned runtime module revision.
- Bank 39:00-40:00 as slack.
Takeaway: use runtime check/evidence language and keep limits visible.
Demo cue: read status labels exactly.
Don't say: mocks are Azure acceptance.

### 40:00-41:00, s16-continuity, Martin
- Save the reason, not a transcript.
- Repository decision and CLI resume are different artifacts.
- Scribe records, the next task must read.
Takeaway: continuity is something you verify.
Demo cue: trace decision map.
Don't say: resume shows current repository decisions were read.

### 41:00-44:00, C6, Haflidi lead
- Who drives: Haflidi leads continuity; Martin types.
- Cut at 2:15: if resume or search is slow, show the decision file and state the constraints.
- Type: Scribe prompt to record public-only decision: private API invariant, caller-owned provider/backend, added network-payload regression, labeled mutation/restoration, exact checks, sanitized Azure-validation boundary, no private details.
- Then type: `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`, and `Read the saved decision; cite its file and the constraints for the next change.`
- Point at: decision file, resumed session, cited constraint, `/context`, `/usage`.
- Handoff: "Martin, the reason is recoverable; now review the consumer-facing artifact."
- Offline fallback: `c6-decision.md` and screenshots of citation, `/context`, and `/usage`.
Takeaway: long-running work needs recoverable reasons.
Don't say: personal memory is safe to display.

### 44:00-45:00, s18-memory, Martin
- Conversation context, native memory, and Squad knowledge have different owners.
- Save accepted boundaries where the next owner can review them.
- Keep private environment mapping out of public team history.
- Bank 45:00-46:00 as slack.
Takeaway: put requirements where the next owner can review them.
Demo cue: no personal memory screen.
Don't say: CLI compaction maintains Squad decisions.

### 46:00-49:00, C7, Haflidi lead
- Who drives: Haflidi leads validation and review; Martin names the acceptance boundary.
- Cut at 2:15: if the full suite is not done, show saved green exits and diff; do not rerun.
- Type: `/agent terraform-validator`; run the C7 PowerShell block from `demo-runbook.md`; `/diff`; `/new`; `/agent terraform-reviewer`; provide exact diff, files, revision, MCP citations, and sanitized validator results.
- Point at: offline checks, diff, reviewer findings, and human code-only acceptance.
- Handoff: "Martin, we can approve this artifact and name the remaining gates; we are not claiming a stage apply."
- Offline fallback: `c7-final.diff`, validator logs, Online apply runs 37771532872/37772290635, `Test-OnlineSecurity.ps1` 29/29, `Test-DemoVm.ps1` 14/14, and eval results.
Takeaway: approve a specific artifact and scope.
Don't say: approved code alone equals deployed Azure behavior; cite the separate runtime evidence when needed.

### 49:00-51:00, s20-consumer, Martin
- 0:00-0:30: point at the consumer-to-module diagram.
- 0:30-1:00: open `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; certificate warning is expected; point at pipeline flow, serving pod name, and speakers.
- 1:00-1:35: say "gated pipeline PR → plan → human approval → apply".
- 1:35-2:00: outside-in runtime checks are 29/29; fallback is the offline screenshot plus runs 37771532872/37772290635.
Takeaway: reuse the code, not the environment.
Demo cue: live reveal, then boundary.
Don't say: public example includes real values.

### 51:00-52:30, s21-limits, Haflidi then Martin
- Use Plan mode for real decisions.
- Use Squad for ownership and handoffs.
- Use skills and MCP with source provenance.
- Bank 52:30-53:00 as slack; Martin opens Q&A at 53:00.
Takeaway: artifact, reason, and check belong together.
Demo cue: hold the three closing rules.
Don't say: more agents can vote correctness into existence.

### 53:00-60:00, s22-questions, Martin host
- Invite questions about planning, ownership, boundary, and checks.
- Use prepared fallback only if the room is quiet.
- Open appendix references only when relevant.
Takeaway: the public handoff is useful because its limits are visible.
Demo cue: return to Q&A after appendix.
Don't say: prepared fallback questions came from the audience.

## Top 5 takeaways

1. Copilot CLI is the execution surface. Squad is the team coordination layer.
2. Use native profiles for narrow lanes, but remember filters are not a sandbox.
3. Keep Terraform provider, backend, authentication, and state ownership outside the reusable module.
4. Separate local mocks, consumer checks, real plans, and Azure read-back.
5. Record decisions and evidence so the next engineer can resume without trusting a transcript.

## Likely questions with short answers

**When would you skip Squad?** Use one Copilot CLI session for a small, well-understood edit where context, diff, and review fit in one lane.

**Is rewind a rollback?** No. Rewind is CLI session or edit recovery. It is not Azure rollback and does not reverse external operations.

**Why not autopilot the whole task?** Autopilot can help with a finite task and clear permissions. It does not settle environment authority or deployment consent.

**Why are mocked tests not enough?** They check the contract you wrote. They do not establish subnet capacity, DNS, policy, identity, or service behavior in Azure.

**How do we share team knowledge safely?** Put public decisions with the module. Keep private scope mapping, state, credentials, and personal memory out of public artifacts.

**Does computer use change this demo?** No. It is public preview, useful for GUI-only tools, but this Terraform demo stays in CLI, files, docs, and offline checks.

## Squad and Copilot CLI: set up, use cases, how they fit

### How they work together (one line first)
- **Copilot CLI runs the work. Squad routing assigns an accountable owner and records why.**
- CLI = execution surface: model, tools, permissions, Plan mode, MCP, `/diff`, `/review`, `/resume`.
- Squad = a custom agent inside the CLI (`copilot --agent squad`) plus repo state in `.squad\`: team, routing, decisions, histories.
- Squad spawns members as real CLI tasks; native profiles (`/agent terraform-coder` etc.) narrow a lane; MCP grounds facts; humans approve.
- Neither replaces Terraform checks, the CLI's permission prompts, or human acceptance.

### Bootstrap, simplest path (5 steps)
1. **Prereqs:** Copilot CLI, a Git repo. GitHub CLI only for issue routing.
2. **Install:** `winget install --id bradygaster.Squad --exact` (or Homebrew, GitHub Releases). npm `latest` was still 0.13.1 on Oct 5.
3. **Scaffold:** `squad init` in the repo terminal. Shell command, not an agent request.
4. **Hire:** `copilot --agent squad`, describe the project. Init Mode proposes the roster; **nothing is written until you confirm**. Commit `.squad\`.
5. **Verify:** `squad doctor`. Before `squad upgrade`, back up: team, routing, decisions, histories, config are kept; coordinator and templates are replaced.

Best simple start: one repo, three to five specialists, built-ins (Scribe, Ralph, Rai, Fact Checker) come with it. Add narrow native profiles only where a lane needs limits.

Step-by-step: [playbook](playbook.md).

### Usual use cases
- **Cross-owner work:** module + tests + docs in parallel, one writer per file, named handoffs.
- **Work that outlives a session:** decisions and histories let you resume or hand over.
- **Backlog flow:** issues with `squad:{member}` labels; Ralph keeps the queue moving.
- **Review discipline:** a rejected change is revised by a different author.
- **Spec intake:** paste a PRD; the lead decomposes it into owned work items.
- **Skip it:** a small, well-understood edit that fits one CLI session.

## Appendix cues (question-driven, no scheduled time)

### a-bootstrap, either speaker
- Install, init, hire, verify, upgrade safely.
- Init Mode asks first; confirm before files exist.
- Commit `.squad\`; back up before upgrade.
Takeaway: five steps, and the team is reviewable in Git from minute one.
Don't say: `squad init` is a prompt, or npm gives you 1.0.

### a-use-cases, either speaker
- CLI runs the work; Squad routing assigns owner and records why.
- Cross-owner work, long-running work, backlog and review.
- Skip it for small single-lane edits.
Takeaway: use Squad where ownership and memory matter.
Don't say: more agents means better results.

### a-online, either speaker
- Same module, consumed by tag from a separate repo.
- Guardrails decide the design: private state, NSG on every subnet, RBAC Writer cannot create namespaces.
- Secure chain: PR, protected branch, human gate, OIDC, one job, no plan artifact.
- Locked API server: only the runner's static egress IP.
- Runtime evidence, not hope: `https://aks-online-demo.swedencentral.cloudapp.azure.com/` returns HTTPS 200 by hostname with title "AKS Automatic | NIC 2026 demo"; HTTP redirects; DNS matches the ingress IP.
- Page is the branded NIC 2026 demo with pod, render time, flow, and speakers, served by pinned `nginx-unprivileged`.
- AKS Automatic SKU: managed system node pools, rebuilt because Base cannot convert.
Takeaway: a simpler topology still meets the same guardrails.
Don't say: we exempted a policy, or the demo runs from a laptop.

### a-security, either speaker
- GHAS baseline: CodeQL, secret scanning with push protection, Dependabot; zero open alerts. Module has six required checks; demo-env has four IaC checks.
- The agent found what raises no alert: Checkov skipped `main.tf` since August; Security Scan disabled for inactivity; a falsely green monitor; an approval race; a VM check blind to per-user installs.
- MCP (Microsoft Learn) supplied product rules; skills enforce secret handling and reviewer lockout.
- Every claim re-checked: 52 module contract cases plus 2 caller/example Terraform test cases; 29/29 Online read-back checks including negative tests from the internet; 14 VM checks. A human approved every merge and Azure write.
Takeaway: GHAS covers code, secrets, and advisories; the agent plus a scripted pass/fail oracle closes the silent gaps.
Don't say: AI made it secure, or there are no gaps (single-maintainer admin merges, IDs in history, Checkov cannot read azapi bodies).

### a-prompts, either speaker
- Guardrails first, then sourced API facts through MCP.
- One lane per step: lead plans, coder edits, validator runs the scripted pass/fail oracle, reviewer in `/new`.
- Consume like a customer, deploy through the pipeline.
- Step-by-step: [playbook](playbook.md).
- In the October 8 eval, repeatability was measured as five fresh runs with a pre-registered `>= 4/5` green bar. Results: B1 0/5 because all five ambiguous-brief runs used two assert blocks, B2 5/5, and B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun), with the out-of-scope README edit still red. B1v2 was a separate clarified follow-up after seeing B1; the B1v2 brief stated the four-assert shape and was 5/5 green under the same pinned conditions, with 61-114 s runs and no failure modes observed in those five runs. C3-C5 use that B1v2 loop because it met the October 5 `>= 4/5` bar, but the live run still has to pass. Lesson: state the oracle's rules in the brief. Treat this as a measured checkpoint, not a guarantee.
Takeaway: narrow the choices and make every claim checkable.
Don't say: the prompts guarantee future outcomes.

## More likely questions (Online variant)

**Why did the first Online applies fail?** Real guardrails and real API rules: the landing zone denied subnets without NSGs; AKS required a user-assigned identity for BYO subnets; `outboundType none` now means network-isolated. Each failure became a design input or a tested module fix.

**What did the real consumer find in the module?** Seven things, all now fixed. Fixed in the module with tests written first: honor `user_assigned_identity_id`, allow `userAssignedNATGateway`, two perpetual drifts, and the SKU itself (it sent `Base`; now `cluster_sku = "Automatic"` is an opt-in). Fixed in the root: a module-level `depends_on` that forced replacement. Fixed in the module (#145): `count` keyed on a subnet ID unknown at plan time, now an explicit `use_external_subnets` flag with a caller-fixture regression test.

**Is the Online cluster really AKS Automatic?** Yes, verified by read-back: SKU Automatic with managed system node pools. It was rebuilt, because Microsoft Learn states Base to Automatic migration is not supported, and an in-place attempt was rejected.

**Why not a GitHub-hosted runner?** Tenant policy keeps Terraform state private, and the API server only accepts the runner's egress IP. An ephemeral, VNet-integrated runner with no managed identity is the smallest compliant option.

**Is a public API server safe?** It is Entra-only with local accounts disabled, limited to authorized IPs, and fronted by a human-gated pipeline. For Corp, use the private cluster path from the main talk.
