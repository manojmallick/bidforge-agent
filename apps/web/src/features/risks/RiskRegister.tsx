import { AlertTriangle } from "lucide-react";
import type { BidForgeRun, RiskSeverity } from "../../types/bidforge";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

const severityTone: Record<RiskSeverity, BadgeTone> = {
  Critical: "danger",
  High: "warning",
  Medium: "muted",
  Low: "muted"
};

export function RiskRegister({ run, onSendToReviewer }: { run: BidForgeRun; onSendToReviewer: () => void }) {
  return (
    <section className="panel wide" id="risks">
      <PanelTitle icon={<AlertTriangle size={18} />} title="Risk Register" action="Send to reviewer" onAction={onSendToReviewer} />
      <div className="riskGrid">
        {run.riskRegister.map((risk) => (
          <article className={`riskCard risk${risk.severity}`} key={risk.id}>
            <div><strong>{risk.id}</strong><Badge tone={severityTone[risk.severity]}>{risk.severity}</Badge></div>
            <h3>{risk.title}</h3>
            <p>{risk.mitigation}</p>
            <dl><div><dt>Owner</dt><dd>{risk.owner}</dd></div><div><dt>Category</dt><dd>{risk.category}</dd></div><div><dt>Approval</dt><dd>{risk.approval}</dd></div></dl>
          </article>
        ))}
      </div>
    </section>
  );
}
