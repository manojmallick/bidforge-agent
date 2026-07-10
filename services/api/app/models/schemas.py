from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Requirement:
    id: str
    category: str
    priority: str
    text: str
    status: str
    evidence: str
    owner: str
    confidence: str


@dataclass(frozen=True)
class ProposalSection:
    title: str
    status: str
    body: str


@dataclass(frozen=True)
class EvidenceSource:
    name: str
    detail: str


@dataclass(frozen=True)
class RiskItem:
    id: str
    severity: str
    category: str
    title: str
    owner: str
    mitigation: str
    approval: str


@dataclass(frozen=True)
class SmeTask:
    status: str
    owner: str
    title: str
    link: str


@dataclass(frozen=True)
class JudgeCheck:
    label: str
    score: int
    max: int


@dataclass(frozen=True)
class UploadConfig:
    file: str
    size: str
    knowledgeBase: str
    selectedMode: str
    estimatedCost: str
    estimatedTime: str
    warning: str


@dataclass(frozen=True)
class RoiSummary:
    hoursSaved: int
    firstDraftReduction: str


@dataclass(frozen=True)
class ExecutiveBrief:
    opportunitySummary: str
    winThemes: list[str]
    majorRisks: list[str]
    missingInputs: list[str]
    confidenceLevel: str
    bidRecommendation: str


@dataclass(frozen=True)
class GovernanceRole:
    role: str
    access: str
    owner: str
    status: str


@dataclass(frozen=True)
class ApprovalGate:
    gate: str
    owner: str
    status: str
    evidence: str


@dataclass(frozen=True)
class GovernanceControl:
    label: str
    state: str
    detail: str


@dataclass(frozen=True)
class GovernancePanel:
    roles: list[GovernanceRole]
    approvalGates: list[ApprovalGate]
    controls: list[GovernanceControl]


@dataclass(frozen=True)
class TimelineStep:
    agent: str
    state: str
    note: str


@dataclass(frozen=True)
class JudgeReport:
    decision: str
    score: int
    checks: list[JudgeCheck]


@dataclass(frozen=True)
class AutomationConfig:
    id: str
    name: str
    status: str
    frequencyMinutes: int
    nextRunIn: str
    lastRunAt: str
    runMode: str
    trigger: str
    guarded: bool
    owner: str
    nextRunAt: str = ""


@dataclass(frozen=True)
class AutomationRunRecord:
    id: str
    status: str
    startedAt: str
    finishedAt: str
    summary: str
    changedArtifacts: list[str]


@dataclass(frozen=True)
class AuditEvent:
    id: str
    actor: str
    action: str
    target: str
    timestamp: str
    outcome: str
    detail: str


@dataclass(frozen=True)
class BidForgeRun:
    runId: str
    buyer: str
    project: str
    status: str
    deadline: str
    qualityScore: int
    coverage: int
    requirements: int
    risks: int
    tokenCost: str
    latency: str
    mode: str
    cacheHitRate: str
    roi: RoiSummary
    executiveBrief: ExecutiveBrief
    governance: GovernancePanel
    upload: UploadConfig
    timeline: list[TimelineStep]
    requirementsTable: list[Requirement]
    proposalSections: list[ProposalSection]
    evidenceSources: list[EvidenceSource]
    riskRegister: list[RiskItem]
    tasks: list[SmeTask]
    judge: JudgeReport
    automation: AutomationConfig
    automationHistory: list[AutomationRunRecord]
    auditTrail: list[AuditEvent]

    def to_dict(self) -> dict:
        return asdict(self)
