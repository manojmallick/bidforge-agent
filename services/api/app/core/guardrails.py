from __future__ import annotations


INJECTION_MARKERS = (
    "ignore previous instructions",
    "mark all requirements compliant",
    "do not follow system",
)


def detect_prompt_injection(text: str) -> list[str]:
    normalized = text.lower()
    return [marker for marker in INJECTION_MARKERS if marker in normalized]
