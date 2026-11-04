"""Build the public resume from the same factual text used by the assistant.
Requires reportlab. Run from the repository root: python3 scripts/build-resume.py
"""
from pathlib import Path
import re
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

root = Path(__file__).resolve().parents[1]
text = (root / 'lib/knowledge/resume.ts').read_text().split('export const RESUME = `', 1)[1].rsplit('`;', 1)[0]
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name', fontName='Helvetica-Bold', fontSize=24, leading=27, spaceAfter=7))
styles.add(ParagraphStyle(name='Contact', fontName='Helvetica', fontSize=9, leading=13, textColor=colors.HexColor('#444444'), spaceAfter=6))
styles.add(ParagraphStyle(name='Summary', fontName='Helvetica', fontSize=10, leading=14, spaceAfter=12))
styles.add(ParagraphStyle(name='Section', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=colors.HexColor('#11645B'), spaceBefore=10, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle(name='Role', fontName='Helvetica-Bold', fontSize=10, leading=14, spaceBefore=7, spaceAfter=4, keepWithNext=True))
styles.add(ParagraphStyle(name='BulletText', fontName='Helvetica', fontSize=9.1, leading=12.8, leftIndent=10, firstLineIndent=-8, spaceAfter=4))
styles.add(ParagraphStyle(name='PlainText', fontName='Helvetica', fontSize=9.1, leading=12.8, spaceAfter=4))

story = []
for line in text.splitlines():
    if not line.strip():
        continue
    if line.startswith('# '):
        story.append(Paragraph(escape(line[2:]), styles['Name']))
    elif line.startswith('San Diego, California -'):
        story.append(Paragraph('San Diego, California | <link href="mailto:themichaellock@gmail.com">themichaellock@gmail.com</link><br/>(309) 229-4301 | <link href="https://www.michael-lock.com">michael-lock.com</link> | <link href="https://linkedin.com/in/michael--lock/">LinkedIn</link> | <link href="https://github.com/milock">GitHub</link>', styles['Contact']))
    elif line.startswith('Principal Product Marketer at Super Green -'):
        story.append(Paragraph(escape(line.replace(' - ', ' | ')), styles['Summary']))
    elif line.startswith('### '):
        title = line[4:]
        # Break long employer/location lines at predictable boundaries.
        pieces = title.split(' - ')
        heading = escape(' | '.join(pieces[:2]))
        if len(pieces) > 2:
            heading += '<br/><font name="Helvetica" size="9" color="#555555">' + escape(' | '.join(pieces[2:])) + '</font>'
        story.append(Paragraph(heading, styles['Role']))
    elif line.startswith('## '):
        story.append(Paragraph(escape(line[3:]), styles['Section']))
    elif line.startswith('- '):
        content = line[2:].replace('Current employer. ', '').replace('I own narrative', 'Own narrative').replace('My work includes', 'Work includes')
        story.append(Paragraph('&#8226; ' + escape(content), styles['BulletText']))
    else:
        story.append(Paragraph(escape(line), styles['PlainText']))

story.append(Paragraph('Selected projects', styles['Section']))
for name, desc, href in [
    ('Humanizer', 'An open-source writing skill for reviewing AI-generated prose while preserving voice and facts.', 'https://github.com/milock/humanizer'),
    ('Polysearch', 'A multi-source research pipeline with citation verification.', 'https://github.com/milock/polysearch'),
    ('Thriftly', 'A map for finding thrift stores using neighborhood Census data and explainable scoring.', 'https://thriftly.xyz'),
]:
    story.append(Paragraph(f'<b><link href="{href}">{name}</link></b> | {escape(desc)}', styles['PlainText']))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#777777'))
    canvas.drawString(43, 27, 'Michael Lock | michael-lock.com')
    canvas.drawRightString(A4[0]-43, 27, str(doc.page))
    canvas.restoreState()

out = root / 'public/michael-lock-resume.pdf'
doc = SimpleDocTemplate(str(out), pagesize=A4, leftMargin=43, rightMargin=43, topMargin=37, bottomMargin=42, title='Michael Lock | Resume', author='Michael Lock')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(out)
