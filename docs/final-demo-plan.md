# Final Demo Plan

Use this plan to present BidForge as a real enterprise bid operating system, not a collection of screens.

## Core Story

### One-line pitch

BidForge Agent converts a complex enterprise RFP into a compliant, evidence-backed, reviewer-ready bid package while keeping humans, audit trails, and approval gates in control.

### Problem statement

Enterprise RFP responses are slow, fragmented, and risky. Bid teams manually read long documents, build compliance spreadsheets, search old proposal content, draft answers, route questions to SMEs, chase legal/finance/security approvals, and discover risks late.

The five pain points to say clearly:

1. Mandatory requirements get missed.
2. Reusable proposal content is hard to find and verify.
3. Legal, finance, security, delivery, and SMEs get work late.
4. Risky claims can reach the proposal before review.
5. Leadership cannot easily measure time saved, quality, or readiness.

### Solution framing

BidForge turns the RFP process into an agentic command center:

```text
Upload RFP
  -> Extract requirements
  -> Match evidence and reusable content
  -> Draft proposal sections
  -> Flag risks
  -> Route SME tasks
  -> Verify with judge agent
  -> Track role approvals
  -> Package proposal handoff
  -> Measure ROI and benchmark quality
  -> Keep automation and audit history running
```

## Recommended Demo Length

Target 7 minutes. If the judges only give 5 minutes, skip Competitive Lab, SLA Forecasting, and Integrations, then close with Automation.

## Demo Flow

### 0:00 - Opening

Route:

```text
?view=dashboard
```

Say:

> "BidForge Agent is a governed RFP response command center. It does not just generate text. It extracts requirements, finds evidence, drafts the proposal, flags risks, routes SMEs, verifies quality, recommends win strategy, packages the final handoff, measures ROI, and tracks human approval gates."

Show:

- Run ID and buyer/project.
- Requirements count.
- Risk count.
- Quality score.
- Hours saved.
- Agent timeline.

Point:

> "This is the bid manager's command view: what came in, what the agents produced, what still needs human review."

### 0:45 - Upload And Agent Run

Route:

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

Click:

```text
Run balanced review
```

Say:

> "The intake agent normalizes the RFP, then downstream agents extract requirements, match evidence, draft sections, flag risks, route tasks, update audit history, and refresh automation."

### 1:25 - Compliance Matrix

Route:

```text
?view=matrix
```

Show:

- Requirement IDs.
- Category and priority.
- Owner.
- Evidence.
- Confidence.

Say:

> "The first high-value artifact is the compliance matrix. Instead of manually building a spreadsheet, the requirement agent creates structured rows with ownership and evidence."

Key point:

> "This reduces missed mandatory clauses."

### 1:55 - Evidence And Knowledge Governance

Route:

```text
?view=knowledge
```

Show:

- Approved snippets.
- Stale evidence.
- Claim governance.
- Coverage gaps.

Click:

```text
Assign SME
Export KB
```

Say:

> "BidForge does not blindly reuse old content. It marks stale snippets, links knowledge to requirements, and routes questionable claims to SMEs."

Key point:

> "This improves reuse without losing governance."

### 2:25 - Collaboration Inbox

Route:

```text
?view=inbox
```

Show:

- Owner filters.
- SLA watch.
- Thread comments.
- Handoff approvals.

Click:

```text
Answer
Approve
Export inbox
```

Say:

> "RFP work usually gets scattered across email and chat. Here, reviewer comments, decisions, and handoffs are tied back to the bid run."

Key point:

> "This makes ownership visible."

### 2:55 - Risks And SME Tasks

Route:

```text
?view=risks
```

Click:

```text
Send to reviewer
```

Then route:

```text
?view=tasks
```

Show:

- Legal, finance, security, and delivery tasks.
- Pending/assigned/answered/approved columns.

Say:

> "The risk agent catches legal, SLA, pricing, delivery, and security issues early. The SME router turns those risks into owned tasks."

Key point:

> "Risk discovery moves from late-stage panic to early workflow."

### 3:25 - Proposal Draft And Evidence

Route:

```text
?view=proposal
```

Show:

- Draft sections.
- Verified / Needs SME / Unsupported labels.
- Source evidence drawer.

Say:

> "The proposal agent drafts useful content, but it does not hide uncertainty. Unsupported claims are visibly marked so humans can fix them before export."

Key point:

> "This is human-in-the-loop drafting, not blind automation."

### 3:55 - Judge Verification

Route:

```text
?view=judge
```

Show:

- Coverage.
- Citation support.
- Hallucination control.
- Risk detection.
- Human-review readiness.

Say:

> "Before leadership sees the package, a judge agent checks whether the response is grounded, complete, and safe enough for human review."

Key point:

> "Quality is measured, not assumed."

### 4:20 - Win Strategy

Route:

```text
?view=strategy
```

Show:

- Bid/no-bid recommendation.
- Win probability.
- Blockers.
- Role-owned next actions.

Click:

