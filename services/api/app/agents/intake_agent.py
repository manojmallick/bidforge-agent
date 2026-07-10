from __future__ import annotations


class IntakeAgent:
    name = "Intake Agent"

    def inspect(self, rfp_name: str) -> dict:
        return {
            "buyer": "Apex Global Bank",
            "project": "Managed cloud migration and application modernization",
            "source": rfp_name,
            "deadline": "14 days",
            "guardrail_events": ["prompt_injection_pattern_quarantined"],
        }
