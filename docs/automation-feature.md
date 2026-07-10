# Automation Feature

BidForge automation keeps a bid run refreshed on a configured cadence while preserving guardrails and human approval gates.

## Current MVP Behavior

- Default frequency: 5 minutes
- Status: Active
- Scope: refresh extraction, risk register, SME task board, and judge report
- Guardrails: prompt-injection quarantine remains enabled
- Owner: bid manager
- Manual run: "Run now" executes the automation and prepends the latest run record
- Pause/resume: active automations can be paused without losing cadence settings
- Cadence edit: frequency is editable, with 5 minutes as the configured hackathon cadence
- Scheduled tick: due checks run only when the automation is active and due
- Background scheduler: the API process starts an internal worker that checks due runs automatically
- Upload trigger: creating a bid run from the upload panel executes an automation refresh immediately
- Document intake: uploaded or pasted RFP text updates run metadata before automation starts
- Audit trail: upload-triggered runs record actor, action, target, outcome, timestamp, and detail
- RBAC gate: automation mutations require `bid_manager` or `admin`; denied attempts are audited
- Persistence: automation config and history are written to local JSON runtime state
- History: recent automation runs show status, timestamp, summary, and changed artifacts

## API

```text
GET  /api/automations/current
POST /api/automations/current
POST /api/automations/current/run
POST /api/automations/current/pause
POST /api/automations/current/resume
POST /api/automations/current/tick
```

`GET /health` reports the scheduler status, including running state, tick count, last tick, last run id, and last worker error.

Example update body:

```json
{
  "frequencyMinutes": 5
}
```

## Frontend

The dashboard shows the automation state in the Automation panel:

- frequency
- next run
- next run timestamp
- last run
- run mode
- guardrail status
- pause/resume control
- frequency edit control
- recent automation history
- recent audit events
- manual run action

The frontend loads automation state from the API and falls back to local demo data if the API is not running.
