import type { DiotVersion } from '../schemas/diotSchemas'
import { getSchema } from '../schemas/diotSchemas'

type RowRecord = Record<string, string | number>

/**
 * Indica si en la lista de filas hay al menos dos filas con el mismo RFC (considerando vacío como valor).
 */
export function hasDuplicateRfc(rows: RowRecord[]): boolean {
  const byRfc = new Map<string, number>()
  for (const row of rows) {
    const rfc = String(row.rfc ?? '').trim()
    byRfc.set(rfc, (byRfc.get(rfc) ?? 0) + 1)
  }
  return [...byRfc.values()].some((count) => count > 1)
}

/**
 * Agrupa filas por RFC: para cada RFC conserva los datos de texto de la primera fila
 * y suma las columnas numéricas de todas las filas del grupo.
 */
export function groupRowsByRfc(rows: RowRecord[], version: DiotVersion): RowRecord[] {
  if (rows.length === 0) return []
  const schema = getSchema(version)
  const numericIds = new Set(schema.filter((c) => c.type === 'number').map((c) => c.id))
  const groups = new Map<string, RowRecord[]>()
  for (const row of rows) {
    const rfc = String(row.rfc ?? '').trim()
    const list = groups.get(rfc) ?? []
    list.push(row)
    groups.set(rfc, list)
  }
  const result: RowRecord[] = []
  for (const [, groupRows] of groups) {
    const first = { ...groupRows[0] }
    for (const colId of numericIds) {
      let sum = 0
      for (const r of groupRows) {
        const v = r[colId]
        const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''))
        sum += Number.isNaN(n) ? 0 : Math.round(n)
      }
      first[colId] = sum
    }
    result.push(first)
  }
  return result
}
