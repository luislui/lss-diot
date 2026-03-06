import * as XLSX from 'xlsx'
import type { DiotVersion } from '../schemas/diotSchemas'
import { getSchema, createEmptyRow } from '../schemas/diotSchemas'

/**
 * Genera y descarga una plantilla Excel con las columnas DIOT de la versión indicada.
 * La primera fila son los encabezados (labels); la segunda es una fila de ejemplo vacía.
 */
export function downloadExcelTemplate(version: DiotVersion): void {
  const schema = getSchema(version)
  const headers = schema.map((col) => col.label)
  const emptyRow = createEmptyRow(version)
  const firstDataRow = schema.map((col) => {
    const v = emptyRow[col.id]
    return col.type === 'number' ? (typeof v === 'number' ? v : 0) : (v ?? '')
  })
  const aoa: (string | number)[][] = [headers, firstDataRow]
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  const sheetName = version === '2025' ? 'DIOT 2025' : 'DIOT 2024'
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  const filename = `plantilla-diot-${version}.xlsx`
  XLSX.writeFile(wb, filename)
}
