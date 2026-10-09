# Martin Opedal, Enterprise Cloud Solution Architect, Microsoft and Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft: complete delivery script

This script mirrors `docs\run-plan.md`: 00:00-03:00 intro, 03:00-55:00 planned content and live chapters, 55:00-58:00 protected slack, and 58:00-60:00 close plus "questions if time allows". There is no planned question block.

## Delivery contract

This is a rehearsed 60-minute show, not exploratory pair programming. Before the timed show starts, show the untimed legal/futures notice: preview features may change; status is as of 14 Oct 2026; no warranties; dates are subject to change. C0-C7 remain 29 minutes total. Planned content ends at 55:00, then the protected slack holds 55:00-58:00 before the close.

Cut at the chapter cut line. Do not start a second live attempt. Use reviewed fallback evidence, name what failed live, and move on. Checkpoints: after C0 at 08:30, after C2 at 21:30, after C5 at 38:30, start `s20-consumer` at 50:00, finish planned content at 55:00, and start close at 58:00.

Drop order if behind: compress `s21-limits`; trim `s18-memory`; trim `s15-proof`; trim `s13-test-gap`; trim `s05-parallel`; shorten `s20-consumer` but keep the 50:30-51:00 reveal; then use the live chapter fallback.

Use runtime check and runtime evidence language. Local mocks are not Azure acceptance evidence. Public repo rules apply: no subscription IDs, tenant IDs, private IPs, raw state, secrets, private run URLs, or personal memory on screen.

## s01-outcome | 00:00-03:00 | A module worth reusing

> DRIVER Martin. Reuse the outcome/title slide as the intro. Haflidi adds the honesty rule. Handoff at 03:00.

**Martin:** Good morning. I'm Martin Opedal, Enterprise Cloud Solution Architect, Microsoft. You can find my public material at `opedal.tech`. Today we want to leave behind something another engineer can inspect: a reusable Terraform module for private AKS in an existing Azure landing zone.

**Martin:** With me is Haflidi Fridthjofsson, Sr Cloud Solution Architect, Microsoft. The public handoff should contain useful engineering material, not private environment details.

**Haflidi:** You will see Copilot CLI as the execution surface, Squad as the coordination layer, and Terraform checks as evidence. We bootstrap a Squad, route work through three lanes, add a contract regression, seed a controlled failure, repair it, and show a consumer page that reuses the module.

**Martin:** Honesty rule: terminal and browser work is live. Starting code, clean checkpoints, prompts, and fallback evidence are prepared and disclosed. If a live lookup, install, or check fails, we say it failed and use fallback evidence. Runtime evidence belongs to the exact thing it checks.

**Haflidi:** Takeaways: define the artifact, assign one owner per shared surface, keep provider and state ownership with the caller, record decisions where the next owner can review them, and keep checks tied to their claim.

## s03-baseline | 03:00-03:30 | Start with the code you have

**Martin:** The starting point is a public AKS module revision, qualified before this live run. It had useful inputs, outputs, and tests, plus inherited issues we disclose instead of rewriting history.

**Haflidi:** Keep upstream source, qualified module revision, and clean live checkpoint separate. The live run demonstrates one bounded change. It is not an Azure apply.

## s04-news | 03:30-04:00 | Big news this year

**Martin:** Copilot CLI is GA, so the terminal is a normal engineering surface for Plan mode, file context, agents, skills, MCP, diff, review, permissions, and session controls. Terraform MCP now has a stable public server release, and Azure MCP now has first-party Learn documentation.

**Haflidi:** Squad 1.0.1 is the demo version. Agent HQ is the GitHub agent headline, and the one Azure platform note is that new AKS 1.36 Automatic clusters default ingress toward Gateway API. This demo stays on the managed NGINX path. If someone asks for one more CLI item later, cite `/fleet` on April 1 and AI-credit session limits on July 1.

## s04-layers | 04:00-05:00 | One workflow, three distinct layers

