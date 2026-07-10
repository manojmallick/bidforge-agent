from __future__ import annotations

import json
import os
from dataclasses import asdict
from pathlib import Path

from app.data.demo_run import get_demo_run
from app.models.schemas import AutomationConfig, AutomationRunRecord


DEFAULT_STATE_PATH = Path(__file__).resolve().parents[1] / "state" / "automation_state.json"


def get_state_path() -> Path:
    configured_path = os.environ.get("BIDFORGE_AUTOMATION_STATE_PATH")
    return Path(configured_path) if configured_path else DEFAULT_STATE_PATH


def load_automation_state() -> tuple[AutomationConfig, list[AutomationRunRecord]]:
    state_path = get_state_path()
    if not state_path.exists():
        demo_run = get_demo_run()
        return demo_run.automation, demo_run.automationHistory

    payload = json.loads(state_path.read_text(encoding="utf-8"))
    automation = AutomationConfig(**payload["automation"])
    history = [AutomationRunRecord(**record) for record in payload.get("history", [])]
    return automation, history


def save_automation_state(automation: AutomationConfig, history: list[AutomationRunRecord]) -> None:
    state_path = get_state_path()
    state_path.parent.mkdir(parents=True, exist_ok=True)
    state_path.write_text(
        json.dumps(
            {
                "automation": asdict(automation),
                "history": [asdict(record) for record in history],
            },
            indent=2,
        ),
        encoding="utf-8",
    )
