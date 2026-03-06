import type { DiotVersion } from '../schemas/diotSchemas'
import { getSchema, createEmptyRow } from '../schemas/diotSchemas'

/**
 * Parsea texto pegado (típico de Excel: tabulaciones y saltos de línea)
 * y devuelve filas como objetos según el esquema de la versión.
 * Si una fila tiene menos columnas, se rellenan con vacío/0; si tiene más, se truncan.
 */
export function parsePastedData(
  text: string,
  version: DiotVersion
): Record<string, string | number>[] {
  const schema = getSchema(version)
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (lines.length === 0) return []

  return lines.map((line) => {
    const cells = line.split(/\t/).map((c) => c.trim())
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
    return row
  })
}