**Haflidi:** Copilot CLI runs the work. Squad coordinates responsibilities through a repository-backed roster, routing, handoffs, and decisions. Terraform, Git, Microsoft Learn, and MCP servers return evidence.

**Martin:** MCP means Model Context Protocol: a way to connect the CLI to an external source or tool. A useful agent workflow returns files, decisions, and check output that a human can inspect.

**Haflidi:** The control spectrum is not a maturity ladder: Ask → edit → plan → agent → programmatic `-p` → Squad multi-agent with gates. Our chapters use different points on it: C0 setup/runway, C1 ask/compare, C2 plan, C3 route to agent, C4 tools + permissions, C5 edit/repair loop, C6 resume, C7 gated review. More automation is not better by default; human approvals remain at the gates. `-p` is appendix automation, not a live chapter.

## s07-agent-setup | 05:00-05:30 | Meet the agent setup

**Martin:** `AGENTS.md` and `.github\copilot-instructions.md` are always-on repository guidance. The HCL instruction file applies when Terraform files change.

**Haflidi:** Squad owns `.squad\`: team roster, routing, decisions, charters, and handoffs. Built-ins matter too: Scribe records accepted decisions, Ralph helps backlog flow, Rai supports reliability, and Fact Checker challenges claims.

**Martin:** The three native lanes are explicit selections: `terraform-coder` writes agreed changes; `terraform-validator` runs fixed offline checks; `terraform-reviewer` reviews a supplied diff in a fresh context. Tool filters reduce available tools. They are not a sandbox.

## demo-c0 | 05:30-08:30 | C0: From zero to a squad

> DRIVER Haflidi. Cut at 07:45. Handoff at 08:30.

**Cut at 07:45:** If installs or login are not complete, state the live stall, show fallback evidence, and move to `s05-parallel`.

Use the C0 block from [demo-runbook.md](demo-runbook.md): show Git/Copilot/Squad absent, install Git, Copilot CLI, and Squad with WinGet, refresh `PATH`, show versions, run `copilot`, `/login`, `/exit`, clone the public module, run `squad init`, show `git status --short`, start `copilot --agent squad`, request a small team, confirm the roster, `/exit`, and run `squad doctor`.

**Haflidi:** The playbook path is install, init, hire, verify. `squad init` is a shell command. `copilot --agent squad` starts the coordinator. Init Mode proposes the roster and writes the team only after confirmation.

**Martin:** The team is reviewable in Git from minute one. Setup is useful, but it is not Terraform correctness.

## s05-parallel | 08:30-10:30 | Give parallel work separate owners

**Martin:** The lanes are deliberately narrow. The coder owns the changed Terraform test file. The validator owns fixed offline commands and exact exit codes. The reviewer owns an independent read-only review of the final diff.

**Haflidi:** Handoffs name file, check, and next owner. One writer owns a shared Terraform surface. Separate conversations are not filesystem isolation, and worktrees do not isolate credentials.

## s06-contract | 10:30-12:30 | Fit the platform you already have

**Haflidi:** The module owns resources, typed inputs, outputs, and provider requirements. The consumer root owns providers, backend, authentication, state, and environment values.

**Martin:** The private Corp path consumes approved existing networking. We are not creating a landing zone or moving application resources into the module.

**Haflidi:** AKS Automatic private and custom-network requirements include API-server, user-node, and managed-system-pool network contract. A variable name does not establish that contract.

## demo-c1 | 12:30-15:30 | C1: Same task, fixed inputs

> DRIVER Martin operates; Haflidi compares. Cut at 14:45.

Use `/new`, `/agent` Squad, `/model`, `/plan`, `/rename C1-A`; repeat as `C1-B`. Prompt: plan only, add `alternate_network_payload`, pod `172.21.0.0/16`, service `10.241.0.0/16`, DNS `10.241.0.10`, preserve private API, no edits or deploy.

**Haflidi:** Compare one consequence, not verbosity. B1 failed because every run wrote two asserts against a pre-registered minimum of three. B1v2 was a separate, clarified brief that asks for four separate asserts. It was 5/5 in re-measurement. That is a measured checkpoint, not a causal claim about every future run. The live run still has to pass.

## s08-plan-boundary | 15:30-17:30 | Extract a module, not an environment

**Haflidi:** The approved change should produce a generic module plus a small consumer example. The consumer configures providers and backend, passes approved existing-network inputs, and calls the module.

**Martin:** Existing deployments need migration review. This session does not authorize state moves, imports, or environment redesign. The public module must explain its interface without private values.

## demo-c2 | 17:30-21:30 | C2: Pin the brief and approve a plan

> DRIVER Martin. Cut at 20:30. Must be out by 21:30.

Use `/new`, `/rename guided-clean-run`, `/agent` Squad, `/instructions`, `/plan`. Reference `main.tf`, `variables.tf`, and `tests\contract.tftest.hcl`; plan the regression and README explanation; keep eight inputs, six outputs, and AzAPI intact; plan a labeled mutation and repair; no implementation, Azure lookup, apply, dependency upgrade, or state operation. Revise: `Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign.` Inspect `/session plan`.

**Martin:** Native Plan mode is the control. Approval authorizes this code change only, not an Azure apply.

## s10-tool-roles | 21:30-22:00 | Give context the right job

**Haflidi:** Instructions are persistent expectations. Skills turn a repeated procedure into reusable, versioned guidance. MCP is a source or tool connection.

**Martin:** Second opinion from a different model (Rubber Duck, GA 2026-06-02, `/rubber-duck` in Copilot CLI) is review input, not approval; our reviewer lane stays the gate.

**Haflidi:** A recipe changes how we work; a source tells us what a service supports; a human still approves the code change.

## demo-c3 | 22:00-26:00 | C3: Assign one writer

> DRIVER Martin. Cut at 25:00.

Use `/agent` Squad, `/tasks`, `/agent list`, `/mcp`, `/agent terraform-coder`. Paste the B1v2 brief exactly: work only in `terraform\modules\aks-automatic-corp`; add `alternate_network_payload` in `tests\contract.tftest.hcl`; reuse AzAPI mock and `command = plan`; pod `172.21.0.0/16`, service `10.241.0.0/16`, DNS `10.241.0.10`; four separate asserts; each has `error_message`; change only the test; no deploy, provider, or lock-file change.

**Martin:** The clarified brief states the oracle's rule. Assignment is not completion. The live change still needs checks.

## s12-source-check | 26:00-26:30 | Turn the source into an assertion

**Haflidi:** Follow the claim into the resource body. A reassuring variable name does not establish the generated contract. A source citation plus an assertion gives the reviewer a condition to inspect.

## s13-test-gap | 26:30-29:30 | State the oracle before the run

**Haflidi:** B1 failed because every run wrote two asserts against a pre-registered minimum of three.

**Martin:** B1v2 was a separate, clarified brief that asks for four separate asserts. It was 5/5 under the same pinned conditions, with 61-114 second runs. That is a measured checkpoint. It does not guarantee future runs.

**Haflidi:** The practical lesson is to state the checker rule before the agent writes code. Then test the test with a deliberate mutation, restore, and rerun.

## demo-c4 | 29:30-33:30 | C4: Ground the work with guidance and source

> DRIVER Martin. Cut at 32:30.

Use `/skills info test-discipline`, `/mcp`, then ask for test-discipline, unchanged assertions, and a read-only Microsoft Learn source for AKS Automatic private/custom network. Cite source/version. Avoid Azure account, provider, or write access. Inspect `/permissions`.

**Martin:** The skill changes the procedure. The MCP lookup supplies a source. The human decides how it applies.

## demo-c5 | 33:30-38:30 | C5: Catch a mistake and repair it

> DRIVER Haflidi. Cut at 37:15. Must be out by 38:30.

Select `/agent terraform-validator`; run the C5 PowerShell block with `$phase = 'before'`. Select `/agent terraform-coder`; seed `enablePrivateCluster` from `true` to `false` in the disposable worktree only. Rerun with `$phase = 'seeded-failure'`. Use `/review`; restore only that field; inspect `/diff`; rerun with `$phase = 'repaired'`.

**Haflidi:** Preserve cause and effect. Say: deliberate lab mutation, not an AI-discovered defect. A runtime check is evidence for the assertion it runs. It is not Azure acceptance evidence.

## s15-proof | 38:30-41:30 | Evidence has levels

**Haflidi:** Keep gates separate: source inspection, local contract tests, consumer checks, real plan/apply, and Azure read-back. A runtime check is evidence only for what it checks.

**Martin:** Evidence feeds the gate; the gate doesn't care who typed the diff. The private consumer supplied separate sanitized runtime evidence for one pinned module revision. We do not show private IDs, state, run URLs, or FQDNs.

## s16-continuity | 41:30-42:00 | Save the reason, not the whole chat

**Martin:** A later task needs the reason, not a transcript. Private API, caller-owned provider/backend, and the new network-payload regression should survive the session.

**Haflidi:** Native resume returns to a conversation. Repository decisions are different artifacts. The next task must read and cite the decision file.

## demo-c6 | 42:00-45:00 | C6: Resume with decisions intact

> DRIVER Haflidi. Cut at 44:15.

Ask Scribe to record a public-only decision in `.squad\decisions\inbox\`: private API invariant, caller-owned provider/backend, added network-payload regression, labeled mutation/restoration, exact checks, and sanitized Azure-validation boundary. Then use `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`, and ask the session to read the saved decision and cite its file and constraints.

**Haflidi:** The record starts in `.squad\decisions\inbox\`. Scribe merges accepted entries into the shared decision ledger. That is reviewable repository knowledge, not personal memory.

## s18-memory | 45:00-47:00 | Three places to keep context

**Martin:** Conversation context, native memory, and Squad repository knowledge have different owners. We do not display personal memory contents.

**Haflidi:** Save accepted boundaries where the next owner can review them. Keep private environment mapping, state, credentials, and personal memory out of public team history.

## demo-c7 | 47:00-50:00 | C7: Reviewed diff to approved Terraform change

> DRIVER Haflidi leads validation and review; Martin names the boundary. Cut at 49:15.

Select `/agent terraform-validator`; run the C7 PowerShell block from [demo-runbook.md](demo-runbook.md); inspect `/diff`; start `/new`; select `/agent terraform-reviewer`; supply exact diff, files, revision, MCP citations, and sanitized validator results.

**Haflidi:** Show offline checks, diff, reviewer findings, and human code-only acceptance. Remaining gates belong to the environment owner.

## s20-consumer | 50:00-53:00 | Reuse the code, not the environment

> DRIVER Martin. Must start by 50:00. Live reveal is 50:30-51:00.

**Martin:** 50:00-50:30: show the consumer-to-module diagram. Consumers pin the module code. They do not copy private inputs, backend, state, identities, or secrets.

**Martin:** 50:30-51:00: open `https://aks-online-demo.swedencentral.cloudapp.azure.com/`. Show the branded page, pipeline flow, serving pod name, and speakers section.

