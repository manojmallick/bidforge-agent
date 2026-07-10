from __future__ import annotations

from app.models.schemas import JudgeReport


class JudgeAgent:
    name = "Judge Agent"

    def verify(self, report: JudgeReport) -> JudgeReport:
        return report
