/**
 * EnterpriseDataTable — premium data table with:
 *  - Sortable columns (click header)
 *  - Row selection (checkbox column)
 *  - Pagination
 *  - Row click → onRowClick
 *  - Hover states
 *  - Sticky header
 *  - Empty state
 *  - Loading skeleton
 *  - Responsive horizontal scroll
 *  - Custom cell renderers
 *  - Bulk action bar when rows selected
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import type { AdminThemeTokens } from '@/lib/admin/types';
import { Checkbox, EmptyState, Skeleton, Pagination } from './ui';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  width?: number | string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
}

interface Props<T> {
  tokens: AdminThemeTokens;
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  pageSize?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  bulkActions?: (selectedIds: string[]) => React.ReactNode;
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  rowStyle?: (row: T) => React.CSSProperties;
  stickyHeader?: boolean;
}

export function EnterpriseDataTable<T>({
  tokens, columns, rows, getRowId, onRowClick,
  selectable = false, onSelectionChange, pageSize = 10,
  loading = false, emptyTitle = 'No records found',
  emptyDescription, emptyAction, emptyIcon,
  bulkActions, defaultSort, rowStyle, stickyHeader = true,
}: Props<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(defaultSort ?? null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => { setPage(1); }, [rows.length, sort]);
  useEffect(() => { onSelectionChange?.(Array.from(selected)); }, [selected, onSelectionChange]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    if (!col || !col.sortValue) return rows;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [rows, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: string) {
    setSort(prev => {
      if (prev?.key === key) {
        return prev.dir === 'asc' ? { key, dir: 'desc' } : null;
      }
      return { key, dir: 'asc' };
    });
  }

  function toggleAll() {
    if (selected.size === pageRows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageRows.map(getRowId)));
    }
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, sans-serif' }}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} style={{ padding: '10px 12px', textAlign: c.align ?? 'left' }}>
                  <Skeleton tokens={tokens} w={60} h={10} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '10px 12px' }}>
                    <Skeleton tokens={tokens} h={12} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (rows.length === 0) {
    return <EmptyState tokens={tokens} icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  const allChecked = pageRows.length > 0 && selected.size === pageRows.length;
  const someChecked = selected.size > 0 && !allChecked;

  return (
    <div style={{ position: 'relative' }}>
      {/* Bulk action bar */}
      {selected.size > 0 && bulkActions && (
        <div style={{
          position: stickyHeader ? 'sticky' : 'relative',
          top: 0, zIndex: 5,
          background: tokens.text.primary, color: tokens.bg.app,
          padding: '8px 14px', borderRadius: 10,
          marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
          animation: 'admin-bulk-in 200ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          }}>
            <span style={{
              background: tokens.bg.app, color: tokens.text.primary,
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
            }}>{selected.size}</span>
            selected
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {bulkActions(Array.from(selected))}
          </div>
        </div>
      )}

      <div style={{ overflowX: 'auto', borderRadius: 12, border: `1px solid ${tokens.border.subtle}` }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13,
        }}>
          <thead>
            <tr style={{
              background: tokens.bg.surfaceAlt,
              borderBottom: `1px solid ${tokens.border.subtle}`,
            }}>
              {selectable && (
                <th style={{ padding: '10px 12px', width: 40, position: stickyHeader ? 'sticky' : 'static', top: 0, background: tokens.bg.surfaceAlt, zIndex: 1 }}>
                  <Checkbox
                    tokens={tokens}
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                  style={{
                    padding: '10px 12px',
                    textAlign: col.align ?? 'left',
                    fontSize: 10, fontWeight: 700,
                    color: tokens.text.tertiary,
                    textTransform: 'uppercase', letterSpacing: 0.8,
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    width: col.width,
                    position: stickyHeader ? 'sticky' : 'static',
                    top: 0, background: tokens.bg.surfaceAlt, zIndex: 1,
                    transition: 'color 120ms ease',
                  }}
                  onMouseEnter={(e) => { if (col.sortable !== false) e.currentTarget.style.color = tokens.text.secondary; }}
                  onMouseLeave={(e) => { if (sort?.key !== col.key) e.currentTarget.style.color = tokens.text.tertiary; }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.header}
                    {col.sortable !== false && (
                      <span style={{
                        display: 'inline-flex', flexDirection: 'column', lineHeight: 0.7,
                        color: sort?.key === col.key ? tokens.text.primary : tokens.text.tertiary,
                      }}>
                        <span style={{ fontSize: 8, opacity: sort?.key === col.key && sort.dir === 'asc' ? 1 : 0.4 }}>▲</span>
                        <span style={{ fontSize: 8, opacity: sort?.key === col.key && sort.dir === 'desc' ? 1 : 0.4 }}>▼</span>
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, idx) => {
              const id = getRowId(row);
              const isSel = selected.has(id);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    borderBottom: idx === pageRows.length - 1 ? 'none' : `1px solid ${tokens.border.subtle}`,
                    background: isSel ? tokens.bg.hover : 'transparent',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 100ms ease',
                    ...rowStyle?.(row),
                  }}
                  onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = tokens.bg.hover; }}
                  onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
                >
                  {selectable && (
                    <td onClick={e => { e.stopPropagation(); toggleRow(id); }} style={{ padding: '10px 12px', width: 40 }}>
                      <Checkbox tokens={tokens} checked={isSel} onChange={() => toggleRow(id)} />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} style={{
                      padding: '10px 12px',
                      textAlign: col.align ?? 'left',
                      color: tokens.text.primary,
                      verticalAlign: 'middle',
                      whiteSpace: col.align === 'right' ? 'nowrap' : 'normal',
                    }}>
                      {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          tokens={tokens}
          page={currentPage}
          totalPages={totalPages}
          onPage={setPage}
          total={sorted.length}
        />
      )}

      <style jsx global>{`
        @keyframes admin-bulk-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
