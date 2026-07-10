import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppShell } from "./components/layout/AppShell";
import { bidForgeDemoRun } from "./data/bidforgeDemoRun";
import { AiGovernanceScorecard, type AiGovernancePayload } from "./features/ai-governance/AiGovernanceScorecard";
import { AdminAnalytics, type AdminAnalyticsPayload } from "./features/analytics/AdminAnalytics";
import { AutomationPanel } from "./features/automation/AutomationPanel";
import { BenchmarkMode, type BenchmarkPayload } from "./features/benchmark/BenchmarkMode";
import { AgentTimeline } from "./features/bid-run/AgentTimeline";
import { RunOverview } from "./features/bid-run/RunOverview";
import { ExecutiveBrief } from "./features/brief/ExecutiveBrief";
import { ComplianceMatrix } from "./features/compliance/ComplianceMatrix";
import { CollaborationInbox, type CollaborationInboxPayload } from "./features/inbox/CollaborationInbox";
import { CompetitiveStrategyLab, type CompetitiveStrategyPayload } from "./features/competitive/CompetitiveStrategyLab";
import { EndToEndFlow } from "./features/flow/EndToEndFlow";
import { GovernancePanel } from "./features/governance/GovernancePanel";
import { IntegrationSimulator, type IntegrationPayload } from "./features/integrations/IntegrationSimulator";
import { JudgeReport } from "./features/judge/JudgeReport";
import { KnowledgeBaseStudio, type KnowledgeBasePayload } from "./features/knowledge/KnowledgeBaseStudio";
import { ProposalPackage, type ProposalPackagePayload } from "./features/package/ProposalPackage";
import { ProposalDraft } from "./features/proposal/ProposalDraft";
import { SourceEvidenceDrawer } from "./features/proposal/SourceEvidenceDrawer";
import { RiskRegister } from "./features/risks/RiskRegister";
import { RoiSimulator, type RoiScenario } from "./features/roi/RoiSimulator";
import { SlaForecast, type SlaForecastPayload } from "./features/sla/SlaForecast";
import { SmeTaskBoard } from "./features/sme-tasks/SmeTaskBoard";
import { WinStrategy, type WinStrategyPayload } from "./features/strategy/WinStrategy";
import { UploadConfigureRun } from "./features/upload/UploadConfigureRun";
import { createBidRun, fetchAutomationConfig, fetchDemoRun, pauseAutomation, resumeAutomation, runAutomationNow, updateAutomationFrequency } from "./lib/api";
import type { AutomationState, BidForgeRun, CommandView } from "./types/bidforge";

const views: CommandView[] = ["upload", "dashboard", "matrix", "proposal", "knowledge", "inbox", "risks", "tasks", "judge", "brief", "strategy", "competitive", "package", "analytics", "sla", "roi", "benchmark", "flow", "governance", "ai-governance", "integrations", "automation"];

