# Run plan: NIC 2026, "From prompt to reusable Terraform"

Wednesday 2026-10-14, 10:00-11:00, Room 6. Martin Opedal and Haflidi Fridthjofsson. Deck 0.17: 1 opening page, 25 timed slides, 11 appendix references; 29 minutes recorded, 24 live, 7 Q&A.

Sources of truth: [talk-track.md](talk-track.md) (full script, read by the deck build), [talking-points.md](talking-points.md) (cheat sheet), [demo-runbook.md](demo-runbook.md) (C1-C7), [clean-machine-demo.md](clean-machine-demo.md) (C0), [online-demo.md](online-demo.md) (Online landing zone). Operator scripts live in the module repository under `scripts\`.

## Countdown (proposed; confirm with Haflidi)

| Day | Who | What | Done when |
|---|---|---|---|
| Wed 07 Oct | Martin | Deck 0.17 with C0, runbooks, demo VM proven clean | `npm test` green; `Test-DemoVm.ps1` 14/14 |
| Thu 08 Oct | Haflidi | Accept repo and environment invites; read talk track; Martin resets Haflidi's VM local login | Haflidi can open the deck and Bastion |
| Thu 08 Oct | Both | Rehearsal 1: read-through with the clock, slides only, 60 minutes on Teams | Each section within plus or minus 30 seconds |
| Thu 08-Fri 09 | Haflidi | Record C0 on the VM (clean reset first) | `media/C0.mp4` reviewed, 3:00 |
| Fri 09 Oct | Martin drives, Haflidi checks | Record C1-C4 in the native CLI with Squad selected | 4 reviewed exports |
| Sat 10-Sun 11 | Martin, Haflidi | Record C5-C7; retakes | 8/8 clips reviewed; `media.json` `reviewed: true` |
| Mon 12 Oct | Both | Attach clips, rebuild deck (0.18), Rehearsal 2: full timed run with clips | Under 53:00 before Q&A |
| Tue 13 Oct | Both | Dress rehearsal on the presentation laptop; T-24h preflight; `recreate-vm` | Preflight all green |
| Wed 14 Oct | Both | T-2h and T-15m preflight; deliver | Session ends at 11:00 |
| By 31 Oct | Martin | Destroy demo VM and Online demo; stop backup protection | Resource groups empty, no cost |

## Recording plan (0 of 8 recorded)

Every clip is genuine native Copilot CLI output with the agent shown on screen. Label cuts, sped-up waits and seeded defects in the clip. Never attach an unreviewed clip.

| Clip | Length | Lead | Operator | Where | Runbook | Status |
|---|---|---|---|---|---|---|
| C0 From zero to a squad | 3:00 | Haflidi | Haflidi | Clean demo VM via Bastion | clean-machine-demo.md | pending |
| C1 Same task, different choices | 3:00 | Haflidi | Martin | Checkpoint shell, Squad selected | demo-runbook.md C1 | pending |
| C2 Pin the brief, approve a plan | 4:00 | Martin | Martin | Checkpoint shell, Plan mode | demo-runbook.md C2 | pending |
| C3 Activate Squad, route work | 4:00 | Martin | Martin | `/agent terraform-coder` | demo-runbook.md C3 | pending |
| C4 Ground with tools | 4:00 | Martin | Martin | Skills, MCP, permissions | demo-runbook.md C4 | pending |
| C5 Catch a mistake, repair | 5:00 | Haflidi | Martin | `terraform-validator`, seeded mutation | demo-runbook.md C5 | pending |
| C6 Resume with decisions | 3:00 | Haflidi | Martin | `/resume`, decisions file | demo-runbook.md C6 | pending |
| C7 Reviewed diff | 3:00 | Haflidi | Martin | `terraform-reviewer`, offline suite | demo-runbook.md C7 | pending |

## Minute-by-minute run sheet

Clip = press **Open local MP4** on the chapter slide. If a clip fails, stay on the chapter slide and narrate its three points (the slide is a viewing guide).

| Time | Slide | Lead | Clip | Cue and fallback |
|---|---|---|---|---|
| 00:00-01:00 | s01-outcome | Martin | | Introduce both speakers; honesty rule before any demo |
| 01:00-04:00 | demo-c1 | Haflidi | C1 | `/model`, selected agent, one consequence |
| 04:00-05:00 | s03-baseline | Martin | | Source pin; disclose preparation |
| 05:00-06:00 | s04-news | Martin | | Dates and status labels; end on the Squad 1.0.1 tile |
| 06:00-07:00 | s04-layers | Haflidi then Martin | | Trace the arrows |
| 07:00-08:00 | s07-agent-setup | Martin | | Hand to Haflidi: "show them how you get here from nothing" |
| 08:00-11:00 | demo-c0 | Haflidi | C0 | Live fallback: pre-connected VM; give up after 60 seconds of stall |
| 11:00-12:00 | s05-parallel | Martin | | **Checkpoint 1: 12:00** |
| 12:00-14:00 | s06-contract | Haflidi | | Platform-owned network into module |
| 14:00-18:00 | demo-c2 | Martin | C2 | `/plan`, approved criteria |
| 18:00-20:00 | s08-plan-boundary | Haflidi | | Boundary warning reveal |
| 20:00-24:00 | demo-c3 | Martin | C3 | `/agent`, `/tasks`, handoff |
| 24:00-25:00 | s10-tool-roles | Haflidi | | Three columns |
| 25:00-29:00 | demo-c4 | Martin | C4 | `/skills`, MCP lookup, `/permissions`. **Checkpoint 2: 29:00** |
| 29:00-30:00 | s12-source-check | Haflidi | | Reveal the assertion |
| 30:00-32:00 | s13-test-gap | Haflidi | | First cut if behind: shorten to 1 minute |
| 32:00-37:00 | demo-c5 | Haflidi | C5 | Command, exit code, rerun |
| 37:00-40:00 | s15-proof | Haflidi | | Read status labels exactly. **Checkpoint 3: 40:00** |
| 40:00-41:00 | s16-continuity | Martin | | Decision map |
| 41:00-44:00 | demo-c6 | Haflidi | C6 | `/resume`, `/context`, `/usage` |
| 44:00-46:00 | s18-memory | Martin | | Second cut if behind: shorten to 1 minute |
| 46:00-49:00 | demo-c7 | Haflidi | C7 | `/diff`, review handoff. **Checkpoint 4: 49:00** |
| 49:00-51:00 | s20-consumer | Martin | | Consumer into module |
| 51:00-53:00 | s21-limits | Haflidi then Martin | | Three closing rules |
| 53:00-60:00 | s22-questions | Martin hosts | | Appendix only on demand: a-online, a-security, a-prompts, a-bootstrap, a-use-cases (End key) |

Timing rule: at each checkpoint, if more than 60 seconds behind, apply the next cut. Never cut a clip or the honesty statements. Q&A absorbs the rest.

## Preflight

### T-24h (Tuesday)

From the module repository, with `$env:AZURE_SUBSCRIPTION_ID_ONLINE` set off screen:

- [ ] `.\scripts\Invoke-GatedRun.ps1 -Workflow deploy-online.yml -Inputs 'apply=false' -StartRunner` succeeds with no changes (proves runner, OIDC, gate, state).
- [ ] `.\scripts\Test-OnlineSecurity.ps1` reports 0 failed (HTTPS 200, redirect, authorized IPs, Entra-only, policy).
- [ ] `.\scripts\Invoke-GatedRun.ps1 -Workflow deploy-demo-vm.yml -Inputs 'action=recreate-vm' -StartRunner`, then `.\scripts\Test-DemoVm.ps1` reports 14/14 including the clean-start checks.
- [ ] Deck: `npm test` in `presentation\` passes; all 8 clips open from the presentation laptop's `media\` folder.
- [ ] Copy the deck folder (self-contained `index.html` plus `media\`) to a USB stick.

### T-2h

- [ ] Presentation laptop on power, notifications off, display duplicated at 1920x1080 (deck also verified at 1280x720).
- [ ] Open `presentation\index.html` locally; speaker view (S) on the laptop screen.
- [ ] Play the first 5 seconds of each clip once; audio muted.
- [ ] `.\scripts\Test-DemoVm.ps1` passes again (auto-shutdown is 19:00, so the VM must be started if it was stopped).

### T-15m

- [ ] `.\scripts\Connect-DemoVm.ps1` and leave the Bastion RDP window minimized, PowerShell 7 tab open (C0 live fallback).
- [ ] Browser tab with the Online app (the `App URL` line printed by `Test-OnlineSecurity.ps1`), certificate warning already accepted: the ingress uses the NGINX default certificate (a-online question fallback).
- [ ] Deck on the opening page; timer ready; water.

## Fallback matrix

| Failure | Response |
|---|---|
| Clip will not play | Stay on the chapter slide, narrate its three points, move on at the slot end |
| Venue network down | Deck and clips are local; skip live VM and Online app; appendix slides carry the evidence |
| Demo VM unreachable | C0 clip only; say the VM is the rehearsal machine |
| Online cluster question with no network | `a-online` slide; refer to the pipeline runs listed in online-demo.md |
| Running long | Apply cuts at checkpoints; Q&A shrinks, never clips |
| One speaker unavailable | The other reads that speaker's lines from talk-track.md; it is complete for both voices |