**Haflidi:** 51:00-52:10: Whether a change is human-authored or agent-assisted, it goes through the same gates: GitHub identity, OIDC for Azure, scans, required review, branch protection, environment approval, and an Actions audit trail. The map is PR → checks/scans → review + protected main → plan → environment approval → OIDC apply → runtime check.

**Martin:** 52:10-53:00: boundary. The documented gaps stay visible: single-maintainer admin override, self-review setting, and the environment gate before the apply job's plan, mitigated by a reviewed plan-only run and in-job plan comparison. This shows reuse of code, not reuse of the private environment. `a-online` and `a-security` are appendix and hallway depth.

## s21-limits | 53:00-55:00 | Make the next change easier to review

**Haflidi:** Rule one: use Plan mode when the change has decisions worth resolving before edits.

**Martin:** Rule two: use Squad when named ownership and handoffs help. One writer owns a shared Terraform surface.

**Haflidi:** Rule three: use skills for repeatable procedures and MCP for specific sources or tools. Keep the artifact, reason, and check together.

## protected-slack | 55:00-58:00 | Protected slack

**Martin:** Protected slack: 55:00-58:00 — if on schedule, use this for a brief recap or extra Q&A warm-up; if behind, this is where you catch up before the close.

## s22-close | 58:00-60:00 | Close, public handoff, questions if time allows