```text
Export memo
```

Say:

> "Sales leadership needs more than a draft. They need a decision: should we bid, what improves win probability, and who owns the blockers?"

Key point:

> "BidForge connects proposal execution to sales strategy."

### 4:50 - Export Pack

Route:

```text
?view=package
```

Show:

- Included artifacts.
- Proposal document preview.
- Final export gate.

Click if time:

```text
Download Word document
Download PDF print view
```

Say:

> "The output is not just a screen. BidForge packages the proposal handoff into usable artifacts for reviewers and submission teams."

Key point:

> "The final export remains gated until required approvals are clear."

### 5:20 - Admin Analytics And SLA Forecast

Route:

```text
?view=analytics
```

Show:

- Operational readiness.
- Role workload.
- Bottleneck radar.
- Automation reliability.

Then route:

```text
?view=sla
```

Show:

- On-time confidence.
- Owner forecast.
- Escalation queue.
- Cadence plan.

Say:

> "Admin can see whether the bid is moving, who is overloaded, which approvals may miss SLA, and where to escalate."

Key point:

> "This is management visibility across the whole bid flow."

### 5:55 - Role Flow And Governance

Route:

```text
?view=flow
```

Click:

```text
Legal
Approve
Admin
```

Then route:

```text
?view=governance
```

Show:

- RBAC roles.
- Audit trail.
- Approval gates.
- Blocked final export.

Say:

> "Different roles have different responsibilities. Legal can approve legal gates; Admin can track progress; final export is blocked while critical gates remain open."

Key point:

> "Enterprise AI needs control, not just speed."

### 6:25 - ROI And Benchmark

Route:

```text
?view=roi
```

Show:

- Manual baseline effort.
- Assisted effort.
- Hours saved.
- Estimated value.

Then route:

```text
?view=benchmark
```

Show:

- Manual baseline vs BidForge.
- Quality and speed comparison.

Say:

> "The value story is measurable: configurable hours saved, estimated value, and benchmark comparison against manual work."

Key point:

> "This helps leaders justify adoption."

### 6:50 - AI Governance And Integrations

Route:

```text
?view=ai-governance
```

Show:

- Evidence grounding.
- Prompt-injection quarantine.
- Unsupported claim controls.
- Model risk radar.

Then route:

```text
?view=integrations
```

Show:

- SharePoint.
- Teams.
- CRM.
- Pricing.
- Legal.
- Audit sync.

Say:

> "The demo is deterministic, but the production path is clear: connect enterprise knowledge, CRM, pricing, legal clauses, and collaboration systems."

Key point:

> "BidForge fits into the enterprise workflow."

### 7:15 - Automation Close

Route:

```text
?view=automation
```

Show:

- 5-minute cadence.
- Run now.
- Pause/resume.
- Frequency edit.
- History and audit.

Say:

> "The run stays fresh. Automation refreshes artifacts every 5 minutes, but guardrails and human approval gates remain active."

Final close:

> "BidForge is an enterprise bid operating system: agentic, governed, measurable, and human-approved. It saves time, reduces missed requirements, improves risk visibility, and gives leadership a clearer path to a winning bid."

## If You Have Only 5 Minutes

Use this shorter path:

1. Dashboard: problem and command center.
2. Upload: RFP intake and agent run.
3. Matrix: extracted requirements and ownership.
4. Proposal: drafted content with unsupported claims marked.
5. Risks/Tasks: early risk detection and SME routing.
6. Judge: quality verification.
7. Flow/Governance: role approvals and export gate.
8. ROI: hours saved.
9. Automation: 5-minute guarded refresh.

Skip:

- Competitive Lab.
- SLA Forecast.
- Integrations.
- Benchmark.
- Export downloads unless asked.

## Judge Q&A Prep

### Is this just a chatbot?

No. It is a multi-artifact workflow. It creates compliance matrix, risks, tasks, proposal sections, judge report, win brief, ROI model, benchmark, audit trail, and automation history.

### Where is the human approval?

Risky claims, legal terms, finance assumptions, security evidence, and final export remain tied to role approvals and governance gates.

### How do you avoid hallucinations?

The UI marks unsupported claims, links evidence sources, includes a judge report, and keeps human review before export.

### What is production vs demo?

The hackathon demo uses deterministic logic for repeatable judging. Production would connect governed LLM/RAG, SharePoint, CRM, pricing, legal clause libraries, Teams, and enterprise audit storage.

### What is the business value?

The ROI model shows reduced manual review/drafting effort. The benchmark view compares manual baseline to BidForge output. Admin analytics and SLA forecasting add operational value beyond draft generation.

## Rehearsal Checklist

- Open the app before the demo.
- Start from `?view=dashboard` or `?view=upload`.
- Keep the story focused on problem -> workflow -> proof -> value.
- Avoid spending too long on every screen.
- Export only one or two artifacts live unless judges ask.
- Say "human-approved" and "governed" repeatedly.
- End on Automation because it shows the product keeps running after the first draft.
