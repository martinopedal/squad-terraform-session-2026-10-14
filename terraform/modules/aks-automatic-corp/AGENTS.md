# Public Terraform module workspace

Read [README.md](README.md) for the resource contract and
[CONTRIBUTING.md](CONTRIBUTING.md) for checks, permissions, and human gates.

## Native coding, validation, and review

- [terraform-coder](.github/agents/terraform-coder.agent.md) can read, search,
  edit an explicitly agreed set of public files, and use only configured
  read-only MCP documentation lookups.
- [terraform-validator](.github/agents/terraform-validator.agent.md) can read,
  search, and execute. It has no `edit` tool, but its shell can still write
  files; the command list is enforced only by its instructions and native
  approval prompts. It is manual selection only and stops on failure.
- [terraform-reviewer](.github/agents/terraform-reviewer.agent.md) can read,
  search, and use only configured read-only MCP documentation lookups. Use a
  separate review context; the author cannot approve itself.
- All three follow [Terraform instructions](.github/instructions/terraform.instructions.md)
  and the [qualification skill](.github/skills/qualify-agent-setup/SKILL.md).
- MCP policy is hosted first. Microsoft Learn is cloud-hosted; HashiCorp has no
  documented hosted Terraform MCP, so Terraform MCP uses Docker. Docker Desktop
  must be running and the pinned image reference must be pre-pulled:
  `docker pull hashicorp/terraform-mcp-server:1.3.0@sha256:423a6b8e2ee06affcf090892f40c86469caba45fd2448ffa8ca5d717a174f7d5`. Copilot CLI and Copilot cloud agent honor
  `mcp-servers`; VS Code ignores that frontmatter. Keep native permission
  prompts. The native Terraform MCP binary is not used for this demo.

## Boundaries

Give each file one writer; agree acceptance criteria before edits. Back up an
existing deliverable privately before replacing it and preserve unrelated work.
Keep providers, backend, authentication, and real environment inputs in a separate
private consumer. Never read or copy credentials, local MCP configuration, state,
saved plans, private histories, or raw session/capture evidence. Never send
private inputs to an MCP server.

Do not weaken tests, rewrite locks, bypass validation, remove lifecycle guards, or
change platform ownership to obtain a green result. Code review, publication,
and deployment are separate human approvals. No Azure apply or cleanup is
authorized by a coding request.

Instructions and ignore rules are not a sandbox. Tool filters do not restrict
filesystem paths, and configured profiles do not prove native selection or
execution. This independent module needs no Squad installation or private team
state. The session repository wires the same profiles into its existing Squad
handoff without replacing that coordinator.
