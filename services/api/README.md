# BidForge Agent API

Dependency-light API and agent orchestration scaffold for the hackathon demo.

## Run

```bash
PYTHONPATH=. python3 app/main.py
```

Endpoints:

- `GET /health`
- `GET /api/runs/demo`
- `POST /api/runs`
- `GET /api/automations/current`
- `POST /api/automations/current`
- `POST /api/automations/current/run`
- `POST /api/automations/current/pause`
- `POST /api/automations/current/resume`
- `POST /api/automations/current/tick`

The current implementation returns deterministic demo output, starts an internal automation scheduler with the API process, records upload-triggered run audit events, and persists automation config/history to local runtime JSON state. The module layout is ready for replacing the stdlib HTTP adapter with FastAPI later.
