# What's new: GitHub Copilot and Squad, October 2025 to October 2026

Haflidi's original hosted implementation is completed/previously demonstrated;
leave it alone. New personal queue target/rehearsal readiness below is separate,
not evidence original is broken/missing and not native Sandbox prerequisite.
Separate Online native five-object deployment/current operator access/base
375-second probe are independently verified. Corrected 26.768-second host
Copilot/Squad fixture engineering is independently accepted and runtime-ready;
human preflight/rehearsal, second-presenter sign-in and any selected Terraform
variant remain separate gates. Fresh hosted Apps/Jobs E2E remains BLOCKED on
registration404/custom-agent-profile qualification; the original implementation
is unchanged.

Reviewed October 5, 2026, for the October 14 session; updated October 12 for local deck 0.22.4, preserving accepted draft 0.22.3. Deck 0.22.4 is released on main/Pages; later local operator-doc corrections await their own reviewed release. Auto/HydraFusion remain the leading news. C0-C7 remain live demo chapters with optional fallback evidence. Every row links to a primary source. Statuses change quickly, so recheck them before quoting one on stage. Product news is context, not target runtime proof. Earlier Management-side MicroVM execution remains historical evidence. Corp source merged but new qualification blocked on an unexpected change-type check; no apply performed. Current Online native proof is bounded to the accepted fixture, not human stage GO. Hosted Apps/Jobs and existing AKS remain independent.

## Key updates

Local deck 0.22.5 is a notes/status-only candidate; released main/Pages stays
0.22.4 until reviewed publication. It adds no new headline, tour or slide.

