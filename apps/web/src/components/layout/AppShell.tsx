import { Activity, AlarmClock, AlertTriangle, Archive, BarChart3, Bell, Bot, BrainCircuit, BriefcaseBusiness, Calculator, CheckCircle2, Database, FileCheck2, FileText, Gavel, LayoutDashboard, Link2, MessageSquareText, Search, Settings, ShieldCheck, Swords, Target, UploadCloud, UserCircle, UsersRound, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { BidForgeRun, CommandView, NavItem } from "../../types/bidforge";

const navItems: NavItem[] = [
  { label: "Upload", icon: UploadCloud, view: "upload" },
  { label: "Run Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { label: "Compliance Matrix", icon: FileCheck2, view: "matrix" },
  { label: "Proposal Draft", icon: FileText, view: "proposal" },
  { label: "Knowledge Base", icon: Database, view: "knowledge" },
  { label: "Collaboration Inbox", icon: MessageSquareText, view: "inbox" },
  { label: "Risk Register", icon: AlertTriangle, view: "risks" },
  { label: "SME Tasks", icon: UsersRound, view: "tasks" },
  { label: "Judge Report", icon: Gavel, view: "judge" },
  { label: "Win Brief", icon: BriefcaseBusiness, view: "brief" },
  { label: "Win Strategy", icon: Target, view: "strategy" },
  { label: "Competitive Lab", icon: Swords, view: "competitive" },
  { label: "Export Pack", icon: Archive, view: "package" },
  { label: "Admin Analytics", icon: Activity, view: "analytics" },
  { label: "SLA Forecast", icon: AlarmClock, view: "sla" },
  { label: "ROI Simulator", icon: Calculator, view: "roi" },
  { label: "Benchmark", icon: BarChart3, view: "benchmark" },
  { label: "Role Flow", icon: Activity, view: "flow" },
  { label: "Governance", icon: ShieldCheck, view: "governance" },
  { label: "AI Governance", icon: BrainCircuit, view: "ai-governance" },
  { label: "Integrations", icon: Link2, view: "integrations" },
  { label: "Automation", icon: Bot, view: "automation" }
];

const mobileNavItems = [
  { label: "Dash", icon: LayoutDashboard, view: "dashboard" as const, activeViews: ["dashboard", "roi", "analytics", "sla"] },
  { label: "Monitor", icon: BarChart3, view: "matrix" as const, activeViews: ["matrix", "inbox", "risks", "tasks", "judge", "benchmark"] },
  { label: "Brief", icon: BriefcaseBusiness, view: "brief" as const, activeViews: ["brief", "proposal", "knowledge", "strategy", "competitive", "package"] },
  { label: "Config", icon: Settings, view: "upload" as const, activeViews: ["upload", "automation", "governance", "ai-governance", "flow", "integrations"] }
];

export function AppShell({
  run,
  activeView,
  onNavigate,
  searchQuery,
  onSearchChange,
  commandMessage,
  onClearCommand,
  children
}: {
  run: BidForgeRun;
  activeView: CommandView;
  onNavigate: (view: CommandView) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  commandMessage?: string;
  onClearCommand: () => void;
  children: ReactNode;
}) {
  const [openPopover, setOpenPopover] = useState<"notifications" | "settings" | "profile" | null>(null);
  const navRefs = useRef<Partial<Record<CommandView, HTMLAnchorElement>>>({});
  const togglePopover = (popover: "notifications" | "settings" | "profile") => {
    setOpenPopover((current) => current === popover ? null : popover);
  };

  useEffect(() => {
    navRefs.current[activeView]?.scrollIntoView({ block: "nearest" });
  }, [activeView]);

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand"><strong>BidForge Agent</strong><span>Enterprise Request for Proposal</span></div>
        <nav className="navList" aria-label="Primary">
          {navItems.map(({ label, icon: Icon, view }) => (
            <a
              aria-current={activeView === view ? "page" : undefined}
              className={activeView === view ? "navItem active" : "navItem"}
              href={shareLinkFor(view)}
              key={view}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(view);
              }}
              ref={(element) => {
                if (element) {
                  navRefs.current[view] = element;
                }
              }}
            >
              <Icon size={18} /><span>{label}</span>
            </a>
          ))}
        </nav>
        <button className="roleCard" type="button" onClick={() => togglePopover("profile")}>
          <div className="avatar">JD</div>
          <div><strong>Senior Bid Mgr</strong><span>RBAC: bid manager</span></div>
        </button>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobileBrandBar">
            <div><Wrench size={22} /><strong>BidForge Agent</strong></div>
            <button aria-label="Account" onClick={() => togglePopover("profile")}><UserCircle size={24} /></button>
          </div>
          <div className="runIdentity"><strong>Request for Proposal · {run.runId}</strong><span>{run.status}</span><span>Due in {run.deadline}</span><span>Score {run.qualityScore}</span><span>{run.tokenCost}</span></div>
          <div className="topActions">
            <label className="searchBox">
              <Search size={16} />
              <input
                placeholder="Search requirements, risks, owners"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              {searchQuery ? <button aria-label="Clear search" className="clearSearch" type="button" onClick={() => onSearchChange("")}><X size={14} /></button> : null}
            </label>
            <button aria-expanded={openPopover === "notifications"} aria-label="Notifications" onClick={() => togglePopover("notifications")}><Bell size={18} /></button>
            <button aria-expanded={openPopover === "settings"} aria-label="Settings" onClick={() => togglePopover("settings")}><Settings size={18} /></button>
          </div>
        </header>
        {openPopover ? (
          <aside className="topPopover" aria-live="polite">
            <button className="popoverClose" type="button" aria-label="Close panel" onClick={() => setOpenPopover(null)}><X size={16} /></button>
            {openPopover === "notifications" ? (
              <div><h3>Notifications</h3><p>{run.risks} risks need review before export.</p><p>{run.automation.status} automation refreshes every {run.automation.frequencyMinutes} minutes.</p></div>
            ) : null}
            {openPopover === "settings" ? (
              <div><h3>Run Settings</h3><p>Mode: {run.mode}</p><p>Knowledge base: {run.upload.knowledgeBase}</p><p>Guardrails: {run.automation.guarded ? "Enabled" : "Disabled"}</p></div>
            ) : null}
            {openPopover === "profile" ? (
              <div><h3>Senior Bid Mgr</h3><p>Role: bid manager</p><p>Access: Upload, automation, governance, export actions.</p><p>Owner: {run.automation.owner}</p></div>
            ) : null}
          </aside>
        ) : null}
        {commandMessage ? (
          <div className="commandToast" role="status">
            <CheckCircle2 size={16} /><span>{commandMessage}</span><button type="button" aria-label="Dismiss command" onClick={onClearCommand}><X size={14} /></button>
          </div>
        ) : null}
        <section className="approvalBanner">
          <div><AlertTriangle size={18} /><strong>{run.risks} risks need review</strong><span>Human approval required before final export.</span></div>
          <button onClick={() => onNavigate("risks")}>Review now</button>
        </section>
        <main className="content">{children}</main>
        <nav className="mobileNav" aria-label="Mobile primary">
          {mobileNavItems.map(({ label, icon: Icon, view, activeViews }) => (
            <a
              aria-current={activeViews.includes(activeView) ? "page" : undefined}
              className={activeViews.includes(activeView) ? "mobileNavItem active" : "mobileNavItem"}
              href={shareLinkFor(view)}
              key={label}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(view);
              }}
            >
              <Icon size={20} /><span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function shareLinkFor(view: CommandView) {
  return `${window.location.pathname}?view=${view}`;
}
