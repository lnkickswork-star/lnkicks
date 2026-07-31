#!/usr/bin/env python3
"""
Phase B — Convert all dangerouslySetInnerHTML pages to React Server Components.

These pages contain only static HTML strings (no useState, useEffect, event
handlers, or browser APIs). They can be RSC even with dangerouslySetInnerHTML.
Removing 'use client' from these pages eliminates them from the client bundle.
"""

import os
import re
from pathlib import Path

ROOT = Path('/home/z/my-project/app')

# Pages identified as CAT-RSC and currently containing dangerouslySetInnerHTML
TARGETS = [
    'shipping-policy/page.tsx',
    'terms-conditions/page.tsx',
    'edit-product/page.tsx',
    'cancellation-policy/page.tsx',
    'customers-management/page.tsx',
    'orders-management/page.tsx',
    'notification-settings/page.tsx',
    'settings-panel/page.tsx',
    'faqs/page.tsx',
    'privacy-policy/page.tsx',
    'return-refund-policy/page.tsx',
    'reports-analytics/page.tsx',
    'size-guide/page.tsx',
    'add-product/page.tsx',
    'contact-us/page.tsx',
    'order-detail/page.tsx',
    'payment-methods/page.tsx',
    'addresses/page.tsx',
]

modified = 0
skipped = 0

for rel in TARGETS:
    path = ROOT / rel
    if not path.exists():
        print(f"SKIP (missing): {rel}")
        skipped += 1
        continue

    text = path.read_text(encoding='utf-8')
    original = text

    # Remove the 'use client' directive (with optional single/double quotes)
    text = re.sub(r"^'use client';?\s*\n", '', text, count=1, flags=re.MULTILINE)
    text = re.sub(r'^"use client";?\s*\n', '', text, count=1, flags=re.MULTILINE)

    if text == original:
        print(f"SKIP (no 'use client' found): {rel}")
        skipped += 1
        continue

    path.write_text(text, encoding='utf-8')
    print(f"MODIFIED: {rel}")
    modified += 1

print(f"\nDone. Modified: {modified}, Skipped: {skipped}")
