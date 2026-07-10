import { Gavel } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { PanelTitle } from "../../components/ui/PanelTitle";

export function JudgeReport({ run }: { run: BidForgeRun }) {
  return (
    <section className="panel" id="judge">
      <PanelTitle icon={<Gavel size={18} />} title="Judge Verification Report" />
      <div className="judgeScore"><strong>{run.judge.score}</strong><span>{run.judge.decision}</span></div>
      <div className="rubric">
        {run.judge.checks.map((check) => (
          <div className="rubricRow" key={check.label}>
            <span>{check.label}</span>
            <progress value={check.score} max={check.max} />
            <strong>{check.score}/{check.max}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
