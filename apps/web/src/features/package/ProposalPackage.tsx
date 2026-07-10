import { Archive, CheckCircle2, Download, FileJson, FileText, LockKeyhole, PackageCheck, Printer, ShieldAlert } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";

export type ProposalPackagePayload = {
  manifest: {
    packageId: string;
    runId: string;
    buyer: string;
    project: string;
    generatedAt: string;
    exportStatus: "Reviewer Pack Ready" | "Final Export Blocked";
  };
  executiveBrief: BidForgeRun["executiveBrief"];
  proposalSections: BidForgeRun["proposalSections"];
  requirementsTable: BidForgeRun["requirementsTable"];
  evidenceSources: BidForgeRun["evidenceSources"];
  riskRegister: BidForgeRun["riskRegister"];
  smeTasks: BidForgeRun["tasks"];
  judgeReport: BidForgeRun["judge"];
  governance: BidForgeRun["governance"];
  auditTrail: BidForgeRun["auditTrail"];
  roi: BidForgeRun["roi"];
};

export function ProposalPackage({
  run,
  onExportJson,
  onExportMarkdown,
  onExportWord,
  onExportPrintView
}: {
  run: BidForgeRun;
  onExportJson: (payload: ProposalPackagePayload) => void;
  onExportMarkdown: (content: string) => void;
  onExportWord: (content: string) => void;
  onExportPrintView: (content: string) => void;
}) {
  const payload = buildProposalPackage(run);
  const finalExportBlocked = payload.manifest.exportStatus === "Final Export Blocked";
  const packageItems = [
    { label: "Executive brief", count: "1", status: "Ready" },
    { label: "Proposal sections", count: String(run.proposalSections.length), status: run.proposalSections.some((section) => section.status !== "Verified") ? "Needs Review" : "Ready" },
    { label: "Requirement matrix", count: String(run.requirementsTable.length), status: `${run.coverage}% covered` },
    { label: "Evidence sources", count: String(run.evidenceSources.length), status: "Ready" },
    { label: "Risk register", count: String(run.riskRegister.length), status: finalExportBlocked ? "Approval Needed" : "Ready" },
    { label: "SME task board", count: String(run.tasks.length), status: "Ready" },
    { label: "Judge report", count: String(run.judge.checks.length), status: run.judge.decision },
    { label: "Governance audit", count: String(run.auditTrail.length), status: "Ready" }
  ];

  return (
    <section className="panel packagePanel" id="package">
      <PanelTitle icon={<Archive size={18} />} title="Proposal Package Export" action="Export package" onAction={() => onExportJson(payload)} />

      <div className="packageHero">
        <div>
          <p className="eyebrow">Reviewer-ready bid handoff</p>
          <h2>{finalExportBlocked ? "Final export blocked until approvals clear" : "Final package ready for submission"}</h2>
          <p>Builds a complete evidence package with proposal text, compliance matrix, risks, SME tasks, judge report, ROI, governance gates, and audit trail.</p>
        </div>
        <div className={finalExportBlocked ? "packageSeal blocked" : "packageSeal"}>
          {finalExportBlocked ? <LockKeyhole size={22} /> : <PackageCheck size={22} />}
          <strong>{finalExportBlocked ? "Blocked" : "Ready"}</strong>
          <span>{payload.manifest.exportStatus}</span>
        </div>
      </div>

      <div className="metricGrid packageMetrics">
        <Metric tone="clear" label="Artifacts" value={String(packageItems.length)} detail="Bundled in export package" />
        <Metric tone="clear" label="Evidence" value={String(run.evidenceSources.length)} detail="Reusable source references" />
        <Metric tone="warning" label="Open approvals" value={String(openApprovalCount(run))} detail="Human gates before final export" />
        <Metric tone="neutral" label="Audit events" value={String(run.auditTrail.length)} detail="Traceable run activity" />
      </div>

      <div className="packageActions">
        <button type="button" onClick={() => onExportJson(payload)}><FileJson size={17} /> Download package JSON</button>
        <button type="button" onClick={() => onExportMarkdown(buildProposalMarkdown(run, payload))}><FileText size={17} /> Download proposal memo</button>
        <button type="button" onClick={() => onExportWord(buildProposalDocumentHtml(run, payload))}><FileText size={17} /> Download Word document</button>
        <button type="button" onClick={() => onExportPrintView(buildProposalDocumentHtml(run, payload))}><Printer size={17} /> Download PDF print view</button>
      </div>

      <article className="documentPreview">
        <div className="documentPreviewHeader">
          <div>
            <span>BidForge Agent</span>
            <strong>{run.buyer}</strong>
          </div>
          <Badge tone={finalExportBlocked ? "warning" : "success"}>{payload.manifest.exportStatus}</Badge>
        </div>
        <div className="documentCover">
          <p className="eyebrow">Client-ready proposal document</p>
          <h3>{run.project}</h3>
          <p>{run.executiveBrief.opportunitySummary}</p>
          <div>
            <span>Run {run.runId}</span>
            <span>Score {run.qualityScore}</span>
            <span>{run.coverage}% coverage</span>
          </div>
        </div>
        <div className="documentSections">
          {run.proposalSections.map((section) => (
            <section key={section.title}>
              <div><strong>{section.title}</strong><Badge tone={toneForPackageStatus(section.status)}>{section.status}</Badge></div>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </article>

      <div className="packageGrid">
        {packageItems.map((item) => (
          <article className="packageItem" key={item.label}>
            <div>
              <CheckCircle2 size={16} />
              <strong>{item.label}</strong>
            </div>
            <span>{item.count}</span>
            <Badge tone={toneForPackageStatus(item.status)}>{item.status}</Badge>
          </article>
        ))}
      </div>

      <article className="packageBlocker">
        <div>
          <ShieldAlert size={18} />
          <h3>Final export gate</h3>
        </div>
        <p>{finalExportBlocked ? "Reviewer package can be shared internally, but client-ready final export remains blocked until mandatory approval gates clear." : "All mandatory gates are clear. Client-ready final export can proceed."}</p>
        <div className="packageGateList">
          {run.governance.approvalGates.map((gate) => (
            <div key={gate.gate}>
              <strong>{gate.gate}</strong>
              <span>{gate.owner} - {gate.evidence}</span>
              <Badge tone={toneForGate(gate.status)}>{gate.status}</Badge>
            </div>
          ))}
        </div>
      </article>

      <button className="packageDownload" type="button" onClick={() => onExportJson(payload)}>
        <Download size={16} /> Export complete evidence package
      </button>
    </section>
  );
}

export function buildProposalPackage(run: BidForgeRun): ProposalPackagePayload {
  const blocked = openApprovalCount(run) > 0;
  return {
    manifest: {
      packageId: `${run.runId}-package`,
      runId: run.runId,
      buyer: run.buyer,
      project: run.project,
      generatedAt: new Date().toISOString(),
      exportStatus: blocked ? "Final Export Blocked" : "Reviewer Pack Ready"
    },
    executiveBrief: run.executiveBrief,
    proposalSections: run.proposalSections,
    requirementsTable: run.requirementsTable,
    evidenceSources: run.evidenceSources,
    riskRegister: run.riskRegister,
    smeTasks: run.tasks,
    judgeReport: run.judge,
    governance: run.governance,
    auditTrail: run.auditTrail,
    roi: run.roi
  };
}

export function buildProposalMarkdown(run: BidForgeRun, payload = buildProposalPackage(run)) {
  const lines = [
    `# ${run.buyer} - BidForge Proposal Memo`,
    "",
    `Run: ${run.runId}`,
    `Project: ${run.project}`,
    `Status: ${payload.manifest.exportStatus}`,
    `Generated: ${payload.manifest.generatedAt}`,
    "",
    "## Executive Brief",
    run.executiveBrief.opportunitySummary,
    "",
    "## Win Themes",
    ...run.executiveBrief.winThemes.map((theme) => `- ${theme}`),
    "",
    "## Proposal Draft",
    ...run.proposalSections.flatMap((section) => [`### ${section.title} (${section.status})`, section.body, ""]),
    "## Open Risks",
    ...run.riskRegister.map((risk) => `- ${risk.id} ${risk.severity}: ${risk.title} | Owner: ${risk.owner} | Mitigation: ${risk.mitigation}`),
    "",
    "## Approval Gates",
    ...run.governance.approvalGates.map((gate) => `- ${gate.gate}: ${gate.status} | ${gate.owner} | ${gate.evidence}`),
    "",
    "## Judge Report",
    `Decision: ${run.judge.decision}`,
    `Score: ${run.judge.score}`,
    ...run.judge.checks.map((check) => `- ${check.label}: ${check.score}/${check.max}`),
    "",
    "## ROI",
    `Hours saved: ${run.roi.hoursSaved}`,
    `First draft reduction: ${run.roi.firstDraftReduction}`
  ];
  return `${lines.join("\n")}\n`;
}

export function buildProposalDocumentHtml(run: BidForgeRun, payload = buildProposalPackage(run)) {
  const gateRows = run.governance.approvalGates.map((gate) => `
    <tr>
      <td>${escapeHtml(gate.gate)}</td>
      <td>${escapeHtml(gate.owner)}</td>
      <td>${escapeHtml(gate.status)}</td>
      <td>${escapeHtml(gate.evidence)}</td>
    </tr>
  `).join("");
  const requirementRows = run.requirementsTable.map((row) => `
    <tr>
      <td>${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.priority)}</td>
      <td>${escapeHtml(row.text)}</td>
      <td>${escapeHtml(row.status)}</td>
      <td>${escapeHtml(row.evidence)}</td>
      <td>${escapeHtml(row.owner)}</td>
    </tr>
  `).join("");
  const proposalSections = run.proposalSections.map((section) => `
    <section class="proposal-section">
      <h2>${escapeHtml(section.title)}</h2>
      <p class="status">Status: ${escapeHtml(section.status)}</p>
      <p>${escapeHtml(section.body)}</p>
    </section>
  `).join("");
  const riskRows = run.riskRegister.map((risk) => `
    <tr>
      <td>${escapeHtml(risk.id)}</td>
      <td>${escapeHtml(risk.severity)}</td>
      <td>${escapeHtml(risk.title)}</td>
      <td>${escapeHtml(risk.owner)}</td>
      <td>${escapeHtml(risk.mitigation)}</td>
    </tr>
  `).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(run.buyer)} - BidForge Proposal</title>
  <style>
    @page { margin: 0.7in; }
    body { color: #0b1c30; font-family: Arial, Helvetica, sans-serif; line-height: 1.45; margin: 0; }
    .cover { border: 1px solid #cbd5e1; padding: 32px; min-height: 680px; }
    .brand { color: #006b5f; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    h1 { font-size: 34px; line-height: 1.1; margin: 80px 0 12px; }
    h2 { border-bottom: 2px solid #006b5f; font-size: 20px; margin: 28px 0 10px; padding-bottom: 6px; }
    h3 { font-size: 15px; margin: 16px 0 6px; }
    .subtitle, .meta, .status, td, th, li { font-size: 12px; }
    .subtitle { color: #45474c; max-width: 620px; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 36px; }
    .meta-card { border: 1px solid #d8e6ef; padding: 12px; }
    .meta-card span { color: #45474c; display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .meta-card strong { display: block; font-size: 18px; margin-top: 4px; }
    .gate { background: #fffbeb; border: 1px solid #fde68a; margin-top: 28px; padding: 14px; }
    .page-break { page-break-before: always; }
    table { border-collapse: collapse; margin-top: 10px; width: 100%; }
    th { background: #e8f5f2; color: #0b1c30; text-align: left; }
    th, td { border: 1px solid #cbd5e1; padding: 7px; vertical-align: top; }
    .proposal-section { margin-bottom: 18px; }
    .status { color: #006b5f; font-weight: 700; margin-top: -4px; }
    .footer { border-top: 1px solid #cbd5e1; color: #45474c; font-size: 11px; margin-top: 28px; padding-top: 10px; }
    .print-action { background: #006b5f; border: 0; border-radius: 4px; color: #fff; cursor: pointer; font-size: 13px; font-weight: 700; margin: 0 0 18px; padding: 10px 14px; }
    @media print { .no-print { display: none; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <button class="no-print print-action" onclick="window.print()">Print / Save PDF</button>
  <section class="cover">
    <div class="brand">BidForge Agent Proposal Document</div>
    <h1>${escapeHtml(run.buyer)}<br>${escapeHtml(run.project)}</h1>
    <p class="subtitle">${escapeHtml(run.executiveBrief.opportunitySummary)}</p>
    <div class="meta-grid">
      <div class="meta-card"><span>Run</span><strong>${escapeHtml(run.runId)}</strong></div>
      <div class="meta-card"><span>Quality score</span><strong>${run.qualityScore}</strong></div>
      <div class="meta-card"><span>Coverage</span><strong>${run.coverage}%</strong></div>
      <div class="meta-card"><span>Status</span><strong>${escapeHtml(payload.manifest.exportStatus)}</strong></div>
    </div>
    <div class="gate"><strong>Final export gate:</strong> ${escapeHtml(payload.manifest.exportStatus)}. Reviewer package can be shared internally while required human approvals remain visible.</div>
  </section>
  <section class="page-break">
    <h2>Executive Brief</h2>
    <p>${escapeHtml(run.executiveBrief.opportunitySummary)}</p>
    <h3>Win Themes</h3>
    <ul>${run.executiveBrief.winThemes.map((theme) => `<li>${escapeHtml(theme)}</li>`).join("")}</ul>
    <h3>Bid Recommendation</h3>
    <p>${escapeHtml(run.executiveBrief.bidRecommendation)}</p>
  </section>
  <section class="page-break">
    <h2>Proposal Response</h2>
    ${proposalSections}
  </section>
  <section class="page-break">
    <h2>Compliance Matrix</h2>
    <table>
      <thead><tr><th>ID</th><th>Priority</th><th>Requirement</th><th>Status</th><th>Evidence</th><th>Owner</th></tr></thead>
      <tbody>${requirementRows}</tbody>
    </table>
  </section>
  <section class="page-break">
    <h2>Risks And Approval Gates</h2>
    <table>
      <thead><tr><th>ID</th><th>Severity</th><th>Risk</th><th>Owner</th><th>Mitigation</th></tr></thead>
      <tbody>${riskRows}</tbody>
    </table>
    <h2>Approval Gates</h2>
    <table>
      <thead><tr><th>Gate</th><th>Owner</th><th>Status</th><th>Evidence</th></tr></thead>
      <tbody>${gateRows}</tbody>
    </table>
  </section>
  <section class="page-break">
    <h2>Judge Report And ROI</h2>
    <p><strong>Decision:</strong> ${escapeHtml(run.judge.decision)} | <strong>Score:</strong> ${run.judge.score}</p>
    <ul>${run.judge.checks.map((check) => `<li>${escapeHtml(check.label)}: ${check.score}/${check.max}</li>`).join("")}</ul>
    <p><strong>Hours saved:</strong> ${run.roi.hoursSaved} | <strong>First draft reduction:</strong> ${escapeHtml(run.roi.firstDraftReduction)}</p>
    <div class="footer">Generated by BidForge Agent for ${escapeHtml(run.buyer)}. Package ID: ${escapeHtml(payload.manifest.packageId)}. Generated: ${escapeHtml(payload.manifest.generatedAt)}.</div>
  </section>
</body>
</html>`;
}

function openApprovalCount(run: BidForgeRun) {
  return run.governance.approvalGates.filter((gate) => !["Approved", "Ready", "Cleared"].includes(gate.status)).length;
}

function toneForPackageStatus(status: string): BadgeTone {
  if (status.includes("Ready") || status.includes("covered")) {
    return "success";
  }
  if (status.includes("Approval") || status.includes("Review")) {
    return "warning";
  }
  return "teal";
}

function toneForGate(status: string): BadgeTone {
  if (["Approved", "Ready", "Cleared"].includes(status)) {
    return "success";
  }
  if (["Required", "Blocked"].includes(status)) {
    return "danger";
  }
  if (["Pending", "Assigned"].includes(status)) {
    return "warning";
  }
  return "muted";
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
