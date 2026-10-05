# Repository coding boundary

Read [AGENTS.md](../AGENTS.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) before
editing. They define the public boundary, three-lane native agent flow, operator
prompts, separate review, and human publication/deployment gates.

Use the [scoped Terraform rules](instructions/terraform.instructions.md) for HCL
and examples. Agree a bounded change and one file owner; preserve unrelated work
and report actual results rather than intentions.

The native coder/reviewer profiles do not run commands. The native validator has
no `edit` tool, but its shell can still write files; the command list is
enforced only by its instructions and native approval prompts. Do not infer
their tool filters for a default Copilot session, Squad, or a general-purpose
task. MCP grounding in coder/reviewer is read-only public
documentation lookup only and must not receive private inputs. Keep native
permission prompts and never copy private environment or coordinator state into
public source. Repository instructions are guidance, not a sandbox.
