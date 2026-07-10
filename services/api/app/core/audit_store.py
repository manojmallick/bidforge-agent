from __future__ import annotations

import json
import os
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from app.data.demo_run import get_demo_run
from app.models.schemas import AuditEvent


DEFAULT_AUDIT_PATH = Path(__file__).resolve().parents[1] / "state" / "audit_events.json"
MAX_AUDIT_EVENTS = 25


def get_audit_path() -> Path:
    configured_path = os.environ.get("BIDFORGE_AUDIT_STATE_PATH")
    return Path(configured_path) if configured_path else DEFAULT_AUDIT_PATH


def load_audit_events() -> list[AuditEvent]:
    audit_path = get_audit_path()
    if not audit_path.exists():
        return get_demo_run().auditTrail

    payload = json.loads(audit_path.read_text(encoding="utf-8"))
    return [AuditEvent(**event) for event in payload.get("events", [])]


def record_audit_event(actor: str, action: str, target: str, outcome: str, detail: str) -> AuditEvent:
    event = AuditEvent(
        id=f"audit-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}-{uuid4().hex[:6]}",
        actor=actor,
        action=action,
        target=target,
        timestamp=datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        outcome=outcome,
        detail=detail,
    )
    save_audit_events([event, *load_audit_events()][:MAX_AUDIT_EVENTS])
    return event


def save_audit_events(events: list[AuditEvent]) -> None:
    audit_path = get_audit_path()
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(
        json.dumps({"events": [asdict(event) for event in events]}, indent=2),
        encoding="utf-8",
    )
