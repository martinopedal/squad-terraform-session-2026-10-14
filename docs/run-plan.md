# Run plan: NIC 2026, "From prompt to reusable Terraform"

Wednesday 2026-10-14, 10:00-11:00, Room 6. Martin Opedal and Haflidi. Deck target for the next round: 60:00 total, live-first. Terminal and browser work is live; prepared checkpoints, inherited module code, and evidence from earlier runs are disclosed fallback, not hidden evidence.

Frank verdict: this redesign finally creates real on-the-clock slack before the close. The talk now plans to finish scripted content at 55:00, holds 55:00-58:00 as protected recovery time, and still keeps the 58:00-60:00 close. That is materially safer than the prior 58:00 content edge. It is still not casual live pair programming: if C0, C3, C5, or C7 overrun and the presenters ignore the cut lines, the 3:00 window can disappear fast. The fit is now workable, but only with disciplined clock calls.

Decision: use one visible recovery window at 55:00-58:00, not many tiny buffers between chapters. Reason: a single hard buffer is easier to use live, easier to defend when a demo slips, and clearer for both presenters than sprinkling 15-30 second pockets that will be spent without noticing.

Decision: keep all verified enrichment added in the 0.21.0 deck round and carried into the current 0.21.1 deck. The control spectrum in `s04-layers`, same-gates framing, Rubber Duck appendix note, legal notice, and feature badges stay. The time comes from trimming bridge narration, not from removing enriched content.

Decision: reuse `s01-outcome` as the 00:00-03:00 intro instead of adding a new `s00-intro`. Reason: it already carries the outcome and speaker visual, and a new slide would add navigation/test churn without improving the story.

Sources of truth for this plan: current `presentation\src\slides.mjs` (deck 0.21.1, brand/wording fixes already in), prior docs from `origin/docs/oct8-eval-and-hostname`, `origin/docs/playbook:docs/playbook.md`, TEAM ROOT `demo\eval-20261008\results.md`, and the 2026-10-09 directive that keeps the 5:00 slack principle inside the 60:00 layout.

## Evidence used for timing

| Evidence | Public numbers to use |
|---|---|
| Oct 8 eval, original B1 | 0/5 green. Failure reason: oracle expected separate assertion blocks; do not rescore or hide this. |
| Oct 8 eval, B1v2 clarified brief | 5/5 green; total durations 108.0s, 97.1s, 87.8s, 61.0s, 113.7s; range 61-114s. |
| Oct 8 eval, B2 | 5/5 green; durations 70.3s, 153.3s, 120.1s, 82.9s, 98.1s. |
| Oct 8 eval, B3 | 4/5 green after disclosed oracle rescore from saved diffs; one run changed README outside the allowed list. |
| Oct 8 eval smoke | 1m 17s, exit 0; Terraform MCP available; Microsoft Learn MCP available after one transient retry. |
| Oct 5 dry run | C5 module test 52/52 before and after repair; seeded mutation 51/52 with the intended private API failure; C7 example test 2/2. |
| Preflight | Presenter preflight target remains 16/16 before delivery. |
| Missing wall times | Still marked "estimate, time in rehearsal 1" in the detailed runbooks; replace after Fri 9 Oct rehearsal. |

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
| `s16-continuity` | 1:00 | 0:30 | 0:30 | One sentence: save the reason, not the whole chat. |

Total reclaimed time: 3:00.

Nothing was cut from the already-placed enrichment:

- `s04-layers` keeps the control spectrum and the "not a maturity ladder" framing.
- `s20-consumer` keeps the same-gates wording and the live reveal.
- The legal notice remains the untimed pre-show slide.
- The Rubber Duck appendix note stays in the appendix.
- Feature badges remain in the deck.

## 60-minute schedule with explicit recovery window

