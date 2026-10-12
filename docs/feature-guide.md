# Copilot CLI and Squad: practical engineering workflows

Original Haflidi hosted `haflidif/squad-on-aca` implementation is completed and
previously demonstrated; leave source/deployment alone. Fresh personal target
registration/access/rehearsal is separate, not missing/broken original work or
a native Sandbox prerequisite. Native ACA integration is remaining build.

Use Copilot CLI to turn an AKS requirement into inspected code, and Squad to keep ownership and decisions intact across tasks.

The example is a reusable Terraform module for a fresh, private AKS Automatic cluster using supplied network inputs. Provider/backend configuration belongs to the caller. The inherited starting point is a root module, not a finished library. Prompts below are examples, not executed transcripts or Azure compatibility evidence.

## Evidence and availability

Reviewed September 30, 2026. We read current GitHub documentation and pinned Squad's default `dev` branch at `93aec83accb44e08c39e4a799f13b55208215a13`. The stable `main` comparison is `5e086cece467686b2d3c6950241cf87bca5fffe8`. Squad v1.0.0 (October 3) and v1.0.1 (October 4) release tags exist, and the demo machine uses 1.0.1. The pinned reference docs at `93aec83` still carry an Experimental/alpha banner, so docs may lag releases. See [whats-new.md](whats-new.md).

Current native host checks are **Copilot CLI 1.0.94, Squad 1.0.1 (October 12, 2026)**, with ACA CLI 1.0.0-preview.4 and enabled official sandbox plugin 0.0.5-beta. One laptop's corrected read-only preflight passed 18/18; this is not both presenters, clean VM/manual sign-in, full rehearsal or MicroVM acceptance. October 8 validation used Copilot CLI 1.0.93. Historical local probes used Copilot CLI **1.0.88** directly and Squad **0.13.0**, before the 1.0 releases; the unqualified `copilot` command then returned **1.0.89**, so a command name alone isn't a version pin. Earlier changes from 1.0.88 to 1.0.92 are listed in [whats-new.md](whats-new.md). Re-probe the live-demo build before delivery. Deck 0.21.0 introduced the public status badges. Deck 0.22.4 preserves accepted 0.22.3 and completes repo-map/progress/operator notes without on-screen or clock changes; live Pages remains 0.22.2 pending review/release. Read stage labels from the badge table in `presentation\src\slides.mjs`.

Squad 1.0.1 is the session's installed version. The WinGet catalog confirms package availability; see [bootstrap.md](bootstrap.md). A zero exit from generic help does not verify standalone model, models, list, remote-state, or heartbeat behavior. Use the native Copilot CLI `/model` and `/subagents` controls for this session. Historical release notes about `squad models refresh` describe v0.12, not an installed 1.0.1 qualification.

For the same workflows applied end to end through a real pipeline, see [online-demo.md](online-demo.md) (Online landing-zone variant) and the rerunnable [prompt-pack.md](prompt-pack.md).

The live demo consumer is `martinopedal/aks-automatic-demo-env`, pinning `martinopedal/terraform-azapi-aks-automatic` at `v0.6.0`; this session's copied Corp teaching module has its own unchanged source pin/manifest.

### Execution host availability, not a Squad sandbox product

Squad is coordination/configuration over its Copilot host; installed 1.0.1 help has no sandbox verb. [Four hosts](sandboxing.md) distinguishes local OS/MXC `/sandbox`, GitHub-managed Copilot cloud sandboxes built on ACA in preview, customer-managed ACA MicroVMs via `aca`, and hosted Squad Apps/Jobs, not MicroVMs. A worktree/tool filter does not isolate credentials.

GitHub documents interactive-only `copilot --cloud --experimental`, never with `-p`/`-i`. Neither local 1.0.94 normal nor experimental help exposes `--cloud` here: documented preview/account-build gate, not rehearsed availability. Native `/sandbox status` belongs to the interactive UI; standalone sandbox help offers `ca`, not `status`. Windows proxy rules require Allow local network and applications honoring the proxy; file tools are best-effort and remote MCP is not sandboxed.

