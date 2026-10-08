# Run plan: NIC 2026, "From prompt to reusable Terraform"

Wednesday 2026-10-14, 10:00-11:00, Room 6. Martin Opedal and Haflidi Fridthjofsson. Deck 0.19.1. The delivery model is live-first: the terminal and browser are live, and recordings/screenshots are optional fallback only.

Frank verdict: this is good enough for a proper 60-minute session only if it is run as a timed show, not as open-ended pair programming. Keep the C0-C7 chapter lengths unchanged at 29:00, protect at least 5:00 of slack, and switch at every 75% cut line. The at-risk areas are model latency in C3/C5/C7, multi-step agent handoffs, Terraform MCP/Docker startup in C4, and the clean VM/Bastion path in C0.

Sources of truth: [talk-track.md](talk-track.md), [talking-points.md](talking-points.md), [demo-runbook.md](demo-runbook.md), [clean-machine-demo.md](clean-machine-demo.md), and [online-demo.md](online-demo.md). Timing evidence below is cited only as public numbers from the Oct 8 eval, Oct 5 dry run, and preflight.

## Evidence used for timing

| Evidence | Public numbers to use |
|---|---|
| Oct 8 eval, B1v2 clarified coder runs | 5/5 green; total durations 108.0s, 97.1s, 87.8s, 61.0s, 113.7s; range 61-114s |
| Oct 8 eval, original B1 runs | 0/5 green; total durations 60.6s, 117.3s, 61.9s, 58.1s, 55.6s |
| Oct 8 eval, B2 runs | 5/5 green; total durations 70.3s, 153.3s, 120.1s, 82.9s, 98.1s |
| Oct 8 eval, B3 runs | 4/5 green; total durations 86.2s, 117.8s, 127.1s, 138.3s, 103.9s |
| Oct 8 eval smoke | 37.0s, exit 0; Terraform MCP available; Microsoft Learn MCP available after one transient retry |
| Oct 5 dry run | C5 module test produced 52/52 pass before and after repair; seeded mutation produced 51/52 pass and one intended failure; C7 example test produced 2/2 pass |
| Preflight | Presenter preflight is the gate; target is 16/16 before delivery |
| Missing wall times | Marked below as "estimate, time in rehearsal 1" and must be replaced after Fri 9 Oct rehearsal 1 |

## Pre-staged before the session

These are required. If any item is missing, use fallback evidence rather than improvising.

