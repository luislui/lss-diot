import * as XLSX from 'xlsx'
import type { DiotVersion } from '../schemas/diotSchemas'
import { getSchema, createEmptyRow } from '../schemas/diotSchemas'

/**
 * Parsea un archivo Excel (primera hoja) y devuelve filas según el esquema de la versión.
 * La primera fila debe ser los encabezados (labels de las columnas DIOT).
 * Si un encabezado no coincide con el esquema, se ignora esa columna.
 */
export function parseExcelFile(
  file: File,
  version: DiotVersion
): Promise<Record<string, string | number>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data || !(data instanceof ArrayBuffer)) {
          reject(new Error('No se pudo leer el archivo'))
          return
        }
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          reject(new Error('El archivo no contiene hojas'))
          return
        }
        const sheet = workbook.Sheets[firstSheetName]
        const aoa = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: '',
          raw: false,
        }) as (string | number)[][]

        if (aoa.length < 2) {
          resolve([])
          return
        }

        const schema = getSchema(version)
        const headerRow = aoa[0].map((h) => String(h ?? '').trim())
        const labelToIndex = new Map<string, number>()
        headerRow.forEach((label, i) => {
          if (label) labelToIndex.set(label, i)
        })

        const rows: Record<string, string | number>[] = []
        for (let r = 1; r < aoa.length; r++) {
          const rawRow = aoa[r] ?? []
          const row = createEmptyRow(version)
          schema.forEach((col) => {
            const idx = labelToIndex.get(col.label)
            if (idx === undefined) return
            const raw = rawRow[idx]
            const str = raw !== undefined && raw !== null ? String(raw).trim() : ''
            if (col.type === 'number') {
              const n = Number(str.replace(/,/g, '').replace(/\s/g, ''))
              row[col.id] = Number.isNaN(n) ? 0 : Math.round(n)
            } else {
              row[col.id] = str
            }
          })
          rows.push(row)
        }
        resolve(rows)
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Error al procesar el Excel'))
      }
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}
