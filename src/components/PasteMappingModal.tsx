import { useState, useMemo, useEffect } from 'react'
import { X } from 'lucide-react'
import type { DiotVersion } from '../schemas/diotSchemas'

const EMPTY = ''
const NO_IMPORT_SENTINEL = '__no_import'
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

/** Solo sugiere la columna RFC cuando el encabezado pegado es claramente "RFC". El resto lo elige el usuario. */
function suggestRfcIfMatch(header: string, schemaColumns: SchemaColumn[]): string {
  const h = header.trim().toLowerCase()
  if (!h || h !== 'rfc') return EMPTY
  const rfcCol = schemaColumns.find((c) => c.id === 'rfc')
  return rfcCol ? rfcCol.id : EMPTY
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
      if (key && key in saved) {
        initial[i] = saved[key] === NO_IMPORT_SENTINEL ? EMPTY : saved[key]
      } else {
        initial[i] = suggestRfcIfMatch(header, schemaColumns)
      }
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
      const key = normalizeHeader(header)
      if (!key) return
      const colId = mapping[i] ?? EMPTY
      saved[key] = colId && colId !== EMPTY ? colId : NO_IMPORT_SENTINEL
    })
    saveMapping(version, saved)
    onConfirm(filtered)
  }

  const mappedCount = Object.values(mapping).filter((v) => v && v !== EMPTY).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="paste-mapping-title">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-xl dark:border-neutral-600 dark:bg-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-600">
          <h2 id="paste-mapping-title" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Relacionar columnas del portapapeles con la tabla DIOT
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <p className="border-b border-neutral-200 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-600 dark:text-neutral-400">
          Se detectó una fila de encabezados. Asigna cada columna copiada a la columna de la tabla DIOT (o «No importar»).
        </p>
        <div className="max-h-[50vh] overflow-y-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-600">
                <th className="pb-2 pr-4 text-left font-medium text-neutral-700 dark:text-neutral-300">Columna en el portapapeles</th>
                <th className="pb-2 text-left font-medium text-neutral-700 dark:text-neutral-300">Asignar a (columna DIOT)</th>
              </tr>
            </thead>
            <tbody>
              {pastedHeaders.map((header, i) => (
                <tr key={i} className="border-b border-neutral-100 dark:border-neutral-600/50">
                  <td className="py-2 pr-4 text-neutral-800 dark:text-neutral-200">
                    {header || <span className="italic text-neutral-400">(vacío)</span>}
                  </td>
                  <td className="py-2">
                    <select
                      value={mapping[i] ?? EMPTY}
                      onChange={(e) => handleChange(i, e.target.value)}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1.5 text-neutral-800 focus:border-[#63048C] focus:outline-none focus:ring-1 focus:ring-[#63048C] dark:border-neutral-500 dark:bg-neutral-700 dark:text-neutral-100"
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
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-600">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-400 bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md border border-[#63048C] bg-[#63048C] px-3 py-1.5 text-sm text-white hover:bg-[#7a05a8] focus:outline-none focus:ring-2 focus:ring-[#63048C] focus:ring-offset-1 dark:bg-[#9d3dd4] dark:hover:bg-[#b855e8] dark:focus:ring-[#b855e8] dark:ring-offset-neutral-800"
          >
            Aceptar {mappedCount > 0 ? `(${mappedCount} columna(s))` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
