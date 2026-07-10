from __future__ import annotations

import os
import threading
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from time import monotonic
from typing import Callable, Optional

from app.core.automation_service import run_due_automation
from app.models.schemas import AutomationConfig, AutomationRunRecord


DEFAULT_TICK_SECONDS = 10
RunDueAutomation = Callable[[], tuple[AutomationConfig, Optional[AutomationRunRecord]]]


@dataclass(frozen=True)
class AutomationSchedulerStatus:
    running: bool
    intervalSeconds: int
    tickCount: int
    lastTickAt: str
    lastRunId: str
    lastError: str


class AutomationScheduler:
    def __init__(self, interval_seconds: int | None = None, runner: RunDueAutomation = run_due_automation) -> None:
        self.interval_seconds = interval_seconds or _configured_tick_seconds()
        self._runner = runner
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None
        self._lock = threading.Lock()
        self._tick_count = 0
        self._last_tick_at = ""
        self._last_run_id = ""
        self._last_error = ""

    def start(self) -> None:
        with self._lock:
            if self._thread and self._thread.is_alive():
                return
            self._stop_event.clear()
            self._thread = threading.Thread(target=self._run_loop, name="bidforge-automation-scheduler", daemon=True)
            self._thread.start()

    def stop(self, timeout_seconds: float = 2) -> None:
        with self._lock:
            thread = self._thread
            self._stop_event.set()
        if thread and thread.is_alive():
            thread.join(timeout_seconds)

    def tick_once(self) -> AutomationRunRecord | None:
        try:
            _, record = self._runner()
        except Exception as exc:  # pragma: no cover - defensive guard for daemon worker
            with self._lock:
                self._tick_count += 1
                self._last_tick_at = _utc_timestamp()
                self._last_error = str(exc)
            return None

        with self._lock:
            self._tick_count += 1
            self._last_tick_at = _utc_timestamp()
            self._last_error = ""
            if record:
                self._last_run_id = record.id
        return record

    def status(self) -> AutomationSchedulerStatus:
        with self._lock:
            return AutomationSchedulerStatus(
                running=bool(self._thread and self._thread.is_alive()),
                intervalSeconds=self.interval_seconds,
                tickCount=self._tick_count,
                lastTickAt=self._last_tick_at,
                lastRunId=self._last_run_id,
                lastError=self._last_error,
            )

    def _run_loop(self) -> None:
        next_tick = monotonic()
        while not self._stop_event.is_set():
            wait_seconds = max(0.0, next_tick - monotonic())
            if self._stop_event.wait(wait_seconds):
                break
            self.tick_once()
            next_tick = monotonic() + self.interval_seconds


def _configured_tick_seconds() -> int:
    raw_value = os.environ.get("BIDFORGE_AUTOMATION_TICK_SECONDS", str(DEFAULT_TICK_SECONDS))
    try:
        return max(1, int(raw_value))
    except ValueError:
        return DEFAULT_TICK_SECONDS


def _utc_timestamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")


_SCHEDULER = AutomationScheduler()


def start_automation_scheduler() -> AutomationScheduler:
    _SCHEDULER.start()
    return _SCHEDULER


def stop_automation_scheduler() -> None:
    _SCHEDULER.stop()


def get_automation_scheduler_status() -> dict:
    return asdict(_SCHEDULER.status())
