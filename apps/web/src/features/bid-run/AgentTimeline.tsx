import { ClipboardCheck } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { PanelTitle } from "../../components/ui/PanelTitle";

export function AgentTimeline({ run }: { run: BidForgeRun }) {
  return (
    <section className="panel">
      <PanelTitle icon={<ClipboardCheck size={18} />} title="Agent Timeline" />
      <div className="timeline">
        {run.timeline.map(({ agent, state, note }) => (
          <div className="timelineItem" key={agent}>
            <div><strong>{agent}</strong><span>{note}</span></div>
            <em>{state}</em>
          </div>
        ))}
      </div>
    </section>
  );
}
