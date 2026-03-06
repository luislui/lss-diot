import { useState, useCallback, useEffect } from 'react'
import type { DiotVersion } from '../schemas/diotSchemas'
import type { DiotColumn, DiotColumnOption } from '../schemas/diotSchemas'
import { getTipoOperacionOptionsFor2025 } from '../schemas/diotSchemas'
import { formatNumber, parseNumber } from '../utils/formatNumber'
import type { ValidationError } from '../utils/validation'

type RowRecord = Record<string, string | number>

const DEFAULT_COL_WIDTH = 130
const DEFAULT_COL_WIDTH_SELECT = 220
const MIN_COL_WIDTH = 60
const CHECKBOX_COL_WIDTH = 44

interface DiotGridProps {
  version: DiotVersion
  columns: DiotColumn[]
  rows: RowRecord[]
  onRowsChange: (rows: RowRecord[]) => void
  selectedRowIndices: number[]
  onSelectedRowIndicesChange: (indices: number[]) => void
  /** Errores por fila (índice) para marcar celdas con error. */
  rowErrors?: Record<number, ValidationError[]>
}

export function DiotGrid({
  version,
  columns,
  rows,
  onRowsChange,
  selectedRowIndices,
  onSelectedRowIndicesChange,
  rowErrors = {},
}: DiotGridProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [resize, setResize] = useState<{ colId: string; startX: number; startWidth: number } | null>(null)

  const getColWidth = useCallback(
    (colId: string) =>
      columnWidths[colId] ??
      (colId === 'tipo_tercero' || colId === 'tipo_operacion' ? DEFAULT_COL_WIDTH_SELECT : DEFAULT_COL_WIDTH),
    [columnWidths]
  )

  useEffect(() => {
    if (!resize) return
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - resize.startX
      const newWidth = Math.max(MIN_COL_WIDTH, resize.startWidth + delta)
      setColumnWidths((prev) => ({ ...prev, [resize.colId]: newWidth }))
    }
    const onUp = () => setResize(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [resize])

  const toggleRow = (index: number) => {
    const set = new Set(selectedRowIndices)
    if (set.has(index)) set.delete(index)
    else set.add(index)
    onSelectedRowIndicesChange(Array.from(set).sort((a, b) => a - b))
  }

  const toggleAll = () => {
    if (selectedRowIndices.length === rows.length) {
      onSelectedRowIndicesChange([])
    } else {
      onSelectedRowIndicesChange(rows.map((_, i) => i))
    }
  }

  const updateCell = (rowIndex: number, colId: string, value: string | number) => {
    let next = rows.map((r, i) =>
      i === rowIndex ? { ...r, [colId]: value } : r
    )
    if (colId === 'tipo_tercero') {
      if (version === '2025') {
        const newOptions = getTipoOperacionOptionsFor2025(String(value))
        const currentOperacion = String(rows[rowIndex]?.tipo_operacion ?? '')
        const valid = newOptions.some((o) => o.value === currentOperacion)
        if (!valid && currentOperacion) {
          next = next.map((r, i) => (i === rowIndex ? { ...r, tipo_operacion: '' } : r))
        }
      }
      if (value === '04' || value === '15') {
        next = next.map((r, i) =>
          i === rowIndex
            ? { ...r, num_id_fiscal: '', nombre_extranjero: '', pais_residencia_fiscal: '', lugar_jurisdiccion: '' }
            : r
        )
      }
    }
    if (colId === 'pais_residencia_fiscal' && String(value).trim().toUpperCase() !== 'ZZZ') {
      next = next.map((r, i) => (i === rowIndex ? { ...r, lugar_jurisdiccion: '' } : r))
    }
    onRowsChange(next)
  }

  const totals: Record<string, number> = {}
  columns.forEach((col) => {
    if (col.type === 'number') {
      totals[col.id] = rows.reduce((sum, row) => {
        const v = row[col.id]
        const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''))
        return sum + (Number.isNaN(n) ? 0 : Math.round(n))
      }, 0)
    }
  })

  const tableMinWidth =
    CHECKBOX_COL_WIDTH + columns.reduce((sum, col) => sum + getColWidth(col.id), 0)

  const inputBaseClass =
    'w-full min-w-[70px] rounded border border-slate-200 px-1.5 py-1 text-[0.8125rem] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400'
  const selectBaseClass =
    'w-full min-w-[140px] rounded border border-slate-200 bg-white px-1.5 py-1 text-[0.8125rem] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400'
  const inputErrorClass =
    'border-red-600 bg-red-50 focus:border-red-600 focus:ring-red-600 dark:border-red-500 dark:bg-red-900/40 dark:focus:border-red-500 dark:focus:ring-red-500'

  return (
    <div className="w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-600">
      <table
        className="w-full min-w-full table-fixed border-collapse text-[0.8125rem]"
        style={{ minWidth: tableMinWidth }}
      >
        <colgroup>
          <col style={{ width: CHECKBOX_COL_WIDTH, minWidth: CHECKBOX_COL_WIDTH }} />
          {columns.map((col) => (
            <col
              key={col.id}
              style={{ width: getColWidth(col.id), minWidth: MIN_COL_WIDTH }}
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="overflow-hidden border-b border-slate-200 bg-slate-50 px-1.5 py-2 text-left dark:border-slate-600 dark:bg-slate-800">
              <input
                type="checkbox"
                checked={rows.length > 0 && selectedRowIndices.length === rows.length}
                onChange={toggleAll}
                title="Seleccionar todas"
                className="rounded border-slate-300 dark:border-slate-500 dark:bg-slate-700"
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.id}
                className="relative overflow-hidden border-b border-slate-200 bg-slate-50 align-middle dark:border-slate-600 dark:bg-slate-800"
                title={col.requiredWhen ? `${col.label}. ${col.requiredWhen}` : col.label}
              >
                <span className="block overflow-hidden text-ellipsis whitespace-nowrap py-2 pr-3.5 pl-1.5">
                  {col.label}
                  {col.required && (
                    <span className="ml-0.5 font-semibold text-red-600 dark:text-red-400" aria-label="Obligatorio">
                      *
                    </span>
                  )}
                </span>
                <span
                  role="separator"
                  aria-orientation="vertical"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setResize({ colId: col.id, startX: e.clientX, startWidth: getColWidth(col.id) })
                  }}
                  className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize"
                  title="Redimensionar columna"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-200 dark:border-slate-600">
              <td className="align-middle px-1.5 py-1">
                <input
                  type="checkbox"
                  checked={selectedRowIndices.includes(rowIndex)}
                  onChange={() => toggleRow(rowIndex)}
                  className="rounded border-slate-300 dark:border-slate-500 dark:bg-slate-700"
                />
              </td>
              {columns.map((col) => {
                const cellError = rowErrors[rowIndex]?.find((e) => e.colId === col.id)
                const hasError = Boolean(cellError)
                const isTipoOperacion2025 = version === '2025' && col.id === 'tipo_operacion'
                const selectOptions: DiotColumnOption[] = isTipoOperacion2025
                  ? getTipoOperacionOptionsFor2025(String(row.tipo_tercero ?? ''))
                  : (col.options ?? [])
                const showSelect = col.options?.length ? true : isTipoOperacion2025
                const tipoTercero = String(row.tipo_tercero ?? '').trim()
                const paisFiscal = String(row.pais_residencia_fiscal ?? '').trim().toUpperCase()
                const isFieldDisabled =
                  col.id === 'rfc'
                    ? tipoTercero !== '04' && tipoTercero !== '15'
                    : col.id === 'num_id_fiscal' || col.id === 'nombre_extranjero' || col.id === 'pais_residencia_fiscal'
                      ? tipoTercero !== '05'
                      : col.id === 'lugar_jurisdiccion'
                        ? tipoTercero !== '05' || paisFiscal !== 'ZZZ'
                        : false
                return (
                  <td key={col.id} className="align-middle px-1.5 py-1">
                    {showSelect ? (
                      <select
                        value={String(row[col.id] ?? '')}
                        onChange={(e) => updateCell(rowIndex, col.id, e.target.value)}
                        className={`${selectBaseClass} ${hasError ? inputErrorClass : ''}`}
                        title={cellError?.message}
                        disabled={isTipoOperacion2025 && selectOptions.length === 0}
                      >
                        <option value="">
                          {isTipoOperacion2025 && selectOptions.length === 0
                            ? '— Seleccione tipo de tercero'
                            : '—'}
                        </option>
                        {selectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={col.type === 'number' ? formatNumber(row[col.id] ?? 0) : (row[col.id] ?? '')}
                        onChange={(e) => {
                          const raw = e.target.value
                          if (col.type === 'number') {
                            updateCell(rowIndex, col.id, parseNumber(raw))
                          } else if (col.id === 'rfc') {
                            const normalized = raw.toUpperCase().replace(/[^A-ZÑ&0-9]/g, '').slice(0, 13)
                            updateCell(rowIndex, col.id, normalized)
                          } else if (col.id === 'pais_residencia_fiscal') {
                            const normalized = raw.toUpperCase().replace(/[^A-ZÑ]/g, '').slice(0, 3)
                            updateCell(rowIndex, col.id, normalized)
                          } else {
                            updateCell(rowIndex, col.id, raw)
                          }
                        }}
                        maxLength={
                          col.id === 'rfc'
                            ? 13
                            : col.id === 'num_id_fiscal'
                              ? 40
                              : col.id === 'nombre_extranjero' || col.id === 'lugar_jurisdiccion'
                                ? 300
                                : col.id === 'pais_residencia_fiscal'
                                  ? 3
                                  : undefined
                        }
                        placeholder={
                          col.id === 'rfc' && row.tipo_tercero === '15'
                            ? 'XAXX010101000'
                            : col.id === 'lugar_jurisdiccion' &&
                                row.tipo_tercero === '05' &&
                                String(row.pais_residencia_fiscal ?? '').trim().toUpperCase() !== 'ZZZ'
                              ? 'Vacío si país ≠ ZZZ'
                              : undefined
                        }
                        disabled={isFieldDisabled}
                        className={`${inputBaseClass} ${col.type === 'number' ? 'text-right' : 'min-w-[100px]'} ${col.id === 'rfc' || col.id === 'pais_residencia_fiscal' ? 'uppercase' : ''} disabled:opacity-60 disabled:cursor-not-allowed ${hasError ? inputErrorClass : ''}`}
                        title={cellError?.message}
                      />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-b border-slate-200 font-semibold bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
            <td className="px-1.5 py-1 align-middle dark:text-slate-200">Total</td>
            {columns.map((col) => (
              <td
                key={col.id}
                className={`px-1.5 py-1 align-middle dark:text-slate-200 ${col.type === 'number' ? 'text-right' : ''}`}
              >
                {col.type === 'number' ? formatNumber(totals[col.id] ?? 0) : '—'}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
