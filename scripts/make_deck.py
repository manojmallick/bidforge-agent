from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Flowable,
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "DECK.pdf"
PAGE = landscape((13.333 * inch, 7.5 * inch))
TOTAL_SLIDES = 12

NAVY = colors.HexColor("#071523")
TEAL = colors.HexColor("#006B5F")
MINT = colors.HexColor("#DFFCF7")
AMBER = colors.HexColor("#F59E0B")
RED = colors.HexColor("#BA1A1A")
INK = colors.HexColor("#0B1C30")
MUTED = colors.HexColor("#475569")
LINE = colors.HexColor("#D8DEE8")
SURFACE = colors.HexColor("#F6F9FC")


class Badge(Flowable):
    def __init__(self, text: str, width: float = 1.35 * inch):
        super().__init__()
        self.text = text
        self.width = width
        self.height = 0.28 * inch

    def draw(self) -> None:
        self.canv.setFillColor(MINT)
        self.canv.setStrokeColor(colors.HexColor("#99E4D9"))
        self.canv.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=1)
        self.canv.setFillColor(TEAL)
        self.canv.setFont("Helvetica-Bold", 8)
        self.canv.drawCentredString(self.width / 2, 0.09 * inch, self.text)


def p(text: str, style: str = "Body"):
    return Paragraph(text, STYLES[style])


def title(text: str):
    return p(text, "Title")


def subtitle(text: str):
    return p(text, "Subtitle")


def bullets(items: list[str]):
    return [p(f"- {item}", "Bullet") for item in items]


def slide_header(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE[1] - 0.48 * inch, PAGE[0], 0.48 * inch, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(0.45 * inch, PAGE[1] - 0.30 * inch, "BidForge Agent")
    canvas.setFillColor(colors.HexColor("#9DEFE4"))
    canvas.drawRightString(PAGE[0] - 0.45 * inch, PAGE[1] - 0.30 * inch, f"{doc.page}/{TOTAL_SLIDES}")
    canvas.restoreState()


def card_table(rows: list[list], widths: list[float] | None = None):
    table = Table(rows, colWidths=widths, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("TEXTCOLOR", (0, 1), (-1, -1), INK),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def two_col(left: list, right: list, left_width=5.9 * inch):
    table = Table([[left, right]], colWidths=[left_width, 12.1 * inch - left_width])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 12)]))
    return table


def slide(*items):
    story.extend(items)
    story.append(PageBreak())


def screenshot(path: str, width: float, height: float):
    image = Image(str(ROOT / path))
    image.drawWidth = width
    image.drawHeight = height
    return image


styles = getSampleStyleSheet()
STYLES = {
    "Title": styles["Title"].clone("DeckTitle"),
    "Subtitle": styles["BodyText"].clone("DeckSubtitle"),
    "Body": styles["BodyText"].clone("DeckBody"),
    "Bullet": styles["BodyText"].clone("DeckBullet"),
    "Small": styles["BodyText"].clone("DeckSmall"),
}
STYLES["Title"].fontName = "Helvetica-Bold"
STYLES["Title"].fontSize = 31
STYLES["Title"].leading = 36
STYLES["Title"].textColor = INK
STYLES["Subtitle"].fontSize = 14
STYLES["Subtitle"].leading = 20
STYLES["Subtitle"].textColor = MUTED
STYLES["Body"].fontSize = 11
STYLES["Body"].leading = 16
STYLES["Body"].textColor = INK
STYLES["Bullet"].fontSize = 10.5
STYLES["Bullet"].leading = 15
STYLES["Bullet"].leftIndent = 10
STYLES["Bullet"].textColor = INK
STYLES["Small"].fontSize = 9
STYLES["Small"].leading = 12
STYLES["Small"].textColor = MUTED

story: list = []

badge_row = Table(
    [[Badge("React"), Badge("TypeScript"), Badge("Python API"), Badge("RBAC"), Badge("Automation"), Badge("ROI")]],
    colWidths=[1.45 * inch] * 6,
)
badge_row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))

slide(
    Spacer(1, 0.35 * inch),
    title("BidForge Agent"),
    subtitle("Agentic bid response command center for enterprise RFPs"),
    Spacer(1, 0.2 * inch),
    badge_row,
    Spacer(1, 0.35 * inch),
    p("<b>Pitch:</b> BidForge converts an RFP into a governed, evidence-backed bid package in minutes while humans control approvals.", "Body"),
    Spacer(1, 0.2 * inch),
    card_table(
        [
            ["Winning Signal", "What Judges See"],
            ["Business value", "Hours saved, ROI simulator, benchmark evidence"],
            ["Agentic workflow", "7 agents plus automation and judge verification"],
            ["Enterprise trust", "RBAC, audit trail, guardrails, approval gates"],
            ["Real app feel", "Role-based end-to-end flow with Admin tracker"],
        ],
        [2.4 * inch, 8.5 * inch],
    ),
)

