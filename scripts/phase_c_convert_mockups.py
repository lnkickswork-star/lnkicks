#!/usr/bin/env python3
"""
Phase C — Convert dangerouslySetInnerHTML mockup pages to real JSX.

Each mockup page contains a single `dangerouslySetInnerHTML={{ __html: \`...\` }}`
blob with raw HTML. This script:

1. Extracts the HTML string from each page.
2. Applies mechanical HTML→JSX transformations:
   - class → className
   - for → htmlFor
   - tabindex → tabIndex
   - autocapitalize → autoCapitalize
   - self-closes void elements (img, input, br, hr, meta, link, path, circle, etc.)
   - drops the legacy `<script src="js/app.js"></script>` (always 404'd)
   - converts HTML comments `<!-- -->` to JSX `{/* */}`
   - converts inline style="..." strings to React style={{...}} objects
3. Wraps the JSX in a React fragment and writes the file back.

External image URLs (lh3.googleusercontent.com) are converted to next/image
with `unoptimized` to avoid needing remotePatterns config (the mockup images
were broken external URLs in the original).

The visual appearance is preserved because the Tailwind-style class names
(bg-surface, text-primary, etc.) had no CSS rules attached — they were
no-ops in the original. Default browser styling for headings, paragraphs,
tables, and lists renders identically.
"""

import os
import re
import sys
from pathlib import Path

ROOT = Path('/home/z/my-project/app')

# Pages to convert
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

# Void HTML elements that need to be self-closed in JSX.
# SVG elements (path, circle, rect, line, polyline, polygon, ellipse, use, stop)
# are intentionally NOT in this set — they can appear with explicit closing
# tags (`<path></path>`) in the source HTML, and auto-self-closing those would
# produce orphaned `</path>` tags. SVG elements support both forms natively.
VOID_TAGS = {
    'img', 'input', 'br', 'hr', 'meta', 'link', 'col',
    'area', 'base', 'embed', 'source', 'track', 'wbr',
}

# Attributes that need to be camelCased in JSX
ATTR_RENAMES = {
    'class': 'className',
    'for': 'htmlFor',
    'tabindex': 'tabIndex',
    'autocapitalize': 'autoCapitalize',
    'autocomplete': 'autoComplete',
    'autofocus': 'autoFocus',
    'colspan': 'colSpan',
    'rowspan': 'rowSpan',
    'crossorigin': 'crossOrigin',
    'datetime': 'dateTime',
    'enctype': 'encType',
    'formaction': 'formAction',
    'formenctype': 'formEncType',
    'formmethod': 'formMethod',
    'formnovalidate': 'formNoValidate',
    'formtarget': 'formTarget',
    'hreflang': 'hrefLang',
    'inputmode': 'inputMode',
    'maxlength': 'maxLength',
    'minlength': 'minLength',
    'novalidate': 'noValidate',
    'readonly': 'readOnly',
    'spellcheck': 'spellCheck',
    'srcset': 'srcSet',
    'srclang': 'srcLang',
    'usemap': 'useMap',
    'viewbox': 'viewBox',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'fill-opacity': 'fillOpacity',
    'stroke-opacity': 'strokeOpacity',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'text-anchor': 'textAnchor',
    'aria-labelledby': 'aria-labelledby',  # already correct
    'aria-label': 'aria-label',
    'aria-hidden': 'aria-hidden',
    'aria-current': 'aria-current',
    'aria-expanded': 'aria-expanded',
    'aria-controls': 'aria-controls',
    'aria-describedby': 'aria-describedby',
    'aria-pressed': 'aria-pressed',
    'aria-selected': 'aria-selected',
    'data-alt': 'data-alt',
    'data-icon': 'data-icon',
}