| Slide ID | Start-end | Duration | Cumulative | Buffer zone? | Owner | Purpose / hard cue |
|---|---|---:|---:|---|---|---|
| `s01-outcome` | 00:00-03:00 | 3:00 | 03:00 | No | Martin opens; Haflidi adds honesty rule | Intro: who we are, what the audience will see, what they will leave with, and the honesty rule about live vs prepared evidence. |
| `s03-baseline` | 03:00-03:30 | 0:30 | 03:30 | No | Martin | Inherited public source, disclosed clean checkpoint, not first implementation. |
| `s04-news` | 03:30-04:00 | 0:30 | 04:00 | No | Martin | CLI GA, Squad 1.0.1, Terraform MCP, Azure MCP, Agent HQ, and one AKS defaulting note. |
| `s04-layers` | 04:00-05:00 | 1:00 | 05:00 | No | Haflidi then Martin | CLI runs work, Squad coordinates, tools return evidence; control spectrum as modes, not a maturity ladder. |
| `s07-agent-setup` | 05:00-05:30 | 0:30 | 05:30 | No | Martin | Setup map only; hand straight to C0. |
| `demo-c0` | 05:30-08:30 | 3:00 | 08:30 | No | Haflidi | Bootstrap from zero; cut at 07:45. |
| `s05-parallel` | 08:30-10:30 | 2:00 | 10:30 | No | Martin | Three lanes and handoffs: coder, validator, reviewer. |
| `s06-contract` | 10:30-12:30 | 2:00 | 12:30 | No | Haflidi | Platform-owned network into reusable module; caller-owned provider/backend/state. |
| `demo-c1` | 12:30-15:30 | 3:00 | 15:30 | No | Martin drives; Haflidi compares | Same task, fixed inputs, compare one consequence; cut at 14:45. |
| `s08-plan-boundary` | 15:30-17:30 | 2:00 | 17:30 | No | Haflidi | Extract module, not environment; approval boundary before plan. |
| `demo-c2` | 17:30-21:30 | 4:00 | 21:30 | No | Martin | Pin brief and approve repo-only plan; cut at 20:30. Checkpoint: must be out of C2 at 21:30. |
| `s10-tool-roles` | 21:30-22:00 | 0:30 | 22:00 | No | Haflidi | Instructions, skills, and MCP are different controls. |
| `demo-c3` | 22:00-26:00 | 4:00 | 26:00 | No | Martin | Route B1v2 to `terraform-coder`; cut at 25:00. |
| `s12-source-check` | 26:00-26:30 | 0:30 | 26:30 | No | Haflidi | Source claim becomes assertion. |
| `s13-test-gap` | 26:30-29:30 | 3:00 | 29:30 | No | Haflidi | B1 0/5 -> oracle rule -> B1v2 5/5; no causal or repeatability guarantee; live still must pass. |
| `demo-c4` | 29:30-33:30 | 4:00 | 33:30 | No | Martin | Skill + read-only source lookup + permissions; cut at 32:30. |
| `demo-c5` | 33:30-38:30 | 5:00 | 38:30 | No | Haflidi | Validator before/seeded/repaired; cut at 37:15. Checkpoint: must be out of C5 at 38:30. |
| `s15-proof` | 38:30-41:30 | 3:00 | 41:30 | No | Haflidi with Martin handoff | Evidence levels; say runtime check/evidence, not evidence for everything. |
| `s16-continuity` | 41:30-42:00 | 0:30 | 42:00 | No | Martin | Save the reason, not the whole chat. |
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
| C4 | 29:30-33:30 | 4:00 | 32:30 | Say lookup unavailable live, show fallback excerpt, do not pretend success. |
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

Frank verdict: yes, there is now genuine on-the-clock slack before the close. It is 3:00, exactly at 55:00-58:00, and it exists whether or not any reserve cuts are taken. That is the improvement Martin asked for.

Residual risk is still medium:

- **C0** can burn time on VM/Bastion/login friction.
- **C3** still depends on a live authoring turn whose measured eval range was 61-114 seconds before operator narration and handoff.
- **C4** still depends on MCP/Docker health.
- **C5** is still the most intricate live validator chapter.
- **C7** is still the easiest place to accidentally keep talking.

If the presenters obey the cut lines, this should land safely. If they narrate past the cut lines, the new 3:00 window will help, but it will not save a drifting show forever.

## s20-consumer live reveal (50:00-53:00)

Keep the live reveal itself exactly 30 seconds.

