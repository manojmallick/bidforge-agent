from __future__ import annotations

from app.models.schemas import (
    ApprovalGate,
    ExecutiveBrief,
    GovernanceControl,
    GovernancePanel,
    GovernanceRole,
    JudgeCheck,
    JudgeReport,
    ProposalSection,
    Requirement,
    RiskItem,
    SmeTask,
)


def derive_risks(requirements: list[Requirement]) -> list[RiskItem]:
    risks: list[RiskItem] = []
    for index, requirement in enumerate(requirements, start=1):
        if requirement.status not in ("Needs SME", "Gap"):
            continue
        severity = "Critical" if requirement.category in ("Compliance", "Commercial") else "High"
        risks.append(
            RiskItem(
                id=f"R-U{index:03d}",
                severity=severity,
                category=requirement.category,
                title=f"{requirement.category} requirement needs validation",
                owner=requirement.owner,
                mitigation=f"Review uploaded requirement {requirement.id}: {requirement.text}",
                approval="Required",
            )
        )
    if risks:
        return risks
    return [
        RiskItem(
            id="R-U001",
            severity="Low",
            category="Delivery",
            title="Uploaded requirements need final reviewer confirmation",
            owner="Bid manager",
            mitigation="Confirm extracted requirements before proposal export.",
            approval="Pending",
        )
    ]


def derive_tasks(requirements: list[Requirement]) -> list[SmeTask]:
    tasks = [
        SmeTask(
            status="Assigned" if requirement.status == "Needs SME" else "Pending",
            owner=requirement.owner,
            title=f"Validate {requirement.category.lower()} requirement {requirement.id}",
            link=f"T-{index:03d} - linked to {requirement.id}",
        )
        for index, requirement in enumerate(requirements, start=1)
        if requirement.status in ("Needs SME", "Gap", "Pending")
    ]
    return tasks[:12]


def derive_proposal_sections(buyer: str, project: str, requirements: list[Requirement], risks: list[RiskItem]) -> list[ProposalSection]:
    requirement_summary = _requirement_summary(requirements)
    blockers = [requirement for requirement in requirements if requirement.status in ("Needs SME", "Gap")]
    verified_count = len([requirement for requirement in requirements if requirement.status in ("Verified", "Pending")])
    return [
        ProposalSection(
            title="Executive Summary",
            status="Needs SME" if blockers else "Verified",
            body=(
                f"BidForge prepared a response for {buyer} covering {project}. "
                f"The draft maps {len(requirements)} uploaded requirements across {requirement_summary}."
            ),
        ),
        ProposalSection(
            title="Solution Approach",
            status="Verified" if verified_count else "Needs SME",
            body=(
                "The proposed approach prioritizes the extracted mandatory requirements, "
                f"including {', '.join(requirement.id for requirement in requirements[:4])}. "
                "Delivery owners should confirm assumptions before export."
            ),
        ),
        ProposalSection(
            title="Risk & Compliance Position",
            status="Needs SME" if risks else "Verified",
            body=(
                f"{len(risks)} risk item(s) require review. "
                + ("; ".join(risk.title for risk in risks[:3]) if risks else "No high-risk uploaded requirements were detected.")
            ),
        ),
        ProposalSection(
            title="Open Assumptions",
            status="Unsupported" if blockers else "Verified",
            body=(
                "; ".join(f"{requirement.id}: {requirement.text}" for requirement in blockers[:4])
                if blockers
                else "No unsupported assumptions were detected from the uploaded RFP text."
            ),
        ),
    ]


def derive_judge_report(requirements: list[Requirement], risk_count: int) -> JudgeReport:
    total_requirements = max(1, len(requirements))
    needs_review = len([requirement for requirement in requirements if requirement.status in ("Needs SME", "Gap")])
    supported = total_requirements - needs_review
    coverage_score = max(0, round((supported / total_requirements) * 25))
    citation_score = max(8, min(20, 12 + supported * 2))
    hallucination_score = 18 if risk_count <= 1 else 15
    risk_score = max(6, 15 - min(risk_count, 9))
    usefulness_score = 8 if needs_review else 9
    readiness_score = 6 if needs_review else 9
    total_score = min(100, coverage_score + citation_score + hallucination_score + risk_score + usefulness_score + readiness_score)
    decision = "Needs human review" if needs_review else "Ready with human review"
    return JudgeReport(
        decision=decision,
        score=total_score,
        checks=[
            JudgeCheck("Requirement coverage", coverage_score, 25),
            JudgeCheck("Citation support", citation_score, 20),
            JudgeCheck("Hallucination control", hallucination_score, 20),
            JudgeCheck("Risk detection", risk_score, 15),
            JudgeCheck("Proposal usefulness", usefulness_score, 10),
            JudgeCheck("Human-review readiness", readiness_score, 10),
        ],
    )


