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
        "overview": [],
        "checks": {},
        "failures": [],
        "limits": [
            "C0-C7 are live-demo chapters; optional fallback recordings are not required for delivery.",
            "Browser checks verify command blocks, notes, timing, accessibility, and offline packaging, not real CLI execution.",
            "No Azure deployment or policy evaluation is performed by this test; it checks only the sanitized published evidence text."
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
            check("slide counts", page.evaluate("Reveal.getTotalSlides()") == 38 and manifest["openingSlides"] == 2 and manifest["mainSlides"] == 25 and manifest["appendixSlides"] == 11)
            check("legal slide untimed before s01", page.evaluate("""() => {
                const slides = [...document.querySelectorAll('.slides > section')];
                return slides[0].id === 'opening' &&
                    slides[1].id === 'legal-notice' &&
                    slides[1].dataset.preshow === 'true' &&
                    slides[1].dataset.stageTime === 'Pre-show' &&
                    slides[2].id === 's01-outcome' &&
                    slides[2].dataset.stageTime === '00:00-03:00';
            }"""))
            check("timing budget with close buffer",
                  [manifest[k] for k in ("demoMinutes", "introMinutes", "explanationMinutes", "protectedSlackMinutes",
                                         "closeBufferMinutes", "qaMinutes", "nonDemoSlideMinutes", "mainFlowMinutes",
                                         "timedSlideMinutes", "contentEnd", "closeStart", "questions")]
                  == [29, 3, 26, 0, 2, 0, 31, 58, 60, "58:00", "58:00", "if time allows"])
            check("chapter lengths", [chapter["duration"] // 60 for chapter in manifest["chapters"]] == [3, 3, 4, 4, 4, 5, 3, 3]
                  and [chapter["id"] for chapter in manifest["chapters"]] == [f"C{i}" for i in range(8)], manifest["chapters"])
            check("intro and contiguous clocks", page.evaluate("""() => {
                const toSeconds = value => value.split(':').reduce((sum, part) => sum * 60 + Number(part), 0);
                let end = 0;
                const slides = [...document.querySelectorAll('.slides > section:not([data-appendix]):not([data-preshow])')];
                return slides[0].id === 's01-outcome' && slides[0].dataset.stageTime === '00:00-03:00' &&
                    slides.every(slide => {
                        const [start, stop] = slide.dataset.stageTime.split('-').map(toSeconds);
                        const ok = start === end && stop > start;
                        end = stop;
                        return ok;
                    }) && end === 3600;
            }"""))
            check("main spoken words", 5300 <= manifest["spokenWords"] <= 5900, manifest["spokenWords"])
            check("no scheduled Q&A words", manifest["qaWords"] == 0, manifest["qaWords"])
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
            check("live demo command blocks", page.locator(".slide-demo .slide-content pre code").count() == 8 and page.locator(".slide-demo video, .media-pending").count() == 0)
            check("no recording-slot copy on screen", page.evaluate("""() =>
                [...document.querySelectorAll('.slide-content')].every(s =>
                    !/recording slot|not attached|pending/i.test(s.textContent))
            """))
            check("live demo notes have offline fallback", page.evaluate("""() =>
                [...document.querySelectorAll('.slide-demo aside.notes')].every(n =>
                    n.textContent.includes('Offline fallback:') &&
                    n.textContent.includes('Timing:') &&
                    n.textContent.includes('Pre-staged:') &&
                    n.textContent.includes('Cut at') &&
                    n.textContent.includes('Expected:') &&
                    n.querySelector('pre code'))
            """))
            s20_text = page.locator("#s20-consumer .slide-content").text_content()
            check("s20 live reveal on-screen", all(phrase in s20_text for phrase in
                  ["https://aks-online-demo.swedencentral.cloudapp.azure.com/",
                   "Whether a change is human-authored or agent-assisted, it goes through the same gates",
                   "PR → checks/scans (fmt, validate, TFLint, Trivy, Checkov) → review + protected main → Terraform plan → online environment approval → OIDC apply → runtime check"]))
            s20_notes = page.locator("#s20-consumer aside.notes").text_content()
            check("s20 live reveal notes", all(phrase in s20_notes for phrase in
                  ["0:30-1:00 live reveal", "self-signed cert warning is expected", "pre-accepted",
                   "gate map", "PR/review/check/environment/Actions trace", "single maintainer used an admin override",
                   "pipeline flow", "serving pod name", "speakers section", "1:00-2:10", "Offline fallback:",
                   "37771532872/37772290635", "Test-OnlineSecurity 29/29 at 13:48 on Oct 8",
                   "appendix/hallway depth"]))
            check("live demo notes state provenance boundary", page.evaluate("""() => {
                const demos = [...document.querySelectorAll('.slide-demo aside.notes')];
                return demos.length === 8 && demos.every(n => {
                    const text = n.textContent;
                    return text.includes('Live surface:') &&
                        text.includes('Genuine Copilot CLI with Squad selected') &&
                        text.includes('real integrated terminal') &&
                        text.includes('Qualify code first') &&
                        text.includes('disclosed clean checkpoint') &&
                        text.includes('Offline fallback:');
                });
            }"""))
            check("C0 explicitly states pre-Squad boundary",
                  "C0 starts before Squad exists" in page.locator("#demo-c0 aside.notes").text_content())
            check("native-only chapter policy", page.evaluate("""() =>
                [...document.querySelectorAll('.slide-demo aside.notes')].every(n =>
                    n.textContent.includes('external, off-screen tooling')) &&
                Object.values(window.presentationBuild.media).every(m =>
                    !m.available || (m.reviewed === true && m.selectedAgent === 'squad' &&
                    ['native-copilot-cli','integrated-terminal'].includes(m.sourceSurface)))
            """))
            baseline_notes = page.locator("#s03-baseline aside.notes").text_content()
            check("disclosed clean-run narration", all(phrase in baseline_notes for phrase in
                  ["module now exists", "passed local qualification before delivery", "disclosed clean checkpoint", "first implementation"]))
            check("local qualification is separate from Azure validation evidence",
                  page.locator("#s15-proof .status").all_text_contents() == ["Inspected", "52 passed", "2 passed", "Approved", "Succeeded"])
            check("published module revision is bound to the evidence",
                  page.evaluate("window.presentationBuild.moduleRevision") == "b01256eb9b1ea6046b9bb8a403662f724a7b6fa7")
            badge_summary = page.locator(".feature-badge").evaluate_all("""nodes => nodes.map(n => ({
                feature: n.dataset.feature,
                text: n.textContent.trim(),
                href: n.href
            }))""")
            required_badges = {
                "Copilot CLI", "Plan mode", "custom agents", "MCP", "Skills", "-p", "/resume",
                "/review", "/diff", "/delegate", "Rubber Duck", "AKS Automatic", "App Routing",
                "ABAC conditions for AKS custom resources", "Bastion Entra RDP", "Terraform test", "Squad"
            }
            seen_badges = {item["feature"] for item in badge_summary}
            check("feature badge coverage", required_badges.issubset(seen_badges), {
                "missing": sorted(required_badges - seen_badges),
                "badges": badge_summary
            })
            product_name_locations = page.locator(".slides > section:has(.product-name)").evaluate_all("nodes => nodes.map(n => n.id)")
            product_names = page.locator(".product-name").evaluate_all("nodes => nodes.map(n => n.textContent.trim())")
            check("text-only product name placement", product_name_locations == ["opening", "s22-questions"] and product_names == ["GitHub Copilot", "GitHub Copilot"], {"locations": product_name_locations, "names": product_names})
            html_text = (ROOT / "index.html").read_text(encoding="utf-8")
            check("no third-party logo images embedded", page.locator(".copilot-lockup, img[src*=\"github\" i], img[alt*=\"github\" i]").count() == 0
                  and "brand.github.com/_next/static/media" not in html_text
                  and "github-copilot-lockup-examples.png" not in html_text
                  and "--github-copilot-lockup" not in html_text
                  and "copilot-lockup" not in html_text)
            check("Cascadia Code local font and license", (ROOT / "media" / "fonts" / "CascadiaCode.woff2").is_file()
                  and (ROOT / "media" / "fonts" / "CascadiaCode-LICENSE.txt").is_file()
                  and "font-family:'Cascadia Code'" in html_text
                  and "SIL OPEN FONT LICENSE Version 1.1" in (ROOT / "media" / "fonts" / "CascadiaCode-LICENSE.txt").read_text(encoding="utf-8"))
            contrast = page.evaluate("""() => {
                const parse = value => {
                    value = value.trim();
                    if (value.startsWith('#')) {
                        const hex = value.slice(1);
                        const full = hex.length === 3 ? [...hex].map(c => c + c).join('') : hex;
                        return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16));
                    }
                    return value.match(/\\d+(\\.\\d+)?/g).slice(0, 3).map(Number);
                };
                const rel = ([r,g,b]) => [r,g,b].map(v => {
                    v /= 255;
                    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
                }).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
                const ratio = (a, b) => {
                    const [l1, l2] = [rel(a), rel(b)].sort((x, y) => y - x);
                    return (l1 + 0.05) / (l2 + 0.05);
                };
                const root = getComputedStyle(document.documentElement);
                const light = ratio(parse(root.getPropertyValue('--nic-ink')), parse(root.getPropertyValue('--nic-cyan')));
                const dark = ratio(parse(root.getPropertyValue('--nic-cyan')), parse(root.getPropertyValue('--nic-ink')));
                const headline = Math.min(...[...document.querySelectorAll('.slide-content h1, .slide-content h2, .slide-content h3')]
                    .map(el => {
                        const s = getComputedStyle(el);
                        return {size: parseFloat(s.fontSize), ratio: ratio(parse(s.color), parse(getComputedStyle(el.closest('.slide-content')).backgroundColor))};
                    }).filter(item => item.size >= 24).map(item => item.ratio));
                return {bodyLight: light, bodyDark: dark, headline};
            }""")
            check("computed CSS contrast", contrast["bodyLight"] >= 4.5 and contrast["bodyDark"] >= 4.5 and contrast["headline"] >= 3, contrast)
            license_text = (ROOT / "src" / "third-party-licenses.txt").read_text(encoding="utf-8").strip()
            check("complete bundled licenses preserved", license_text in (ROOT / "index.html").read_text(encoding="utf-8"))
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

            normal_slide_protection = """() => {
                const current = Reveal.getCurrentSlide();
                return !Reveal.isOverview() && [...document.querySelectorAll('.slides > section')].every(slide =>
                    !slide.querySelector('.slide-content').inert &&
                    (slide === current
                        ? !slide.inert && !slide.hidden && slide.getAttribute('aria-hidden') !== 'true'
                        : slide.inert && slide.hidden && slide.getAttribute('aria-hidden') === 'true'));
            }"""
            for width, height in [(1280, 720), (1920, 1080)]:
                label = f"{width}x{height}"
                page.set_viewport_size({"width": width, "height": height})
                page.goto(f"{url}?overview-regression={width}#/s07-agent-setup", wait_until="networkidle")
                page.wait_for_function("() => Reveal.isReady() && Reveal.getCurrentSlide().id === 's07-agent-setup'")
                check(f"normal-slide accessibility before overview {label}", page.evaluate(normal_slide_protection))
                page.keyboard.press("Escape")
                page.wait_for_function("() => Reveal.isOverview()")
                thumbnails = page.evaluate("""() => ['s04-layers', 'demo-c0'].map(id => {
                    const slide = document.getElementById(id);
                    const content = slide.querySelector('.slide-content');
                    const heading = slide.querySelector('h1,h2');
                    const r = slide.getBoundingClientRect();
                    const title = heading.getBoundingClientRect();
                    const style = getComputedStyle(slide);
                    return {id, width:r.width, height:r.height, display:style.display, opacity:style.opacity,
                        rendered: r.width > 100 && r.height > 50 && r.left >= 0 && r.right <= innerWidth &&
                            r.top >= 0 && r.bottom <= innerHeight && title.width > 0 && title.height > 0 &&
                            style.display !== 'none' && style.visibility === 'visible' && Number(style.opacity) > .99,
                        sectionInert: slide.inert, contentInert: content.inert,
                        pointerTarget: document.elementFromPoint(r.x+r.width/2, r.y+r.height/2)?.closest('section')?.id};
                })""")
                screenshot = f"overview-{label}.png"
                page.screenshot(path=str(QA / screenshot))
                report["overview"].append({"viewport": [width, height], "screenshot": screenshot, "thumbnails": thumbnails})
                check(f"inactive overview thumbnails visible {label}", all(item["rendered"] for item in thumbnails), thumbnails)
                check(f"overview surface clickable and controls inert {label}", all(
                    not item["sectionInert"] and item["contentInert"] and item["pointerTarget"] == item["id"]
                    for item in thumbnails))
                check(f"overview has no demo video controls {label}",
                      page.locator(".slide-demo video, .slide-demo .attach-video").count() == 0)
                page.locator("#s05-parallel").click(timeout=1500)
                page.wait_for_function("() => !Reveal.isOverview() && Reveal.getCurrentSlide().id === 's05-parallel'")
                check(f"pointer selects inactive overview slide {label}",
                      page.evaluate("Reveal.getCurrentSlide().id") == "s05-parallel")
                check(f"accessibility restored after overview click {label}", page.evaluate(normal_slide_protection))
                page.keyboard.press("Escape")
                page.wait_for_function("() => Reveal.isOverview()")
                focus_stays_outside_thumbnails = True
                for _ in range(6):
                    page.keyboard.press("Tab")
                    focus_stays_outside_thumbnails &= page.evaluate(
                        "() => !document.activeElement.closest('.slides > section')")
                check(f"overview tab skips thumbnail controls {label}", focus_stays_outside_thumbnails)
                page.keyboard.press("ArrowRight")
                page.wait_for_function("() => Reveal.isOverview() && Reveal.getCurrentSlide().id === 's06-contract'")
                check(f"overview keyboard changes selection {label}",
                      "Fit the platform" in page.locator("#navigation-status").text_content())
                page.keyboard.press("Escape")
                page.wait_for_function("() => !Reveal.isOverview()")
                check(f"overview keyboard commits selected slide {label}",
                      page.evaluate("Reveal.getCurrentSlide().id") == "s06-contract")
                check(f"accessibility restored after overview keyboard {label}", page.evaluate(normal_slide_protection))

            page.set_viewport_size({"width": 1280, "height": 720})
            page.evaluate("Reveal.slide(0,0,-1); document.activeElement.blur()")
            page.keyboard.press("ArrowRight")
            check("arrow navigation from opening", page.evaluate("Reveal.getCurrentSlide().id") == "legal-notice")
            page.keyboard.press("PageDown")
            check("Page Down to first timed content", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
            page.keyboard.press("PageUp")
            check("Page Up", page.evaluate("Reveal.getCurrentSlide().id") == "legal-notice")
            page.keyboard.press("End")
            check("End", page.evaluate("Reveal.getCurrentSlide().id") == "a-use-cases")
            page.keyboard.press("Home")
            check("Home", page.evaluate("Reveal.getCurrentSlide().id") == "opening")
            page.keyboard.press("PageDown")
            check("Page Down", page.evaluate("Reveal.getCurrentSlide().id") == "legal-notice")
            page.keyboard.press("PageDown")
            check("Second Page Down", page.evaluate("Reveal.getCurrentSlide().id") == "s01-outcome")
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
            check("Home after pointer chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "opening")
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
            check("arrow after keyboard-only chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "demo-c1")
            page.keyboard.press("End")
            check("End after keyboard-only chapter selection", page.evaluate("Reveal.getCurrentSlide().id") == "a-use-cases")
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
            check("Home after menu dismissal", page.evaluate("Reveal.getCurrentSlide().id") == "opening")
            page.keyboard.press("Space")
            check("focused chapter button retains native activation", page.locator(".navigation-dialog").is_visible()
                  and page.evaluate("Reveal.getCurrentSlide().id") == "opening")
            page.keyboard.press("Escape")
            page.evaluate("Reveal.slide(2,0,-1); document.activeElement.blur()")
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
            check("notes full presenter plan", "live terminal and browser work" in notes.locator(".speaker-controls-notes .value").inner_text())
            check("notes timer advances", timer_before != timer_after)
            page.evaluate("Reveal.slide(12,0,-1)")
            notes.wait_for_function("() => document.querySelector('.speaker-controls-notes .value').textContent.includes('/session plan')")
            check("notes follow slide", "Offline fallback:" in notes.locator(".speaker-controls-notes .value").inner_text())
            check("notes show live command block", "/session plan" in notes.locator(".speaker-controls-notes .value").inner_text())
            notes.screenshot(path=str(QA / "speaker-view.png"))
            page.evaluate("Reveal.slide(10,0,-1)")
            notes.close()
            page.bring_to_front()
            check("notes return preserves control focus", page.evaluate("document.activeElement.id") == "open-notes")
            page.keyboard.press("ArrowRight")
            check("arrow after notes-button round trip", page.evaluate("Reveal.getCurrentSlide().id") == "s08-plan-boundary")
            page.keyboard.press("Home")
            check("Home after notes-button round trip", page.evaluate("Reveal.getCurrentSlide().id") == "opening")
            page.keyboard.press("Escape")
            check("overview after notes-button round trip", page.evaluate("Reveal.isOverview()"))
            page.keyboard.press("Escape")

            check("no local media controls in live-demo deck", page.locator(".attach-video, .video-file, .slide-demo video").count() == 0)

            page.reload(wait_until="networkidle")
            page.wait_for_function("() => Reveal.isReady()")
            check("reload preserves live demo command blocks", page.locator(".slide-demo .slide-content pre code").count() == 8)
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
