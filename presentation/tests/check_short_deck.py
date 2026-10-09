"""Check actual short-deck links, text/card bounds, accessibility, and controls in Edge."""
import argparse
import functools
import hashlib
import http.server
import json
import threading
from pathlib import Path
from urllib.parse import urljoin, urlparse

from playwright.sync_api import sync_playwright

from check_deck import EDGE, QuietHandler


ROOT = Path(__file__).resolve().parents[1]
IDS = ["short-who-we-are", "short-what-we-show", "short-snippets",
       "short-takeaways", "short-links"]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, default=EDGE)
    args = parser.parse_args()
    qa = ROOT / "qa" / "short"
    qa.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0),
        functools.partial(QuietHandler, directory=str(ROOT.parent)))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    url = f"http://127.0.0.1:{server.server_port}/presentation/short/index.html"
    report = {"checks": {}, "slides": [], "failures": [], "errors": [],
              "externalRequests": [], "htmlSHA256": hashlib.sha256(
                  (ROOT / "short" / "index.html").read_bytes()).hexdigest()}

    def check(name, condition, details=None):
        report["checks"][name] = {"passed": bool(condition), "details": details}
        if not condition:
            report["failures"].append(name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=str(args.browser), headless=True)
            report["browserVersion"] = browser.version
            context = browser.new_context(viewport={"width": 1280, "height": 720},
                                          reduced_motion="reduce")

            def route_request(route):
                if urlparse(route.request.url).hostname == "127.0.0.1":
                    route.continue_()
                else:
                    report["externalRequests"].append(route.request.url)
                    route.abort()

            context.route("**/*", route_request)
            page = context.new_page()
            page.on("pageerror", lambda error: report["errors"].append(str(error)))
            page.on("console", lambda msg: report["errors"].append(msg.text)
                    if msg.type == "error" else None)
            page.goto(url, wait_until="networkidle")
            page.wait_for_function("() => Reveal.isReady()")
            page.evaluate("() => document.fonts.ready")
            check("five stable slides", page.locator(".slides > section").evaluate_all(
                "nodes => nodes.map(node => node.id)") == IDS)
            links = page.locator('.slide-content a[href]').evaluate_all(
                "nodes => nodes.map(node => node.getAttribute('href'))")
            local_links = [href for href in links if not href.startswith(("https:", "#"))]
            check("all nine documentation links emitted",
                  len([href for href in local_links if "/docs/" in href]) == 9)
            for index, href in enumerate(local_links):
                response = context.request.get(urljoin(url, href))
                check(f"local link {index + 1}: {href}", response.ok, response.status)
            page.add_script_tag(path=str(ROOT / "node_modules" / "axe-core" / "axe.min.js"))
            for width, height in [(1280, 720), (1920, 1080)]:
                page.set_viewport_size({"width": width, "height": height})
                directory = qa / f"{width}x{height}"
                directory.mkdir(exist_ok=True)
                for index, slide_id in enumerate(IDS):
                    page.evaluate("index => Reveal.slide(index, 0, -1)", index)
                    page.wait_for_function("id => Reveal.getCurrentSlide().id === id", arg=slide_id)
                    page.wait_for_timeout(100)
                    screenshot = directory / f"{index + 1:02}-{slide_id}.png"
                    page.screenshot(path=str(screenshot))
                    geometry = page.evaluate("""() => {
                        const content = Reveal.getCurrentSlide().querySelector('.slide-content');
                        const body = content.querySelector('.slide-body');
                        const footer = content.querySelector('.slide-footer');
                        const canvas = content.getBoundingClientRect();
                        const bodyBounds = body.getBoundingClientRect();
                        const footerBounds = footer.getBoundingClientRect();
                        const controls = [...document.querySelectorAll(
                            '.presentation-tools,.reveal .controls,.reveal .slide-number')]
                            .map(el => el.getBoundingClientRect());
                        const issues = [];
                        const inside = (r, b) => r.left >= b.left - 1 && r.right <= b.right + 1 &&
                            r.top >= b.top - 1 && r.bottom <= b.bottom + 1;
                        const overlaps = (a, b) => a.left < b.right && a.right > b.left &&
                            a.top < b.bottom && a.bottom > b.top;
                        const scale = canvas.width / 1280;
                        let smallestCodeFont = Infinity;
                        for (const el of [content, ...content.querySelectorAll('*')]) {
                            const r = el.getBoundingClientRect();
                            const style = getComputedStyle(el);
                            if (!r.width || !r.height || style.display === 'none' ||
                                style.visibility === 'hidden' || el.closest('aside.notes')) continue;
                            const label = el.tagName + '.' + el.className;
                            if (!inside(r, canvas)) issues.push(label + ': outside canvas');
                            if (el !== body && body.contains(el)) {
                                if (!inside(r, bodyBounds)) issues.push(label + ': outside body');
                                if (overlaps(r, footerBounds)) issues.push(label + ': overlaps footer');
                            }
                            if (el !== content && controls.some(c => overlaps(r, c)))
                                issues.push(label + ': overlaps controls');
                            if (el instanceof HTMLElement &&
                                (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2))
                                issues.push(label + ': scroll overflow');
                            if (el.tagName === 'CODE' && el.closest('pre'))
                                smallestCodeFont = Math.min(smallestCodeFont,
                                    parseFloat(style.fontSize) * scale);
                            // Inspect rendered text line boxes, including syntax-highlighted code.
                            for (const node of el.childNodes) {
                                if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
                                const range = document.createRange();
                                range.selectNodeContents(node);
                                for (const textRect of range.getClientRects()) {
                                    const card = el.closest('.short-snippet,.short-speaker-card,.short-links-grid a');
                                    if (card && !inside(textRect, card.getBoundingClientRect()))
                                        issues.push(label + ': text outside card');
                                    if (!inside(textRect, canvas)) issues.push(label + ': text outside canvas');
                                    if (body.contains(el) && !inside(textRect, bodyBounds))
                                        issues.push(label + ': text outside body');
                                }
                            }
                        }
                        return {issues: [...new Set(issues)], body: bodyBounds.toJSON(),
                            footer: footerBounds.toJSON(), smallestCodeFont:
                                Number.isFinite(smallestCodeFont) ? smallestCodeFont : null,
                            codeBlocks: [...body.querySelectorAll('pre code')].map(el => el.textContent)};
                    }""")
                    check(f"{slide_id} {width}x{height} actual bounds", not geometry["issues"], geometry)
                    if slide_id == "short-snippets":
                        check(f"readable complete code at {width}x{height}",
                              geometry["smallestCodeFont"] >= 17 and
                              len(geometry["codeBlocks"]) == 3 and
                              "DNS service IP 10.241.0.10" in geometry["codeBlocks"][2], geometry)
                    violations = page.evaluate("""async id => {
                        const result = await axe.run({include: [['#' + id + ' .slide-content']]}, {
                            runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa']}
                        });
                        return result.violations.map(v => ({id:v.id, nodes:v.nodes.map(n => n.target)}));
                    }""", slide_id)
                    check(f"{slide_id} {width}x{height} accessibility", not violations, violations)
                    report["slides"].append({"id": slide_id, "viewport": [width, height],
                        "screenshot": str(screenshot), "geometry": geometry})
                page.keyboard.press("Home")
                page.keyboard.press("ArrowRight")
                check(f"arrow navigation {width}", page.evaluate("Reveal.getCurrentSlide().id") == IDS[1])
                page.locator("#open-navigation").click()
                page.locator('.navigation-dialog [data-nav="short-snippets"]').click()
                check(f"named navigation {width}", page.evaluate("Reveal.getCurrentSlide().id") == IDS[2])
                page.keyboard.press("End")
                check(f"End navigation {width}", page.evaluate("Reveal.getCurrentSlide().id") == IDS[-1])
            check("no browser errors", not report["errors"], report["errors"])
            check("offline runtime", not report["externalRequests"], report["externalRequests"])
            browser.close()
    except Exception as error:
        report["failures"].append(f"{type(error).__name__}: {error}")
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        report["status"] = "failed" if report["failures"] else "passed"
        (qa / "browser-results.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"{report['status'].upper()}: {len(report['slides'])} short-deck captures; "
          f"{len(report['checks'])} checks.")
    for failure in report["failures"]:
        print("FAIL:", failure)
    raise SystemExit(1 if report["failures"] else 0)


if __name__ == "__main__":
    main()
