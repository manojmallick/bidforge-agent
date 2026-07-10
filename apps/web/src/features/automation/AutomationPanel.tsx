import { useEffect, useState } from "react";
import { Bot, Pause, Play, Save, ShieldCheck } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import { Badge } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

type AutomationPanelProps = {
  run: BidForgeRun;
  onRunNow: () => void | Promise<void>;
  onToggleStatus: () => void | Promise<void>;
  onSaveFrequency: (frequencyMinutes: number) => void | Promise<void>;
};

export function AutomationPanel({ run, onRunNow, onToggleStatus, onSaveFrequency }: AutomationPanelProps) {
  const automation = run.automation;
  const [draftFrequency, setDraftFrequency] = useState(automation.frequencyMinutes);

  useEffect(() => {
    setDraftFrequency(automation.frequencyMinutes);
  }, [automation.frequencyMinutes]);

  const frequencyChanged = draftFrequency !== automation.frequencyMinutes;

  return (
    <section className="panel" id="automation">
      <PanelTitle icon={<Bot size={18} />} title="Automation" action="Run now" onAction={onRunNow} />
      <div className="automationSummary">
        <div>
          <strong>{automation.name}</strong>
          <span>{automation.trigger}</span>
        </div>
        <Badge tone={automation.status === "Active" ? "success" : "muted"}>{automation.status}</Badge>
      </div>
      <div className="automationControls" aria-label="Automation controls">
        <label className="frequencyControl">
          <span>Frequency</span>
          <input
            min={1}
            type="number"
            value={draftFrequency}
            onChange={(event) => setDraftFrequency(Number(event.target.value))}
          />
          <small>minutes</small>
        </label>
        <button
          className="iconAction"
          type="button"
          onClick={() => onSaveFrequency(Math.max(1, draftFrequency || 1))}
          disabled={!frequencyChanged}
          aria-label="Save automation frequency"
          title="Save automation frequency"
        >
          <Save size={16} />
        </button>
        <button
          className="iconAction"
          type="button"
          onClick={onToggleStatus}
          aria-label={automation.status === "Active" ? "Pause automation" : "Resume automation"}
          title={automation.status === "Active" ? "Pause automation" : "Resume automation"}
        >
          {automation.status === "Active" ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
      <div className="automationGrid">
        <AutomationFact label="Frequency" value={`${automation.frequencyMinutes} minutes`} />
        <AutomationFact label="Next run" value={automation.nextRunIn} />
        <AutomationFact label="Next run at" value={automation.nextRunAt || "Not scheduled"} />
        <AutomationFact label="Last run" value={automation.lastRunAt} />
        <AutomationFact label="Mode" value={automation.runMode} />
      </div>
      <div className="automationGuard">
        <ShieldCheck size={16} />
        <span>{automation.guarded ? "Prompt-injection quarantine and human approval gates remain active." : "Guardrails disabled."}</span>
      </div>
      <div className="automationHistory">
        {run.automationHistory.slice(0, 3).map((record) => (
          <article className="automationRun" key={record.id}>
            <div>
              <strong>{record.status}</strong>
              <span>{record.startedAt}</span>
            </div>
            <p>{record.summary}</p>
            <small>{record.changedArtifacts.join(", ")}</small>
          </article>
        ))}
      </div>
      <div className="auditTrail">
        {run.auditTrail.slice(0, 3).map((event) => (
          <article className="auditEvent" key={event.id}>
            <div>
              <strong>{event.action}</strong>
              <span>{event.timestamp}</span>
            </div>
            <p>{event.detail}</p>
            <small>{event.actor} · {event.outcome}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function AutomationFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="automationFact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
