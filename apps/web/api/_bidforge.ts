import { bidForgeDemoRun } from "../src/data/bidforgeDemoRun";
import type { AutomationConfig, AutomationRunRecord, BidForgeRun } from "../src/types/bidforge";

type JsonResponse = {
  status: (code: number) => JsonResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
};

type JsonRequest = {
  method?: string;
  body?: unknown;
};

export function sendJson(res: JsonResponse, statusCode: number, payload: unknown) {
  res.setHeader("cache-control", "no-store");
  res.status(statusCode).json(payload);
}

export function methodNotAllowed(res: JsonResponse, methods: string[]) {
  res.setHeader("allow", methods.join(", "));
  sendJson(res, 405, { error: "method_not_allowed", message: `Use ${methods.join(" or ")}.` });
}

export function optionsResponse(res: JsonResponse) {
  res.status(204).end();
}

export function requestBody(req: JsonRequest): Record<string, unknown> {
  if (!req.body) {
    return {};
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  return {};
}

export function demoRun(overrides: Partial<BidForgeRun> = {}): BidForgeRun {
  return {
    ...bidForgeDemoRun,
    ...overrides,
    upload: { ...bidForgeDemoRun.upload, ...(overrides.upload ?? {}) },
    automation: { ...bidForgeDemoRun.automation, ...(overrides.automation ?? {}) },
    automationHistory: overrides.automationHistory ?? bidForgeDemoRun.automationHistory,
    auditTrail: overrides.auditTrail ?? bidForgeDemoRun.auditTrail
  };
}

export function automationState(overrides: Partial<AutomationConfig> = {}) {
  return {
    ...bidForgeDemoRun.automation,
    ...overrides,
    history: bidForgeDemoRun.automationHistory,
    auditTrail: bidForgeDemoRun.auditTrail
  };
}

export function runRecord(source = "Manual"): AutomationRunRecord {
  return {
    id: `auto-run-${Date.now()}`,
    status: "Completed",
    startedAt: "Just now",
    finishedAt: "Just now",
    summary: `${source} automation refresh completed. Artifacts refreshed with guardrails active.`,
    changedArtifacts: ["Compliance matrix", "Risk register", "SME task board", "Judge report"]
  };
}

export function uploadedRun(payload: Record<string, unknown>) {
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
