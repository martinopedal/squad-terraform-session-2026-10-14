"""External recorder for an existing, approved terminal window. Python 3.12+ and FFmpeg."""

import argparse
import ctypes
from ctypes import wintypes
from datetime import datetime, timezone
from fractions import Fraction
import hashlib
import json
import os
from pathlib import Path
import queue
import re
import shutil
import subprocess
import sys
import threading
import time
import uuid

SCALE = (
    "scale=1920:1080:force_original_aspect_ratio=decrease,"
    "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p"
)
NO_WINDOW = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0


def utc():
    return datetime.now(timezone.utc).isoformat()


def write_json(path, value):
    with Path(path).open("x", encoding="utf-8") as output:
        json.dump(value, output, indent=2)
        output.write("\n")


def append_json(path, value):
    with Path(path).open("a", encoding="utf-8") as output:
        output.write(json.dumps(value) + "\n")


def digest(path):
    with Path(path).open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def safe_name(value):
    if not value or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,79}", value):
        raise ValueError("Use a take/export name containing only letters, digits, _ and -.")
    return value


def tools():
    result = {}
    for name in ("ffmpeg", "ffprobe"):
        executable = shutil.which(name)
        if not executable:
            raise RuntimeError(f"{name} is missing. No software was installed.")
        version = subprocess.run(
            [executable, "-version"], capture_output=True, text=True,
            check=True, timeout=10, creationflags=NO_WINDOW,
        ).stdout.splitlines()[0]
        result[name] = {"path": executable, "version": version}
    return result


def select_window(windows, title, pid=None):
    matches = [item for item in windows if item["title"] == title]
    if len(matches) != 1:
        raise ValueError(f"Expected one exact-title window, found {len(matches)}.")
    window = matches[0]
    if pid is not None and window["pid"] != pid:
        raise ValueError("Window PID does not match the explicitly selected process.")
    if not window["visible"] or window["minimized"]:
        raise ValueError("The selected window must be visible and not minimized.")
    return window


def windows():
    if os.name != "nt":
        raise RuntimeError("Live capture requires Windows. Tests don't require a desktop.")
    user = ctypes.WinDLL("user32", use_last_error=True)
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    callback_type = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
    user.GetWindowTextLengthW.argtypes = [wintypes.HWND]
    user.GetWindowTextW.argtypes = [wintypes.HWND, wintypes.LPWSTR, ctypes.c_int]
    user.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
    user.GetClientRect.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.RECT)]
    user.IsWindowVisible.argtypes = [wintypes.HWND]
    user.IsIconic.argtypes = [wintypes.HWND]
    user.EnumWindows.argtypes = [callback_type, wintypes.LPARAM]
    kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    kernel.OpenProcess.restype = wintypes.HANDLE
    kernel.GetProcessTimes.argtypes = [wintypes.HANDLE] + [ctypes.POINTER(wintypes.FILETIME)] * 4
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    result = []

    @callback_type
    def visit(handle, _):
        length = user.GetWindowTextLengthW(handle)
        if not length:
            return True
        title = ctypes.create_unicode_buffer(length + 1)
        user.GetWindowTextW(handle, title, length + 1)
        pid = wintypes.DWORD()
        user.GetWindowThreadProcessId(handle, ctypes.byref(pid))
        rect = wintypes.RECT()
        user.GetClientRect(handle, ctypes.byref(rect))
        result.append({
            "hwnd": int(handle), "title": title.value, "pid": pid.value,
            "visible": bool(user.IsWindowVisible(handle)),
            "minimized": bool(user.IsIconic(handle)),
            "width": rect.right, "height": rect.bottom,
        })
        return True

    if not user.EnumWindows(visit, 0):
        raise ctypes.WinError(ctypes.get_last_error())
    return result


def window_identity(title, pid=None):
    selected = select_window(windows(), title, pid)
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    kernel.OpenProcess.restype = wintypes.HANDLE
    kernel.GetProcessTimes.argtypes = [wintypes.HANDLE] + [ctypes.POINTER(wintypes.FILETIME)] * 4
    kernel.CloseHandle.argtypes = [wintypes.HANDLE]
    handle = kernel.OpenProcess(0x1000, False, selected["pid"])
    if not handle:
        raise ctypes.WinError(ctypes.get_last_error())
    stamps = [wintypes.FILETIME() for _ in range(4)]
    try:
        if not kernel.GetProcessTimes(handle, *(ctypes.byref(s) for s in stamps)):
            raise ctypes.WinError(ctypes.get_last_error())
    finally:
        kernel.CloseHandle(handle)
    selected["process_created"] = (stamps[0].dwHighDateTime << 32) | stamps[0].dwLowDateTime
    return selected


