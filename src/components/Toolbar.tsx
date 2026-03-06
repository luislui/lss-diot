import { useRef } from 'react'
import toast from 'react-hot-toast'
import { ClipboardPaste, Plus, Trash2, Download, FileSpreadsheet, Upload } from 'lucide-react'
import type { DiotVersion } from '../schemas/diotSchemas'
import { buildDiotTxtContent, downloadDiotTxt } from '../utils/exportTxt'
import { downloadExcelTemplate } from '../utils/excelTemplate'
import { parseExcelFile } from '../utils/importExcel'
import { parsePastedData } from '../utils/pasteFromClipboard'
import { validateAllRows } from '../utils/validation'

type RowRecord = Record<string, string | number>

interface ToolbarProps {
  version: DiotVersion
  rows: RowRecord[]
  onRowsChange: (rows: RowRecord[]) => void
  createEmptyRow: () => RowRecord
  selectedRowIndices: number[]
  onSelectionClear: () => void
}

const btnClass =
  'inline-flex items-center gap-2 rounded-md border border-slate-400 bg-slate-100 px-3 py-1.5 text-sm text-slate-800 shadow-sm transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-900'
const iconSize = 18
const btnDisabledClass = 'cursor-not-allowed opacity-60 hover:bg-slate-100 dark:hover:bg-slate-700'

export function Toolbar({
  version,
  rows,
  onRowsChange,
  createEmptyRow,
  selectedRowIndices,
  onSelectionClear,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadTemplate = () => {
    downloadExcelTemplate(version)
    toast.success(`Plantilla DIOT ${version} descargada. Rellénala e impórtala aquí.`)
  }

  const handleImportExcel = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const imported = await parseExcelFile(file, version)
      if (imported.length === 0) {
        toast.error('El archivo no tiene filas de datos o los encabezados no coinciden con la plantilla.')
        return
      }
      onRowsChange(imported)
      toast.success(`${imported.length} fila(s) importada(s) desde Excel.`)
    } catch {
      toast.error('No se pudo leer el archivo. Usa la plantilla DIOT de esta versión.')
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const newRows = parsePastedData(text, version)
      if (newRows.length > 0) {
        onRowsChange([...rows, ...newRows])
      }
    } catch {
      toast.error('No se pudo leer el portapapeles. Comprueba que hayas copiado datos desde Excel.')
    }
  }

  const handleAddRow = () => {
    onRowsChange([...rows, createEmptyRow()])
  }

  const handleDeleteSelected = () => {
    if (selectedRowIndices.length === 0) {
      toast.error('Selecciona al menos una fila para eliminar.')
      return
    }
    const set = new Set(selectedRowIndices)
    const next = rows.filter((_, i) => !set.has(i))
    onRowsChange(next)
    onSelectionClear()
  }

  const handleDownload = () => {
    if (rows.length === 0) {
      toast.error('No hay filas para exportar. Añade o pega datos primero.')
      return
    }
    const { valid, errorsByRow } = validateAllRows(rows, version)
    if (!valid) {
      const lines = errorsByRow.flatMap(({ rowLabel, errors }) =>
        errors.map((e) => `Fila ${rowLabel}: ${e.message}`)
      )
      toast.error(
        <span>
          <strong>Errores de validación</strong>
          <ul className="mt-2 list-inside list-disc pl-4">
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </span>,
        { duration: 8000 }
      )
      return
    }
    const content = buildDiotTxtContent(rows, version)
    downloadDiotTxt(content, 'diot.txt')
    toast.success('Archivo diot.txt descargado.')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
      <button type="button" onClick={handleDownloadTemplate} className={btnClass} title="Descargar plantilla Excel">
        <FileSpreadsheet size={iconSize} aria-hidden />
        Descargar plantilla
      </button>
      <button type="button" onClick={handleImportExcel} className={btnClass} title="Importar desde Excel">
        <Upload size={iconSize} aria-hidden />
        Importar Excel
      </button>
      <button type="button" onClick={handlePaste} className={btnClass} title="Pegar desde portapapeles">
        <ClipboardPaste size={iconSize} aria-hidden />
        Pegar desde portapapeles
      </button>
      <button type="button" onClick={handleAddRow} className={btnClass} title="Añadir línea">
        <Plus size={iconSize} aria-hidden />
        Añadir línea
      </button>
      <button
        type="button"
        onClick={handleDeleteSelected}
        className={`${btnClass} ${selectedRowIndices.length === 0 ? btnDisabledClass : ''}`}
        title="Eliminar filas seleccionadas"
      >
        <Trash2 size={iconSize} aria-hidden />
        Eliminar seleccionadas {selectedRowIndices.length > 0 ? `(${selectedRowIndices.length})` : ''}
      </button>
      <button type="button" onClick={handleDownload} className={btnClass} title="Descargar archivo TXT">
        <Download size={iconSize} aria-hidden />
        Descargar TXT
      </button>
    </div>
  )
}
