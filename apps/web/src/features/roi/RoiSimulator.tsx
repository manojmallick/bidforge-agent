import { Calculator, Clock, DollarSign, Gauge } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import type { BidForgeRun } from "../../types/bidforge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";

export function RoiSimulator({ run, onExport }: { run: BidForgeRun; onExport: (payload: RoiScenario) => void }) {
  const [pages, setPages] = useState(numberFromSize(run.upload.size) || 118);
  const [reviewers, setReviewers] = useState(6);
  const [hoursPerReviewer, setHoursPerReviewer] = useState(24);
  const [hourlyRate, setHourlyRate] = useState(95);
  const [assistedHours, setAssistedHours] = useState(Math.max(8, pages * 0.08 + run.risks * 0.6));

  const scenario = useMemo(() => {
    const baselineHours = Math.round(pages * 0.45 + reviewers * hoursPerReviewer);
    const totalAssisted = Math.round(assistedHours + reviewers * 3 + run.risks * 1.5);
    const hoursSaved = Math.max(0, baselineHours - totalAssisted);
    const savings = hoursSaved * hourlyRate;
    const firstDraftReduction = baselineHours > 0 ? Math.round((hoursSaved / baselineHours) * 100) : 0;
    const costPerRun = estimateCost(run.tokenCost);
    return {
      baselineHours,
      assistedHours: totalAssisted,
      hoursSaved,
      firstDraftReduction,
      savings,
      costPerRun,
      assumptions: { pages, reviewers, hoursPerReviewer, hourlyRate, assistedExtractionHours: Math.round(assistedHours) },
    };
  }, [assistedHours, hourlyRate, hoursPerReviewer, pages, reviewers, run.risks, run.tokenCost]);

  return (
    <section className="panel roiPanel" id="roi">
      <PanelTitle icon={<Calculator size={18} />} title="ROI Simulator" action="Export ROI" onAction={() => onExport(scenario)} />
      <div className="roiHeader">
        <div>
          <p className="eyebrow">Configurable assumptions</p>
          <h2>{run.buyer}</h2>
          <p>Estimate bid effort reduction using current requirements, risks, token cost, and reviewer assumptions.</p>
        </div>
        <div className="roiDecision">
          <Gauge size={18} />
          <strong>{scenario.firstDraftReduction}%</strong>
          <span>estimated first-draft cycle reduction</span>
        </div>
      </div>

      <div className="metricGrid roiMetrics" aria-label="ROI outputs">
        <Metric tone="neutral" label="Baseline effort" value={`${scenario.baselineHours}h`} detail="Manual read, routing, reviews" />
        <Metric tone="clear" label="Assisted effort" value={`${scenario.assistedHours}h`} detail="Extraction, drafting, SME validation" />
        <Metric tone="clear" label="Hours saved" value={`${scenario.hoursSaved}h`} detail={`${scenario.firstDraftReduction}% faster first draft`} />
        <Metric tone="warning" label="Estimated value" value={`$${scenario.savings.toLocaleString()}`} detail={`Run cost ${scenario.costPerRun}`} />
      </div>

      <div className="roiControls">
        <RoiInput icon={<Clock size={16} />} label="RFP pages" value={pages} min={1} max={300} onChange={setPages} />
        <RoiInput icon={<Clock size={16} />} label="Reviewers" value={reviewers} min={1} max={20} onChange={setReviewers} />
        <RoiInput icon={<Clock size={16} />} label="Manual hours / reviewer" value={hoursPerReviewer} min={1} max={80} onChange={setHoursPerReviewer} />
        <RoiInput icon={<DollarSign size={16} />} label="Blended hourly rate" value={hourlyRate} min={25} max={250} onChange={setHourlyRate} />
        <RoiInput icon={<Clock size={16} />} label="Assisted extraction hours" value={Math.round(assistedHours)} min={1} max={80} onChange={setAssistedHours} />
      </div>
    </section>
  );
}

export type RoiScenario = {
  baselineHours: number;
  assistedHours: number;
  hoursSaved: number;
  firstDraftReduction: number;
  savings: number;
  costPerRun: string;
  assumptions: {
    pages: number;
    reviewers: number;
    hoursPerReviewer: number;
    hourlyRate: number;
    assistedExtractionHours: number;
  };
};

function RoiInput({
  icon,
  label,
  value,
  min,
  max,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="roiInput">
      <span>{icon}{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value), min, max))}
      />
    </label>
  );
}

function numberFromSize(size: string) {
  const match = size.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function estimateCost(cost: string) {
  const values = cost.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (!values.length) {
    return "$0";
  }
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return `$${average.toFixed(2)}`;
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}