> DRIVER Martin. Start the close at 58:00 and finish at 60:00. Questions only if time remains.

**Martin:** Humans set direction and approve; agents help move work through the same gated loop. The public handoff is the module material, talk docs, and evidence boundaries. Use the reusable parts: module interface, prompts, lane pattern, and check discipline.

**Haflidi:** Day 2: the same loop for operations: detect, propose, review, approve, apply, verify. Keep limits visible. Local checks, consumer checks, and Azure runtime evidence answer different questions. The appendix is available for hallway questions.

**Martin:** If we have time, we can take one short question now. Otherwise Haflidi and I will use the appendix afterwards. Thank you.

## a-cli-controls | Appendix | Branch and recover deliberately

> Reference only. No extra scheduled time. Return to `s22-close` if still in the timed slot. CLI `/fork` carries context; `/worktree` separates working files, not credentials. Protect useful work with a checkpoint. Installed `/rewind` help describes last-turn recovery; moving docs describe a picker. Verify the selected build's UI and resulting files. It isn't Azure rollback. `/resume` returns to a selected saved session. Never expose unrelated sessions.

## a-automation | Appendix | Automate bounded work

> Reference only. `/autopilot` needs a finite objective, permissions, and a stop condition. The reviewed help/docs agree on five default continuations; use explicit limits rather than relying on a default. `/limits` and `--max-ai-credits` are soft; parent/subagents share accounting and compaction can consume credits. They are not hard financial or safety guarantees. `-p`/`--prompt` is noninteractive; `-i` retains interaction. Use selective approvals and never combine `--plan --mode autopilot` for C2. `/fleet` and `/subagents` belong to native CLI parallel work.

