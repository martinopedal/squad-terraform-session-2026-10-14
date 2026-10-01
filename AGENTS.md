# Public demo workspace

This repository contains a public Reveal presentation, two-speaker material, recording tools, and generic Terraform source. Keep it reusable and free of environment-specific data.

## Working rules

- Read `QUALITY.md` and `PUBLICATION.md` before changing code or public evidence.
- Use native Copilot CLI Plan mode when agreeing a nontrivial change. Show facts, assumptions, affected files, ownership, and checks before implementation.
- Squad roles and routing are in `.squad\`. Use real tasks for delegated work; do not simulate specialist results.
- Give each changed file one owner. Separate research or test files can be worked on independently.
- Build and validate the source first. The user approved a genuine clean recorded run afterward; disclose its checkpoint and distinguish inherited code, qualification work, and new recorded work.
- Keep providers/backends/authentication in root consumers, not the reusable child module.
- Real Azure inputs, credentials, state, policy snapshots, and unreviewed recordings must not enter this repository.
- Do not copy deployment workflows or imports from an existing estate.
- Validate the exact artifact, report failures plainly, and do not claim a mock or planned action was executed on Azure.
- Back up a deliverable before replacing its current version.

## Start the native planning experience

From this repository, start the CLI with:

```powershell
copilot --agent squad --plan
```

Review the active instructions and permissions. Approve a bounded plan before leaving Plan mode. Do not combine this example with automatic plan approval or blanket tool permissions.
