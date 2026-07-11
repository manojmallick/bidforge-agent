# BidForge Agent

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=fff)
![Agentic Workflow](https://img.shields.io/badge/Agentic_Workflow-7_agents-006B5F)
![Automation](https://img.shields.io/badge/Automation-5_min_cadence-0F766E)
![Governance](https://img.shields.io/badge/Governance-RBAC_+_Audit-111827)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=fff)
![Status](https://img.shields.io/badge/Hackathon_Demo-Ready-10B981)

BidForge Agent is a governed agentic RFP command center for enterprise bid teams. It turns an uploaded RFP into structured requirements, evidence-backed proposal drafts, risk registers, SME tasks, judge verification, approval gates, ROI evidence, and audit-ready workflow history.

This is not a chatbot demo. BidForge is designed as a bid operating system: it reads the RFP, coordinates specialist agents, routes human work, verifies output quality, measures business value, and keeps final export under human control.

## Live Demo

| Resource | Link |
| --- | --- |
| Live app | [https://web-three-delta-62.vercel.app](https://web-three-delta-62.vercel.app) |
| Dashboard | [Open dashboard](https://web-three-delta-62.vercel.app/?view=dashboard) |
| Upload RFP | [Open upload](https://web-three-delta-62.vercel.app/?view=upload) |
| Automation API | [GET /api/automations/current](https://web-three-delta-62.vercel.app/api/automations/current) |
| Demo Run API | [GET /api/runs/demo](https://web-three-delta-62.vercel.app/api/runs/demo) |
| Pitch deck | [DECK.pdf](./DECK.pdf) |
| Sample RFP PDF | [Northwind Bank sample RFP](./docs/sample-rfps/Northwind_Bank_Core_Banking_Cloud_Migration_RFP.pdf) |

## Problem

Enterprise RFP responses are slow, fragmented, and risky. Bid teams manually read long documents, extract requirements, search old proposal content, draft answers, route reviews to SMEs, chase approvals, and verify that every mandatory requirement is covered before submission.

That manual process creates five recurring failure modes:

- **Missed requirements:** mandatory clauses are overlooked in large documents.
- **Weak evidence reuse:** previous proposal content is hard to find, trust, and cite.
- **Unclear ownership:** legal, finance, delivery, security, and SMEs receive work late or informally.
- **Approval risk:** risky or unsupported claims can reach proposal drafts before review.
- **Poor leadership visibility:** teams struggle to show readiness, risk, ROI, and bid confidence.

## Solution

BidForge converts the RFP response lifecycle into a governed multi-agent workflow:

```text
Upload RFP
  -> Extract metadata and requirements
  -> Match approved evidence
  -> Draft proposal sections
  -> Flag risks and unsupported claims
  -> Route SME tasks by owner
  -> Verify quality with a judge agent
  -> Track role approvals and audit trail
  -> Export bid package
  -> Measure ROI, benchmark quality, and automation reliability
```

The result is a reviewer-ready bid workspace where bid managers, SMEs, legal, finance, security, delivery, sales leadership, and admins can work from one shared source of truth.

## Why It Matters

| Business Need | BidForge Response |
| --- | --- |
| Faster first draft | Extracts requirements, drafts sections, and refreshes artifacts automatically |
| Better compliance | Creates a traceable compliance matrix with owners, evidence, and confidence |
| Lower proposal risk | Marks unsupported claims and blocks final export while approval gates are open |
| Clear accountability | Routes SME tasks to Legal, Finance, Security, Delivery, Sales, and Admin views |
| Stronger leadership story | Produces win brief, ROI simulator, benchmark mode, and admin analytics |
| Enterprise trust | Includes RBAC, audit trail, prompt-injection guardrails, and human approvals |

Demo ROI assumptions show a 118-page RFP with 6 reviewers moving from about 197 manual hours to 63 assisted hours, saving around 134 hours and roughly USD 12,730 at a USD 95 blended hourly rate. These are configurable demo assumptions, not production claims.

## What Makes It Agentic

BidForge uses specialist agents rather than a single linear prompt:

| Agent | Responsibility |
| --- | --- |
| Intake Agent | Normalize uploaded RFP text, detect metadata, detect prompt-injection patterns |
| Requirement Agent | Extract requirements with ID, category, priority, owner, evidence, and confidence |
| Capability Agent | Match requirements to reusable proposal-bank evidence and solution assets |
| Proposal Agent | Draft proposal sections while marking unsupported assumptions |
| Risk Agent | Flag legal, compliance, SLA, delivery, commercial, and security risks |
| SME Router Agent | Convert risks and gaps into role-owned reviewer tasks |
| Judge Agent | Score coverage, citations, hallucination control, risk detection, and readiness |

The agents produce structured artifacts that the UI turns into a governed operating workflow, not just generated text.

## Product Capabilities

| Area | Capability |
| --- | --- |
| Upload | Paste RFP text or upload `.pdf`, `.txt`, or `.md`; PDF text is extracted before review |
| Dashboard | Run summary, quality score, requirements, risks, latency, cost, and agent timeline |
| Compliance Matrix | Requirement IDs, category, priority, status, owner, evidence, and confidence |
| Proposal Draft | Evidence-backed response sections with `Verified`, `Needs SME`, and `Unsupported` states |
| Knowledge Base Studio | Approved snippets, stale evidence, linked requirements, claim governance, export |
| Collaboration Inbox | Role queues, reviewer comments, decisions, SLA pressure, handoff approvals |
| Risk Register | Legal, finance, SLA, delivery, and security risk cards with mitigation and approval state |
| SME Task Board | Kanban workflow for pending, assigned, answered, and approved reviewer tasks |
| Judge Report | Quality rubric for requirement coverage, citations, hallucination control, and readiness |
| Executive Win Brief | Opportunity summary, win themes, major risks, missing inputs, and recommendation |
| Win Strategy | Bid/no-bid recommendation, win probability, blockers, and role-owned next actions |
| Competitive Strategy Lab | Competitor radar, differentiators, red-team objections, executive talk track |
| Export Pack | JSON package, Markdown memo, Word-compatible proposal, and PDF-ready print view |
| Admin Analytics | Readiness, bottlenecks, role workload, automation reliability, and audit summary |
| SLA Forecasting | Delay prediction, escalation queue, automation cadence, and next 24-hour plan |
| ROI Simulator | Editable assumptions and exportable ROI scenario |
| Benchmark Mode | Manual baseline vs BidForge scorecard across sample RFPs |
| Governance | RBAC roles, approval gates, controls, audit trail, blocked final export |
| AI Governance Scorecard | Evidence grounding, prompt-injection quarantine, model risk, and human gates |
| Integration Simulator | Mock SharePoint, Teams, CRM, pricing, legal, and audit sync status |
| Automation | 5-minute cadence, run now, pause/resume, frequency edit, persisted history |

## Screenshots

| Dashboard | Role Flow |
| --- | --- |
| ![BidForge dashboard](docs/screenshots/dashboard.png) | ![BidForge role flow](docs/screenshots/role-flow.png) |

| Win Strategy | Competitive Strategy |
| --- | --- |
| ![BidForge win strategy](docs/screenshots/strategy.png) | ![BidForge competitive strategy lab](docs/screenshots/competitive.png) |

| Knowledge Base | Collaboration Inbox |
| --- | --- |
| ![BidForge knowledge base studio](docs/screenshots/knowledge.png) | ![BidForge collaboration inbox](docs/screenshots/inbox.png) |

| Export Pack | Admin Analytics |
| --- | --- |
| ![BidForge export pack](docs/screenshots/package.png) | ![BidForge admin analytics](docs/screenshots/analytics.png) |

| Governance | AI Governance |
| --- | --- |
| ![BidForge governance](docs/screenshots/governance.png) | ![BidForge AI governance scorecard](docs/screenshots/ai-governance.png) |

## Demo Routes

The deployed demo uses shareable query routes, so each view can be opened directly without hash URLs.

| View | Live Link |
| --- | --- |
| Dashboard | [Open](https://web-three-delta-62.vercel.app/?view=dashboard) |
| Upload | [Open](https://web-three-delta-62.vercel.app/?view=upload) |
| Compliance Matrix | [Open](https://web-three-delta-62.vercel.app/?view=matrix) |
| Proposal Draft | [Open](https://web-three-delta-62.vercel.app/?view=proposal) |
| Knowledge Base | [Open](https://web-three-delta-62.vercel.app/?view=knowledge) |
| Collaboration Inbox | [Open](https://web-three-delta-62.vercel.app/?view=inbox) |
| Risk Register | [Open](https://web-three-delta-62.vercel.app/?view=risks) |
| SME Tasks | [Open](https://web-three-delta-62.vercel.app/?view=tasks) |
| Judge Report | [Open](https://web-three-delta-62.vercel.app/?view=judge) |
| Executive Win Brief | [Open](https://web-three-delta-62.vercel.app/?view=brief) |
| Win Strategy | [Open](https://web-three-delta-62.vercel.app/?view=strategy) |
| Competitive Strategy | [Open](https://web-three-delta-62.vercel.app/?view=competitive) |
| Export Pack | [Open](https://web-three-delta-62.vercel.app/?view=package) |
| Admin Analytics | [Open](https://web-three-delta-62.vercel.app/?view=analytics) |
| SLA Forecasting | [Open](https://web-three-delta-62.vercel.app/?view=sla) |
| ROI Simulator | [Open](https://web-three-delta-62.vercel.app/?view=roi) |
| Benchmark Mode | [Open](https://web-three-delta-62.vercel.app/?view=benchmark) |
| Role Flow | [Open](https://web-three-delta-62.vercel.app/?view=flow) |
| Governance | [Open](https://web-three-delta-62.vercel.app/?view=governance) |
| AI Governance | [Open](https://web-three-delta-62.vercel.app/?view=ai-governance) |
| Integrations | [Open](https://web-three-delta-62.vercel.app/?view=integrations) |
| Automation | [Open](https://web-three-delta-62.vercel.app/?view=automation) |

For local development, use the same `?view=` values with your local Vite URL, for example `http://localhost:5174?view=dashboard`.

## Architecture

BidForge is intentionally lightweight for hackathon reliability while keeping clear production upgrade paths.

```text
React/Vite Command Center
  -> API client with production same-origin API and local fallback
  -> Vercel serverless demo endpoints for deployed API routes
  -> Python HTTP API for local orchestration
  -> BidForge Orchestrator
  -> 7 agent modules + deterministic workflow derivation
  -> Automation scheduler + JSON state + audit store
```

See [architecture.md](./architecture.md) for diagrams and deeper system design.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| UI | lucide-react, responsive command-center CSS |
| PDF intake | `pdfjs-dist` browser-side text extraction |
| Local API | Python stdlib `ThreadingHTTPServer` |
| Deployed API | Vercel serverless functions under `apps/web/api` |
| Orchestration | Python agent classes and deterministic workflow derivation |
| Persistence | Local JSON runtime state for automation and audit trail |
| CI/CD | GitHub Actions validation and Vercel deployment workflow |
| Validation | Python `unittest`, TypeScript build, Vercel API typecheck |
| Design source | Stitch command-center references in `docs/stitch_bidforge_agent_command_center/` |

## API Surface

The live Vercel deployment exposes the same key API routes used by the app:

```text
GET  /api/runs/demo
POST /api/runs
GET  /api/automations/current
POST /api/automations/current
POST /api/automations/current/run
POST /api/automations/current/pause
POST /api/automations/current/resume
```

Local Python API also includes:

```text
GET  /health
POST /api/automations/current/tick
```

## Quick Start

Install dependencies:

```bash
npm install
```

Run the complete local demo:

```bash
npm run demo
```

Or run web and API separately:

```bash
npm run dev:api
npm run dev:web
```

Local URLs:

```text
Web: http://localhost:5174
API: http://127.0.0.1:8787
```

Optional local environment override:

```text
VITE_BIDFORGE_API_BASE=http://127.0.0.1:8787
```

Sample upload PDF:

```text
docs/sample-rfps/Northwind_Bank_Core_Banking_Cloud_Migration_RFP.pdf
```

## Validation

```bash
npm run build:web
npm run typecheck:web-api
npm run test:api
```

Current validation status:

- Web production build: passing
- Vercel API route typecheck: passing
- Python API unit tests: 34 passing
- Browser smoke testing completed across core routes and workflows

## Security And Governance

BidForge is designed around human-approved automation:

- Prompt-injection patterns are detected and quarantined as document content.
- Automation changes are restricted to `bid_manager` and `admin` roles in the local API.
- Denied and completed actions are recorded in the audit trail.
- Unsupported claims are marked before they can reach final export.
- Final export remains blocked while required approval gates are open.
- Admin views expose role workload, bottlenecks, automation reliability, and readiness.

## Project Structure

```text
bidforge-agent/
  apps/web/                         React/Vite command center and Vercel API routes
  services/api/                     Python API, orchestration, agents, automation, audit
  docs/                             Problem, demo, architecture, judging, and design docs
  docs/screenshots/                 README screenshots
  docs/sample-rfps/                 Uploadable sample RFP PDF
  docs/submission-assets/           Submission background image and logo
  scripts/                          Demo, PDF, deck, and asset helper scripts
  architecture.md                   System architecture and flow
  DECK.pdf                          Judge-facing pitch deck
  SUBMISSION.md                     Submission checklist and pitch summary
```

## Judge-Friendly Artifacts

| Artifact | Purpose |
| --- | --- |
| [DECK.pdf](./DECK.pdf) | Pitch deck for business value and solution overview |
| [architecture.md](./architecture.md) | System architecture, flow, automation, and governance |
| [docs/problem-statement.md](./docs/problem-statement.md) | Clear problem framing and target users |
| [docs/solution-savings.md](./docs/solution-savings.md) | ROI assumptions and savings story |
| [docs/final-demo-plan.md](./docs/final-demo-plan.md) | Presenter-ready demo plan |
| [docs/judging-checklist.md](./docs/judging-checklist.md) | Review checklist for final submission readiness |
| [docs/automation-feature.md](./docs/automation-feature.md) | Automation capability details |
| [docs/submission-assets](./docs/submission-assets) | Project background image and logo |

## Current Limitations

- The hackathon demo uses deterministic derivation for repeatable judging. Production should use a governed LLM/RAG pipeline.
- Knowledge snippets are mocked. Production should connect approved proposal repositories, SharePoint, CRM, pricing tools, and legal clause libraries.
- Local persistence uses JSON state. Production should use a database, immutable audit log, and tenant-aware storage.
- Vercel API routes mirror the demo API for deployment. Production should consolidate behind an enterprise API gateway or FastAPI service.
- Browser-generated exports are sufficient for demo use. Production should render DOCX/PDF server-side with enterprise templates.

## Production Roadmap

| Phase | Upgrade |
| --- | --- |
| Pilot | Connect proposal repository, SharePoint folders, and sample CRM records |
| Enterprise API | FastAPI/API gateway, SSO, database persistence, immutable audit |
| Integrations | Teams, Outlook, CRM, pricing, legal clause library, ServiceNow/Jira approvals |
| AI Layer | Governed LLM/RAG retrieval, vector search, citation policy, model evaluation |
| Workflow | SLA reminders, reviewer escalations, approval routing, portfolio dashboards |
| Security | Tenant isolation, encryption, policy engine, SIEM export, admin controls |

## License

Hackathon prototype. Internal evaluation only unless a license is added.