class Job:
    """Closing the job kills only the child assigned by this controller."""

    def __init__(self, process):
        self.handle = None
        if os.name != "nt":
            return

        class Basic(ctypes.Structure):
            _fields_ = [
                ("process_time", ctypes.c_int64), ("job_time", ctypes.c_int64),
                ("flags", wintypes.DWORD), ("min_ws", ctypes.c_size_t),
                ("max_ws", ctypes.c_size_t), ("active", wintypes.DWORD),
                ("affinity", ctypes.c_size_t), ("priority", wintypes.DWORD),
                ("scheduling", wintypes.DWORD),
            ]

        class Extended(ctypes.Structure):
            _fields_ = [
                ("basic", Basic), ("io", ctypes.c_uint64 * 6),
                ("process_memory", ctypes.c_size_t), ("job_memory", ctypes.c_size_t),
                ("peak_process", ctypes.c_size_t), ("peak_job", ctypes.c_size_t),
            ]

        self.kernel = ctypes.WinDLL("kernel32", use_last_error=True)
        self.kernel.CreateJobObjectW.argtypes = [ctypes.c_void_p, wintypes.LPCWSTR]
        self.kernel.CreateJobObjectW.restype = wintypes.HANDLE
        self.kernel.SetInformationJobObject.argtypes = [
            wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD,
        ]
        self.kernel.AssignProcessToJobObject.argtypes = [wintypes.HANDLE, wintypes.HANDLE]
        self.kernel.CloseHandle.argtypes = [wintypes.HANDLE]
        self.handle = self.kernel.CreateJobObjectW(None, None)
        limits = Extended()
        limits.basic.flags = 0x2000  # JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE
        if not self.handle or not self.kernel.SetInformationJobObject(
            self.handle, 9, ctypes.byref(limits), ctypes.sizeof(limits)
        ) or not self.kernel.AssignProcessToJobObject(self.handle, int(process._handle)):
            error = ctypes.WinError(ctypes.get_last_error())
            self.close()
            raise error

    def close(self):
        if self.handle:
            self.kernel.CloseHandle(self.handle)
            self.handle = None


class Child:
    def __init__(self, command, folder):
        self.progress = queue.Queue()
        self.threads = []
        self.errors = queue.Queue()
        self.process = subprocess.Popen(
            command, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, encoding="utf-8", errors="replace", bufsize=1, creationflags=NO_WINDOW,
        )
        try:
            self.job = Job(self.process)
        except BaseException:
            self.process.kill()
            self.process.wait(timeout=5)
            raise
        for name, stream in (("stdout", self.process.stdout), ("stderr", self.process.stderr)):
            thread = threading.Thread(
                target=self._drain, args=(name, stream, Path(folder) / f"{name}.log"),
                daemon=True,
            )
            thread.start()
            self.threads.append(thread)

    def _drain(self, name, stream, path):
        try:
            with path.open("x", encoding="utf-8") as output:
                for line in stream:
                    output.write(line)
                    output.flush()
                    if name == "stdout" and line.startswith(("frame=", "out_time_us=", "progress=")):
                        self.progress.put(line.strip())
        except BaseException as error:
            self.errors.put(str(error))

    def stop(self, grace=30):
        forced = False
        try:
            if self.process.poll() is None:
                try:
                    self.process.stdin.write("q\n")
                    self.process.stdin.flush()
                except (BrokenPipeError, OSError):
                    if self.process.poll() is None:
                        raise
                try:
                    self.process.wait(timeout=grace)
                except subprocess.TimeoutExpired:
                    forced = True
                    self.process.kill()
                    self.process.wait(timeout=5)
            for thread in self.threads:
                thread.join(timeout=5)
            if any(thread.is_alive() for thread in self.threads):
                raise RuntimeError("Recorder output did not drain to EOF.")
            if not self.errors.empty():
                raise RuntimeError(f"Recorder log failure: {self.errors.get()}")
            return self.process.returncode, forced
        finally:
            self.job.close()
            for stream in (self.process.stdin, self.process.stdout, self.process.stderr):
                stream.close()


