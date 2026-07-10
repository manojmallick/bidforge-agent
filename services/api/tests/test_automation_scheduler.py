import time
import unittest

from app.core.automation_scheduler import AutomationScheduler
from app.models.schemas import AutomationConfig, AutomationRunRecord


def automation_config() -> AutomationConfig:
    return AutomationConfig(
        id="auto-test",
        name="Test automation",
        status="Active",
        frequencyMinutes=5,
        nextRunIn="5 min",
        lastRunAt="Never",
        runMode="Balanced review",
        trigger="Test trigger",
        guarded=True,
        owner="Bid manager",
        nextRunAt="",
    )


class AutomationSchedulerTests(unittest.TestCase):
    def test_tick_once_records_run_status(self) -> None:
        record = AutomationRunRecord(
            id="auto-run-scheduled",
            status="Completed",
            startedAt="Now",
            finishedAt="Now",
            summary="Scheduled automation run completed.",
            changedArtifacts=["Judge report"],
        )
        scheduler = AutomationScheduler(interval_seconds=1, runner=lambda: (automation_config(), record))

        result = scheduler.tick_once()
        status = scheduler.status()

        self.assertEqual(result, record)
        self.assertEqual(status.tickCount, 1)
        self.assertEqual(status.lastRunId, "auto-run-scheduled")
        self.assertEqual(status.lastError, "")

    def test_tick_once_records_noop_without_run_id(self) -> None:
        scheduler = AutomationScheduler(interval_seconds=1, runner=lambda: (automation_config(), None))

        result = scheduler.tick_once()
        status = scheduler.status()

        self.assertIsNone(result)
        self.assertEqual(status.tickCount, 1)
        self.assertEqual(status.lastRunId, "")

    def test_start_and_stop_worker(self) -> None:
        calls = []

        def runner():
            calls.append("tick")
            return automation_config(), None

        scheduler = AutomationScheduler(interval_seconds=1, runner=runner)

        scheduler.start()
        time.sleep(0.05)
        scheduler.stop()

        self.assertFalse(scheduler.status().running)
        self.assertGreaterEqual(len(calls), 1)

    def test_worker_captures_runner_error(self) -> None:
        def runner():
            raise RuntimeError("runner failed")

        scheduler = AutomationScheduler(interval_seconds=1, runner=runner)

        result = scheduler.tick_once()
        status = scheduler.status()

        self.assertIsNone(result)
        self.assertEqual(status.tickCount, 1)
        self.assertEqual(status.lastError, "runner failed")


if __name__ == "__main__":
    unittest.main()
