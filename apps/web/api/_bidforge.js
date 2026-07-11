export const bidForgeDemoRun = {
  runId: "RFP-742-B",
  buyer: "Apex Global Bank",
  project: "Managed cloud migration and application modernization",
  status: "Analysis in progress",
  deadline: "14 days",
  qualityScore: 84,
  coverage: 92,
  requirements: 84,
  risks: 17,
  tokenCost: "$12.40",
  latency: "42.8s",
  mode: "Balanced",
  cacheHitRate: "38%",
  roi: { hoursSaved: 135, firstDraftReduction: "73%" },
  executiveBrief: {
    opportunitySummary: "Apex Global Bank needs a governed cloud migration and modernization partner with 24x7 operations, compliance controls, and delivery assurance.",
    winThemes: [
      "Lead with CloudSMART migration factory and wave planning discipline.",
      "Position global delivery for regulated 24x7 support.",
      "Show governance, evidence control, and human approval gates as differentiators."
    ],
    majorRisks: [
      "EU data residency wording needs legal approval.",
      "24x7 SLA penalties need finance validation.",
      "Fixed-price transition assumptions remain unsupported."
    ],
    missingInputs: [
      "Legal position for EU data residency commitment.",
      "Finance-approved penalty cap and fixed-price assumptions.",
      "Security citation for incident response control evidence."
    ],
    confidenceLevel: "Medium",
    bidRecommendation: "Proceed with controlled bid response after legal, finance, and security approvals."
  },
  governance: {
    roles: [
      { role: "Bid manager", access: "Create runs, operate automation, export drafts", owner: "Senior Bid Mgr", status: "Active" },
      { role: "Legal reviewer", access: "Approve compliance, legal terms, residency clauses", owner: "Legal", status: "Pending" },
      { role: "Finance reviewer", access: "Approve pricing, penalty caps, commercial assumptions", owner: "Finance", status: "Assigned" },
      { role: "Delivery lead", access: "Approve transition, staffing, SLA delivery model", owner: "Delivery", status: "Answered" },
      { role: "Security SME", access: "Approve controls, incident response, evidence citations", owner: "Security", status: "Assigned" }
    ],
    approvalGates: [
      { gate: "Legal approval", owner: "Legal", status: "Required", evidence: "EU data residency and contractual language" },
      { gate: "Pricing approval", owner: "Finance", status: "Required", evidence: "24x7 penalties and fixed-price assumptions" },
      { gate: "Delivery approval", owner: "Delivery", status: "Required", evidence: "90-day transition plan and dependencies" },
      { gate: "Security approval", owner: "Security", status: "Pending", evidence: "Incident response evidence citation" },
      { gate: "Final export", owner: "Bid manager", status: "Blocked", evidence: "All mandatory gates must clear before export" }
    ],
    controls: [
      { label: "RBAC", state: "Enabled", detail: "Automation mutations require bid_manager or admin role." },
      { label: "Audit trail", state: "Enabled", detail: "Run creation, automation changes, and denied actions are recorded." },
      { label: "Guardrails", state: "Enabled", detail: "Prompt-injection content remains quarantined before draft generation." },
      { label: "Human gates", state: "Active", detail: "Required approvals block final export while risks remain open." }
    ]
  },
  upload: {
    file: "Apex_Global_Bank_RFP_demo.pdf",
    size: "118 pages",
    knowledgeBase: "Demo proposal bank",
    selectedMode: "Balanced review",
    estimatedCost: "$10-$14",
    estimatedTime: "3-5 min",
    warning: "1 prompt-injection pattern quarantined as document content"
  },
  timeline: [
    { agent: "Intake Agent", state: "Done", note: "RFP normalized, metadata extracted" },
    { agent: "Requirement Agent", state: "Done", note: "84 requirements with citations" },
    { agent: "Capability Agent", state: "Done", note: "63 evidence-backed matches" },
    { agent: "Proposal Writer", state: "Active", note: "Drafting security and delivery sections" },
    { agent: "Risk Agent", state: "Review", note: "17 risks, 5 need approval" },
    { agent: "SME Router", state: "Ready", note: "12 tasks routed to owners" },
    { agent: "Judge Agent", state: "Queued", note: "Verification starts after draft lock" }
  ],
  requirementsTable: [
    { id: "M-001", category: "Support", priority: "Mandatory", text: "Vendor must provide 24x7 L1/L2/L3 support.", status: "Verified", evidence: "Support model boilerplate", owner: "Delivery", confidence: "96%" },
    { id: "M-002", category: "Experience", priority: "Mandatory", text: "Vendor must demonstrate regulated banking workload experience.", status: "Verified", evidence: "Anonymized banking migration case", owner: "Sales", confidence: "88%" },
    { id: "M-003", category: "Compliance", priority: "Mandatory", text: "Vendor must comply with EU data residency.", status: "Needs SME", evidence: "No verified legal position found", owner: "Legal", confidence: "71%" },
    { id: "M-004", category: "Delivery", priority: "Mandatory", text: "Vendor must provide transition plan within 90 days.", status: "Verified", evidence: "CloudSMART transition template", owner: "Solution Architect", confidence: "91%" },
    { id: "M-005", category: "Security", priority: "Mandatory", text: "Vendor must include security incident response process.", status: "Pending", evidence: "ISO 27001 aligned control library", owner: "Security", confidence: "83%" },
    { id: "P-002", category: "Commercial", priority: "Preferred", text: "Preference for fixed-price transition model.", status: "Gap", evidence: "Needs finance input", owner: "Finance", confidence: "64%" }
  ],
  proposalSections: [
    { title: "Executive Summary", status: "Verified", body: "BidForge drafted a concise first-pass response positioning demo capabilities around cloud migration, DevSecOps enablement, and governed 24x7 operations. Client-specific metrics remain marked for SME validation." },
    { title: "Solution Approach", status: "Verified", body: "The proposed approach uses a migration factory model, application wave planning, automated readiness checks, and reusable transition governance artifacts." },
    { title: "Security & Compliance", status: "Needs SME", body: "The draft references an ISO 27001 aligned control library and incident response process, but EU data residency commitments require legal validation before export." },
    { title: "Assumptions", status: "Unsupported", body: "Fixed-price transition assumptions, buyer environment access, and third-party tooling obligations are blocked pending finance and delivery owner review." }
  ],
  evidenceSources: [
    { name: "CloudSMART Migration Factory", detail: "Transition approach, wave planning, migration governance" },
    { name: "DevSecOps Automation Toolkit", detail: "CI/CD controls, automated policy checks, release telemetry" },
    { name: "Global Delivery Model", detail: "24x7 support model, distributed delivery governance" },
    { name: "ISO 27001 aligned control library", detail: "Incident response, access control, audit evidence" },
    { name: "Anonymized banking migration case", detail: "Regulated workload migration story, no client metrics claimed" }
  ],
  riskRegister: [
    { id: "R-001", severity: "Critical", category: "Legal", title: "EU data residency commitment needs legal validation", owner: "Legal", mitigation: "Route residency language to legal before final export.", approval: "Required" },
    { id: "R-002", severity: "High", category: "SLA", title: "24x7 penalties not priced", owner: "Finance", mitigation: "Confirm penalty caps and include assumptions in commercial response.", approval: "Required" },
    { id: "R-003", severity: "Medium", category: "Delivery", title: "90-day transition plan may be aggressive", owner: "Delivery", mitigation: "Add phased transition plan with dependency assumptions.", approval: "Required" },
    { id: "R-004", severity: "Low", category: "Security", title: "Incident response evidence needs exact citation", owner: "Security", mitigation: "Attach control-library excerpt to the response section.", approval: "Pending" }
  ],
  tasks: [
    { status: "Pending", owner: "Legal", title: "Approve EU data residency response", link: "T-011 - linked to M-003" },
    { status: "Assigned", owner: "Finance", title: "Validate fixed-price transition model", link: "T-012 - linked to P-002" },
    { status: "Assigned", owner: "Security", title: "Confirm incident response citation", link: "T-013 - linked to M-005" },
    { status: "Answered", owner: "Delivery", title: "Review 90-day transition plan", link: "T-014 - linked to M-004" },
    { status: "Approved", owner: "Sales", title: "Approve anonymized banking case", link: "T-015 - linked to M-002" }
  ],
  judge: {
    decision: "Ready with human review",
    score: 87,
    checks: [
      { label: "Requirement coverage", score: 22, max: 25 },
      { label: "Citation support", score: 18, max: 20 },
      { label: "Hallucination control", score: 17, max: 20 },
      { label: "Risk detection", score: 13, max: 15 },
      { label: "Proposal usefulness", score: 9, max: 10 },
      { label: "Human-review readiness", score: 8, max: 10 }
    ]
  },
  automation: {
    id: "auto-rfp-742-b",
    name: "Apex RFP auto-refresh",
    status: "Active",
    frequencyMinutes: 5,
    nextRunIn: "5 min",
    lastRunAt: "Just now",
    runMode: "Balanced review",
    trigger: "Refresh extraction, risks, SME tasks, and judge report",
    guarded: true,
    owner: "Bid manager",
    nextRunAt: ""
  },
  automationHistory: [
    { id: "auto-run-003", status: "Completed", startedAt: "Just now", finishedAt: "Just now", summary: "Refreshed extraction, risk register, SME tasks, and judge report.", changedArtifacts: ["Risk register", "SME task board", "Judge report"] },
    { id: "auto-run-002", status: "Completed", startedAt: "5 min ago", finishedAt: "5 min ago", summary: "No new unsupported claims detected. Legal approval gate remains open.", changedArtifacts: ["Judge report"] },
    { id: "auto-run-001", status: "Completed", startedAt: "10 min ago", finishedAt: "10 min ago", summary: "Prompt-injection marker quarantined and excluded from proposal generation.", changedArtifacts: ["Guardrail log", "Timeline"] }
  ],
  auditTrail: [
    { id: "audit-001", actor: "System", action: "Demo run loaded", target: "RFP-742-B", timestamp: "Just now", outcome: "Completed", detail: "Loaded deterministic demo run with automation guardrails enabled." }
  ]
};