- Presentation laptop on power; notifications off; timer visible; terminal font 16+; browser zoom checked at venue resolution.
- Deck open locally and in presenter view; appendix navigation tested; speaker notes visible.
- Demo sessions already open, named, and at their clean checkpoint; native Copilot CLI starts with the intended agent selected.
- `/mcp` connected for required public documentation/registry tools; Docker Desktop running before Terraform MCP is needed.
- Worktrees at known checkpoints; evidence folders already exist but contain no private identifiers in public material.
- Clean demo VM running, reachable through Bastion, and left at the Windows Terminal PowerShell 7 profile.
- Browser tab already open to `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; certificate warning accepted; app page loaded once.
- Online app reveal verified: branded page, pipeline flow, serving pod name, and speakers section visible.
- No subscription IDs, tenant IDs, private IPs, private paths, raw state, secrets, or private run URLs on screen.

## Live timing budget by demo chapter

### C0 — From zero to a squad (3:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Show Git, Copilot CLI, and Squad absent | Haflidi types / Haflidi talks | 0:20 | estimate, time in rehearsal 1 | 0:20 |
| Run the three WinGet installs and version checks | Haflidi types / Martin timeboxes | 0:55 | estimate, time in rehearsal 1; no reliable live install wall time yet | 1:15 |
| Copilot `/login`, then exit | Haflidi types / Haflidi talks | 0:35 | estimate, time in rehearsal 1 | 1:50 |
| Clone public module, run `squad init`, show short diff | Haflidi types / Martin talks | 0:35 | clean-machine runbook says `squad init` is about 2s; rest estimate | 2:25 |
| `copilot --agent squad`, paste team prompt, confirm roster, `squad doctor` | Haflidi types / Haflidi talks | 0:35 | estimate, time in rehearsal 1 | 3:00 |

Pre-staged before session: VM recreated or verified clean; Bastion already connected; PowerShell 7 tab open; package source agreements accepted by flags; terminal zoom set; no secrets in clipboard.

Cut line at 75%: 2:15. If installs or login are not complete by 2:15, state the live stall, show the fallback evidence, and move to `s05-parallel`. Do not spend Q&A time on installing tools.

### C1 — Same task, different choices (3:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Start `/new`, select Squad, show `/model`, enter Plan mode | Martin types / Haflidi talks | 0:35 | estimate, time in rehearsal 1 | 0:35 |
| Run C1-A plan-only prompt | Martin types / Haflidi narrates | 0:55 | estimate, time in rehearsal 1 | 1:30 |
| Run C1-B with same model, permissions, and team state | Martin types / Haflidi narrates | 0:55 | estimate, time in rehearsal 1 | 2:25 |
| Compare one real consequence, not a beauty contest | Martin types / Haflidi talks | 0:35 | estimate, time in rehearsal 1 | 3:00 |

Pre-staged before session: both C1 prompt blocks ready; sessions named C1-A/C1-B; same model and permission profile visible; saved excerpts ready if output drifts.

Cut line at 75%: 2:15. If C1-B is still generating, stop comparison at one clear C1-A consequence and use the saved C1-B excerpt.

### C2 — Pin the brief, approve a plan (4:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Open guided clean run; attach the three files | Martin types / Martin talks | 0:35 | estimate, time in rehearsal 1 | 0:35 |
| Paste bounded plan prompt | Martin types / Haflidi challenges scope | 0:45 | estimate, time in rehearsal 1 | 1:20 |
| Inspect `/session plan`; revise once | Martin types / Martin talks | 1:20 | estimate, time in rehearsal 1 | 2:40 |
| State approval boundary: code/test/docs only, no Azure apply | Martin types / Haflidi confirms | 0:45 | estimate, time in rehearsal 1 | 3:25 |
| Leave 0:35 for slow screen switching | Martin watches clock | 0:35 | slack inside chapter | 4:00 |

Pre-staged before session: checkpoint shell open; file paths copied; approval language rehearsed; Plan-mode fallback screenshot ready.

Cut line at 75%: 3:00. If the plan is not ready by 3:00, use the saved approved plan and state that approval covers only repository changes.

### C3 — Activate Squad, route work (4:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Show Squad selected, `/tasks`, `/agent list`, `/mcp` | Martin types / Haflidi talks | 0:40 | estimate, time in rehearsal 1 | 0:40 |
| Paste the B1v2 routing brief with four separate asserts | Martin types / Martin talks | 0:35 | estimate, time in rehearsal 1 | 1:15 |
| Switch to `terraform-coder` and run the focused file-edit brief | Martin types / Haflidi reads evidence | 1:30 | Oct 8 eval B1v2 coder runs were 61-114s | 2:45 |
| Return to Squad; name owner, checks, and unresolved issues | Martin types / Haflidi talks | 0:45 | estimate, time in rehearsal 1 | 3:30 |
| Chapter buffer | Martin watches clock | 0:30 | slack inside chapter | 4:00 |

Pre-staged before session: B1v2 prompt copied exactly; checkpoint can be reset; fallback B1v2 eval excerpt ready; no causal claim from B1v2 to live result.

Cut line at 75%: 3:00. If the coder is still generating at 3:00, stop the live turn, use the saved B1v2 excerpt, and move to C4 with the same boundary.

### C4 — Ground with tools (4:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Show `test-discipline` skill and `/mcp` status | Martin types / Haflidi talks | 0:35 | Oct 8 eval smoke proved tool availability in 37.0s | 0:35 |
| Run read-only source-grounding prompt | Martin types / Martin talks | 1:05 | Oct 8 eval smoke had one transient MCP retry; estimate for live lookup | 1:40 |
| Point at source URL/version and permission boundary | Martin types / Haflidi explains | 0:50 | estimate, time in rehearsal 1 | 2:30 |
| Show `/permissions`; state no Azure account contact | Martin types / Haflidi talks | 0:40 | estimate, time in rehearsal 1 | 3:10 |
| Chapter buffer | Martin watches clock | 0:50 | slack inside chapter | 4:00 |

Pre-staged before session: Docker Desktop running; required MCP servers already connected; fallback `c4-source` excerpt sanitized; one retry allowed, not a retry loop.

Cut line at 75%: 3:00. If MCP/Docker is not healthy by 3:00, say the lookup is unavailable live, show the fallback excerpt, and do not pretend it succeeded.

### C5 — Catch a mistake, repair (5:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Select `terraform-validator`; run clean check | Haflidi types / Martin talks | 0:40 | Oct 5 dry run: module test reached 52/52 pass | 0:40 |
| Ask coder to seed `enablePrivateCluster` false | Haflidi types / Martin narrates | 1:10 | estimate, time in rehearsal 1; model latency risk | 1:50 |
| Rerun validator and show intended failure | Haflidi types / Haflidi talks | 0:40 | Oct 5 dry run: 51/52 pass, one intended failure | 2:30 |
| Review, restore only that field, show `/diff` | Haflidi types / Martin explains repair | 1:15 | estimate, time in rehearsal 1 | 3:45 |
| Rerun same validator block; state repaired result | Haflidi types / Haflidi talks | 0:45 | Oct 5 dry run: repaired module test reached 52/52 pass | 4:30 |
| Chapter buffer | Martin watches clock | 0:30 | slack inside chapter | 5:00 |

Pre-staged before session: validator shell ready; environment scrub command copied; three log names chosen; seeded mutation can be applied from fallback if the model turn runs long.

Cut line at 75%: 3:45. If the repair is not ready by 3:45, stop live mutation work, show saved seeded-failure and repaired logs, then continue. Haflidi runs the validator.

### C6 — Resume with decisions (3:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Show the public-only decision record | Martin types / Haflidi leads | 0:35 | estimate, time in rehearsal 1 | 0:35 |
| `/new`, `/resume guided-clean-run`, `/cwd` | Martin types / Haflidi talks | 0:45 | estimate, time in rehearsal 1 | 1:20 |
| `/context` and `/usage` | Martin types / Martin verifies | 0:35 | estimate, time in rehearsal 1 | 1:55 |
| Ask resumed task to cite the decision and constraints | Martin types / Haflidi talks | 0:50 | estimate, time in rehearsal 1 | 2:45 |
| Chapter buffer | Martin watches clock | 0:15 | slack inside chapter | 3:00 |

Pre-staged before session: decision excerpt sanitized and ready; unrelated personal memory or session list not shown; resume target known.

Cut line at 75%: 2:15. If resume/search is slow by 2:15, show the decision file and state the constraints directly.

### C7 — Reviewed diff (3:00)

| Step | Who types / who talks | Expected wall time | Evidence basis | Cumulative |
|---|---|---:|---|---:|
| Select `terraform-validator`; run offline suite or show already-running exits | Haflidi types / Martin talks | 1:10 | Oct 5 dry run: module test 52/52 and example test 2/2; full live suite wall time still estimate | 1:10 |
| Show `/diff` and sanitized evidence boundary | Martin types / Haflidi leads review | 0:45 | estimate, time in rehearsal 1 | 1:55 |
| Start `terraform-reviewer`; name exact approval scope | Martin types / Haflidi talks | 0:50 | estimate, time in rehearsal 1 | 2:45 |
| Chapter buffer | Martin watches clock | 0:15 | slack inside chapter | 3:00 |

Pre-staged before session: offline suite can run from a prepared shell; logs have no private IDs; reviewer prompt copied; no private plans or raw state on screen.

Cut line at 75%: 2:15. If the full suite is not done by 2:15, show the saved green exits and diff; do not run a second suite live.

## Minute-by-minute run sheet

The C-chapter lengths remain unchanged. The cuts below are pre-authorized and should be used before Q&A is consumed. Recovered time is held as a slack bank; if unused, it becomes extra Q&A after 53:00.

| Time | Slide | Lead | Demo | Cue and fallback |
|---|---|---|---|---|
| 00:00-01:00 | s01-outcome | Martin | | Introduce both speakers; honesty rule before any demo |
| 01:00-04:00 | demo-c1 | Haflidi | C1 | `/model`, selected agent, one consequence; cut at 2:15 inside chapter |
| 04:00-05:00 | s03-baseline | Martin | | Shorten to 0:30; move source-detail narration to appendix; bank 0:30 |
| 05:00-06:00 | s04-news | Martin | | Shorten to 0:30; one headline plus Squad version; bank 0:30 |
| 06:00-07:00 | s04-layers | Haflidi then Martin | | Trace the arrows; no cut unless already behind |
| 07:00-08:00 | s07-agent-setup | Martin | | Hand to Haflidi: "show them how you get here from nothing" |
| 08:00-11:00 | demo-c0 | Haflidi | C0 | Live fallback: pre-connected VM; give up after 2:15 chapter cut line |
| 11:00-12:00 | s05-parallel | Martin | | Checkpoint 1: 12:00; if behind, spend banked time, not Q&A |
| 12:00-14:00 | s06-contract | Haflidi | | Platform-owned network into module |
| 14:00-18:00 | demo-c2 | Martin | C2 | `/plan`, approved criteria; cut at 3:00 inside chapter |
| 18:00-20:00 | s08-plan-boundary | Haflidi | | Boundary warning reveal |
| 20:00-24:00 | demo-c3 | Martin | C3 | B1v2 brief, `/agent`, `/tasks`, handoff; cut at 3:00 inside chapter |
| 24:00-25:00 | s10-tool-roles | Haflidi | | Shorten to 0:30; keep three columns only; bank 0:30 |
| 25:00-29:00 | demo-c4 | Martin | C4 | Source grounding, `/skills`, MCP lookup, `/permissions`; cut at 3:00. Checkpoint 2: 29:00 |
| 29:00-30:00 | s12-source-check | Haflidi | | Reveal the assertion |
| 30:00-32:00 | s13-test-gap | Haflidi | | Shorten to 1:00; move B1/B2/B3 detail to appendix; bank 1:00 |
| 32:00-37:00 | demo-c5 | Haflidi | C5 | Validator before/seeded/repaired; cut at 3:45 inside chapter |
| 37:00-40:00 | s15-proof | Haflidi | | Use "runtime check/evidence"; avoid certainty language; shorten to 2:00; move depth to appendix; bank 1:00. Checkpoint 3: 40:00 |
| 40:00-41:00 | s16-continuity | Martin | | Decision map |
| 41:00-44:00 | demo-c6 | Haflidi | C6 | `/resume`, `/context`, `/usage`; cut at 2:15 inside chapter |
| 44:00-46:00 | s18-memory | Martin | | Shorten to 1:00; move memory taxonomy depth to appendix; bank 1:00 |
| 46:00-49:00 | demo-c7 | Haflidi | C7 | `/diff`, review handoff; cut at 2:15. Checkpoint 4: 49:00 |
| 49:00-51:00 | s20-consumer | Martin | | 0:00-0:30 diagram; 0:30-1:00 live reveal of `https://aks-online-demo.swedencentral.cloudapp.azure.com/`; 1:00-1:35 gated pipeline line; 1:35-2:00 runtime checks and boundary |
| 51:00-53:00 | s21-limits | Haflidi then Martin | | Shorten to 1:30; three rules only; bank 0:30; Martin opens Q&A at 53:00 |
| 53:00-60:00 | s22-questions | Martin hosts | | Q&A; appendix only on demand: a-online, a-security, a-prompts, a-bootstrap, a-use-cases |
| Slack | time bank | Martin owns clock | | Target recovered slack: 5:00. Spend only on live stalls. Keep at least 5:00 audience Q&A unless a chapter visibly fails and must be explained honestly. |