slide(
    title("Problem"),
    subtitle("Enterprise RFP response is high-value work trapped in slow manual coordination."),
    two_col(
        [
            p("<b>Current pain</b>", "Body"),
            *bullets(
                [
                    "Manual requirement extraction from long RFPs",
                    "Scattered proposal content and weak evidence reuse",
                    "Late legal, finance, delivery, and security review",
                    "Missed clauses create compliance and commercial risk",
                    "Leadership lacks real-time readiness and ROI visibility",
                ]
            ),
        ],
        [
            p("<b>Target users</b>", "Body"),
            card_table(
                [
                    ["Role", "Need"],
                    ["Bid Manager", "Coordinate bid readiness"],
                    ["Legal", "Approve risky clauses"],
                    ["Finance", "Validate pricing/SLA assumptions"],
                    ["Delivery", "Confirm feasibility"],
                    ["Admin", "Track gates and audit"],
                ],
                [1.8 * inch, 3.5 * inch],
            ),
        ],
    ),
)

slide(
    title("Solution"),
    subtitle("A governed bid operating system, not just a chatbot."),
    card_table(
        [
            ["Capability", "Implemented Demo"],
            ["RFP intake", "Upload/paste RFP, parse buyer/project/requirements"],
            ["Compliance matrix", "Requirement table with category, owner, evidence, confidence"],
            ["Proposal draft", "Generated sections with unsupported claims marked"],
            ["Risk register", "Legal, finance, security, delivery risks routed early"],
            ["SME task board", "Kanban by owner and status"],
            ["Judge report", "Coverage, citations, hallucination control, readiness"],
            ["Governance", "RBAC, approval gates, audit trail, final export block"],
        ],
        [2.5 * inch, 8.2 * inch],
    ),
)

slide(
    title("Agentic Workflow"),
    subtitle("Specialized agents create artifacts, then governance and automation keep them controlled."),
    card_table(
        [
            ["Agent", "Output"],
            ["Intake Agent", "Normalized RFP, metadata, prompt-injection warning"],
            ["Requirement Agent", "Requirement IDs, priority, owner, evidence"],
            ["Capability Agent", "Knowledge snippets and reusable content"],
            ["Proposal Writer", "Draft sections and assumptions"],
            ["Risk Agent", "Risk register with severity and mitigation"],
            ["SME Router", "Role-specific task board"],
            ["Judge Agent", "Quality report and readiness score"],
        ],
        [2.4 * inch, 8.3 * inch],
    ),
)

slide(
    title("Architecture"),
    subtitle("Lightweight hackathon runtime with production-ready boundaries."),
    two_col(
        [
            p("<b>Runtime</b>", "Body"),
            *bullets(
                [
                    "React/Vite command center",
                    "Python stdlib API",
                    "BidForge orchestrator",
                    "Automation scheduler",
                    "Local JSON audit and automation state",
                    "Deterministic derivation for repeatable demo",
                ]
            ),
        ],
        [
            p("<b>Production upgrade path</b>", "Body"),
            *bullets(
                [
                    "FastAPI/API gateway",
                    "Postgres and object storage",
                    "RAG over SharePoint and proposal bank",
                    "SSO and Azure AD role mapping",
                    "Workflow tool integration",
                    "Immutable audit and SIEM export",
                ]
            ),
        ],
    ),
)

slide(
    title("Product Screenshots"),
    subtitle("Working command-center views included in the repository README."),
    Table(
        [
            [
                [p("<b>Dashboard</b>", "Body"), screenshot("docs/screenshots/dashboard.png", 5.25 * inch, 1.8 * inch)],
                [p("<b>Role Flow</b>", "Body"), screenshot("docs/screenshots/role-flow.png", 5.25 * inch, 1.8 * inch)],
            ],
            [
                [p("<b>ROI Simulator</b>", "Body"), screenshot("docs/screenshots/roi.png", 5.25 * inch, 1.8 * inch)],
                [p("<b>Benchmark Mode</b>", "Body"), screenshot("docs/screenshots/benchmark.png", 5.25 * inch, 1.8 * inch)],
            ],
        ],
        colWidths=[5.85 * inch, 5.85 * inch],
        rowHeights=[2.25 * inch, 2.25 * inch],
    ),
)

