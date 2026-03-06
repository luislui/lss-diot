import { useState, useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { VersionSelector } from './components/VersionSelector'
import { Toolbar } from './components/Toolbar'
import { DiotGrid } from './components/DiotGrid'
import { getSchema, createEmptyRow, type DiotVersion } from './schemas/diotSchemas'
import { validateRow } from './utils/validation'
import { parsePastedData } from './utils/pasteFromClipboard'

type RowRecord = Record<string, string | number>

function App() {
  const [version, setVersion] = useState<DiotVersion>('2025')
  const [rows, setRows] = useState<RowRecord[]>([])
  const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([])

  const handleVersionChange = useCallback((newVersion: DiotVersion) => {
    setVersion(newVersion)
    setRows([])
    setSelectedRowIndices([])
  }, [])

  const schema = getSchema(version)
  const createRow = useCallback(() => createEmptyRow(version), [version])

  const rowErrors = useMemo(() => {
    const r: Record<number, import('./utils/validation').ValidationError[]> = {}
    rows.forEach((row, i) => {
      const result = validateRow(row, version)
      if (result.errors.length > 0) r[i] = result.errors
    })
    return r
  }, [rows, version])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        const target = e.target as Node
        if (
          target &&
          (target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement)
        ) {
          return
        }
        e.preventDefault()
        navigator.clipboard
          .readText()
          .then((text) => {
            const newRows = parsePastedData(text, version)
            if (newRows.length > 0) {
              setRows((prev) => [...prev, ...newRows])
              toast.success(`${newRows.length} fila(s) pegada(s).`)
            }
          })
          .catch(() => {
            toast.error('No se pudo leer el portapapeles.')
          })
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [version])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h1 className="m-0 text-2xl font-bold text-slate-900 dark:text-white">LSS Generador de DIOT</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generador de archivos TXT DIOT para el SAT (México)</p>
      </header>
      <main className="w-full px-4 py-4">
        <div className="mb-2 flex items-center gap-4">
          <VersionSelector value={version} onChange={handleVersionChange} />
        </div>
        <Toolbar
          version={version}
          rows={rows}
          onRowsChange={setRows}
          createEmptyRow={createRow}
          selectedRowIndices={selectedRowIndices}
          onSelectionClear={() => setSelectedRowIndices([])}
        />
        <DiotGrid
          version={version}
          columns={schema}
          rows={rows}
          onRowsChange={setRows}
          selectedRowIndices={selectedRowIndices}
          onSelectedRowIndicesChange={setSelectedRowIndices}
          rowErrors={rowErrors}
        />
      </main>
    </div>
  )
}

export default App