| # | Date | News | Status | Why a Terraform or platform engineer cares |
| --- | --- | --- | --- | --- |
| 1 | 2026-07-01 | [Auto model selection](https://github.blog/changelog/2026-07-01-copilot-cli-auto-model-selection-routes-based-on-task/) | Announced | Routes per task using health and utilization signals, honors admin model policies, and gives paid subscribers a 10% discount. Legacy annual Pro/Pro+ plans use premium-request multipliers until expiry. Switch with `/model`; keep the stage model pinned for eval parity |
| 2 | 2026-09-04 | [Project HydraFusion](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/) | Research preview | Select it like a model; it chooses Single, Cascade, or Critique. Published figures are offline benchmarks and estimated cost, not measured savings from this demo |
| 3 | 2026-02-25 | [Copilot CLI is generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), with Plan mode, autopilot, built-in Explore/Task/Code Review agents, custom agents, skills, hooks, and plugins | GA | The terminal surface this session uses is a supported product, not a preview |
| 4 | 2025-10-28 / 2026-02-04 | [Agent HQ and Mission Control](https://github.blog/news-insights/company-news/welcome-home-agents/), then [Claude and Codex in Agent HQ](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/) | Third-party agents in public preview | One GitHub control plane for agent work, whichever vendor's agent does it |
| 5 | 2026-06-01 | [Usage-based billing with GitHub AI Credits](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) | Effective | Long agent runs now cost credits directly, which is why `/limits`, `--max-ai-credits`, and bounded tasks matter |
| 6 | 2025-12-18 / 2026-07-29 | [Agent Skills](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/), then [skills and MCP in Copilot code review](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/) | Code-review support GA | Write a Terraform procedure once in `SKILL.md`, then reuse it when authoring and when reviewing |
| 7 | 2026-10-01 | [Computer use in Copilot CLI and the Copilot app](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/) | Public preview, macOS and Windows | Agents can operate GUI-only tools that have no API, CLI, or MCP integration. You approve each app, and admins can disable the feature |
| 8 | 2026-10-03 / 2026-10-04 | [Squad 1.0.0](https://github.com/bradygaster/squad/releases/tag/v1.0.0) and [1.0.1](https://github.com/bradygaster/squad/releases/tag/v1.0.1) | Release tags exist; docs may lag | The demo uses 1.0.1, while pinned docs at `93aec83` still carry Experimental/alpha wording |
| 9 | 2026-06 / 2026-09 | [Azure Container Apps Sandboxes overview](https://learn.microsoft.com/azure/container-apps/sandboxes-overview) and [Azure Updates 561262](https://azure.microsoft.com/updates?id=561262) | June preview, September GA | Official plugin/native MicroVM execution context; C4 requires independently approved selected-target IaC, access/policy/full coverage and rehearsed preflight. Separate Online five-object/base proof and host-driven fixture engineering are independently accepted; human/selected-variant GO remains separate |

### Precision notes for speakers

- Auto and HydraFusion remain the leading news. The stage pins `claude-sonnet-5` for eval parity. HydraFusion's published offline benchmarks compare estimated cost with Opus 5: TerminalBench 2.1 +4.9 at 67% lower cost, DeepSWE -1.5 at 36% lower, and CheckpointBench -0.1 at 65% lower. Don't turn these into guarantees or measured savings from this run.
- ACA GA is not target acceptance. Historical Management ten root checks are not current native coverage or Corp 52+2 cases. Held Corp 8-present/3-absent/no-apply qualification remains history; leave Corp untouched. Separate Online five-object provisioning/current operator access/base probe is independently verified, not AKS/hosted Jobs or Corp BYO VNet/UAMI/FIC transplant. Corrected ACA SANDBOXES 26.768s host runtime passes LF/hash/three guest checks/JSON+SHA/exit23/causal denial/cleanup. Independent acceptance complete, then runtime-ready; human stage GO and hosted Apps/Jobs E2E separate. Earlier CRLF is controlled history; no inside-MicroVM agents/OAuth. [Full checklist/official quickstart](aca-sandboxes.md#full-test-coverage-checklist).
- Four hosts are distinct: local OS/MXC `/sandbox`; GitHub-managed Copilot cloud sandboxes built on ACA in preview; customer-managed native ACA MicroVMs via `aca`; and hosted Squad Apps/Jobs, not MicroVMs. Squad is coordination/configuration over its Copilot host, not a sandbox product; 1.0.1 help has no sandbox verb. Worktrees/tool filters do not isolate credentials, and host installs do not prove in-MicroVM execution. Sign-in/storage/egress need separate consent without copying host authentication.
- GitHub documents interactive-only `copilot --cloud --experimental`, never with `-p`/`-i`; organization/enterprise access is off by default and paid usage includes stopped storage. Local 1.0.94 normal/experimental help does not expose `--cloud`: documented preview/account-build gate, not a rehearsed command. [GitHub documentation](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes).
- Local `/sandbox` is off by default; `/sandbox status` belongs to the interactive UI, not standalone sandbox help (which offers `ca`). Windows needs supported [update prerequisites](https://aka.ms/ghcp-sandbox-os-support). Proxy rules require Allow local network and apps honoring the proxy; file tools are best-effort and remote MCP is not sandboxed.
- Installed `copilot help sandbox` documents one-session `--sandbox`; actual local MXC startup failed before command, exit 1, on proxy/masking/auth loopback/private-network needs. Policy blocked, no bypass/global change. Needs authorized policy review/runtime rerun; build 26300 is OS metadata, not successful backend operation. Explicit cloud help parse exit 0 is not account/billing/runtime proof.
- Hosted Squad Apps/Jobs placement was read back in Corp, Norway East, with two succeeded historical Oct 9 agent-job executions of 56 seconds. This updates placement only, not policy/routing proof or a fresh issue-to-PR rerun. Manual target runner with 7200-second timeout, no registered target runners today, and pending invitation mean fresh queue-driven readiness is not established.
- Haflidi authored `haflidif/squad-on-aca`; the private issue/queue/bot-PR target is not hosted source. Historical shared demonstration is not a current Haflidi-authored technical update. Fresh issue open/queue queued/no PR at 10:28 UTC; runner registration blocked. Ask for implementation revision and fresh sanitized chain result. [Repo map](repositories.md) and [two product flows](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).
- Native ACA's official quickstart explicitly offers a skill for host Copilot-driven commands. Primary integration is host CLI/Squad prompt -> ACA skill/tools -> isolated work/validation/exits -> reviewer handoff. Inside-MicroVM CLI/Squad is a separate advanced optional auth/runtime claim, not a basic-orchestration prerequisite. Host-driven fixture engineering is independently accepted for Online; inside-MicroVM agents/OAuth remain unproved.
- Host ACA auth exit 0 proves tokens only. Doctor 9/9 exit 0 printed cached Management despite explicit target flags: WRONG TARGET, not Corp/Online preflight. Compare printed target fields and independent exact-ID read-back; no config change, Management fallback or create permission.
- Fresh full existing Online AKS validation, corrected scoring: app/assets/two replicas PASS with TLS bypass; canonical 26 PASS/2 BLOCKED/1 report-only, supplemental 10 PASS/1 FAIL (TLS)/1 NOT_APPLICABLE (external `/healthz`; source requires direct-pod 200 `ok`). Native Kubernetes/ResourceHealth unavailable, full health unproved. Eleven noncompliant resources scoped to demo RG incl AKS/network/state, not 11 cluster failures/subscription-wide. No renewed 29/29/full TLS. USD 20 is alert, not cap; dated C1/C2/checks/cleanup remain scheduled.
- Online primary eligible demo placement is not fallback/policy escape. Corp-required private workloads stay Corp; repo visibility/network exposure are separate. Preserve working AKS/Corp/hosted Jobs; TLS/native-API limitations do not automatically authorize repair/redeploy.
- October 12 corrected one-laptop read-only preflight passed 18/18 with Copilot CLI 1.0.94, Squad 1.0.1 and ACA CLI 1.0.0-preview.4. Both hosts, clean VM/manual sign-in, full rehearsal, invitation, exact NIC listing and dated warmup/teardown remain separate [readiness gates](run-plan.md#october-12-readiness-evidence). Suspended native MicroVM compute charges stop but storage can continue; five-minute autoSuspend is not a hard active timeout or credential revocation.
- Computer use is a public preview. It isn't part of this Terraform demo. Toggle it with `/computer on`, `/computer show`, and `/computer off`. Each desktop app needs its own approval, and enterprise policy can turn the feature off. [Docs](https://docs.github.com/en/copilot/concepts/agents/computer-use).
- Recheck custom agents (`.agent.md`) by surface before stage. CLI custom agents are included in [Copilot CLI GA](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/). JetBrains status has conflicting GitHub sources: the [custom-agents reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration) lists JetBrains IDEs in public preview, while the [2026-03-11 JetBrains changelog](https://github.blog/changelog/2026-03-11-major-agentic-capabilities-improvements-in-github-copilot-for-jetbrains-ides/) says major agentic capabilities are generally available. For VS Code, the reference says `mcp-servers` frontmatter is ignored there. Don't say "GA everywhere".
- Rubber Duck provides a second opinion. It does not approve changes. The June 2, 2026 Copilot CLI changelog says Rubber Duck is GA, and the command is available in the locally validated CLI 1.0.93 as `/rubber-duck`. The deck labels it `GA · 2026-06-02`, but the reviewer lane and environment approvals remain the gates.
- The Azure Functions skills repository supports product-specific guidance improving task help. Do not say it makes guidance consistent regardless of model.
- Squad v1.0.0 and v1.0.1 release tags exist and ship through GitHub Releases, winget (`bradygaster.Squad`), and Homebrew. The pinned reference docs at `93aec83` still carry an Experimental/alpha banner, so docs may lag releases. On October 5, npm's `latest` tag for `@bradygaster/squad-cli` was still **0.13.1**, so `npm install -g` doesn't give you 1.0 yet.
- The September 25 Microsoft post ["Introducing the new Copilot"](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/) covers Microsoft 365 Copilot. It is separate from GitHub Copilot. At most, mention it as ecosystem context.
- The Azure MCP dates label documentation. The [overview](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/overview) and [cloud-agent guide](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/how-to/github-copilot-cloud-agent) have `ms.date` 2026-06-02; the guide's update metadata is 2026-07-17. The [documentation landing page](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/) has `ms.date` 2026-09-14. These dates do not establish a product launch.
- [Auto model selection](https://github.blog/changelog/2026-07-01-copilot-cli-auto-model-selection-routes-based-on-task/) was announced July 1. It honors admin model policies and gives paid subscribers a 10% discount. Legacy annual Copilot Pro/Pro+ plans keep premium-request billing until expiry; the discount applies to the model multiplier.

## Copilot CLI over the year

| Date | Change | Status | Source |
| --- | --- | --- | --- |
| 2025-09-25 | Copilot CLI launches | Public preview | [Changelog](https://github.blog/changelog/2025-09-25-github-copilot-cli-is-now-in-public-preview/) |
| 2025-10-28 | Custom agents and `/delegate` to the cloud coding agent, which opens a draft PR | Shipped | [Changelog](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/) |
| 2026-01-21 | Plan mode, `/review`, `/context`, background delegation | Shipped | [Changelog](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/) |
| 2026-02-25 | General availability | GA | [Changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| 2026-04-01 | `/fleet` for parallel sub-agent work | Shipped | [Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) |
| 2026-05-06 | Enterprise-managed plugins | Public preview | [Changelog](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/) |
| 2026-06-02 | `/rubber-duck` critic and voice input (GA); prompt scheduling (experimental) | Mixed | [Changelog](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) |
| 2026-07-01 | `/limits` and `--max-ai-credits` session caps, which are soft caps | Public preview | [Changelog](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) |
| 2026-09-22 → 10-04 | 1.0.88-1.0.92: `/fork`, per-agent reasoning effort, `--mcp-github-auth`, `copilot sandbox ca`, `copilot config`, steering a running background agent | Releases and prereleases | [Releases](https://github.com/github/copilot-cli/releases) |

## Agents, skills, and MCP

| Date | Change | Status | Source |
| --- | --- | --- | --- |
| 2025-08-28 | Coding agent reads `AGENTS.md` | Shipped | [Changelog](https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/) |
| 2025-09-16 | GitHub MCP Registry | Launched | [Changelog](https://github.blog/changelog/2025-09-16-github-mcp-registry-the-fastest-way-to-discover-ai-tools/) |
| 2025-10-28 | Custom agents in `.github/agents` with tool and MCP scoping per profile | Shipped | [Changelog](https://github.blog/changelog/2025-10-28-custom-agents-for-github-copilot/) |
| 2025-10-28 | Mission Control for assigning, steering, and tracking cloud-agent tasks | Shipped | [Changelog](https://github.blog/changelog/2025-10-28-a-mission-control-to-assign-steer-and-track-copilot-coding-agent-tasks/) |
| 2026-03-24 | Ask `@copilot` for changes on any pull request | Shipped | [Changelog](https://github.blog/changelog/2026-03-24-ask-copilot-to-make-changes-to-any-pull-request/) |
| 2026-04-03 | Organization firewall settings for the cloud agent | Shipped | [Changelog](https://github.blog/changelog/2026-04-03-organization-firewall-settings-for-copilot-cloud-agent/) |
| 2026-05-14 | GitHub Copilot app (agent-native desktop) | Technical preview | [Changelog](https://github.blog/changelog/2026-05-14-github-copilot-app-is-now-available-in-technical-preview/) |

## Squad, 0.11 to 1.0

| Version | Date | Highlights | Source |
| --- | --- | --- | --- |
| 0.11.0 | 2026-06-30 | `squad preset install`; `squad registry` for discovery-only cross-squad peers; the `cast` command replaces `hire`; Copilot App sub-sessions; memory tools through the `squad_state` MCP server; better Fact Checker scaffolding; bundled skills moved to `.github/skills/` | [Release](https://github.com/bradygaster/squad/releases/tag/v0.11.0) |
| 0.12.0 | 2026-08-13 | GitHub Agentic Workflows: `/squad research`, `/squad plan` (scope/impl/activate), `/squad cast`, `/squad implement`; standalone `squad.exe` with winget/Homebrew packaging; `squad models refresh`; a dispatch-enforcement governance layer | [Release](https://github.com/bradygaster/squad/releases/tag/v0.12.0) |
| 0.13.0 | 2026-08-26 | Health-readiness diagnostics; an advisory Squad reviewer in generated workflows; a generated **Team Capabilities** block in `squad.agent.md`; safer `squad nap` archival; first standalone binary assets | [Release](https://github.com/bradygaster/squad/releases/tag/v0.13.0) |
| 0.13.1 | 2026-08-26 | Fix: state tools persist the casting policy, registry, and history | [Release](https://github.com/bradygaster/squad/releases/tag/v0.13.1) |
| 1.0.0 | 2026-10-03 | Release tag exists; the session treats 1.0.x as the installed release. Pinned docs at `93aec83` may still carry Experimental/alpha wording. | [Release](https://github.com/bradygaster/squad/releases/tag/v1.0.0) |
| 1.0.1 | 2026-10-04 | Health diagnostics accept casting persistent names; the installer fails closed on checksum problems | [Release](https://github.com/bradygaster/squad/releases/tag/v1.0.1) |

### Where the news shows up in this session

| News | Where you'll see it |
| --- | --- |
| Auto model selection and Project HydraFusion | Leading `s04-news` context with status/cost qualifications; stage model stays pinned for eval parity |
| CLI GA, Plan mode, custom agents | C2 Plan mode, C3 `/agent squad`, then the native `terraform-coder`, `terraform-validator`, and `terraform-reviewer` profiles |
| Skills and MCP | C4: the `qualify-agent-setup` skill, Microsoft Learn MCP, and Terraform MCP lookups |
| `/review`, `/rubber-duck`, `/diff` | C5 and C7 |
| AI Credits, `/usage`, `/limits` | C6 and the appendix |
| Squad 1.0, setup diagnostics, decisions, Scribe | C3 and C6 |
| ACA Sandboxes GA | Corrected native host/MicroVM receipt PASS, independent acceptance complete; runtime-ready after acceptance, stage after human preflight/rehearsal; separate hosted Apps/Jobs E2E required |
| Computer use, Agent HQ, Copilot app, Squad Agentic Workflows | Mentioned only. None of these is part of the planned live Terraform workflow |
