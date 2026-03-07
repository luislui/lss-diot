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
      <div className="w-full max-w-md rounded-lg border border-neutral-300 bg-white shadow-xl dark:border-neutral-600 dark:bg-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-600">
          <h2 id="duplicate-rfc-title" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            RFC duplicados detectados
          </h2>
          <button
            type="button"
            onClick={onImportAsIs}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-600 dark:hover:text-neutral-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
          <p>
            Se detectaron filas con RFC duplicado en los datos importados.
          </p>
          <p className="mt-2">
            ¿Desea <strong>agrupar por RFC</strong>? Se conservarán los datos de texto de la primera fila de cada grupo y se <strong>sumarán las columnas numéricas</strong> (valores, IVA, etc.).
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-600">
          <button
            type="button"
            onClick={onImportAsIs}
            className="rounded-md border border-neutral-400 bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
          >
            No, importar tal cual
          </button>
          <button
            type="button"
            onClick={onGroup}
            className="rounded-md border border-[#63048C] bg-[#63048C] px-3 py-1.5 text-sm text-white hover:bg-[#7a05a8] focus:outline-none focus:ring-2 focus:ring-[#63048C] focus:ring-offset-1 dark:bg-[#9d3dd4] dark:hover:bg-[#b855e8] dark:focus:ring-[#b855e8] dark:ring-offset-neutral-800"
          >
            Sí, agrupar por RFC
          </button>
        </div>
      </div>
    </div>
  )
}
