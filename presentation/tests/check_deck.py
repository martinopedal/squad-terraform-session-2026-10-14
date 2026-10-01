"""Exercise the built presentation using installed Edge and loopback-only assets."""
import argparse
import functools
import hashlib
import http.server
import json
import re
import subprocess
import tempfile
import threading
import time
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / "qa"
EDGE = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, default=EDGE)
    parser.add_argument("--interactions-only", action="store_true", help="Retest controls without recapturing unchanged slides.")
    args = parser.parse_args()
    if not args.browser.is_file():
        raise SystemExit("Installed browser not found. Supply --browser with its executable path.")
    if not (ROOT / "index.html").is_file():
        raise SystemExit("Build index.html before running the browser checks.")

    QA.mkdir(exist_ok=True)
    artifacts = ROOT / ".test-artifacts"
    artifacts.mkdir(exist_ok=True)
    handler = functools.partial(QuietHandler, directory=str(ROOT.parent))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = f"http://127.0.0.1:{server.server_port}/presentation/index.html"
    report = {
        "status": "running",
        "browser": "Installed Microsoft Edge",
        "externalRequests": [],
        "consoleErrors": [],
        "pageErrors": [],
        "failedRequests": [],
        "expectedFixtureCancellations": [],
        "slides": [],
        "checks": {},
        "failures": [],
        "limits": [
            "Actual C1-C7 footage is not attached; content, duration, and recording provenance remain pending.",
            "Media controls use a synthetic playback fixture, not CLI footage.",
            "No Azure deployment, policy evaluation, or human 60-minute rehearsal is performed by this test."
        ]
    }

    def check(name, condition, details=None):
        report["checks"][name] = {"passed": bool(condition), "details": details}
        if not condition:
            report["failures"].append(name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=str(args.browser), headless=True)
            report["browserVersion"] = browser.version
            context = browser.new_context(viewport={"width": 1280, "height": 720}, reduced_motion="reduce")

            def route_request(route):
                host = urlparse(route.request.url).hostname
                if host in ("127.0.0.1", "localhost") or route.request.url.startswith(("data:", "blob:", "about:")):
                    route.continue_()
                else:
                    report["externalRequests"].append(route.request.url)
                    route.abort()

            context.route("**/*", route_request)
            fixture_urls = set()

            def observe_page(page):
                page.on("console", lambda msg: report["consoleErrors"].append(msg.text) if msg.type == "error" else None)
                page.on("pageerror", lambda error: report["pageErrors"].append(str(error)))
                def request_failed(request):
                    result = {"url": request.url, "failure": request.failure}
                    report["failedRequests"].append(result)
                page.on("requestfailed", request_failed)

            context.on("page", observe_page)
            page = context.new_page()
            page.goto(url, wait_until="networkidle")
            page.wait_for_function("() => window.Reveal && Reveal.isReady()")
            manifest = page.evaluate("window.presentationBuild")
            report["deckVersion"] = manifest["version"]
            report["htmlSHA256"] = hashlib.sha256((ROOT / "index.html").read_bytes()).hexdigest()
            check("slide counts", page.evaluate("Reveal.getTotalSlides()") == 28 and manifest["mainSlides"] == 22 and manifest["appendixSlides"] == 6)
            check("26/27/7 clock", [manifest[k] for k in ("recordedMinutes", "liveMinutes", "qaMinutes")] == [26, 27, 7])
            check("main spoken words", 5300 <= manifest["spokenWords"] <= 5900, manifest["spokenWords"])
            check("prepared Q&A words", 650 <= manifest["qaWords"] <= 800, manifest["qaWords"])
            check("balanced speakers", abs(manifest["speakers"]["Martin"] - manifest["speakers"]["Haflidi"]) < 0.1 * manifest["spokenWords"], manifest["speakers"])
            check("plugins", page.evaluate("['notes','highlight'].every(id => Object.keys(Reveal.getPlugins()).includes(id))"))
            check("no autoplay", page.evaluate("Reveal.getConfig().autoPlayMedia === false && Reveal.getConfig().autoSlide === 0 && !document.querySelector('video[autoplay]')"))
            check("reduced motion", page.evaluate("Reveal.getConfig().transition === 'none'"))
            page.emulate_media(reduced_motion="no-preference")
            page.wait_for_function("() => Reveal.getConfig().transition === 'fade'")
            check("standard fade", page.evaluate("Reveal.getConfig().transitionSpeed === 'fast'"))
            page.emulate_media(reduced_motion="reduce")
            page.wait_for_function("() => Reveal.getConfig().transition === 'none'")
            check("motion preference change", page.evaluate("getComputedStyle(document.querySelector('.slide-content')).transitionDuration === '0s'"))
            ids = page.locator("[id]").evaluate_all("(nodes) => nodes.map(node => node.id)")
            duplicates = [key for key, count in Counter(ids).items() if count > 1]
            check("unique document IDs", not duplicates, duplicates)
            check("flat sections", page.locator(".slides > section section").count() == 0)
            check("table relationships", page.locator('.slides [role="table"]').count() == 2
                  and page.locator('.slides [role="columnheader"]').count() == 6
                  and page.locator('.slides [role="rowheader"]').count() == 9)
            check("complete notes", page.evaluate("""() => [...document.querySelectorAll('.slides > section')].every(s => {
                const n = s.querySelector('aside.notes');
                return n && n.textContent.length > 150 && n.textContent.includes('Working tip:');
            })"""))
            correction_text = {
                "documented Plan guard distinction": ("demo-c2", ["direct project-write guards", "ambiguous shell or MCP", "A Markdown plan alone", "/session plan", "Never use", "--plan --mode autopilot", "auto-approves"]),
                "explicit subagent instruction handoff": ("demo-c3", ["don't inherit repository instructions by default", "include-custom-instructions: true", "Confirm the behavior"]),
                "tool availability versus approval": ("demo-c4", ["--available-tools", "--allow-tool", "--deny-tool", "doesn't block shell writes"]),
                "formal rejection protocol distinction": ("demo-c5", ["Ordinary test repair isn't formal rejection", "different independent author", "doesn't produce or advise", "not a filesystem lock"]),
                "shared soft accounting": ("a-automation", ["five default continuations", "parent/subagents share accounting", "compaction can consume credits"]),
                "cloud versus local steering": ("a-handoffs", ["draft-PR", "still-running local session", "host must remain online"]),
                "reviewed team-state caveats": ("a-squad-ops", ["Back up before", "round-trip fidelity", "mutate labels without", "broad permission flags", ".github\\skills", ".squad\\skills"])
            }
            for name, (slide_id, phrases) in correction_text.items():
                rendered_notes = page.locator(f"#{slide_id} aside.notes").text_content()
                check(name, all(phrase in rendered_notes for phrase in phrases))
            check("inlined resources", page.locator("script[src], link[rel=stylesheet]").count() == 0)
            check("public document link", context.request.get(f"http://127.0.0.1:{server.server_port}/docs/feature-guide.md").ok)
            check("no placeholder terminal", page.locator(".media-pending").count() == 7 and page.locator("video[src]").count() == 0)
            check("native-only chapter policy", page.evaluate("""() =>
                [...document.querySelectorAll('.slide-demo aside.notes')].every(n =>
                    n.textContent.includes('Genuine Copilot CLI with Squad selected') &&
                    n.textContent.includes('external, off-screen tooling')) &&
                Object.values(presentationBuild.media).every(m =>
                    !m.available || (m.reviewed === true && m.selectedAgent === 'squad' &&
                    ['native-copilot-cli','integrated-terminal'].includes(m.sourceSurface)))
            """))
            page.add_script_tag(path=str(ROOT / "node_modules" / "axe-core" / "axe.min.js"))

            slide_info = page.locator(".slides > section").evaluate_all("""nodes => nodes.map(s => ({
                id: s.id,
                fragments: [...new Set([...s.querySelectorAll('.fragment')].map(f => Number(f.dataset.fragmentIndex)))]
            }))""")
            for width, height in ([] if args.interactions_only else [(1280, 720), (1920, 1080)]):
                page.set_viewport_size({"width": width, "height": height})
                directory = QA / f"{width}x{height}"
                directory.mkdir(exist_ok=True)
                for index, slide in enumerate(slide_info):
                    for fragment in [-1] + slide["fragments"]:
                        page.evaluate("([h,f]) => Reveal.slide(h,0,f)", [index, fragment])
                        page.wait_for_timeout(100)
                        page.wait_for_function("id => Reveal.getCurrentSlide().id === id", arg=slide["id"])
                        filename = f"{index + 1:02}-{slide['id']}-f{fragment + 1}.png"
                        page.screenshot(path=str(directory / filename))
                        overflow = page.evaluate("""() => {
                            const content = Reveal.getCurrentSlide().querySelector('.slide-content');
                            const limit = content.getBoundingClientRect();
                            const issues = [];
                            for (const el of [content, ...content.querySelectorAll('*')]) {
                                if (el.closest('aside.notes,.visually-hidden,.fragment:not(.visible)') ||
                                    el.tagName === 'INPUT' || el.closest('[hidden]')) continue;
                                const style = getComputedStyle(el);
                                const r = el.getBoundingClientRect();
                                if (style.display === 'none' || style.visibility === 'hidden' || !r.width || !r.height) continue;
                                if (r.left < limit.left - 2 || r.right > limit.right + 2 ||
                                    r.top < limit.top - 2 || r.bottom > limit.bottom + 2)
                                    issues.push({element: el.tagName, class: el.getAttribute('class'), kind: 'canvas bounds'});
                                if (el instanceof HTMLElement && ['slide-content','slide-body','code-panel'].some(c => el.classList.contains(c)) &&
                                    (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2))
                                    issues.push({element: el.tagName, class: el.className, kind: 'content overflow'});
                            }
                            return issues;
                        }""")
                        toolbar_overlap = page.evaluate("""() => {
                            const bar = document.querySelector('.presentation-tools').getBoundingClientRect();
                            return [...Reveal.getCurrentSlide().querySelectorAll('.slide-meta span, .slide-header h1, .slide-header h2')]
                                .some(el => { const r = el.getBoundingClientRect();
                                    return r.left < bar.right && r.right > bar.left && r.top < bar.bottom && r.bottom > bar.top;
                                });
                        }""")
                        if toolbar_overlap:
                            overflow.append({"element": "presenter controls", "kind": "overlap with heading or clock"})
                        violations = []
                        if width == 1280:
                            violations = page.evaluate("""async id => {
                                const result = await axe.run({include: [['#' + id + ' .slide-content']]}, {
                                    runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa']}
                                });
                                return result.violations.map(v => ({id:v.id, impact:v.impact,
                                    nodes:v.nodes.map(n => ({target:n.target, summary:n.failureSummary}))}));
                            }""", slide["id"])
                        result = {"id": slide["id"], "viewport": [width, height], "fragment": fragment,
                                  "screenshot": str((directory / filename).relative_to(ROOT)), "overflow": overflow,
                                  "accessibilityViolations": violations}
                        report["slides"].append(result)
                        if overflow or violations:
                            report["failures"].append(f"{slide['id']} {width} f{fragment}: overflow={len(overflow)} a11y={len(violations)}")
                print(f"Captured {width}x{height}: {len(slide_info)} slides and every fragment.", flush=True)

            page.set_viewport_size({"width": 1280, "height": 720})
            page.evaluate("Reveal.slide(0,0,-1); document.activeElement.blur()")
            page.keyboard.press("ArrowRight")
            check("arrow navigation", page.evaluate("Reveal.getCurrentSlide().id") == "demo-c1")
            page.keyboard.press("PageUp")
            check("Page Up", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("End")
            check("End", page.evaluate("Reveal.getCurrentSlide().id") == "a-evidence")
            page.keyboard.press("Home")
            check("Home", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("PageDown")
            check("Page Down", page.evaluate("Reveal.getCurrentSlide().id") == "demo-c1")
            page.keyboard.press("Escape")
            check("overview", page.evaluate("Reveal.isOverview()"))
            page.keyboard.press("Escape")
            page.locator("#open-navigation").click()
            check("named menu", page.locator(".navigation-dialog").is_visible())
            page.screenshot(path=str(QA / "navigation-menu.png"))
            page.locator('.navigation-dialog [data-nav="a-automation"]').click()
            page.wait_for_timeout(100)
            check("named hash", page.evaluate("Reveal.getCurrentSlide().id") == "a-automation" and "#/a-automation" in page.url)
            page.wait_for_function("() => document.activeElement.id === 'open-navigation'")
            page.keyboard.press("ArrowRight")
            check("arrow after pointer chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "a-handoffs")
            page.keyboard.press("Home")
            check("Home after pointer chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("Escape")
            check("overview after pointer chapter selection", page.evaluate("Reveal.isOverview()"))
            page.keyboard.press("Escape")
            page.keyboard.press("n")
            page.wait_for_function("() => document.querySelector('.navigation-dialog').open")
            for _ in range(40):
                if page.evaluate("document.activeElement.dataset.nav") == "s06-contract":
                    break
                page.keyboard.press("Tab")
            check("chapter reachable using only keyboard", page.evaluate("document.activeElement.dataset.nav") == "s06-contract")
            page.keyboard.press("Enter")
            page.wait_for_function("() => !document.querySelector('.navigation-dialog').open && document.activeElement.id === 'open-navigation'")
            check("keyboard-only chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "s06-contract")
            page.keyboard.press("ArrowRight")
            check("arrow after keyboard-only chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "demo-c2")
            page.keyboard.press("End")
            check("End after keyboard-only chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "a-evidence")
            page.locator("#open-navigation").click()
            page.locator('.navigation-dialog [data-nav="a-automation"]').click()
            page.locator('#a-automation a[href="#/s22-questions"]').click()
            page.wait_for_timeout(100)
            check("appendix return", page.evaluate("Reveal.getCurrentSlide().id") == "s22-questions")
            page.keyboard.press("n")
            page.keyboard.press("Tab")
            check("menu keyboard focus", page.evaluate("!!document.activeElement.closest('dialog')"))
            page.keyboard.press("Escape")
            page.wait_for_function("() => !document.querySelector('.navigation-dialog').open && document.activeElement.id === 'open-navigation'")
            check("menu escape and focus return", not page.locator(".navigation-dialog").is_visible()
                  and page.evaluate("document.activeElement.id") == "open-navigation")
            page.keyboard.press("Home")
            check("Home after menu dismissal", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("Space")
            check("focused chapter button retains native activation", page.locator(".navigation-dialog").is_visible()
                  and page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("Escape")
            page.evaluate("Reveal.slide(0,0,-1); document.activeElement.blur()")
            page.keyboard.press("Tab")
            check("visible focus", page.evaluate("""() => {
                const s = getComputedStyle(document.activeElement);
                return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2;
            }"""))
            with context.expect_page() as popup:
                page.locator("#open-notes").click()
            notes = popup.value
            notes.wait_for_selector("#current-slide iframe")
            notes.wait_for_selector(".speaker-controls-notes .value")
            notes.wait_for_function("() => document.querySelector('.speaker-controls-notes .value').textContent.includes('Haflidi')")
            timer_before = notes.locator(".timer .seconds-value").inner_text()
            notes.wait_for_timeout(1200)
            timer_after = notes.locator(".timer .seconds-value").inner_text()
            check("notes current and next", notes.locator("#current-slide iframe").count() == 1 and notes.locator("#upcoming-slide iframe").count() == 1)
            check("notes full spoken script", "A useful agent session" in notes.locator(".speaker-controls-notes .value").inner_text())
            check("notes timer advances", timer_before != timer_after)
            page.evaluate("Reveal.slide(6,0,-1)")
            notes.wait_for_function("() => document.querySelector('.speaker-controls-notes .value').textContent.includes('direct project-write guards')")
            cues = notes.locator(".operator-cues summary")
            cues.click()
            check("notes follow slide", "03:15-04:00" in notes.locator(".speaker-controls-notes .value").inner_text())
            cues.click()
            check("spoken notes visible before operator details", not notes.locator(".operator-cues").evaluate("e => e.open")
                  and "Activate native Plan mode" in notes.locator(".speaker-controls-notes .value").inner_text())
            notes.screenshot(path=str(QA / "speaker-view.png"))
            page.evaluate("Reveal.slide(5,0,-1)")
            notes.close()
            page.bring_to_front()
            check("notes return preserves control focus", page.evaluate("document.activeElement.id") == "open-notes")
            page.keyboard.press("ArrowRight")
            check("arrow after notes-button round trip", page.evaluate("Reveal.getCurrentSlide().id") == "demo-c2")
            page.keyboard.press("Home")
            check("Home after notes-button round trip", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("Escape")
            check("overview after notes-button round trip", page.evaluate("Reveal.isOverview()"))
            page.keyboard.press("Escape")

            with tempfile.TemporaryDirectory(prefix="playback-", dir=artifacts) as temporary:
                fixture = Path(temporary) / "playback-test-not-demo.mp4"
                subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-n", "-f", "lavfi",
                                "-i", "testsrc2=size=640x360:rate=30", "-t", "4", "-c:v", "libx264",
                                "-pix_fmt", "yuv420p", "-an", "-metadata", "title=Playback fixture, not demo footage",
                                str(fixture)], check=True, capture_output=True)
                page.evaluate("Reveal.slide(1,0,-1)")
                invalid = Path(temporary) / "invalid-selection.txt"
                invalid.write_text("File-selection test, not video footage.", encoding="utf-8")
                page.locator('#demo-c1 input[type="file"]').set_input_files(str(invalid))
                check("invalid file selection", "Select an MP4" in page.locator("#demo-c1 .media-status").inner_text()
                      and not page.locator("#demo-c1 video").is_visible())
                page.locator('#demo-c1 input[type="file"]').set_input_files(str(fixture))
                video = page.locator("#demo-c1 video")
                video.wait_for(state="visible")
                page.wait_for_function("() => document.querySelector('#demo-c1 video').readyState >= 2")
                fixture_urls.add(video.evaluate("v => v.src"))
                check("native local media controls", video.evaluate("v => v.controls && v.paused && !v.autoplay"))
                check("honest preview label", "review pending" in page.locator("#demo-c1 .media-status").inner_text())
                video.focus()
                page.keyboard.press("Space")
                page.wait_for_timeout(350)
                check("keyboard play without slide advance", video.evaluate("v => !v.paused && v.currentTime > 0")
                      and page.evaluate("Reveal.getCurrentSlide().id") == "demo-c1")
                page.keyboard.press("Space")
                check("native keyboard pause", video.evaluate("v => v.paused"))
                before_seek = video.evaluate("v => v.currentTime")
                page.keyboard.press("ArrowRight")
                page.wait_for_timeout(100)
                after_seek = video.evaluate("v => v.currentTime")
                check("native keyboard seek forward", after_seek > before_seek + .001
                      and page.evaluate("Reveal.getCurrentSlide().id") == "demo-c1",
                      {"before": before_seek, "after": after_seek})
                page.keyboard.press("ArrowLeft")
                page.wait_for_timeout(100)
                after_back = video.evaluate("v => v.currentTime")
                check("native keyboard seek back", after_back < after_seek - .001,
                      {"before": after_seek, "after": after_back})
                video.evaluate("v => { v.pause(); v.currentTime = 2; }")
                check("pause and seek", video.evaluate("v => v.paused && Math.abs(v.currentTime - 2) < .2"))
                video.evaluate("v => { v.currentTime = 0; return v.play(); }")
                page.wait_for_timeout(200)
                check("replay", video.evaluate("v => !v.paused && v.currentTime < 1"))
                page.evaluate("Reveal.slide(2,0,-1)")
                check("pause on slide exit", video.evaluate("v => v.paused"))
                page.evaluate("Reveal.slide(1,0,-1)")
                check("no autoplay on re-entry", video.evaluate("v => v.paused"))
                check("no media decode or source error", video.evaluate("v => v.error === null"))
                page.screenshot(path=str(artifacts / "media-playback-fixture.png"))
                video.evaluate("v => { v.removeAttribute('src'); v.load(); }")

            page.reload(wait_until="networkidle")
            page.wait_for_function("() => Reveal.isReady()")
            check("reload clears local preview", page.locator("video[src]").count() == 0)
            remaining_failures = []
            for request in report["failedRequests"]:
                if request["url"] in fixture_urls and request["failure"] == "net::ERR_ABORTED":
                    request["reason"] = "Chromium canceled a synthetic-video range request during its media lifecycle. Playback, seeking, and video.error were checked separately."
                    report["expectedFixtureCancellations"].append(request)
                else:
                    remaining_failures.append(request)
            report["failedRequests"] = remaining_failures
            check("cold loopback with external requests blocked", not report["externalRequests"])
            check("no console errors", not report["consoleErrors"], report["consoleErrors"])
            check("no JavaScript errors", not report["pageErrors"], report["pageErrors"])
            check("no failed requests", not report["failedRequests"], report["failedRequests"])
            browser.close()
    except Exception as error:
        report["failures"].append(f"{type(error).__name__}: {error}")
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        report["status"] = "passed" if not report["failures"] else "failed"
        report["finishedAt"] = time.strftime("%Y-%m-%dT%H:%M:%S%z")
        report_name = "interaction-results.json" if args.interactions_only else "browser-results.json"
        (QA / report_name).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"{report['status'].upper()}: {len(report['slides'])} captured states; {len(report['checks'])} interaction/content checks.")
    for failure in report["failures"]:
        print("FAIL:", failure)
    raise SystemExit(1 if report["failures"] else 0)


if __name__ == "__main__":
    main()
