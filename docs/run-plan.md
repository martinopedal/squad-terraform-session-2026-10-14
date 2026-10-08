# Run plan: NIC 2026, "From prompt to reusable Terraform"

Wednesday 2026-10-14, 10:00-11:00, Room 6. Martin Opedal and Haflidi. Deck target for the next round: 60:00 total, live-first. Terminal and browser work is live; prepared checkpoints, inherited module code, and evidence from earlier runs are disclosed fallback, not hidden proof.

Frank verdict: the 60-minute layout fits on paper, but not as casual live pair programming. C0-C7 stay at 29:00 total. There is no explicit slack inside 03:00-58:00; the only protected buffer is the 58:00-60:00 close. That means the drop order below is not optional. If C0, C3, C5, or C7 slips and the presenters do not cut at the line, the close disappears.

Decision: reuse `s01-outcome` as the 00:00-03:00 intro instead of adding a new `s00-intro`. Reason: it already carries the outcome and speaker visual, and a new slide would add navigation/test churn without improving the story. Devrel should rewrite the visual so Martin is introduced with role plus `opedal.tech`; Haflidi uses the exact live page speaker treatment (initials + GitHub handle/link only, no extra personal data). The live page speakers section may be reused as HTML or screenshot; devrel decides which renders cleaner.

Sources of truth for this plan: current `presentation\src\slides.mjs`, prior docs from `origin/docs/oct8-eval-and-hostname`, `origin/docs/playbook:docs/playbook.md`, TEAM ROOT `demo\eval-20261008\results.md`, and the decision `lead-live-timing-slack` now merged into TEAM ROOT `.squad\decisions.md`.

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

## What the extra minutes are for

The old shape was 53:00 main flow plus 7:00 scheduled Q&A. The earlier Lead decision protected a 5:00 slack bank by trimming explanatory slides. This round changes that contract:

- 00:00-03:00 is a real intro, not a rushed title slide.
- 03:00-58:00 is content plus live chapters.
- 58:00-60:00 is close plus "questions if time allows"; it is a buffer, not scheduled Q&A.
- No explicit slack remains inside 03:00-58:00.

Depth restored or added:

| Slide / chapter | Minutes | Why it earns time |
|---|---:|---|
| `s01-outcome` | 3:00 | Proper speaker intro, audience promise, and honesty rule before demos. |
| `s07-agent-setup` + `demo-c0` | 1:00 setup slide + 3:00 live | Show the Squad bootstrap path from the playbook: prerequisites, `squad init`, `copilot --agent squad`, roster/charters, `squad doctor`. |
| `s05-parallel` | 2:00 | Restore depth for the three agent lanes: `terraform-coder` writes, `terraform-validator` runs fixed offline checks, `terraform-reviewer` reviews in fresh context. |
| `s13-test-gap` | 3:00 | Restore the B1 to B1v2 repeatability lesson: ambiguous brief 0/5, state the oracle's rule, clarified brief 5/5. No causal claim; the live run still has to pass. |
| `s15-proof` | 3:00 | Restore evidence-depth language so "runtime evidence" is scoped and honest. |
| `s18-memory` | 2:00 | Restore continuity depth: saved decisions are not the same as personal memory or a whole chat transcript. |
| `s20-consumer` | 3:00 | Keep the required 30s live reveal and add enough room to explain the consumer boundary and gated pipeline. |
| `s21-limits` + close | 4:00 total | Turn the old Q&A handoff into takeaways plus a two-minute landing pad. |

## 60-minute slide schedule

