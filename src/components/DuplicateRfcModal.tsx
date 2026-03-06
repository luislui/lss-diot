import { X } from 'lucide-react'

interface DuplicateRfcModalProps {
  onGroup: () => void
  onImportAsIs: () => void
}

export function DuplicateRfcModal({ onGroup, onImportAsIs }: DuplicateRfcModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-rfc-title"
    >
      <div className="w-full max-w-md rounded-lg border border-slate-300 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-600">
          <h2 id="duplicate-rfc-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            RFC duplicados detectados
          </h2>
          <button
            type="button"
            onClick={onImportAsIs}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Se detectaron filas con RFC duplicado en los datos importados.
          </p>
          <p className="mt-2">
            ¿Desea <strong>agrupar por RFC</strong>? Se conservarán los datos de texto de la primera fila de cada grupo y se <strong>sumarán las columnas numéricas</strong> (valores, IVA, etc.).
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-600">
          <button
            type="button"
            onClick={onImportAsIs}
            className="rounded-md border border-slate-400 bg-slate-100 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            No, importar tal cual
          </button>
          <button
            type="button"
            onClick={onGroup}
            className="rounded-md border border-sky-600 bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:ring-offset-slate-800"
          >
            Sí, agrupar por RFC
          </button>
        </div>
      </div>
    </div>
  )
}
