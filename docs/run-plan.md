# Run plan: NIC 2026, "From prompt to reusable Terraform"

Audience: both presenters and the stage operator. Purpose: keep the selected demo, evidence gates, cut lines and next actions explicit. Run order: essentials -> C0-C7 walkthrough -> technical evidence -> complete core wrap -> optional cloud tail. [Short monitor cues](short-talk-track.md); [paste-ready prompts](prompt-pack.md).

Planned: Wednesday 2026-10-14, 10:00-11:00, Room 6; exact current NIC listing remains unconfirmed (B5). Martin Opedal and Haflidi. Deck target for the next round: 60:00 total, live-first. Terminal and browser work is live; prepared checkpoints, inherited module code, and evidence from earlier runs are disclosed fallback, not hidden evidence.

The plan ends scripted content at 55:00, protects 55:00-58:00 for recovery, and keeps the close at 58:00-60:00. The previous plan took content to 58:00. This gives us a 3:00 recovery window, but C0, C3, C5, or C7 can use it quickly if we miss the cut lines. Both presenters need to call the clock.

Decision: use one visible recovery window at 55:00-58:00, not many tiny buffers between chapters. Reason: a single hard buffer is easier to use live, easier to defend when a demo slips, and clearer for both presenters than sprinkling 15-30 second pockets that will be spent without noticing.

Keep all verified enrichment added in the 0.21.0 deck round and carried into deck 0.22.4. The prior accepted 0.22.3 draft is preserved. The control spectrum in `s04-layers`, same-gates framing, Rubber Duck appendix note, legal notice, and feature badges stay. We shortened bridge narration to make room.

Decision: reuse `s01-outcome` as the 00:00-03:00 intro instead of adding a new `s00-intro`. Reason: it already carries the outcome and speaker visual, and a new slide would add navigation/test churn without improving the story.

Clock/source baseline: released deck 0.22.6 on main/Pages, the reviewed Oct 8 eval and the 2026-10-09 timing directive. PR22 normally merged October 13; Pages succeeded and full 39-slide/short five-slide HTTP 200 bodies matched the initially accepted exports. Its notes retain accepted owned-hosted source, remaining runtime gates and the VM preservation hold. Later local correction bytes remain unpublished pending independent review, normal merge and Pages byte verification. These corrections retain 0.22.6 and update readiness prose, not slide design/clocks or runtime proof; use the matrix/cards for operational scope.

## Timing contract

This is the new arithmetic and it must be explicit in the deck, notes, and mirror docs:

- 00:00-03:00 intro (`s01-outcome`).
- 03:00-55:00 planned/scripted content.
- 55:00-58:00 protected recovery window. No new story beats go here.
- 58:00-60:00 close (`s22`), with "questions if time allows" only if the buffer survived.

Inside 03:00-55:00, the plan is:

- 29:00 live chapters (`C0-C7`) unchanged.
- 23:00 explanation and framing slides.
- Total planned content before the recovery window: 52:00.

Inside 55:00-58:00, the presenters may only:

- absorb a chapter overrun,
- slow down for clarity,
- take a breath and reset ownership/handoff,
- or end early and hold cleanly.

They do **not** spend that window on extra explanation, appendix content, or ad-lib Q&A.

## What changed to make the 55:00 target fit

The 3:00 recovery window is created by trimming six bridge slides from 1:00 to 0:30 each. These are presentation beats, not evidence beats:

| Slide | Old | New | Save | What changes |
|---|---:|---:|---:|---|
| `s03-baseline` | 1:00 | 0:30 | 0:30 | One clean statement: inherited public code, disclosed checkpoint, not first implementation. |
| `s04-news` | 1:00 | 0:30 | 0:30 | Keep only the verified CLI, Squad, MCP, and one-line AKS status headlines. |
| `s07-agent-setup` | 1:00 | 0:30 | 0:30 | Treat as a handoff map into C0, not a second explanation. |
| `s10-tool-roles` | 1:00 | 0:30 | 0:30 | One sentence: instructions, skills, MCP are different controls. |
| `s12-source-check` | 1:00 | 0:30 | 0:30 | One sentence: a source claim becomes a testable assertion. |
| `s16-continuity` | 1:00 | 0:30 | 0:30 | Record the decision and why we made it. |

Total reclaimed time: 3:00.

Nothing was cut from the already-placed enrichment:

- `s04-layers` keeps the control spectrum and the "not a maturity ladder" framing.
- `s20-consumer` keeps the same-gates wording and the live reveal.
- The legal notice remains the untimed pre-show slide.
- The Rubber Duck appendix note stays in the appendix.
- Feature badges remain in the deck.
- C4 is the base skill, read-only MCP lookup and permissions flow only. Both cloud extras are deferred to the final optional tail after all core chapters, technical evidence and wrap; no substitution or extra bridge trims. `s05-parallel`, `s18-memory`, and `s21-limits` keep their table budgets.

## 60-minute schedule with explicit recovery window

