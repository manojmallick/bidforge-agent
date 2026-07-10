from __future__ import annotations

from dataclasses import replace
from datetime import datetime, timedelta, timezone
from threading import RLock
from uuid import uuid4

from app.core.automation_store import load_automation_state, save_automation_state
from app.models.schemas import AutomationConfig, AutomationRunRecord, BidForgeRun


DEFAULT_FREQUENCY_MINUTES = 5
MAX_HISTORY_RECORDS = 10
_STATE_LOCK = RLock()


def get_current_automation() -> AutomationConfig:
    automation, _ = get_automation_state()
    return automation


def get_automation_history() -> list[AutomationRunRecord]:
    _, history = get_automation_state()
    return history


def get_automation_state(now: datetime | None = None) -> tuple[AutomationConfig, list[AutomationRunRecord]]:
    with _STATE_LOCK:
        automation, history = load_automation_state()
        normalized = _normalize_automation(automation, now=now)
        if normalized != automation:
            save_automation_state(normalized, history)
        return normalized, history


def update_automation_frequency(frequency_minutes: int, now: datetime | None = None) -> AutomationConfig:
    if frequency_minutes < 1:
        raise ValueError("frequency_minutes must be at least 1")

    with _STATE_LOCK:
        current, history = get_automation_state(now=now)
        updated = replace(
            current,
            frequencyMinutes=frequency_minutes,
            nextRunIn=_next_run_in(current.status, frequency_minutes),
            nextRunAt=_next_run_at(frequency_minutes, now=now) if current.status == "Active" else "",
        )
        save_automation_state(updated, history)
        return updated


def pause_automation() -> AutomationConfig:
    with _STATE_LOCK:
        current, history = get_automation_state()
        updated = replace(current, status="Paused", nextRunIn="Paused", nextRunAt="")
        save_automation_state(updated, history)
        return updated


def resume_automation(now: datetime | None = None) -> AutomationConfig:
    with _STATE_LOCK:
        current, history = get_automation_state(now=now)
        updated = replace(
            current,
            status="Active",
            nextRunIn=f"{current.frequencyMinutes} min",
            nextRunAt=_next_run_at(current.frequencyMinutes, now=now),
        )
        save_automation_state(updated, history)
        return updated


def apply_automation_to_run(run: BidForgeRun, automation: AutomationConfig | None = None) -> BidForgeRun:
    return replace(run, automation=automation or get_current_automation())


def run_automation_now(now: datetime | None = None, source: str = "Manual") -> tuple[AutomationConfig, AutomationRunRecord]:
    with _STATE_LOCK:
        current, history = get_automation_state(now=now)
        run_time = _utc_now(now)
        updated = replace(
            current,
            status="Active",
            lastRunAt=_display_time(run_time),
            nextRunIn=f"{current.frequencyMinutes} min",
            nextRunAt=_next_run_at(current.frequencyMinutes, now=run_time),
        )
        record = AutomationRunRecord(
            id=f"auto-run-{run_time.strftime('%Y%m%d%H%M%S')}-{uuid4().hex[:6]}",
            status="Completed",
            startedAt=_display_time(run_time),
            finishedAt=_display_time(run_time),
            summary=f"{source} automation run completed. Artifacts refreshed with guardrails active.",
            changedArtifacts=["Compliance matrix", "Risk register", "SME task board", "Judge report"],
        )
        save_automation_state(updated, [record, *history][:MAX_HISTORY_RECORDS])
        return updated, record


def run_due_automation(now: datetime | None = None) -> tuple[AutomationConfig, AutomationRunRecord | None]:
    with _STATE_LOCK:
        current, _ = get_automation_state(now=now)
        if current.status != "Active":
            return current, None

        next_run_at = _parse_time(current.nextRunAt)
        if next_run_at and next_run_at > _utc_now(now):
            return current, None

        return run_automation_now(now=now, source="Scheduled")


def _normalize_automation(automation: AutomationConfig, now: datetime | None = None) -> AutomationConfig:
    if automation.status == "Paused":
        return replace(automation, nextRunIn="Paused", nextRunAt="")
    if automation.nextRunAt:
        return automation
    return replace(
        automation,
        status="Active",
        frequencyMinutes=automation.frequencyMinutes or DEFAULT_FREQUENCY_MINUTES,
        nextRunIn=f"{automation.frequencyMinutes or DEFAULT_FREQUENCY_MINUTES} min",
        nextRunAt=_next_run_at(automation.frequencyMinutes or DEFAULT_FREQUENCY_MINUTES, now=now),
    )


def _next_run_in(status: str, frequency_minutes: int) -> str:
    return "Paused" if status == "Paused" else f"{frequency_minutes} min"


def _next_run_at(frequency_minutes: int, now: datetime | None = None) -> str:
    return (_utc_now(now) + timedelta(minutes=frequency_minutes)).isoformat()


def _utc_now(now: datetime | None = None) -> datetime:
    if now is None:
        return datetime.now(timezone.utc)
    if now.tzinfo is None:
        return now.replace(tzinfo=timezone.utc)
    return now.astimezone(timezone.utc)


def _display_time(value: datetime) -> str:
    return value.strftime("%Y-%m-%d %H:%M UTC")


def _parse_time(value: str) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value).astimezone(timezone.utc)
    except ValueError:
        return None
