import { CheckCircle2, Clock3, MessageSquareText, Send, ShieldAlert, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "../../components/ui/Badge";
import { Metric } from "../../components/ui/Metric";
import { PanelTitle } from "../../components/ui/PanelTitle";
import type { BidForgeRun, RiskSeverity } from "../../types/bidforge";

type InboxStatus = "Open" | "Waiting" | "Answered" | "Approved";
type InboxPriority = RiskSeverity | "Normal";
type OwnerFilter = "All" | string;

export type CollaborationInboxPayload = {
  runId: string;
  generatedAt: string;
  selectedOwner: string;
  threads: InboxThread[];
};

type InboxThread = {
  id: string;
  owner: string;
  title: string;
  artifact: string;
  status: InboxStatus;
  priority: InboxPriority;
  due: string;
  lastMessage: string;
  comments: string[];
};

export function CollaborationInbox({ run, onExport }: { run: BidForgeRun; onExport: (payload: CollaborationInboxPayload) => void }) {
  const initialThreads = useMemo(() => buildInboxThreads(run), [run]);
  const [threads, setThreads] = useState(initialThreads);
  const [selectedOwner, setSelectedOwner] = useState<OwnerFilter>("All");
  const [draftComment, setDraftComment] = useState("Looks good. Please attach evidence before final export.");
  const owners = ["All", ...Array.from(new Set(threads.map((thread) => thread.owner)))];
  const visibleThreads = selectedOwner === "All" ? threads : threads.filter((thread) => thread.owner === selectedOwner);
  const payload: CollaborationInboxPayload = {
    runId: run.runId,
    generatedAt: new Date().toISOString(),
    selectedOwner,
    threads
  };

  const updateThread = (id: string, patch: Partial<InboxThread>) => {
    setThreads((current) => current.map((thread) => thread.id === id ? { ...thread, ...patch } : thread));
  };

  const addComment = (id: string) => {
    const trimmed = draftComment.trim();
    if (!trimmed) {
      return;
    }
    setThreads((current) => current.map((thread) => thread.id === id ? {
      ...thread,
      comments: [trimmed, ...thread.comments].slice(0, 4),
      lastMessage: trimmed,
      status: thread.status === "Open" ? "Waiting" : thread.status
    } : thread));
    setDraftComment("");
  };

  return (
    <section className="panel inboxPanel" id="inbox">
      <PanelTitle icon={<MessageSquareText size={18} />} title="Collaboration Inbox" action="Export inbox" onAction={() => onExport(payload)} />

      <div className="inboxHero">
        <div>
          <p className="eyebrow">Role handoffs and decisions</p>
          <h2>Route comments, approvals, and SLA-sensitive decisions by owner</h2>
          <p>Each reviewer sees their action queue, latest message, status, due pressure, and artifact context before the final export gate.</p>
        </div>
        <div className="inboxScore">
          <UserCheck size={22} />
          <strong>{threads.filter((thread) => thread.status === "Approved").length}/{threads.length}</strong>
          <span>approved threads</span>
        </div>
      </div>

      <div className="metricGrid inboxMetrics">
        <Metric tone="warning" label="Open decisions" value={String(threads.filter((thread) => thread.status === "Open" || thread.status === "Waiting").length)} detail="Require owner action" />
        <Metric tone="clear" label="Answered" value={String(threads.filter((thread) => thread.status === "Answered").length)} detail="Ready for bid manager review" />
        <Metric tone="hold" label="Critical / high" value={String(threads.filter((thread) => thread.priority === "Critical" || thread.priority === "High").length)} detail="SLA pressure threads" />
        <Metric tone="neutral" label="Owners" value={String(owners.length - 1)} detail="Reviewer groups involved" />
      </div>

      <div className="inboxFilters" aria-label="Owner filters">
        {owners.map((owner) => (
          <button className={selectedOwner === owner ? "active" : ""} key={owner} type="button" onClick={() => setSelectedOwner(owner)}>
            {owner}
          </button>
        ))}
      </div>

      <div className="inboxGrid">
        <div className="threadList">
          {visibleThreads.map((thread) => (
            <article className="threadCard" key={thread.id}>
              <header>
                <div>
                  <strong>{thread.title}</strong>
                  <span>{thread.artifact}</span>
                </div>
                <Badge tone={toneForStatus(thread.status)}>{thread.status}</Badge>
              </header>
              <div className="threadMeta">
                <Badge tone={toneForPriority(thread.priority)}>{thread.priority}</Badge>
                <span><Clock3 size={14} /> {thread.due}</span>
                <span><UserCheck size={14} /> {thread.owner}</span>
              </div>
              <p>{thread.lastMessage}</p>
              <div className="threadComments">
                {thread.comments.map((comment) => <small key={comment}>{comment}</small>)}
              </div>
              <footer>
                <button type="button" onClick={() => updateThread(thread.id, { status: "Answered", lastMessage: `${thread.owner} answered with evidence attached.` })}>
                  <MessageSquareText size={15} /> Answer
                </button>
                <button type="button" onClick={() => updateThread(thread.id, { status: "Approved", lastMessage: `${thread.owner} approved this handoff.` })}>
                  <CheckCircle2 size={15} /> Approve
                </button>
                <button type="button" onClick={() => addComment(thread.id)}>
                  <Send size={15} /> Comment
                </button>
              </footer>
            </article>
          ))}
        </div>

        <aside className="inboxComposer">
          <div className="blockHeading"><ShieldAlert size={18} /><h3>Decision Note</h3></div>
          <label>
            <span>Reusable comment</span>
            <textarea value={draftComment} onChange={(event) => setDraftComment(event.target.value)} />
          </label>
          <div className="inboxSla">
            <h3>SLA Watch</h3>
            {threads.filter((thread) => thread.priority === "Critical" || thread.priority === "High").slice(0, 4).map((thread) => (
              <p key={thread.id}><strong>{thread.owner}</strong> {thread.title} · {thread.due}</p>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function buildInboxThreads(run: BidForgeRun): InboxThread[] {
  const riskThreads = run.riskRegister.map((risk) => ({
    id: `inbox-${risk.id}`,
    owner: risk.owner,
    title: risk.title,
    artifact: `${risk.id} · ${risk.category} risk`,
    status: risk.approval === "Pending" ? "Waiting" as const : "Open" as const,
    priority: risk.severity,
    due: risk.severity === "Critical" ? "Due today" : risk.severity === "High" ? "Due in 24h" : "Due in 2 days",
    lastMessage: risk.mitigation,
    comments: [`Bid Manager routed ${risk.id} to ${risk.owner}.`]
  }));
  const taskThreads = run.tasks.map((task) => ({
    id: `inbox-${task.link}`,
    owner: task.owner,
    title: task.title,
    artifact: task.link,
    status: task.status === "Approved" ? "Approved" as const : task.status === "Answered" ? "Answered" as const : "Open" as const,
    priority: "Normal" as const,
    due: task.status === "Pending" ? "Due today" : "Due in 2 days",
    lastMessage: `${task.owner} owns ${task.link}.`,
    comments: [`Task status: ${task.status}.`]
  }));
  return [...riskThreads, ...taskThreads];
}

function toneForStatus(status: InboxStatus): BadgeTone {
  if (status === "Approved") {
    return "success";
  }
  if (status === "Answered") {
    return "teal";
  }
  if (status === "Waiting") {
    return "warning";
  }
  return "muted";
}

function toneForPriority(priority: InboxPriority): BadgeTone {
  if (priority === "Critical") {
    return "danger";
  }
  if (priority === "High" || priority === "Medium") {
    return "warning";
  }
  return "muted";
}