# CSS property name → React camelCase
CSS_KEY_RENAMES = {
    'font-variation-settings': 'fontVariationSettings',
    'background-color': 'backgroundColor',
    'border-color': 'borderColor',
    'border-radius': 'borderRadius',
    'border-width': 'borderWidth',
    'border-style': 'borderStyle',
    'border-top': 'borderTop',
    'border-bottom': 'borderBottom',
    'border-left': 'borderLeft',
    'border-right': 'borderRight',
    'color': 'color',
    'background': 'background',
    'font-size': 'fontSize',
    'font-weight': 'fontWeight',
    'font-family': 'fontFamily',
    'font-style': 'fontStyle',
    'line-height': 'lineHeight',
    'letter-spacing': 'letterSpacing',
    'text-align': 'textAlign',
    'text-decoration': 'textDecoration',
    'text-transform': 'textTransform',
    'text-indent': 'textIndent',
    'margin': 'margin',
    'margin-top': 'marginTop',
    'margin-bottom': 'marginBottom',
    'margin-left': 'marginLeft',
    'margin-right': 'marginRight',
    'padding': 'padding',
    'padding-top': 'paddingTop',
    'padding-bottom': 'paddingBottom',
    'padding-left': 'paddingLeft',
    'padding-right': 'paddingRight',
    'width': 'width',
    'height': 'height',
    'min-width': 'minWidth',
    'min-height': 'minHeight',
    'max-width': 'maxWidth',
    'max-height': 'maxHeight',
    'top': 'top',
    'bottom': 'bottom',
    'left': 'left',
    'right': 'right',
    'position': 'position',
    'display': 'display',
    'flex': 'flex',
    'flex-direction': 'flexDirection',
    'flex-wrap': 'flexWrap',
    'flex-grow': 'flexGrow',
    'flex-shrink': 'flexShrink',
    'flex-basis': 'flexBasis',
    'justify-content': 'justifyContent',
    'align-items': 'alignItems',
    'align-self': 'alignSelf',
    'align-content': 'alignContent',
    'gap': 'gap',
    'grid-template-columns': 'gridTemplateColumns',
    'grid-template-rows': 'gridTemplateRows',
    'grid-column': 'gridColumn',
    'grid-row': 'gridRow',
    'grid-area': 'gridArea',
    'object-fit': 'objectFit',
    'object-position': 'objectPosition',
    'overflow': 'overflow',
    'overflow-x': 'overflowX',
    'overflow-y': 'overflowY',
    'z-index': 'zIndex',
    'opacity': 'opacity',
    'box-shadow': 'boxShadow',
    'box-sizing': 'boxSizing',
    'transform': 'transform',
    'transition': 'transition',
    'cursor': 'cursor',
    'outline': 'outline',
    'outline-offset': 'outlineOffset',
    'list-style': 'listStyle',
    'list-style-type': 'listStyleType',
    'list-style-position': 'listStylePosition',
    'white-space': 'whiteSpace',
    'word-break': 'wordBreak',
    'word-wrap': 'wordWrap',
    'vertical-align': 'verticalAlign',
    'visibility': 'visibility',
    'pointer-events': 'pointerEvents',
    'user-select': 'userSelect',
    'aspect-ratio': 'aspectRatio',
    'filter': 'filter',
    'backdrop-filter': 'backdropFilter',
    'mask': 'mask',
    'animation': 'animation',
    'will-change': 'willChange',
    'writing-mode': 'writingMode',
    'direction': 'direction',
    'unicode-bidi': 'unicodeBidi',
    'content': 'content',
    'quotes': 'quotes',
    'caret-color': 'caretColor',
    'resize': 'resize',
    'table-layout': 'tableLayout',
    'border-collapse': 'borderCollapse',
    'border-spacing': 'borderSpacing',
    'caption-side': 'captionSide',
    'empty-cells': 'emptyCells',
    'clip-path': 'clipPath',
    'mask-image': 'maskImage',
    'mask-size': 'maskSize',
    'mask-repeat': 'maskRepeat',
    'mask-position': 'maskPosition',
    'fill': 'fill',
    'stroke': 'stroke',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-miterlimit': 'strokeMiterlimit',
}


def extract_html_blob(text: str) -> str | None:
    """Extract the HTML string from `dangerouslySetInnerHTML={{ __html: \`...\` }}`."""
    # Match the template literal inside __html: `...`
    m = re.search(
        r"dangerouslySetInnerHTML=\{\{\s*__html:\s*`([^`]*)`\s*\}\}",
        text,
        re.DOTALL,
    )
    return m.group(1) if m else None


def convert_style_string(style_value: str) -> str:
    """Convert a CSS style string `key: val; key2: val2;` to a React style object string."""
    pairs = []
    for declaration in style_value.split(';'):
        declaration = declaration.strip()
        if not declaration or ':' not in declaration:
            continue
        key, _, val = declaration.partition(':')
        key = key.strip()
        val = val.strip()
        # Convert kebab-case to camelCase
        react_key = CSS_KEY_RENAMES.get(key)
        if not react_key:
            # Generic fallback: kebab-case → camelCase
            parts = key.split('-')
            react_key = parts[0] + ''.join(p.capitalize() for p in parts[1:])
        # Quote the value (escape any existing single quotes by doubling them,
        # then wrap in single quotes for JSX/JS string literal)
        escaped_val = val.replace("'", "\\'")
        pairs.append(f"{react_key}: '{escaped_val}'")
    if not pairs:
        return 'style={{}}'
    return 'style={{ ' + ', '.join(pairs) + ' }}'


