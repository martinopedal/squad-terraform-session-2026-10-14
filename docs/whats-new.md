# What's new: GitHub Copilot and Squad, October 2025 to October 2026

Reviewed October 5, 2026, for the October 14 session; updated October 8 for deck 0.21.1 status badges and the untimed legal/futures notice. C0-C7 remain live demo chapters with optional fallback evidence. Every row links to a primary source. Statuses change quickly, so recheck them before you quote one on stage. This page explains context only. It doesn't claim that any feature was completed live. The Azure claim is limited to the separate sanitized IaC validation of the Terraform module.

## The short version

| # | Date | News | Status | Why a Terraform or platform engineer cares |
| --- | --- | --- | --- | --- |
| 1 | 2026-02-25 | [Copilot CLI is generally available](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/), with Plan mode, autopilot, built-in Explore/Task/Code Review agents, custom agents, skills, hooks, and plugins | GA | The terminal surface this session uses is a supported product, not a preview |
| 2 | 2025-10-28 / 2026-02-04 | [Agent HQ and Mission Control](https://github.blog/news-insights/company-news/welcome-home-agents/), then [Claude and Codex in Agent HQ](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/) | Third-party agents in public preview | One GitHub control plane for agent work, whichever vendor's agent does it |
| 3 | 2026-06-01 | [Usage-based billing with GitHub AI Credits](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) | Effective | Long agent runs now cost credits directly, which is why `/limits`, `--max-ai-credits`, and bounded tasks matter |
| 4 | 2025-12-18 / 2026-07-29 | [Agent Skills](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/), then [skills and MCP in Copilot code review](https://github.blog/changelog/2026-07-29-copilot-code-review-agent-skills-and-mcp-now-generally-available/) | Code-review support GA | Write a Terraform procedure once in `SKILL.md`, then reuse it when authoring and when reviewing |
| 5 | 2026-08-11 / 2026-09-14 | [Azure MCP Server cloud-agent guide](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/how-to/github-copilot-cloud-agent) and [Learn landing page](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/) | Learn docs | First-party Microsoft Learn pages now document the GitHub Copilot cloud-agent path and the Azure MCP Server landing page |
| 6 | 2026-10-01 | [Computer use in Copilot CLI and the Copilot app](https://github.blog/changelog/2026-10-01-github-copilot-can-now-interact-with-desktop-apps/) | Public preview, macOS and Windows | Agents can operate GUI-only tools that have no API, CLI, or MCP integration. You approve each app, and admins can disable the feature |
| 7 | 2026-10-03 / 2026-10-04 | [Squad 1.0.0](https://github.com/bradygaster/squad/releases/tag/v1.0.0) and [1.0.1](https://github.com/bradygaster/squad/releases/tag/v1.0.1) | Release tags exist; docs may lag | The demo uses 1.0.1, while pinned docs at `93aec83` still carry Experimental/alpha wording |

### Precision notes for speakers

- **Computer use is a public preview.** It isn't part of this Terraform demo. Toggle it with `/computer on`, `/computer show`, and `/computer off`. Each desktop app needs its own approval, and enterprise policy can turn the feature off. [Docs](https://docs.github.com/en/copilot/concepts/agents/computer-use).
- **Custom agents (`.agent.md`) status is per surface; recheck before stage.** CLI custom agents are included in [Copilot CLI GA](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/). JetBrains status has conflicting GitHub sources: the [custom-agents reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration) lists JetBrains IDEs in public preview, while the [2026-03-11 JetBrains changelog](https://github.blog/changelog/2026-03-11-major-agentic-capabilities-improvements-in-github-copilot-for-jetbrains-ides/) says major agentic capabilities are generally available. For VS Code, the reference says `mcp-servers` frontmatter is ignored there. Don't say "GA everywhere".
- **Rubber Duck is a second-opinion input, not an approval gate.** The June 2, 2026 Copilot CLI changelog says Rubber Duck is GA, and the command is available in the locally validated CLI 1.0.93 as `/rubber-duck`. The deck labels it `GA · 2026-06-02`, but the reviewer lane and environment approvals remain the gates.
- **Skills wording is deliberately weak.** The Azure Functions skills repository supports product-specific guidance improving task help. Do not say it makes guidance consistent regardless of model.
- **Squad 1.0 distribution/docs:** v1.0.0 and v1.0.1 release tags exist and ship through GitHub Releases, winget (`bradygaster.Squad`), and Homebrew. The pinned reference docs at `93aec83` still carry an Experimental/alpha banner, so docs may lag releases. On October 5, npm's `latest` tag for `@bradygaster/squad-cli` was still **0.13.1**, so `npm install -g` doesn't give you 1.0 yet.
- **The September 25 Microsoft post** ["Introducing the new Copilot"](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/) is about Microsoft 365 Copilot, not GitHub Copilot. At most, mention it as ecosystem context.

## Copilot CLI over the year

| Date | Change | Status | Source |
| --- | --- | --- | --- |
| 2025-09-25 | Copilot CLI launches | Public preview | [Changelog](https://github.blog/changelog/2025-09-25-github-copilot-cli-is-now-in-public-preview/) |
| 2025-10-28 | Custom agents and `/delegate` to the cloud coding agent, which opens a draft PR | Shipped | [Changelog](https://github.blog/changelog/2025-10-28-github-copilot-cli-use-custom-agents-and-delegate-to-copilot-coding-agent/) |
| 2026-01-21 | Plan mode, `/review`, `/context`, background delegation | Shipped | [Changelog](https://github.blog/changelog/2026-01-21-github-copilot-cli-plan-before-you-build-steer-as-you-go/) |
| 2026-02-25 | General availability | GA | [Changelog](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/) |
| 2026-04 | `/fleet` for parallel sub-agent work | Shipped | [Blog](https://github.blog/ai-and-ml/github-copilot/run-multiple-agents-at-once-with-fleet-in-copilot-cli/) |
| 2026-05-06 | Enterprise-managed plugins | Public preview | [Changelog](https://github.blog/changelog/2026-05-06-enterprise-managed-plugins-in-github-copilot-cli-are-now-in-public-preview/) |
| 2026-06-02 | `/rubber-duck` critic and voice input (GA); prompt scheduling (experimental) | Mixed | [Changelog](https://github.blog/changelog/2026-06-02-copilot-cli-improved-ui-rubber-duck-prompt-scheduling-and-voice-input/) |
| 2026-07-01 | `/limits` and `--max-ai-credits` session caps, which are soft caps | Public preview | [Changelog](https://github.blog/changelog/2026-07-01-set-ai-credit-session-limits-in-copilot-cli-and-sdk/) |
| 2026-09-22 → 10-04 | 1.0.88–1.0.92: `/fork`, per-agent reasoning effort, `--mcp-github-auth`, `copilot sandbox ca`, `copilot config`, steering a running background agent | Releases and prereleases | [Releases](https://github.com/github/copilot-cli/releases) |

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
| CLI GA, Plan mode, custom agents | C2 Plan mode, C3 `/agent squad`, then the native `terraform-coder`, `terraform-validator`, and `terraform-reviewer` profiles |
| Skills and MCP | C4: the `qualify-agent-setup` skill, Microsoft Learn MCP, and Terraform MCP lookups |
| `/review`, `/rubber-duck`, `/diff` | C5 and C7 |
| AI Credits, `/usage`, `/limits` | C6 and the appendix |
| Squad 1.0, setup diagnostics, decisions, Scribe | C3 and C6 |
| Computer use, Agent HQ, Copilot app, Squad Agentic Workflows | Mentioned only. None of these is part of the planned live Terraform workflow |