## s20-consumer live reveal (49:00-51:00)

Keep this slot exactly 2:00.

| Time inside slot | Action | Words |
|---|---|---|
| 0:00-0:30 | Point at consumer-to-module diagram | "Reuse the module code, not the private environment." |
| 0:30-1:00 | Live reveal `https://aks-online-demo.swedencentral.cloudapp.azure.com/` | Show branded page, pipeline flow, serving pod name, and speakers section. |
| 1:00-1:35 | State the delivery gate | "The consumer path is PR to plan to human approval to apply." |
| 1:35-2:00 | State runtime evidence | "Outside-in runtime checks are 29/29: hostname HTTPS response, expected title, redirect and security posture checks. a-online and a-security are Q&A depth, not main-flow slides." |

Use "runtime check" or "runtime evidence". Do not use stronger certainty language.

## Risk and slack

Does the 53-minute main flow fit live? Yes, narrowly, if the team enforces the cut lines. Without cuts, it is not good enough: model latency and C0/C4 infrastructure startup can easily consume the seven-minute Q&A.

At-risk chapters:

- C0: VM/Bastion plus package install timing. Cut at 2:15 and move on.
- C3: B1v2 coder run has measured 61-114s before surrounding handoffs. Cut at 3:00.
- C4: MCP/Docker can be cold or transient. One retry only; then fallback.
- C5: multi-step validate-mutate-review-repair loop. Cut at 3:45.
- C7: full offline suite plus reviewer handoff can overrun. Cut at 2:15.

