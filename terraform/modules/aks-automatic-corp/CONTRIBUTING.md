# Contributing with native Copilot agents

## Select the right root and profile

Read [AGENTS.md](AGENTS.md) and the repository README first. The module is the
current directory in its independent repository, or
`terraform\modules\aks-automatic-corp` in the session repository. Do not work from
a private coordinator root or copy its configuration here.

These discoverable profiles are deliberately small:

| Profile | Explicit tools | Work |
| --- | --- | --- |
| [terraform-coder](.github/agents/terraform-coder.agent.md) | `read`, `search`, `edit`, selected read-only MCP docs tools | Implement an agreed public Terraform/test/documentation change |
| [terraform-validator](.github/agents/terraform-validator.agent.md) | `read`, `search`, `execute` | Run only the approved offline qualification commands and report exact results |
| [terraform-reviewer](.github/agents/terraform-reviewer.agent.md) | `read`, `search`, selected read-only MCP docs tools | Independently inspect the exact changed files and operator-supplied diff/results |

In the existing native CLI window, confirm `/cwd`, inspect `/agent`, and select
the profile needed for the current lane. Inspect `/instructions`, `/mcp`, and the
actual available tools. If new files or MCP servers are not discovered, restart
Copilot in that same window and inspect again. No installation, new terminal,
`/init`, or Squad reinitialization is needed. Do not automatically approve trust,
tools, commands, or plans.

The normal lane is:

1. Squad lead or maintainer scopes the public change, preserved invariants, file owners, and
   checks.
2. `/agent terraform-coder` edits only the approved files.
3. `/agent terraform-validator` runs the offline checks under native permission
   prompts, one approved command at a time, and stops on failure.
4. `/new`, then `/agent terraform-reviewer`, reviews in a separate context with
   the exact diff, changed-file list, source revision, and sanitized validator
   results.
5. `/agent squad` receives the handoff; the human maintainer accepts or rejects
   the actual artifact.

A useful coder brief:

```text
Implement only the approved contract regression in the named test file and its
README explanation. Read AGENTS.md and the scoped instructions. Preserve the
existing provider mocks, plan-mode runs, locks, and runtime resource contract.
Return changed paths, the intended failing assertion, and the validator's exact
checks. No shell, Azure, publication, or unrelated edits.
```

For independent review, save the bounded public handoff, use `/new` in the same
window, then `/agent terraform-reviewer`. A profile switch inside the author's
existing context alone is not independent review. The human maintainer accepts or
rejects the change after reviewing the actual artifact.

In the session repository, Squad remains the coordinator: lead owns scope and
reviewer owns review acceptance. Use its existing `.squad\routing.md` handoff.
Squad's general-purpose tasks do **not** inherit these profiles' tool filters
just because a charter links to them. The operator selects the native profiles
explicitly, records the observed selection/results, then returns to `/agent squad`
for coordination. No new Squad member or orchestration framework is installed.

## MCP documentation prerequisites and policy

`terraform-coder` and `terraform-reviewer` include two read-only MCP grounding
servers. The validator has no MCP servers. MCP policy is hosted first: use a
cloud-hosted MCP server where one exists, and use Docker only where no documented
hosted option exists.

- `microsoft-learn` is cloud-hosted at `https://learn.microsoft.com/api/mcp` and
  exposes only `microsoft_docs_search` and `microsoft_docs_fetch`.
- HashiCorp has no documented hosted Terraform MCP. The `terraform` server uses
  Docker stdio with the pinned reference `hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5` and exposes only public
  Terraform Registry provider/module documentation tools.
- Docker Desktop must be running. Pre-flight the exact image reference with:

  ```powershell
  docker pull hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5
  ```

- The native `terraform-mcp-server` binary is not used for this demo. Do not
  configure TFE tokens, environment variables, secrets, private registry,
  workspace, or run-operation tools for these profiles.
- `mcp-servers` frontmatter is honored by Copilot CLI and Copilot cloud agent;
  VS Code custom agents ignore it. Keep CLI-only claims separate from VS Code.

MCP results are documentation lookups. Cite the source URL and server/version in
the handoff. Never send private inputs, credentials, state, plans, local MCP
configuration, or customer data to an MCP server.

## Run local checks as the validator