def derive_executive_brief(
    buyer: str,
    project: str,
    requirements: list[Requirement],
    risks: list[RiskItem],
    judge: JudgeReport,
) -> ExecutiveBrief:
    categories = _ordered_unique([requirement.category for requirement in requirements])[:4]
    verified_count = len([requirement for requirement in requirements if requirement.status == "Verified"])
    gap_count = len([requirement for requirement in requirements if requirement.status in ("Needs SME", "Gap")])
    missing_inputs = [
        f"{requirement.id}: {requirement.text}"
        for requirement in requirements
        if requirement.status in ("Needs SME", "Gap")
    ][:3]
    if not missing_inputs:
        missing_inputs = ["No blocker inputs identified. Final owner review still recommended before export."]

    confidence_level = "High" if judge.score >= 85 and not risks else "Medium" if judge.score >= 72 else "Low"
    bid_recommendation = (
        "Proceed with controlled bid response after required approvals."
        if risks or gap_count
        else "Proceed to final response review."
    )
    return ExecutiveBrief(
        opportunitySummary=(
            f"{buyer} is evaluating {project}. BidForge extracted {len(requirements)} requirement(s), "
            f"verified {verified_count}, and flagged {gap_count} owner input item(s)."
        ),
        winThemes=[f"Position around {category.lower()} readiness" for category in categories[:3]]
        or ["Position around governed delivery and reusable HCLTech accelerators."],
        majorRisks=[risk.title for risk in risks[:3]] or ["No material risks detected in the uploaded sample."],
        missingInputs=missing_inputs,
        confidenceLevel=confidence_level,
        bidRecommendation=bid_recommendation,
    )


def derive_governance_panel(risks: list[RiskItem], tasks: list[SmeTask]) -> GovernancePanel:
    owner_status = {task.owner: task.status for task in tasks}
    risk_categories = {risk.category for risk in risks if risk.approval == "Required"}
    return GovernancePanel(
        roles=[
            GovernanceRole("Bid manager", "Create runs, operate automation, export drafts", "Senior Bid Mgr", "Active"),
            GovernanceRole("Legal reviewer", "Approve compliance, legal terms, residency clauses", "Legal", owner_status.get("Legal", "Waiting")),
            GovernanceRole("Finance reviewer", "Approve pricing, penalty caps, commercial assumptions", "Finance", owner_status.get("Finance", "Waiting")),
            GovernanceRole("Delivery lead", "Approve transition, staffing, SLA delivery model", "Delivery", owner_status.get("Delivery", "Waiting")),
            GovernanceRole("Security SME", "Approve controls, incident response, evidence citations", "Security", owner_status.get("Security", "Waiting")),
        ],
        approvalGates=[
            _approval_gate("Legal approval", "Legal", "Required" if risk_categories & {"Legal", "Compliance"} else "Cleared", "Compliance and contractual language"),
            _approval_gate("Pricing approval", "Finance", "Required" if risk_categories & {"Commercial", "SLA"} else "Cleared", "Pricing model, SLA penalties, assumptions"),
            _approval_gate("Delivery approval", "Delivery", "Required" if "Delivery" in risk_categories else "Cleared", "Transition plan and staffing dependencies"),
            _approval_gate("Security approval", "Security", "Required" if "Security" in risk_categories else "Cleared", "Control evidence and incident response citations"),
            _approval_gate("Final export", "Bid manager", "Blocked" if risk_categories else "Ready", "All mandatory gates must clear before export"),
        ],
        controls=[
            GovernanceControl("RBAC", "Enabled", "Automation mutations require bid_manager or admin role."),
            GovernanceControl("Audit trail", "Enabled", "Run creation, automation changes, and denied actions are recorded."),
            GovernanceControl("Guardrails", "Enabled", "Prompt-injection content remains quarantined before draft generation."),
            GovernanceControl("Human gates", "Active", "Required approvals block final export while risks remain open."),
        ],
    )


def _requirement_summary(requirements: list[Requirement]) -> str:
    categories = _ordered_unique([requirement.category for requirement in requirements])
    return ", ".join(categories) if categories else "general delivery"


def _ordered_unique(values: list[str]) -> list[str]:
    unique: list[str] = []
    for value in values:
        if value and value not in unique:
            unique.append(value)
    return unique


def _approval_gate(gate: str, owner: str, status: str, evidence: str) -> ApprovalGate:
    return ApprovalGate(gate=gate, owner=owner, status=status, evidence=evidence)
