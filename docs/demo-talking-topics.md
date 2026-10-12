# Demo cue sheet: C0-C7 and the consumer reveal

Glance sheet for use DURING the live demo. Source of truth: [talk-track.md](talk-track.md). Cross-checked with [demo-runbook.md](demo-runbook.md) and [talking-points.md](talking-points.md). If they differ, the track wins.

**Clock:** C0-C7 = 29 min. Content ends 55:00. Slack 55:00-58:00 (recovery only). Close 58:00.
**Checkpoints:** C0 done 08:30. C2 done 21:30. C5 done 38:30. s20 starts 50:00.
**Rule:** cut at the cut line. No second live attempt. Name what failed, show fallback, move on.

## Jump to

[Overview](#overview) | [Mine vs Martin's](#mine-vs-martins) | [C0](#c0-zero-to-a-squad-0530-0830) | [C1](#c1-same-task-fixed-inputs-1230-1530) | [C2](#c2-pin-the-brief-and-approve-a-plan-1730-2130) | [C3](#c3-assign-one-writer-2200-2600) | [C4](#c4-ground-the-work-2930-3330) | [C5](#c5-catch-and-repair-3330-3830) | [C6](#c6-resume-with-decisions-4200-4500) | [C7](#c7-reviewed-diff-4700-5000) | [s20](#s20-consumer-5000-5300) | [Optional ACA](#optional-squad-on-aca-5300-5430) | [Rules](#cross-cutting-rules)

## Overview

| Chapter | Window | Cut | Driver | Goal | If cut |
| --- | --- | --- | --- | --- | --- |
| C0 | 05:30-08:30 | 07:45 | Haflidi | Zero to a squad | Show fallback, go to s05 |
| C1 | 12:30-15:30 | 14:45 | Martin operates, Haflidi compares | Same task, compare one consequence | One C1-A point, saved C1-B excerpt |
| C2 | 17:30-21:30 | 20:30 | Martin | Plan mode, approve a plan | Saved approved plan |
| C3 | 22:00-26:00 | 25:00 | Martin | One writer, B1v2 brief | B1v2 eval excerpt |
| C4 | 29:30-33:30 | 32:30 | Martin | Skill plus source | Reviewed fallback, hand off 33:30 |
| C5 | 33:30-38:30 | 37:15 | Haflidi | Seed, fail, repair | Saved seeded-failure and repaired logs |
| C6 | 42:00-45:00 | 44:15 | Haflidi | Save decision, resume, cite | `c6-decision.md` plus screenshots |
| C7 | 47:00-50:00 | 49:15 | Haflidi (Martin names boundary) | Checks, diff, independent review | Saved green exits and diff |
| s20 | 50:00-53:00 | start by 50:00 | Martin | Online consumer reveal 50:30-51:00 | Screenshot plus two apply runs |
| Optional ACA | 53:00-54:30 | skip if it hits 55:00 | Martin, Haflidi | Unattended agent to PR | Show finished proof |

## Mine vs Martin's

- **Haflidi drives:** C0, C5, C6, C7.
- **Haflidi lines elsewhere:** s01, s03, s04, s05, s06, C1 compare, s08, s10, s12, s13, s15, s16, s18, s20 (51:00-52:10), s21, s22.
- **Martin drives:** C1 (operates), C2, C3, C4, s20.
- **Martin also:** s22 close, protected-slack clock, optional ACA lead, C7 boundary.

## C0: Zero to a squad (05:30-08:30)

**Haflidi** | **Cut 07:45** | Handoff 08:30

- [ ] (H) Path: install, init, hire, verify
- [ ] (H) `squad init` = shell command
- [ ] (H) `copilot --agent squad` = coordinator
- [ ] (H) Init Mode writes team only after confirm
- [ ] (M) Team reviewable in Git from minute one
- [ ] (M) Setup is not Terraform correctness

**If it stalls:** state stall, show fallback evidence, go to `s05-parallel`. No later time on installs.
**Do not claim:** setup proves Terraform correctness.
**Point at:** versions, `git status --short`, roster, `squad doctor`.

<details><summary>Show</summary>

- Git/Copilot/Squad absent, then WinGet installs, refresh `PATH`, versions
- `copilot`, `/login`, `/exit`
- Clone public module, `squad init`, `git status --short`
- `copilot --agent squad`, small team, confirm roster, `/exit`
- `squad doctor`
- Full block: C0 in the [runbook](demo-runbook.md)

</details>

### Lead-in: s05-parallel (08:30-10:30)

- [ ] (M) Coder: test file. Validator: fixed offline commands, exit codes. Reviewer: read-only final diff
- [ ] (H) Handoffs name file, check, next owner
- [ ] (H) Chats are not filesystem isolation. Worktrees do not isolate credentials

### Lead-in: s06-contract (10:30-12:30)

- [ ] (H) Module: resources, typed inputs, outputs, providers required
- [ ] (H) Consumer root: providers, backend, auth, state, env values
- [ ] (M) Corp path uses approved existing networking
- [ ] (H) A variable name is not the network contract

## C1: Same task, fixed inputs (12:30-15:30)

**Martin operates, Haflidi compares** | **Cut 14:45**

- [ ] (H) Compare one consequence, not verbosity
- [ ] (H) B1 failed: two asserts vs minimum of three
- [ ] (H) B1v2: clarified brief, four separate asserts, 5/5 re-measured
- [ ] (H) Measured checkpoint, not causal claim
- [ ] (H) Live run still has to pass

**If it stalls:** stop at one clear C1-A consequence, use saved C1-B excerpt.
**Do not claim:** B1v2 explains the live result. `/fork` is not a fresh comparison.
**Point at:** the one differing consequence (identical outcomes are valid).

<details><summary>Show</summary>

- `/new`, `/agent` Squad, `/model`, `/plan`, `/rename C1-A`
- Repeat as `C1-B`
- Prompt: plan only, `alternate_network_payload`, prepared CIDR/DNS values from the brief, keep private API, no edits or deploy

</details>

### Lead-in: s08-plan-boundary (15:30-17:30)

- [ ] (H) Generic module plus small consumer example
- [ ] (H) Consumer owns providers and backend
- [ ] (M) Existing deployments need migration review
- [ ] (M) No state moves, imports, or redesign authorized

## C2: Pin the brief and approve a plan (17:30-21:30)

**Martin** | **Cut 20:30** | Out by 21:30

- [ ] (M) Native Plan mode is the control
- [ ] (M) Approval = this code change only
- [ ] (M) Approval is not an Azure apply

**If it stalls:** use saved approved plan, say approval covers repo changes only.
**Do not claim:** approval covers Azure lookup, apply, dependency upgrade, or state ops.
**Point at:** mode indicator, revised plan, `/session plan`.

<details><summary>Show</summary>

- `/new`, `/rename guided-clean-run`, `/agent` Squad, `/instructions`, `/plan`
- Reference `main.tf`, `variables.tf`, `tests\contract.tftest.hcl`
- Keep eight inputs, six outputs, AzAPI intact
- Plan labeled mutation and repair
- Revise: `Put unchanged payload assertions and offline checks before documentation; exclude infrastructure redesign.`
- `/session plan`

</details>

### Lead-in: s10-tool-roles (21:30-22:00)

- [ ] (H) Instructions = persistent expectations
- [ ] (H) Skills = reusable procedure. MCP = source or tool
- [ ] (M) Rubber Duck (`/rubber-duck`) = input, not approval. Reviewer lane is the gate

## C3: Assign one writer (22:00-26:00)

**Martin** | **Cut 25:00**

- [ ] (M) Clarified brief states the oracle's rule
- [ ] (M) Assignment is not completion
- [ ] (M) Live change still needs checks

**If it stalls:** fallback B1v2 eval excerpt. No causal claim.
**Do not claim:** B1v2 5/5 guarantees this run.
**Point at:** diff touches only the test file. Four asserts, each with `error_message`.

<details><summary>Show</summary>

- `/agent` Squad, `/tasks`, `/agent list`, `/mcp`, `/agent terraform-coder`
- Paste B1v2 brief exactly
- Scope: `terraform\modules\aks-automatic-corp`, only `tests\contract.tftest.hcl`
- Reuse AzAPI mock, `command = plan`
- No deploy, provider, or lock-file change

</details>

### Lead-in: s12-source-check (26:00-26:30)

- [ ] (H) Follow the claim into the resource body
- [ ] (H) Citation plus assertion = something to inspect

### Lead-in: s13-test-gap (26:30-29:30)

- [ ] (H) B1: two asserts vs minimum of three
- [ ] (M) B1v2: 5/5, same pinned conditions, 61-114 s runs
- [ ] (M) Measured checkpoint, no guarantee
- [ ] (H) State checker rule first, then mutate, restore, rerun

## C4: Ground the work (29:30-33:30)

**Martin** | **Cut 32:30** | Hand off by 33:30

- [ ] (M) Skill changes the procedure
- [ ] (M) MCP lookup supplies a source
- [ ] (M) Human decides how it applies
- [ ] (M) Cite source and version

**If it stalls:** say live result is missing, show reviewed fallback with its actual scope. No retry. No slack.
**Do not claim:** (H) a 403 alone proves egress or Azure Policy enforcement. Saved runs are Management-side evidence, not Corp validation. A 90-second agent turn (fresh runs about 2:58 and 1:47).
**Point at:** cited source/version, `/permissions`.

<details><summary>Show</summary>

- `/skills info test-discipline`, `/mcp`
- Ask: test-discipline, unchanged assertions, read-only Microsoft Learn source for AKS Automatic private/custom network
- No Azure account, provider, or write access
- `/permissions`
- Conditional ACA variant only after approved Corp IaC, policy read-back, prepared-sandbox preflight. Else base flow. Timing: [runbook C4](demo-runbook.md#c4-invoke-guidance-and-a-source--2930-3330--4-minutes)

</details>

## C5: Catch and repair (33:30-38:30)

**Haflidi** (Martin explains repair, per runbook) | **Cut 37:15** | Out by 38:30

- [ ] (H) Preserve cause and effect
- [ ] (H) Deliberate lab mutation, not an AI-discovered defect
- [ ] (H) Runtime check = evidence for the assertion it runs
- [ ] (H) Not Azure acceptance evidence

**If it stalls:** stop live mutation, show saved seeded-failure and repaired logs.
**Do not claim:** AI found the defect.
**Point at:** three phase logs and exit codes, `/diff`.

<details><summary>Show</summary>

- `/agent terraform-validator`, C5 block, `$phase = 'before'`
- `/agent terraform-coder`: `enablePrivateCluster` true to false, disposable worktree only
- Rerun `'seeded-failure'`, then `/review`
- Restore only that field, `/diff`, rerun `'repaired'`

</details>

### Lead-in: s15-proof (38:30-41:30)

- [ ] (H) Separate gates: source, local tests, consumer, plan/apply, read-back
- [ ] (M) Evidence feeds the gate, whoever typed the diff
- [ ] (M) Private evidence: sanitized, one pinned revision, no IDs/state/run URLs/FQDNs

### Lead-in: s16-continuity (41:30-42:00)

- [ ] (M) Next task needs the reason, not a transcript
- [ ] (H) Resume is a conversation. Decisions are repo artifacts. Cite the file

## C6: Resume with decisions intact (42:00-45:00)

**Haflidi** | **Cut 44:15**

- [ ] (H) Record starts in `.squad\decisions\inbox\`
- [ ] (H) Scribe merges accepted entries into the ledger
- [ ] (H) Reviewable repo knowledge, not personal memory

**If it stalls:** offline fallback `c6-decision.md` plus session screenshots.
**Do not claim / show:** personal memory or unrelated sessions.
**Point at:** cited decision file and constraints.

<details><summary>Show</summary>

- Ask Scribe: public-only decision (private API invariant, caller-owned provider/backend, added regression, labeled mutation/restoration, exact checks, sanitized validation boundary)
- `/new`, `/resume guided-clean-run`, `/cwd`, `/context`, `/usage`
- Ask session to read and cite the decision file

</details>

### Lead-in: s18-memory (45:00-47:00)

- [ ] (M) Context, native memory, Squad repo knowledge: different owners
- [ ] (M) No personal memory on screen
- [ ] (H) Save boundaries where next owner can review
- [ ] (H) No private mapping, state, credentials in public history

## C7: Reviewed diff (47:00-50:00)

**Haflidi leads, Martin names boundary** | **Cut 49:15**

- [ ] (H) Offline checks
- [ ] (H) Diff
- [ ] (H) Reviewer findings
- [ ] (H) Human code-only acceptance
- [ ] (H) Remaining gates belong to the environment owner

**If it stalls:** show saved green exits and diff. No second suite. TFLint missing or not 0.64.0: reviewed offline evidence (runbook).
**Do not claim:** mock-only or `.invalid` outputs are Azure results (runbook).
**Point at:** per-check exit files, diff, independent review.

<details><summary>Show</summary>

- `/agent terraform-validator`, C7 block from the [runbook](demo-runbook.md)
- `/diff`, `/new`, `/agent terraform-reviewer`
- Supply exact diff, files, revision, MCP citations, sanitized validator results

</details>

## s20-consumer: 50:00-53:00

**Martin** (Haflidi 51:00-52:10) | **Start by 50:00** | Keep reveal 50:30-51:00

- [ ] (M) Consumers pin module code
- [ ] (M) No private inputs, backend, state, identities, secrets copied
- [ ] (H) Human or agent: same gates (identity, OIDC, scans, review, branch protection, env approval, audit trail)
- [ ] (M) Gaps visible: single-maintainer admin override, self-review setting, env gate before apply job's plan (mitigated by plan-only run and in-job comparison)
- [ ] (M) Reuse of code, not of the private environment

**If unreachable:** offline screenshot plus apply runs 37771532872 and 37772290635.
**Do not claim:** reuse of private inputs or state.
**Point at:** branded page, pipeline flow, serving pod name, speakers section, 29/29 runtime checks (runbook).

<details><summary>Show</summary>

- 50:00-50:30 consumer-to-module diagram
- 50:30-51:00 open `https://aks-online-demo.swedencentral.cloudapp.azure.com/`

</details>

## Optional squad-on-aca (53:00-54:30)

**Only if ahead** | Skip if the clock would enter 55:00

- [ ] (M) `haflidif/squad-on-aca`: Squad agents as ACA jobs. Evidence is Management, Corp is a separate gate
- [ ] (H) Unattended, Key Vault, managed identity, still a PR through the same gates
- [ ] (H) Variable cost well under USD 0.01 per run, separate fixed holding costs

**If it stalls:** say it failed, show finished issue to workflow to job to PR proof.
**Point at:** 9 Oct run: job finished in 56 seconds, bot opened the PR.

<details><summary>Show</summary>

- Issue in `martinopedal/squad-on-aca-demo-target`, label `squad:ripley`
- `squad-queue.yml` runs, ACA job execution, bot PR
- Exact commands: optional section of the [track](talk-track.md)

</details>

## Cross-cutting rules

**Five working rules**

- [ ] Copilot CLI runs the work. Squad coordinates ownership and memory
- [ ] Narrow native profiles. Tool filters are not a sandbox
- [ ] Provider, backend, auth, state stay outside the module
- [ ] Separate local mocks, consumer checks, real plans, Azure read-back
- [ ] Record decisions and evidence so the next engineer can resume

**Drop order if behind**

1. Compress `s21-limits`
2. Trim `s18-memory`
3. Trim `s15-proof`
4. Trim `s13-test-gap`
5. Trim `s05-parallel`
6. Shorten `s20-consumer` (keep 50:30-51:00 reveal)
7. Live chapter fallback

**Say "runtime check" / "runtime evidence".** Evidence belongs to the exact thing it checks. Local mocks are not Azure acceptance evidence.

**Never on screen:** subscription IDs, tenant IDs, private IPs, raw state, secrets, private run URLs, personal memory.
