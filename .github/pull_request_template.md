## Scope and ownership

- Requested behavior and explicitly owned files:
- Baseline revision and changed-file list:
- Author and separate reviewer (actual people/tasks, not just configured roles):

## Evidence

- [ ] Followed [CONTRIBUTING.md](../CONTRIBUTING.md) and the public boundary.
- [ ] Agent setup check and negative tests: commands, versions, exits, outcomes attached.
- [ ] Terraform checks attached, or not applicable with a reason; existing mocks,
      expected failures, locks, and lifecycle guards were not weakened.
- [ ] Native selection/execution is identified if observed; static readiness is
      not reported as a running agent, hook, hosted CI result, or Azure success.
- [ ] Reviewer inspected the exact diff and any instruction/tool-grant changes.

## Human release gates

- [ ] Maintainer reviewed exact staged paths/content for credentials, real inputs,
      private histories, local configuration, and unreviewed media.
- [ ] Module copy/revision/manifest synchronization completed if this is a release;
      otherwise it is explicitly pending.
- [ ] Workflow/publication approval remains with the authorized maintainer.
- [ ] No Azure apply or cleanup authorization is inferred from this PR.

Remaining failures, blocked checks, or follow-up approvals:
