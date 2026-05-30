import re
import json
import html

file_path = r'C:\Users\LENOVO\.gemini\antigravity\brain\d7ae40e5-6ace-450f-b6be-c61700e68a87\.system_generated\steps\5\content.md'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to capture FAQ questions and answers
# <details class="faq-q" id="..."> ... <summary>...</summary> ... </details>
pattern = re.compile(
    r'<details class="faq-q" id="([^"]+)">\s*<summary>(.*?)(?:<a class="anchor".*?)?</summary>(.*?)</details>',
    re.DOTALL | re.IGNORECASE
)

faqs = []
for match in pattern.finditer(content):
    q_id = match.group(1).strip()
    question = match.group(2).strip()
    # Strip any remaining anchor tags if they weren't caught by the optional group
    question = re.sub(r'<a .*?>.*?</a>', '', question).strip()
    question = html.unescape(question)
    answer = html.unescape(match.group(3).strip())

    
    # Try to determine the section based on the q_id (e.g. q-1-1 -> section 1)
    section_match = re.match(r'q-(\d+)-', q_id)
    section_id = int(section_match.group(1)) if section_match else 0
    
    faqs.append({
        'id': q_id,
        'section_id': section_id,
        'question': question,
        'answer': answer
    })

section_titles = {
    1: "About the internship",
    2: "Timing and dates",
    3: "NOC (No Objection Certificate)",
    4: "Selection, offer letter, and certificate",
    5: "Work, mentorship, and projects",
    6: "Code of conduct — communication channels",
    7: "Interviews Related",
    8: "Certificate",
    9: "Rosetta — your internship journal",
    10: "Phase 1 — coursework, Vibe LMS, and live sessions",
    11: "Spurti Points",
    12: "Yaksha Chat Related",
    13: "ViBe Platform",
    14: "Team Formation"
}

# Group into sections
sections = []
for sec_id, title in section_titles.items():
    sec_faqs = [faq for faq in faqs if faq['section_id'] == sec_id]
    if sec_faqs:
        sections.append({
            'id': f's-{sec_id}',
            'title': f'{sec_id}. {title}',
            'questions': sec_faqs
        })

output_js = json.dumps(sections, indent=2)

# Output to faqs.json
with open(r'd:\Projects\IIT-Ropar\backend\faqs.json', 'w', encoding='utf-8') as f:
    f.write(output_js)

print(f"Successfully extracted {len(faqs)} questions across {len(sections)} sections.")
