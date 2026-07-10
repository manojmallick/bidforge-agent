from __future__ import annotations

from app.models.schemas import EvidenceSource


class CapabilityAgent:
    name = "Capability Agent"

    def match(self, sources: list[EvidenceSource]) -> list[EvidenceSource]:
        return sources