| Slide ID | Start-end | Owner | Demo | Purpose / hard cue |
|---|---|---|---|---|
| `s01-outcome` | 00:00-03:00 | Martin opens; Haflidi adds honesty rule |  | Intro: who we are, roles, Martin `opedal.tech`, Haflidi live-page initials + GitHub only; what the audience will see and take away; disclose live vs prepared checkpoints/inherited code/fallback evidence. |
| `s03-baseline` | 03:00-04:00 | Martin |  | Inherited public source and clean checkpoint; not first implementation. |
| `s04-news` | 04:00-05:00 | Martin |  | CLI GA, Squad 1.0.1, and what is not used live. |
| `s04-layers` | 05:00-06:00 | Haflidi then Martin |  | CLI runs work, Squad coordinates, tools return evidence. |
| `s07-agent-setup` | 06:00-07:00 | Martin |  | Agent setup map; hand to C0 bootstrap. |
| `demo-c0` | 07:00-10:00 | Haflidi | C0 | Bootstrap from zero; cut at 09:15. |
| `s05-parallel` | 10:00-12:00 | Martin |  | Three lanes and handoffs: coder, validator, reviewer. |
| `s06-contract` | 12:00-14:00 | Haflidi |  | Platform-owned network into reusable module; caller-owned provider/backend/state. |
| `demo-c1` | 14:00-17:00 | Martin drives; Haflidi compares | C1 | Same task, fixed inputs, compare one consequence; cut at 16:15. |
| `s08-plan-boundary` | 17:00-19:00 | Haflidi |  | Extract module, not environment; approval boundary before plan. |
| `demo-c2` | 19:00-23:00 | Martin | C2 | Pin brief and approve repo-only plan; cut at 22:00. Checkpoint: must be out of C2 at 23:00. |
| `s10-tool-roles` | 23:00-24:00 | Haflidi |  | Instructions, skills, and MCP are different controls. |
| `demo-c3` | 24:00-28:00 | Martin | C3 | Route B1v2 to `terraform-coder`; cut at 27:00. |
| `s12-source-check` | 28:00-29:00 | Haflidi |  | Source claim becomes assertion. |
| `s13-test-gap` | 29:00-32:00 | Haflidi |  | B1 0/5 -> oracle rule -> B1v2 5/5; no causal claim; live still must pass. |
| `demo-c4` | 32:00-36:00 | Martin | C4 | Skill + read-only source lookup + permissions; cut at 35:00. |
| `demo-c5` | 36:00-41:00 | Haflidi | C5 | Validator before/seeded/repaired; cut at 39:45. Checkpoint: must be out of C5 at 41:00. |
| `s15-proof` | 41:00-44:00 | Haflidi with Martin handoff |  | Evidence levels; say runtime check/evidence, not proof of everything. |
| `s16-continuity` | 44:00-45:00 | Martin |  | Save the reason, not the whole chat. |
| `demo-c6` | 45:00-48:00 | Haflidi | C6 | Resume with decision/context/usage; cut at 47:15. |
| `s18-memory` | 48:00-50:00 | Martin |  | Conversation, native memory, repo knowledge: different owners. |
| `demo-c7` | 50:00-53:00 | Haflidi leads review; Martin drives handoff | C7 | Offline exits, diff, reviewer scope; cut at 52:15. |
| `s20-consumer` | 53:00-56:00 | Martin |  | 0:00-0:30 diagram; 0:30-1:00 live reveal; 1:00-2:10 gated pipeline and 29/29 runtime evidence; 2:10-3:00 boundary. Must start by 53:00; reveal is 53:30-54:00. |
| `s21-limits` | 56:00-58:00 | Haflidi then Martin |  | Three rules for the next change; no new examples. |
| `s22-questions` (retitle to close) | 58:00-60:00 | Martin closes; Haflidi available |  | Close, public handoff, appendix available afterwards/hallway. "Questions if time allows" only if ahead; not scheduled Q&A. |

Appendix slides (`a-cli-controls`, `a-automation`, `a-handoffs`, `a-integrations`, `a-squad-ops`, `a-evidence`, `a-online`, `a-security`, `a-prompts`, `a-bootstrap`, `a-use-cases`) stay after the timed deck and are used only after the close or in hallway conversations.

## Live chapter budgets and retimed cut lines

| Chapter | Slot | Budget | Cut line | If not ready at cut line |
|---|---|---:|---|---|
| C0 | 07:00-10:00 | 3:00 | 09:15 | State install/login stall, show fallback evidence, move to `s05-parallel`. |
| C1 | 14:00-17:00 | 3:00 | 16:15 | Stop comparison at one C1-A consequence and use saved C1-B excerpt. |
| C2 | 19:00-23:00 | 4:00 | 22:00 | Use saved approved plan; approval covers repo changes only. |
| C3 | 24:00-28:00 | 4:00 | 27:00 | Stop live coder turn, use B1v2 eval excerpt, no causal claim. |
| C4 | 32:00-36:00 | 4:00 | 35:00 | Say lookup unavailable live, show fallback excerpt, do not pretend success. |
| C5 | 36:00-41:00 | 5:00 | 39:45 | Stop mutation work, show saved before/seeded/repaired logs. |
| C6 | 45:00-48:00 | 3:00 | 47:15 | Show decision file and state constraints directly. |
| C7 | 50:00-53:00 | 3:00 | 52:15 | Show saved green exits and diff; do not run a second suite live. |

