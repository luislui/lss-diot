import type { DiotVersion } from '../schemas/diotSchemas'
import { getSchema } from '../schemas/diotSchemas'

/**
 * Formatea un valor para el TXT SAT: sin decimales, sin puntos ni comas.
 */
function formatValue(value: string | number, isNumber: boolean): string {
  if (value === '' || value === null || value === undefined) return ''
  if (isNumber) {
    const n = Number(String(value).replace(/,/g, '').replace(/\./g, ''))
    if (Number.isNaN(n)) return '0'
    return String(Math.round(n))
  }
  return String(value).trim()
}

/**
 * Genera el contenido del archivo TXT DIOT: una línea por fila, campos separados por |, UTF-8.
 * No incluye la fila de totales; solo las filas de datos.
 */
export function buildDiotTxtContent(
  rows: Record<string, string | number>[],
  version: DiotVersion
): string {
  const schema = getSchema(version)
  const lines = rows.map((row) => {
    const values = schema.map((col) =>
      formatValue(row[col.id] ?? (col.type === 'number' ? 0 : ''), col.type === 'number')
    )
    return values.join('|')
  })
  return lines.join('\n')
}

/**
 * Descarga el archivo TXT con codificación UTF-8 (con BOM para compatibilidad).
 */
export function downloadDiotTxt(content: string, filename = 'diot.txt'): void {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