## a-handoffs | Appendix | Choose where the work happens

> Reference only. `/delegate` hands a bounded task to GitHub's cloud agent with draft-PR consequences. `/remote` steers the existing still-running local session; its host must remain online. No public sharing demonstration or cloud PR is claimed. Confirm current availability and permissions before later use.

## a-integrations | Appendix | Add the context you need

> Reference only. `/ide` and `/lsp` support editor/language-service integration where configured. Inspect-only `lsp list` doesn't start a server. `/plugin` packages reviewed capabilities but doesn't make contributed tools built-in. `/research` supports a sourced investigation; `/rubber-duck` targets one design or coverage question with documented different-model critique, subject to model availability and added usage. Verify citations and actual behavior. See the public feature guide for detail.

## a-squad-ops | Appendix | Keep the team state useful

> Reference only. Squad `status` and `doctor` concern setup, not Terraform correctness. Installed doctor help and reference exit-code claims differ; read actual diagnostics and exit status. Back up before `import`; `export`/`import` help doesn't verify round-trip fidelity or safe overwrites. `nap --dry-run` previews team-state hygiene, unlike CLI `/compact`. `squad loop --init` can create a starter loop file; `squad triage` is the reference-backed issue-routing command. Ralph triage can mutate labels without `--execute`; documented runners may inject broad permission flags. No watcher runs here.

> Reviewed current and stable Squad templates use `.github\skills` for bundled playbooks and `.squad\skills` for earned knowledge. Project `.copilot\skills` is legacy despite stale feature-page prose. Review the evidence and limits of learned recipes; expose native CLI skills through supported discovery locations. Current coordinator routing favors one accountable owner with bounded contributors, not guaranteed eager fan-out.

