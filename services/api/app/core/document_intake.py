from __future__ import annotations

from dataclasses import dataclass

from app.models.schemas import Requirement


REQUIREMENT_MARKERS = ("must", "shall", "required", "requires", "provide", "comply", "support")
INJECTION_MARKERS = ("ignore previous", "ignore all previous", "system prompt", "developer message", "reveal instructions")


@dataclass(frozen=True)
class ParsedDocument:
    buyer: str
    project: str
    sourceFile: str
    sizeLabel: str
    requirementCount: int
    warning: str
    requirements: list[Requirement]


def parse_rfp_document(rfp_text: str, source_file: str = "Uploaded RFP") -> ParsedDocument:
    text = rfp_text.strip()
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    buyer = _field_value(lines, "buyer") or _field_value(lines, "client") or "Uploaded buyer"
    project = _field_value(lines, "project") or _field_value(lines, "scope") or _first_title(lines) or "Uploaded RFP analysis"
    requirement_count = _requirement_count(lines)
    requirements = _requirements(lines)
    warning = _warning(text)
    return ParsedDocument(
        buyer=buyer,
        project=project,
        sourceFile=source_file or "Uploaded RFP",
        sizeLabel=_size_label(text, lines),
        requirementCount=requirement_count,
        warning=warning,
        requirements=requirements,
    )


def _field_value(lines: list[str], field: str) -> str:
    prefix = f"{field}:"
    for line in lines:
        if line.lower().startswith(prefix):
            return line.split(":", 1)[1].strip()
    return ""


def _first_title(lines: list[str]) -> str:
    if not lines:
        return ""
    first_line = lines[0]
    if ":" in first_line and len(first_line.split(":", 1)[1].strip()) > 0:
        return first_line.split(":", 1)[1].strip()
    return first_line[:96]


def _requirement_count(lines: list[str]) -> int:
    return max(1, len(_requirement_lines(lines)))


def _requirements(lines: list[str]) -> list[Requirement]:
    requirement_lines = _requirement_lines(lines)
    if not requirement_lines:
        requirement_lines = [_first_title(lines) or "Uploaded RFP requires human review."]
    return [
        Requirement(
            id=f"U-{index:03d}",
            category=_category_for(line),
            priority="Mandatory" if _is_mandatory(line) else "Preferred",
            text=_clean_requirement_text(line),
            status=_status_for(line),
            evidence="Uploaded RFP text",
            owner=_owner_for(line),
            confidence=_confidence_for(line),
        )
        for index, line in enumerate(requirement_lines[:12], start=1)
    ]


def _requirement_lines(lines: list[str]) -> list[str]:
    return [
        line
        for line in lines
        if not line.lower().startswith(("buyer:", "client:", "project:", "scope:"))
        and any(marker in line.lower() for marker in REQUIREMENT_MARKERS)
    ]


def _category_for(line: str) -> str:
    lowered = line.lower()
    if any(word in lowered for word in ("security", "incident", "iso", "access")):
        return "Security"
    if any(word in lowered for word in ("data", "residency", "comply", "legal", "regulation")):
        return "Compliance"
    if any(word in lowered for word in ("support", "sla", "24x7", "service")):
        return "Support"
    if any(word in lowered for word in ("price", "commercial", "cost", "penalty")):
        return "Commercial"
    return "Delivery"


def _owner_for(line: str) -> str:
    category = _category_for(line)
    return {
        "Security": "Security",
        "Compliance": "Legal",
        "Support": "Delivery",
        "Commercial": "Finance",
        "Delivery": "Solution Architect",
    }[category]


def _status_for(line: str) -> str:
    lowered = line.lower()
    if any(word in lowered for word in ("legal", "residency", "penalty", "price", "commercial")):
        return "Needs SME"
    if any(word in lowered for word in ("tbd", "unknown", "unsupported")):
        return "Gap"
    return "Pending"


def _confidence_for(line: str) -> str:
    return "72%" if _status_for(line) == "Needs SME" else "81%"


def _is_mandatory(line: str) -> bool:
    lowered = line.lower()
    return any(word in lowered for word in ("must", "shall", "required", "requires", "comply"))


def _clean_requirement_text(line: str) -> str:
    stripped = line.strip("-•* 0123456789.")
    return stripped or line


def _size_label(text: str, lines: list[str]) -> str:
    if not text:
        return "Demo text"
    return f"{len(lines)} lines / {len(text.split())} words"


def _warning(text: str) -> str:
    lowered = text.lower()
    if any(marker in lowered for marker in INJECTION_MARKERS):
        return "1 prompt-injection pattern quarantined as document content"
    return "No prompt-injection patterns detected"
