from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "sample-rfps"
OUT_FILE = OUT_DIR / "Northwind_Bank_Core_Banking_Cloud_Migration_RFP.pdf"


def styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            textColor=colors.HexColor("#102033"),
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#536173"),
            spaceAfter=16,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#0f766e"),
            spaceBefore=10,
            spaceAfter=7,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#475569"),
        ),
        "cell": ParagraphStyle(
            "Cell",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#1f2937"),
        ),
        "cell_bold": ParagraphStyle(
            "CellBold",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=colors.HexColor("#102033"),
        ),
    }


def p(text, style):
    return Paragraph(text, style)


def requirement_table(s):
    rows = [
        [
            p("ID", s["cell_bold"]),
            p("Requirement", s["cell_bold"]),
            p("Priority", s["cell_bold"]),
            p("Owner", s["cell_bold"]),
        ],
        [
            p("M-001", s["cell_bold"]),
            p("Vendor must provide 24x7 Level 1, Level 2, and Level 3 support for core banking workloads.", s["cell"]),
            p("Mandatory", s["cell"]),
            p("Delivery", s["cell"]),
        ],
        [
            p("M-002", s["cell_bold"]),
            p("Supplier shall comply with EU data residency and must identify where regulated data is stored, processed, and backed up.", s["cell"]),
            p("Mandatory", s["cell"]),
            p("Legal", s["cell"]),
        ],
        [
            p("M-003", s["cell_bold"]),
            p("Provider must include an incident response process with escalation contacts, severity levels, and reporting timelines.", s["cell"]),
            p("Mandatory", s["cell"]),
            p("Security", s["cell"]),
        ],
        [
            p("M-004", s["cell_bold"]),
            p("Vendor must provide a transition plan for migration waves, dependencies, rollback, and service continuity.", s["cell"]),
            p("Mandatory", s["cell"]),
            p("Delivery", s["cell"]),
        ],
        [
            p("M-005", s["cell_bold"]),
            p("Proposal must include security control mapping aligned to ISO 27001 practices and audit evidence.", s["cell"]),
            p("Mandatory", s["cell"]),
            p("Security", s["cell"]),
        ],
        [
            p("P-001", s["cell_bold"]),
            p("Preference for a fixed-price transition model with clearly stated assumptions and exclusions.", s["cell"]),
            p("Preferred", s["cell"]),
            p("Finance", s["cell"]),
        ],
        [
            p("P-002", s["cell_bold"]),
            p("Preference for reusable migration accelerators, automated compliance checks, and release telemetry.", s["cell"]),
            p("Preferred", s["cell"]),
            p("Solution Architect", s["cell"]),
        ],
    ]
    table = Table(rows, colWidths=[0.65 * inch, 4.2 * inch, 0.9 * inch, 1.0 * inch], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e7f6f3")),
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def evaluation_table(s):
    rows = [
        [p("Evaluation Area", s["cell_bold"]), p("Weight", s["cell_bold"]), p("Notes", s["cell_bold"])],
        [p("Requirement coverage", s["cell"]), p("30%", s["cell"]), p("Mandatory requirements must be explicitly mapped and cited.", s["cell"])],
        [p("Solution approach", s["cell"]), p("20%", s["cell"]), p("Cloud migration wave plan, governance, and operational readiness.", s["cell"])],
        [p("Security and compliance", s["cell"]), p("20%", s["cell"]), p("Data residency, incident response, ISO-aligned controls, audit evidence.", s["cell"])],
        [p("Commercial model", s["cell"]), p("15%", s["cell"]), p("Fixed-price assumptions, exclusions, SLA penalties, and transition cost clarity.", s["cell"])],
        [p("Delivery confidence", s["cell"]), p("15%", s["cell"]), p("24x7 support, staffing, escalation, service continuity, and risk management.", s["cell"])],
    ]
    table = Table(rows, colWidths=[2.0 * inch, 0.8 * inch, 3.95 * inch], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f1f5f9")),
                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def build():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    s = styles()
    doc = SimpleDocTemplate(
        str(OUT_FILE),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.6 * inch,
        title="Northwind Bank Core Banking Cloud Migration RFP",
        author="BidForge Demo",
    )

    story = [
        p("Northwind Bank", s["title"]),
        p("Request for Proposal: Core Banking Cloud Migration and Managed Operations", s["subtitle"]),
        p("RFP ID: NWB-CLOUD-2026-001 | Issue date: July 2026 | Response due: 14 calendar days from issue", s["small"]),
        Spacer(1, 0.15 * inch),
        p("1. Executive Summary", s["h2"]),
        p(
            "Northwind Bank is seeking a strategic technology partner to migrate selected core banking workloads to a governed cloud operating model. The selected vendor will provide migration planning, application modernization support, security controls, service transition, and managed operations.",
            s["body"],
        ),
        p(
            "This is an anonymized demo RFP created for BidForge Agent testing. It contains realistic enterprise requirements but does not represent a real procurement event.",
            s["body"],
        ),
        p("2. Business Objectives", s["h2"]),
        p(
            "The bank wants to reduce infrastructure risk, improve release velocity, strengthen audit readiness, and establish resilient 24x7 operations. The proposal should explain how the vendor will govern migration waves, protect regulated data, maintain service continuity, and provide measurable delivery assurance.",
            s["body"],
        ),
        p("3. Scope of Work", s["h2"]),
        p(
            "The vendor will assess the existing estate, define the migration approach, prepare a wave plan, support modernization decisions, establish cloud landing-zone controls, transition services into managed operations, and provide reporting for risk, issues, service levels, and audit evidence.",
            s["body"],
        ),
        p("4. Mandatory and Preferred Requirements", s["h2"]),
        requirement_table(s),
        p("5. Security, Legal, and Compliance Expectations", s["h2"]),
        p(
            "The supplier must identify any data residency assumptions and must not claim compliance without evidence. The proposal should include security control mapping, incident response ownership, audit support, and a description of how regulated banking data will be protected during migration and operations.",
            s["body"],
        ),
        p(
            "Any subcontractor or offshore support model must be clearly described. If data or access may leave the European Union, the vendor must identify the legal basis, control process, approval requirement, and risk mitigation approach.",
            s["body"],
        ),
        p("6. Commercial and SLA Expectations", s["h2"]),
        p(
            "Northwind Bank prefers a fixed-price transition model, but all assumptions, exclusions, and dependencies must be explicit. Vendors must confirm whether 24x7 support is included in base pricing and describe any SLA penalty exposure, service credits, or commercial exceptions.",
            s["body"],
        ),
        p("7. Response Format", s["h2"]),
        p(
            "The response must include an executive summary, compliance matrix, solution approach, transition plan, security and compliance section, commercial response, risk register, assumptions, and evidence appendix. Each mandatory requirement must be mapped to the proposal section where it is addressed.",
            s["body"],
        ),
        p("8. Evaluation Criteria", s["h2"]),
        evaluation_table(s),
        p("9. Questions for Vendors", s["h2"]),
        p("Vendors should answer the following questions in the proposal:", s["body"]),
        p("1. How will you maintain service continuity during migration waves?", s["body"]),
        p("2. What controls prove EU data residency and audit readiness?", s["body"]),
        p("3. How will incidents be escalated, reported, and remediated?", s["body"]),
        p("4. What assumptions are required for fixed-price transition pricing?", s["body"]),
        p("5. Which reusable accelerators or automation assets will reduce delivery risk?", s["body"]),
        p("10. Submission Instructions", s["h2"]),
        p(
            "Responses must be submitted as a single PDF package with appendices. The bank reserves the right to request clarifications from legal, finance, security, and delivery representatives before final evaluation.",
            s["body"],
        ),
    ]

    doc.build(story)
    print(OUT_FILE)


if __name__ == "__main__":
    build()
