import { Crosshair, Flag, Lightbulb, Radar, ShieldAlert, Swords, Target, Trophy } from "lucide-react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

type Competitor = {
  name: string;
  posture: "Incumbent" | "Low-cost" | "Cloud specialist" | "Global integrator";
  threat: number;
  likelyMessage: string;
  counterMove: string;
};

type Differentiator = {
  theme: string;
  proof: string;
  owner: string;
  strength: "Strong" | "Medium" | "Needs Proof";
};

type RedTeamObjection = {
  objection: string;
  risk: "High" | "Medium" | "Low";
  response: string;
};

export type CompetitiveStrategyPayload = {
  runId: string;
  generatedAt: string;
  winThemeScore: number;
  recommendedPosition: string;
  competitors: Competitor[];
  differentiators: Differentiator[];
  redTeam: RedTeamObjection[];
  talkTrack: string[];
};

export function CompetitiveStrategyLab({ run, onExport }: { run: BidForgeRun; onExport: (payload: CompetitiveStrategyPayload) => void }) {
  const strategy = buildCompetitiveStrategy(run);
  const highestThreat = Math.max(...strategy.competitors.map((competitor) => competitor.threat));

  return (
    <section className="panel competitivePanel" id="competitive">
      <PanelTitle icon={<Swords size={18} />} title="Competitive Strategy Lab" action="Export battlecard" onAction={() => onExport(strategy)} />

      <div className="competitiveHero">
        <div>
          <p className="eyebrow">Win room battlecard</p>
          <h2>{strategy.recommendedPosition}</h2>
          <p>Turns BidForge evidence, ROI, risks, and approval gates into a competitive narrative for sales and executive review.</p>
        </div>
        <div className="competitiveScore">
          <Trophy size={22} />
          <strong>{strategy.winThemeScore}%</strong>
          <span>theme strength</span>
        </div>
      </div>

      <div className="metricGrid competitiveMetrics">
        <Metric tone="clear" label="Differentiators" value={String(strategy.differentiators.length)} detail="Evidence-backed win themes" />
        <Metric tone="warning" label="Top threat" value={`${highestThreat}%`} detail="Highest competitor pressure" />
        <Metric tone="neutral" label="Red-team risks" value={String(strategy.redTeam.length)} detail="Objections with responses" />
        <Metric tone="clear" label="ROI proof" value={`${run.roi.hoursSaved}h`} detail={`${run.roi.firstDraftReduction} draft acceleration`} />
      </div>

      <div className="competitiveGrid">
        <article className="competitiveBlock">
          <div className="blockHeading"><Radar size={18} /><h3>Competitor Radar</h3></div>
          <div className="competitorList">
            {strategy.competitors.map((competitor) => (
              <div className="competitorCard" key={competitor.name}>
                <div>
                  <strong>{competitor.name}</strong>
                  <Badge tone={toneForThreat(competitor.threat)}>{competitor.posture}</Badge>
                </div>
                <progress max={100} value={competitor.threat} />
                <p><span>Likely play:</span> {competitor.likelyMessage}</p>
                <p><span>Counter:</span> {competitor.counterMove}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="competitiveBlock">
          <div className="blockHeading"><Target size={18} /><h3>Differentiator Map</h3></div>
          <div className="differentiatorList">
            {strategy.differentiators.map((item) => (
              <div className="differentiatorRow" key={item.theme}>
                <div>
                  <strong>{item.theme}</strong>
                  <span>{item.proof}</span>
                </div>
                <div>
                  <Badge tone={toneForStrength(item.strength)}>{item.strength}</Badge>
                  <small>{item.owner}</small>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="competitiveGrid secondaryCompetitiveGrid">
        <article className="competitiveBlock">
          <div className="blockHeading"><ShieldAlert size={18} /><h3>Red-Team Objections</h3></div>
          <div className="redTeamList">
            {strategy.redTeam.map((item) => (
              <div className="redTeamRow" key={item.objection}>
                <div><strong>{item.objection}</strong><span>{item.response}</span></div>
                <Badge tone={toneForRisk(item.risk)}>{item.risk}</Badge>
              </div>
            ))}
          </div>
        </article>

        <article className="competitiveBlock talkTrackBlock">
          <div className="blockHeading"><Lightbulb size={18} /><h3>Executive Talk Track</h3></div>
          <ol className="talkTrack">
            {strategy.talkTrack.map((line) => <li key={line}>{line}</li>)}
          </ol>
        </article>
      </div>
    </section>
  );
}

function buildCompetitiveStrategy(run: BidForgeRun): CompetitiveStrategyPayload {
  const criticalRisks = run.riskRegister.filter((risk) => risk.severity === "Critical" || risk.severity === "High").length;
  const openGates = run.governance.approvalGates.filter((gate) => !["Approved", "Ready", "Cleared"].includes(gate.status)).length;
  const winThemeScore = Math.max(1, Math.min(99, Math.round(
    run.coverage * 0.3 +
    run.qualityScore * 0.25 +
    Math.min(96, 64 + run.roi.hoursSaved / 5) * 0.2 +
    Math.max(45, 95 - criticalRisks * 8 - openGates * 3) * 0.15 +
    88 * 0.1
  )));

  return {
    runId: run.runId,
    generatedAt: new Date().toISOString(),
    winThemeScore,
    recommendedPosition: "Lead with governed migration factory plus regulated banking proof",
    competitors: [
      {
        name: "Incumbent Managed Services Provider",
        posture: "Incumbent",
        threat: 82,
        likelyMessage: "Lower transition risk because they already know the estate.",
        counterMove: "Show BidForge evidence traceability, migration factory governance, and faster reviewer alignment."
      },
      {
        name: "Hyperscaler Professional Services",
        posture: "Cloud specialist",
        threat: 74,
        likelyMessage: "Deep cloud-native tooling and direct platform expertise.",
        counterMove: "Emphasize multivendor operations, 24x7 support, regulated controls, and global delivery scale."
      },
      {
        name: "Regional Low-Cost SI",
        posture: "Low-cost",
        threat: 61,
        likelyMessage: "Aggressive fixed-price commercial offer.",
        counterMove: "Anchor on risk-adjusted value, SLA discipline, audit readiness, and reduced bid/delivery rework."
      },
      {
        name: "Global Transformation Consultancy",
        posture: "Global integrator",
        threat: 68,
        likelyMessage: "Executive transformation narrative and advisory depth.",
        counterMove: "Pair executive story with concrete evidence package, compliance matrix, and automation-backed delivery proof."
      }
    ],
    differentiators: [
      { theme: "Governed evidence trail", proof: `${run.coverage}% coverage across ${run.requirements} requirements with source citations.`, owner: "Bid manager", strength: "Strong" },
      { theme: "Regulated operations", proof: "ISO control library, incident response evidence, RBAC, and audit trail are visible in the package.", owner: "Security", strength: "Strong" },
      { theme: "Migration factory delivery", proof: "CloudSMART wave planning and 90-day transition assumptions are framed with dependencies.", owner: "Delivery", strength: "Medium" },
      { theme: "Commercial confidence", proof: "ROI model shows bid effort saved, but penalty caps still need finance approval.", owner: "Finance", strength: "Needs Proof" },
      { theme: "Human-gated AI workflow", proof: "Final export remains blocked until Legal, Finance, Delivery, and Security approvals clear.", owner: "Admin", strength: "Strong" }
    ],
    redTeam: [
      {
        objection: "Can we trust AI-generated proposal content?",
        risk: "High",
        response: "Point to Judge Report, AI Governance Scorecard, evidence citations, unsupported-claim blocking, and human approval gates."
      },
      {
        objection: "Is the transition timeline too aggressive?",
        risk: "Medium",
        response: "Use phased wave planning, dependency assumptions, and delivery-owner signoff before final export."
      },
      {
        objection: "Will pricing survive SLA penalty negotiation?",
        risk: "High",
        response: "Keep Finance as required gate and include explicit penalty-cap assumptions in the commercial response."
      },
      {
        objection: "Does the delivery team have enough client-specific evidence?",
        risk: "Medium",
        response: "Use approved proposal-bank assets, anonymized banking migration case, and evidence drawer traceability."
      }
    ],
    talkTrack: [
      `Apex Global Bank needs confidence, not just a migration plan; BidForge shows ${run.coverage}% evidence-backed coverage before final export.`,
      "Our differentiator is governed execution: audit trail, reviewer ownership, and human gates stay visible throughout the bid.",
      "Against the incumbent, we counter with speed plus traceability; against cloud specialists, we counter with regulated 24x7 operations.",
      "The only reason not to go final today is controlled risk discipline: Legal, Finance, Delivery, and Security must clear their gates."
    ]
  };
}

function toneForThreat(threat: number): BadgeTone {
  if (threat >= 78) {
    return "danger";
  }
  if (threat >= 65) {
    return "warning";
  }
  return "teal";
}

function toneForStrength(strength: Differentiator["strength"]): BadgeTone {
  if (strength === "Strong") {
    return "success";
  }
  if (strength === "Medium") {
    return "teal";
  }
  return "warning";
}

function toneForRisk(risk: RedTeamObjection["risk"]): BadgeTone {
  if (risk === "High") {
    return "danger";
  }
  if (risk === "Medium") {
    return "warning";
  }
  return "muted";
}