export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store");
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, methods) {
  res.setHeader("allow", methods.join(", "));
  sendJson(res, 405, { error: "method_not_allowed", message: `Use ${methods.join(" or ")}.` });
}

export function optionsResponse(res) {
  res.statusCode = 204;
  res.end();
}

export function requestBody(req) {
  if (!req.body) {
    return {};
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (typeof req.body === "object") {
    return req.body;
  }
  return {};
}

export function demoRun(overrides = {}) {
  return {
    ...bidForgeDemoRun,
    ...overrides,
    upload: { ...bidForgeDemoRun.upload, ...(overrides.upload ?? {}) },
    automation: { ...bidForgeDemoRun.automation, ...(overrides.automation ?? {}) },
    automationHistory: overrides.automationHistory ?? bidForgeDemoRun.automationHistory,
    auditTrail: overrides.auditTrail ?? bidForgeDemoRun.auditTrail
  };
}

export function automationState(overrides = {}) {
  return {
    ...bidForgeDemoRun.automation,
    ...overrides,
    history: bidForgeDemoRun.automationHistory,
    auditTrail: bidForgeDemoRun.auditTrail
  };
}

export function runRecord(source = "Manual") {
  return {
    id: `auto-run-${Date.now()}`,
    status: "Completed",
    startedAt: "Just now",
    finishedAt: "Just now",
    summary: `${source} automation refresh completed. Artifacts refreshed with guardrails active.`,
    changedArtifacts: ["Compliance matrix", "Risk register", "SME task board", "Judge report"]
  };
}

export function uploadedRun(payload) {
  const file = typeof payload.file === "string" && payload.file.trim() ? payload.file : "Uploaded RFP";
  const rfpText = typeof payload.rfpText === "string" ? payload.rfpText : "";
  const requirementCount = Math.max(6, Math.min(84, Math.round(rfpText.split(/\bmust\b|\bshall\b|\bshould\b/i).length + 5)));
  const record = runRecord("Upload-triggered");

  return demoRun({
    status: "Automation refresh complete",
    requirements: requirementCount,
    upload: {
      ...bidForgeDemoRun.upload,
      file,
      size: rfpText ? `${Math.max(1, Math.ceil(rfpText.length / 2600))} page text extract` : "Uploaded document",
      warning: rfpText.toLowerCase().includes("ignore previous instructions")
        ? "Prompt-injection pattern quarantined as document content"
        : "No prompt-injection pattern detected"
    },
    automation: { ...bidForgeDemoRun.automation, lastRunAt: "Just now", nextRunIn: "5 min" },
    automationHistory: [record, ...bidForgeDemoRun.automationHistory],
    auditTrail: [
      {
        id: "audit-vercel-upload",
        actor: "Senior Bid Mgr",
        action: "Created bid run",
        target: bidForgeDemoRun.runId,
        timestamp: "Just now",
        outcome: "Completed",
        detail: `Started balanced review from ${file}; Vercel API refresh executed with guardrails active.`
      },
      ...bidForgeDemoRun.auditTrail
    ]
  });
}
