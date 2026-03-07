import { useState, useMemo, useEffect } from 'react'
import { X } from 'lucide-react'
import type { DiotVersion } from '../schemas/diotSchemas'

const EMPTY = ''
const STORAGE_KEY_PREFIX = 'diot-column-mapping-'

interface SchemaColumn {
  id: string
  label: string
}

interface PasteMappingModalProps {
  version: DiotVersion
  pastedHeaders: string[]
  schemaColumns: SchemaColumn[]
  onConfirm: (mapping: Record<number, string>) => void
  onCancel: () => void
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

function getSavedMapping(version: DiotVersion): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + version)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, string>
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function saveMapping(version: DiotVersion, headerToColId: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + version, JSON.stringify(headerToColId))
  } catch {
    // localStorage full or disabled
  }
}

/**
 * Sugiere el id de columna del esquema que mejor coincide con el texto del encabezado (por label).
 * No se sugiere "Base" cuando el encabezado es solo "Total".
 * No se sugiere columna de IVA cuando el encabezado es solo "IVA" (evitar mapear IVA genérico a IVA 16% no acreditable, etc.).
 */
function suggestColumnId(header: string, schemaColumns: SchemaColumn[]): string {
  const h = header.trim().toLowerCase()
  if (!h) return EMPTY
  const exact = schemaColumns.find((c) => c.label.trim().toLowerCase() === h)
  if (exact) return exact.id
  if (h === 'total' || h === 'totales') {
    const withoutBase = schemaColumns.filter((c) => !c.label.trim().toLowerCase().includes('base'))
    const contains = withoutBase.find((c) => c.label.trim().toLowerCase().includes(h) || h.includes(c.label.trim().toLowerCase()))
    return contains ? contains.id : EMPTY
  }
  if (h === 'iva') {
    return EMPTY
  }
  if (h === 'subtotal' || h === 'base') {
    const col = schemaColumns.find((c) => c.label.trim().toLowerCase() === 'base 16%')
    return col ? col.id : EMPTY
  }
  const contains = schemaColumns.find((c) => c.label.trim().toLowerCase().includes(h) || h.includes(c.label.trim().toLowerCase()))
  return contains ? contains.id : EMPTY
}

export function PasteMappingModal({
  version,
  pastedHeaders,
  schemaColumns,
  onConfirm,
  onCancel,
}: PasteMappingModalProps) {
  const [mapping, setMapping] = useState<Record<number, string>>({})

  const options = useMemo(() => [{ value: '', label: '— No importar' }, ...schemaColumns.map((c) => ({ value: c.id, label: c.label }))], [schemaColumns])

  useEffect(() => {
    const saved = getSavedMapping(version)
    const initial: Record<number, string> = {}
    pastedHeaders.forEach((header, i) => {
      const key = normalizeHeader(header)
      initial[i] = (key && saved[key]) || suggestColumnId(header, schemaColumns)
    })
    setMapping(initial)
  }, [version, pastedHeaders, schemaColumns])

  const handleChange = (pastedIndex: number, colId: string) => {
    setMapping((prev) => ({ ...prev, [pastedIndex]: colId }))
  }

  const handleConfirm = () => {
    const filtered: Record<number, string> = {}
    Object.entries(mapping).forEach(([k, v]) => {
      if (v && v !== EMPTY) filtered[Number(k)] = v
    })
    const saved = getSavedMapping(version)
    pastedHeaders.forEach((header, i) => {
      const colId = filtered[i]
      if (colId && colId !== EMPTY) {
        const key = normalizeHeader(header)
        if (key) saved[key] = colId
      }
    })
    saveMapping(version, saved)
    onConfirm(filtered)
  }

  const mappedCount = Object.values(mapping).filter((v) => v && v !== EMPTY).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="paste-mapping-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-600">
          <h2 id="paste-mapping-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Relacionar columnas del portapapeles con la tabla DIOT
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <p className="border-b border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-400">
          Se detectó una fila de encabezados. Asigna cada columna copiada a la columna de la tabla DIOT (o «No importar»).
        </p>
        <div className="max-h-[50vh] overflow-y-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="pb-2 pr-4 text-left font-medium text-slate-700 dark:text-slate-300">Columna en el portapapeles</th>
                <th className="pb-2 text-left font-medium text-slate-700 dark:text-slate-300">Asignar a (columna DIOT)</th>
              </tr>
            </thead>
            <tbody>
              {pastedHeaders.map((header, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-600/50">
                  <td className="py-2 pr-4 text-slate-800 dark:text-slate-200">
                    {header || <span className="italic text-slate-400">(vacío)</span>}
                  </td>
                  <td className="py-2">
                    <select
                      value={mapping[i] ?? EMPTY}
                      onChange={(e) => handleChange(i, e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100"
                    >
                      {options.map((opt) => (
                        <option key={opt.value || 'none'} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-600">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-400 bg-slate-100 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md border border-sky-600 bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:ring-offset-slate-800"
          >
            Aceptar {mappedCount > 0 ? `(${mappedCount} columna(s))` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
