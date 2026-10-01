# Present and maintain the deck

Martin, Haflidi, and the presentation operator can use this directory to build, rehearse, and deliver the offline Reveal.js deck. Contributors can update approved evidence without replacing the slide design or the spoken script.

## Open the presentation

From this directory, run `npm run serve`, then open <http://127.0.0.1:4173/presentation/index.html> in Edge or Chromium. The server exposes only the public worktree, so links to the public documents work too. The generated `index.html` contains Reveal.js 5.2.1, its notes and highlight plugins, the theme, and the diagrams. Serving the existing HTML requires Python, not npm dependencies. The equivalent command is:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory ..
```

Press `S` or select **Speaker notes** to open current/next slides, the complete spoken notes, and the timer. Allow the local popup. The spoken script appears first; expand **Operator cues and timing** for capture details and handoffs. Use arrows or Page Up/Down to advance, Home/End for the first/last slide, Escape for overview, and **Chapters** for named navigation. Video controls retain their native keyboard behavior while focused. There is no automatic slide advance or video autoplay.

The 22 main slides allocate 26 minutes to silent chapter video with live narration, 27 minutes to other live explanation, and seven minutes to Q&A. Six appendix slides are question-driven references, not additional scheduled content. [The talk track](../docs/talk-track.md) includes both speakers and a separately labeled prepared Q&A fallback.

## Build

The exact package versions and lock file make the deck build reproducible. The lock omits machine-specific registry URLs, so consumers use their configured registry:

```powershell
npm ci --no-audit --no-fund
npm run build
```

Edit `src\slides.mjs` for composition, `src\theme.css` for the fixed Fluent design, and `src\runtime.js` for presenter/media behavior. The build reads complete notes from `..\docs\talk-track.md`. Keep its stable slide headings. Diagrams are authored as static SVG in `src\diagrams.mjs` and inlined at build time, with no browser diagram renderer.

The design is fixed: 1280 x 720, white and near-white surfaces, `#464FEB` accent, dark readable text, system fonts, and restrained motion. This is a screen-only deck. No print or PowerPoint output is maintained.

Before each content revision, preserve the previous generated HTML outside the release package. Increment `src\version.json` in the same revision. Keep `0.x` until the presenters approve the final content.

## Attach recordings and evidence

No chapter recording or deployment success is supplied with this build. The chapter cards state **Recording not attached yet**. They are viewing guides, not simulated CLI interfaces or executed evidence.

Only genuine Copilot CLI with Squad selected, standalone or in a real integrated terminal, qualifies as product footage. Capture controllers stay off-screen as external tooling. Do not attach custom-viewer recordings, artifact-pilot frames, or fabricated terminal output.

For a temporary local rehearsal, choose **Open local MP4** on a chapter. The browser reads that file locally; nothing is uploaded. Native controls support play, pause, seek, and replay. The selection lasts only until reload and stays labeled **Local preview: review pending**.

For a persistent package, place the seven reviewed files at `media\C1.mp4` through `media\C7.mp4`. In `src\media.json`, set `reviewed: true`, a nonempty `takeId`, `sourceSurface` to `native-copilot-cli` or `integrated-terminal`, and `selectedAgent` to `squad`. Then rebuild. Unreviewed files never attach automatically; the build reports their exclusion and keeps the slot pending.

Retain provenance and edit records outside the deck's public package. Durations, including title cards, must be 3, 4, 4, 4, 5, 3, and 3 minutes. The build rejects unsupported surfaces or incomplete reviewed entries. Those metadata checks are not image analysis: the recording owner must verify the actual UI, selected agent, content, and duration before approving a clip.

Pin and display the actual recording executable's version. The [verified feature guide](../docs/feature-guide.md) probed CLI 1.0.88 directly, while the unqualified command resolved to 1.0.89. `--no-auto-update` is not a version selector. C2 must retain interactive Plan mode and human approval; never use the auto-approving `--plan --mode autopilot` combination. Rehearse current documented guards and instruction inheritance in the chosen build instead of treating help as UI evidence.

Update `src\evidence.json` only from approved, sanitized evidence. A source inspection is not a test pass. Local tests aren't proof of Azure deployment or policy compliance. Do not insert private scope names, account identifiers, state, credentials, raw plans, or private policy links.

Long MP4 files are the documented exception to single-file delivery. Keep `index.html` and `media\` together. Internet access is not needed for slides, notes, or local video. Public source links are optional reading, not runtime dependencies.

## Check the build

Use an isolated Python environment and the installed Edge browser:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
npm test
```

The check first exercises native-footage metadata and pending-slot behavior, then starts its own loopback server. It blocks external browser requests, captures every slide/fragment at 1280 x 720 and 1920 x 1080, and checks structure, overflow, contrast/accessibility, keyboard navigation, notes, and media behavior. A synthetic playback fixture tests browser controls only; its screenshot stays in ignored `.test-artifacts\`, outside public QA assets and chapter media. The check shuts down its server and browser when finished.

Results and screenshots go to `qa\`. Automated checks do not replace looking at the screenshots, reviewing the recordings, or a full two-speaker rehearsal. The final QA report distinguishes tested presentation behavior from pending footage and Azure evidence.

Local verification and visual-review reports remain under ignored `qa\` and reviewer artifact directories. They contain build/browser results, per-slide observations, and the remaining stage-release gates. They are not part of the public package; public release summaries must be sanitized separately.
