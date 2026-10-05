---
name: "qualify-agent-setup"
description: "Qualify changes to this repository's native Terraform agents, instructions, skill, MCP grounding, validator lane, or mirrored setup. Use for agent readiness and drift checks; not Azure deployment or a substitute for Terraform qualification."
---

# Qualify the native coding setup

Read [CONTRIBUTING.md](../../../CONTRIBUTING.md) and inspect
[check.mjs](check.mjs) and [check.test.mjs](check.test.mjs) before suggesting
execution. This skill grants no tools and pre-approves no commands.

1. Confirm the public module or session root, the assigned file scope, and a
   separate reviewer. Do not use a private coordinator workspace.
2. Use the right lane:
   - `terraform-coder` can edit but cannot execute commands.
   - `terraform-validator` has no `edit` tool, but its shell can still write
     files; the command list is enforced only by its instructions and native
     approval prompts. It must stop on failure instead of repairing files.
   - `terraform-reviewer` is read-only and cannot execute commands.
3. Have the operator or validator run the commands below from the repository root:

   ```powershell
   node .github\skills\qualify-agent-setup\check.mjs
   node --test .github\skills\qualify-agent-setup\check.test.mjs
   ```

4. If both module copies are present, run the checker from the session root with
   `--mirror` and the actual independent checkout path. Require matching source
   inventories and bytes. Do not synchronize or publish silently. Release-manifest
   refresh remains a maintainer action.
5. Inspect each real exit and test assertion. A missing profile/link, broadened
   tool list, missing manual-only validator setting, unauthorized MCP server, violation of hosted-first MCP policy, unpinned or
   `latest` Terraform MCP Docker image, missing digest, forbidden Docker args,
   MCP `env`/secret entry, private
   source path, or drift must fail. Preserve failures; fix their cause instead of
   relaxing the checker. Disposable negative-test files stay under the ignored
   `.agentic-checks` directory in the project.
6. For Terraform changes, additionally follow the module/caller READMEs'
   existing isolated qualification. Do not edit runtime/tests merely to test this
   setup, install tools without approval, run Azure, or rebuild the deck.
7. Report command, version, actual exit, outcome, and limitation. Keep raw
   private evidence out of source. Static readiness is not native selection,
   runtime tool-filter verification, an active hook, independent acceptance,
   hosted CI, or successful deployment.

To verify activation later, the operator inspects `/agent`, `/instructions`, and
`/mcp` in the same native window, restarts there only if discovery is stale,
selects the intended profile, and records a genuine bounded task. Never automate
trust or approval prompts, and never describe these instructions as an executed
run.
