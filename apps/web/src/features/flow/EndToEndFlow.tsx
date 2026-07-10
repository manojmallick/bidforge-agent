import { Activity, CheckCircle2, CircleDashed, Crown, RotateCcw, ShieldCheck, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun } from "../../types/bidforge";

type FlowRole = "Bid Manager" | "Legal" | "Finance" | "Security" | "Delivery" | "Admin";
type FlowStatus = "Ready" | "Active" | "Waiting" | "Approved" | "Changes requested";

type FlowStep = {
  id: string;
  title: string;
  owner: FlowRole;
  status: FlowStatus;
  artifact: string;
  gate: string;
};

const roleOptions: FlowRole[] = ["Bid Manager", "Legal", "Finance", "Security", "Delivery", "Admin"];

const statusTone: Record<FlowStatus, BadgeTone> = {
  Ready: "teal",
  Active: "warning",
  Waiting: "muted",
  Approved: "success",
  "Changes requested": "danger",
};

export function EndToEndFlow({ run, onCommand }: { run: BidForgeRun; onCommand: (message: string) => void }) {
  const [activeRole, setActiveRole] = useState<FlowRole>("Bid Manager");
  const [steps, setSteps] = useState<FlowStep[]>(() => initialSteps(run));
  const [events, setEvents] = useState<string[]>([
    `Run ${run.runId} created by Bid Manager`,
    "Automation prepared compliance matrix, risks, tasks, proposal, and judge report",
  ]);

  const visibleSteps = activeRole === "Admin" ? steps : steps.filter((step) => step.owner === activeRole || step.owner === "Bid Manager");
  const approvedCount = steps.filter((step) => step.status === "Approved").length;
  const completion = Math.round((approvedCount / steps.length) * 100);
  const currentGate = steps.find((step) => step.status === "Active" || step.status === "Changes requested") ?? steps.find((step) => step.status !== "Approved");

  const approveStep = (stepId: string) => {
    const step = steps.find((item) => item.id === stepId);
    if (!step || (activeRole !== step.owner && activeRole !== "Admin")) {
      return;
    }
    setSteps((current) => advanceStep(current, stepId));
    const message = `${activeRole} approved ${step.gate}.`;
    setEvents((current) => [message, ...current].slice(0, 8));
    onCommand(message);
  };

  const requestChanges = (stepId: string) => {
    const step = steps.find((item) => item.id === stepId);
    if (!step || (activeRole !== step.owner && activeRole !== "Admin")) {
      return;
    }
    const message = `${activeRole} requested changes on ${step.gate}.`;
    setSteps((current) => current.map((item) => item.id === stepId ? { ...item, status: "Changes requested" } : item));
    setEvents((current) => [message, ...current].slice(0, 8));
    onCommand(message);
  };

  const resetFlow = () => {
    setSteps(initialSteps(run));
    setEvents([`Run ${run.runId} reset by Admin`, "Approval gates returned to demo start state"]);
    setActiveRole("Admin");
    onCommand("End-to-end flow reset for demo.");
  };

  const adminSummary = useMemo(() => ({
    blocked: steps.filter((step) => step.status === "Changes requested").length,
    waiting: steps.filter((step) => step.status === "Waiting").length,
    approved: approvedCount,
  }), [approvedCount, steps]);

  return (
    <section className="panel flowPanel" id="flow">
      <PanelTitle icon={<Activity size={18} />} title="End-to-End Role Flow" action="Reset demo" onAction={resetFlow} />

      <div className="flowHero">
        <div>
          <p className="eyebrow">Role-based approval journey</p>
          <h2>{run.buyer}: {run.project}</h2>
          <p>Switch roles, approve gates, request changes, and let Admin track the full bid lifecycle from upload to export readiness.</p>
        </div>
        <div className="flowProgress">
          <Crown size={18} />
          <strong>{completion}%</strong>
          <span>flow complete</span>
        </div>
      </div>

      <div className="roleSwitcher" aria-label="Role switcher">
        {roleOptions.map((role) => (
          <button className={activeRole === role ? "active" : ""} type="button" key={role} onClick={() => setActiveRole(role)}>
            {role === "Admin" ? <Crown size={15} /> : <UserCheck size={15} />}
            {role}
          </button>
        ))}
      </div>

      <div className="flowGrid">
        <div className="flowSteps">
          {visibleSteps.map((step) => {
            const canAct = activeRole === "Admin" || activeRole === step.owner;
            return (
              <article className="flowStep" key={step.id}>
                <div>
                  <strong>{step.title}</strong>
                  <Badge tone={statusTone[step.status]}>{step.status}</Badge>
                </div>
                <p>{step.artifact}</p>
                <dl>
                  <div><dt>Owner</dt><dd>{step.owner}</dd></div>
                  <div><dt>Gate</dt><dd>{step.gate}</dd></div>
                </dl>
                <footer>
                  <button type="button" disabled={!canAct || step.status === "Approved"} onClick={() => approveStep(step.id)}>
                    <CheckCircle2 size={15} /> Approve
                  </button>
                  <button type="button" disabled={!canAct || step.status === "Approved"} onClick={() => requestChanges(step.id)}>
                    <CircleDashed size={15} /> Request changes
                  </button>
                </footer>
              </article>
            );
          })}
        </div>

        <aside className="adminTracker">
          <div className="trackerHeader">
            <ShieldCheck size={18} />
            <div><strong>Admin Flow Tracker</strong><span>{currentGate ? `Current: ${currentGate.owner} - ${currentGate.gate}` : "Ready for export"}</span></div>
          </div>
          <div className="trackerStats">
            <div><span>Approved</span><strong>{adminSummary.approved}</strong></div>
            <div><span>Waiting</span><strong>{adminSummary.waiting}</strong></div>
            <div><span>Blocked</span><strong>{adminSummary.blocked}</strong></div>
          </div>
          <progress max={100} value={completion} />
          <div className="flowEvents">
            {events.map((event) => <p key={event}>{event}</p>)}
          </div>
        </aside>
      </div>
    </section>
  );
}

