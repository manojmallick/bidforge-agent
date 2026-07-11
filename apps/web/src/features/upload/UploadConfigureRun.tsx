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
  const [uploadStatus, setUploadStatus] = useState("Upload .pdf, .txt, or .md files. PDF text is extracted before review.");
  const [isExtracting, setIsExtracting] = useState(false);

  return (
    <section className="panel" id="upload">
      <PanelTitle
        icon={<UploadCloud size={18} />}
        title="Upload & Configure Run"
        action="Run balanced review"
        onAction={() => {
          if (!isExtracting) {
            onCreateRun({ fileName, rfpText });
          }
        }}
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
          accept=".pdf,.txt,.md,.text,application/pdf,text/plain,text/markdown"
          type="file"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            setFileName(file.name);
            setIsExtracting(true);
            setUploadStatus(`Reading ${file.name}...`);
            try {
              const extractedText = await extractDocumentText(file);
              setRfpText(extractedText);
              setUploadStatus(uploadSuccessMessage(file, extractedText));
            } catch (error) {
              setRfpText("");
              setUploadStatus(error instanceof Error ? error.message : "Could not read this document.");
            } finally {
              setIsExtracting(false);
              event.target.value = "";
            }
          }}
        />
      </label>
      <p className={uploadStatus.startsWith("Could not") || uploadStatus.startsWith("This PDF") ? "uploadStatus warning" : "uploadStatus"}>
        {uploadStatus}
      </p>
      <label className="rfpTextInput">
        <span>RFP text</span>
        <textarea
          value={rfpText}
          onChange={(event) => {
            setRfpText(event.target.value);
            setUploadStatus("RFP text edited manually.");
          }}
        />
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

async function extractDocumentText(file: File) {
  if (isPdf(file)) {
    return extractPdfText(file);
  }
  return file.text();
}

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

async function extractPdfText(file: File) {
  const [pdfjsLib, worker] = await Promise.all([
    import("pdfjs-dist"),
    import("pdfjs-dist/build/pdf.worker.mjs?url")
  ]);

  pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      pages.push(`Page ${pageNumber}\n${pageText}`);
    }
  }

  const text = pages.join("\n\n").trim();
  if (!text) {
    throw new Error("This PDF did not contain extractable text. Try a text-based PDF or paste the RFP text manually.");
  }
  return text;
}

function uploadSuccessMessage(file: File, extractedText: string) {
  const words = extractedText.split(/\s+/).filter(Boolean).length;
  if (isPdf(file)) {
    return `PDF extracted successfully: ${words.toLocaleString()} words ready for balanced review.`;
  }
  return `Document loaded successfully: ${words.toLocaleString()} words ready for balanced review.`;
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
