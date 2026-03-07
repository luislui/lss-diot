import { useState, useCallback, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { VersionSelector } from './components/VersionSelector'
import { Toolbar } from './components/Toolbar'
import { DiotGrid } from './components/DiotGrid'
import { PasteMappingModal } from './components/PasteMappingModal'
import { HelpModal } from './components/HelpModal'
import { DuplicateRfcModal } from './components/DuplicateRfcModal'
import { ColumnVisibilityModal } from './components/ColumnVisibilityModal'
import { HelpCircle } from 'lucide-react'
import { getSchema, createEmptyRow, type DiotVersion } from './schemas/diotSchemas'
import { getHiddenColumnIds, setHiddenColumnIds } from './utils/columnVisibility'
import { getStoredDiotVersion, setStoredDiotVersion } from './utils/diotVersionStorage'
import { validateRow } from './utils/validation'
import { parsePastedToLines, hasPastedHeaders, parsePastedDataWithMapping } from './utils/pasteFromClipboard'
import { hasDuplicateRfc, groupRowsByRfc } from './utils/groupByRfc'

type RowRecord = Record<string, string | number>

type PasteModalState =
  | { open: false; lines: null; version: null }
  | { open: true; lines: string[][]; version: DiotVersion }

type PendingImportState = {
  rows: RowRecord[]
  version: DiotVersion
  mode: 'append' | 'replace'
}

function App() {
  const [version, setVersion] = useState<DiotVersion>(getStoredDiotVersion)
  const [rows, setRows] = useState<RowRecord[]>([])
  const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>([])
  const [pasteModal, setPasteModal] = useState<PasteModalState>({ open: false, lines: null, version: null })
  const [pendingImport, setPendingImport] = useState<PendingImportState | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false)
  const [hiddenByVersion, setHiddenByVersion] = useState<Record<DiotVersion, string[]>>(() => ({
    '2024': getHiddenColumnIds('2024'),
    '2025': getHiddenColumnIds('2025'),
  }))

  const handleVersionChange = useCallback((newVersion: DiotVersion) => {
    setVersion(newVersion)
    setStoredDiotVersion(newVersion)
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

  const openPasteMappingModal = useCallback((lines: string[][], v: DiotVersion) => {
    setPasteModal({ open: true, lines, version: v })
  }, [])

  const applyImport = useCallback((importedRows: RowRecord[], mode: 'append' | 'replace') => {
    if (mode === 'append') {
      setRows((prev) => [...prev, ...importedRows])
    } else {
      setRows(importedRows)
    }
  }, [])

  const handleImportRows = useCallback(
    (importedRows: RowRecord[], v: DiotVersion, mode: 'append' | 'replace') => {
      if (importedRows.length === 0) return
      if (hasDuplicateRfc(importedRows)) {
        setPendingImport({ rows: importedRows, version: v, mode })
        return
      }
      applyImport(importedRows, mode)
      const msg = mode === 'append' ? `${importedRows.length} fila(s) pegada(s) con el mapeo de columnas.` : `${importedRows.length} fila(s) importada(s) desde Excel.`
      toast.success(msg)
    },
    [applyImport]
  )

  const handleDuplicateRfcGroup = useCallback(() => {
    if (!pendingImport) return
    const grouped = groupRowsByRfc(pendingImport.rows, pendingImport.version)
    applyImport(grouped, pendingImport.mode)
    setPendingImport(null)
    toast.success(`Filas agrupadas por RFC: ${grouped.length} fila(s) resultante(s).`)
  }, [pendingImport, applyImport])

  const handleDuplicateRfcImportAsIs = useCallback(() => {
    if (!pendingImport) return
    applyImport(pendingImport.rows, pendingImport.mode)
    setPendingImport(null)
    const n = pendingImport.rows.length
    toast.success(pendingImport.mode === 'append' ? `${n} fila(s) pegada(s).` : `${n} fila(s) importada(s) desde Excel.`)
  }, [pendingImport, applyImport])

  const handlePasteMappingConfirm = useCallback(
    (mapping: Record<number, string>) => {
      if (!pasteModal.open || !pasteModal.lines) return
      const newRows = parsePastedDataWithMapping(pasteModal.lines, pasteModal.version, mapping)
      setPasteModal({ open: false, lines: null, version: null })
      if (newRows.length > 0) {
        handleImportRows(newRows, pasteModal.version, 'append')
      } else {
        toast.error('No hay filas de datos tras la fila de encabezados.')
      }
    },
    [pasteModal, handleImportRows]
  )

  const handlePasteMappingCancel = useCallback(() => {
    setPasteModal({ open: false, lines: null, version: null })
  }, [])

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
            const lines = parsePastedToLines(text)
            if (hasPastedHeaders(lines)) {
              openPasteMappingModal(lines, version)
            } else {
              toast.error(
                'Es obligatorio pegar datos con encabezados. Incluye en la primera fila los nombres de las columnas (por ejemplo, copia desde Excel con la fila de títulos). Debe haber al menos 2 filas y 2 columnas.',
                { duration: 7000 }
              )
            }
          })
          .catch(() => {
            toast.error('No se pudo leer el portapapeles.')
          })
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [version, openPasteMappingModal])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="https://www.loeramsoft.com" target="_blank" rel="noopener noreferrer" className="shrink-0" aria-label="Loeram Software Solutions">
              <img src="/logo_loeram_short.png" alt="Loeram" className="h-10 w-auto object-contain" />
            </a>
            <div>
              <h1 className="m-0 text-2xl font-bold text-slate-900 dark:text-white">LSS Generador de DIOT</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generador de archivos TXT DIOT para el SAT (México)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-400 bg-slate-100 px-3 py-1.5 text-sm text-slate-800 shadow-sm transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-offset-slate-800"
            title="Ayuda"
          >
            <HelpCircle size={18} aria-hidden />
            Ayuda
          </button>
        </div>
      </header>
      <main className="flex-1 w-full px-4 py-4">
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
          onOpenPasteMapping={openPasteMappingModal}
          onImportRows={handleImportRows}
          onOpenColumnVisibility={() => setColumnVisibilityOpen(true)}
        />
        <DiotGrid
          version={version}
          columns={schema}
          rows={rows}
          onRowsChange={setRows}
          selectedRowIndices={selectedRowIndices}
          onSelectedRowIndicesChange={setSelectedRowIndices}
          rowErrors={rowErrors}
          hiddenColumnIds={hiddenByVersion[version]}
        />
      </main>
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        <a
          href="https://www.loeramsoft.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-600 hover:underline dark:hover:text-sky-400"
        >
          Loeram Software Solutions
        </a>
      </footer>
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
      {pendingImport && (
        <DuplicateRfcModal
          onGroup={handleDuplicateRfcGroup}
          onImportAsIs={handleDuplicateRfcImportAsIs}
        />
      )}
      {pasteModal.open && pasteModal.lines && (
        <PasteMappingModal
          version={pasteModal.version}
          pastedHeaders={pasteModal.lines[0] ?? []}
          schemaColumns={schema.map((c) => ({ id: c.id, label: c.label }))}
          onConfirm={handlePasteMappingConfirm}
          onCancel={handlePasteMappingCancel}
        />
      )}
      {columnVisibilityOpen && (
        <ColumnVisibilityModal
          columns={schema.map((c) => ({ id: c.id, label: c.label }))}
          hiddenColumnIds={hiddenByVersion[version]}
          onSave={(hiddenIds) => {
            setHiddenByVersion((prev) => ({ ...prev, [version]: hiddenIds }))
            setHiddenColumnIds(version, hiddenIds)
            setColumnVisibilityOpen(false)
            toast.success('Visibilidad de columnas guardada.')
          }}
          onCancel={() => setColumnVisibilityOpen(false)}
        />
      )}
    </div>
  )
}

export default App
