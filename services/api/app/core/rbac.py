from __future__ import annotations

from dataclasses import dataclass


AUTOMATION_OPERATOR_ROLES = {"bid_manager", "admin"}
HUMAN_APPROVAL_ROLES = {"bid_manager", "legal_approver", "admin"}


@dataclass(frozen=True)
class Principal:
    actor: str
    role: str


def principal_from_payload(payload: dict | None = None, headers: dict | None = None) -> Principal:
    payload = payload or {}
    headers = {str(key).lower(): value for key, value in (headers or {}).items()}
    actor = str(payload.get("actor") or headers.get("x-bidforge-actor") or "Senior Bid Mgr")
    role = str(payload.get("role") or headers.get("x-bidforge-role") or "bid_manager")
    return Principal(actor=actor, role=_normalize_role(role))


def can_operate_automation(principal: Principal) -> bool:
    return principal.role in AUTOMATION_OPERATOR_ROLES


def can_approve_human_gate(principal: Principal) -> bool:
    return principal.role in HUMAN_APPROVAL_ROLES


def _normalize_role(role: str) -> str:
    return role.strip().lower().replace(" ", "_").replace("-", "_")
