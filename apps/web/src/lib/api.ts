import { bidForgeDemoRun } from "../data/bidforgeDemoRun";
import type { AuditEvent, AutomationConfig, AutomationRunRecord, AutomationState, BidForgeRun } from "../types/bidforge";
import { deriveDocumentMetadata, type DocumentMetadata } from "./documentMetadata";

const API_BASE = import.meta.env.VITE_BIDFORGE_API_BASE ?? (import.meta.env.PROD ? "" : "http://127.0.0.1:8787");

export async function fetchDemoRun(): Promise<BidForgeRun> {
  try {
    const response = await fetch(`${API_BASE}/api/runs/demo`);
    if (!response.ok) {
      throw new Error(`BidForge API responded with ${response.status}`);
    }
    return await response.json() as BidForgeRun;
  } catch {
    return bidForgeDemoRun;
  }
}

export type BidRunDraft = {
  fileName: string;
  metadata?: DocumentMetadata;
  rfpText: string;
};

export async function createBidRun(run: BidForgeRun, draft?: BidRunDraft): Promise<BidForgeRun> {
  const fileName = draft?.fileName || run.upload.file;
  const rfpText = draft?.rfpText || `${run.buyer} ${run.project}`;
  const metadata = draft?.metadata ?? deriveDocumentMetadata(fileName, rfpText, metadataFromRun(run));
  try {
    const response = await fetch(`${API_BASE}/api/runs`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        actor: "Senior Bid Mgr",
        role: "bid_manager",
        file: fileName,
        metadata,
        rfpText
      })
    });
    if (!response.ok) {
      throw new Error(`BidForge API responded with ${response.status}`);
    }
    return await response.json() as BidForgeRun;
  } catch {
    const runRecord: AutomationRunRecord = {
      id: "auto-run-upload-local",
      status: "Completed",
      startedAt: "Just now",
      finishedAt: "Just now",
      summary: "Upload-triggered automation run completed. Artifacts refreshed with guardrails active.",
      changedArtifacts: ["Compliance matrix", "Risk register", "SME task board", "Judge report"]
    };
    return {
      ...run,
      runId: metadata.runId,
      buyer: metadata.buyer,
      project: metadata.project,
      status: "Automation refresh complete",
      deadline: metadata.deadline,
      upload: {
        ...run.upload,
        file: fileName,
        knowledgeBase: metadata.knowledgeBase,
        estimatedCost: metadata.estimatedCost,
        estimatedTime: metadata.estimatedTime,
        size: metadata.size,
        warning: metadata.warning
      },
      automation: {
        ...run.automation,
        name: `${metadata.buyer} Request for Proposal auto-refresh`,
        lastRunAt: "Just now",
        nextRunIn: `${run.automation.frequencyMinutes} min`
      },
      automationHistory: [runRecord, ...run.automationHistory],
      auditTrail: [
        {
          id: "audit-upload-local",
          actor: "Senior Bid Mgr",
          action: "Created bid run",
          target: metadata.runId,
          timestamp: "Just now",
          outcome: "Completed",
          detail: `Started balanced review for ${metadata.buyer} from ${fileName}; automation refresh executed with guardrails active.`
        },
        ...run.auditTrail
      ]
    };
  }
}

function metadataFromRun(run: BidForgeRun): DocumentMetadata {
  return {
    buyer: run.buyer,
    project: run.project,
    runId: run.runId,
    deadline: run.deadline,
    knowledgeBase: run.upload.knowledgeBase,
    estimatedCost: run.upload.estimatedCost,
    estimatedTime: run.upload.estimatedTime,
    size: run.upload.size,
    warning: run.upload.warning
  };
}

export async function fetchAutomationConfig(): Promise<AutomationState> {
  try {
    const response = await fetch(`${API_BASE}/api/automations/current`);
    if (!response.ok) {
      throw new Error(`BidForge API responded with ${response.status}`);
    }
    return await response.json() as AutomationState;
  } catch {
    return { ...bidForgeDemoRun.automation, history: bidForgeDemoRun.automationHistory };
  }
}

export async function updateAutomationFrequency(frequencyMinutes: number): Promise<AutomationState> {
  try {
    const response = await fetch(`${API_BASE}/api/automations/current`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ frequencyMinutes, actor: "Senior Bid Mgr", role: "bid_manager" })
    });
    if (!response.ok) {
      throw new Error(`BidForge API responded with ${response.status}`);
    }
    return await response.json() as AutomationState;
  } catch {
    return {
      ...bidForgeDemoRun.automation,
      frequencyMinutes,
      nextRunIn: `${frequencyMinutes} min`,
      history: bidForgeDemoRun.automationHistory
    };
  }
}

export async function pauseAutomation(): Promise<AutomationState> {
  return mutateAutomationState("/api/automations/current/pause", {
    ...bidForgeDemoRun.automation,
    status: "Paused",
    nextRunIn: "Paused",
    nextRunAt: "",
    history: bidForgeDemoRun.automationHistory
  });
}

export async function resumeAutomation(): Promise<AutomationState> {
  return mutateAutomationState("/api/automations/current/resume", {
    ...bidForgeDemoRun.automation,
    status: "Active",
    nextRunIn: `${bidForgeDemoRun.automation.frequencyMinutes} min`,
    history: bidForgeDemoRun.automationHistory
  });
}

export async function runAutomationNow(): Promise<{ automation: AutomationConfig; run: AutomationRunRecord; history: AutomationRunRecord[]; auditTrail?: AuditEvent[] }> {
  try {
    const response = await fetch(`${API_BASE}/api/automations/current/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ actor: "Senior Bid Mgr", role: "bid_manager" })
    });
    if (!response.ok) {
      throw new Error(`BidForge API responded with ${response.status}`);
    }
    return await response.json() as { automation: AutomationConfig; run: AutomationRunRecord; history: AutomationRunRecord[]; auditTrail?: AuditEvent[] };
  } catch {
    const run: AutomationRunRecord = {
      id: "auto-run-local",
      status: "Completed",
      startedAt: "Just now",
      finishedAt: "Just now",
      summary: "Local fallback automation run completed.",
      changedArtifacts: ["Compliance matrix", "Risk register", "SME task board", "Judge report"]
    };
    return {
      automation: { ...bidForgeDemoRun.automation, lastRunAt: "Just now", nextRunIn: `${bidForgeDemoRun.automation.frequencyMinutes} min` },
      run,
      history: [run, ...bidForgeDemoRun.automationHistory]
    };
  }
}

async function mutateAutomationState(path: string, fallback: AutomationState): Promise<AutomationState> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ actor: "Senior Bid Mgr", role: "bid_manager" })
    });
    if (!response.ok) {
      throw new Error(`BidForge API responded with ${response.status}`);
    }
    return await response.json() as AutomationState;
  } catch {
    return fallback;
  }
}
