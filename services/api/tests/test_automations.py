import os
import tempfile
import unittest
from datetime import datetime, timedelta, timezone

from app.core.audit_store import load_audit_events
from app.core.automation_service import (
    get_automation_history,
    get_current_automation,
    pause_automation,
    resume_automation,
    run_automation_now,
    run_due_automation,
    update_automation_frequency,
)
from app.routes.automations import (
    get_automation_response,
    pause_automation_response,
    resume_automation_response,
    run_automation_now_response,
    update_automation_response,
)


class AutomationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        os.environ["BIDFORGE_AUTOMATION_STATE_PATH"] = f"{self.temp_dir.name}/automation_state.json"
        os.environ["BIDFORGE_AUDIT_STATE_PATH"] = f"{self.temp_dir.name}/audit_events.json"

    def tearDown(self) -> None:
        os.environ.pop("BIDFORGE_AUTOMATION_STATE_PATH", None)
        os.environ.pop("BIDFORGE_AUDIT_STATE_PATH", None)
        self.temp_dir.cleanup()

    def test_default_frequency_is_five_minutes(self) -> None:
        automation = get_current_automation()

        self.assertEqual(automation.frequencyMinutes, 5)
        self.assertEqual(automation.status, "Active")

    def test_history_exists(self) -> None:
        history = get_automation_history()

        self.assertGreaterEqual(len(history), 1)
        self.assertEqual(history[0].status, "Completed")

    def test_update_frequency(self) -> None:
        automation = update_automation_frequency(5)

        self.assertEqual(automation.frequencyMinutes, 5)
        self.assertEqual(automation.nextRunIn, "5 min")
        self.assertTrue(automation.nextRunAt)

    def test_reject_invalid_frequency(self) -> None:
        with self.assertRaises(ValueError):
            update_automation_frequency(0)

    def test_update_frequency_persists(self) -> None:
        update_automation_frequency(7)

        automation = get_current_automation()

        self.assertEqual(automation.frequencyMinutes, 7)
        self.assertEqual(automation.nextRunIn, "7 min")

    def test_pause_and_resume_automation(self) -> None:
        paused = pause_automation()

        self.assertEqual(paused.status, "Paused")
        self.assertEqual(paused.nextRunIn, "Paused")
        self.assertEqual(paused.nextRunAt, "")

        resumed = resume_automation()

        self.assertEqual(resumed.status, "Active")
        self.assertEqual(resumed.nextRunIn, "5 min")
        self.assertTrue(resumed.nextRunAt)

    def test_paused_automation_does_not_run_when_due(self) -> None:
        pause_automation()

        automation, record = run_due_automation()

        self.assertEqual(automation.status, "Paused")
        self.assertIsNone(record)

    def test_due_automation_runs_when_scheduled_time_passed(self) -> None:
        now = datetime(2026, 6, 24, 10, 0, tzinfo=timezone.utc)
        update_automation_frequency(5, now=now - timedelta(minutes=10))

        automation, record = run_due_automation(now=now)

        self.assertEqual(automation.status, "Active")
        self.assertIsNotNone(record)
        self.assertIn("Scheduled", record.summary if record else "")

    def test_get_automation_route(self) -> None:
        status, payload = get_automation_response()

        self.assertEqual(status, 200)
        self.assertEqual(payload["frequencyMinutes"], 5)

    def test_update_automation_route(self) -> None:
        status, payload = update_automation_response(b'{"frequencyMinutes": 5, "actor": "Senior Bid Mgr", "role": "bid_manager"}')

        self.assertEqual(status, 200)
        self.assertEqual(payload["nextRunIn"], "5 min")
        self.assertIn("history", payload)
        self.assertIn("auditTrail", payload)

    def test_pause_and_resume_routes(self) -> None:
        pause_status, pause_payload = pause_automation_response()
        resume_status, resume_payload = resume_automation_response()

        self.assertEqual(pause_status, 200)
        self.assertEqual(pause_payload["status"], "Paused")
        self.assertEqual(resume_status, 200)
        self.assertEqual(resume_payload["status"], "Active")

    def test_reject_unauthorized_frequency_update(self) -> None:
        status, payload = update_automation_response(b'{"frequencyMinutes": 5, "actor": "Viewer", "role": "viewer"}')

        self.assertEqual(status, 403)
        self.assertEqual(payload["error"], "forbidden")
        self.assertEqual(load_audit_events()[0].outcome, "Denied")

    def test_audit_authorized_manual_run(self) -> None:
        status, payload = run_automation_now_response(b'{"actor": "Senior Bid Mgr", "role": "bid_manager"}')

        self.assertEqual(status, 202)
        self.assertEqual(payload["auditTrail"][0]["action"], "Ran automation manually")
        self.assertEqual(payload["auditTrail"][0]["outcome"], "Approved")

    def test_run_automation_now(self) -> None:
        automation, record = run_automation_now()

        self.assertEqual(automation.frequencyMinutes, 5)
        self.assertEqual(record.status, "Completed")
        self.assertIn("Risk register", record.changedArtifacts)
        self.assertEqual(get_automation_history()[0].id, record.id)

    def test_run_automation_now_route(self) -> None:
        status, payload = run_automation_now_response()

        self.assertEqual(status, 202)
        self.assertEqual(payload["automation"]["frequencyMinutes"], 5)
        self.assertEqual(payload["run"]["status"], "Completed")
