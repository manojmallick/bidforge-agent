import { Activity, BarChart3, Bot, Clock3, Gauge, ShieldAlert, TrendingUp, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

export type AdminAnalyticsPayload = {
  runId: string;
  generatedAt: string;
  summary: {
    readiness: number;
    approvalCompletion: number;
    automationReliability: number;
    bottleneckCount: number;
  };
  roleWorkload: RoleWorkload[];
  bottlenecks: Bottleneck[];
  automationHealth: AutomationHealth;
};

type RoleWorkload = {
  role: string;
  tasks: number;
  risks: number;
  gates: number;
  load: number;
};

type Bottleneck = {
  label: string;
  owner: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  impact: string;
};

type AutomationHealth = {
  status: string;
  frequencyMinutes: number;
  completedRuns: number;
  changedArtifacts: number;
  guarded: boolean;
};

export function AdminAnalytics({ run, onExport }: { run: BidForgeRun; onExport: (payload: AdminAnalyticsPayload) => void }) {
  const payload = buildAdminAnalytics(run);
  return (
    <section className="panel analyticsPanel" id="analytics">
      <PanelTitle icon={<BarChart3 size={18} />} title="Admin Analytics" action="Export analytics" onAction={() => onExport(payload)} />

      <div className="analyticsHero">
        <div>
          <p className="eyebrow">Bid operations command view</p>
          <h2>Track readiness, bottlenecks, automation, and reviewer workload</h2>
          <p>Admin sees whether the bid is moving, who owns blockers, and whether automation is reliably refreshing the artifacts.</p>
        </div>
        <div className="analyticsScore">
          <Gauge size={22} />
          <strong>{payload.summary.readiness}%</strong>
          <span>operational readiness</span>
        </div>
      </div>

      <div className="metricGrid analyticsMetrics">
        <Metric tone="clear" label="Approval completion" value={`${payload.summary.approvalCompletion}%`} detail="Governance gates cleared" />
        <Metric tone="clear" label="Automation reliability" value={`${payload.summary.automationReliability}%`} detail={`${payload.automationHealth.completedRuns} completed refreshes`} />
        <Metric tone="warning" label="Bottlenecks" value={String(payload.summary.bottleneckCount)} detail="Owner actions required" />
        <Metric tone="neutral" label="Changed artifacts" value={String(payload.automationHealth.changedArtifacts)} detail="Automation output coverage" />
      </div>

      <div className="analyticsGrid">
        <article className="analyticsBlock">
          <div className="blockHeading"><UsersRound size={18} /><h3>Role Workload</h3></div>
          <div className="workloadList">
            {payload.roleWorkload.map((role) => (
              <div className="workloadRow" key={role.role}>
                <div>
                  <strong>{role.role}</strong>
                  <span>{role.tasks} tasks · {role.risks} risks · {role.gates} gates</span>
                </div>
                <progress max={100} value={role.load} />
                <Badge tone={role.load > 70 ? "warning" : "success"}>{role.load}% load</Badge>
              </div>
            ))}
          </div>
        </article>

        <article className="analyticsBlock">
          <div className="blockHeading"><ShieldAlert size={18} /><h3>Bottleneck Radar</h3></div>
          <div className="bottleneckList">
            {payload.bottlenecks.map((item) => (
              <div className="bottleneckRow" key={item.label}>
                <div><strong>{item.label}</strong><span>{item.owner} - {item.impact}</span></div>
                <Badge tone={toneForSeverity(item.severity)}>{item.severity}</Badge>
              </div>
            ))}
          </div>
        </article>

        <article className="analyticsBlock automationHealthBlock">
          <div className="blockHeading"><Bot size={18} /><h3>Automation Health</h3></div>
          <div className="automationHealthGrid">
            <AnalyticsFact icon={<Activity size={17} />} label="Status" value={payload.automationHealth.status} />
            <AnalyticsFact icon={<Clock3 size={17} />} label="Cadence" value={`${payload.automationHealth.frequencyMinutes} min`} />
            <AnalyticsFact icon={<TrendingUp size={17} />} label="Completed" value={String(payload.automationHealth.completedRuns)} />
            <AnalyticsFact icon={<ShieldAlert size={17} />} label="Guardrails" value={payload.automationHealth.guarded ? "On" : "Off"} />
          </div>
          <div className="analyticsTimeline">
            {run.automationHistory.slice(0, 4).map((record) => (
              <div key={record.id}>
                <strong>{record.status}</strong>
                <span>{record.startedAt}</span>
                <p>{record.summary}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

function AnalyticsFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="analyticsFact">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function buildAdminAnalytics(run: BidForgeRun): AdminAnalyticsPayload {
  const approvedGates = run.governance.approvalGates.filter((gate) => ["Approved", "Ready", "Cleared"].includes(gate.status)).length;
  const approvalCompletion = Math.round((approvedGates / Math.max(1, run.governance.approvalGates.length)) * 100);
  const completedRuns = run.automationHistory.filter((record) => record.status === "Completed").length;
  const automationReliability = Math.round((completedRuns / Math.max(1, run.automationHistory.length)) * 100);
  const changedArtifacts = new Set(run.automationHistory.flatMap((record) => record.changedArtifacts)).size;
  const bottlenecks = buildBottlenecks(run);
  const readiness = Math.round((run.qualityScore * 0.34) + (run.coverage * 0.28) + (approvalCompletion * 0.18) + (automationReliability * 0.12) + (Math.max(0, 100 - bottlenecks.length * 12) * 0.08));

  return {
    runId: run.runId,
    generatedAt: new Date().toISOString(),
    summary: {
      readiness,
      approvalCompletion,
      automationReliability,
      bottleneckCount: bottlenecks.length
    },
    roleWorkload: buildRoleWorkload(run),
    bottlenecks,
    automationHealth: {
      status: run.automation.status,
      frequencyMinutes: run.automation.frequencyMinutes,
      completedRuns,
      changedArtifacts,
      guarded: run.automation.guarded
    }
  };
}

function buildRoleWorkload(run: BidForgeRun): RoleWorkload[] {
  const roles = ["Legal", "Finance", "Security", "Delivery", "Bid manager", "Sales"];
  return roles.map((role) => {
    const tasks = run.tasks.filter((task) => task.owner === role).length;
    const risks = run.riskRegister.filter((risk) => risk.owner === role).length;
    const gates = run.governance.approvalGates.filter((gate) => gate.owner === role).length;
    return {
      role,
      tasks,
      risks,
      gates,
      load: Math.min(100, Math.round(tasks * 24 + risks * 28 + gates * 18))
    };
  }).filter((role) => role.tasks || role.risks || role.gates);
}

function buildBottlenecks(run: BidForgeRun): Bottleneck[] {
  const riskItems = run.riskRegister
    .filter((risk) => risk.severity === "Critical" || risk.severity === "High")
    .map((risk) => ({ label: risk.title, owner: risk.owner, severity: risk.severity, impact: risk.mitigation }));
  const gateItems = run.governance.approvalGates
    .filter((gate) => ["Required", "Blocked", "Pending"].includes(gate.status))
    .map((gate) => ({
      label: gate.gate,
      owner: gate.owner,
      severity: gate.status === "Blocked" ? "Critical" as const : "High" as const,
      impact: gate.evidence
    }));
  return [...riskItems, ...gateItems].slice(0, 7);
}

function toneForSeverity(severity: Bottleneck["severity"]): BadgeTone {
  if (severity === "Critical") {
    return "danger";
  }
  if (severity === "High" || severity === "Medium") {
    return "warning";
  }
  return "muted";
}
