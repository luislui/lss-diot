import type { DiotVersion } from '../schemas/diotSchemas'

export interface ValidationError {
  colId: string
  message: string
}

export interface RowValidationResult {
  valid: boolean
  errors: ValidationError[]
}

type RowRecord = Record<string, string | number>

function isEmpty(value: string | number): boolean {
  if (value == null) return true
  const s = String(value).trim()
  return s === ''
}

/** RFC: alfanumérico 12 o 13 posiciones, caracteres alfabéticos en mayúsculas (A-Z, Ñ, & para moral). */
const RFC_PATTERN = /^[A-ZÑ&0-9]{12,13}$/

function normalizeRfc(value: string): string {
  return String(value)
    .trim()
    .toUpperCase()
    .replace(/\s/g, '')
}

function isValidRfcFormat(rfc: string): boolean {
  const n = normalizeRfc(rfc)
  if (n.length === 0) return true
  return n.length >= 12 && n.length <= 13 && RFC_PATTERN.test(n)
}

/**
 * Valida una fila según las reglas de obligatoriedad de los CSV del SAT.
 * - RFC: obligatorio si tipo de tercero es Nacional (04) o Global (15).
 * - Número identificación fiscal, nombre extranjero, país residencia fiscal, lugar jurisdicción:
 *   obligatorios si tipo de tercero es Extranjero (05).
 */
export function validateRow(row: RowRecord, version: DiotVersion): RowValidationResult {
  const errors: ValidationError[] = []
  const tipoTercero = String(row.tipo_tercero ?? '').trim()

  if (isEmpty(row.tipo_tercero)) {
    errors.push({ colId: 'tipo_tercero', message: 'Debe seleccionar el tipo de tercero.' })
  }
  if (isEmpty(row.tipo_operacion)) {
    errors.push({ colId: 'tipo_operacion', message: 'Debe seleccionar el tipo de operación.' })
  }

  // RFC: obligatorio para nacional (04) y global (15); opcional para extranjero (05).
  // Formato: alfanumérico 12 o 13 posiciones, mayúsculas. Para global se usa XAXX010101000.
  const rfcVal = String(row.rfc ?? '').trim()
  if (tipoTercero === '04' || tipoTercero === '15') {
    if (isEmpty(row.rfc)) {
      errors.push({ colId: 'rfc', message: 'RFC es obligatorio cuando el tipo de tercero es Nacional o Global.' })
    } else if (!isValidRfcFormat(rfcVal)) {
      errors.push({
        colId: 'rfc',
        message: 'RFC debe ser alfanumérico de 12 o 13 posiciones; use solo mayúsculas (A-Z, Ñ, 0-9). Para global puede usar XAXX010101000.',
      })
    }
  } else if (tipoTercero === '05' && rfcVal.length > 0 && !isValidRfcFormat(rfcVal)) {
    errors.push({
      colId: 'rfc',
      message: 'RFC debe ser alfanumérico de 12 o 13 posiciones en mayúsculas.',
    })
  }

  // Número de identificación fiscal: obligatorio solo para extranjero (05), máximo 40 posiciones. Acepta caracteres especiales, a-z, ñ, &.
  // Para nacional (04) y global (15) el campo se deja vacío.
  const numIdFiscalVal = String(row.num_id_fiscal ?? '').trim()
  if (tipoTercero === '05') {
    if (isEmpty(row.num_id_fiscal)) {
      errors.push({
        colId: 'num_id_fiscal',
        message: 'Número de identificación fiscal es obligatorio cuando el tipo de tercero es Extranjero.',
      })
    } else if (numIdFiscalVal.length > 40) {
      errors.push({
        colId: 'num_id_fiscal',
        message: 'Número de identificación fiscal: máximo 40 posiciones.',
      })
    }
    const nombreExtranjeroVal = String(row.nombre_extranjero ?? '').trim()
    if (isEmpty(row.nombre_extranjero)) {
      errors.push({
        colId: 'nombre_extranjero',
        message: 'Nombre del extranjero es obligatorio cuando el tipo de tercero es Extranjero.',
      })
    } else if (nombreExtranjeroVal.length > 300) {
      errors.push({
        colId: 'nombre_extranjero',
        message: 'Nombre del extranjero: máximo 300 posiciones.',
      })
    }
    const paisResidenciaVal = String(row.pais_residencia_fiscal ?? '').trim().toUpperCase()
    if (isEmpty(row.pais_residencia_fiscal)) {
      errors.push({
        colId: 'pais_residencia_fiscal',
        message: 'País o jurisdicción de residencia fiscal es obligatorio cuando el tipo de tercero es Extranjero.',
      })
    } else if (paisResidenciaVal.length !== 3 || !/^[A-ZÑ]{3}$/.test(paisResidenciaVal)) {
      errors.push({
        colId: 'pais_residencia_fiscal',
        message: 'País o jurisdicción de residencia fiscal: debe ser alfabético de exactamente 3 caracteres (ej. MEX, USA).',
      })
    }
    // Lugar de jurisdicción fiscal: obligatorio solo cuando país = ZZZ (Otro), máximo 300. Si país ≠ ZZZ, debe quedar vacío.
    const lugarJurisVal = String(row.lugar_jurisdiccion ?? '').trim()
    if (paisResidenciaVal === 'ZZZ') {
      if (isEmpty(row.lugar_jurisdiccion)) {
        errors.push({
          colId: 'lugar_jurisdiccion',
          message: 'Lugar de jurisdicción fiscal es obligatorio cuando el país es ZZZ (Otro).',
        })
      } else if (lugarJurisVal.length > 300) {
        errors.push({
          colId: 'lugar_jurisdiccion',
          message: 'Lugar de jurisdicción fiscal: máximo 300 posiciones.',
        })
      }
    } else if (lugarJurisVal.length > 0) {
      errors.push({
        colId: 'lugar_jurisdiccion',
        message: 'Lugar de jurisdicción fiscal debe quedar vacío cuando el país no es ZZZ (Otro).',
      })
    }
  }

  if (version === '2025') {
    const manifiesto = String(row.manifiesto_efectos_fiscales ?? '').trim()
    if (manifiesto === '' || (manifiesto !== '01' && manifiesto !== '02')) {
      errors.push({
        colId: 'manifiesto_efectos_fiscales',
        message: 'Manifiesto efectos fiscales: debe seleccionar 01 (Sí) o 02 (No).',
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Valida todas las filas y devuelve errores con índice de fila (1-based para el usuario).
 */
export function validateAllRows(
  rows: RowRecord[],
  version: DiotVersion
): { valid: boolean; errorsByRow: { rowIndex: number; rowLabel: number; errors: ValidationError[] }[] } {
  const errorsByRow = rows
    .map((row, index) => {
      const result = validateRow(row, version)
      return { rowIndex: index, rowLabel: index + 1, errors: result.errors }
    })
    .filter((r) => r.errors.length > 0)

  return {
    valid: errorsByRow.length === 0,
    errorsByRow,
  }
}