def capture_args(tool, input_args, folder, seconds):
    return [
        tool, "-hide_banner", "-n", "-loglevel", "warning", "-nostats",
        "-progress", "pipe:1", "-stats_period", "0.5", *input_args,
        "-filter_complex", f"[0:v]{SCALE},split=2[video][still]",
        "-map", "[video]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18",
        "-r", "30", "-an", "-t", str(seconds), "-flush_packets", "1",
        str(folder / "master.mkv"),
        "-map", "[still]", "-frames:v", "1", "-c:v", "png", "-threads", "1",
        "-f", "image2", "-update", "1", str(folder / "first-frame.png"),
    ]


def take_path(root, take_id):
    return Path(root).resolve() / "takes" / safe_name(take_id)


def send_request(folder, action, chapter="", label=""):
    folder = Path(folder)
    if not (folder / "manifest.start.json").exists():
        raise ValueError("Unknown take.")
    if (folder / "manifest.final.json").exists():
        raise ValueError("Take has already stopped.")
    request_id = uuid.uuid4().hex
    request = {"id": request_id, "action": action, "chapter": chapter, "label": label, "utc": utc()}
    temporary = folder / "requests" / f"{request_id}.pending"
    write_json(temporary, request)
    temporary.rename(temporary.with_suffix(".json"))
    deadline = time.monotonic() + 40
    acknowledgment = folder / "requests" / f"{request_id}.ack"
    while not acknowledgment.exists():
        if time.monotonic() > deadline:
            raise TimeoutError("Controller did not acknowledge the request. Inspect the take; don't kill by name.")
        time.sleep(0.1)
    result = json.loads(acknowledgment.read_text(encoding="utf-8"))
    if result.get("error"):
        raise RuntimeError(result["error"])
    return result