## Risk and slack

Frank verdict: 60 minutes of content with only the 2-minute end buffer is viable only as a rehearsed show. It is not safe if the presenters treat the live chapters as exploratory. The biggest risks remain C0 (VM/Bastion/package/login), C3 (61-114s measured coder run plus handoffs), C4 (MCP/Docker transient), C5 (multi-step mutation/repair), and C7 (full suite plus reviewer handoff).

Clock checkpoints:

| Checkpoint | Required clock | Meaning |
|---|---|---|
| After C0 | 10:00 | Bootstrap must be complete or fallback already shown. |
| After C2 | 23:00 | Plan approval is done; if behind, take the first drop before C3/C4. |
| After C5 | 41:00 | Repair story must be closed; if behind, drop `s18` depth before C6. |
| At `s20-consumer` | 53:00 | Must start consumer slide; live reveal occurs 53:30-54:00. |
| Start close | 58:00 | If not here, use `s22` as a hard stop, not a Q&A slide. |

Pre-agreed drop order if behind. These drops are preferable to silently shortening C0-C7.

| Order | Slide / segment | Save | Drop action |
|---:|---|---:|---|
| 1 | `s21-limits` | 1:30 | Compress to 0:30: one sentence, three rules move into close. |
| 2 | `s18-memory` | 1:00 | Keep only "three stores, three owners"; move taxonomy to appendix. |
| 3 | `s15-proof` | 1:00 | Read evidence ladder only; move validation depth to appendix. |
| 4 | `s13-test-gap` | 1:00 | Say B1 0/5 and B1v2 5/5; move B2/B3 detail to appendix. |
| 5 | `s05-parallel` | 1:00 | Keep lane names only; skip detailed handoff examples. |
| 6 | `s20-consumer` | 1:00 | Keep the 30s live reveal and 29/29 line; drop pipeline explanation. |
| 7 | Live chapter fallback | variable | Use the chapter cut line and saved evidence; never start a second live attempt. |

The 58:00-60:00 close may absorb small drift, but do not plan to spend it. If it is consumed, say one closing sentence and stop.

## Pre-staged before the session

These are still required. If any item is missing, use fallback evidence rather than improvising.

- Presentation laptop on power; notifications off; timer visible; terminal font 16+; browser zoom checked at venue resolution.
- Deck open locally and in presenter view; appendix navigation tested; speaker notes visible.
- Demo sessions already open, named, and at clean checkpoints; native Copilot CLI starts with intended agent selected.
- `/mcp` connected for required public documentation/registry tools; Docker Desktop running before Terraform MCP is needed.
- Worktrees at known checkpoints; evidence folders already exist and contain no private identifiers in public material.
- Clean demo VM running, reachable through Bastion, and left at the Windows Terminal PowerShell 7 profile.
- Browser tab already open to `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; certificate warning accepted; app page loaded once.
- Online app reveal verified: branded page, pipeline flow, serving pod name, and speakers section visible.
- No subscription IDs, tenant IDs, private IPs, private paths, raw state, secrets, or private run URLs on screen.

## s20-consumer live reveal (53:00-56:00)

Keep the live reveal itself exactly 30 seconds.

| Time inside slot | Wall clock | Action | Words |
|---|---|---|---|
| 0:00-0:30 | 53:00-53:30 | Point at consumer-to-module diagram | "Reuse the module code, not the private environment." |
| 0:30-1:00 | 53:30-54:00 | Live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/` | Show branded page, pipeline flow, serving pod name, and speakers section. |
| 1:00-2:10 | 54:00-55:10 | State delivery gate and runtime evidence | PR to plan to human approval to apply; 29/29 outside-in runtime checks. |
| 2:10-3:00 | 55:10-56:00 | State boundary | a-online and a-security are appendix/hallway depth, not main-flow slides. |

Use "runtime check" or "runtime evidence". Do not use stronger certainty language.

## Rehearsal schedule

