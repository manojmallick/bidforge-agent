import { useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import type { BidRunDraft } from "../../lib/api";
import { Badge } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

type UploadConfigureRunProps = {
  run: BidForgeRun;
  onCreateRun: (draft: BidRunDraft) => void | Promise<void>;
};

export function UploadConfigureRun({ run, onCreateRun }: UploadConfigureRunProps) {
  const [fileName, setFileName] = useState(run.upload.file);
  const [rfpText, setRfpText] = useState(sampleRfpText(run));

  return (
    <section className="panel" id="upload">
      <PanelTitle
        icon={<UploadCloud size={18} />}
        title="Upload & Configure Run"
        action="Run balanced review"
        onAction={() => onCreateRun({ fileName, rfpText })}
      />
      <div className="uploadZone">
        <UploadCloud size={24} />
        <div>
          <strong>{fileName}</strong>
          <span>{run.upload.size} · {run.upload.knowledgeBase}</span>
        </div>
        <Badge tone={run.upload.warning.includes("No prompt") ? "success" : "warning"}>{run.upload.warning}</Badge>
      </div>
      <label className="filePicker">
        <FileText size={16} />
        <span>{fileName}</span>
        <input
          accept=".txt,.md,.text"
          type="file"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            setFileName(file.name);
            setRfpText(await file.text());
          }}
        />
      </label>
      <label className="rfpTextInput">
        <span>RFP text</span>
        <textarea value={rfpText} onChange={(event) => setRfpText(event.target.value)} />
      </label>
      <div className="configRow">
        <SelectLike label="Buyer" value={run.buyer} />
        <SelectLike label="Knowledge base" value={run.upload.knowledgeBase} />
        <SelectLike label="Run mode" value={run.upload.selectedMode} />
        <SelectLike label="Estimate" value={`${run.upload.estimatedCost} / ${run.upload.estimatedTime}`} />
      </div>
    </section>
  );
}

function SelectLike({ label, value }: { label: string; value: string }) {
  return (
    <label className="selectLike">
      <span>{label}</span>
      <strong>{value}</strong>
    </label>
  );
}

function sampleRfpText(run: BidForgeRun) {
  return [
    `Buyer: ${run.buyer}`,
    `Project: ${run.project}`,
    "Vendor must provide 24x7 L1/L2/L3 support.",
    "Supplier shall comply with EU data residency.",
    "Provider must include security incident response process."
  ].join("\n");
}
