import { CheckCircle2, Cloud, DatabaseZap, FileText, Link2, MessageSquareText, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

type ConnectorStatus = "Connected" | "Needs Auth" | "Sync Warning";
type ConnectorId = "sharepoint" | "teams" | "crm" | "pricing" | "legal" | "audit";

type Connector = {
  id: ConnectorId;
  name: string;
  owner: string;
  status: ConnectorStatus;
  lastSync: string;
  mappedArtifacts: string[];
  detail: string;
};

export type IntegrationPayload = {
  runId: string;
  generatedAt: string;
  connectors: Connector[];
  syncLog: string[];
};

const connectorIcons: Record<ConnectorId, ReactNode> = {
  sharepoint: <Cloud size={18} />,
  teams: <MessageSquareText size={18} />,
  crm: <DatabaseZap size={18} />,
  pricing: <FileText size={18} />,
  legal: <ShieldCheck size={18} />,
  audit: <Link2 size={18} />
};

export function IntegrationSimulator({ run, onExport }: { run: BidForgeRun; onExport: (payload: IntegrationPayload) => void }) {
  const initialConnectors = useMemo(() => buildConnectors(run), [run]);
  const [connectors, setConnectors] = useState(initialConnectors);
  const [syncLog, setSyncLog] = useState<string[]>([
    "Loaded demo connector map with no external data transmission.",
    "All connector activity is simulated for hackathon review."
  ]);
  const connectedCount = connectors.filter((connector) => connector.status === "Connected").length;
  const payload = { runId: run.runId, generatedAt: new Date().toISOString(), connectors, syncLog };

  const syncConnector = (id: ConnectorId) => {
    setConnectors((current) => current.map((connector) => connector.id === id ? { ...connector, status: "Connected", lastSync: "Just now" } : connector));
    const connector = connectors.find((item) => item.id === id);
    setSyncLog((current) => [`${connector?.name ?? id} synced ${connector?.mappedArtifacts.length ?? 0} artifacts.`, ...current].slice(0, 6));
  };

  const markAuth = (id: ConnectorId) => {
    setConnectors((current) => current.map((connector) => connector.id === id ? { ...connector, status: "Needs Auth" } : connector));
    const connector = connectors.find((item) => item.id === id);
    setSyncLog((current) => [`${connector?.name ?? id} requires admin re-auth before production sync.`, ...current].slice(0, 6));
  };

  return (
    <section className="panel integrationPanel" id="integrations">
      <PanelTitle icon={<Link2 size={18} />} title="Integration Simulator" action="Export status" onAction={() => onExport(payload)} />

      <div className="integrationHero">
        <div>
          <p className="eyebrow">Enterprise connector rehearsal</p>
          <h2>Simulate SharePoint, Teams, CRM, pricing, legal, and audit sync</h2>
          <p>Shows how BidForge would connect to enterprise systems while keeping this demo deterministic and offline-safe.</p>
        </div>
        <div className="integrationScore">
          <Cloud size={22} />
          <strong>{connectedCount}/{connectors.length}</strong>
          <span>connectors ready</span>
        </div>
      </div>

      <div className="metricGrid integrationMetrics">
        <Metric tone="clear" label="Connected" value={String(connectedCount)} detail="Ready for simulated sync" />
        <Metric tone="warning" label="Needs auth" value={String(connectors.filter((connector) => connector.status === "Needs Auth").length)} detail="Admin action before production" />
        <Metric tone="hold" label="Warnings" value={String(connectors.filter((connector) => connector.status === "Sync Warning").length)} detail="Mapped with caution" />
        <Metric tone="neutral" label="Artifacts" value={String(new Set(connectors.flatMap((connector) => connector.mappedArtifacts)).size)} detail="Cross-system mappings" />
      </div>

      <div className="integrationGrid">
        <div className="connectorList">
          {connectors.map((connector) => (
            <article className="connectorCard" key={connector.id}>
              <header>
                <div>{connectorIcons[connector.id]}<strong>{connector.name}</strong></div>
                <Badge tone={toneForConnector(connector.status)}>{connector.status}</Badge>
              </header>
              <p>{connector.detail}</p>
              <dl>
                <div><dt>Owner</dt><dd>{connector.owner}</dd></div>
                <div><dt>Last sync</dt><dd>{connector.lastSync}</dd></div>
              </dl>
              <div className="artifactChips">
                {connector.mappedArtifacts.map((artifact) => <Badge tone="muted" key={artifact}>{artifact}</Badge>)}
              </div>
              <footer>
                <button type="button" onClick={() => syncConnector(connector.id)}><RefreshCw size={15} /> Sync now</button>
                <button type="button" onClick={() => markAuth(connector.id)}><TriangleAlert size={15} /> Require auth</button>
              </footer>
            </article>
          ))}
        </div>

        <aside className="syncLogPanel">
          <div className="blockHeading"><CheckCircle2 size={18} /><h3>Sync Log</h3></div>
          <div className="syncLog">
            {syncLog.map((event) => <p key={event}>{event}</p>)}
          </div>
          <div className="syncGuardrail">
            <ShieldCheck size={16} />
            <span>No external connector calls are made in this demo.</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function buildConnectors(run: BidForgeRun): Connector[] {
  return [
    {
      id: "sharepoint",
      name: "SharePoint Proposal Library",
      owner: "Bid manager",
      status: "Connected",
      lastSync: "5 min ago",
      mappedArtifacts: ["Request for Proposal source", "Evidence pack", "Proposal memo"],
      detail: `Maps ${run.upload.file} and approved evidence back to the proposal repository.`
    },
    {
      id: "teams",
      name: "Teams Reviewer Channel",
      owner: "Bid manager",
      status: "Connected",
      lastSync: "Just now",
      mappedArtifacts: ["SME tasks", "Risk handoffs", "Approval nudges"],
      detail: "Posts reviewer tasks and approval reminders to role channels."
    },
    {
      id: "crm",
      name: "CRM Opportunity",
      owner: "Sales",
      status: "Connected",
      lastSync: "15 min ago",
      mappedArtifacts: ["Buyer", "Deadline", "Win strategy"],
      detail: `Keeps ${run.buyer} opportunity context aligned with the bid workspace.`
    },
    {
      id: "pricing",
      name: "Pricing Workbench",
      owner: "Finance",
      status: "Needs Auth",
      lastSync: "Not connected",
      mappedArtifacts: ["SLA penalties", "Fixed-price assumptions"],
      detail: "Requires finance authentication before syncing commercial assumptions."
    },
    {
      id: "legal",
      name: "Legal Clause Library",
      owner: "Legal",
      status: "Sync Warning",
      lastSync: "1 day ago",
      mappedArtifacts: ["EU residency clause", "Contract assumptions"],
      detail: "Legal content is mapped, but residency language still needs approval."
    },
    {
      id: "audit",
      name: "Audit Archive",
      owner: "Admin",
      status: "Connected",
      lastSync: "Just now",
      mappedArtifacts: ["Audit trail", "Automation history", "Export package"],
      detail: "Stores governance events and export manifests for admin review."
    }
  ];
}

function toneForConnector(status: ConnectorStatus): BadgeTone {
  if (status === "Connected") {
    return "success";
  }
  if (status === "Needs Auth") {
    return "warning";
  }
  return "danger";
}
