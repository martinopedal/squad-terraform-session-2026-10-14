# Record the real Copilot CLI and Squad session

Record the actual Copilot CLI terminal with Squad selected. The PowerShell/Python
helper is external FFmpeg recording tooling, not a Copilot CLI or Squad feature.
It captures an existing, explicitly approved window; it does not open an app,
render a replacement UI, watch source files, or answer permission prompts.

The custom viewer has been retired. Its private test recordings are **not product
footage** and must not appear in the public demo. There is no approved native
Plan-mode or permission-interaction recording yet.

## Choose the native window before capture

The operator must agree one of these targets and review its visible content:

| Target | What to select | Boundary |
| --- | --- | --- |
| Dedicated Windows Terminal or console | The real Copilot CLI session with Squad selected | Use one dedicated window, a unique stable title, and no unrelated tabs. |
| Dedicated VS Code window | The integrated terminal running the real Copilot CLI with Squad selected | Capture includes the entire editor window, not just the terminal. Close unrelated tabs and panels. |

Start from the public repository and use its documented native entry point:

```powershell
copilot --agent squad --plan
```

This is an operator action, not something the recorder launches. Confirm the
selected agent and native Plan-mode indicator in the real UI. Authenticate
before recording, remove private context, and leave permissions under human
control. Do not add blanket allow flags or combine planning with autopilot.

No new window or capture is authorized by these instructions alone. The next
step is agreement on the actual terminal's exact title/PID and a review of its
content. Native recording readiness remains pending a first-frame check.

## Preflight without recording

Use Python 3.12 or later, PowerShell, FFmpeg, and ffprobe on Windows. No Tk,
browser, or additional Python package is required. Run the helper from this
repository and keep raw output outside the public worktree.

After the operator identifies the target, substitute its exact top-level title:

```powershell
$captureRoot = Join-Path (Split-Path (Get-Location)) 'recordings'
$targetTitle = 'REPLACE WITH THE AGREED WINDOW TITLE'
$target = @(Get-Process | Where-Object MainWindowTitle -CEQ $targetTitle)
if ($target.Count -ne 1) { throw 'Select one unique, agreed terminal/editor window.' }
$windowPid = $target[0].Id

.\scripts\recording\Record-Demo.ps1 -Action Preflight `
  -OutputRoot $captureRoot -Consent ReviewedCli `
  -WindowTitle $targetTitle -WindowPid $windowPid
```

Use the window host's PID, not the Copilot subprocess PID. Preflight resolves its
HWND, requires one exact-title match, checks storage/tools, and rejects minimized
or ambiguous windows. It does not capture pixels or prove that Squad is selected.
`ReviewedCli` records explicit approval of this chosen window only.

## First-frame review, then the actual session

Only after the operator agrees the target and authorizes a short window test,
run a bounded pilot in a separate control terminal:

```powershell
.\scripts\recording\Record-Demo.ps1 -Action Record `
  -OutputRoot $captureRoot -TakeId native-window-pilot01 -Consent ReviewedCli `
  -WindowTitle $targetTitle -WindowPid $windowPid -MaxSeconds 90
```

The command stays attached and records only the resolved HWND. It writes
`takes\native-window-pilot01\first-frame.png`. Inspect that image before
`ApproveFrame`: it must show the actual approved CLI/editor, readable text, and
no private content. Do not enter a demo prompt or change Terraform before this
review. First-frame approval is not a Copilot permission approval.

From another control terminal, after inspecting the image:

```powershell
$captureRoot = Join-Path (Split-Path (Get-Location)) 'recordings'
.\scripts\recording\Record-Demo.ps1 -Action ApproveFrame `
  -OutputRoot $captureRoot -TakeId native-window-pilot01
.\scripts\recording\Record-Demo.ps1 -Action Stop `
  -OutputRoot $captureRoot -TakeId native-window-pilot01
.\scripts\recording\Record-Demo.ps1 -Action Verify `
  -OutputRoot $captureRoot -TakeId native-window-pilot01
```

Review the extracted frames and actual video for correct pixels, motion, and
legibility. If capture is black or frozen, stop and report the limitation.
Don't switch to desktop capture or substitute a custom app. An operator-managed
window recorder is an alternative only after separate agreement and a new test.

After that pilot passes and the operator approves the session, rerun `Record`
with a new ID such as `native-session01` and an explicit limit up to 7,200
seconds. Review its first frame again before the first prompt.

Keep the real CLI visible and interactive throughout. Record native planning,
the human revision and approval, the actual mode change, Squad routing, edits,
tool calls, checks, and repairs. A headless planning prompt is not native Plan
mode footage. The helper never automates those product interactions.

## Mark chapters and preserve evidence

Keep the master uninterrupted while adding markers:

```powershell
.\scripts\recording\Record-Demo.ps1 -Action Mark -OutputRoot $captureRoot `
  -TakeId native-session01 -Chapter C5 -Label 'Actual failed check, followed by repair'
```

Each take contains a silent 1080p, 30 fps H.264 `master.mkv`, the first frame,
private manifests, progress/error logs, markers, and verification reports.
Markers retain wall time, encoded media time, sample age, and observed lag.
Align edits against real frames, not just the last progress timestamp.

One recorded window cannot show every parallel worker. Film the coordinator's
real task views, handoffs, results, and permission decisions. Keep approved
prompts, task IDs, timestamps, diffs, and check results as separately labeled
supporting evidence. Don't imply hidden work was filmed, export private
chain-of-thought, or use a source viewer as a substitute for the product.

Only one recorder owns the output-root lock. It drains both FFmpeg pipes, waits
for frame progress, and stops if the selected window changes or progress stalls.
`Stop` or Ctrl+C sends `q` to that owned child and allows 30 seconds to finalize.
Only a stuck owned recorder can be terminated; the CLI and other processes
remain untouched. There is no full-desktop or microphone fallback.

Time-limit expiry, cancellation, and forced termination produce incomplete
takes, even if media decodes. Record, Stop, and Verify report these with a
nonzero exit status. Never reuse an existing take ID or delete a live lock.
Keep raw media/logs outside Git and cloud sync. Allow at least 3 GiB for the
pilot and budget longer recordings from the measured rate.

## Export reviewed native chapters

Use a new export name each time. A full export remuxes without re-encoding;
a chapter re-encodes for the requested cut. Both record actual duration,
source/output hashes, and provenance without changing the master.

```powershell
.\scripts\recording\Record-Demo.ps1 -Action Export -OutputRoot $captureRoot `
  -TakeId native-session01 -ExportName master-review
# Use the real reviewed start offset; this example requires enough source footage.
.\scripts\recording\Record-Demo.ps1 -Action Export -OutputRoot $captureRoot `
  -TakeId native-session01 -ExportName C2 -StartSeconds 120 -DurationSeconds 240
```

The export helper refuses retired custom-viewer takes. Keep those raw pilots
private as diagnostics; decoding successfully did not make them product footage.
Keep C1-C7 at 180, 240, 240, 240, 300, 180, and 180 seconds, including reading
pauses. Label cuts, seeded defects, accelerated waits, retakes, and later
evidence honestly. Review each public export before placing it in Reveal.

The later 60-minute two-speaker audio recording requires separate consent and
audio checks. This helper does not enable a microphone.

## Safe tests without a window

```powershell
python -B -m unittest discover -s .\scripts\recording -p 'test_*.py' -v
```

Tests use fixture processes and explicitly synthetic media only. They cover
retired-option refusals, exact-window dispatch, ownership, cancellation,
finalization, decoding, and export provenance. They do not open a terminal,
create a viewer, capture desktop pixels, or prove native CLI recording readiness.