function initialSteps(run: BidForgeRun): FlowStep[] {
  return [
    { id: "intake", title: "Upload and configure RFP", owner: "Bid Manager", status: "Approved", artifact: `${run.upload.file} normalized with ${run.requirements} extracted requirements.`, gate: "Intake complete" },
    { id: "legal", title: "Legal compliance review", owner: "Legal", status: "Active", artifact: "EU data residency, contractual terms, and legal assumptions.", gate: "Legal approval" },
    { id: "finance", title: "Commercial and pricing review", owner: "Finance", status: "Waiting", artifact: "SLA penalties, fixed-price assumptions, and estimated bid economics.", gate: "Pricing approval" },
    { id: "security", title: "Security evidence review", owner: "Security", status: "Waiting", artifact: "Incident response control evidence and citation support.", gate: "Security approval" },
    { id: "delivery", title: "Delivery feasibility review", owner: "Delivery", status: "Waiting", artifact: "Transition plan, staffing model, and dependency assumptions.", gate: "Delivery approval" },
    { id: "export", title: "Final export authorization", owner: "Bid Manager", status: "Waiting", artifact: "Proposal draft, win brief, ROI, benchmark, and audit package.", gate: "Final export" },
  ];
}

function advanceStep(steps: FlowStep[], stepId: string): FlowStep[] {
  let approvedIndex = -1;
  const approved = steps.map((step, index) => {
    if (step.id === stepId) {
      approvedIndex = index;
      return { ...step, status: "Approved" as FlowStatus };
    }
    return step;
  });
  const nextIndex = approved.findIndex((step, index) => index > approvedIndex && step.status !== "Approved");
  if (nextIndex === -1) {
    return approved;
  }
  return approved.map((step, index) => index === nextIndex ? { ...step, status: "Active" } : step);
}