| Date | Owners | What | Done when |
|---|---|---|---|
| Fri 9 Oct | Martin drives; Haflidi checks and times | Rehearsal 1: slides plus all live chapters, timed. Replace every "estimate, time in rehearsal 1" entry in talk docs/runbooks with actual wall time. | Chapter actuals recorded; cut lines tested, not just discussed. |
| Mon 12 Oct | Martin and Haflidi | Rehearsal 2: full 60-minute run against this new layout, including the 00:00-03:00 intro and 58:00-60:00 close. | `s20-consumer` starts at 53:00, close starts at 58:00, and the session ends by 60:00 without scheduled Q&A. |
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
| Online app unreachable | Keep s20 diagram and state latest 29/29 runtime checks; use a-online only afterwards/hallway. |
| Running long | Apply drop order first, then live chapter cut lines; preserve the 58:00 close if at all possible. |
| One speaker unavailable | The other reads from talk-track; owners stay visible in the plan for rehearsal. |

## Exact change list for devrel and docs mirrors

Devrel deck changes for the next round:

- `s01-outcome`: retime to 00:00-03:00 and make it the intro. Include both speakers properly, audience promise, takeaways, and honesty rule. Martin: role plus `opedal.tech`. Haflidi: exact live-page treatment, initials + GitHub only, no extra personal data. Consider reusing the live page speakers section as HTML/screenshot.
- Reorder/retime main deck to the table above: C0 before C1; `s20-consumer` at 53:00-56:00; `s21-limits` at 56:00-58:00; `s22-questions` at 58:00-60:00 and retitled/rewritten as close plus "questions if time allows".
- `s07-agent-setup` and `demo-c0`: add playbook bootstrap steps: prerequisites/install, `squad init`, `copilot --agent squad`, roster/charters, `squad doctor`.
- `s05-parallel`: expand to explain the three agent lanes and why they are separate: writer, validator with fixed offline checks, reviewer in fresh context.
- `s13-test-gap` / `a-prompts`: main-flow B1 -> B1v2 lesson must say ambiguous brief 0/5, oracle required separate asserts, clarified B1v2 5/5. No causal claim; live run still has to pass.
- `s20-consumer`: keep a 30s live reveal in notes at 53:30-54:00; show branded page, pipeline flow, serving pod name, and speakers section. Keep "runtime check/evidence" language.
- Demo notes `demo-c0` through `demo-c7`: update absolute cut-line clocks to 09:15, 16:15, 22:00, 27:00, 35:00, 39:45, 47:15, 52:15.
- Presentation tests/build assertions currently encoding old shape:
  - `presentation\scripts\build.mjs`: `protectedSlackSeconds = 300`; `s22-questions` counted as `qa`; hard error "29 demo / 19 explanation / 5 protected slack / 7 Q&A minutes, with Q&A at 53:00"; build manifest fields `explanationMinutes: 19`, `protectedSlackMinutes: 5`, `qaMinutes: 7`, `nonDemoSlideMinutes: 24`, `mainFlowMinutes: 53`, `qnaStart: '53:00'`; console log with the same text.
  - `presentation\tests\check_deck.py`: timing assertion `[29, 19, 5, 7, 24, 53, 60, "53:00"]`; prepared Q&A word-count check `650 <= qaWords <= 800`; appendix return and navigation labels that assume Q&A.
  - Replace with a 60-minute close-buffer contract. Proposed manifest: `demoMinutes=29`, `explanationMinutes=26`, `protectedSlackMinutes=0`, `closeBufferMinutes=2`, `qaMinutes=0`, `nonDemoSlideMinutes=31`, `contentEnd='58:00'`, `timedSlideMinutes=60`, `questions='if time allows'`. If the implementation keeps `qnaStart`, set it to `null` or remove it; do not leave `53:00` anywhere in tests.
  - Update the old README/deck copy that says `29-24-7` or `53+7` to `3 intro / 55 content / 2 close buffer`, with C0-C7 still 29 minutes inside the 55.

Docs mirror changes for the next round:

- `talk-track.md`: mirror the full schedule and no scheduled Q&A. Intro must state speaker identities, takeaways, and honesty rule before C0.
- `talking-points.md`: replace five-minute slack-bank language with the new drop order, retimed checkpoints, and "questions if time allows" close.
- `demo-runbook.md`: reorder C0 before C1 if devrel reorders the deck; mirror retimed cut lines and C5 Haflidi-owned validator step.
- `clean-machine-demo.md`: update C0 slot to 07:00-10:00 and cut line to 09:15; keep install stalls as fallback, not drama.
- All talk docs: use "runtime check/evidence" and avoid stronger certainty language; keep a-online and a-security as appendix/hallway depth.
