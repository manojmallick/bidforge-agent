import { FileCheck2 } from "lucide-react";
import type { RequirementStatus, BidForgeRun } from "../../types/bidforge";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

const statusTone: Record<RequirementStatus, BadgeTone> = {
  Verified: "success",
  "Needs SME": "warning",
  Pending: "warning",
  Gap: "danger"
};

export function ComplianceMatrix({ run, onOpenEvidence }: { run: BidForgeRun; onOpenEvidence: () => void }) {
  return (
    <section className="panel wide" id="matrix">
      <PanelTitle icon={<FileCheck2 size={18} />} title="Compliance Matrix" action="Open citation drawer" onAction={onOpenEvidence} />
      <div className="filterBar" aria-label="Compliance matrix filters">
        <Badge tone="dark">Mandatory</Badge>
        <Badge tone="warning">Unsupported</Badge>
        <Badge tone="danger">High risk</Badge>
        <Badge tone="muted">Needs SME</Badge>
      </div>
      <div className="tableWrap">
        <table>
          <thead><tr><th>ID</th><th>Category</th><th>Priority</th><th>Requirement</th><th>Status</th><th>Evidence</th><th>Owner</th><th>Confidence</th></tr></thead>
          <tbody>
            {run.requirementsTable.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td><td>{row.category}</td><td>{row.priority}</td><td>{row.text}</td>
                <td><Badge tone={statusTone[row.status]}>{row.status}</Badge></td>
                <td>{row.evidence}</td><td>{row.owner}</td><td>{row.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
