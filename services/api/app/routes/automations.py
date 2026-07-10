from __future__ import annotations

import json

from dataclasses import asdict

from app.core.audit_store import load_audit_events, record_audit_event
from app.core.automation_service import (
    get_automation_state,
    pause_automation,
    resume_automation,
    run_automation_now,
    run_due_automation,
    update_automation_frequency,
)
from app.core.rbac import can_operate_automation, principal_from_payload


def get_automation_response() -> tuple[int, dict]:
    automation, history = get_automation_state()
    return 200, _state_payload(automation, history)


def update_automation_response(raw_body: bytes, headers: dict | None = None) -> tuple[int, dict]:
    payload = _payload(raw_body)
    principal = principal_from_payload(payload, headers)
    if not can_operate_automation(principal):
        return _forbidden_response(principal, "Updated automation frequency")
    frequency = int(payload.get("frequencyMinutes", 5))
    try:
        automation = update_automation_frequency(frequency)
    except ValueError as exc:
        return 400, {"error": "invalid_frequency", "message": str(exc)}
    record_audit_event(
        actor=principal.actor,
        action="Updated automation frequency",
        target=automation.id,
        outcome="Approved",
        detail=f"Set automation frequency to {frequency} minutes.",
    )
    _, history = get_automation_state()
    return 200, _state_payload(automation, history)


def pause_automation_response(raw_body: bytes = b"", headers: dict | None = None) -> tuple[int, dict]:
    payload = _payload(raw_body)
    principal = principal_from_payload(payload, headers)
    if not can_operate_automation(principal):
        return _forbidden_response(principal, "Paused automation")
    automation = pause_automation()
    record_audit_event(
        actor=principal.actor,
        action="Paused automation",
        target=automation.id,
        outcome="Approved",
        detail="Automation schedule paused by authorized operator.",
    )
    _, history = get_automation_state()
    return 200, _state_payload(automation, history)


def resume_automation_response(raw_body: bytes = b"", headers: dict | None = None) -> tuple[int, dict]:
    payload = _payload(raw_body)
    principal = principal_from_payload(payload, headers)
    if not can_operate_automation(principal):
        return _forbidden_response(principal, "Resumed automation")
    automation = resume_automation()
    record_audit_event(
        actor=principal.actor,
        action="Resumed automation",
        target=automation.id,
        outcome="Approved",
        detail="Automation schedule resumed by authorized operator.",
    )
    _, history = get_automation_state()
    return 200, _state_payload(automation, history)


def run_automation_now_response(raw_body: bytes = b"", headers: dict | None = None) -> tuple[int, dict]:
    payload = _payload(raw_body)
    principal = principal_from_payload(payload, headers)
    if not can_operate_automation(principal):
        return _forbidden_response(principal, "Ran automation manually")
    automation, record = run_automation_now()
    record_audit_event(
        actor=principal.actor,
        action="Ran automation manually",
        target=automation.id,
        outcome="Approved",
        detail="Manual automation run executed with guardrails active.",
    )
    _, history = get_automation_state()
    return 202, {
        "automation": asdict(automation),
        "run": asdict(record),
        "history": [asdict(item) for item in history],
        "auditTrail": [asdict(event) for event in load_audit_events()],
    }


def run_due_automation_response() -> tuple[int, dict]:
    automation, record = run_due_automation()
    _, history = get_automation_state()
    return 202, {
        "automation": asdict(automation),
        "run": asdict(record) if record else None,
        "history": [asdict(item) for item in history],
    }


def _state_payload(automation, history) -> dict:
    return {
        **asdict(automation),
        "history": [asdict(record) for record in history],
        "auditTrail": [asdict(event) for event in load_audit_events()],
    }


def _payload(raw_body: bytes) -> dict:
    if not raw_body:
        return {}
    return json.loads(raw_body.decode("utf-8"))


def _forbidden_response(principal, action: str) -> tuple[int, dict]:
    event = record_audit_event(
        actor=principal.actor,
        action=action,
        target="auto-rfp-742-b",
        outcome="Denied",
        detail=f"Role {principal.role} is not allowed to operate automation.",
    )
    return 403, {
        "error": "forbidden",
        "message": "Automation changes require bid_manager or admin role.",
        "auditTrail": [asdict(event), *[asdict(item) for item in load_audit_events()[1:]]],
    }