class Recorder:
    def __init__(self, root, take_id, seconds, toolset, source_type, consent, window=None):
        safe_name(take_id)
        if not 1 <= seconds <= 7200:
            raise ValueError("Recording duration must be 1-7200 seconds.")
        self.root = Path(root).resolve()
        self.folder = take_path(root, take_id)
        if self.folder.exists():
            raise FileExistsError(f"Take already exists: {self.folder}")
        if (self.root / "recorder.lock").exists():
            raise FileExistsError("A recorder lock exists. Do not reclaim it while its owner is alive.")
        self.seconds, self.toolset, self.window = seconds, toolset, window
        self.manifest = {
            "schema": 1, "take_id": take_id, "capture_type": source_type, "consent": consent,
            "started_utc": utc(), "tools": toolset, "window": window, "max_seconds": seconds,
            "audio": False, "width": 1920, "height": 1080, "fps": 30,
            "controller_pid": os.getpid(), "private": True,
            "python_version": sys.version.split()[0], "recorder_sha256": digest(__file__),
        }
        self.child = None

    def run(self, input_args, startup_timeout=15, stall_timeout=5):
        self.root.mkdir(parents=True, exist_ok=True)
        lock = self.root / "recorder.lock"
        with lock.open("x", encoding="utf-8") as stream:
            stream.write(json.dumps({"pid": os.getpid(), "take": str(self.folder), "utc": utc()}))
        started = time.monotonic()
        reason, error, approved, frames, media_us = "error", None, False, 0, 0
        stop_requests = []
        forced, exit_code = False, None
        ready = False
        created_take = False
        last_progress = started
        previous_window_check = 0
        try:
            self.folder.mkdir(parents=True, exist_ok=False)
            created_take = True
            (self.folder / "requests").mkdir()
            write_json(self.folder / "manifest.start.json", self.manifest)
            command = capture_args(
                self.toolset["ffmpeg"]["path"], input_args, self.folder, self.seconds + 2,
            )
            self.child = Child(command, self.folder)
            append_json(self.folder / "events.jsonl", {
                "utc": utc(), "type": "recorder-start", "pid": self.child.process.pid,
                "command": command,
            })
            while True:
                now = time.monotonic()
                if not self.child.errors.empty():
                    raise RuntimeError(self.child.errors.get())
                while not self.child.progress.empty():
                    key, value = self.child.progress.get().split("=", 1)
                    if key == "frame":
                        new_frame = int(value)
                        if new_frame > frames:
                            last_progress = now
                        frames = new_frame
                    elif key == "out_time_us" and value != "N/A":
                        media_us = int(value)
                if frames > 1 and media_us > 0 and (self.folder / "first-frame.png").exists() and not ready:
                    ready = True
                    write_json(self.folder / "capture-ready.json", {
                        "utc": utc(), "frame_review_required": True,
                        "first_frame": str(self.folder / "first-frame.png"),
                    })
                    print(f"CAPTURING: inspect {self.folder / 'first-frame.png'}, then ApproveFrame.", flush=True)
                if self.child.process.poll() is not None:
                    raise RuntimeError(f"FFmpeg exited unexpectedly: {self.child.process.returncode}")
                if not ready and now - started > startup_timeout:
                    raise TimeoutError("No usable first frame and media progress within the startup timeout.")
                if ready and now - last_progress > stall_timeout:
                    raise TimeoutError("FFmpeg frame progress stalled.")
                if self.window and now - previous_window_check >= 1:
                    current = window_identity(self.window["title"], self.window["pid"])
                    if current != self.window:
                        raise RuntimeError("Selected window changed identity, bounds, or visibility.")
                    previous_window_check = now
                if shutil.disk_usage(self.root).free < 512 * 1024**2:
                    raise RuntimeError("Less than 512 MiB remains; stopping before disk exhaustion.")
                for request_file in sorted((self.folder / "requests").glob("*.json")):
                    ack_file = request_file.with_suffix(".ack")
                    if ack_file.exists() or request_file in stop_requests:
                        continue
                    request = json.loads(request_file.read_text(encoding="utf-8"))
                    event = {**request, "received_utc": utc(), "elapsed_seconds": now - started,
                             "media_seconds": media_us / 1_000_000,
                             "progress_sample_age_seconds": now - last_progress,
                             "wall_minus_encoded_media_seconds": now - started - media_us / 1_000_000,
                             "alignment": "Use the visible clock/slate; encoded progress can lag wall time."}
                    if request["action"] == "stop":
                        reason = "operator-stop"
                        stop_requests.append(request_file)
                    elif request["action"] == "approveframe":
                        if not ready:
                            write_json(ack_file, {"error": "First frame isn't available yet."})
                            continue
                        if approved:
                            write_json(ack_file, {"error": "The first frame was already approved."})
                            continue
                        approved = True
                        write_json(self.folder / "frame-approved.json", event)
                        print("READY: first frame approved. Begin only the authorized public work.", flush=True)
                    elif request["action"] == "mark":
                        append_json(self.folder / "markers.jsonl", event)
                    else:
                        write_json(ack_file, {"error": "Unknown controller request."})
                        continue
                    append_json(self.folder / "events.jsonl", event)
                    if request_file not in stop_requests:
                        write_json(ack_file, event)
                if stop_requests:
                    break
                if now - started >= self.seconds:
                    reason = "time-limit"
                    break
                time.sleep(0.05)
        except KeyboardInterrupt:
            reason = "cancelled"
        except Exception as caught:
            error = str(caught)
            reason = "error"
        finally:
            if self.child:
                try:
                    exit_code, forced = self.child.stop()
                    while not self.child.progress.empty():
                        key, value = self.child.progress.get().split("=", 1)
                        if key == "out_time_us" and value != "N/A":
                            media_us = int(value)
                        elif key == "frame":
                            frames = int(value)
                except Exception as caught:
                    error = f"{error or ''} Finalization: {caught}".strip()
            final = {
                **self.manifest, "ended_utc": utc(), "elapsed_seconds": time.monotonic() - started,
                "reason": reason, "error": error, "exit_code": exit_code, "forced": forced,
                "frame_approved": approved, "last_media_seconds": media_us / 1_000_000,
                "complete": reason == "operator-stop" and error is None and exit_code == 0 and not forced and approved,
                "ffmpeg_pid": self.child.process.pid if self.child else None,
            }
            try:
                if created_take:
                    write_json(self.folder / "manifest.final.json", final)
                    for request_file in stop_requests:
                        write_json(request_file.with_suffix(".ack"), final)
            finally:
                lock.unlink()
        if error:
            raise RuntimeError(error)
        return final