| Slide ID | Start-end | Duration | Cumulative | Buffer zone? | Owner | Purpose / hard cue |
|---|---|---:|---:|---|---|---|
| `s01-outcome` | 00:00-03:00 | 3:00 | 03:00 | No | Martin opens; Haflidi identifies prepared evidence | Intro: who we are, what the audience will see, what they will leave with, and which evidence is live or prepared. |
| `s03-baseline` | 03:00-03:30 | 0:30 | 03:30 | No | Martin | Inherited public source, disclosed clean checkpoint, not first implementation. |
| `s04-news` | 03:30-04:00 | 0:30 | 04:00 | No | Martin | Auto and HydraFusion lead with status/cost qualifications; pin the stage model for eval parity. Cloud detail is deferred to the final optional tail, not a core headline. |
| `s04-layers` | 04:00-05:00 | 1:00 | 05:00 | No | Haflidi then Martin | CLI runs work, Squad coordinates, tools return evidence; control spectrum as modes, not a maturity ladder. |
| `s07-agent-setup` | 05:00-05:30 | 0:30 | 05:30 | No | Martin | Setup map only; hand straight to C0. |
| `demo-c0` | 05:30-08:30 | 3:00 | 08:30 | No | Haflidi | Bootstrap from zero; cut at 07:45. |
| `s05-parallel` | 08:30-10:30 | 2:00 | 10:30 | No | Martin | Three lanes and handoffs: coder, validator, reviewer. |
| `s06-contract` | 10:30-12:30 | 2:00 | 12:30 | No | Haflidi | Platform-owned network into reusable module; caller-owned provider/backend/state. |
| `demo-c1` | 12:30-15:30 | 3:00 | 15:30 | No | Martin drives; Haflidi compares | Same task, fixed inputs, compare one consequence; cut at 14:45. |
| `s08-plan-boundary` | 15:30-17:30 | 2:00 | 17:30 | No | Haflidi | Module and consumer ownership; approval boundary before plan. |
| `demo-c2` | 17:30-21:30 | 4:00 | 21:30 | No | Martin | Pin brief and approve repo-only plan; cut at 20:30. Checkpoint: must be out of C2 at 21:30. |
| `s10-tool-roles` | 21:30-22:00 | 0:30 | 22:00 | No | Haflidi | Instructions, skills, and MCP are different controls. |
| `demo-c3` | 22:00-26:00 | 4:00 | 26:00 | No | Martin | Route B1v2 to `terraform-coder`; cut at 25:00. |
| `s12-source-check` | 26:00-26:30 | 0:30 | 26:30 | No | Haflidi | Source claim becomes assertion. |
| `s13-test-gap` | 26:30-29:30 | 3:00 | 29:30 | No | Haflidi | B1 0/5 -> oracle rule -> B1v2 5/5; no causal or repeatability guarantee; live still must pass. |
| `demo-c4` | 29:30-33:30 | 4:00 | 33:30 | No | Martin | Base skill + read-only source lookup + permissions only; cut at 32:30. Cloud extras never substitute for C4. |
| `demo-c5` | 33:30-38:30 | 5:00 | 38:30 | No | Haflidi | Validator before/seeded/repaired; cut at 37:15. Checkpoint: must be out of C5 at 38:30. |
| `s15-proof` | 38:30-41:30 | 3:00 | 41:30 | No | Haflidi with Martin handoff | Evidence levels; say runtime check/evidence, not evidence for everything. |
| `s16-continuity` | 41:30-42:00 | 0:30 | 42:00 | No | Martin | Record the decision and why we made it. |
| `demo-c6` | 42:00-45:00 | 3:00 | 45:00 | No | Haflidi | Resume with decision/context/usage; cut at 44:15. |
| `s18-memory` | 45:00-47:00 | 2:00 | 47:00 | No | Martin | Conversation, native memory, repo knowledge: different owners. |
| `demo-c7` | 47:00-50:00 | 3:00 | 50:00 | No | Haflidi leads review; Martin drives handoff | Offline exits, diff, reviewer scope; cut at 49:15. |
| `s20-consumer` | 50:00-53:00 | 3:00 | 53:00 | No | Martin | 0:00-0:30 diagram; 0:30-1:00 live reveal; 1:00-2:10 same-gates mapping; 2:10-3:00 boundary and honest audit caveat. |
| `s21-limits` | 53:00-55:00 | 2:00 | 55:00 | No | Haflidi then Martin | Three rules for the next change; no new examples. Content is done at 55:00. |
| `BUFFER` | 55:00-58:00 | 3:00 | 58:00 | **Yes** | Martin owns clock | Protected recovery window. No new content. Use only to absorb drift, slow down, or arrive calm at the close. |
| `s22-questions` (close) | 58:00-60:00 | 2:00 | 60:00 | No | Martin closes; Haflidi available | Close with the same-gates handoff and day-2 loop. "Questions if time allows" only if still ahead. |

Appendix slides (`a-cli-controls`, `a-automation`, `a-handoffs`, `a-integrations`, `a-squad-ops`, `a-evidence`, `a-online`, `a-security`, `a-prompts`, `a-bootstrap`, `a-use-cases`) stay after the timed deck and are used only after the close or in hallway conversations.

## Live chapter budgets and retimed cut lines

The 75% rule still stands. The absolute cut-line clocks move earlier because the bridge slides are shorter.

| Chapter | Slot | Budget | 75% cut line | If not ready at cut line |
|---|---|---:|---|---|
| C0 | 05:30-08:30 | 3:00 | 07:45 | State install/login stall, show fallback evidence, move to `s05-parallel`. |
| C1 | 12:30-15:30 | 3:00 | 14:45 | Stop comparison at one C1-A consequence and use saved C1-B excerpt. |
| C2 | 17:30-21:30 | 4:00 | 20:30 | Use saved approved plan; approval covers repo changes only. |
| C3 | 22:00-26:00 | 4:00 | 25:00 | Stop live coder turn, use B1v2 eval excerpt, no causal or repeatability guarantee. |
| C4 | 29:30-33:30 | 4:00 | 32:30 | Cut the base skill/MCP flow, state the missing result, and show scoped fallback. No cloud substitution or second attempt. |
| C5 | 33:30-38:30 | 5:00 | 37:15 | Stop mutation work, show saved before/seeded/repaired logs. |
| C6 | 42:00-45:00 | 3:00 | 44:15 | Show decision file and state constraints directly. |
| C7 | 47:00-50:00 | 3:00 | 49:15 | Show saved green exits and diff; do not run a second suite live. |

