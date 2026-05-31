"""
One-time script to translate faqs.json -> faqs_hi.json using Google Translate (free).
Uses the deep-translator library — no API key or quota needed.
Resumable: saves progress after each section.

Usage:
  cd backend
  python translate_faqs.py
"""

import json
import os
import re
import sys
import time
from deep_translator import GoogleTranslator

# Force UTF-8 output on Windows consoles
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FAQS_PATH = os.path.join(BASE_DIR, "faqs.json")
OUTPUT_PATH = os.path.join(BASE_DIR, "faqs_hi.json")

translator = GoogleTranslator(source='en', target='hi')

# Proper nouns to preserve (will be protected during translation)
PROTECTED_TERMS = [
    "Vicharanashala", "VINS", "VISE", "ViBe", "IIT Ropar",
    "samagama.in", "Yaksha", "Annam.AI", "Rosetta", "Spurti Points",
    "NOC", "Discord", "Zoom", "GitHub", "Bronze", "Silver", "Gold",
    "Platinum", "VINS result panel",
]


def protect_terms(text):
    """Replace proper nouns with placeholders before translation."""
    mapping = {}
    for i, term in enumerate(PROTECTED_TERMS):
        placeholder = f"__PROT{i}__"
        if term in text:
            text = text.replace(term, placeholder)
            mapping[placeholder] = term
    return text, mapping


def restore_terms(text, mapping):
    """Restore proper nouns from placeholders after translation."""
    for placeholder, original in mapping.items():
        text = text.replace(placeholder, original)
    return text


def translate_text(text):
    """Translate a plain text string to Hindi, preserving proper nouns."""
    if not text or not text.strip():
        return text

    protected, mapping = protect_terms(text)
    try:
        translated = translator.translate(protected)
        if translated:
            return restore_terms(translated, mapping)
    except Exception as e:
        print(f"    [WARN] Translation error: {e}")
    return text  # Fallback: return original


def translate_html(html_text):
    """Translate HTML content to Hindi, preserving all HTML tags."""
    if not html_text or not html_text.strip():
        return html_text

    # Split the HTML into tags and text segments
    parts = re.split(r'(<[^>]+>)', html_text)
    translated_parts = []

    for part in parts:
        if part.startswith('<') and part.endswith('>'):
            # It's an HTML tag — keep as-is
            translated_parts.append(part)
        elif part.strip():
            # It's text content — translate it
            translated_parts.append(translate_text(part))
            time.sleep(0.3)  # Small delay to avoid rate limiting
        else:
            translated_parts.append(part)

    return ''.join(translated_parts)


def load_progress():
    """Load already-translated sections from partial output file."""
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_progress(translated_sections):
    """Save current progress to output file."""
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(translated_sections, f, ensure_ascii=False, indent=2)


def main():
    with open(FAQS_PATH, "r", encoding="utf-8") as f:
        sections = json.load(f)

    # Resume from where we left off
    translated_sections = load_progress()
    completed_ids = {s["id"] for s in translated_sections}

    if completed_ids:
        print(f"Resuming: {len(completed_ids)} sections already translated.\n")

    total_questions = sum(len(s["questions"]) for s in translated_sections)

    for sec_idx, section in enumerate(sections):
        if section["id"] in completed_ids:
            print(f"[Section {sec_idx + 1}/{len(sections)}] {section['title']} -- already done, skipping")
            continue

        print(f"\n[Section {sec_idx + 1}/{len(sections)}] {section['title']}")

        # Translate section title
        hi_title = translate_text(section["title"])
        print(f"   -> {hi_title}")

        # Translate each question in this section
        translated_questions = []
        questions = section["questions"]

        for q_idx, q in enumerate(questions):
            print(f"   Q{q_idx + 1}/{len(questions)}: translating...", end="")

            hi_question = translate_text(q["question"])
            time.sleep(0.3)
            hi_answer = translate_html(q["answer"])

            translated_questions.append({
                "id": q["id"],
                "section_id": q["section_id"],
                "question": hi_question,
                "answer": hi_answer,
            })

            print(f" done")
            time.sleep(0.5)  # Courtesy delay

        translated_sections.append({
            "id": section["id"],
            "title": hi_title,
            "questions": translated_questions,
        })
        total_questions += len(questions)

        # Save after each section so progress is not lost
        save_progress(translated_sections)
        print(f"   [Saved] Progress: {len(translated_sections)}/{len(sections)} sections")

    print(f"\n[DONE] Translated {total_questions} questions across {len(translated_sections)} sections.")
    print(f"Output: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
