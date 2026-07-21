from datetime import datetime

from sqlalchemy import func

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

from app.models.news import News
from app.models.notification import Notification
from app.models.user import User
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle

def generate_admin_report(db, file_path: str):
    """
    Generate TechPulse AI admin report as PDF.
    """

    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(file_path)
    story = []

    # Title
    story.append(
        Paragraph(
            "<b>TechPulse AI - Platform Report</b>",
            styles["Title"],
        )
    )

    story.append(Spacer(1, 0.5 * cm))

    story.append(
        Paragraph(
            f"Generated: {datetime.now().strftime('%d.%m.%Y %H:%M')}",
            styles["Normal"],
        )
    )

    story.append(Spacer(1, 1 * cm))

    # Statistics
    total_users = db.query(User).count()
    total_news = db.query(News).count()
    total_notifications = db.query(Notification).count()

    ai_articles = (
        db.query(News)
        .filter(News.category == "AI")
        .count()
    )

    critical_alerts = (
        db.query(News)
        .filter(News.risk_level == "Critical")
        .count()
    )

    story.append(
        Paragraph(
            "<b>Platform Statistics</b>",
            styles["Heading2"],
        )
    )

    stats_table = Table(
    [
        ["Metric", "Value"],
        ["Users", total_users],
        ["Articles", total_news],
        ["Notifications", total_notifications],
        ["AI Articles", ai_articles],
        ["Critical Alerts", critical_alerts],
    ],
    colWidths=[9 * cm, 4 * cm],
)

    stats_table.setStyle(
     TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
    ])
)

    story.append(stats_table)

    story.append(Spacer(1, 0.8 * cm))

    # Category Distribution
    story.append(
        Paragraph(
            "<b>Category Distribution</b>",
            styles["Heading2"],
        )
    )

    categories = (
        db.query(
            News.category,
            func.count(News.id),
        )
        .filter(News.category.isnot(None))
        .group_by(News.category)
        .order_by(func.count(News.id).desc())
        .all()
    )

    category_data = [["Category", "Articles"]]

    for category, count in categories:
      category_data.append([category, count])

    category_table = Table(
      category_data,
      colWidths=[9 * cm, 4 * cm],
)

    category_table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.darkgreen),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ])
)

    story.append(category_table)

    story.append(Spacer(1, 0.8 * cm))

    # Risk Levels
    story.append(
        Paragraph(
            "<b>Risk Level Distribution</b>",
            styles["Heading2"],
        )
    )

    risk_levels = (
        db.query(
            News.risk_level,
            func.count(News.id),
        )
        .filter(News.risk_level.isnot(None))
        .group_by(News.risk_level)
        .order_by(func.count(News.id).desc())
        .all()
    )

    risk_data = [["Risk Level", "Count"]]

    for risk, count in risk_levels:
     risk_data.append([risk, count])

    risk_table = Table(
     risk_data,
    colWidths=[9 * cm, 4 * cm],
)

    risk_table.setStyle(
    TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.orange),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ])
)

    story.append(risk_table)

    story.append(Spacer(1, 0.8 * cm))

    # Top Sources
    story.append(
        Paragraph(
            "<b>Top News Sources</b>",
            styles["Heading2"],
        )
    )

    sources = (
        db.query(
            News.source,
            func.count(News.id),
        )
        .filter(News.source.isnot(None))
        .group_by(News.source)
        .order_by(func.count(News.id).desc())
        .limit(10)
        .all()
    )

    source_data = [["Source", "Articles"]]

    for source, count in sources:
     source_data.append([source, count])

    source_table = Table(
     source_data,
    colWidths=[9 * cm, 4 * cm],
)

    source_table.setStyle(
     TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7C3AED")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ])
)

    story.append(source_table)

    story.append(Spacer(1, 0.8 * cm))

    # Latest Critical Alerts
    story.append(
        Paragraph(
            "<b>Latest Critical Alerts</b>",
            styles["Heading2"],
        )
    )

    critical_news = (
        db.query(News)
        .filter(News.risk_level == "Critical")
        .order_by(News.published_at.desc())
        .limit(5)
        .all()
    )

    if critical_news:
        for news in critical_news:
            story.append(
                Paragraph(
                    f"• {news.title}",
                    styles["Normal"],
                )
            )
    else:
        story.append(
            Paragraph(
                "No critical alerts found.",
                styles["Normal"],
            )
        )

    story.append(Spacer(1, 1 * cm))

    # Footer
    # Footer
    story.append(
     Paragraph(
        "<b>Generated by TechPulse AI</b>",
        styles["Italic"],
    )
)

    story.append(Spacer(1, 0.2 * cm))

    story.append(
    Paragraph(
        "Developer: <b>Eren Deniz</b>",
        styles["Normal"],
    )
)

    story.append(
    Paragraph(
        f"Report generated on {datetime.now().strftime('%d.%m.%Y %H:%M')}",
        styles["Normal"],
    )
)

    doc.build(story)

    return file_path