export function App() {
  const [run, setRun] = useState(bidForgeDemoRun);
  const [activeView, setActiveView] = useState<CommandView>(currentViewFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandMessage, setCommandMessage] = useState("");
  const visibleRun = useMemo(() => filterRun(run, searchQuery), [run, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([fetchDemoRun(), fetchAutomationConfig()]).then(([nextRun, automation]) => {
      if (isMounted) {
        setRun({ ...nextRun, ...automationStateToRunPatch(automation) });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => setActiveView(currentViewFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const applyAutomationState = (automation: AutomationState) => {
    setRun((currentRun) => ({
      ...currentRun,
      ...automationStateToRunPatch(automation)
    }));
  };

  const navigate = (view: CommandView) => {
    const nextUrl = `${window.location.pathname}?view=${view}`;
    window.history.pushState({}, "", nextUrl);
    setActiveView(view);
  };

  return (
    <AppShell
      run={run}
      activeView={activeView}
      onNavigate={navigate}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      commandMessage={commandMessage}
      onClearCommand={() => setCommandMessage("")}
    >
      <CommandWorkspace
        activeView={activeView}
        run={visibleRun}
        sourceRun={run}
        onNavigate={navigate}
        onCommand={setCommandMessage}
        onCreateRun={async (draft) => {
          const nextRun = await createBidRun(run, draft);
          setRun(nextRun);
          setSearchQuery("");
          setCommandMessage(`Started balanced review for ${nextRun.upload.file}.`);
        }}
        onRunNow={async () => {
          const result = await runAutomationNow();
          setRun((currentRun) => ({
            ...currentRun,
            automation: result.automation,
            automationHistory: result.history,
            ...(result.auditTrail ? { auditTrail: result.auditTrail } : {})
          }));
          setCommandMessage("Automation run completed and artifacts refreshed.");
        }}
        onToggleAutomation={async () => {
          const automation = run.automation.status === "Active" ? await pauseAutomation() : await resumeAutomation();
          applyAutomationState(automation);
          setCommandMessage(`Automation ${automation.status.toLowerCase()}.`);
        }}
        onSaveFrequency={async (frequencyMinutes) => {
          const automation = await updateAutomationFrequency(frequencyMinutes);
          applyAutomationState(automation);
          setCommandMessage(`Automation frequency saved at ${frequencyMinutes} minutes.`);
        }}
      />
    </AppShell>
  );
}

function CommandWorkspace({
  activeView,
  run,
  sourceRun,
  onNavigate,
  onCommand,
  onCreateRun,
  onRunNow,
  onToggleAutomation,
  onSaveFrequency
}: {
  activeView: CommandView;
  run: BidForgeRun;
  sourceRun: BidForgeRun;
  onNavigate: (view: CommandView) => void;
  onCommand: (message: string) => void;
  onCreateRun: Parameters<typeof UploadConfigureRun>[0]["onCreateRun"];
  onRunNow: () => void | Promise<void>;
  onToggleAutomation: () => void | Promise<void>;
  onSaveFrequency: (frequencyMinutes: number) => void | Promise<void>;
}) {
  if (activeView === "upload") {
    return <WorkspaceGrid><UploadConfigureRun run={run} onCreateRun={onCreateRun} /><AgentTimeline run={run} /></WorkspaceGrid>;
  }
  if (activeView === "dashboard") {
    return <><RunOverview run={run} onOpenRoi={() => onNavigate("roi")} /><WorkspaceGrid><AgentTimeline run={run} /></WorkspaceGrid></>;
  }
  if (activeView === "matrix") {
    return <ComplianceMatrix run={run} onOpenEvidence={() => onNavigate("proposal")} />;
  }
  if (activeView === "proposal") {
    return <WorkspaceGrid><ProposalDraft run={run} onExport={() => exportJson("bidforge-proposal-draft.json", sourceRun.proposalSections, onCommand, "Proposal draft exported.")} /><SourceEvidenceDrawer run={run} /></WorkspaceGrid>;
  }
  if (activeView === "knowledge") {
    return <KnowledgeBaseStudio run={run} onExport={(payload: KnowledgeBasePayload) => exportJson("bidforge-knowledge-base.json", payload, onCommand, "Knowledge base evidence exported.")} />;
  }
  if (activeView === "inbox") {
    return <CollaborationInbox run={run} onExport={(payload: CollaborationInboxPayload) => exportJson("bidforge-collaboration-inbox.json", payload, onCommand, "Collaboration inbox exported.")} />;
  }
  if (activeView === "risks") {
    return <RiskRegister run={run} onSendToReviewer={() => onCommand(`${sourceRun.riskRegister.length} risks queued for reviewer handoff.`)} />;
  }
  if (activeView === "tasks") {
    return <SmeTaskBoard run={run} />;
  }
  if (activeView === "judge") {
    return <JudgeReport run={run} />;
  }
  if (activeView === "brief") {
    return <ExecutiveBrief run={run} onExport={() => exportJson("bidforge-executive-brief.json", sourceRun.executiveBrief, onCommand, "Executive brief exported.")} />;
  }
  if (activeView === "strategy") {
    return <WinStrategy run={run} onExport={(payload: WinStrategyPayload) => exportJson("bidforge-win-strategy.json", payload, onCommand, "Win strategy memo exported.")} />;
  }
  if (activeView === "competitive") {
    return <CompetitiveStrategyLab run={run} onExport={(payload: CompetitiveStrategyPayload) => exportJson("bidforge-competitive-battlecard.json", payload, onCommand, "Competitive battlecard exported.")} />;
  }
  if (activeView === "package") {
    return (
      <ProposalPackage
        run={run}
        onExportJson={(payload: ProposalPackagePayload) => exportJson("bidforge-proposal-package.json", payload, onCommand, "Proposal package exported.")}
        onExportMarkdown={(content: string) => exportText("bidforge-proposal-memo.md", content, "text/markdown", onCommand, "Proposal memo exported.")}
        onExportWord={(content: string) => exportText("bidforge-client-proposal.doc", content, "application/msword", onCommand, "Word-compatible proposal document exported.")}
        onExportPrintView={(content: string) => exportText("bidforge-pdf-print-view.html", content, "text/html", onCommand, "PDF print view exported.")}
      />
    );
  }
  if (activeView === "analytics") {
    return <AdminAnalytics run={run} onExport={(payload: AdminAnalyticsPayload) => exportJson("bidforge-admin-analytics.json", payload, onCommand, "Admin analytics exported.")} />;
  }
  if (activeView === "sla") {
    return <SlaForecast run={run} onExport={(payload: SlaForecastPayload) => exportJson("bidforge-sla-forecast.json", payload, onCommand, "SLA forecast exported.")} />;
  }
  if (activeView === "roi") {
    return <RoiSimulator run={run} onExport={(scenario: RoiScenario) => exportJson("bidforge-roi-scenario.json", scenario, onCommand, "ROI scenario exported.")} />;
  }
  if (activeView === "benchmark") {
    return <BenchmarkMode run={run} onExport={(payload: BenchmarkPayload) => exportJson("bidforge-benchmark.json", payload, onCommand, "Benchmark evidence exported.")} />;
  }
  if (activeView === "flow") {
    return <EndToEndFlow run={sourceRun} onCommand={onCommand} />;
  }
  if (activeView === "governance") {
    return <GovernancePanel run={run} onExportAudit={() => exportJson("bidforge-audit-trail.json", sourceRun.auditTrail, onCommand, "Audit trail exported.")} />;
  }
  if (activeView === "ai-governance") {
    return <AiGovernanceScorecard run={run} onExport={(payload: AiGovernancePayload) => exportJson("bidforge-ai-governance-scorecard.json", payload, onCommand, "AI governance scorecard exported.")} />;
  }
  if (activeView === "integrations") {
    return <IntegrationSimulator run={run} onExport={(payload: IntegrationPayload) => exportJson("bidforge-integration-status.json", payload, onCommand, "Integration status exported.")} />;
  }
  return <AutomationPanel run={run} onRunNow={onRunNow} onToggleStatus={onToggleAutomation} onSaveFrequency={onSaveFrequency} />;
}

function filterRun(run: BidForgeRun, query: string): BidForgeRun {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return run;
  }
  const matches = (values: Array<string | number | undefined>) => values.some((value) => String(value ?? "").toLowerCase().includes(normalized));
  return {
    ...run,
    requirementsTable: run.requirementsTable.filter((row) => matches([row.id, row.category, row.priority, row.text, row.status, row.evidence, row.owner, row.confidence])),
    proposalSections: run.proposalSections.filter((section) => matches([section.title, section.status, section.body])),
    evidenceSources: run.evidenceSources.filter((source) => matches([source.name, source.detail])),
    riskRegister: run.riskRegister.filter((risk) => matches([risk.id, risk.severity, risk.category, risk.title, risk.owner, risk.mitigation, risk.approval])),
    tasks: run.tasks.filter((task) => matches([task.status, task.owner, task.title, task.link])),
    auditTrail: run.auditTrail.filter((event) => matches([event.actor, event.action, event.target, event.outcome, event.detail, event.timestamp])),
  };
}

function exportJson(fileName: string, payload: unknown, onCommand: (message: string) => void, message: string) {
  exportText(fileName, JSON.stringify(payload, null, 2), "application/json", onCommand, message);
}

function exportText(fileName: string, content: string, type: string, onCommand: (message: string) => void, message: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
  onCommand(message);
}

function WorkspaceGrid({ children }: { children: ReactNode }) {
  return <div className="mainGrid commandGrid">{children}</div>;
}

function currentViewFromUrl(): CommandView {
  const view = new URLSearchParams(window.location.search).get("view") as CommandView | null;
  return view && views.includes(view) ? view : "dashboard";
}

function automationStateToRunPatch(automation: AutomationState) {
  const { history, auditTrail, ...automationConfig } = automation;
  return {
    automation: automationConfig,
    automationHistory: history,
    ...(auditTrail ? { auditTrail } : {})
  };
}