C7 go/no-go: before the chapter, run `tflint --version` in the session repo worktree. Expect `TFLint version 0.64.0` and `ruleset.terraform (0.15.0-bundled)`. If TFLint is missing, or if the TFLint step fails, switch straight to the saved offline evidence and diff.

## Clock checkpoints

| Checkpoint | Required clock | Meaning |
|---|---|---|
| After C0 | 08:30 | Bootstrap must be complete or fallback already shown. |
| After C2 | 21:30 | Plan approval is done; if behind, take reserve cut #1 immediately. |
| After C5 | 38:30 | Repair story must be closed; if behind, take reserve cuts before C6. |
| Start `s20-consumer` | 50:00 | Consumer slide must start here; live reveal is 50:30-51:00. |
| Content complete | 55:00 | If content is still running, the recovery window is already being consumed. |
| Start close | 58:00 | If not here, use `s22` as a hard stop, not a Q&A slide. |

## Recovery reserve after the 55:00 retime

The real slack is the 55:00-58:00 window. The reserve is separate: it is the extra explanation depth that gets cut first if any chapter overruns. Keep the same first-cut logic as before, but apply it earlier against the 55:00 target.

| Order | Slide / segment | Save | New floor | What remains |
|---:|---|---:|---:|---|
| 1 | `s21-limits` | 1:30 | 0:30 | One sentence: three rules move into the close. |
| 2 | `s18-memory` | 1:00 | 1:00 | Keep only "three stores, three owners." |
| 3 | `s15-proof` | 1:00 | 2:00 | Keep the evidence ladder; move depth to appendix. |
| 4 | `s13-test-gap` | 1:00 | 2:00 | Say B1 0/5 and B1v2 5/5; move B2/B3 detail to appendix. |
| 5 | `s05-parallel` | 1:00 | 1:00 | Keep lane names only; skip detailed handoff examples. |

That preserves the earlier 5:00 principle as a **minimum** reserve and, in practice, gives 5:30 if all five compressions are taken. I am not using that extra 0:30 to make the fit work; it is emergency-only.

Rule: spend reserve cuts before you spend the 58:00 close. The close is still a real stop, not a dumping ground for overrun.

## Risk

The 3:00 recovery window at 55:00-58:00 stays in the plan even if we use none of the reserve cuts. This gives both presenters time to recover before the close.

Residual risk is still medium:

- **C0** can burn time on VM/Bastion/login friction.
- **C3** still depends on a live authoring turn whose measured eval range was 61-114 seconds before operator narration and handoff.
- **C4** depends on MCP/Docker health in the base flow only. Cloud extras never replace it and add no core startup dependencies.
- **C5** is still the most intricate live validator chapter.
- **C7** is still the easiest place to accidentally keep talking.

If the presenters obey the cut lines, this should land safely. If they narrate past the cut lines, the new 3:00 window will help, but it will not save a drifting show forever.

## s20-consumer live reveal (50:00-53:00)

Keep the live reveal itself exactly 30 seconds.

