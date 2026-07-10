from __future__ import annotations

from app.models.schemas import RiskItem


class RiskAgent:
    name = "Risk Agent"

    def assess(self, risks: list[RiskItem]) -> list[RiskItem]:
        return risks