| Time inside slot | Wall clock | Action | Words |
|---|---|---|---|
| 0:00-0:30 | 50:00-50:30 | Point at consumer-to-module diagram | "Reuse the module code, not the private environment." |
| 0:30-1:00 | 50:30-51:00 | Live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/` | Show branded page, pipeline flow, serving pod name, and speakers section. |
| 1:00-2:10 | 51:00-52:10 | State delivery gate and runtime evidence | PR to plan to human approval to apply; 29/29 outside-in runtime checks. |
| 2:10-3:00 | 52:10-53:00 | State boundary | `a-online` and `a-security` are appendix/hallway depth, not main-flow slides. |

Use "runtime check" or "runtime evidence". Do not use stronger certainty language.

## Optional Squad on ACA side track

Use only if the show is already ahead. Safe placement is **53:00-54:30**, with `s21-limits` compressed to **54:30-55:00** if needed. Skip it if the clock would enter the protected **55:00-58:00** window.

- What it is: Haflidi's `haflidif/squad-on-aca` runs Squad agents as Azure Container Apps jobs in a corp landing zone. A GitHub issue labeled for an agent lands in a queue, an ACA job runs the agent, and a bot opens the PR.
- Why include it: it shows unattended agent execution in our own Azure tenant, with no laptop in the loop. Secrets stay in Key Vault, private networking is available, the run uses managed identity, every change still arrives as a PR through the usual gates, the variable cost per run is well under USD 0.01, and the environment also has fixed holding costs.
- Public-safe proof from 2026-10-09: a second fresh end-to-end run passed. The presenter flow created and labeled a new issue, the enqueue workflow succeeded, the ACA agent job execution finished in 56 seconds, and the `squad-on-aca` bot app opened the PR. After validation, the test issues and PRs were closed and the repo was clean.
- Failure-path and safety checks: an unlabeled issue triggered nothing; Terraform plan for the stack was unchanged; private networking and NSGs were checked; and no secrets were found in the run logs.
- Region note: the environment is in Norway East because Sweden Central hit ACA capacity errors.
- Presenter procedure, validated 2026-10-09:
  1. `gh issue create --repo martinopedal/squad-on-aca-demo-target --title "Demo task" --body "Ask ripley to make a tiny README/doc change."`
  2. `gh issue edit <n> --repo martinopedal/squad-on-aca-demo-target --add-label squad:ripley`
  3. `gh run list --repo martinopedal/squad-on-aca-demo-target --workflow squad-queue.yml --limit 3`
  4. Watch the ACA job execution in the Azure portal under Container Apps job Execution history, or run `az containerapp job execution list`.
  5. `gh pr list --repo martinopedal/squad-on-aca-demo-target --author app/squad-on-aca-nic2026-demo --state open`
- Fallback: if live capacity or venue network fails, say it failed, show the finished issue to workflow to job to PR proof, and return to the main flow.

## Rehearsal schedule

| Date | Owners | What | Done when |
|---|---|---|---|
| Fri 9 Oct | Martin drives; Haflidi checks and times | Rehearsal 1: slides plus all live chapters, timed. Replace every "estimate, time in rehearsal 1" entry in talk docs/runbooks with actual wall time. | Chapter actuals logged; cut lines tested, not just discussed. |
| Mon 12 Oct | Martin and Haflidi | Rehearsal 2: full 60-minute run against this layout. | `s20-consumer` starts at 50:00, planned content ends by 55:00, close starts at 58:00, and the session ends by 60:00 without scheduled Q&A. |
| Tue 13 Oct | Martin and Haflidi | Dress rehearsal on presentation laptop; run preflight; recreate the clean C0 VM. | Presenter preflight green; clean VM verified; fallback evidence current. |
| Wed 14 Oct T-2h | Martin owns environment; Haflidi owns demo surfaces | Open deck locally, test speaker notes, start/verify VM, verify Bastion, start Docker Desktop, connect `/mcp`, open named sessions, load app URL once, check terminal font and display. | No red preflight item; all fallback artifacts reachable without private paths on screen. |
| Wed 14 Oct T-15m | Martin owns clock; Haflidi owns C0/C5 readiness | Re-run fast presenter checks, confirm app tab still loads, confirm VM/RDP still alive, verify clean terminal tabs, close notifications, start timer. | Ready to start; no package/login/setup work remains except deliberate C0 demo actions. |
| By 31 Oct | Martin | Destroy demo VM and Online demo; stop backup protection. | Resources removed and no ongoing demo cost. |

## T-2h preflight checklist

- [ ] Presentation laptop on power; notifications off; display duplicated; terminal font 16+.
- [ ] Local deck opens; speaker view works; appendix links return to close/appendix path.
- [ ] Presenter preflight target: 16/16.
- [ ] Docker Desktop running before C4.
- [ ] `/mcp` shows required public documentation/registry tools connected.
- [ ] Start Copilot CLI from the session repo folder, not the coordinator root:

```powershell
cd C:\git\squad-terraform-session-2026-10-14\public   # or the checkpoint worktree for this session
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
| Online app unreachable | Keep s20 diagram and state latest 29/29 runtime checks; use `a-online` only afterwards/hallway. |
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
