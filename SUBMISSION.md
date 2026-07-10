# BidForge Agent Submission

## What To Submit

- Working app source: `apps/web` and `services/api`
- Main README: `README.md`
- Architecture: `architecture.md`
- Pitch deck: `DECK.pdf`
- Demo script: `docs/demo-script.md`
- Problem/value story: `docs/problem-statement.md` and `docs/solution-savings.md`
- Checklist: `docs/judging-checklist.md`

## Demo Command

```bash
npm install
npm run demo
```

Open:

```text
http://localhost:5174
```

## Judge Demo Path

1. Dashboard
2. Upload
3. Compliance Matrix
4. Knowledge Base Studio
5. Collaboration Inbox
6. Risk Register
7. Proposal Draft
8. Judge Report
9. Win Strategy
10. Competitive Strategy Lab
11. Export Pack
12. Admin Analytics
13. SLA Forecasting
14. Role Flow
15. Governance
16. AI Governance Scorecard
17. ROI Simulator
18. Benchmark
19. Integration Simulator
20. Automation

## Best Pitch

> BidForge is a governed agentic bid operating system. It reads the RFP, governs the knowledge base, coordinates reviewer collaboration, generates the response artifacts, routes SMEs, catches risks, verifies quality, proves responsible AI controls, recommends bid/no-bid strategy, builds a competitive battlecard, forecasts reviewer SLA risk, packages the proposal handoff into JSON, memo, Word-compatible, and PDF-print outputs, gives Admin operational analytics, simulates enterprise integrations, measures ROI, benchmarks output, and tracks every approval gate before export.

## Validation

```bash
npm run test:api
npm run build:web
```

Last verified:

- API tests: 34 passing
- Web build: passing
- Browser smoke: routes, search, role approval, exports, and admin tracker passing
