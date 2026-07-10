import { BarChart3, CheckCircle2, Download, ShieldAlert } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { Badge } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";

const benchmarkCases = [
  {
    name: "Banking migration RFP",
    requirements: 84,
    manualCoverage: 62,
    agentCoverage: 92,
    manualRiskDetection: 54,
    agentRiskDetection: 88,
    citationSupport: 86,
  },
  {
    name: "Retail DevSecOps RFP",
    requirements: 47,
    manualCoverage: 68,
    agentCoverage: 91,
    manualRiskDetection: 49,
    agentRiskDetection: 83,
    citationSupport: 82,
  },
  {
    name: "Insurance data platform RFP",
    requirements: 63,
    manualCoverage: 65,
    agentCoverage: 89,
    manualRiskDetection: 57,
    agentRiskDetection: 86,
    citationSupport: 84,
  },
];

export function BenchmarkMode({ run, onExport }: { run: BidForgeRun; onExport: (payload: BenchmarkPayload) => void }) {
  const averageAgentCoverage = average(benchmarkCases.map((item) => item.agentCoverage));
  const averageManualCoverage = average(benchmarkCases.map((item) => item.manualCoverage));
  const averageRiskLift = average(benchmarkCases.map((item) => item.agentRiskDetection - item.manualRiskDetection));
  const payload: BenchmarkPayload = {
    runId: run.runId,
    generatedFor: run.buyer,
    cases: benchmarkCases,
    summary: {
      averageAgentCoverage,
      averageManualCoverage,
      averageCoverageLift: averageAgentCoverage - averageManualCoverage,
      averageRiskDetectionLift: averageRiskLift,
    },
  };

  return (
    <section className="panel benchmarkPanel" id="benchmark">
      <PanelTitle icon={<BarChart3 size={18} />} title="Benchmark Mode" action="Export benchmark" onAction={() => onExport(payload)} />
      <div className="benchmarkHero">
        <div>
          <p className="eyebrow">Demo scorecard</p>
          <h2>Manual baseline vs BidForge Agent</h2>
          <p>Small controlled benchmark set for judge demos. Scores are deterministic sample assumptions, not enterprise production claims.</p>
        </div>
        <div className="benchmarkStamp">
          <CheckCircle2 size={18} />
          <strong>+{payload.summary.averageCoverageLift}%</strong>
          <span>average coverage lift</span>
        </div>
      </div>

      <div className="metricGrid benchmarkMetrics">
        <Metric tone="neutral" label="Manual baseline" value={`${averageManualCoverage}%`} detail="Average requirement coverage" />
        <Metric tone="clear" label="Agent coverage" value={`${averageAgentCoverage}%`} detail="Matrix coverage with citations" />
        <Metric tone="warning" label="Risk lift" value={`+${averageRiskLift}%`} detail="Average detection improvement" />
        <Metric tone="clear" label="Current run" value={`${run.coverage}%`} detail={`${run.requirements} requirements analyzed`} />
      </div>

      <div className="benchmarkList">
        {benchmarkCases.map((item) => (
          <article className="benchmarkCase" key={item.name}>
            <div>
              <h3>{item.name}</h3>
              <Badge tone="teal">{item.requirements} requirements</Badge>
            </div>
            <BenchmarkRow label="Requirement coverage" baseline={item.manualCoverage} agent={item.agentCoverage} />
            <BenchmarkRow label="Risk detection" baseline={item.manualRiskDetection} agent={item.agentRiskDetection} />
            <div className="citationScore">
              <ShieldAlert size={15} />
              <span>Citation support</span>
              <strong>{item.citationSupport}%</strong>
            </div>
          </article>
        ))}
      </div>

      <button className="benchmarkDownload" type="button" onClick={() => onExport(payload)}>
        <Download size={16} /> Export benchmark evidence
      </button>
    </section>
  );
}

export type BenchmarkPayload = {
  runId: string;
  generatedFor: string;
  cases: typeof benchmarkCases;
  summary: {
    averageAgentCoverage: number;
    averageManualCoverage: number;
    averageCoverageLift: number;
    averageRiskDetectionLift: number;
  };
};

function BenchmarkRow({ label, baseline, agent }: { label: string; baseline: number; agent: number }) {
  return (
    <div className="benchmarkRow">
      <span>{label}</span>
      <div><i style={{ width: `${baseline}%` }} /><strong>{baseline}% baseline</strong></div>
      <div><i style={{ width: `${agent}%` }} /><strong>{agent}% agent</strong></div>
    </div>
  );
}

function average(values: number[]) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length));
}
