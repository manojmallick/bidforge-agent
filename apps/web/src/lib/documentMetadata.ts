export type DocumentMetadata = {
  buyer: string;
  project: string;
  runId: string;
  deadline: string;
  knowledgeBase: string;
  estimatedCost: string;
  estimatedTime: string;
  size: string;
  warning: string;
};

const DEFAULT_METADATA: DocumentMetadata = {
  buyer: "Apex Global Bank",
  project: "Managed cloud migration and application modernization",
  runId: "RFP-742-B",
  deadline: "14 days",
  knowledgeBase: "Demo proposal bank",
  estimatedCost: "$10-$14",
  estimatedTime: "3-5 min",
  size: "Uploaded document",
  warning: "No prompt-injection pattern detected"
};

export function deriveDocumentMetadata(fileName: string, text: string, fallback: Partial<DocumentMetadata> = {}): DocumentMetadata {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const titleLine = firstTitleLine(text);
  const buyer = cleanValue(
    matchText(text, /Buyer:\s*([^\n|]+)/i) ??
    matchText(titleLine, /^(.+?)\s+Request for Proposal:/i) ??
    fallback.buyer ??
    DEFAULT_METADATA.buyer
  );
  const project = cleanValue(
    matchText(titleLine, /Request for Proposal:\s*(.+?)(?:\s+RFP ID:|\s+\|\s+Issue date:|$)/i) ??
    matchText(text, /Project:\s*([^\n|]+)/i) ??
    fallback.project ??
    DEFAULT_METADATA.project
  );
  const runId = cleanValue(
    matchText(normalizedText, /RFP ID:\s*([A-Z0-9-]+)/i) ??
    matchText(normalizedText, /Request for Proposal ID:\s*([A-Z0-9-]+)/i) ??
    fallback.runId ??
    fileName.replace(/\.[^.]+$/, "").replace(/[^A-Z0-9]+/gi, "-").replace(/^-|-$/g, "").toUpperCase()
  );
  const deadline = deadlineFromText(normalizedText) ?? fallback.deadline ?? DEFAULT_METADATA.deadline;
  const words = text.split(/\s+/).filter(Boolean).length;
  const pageCount = pageCountFromText(text);
  const lowerText = normalizedText.toLowerCase();

  return {
    buyer,
    project,
    runId,
    deadline,
    knowledgeBase: knowledgeBaseForDocument(`${buyer} ${project} ${normalizedText}`) ?? fallback.knowledgeBase ?? DEFAULT_METADATA.knowledgeBase,
    estimatedCost: estimateCost(words),
    estimatedTime: estimateTime(words),
    size: text ? `${pageCount} page${pageCount === 1 ? "" : "s"} text extract` : fallback.size ?? DEFAULT_METADATA.size,
    warning: lowerText.includes("ignore previous instructions")
      ? "Prompt-injection pattern quarantined as document content"
      : fallback.warning ?? DEFAULT_METADATA.warning
  };
}

function firstTitleLine(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim().replace(/^Page\s+\d+\s+/i, ""))
    .find((line) => /Request for Proposal:/i.test(line)) ?? text.replace(/\s+/g, " ").trim();
}

function matchText(value: string, pattern: RegExp) {
  return pattern.exec(value)?.[1];
}

function cleanValue(value: string) {
  return value
    .replace(/^Page\s+\d+\s+/i, "")
    .replace(/\s+/g, " ")
    .replace(/\s+RFP ID:.*$/i, "")
    .trim();
}

function deadlineFromText(text: string) {
  const calendarDays = /Response due:\s*(\d+)\s+calendar\s+days/i.exec(text)?.[1];
  if (calendarDays) {
    return `${calendarDays} days`;
  }
  return matchText(text, /Response due:\s*([^.|]+?)(?:\s+\d+\.|$)/i)?.trim();
}

function pageCountFromText(text: string) {
  const matches = Array.from(text.matchAll(/Page\s+(\d+)/gi), (match) => Number(match[1]));
  const maxPage = Math.max(0, ...matches.filter(Number.isFinite));
  if (maxPage > 0) {
    return maxPage;
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 350));
}

function knowledgeBaseForDocument(value: string) {
  const lowerValue = value.toLowerCase();
  if (lowerValue.includes("bank") || lowerValue.includes("banking")) {
    return "Banking cloud migration evidence";
  }
  if (lowerValue.includes("retail")) {
    return "Retail transformation evidence";
  }
  if (lowerValue.includes("insurance")) {
    return "Insurance delivery evidence";
  }
  if (lowerValue.includes("security") || lowerValue.includes("iso")) {
    return "Security and compliance evidence";
  }
  return undefined;
}

function estimateCost(words: number) {
  if (words > 4000) {
    return "$14-$20";
  }
  if (words > 1200) {
    return "$10-$15";
  }
  return "$7-$11";
}

function estimateTime(words: number) {
  if (words > 4000) {
    return "5-8 min";
  }
  if (words > 1200) {
    return "3-5 min";
  }
  return "2-4 min";
}
