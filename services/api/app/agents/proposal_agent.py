from __future__ import annotations

from app.models.schemas import ProposalSection


class ProposalAgent:
    name = "Proposal Writer"

    def draft(self, sections: list[ProposalSection]) -> list[ProposalSection]:
        return sections