Installed `copilot help sandbox` documents one-session `--sandbox` despite top-level-help omission. Actual Windows MXC startup failed before command, exit 1, on proxy/masking/auth loopback/private-network requirements; policy blocked, no bypass/global change. Needs authorized policy review and actual backend/session preflight rerun. Windows build 26300 is OS metadata, not successful backend operation. Explicit `--cloud --experimental --help` parse exit 0 is not account/entitlement/billing/runtime proof.

Corp MicroVM recovery failed; no successful Corp sandbox creation/runtime test or full CLI+Squad execution inside a MicroVM is established. Host installs do not prove in-MicroVM process/agent/prompt execution; sign-in/storage/egress need separate consent, never copied host authentication. Hosted Jobs placement was verified in Corp, Norway East, but fresh queue-driven readiness is not established. See [current readiness](run-plan.md#october-12-readiness-evidence).

Current qualification: Corp source merged, new qualification blocked on an
unexpected change-type check; no apply performed. Confirmed native direction is
a separate Online SandboxGroup/RG, not inside AKS or hosted Jobs; standard managed
network if policy allows is proposed, not Corp BYO VNet/UAMI/FIC transplantation.
Candidate RG absent; not created/deployed/tested/independently plan-approved.
Leave Corp untouched. Host token auth passed; doctor 9/9 resolved to cached
Management despite explicit flags, so compare printed target and independent
exact-ID read-back, not its exit alone. Actual Corp scoped list remains forbidden.

For clone/change/deployment ownership use [the repo map](repositories.md).
Haflidi's `haflidif/squad-on-aca` is hosted implementation, not the private queue
target. Historical hosted smoke is not current confirmation; fresh issue open/
queue queued/runner registration blocked, no fresh PR. See [progress/next
actions](sandboxing.md#october-12-progress-and-next-actions), [official quickstart
coverage](aca-sandboxes.md#full-test-coverage-checklist) and [separate VM demo
product flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).
Fresh full Online AKS validation at 10:47 UTC: app/source-matching assets and two
replicas PASS under TLS bypass, canonical 26 PASS/2 BLOCKED/1 report-only,
corrected supplemental 10 PASS/1 FAIL (TLS)/1 NOT_APPLICABLE (external `/healthz`;
source requires direct-pod 200 `ok`). Native Kubernetes/ResourceHealth unavailable,
full health unproved. Eleven noncompliant resources within demo RG across
AKS/network/state, not 11 cluster failures/subscription-wide.
No renewed 29/29/full TLS result; C1 Oct 13 remains scheduled.

Online is primary for eligible demos, not fallback/policy escape; Corp-required
private workloads stay Corp. Repo visibility and authenticated network/control
plane are separate. Preserve working AKS/Corp/Jobs, no checklist redeploy or
automatic repair of the working app/cluster.

| Evidence code | What was verified |
| --- | --- |
| H1 | Pinned CLI version and `--help`, including plan, prompt, tool-filter, and MCP flags |
| H2 | Pinned `help commands`: interactive command availability |
| H3 | Pinned `help permissions` and `help limits`: matching and accounting rules |
| H4 | Pinned `instruction --help` and `lsp --help`: inspect-only interfaces |
| S0 | Squad version, top-level help, and CLI reference for setup, diagnostic, state, and triage commands |
| D | Documented behavior or template contract only; not locally exercised |

`SHOW` means planned live demonstration, `MENTION` means brief explanation, and `APPENDIX` means an optional reference. None means that a UI demonstration passed. Model access, trusted configuration, servers, and IDE connections require separate setup. Optional fallback captures are evidence only after review; they are not a deck dependency.

## C2: turn an outcome into a reviewable plan

**Native Plan mode and artifacts.** After the live chapter starts, launch `copilot --agent squad --plan`, or use `/plan` in an interactive session. `--mode plan` is another entry point; `-i` submits an initial prompt while retaining the interactive interface. Ask: "Plan the private Automatic module boundary, caller-owned providers/backend, positive assertions, and sanitized example. Identify unresolved API requirements. Don't implement yet." GitHub documents a session-local `plan.md`, clarification, and approval. Tip: inspect `/session plan`, revise a real assumption, approve explicitly, and show the mode transition. Current docs describe direct project-write blocking, but also limits for ambiguous shell/MCP actions. A Markdown plan alone isn't enforcement. Never use `--plan --mode autopilot` for this human-approval chapter. SHOW C2; H1/H2, D; [G1], [G2].

**File context and instructions.** `@main.tf` adds explicit file context; `/instructions` exposes applicable guidance. Put enduring conventions in `AGENTS.md` or `.github\copilot-instructions.md`, and HCL-specific rules in `.github\instructions\terraform.instructions.md` with `applyTo`. Ask: "Compare the inherited SKU comments with the implementation and testing instructions." This gives Squad a shared starting point without repeating every rule in every task. Tip: remove contradictory guidance rather than assuming one instruction file wins. Applicable instructions combine; path instructions require matching files, and changed instructions need a new/restarted session. SHOW C2; H2/H4, D; [G3].

## C3: give each edit a clear owner

**Custom agents and built-in subagents.** A profile defines expertise; a subagent is a separate execution context. `/agent` selects the Squad coordinator. Built-in Explore, Task, and Code Review support discovery, command execution, and review without requiring a permanent team role. Ask: "Explore the input/output boundary read-only, then return the exact files the module author needs." Tip: choose a persistent custom profile for repeated specialist work, not every small lookup. Current docs say custom subagents don't receive repository instructions by default; `include-custom-instructions: true` opts in. Verify this on the chosen build and pass essential task constraints explicitly. SHOW C3; H1/H2, D; [G4], [G6].

**Squad charters and routing.** `team.md` names members, `charter.md` defines responsibility, and `routing.md` directs work by name/domain. Ask: "Lead owns the contract; one runtime author owns module HCL; tester owns tests; docs owns the consumer example. Return artifacts and unresolved dependencies." This reduces repeated assignment work. Tip: name the integration owner as well as individual writers. Role names and isolated contexts don't create filesystem locks. The current coordinator favors one accountable specialist with bounded contributors, despite a feature page describing eager fan-out. SHOW C3; S0, D; [S1], [S3], [S15].

**Parallel work and handoffs.** Native `/fleet` decomposes parallelizable work; `/tasks` exposes task progress. Squad adds role continuity and handoff conventions. Ask: "While the author implements the agreed interface, independently draft contract tests and explain example inputs. Wait for the interface before integration." Tip: hand over paths, revisions, commands, results, and the next owner, not a prose success claim. Dependency-bound work still runs sequentially; more agents may cost more without finishing sooner. Film coordinator actions and retain labeled evidence for off-screen workers. SHOW C3 for tasks/handoffs; MENTION fleet; H2, D; [G5], [S1].

## C4: choose the right kind of context

| Mechanism | Useful combined workflow and prompt | Tip, limit, and evidence |
| --- | --- | --- |
| Skill | A reusable test recipe guides Squad's tester: "Use the contract-test skill to assert the requested payload, not mocked response values." | Keep task recipes out of always-on instructions. `/skills reload` and `/skills info` help confirm discovery. Scripts need permissions; loading a skill isn't running its checks. The Azure Functions skills source supports only the weaker wording that product-specific skills improve task guidance; do not claim consistency regardless of model. SHOW C4; H2, D; [G7], [G20]. |
| MCP | A configured documentation server supplies fresh source material: "Find the supported private/custom-network requirements and link each proposed property to a source." Squad records the resulting decision. | Show the actual call/result, not just `/mcp`. GitHub MCP is built in; Azure/Terraform documentation servers are additional configuration. `--disable-mcp-server` and `--disable-builtin-mcps` have different scopes. SHOW C4; H1/H2, D; [G8]. |
| Plugin | Package a reviewed profile, testing skill, hooks, and server configuration for another module team: "List what this plugin contributes before enabling it." | The native packaging mechanism doesn't make contributed tools built-in. Pin/review package contents; avoid legacy cross-kind plugin commands. APPENDIX C4; H1/H2, D; [G6], [G18]. |
| Hook | A configured lifecycle command can record a nonsensitive check summary: "Design a post-tool hook that records command, exit code, and artifact ID." | Hooks execute code; skills supply task guidance. Test hook input/output and restart behavior. Repository hooks aren't automatically protected organizational policy, and no hook is configured by this guide. MENTION C5; H2 `/env`, D; [G9]. |

**Permissions without repeated broad grants.** `--available-tools` controls what the model sees; `--allow-tool` controls approval; `--deny-tool` takes precedence. Ask: "Use only the approved read-only lookup, then explain which assertion it supports." Narrow, pre-reviewed permissions can reduce interruptions while leaving meaningful decisions visible. Tip: inspect the exact tool and arguments before the live approval. Denying `write` does not prohibit shell-based writes, and allowing an interpreter isn't limited to one intended script. Tool/path/URL rules and OS credentials remain separate. SHOW C4; H1/H3, D; [G17], [G2].

## C5: make feedback change the artifact

**Diff, review, and critique.** `/diff` shows changes; `/review` requests focused code review. Ask: "Review the module extraction for altered defaults and missing positive assertions; cite files and consequences." Squad routes actionable findings to the responsible owner. Tip: use `/rubber-duck` for one unresolved design or test-coverage question rather than repeating full reviews. Public sources support Rubber Duck as a different-model critique path and the June 2, 2026 changelog says Rubber Duck is GA; treat it as review input, not approval. Neither critique nor a quiet review establishes correctness. Show the same failing check, repair, and rerun with unchanged criteria. SHOW C5/C7 for diff/review; APPENDIX C5 for critique; H2, D; [G10], [G11], [G21], [G22].

**Squad rejection semantics.** A designated reviewer can formally reject an artifact and require a different revision author. Ask: "Reject only blocking defects; identify the artifact, original author, failure, and required correction." The coordinator's contract prevents the rejected author from producing or advising on that revision. Tip: distinguish normal test repair from formal rejection so C5 doesn't accidentally invoke lockout. This is an explicit coordination protocol, not a native filesystem or branch-protection guarantee. Reviewer approval doesn't automatically authorize merge or apply. MENTION C5; S0, D; [S1], [S6].

## C6: preserve reasons across sessions

**Context, compaction, and resume.** `/context` exposes context use; `/compact` summarizes conversation; `/resume` returns to saved work. Ask: "Resume the contract task; retain the private-cluster requirement, caller-owned state, accepted tests, and unresolved API questions." Squad's decision files make those reasons inspectable independently of the conversation. Tip: save and reread the accepted decision before compaction. Summaries can omit detail; neither a long session nor a resumed conversation guarantees complete memory. Don't advertise a fixed automatic-compaction threshold because current GitHub pages differ. SHOW C6 for context/resume; MENTION compact; H2, D; [G1], [G17], [G19].

**Decisions, history, and Scribe.** Shared decisions are dropped under `.squad\decisions\inbox\`; Scribe later consolidates durable decisions into `.squad\decisions.md`. An agent's `history.md` holds its own relevant experience. Ask: "Record why providers/backend remain outside the module, the source reference, and the accepted test. Have the next owner read it." Tip: preserve decisions and provenance, not complete conversations. These are reviewable files, not model retraining or a promise to remember everything. Native `/memory` is separate from Squad's ledger. SHOW C6; H2, S0, D; [S4], [S1].

**Learning reusable skills.** Ask: "Turn the demonstrated valid-but-wrong payload test into a reusable lesson, with its evidence and limits." Squad can retain earned guidance and use it in later routing. Tip: keep team-earned material in the reviewed Squad location; expose a native CLI skill through a supported location and valid `SKILL.md` when needed. Current/stable coordinator templates use `.squad\skills` for earned knowledge and `.github\skills` for bundled playbooks; the skills article still calls `.copilot\skills` the new location. Follow the pinned template, not that stale instruction. Confidence labels aren't statistical validation. MENTION C6; S0, D; [S1], [S2], [S5], [G7].

## C1 and the appendix: compare, recover, and budget

**Fork and worktree.** `/fork` preserves conversation context; `/worktree` separates files in Git; `/fork worktree` combines them. Ask: "Compare two module-interface proposals without sharing subsequent decisions between runs." Squad's team state must also be copied or deliberately shared. Tip: record the base revision and state strategy. A fork is not a fresh comparison; `/worktree` leaves uncommitted changes behind, and the configured base ref matters. Worktrees don't isolate credentials. MENTION C1; APPENDIX C6; H2, D; [G2], [S8].

**Rewind.** `/rewind` can restore conversation/file changes so an abandoned approach doesn't dominate the next attempt. Ask: "Recover the previous local interface, then inspect the diff and retained decisions." Tip: protect useful work with an identifiable checkpoint first. Installed help describes last-turn recovery; current docs describe a picker with conversation-only and conversation-plus-files choices. Verify the actual UI and resulting files. It cannot undo an Azure apply, GitHub action, or all external side effects. APPENDIX C5/C6; H2, D; [G2].

**Models and subagent models.** `/model` selects a session model; `/subagents` controls defaults and per-agent settings. Squad adds persistent/task-specific model preferences. Ask: "Use an available code-capable model for HCL and a cheaper allowed model for prose; report what each task actually used." Tip: inspect effective settings rather than quoting Squad's model catalog as entitlement. Explicit dispatch, agent definitions, host settings, Auto behavior, and fallback affect the result. Different model names don't establish independent errors or a benchmark. SHOW C1 for model identity; APPENDIX C3; H1/H2, D; [G2], [S14].

**Usage and limits.** `/usage` reports session consumption; `/limits` and `--max-ai-credits` provide opt-in limits. Ask: "Before another review, show usage and explain which unanswered question justifies it." Tip: bound tasks and concurrency as well as credits. Pinned help says subagents share the parent limit and compaction can consume credits. The cap is soft because accounting follows a response; a continuation count isn't a money limit. SHOW C6 for usage; APPENDIX C3; H2/H3, D; [G12].

## C7 and the appendix: finish work in the right place

**IDE and LSP.** `/ide` connects editor selection, diagnostics, and visual diffs; `/lsp` manages configured language services. Ask: "Explain the selected HCL diagnostic, then return a focused correction to the module owner." Tip: check the selected workspace and server before interpreting diagnostics. CLI's inspect-only `lsp list` doesn't start a server. Terraform language support and IDE integration need setup; pre-approved writes can skip the IDE approval diff. APPENDIX C5; H2/H4, D; [G13], [G2].

**Programmatic CLI.** `-p`/`--prompt` executes one prompt and exits, useful for repeatable public-diff summaries or release-note drafts. Ask: "Summarize this approved module diff and list consumer-facing changes; don't modify files or contact services." Squad can supply the selected profile and accepted context. Tip: use explicit inputs, tool availability, selective approvals, and real output/exit records. Documentation permits selective approvals despite a broad-approval phrase in top-level help. This read-only permission recipe still needs rehearsal. Programmatic output is not interactive Plan-mode evidence or identical generation. APPENDIX C7; H1/H3, D; [G17].

**Bounded autopilot.** Autopilot continues a defined local objective without a new user prompt after each step. Example: "Complete only the approved example documentation and stop after its checks." Squad supplies ownership and stopping criteria, not new permission guarantees. Tip: set explicit continuation and credit limits, and inspect effective permissions. Limited mode denies requests needing approval; unattended execution can stop incomplete. Keep this separate from the human-reviewed Plan-mode clip and never recommend blanket grants as a prerequisite for the talk. APPENDIX C3/C7; H1/H2/H3, D; [G14].

**Cloud delegation versus remote steering.** `/delegate` sends a bounded task to GitHub's cloud agent, with checkpoint/branch and draft-PR consequences: "Prepare the approved documentation follow-up in a separate PR." `/remote` instead lets you steer the existing running CLI session from another device. Tip: choose cloud delegation for work that must outlive the local machine, remote steering for continuity with that machine. Both need account/service access; the local host must remain online for steering. Neither is demonstrated or enabled here. APPENDIX C7; H1/H2, D; [G15], [G16].

## Squad operations that keep the workflow usable

| Feature | AKS use case or prompt | Tip and boundary |
| --- | --- | --- |
| `status`, `doctor` | Confirm which team owns the module and diagnose setup before assigning work. | Read diagnostics, not just exit status. The pinned reference lists `doctor` and its `heartbeat` alias, and says doctor always exits cleanly because it is diagnostic. No delegation success follows from healthy setup. MENTION C3; S0, D; [S7]. |
| `nap --dry-run` | "Preview stale planning/history cleanup after the demo, preserving accepted contract decisions." | Preview and back up before maintenance. This is Squad state hygiene, not CLI conversation compaction. APPENDIX C6; S0, D; [S7]. |
| State strategy | Choose worktree-local state for independent comparisons or deliberate shared state for one team. | `local` is the default; `orphan` and `two-layer` are opt-in and can add Git hooks/sync. Don't assume conflict-free concurrent writers or credential isolation. APPENDIX C1/C6; S0, D; [S8], [S9]. |
| Export/import | "Prepare a local snapshot of reviewed testing knowledge for a disposable second module project." | Inspect content and keep a separate backup before import. Help confirms local JSON interfaces, not perfect fidelity or safe overwrites. Private histories must not enter the public package. APPENDIX C6; S0, D; [S10]. |
| Issues, PRs, and Ralph | Route a consumer-documentation issue with a `squad:<member>` label and link its PR. Ralph can identify stalled reviews or CI work. | In-session monitoring, local `triage`/`watch`, and Actions heartbeat need separate activation. Configure GitHub CLI access and stop rules. Triage can change labels/assignments without `--execute`; documented execution runners can inject broad permission flags. Formal rejection still requires reassignment. Keep watchers out of the recorded engineering loop. APPENDIX C7; S0, D; [S3], [S11], [S12]. |

Use `copilot --agent squad` for conversation. The standalone Squad shell is deprecated; the SDK is outside this session's scope. Setup, GitHub coordination, and portable knowledge complement the CLI; they don't replace executable Terraform checks or human acceptance. [S13]

## Sources

All sources below were reviewed September 30, 2026. GitHub Docs are moving documentation, not a 1.0.88 specification. Squad links use the pinned current commit except S2, which is the stable comparison. H/S0 indicate help observations, not executed workflows.

| First-party sources | Coverage | Local pairing |
| --- | --- | --- |
| [G1], [G2], [G3], [G19] | Plan artifacts, command behavior, context/instruction discovery | H1/H2/H4 |
| [G4], [G5], [G6] | Profiles, subagents, fleet, customization distinctions | H1/H2 |
| [G7], [G8], [G9], [G18] | Skills, MCP, hooks, plugins | H1/H2; hooks D |
| [G10], [G11], [G12], [G13] | Review, critique, limits, IDE | H2/H3/H4 |
| [G14], [G15], [G16], [G17] | Autonomy, cloud handoff, remote steering, permissions | H1/H2/H3 |
| [S1], [S2], [S3], [S6], [S15] | Coordinator contracts, routing, parallelism, rejection | S0; contracts D |
| [S4], [S5], [S14] | Decisions, histories, skill learning, model policy | S0; policies D |
| [S7], [S8], [S9], [S10] | Operations, worktrees, state, portability | S0 |
| [S11], [S12], [S13] | Ralph, issue/PR coordination, supported interface | S0 |

[G1]: https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-best-practices
[G2]: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
[G3]: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions
[G4]: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli
[G5]: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/fleet
[G6]: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/comparing-cli-features
[G7]: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills
[G8]: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers
[G9]: https://docs.github.com/en/copilot/reference/hooks-reference
[G10]: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/agentic-code-review
[G11]: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck
[G12]: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/set-session-limit
[G13]: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/connecting-vs-code
[G14]: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot
[G15]: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca
[G16]: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely
[G17]: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli
[G18]: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference
[G19]: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli
[G20]: https://github.com/azure/azure-functions-skills
[G21]: https://github.blog/ai-and-ml/github-copilot/github-copilot-cli-combines-model-families-for-a-second-opinion/
[G22]: https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/
[S1]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/.squad-templates/squad.agent.md
[S2]: https://github.com/bradygaster/squad/blob/5e086cece467686b2d3c6950241cf87bca5fffe8/.squad-templates/squad.agent.md
[S3]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/routing.md
[S4]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/concepts/memory-and-knowledge.md
[S5]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/skills.md
[S6]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/reviewer-protocol.md
[S7]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/reference/cli.md
[S8]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/worktrees.md
[S9]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/state-backends.md
[S10]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/export-import.md
[S11]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/ralph.md
[S12]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/github-issues.md
[S13]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/get-started/choose-your-interface.md
[S14]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/.squad-templates/model-selection-reference.md
[S15]: https://github.com/bradygaster/squad/blob/93aec83accb44e08c39e4a799f13b55208215a13/docs/src/content/docs/features/parallel-execution.md
