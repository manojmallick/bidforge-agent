import { BadgeCheck, LockKeyhole, ScrollText, ShieldCheck } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

const gateTone: Record<string, BadgeTone> = {
  Required: "danger",
  Blocked: "danger",
  Pending: "warning",
  Assigned: "warning",
  Answered: "teal",
  Active: "success",
  Enabled: "success",
  Cleared: "success",
  Ready: "success",
  Waiting: "muted",
};

export function GovernancePanel({ run, onExportAudit }: { run: BidForgeRun; onExportAudit: () => void }) {
  return (
    <section className="panel governancePanel" id="governance">
      <PanelTitle icon={<ShieldCheck size={18} />} title="Governance Panel" action="Export audit" onAction={onExportAudit} />

      <div className="governanceSummary">
        {run.governance.controls.map((control) => (
          <article key={control.label}>
            <div><LockKeyhole size={16} /><strong>{control.label}</strong></div>
            <Badge tone={toneFor(control.state)}>{control.state}</Badge>
            <p>{control.detail}</p>
          </article>
        ))}
      </div>

      <div className="governanceGrid">
        <article className="governanceBlock">
          <div className="blockHeading"><BadgeCheck size={18} /><h3>Approval Gates</h3></div>
          <div className="gateList">
            {run.governance.approvalGates.map((gate) => (
              <div className="gateRow" key={gate.gate}>
                <div>
                  <strong>{gate.gate}</strong>
                  <span>{gate.owner} - {gate.evidence}</span>
                </div>
                <Badge tone={toneFor(gate.status)}>{gate.status}</Badge>
              </div>
            ))}
          </div>
        </article>

        <article className="governanceBlock">
          <div className="blockHeading"><LockKeyhole size={18} /><h3>RBAC Roles</h3></div>
          <div className="roleMatrix">
            {run.governance.roles.map((role) => (
              <div className="roleRow" key={role.role}>
                <div>
                  <strong>{role.role}</strong>
                  <span>{role.access}</span>
                </div>
                <div>
                  <span>{role.owner}</span>
                  <Badge tone={toneFor(role.status)}>{role.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="governanceBlock auditBlock">
        <div className="blockHeading"><ScrollText size={18} /><h3>Audit Trail</h3></div>
        <div className="auditTrail compactAudit">
          {run.auditTrail.slice(0, 5).map((event) => (
            <div className="auditEvent" key={event.id}>
              <div><strong>{event.action}</strong><small>{event.timestamp}</small></div>
              <p>{event.detail}</p>
              <small>{event.actor} - {event.outcome}</small>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function toneFor(status: string): BadgeTone {
  return gateTone[status] ?? "muted";
}
