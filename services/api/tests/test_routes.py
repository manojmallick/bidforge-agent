import os
import tempfile
import unittest

from app.routes.runs import create_demo_run_response, get_demo_run_response


class RouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        os.environ["BIDFORGE_AUTOMATION_STATE_PATH"] = f"{self.temp_dir.name}/automation_state.json"
        os.environ["BIDFORGE_AUDIT_STATE_PATH"] = f"{self.temp_dir.name}/audit_events.json"

    def tearDown(self) -> None:
        os.environ.pop("BIDFORGE_AUTOMATION_STATE_PATH", None)
        os.environ.pop("BIDFORGE_AUDIT_STATE_PATH", None)
        self.temp_dir.cleanup()

    def test_get_demo_run_response(self) -> None:
        status, payload = get_demo_run_response()

        self.assertEqual(status, 200)
        self.assertEqual(payload["runId"], "RFP-742-B")
        self.assertEqual(payload["qualityScore"], 84)
        self.assertTrue(payload["auditTrail"])

    def test_create_demo_run_response(self) -> None:
        status, payload = create_demo_run_response(
            b'{"rfpText":"Buyer: Northwind Bank\\nProject: Cloud migration\\nVendor must provide support.","actor":"Senior Bid Mgr","role":"bid_manager","file":"Northwind.txt"}'
        )

        self.assertEqual(status, 201)
        self.assertEqual(payload["buyer"], "Northwind Bank")
        self.assertEqual(payload["upload"]["file"], "Northwind.txt")
        self.assertEqual(payload["requirementsTable"][0]["id"], "U-001")
        self.assertEqual(payload["requirementsTable"][0]["evidence"], "Uploaded RFP text")
        self.assertEqual(payload["status"], "Automation refresh complete")
        self.assertIn("Upload-triggered", payload["automationHistory"][0]["summary"])
        self.assertEqual(payload["auditTrail"][0]["actor"], "Senior Bid Mgr")
        self.assertIn("Northwind.txt", payload["auditTrail"][0]["detail"])

    def test_reject_unauthorized_run_creation(self) -> None:
        status, payload = create_demo_run_response(
            b'{"rfpText":"Vendor must provide support.","actor":"Viewer","role":"viewer","file":"Apex.pdf"}'
        )

        self.assertEqual(status, 403)
        self.assertEqual(payload["error"], "forbidden")
        self.assertEqual(payload["auditTrail"][0]["outcome"], "Denied")