## a-evidence | Appendix | Know which gate you are reading

> Reference only. Keep the full upstream source pin, reviewed module revision, and exact check evidence with the release. For a detailed Terraform plan, exit codes are 0 for unchanged, 2 for proposed changes, and 1 for error. Private scope, state, network compatibility, policy evaluation, and authorized read-back remain separate gates; the October 5 validation closes them only for the cited private consumer run.

## a-online | Appendix | Same module, Online landing zone

> Reference only. Answer "can this run somewhere simpler?" Keywords: same module, thin root, guardrails constrain, runtime evidence not hope. The demo-env repo root `deployments/online` consumes the module by tag `v0.6.0` and owns providers, backend, network, and the namespace. Three landing-zone controls shaped it: storage forced private (state through a private endpoint, so an ephemeral VNet-integrated runner), `Deny-Subnet-Without-Nsg` (the AKS-managed VNet was rejected, so BYO subnets with NSGs and an explicit NAT Gateway), and AKS RBAC Writer cannot create namespaces (managed namespace through ARM). Nothing was exempted. The chain: PR, protected branch, human environment gate, OIDC, plan and apply in one job with no plan artifact, a public API server that accepts only the runner's static egress IP, Entra-only kubeconfig, and a runtime check step that fails unless the hostname returns HTTPS 200, HTTP redirects, and DNS resolves to the App Routing controller Service address. This demo uses Azure's managed NGINX application-routing path for AKS. For new AKS 1.36 Automatic clusters, Learn now points the default ingress story at Gateway API instead; NGINX stays supported for critical fixes through November 2026. The current page at `https://aks-online-demo.swedencentral.cloudapp.azure.com/` is the branded NIC 2026 demo, served by pinned `nginx-unprivileged`, showing the serving pod, render time, flow, and speakers; apply runs 37771532872 and 37772290635 both ended with plan "No changes", DNS matching the ingress IP, HTTPS 200 by hostname, and title "AKS Automatic | NIC 2026 demo". `Test-OnlineSecurity.ps1` is 29/29 PASS. The real runs found seven issues: five module fixes written test-first (user-assigned identity for BYO subnets, `userAssignedNATGateway` egress, two perpetual drifts, and the SKU: the module sent `Base`, now `cluster_sku = "Automatic"` with managed system node pools), one root fix (no module-level `depends_on`), and one later public-module fix for the plan-time-unknown subnet count. The public module repo (`martinopedal/terraform-azapi-aks-automatic` v0.6.0) has `use_external_subnets`, and the Online root in `martinopedal/aks-automatic-demo-env` sets `use_external_subnets = true`. The public module repo at v0.6.0 also includes `tests/external_subnets.tftest.hcl`. This repository's local Corp module copy (`terraform/modules/aks-automatic-corp`, pinned to `b01256eb9b1ea6046b9bb8a403662f724a7b6fa7`) does not have that flag. The cluster was rebuilt as the Automatic SKU because Base to Automatic migration is not supported. Detail and evidence: `docs/online-demo.md`. Do not show subscription, tenant, or principal IDs.

## a-security | Appendix | What AI found that the scanners did not

> Reference only. Answer "how did AI help security, and what does GHAS already do?" Keywords: GHAS baseline, silent gaps, oracle, human approval. The module and demo-env repositories run CodeQL default setup, secret scanning with push protection, and Dependabot security updates, with zero open alerts on October 7. Module `main` requires Terraform Validate, Style Check, CodeQL, Checkov, TFLint, and Trivy; demo-env `main` requires Terraform Validate, Checkov, TFLint, and Trivy. The agent found what produces no alert: Checkov's parser had rejected the module's `main.tf` since August, so the cluster definition was never scanned; the Security Scan workflow had been disabled for inactivity; a feature monitor reported green while crashing; approving a gate right after dispatch silently failed; and a VM cleanliness check could not see per-user installs. Microsoft Learn through MCP supplied product rules such as Base to Automatic migration not being supported. Each claim was then re-checked by a test or read-back: 52 module contract cases plus 2 caller/example Terraform test cases; 29/29 Online read-back checks including negative tests from the internet; and 14 VM checks. Every merge and every Azure write had a human decision. Gaps stay visible: single-maintainer admin merges, identifiers in history, and Checkov not reading azapi bodies. Detail: `docs/security-case.md`.

