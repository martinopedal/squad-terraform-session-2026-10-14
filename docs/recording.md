# Record the real Copilot CLI and Squad session

Record the current real Copilot CLI shell with Squad selected. Keep using this
shell; don't open a replacement terminal or custom UI. Follow
[demo-runbook.md](demo-runbook.md) for the C1-C7 operator sequence.

The user selected `build_then_record_clean_run`: qualify the code first, then
film genuine new execution from a disclosed clean checkpoint. Qualification
work is not already-filmed evidence or the first recorded implementation.

The PowerShell/Python
helper is external FFmpeg recording tooling, not a Copilot CLI or Squad feature.
It captures an existing, explicitly approved window; it does not open an app,
render a replacement UI, watch source files, or answer permission prompts.

The custom viewer has been retired. Its private test recordings are **not product
footage** and must not appear in the public demo. There is no approved native
Plan-mode or permission-interaction recording yet.

## Keep the chosen native shell

Review the current shell's visible content and its containing window:

| Target | What to select | Boundary |
| --- | --- | --- |
| Current terminal/console | The real Copilot CLI session with Squad selected | Keep the current window, a stable title, and no unrelated visible content. |
| Current VS Code integrated terminal, if already in use | The real Copilot CLI with Squad selected | Window capture includes the editor, not just the terminal. Close unrelated tabs and panels. |

In the existing interactive CLI, confirm `/cwd`, select Squad with `/agent`, and
enter native Plan mode:

```text
/agent squad
/plan
```

These are operator actions, not something the recorder launches. Confirm the
selected agent and native Plan-mode indicator in the real UI. Authenticate
before recording, remove private context, and leave permissions under human
control. Do not add blanket allow flags or combine planning with autopilot.

No new window or capture is authorized by this document. The current product
shell stays in place. Capture readiness still requires a checked recording
method and review of actual frames.

## Known GPU-terminal limitation and normal capture

The observed `gdigrab` attempt against the GPU-rendered terminal produced black
frames. Successful encoding, progress counters, and a decodable file are not
proof that the real UI was captured. Do not substitute old custom-viewer pilots
or move the demonstration to another app to conceal this limitation.

Use normal OBS Window Capture, preferably its Windows Graphics Capture method,
or a Windows recorder that can explicitly select the current application window.
Keep microphone/desktop audio disabled. Capture only the agreed window, not the
whole display. This is external recording tooling, not a Squad capability.
Installation/configuration and a new capture still require their own approval.

After authorization, record a short bounded window test, review the first frame
and visible motion, and stop if it is black, frozen, unreadable, or exposes
private content. Then record the actual clean run. Use the recorder's normal
controls/hotkeys; no extra terminal is required. Record take IDs, wall/media
times, and chapter cues alongside the footage.

## Optional FFmpeg preflight without recording

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

## Optional FFmpeg-managed takes

The helper remains available only if capture of the current window is separately
shown to work. It is not the preferred route for the observed black-frame case.
An already agreed off-screen controller may run it attached to the session:

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

That same external controller can send the following requests after an operator
reviews the image. Don't open another terminal for the product demonstration:

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
Don't switch to desktop capture or substitute a custom app. Use the normal
window-capture route above if the current terminal cannot be captured by GDI.

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

These helper filenames/actions apply to FFmpeg-managed takes only. They do not
control OBS or attach to a Windows recorder. For normal recordings, preserve
the original video and a separate reviewed `take.json` with matching provenance.
Do not fabricate a helper manifest or claim `ApproveFrame` inspected the pixels.

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

The helper commands below require its own finalized take. For OBS/Windows media,
use the normal editor/remux workflow with source ranges, actual durations, and
source/export hashes. Preserve the original and review the resulting pixels.

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
Keep C0-C7 at 180, 180, 240, 240, 240, 300, 180, and 180 seconds, including reading
pauses. C0 is captured on the clean demo VM per [clean-machine-demo.md](clean-machine-demo.md). Label cuts, seeded defects, accelerated waits, retakes, and later
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
