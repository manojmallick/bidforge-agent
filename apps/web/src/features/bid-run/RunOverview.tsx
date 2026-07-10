import type { CSSProperties } from "react";
import type { BidForgeRun } from "../../types/bidforge";
import { Metric } from "../../components/ui/Metric";

export function RunOverview({ run, onOpenRoi }: { run: BidForgeRun; onOpenRoi: () => void }) {
  return (
    <>
      <section className="summaryBand" id="dashboard">
        <div>
          <p className="eyebrow">Bid run dashboard</p>
          <h1>{run.buyer}: {run.project}</h1>
          <p className="supporting">Compliance matrix, proposal draft, risk register, SME task board, and judge verification built from the Stitch BidForge design and demo/anonymized evidence.</p>
        </div>
        <div className="qualityPanel">
          <div className="gauge" style={{ "--score": `${run.qualityScore}%` } as CSSProperties}><span>{run.qualityScore}</span></div>
          <div><strong>Quality score</strong><span>{run.judge.decision}</span></div>
        </div>
      </section>

      <section className="metricGrid" aria-label="Run metrics">
        <Metric tone="clear" label="Requirements" value={String(run.requirements)} detail={`${run.coverage}% covered with citations`} />
        <Metric tone="warning" label="Open risks" value={String(run.risks)} detail="5 require human approval" />
        <button className="metric metricButton clear" type="button" onClick={onOpenRoi}>
          <span>Hours saved</span>
          <strong>{run.roi.hoursSaved}</strong>
          <small>{run.roi.firstDraftReduction} faster first draft</small>
        </button>
        <Metric tone="neutral" label="Token / latency" value={run.latency} detail={`${run.mode}, cache hit ${run.cacheHitRate}`} />
      </section>
    </>
  );
}