slide(
    title("End-to-End Role Flow"),
    subtitle("Judges can switch roles and see the Admin tracker update live."),
    card_table(
        [
            ["Step", "Owner", "Gate"],
            ["Upload and configure RFP", "Bid Manager", "Intake complete"],
            ["Legal compliance review", "Legal", "Legal approval"],
            ["Commercial review", "Finance", "Pricing approval"],
            ["Security evidence review", "Security", "Security approval"],
            ["Delivery feasibility", "Delivery", "Delivery approval"],
            ["Final export", "Bid Manager", "Final export"],
        ],
        [3.4 * inch, 2.2 * inch, 4.2 * inch],
    ),
    Spacer(1, 0.15 * inch),
    p("Admin sees approved, waiting, blocked counts plus current owner and event log.", "Body"),
)

slide(
    title("Governance And Trust"),
    subtitle("Human approval and audit controls are built into the demo path."),
    two_col(
        [
            p("<b>Controls</b>", "Body"),
            *bullets(
                [
                    "RBAC for automation operations",
                    "Prompt-injection quarantine",
                    "Audit trail for run and automation actions",
                    "Approval gates by Legal, Finance, Security, Delivery",
                    "Final export blocked until gates clear",
                ]
            ),
        ],
        [
            p("<b>Judge verification</b>", "Body"),
            *bullets(
                [
                    "Requirement coverage",
                    "Citation support",
                    "Hallucination control",
                    "Risk detection",
                    "Proposal usefulness",
                    "Human-review readiness",
                ]
            ),
        ],
    ),
)

slide(
    title("ROI And Savings"),
    subtitle("BidForge makes the value story measurable during the demo."),
    card_table(
        [
            ["Metric", "Default Demo Value"],
            ["RFP size", "118 pages"],
            ["Reviewers", "6"],
            ["Baseline effort", "197 hours"],
            ["Assisted effort", "63 hours"],
            ["Hours saved", "134 hours"],
            ["First-draft reduction", "68%"],
            ["Estimated value", "USD 12,730"],
        ],
        [3.2 * inch, 5.4 * inch],
    ),
    Spacer(1, 0.15 * inch),
    p("All assumptions are editable in the ROI Simulator and exportable as JSON evidence.", "Body"),
)

slide(
    title("Benchmark Mode"),
    subtitle("A controlled scorecard compares manual baseline vs BidForge Agent."),
    card_table(
        [
            ["Case", "Manual Coverage", "Agent Coverage", "Risk Lift"],
            ["Banking migration RFP", "62%", "92%", "+34%"],
            ["Retail DevSecOps RFP", "68%", "91%", "+34%"],
            ["Insurance data platform RFP", "65%", "89%", "+29%"],
        ],
        [3.4 * inch, 2.2 * inch, 2.2 * inch, 2.2 * inch],
    ),
    Spacer(1, 0.15 * inch),
    p("Benchmark values are deterministic demo assumptions, designed for transparent judge review.", "Body"),
)

slide(
    title("Live Demo Plan"),
    subtitle("A concise path that proves business value, agentic depth, and governance."),
    card_table(
        [
            ["Minute", "Action"],
            ["0-1", "Dashboard and upload RFP"],
            ["1-2", "Compliance matrix, risk register, proposal evidence"],
            ["2-3", "Judge report and executive win brief"],
            ["3-4", "Legal approval in Role Flow, Admin tracker update"],
            ["4-5", "Governance, audit, automation"],
            ["5-6", "ROI simulator and Benchmark Mode exports"],
        ],
        [1.4 * inch, 8.6 * inch],
    ),
)

slide(
    title("Why BidForge Wins"),
    subtitle("It combines enterprise impact, working software, governance, and measurable outcomes."),
    two_col(
        [
            p("<b>Differentiators</b>", "Body"),
            *bullets(
                [
                    "End-to-end bid lifecycle, not a single prompt",
                    "Role-based flow and Admin tracker",
                    "Evidence-aware proposal drafting",
                    "Human-in-the-loop governance",
                    "ROI and benchmark proof",
                    "Automation with audit history",
                ]
            ),
        ],
        [
            p("<b>Ask</b>", "Body"),
            *bullets(
                [
                    "Pilot with sample RFPs and anonymized proposal bank",
                    "Connect SharePoint/Teams and legal clause library",
                    "Measure cycle-time reduction and reviewer effort",
                    "Scale into reusable enterprise bid platform",
                ]
            ),
        ],
    ),
    Spacer(1, 0.2 * inch),
    p("<b>Closing:</b> BidForge is the governed operating system for enterprise bid response.", "Body"),
)

if story and isinstance(story[-1], PageBreak):
    story.pop()

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=PAGE,
    rightMargin=0.48 * inch,
    leftMargin=0.48 * inch,
    topMargin=0.68 * inch,
    bottomMargin=0.35 * inch,
)
doc.build(story, onFirstPage=slide_header, onLaterPages=slide_header)
print(OUT)
