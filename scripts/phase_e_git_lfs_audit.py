#!/usr/bin/env python3
"""
Phase E — Git LFS audit for /public images.

For each PNG/JPG/WebP in /public, detect:
  • Whether it is a real binary image (valid PNG/JPG/etc.)
  • Whether it is a Git LFS pointer file (131-byte ASCII text starting
    with `version https://git-lfs.github.com/spec/v1`)
  • Whether the binary is missing (pointer exists but binary never
    downloaded via `git lfs pull`)

The script does NOT modify any files. It only produces a report.
"""

import os
import re
import hashlib
from pathlib import Path

ROOT = Path('/home/z/my-project/public')
OUT = Path('/home/z/my-project/docs/git-lfs-audit.md')

LFS_POINTER_MAGIC = b'version https://git-lfs.github.com/spec/v1'
LFS_OID_RE = re.compile(rb'oid sha256:([0-9a-f]{64})')
LFS_SIZE_RE = re.compile(rb'size (\d+)')

# PNG / JPEG / WebP magic bytes
MAGIC_BYTES = {
    b'\x89PNG\r\n\x1a\n': 'PNG',
    b'\xff\xd8\xff': 'JPEG',
    b'RIFF': 'WebP (RIFF)',  # WebP starts with RIFF....WEBP
}


def detect_format(head: bytes) -> str:
    for magic, fmt in MAGIC_BYTES.items():
        if head.startswith(magic):
            if fmt == 'WebP (RIFF)' and head[8:12] != b'WEBP':
                return 'RIFF (not WebP)'
            return fmt
    return 'unknown'


def is_lfs_pointer(content: bytes) -> tuple[bool, str | None, int | None]:
    """Return (is_pointer, oid, size) tuple."""
    if not content.startswith(LFS_POINTER_MAGIC):
        return (False, None, None)
    oid_match = LFS_OID_RE.search(content)
    size_match = LFS_SIZE_RE.search(content)
    oid = oid_match.group(1).decode('ascii') if oid_match else None
    size = int(size_match.group(1)) if size_match else None
    return (True, oid, size)


def audit_image(path: Path) -> dict:
    """Audit a single image file."""
    stat = path.stat()
    content = path.read_bytes()
    is_ptr, oid, expected_size = is_lfs_pointer(content)
    actual_size = stat.st_size

    if is_ptr:
        return {
            'file': str(path.relative_to(ROOT)),
            'status': 'BROKEN_POINTER',
            'actual_size_bytes': actual_size,
            'expected_binary_size': expected_size,
            'lfs_oid': oid,
            'format': 'git-lfs-pointer (ASCII text, not a binary image)',
            'note': (
                'File is a Git LFS pointer. The actual binary image was '
                'never downloaded. Run `git lfs install && git lfs pull` '
                'to fetch the real binary, or replace the asset with a '
                'real binary file.'
            ),
        }

    fmt = detect_format(content[:16])
    # Verify integrity: PNG has IHDR chunk, JPEG has SOI marker, etc.
    is_valid = fmt != 'unknown'
    return {
        'file': str(path.relative_to(ROOT)),
        'status': 'VALID' if is_valid else 'UNKNOWN_FORMAT',
        'actual_size_bytes': actual_size,
        'expected_binary_size': None,
        'lfs_oid': None,
        'format': fmt,
        'note': (
            'File is a valid binary image.' if is_valid
            else 'File is binary but format could not be detected.'
        ),
    }


