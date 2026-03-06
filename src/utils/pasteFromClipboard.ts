import type { DiotVersion } from '../schemas/diotSchemas'
import { getSchema, createEmptyRow } from '../schemas/diotSchemas'

type RowRecord = Record<string, string | number>

/** Si hay RFC y no se especificó tipo de tercero, asigna Nacional (04). Si no se especificó tipo de operación, asigna Otros (85). */
function applyPasteDefaults(row: RowRecord): void {
  const rfc = String(row.rfc ?? '').trim()
  const tipoTercero = String(row.tipo_tercero ?? '').trim()
  const tipoOperacion = String(row.tipo_operacion ?? '').trim()
  if (rfc && !tipoTercero) {
    row.tipo_tercero = '04'
  }
  if (!tipoOperacion) {
    row.tipo_operacion = '85'
  }
}

/**
 * Parsea texto pegado en una matriz de filas/columnas (tab + newline).
 */
export function parsePastedToLines(text: string): string[][] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return lines.map((line) => line.split(/\t/).map((c) => c.trim()))
}

/**
 * Indica si los datos pegados tienen encabezado (2+ filas y 2+ columnas en la primera).
 */
export function hasPastedHeaders(lines: string[][]): boolean {
  if (lines.length < 2) return false
  const firstRow = lines[0]
  return firstRow.length >= 2
}

/**
 * Parsea filas pegadas usando un mapeo columna copiada → columna DIOT.
 * lines[0] se considera encabezado; lines[1..] son datos.
 * mapping: índice de columna pegada → id de columna del esquema (sin mapear = no se importa).
 */
export function parsePastedDataWithMapping(
  lines: string[][],
  version: DiotVersion,
  mapping: Record<number, string>
): Record<string, string | number>[] {
  if (Object.keys(mapping).length === 0) return []
  const schema = getSchema(version)
  const colById = new Map(schema.map((c) => [c.id, c]))
  const dataRows = lines.slice(1)
  if (dataRows.length === 0) return []

  return dataRows.map((rawRow) => {
    const row = createEmptyRow(version)
    Object.entries(mapping).forEach(([pastedIdxStr, colId]) => {
      const col = colById.get(colId)
      if (!col) return
      const pastedIdx = Number(pastedIdxStr)
      const raw = rawRow[pastedIdx] !== undefined ? String(rawRow[pastedIdx]).trim() : ''
      if (col.type === 'number') {
        const n = Number(raw.replace(/,/g, ''))
        row[col.id] = Number.isNaN(n) ? 0 : Math.round(n)
      } else {
        row[col.id] = raw
      }
    })
    applyPasteDefaults(row)
    return row
  })
}

/**
 * Parsea texto pegado (típico de Excel: tabulaciones y saltos de línea)
 * y devuelve filas como objetos según el esquema de la versión.
 * Si una fila tiene menos columnas, se rellenan con vacío/0; si tiene más, se truncan.
 * No asume encabezados; la primera fila se trata como datos.
 */
export function parsePastedData(
  text: string,
  version: DiotVersion
): Record<string, string | number>[] {
  const schema = getSchema(version)
  const lines = parsePastedToLines(text)
  if (lines.length === 0) return []

  return lines.map((line) => {
    const cells = line
    const row = createEmptyRow(version)
    schema.forEach((col, i) => {
      const raw = cells[i] ?? (col.type === 'number' ? '0' : '')
      if (col.type === 'number') {
        const n = Number(String(raw).replace(/,/g, ''))
        row[col.id] = Number.isNaN(n) ? 0 : Math.round(n)
      } else {
        row[col.id] = raw
      }
    })
    applyPasteDefaults(row)
    return row
  })
}