Concrete cuts already applied to the run sheet without changing C0-C7 lengths:

| Slide | Cut or move | Minutes recovered |
|---|---|---:|
| s03-baseline | Keep the source pin; move detailed provenance to appendix/Q&A | 0:30 |
| s04-news | One headline plus Squad 1.0.1; move product-tile detail to Q&A | 0:30 |
| s10-tool-roles | Keep only instructions/skills/MCP distinction | 0:30 |
| s13-test-gap | Move B1/B2/B3 eval detail to a-prompts | 1:00 |
| s15-proof | Read evidence levels only; move validation depth to a-online/a-security/a-evidence; use "runtime check/evidence" | 1:00 |
| s18-memory | Move memory taxonomy and `/compact`/nap detail to a-squad-ops | 1:00 |
| s21-limits | Three rules and close; no new examples | 0:30 |
| **Total** |  | **5:00** |

Resulting slack: 5:00 protected slack bank inside the 53-minute main flow, plus a 7:00 Q&A window starting at 53:00. The floor rule is that at least 5:00 remains for audience questions. If a chapter overruns, spend the slack bank first, then compress Q&A only down to 5:00.

Decision for Martin: C-chapter lengths remain unchanged. If rehearsal 1 shows C0, C3, C5, or C7 cannot meet their 75% cut lines with fallback, then change chapter lengths explicitly; do not silently steal time from Q&A.

