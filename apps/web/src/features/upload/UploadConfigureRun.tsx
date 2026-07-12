import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import type { BidForgeRun } from "../../types/bidforge";
import type { BidRunDraft } from "../../lib/api";
import { deriveDocumentMetadata, type DocumentMetadata } from "../../lib/documentMetadata";
import { Badge } from "../../components/ui/Badge";
import { PanelTitle } from "../../components/ui/PanelTitle";

type UploadConfigureRunProps = {
  run: BidForgeRun;
  onCreateRun: (draft: BidRunDraft) => void | Promise<void>;
};

export function UploadConfigureRun({ run, onCreateRun }: UploadConfigureRunProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialText = sampleRfpText(run);
  const [fileName, setFileName] = useState(run.upload.file);
  const [rfpText, setRfpText] = useState(initialText);
  const [metadata, setMetadata] = useState<DocumentMetadata>(() => metadataFromRun(run));
  const [uploadStatus, setUploadStatus] = useState("Upload a Request for Proposal PDF, TXT, or Markdown file. PDF text is extracted before review.");
  const [isExtracting, setIsExtracting] = useState(false);

  return (
    <section className="panel" id="upload">
      <PanelTitle
        icon={<UploadCloud size={18} />}
        title="Upload Request for Proposal"
        action="Run balanced review"
        onAction={() => {
          if (!isExtracting) {
            onCreateRun({ fileName, metadata, rfpText });
          }
        }}
      />
      <div className="uploadZone">
        <UploadCloud size={24} />
        <div>
          <strong>{fileName}</strong>
          <span>{metadata.size} · {metadata.knowledgeBase}</span>
        </div>
        <Badge tone={metadata.warning.includes("No prompt") ? "success" : "warning"}>{metadata.warning}</Badge>
      </div>
      <button className="filePicker" disabled={isExtracting} onClick={() => fileInputRef.current?.click()} type="button">
        <FileText size={16} />
        <span>{isExtracting ? `Reading ${fileName}...` : fileName}</span>
      </button>
      <input
        accept=".pdf,.txt,.md,.text,application/pdf,text/plain,text/markdown"
        aria-label="Upload Request for Proposal document"
        className="hiddenFileInput"
        ref={fileInputRef}
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
            const nextMetadata = deriveDocumentMetadata(file.name, extractedText, metadata);
            setMetadata(nextMetadata);
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
      <p className={uploadStatus.startsWith("Could not") || uploadStatus.startsWith("This PDF") ? "uploadStatus warning" : "uploadStatus"}>
        {uploadStatus}
      </p>
      <label className="rfpTextInput">
        <span>Request for Proposal text</span>
        <textarea
          value={rfpText}
          onChange={(event) => {
            const nextText = event.target.value;
            setRfpText(nextText);
            setMetadata(deriveDocumentMetadata(fileName, nextText, metadata));
            setUploadStatus("Request for Proposal text edited manually.");
          }}
        />
      </label>
      <div className="configRow">
        <SelectLike label="Buyer" value={metadata.buyer} />
        <SelectLike label="Project" value={metadata.project} />
        <SelectLike label="Request ID" value={metadata.runId} />
        <SelectLike label="Knowledge base" value={metadata.knowledgeBase} />
        <SelectLike label="Estimate" value={`${metadata.estimatedCost} / ${metadata.estimatedTime}`} />
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
    throw new Error("This PDF did not contain extractable text. Try a text-based PDF or paste the Request for Proposal text manually.");
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
