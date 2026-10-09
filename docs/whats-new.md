# What's new: GitHub Copilot and Squad, October 2025 to October 2026

Reviewed October 5, 2026, for the October 14 session; updated October 9 for deck 0.22.2, the short companion deck, the bootstrap guide, and qualified ACA Sandboxes context. Auto/HydraFusion remain the leading news. C0-C7 remain live demo chapters with optional fallback evidence. Every row links to a primary source. Statuses change quickly, so recheck them before you quote one on stage. This page explains context only. It doesn't claim that any feature was completed live. The AKS Azure claim is limited to the separate sanitized IaC validation of the Terraform module. ACA evidence is Management-side execution, not a validated Corp deployment.

## Key updates

| # | Date | News | Status | Why a Terraform or platform engineer cares |
| --- | --- | --- | --- | --- |
| 1 | 2026-07-01 | [Auto model selection](https://github.blog/changelog/2026-07-01-copilot-cli-auto-model-selection-routes-based-on-task/) | Announced | Routes per task using health and utilization signals, honors admin model policies, and gives paid subscribers a 10% AI-credit discount. Switch with `/model`; keep the stage model pinned for eval parity |
| 2 | 2026-09-04 | [Project HydraFusion](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/) | Research preview | Select it like a model; it chooses Single, Cascade, or Critique. Published figures are offline benchmarks and estimated cost, not measured savings from this demo |
| 3 | 2026-02-25 | [Copilot CLI is generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), with Plan mode, autopilot, built-in Explore/Task/Code Review agents, custom agents, skills, hooks, and plugins | GA | The terminal surface this session uses is a supported product, not a preview |
| 4 | 2025-10-28 / 2026-02-04 | [Agent HQ and Mission Control](https://github.blog/news-insights/company-news/welcome-home-agents/), then [Claude and Codex in Agent HQ](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/) | Third-party agents in public preview | One GitHub control plane for agent work, whichever vendor's agent does it |
| 5 | 2026-06-01 | [Usage-based billing with GitHub AI Credits](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) | Effective | Long agent runs now cost credits directly, which is why `/limits`, `--max-ai-credits`, and bounded tasks matter |
| 6 | 2025-12-18 / 2026-07-29 | [Agent Skills](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/), then [skills and MCP in Copilot code review](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/) | Code-review support GA | Write a Terraform procedure once in `SKILL.md`, then reuse it when authoring and when reviewing |
| 7 | 2026-10-01 | [Computer use in Copilot CLI and the Copilot app](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/) | Public preview, macOS and Windows | Agents can operate GUI-only tools that have no API, CLI, or MCP integration. You approve each app, and admins can disable the feature |
| 8 | 2026-10-03 / 2026-10-04 | [Squad 1.0.0](https://github.com/bradygaster/squad/releases/tag/v1.0.0) and [1.0.1](https://github.com/bradygaster/squad/releases/tag/v1.0.1) | Release tags exist; docs may lag | The demo uses 1.0.1, while pinned docs at `93aec83` still carry Experimental/alpha wording |
| 9 | 2026-06 / 2026-09 | [Azure Container Apps Sandboxes overview](https://learn.microsoft.com/azure/container-apps/sandboxes-overview) and [Azure Updates 561262](https://azure.microsoft.com/updates?id=561262) | June preview, September GA | Official Copilot CLI plugin for cloud microVM execution with configurable egress. Our deny-by-default example is a conditional C4 variant, gated on approved Corp IaC, policy read-back, and validated preflight |

### Precision notes for speakers

- Auto and HydraFusion remain the leading news. The stage pins `claude-sonnet-5` for eval parity. HydraFusion's published offline benchmarks compare estimated cost with Opus 5: TerminalBench 2.1 +4.9 at 67% lower cost, DeepSWE -1.5 at 36% lower, and CheckpointBench -0.1 at 65% lower. Don't turn these into guarantees or measured savings from this run.
- ACA GA is not Corp acceptance. The observed group is under Management > Platform; `aca doctor` passed 9/9 and the sandbox inventory was empty at read-back. Earlier runs passed 10 root negative-validation checks, not the session's 52 child-module plus two caller cases. Boolean output fields are not numeric process exits, and a 403 alone does not establish egress or Azure Policy enforcement. Use [the gated C4 procedure](aca-sandboxes.md), or keep the original MCP demo. The plugin's disabled installation state was a local observation, not a universal default.
- Local sandboxing is separate. `/sandbox` is off by default and uses host process isolation, not an ACA microVM. Windows needs a supported recent Windows 11 build and [update prerequisites](https://aka.ms/ghcp-sandbox-os-support). Windows proxy/host rules require supported features, Allow local network, and apps honoring proxy settings; in-process file tools honor policy best-effort, and remote MCP servers are not sandboxed. [GitHub documentation](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes).
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
| ACA Sandboxes GA | Additional news context and a conditional C4 substitution in [aca-sandboxes.md](aca-sandboxes.md), only after Corp qualification; otherwise original MCP flow or labeled Management-side evidence |
| Computer use, Agent HQ, Copilot app, Squad Agentic Workflows | Mentioned only. None of these is part of the planned live Terraform workflow |
