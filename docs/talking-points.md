# Presenter talking points — Martin Opedal, Enterprise Cloud Solution Architect, Microsoft; Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft

Concise cheat-sheet for the Reveal deck. Full script: [talk-track.md](talk-track.md). Recording details: [demo-runbook.md](demo-runbook.md). Product update detail: [whats-new.md](whats-new.md). Deck URL: <https://martinopedal.github.io/squad-terraform-session-2026-10-14/presentation/>.

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
- Set the recording honesty rule before any demo.
- Introduce both speakers with full name, title, and Microsoft employer.
Takeaway: the output must be inspectable by another engineer.
Demo cue: none.
Say: Azure validation happened only through the private IaC consumer, with sanitized read-back facts. Don't expose private IDs or imply public examples are deployable.

### 01:00-04:00, C1, Haflidi lead
- Same brief, same checkpoint, same model.
- Compare one design decision, not verbosity.
- Repository memory and tool access can change results.
Takeaway: two attempts are useful only when the inputs are controlled.
Demo cue: show `/model`, selected agent, and one consequence.
Don't say: two runs establish a model error rate.

### 04:00-05:00, s03-baseline, Martin
- Start from inherited public source.
- Separate inherited issues from AI-caused issues.
- Qualification happened before filming.
Takeaway: disclose preparation before you narrate a clean run.
Demo cue: source pin and mismatch excerpt.
Don't say: this was the first implementation.

### 05:00-06:00, s04-news, Martin
- Copilot CLI GA: 2026-02-25.
- Agent HQ: 2025-10-28. Claude and Codex public preview: 2026-02-04.
- AI Credits effective: 2026-06-01. CLI limits preview: 2026-07-01.
- Computer use preview: 2026-10-01, not used here.
- Squad 1.0 / 1.0.1 (Oct 3-4): release tags exist; the demo uses 1.0.1 from WinGet/Homebrew/GitHub Releases. Pinned docs at `93aec83` may still carry Experimental/alpha wording; npm latest was 0.13.1.
Takeaway: the platform moved from preview pieces to governable engineering controls.
Demo cue: point to dates and status labels; end on the Squad tile.
Don't say: computer use is GA, or part of this Terraform recording; npm latest is 1.0.1.

### 06:00-07:00, s04-layers, Haflidi then Martin
- CLI hosts execution.
- Squad coordinates responsibilities.
- Terraform, Git, Learn, and MCP provide evidence.
- Name the layer before troubleshooting.
Takeaway: a good agent workflow returns files, decisions, and checks.
Demo cue: trace the diagram arrows.
Don't say: Squad replaces Terraform or Copilot CLI.

