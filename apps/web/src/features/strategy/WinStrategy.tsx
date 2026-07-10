import { ArrowRight, CheckCircle2, ShieldAlert, Target, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun, RiskItem } from "../../types/bidforge";

export type WinStrategyPayload = {
  runId: string;
  buyer: string;
  recommendation: string;
  winProbability: number;
  confidence: string;
  mustFixBeforeExport: string[];
  differentiators: string[];
  executiveActions: string[];
  roleOwners: Array<{ role: string; nextAction: string; status: string }>;
};

export function WinStrategy({ run, onExport }: { run: BidForgeRun; onExport: (payload: WinStrategyPayload) => void }) {
  const strategy = buildWinStrategy(run);

  return (
    <section className="panel strategyPanel" id="strategy">
      <PanelTitle icon={<Target size={18} />} title="Win Strategy" action="Export memo" onAction={() => onExport(strategy)} />

      <div className="strategyHero">
        <div>
          <p className="eyebrow">Bid / no-bid decision center</p>
          <h2>{strategy.recommendation}</h2>
          <p>Consolidates proposal quality, requirement coverage, unresolved risks, ROI, and approval gates into an executive decision memo.</p>
        </div>
        <div className="strategyScore" aria-label={`Win probability ${strategy.winProbability} percent`}>
          <Trophy size={22} />
          <strong>{strategy.winProbability}%</strong>
          <span>win probability</span>
        </div>
      </div>

      <div className="metricGrid strategyMetrics">
        <Metric tone="clear" label="Requirement coverage" value={`${run.coverage}%`} detail={`${run.requirements} requirements mapped`} />
        <Metric tone="clear" label="Quality score" value={String(run.qualityScore)} detail={run.judge.decision} />
        <Metric tone="warning" label="Decision blockers" value={String(strategy.mustFixBeforeExport.length)} detail="Need owner action" />
        <Metric tone="neutral" label="Run ROI" value={`${run.roi.hoursSaved}h`} detail={`${run.roi.firstDraftReduction} first draft reduction`} />
      </div>

      <div className="strategyGrid">
        <StrategyCard title="Why We Can Win" icon={<CheckCircle2 size={17} />}>
          {strategy.differentiators.map((item) => <li key={item}>{item}</li>)}
        </StrategyCard>
        <StrategyCard title="Must Fix Before Export" icon={<ShieldAlert size={17} />}>
          {strategy.mustFixBeforeExport.map((item) => <li key={item}>{item}</li>)}
        </StrategyCard>
        <StrategyCard title="Executive Actions" icon={<ArrowRight size={17} />}>
          {strategy.executiveActions.map((item) => <li key={item}>{item}</li>)}
        </StrategyCard>
      </div>

      <div className="decisionMemo">
        <div>
          <h3>Role-owned next moves</h3>
          <p>Admin can track each gate across bid manager, Legal, Finance, Security, and Delivery.</p>
        </div>
        <div className="roleOwnerGrid">
          {strategy.roleOwners.map((owner) => (
            <article key={owner.role}>
              <div><strong>{owner.role}</strong><Badge tone={owner.status === "Ready" ? "success" : "warning"}>{owner.status}</Badge></div>
              <p>{owner.nextAction}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StrategyCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <article className="strategyCard">
      <h3>{icon}{title}</h3>
      <ul>{children}</ul>
    </article>
  );
}

function buildWinStrategy(run: BidForgeRun): WinStrategyPayload {
  const criticalRisks = run.riskRegister.filter((risk) => risk.severity === "Critical" || risk.severity === "High");
  const blockedGates = run.governance.approvalGates.filter((gate) => !["Approved", "Ready"].includes(gate.status));
  const unsupportedSections = run.proposalSections.filter((section) => section.status === "Unsupported" || section.status === "Needs SME");
  const winProbability = clamp(Math.round(
    run.qualityScore * 0.36 +
    run.coverage * 0.24 +
    Math.max(50, 100 - criticalRisks.length * 9 - unsupportedSections.length * 5) * 0.18 +
    Math.min(96, 65 + run.roi.hoursSaved / 4) * 0.14 +
    Math.max(55, 95 - blockedGates.length * 8) * 0.08
  ), 1, 99);

  const recommendation = winProbability >= 84
    ? "Bid aggressively with controlled approvals"
    : winProbability >= 72
      ? "Bid with targeted risk burn-down"
      : "Hold final bid until blockers are cleared";

  const mustFixBeforeExport = [
    ...criticalRisks.map((risk) => `${risk.id}: ${risk.title} (${risk.owner})`),
    ...blockedGates.slice(0, 3).map((gate) => `${gate.gate}: ${gate.status} with ${gate.owner}`),
    ...unsupportedSections.slice(0, 2).map((section) => `${section.title}: ${section.status}`)
  ].slice(0, 7);

  return {
    runId: run.runId,
    buyer: run.buyer,
    recommendation,
    winProbability,
    confidence: run.executiveBrief.confidenceLevel,
    mustFixBeforeExport,
    differentiators: [
      `${run.coverage}% coverage across ${run.requirements} requirements with evidence-backed traceability.`,
      `${run.roi.hoursSaved} hours saved gives the team more time for solution tailoring and executive review.`,
      `${run.evidenceSources.length} source evidence packs support defensible claims and judge verification.`,
      `Human approval gates remain active for ${run.risks} unresolved risks before final export.`
    ],
    executiveActions: [
      "Approve legal position on data residency language before the final commercial response.",
      "Ask Finance to confirm SLA penalty caps and pricing assumptions.",
      "Lock the delivery transition plan and attach dependency assumptions.",
      "Run the judge report after approvals to confirm export readiness."
    ],
    roleOwners: [
      roleNextAction(run, "Bid Manager", "Coordinate final reviewer handoff and export timing."),
      roleNextAction(run, "Legal", criticalRiskFor(run, "Legal")?.mitigation ?? "Confirm contractual language is acceptable."),
      roleNextAction(run, "Finance", criticalRiskFor(run, "Finance")?.mitigation ?? "Validate pricing and value case."),
      roleNextAction(run, "Security", criticalRiskFor(run, "Security")?.mitigation ?? "Attach final control-library citation."),
      roleNextAction(run, "Delivery", criticalRiskFor(run, "Delivery")?.mitigation ?? "Confirm transition plan and delivery assumptions."),
      roleNextAction(run, "Admin", "Track approvals, automation history, and audit evidence.")
    ]
  };
}

function roleNextAction(run: BidForgeRun, role: string, fallback: string) {
  const matchingGate = run.governance.approvalGates.find((gate) => gate.owner === role || gate.gate.includes(role));
  const matchingTask = run.tasks.find((task) => task.owner === role);
  return {
    role,
    nextAction: matchingTask?.title ?? matchingGate?.evidence ?? fallback,
    status: matchingGate?.status === "Approved" || matchingTask?.status === "Approved" ? "Ready" : "Action"
  };
}

function criticalRiskFor(run: BidForgeRun, owner: string): RiskItem | undefined {
  return run.riskRegister.find((risk) => risk.owner === owner && (risk.severity === "Critical" || risk.severity === "High"));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
