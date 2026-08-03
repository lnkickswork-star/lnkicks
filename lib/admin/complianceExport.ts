/**
 * LNKICKS Enterprise Admin — Compliance Report Export
 * ------------------------------------------------------------
 * Client-side export utilities for compliance reports.
 *
 * Supported formats:
 *   - CSV   — plain UTF-8 CSV (Excel-compatible, BOM-prefixed)
 *   - XLSX  — single-sheet Excel via SpreadsheetML 2003 XML
 *             (no dependency required; opens natively in Excel)
 *   - PDF   — opens a print-optimized HTML window and triggers
 *             the browser print dialog (user selects "Save as PDF")
 *
 * All exports are generated from a ComplianceScanResult. The
 * filename is auto-generated as:
 *   LNKICKS-Compliance-{SKU}-{YYYYMMDD-HHmm}.{ext}
 */

import type { ComplianceScanResult } from './complianceTypes';
import { RISK_LEVEL_META, ISSUE_CATEGORY_META, FIELD_LABELS } from './complianceTypes';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function csvEscape(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function baseFilename(scan: ComplianceScanResult): string {
  return `LNKICKS-Compliance-${scan.productSku.replace(/[^a-zA-Z0-9-]/g, '-')}-${timestamp()}`;
}

/* ------------------------------------------------------------------ */
/* CSV export                                                          */
/* ------------------------------------------------------------------ */

export function exportScanCSV(scan: ComplianceScanResult) {
  const rows: string[][] = [];
  // Header — report metadata
  rows.push(['LNKICKS — Copyright & Brand Compliance Report']);
  rows.push(['Generated', new Date(scan.completedAt).toISOString()]);
  rows.push([]);
  rows.push(['Product', scan.productName]);
  rows.push(['SKU', scan.productSku]);
  rows.push(['Brand', scan.productBrand]);
  rows.push(['Scan ID', scan.id]);
  rows.push(['Started', new Date(scan.startedAt).toLocaleString()]);
  rows.push(['Completed', new Date(scan.completedAt).toLocaleString()]);
  rows.push(['Duration (ms)', String(scan.durationMs)]);
  rows.push(['Fields Scanned', String(scan.fieldsScanned)]);
  rows.push(['Images Scanned', String(scan.imagesScanned)]);
  rows.push(['Compliance Score', `${scan.score}/100`]);
  rows.push(['Risk Level', RISK_LEVEL_META[scan.riskLevel].label]);
  rows.push(['Recommendation', scan.recommendation.replace(/_/g, ' ').toUpperCase()]);
  rows.push([]);
  rows.push(['Summary']);
  rows.push([scan.summary]);
  rows.push([]);
  rows.push(['Next Steps']);
  scan.nextSteps.forEach((s, i) => rows.push([`${i + 1}.`, s]));
  rows.push([]);

  // Issues table
  rows.push(['DETECTED ISSUES']);
  rows.push(['#', 'Category', 'Severity', 'Field', 'Rule ID', 'Explanation', 'Recommendation', 'Snippet']);
  scan.issues.forEach((issue, i) => {
    rows.push([
      String(i + 1),
      ISSUE_CATEGORY_META[issue.category].label,
      issue.severity.toUpperCase(),
      FIELD_LABELS[issue.field] || issue.field,
      issue.ruleId,
      issue.explanation,
      issue.recommendation,
      issue.snippet,
    ]);
  });

  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
  // BOM ensures Excel detectss UTF-8
  download(`${baseFilename(scan)}.csv`, '\uFEFF' + csv, 'text/csv;charset=utf-8');
}

/* ------------------------------------------------------------------ */
/* XLSX (SpreadsheetML 2003) export                                   */
/* ------------------------------------------------------------------ */

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function xlsCell(v: string | number, type: 'String' | 'Number' = 'String'): string {
  return `<Cell><Data ss:Type="${type}">${xmlEscape(String(v))}</Data></Cell>`;
}

export function exportScanXLSX(scan: ComplianceScanResult) {
  const headerStyle = 'ss:StyleID="header"';
  const subStyle = 'ss:StyleID="sub"';

  const rows: string[] = [];
  // Title
  rows.push(`<Row ${headerStyle}><Cell ss:MergeAcross="7">${xlsCell('LNKICKS — Copyright & Brand Compliance Report')}</Cell></Row>`);
  rows.push(`<Row ${subStyle}><Cell ss:MergeAcross="7">${xlsCell(`Generated: ${new Date(scan.completedAt).toLocaleString()}`)}</Cell></Row>`);
  rows.push('<Row />');

  // Product info
  const meta: Array<[string, string]> = [
    ['Product', scan.productName],
    ['SKU', scan.productSku],
    ['Brand', scan.productBrand],
    ['Scan ID', scan.id],
    ['Started', new Date(scan.startedAt).toLocaleString()],
    ['Completed', new Date(scan.completedAt).toLocaleString()],
    ['Duration (ms)', String(scan.durationMs)],
    ['Fields Scanned', String(scan.fieldsScanned)],
    ['Images Scanned', String(scan.imagesScanned)],
    ['Compliance Score', `${scan.score}/100`],
    ['Risk Level', RISK_LEVEL_META[scan.riskLevel].label],
    ['Recommendation', scan.recommendation.replace(/_/g, ' ').toUpperCase()],
  ];
  for (const [k, v] of meta) {
    rows.push(`<Row><Cell ss:StyleID="label">${xlsCell(k)}</Cell><Cell ss:MergeAcross="6">${xlsCell(v)}</Cell></Row>`);
  }
  rows.push('<Row />');

  // Summary
  rows.push(`<Row ${headerStyle}><Cell ss:MergeAcross="7">${xlsCell('Executive Summary')}</Cell></Row>`);
  rows.push(`<Row><Cell ss:MergeAcross="7">${xlsCell(scan.summary)}</Cell></Row>`);
  rows.push('<Row />');

  // Next steps
  rows.push(`<Row ${headerStyle}><Cell ss:MergeAcross="7">${xlsCell('Recommended Next Steps')}</Cell></Row>`);
  scan.nextSteps.forEach((s, i) => {
    rows.push(`<Row><Cell>${xlsCell(`${i + 1}.`)}</Cell><Cell ss:MergeAcross="6">${xlsCell(s)}</Cell></Row>`);
  });
  rows.push('<Row />');

  // Issues table
  rows.push(`<Row ${headerStyle}><Cell ss:MergeAcross="7">${xlsCell('Detected Issues')}</Cell></Row>`);
  rows.push(`<Row ${subStyle}>
    ${xlsCell('#')}
    ${xlsCell('Category')}
    ${xlsCell('Severity')}
    ${xlsCell('Field')}
    ${xlsCell('Rule ID')}
    ${xlsCell('Explanation')}
    ${xlsCell('Recommendation')}
    ${xlsCell('Snippet')}
  </Row>`);
  scan.issues.forEach((issue, i) => {
    rows.push(`<Row>
      ${xlsCell(String(i + 1))}
      ${xlsCell(ISSUE_CATEGORY_META[issue.category].label)}
      ${xlsCell(issue.severity.toUpperCase())}
      ${xlsCell(FIELD_LABELS[issue.field] || issue.field)}
      ${xlsCell(issue.ruleId)}
      ${xlsCell(issue.explanation)}
      ${xlsCell(issue.recommendation)}
      ${xlsCell(issue.snippet)}
    </Row>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header"><Font ss:Bold="1" ss:Size="14"/><Interior ss:Color="#0A0A0A" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF" ss:Bold="1" ss:Size="13"/></Style>
    <Style ss:ID="sub"><Font ss:Bold="1" ss:Size="11" ss:Color="#475569"/></Style>
    <Style ss:ID="label"><Font ss:Bold="1"/></Style>
  </Styles>
  <Worksheet ss:Name="Compliance Report">
    <Table>${rows.join('')}</Table>
  </Worksheet>
</Workbook>`;

  download(`${baseFilename(scan)}.xls`, xml, 'application/vnd.ms-excel');
}

/* ------------------------------------------------------------------ */
/* PDF export (print-to-PDF via new window)                           */
/* ------------------------------------------------------------------ */

export function exportScanPDF(scan: ComplianceScanResult) {
  const html = buildPrintableHTML(scan);
  const w = window.open('', '_blank', 'width=900,height=1200');
  if (!w) {
    alert('Please allow pop-ups to export the PDF report.');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  // Wait for images to load, then print
  w.onload = () => {
    setTimeout(() => {
      w.focus();
      w.print();
    }, 400);
  };
}

function buildPrintableHTML(scan: ComplianceScanResult): string {
  const fmtDate = (ts: number) => new Date(ts).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const riskColor = RISK_LEVEL_META[scan.riskLevel].color;
  const riskLabel = RISK_LEVEL_META[scan.riskLevel].label;

  const issuesRows = scan.issues.length === 0
    ? `<tr><td colspan="6" style="text-align:center;padding:32px;color:#94A3B8;">No issues detected — product passed all compliance checks.</td></tr>`
    : scan.issues.map((issue, i) => `
      <tr>
        <td style="text-align:center;">${i + 1}</td>
        <td><strong>${ISSUE_CATEGORY_META[issue.category].label}</strong></td>
        <td><span class="sev sev-${issue.severity}">${issue.severity.toUpperCase()}</span></td>
        <td>${FIELD_LABELS[issue.field] || issue.field}</td>
        <td>${issue.explanation}</td>
        <td>${issue.recommendation}</td>
      </tr>
    `).join('');

  const nextSteps = scan.nextSteps.map((s) => `<li>${s}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Compliance Report — ${scan.productSku}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
    color: #0A0A0A; background: #fff; margin: 0; padding: 40px;
    font-size: 12px; line-height: 1.55;
  }
  .header {
    display: flex; justify-content: space-between; align-items: flex-start;
    border-bottom: 2px solid #0A0A0A; padding-bottom: 16px; margin-bottom: 24px;
  }
  .brand { display: flex; align-items: center; gap: 10px; }
  .brand-logo {
    width: 36px; height: 36px; background: #0A0A0A; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 16px; border-radius: 8px; letter-spacing: -0.05em;
  }
  .brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
  .brand-sub { font-size: 10px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
  .doc-title { font-size: 14px; font-weight: 700; margin-top: 2px; }
  .doc-meta { text-align: right; font-size: 11px; color: #475569; }
  h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 6px; }
  .subtitle { color: #475569; font-size: 13px; margin-bottom: 24px; }

  .score-card {
    display: flex; align-items: center; gap: 24px; padding: 20px;
    background: #F8F9FB; border: 1px solid #E5E7EB; border-radius: 12px; margin-bottom: 24px;
  }
  .score-num { font-size: 48px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: ${riskColor}; }
  .score-of { font-size: 14px; color: #94A3B8; font-weight: 500; }
  .score-meta { flex: 1; }
  .risk-pill {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    background: ${riskColor}20; color: ${riskColor}; font-weight: 700; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .rec-pill {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    background: #0A0A0A; color: #fff; font-weight: 700; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.05em; margin-left: 8px;
  }

  table.meta { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  table.meta td { padding: 6px 12px; border-bottom: 1px solid #F1F3F5; font-size: 12px; }
  table.meta td:first-child { font-weight: 600; color: #475569; width: 200px; }

  .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; margin: 24px 0 8px; padding-bottom: 6px; border-bottom: 1px solid #E5E7EB; }

  .summary { padding: 16px; background: #F8F9FB; border-left: 3px solid #0A0A0A; border-radius: 6px; margin-bottom: 16px; font-size: 13px; line-height: 1.6; }

  ol.next-steps { padding-left: 20px; }
  ol.next-steps li { margin-bottom: 6px; font-size: 12px; }

  table.issues { width: 100%; border-collapse: collapse; margin-top: 12px; }
  table.issues th { background: #0A0A0A; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
  table.issues td { padding: 10px; border-bottom: 1px solid #E5E7EB; font-size: 11px; vertical-align: top; }
  table.issues tr:nth-child(even) td { background: #F8F9FB; }

  .sev { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 10px; }
  .sev-critical { background: #FEE2E2; color: #B91C1C; }
  .sev-warning { background: #FEF3C7; color: #B45309; }
  .sev-info { background: #DBEAFE; color: #1D4ED8; }

  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #94A3B8; text-align: center; }

  @page { margin: 16mm; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-logo">L</div>
      <div>
        <div class="brand-name">LNKICKS</div>
        <div class="brand-sub">Admin Suite</div>
        <div class="doc-title">Copyright &amp; Brand Compliance Report</div>
      </div>
    </div>
    <div class="doc-meta">
      <div><strong>Scan ID:</strong> ${scan.id}</div>
      <div><strong>Generated:</strong> ${fmtDate(scan.completedAt)}</div>
      <div><strong>Duration:</strong> ${scan.durationMs}ms</div>
    </div>
  </div>

  <h1>${scan.productName}</h1>
  <div class="subtitle">SKU: <strong>${scan.productSku}</strong> &nbsp;•&nbsp; Brand: <strong>${scan.productBrand}</strong></div>

  <div class="score-card">
    <div>
      <span class="score-num">${scan.score}</span>
      <span class="score-of">/100</span>
    </div>
    <div class="score-meta">
      <div style="margin-bottom:8px;">
        <span class="risk-pill">${riskLabel}</span>
        <span class="rec-pill">${scan.recommendation.replace(/_/g, ' ')}</span>
      </div>
      <div style="color:#475569;font-size:12px;">
        ${scan.fieldsScanned} fields scanned &nbsp;•&nbsp;
        ${scan.imagesScanned} images reviewed &nbsp;•&nbsp;
        ${scan.issues.length} issue${scan.issues.length === 1 ? '' : 's'} detected
      </div>
    </div>
  </div>

  <table class="meta">
    <tr><td>Started</td><td>${fmtDate(scan.startedAt)}</td></tr>
    <tr><td>Completed</td><td>${fmtDate(scan.completedAt)}</td></tr>
    <tr><td>Trademark References</td><td>${scan.trademarkHits.length}</td></tr>
    <tr><td>Image Flags</td><td>${scan.imageFlags.length}</td></tr>
    <tr><td>SEO Flags</td><td>${scan.seoFlags.length}</td></tr>
    <tr><td>Content Flags</td><td>${scan.contentFlags.length}</td></tr>
  </table>

  <div class="section-title">Executive Summary</div>
  <div class="summary">${scan.summary}</div>

  <div class="section-title">Recommended Next Steps</div>
  <ol class="next-steps">
    ${nextSteps}
  </ol>

  <div class="section-title">Detected Issues (${scan.issues.length})</div>
  <table class="issues">
    <thead>
      <tr>
        <th style="width:32px;">#</th>
        <th style="width:100px;">Category</th>
        <th style="width:80px;">Severity</th>
        <th style="width:120px;">Field</th>
        <th>Explanation</th>
        <th>Recommendation</th>
      </tr>
    </thead>
    <tbody>
      ${issuesRows}
    </tbody>
  </table>

  <div class="footer">
    This report was generated by LNKICKS Copyright &amp; Brand Compliance Center. It is an automated
    screening tool and does not constitute legal advice. For trademark, copyright, or policy questions,
    consult qualified legal counsel. &nbsp;•&nbsp; Report ID: ${scan.id}
  </div>

  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;
}