The coder and reviewer profiles have no execution tools. The validator may run
only the commands explicitly listed in its profile and this section, with native
permission prompts preserved. The [qualify-agent-setup skill](.github/skills/qualify-agent-setup/SKILL.md)
grants no tools and pre-approves no commands. Missing tools or dependencies mean
**blocked**, not passed. If a filtered profile cannot invoke the skill tool, read
the linked `SKILL.md` as guidance instead; do not broaden that profile's tools.

With an existing Node.js 22+ runtime and Git, run from the repository root:

```powershell
node .github\skills\qualify-agent-setup\check.mjs
node --test .github\skills\qualify-agent-setup\check.test.mjs
```

The checker validates the three profiles' strict YAML subset, canonical tool
allowlists, manual-only validator setting, hosted-first MCP policy, pinned Terraform Docker image and arguments,
instruction/skill links, public path exclusions, and session-root placement. The
session check also qualifies the nested module and compares the shared agent
files. Tests mutate disposable copies under `.agentic-checks` inside this
checkout and clean them up; they never mutate the real Terraform tests.

To compare an independently checked-out module with the session copy, run from
the session root, substituting the actual reviewed peer path:

```powershell
node .github\skills\qualify-agent-setup\check.mjs --mirror ..\module-public
```

This compares the complete Git-selected module source inventories and exact file
bytes, including nonignored new files. It does not regenerate the release
manifest, stage files, run workflows, or establish a published revision.
Git-selected means tracked plus nonignored untracked paths: it is not a staged
release allowlist. Ignored local files are not inspected. A filename denylist is
not credential/content scanning or a security audit. The session repository
already publishes a generic root `handoff.md`; that specific filename is allowed
there, not in the module or nested directories. Its contents still require human
review; a private coordinator handoff must never replace it.

For a Terraform change, also run the existing module and caller qualification
from the module README and `examples\corp-existing\README.md`: formatting,
backend-disabled initialization with readonly locks, validation, lint, and
mocked plan-mode tests with the explicit example var-file. First review provider
isolation in a clean, uncredentialed, network-restricted environment. Never
replace mocked tests with an ordinary plan/apply against fixture IDs. No
Terraform/deck rebuild is needed for agent-configuration-only changes.

Record commands, versions, actual exits, intended negative failures, and one of
**pass**, **fail**, **blocked**, or **not applicable** with a reason. The checker
is static readiness, not the native CLI parser, agent execution, an installed
hook, hosted CI success, or Azure acceptance.

## Human review, publication, and deployment

- Back up replaced files privately; inspect the diff and preserve unrelated work.
- Request a separate reviewer. Do not change tests, expected failures, locks,
  lint suppressions, resource addresses, or lifecycle guards merely to pass.
- A maintainer reviews the exact staged paths/diff, including agent prompts,
  instructions, skills, MCP configuration, and scripts, for public safety. No
  owner permissions, branch protections, required reviewers, or hooks are
  installed by these files.
- Publish the independent module first; then verify its revision/tree, mirror
  the source, and refresh the session's source manifest through its separate
  release process. Do not present the old manifest as binding new uncommitted
  files. Workflows and presentation evidence have their own owners and checks.
- Real inputs, credentials, backend/state, saved plans, private policy evidence,
  and local MCP/profile configuration stay outside public source and reports.
- Azure plan/apply, role/policy changes, and cleanup require a separate approved
  private consumer, confirmed target/budget/expiry/cleanup owner, verified
  platform prerequisites, and human approval of the exact saved plan.

The tool allowlist is a tool-availability filter, **not a sandbox**. In
particular, `edit` is not restricted to Terraform paths and `execute` is a shell;
read tools can expose sensitive reachable files. Follow the public boundary and
native permission prompts. The unchanged Squad coordinator has its own broader
tools. Neither Markdown nor `.gitignore` enforces deployment or publication
authorization.

## Configuration provenance and activation limit

Verified against the official
[custom-agent reference](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
on 2026-10-05: tool aliases include `execute`, `read`, `edit`, `search`,
`agent`, `web`, and `todo`; MCP tools are referenced as `server/tool`;
`mcp-servers` is not used by VS Code custom agents; and
`disable-model-invocation: true` makes a profile manual selection only for
Copilot cloud agent.

There is no shell grant for coder/reviewer, no validator edit grant, no TFE
token, no Azure login, no native Terraform MCP binary dependency, no hook, no
model pin, and no approval bypass. These files
are configured behavior; a later human-operated native selection and genuine task
result are still needed before claiming the profiles ran.