def selfclose_void_tags(html: str) -> str:
    """Self-close void elements: `<img ...>` → `<img ... />`."""
    def replace(m):
        tag = m.group('tag')
        attrs = m.group('attrs')
        # Already self-closed?
        if attrs.endswith('/'):
            return m.group(0)
        return f'<{tag}{attrs} />'

    pattern = re.compile(
        r'<(?P<tag>' + '|'.join(re.escape(t) for t in VOID_TAGS) + r')'
        r'(?P<attrs>[^>]*?)(?<!/)>'
    )
    return pattern.sub(replace, html)


def rename_attributes(html: str) -> str:
    """Rename HTML attributes to JSX equivalents inside tag attribute lists."""
    # We process tag-by-tag to avoid renaming inside text content
    tokens = re.split(r'(<[^>]+>)', html)
    out = []
    for tok in tokens:
        if tok.startswith('<') and tok.endswith('>') and not tok.startswith('<!--'):
            # It's a tag; rename attributes
            def rename(m):
                prefix = m.group(1)  # whitespace
                key = m.group(2)
                new_key = ATTR_RENAMES.get(key, key)
                return f'{prefix}{new_key}'

            # Match attribute names that come after whitespace, lookahead for = / > or whitespace
            tok = re.sub(
                r'(\s)([a-zA-Z][a-zA-Z-]*)(?=[\s=/>])',
                rename,
                tok,
            )
        out.append(tok)
    return ''.join(out)


def convert_style_attrs(html: str) -> str:
    """Convert `style="..."` attributes to `style={{ ... }}` objects."""
    def replace(m):
        whitespace = m.group(1)
        value = m.group(2)
        return whitespace + convert_style_string(value)

    # Match ` style="..."` (leading whitespace + style="...") and replace with
    # ` style={{...}}` (leading whitespace + converted object).
    pattern = re.compile(r'(\s)style="([^"]*)"')
    return pattern.sub(replace, html)


# Numeric HTML attributes — React expects `number` for these.
# Convert `attr="N"` to `attr={N}` when the value is an integer.
NUMERIC_ATTRS = {
    'rows', 'cols', 'maxlength', 'minlength', 'tabindex',
    'colspan', 'rowspan', 'span', 'start', 'max', 'min', 'step',
    'size', 'height', 'width',
}

# Boolean HTML attributes — React expects `boolean`.
# Convert `attr=""` or `attr="attr"` to `attr` (boolean shorthand).
BOOLEAN_ATTRS = {
    'checked', 'selected', 'disabled', 'readonly', 'multiple',
    'required', 'autofocus', 'novalidate', 'autoplay', 'controls',
    'loop', 'muted', 'hidden', 'open', 'reversed', 'async', 'defer',
    'default', 'itemscope', 'nomodule', 'ping', 'playsinline',
}


def convert_numeric_and_boolean_attrs(html: str) -> str:
    """Convert numeric and boolean attribute values from strings to JS expressions."""
    tokens = re.split(r'(<[^>]+>)', html)
    out = []
    for tok in tokens:
        if tok.startswith('<') and tok.endswith('>') and not tok.startswith('<!--'):
            # Numeric: attr="N" → attr={N}
            def num_repl(m):
                whitespace = m.group(1)
                attr = m.group(2)
                value = m.group(3)
                if not value.isdigit():
                    return m.group(0)
                return f'{whitespace}{attr}={{{value}}}'

            tok = re.sub(
                r'(\s)((?:' + '|'.join(NUMERIC_ATTRS) + r'))="(\d+)"',
                num_repl,
                tok,
            )

            # Boolean: attr="" or attr="attr" → attr
            def bool_repl(m):
                whitespace = m.group(1)
                attr = m.group(2)
                value = m.group(3)
                if value == '' or value == attr:
                    return f'{whitespace}{attr}'
                # Other value (e.g. checked="checked") — convert to boolean
                return f'{whitespace}{attr}={{{ "true" if value.lower() in ("true", "1", attr.lower()) else "false" }}}'

            tok = re.sub(
                r'(\s)((?:' + '|'.join(BOOLEAN_ATTRS) + r'))="([^"]*)"',
                bool_repl,
                tok,
            )
        out.append(tok)
    return ''.join(out)


def convert_html_comments(html: str) -> str:
    """Convert `<!-- ... -->` to `{/* ... */}`."""
    return re.sub(r'<!--(.*?)-->', lambda m: '{/*' + m.group(1) + '*/}', html, flags=re.DOTALL)


def drop_legacy_script(html: str) -> str:
    """Drop legacy `<script src="js/..."></script>` tags that 404 in production."""
    # Drop any `<script src="js/...">...</script>` (Next.js doesn't serve /js/).
    html = re.sub(
        r'\s*<script\s+src="js/[^"]*">\s*</script>\s*',
        '\n',
        html,
    )
    # Also drop empty `<script>...</script>` blocks
    html = re.sub(r'\s*<script[^>]*>\s*</script>\s*', '\n', html)
    return html


