from __future__ import annotations

import json

from dataclasses import asdict, replace

from app.core.audit_store import load_audit_events, record_audit_event
from app.core.automation_service import get_automation_state, run_automation_now
from app.core.orchestrator import BidForgeOrchestrator
from app.core.rbac import can_operate_automation, principal_from_payload


orchestrator = BidForgeOrchestrator()


def get_demo_run_response() -> tuple[int, dict]:
    run = orchestrator.run_demo()
    automation, history = get_automation_state()
    return 200, replace(run, automation=automation, automationHistory=history, auditTrail=load_audit_events()).to_dict()


def create_demo_run_response(raw_body: bytes, headers: dict | None = None) -> tuple[int, dict]:
    payload = {}
    if raw_body:
        payload = json.loads(raw_body.decode("utf-8"))
    principal = principal_from_payload(payload, headers)
    if not can_operate_automation(principal):
        event = record_audit_event(
            actor=principal.actor,
            action="Created bid run",
            target="RFP-742-B",
            outcome="Denied",
            detail=f"Role {principal.role} is not allowed to create automation-backed bid runs.",
        )
        return 403, {
            "error": "forbidden",
            "message": "Creating automation-backed bid runs requires bid_manager or admin role.",
            "auditTrail": [asdict(event)],
        }
    rfp_text = str(payload.get("rfpText", ""))
    source_file = str(payload.get("file", "Uploaded RFP"))
    run = orchestrator.run_demo(rfp_text=rfp_text, source_file=source_file)
    automation, _ = run_automation_now(source="Upload-triggered")
    _, history = get_automation_state()
    record_audit_event(
        actor=principal.actor,
        action="Created bid run",
        target=run.runId,
        outcome="Completed",
        detail=f"Started balanced review from {source_file}; automation refresh executed with guardrails active.",
    )
    updated_run = replace(
        run,
        status="Automation refresh complete",
        automation=automation,
        automationHistory=history,
        auditTrail=load_audit_events(),
    )
    return 201, updated_run.to_dict()
