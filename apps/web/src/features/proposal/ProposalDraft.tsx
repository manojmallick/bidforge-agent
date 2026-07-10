import { FileText } from "lucide-react";
import type { BidForgeRun, ProposalStatus } from "../../types/bidforge";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

const statusTone: Record<ProposalStatus, BadgeTone> = {
  Verified: "success",
  "Needs SME": "warning",
  Unsupported: "danger"
};

export function ProposalDraft({ run, onExport }: { run: BidForgeRun; onExport: () => void }) {
  return (
    <section className="panel" id="proposal">
      <PanelTitle icon={<FileText size={18} />} title="Proposal Draft" action="Export draft" onAction={onExport} />
      <div className="proposalList">
        {run.proposalSections.map((section) => (
          <article className="proposalSection" key={section.title}>
            <div><h3>{section.title}</h3><Badge tone={statusTone[section.status]}>{section.status}</Badge></div>
            <p>{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