def escape_jsx_text_entities(html: str) -> str:
    """Escape `'` and `"` in JSX text content (not inside tags or attributes).

    ESLint's `react/no-unescaped-entities` rule requires these to be escaped
    as `&apos;` and `&quot;` respectively. We split the HTML into tag tokens
    and text tokens, and only modify the text tokens.
    """
    # Split on tags — preserves both tags and inter-tag text
    tokens = re.split(r'(<[^>]+>)', html)
    out = []
    for tok in tokens:
        if tok.startswith('<') and tok.endswith('>'):
            # Tag — leave alone
            out.append(tok)
        else:
            # Text content — escape unescaped ' and " (but not existing entities)
            # First, protect existing entities with placeholders
            placeholders: dict[str, str] = {}

            def protect(m):
                key = f'\x00ENTITY{len(placeholders)}\x00'
                placeholders[key] = m.group(0)
                return key

            tok = re.sub(r'&(?:[a-zA-Z][a-zA-Z0-9]*|#[0-9]+|#[xX][0-9a-fA-F]+);', protect, tok)
            # Now escape remaining ' and "
            tok = tok.replace("'", '&apos;').replace('"', '&quot;')
            # Restore entities
            for key, val in placeholders.items():
                tok = tok.replace(key, val)
            out.append(tok)
    return ''.join(out)


def convert_img_to_next_image(html: str) -> str:
    """Convert <img src="..." alt="..." /> to next/image.

    External URLs use `unoptimized` to avoid requiring remotePatterns config
    in next.config.js (the mockup images were broken external URLs anyway).
    Local URLs use the standard next/image pipeline.
    """
    def replace(m):
        attrs = m.group(1)
        # Extract src and alt
        src_match = re.search(r'src="([^"]*)"', attrs)
        alt_match = re.search(r'alt="([^"]*)"', attrs)
        if not src_match:
            return m.group(0)
        src = src_match.group(1)
        alt = alt_match.group(1) if alt_match else ''
        width = 400
        height = 300
        if src.startswith('http'):
            # External URL — use unoptimized to bypass remotePatterns config
            return (f'<Image src="{src}" alt="{alt}" width={{{width}}} height={{{height}}} '
                    f'unoptimized style={{{{ maxWidth: \'100%\', height: \'auto\' }}}} />')
        # Local image
        return (f'<Image src="{src}" alt="{alt}" width={{{width}}} height={{{height}}} '
                f'style={{{{ maxWidth: \'100%\', height: \'auto\' }}}} />')

    # Match self-closed img tags
    pattern = re.compile(r'<img([^>]*?)/>')
    return pattern.sub(replace, html)


def html_to_jsx(html: str) -> str:
    """Apply all HTML→JSX transformations in order."""
    html = drop_legacy_script(html)
    html = convert_html_comments(html)
    html = selfclose_void_tags(html)
    html = convert_style_attrs(html)
    html = convert_numeric_and_boolean_attrs(html)
    html = rename_attributes(html)
    html = escape_jsx_text_entities(html)
    html = convert_img_to_next_image(html)
    return html


def convert_page(rel_path: str) -> bool:
    """Convert a single page. Returns True if successful."""
    path = ROOT / rel_path
    if not path.exists():
        print(f"SKIP (missing): {rel_path}")
        return False

    text = path.read_text(encoding='utf-8')
    html = extract_html_blob(text)
    if html is None:
        print(f"SKIP (no dangerouslySetInnerHTML): {rel_path}")
        return False

    jsx_body = html_to_jsx(html)

    # Determine if any Image components are used (i.e. local images)
    needs_image_import = '<Image ' in jsx_body

    # Determine the component name from the file path
    parts = rel_path.split('/')
    page_name = parts[-2].replace('-', ' ').title().replace(' ', '')
    component_name = f"{page_name}Page"

    # Build the new file content
    imports = ["import React from 'react';"]
    if needs_image_import:
        imports.append("import Image from 'next/image';")
    imports_str = '\n'.join(imports)

    # Use React.Fragment shorthand
    new_content = f"""{imports_str}

export default function {component_name}() {{
  return (
    <>
{jsx_body}
    </>
  );
}}
"""

    path.write_text(new_content, encoding='utf-8')
    print(f"CONVERTED: {rel_path} → {component_name}")
    return True


def main():
    converted = 0
    failed = 0
    for rel in TARGETS:
        if convert_page(rel):
            converted += 1
        else:
            failed += 1
    print(f"\nDone. Converted: {converted}, Failed: {failed}")


if __name__ == '__main__':
    main()
