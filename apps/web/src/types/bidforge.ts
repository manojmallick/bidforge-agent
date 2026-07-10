import type { LucideIcon } from "lucide-react";

export type RequirementStatus = "Verified" | "Needs SME" | "Pending" | "Gap";
export type ProposalStatus = "Verified" | "Needs SME" | "Unsupported";
export type RiskSeverity = "Critical" | "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "Assigned" | "Answered" | "Approved";
export type AutomationStatus = "Active" | "Paused";
export type CommandView = "upload" | "dashboard" | "matrix" | "proposal" | "knowledge" | "inbox" | "risks" | "tasks" | "judge" | "brief" | "strategy" | "competitive" | "package" | "analytics" | "sla" | "roi" | "benchmark" | "flow" | "governance" | "ai-governance" | "integrations" | "automation";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  view: CommandView;
};

export type Requirement = {
  id: string;
  category: string;
  priority: string;
  text: string;
  status: RequirementStatus;
  evidence: string;
  owner: string;
  confidence: string;
};

export type ProposalSection = {
  title: string;
  status: ProposalStatus;
  body: string;
};

export type EvidenceSource = {
  name: string;
  detail: string;
};

export type RiskItem = {
  id: string;
  severity: RiskSeverity;
  category: string;
  title: string;
  owner: string;
  mitigation: string;
  approval: string;
};

export type SmeTask = {
  status: TaskStatus;
  owner: string;
  title: string;
  link: string;
};

export type JudgeCheck = {
  label: string;
  score: number;
  max: number;
};

export type AutomationConfig = {
  id: string;
  name: string;
  status: AutomationStatus;
  frequencyMinutes: number;
  nextRunIn: string;
  lastRunAt: string;
  runMode: string;
  trigger: string;
  guarded: boolean;
  owner: string;
  nextRunAt: string;
};

export type AutomationRunRecord = {
  id: string;
  status: string;
  startedAt: string;
  finishedAt: string;
  summary: string;
  changedArtifacts: string[];
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  outcome: string;
  detail: string;
};

export type AutomationState = AutomationConfig & {
  history: AutomationRunRecord[];
  auditTrail?: AuditEvent[];
};

export type ExecutiveBrief = {
  opportunitySummary: string;
  winThemes: string[];
  majorRisks: string[];
  missingInputs: string[];
  confidenceLevel: string;
  bidRecommendation: string;
};

export type GovernanceRole = {
  role: string;
  access: string;
  owner: string;
  status: string;
};

export type ApprovalGate = {
  gate: string;
  owner: string;
  status: string;
  evidence: string;
};

export type GovernanceControl = {
  label: string;
  state: string;
  detail: string;
};

export type GovernancePanel = {
  roles: GovernanceRole[];
  approvalGates: ApprovalGate[];
  controls: GovernanceControl[];
};

export type BidForgeRun = {
  runId: string;
  buyer: string;
  project: string;
  status: string;
  deadline: string;
  qualityScore: number;
  coverage: number;
  requirements: number;
  risks: number;
  tokenCost: string;
  latency: string;
  mode: string;
  cacheHitRate: string;
  roi: {
    hoursSaved: number;
    firstDraftReduction: string;
  };
  executiveBrief: ExecutiveBrief;
  governance: GovernancePanel;
  upload: {
    file: string;
    size: string;
    knowledgeBase: string;
    selectedMode: string;
    estimatedCost: string;
    estimatedTime: string;
    warning: string;
  };
  timeline: Array<{
    agent: string;
    state: string;
    note: string;
  }>;
  requirementsTable: Requirement[];
  proposalSections: ProposalSection[];
  evidenceSources: EvidenceSource[];
  riskRegister: RiskItem[];
  tasks: SmeTask[];
  judge: {
    decision: string;
    score: number;
    checks: JudgeCheck[];
  };
  automation: AutomationConfig;
  automationHistory: AutomationRunRecord[];
  auditTrail: AuditEvent[];
};