### 07:00-08:00, s07-agent-setup, Martin
- `AGENTS.md` and Copilot instructions are always-on repo guidance.
- Squad owns routing and decisions through `.squad\`.
- Operator explicitly selects `terraform-coder`, `terraform-validator`, and `terraform-reviewer`.
- MCP is used for read-only docs and Squad memory.
Takeaway: profiles create narrow lanes, not a sandbox.
Demo cue: point left to right through the setup diagram.
Don't say: generic Squad tasks inherit the profile filters.
Handoff: "Haflidi, show them how you get here from nothing."

### 08:00-11:00, C0 From zero to a squad, Haflidi lead
- Clean Windows 11 VM, reached only through Bastion. Martin uses Entra sign-in with MFA; Haflidi uses a local account because B2B guests cannot use Entra VM sign-in, with the credential handed over out of band. No Git, CLI, or Squad installed.
- `winget install` Git, GitHub CLI, PowerShell 7, Copilot CLI, Squad. Show versions.
- `copilot`, `/login`, then `squad init` in the repo terminal (a shell command, not a prompt).
- `copilot --agent squad`: Init Mode proposes a roster, nothing is written until you confirm. `squad doctor`.
Takeaway: install, init, hire, verify. The team is reviewable in Git from minute one.
Demo cue: recorded clip; live fallback is the same VM via `scripts\Connect-DemoVm.ps1`.
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
- Show native Plan mode, not just a Markdown plan.
- Inspect instructions and exact file context.
- Human revision happens before implementation.
Takeaway: approval authorizes a code change, not an Azure apply.
Demo cue: `/plan`, `/session plan`, approved criteria.
Don't say: `--plan --mode autopilot` is safe for this chapter.

### 18:00-20:00, s08-plan-boundary, Haflidi
- Reusable module owns infrastructure contract.
- Consumer root owns providers and backend.
- Existing deployments need migration review.
Takeaway: extract a module, not an environment.
Demo cue: reveal boundary warning.
Don't say: deleting awkward root files is a repair.

### 20:00-24:00, C3, Martin lead
- Show Squad selected in the repository.
- Show only relevant roster and routing.
- Select `/agent terraform-coder` for the writing lane.
- Return with actual files and handoff evidence.
Takeaway: assignment is not completion.
Demo cue: `/agent`, `/tasks`, handoff, changed files.
Don't say: a profile switch proves correctness.

### 24:00-25:00, s10-tool-roles, Haflidi
- Instructions are persistent expectations.
- Skills are repeatable procedures.
- MCP is a source or tool connection.
Takeaway: context types have different jobs.
Demo cue: keep three columns visible.
Don't say: opening `/mcp` is source verification.

### 25:00-29:00, C4, Martin lead
- Invoke a skill because it changes the work.
- Use MCP for a specific source and version.
- Approve only the narrow tool action.
Takeaway: source provenance is part of the engineering artifact.
Demo cue: `/skills`, MCP lookup, `/permissions`.
Don't say: a failed lookup succeeded.

### 29:00-30:00, s12-source-check, Haflidi
- Follow source claim into the resource body.
- A variable name does not prove the generated contract.
- Keep source versions with the assertion.
Takeaway: assert the resource, not the reassurance.
Demo cue: reveal code example.
Don't say: illustrative assertion is passing output.

### 30:00-32:00, s13-test-gap, Haflidi
- Keep negative cases.
- Add positive contract assertions.
- Test the test with a deliberate mutation.
Takeaway: a mock suite is useful only when it can fail for the right reason.
Demo cue: hand playback to Haflidi.
Don't say: plan-mode tests isolate every provider automatically.

### 32:00-37:00, C5, Haflidi lead
- Select `terraform-validator` for offline checks under permission prompts.
- Show command, exit status, and failure reason.
- Label controlled mutation honestly.
- Repair narrowly and rerun the same check.
Takeaway: preserve cause and effect.
Demo cue: command result, `/review`, `/diff`, rerun.
Don't say: the mutation was an AI-discovered defect.

### 37:00-40:00, s15-proof, Haflidi
- Source inspection, local mocks, consumer example, plan, and read-back are separate.
- Current local evidence is 52 module checks and two caller checks.
- Private plan/apply and Azure read-back passed on October 5 for the pinned runtime module revision; recordings and native profile selection remain pending.
Takeaway: a check proves only what it checks.
Demo cue: read status labels exactly.
Don't say: mocks are Azure acceptance.

### 40:00-41:00, s16-continuity, Martin
- Save the reason, not a transcript.
- Repository decision and CLI resume are different artifacts.
- Scribe records, the next task must read.
Takeaway: continuity is something you verify.
Demo cue: trace decision map.
Don't say: resume proves current repository decisions were read.

### 41:00-44:00, C6, Haflidi lead
- Show public-only decision record.
- Resume the relevant session, not unrelated history.
- Inspect context and usage.
Takeaway: long-running work needs recoverable reasons.
Demo cue: decision file, `/resume`, `/context`, `/usage`.
Don't say: personal memory is safe to display.

### 44:00-46:00, s18-memory, Martin
- Conversation context, native memory, and Squad knowledge have different owners.
- Save accepted boundaries before compaction.
- Keep private environment mapping out of public team history.
Takeaway: put requirements where the next owner can review them.
Demo cue: no personal memory screen.
Don't say: CLI compaction maintains Squad decisions.

### 46:00-49:00, C7, Haflidi lead
- Review as a consumer would.
- Use `terraform-validator` for the offline suite.
- Use `terraform-reviewer` for independent read-only acceptance.
- Use only the supplied sanitized deployment/read-back facts; keep private target details off screen.
Takeaway: approve a specific artifact and scope.
Demo cue: `/diff`, offline checks, review handoff.
Don't say: approved code alone equals deployed Azure behavior; cite the separate October 5 IaC validation when needed.

### 49:00-51:00, s20-consumer, Martin
- Public module is reusable; environment inputs stay private.
- Consumer owns providers, backend, auth, and state.
- Application delivery belongs in a separate root.
Takeaway: reuse the code, not the environment.
Demo cue: trace consumer into module.
Don't say: public example includes real values.

### 51:00-53:00, s21-limits, Haflidi then Martin
- Use Plan mode for real decisions.
- Use Squad for ownership and handoffs.
- Use skills and MCP with source provenance.
- Keep evidence gates visible.
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

**Why are mocked tests not enough?** They check the contract you wrote. They do not prove subnet capacity, DNS, policy, identity, or service behavior in Azure.

**How do we share team knowledge safely?** Put public decisions with the module. Keep private scope mapping, state, credentials, and personal memory out of public artifacts.

**Does computer use change this demo?** No. It is public preview, useful for GUI-only tools, but this Terraform demo stays in CLI, files, docs, and offline checks.

## Squad and Copilot CLI: set up, use cases, how they fit

### How they work together (one line first)
- **Copilot CLI runs the work. Squad decides who does it and remembers why.**
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
- CLI runs the work; Squad decides who and remembers why.
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
Takeaway: GHAS covers code, secrets, and advisories; the agent plus an oracle closes the silent gaps.
Don't say: AI made it secure, or there are no gaps (single-maintainer admin merges, IDs in history, Checkov cannot read azapi bodies).

### a-prompts, either speaker
- Guardrails first, then sourced API facts through MCP.
- One lane per step: lead plans, coder edits, validator runs the oracle, reviewer in `/new`.
- Consume like a customer, deploy through the pipeline.
- In the October 8 eval, repeatability was measured as five fresh runs with a pre-registered `>= 4/5` green bar. Results: B1 0/5, B2 5/5, B3 4/5 after a disclosed harness-bug rescore from saved diffs, with no Copilot rerun and the out-of-scope README edit still red. Treat this as a measured checkpoint, not a guarantee.
Takeaway: narrow the choices and make every claim checkable.
Don't say: the prompts make the model deterministic.

## More likely questions (Online variant)

**Why did the first Online applies fail?** Real guardrails and real API rules: the landing zone denied subnets without NSGs; AKS required a user-assigned identity for BYO subnets; `outboundType none` now means network-isolated. Each failure became a design input or a tested module fix.

**What did the real consumer find in the module?** Seven things, all now fixed. Fixed in the module with tests written first: honor `user_assigned_identity_id`, allow `userAssignedNATGateway`, two perpetual drifts, and the SKU itself (it sent `Base`; now `cluster_sku = "Automatic"` is an opt-in). Fixed in the root: a module-level `depends_on` that forced replacement. Fixed in the module (#145): `count` keyed on a subnet ID unknown at plan time, now an explicit `use_external_subnets` flag with a caller-fixture regression test.

**Is the Online cluster really AKS Automatic?** Yes, verified by read-back: SKU Automatic with managed system node pools. It was rebuilt, because Microsoft Learn states Base to Automatic migration is not supported, and an in-place attempt was rejected.

**Why not a GitHub-hosted runner?** Tenant policy keeps Terraform state private, and the API server only accepts the runner's egress IP. An ephemeral, VNet-integrated runner with no managed identity is the smallest compliant option.

**Is a public API server safe?** It is Entra-only with local accounts disabled, limited to authorized IPs, and fronted by a human-gated pipeline. For Corp, use the private cluster path from the main talk.
