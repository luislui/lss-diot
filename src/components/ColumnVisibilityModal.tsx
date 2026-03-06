import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface ColumnItem {
  id: string
  label: string
}

interface ColumnVisibilityModalProps {
  columns: ColumnItem[]
  hiddenColumnIds: string[]
  onSave: (hiddenIds: string[]) => void
  onCancel: () => void
}

export function ColumnVisibilityModal({
  columns,
  hiddenColumnIds,
  onSave,
  onCancel,
}: ColumnVisibilityModalProps) {
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(hiddenColumnIds))

  useEffect(() => {
    setHidden(new Set(hiddenColumnIds))
  }, [hiddenColumnIds])

  const toggle = (id: string) => {
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const showAll = () => setHidden(new Set())
  const hideAll = () => setHidden(new Set(columns.map((c) => c.id)))

  const handleSave = () => {
    onSave(Array.from(hidden))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="column-visibility-title"
    >
      <div className="max-h-[85vh] w-full max-w-md overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-600">
          <h2 id="column-visibility-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Mostrar u ocultar columnas
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
          Desmarca la columna para ocultarla en la tabla. La configuración se guarda en este navegador.
        </p>
        <div className="flex gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-600">
          <button
            type="button"
            onClick={showAll}
            className="rounded border border-slate-400 bg-slate-100 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            Mostrar todas
          </button>
          <button
            type="button"
            onClick={hideAll}
            className="rounded border border-slate-400 bg-slate-100 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            Ocultar todas
          </button>
        </div>
        <div className="max-h-[45vh] overflow-y-auto p-4">
          <ul className="space-y-1">
            {columns.map((col) => (
              <li key={col.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`col-${col.id}`}
                  checked={!hidden.has(col.id)}
                  onChange={() => toggle(col.id)}
                  className="rounded border-slate-300 dark:border-slate-500 dark:bg-slate-700"
                />
                <label
                  htmlFor={`col-${col.id}`}
                  className="cursor-pointer text-sm text-slate-800 dark:text-slate-200"
                >
                  {col.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-600">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-400 bg-slate-100 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md border border-sky-600 bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}
