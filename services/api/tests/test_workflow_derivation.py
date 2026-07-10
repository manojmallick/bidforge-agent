import unittest

from app.core.document_intake import parse_rfp_document
from app.core.workflow_derivation import derive_executive_brief, derive_governance_panel, derive_judge_report, derive_proposal_sections, derive_risks, derive_tasks


class WorkflowDerivationTests(unittest.TestCase):
    def test_derives_risks_and_tasks_from_uploaded_requirements(self) -> None:
        parsed = parse_rfp_document(
            "\n".join(
                [
                    "Buyer: Northwind Bank",
                    "Project: Cloud migration",
                    "Vendor must provide 24x7 support.",
                    "Supplier shall comply with EU data residency.",
                    "Provider must include incident response process.",
                ]
            )
        )

        risks = derive_risks(parsed.requirements)
        tasks = derive_tasks(parsed.requirements)

        self.assertEqual(len(risks), 1)
        self.assertEqual(risks[0].category, "Compliance")
        self.assertEqual(risks[0].owner, "Legal")
        self.assertGreaterEqual(len(tasks), 3)
        self.assertIn("U-002", tasks[1].link)

    def test_derives_judge_report_from_review_load(self) -> None:
        parsed = parse_rfp_document(
            "Buyer: Test\nSupplier shall comply with EU data residency.\nVendor must provide support."
        )
        risks = derive_risks(parsed.requirements)

        judge = derive_judge_report(parsed.requirements, len(risks))

        self.assertEqual(judge.decision, "Needs human review")
        self.assertLess(judge.score, 87)
        self.assertEqual(judge.checks[0].label, "Requirement coverage")

    def test_derives_proposal_sections_from_uploaded_requirements(self) -> None:
        parsed = parse_rfp_document(
            "Buyer: Northwind Bank\nProject: Cloud migration\nSupplier shall comply with EU data residency.\nVendor must provide support."
        )
        risks = derive_risks(parsed.requirements)

        sections = derive_proposal_sections(parsed.buyer, parsed.project, parsed.requirements, risks)

        self.assertEqual(sections[0].title, "Executive Summary")
        self.assertIn("Northwind Bank", sections[0].body)
        self.assertIn("U-001", sections[1].body)
        self.assertEqual(sections[2].status, "Needs SME")
        self.assertIn("U-001", sections[3].body)

    def test_derives_executive_brief_from_run_signals(self) -> None:
        parsed = parse_rfp_document(
            "Buyer: Northwind Bank\nProject: Cloud migration\nSupplier shall comply with EU data residency.\nVendor must provide support."
        )
        risks = derive_risks(parsed.requirements)
        judge = derive_judge_report(parsed.requirements, len(risks))

        brief = derive_executive_brief(parsed.buyer, parsed.project, parsed.requirements, risks, judge)

        self.assertIn("Northwind Bank", brief.opportunitySummary)
        self.assertEqual(brief.confidenceLevel, "Medium")
        self.assertIn("Compliance requirement needs validation", brief.majorRisks)
        self.assertIn("U-001", brief.missingInputs[0])
        self.assertIn("controlled bid response", brief.bidRecommendation)

    def test_derives_governance_panel_from_risks_and_tasks(self) -> None:
        parsed = parse_rfp_document(
            "Buyer: Northwind Bank\nProject: Cloud migration\nSupplier shall comply with EU data residency.\nVendor must provide support."
        )
        risks = derive_risks(parsed.requirements)
        tasks = derive_tasks(parsed.requirements)

        governance = derive_governance_panel(risks, tasks)

        self.assertEqual(governance.roles[0].role, "Bid manager")
        self.assertEqual(governance.approvalGates[0].status, "Required")
        self.assertEqual(governance.approvalGates[-1].status, "Blocked")
        self.assertEqual(governance.controls[0].state, "Enabled")


if __name__ == "__main__":
    unittest.main()