| Time inside slot | Wall clock | Action | Words |
|---|---|---|---|
| 0:00-0:30 | 50:00-50:30 | Point at consumer-to-module diagram | "Reuse the module code, not the private environment." |
| 0:30-1:00 | 50:30-51:00 | Live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/` | Show branded page, pipeline flow, serving pod name, and speakers section. |
| 1:00-2:10 | 51:00-52:10 | State delivery gate and runtime evidence | PR to plan to human approval to apply. Historical 2026-10-08: 29/29 outside-in runtime checks. Current recorded 2026-10-12: 26 PASS / 2 BLOCKED / 1 report-only under TLS bypass; no fresh suite, trusted TLS or full cluster health established. |
| 2:10-3:00 | 52:10-53:00 | State boundary | `a-online` and `a-security` are appendix/hallway depth, not main-flow slides. |

Use "runtime check" or "runtime evidence". Do not use stronger certainty language.

## Rehearsal schedule

| Date | Owners | What | Done when |
|---|---|---|---|
| Fri 9 Oct | Martin drives; Haflidi checks and times | Rehearsal 1: slides plus all live chapters, timed. Replace every "estimate, time in rehearsal 1" entry in talk docs/runbooks with actual wall time. | Chapter actuals logged; cut lines tested, not just discussed. |
| Mon 12 Oct | Martin and Haflidi | Rehearsal 2: full 60-minute run against this layout. | `s20-consumer` starts at 50:00, planned content ends by 55:00, close starts at 58:00, and the session ends by 60:00 without scheduled Q&A. |
| Tue 13 Oct | Martin and Haflidi | Dress rehearsal/preflight scheduled, not done. Fresh VM preservation hold supersedes earlier recreate plan; no current VM/disk reset. | Presenter preflight and separately qualified clean C0 host/fallback; both current disks preserved. |
| Wed 14 Oct T-2h | Martin owns environment; Haflidi owns demo surfaces | Open deck locally, test notes, verify separately approved runnable host/Bastion, operator Docker/MCP, sessions/app/font/display. No imperative VM start as hold workaround. | Original current-binding/SYSTEM/owner/exact-plan/Haflidi gates satisfied or honest fallback; artifacts reachable without private paths on screen. |
| Wed 14 Oct T-15m | Martin owns clock; Haflidi owns C0/C5 readiness | Re-run fast presenter checks, confirm app tab still loads, confirm VM/RDP still alive, verify clean terminal tabs, close notifications, start timer. | Ready to start; no package/login/setup work remains except deliberate C0 demo actions. |
| Fri 17 Oct; expiry by 31 Oct | Martin | Scheduled teardown of demo resources and backup protection; verify any retained resources expire by Oct 31. | Actual deletion and cost stop verified; schedule/expiry alone is not evidence. |

## T-2h preflight checklist

- [ ] Presentation laptop on power; notifications off; display duplicated; terminal font 16+.
- [ ] Local deck opens; speaker view works; appendix links return to close/appendix path.
- [ ] All presenter preflight checks pass.
- [ ] Docker Desktop running before C4.
- [ ] `/mcp` shows required public documentation/registry tools connected.
- [ ] C4 is base skill/MCP only. Cloud extras are final-tail options, never a core chapter or catch-up. Their approved IaC/read-back, exact access/policy, fixture/archive, full coverage, permissions, human rehearsal, fallback and cleanup gates are checked separately; leave Corp untouched.
- [ ] Start Copilot CLI from the session repo folder, not the coordinator root:

```powershell
cd C:\git\session-repo   # your public repo clone or checkpoint worktree
copilot --agent squad
```

Expected in `/agent`: `Squad` (user) plus `terraform-coder`, `terraform-reviewer`, `terraform-validator` marked "project".
- [ ] TFLint `0.64.0` is installed in the session repo worktree; `tflint --version` prints `TFLint version 0.64.0` and `ruleset.terraform (0.15.0-bundled)`.
- [ ] C1-C7 sessions open and named at checkpoints.
- [ ] Clean VM running; Bastion RDP connected but minimized; PowerShell 7 tab ready.
- [ ] Online app URL loaded once; expected certificate warning accepted; branded page visible.
- [ ] Clipboard contains only public prompts and commands.

## T-15m preflight checklist

- [ ] Timer reset to 60:00; Martin owns clock calls.
- [ ] Haflidi confirms C0 VM state and C5 validator shell.
- [ ] Martin confirms s20 app tab still returns the branded page.
- [ ] Network fallback agreed: if venue network fails, use local deck and appendix evidence.
- [ ] No private identifiers visible in terminal history, browser address bar beyond the public app URL, or speaker notes.
- [ ] Water; microphones; first line rehearsed.

## Fallback matrix

| Failure | Response |
|---|---|
| Live CLI stalls | Use the slide's offline fallback line, name the missing live result, and move on at the slot end. |
| Venue network down | Deck is local; skip live VM and Online app; appendix slides carry sanitized evidence. |
| Demo VM unreachable | Use C0 fallback evidence; say the live VM path is unavailable and keep C0 to 3:00. |
| Online app unreachable | Keep s20 diagram and date the historical October 8 29/29 checks; no fresh suite inferred. Use `a-online` only afterwards/hallway. |
| Running long | Take reserve cuts first, then use chapter cut lines, then spend the 55:00-58:00 recovery window. Protect the 58:00 close if at all possible. |
| One speaker unavailable | The other reads from talk-track; owners stay visible in the plan for rehearsal. |

## Exact change list for devrel and docs mirrors

### Devrel deck changes for the next round

- Keep the untimed legal/futures notice immediately after the opening/title page and before `s01-outcome`. It remains untimed.
- Keep the current enrichment content:
  - `s04-layers`: control spectrum as modes, not a maturity ladder.
  - `s20-consumer`: same-gates wording and verified gate map only.
  - `s22`: same-gates close and day-2 loop line.
  - Rubber Duck appendix note, legal notice, and badges unchanged.
- Retime the main deck to this contract:
  - 00:00-03:00 intro.
  - 03:00-55:00 planned content.
  - 55:00-58:00 protected slack, no new story beats.
  - 58:00-60:00 close.
- Shorten the bridge slides to match the doc schedule:
  - `s03-baseline` -> 03:00-03:30
  - `s04-news` -> 03:30-04:00
  - `s07-agent-setup` -> 05:00-05:30
  - `s10-tool-roles` -> 21:30-22:00
  - `s12-source-check` -> 26:00-26:30
  - `s16-continuity` -> 41:30-42:00
- Keep the live chapter lengths unchanged: C0-C7 = 3/3/4/4/4/5/3/3 minutes.
- Update `s20-consumer` notes so the live reveal is 50:30-51:00 and the slot is 50:00-53:00.
- Retain `s21-limits` as the final content slide, but script it to end at 55:00. The deck may visually hold the slide through 58:00 if needed, but those three minutes are protected slack, not additional narration.
- Update demo notes `demo-c0` through `demo-c7` to absolute cut-line clocks: 07:45, 14:45, 20:30, 25:00, 32:30, 37:15, 44:15, 49:15.
- Presentation build/test assertions must stop encoding the old zero-slack shape. Update them to the new contract and manifest language:
  - `demoMinutes = 29`
  - `introMinutes = 3`
  - `explanationMinutes = 23`
  - `protectedSlackMinutes = 3`
  - `closeBufferMinutes = 2`
  - `qaMinutes = 0`
  - `nonDemoSlideMinutes = 28`
  - `contentEnd = '55:00'`
  - `closeStart = '58:00'`
  - `mainFlowMinutes = 55`
  - `timedSlideMinutes = 60`
  - `questions = 'if time allows'`
- Update README/deck ratio copy to `3 intro / 52 planned content before recovery / 3 protected slack / 2 close`, while still stating that the 29 demo minutes sit inside that planned content.

### Docs mirror changes for the next round

- `talk-track.md`: mirror the new absolute clocks and the 55:00 content-stop. The bridge slides above become one-sentence beats, not full explanatory paragraphs.
- `talking-points.md`: replace any "fit to 58:00 then cut if needed" language with the new rule: plan to 55:00, reserve 55:00-58:00 as true slack, then close.
- `talking-points.md`: keep the reserve cuts in the same order (`s21`, `s18`, `s15`, `s13`, `s05`) and mark them as the first cuts if a chapter overruns.
- `demo-runbook.md`: retime all chapter starts/cut lines to the earlier absolute clocks and keep the same fallback language.
- `clean-machine-demo.md`: update C0 to 05:30-08:30, cut line 07:45.
- All talk docs: keep "runtime check/evidence" wording, not stronger certainty language.

## More technical - retained timing and operator readiness evidence

## Evidence used for timing

| Evidence | Public numbers to use |
|---|---|
| Oct 8 eval, original B1 | 0/5 green. Failure reason: oracle expected separate assertion blocks; do not rescore or hide this. |
| Oct 8 eval, B1v2 clarified brief | 5/5 green; total durations 108.0s, 97.1s, 87.8s, 61.0s, 113.7s; range 61-114s. |
| Oct 8 eval, B2 | 5/5 green; durations 70.3s, 153.3s, 120.1s, 82.9s, 98.1s. |
| Oct 8 eval, B3 | 4/5 green after disclosed oracle rescore from saved diffs; one run changed README outside the allowed list. |
| Oct 8 eval smoke | 1m 17s, exit 0; Terraform MCP available; Microsoft Learn MCP available after one transient retry. |
| Oct 5 dry run | C5 module test 52/52 before and after repair; seeded mutation 51/52 with the intended private API failure; C7 example test 2/2. |
| Preflight | October 5 recorded 16/16 historically. October 12 corrected read-only laptop preflight passed 18/18 on one host; not both presenters or actual interactive authentication. |
| Missing wall times | Estimates remain estimates until the full human rehearsal is logged; a scheduled rehearsal date is not completion evidence. |

## October 12 readiness evidence

The live demo consumer is `martinopedal/aks-automatic-demo-env`, which pins `martinopedal/terraform-azapi-aks-automatic` at `v0.6.0`. The unchanged copied Corp teaching module and its manifest retain their separate `alz-avm-tf-demo/terraform-azapi-aks-automatic-corp` lineage.

Use [the complete repo map](repositories.md), [owner/date/proof/blocker/next-action
matrix](sandboxing.md#october-12-progress-and-next-actions) and [official quickstart
coverage checklist](aca-sandboxes.md#full-test-coverage-checklist). Four independent
demo lanes: existing Online AKS; native ACA SandboxGroup MicroVMs in a verified
separate Online group/RG; hosted Squad ACA Jobs issue-to-PR; local Copilot sandbox.
GitHub-managed cloud is an additional optional account/runtime lane.

| Gate / surface | Actual evidence or limitation | Next operator action |
| --- | --- | --- |
| Native tools / one laptop | Copilot CLI 1.0.94, Squad 1.0.1, ACA CLI 1.0.0-preview.4, enabled official plugin 0.0.5-beta; corrected read-only preflight 18/18 PASS | Retain scoped result; do not substitute it for both presenters |
| Preflight helper regression | Banner terminal-period fix; 46/46 controlled scenarios plus three harmless native helper checks on each PowerShell 7 and 5.1 passed | Preserve these as helper evidence, not clean-machine/manual sign-in proof |
| Local sandbox availability | Installed `copilot help sandbox` documents one-session `--sandbox`; actual Windows MXC startup exited 1 before command on proxy/masking/auth loopback/private-network requirement; policy blocked | Authorized policy-scope review and actual backend/session preflight rerun; no bypass/global change. Build 26300 is OS metadata, not successful backend operation |
| Optional GitHub-managed cloud | `--cloud --experimental --help` parse exited 0; local normal/experimental help does not expose the flag | Not account access, entitlement, billing or launched runtime; qualify separately if selected |
| B1 clean VM | Held; bootstrap mocks and earlier VM checks do not establish current clean-VM installation or manual sign-in | Human verifies fresh VM, installs and sign-in |
| B2 both presenter hosts | Held; only one laptop's read-only checks passed | Both presenters manually check native UI, agents, MCP, permissions and authentication |
| B3 full 60-minute rehearsal | Pending; no completed rehearsal/recording claimed | Log actual chapter times and test cuts, including C4 32:30 |
| B4 private target invitation | Existing WRITE invitation pending in last read-back, not accepted presenter permission | Accept existing invitation, then verify current collaborator rights; do not reinvite |
| B5 current NIC listing | Unknown; current website fetch does not prove exact session title/time | Manually confirm exact listing against planned session metadata |
| Corp customer-managed MicroVM | Current: source merged, new qualification blocked on an unexpected change-type check; no apply performed. Last baseline 8 present / 3 absent: group exists, connection and two Data Owner grants absent; full convergence/access/runtime unproved | No new sealed manifest/raw exact deltas. Devrel repairs private diagnostic retention separately; no deployment/scope weakening. Keep base C4; leave Corp untouched |
| Earlier Corp failure / source-only correction | Historical recovery failed on connection HTTP 400 missing `location`, scoped list 403/exit 1. Earlier contracts 34/34, artifact suite 85/85, runtime suite 31/31, workflow 17/17, checkout 10/10, toolchain 12/12 and GitHub-script 10/10 PASS as source/tooling checks; two Linux smokes skipped on Windows | These were not a new Azure plan or deployment result; source checks precede the subsequent blocked qualification, no new apply established |
| Separate primary Online native MicroVM | Five-object deployment Succeeded/all exact bindings/current operator group access/base 375-second credential-free exec/fs/stop-resume/delete independently verified; final list empty | Public source PR human review/second-presenter qualification remain separate. Corrected ACA SANDBOXES run26.768s passed three guest checks/JSON+SHA/exit23/causal denial/cleanup; independent acceptance complete, runtime-ready after acceptance, human stage GO pending; no automatic retry |
| ACA host auth / wrong-target doctor | Auth status exit 0: ARM/data-plane tokens authenticated only. Doctor 9/9 exit 0 printed cached Management/Norway East, not the requested target despite explicit flags | Compare printed subscription/RG/group/region with approved target plus independent exact-ID read-back; resolve targeting read-only. No Corp/Online doctor PASS, config change or Management fallback |
| Original Squad hosted Apps/Jobs | Haflidi implementation working/previously demonstrated; Corp, Norway East placement and historical Oct 9 executions/56 seconds | Leave source/deployment alone. Owned fork/target source and runtime holds are separate, not missing original implementation or native Sandbox prerequisite |
| Earlier target runner / smoke history | Earlier Manual/7200-second runner had no registered target runners; scoped README-only Manual runner execution ended terminal Failed; associated issue queue workflow remains queued | Historical failure, not the chosen poller path's current blocker; old zero-step queued run remains untouched, not cancelled/proof |
| Owned hosted source | [Public MIT fork PR1](https://github.com/martinopedal/squad-on-aca/pull/1) source accepted at `411bbf1810799bbfeea176e0c4123504a05430e8`, 71 tests and actual Linux image/UID/protected-publication CI SUCCESS; normal merge `623c1906c1b8cacd13ccd1890d3d77ad3241560` preserves tree/credit/license. Private target handoff separately accepted/merged with 42 source tests, runtimeProven remains false | Original @haflidif source/runtime unchanged. Chosen private scheduled poller -> one approved issue -> existing queue -> genuine Squad UID10001 worker -> trusted README App-bot PR; no new runner registration or AppAdmin |
| Private publisher qualification | Publisher source accepted/merged with 18 tests; actual read-only Docker/DNS/TLS qualification is WAITING at the existing human gate with zero executed steps | No image build/push/digest or hosted runtime proof; no approval impersonation/bypass |
| Owner-native hosted Terraform | Existing owner is the sole whole-body Terraform writer; combined draft source preparation has 38 mocked Terraform + 60 non-Terraform contracts PASS, independent full source review pending, not accepted delivery | Plan/apply/destroy paths are currently unconditionally disabled. Signer/current-head binding, actual private-plan transport and executable integration are not provisioned: remaining implementation wiring, not just missing operator receipts. Executable delivery remains held, not deploy-on-merge. Owner/auth/budget/publisher/image/Job/actual README bot PR gates remain; standalone fork Bicep is not a second writer |
| VM source and fresh preservation hold | [Consumer PR21](https://github.com/martinopedal/aks-automatic-demo-env/pull/21) source accepted at `7b05803c81ccaf3390051cc43e13f96822e4960b`, Ready/requested/assigned to Haflidi, REVIEW_REQUIRED. D8s_v5 8 vCPU/32 GiB + in-place Premium SSD + AllUsers SYSTEM bootstrap is a proposal, not deployment. VM now deallocated; attached OS disk differs from earlier receipt | Preserve both disks; never swap back/recreate/delete either. Refresh current binding/baseline and runnable SYSTEM context before exact plan/apply. Original Haflidi/Online human gates, no self-review/bypass; no VM/disk/CSE/power changes authorized |
| VM performance and SYSTEM evidence | Six-hour metric request contains only five actual buckets/25 minutes. CPU/RAM bottleneck and sustained causality unproved; HDD latency/IOPS is only a responsiveness candidate. Payload owner acceptance and harmless LocalSYSTEM transport remain missing; no machine installation | `system_payload_accepted` / `upgrade.bootstrap.system_accepted` attest exact source payload, not prior install. Launcher tolerates absent old receipt, requires fresh success after first install. No fake True/CI substitute; per-user auth deferred |
| VM accepted source sequencing | Current creation-semantic precondition is met; accepted source already sequences IaC deallocate -> VM update -> disk update -> start -> CSE | No missing-start implementation or imperative power workaround. Current attachment binding/complete baseline, runnable SYSTEM/owner attestations/private exact plan and original Haflidi/Online approval still gate execution; optional separately reviewed harmless SYSTEM preflight is not deployed |
| Haflidi progress / source attribution | `haflidif/squad-on-aca` is the public authored implementation; private issue/queue/PR target is not implementation source. Historical shared demo, not newly confirmed personal status; no current Haflidi-authored technical update in supplied search | Ask Haflidi for implementation revision and fresh sanitized chain result before presenting current hosted health |
| Current Online and Corp AKS metadata | Both existing clusters independently read back through Azure MCP: Automatic SKU/Standard tier, provisioning Succeeded, power Running | No AKS redeploy indicated by this metadata; nodepool/full-runtime qualification is separate |
| Current Online app GET | HTTP 200 with branded NIC/AKS text, using explicit known-demo certificate bypass | Not TLS certificate validation or a fresh 29-check security suite; retain separate runtime/security gates |
| Fresh full Online cluster validation | App/source-matching assets/two replicas PASS under TLS bypass; canonical 26 PASS/2 BLOCKED/1 report-only, not 29/29. Corrected supplemental 10 PASS/1 FAIL (TLS)/1 NOT_APPLICABLE (external `/healthz`; source requires direct-pod 200 `ok`) | Native Kubernetes/ResourceHealth unavailable, full health unproved. Eleven noncompliant resources scoped to demo RG incl AKS/network/state, not 11 cluster failures/subscription-wide. No renewed 29/29/full TLS; C1 Oct 13 remains |
| Deck / publication | Released deck 0.22.6 on main/Pages, 39/5 slides; PR22 normal merge/Pages/initial full-short byte verification complete. Later correction bytes remain unpublished pending review/normal merge/Pages byte verification | Corrections retain 0.22.6 and need fresh independent source/export review; a local build or matching version is not publication, runtime or human stage GO |
| Oct 13 warmup/reset | Scheduled, not completed | Verify current hosts, clean C0 reset, scoped fallback and app |
| C1 / C2 Oct 13 | Fresh OnlineSecurity 29 + DemoVM checks; MCP minreplicas 1 warmup scheduled, revert Oct 14 | Exact reviewed changes/checks remain separate; not inferred from today's HTTP 200 |
| Oct 17 teardown / Oct 31 expiry | Dated obligations, not completed | Human verifies teardown and cost stop; expiry is a latest bound, not proof of deletion |
| Other outstanding work | Pool A1/Dependabot remain held for their own review | Do not auto-merge or infer acceptance from presentation readiness |

Squad is coordination/configuration over Copilot, not a sandbox product. [Four execution hosts](sandboxing.md) separates local OS/MXC, GitHub-managed cloud preview, customer-managed ACA MicroVMs, and hosted Squad Apps/Jobs. No successful Corp sandbox creation/runtime test or full CLI+Squad execution inside a MicroVM is established. A worktree/tool filter does not isolate credentials. Host installs do not prove full CLI+Squad execution inside a MicroVM; supported sign-in, storage and egress need separate consent without copying host authentication.

Earlier USD 20 is historical planning/alert context, not current execution authority;
scoped cost consent remains private. A scoped estimate is not a native forecast,
invoice, post-deadline authority or tax guarantee. Retained Corp
resources consume budget; primary Online placement is not promised free.
Online is primary for eligible demo components, not a fallback/policy escape;
Corp-required private workloads stay Corp. Repo visibility does not define
network placement or anonymous native control-plane ingress.

## Optional final extras - only if time and live gates permit

Finish essentials, C0-C7, the technical explanation, consumer reveal and core
wrap **before** either extra. Only a genuine early finish creates spare time
before 55:00; do not shorten core content to manufacture it. Both extras may
be skipped. Stop before 55:00; 55:00-58:00 is protected recovery and
58:00-60:00 is the protected close, never appendix time. Hosted Apps/Jobs
comes first, native ACA Sandboxes last. No stage GO is inferred from source,
an engineering receipt or this reordering.

**Current live gate:** owned hosted source preparation is accepted/merged,
but successful publisher qualification, immutable image, genuine worker auth
and actual README bot PR remain unproved. The qualified attempt failed on
network/TLS/DNS/local Docker limits; live GO is **not** true. External authority,
owner, network, private-evidence and human stage gates remain separate.
No new issue, unsafe Job start or authentication mint while held.
Native 26.768-second fixture engineering/85 rehashes is accepted, not a human
rehearsal or guest-agent/OAuth proof. Both can SKIP.

The dated background retained below preserves the original content, including
earlier waiting/source-review stages. It is preparation history, not the latest
owned-runtime verdict or new permission. Follow the current live gate above.


### Squad on ACA Apps/Jobs - optional, first

Original `haflidif/squad-on-aca` is implemented and previously demonstrated;
leave its source/deployment alone. Status below is the separate new personal
queue target/rehearsal, not evidence original hosted Squad is broken and not a
prerequisite for accepted native ACA fixture engineering.

Use only after C0-C7, technical explanation, consumer reveal and the full `s21-limits` core wrap finish genuinely early. Do not compress the wrap to manufacture spare time. Stop before **55:00**; skip if the protected **55:00-58:00** window would be touched.

- Haflidi's `haflidif/squad-on-aca` hosts Squad as ACA Apps/Jobs, not MicroVMs. Earlier October 12 inventory verified Corp, Norway East placement; historical Oct 9 executions lasted 56 seconds. Earlier README-only Manual runner execution ended terminal Failed; associated issue queue workflow remains queued. Those failures are history, not current owned poller blockers. Corp validation remains separate for MicroVMs.
- Why include it: the hosted queue workflow uses workload identity, Key Vault and KEDA, with changes returned as PRs through the usual gates. The historical variable-cost estimate was under USD 0.01 per run, with separate fixed holding costs; this is not a current measured bill or hard cap.
- Historical shared demonstration, not today's health/full bot-PR readiness: earlier Oct 9 target-queue runs succeeded. Preserve historical chain excerpts with their dates, not a claim that every hosted component is deployed now. No fresh bot PR is established.
- Region note: the environment is in Norway East because Sweden Central hit ACA capacity errors.
- Owned fork/target source is accepted/merged; private scheduled poller -> one approved issue -> existing queue -> genuine Squad UID10001 worker -> trusted README App-bot PR is the chosen source-prepared path, not new registration/AppAdmin. Publisher qualification/human gate, owner-native source preparation/disabled executable delivery, image/auth/actual PR remain held. Fresh queue-driven readiness is not established.
- Old zero-step queued run stays untouched, not cancelled/proof. Haflidi's original authored role is documented; no current Haflidi-authored fresh technical confirmation is inferred from owned source reviews. Read back current target rights and obtain actual sanitized chain proof only after all original gates pass.
- Historical presenter procedure, not permission to execute now; the private target is not the hosted implementation and is not runnable from this public clone alone:
  1. `gh issue create --repo <approved-private-target> --title "Demo task" --body "Ask ripley to make a tiny README/doc change."`
  2. `gh issue edit <n> --repo <approved-private-target> --add-label squad:ripley`
  3. `gh run list --repo <approved-private-target> --workflow squad-queue.yml --limit 3`
  4. Watch the ACA job execution in the Azure portal under Container Apps job Execution history, or run `az containerapp job execution list`.
  5. `gh pr list --repo <approved-private-target> --author <approved-bot-app> --state open`
- Fallback: state the source-accepted/runtime-held boundary, use only dated original confirmed issue-to-PR evidence or skip. Do not simulate a new owned chain or spend recovery on repairs.


### ACA Sandboxes - optional, dead last

## Separate product demo flows, not one combined runtime

The VM is the control console only. Exact folder/login/preflight/trigger/proof/
cleanup instructions are in [Card A and Card B](demo-runbook.md#two-product-demo-flows-hosted-squad-and-native-aca-sandboxes).

| Card | Repo / folder / owner | Trigger and required proof | Clock / cut / fallback / cleanup |
| --- | --- | --- | --- |
| A, hosted Squad ACA Jobs | Haflidi authored `haflidif/squad-on-aca`; independently accepted owned MIT fork is `martinopedal/squad-on-aca`; approved private target at `C:\demo\hosted-target`. Login/current target rights remain human gates | One approved README issue -> private scheduled poller -> existing queue -> genuine Squad UID10001 worker -> trusted App-bot PR/diff. Owned fork/target source accepted, live E2E pending publisher/owner-native Terraform/image/auth/actual PR gates; original service unchanged | Final optional tail after complete core wrap, only genuine early-finish spare time and new GO; cut before 55:00, no use of recovery. Dated reviewed original excerpt or skip; no stage repair/retry. Old queued run untouched; exact newly owned cleanup only |
| B, native ACA isolation for host Copilot CLI/Squad | Public session prompt/fixture on host; verified separate Online group/RG, not AKS/hosted Jobs. Martin coordinates, native operator/worker runs, independent validator/reviewer checks | Actual host prompt/Squad/ACA tools -> three guest checks/JSON+SHA -> exit23/causal denial -> cleanup/handoff. Corrected receipt PASS; independent acceptance complete, runtime-ready after acceptance, human stage GO separate | Final optional tail after hosted Apps/Jobs and complete core wrap; cut before 55:00 only after successful-work/rehearsal GO. Accepted trace or skip; no retry or slack spend. Exact owned cleanup off-stage |

No full runtime QA is promised in four minutes. Host Copilot/Squad orchestrating
isolated fixture work is the primary native flow; actual coordinator prompt,
worker/ACA tools, guest results, validation and reviewer handoff evidence is
independently accepted. The 26.768-second run passed LF/source+result SHA,
three positive guest checks/JSON, exact guest/host exit23, causal HTTPS403 with
new exact-sandbox networkEgress.denied audit and exact-ID cleanup/empty
list/NotFound; 85 evidence files were independently rehashed. This is fixture
engineering acceptance and runtime readiness, not human stage GO:
manual preflight/rehearsal, second-presenter sign-in and any selected Terraform
variant remain separate gates. The credential-free policy challenge alone used
per-request curl --insecure; trusted TLS and inside-MicroVM agents/OAuth
remain unproved. Optional CLI/Squad inside the MicroVM needs separate
consent/process/agent/prompt proof, not a basic remote-orchestration
prerequisite. Hosted Apps/Jobs fresh E2E remains BLOCKED: owned fork/target source
is accepted, but private publisher qualification, owner-native Terraform,
immutable image, authentication and actual README bot PR remain unproved,
not qualified by Card B. No new runner registration or AppAdmin is required.

### Native final-tail preparation phases - never C4

ACA Sandboxes is a final optional extra, not an inserted or substituted core
chapter. Only independently approved selected-target IaC, effective access/policy
read-back, full required runtime coverage and validated presenter preflight permit
it. Online base and host-driven fixture engineering are independently accepted;
human rehearsal and any selected Terraform variant remain pending, with Corp
untouched. No extra bridge trims are assumed.

Held Corp gate remains open: source merged, qualification blocked on an unexpected
change-type check; no apply performed in that lane. Separate Online deployment/
access/base probe is verified; engineering acceptance is complete, human
preflight/rehearsal separate. Earlier CRLF is learning history. Historical
Management-side MicroVM evidence or hosted Jobs placement does not close the
selected-target gate. An approved historical excerpt must say
"Management-side execution evidence, not Corp validation".

| Relative phase | Preparation reference only | Final-extra action |
| --- | ---:| --- |
| Guidance/prepared source | 0:30 | Name qualified scope, show skill and prepared cited source; disclose preparation. |
| One bounded prompt | 2:00 | Approved prepared sandbox, inspected permissions; no provisioning/upload/install/retry. |
| Inspect evidence | 0:30 | Actual numeric exits, exact root-test oracle and HTTP observations; name missing results. |
| Cut/fallback | 1:00 | Stop before 55:00; C0-C7 and core wrap already complete. No protected-window spend. |

These durations are retained planning references, not an allocated extra slot or
runtime promise. If the whole bounded attempt cannot fit genuine remaining spare
time, skip. The [native card](demo-runbook.md#card-b-native-aca-sandboxes-for-host-copilot-cli-and-squad)
and [ACA preflight/prompt](aca-sandboxes.md) define manual preparation and evidence.
Prior fresh Copilot runs took about 2:58 and 1:47 in Management; they do not
guarantee 90 seconds or qualify Corp. C0-C7 remain 29:00, planned content 55:00,
protected recovery 3:00 and close 2:00; no new story in 55:00-58:00.
