/**
 * Formatea un número con separador de miles (locale es-MX: 1,234,567).
 * Sin decimales, para vista del usuario.
 */
export function formatNumber(value: number | string): string {
  const n = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return '0'
  return Math.round(n).toLocaleString('es-MX', { maximumFractionDigits: 0 })
}

/**
 * Parsea un string con posible separador de miles (coma o punto) y devuelve el número (entero).
 */
export function parseNumber(input: string): number {
  const cleaned = input.replace(/,/g, '').replace(/\s/g, '')
  const n = Number(cleaned)
  return Number.isNaN(n) ? 0 : Math.round(n)
}
