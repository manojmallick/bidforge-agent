from __future__ import annotations

from app.models.schemas import Requirement


class RequirementAgent:
    name = "Requirement Agent"

    def extract(self, requirements: list[Requirement]) -> list[Requirement]:
        return requirements
