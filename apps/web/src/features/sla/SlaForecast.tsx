import { AlarmClock, BellRing, CalendarClock, Clock3, Gauge, Route, ShieldAlert, TrendingUp, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

type SlipRisk = "Critical" | "High" | "Medium" | "Low";

type OwnerForecast = {
  owner: string;
  openTasks: number;
  openRisks: number;
  openGates: number;
  slipRisk: SlipRisk;
  eta: string;
  escalation: string;
  reason: string;
};

type Escalation = {
  label: string;
  owner: string;
  priority: SlipRisk;
  action: string;
};

export type SlaForecastPayload = {
  runId: string;
  generatedAt: string;
  summary: {
    onTimeConfidence: number;
    criticalOwners: number;
    escalationCount: number;
    automationCadenceMinutes: number;
  };
  ownerForecasts: OwnerForecast[];
  escalations: Escalation[];
  cadencePlan: string[];
};

export function SlaForecast({ run, onExport }: { run: BidForgeRun; onExport: (payload: SlaForecastPayload) => void }) {
  const forecast = buildSlaForecast(run);

  return (
    <section className="panel slaPanel" id="sla">
      <PanelTitle icon={<AlarmClock size={18} />} title="Admin SLA Forecasting" action="Export forecast" onAction={() => onExport(forecast)} />

      <div className="slaHero">
        <div>
          <p className="eyebrow">Reviewer SLA command view</p>
          <h2>Predict owner delays before they block final export</h2>
          <p>Combines task status, risk severity, approval gates, and automation cadence into a bid-admin escalation forecast.</p>
        </div>
        <div className="slaScore">
          <Gauge size={22} />
          <strong>{forecast.summary.onTimeConfidence}%</strong>
          <span>on-time confidence</span>
        </div>
      </div>

      <div className="metricGrid slaMetrics">
        <Metric tone="warning" label="Critical owners" value={String(forecast.summary.criticalOwners)} detail="Need same-day escalation" />
        <Metric tone="warning" label="Escalations" value={String(forecast.summary.escalationCount)} detail="Recommended admin actions" />
        <Metric tone="clear" label="Automation cadence" value={`${forecast.summary.automationCadenceMinutes}m`} detail="Refreshes blocker signals" />
        <Metric tone="neutral" label="Deadline" value={run.deadline} detail="Remaining bid window" />
      </div>

      <div className="slaGrid">
        <article className="slaBlock">
          <div className="blockHeading"><UsersRound size={18} /><h3>Owner Forecast</h3></div>
          <div className="ownerForecastList">
            {forecast.ownerForecasts.map((owner) => (
              <div className="ownerForecastRow" key={owner.owner}>
                <div>
                  <strong>{owner.owner}</strong>
                  <span>{owner.openTasks} tasks · {owner.openRisks} risks · {owner.openGates} gates</span>
                  <p>{owner.reason}</p>
                </div>
                <progress max={100} value={riskValue(owner.slipRisk)} />
                <div>
                  <Badge tone={toneForRisk(owner.slipRisk)}>{owner.slipRisk}</Badge>
                  <small>{owner.eta}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="slaBlock">
          <div className="blockHeading"><BellRing size={18} /><h3>Escalation Queue</h3></div>
          <div className="escalationList">
            {forecast.escalations.map((item) => (
              <div className="escalationRow" key={item.label}>
                <div><strong>{item.label}</strong><span>{item.owner} - {item.action}</span></div>
                <Badge tone={toneForRisk(item.priority)}>{item.priority}</Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="slaGrid secondarySlaGrid">
        <article className="slaBlock cadenceBlock">
          <div className="blockHeading"><Route size={18} /><h3>Cadence Plan</h3></div>
          <div className="cadenceSteps">
            {forecast.cadencePlan.map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="slaBlock">
          <div className="blockHeading"><CalendarClock size={18} /><h3>Admin Next 24 Hours</h3></div>
          <div className="nextDayGrid">
            <SlaFact icon={<ShieldAlert size={17} />} label="First escalation" value={forecast.escalations[0]?.owner ?? "None"} />
            <SlaFact icon={<Clock3 size={17} />} label="Refresh cycle" value={`Every ${run.automation.frequencyMinutes} minutes`} />
            <SlaFact icon={<TrendingUp size={17} />} label="Confidence lift" value="+18% if top gates clear" />
          </div>
        </article>
      </div>
    </section>
  );
}

function SlaFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="slaFact">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function buildSlaForecast(run: BidForgeRun): SlaForecastPayload {
  const ownerForecasts = buildOwnerForecasts(run);
  const escalations = buildEscalations(run, ownerForecasts);
  const criticalOwners = ownerForecasts.filter((owner) => owner.slipRisk === "Critical" || owner.slipRisk === "High").length;
  const onTimeConfidence = Math.max(1, Math.min(99, Math.round(
    run.qualityScore * 0.28 +
    run.coverage * 0.24 +
    Math.max(35, 96 - criticalOwners * 11) * 0.22 +
    Math.max(40, 100 - escalations.length * 8) * 0.14 +
    (run.automation.status === "Active" ? 88 : 55) * 0.12
  )));

  return {
    runId: run.runId,
    generatedAt: new Date().toISOString(),
    summary: {
      onTimeConfidence,
      criticalOwners,
      escalationCount: escalations.length,
      automationCadenceMinutes: run.automation.frequencyMinutes
    },
    ownerForecasts,
    escalations,
    cadencePlan: [
      `Keep automation at ${run.automation.frequencyMinutes} minutes until Legal and Finance gates move out of Required.`,
      "Escalate Critical and High owners before the next executive review window.",
      "After each owner response, rerun Judge Report and AI Governance Scorecard before export.",
      "Only relax cadence after final export gate moves from Blocked to Ready."
    ]
  };
}

function buildOwnerForecasts(run: BidForgeRun): OwnerForecast[] {
  const owners = Array.from(new Set([
    ...run.tasks.map((task) => task.owner),
    ...run.riskRegister.map((risk) => risk.owner),
    ...run.governance.approvalGates.map((gate) => gate.owner)
  ]));

  return owners.map((owner) => {
    const openTasks = run.tasks.filter((task) => task.owner === owner && task.status !== "Approved").length;
    const openRisks = run.riskRegister.filter((risk) => risk.owner === owner && risk.approval !== "Approved").length;
    const openGates = run.governance.approvalGates.filter((gate) => gate.owner === owner && !["Approved", "Ready", "Cleared"].includes(gate.status)).length;
    const criticalRisks = run.riskRegister.filter((risk) => risk.owner === owner && (risk.severity === "Critical" || risk.severity === "High")).length;
    const score = openTasks * 18 + openRisks * 22 + openGates * 28 + criticalRisks * 16;
    const slipRisk: SlipRisk = score >= 70 ? "Critical" : score >= 48 ? "High" : score >= 24 ? "Medium" : "Low";
    return {
      owner,
      openTasks,
      openRisks,
      openGates,
      slipRisk,
      eta: etaForRisk(slipRisk),
      escalation: escalationFor(owner, slipRisk),
      reason: reasonFor(owner, openTasks, openRisks, openGates, criticalRisks)
    };
  }).sort((a, b) => riskValue(b.slipRisk) - riskValue(a.slipRisk));
}

function buildEscalations(run: BidForgeRun, owners: OwnerForecast[]): Escalation[] {
  const ownerEscalations = owners
    .filter((owner) => owner.slipRisk === "Critical" || owner.slipRisk === "High")
    .map((owner) => ({
      label: `${owner.owner} SLA risk`,
      owner: owner.owner,
      priority: owner.slipRisk,
      action: owner.escalation
    }));
  const gateEscalations = run.governance.approvalGates
    .filter((gate) => ["Required", "Blocked", "Pending"].includes(gate.status))
    .map((gate) => ({
      label: gate.gate,
      owner: gate.owner,
      priority: gate.status === "Blocked" ? "Critical" as const : "High" as const,
      action: `Resolve ${gate.evidence.toLowerCase()} before final export.`
    }));
  return [...ownerEscalations, ...gateEscalations].slice(0, 8);
}

function riskValue(risk: SlipRisk) {
  if (risk === "Critical") {
    return 92;
  }
  if (risk === "High") {
    return 74;
  }
  if (risk === "Medium") {
    return 46;
  }
  return 18;
}

function toneForRisk(risk: SlipRisk): BadgeTone {
  if (risk === "Critical") {
    return "danger";
  }
  if (risk === "High" || risk === "Medium") {
    return "warning";
  }
  return "success";
}

function etaForRisk(risk: SlipRisk) {
  if (risk === "Critical") {
    return "Today";
  }
  if (risk === "High") {
    return "24h";
  }
  if (risk === "Medium") {
    return "48h";
  }
  return "On track";
}

function escalationFor(owner: string, risk: SlipRisk) {
  if (risk === "Critical") {
    return `Schedule same-day decision with ${owner} owner and Admin.`;
  }
  if (risk === "High") {
    return `Ask ${owner} for a written commitment before the next automation refresh cycle.`;
  }
  if (risk === "Medium") {
    return `Monitor ${owner} response and keep task in next daily review.`;
  }
  return `${owner} can remain on normal cadence.`;
}

function reasonFor(owner: string, tasks: number, risks: number, gates: number, criticalRisks: number) {
  const pieces = [`${owner} owns ${tasks} open tasks`, `${risks} open risks`, `${gates} open gates`];
  if (criticalRisks) {
    pieces.push(`${criticalRisks} critical/high risk items`);
  }
  return pieces.join(", ") + ".";
}
