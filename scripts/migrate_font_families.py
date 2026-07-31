#!/usr/bin/env python3
"""
LNKICKS — next/font migration: inline fontFamily rewriter.

Replaces every inline fontFamily reference to Google-CDN-loaded
fonts with the corresponding CSS variable exposed by next/font/google
in app/layout.tsx.

Mapping:
    'Oswald', sans-serif           -> var(--font-oswald), sans-serif
    'Playfair Display', serif      -> var(--font-playfair), serif
    'Inter', sans-serif            -> var(--font-inter), sans-serif

Scope:
    All *.tsx and *.ts files under app/ and components/.

The script is idempotent: running it twice produces the same output
because the source patterns are quoted font names that no longer
appear after the first pass.
"""

from pathlib import Path
import sys

ROOT = Path('/home/z/my-project')
SCAN_DIRS = [ROOT / 'app', ROOT / 'components']

# Order matters: replace 'Playfair Display' before 'Playfair' would
# match anything else (defensive — there are no other Playfair refs
# in the codebase, but this protects against future edits).
REPLACEMENTS = [
    ("'Oswald', sans-serif",          "var(--font-oswald), sans-serif"),
    ('"Oswald", sans-serif',          "var(--font-oswald), sans-serif"),
    ("'Playfair Display', serif",     "var(--font-playfair), serif"),
    ('"Playfair Display", serif',     "var(--font-playfair), serif"),
    ("'Inter', sans-serif",           "var(--font-inter), sans-serif"),
    ('"Inter", sans-serif',           "var(--font-inter), sans-serif"),
]

total_files_modified = 0
total_replacements = 0

for scan_dir in SCAN_DIRS:
    if not scan_dir.exists():
        continue
    for path in sorted(scan_dir.rglob('*')):
        if not path.is_file():
            continue
        if path.suffix not in ('.tsx', '.ts'):
            continue
        original = path.read_text(encoding='utf-8')
        updated = original
        per_file_count = 0
        for old, new in REPLACEMENTS:
            count = updated.count(old)
            if count:
                updated = updated.replace(old, new)
                per_file_count += count
        if updated != original:
            path.write_text(updated, encoding='utf-8')
            total_files_modified += 1
            total_replacements += per_file_count
            print(f"  {path.relative_to(ROOT)}: {per_file_count} replacement(s)")

print(f"\nDone. Modified {total_files_modified} file(s), {total_replacements} replacement(s) total.")
