from __future__ import annotations

from app.models.schemas import SmeTask


class SmeRouterAgent:
    name = "SME Router"

    def route(self, tasks: list[SmeTask]) -> list[SmeTask]:
        return tasks
