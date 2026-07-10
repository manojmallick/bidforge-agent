import { BadgeCheck, Bot, BrainCircuit, ClipboardCheck, FileSearch, Fingerprint, Gauge, LockKeyhole, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

type ControlStatus = "Pass" | "Watch" | "Blocked";

type GovernanceControl = {
  label: string;
  status: ControlStatus;
  owner: string;
  evidence: string;
  detail: string;
};

type ModelRisk = {
  label: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  mitigation: string;
  owner: string;
};

export type AiGovernancePayload = {
  runId: string;
  generatedAt: string;
  overallScore: number;
  summary: {
    evidenceCoverage: number;
    citationSupport: number;
    hallucinationControl: number;
    approvalGateHealth: number;
  };
  controls: GovernanceControl[];
  modelRisks: ModelRisk[];
  auditReadiness: string[];
};

export function AiGovernanceScorecard({ run, onExport }: { run: BidForgeRun; onExport: (payload: AiGovernancePayload) => void }) {
  const payload = buildAiGovernanceScorecard(run);
  const blockedControls = payload.controls.filter((control) => control.status === "Blocked").length;

  return (
    <section className="panel aiGovernancePanel" id="ai-governance">
      <PanelTitle icon={<BrainCircuit size={18} />} title="AI Governance Scorecard" action="Export scorecard" onAction={() => onExport(payload)} />

      <div className="aiGovernanceHero">
        <div>
          <p className="eyebrow">Responsible AI control room</p>
          <h2>Prove the proposal is evidence-bound, auditable, and human-gated</h2>
          <p>Scores model use against citation discipline, prompt-injection handling, RBAC, approval gates, and export readiness.</p>
        </div>
        <div className="aiGovernanceScore">
          <Gauge size={22} />
          <strong>{payload.overallScore}</strong>
          <span>governance score</span>
        </div>
      </div>

      <div className="metricGrid aiGovernanceMetrics">
        <Metric tone="clear" label="Evidence coverage" value={`${payload.summary.evidenceCoverage}%`} detail="Requirements with verified support" />
        <Metric tone="clear" label="Citation support" value={`${payload.summary.citationSupport}%`} detail="Judge citation score" />
        <Metric tone="clear" label="Hallucination control" value={`${payload.summary.hallucinationControl}%`} detail="Unsupported claims constrained" />
        <Metric tone={blockedControls ? "warning" : "clear"} label="Blocked controls" value={String(blockedControls)} detail="Must clear before final export" />
      </div>

      <div className="aiGovernanceGrid">
        <article className="aiGovernanceBlock controlLedger">
          <div className="blockHeading"><ShieldCheck size={18} /><h3>Control Ledger</h3></div>
          <div className="controlRows">
            {payload.controls.map((control) => (
              <div className="controlRow" key={control.label}>
                <div>
                  <strong>{control.label}</strong>
                  <span>{control.owner} - {control.evidence}</span>
                  <p>{control.detail}</p>
                </div>
                <Badge tone={toneForStatus(control.status)}>{control.status}</Badge>
              </div>
            ))}
          </div>
        </article>

        <aside className="aiGovernanceBlock">
          <div className="blockHeading"><ShieldAlert size={18} /><h3>Model Risk Radar</h3></div>
          <div className="modelRiskList">
            {payload.modelRisks.map((risk) => (
              <div className="modelRiskRow" key={risk.label}>
                <div><strong>{risk.label}</strong><span>{risk.owner} - {risk.mitigation}</span></div>
                <Badge tone={toneForSeverity(risk.severity)}>{risk.severity}</Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="aiGovernanceGrid secondaryGovernanceGrid">
        <article className="aiGovernanceBlock">
          <div className="blockHeading"><ClipboardCheck size={18} /><h3>Audit Readiness Pack</h3></div>
          <div className="readinessPack">
            {payload.auditReadiness.map((item) => (
              <div key={item}><BadgeCheck size={16} /><span>{item}</span></div>
            ))}
          </div>
        </article>

        <article className="aiGovernanceBlock aiPolicyMap">
          <div className="blockHeading"><Scale size={18} /><h3>Policy Map</h3></div>
          <PolicyFact icon={<FileSearch size={17} />} label="Evidence grounding" value={`${run.requirements} requirements traced`} />
          <PolicyFact icon={<Fingerprint size={17} />} label="Data handling" value="Demo-safe, no external connector calls" />
          <PolicyFact icon={<LockKeyhole size={17} />} label="Human control" value={`${run.governance.approvalGates.length} approval gates`} />
          <PolicyFact icon={<Bot size={17} />} label="Automation cadence" value={`${run.automation.frequencyMinutes} min with guardrails`} />
        </article>
      </div>
    </section>
  );
}

function PolicyFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="policyFact">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function buildAiGovernanceScorecard(run: BidForgeRun): AiGovernancePayload {
  const citationCheck = run.judge.checks.find((check) => check.label === "Citation support");
  const hallucinationCheck = run.judge.checks.find((check) => check.label === "Hallucination control");
  const evidenceCoverage = run.coverage;
  const citationSupport = citationCheck ? Math.round((citationCheck.score / citationCheck.max) * 100) : run.coverage;
  const hallucinationControl = hallucinationCheck ? Math.round((hallucinationCheck.score / hallucinationCheck.max) * 100) : run.qualityScore;
  const clearedGates = run.governance.approvalGates.filter((gate) => ["Approved", "Ready", "Cleared"].includes(gate.status)).length;
  const approvalGateHealth = Math.round((clearedGates / Math.max(1, run.governance.approvalGates.length)) * 100);
  const modelRisks = buildModelRisks(run);
  const controls = buildControls(run, { evidenceCoverage, citationSupport, hallucinationControl, approvalGateHealth });
  const controlPenalty = controls.filter((control) => control.status === "Blocked").length * 4 + controls.filter((control) => control.status === "Watch").length * 2;
  const overallScore = Math.max(0, Math.min(100, Math.round((evidenceCoverage * 0.24) + (citationSupport * 0.24) + (hallucinationControl * 0.24) + (run.qualityScore * 0.18) + (Math.max(0, 100 - modelRisks.length * 10) * 0.1) - controlPenalty)));

  return {
    runId: run.runId,
    generatedAt: new Date().toISOString(),
    overallScore,
    summary: { evidenceCoverage, citationSupport, hallucinationControl, approvalGateHealth },
    controls,
    modelRisks,
    auditReadiness: [
      "Prompt-injection warning quarantined as source content.",
      "Every exportable artifact can be regenerated from deterministic demo state.",
      "Reviewer approvals and denied automation changes are captured in audit history.",
      "Unsupported proposal claims remain blocked behind human review.",
      "Enterprise connector activity is simulated without transmitting external data."
    ]
  };
}

function buildControls(run: BidForgeRun, summary: AiGovernancePayload["summary"]): GovernanceControl[] {
  return [
    {
      label: "Prompt-injection quarantine",
      status: run.upload.warning ? "Pass" : "Watch",
      owner: "System",
      evidence: run.upload.warning || "No quarantine event detected",
      detail: "RFP text that tries to override system behavior is treated as document content."
    },
    {
      label: "Citation discipline",
      status: summary.citationSupport >= 85 ? "Pass" : "Watch",
      owner: "Judge Agent",
      evidence: `${summary.citationSupport}% citation support`,
      detail: "Proposal claims are tied to knowledge snippets, control-library content, or SME tasks."
    },
    {
      label: "Unsupported claim gate",
      status: run.proposalSections.some((section) => section.status === "Unsupported") ? "Blocked" : "Pass",
      owner: "Bid manager",
      evidence: `${run.proposalSections.filter((section) => section.status === "Unsupported").length} unsupported sections`,
      detail: "Final export remains blocked until unsupported assumptions are replaced or approved."
    },
    {
      label: "Human approval gates",
      status: summary.approvalGateHealth >= 80 ? "Pass" : "Blocked",
      owner: "Admin",
      evidence: `${summary.approvalGateHealth}% gates cleared`,
      detail: "Legal, finance, delivery, and security approvals must be complete before final export."
    },
    {
      label: "RBAC and audit trace",
      status: run.governance.controls.some((control) => control.label === "RBAC" && control.state === "Enabled") ? "Pass" : "Blocked",
      owner: run.automation.owner,
      evidence: "Role-scoped automation and export actions",
      detail: "Privileged changes require bid manager or admin ownership and are logged."
    },
    {
      label: "Automation guardrails",
      status: run.automation.guarded ? "Pass" : "Blocked",
      owner: run.automation.owner,
      evidence: `${run.automation.frequencyMinutes}-minute guarded cadence`,
      detail: "Scheduled refreshes update artifacts without bypassing review requirements."
    }
  ];
}

function buildModelRisks(run: BidForgeRun): ModelRisk[] {
  const risks: ModelRisk[] = [];
  run.proposalSections
    .filter((section) => section.status !== "Verified")
    .forEach((section) => {
      risks.push({
        label: `${section.title} needs governance review`,
        severity: section.status === "Unsupported" ? "High" : "Medium",
        mitigation: section.status === "Unsupported" ? "Replace assumption or collect owner approval" : "Attach SME evidence before final export",
        owner: section.status === "Unsupported" ? "Finance" : "Security"
      });
    });
  run.riskRegister
    .filter((risk) => risk.approval === "Required")
    .slice(0, 3)
    .forEach((risk) => {
      risks.push({
        label: risk.title,
        severity: risk.severity,
        mitigation: risk.mitigation,
        owner: risk.owner
      });
    });
  return risks.slice(0, 6);
}

function toneForStatus(status: ControlStatus): BadgeTone {
  if (status === "Pass") {
    return "success";
  }
  if (status === "Watch") {
    return "warning";
  }
  return "danger";
}

function toneForSeverity(severity: ModelRisk["severity"]): BadgeTone {
  if (severity === "Critical" || severity === "High") {
    return "danger";
  }
  if (severity === "Medium") {
    return "warning";
  }
  return "muted";
}