def probe(toolset, source):
    command = [toolset["ffprobe"]["path"], "-v", "error", "-count_frames",
               "-show_streams", "-show_format", "-of", "json", str(source)]
    result = subprocess.run(command, capture_output=True, text=True, timeout=900, creationflags=NO_WINDOW)
    if result.returncode:
        raise RuntimeError(f"ffprobe failed: {result.stderr.strip()}")
    data = json.loads(result.stdout)
    streams = data["streams"]
    if len(streams) != 1:
        raise ValueError("Expected exactly one video stream and no audio.")
    stream = streams[0]
    expected = {"codec_type": "video", "codec_name": "h264", "width": 1920,
                "height": 1080, "pix_fmt": "yuv420p", "r_frame_rate": "30/1"}
    if any(stream.get(k) != v for k, v in expected.items()):
        raise ValueError(f"Unexpected video format: {stream}")
    # MKV millisecond timestamps can slightly round a remuxed MP4's average rate.
    if abs(float(Fraction(stream["avg_frame_rate"])) - 30) > 0.05:
        raise ValueError("Average frame rate differs from 30 fps by more than 0.05.")
    if int(stream.get("nb_read_frames", 0)) < 1 or float(data["format"]["duration"]) <= 0:
        raise ValueError("Recording contains no usable video.")
    return data


def decode(toolset, source, log_path):
    with Path(log_path).open("x", encoding="utf-8") as log:
        result = subprocess.run(
            [toolset["ffmpeg"]["path"], "-v", "error", "-xerror", "-i", str(source),
             "-map", "0:v:0", "-f", "null", "-"],
            stdout=subprocess.DEVNULL, stderr=log, timeout=900, creationflags=NO_WINDOW,
        )
    if result.returncode:
        raise RuntimeError(f"Full decode failed. See {log_path}")


def verify(folder, toolset):
    folder = Path(folder)
    if not (folder / "manifest.final.json").exists():
        raise ValueError("Cannot verify a live or unfinalized take.")
    final = json.loads((folder / "manifest.final.json").read_text(encoding="utf-8"))
    report = folder / f"verify-{uuid.uuid4().hex[:8]}"
    report.mkdir()
    data = probe(toolset, folder / "master.mkv")
    write_json(report / "probe.json", data)
    duration = float(data["format"]["duration"])
    if abs(duration - final["last_media_seconds"]) > 2:
        raise ValueError(
            f"Media duration {duration:.3f}s differs from final progress "
            f"{final['last_media_seconds']:.3f}s by over two seconds."
        )
    decode(toolset, folder / "master.mkv", report / "decode.log")
    for name, seconds in (("start", 0), ("middle", duration / 2), ("end", max(0, duration - 0.2))):
        subprocess.run(
            [toolset["ffmpeg"]["path"], "-hide_banner", "-v", "error", "-n",
             "-ss", str(seconds), "-i", str(folder / "master.mkv"), "-frames:v", "1",
             "-update", "1", str(report / f"{name}.png")],
            capture_output=True, check=True, timeout=30, creationflags=NO_WINDOW,
        )
    result = {"media_valid": True, "take_complete": final["complete"], "duration_seconds": duration,
              "sha256": digest(folder / "master.mkv"), "report": str(report),
              "visual_review_required": True, "capture_type": final["capture_type"]}
    write_json(report / "result.json", result)
    return result


