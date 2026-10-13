# Short talk track - what to do and what to show

**Prepare once, before opening Copilot:** on the VM, follow
[create/verify `C:\demo` clones](demo-runbook.md#create-and-verify-the-agreed-vm-layout),
then [create A/B/guided + offline/evidence](demo-runbook.md#create-the-disposable-c1-c7-checkpoints).
The actual creator is `scripts\prepare-demo-checkpoints.ps1`: `git worktree add`
creates the three roots from reviewed public commit `0abb202f`; `Set-Location`
does not create them. VM paths remain unverified until those checks pass.

Use [prompt pack](prompt-pack.md) for whole paste blocks and
[full track](talk-track.md) for narration/clocks/close. `Shell` = PowerShell 7;
`TUI` = inside real Copilot; `Browser` = the named page. Paste a whole `!`
shell block in one CLI turn; variables do not survive separate turns.
[Conditional human sign-in](demo-runbook.md#conditional-human-setup-before-plan)
happens before Plan; mocked source checks need no Azure login.
View the docs as **rendered Markdown** (GitHub or VS Code preview); local HTTP
serves `.md` as raw text, not rendered heading anchors.

## Essentials - start real Copilot with Squad

**Shell, VM:**

```powershell
Set-Location 'C:\demo\session-repo'
git rev-parse --show-toplevel
git status --short
copilot --agent squad
```

**TUI:** `/cwd`, `/agent`, `/instructions`, `/permissions`.
Show the actual public root, selected Squad, three Terraform profiles and narrow
permissions. For read-only orientation, `/agent terraform-reviewer`; paste
[small task](prompt-pack.md#essentials---start-here). Expect five sourced bullets,
no edits. **STOP:** wrong root/profile = exit/restart, not reinitialize Squad.

## C0 - install, initialize, confirm the team

**Shell/TUI:** follow [clean-host install/clone/hire](clean-machine-demo.md#the-live-chapter-target-300).
This creates a new `$HOME\demo\aks-module` clone; `squad init` scaffolds it,
`copilot --agent squad` starts the host CLI, and `squad doctor` checks setup.
Show versions, real team files and confirmed roster, not code correctness.
**STOP:** unqualified clean host or chapter cut = dated fallback; no VM repair.

## C1 - compare two bounded plans

**Shell:** [launch A and B](prompt-pack.md#c1---martin-drives-haflidi-compares-1230-1530-cut-1445)
only after the creator verified both roots at the same checkpoint.
**TUI:** select the same model, enter native `/plan`, paste the identical
`alternate_network_payload` request from that link; name sessions `C1-A`/`C1-B`.
Show one consequence of the two plans; identical results are valid.
**STOP:** checkpoint/model mismatch or cut = fallback, not a retry for prettier prose.

<a id="native-plan-with-squad"></a>

## C2 - Squad plans; human revises and approves code only

1. **Shell:** [start guided](prompt-pack.md#c2---martin-1730-2130-cut-2030).
   **TUI:** `/cwd`, `/agent` → Squad; confirm the actual guided root/agent.

2. **TUI:** enter native `/plan`; confirm the displayed **Plan** mode before
   sending the [bounded plan-only request](prompt-pack.md#c2---martin-1730-2130-cut-2030).
   Squad coordinates read-only test planning: affected files, one future writer,
   invariant assertions and offline checks; no code or shell execution.
   Selecting Squad, asking “plan”, or `squad init` is **not** this mode transition.

3. **TUI:** inspect the proposed plan; paste the linked **scope revision**.
   Inspect the revised plan and acceptance criteria, then paste the exact
   **code-only approval** in that same block. Expect a genuine narrower plan,
   not automatic approval or deployment consent.

4. **TUI:** press **Shift+Tab** to cycle until the mode indicator is
   **Interactive**, not Plan or Autopilot. Verify it **before** selecting the
   coder or running commands. `/exit` closes Copilot; it does not just leave Plan.

**STOP:** missing Plan/Interactive indicator, unapproved scope, checkpoint/mirror
failure or chapter cut = [C2 fallback](demo-runbook.md#c2-revise-and-approve--1730-2130--4-minutes).
Actual batch Plan/Squad check used CLI **1.0.95**, not launcher/help **1.0.96**;
[UI revision/approval/exit remain untested](demo-runbook.md#october-13-command-dry-run-matrix).

## C3 - one writer implements; Squad returns real handoffs

**TUI, guided:** `/agent squad`; paste [coordination request](prompt-pack.md#c3---martin-2200-2600-cut-2500),
then `/agent terraform-coder`; paste **B1v2** from that link.
Show actual task starts/handoffs and the one-file diff:
`tests\contract.tftest.hcl`, four separate asserts/error messages.
Manual agent switches are not parallel work. **STOP:** concurrent writers,
missing handoffs or cut = fallback; historical B1v2 5/5 is not this run.

## C4 - base skill, source lookup, narrow permission

**TUI, guided - BASE ONLY:** `/agent squad`; paste
[skill/MCP request](prompt-pack.md#c4---martin-2930-3330-cut-3230---base-only).
Show actual `test-discipline` invocation, read-only Microsoft Learn URL/version
and `/permissions`; expect unchanged invariant assertions.
**STOP:** unavailable skill/MCP, failed lookup or cut; no cloud extra here.

## C5 - before, deliberate failure, one-field repair

**TUI/Shell, guided:** `/agent terraform-validator`; paste the whole
[C5 logging block](prompt-pack.md#c5---haflidi-3330-3830-cut-3715)
through `!` as `before`. Coder alone makes the linked labeled
`enablePrivateCluster` true → false mutation; validator repeats
`seeded-failure`, then `repaired` after the one-field restoration.
Show pass → intended `private_automatic_contract` failure → pass/original
source hash. **STOP:** before fails, wrong failure, unavailable isolation or cut.
[Why the checks exist](demo-runbook.md#what-the-offline-powershell-checks-do).

## C6 - save the public reason and resume it

**TUI, guided:** `/agent squad`; paste
[public Scribe request and resume sequence](prompt-pack.md#c6---haflidi-4200-4500-cut-4415).
Show `.squad\decisions\inbox\` record, `/new`, `/resume guided-clean-run`,
`/cwd`, `/context`, `/usage`, then the next task's cited constraints.
**STOP:** missing saved decision/resume/citation or cut = saved evidence;
hide unrelated sessions.

## C7 - offline validation and independent review

**TUI/Shell, guided:** `/agent terraform-validator`; paste the whole
[C7 checks](prompt-pack.md#c7---haflidi-4700-5000-cut-4915) through `!`.
Show numeric exits/logs for fmt/init/validate/lint/module+caller tests and `/diff`.
Use `/new`, `/agent terraform-reviewer`; paste the linked exact-diff handoff,
then `/agent squad` for human acceptance.
**STOP:** tool/isolation/check failure, unrelated diff or cut = reviewed fallback.
Mocks are not Azure evidence.

## Technical evidence - public consumer source and browser

**Shell, VM:** [public ingress source block](demo-runbook.md#s20-consumer-an-online-consumer--5000-5300).
**Browser:** `https://aks-online-demo.swedencentral.cloudapp.azure.com/`
(known certificate warning). Show source route and branded page, not renewed
cluster health or trusted TLS. Full narrative, core wrap, protected recovery and
close stay in the [full track](talk-track.md).
**STOP:** unavailable page = dated screenshot, no repair.

<a id="hosted-demo"></a>

## Hosted Squad on ACA Apps/Jobs - optional final tail, first

**Current gate:** HELD on publisher/image/auth/chain/human rehearsal. This is the
qualified recipe, **not permission to run it now**; original service stays untouched.
VM root `C:\demo\hosted-target` must be operator-created/verified.

1. **Browser, approved target Issues:** open the existing approved README task;
   compare its exact body with [hosted workload brief](prompt-pack.md#original-hosted-squad-issue-to-pr-work).
   Expect correct scope and no prior queued/attempted work.

2. **Shell:** paste the [one-label trigger block](demo-runbook.md#hosted-one-label-trigger)
   with the owner's resolved target/issue/bot binding. Add `squad:ripley` **once**;
   show the label on that same issue, no new issue.

3. **Browser, owner-approved poller/queue view:** wait for the existing five-minute
   poller; show its **same-issue queue receipt**, not manual workflow status.
   Expect automatic enqueue/KEDA dispatch to the existing event Job.

4. **Browser, Azure portal:** Container App Jobs →
   `caj-squad-aca-agent-corp-ne` → Executions → matching queue execution.
   Show its real Squad worker/result tied to **that same issue**.

5. **Browser, that issue's linked App-bot PR:** Files changed → `README.md`.
   Show the real README diff/checks and human review handoff, not a stub or merge.

**STOP:** hold, prior attempt, missing binding/correlation/result or no spare time =
[dated evidence/SKIP](demo-runbook.md#card-a-haflidi-hosted-squad-on-aca-issue-to-bot-pr); no retry/Job start.

<a id="native-demo"></a>

## Native ACA Sandboxes - optional final tail, dead last

**Current gate:** accepted engineering, but **no current prepared sandbox ID,
guest staging or human stage GO established**. The earlier sandbox was deleted.
Host CLI/Squad controls an existing MicroVM; no guest agents or host-token copy.

1. **Shell, VM `C:\demo\session-repo`:** run
   [prepared-ID/source precheck](demo-runbook.md#native-prepared-id-and-source-precheck);
   the operator supplies the actual current approved ID, whose exact-target
   readback and guest LF/source hash must match. Then `copilot --agent squad`.
   **TUI:** `/cwd`, `/agent` → Squad; show host/root and captured binding.

2. **TUI:** paste the [basic fixture prompt](prompt-pack.md#native-basic-fixture-paste).
   Invoke `aca-sandboxes`, inspect each exact-ID request, approve
   `sh /root/native-validation.sh` **once**, then `/root/native-result.json`
   filesystem readback. Expect real MicroVM work, not auth/doctor status.

3. **TUI/returned output:** show three true checks, source/result SHA and
   numeric exit `0`, then the separately approved deliberate exit `23`.
   Run the [one causal-denial block](demo-runbook.md#native-causal-denial-paste)
   only if approved; expect HTTP403 **plus a new same-sandbox denied audit**.

4. **TUI, host:** give actual prompt/tool calls/JSON/hashes/exits/audit to
   validator; `/new`, `/agent terraform-reviewer` for independent review.
   Show findings/limits and human acceptance, not hosted-Job or guest-agent proof.

**STOP:** missing ID/staging/GO, mismatched target/hash/result, error or no spare time =
[accepted trace/SKIP](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad); no create/upload/install/auth-copy/retry.

## Workstation preparation map - not VM stage commands

Verified preparation roots under `C:\git\squad-terraform-session-2026-10-14`:
`public` = session source; `demo-env` = live consumer source;
`module-public` = canonical Corp module (read-only);
`aca-sandboxes` = session checkpoint directory, **not** a native consumer clone.
Native consumer source is `demo-env\deployments\aca-sandboxes-online`.
See [repository ownership](repositories.md); these existing paths prove neither
clean VM checkpoints nor runtime GO.