## Rehearsal schedule

| Date | Owners | What | Done when |
|---|---|---|---|
| Fri 9 Oct | Martin drives; Haflidi checks and times | Rehearsal 1: slides plus all live chapters, timed. Replace every "estimate, time in rehearsal 1" entry above with actual wall time. | Chapter actuals recorded in this run plan; cut lines tested, not just discussed. |
| Mon 12 Oct | Martin and Haflidi | Rehearsal 2: full 60-minute run with Haflidi, including handoffs and Q&A transition. | Main flow reaches Q&A by 53:00 with at least 5:00 slack preserved. |
| Tue 13 Oct | Martin and Haflidi | Dress rehearsal on presentation laptop; run preflight; recreate the clean C0 VM. | Presenter preflight green; clean VM verified; fallback evidence current. |
| Wed 14 Oct T-2h | Martin owns environment; Haflidi owns demo surfaces | Open deck locally, test speaker notes, start/verify VM, verify Bastion, start Docker Desktop, connect `/mcp`, open named sessions, load app URL once, check terminal font and display. | No red preflight item; all fallback artifacts reachable without private paths on screen. |
| Wed 14 Oct T-15m | Martin owns clock; Haflidi owns C0/C5 readiness | Re-run fast presenter checks, confirm app tab still loads, confirm VM/RDP still alive, verify clean terminal tabs, close notifications, start timer. | Ready to start; no package/login/setup work remains except the deliberate C0 demo actions. |
| By 31 Oct | Martin | Destroy demo VM and Online demo; stop backup protection. | Resources removed and no ongoing demo cost. |

## T-2h preflight checklist

- [ ] Presentation laptop on power; notifications off; display duplicated; terminal font 16+.
- [ ] Local deck opens; speaker view works; appendix links return to Q&A.
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
| Online app unreachable | Keep s20 diagram and state latest 29/29 runtime checks; use a-online only if asked. |
| Running long | Apply 75% cut lines; spend slack bank; preserve at least 5:00 Q&A. |
| One speaker unavailable | The other reads from talk-track; owners stay visible in the plan for rehearsal. |

## Exact change list for devrel and docs mirrors

Devrel deck changes for the next round:

- `s03-baseline`: shorten note to 30 seconds; move detailed provenance to appendix/Q&A wording.
- `s04-news`: shorten note to 30 seconds; keep one headline plus Squad 1.0.1, not every product tile.
- `s10-tool-roles`: shorten to 30 seconds; notes should say only instructions, skills, and MCP have different jobs.
- `s13-test-gap`: shorten main-flow note to 1 minute; move B1/B2/B3 detailed eval numbers to `a-prompts`.
- `s15-proof`: keep technical slide ID if needed, but spoken title/notes must use "Evidence has levels" and "runtime check/evidence"; avoid stronger certainty language.
- `s18-memory`: shorten to 1 minute; move memory taxonomy and `/compact`/nap details to `a-squad-ops`.
- `s20-consumer`: add 30-second live reveal instructions for the public app URL; show branded page, pipeline flow, serving pod name, and speakers section; include the gated pipeline line and 29/29 outside-in runtime checks.
- `s21-limits`: shorten to 1:30; three rules only, then Q&A handoff.
- Demo slide notes `demo-c0` through `demo-c7`: add the 75% cut line and fallback trigger from this plan.

Docs mirror changes for the next round:

- `talk-track.md`: mirror the shortened main-flow narration, especially s13, s15, s18, s20, and s21.
- `talking-points.md`: add the 5:00 slack bank, 75% cut-line rule, and s20 live reveal bullets.
- `demo-runbook.md`: mirror the C1-C7 cut lines, pre-staged requirements, and Haflidi-owned C5 validator step.
- `clean-machine-demo.md`: mirror C0's 2:15 cut line and the rule that install stalls switch to fallback evidence.
- All talk docs: use "runtime check/evidence" and avoid stronger certainty language; keep a-online and a-security as Q&A depth.
