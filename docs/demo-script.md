# Demo Script

## 6-Minute Judge Demo

### 0:00 - Open

"BidForge Agent turns a complex RFP into a governed bid response workspace. It creates the compliance matrix, governs reusable knowledge, coordinates reviewer collaboration, drafts the proposal, routes risks and SMEs, verifies quality, recommends win strategy, packages the bid handoff, gives Admin operational analytics, simulates enterprise integrations, measures ROI, benchmarks output, and tracks approvals."

Open:

```text
http://localhost:5174?view=dashboard
```

Show:

- Buyer/project.
- Quality score.
- Requirements.
- Risks.
- Hours saved.
- Agent timeline.

### 0:45 - Upload And Run

Go to:

```text
?view=upload
```

Paste:

```text
Buyer: Northwind Bank
Project: Core banking cloud migration
Vendor must provide 24x7 support.
Supplier shall comply with EU data residency.
Provider must include incident response process.
Preference for fixed-price transition model.
```

Click `Run balanced review`.

Say:

"The upload triggers automation, audit, requirements extraction, risks, proposal draft, judge report, and governance updates."

### 1:30 - Compliance And Evidence

Go to:

```text
?view=matrix
```

Show requirement rows and owners. Click `Open citation drawer` to show proposal/evidence.

### 2:05 - Knowledge Governance

Go to:

```text
?view=knowledge
```

Show:

- Approved vs stale evidence.
- Claim governance.
- Coverage gaps.

Click `Assign SME` on one asset, then `Export KB`.

### 2:35 - Collaboration Inbox

Go to:

```text
?view=inbox
```

Show:

- Owner filters.
- SLA watch.
- Thread comments.

Click `Answer`, `Approve`, and `Export inbox`.

### 3:00 - Risk And SME Routing

Go to:

```text
?view=risks
```

Click `Send to reviewer`.

Go to:

```text
?view=tasks
```

Show routed tasks.

### 3:25 - Judge Verification

Go to:

```text
?view=judge
```

Say:

"The judge agent verifies coverage, citations, hallucination control, risk detection, proposal usefulness, and readiness."

### 3:50 - Win Strategy

Go to:

```text
?view=strategy
```

Show:

- Bid/no-bid recommendation.
- Win probability.
- Must-fix blockers.
- Role-owned next actions.

Click `Export memo`.

### 4:20 - Competitive Strategy Lab

Go to:

```text
?view=competitive
```

Show:

- Competitor radar.
- Differentiator map.
- Red-team objections.
- Executive talk track.

Click `Export battlecard`.

### 4:45 - Export Pack

Go to:

```text
?view=package
```

Show:

- Reviewer package status.
- Included artifacts.
- Branded proposal document preview.
- Final export gate.

Click `Download Word document`, then `Download PDF print view`.

### 5:10 - Admin Analytics

Go to:

```text
?view=analytics
```

Show:

- Operational readiness.
- Role workload.
- Bottleneck radar.
- Automation health.

Click `Export analytics`.

### 5:25 - SLA Forecasting

Go to:

```text
?view=sla
```

Show:

- On-time confidence.
- Owner forecast.
- Escalation queue.
- Cadence plan.

Click `Export forecast`.

### 5:40 - End-To-End Role Flow

Go to:

```text
?view=flow
```

Switch to `Legal`.

Click `Approve`.

Switch to `Admin`.

Show:

- Progress increased.
- Current gate moved to Finance.
- Admin tracker shows approved/waiting/blocked counts.

### 5:55 - Governance

Go to:

```text
?view=governance
```

Show:

- RBAC.
- Audit trail.
- Approval gates.
- Final export blocked until gates clear.

### 6:10 - ROI And Benchmark

Go to:

```text
?view=roi
```

Adjust assumptions and click `Export ROI`.

Go to:

```text
?view=benchmark
```

Show manual baseline vs BidForge Agent and click `Export benchmark`.

### 6:25 - AI Governance

Go to:

```text
?view=ai-governance
```

Show:

- Governance score and evidence/citation/hallucination metrics.
- Prompt-injection quarantine and unsupported claim controls.
- Model risk radar and audit readiness pack.

Click `Export scorecard`.

### 6:40 - Integrations

Go to:

```text
?view=integrations
```

Show:

- SharePoint, Teams, CRM, pricing, legal, and audit connectors.
- Sync log.
- Offline-safe demo guardrail.

Click `Sync now` and `Export status`.

### 6:55 - Automation Close

Go to:

```text
?view=automation
```

Show:

- 5-minute cadence.
- Run now.
- Pause/resume.
- Frequency edit.
- History and audit.

Close:

"BidForge is an enterprise bid operating system: agentic, governed, measurable, and human-approved."

## Backup Demo If API Is Not Running

The frontend falls back to deterministic local demo data. The UI still works, including role flow, ROI, benchmark, exports, search, popovers, and navigation.
