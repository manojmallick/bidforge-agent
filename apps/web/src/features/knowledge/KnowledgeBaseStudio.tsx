import { BookOpenCheck, CheckCircle2, Database, FileSearch, RefreshCcw, ShieldAlert, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

type AssetStatus = "Approved" | "Needs Review" | "Stale" | "Blocked";
type AssetType = "Case Study" | "Control Library" | "Delivery Pattern" | "Commercial Assumption" | "Support Model";
type AssetFilter = "All" | AssetStatus;

export type KnowledgeBasePayload = {
  runId: string;
  knowledgeBase: string;
  generatedAt: string;
  coverage: number;
  assets: KnowledgeAsset[];
  governedClaims: GovernedClaim[];
  gaps: string[];
};

type KnowledgeAsset = {
  id: string;
  name: string;
  type: AssetType;
  owner: string;
  status: AssetStatus;
  detail: string;
  coverage: number;
  lastReviewed: string;
  linkedRequirements: string[];
};

type GovernedClaim = {
  claim: string;
  source: string;
  owner: string;
  status: AssetStatus;
};

export function KnowledgeBaseStudio({ run, onExport }: { run: BidForgeRun; onExport: (payload: KnowledgeBasePayload) => void }) {
  const initialAssets = useMemo(() => buildKnowledgeAssets(run), [run]);
  const [assets, setAssets] = useState(initialAssets);
  const [filter, setFilter] = useState<AssetFilter>("All");
  const claims = useMemo(() => buildGovernedClaims(run, assets), [assets, run]);
  const filteredAssets = filter === "All" ? assets : assets.filter((asset) => asset.status === filter);
  const gaps = buildKnowledgeGaps(run, assets);
  const payload: KnowledgeBasePayload = {
    runId: run.runId,
    knowledgeBase: run.upload.knowledgeBase,
    generatedAt: new Date().toISOString(),
    coverage: run.coverage,
    assets,
    governedClaims: claims,
    gaps
  };

  const updateAsset = (id: string, status: AssetStatus) => {
    setAssets((current) => current.map((asset) => asset.id === id ? { ...asset, status, lastReviewed: "Just now" } : asset));
  };

  return (
    <section className="panel knowledgePanel" id="knowledge">
      <PanelTitle icon={<Database size={18} />} title="Knowledge Base Studio" action="Export KB" onAction={() => onExport(payload)} />

      <div className="knowledgeHero">
        <div>
          <p className="eyebrow">Evidence governance</p>
          <h2>{run.upload.knowledgeBase}</h2>
          <p>Review approved snippets, stale evidence, linked requirements, and proposal claims before they reach the final export package.</p>
        </div>
        <div className="knowledgeSeal">
          <BookOpenCheck size={22} />
          <strong>{approvedPercent(assets)}%</strong>
          <span>approved evidence</span>
        </div>
      </div>

      <div className="metricGrid knowledgeMetrics">
        <Metric tone="clear" label="Evidence assets" value={String(assets.length)} detail="Proposal-bank entries mapped" />
        <Metric tone="clear" label="Coverage" value={`${run.coverage}%`} detail={`${run.requirements} requirements analyzed`} />
        <Metric tone="warning" label="Needs review" value={String(assets.filter((asset) => asset.status === "Needs Review").length)} detail="SME or owner action" />
        <Metric tone="hold" label="Blocked claims" value={String(claims.filter((claim) => claim.status === "Blocked").length)} detail="Cannot export as final" />
      </div>

      <div className="knowledgeFilters" aria-label="Knowledge asset filters">
        {(["All", "Approved", "Needs Review", "Stale", "Blocked"] as AssetFilter[]).map((item) => (
          <button className={filter === item ? "active" : ""} type="button" key={item} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>

      <div className="knowledgeGrid">
        <div className="knowledgeAssets">
          {filteredAssets.map((asset) => (
            <article className="knowledgeAsset" key={asset.id}>
              <header>
                <div><FileSearch size={17} /><strong>{asset.name}</strong></div>
                <Badge tone={toneForStatus(asset.status)}>{asset.status}</Badge>
              </header>
              <p>{asset.detail}</p>
              <dl>
                <div><dt>Type</dt><dd>{asset.type}</dd></div>
                <div><dt>Owner</dt><dd>{asset.owner}</dd></div>
                <div><dt>Coverage</dt><dd>{asset.coverage}%</dd></div>
                <div><dt>Reviewed</dt><dd>{asset.lastReviewed}</dd></div>
              </dl>
              <div className="linkedRequirements">
                {asset.linkedRequirements.map((requirement) => <Badge tone="muted" key={requirement}>{requirement}</Badge>)}
              </div>
              <footer>
                <button type="button" onClick={() => updateAsset(asset.id, "Approved")}><CheckCircle2 size={15} /> Approve</button>
                <button type="button" onClick={() => updateAsset(asset.id, "Stale")}><RefreshCcw size={15} /> Mark stale</button>
                <button type="button" onClick={() => updateAsset(asset.id, "Needs Review")}><UserPlus size={15} /> Assign SME</button>
              </footer>
            </article>
          ))}
        </div>

        <aside className="claimGovernance">
          <div className="blockHeading"><ShieldAlert size={18} /><h3>Claim Governance</h3></div>
          <div className="claimList">
            {claims.map((claim) => (
              <article key={claim.claim}>
                <div><strong>{claim.claim}</strong><Badge tone={toneForStatus(claim.status)}>{claim.status}</Badge></div>
                <p>{claim.source}</p>
                <small>{claim.owner}</small>
              </article>
            ))}
          </div>
          <div className="knowledgeGaps">
            <h3>Coverage gaps</h3>
            {gaps.map((gap) => <p key={gap}>{gap}</p>)}
          </div>
        </aside>
      </div>
    </section>
  );
}

function buildKnowledgeAssets(run: BidForgeRun): KnowledgeAsset[] {
  const typeCycle: AssetType[] = ["Delivery Pattern", "Control Library", "Support Model", "Case Study", "Commercial Assumption"];
  const sourceAssets = run.evidenceSources.map((source, index) => {
    const linkedRequirement = run.requirementsTable[index % run.requirementsTable.length];
    const status = statusFromEvidence(source.name, linkedRequirement?.status ?? "Verified");
    return {
      id: `KB-${String(index + 1).padStart(3, "0")}`,
      name: source.name,
      type: typeCycle[index % typeCycle.length],
      owner: linkedRequirement?.owner ?? "Bid manager",
      status,
      detail: source.detail,
      coverage: Math.max(58, Math.min(98, Number.parseInt(linkedRequirement?.confidence ?? "80", 10) + (status === "Approved" ? 2 : -8))),
      lastReviewed: index < 2 ? "This week" : index === 2 ? "30 days ago" : "90+ days ago",
      linkedRequirements: run.requirementsTable.filter((row) => row.evidence === source.name || source.detail.toLowerCase().includes(row.category.toLowerCase())).map((row) => row.id).slice(0, 3)
    };
  });
  const gapAssets = run.requirementsTable
    .filter((requirement) => requirement.status === "Gap")
    .map((requirement, index) => ({
      id: `KB-GAP-${String(index + 1).padStart(2, "0")}`,
      name: requirement.evidence,
      type: "Commercial Assumption" as const,
      owner: requirement.owner,
      status: "Blocked" as const,
      detail: `Missing approved knowledge for requirement: ${requirement.text}`,
      coverage: Number.parseInt(requirement.confidence, 10),
      lastReviewed: "Not approved",
      linkedRequirements: [requirement.id]
    }));
  return [...sourceAssets, ...gapAssets];
}

function buildGovernedClaims(run: BidForgeRun, assets: KnowledgeAsset[]): GovernedClaim[] {
  return run.proposalSections.map((section, index) => {
    const asset = assets[index % Math.max(1, assets.length)];
    return {
      claim: section.title,
      source: asset?.name ?? "No source mapped",
      owner: asset?.owner ?? "Bid manager",
      status: section.status === "Unsupported" ? "Blocked" : section.status === "Needs SME" ? "Needs Review" : asset?.status ?? "Needs Review"
    };
  });
}

function buildKnowledgeGaps(run: BidForgeRun, assets: KnowledgeAsset[]) {
  const gaps = run.requirementsTable
    .filter((requirement) => requirement.status === "Gap" || requirement.status === "Needs SME" || requirement.status === "Pending")
    .map((requirement) => `${requirement.id}: ${requirement.text} (${requirement.owner})`);
  const staleAssets = assets.filter((asset) => asset.status === "Stale").map((asset) => `${asset.name} needs owner recertification.`);
  return [...gaps, ...staleAssets].slice(0, 6);
}

function statusFromEvidence(name: string, requirementStatus: string): AssetStatus {
  if (name.toLowerCase().includes("anonymized")) {
    return "Stale";
  }
  if (requirementStatus === "Gap") {
    return "Blocked";
  }
  if (requirementStatus === "Needs SME" || requirementStatus === "Pending") {
    return "Needs Review";
  }
  return "Approved";
}

function approvedPercent(assets: KnowledgeAsset[]) {
  return Math.round((assets.filter((asset) => asset.status === "Approved").length / Math.max(1, assets.length)) * 100);
}

function toneForStatus(status: AssetStatus): BadgeTone {
  if (status === "Approved") {
    return "success";
  }
  if (status === "Needs Review") {
    return "warning";
  }
  if (status === "Blocked") {
    return "danger";
  }
  return "muted";
}
