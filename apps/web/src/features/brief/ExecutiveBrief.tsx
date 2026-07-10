import { BriefcaseBusiness, CheckCircle2, CircleAlert, ClipboardList, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import type { BidForgeRun } from "../../types/bidforge";
import { Badge } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

export function ExecutiveBrief({ run, onExport }: { run: BidForgeRun; onExport: () => void }) {
  const brief = run.executiveBrief;
  return (
    <section className="panel executiveBrief" id="brief">
      <PanelTitle icon={<BriefcaseBusiness size={18} />} title="Executive Win Brief" action="Export brief" onAction={onExport} />
      <div className="briefHero">
        <div>
          <p className="eyebrow">Sales leadership readout</p>
          <h2>{run.buyer}</h2>
          <p>{brief.opportunitySummary}</p>
        </div>
        <div className="briefDecision">
          <span>Confidence</span>
          <strong>{brief.confidenceLevel}</strong>
          <Badge tone={brief.confidenceLevel === "High" ? "success" : brief.confidenceLevel === "Low" ? "danger" : "warning"}>
            {run.judge.decision}
          </Badge>
        </div>
      </div>

      <div className="briefGrid">
        <BriefList icon={<TrendingUp size={18} />} title="Top Win Themes" items={brief.winThemes} />
        <BriefList icon={<CircleAlert size={18} />} title="Major Risks" items={brief.majorRisks} />
        <BriefList icon={<ClipboardList size={18} />} title="Missing Inputs" items={brief.missingInputs} />
      </div>

      <div className="briefRecommendation">
        <CheckCircle2 size={18} />
        <div>
          <span>Bid/no-bid discussion point</span>
          <strong>{brief.bidRecommendation}</strong>
        </div>
      </div>
    </section>
  );
}

function BriefList({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <article className="briefList">
      <div>{icon}<h3>{title}</h3></div>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