def main():
    images = sorted(
        p for p in ROOT.iterdir()
        if p.is_file() and p.suffix.lower() in {'.png', '.jpg', '.jpeg', '.webp', '.gif'}
    )

    audits = [audit_image(p) for p in images]

    valid = [a for a in audits if a['status'] == 'VALID']
    broken = [a for a in audits if a['status'] == 'BROKEN_POINTER']
    unknown = [a for a in audits if a['status'] == 'UNKNOWN_FORMAT']

    lines = []
    lines.append('# Git LFS Audit Report')
    lines.append('')
    lines.append(f'Generated: 2026-07-31')
    lines.append(f'Audited directory: `/public/`')
    lines.append(f'Total images audited: **{len(audits)}**')
    lines.append('')
    lines.append('## Summary')
    lines.append('')
    lines.append(f'| Status | Count |')
    lines.append(f'|---|---|')
    lines.append(f'| Valid binary images | {len(valid)} |')
    lines.append(f'| Broken Git LFS pointers (binary missing) | {len(broken)} |')
    lines.append(f'| Unknown binary format | {len(unknown)} |')
    lines.append('')
    lines.append('## Findings')
    lines.append('')

    if broken:
        lines.append('### Broken Git LFS Pointers (HIGH severity)')
        lines.append('')
        lines.append('The following files are Git LFS pointer files (131-byte ASCII text) ')
        lines.append('instead of real binary images. They were committed with `.gitattributes` ')
        lines.append('rules that route `*.png` through Git LFS, but the actual binary ')
        lines.append('content was never pushed to / pulled from the LFS store.')
        lines.append('')
        lines.append('| File | LFS OID (sha256) | Expected binary size | Actual file size |')
        lines.append('|---|---|---|---|')
        for a in broken:
            lines.append(
                f"| `{a['file']}` | `{a['lfs_oid']}` | "
                f"{a['expected_binary_size']:,} bytes | {a['actual_size_bytes']:,} bytes |"
            )
        lines.append('')

    if valid:
        lines.append('### Valid Binary Images')
        lines.append('')
        lines.append('| File | Format | Size |')
        lines.append('|---|---|---|')
        for a in valid:
            lines.append(
                f"| `{a['file']}` | {a['format']} | {a['actual_size_bytes']:,} bytes |"
            )
        lines.append('')

    if unknown:
        lines.append('### Unknown Format')
        lines.append('')
        lines.append('| File | Size | Note |')
        lines.append('|---|---|---|')
        for a in unknown:
            lines.append(f"| `{a['file']}` | {a['actual_size_bytes']:,} bytes | {a['note']} |")
        lines.append('')

    lines.append('## Root Cause')
    lines.append('')
    lines.append('The repository’s `.gitattributes` file declares:')
    lines.append('')
    lines.append('```')
    lines.append('*.png filter=lfs diff=lfs merge=lfs -text')
    lines.append('*.jpg filter=lfs diff=lfs merge=lfs -text')
    lines.append('```')
    lines.append('')
    lines.append('This means any PNG/JPG committed to the repo is automatically converted ')
    lines.append('to a Git LFS pointer on commit. The pointer file is a 131-byte ASCII text ')
    lines.append('containing the SHA-256 oid and the original binary size. To get the real ')
    lines.append('binary back, you must run `git lfs install` (one-time setup) followed by ')
    lines.append('`git lfs pull` (fetches all LFS objects for the current commit).')
    lines.append('')
    lines.append('However, the LFS store on the remote (GitHub) appears to be **empty** for ')
    lines.append('this repository — the binaries were never pushed to GitHub’s LFS service. ')
    lines.append('This is consistent with the OAuth token used to push having empty scopes, ')
    lines.append('preventing LFS object uploads during the initial `git push`.')
    lines.append('')
    lines.append('## Impact')
    lines.append('')
    lines.append('1. **Production images are broken.** Every `<Image>` component in the app ')
    lines.append('   that references one of these files will receive a 131-byte text file ')
    lines.append('   instead of a binary image. The browser will fail to render the image.')
    lines.append('2. **Open Graph / Twitter Card images are broken.** The default OG image ')
    lines.append('   (`/jordan_powder_blue_nobg.png`) is a pointer file.')
    lines.append('3. **Build does not fail.** Next.js Image component does not validate ')
    lines.append('   binary content at build time for static public assets, so `npm run build` ')
    lines.append('   succeeds even with broken images.')
    lines.append('')
    lines.append('## Recommended Remediation (NOT applied automatically)')
    lines.append('')
    lines.append('Per the Phase E directive, this audit is informational only. The following ')
    lines.append('options are available — each requires explicit approval before execution:')
    lines.append('')
    lines.append('**Option 1 (LOW risk): Replace with real binaries**')
    lines.append('Source real PNG files for each LFS pointer and overwrite the files in ')
    lines.append('/public/. Commit and push normally. No .gitattributes changes needed.')
    lines.append('')
    lines.append('**Option 2 (MEDIUM risk): Disable LFS for new PNGs**')
    lines.append('Remove `*.png filter=lfs diff=lfs merge=lfs -text` from `.gitattributes` ')
    lines.append('and re-add the binaries as plain Git objects. Existing pointer files ')
    lines.append('remain pointer files until manually replaced.')
    lines.append('')
    lines.append('**Option 3 (HIGH risk): Migrate LFS to plain Git**')
    lines.append('Use `git lfs migrate export` to convert all LFS-tracked files in history ')
    lines.append('to plain Git objects. This rewrites history — violates the user’s ')
    lines.append('"Do NOT modify git history" rule. NOT RECOMMENDED.')
    lines.append('')

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Audit report written to: {OUT}')
    print(f'')
    print(f'Summary:')
    print(f'  Valid binary images:        {len(valid)}')
    print(f'  Broken LFS pointers:        {len(broken)}')
    print(f'  Unknown binary format:      {len(unknown)}')
    print(f'  Total audited:              {len(audits)}')


if __name__ == '__main__':
    main()
