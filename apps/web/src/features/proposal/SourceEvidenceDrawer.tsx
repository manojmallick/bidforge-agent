import { LockKeyhole, ShieldCheck } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { PanelTitle } from "../../components/ui/PanelTitle";

export function SourceEvidenceDrawer({ run }: { run: BidForgeRun }) {
  return (
    <section className="panel">
      <PanelTitle icon={<ShieldCheck size={18} />} title="Source Evidence Drawer" />
      <div className="evidenceList">
        {run.evidenceSources.map((source) => (
          <article className="evidenceItem" key={source.name}>
            <LockKeyhole size={15} />
            <div><strong>{source.name}</strong><span>{source.detail}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
