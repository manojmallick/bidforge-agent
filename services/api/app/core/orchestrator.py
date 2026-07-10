from __future__ import annotations

from dataclasses import replace

from app.agents.capability_agent import CapabilityAgent
from app.agents.intake_agent import IntakeAgent
from app.agents.judge_agent import JudgeAgent
from app.agents.proposal_agent import ProposalAgent
from app.agents.requirement_agent import RequirementAgent
from app.agents.risk_agent import RiskAgent
from app.agents.sme_router_agent import SmeRouterAgent
from app.core.document_intake import parse_rfp_document
from app.core.guardrails import detect_prompt_injection
from app.core.workflow_derivation import derive_executive_brief, derive_governance_panel, derive_judge_report, derive_proposal_sections, derive_risks, derive_tasks
from app.data.demo_run import get_demo_run
from app.models.schemas import BidForgeRun


class BidForgeOrchestrator:
    def __init__(self) -> None:
        self.intake_agent = IntakeAgent()
        self.requirement_agent = RequirementAgent()
        self.capability_agent = CapabilityAgent()
        self.proposal_agent = ProposalAgent()
        self.risk_agent = RiskAgent()
        self.sme_router_agent = SmeRouterAgent()
        self.judge_agent = JudgeAgent()

    def run_demo(self, rfp_text: str = "", source_file: str = "") -> BidForgeRun:
        run = get_demo_run()
        self.intake_agent.inspect(run.upload.file)
        self.requirement_agent.extract(run.requirementsTable)
        self.capability_agent.match(run.evidenceSources)
        self.proposal_agent.draft(run.proposalSections)
        self.risk_agent.assess(run.riskRegister)
        self.sme_router_agent.route(run.tasks)
        self.judge_agent.verify(run.judge)
        detect_prompt_injection(rfp_text)
        if not rfp_text.strip():
            return run

        parsed = parse_rfp_document(rfp_text, source_file or run.upload.file)
        upload = replace(
            run.upload,
            file=parsed.sourceFile,
            size=parsed.sizeLabel,
            warning=parsed.warning,
        )
        risks = derive_risks(parsed.requirements)
        tasks = derive_tasks(parsed.requirements)
        judge = derive_judge_report(parsed.requirements, len(risks))
        proposal_sections = derive_proposal_sections(parsed.buyer, parsed.project, parsed.requirements, risks)
        executive_brief = derive_executive_brief(parsed.buyer, parsed.project, parsed.requirements, risks, judge)
        governance = derive_governance_panel(risks, tasks)
        return replace(
            run,
            buyer=parsed.buyer,
            project=parsed.project,
            requirements=parsed.requirementCount,
            risks=len(risks),
            coverage=_coverage(parsed.requirements),
            status="Document intake complete",
            upload=upload,
            requirementsTable=parsed.requirements,
            riskRegister=risks,
            tasks=tasks,
            judge=judge,
            proposalSections=proposal_sections,
            executiveBrief=executive_brief,
            governance=governance,
            qualityScore=judge.score,
        )


def _coverage(requirements) -> int:
    if not requirements:
        return 0
    covered = len([requirement for requirement in requirements if requirement.status in ("Verified", "Pending", "Needs SME")])
    return round((covered / len(requirements)) * 100)
