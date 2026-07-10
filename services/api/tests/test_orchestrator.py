import unittest

from app.core.orchestrator import BidForgeOrchestrator


class OrchestratorTests(unittest.TestCase):
    def test_demo_run_contains_expected_bidforge_artifacts(self) -> None:
        run = BidForgeOrchestrator().run_demo()

        self.assertEqual(run.runId, "RFP-742-B")
        self.assertTrue(run.requirementsTable)
        self.assertTrue(run.proposalSections)
        self.assertTrue(run.riskRegister)
        self.assertTrue(run.tasks)
        self.assertTrue(run.executiveBrief.winThemes)
        self.assertTrue(run.governance.approvalGates)
        self.assertEqual(run.judge.score, 87)
        self.assertEqual(run.automation.frequencyMinutes, 5)
        self.assertTrue(run.automationHistory)

    def test_demo_run_serializes_to_frontend_shape(self) -> None:
        payload = BidForgeOrchestrator().run_demo().to_dict()

        self.assertEqual(payload["buyer"], "Apex Global Bank")
        self.assertEqual(payload["upload"]["selectedMode"], "Balanced review")
        self.assertEqual(payload["requirementsTable"][0]["id"], "M-001")
        self.assertEqual(payload["judge"]["checks"][0]["label"], "Requirement coverage")
        self.assertEqual(payload["executiveBrief"]["confidenceLevel"], "Medium")
        self.assertEqual(payload["governance"]["controls"][0]["label"], "RBAC")
        self.assertEqual(payload["automation"]["frequencyMinutes"], 5)
        self.assertEqual(payload["automationHistory"][0]["status"], "Completed")
