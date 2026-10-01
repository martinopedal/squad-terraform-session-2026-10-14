"""No desktop capture: fixtures and explicitly synthetic FFmpeg media only."""

import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest import mock

import record_demo as recorder


class RecordingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tools = recorder.tools()

    def test_safe_names_and_window_refusals(self):
        for name in ("", "../escape", "..\\escape", "take/other", "take:one"):
            with self.assertRaises(ValueError):
                recorder.safe_name(name)
        item = {"title": "Only demo", "pid": 42, "visible": True, "minimized": False}
        self.assertEqual(recorder.select_window([item], "Only demo", 42), item)
        for items, pid in (([], 42), ([item, item], 42), ([item], 43)):
            with self.assertRaises(ValueError):
                recorder.select_window(items, "Only demo", pid)
        with self.assertRaises(ValueError):
            recorder.select_window([{**item, "minimized": True}], "Only demo")

    def test_consent_refusal_without_capture(self):
        with tempfile.TemporaryDirectory() as temporary:
            command = [sys.executable, str(Path(recorder.__file__)), "record",
                       "--output-root", temporary, "--take-id", "refused"]
            result = subprocess.run(command, capture_output=True, text=True, timeout=10)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("Explicit ReviewedCli consent", result.stderr)
            self.assertFalse((Path(temporary) / "takes").exists())

    def test_retired_options_refused_without_capture(self):
        with tempfile.TemporaryDirectory() as temporary:
            for options in (
                ["--surface", "artifact"], ["--surface", "pilot"],
                ["--source-root", temporary], ["--consent", "PublicArtifacts"],
                ["--consent", "PublicPilot"],
            ):
                with self.subTest(options=options):
                    result = subprocess.run(
                        [sys.executable, str(Path(recorder.__file__)), "record",
                         "--output-root", temporary, "--take-id", "retired", *options],
                        capture_output=True, text=True, timeout=10, creationflags=recorder.NO_WINDOW,
                    )
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("error:", result.stderr)
                    self.assertFalse((Path(temporary) / "takes").exists())
            self.assertFalse(Path(recorder.__file__).with_name("surface.py").exists())

    def test_native_target_required_before_tools_or_window_access(self):
        with tempfile.TemporaryDirectory() as temporary:
            for options in ([], ["--window-title", "Agreed terminal"], ["--window-pid", "42"],
                            ["--window-title", "Agreed terminal", "--window-pid", "-1"]):
                with self.subTest(options=options), mock.patch.object(
                    sys, "argv", ["record_demo.py", "record", "--output-root", temporary,
                                  "--take-id", "refused", "--consent", "ReviewedCli", *options]
                ), mock.patch.object(recorder, "tools") as tool_check, mock.patch.object(
                    recorder, "window_identity"
                ) as window_check:
                    with self.assertRaisesRegex(ValueError, "exact title and a positive PID"):
                        recorder.main()
                    tool_check.assert_not_called()
                    window_check.assert_not_called()
                    self.assertFalse((Path(temporary) / "takes").exists())

    def test_native_dispatch_uses_only_the_selected_window(self):
        with tempfile.TemporaryDirectory() as temporary:
            target = {"title": "Agreed terminal", "pid": 42, "hwnd": 123}
            for action in ("preflight", "record"):
                with self.subTest(action=action), mock.patch.object(
                    sys, "argv", ["record_demo.py", action, "--output-root", temporary,
                                  "--take-id", "native", "--consent", "ReviewedCli",
                                  "--window-title", target["title"], "--window-pid", "42"]
                ), mock.patch.object(recorder, "tools", return_value=self.tools), mock.patch.object(
                    recorder, "window_identity", return_value=target
                ) as window_check, mock.patch.object(recorder, "Recorder") as controller, mock.patch(
                    "sys.stdout", new_callable=io.StringIO
                ):
                    controller.return_value.run.return_value = {"complete": True}
                    recorder.main()
                    window_check.assert_called_once_with(target["title"], 42)
                    if action == "preflight":
                        controller.assert_not_called()
                    else:
                        controller.assert_called_once_with(
                            Path(temporary).resolve(), "native", 90, self.tools,
                            "window", "ReviewedCli", target,
                        )
                        controller.return_value.run.assert_called_once_with([
                            "-f", "gdigrab", "-framerate", "30", "-draw_mouse", "1",
                            "-i", "hwnd=123",
                        ])
                    self.assertFalse((Path(temporary) / "takes").exists())

    def test_child_drains_both_pipes_and_only_stops_owned_process(self):
        with tempfile.TemporaryDirectory() as temporary:
            unrelated = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])
            command = [
                sys.executable, "-u", "-c",
                "import sys; print('x'*200000); print('e'*200000,file=sys.stderr); "
                "sys.stdout.flush(); sys.stderr.flush(); assert input()=='q'",
            ]
            try:
                child = recorder.Child(command, Path(temporary))
                code, forced = child.stop(grace=5)
                self.assertEqual(code, 0)
                self.assertFalse(forced)
                self.assertGreater((Path(temporary) / "stdout.log").stat().st_size, 200000)
                self.assertGreater((Path(temporary) / "stderr.log").stat().st_size, 200000)
                self.assertIsNone(unrelated.poll())
            finally:
                unrelated.terminate()
                unrelated.wait(timeout=5)

    def test_forced_timeout_is_not_success(self):
        with tempfile.TemporaryDirectory() as temporary:
            child = recorder.Child([sys.executable, "-c", "import time; time.sleep(60)"], temporary)
            code, forced = child.stop(grace=0.1)
            self.assertTrue(forced)
            self.assertNotEqual(code, 0)

    def test_retired_takes_cannot_be_exported_as_product_footage(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for capture_type in ("artifact", "pilot"):
                folder = root / capture_type
                folder.mkdir()
                recorder.write_json(folder / "manifest.final.json", {
                    "capture_type": capture_type, "complete": True,
                })
                with mock.patch.object(recorder, "probe") as inspect_media:
                    with self.assertRaisesRegex(ValueError, "not product footage"):
                        recorder.export(folder, self.tools, "refused")
                    inspect_media.assert_not_called()
                    self.assertFalse((folder / "exports").exists())

    def test_synthetic_record_verify_export_and_refuse_overwrites(self):
        with tempfile.TemporaryDirectory() as temporary:
            run = recorder.Recorder(temporary, "synthetic", 15, self.tools, "synthetic-test", "test-only")
            errors = []

            def control():
                try:
                    deadline = time.monotonic() + 10
                    while not (run.folder / "capture-ready.json").exists():
                        if time.monotonic() > deadline:
                            raise TimeoutError("Synthetic first frame wasn't ready.")
                        time.sleep(0.05)
                    recorder.send_request(run.folder, "approveframe", label="Synthetic test, not live footage")
                    with self.assertRaisesRegex(RuntimeError, "already approved"):
                        recorder.send_request(run.folder, "approveframe")
                    recorder.send_request(run.folder, "mark", "Pilot", "Synthetic test marker")
                    time.sleep(2)
                    recorder.send_request(run.folder, "stop")
                except Exception as error:
                    errors.append(error)

            worker = threading.Thread(target=control)
            worker.start()
            final = run.run(["-re", "-f", "lavfi", "-i", "testsrc2=size=640x360:rate=30"])
            worker.join(timeout=45)
            self.assertFalse(worker.is_alive())
            self.assertFalse(errors)
            self.assertTrue(final["complete"])
            self.assertEqual(final["capture_type"], "synthetic-test")
            self.assertTrue(recorder.verify(run.folder, self.tools)["media_valid"])
            original = recorder.digest(run.folder / "master.mkv")
            remux = recorder.export(run.folder, self.tools, "whole")
            chapter = recorder.export(run.folder, self.tools, "C1-test", 0.3, 1)
            self.assertEqual(remux["operation"], "remux")
            self.assertAlmostEqual(chapter["actual_duration_seconds"], 1, delta=0.1)
            self.assertEqual(recorder.digest(run.folder / "master.mkv"), original)
            with self.assertRaises(FileExistsError):
                recorder.export(run.folder, self.tools, "whole")
            with self.assertRaises(ValueError):
                recorder.export(run.folder, self.tools, "bad-range", 0, 999)
            with self.assertRaises(FileExistsError):
                recorder.Recorder(temporary, "synthetic", 5, self.tools, "synthetic-test", "test-only")
            with self.assertRaises(ValueError):
                recorder.send_request(run.folder, "mark", "Pilot", "after stop")

    def test_time_limit_and_failed_encoder_are_incomplete(self):
        with tempfile.TemporaryDirectory() as temporary:
            run = recorder.Recorder(temporary, "bounded", 2, self.tools, "synthetic-test", "test-only")
            final = run.run(["-re", "-f", "lavfi", "-i", "testsrc2=size=640x360:rate=30"])
            self.assertEqual(final["reason"], "time-limit")
            self.assertFalse(final["complete"])
            failed = recorder.Recorder(temporary, "failed", 2, self.tools, "synthetic-test", "test-only")
            with self.assertRaises(RuntimeError):
                failed.run(["-f", "lavfi", "-i", "not_a_real_filter"])
            manifest = json.loads((failed.folder / "manifest.final.json").read_text())
            self.assertFalse(manifest["complete"])
            self.assertEqual(manifest["reason"], "error")
            self.assertFalse((Path(temporary) / "recorder.lock").exists())

    def test_startup_timeout_and_cancellation_finalize_owned_child(self):
        with tempfile.TemporaryDirectory() as temporary:
            command = [sys.executable, "-u", "-c", "assert input() == 'q'"]
            with mock.patch.object(recorder, "capture_args", return_value=command):
                run = recorder.Recorder(temporary, "startup", 5, self.tools, "fixture-test", "test-only")
                with self.assertRaisesRegex(RuntimeError, "startup timeout"):
                    run.run([], startup_timeout=0.1)
                manifest = json.loads((run.folder / "manifest.final.json").read_text())
                self.assertEqual(manifest["exit_code"], 0)
                self.assertFalse(manifest["complete"])
                cancelled = recorder.Recorder(
                    temporary, "cancelled", 5, self.tools, "fixture-test", "test-only",
                    window={"title": "Fixture only", "pid": 42},
                )
                with mock.patch.object(recorder, "window_identity", side_effect=KeyboardInterrupt):
                    result = cancelled.run([])
                self.assertEqual(result["reason"], "cancelled")
                self.assertEqual(result["exit_code"], 0)
                self.assertFalse(result["complete"])
            self.assertFalse((Path(temporary) / "recorder.lock").exists())

    def test_live_verification_and_second_controller_refused(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            recorder.write_json(root / "recorder.lock", {"pid": 1})
            with self.assertRaises(FileExistsError):
                recorder.Recorder(root, "blocked", 5, self.tools, "synthetic-test", "test-only")
            with self.assertRaises(ValueError):
                recorder.verify(root, self.tools)


if __name__ == "__main__":
    unittest.main(verbosity=2)