def export(folder, toolset, name, start=0, duration=0):
    folder = Path(folder)
    name = safe_name(name)
    if not (folder / "manifest.final.json").exists():
        raise ValueError("Source take must be finalized before export.")
    source = folder / "master.mkv"
    final = json.loads((folder / "manifest.final.json").read_text(encoding="utf-8"))
    if final["capture_type"] in ("artifact", "pilot"):
        raise ValueError("Retired custom-viewer takes are private diagnostics, not product footage.")
    source_probe = probe(toolset, source)
    source_duration = float(source_probe["format"]["duration"])
    if start < 0 or duration < 0 or start >= source_duration:
        raise ValueError("Invalid chapter range.")
    if duration and start + duration > source_duration + 0.034:
        raise ValueError("Chapter extends past the source recording.")
    if not duration and start:
        raise ValueError("Supply duration for a chapter, or zero start for a whole-take remux.")
    destination = folder / "exports" / name
    destination.mkdir(parents=True, exist_ok=False)
    original_hash = digest(source)
    command = [toolset["ffmpeg"]["path"], "-hide_banner", "-v", "error", "-n", "-i", str(source)]
    if duration:
        command += ["-ss", str(start), "-t", str(duration), "-c:v", "libx264",
                    "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p"]
    else:
        command += ["-c:v", "copy"]
    output = destination / f"{name}.mp4"
    command += ["-map", "0:v:0", "-an", "-movflags", "+faststart", str(output)]
    with (destination / "export.log").open("x", encoding="utf-8") as log:
        subprocess.run(command, stdout=subprocess.DEVNULL, stderr=log, check=True,
                       timeout=900, creationflags=NO_WINDOW)
    data = probe(toolset, output)
    actual = float(data["format"]["duration"])
    if abs(actual - (duration or source_duration)) > 0.1:
        raise ValueError("Export duration is outside the 0.1-second tolerance.")
    decode(toolset, output, destination / "decode.log")
    if digest(source) != original_hash:
        raise RuntimeError("Source changed during export.")
    result = {
        "source": str(source), "source_sha256": original_hash,
        "source_manifest": str(folder / "manifest.final.json"),
        "source_capture_type": final["capture_type"], "source_complete": final["complete"],
        "source_start_seconds": start, "requested_duration_seconds": duration or source_duration,
        "actual_duration_seconds": actual, "output": str(output), "output_sha256": digest(output),
        "operation": "chapter-reencode" if duration else "remux", "utc": utc(),
        "command": command, "speed": 1, "redactions": [], "publication_review_required": True,
    }
    write_json(destination / "provenance.json", result)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("preflight", "record", "approveframe", "mark", "stop", "verify", "export"))
    parser.add_argument("--output-root", required=True)
    parser.add_argument("--take-id")
    parser.add_argument("--consent", choices=("ReviewedCli",))
    parser.add_argument("--window-title")
    parser.add_argument("--window-pid", type=int)
    parser.add_argument("--max-seconds", type=int, default=90)
    parser.add_argument("--chapter", default="Slate", choices=("Slate", "Pilot", "C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7"))
    parser.add_argument("--label", default="")
    parser.add_argument("--export-name")
    parser.add_argument("--start-seconds", type=float, default=0)
    parser.add_argument("--duration-seconds", type=float, default=0)
    args = parser.parse_args()
    root = Path(args.output_root).resolve()
    public_root = Path(__file__).resolve().parents[2]
    if root == public_root or public_root in root.parents:
        raise ValueError("Raw recordings must be outside the public repository.")
    if args.action in ("preflight", "record"):
        if args.consent != "ReviewedCli":
            raise ValueError("Explicit ReviewedCli consent is required for the agreed terminal window.")
        if not args.window_title or not args.window_pid or args.window_pid < 1:
            raise ValueError("Window recording requires an exact title and a positive PID.")
        if not 1 <= args.max_seconds <= 7200:
            raise ValueError("Recording duration must be 1-7200 seconds.")
        if (root / "recorder.lock").exists():
            raise FileExistsError("Recorder lock exists. Refusing a second recorder.")
        ancestor = root
        while not ancestor.exists():
            ancestor = ancestor.parent
        if shutil.disk_usage(ancestor).free < 3 * 1024**3:
            raise RuntimeError("At least 3 GiB free storage is required.")
        toolset = tools()
        window = window_identity(args.window_title, args.window_pid)
        if args.action == "preflight":
            print(json.dumps({"tools": toolset, "window": window, "capture_type": "window",
                              "capture_tested": False, "consent": args.consent}, indent=2))
            return
        recorder = Recorder(root, args.take_id, args.max_seconds, toolset, "window", args.consent, window)
        result = recorder.run(
            ["-f", "gdigrab", "-framerate", "30", "-draw_mouse", "1", "-i", f"hwnd={window['hwnd']}"],
        )
    else:
        folder = take_path(root, args.take_id)
        if args.action in ("approveframe", "mark", "stop"):
            result = send_request(folder, args.action, args.chapter, args.label)
        elif args.action == "verify":
            result = verify(folder, tools())
        else:
            result = export(folder, tools(), args.export_name, args.start_seconds, args.duration_seconds)
    print(json.dumps(result, indent=2), flush=True)
    if (args.action in ("record", "stop") and not result["complete"]) or (
        args.action == "verify" and not result["take_complete"]
    ):
        print("INCOMPLETE: usable media is not proof of a completed take.", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr, flush=True)
        sys.exit(1)
