import { X } from 'lucide-react'

interface HelpModalProps {
  onClose: () => void
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-600">
          <h2 id="help-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            Ayuda — Cómo usar el Generador DIOT
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-600 dark:hover:text-slate-200"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4 text-sm text-slate-700 dark:text-slate-300">
          <section className="mb-4">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">¿Qué hace esta aplicación?</h3>
            <p>
              Genera archivos TXT en formato DIOT para el SAT (México): la Declaración Informativa de Operaciones con Terceros.
              Puedes capturar operaciones con proveedores nacionales, extranjeros y globales, validar los datos y descargar el archivo listo para subir.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Pasos para usar la aplicación</h3>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <strong>Elige la versión DIOT</strong> (2024 o 2025) en el selector superior. Si cambias de versión, se vacía la tabla.
              </li>
              <li>
                <strong>Introduce los datos</strong> de una de estas formas:
                <ul className="mt-1 list-disc pl-5">
                  <li><strong>Descargar plantilla</strong> → rellénala en Excel → <strong>Importar Excel</strong></li>
                  <li><strong>Pegar desde portapapeles</strong> (o Ctrl+V): la primera fila debe ser encabezados; se abrirá un cuadro para relacionar cada columna pegada con la columna DIOT.</li>
                  <li><strong>Añadir línea</strong> y editar directamente en la tabla.</li>
                </ul>
              </li>
              <li>
                <strong>Revisa los errores</strong> que aparecen en rojo en las celdas. Corrige hasta que no haya errores.
              </li>
              <li>
                <strong>Descargar TXT</strong> cuando todo sea correcto. Sube el archivo <code className="rounded bg-slate-200 px-1 dark:bg-slate-600">diot.txt</code> según indique el SAT.
              </li>
            </ol>
          </section>

          <section className="mb-4">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Botones de la barra de herramientas</h3>
            <ul className="space-y-1.5">
              <li><strong>Descargar plantilla</strong> — Descarga un Excel con los encabezados de la versión elegida para rellenar fuera de la app.</li>
              <li><strong>Importar Excel</strong> — Carga un archivo .xlsx o .xls. La primera hoja debe tener encabezados iguales a la plantilla.</li>
              <li><strong>Pegar desde portapapeles</strong> — Pega datos copiados (p. ej. desde Excel). <strong>Obligatorio:</strong> la primera fila debe ser encabezados; se abrirá un cuadro para mapear columnas. Atajo: <kbd className="rounded border border-slate-400 bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-600">Ctrl+V</kbd> (o <kbd className="rounded border border-slate-400 bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-600">Cmd+V</kbd> en Mac).</li>
              <li><strong>Añadir línea</strong> — Añade una fila vacía para editar en la tabla.</li>
              <li><strong>Eliminar seleccionadas</strong> — Borra las filas que tengas seleccionadas (marca el checkbox a la izquierda de cada fila).</li>
              <li><strong>Descargar TXT</strong> — Genera y descarga el archivo TXT en formato DIOT (pipe, UTF-8). Solo permite descargar si no hay errores de validación.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Validación y campos condicionales</h3>
            <p className="mb-2">
              Los campos obligatorios se marcan con un asterisco rojo. Según el <strong>tipo de tercero</strong> (Nacional / Extranjero / Global), se habilitan o deshabilitan otros campos (RFC, número de identificación fiscal, país, etc.). En la versión 2025, el <strong>tipo de operación</strong> depende del tipo de tercero y el <strong>manifiesto de efectos fiscales</strong> es obligatorio (01 o 02).
            </p>
            <p>
              Si pegas o importas datos sin especificar tipo de tercero pero sí RFC, se asigna por defecto <strong>Nacional</strong>. Si no especificas tipo de operación, se asigna <strong>Otros (85)</strong>.
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Tabla</h3>
            <p>
              Puedes redimensionar el ancho de las columnas arrastrando el borde derecho del encabezado. Las columnas numéricas muestran totales al pie. Los errores de validación aparecen resaltados en la celda correspondiente.
            </p>
          </section>
        </div>
        <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-600">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-sky-600 bg-sky-600 px-3 py-1.5 text-sm text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:ring-offset-slate-800"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