## a-prompts | Appendix | Prompts you can rerun

> Reference only. Answer "how do I get similar results with my agents?" Keywords: guardrails first, one lane per step, the oracle marks outcomes, measure repeatability. Step 1 reads effective policy and RBAC at the target before design; step 2 grounds API facts through Microsoft Learn and Terraform Registry MCP with citations. Then `terraform-coder` edits, `terraform-validator` runs fixed offline commands, and `terraform-reviewer` reviews in a fresh `/new` context. Consume through a thin root and deploy through the pipeline. In the October 8 eval, repeatability was measured as five fresh runs from one checkpoint against a pre-registered `>= 4/5` green bar; this is a checkpoint, not a guarantee. Results were B1 0/5, B2 5/5, and B3 4/5 after a disclosed harness-bug rescore from 0/5 (saved diffs, no rerun), with the out-of-scope README edit still red; two of three original briefs met the threshold, and the misses stayed visible. B1 failed because every run wrote two asserts against a pre-registered minimum of three. B1v2 was a separate, clarified brief that asks for four separate asserts, and it was 5/5 green under the same pinned conditions, with 61-114 s runs and no failure modes observed in those five runs. C3-C5 uses the B1v2 loop because it met the Oct 5 plan's at-least-four-of-five bar in the Oct 8 re-measurement; the live run still has to pass. Lesson: if the oracle has a rule, say it in the brief. Prompts: `docs/prompt-pack.md`. Do not generalize beyond this eval.

## a-bootstrap | Appendix | Start a squad in five steps

> Reference only. Answer "how do I start?" Keywords: install, init, hire, verify, upgrade safely. (1) Prerequisites: Copilot CLI and a Git repository; GitHub CLI only if you want issue routing. (2) Install Squad 1.0.x with `winget install --id bradygaster.Squad --exact`, Homebrew, or GitHub Releases; npm `latest` still pointed at 0.13.1 on October 5. (3) In the repository terminal run `squad init`; it is a shell command, not something you ask the agent. (4) Start `copilot --agent squad` and describe what you are building. Init Mode proposes a cast roster (a few specialists plus Scribe, Ralph, Rai, and Fact Checker) and writes nothing until you confirm; then it creates `.squad\` with team, routing, decisions, and member histories. Commit it. (5) Check with `squad doctor`. Before `squad upgrade`, back up: it preserves team, routing, decisions, histories, and config, but replaces the coordinator file and templates. Simplest good start: one repository, three to five specialists, add narrow native profiles only where a lane needs limits.

## a-use-cases | Appendix | When Squad earns its place

> Reference only. Answer "when is it worth it, and how does it fit with Copilot CLI?" One line: Copilot CLI runs the work; Squad routing assigns an accountable owner and records why. The CLI is the execution surface: model, tools, permissions, Plan mode, MCP, diff, review, and resume. Squad is a custom agent inside it plus repository state: roles, routing, handoffs, decisions, and ceremonies. Use Squad when work crosses owners (module, tests, and docs in parallel with one writer per file), when work outlives a session (decisions and histories let you resume or hand over), and for backlog and review flow (issues routed by `squad:{member}` labels, Ralph keeping the queue moving, and a rejected change revised by a different author). Skip it for a small, well-understood edit that fits one CLI lane. Squad does not replace Terraform checks, human approval, or the CLI's own permissions.
