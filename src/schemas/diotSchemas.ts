export type DiotVersion = '2024' | '2025'

export type ColumnType = 'text' | 'number'

export interface DiotColumnOption {
  value: string
  label: string
}

export interface DiotColumn {
  id: string
  label: string
  type: ColumnType
  /** Si está definido, se muestra un <select> con estas opciones (valor para el TXT = value). */
  options?: DiotColumnOption[]
  /** Marca el campo como obligatorio en el encabezado (asterisco). */
  required?: boolean
  /** Indica cuándo es obligatorio, ej. "si es nacional o global". Se muestra en tooltip. */
  requiredWhen?: string
}

/** Opciones tipo de tercero (común 2024 y 2025). */
const optionsTipoTercero: DiotColumnOption[] = [
  { value: '04', label: '04 - Nacional' },
  { value: '05', label: '05 - Extranjero' },
  { value: '15', label: '15 - Global' },
]

/** Opciones tipo de operación 2024. */
const optionsTipoOperacion2024: DiotColumnOption[] = [
  { value: '03', label: '03 - Serv. Prof.' },
  { value: '06', label: '06 - Uso o goce temporal de bienes' },
  { value: '85', label: '85 - Otros' },
  { value: '87', label: '87 - Operaciones globales' },
]

/** Opciones tipo de operación 2025: varían según tipo de tercero (solo versión 2025). */
const optionsTipoOperacion2025Nacional: DiotColumnOption[] = [
  { value: '02', label: '02 - Enajenación de bienes' },
  { value: '03', label: '03 - Prestación de Servicios Profesionales' },
  { value: '06', label: '06 - Uso o goce temporal de bienes' },
  { value: '08', label: '08 - Importación por transferencia virtual' },
  { value: '85', label: '85 - Otros' },
]
const optionsTipoOperacion2025Extranjero: DiotColumnOption[] = [
  { value: '02', label: '02 - Enajenación de bienes' },
  { value: '03', label: '03 - Prestación de Servicios Profesionales' },
  { value: '07', label: '07 - Importación de bienes o servicios' },
]
const optionsTipoOperacion2025Global: DiotColumnOption[] = [
  { value: '87', label: '87 - Operaciones globales' },
]

/** Devuelve las opciones de tipo de operación para 2025 según el tipo de tercero de la fila. */
export function getTipoOperacionOptionsFor2025(tipoTercero: string): DiotColumnOption[] {
  const t = String(tipoTercero).trim()
  if (t === '04') return optionsTipoOperacion2025Nacional
  if (t === '05') return optionsTipoOperacion2025Extranjero
  if (t === '15') return optionsTipoOperacion2025Global
  return []
}

/** Esquema 2024 y anteriores: 23 columnas (sin "Ejemplo de salida"). */
export const schema2024: DiotColumn[] = [
  { id: 'tipo_tercero', label: 'Tipo de tercero', type: 'text', options: optionsTipoTercero, required: true },
  { id: 'tipo_operacion', label: 'Tipo de operación', type: 'text', options: optionsTipoOperacion2024, required: true },
  { id: 'rfc', label: 'RFC', type: 'text', required: true, requiredWhen: 'Obligatorio si es nacional o global' },
  { id: 'num_id_fiscal', label: 'Número identificación fiscal', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'nombre_extranjero', label: 'Nombre del extranjero', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'pais_residencia_fiscal', label: 'País residencia fiscal', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'lugar_jurisdiccion', label: 'Lugar de jurisdicción fiscal', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'valor_actos_16', label: 'Valor actos 16% IVA', type: 'number' },
  { id: 'monto_iva_16', label: 'Monto IVA no acreditable 16%', type: 'number' },
  { id: 'valor_actos_11', label: 'Valor actos 11% IVA', type: 'number' },
  { id: 'monto_iva_11', label: 'Monto IVA no acreditable 11%', type: 'number' },
  { id: 'valor_frontera_norte', label: 'Valor región fronteriza norte', type: 'number' },
  { id: 'monto_iva_frontera_norte', label: 'Monto IVA región fronteriza norte', type: 'number' },
  { id: 'valor_frontera_sur', label: 'Valor región fronteriza sur', type: 'number' },
  { id: 'monto_iva_frontera_sur', label: 'Monto IVA región fronteriza sur', type: 'number' },
  { id: 'valor_import_16', label: 'Valor importación 16%', type: 'number' },
  { id: 'monto_iva_import_16', label: 'Monto IVA importación 16%', type: 'number' },
  { id: 'valor_import_exentos', label: 'Valor importación exentos', type: 'number' },
  { id: 'valor_exentos', label: 'Valor exentos', type: 'number' },
  { id: 'valor_0', label: 'Valor 0% IVA', type: 'number' },
  { id: 'valor_no_objeto', label: 'Valor no objeto IVA', type: 'number' },
  { id: 'iva_retenido', label: 'IVA retenido', type: 'number' },
  { id: 'iva_devoluciones', label: 'IVA devoluciones, descuentos y bonificaciones', type: 'number' },
]

/** Esquema 2025 en adelante: 57 columnas. Tipo de operación tiene opciones según tipo de tercero (usa getTipoOperacionOptionsFor2025 en la tabla). */
export const schema2025: DiotColumn[] = [
  { id: 'tipo_tercero', label: 'Tipo de tercero', type: 'text', options: optionsTipoTercero, required: true },
  { id: 'tipo_operacion', label: 'Tipo de operación', type: 'text', required: true },
  { id: 'rfc', label: 'RFC', type: 'text', required: true, requiredWhen: 'Obligatorio si es nacional o global' },
  { id: 'num_id_fiscal', label: 'Número identificación fiscal', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'nombre_extranjero', label: 'Nombre del extranjero', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'pais_residencia_fiscal', label: 'País residencia fiscal', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'lugar_jurisdiccion', label: 'Lugar de jurisdicción fiscal', type: 'text', required: true, requiredWhen: 'Obligatorio si es extranjero' },
  { id: 'v1', label: 'Valor total región fronteriza norte', type: 'number' },
  { id: 'v2', label: 'Devol. región fronteriza norte', type: 'number' },
  { id: 'v3', label: 'Valor total región fronteriza sur', type: 'number' },
  { id: 'v4', label: 'Devol. región fronteriza sur', type: 'number' },
  { id: 'v5', label: 'Valor total 16% IVA', type: 'number' },
  { id: 'v6', label: 'Devol. 16% IVA', type: 'number' },
  { id: 'v7', label: 'Valor import. aduana bienes 16%', type: 'number' },
  { id: 'v8', label: 'Devol. import. aduana 16%', type: 'number' },
  { id: 'v9', label: 'Valor import. intangibles/serv. 16%', type: 'number' },
  { id: 'v10', label: 'Devol. import. intangibles 16%', type: 'number' },
  { id: 'v11', label: 'Exclusivo gravado frontera norte', type: 'number' },
  { id: 'v12', label: 'Proporción frontera norte', type: 'number' },
  { id: 'v13', label: 'Exclusivo gravado frontera sur', type: 'number' },
  { id: 'v14', label: 'Proporción frontera sur', type: 'number' },
  { id: 'v15', label: 'Exclusivo gravado 16%', type: 'number' },
  { id: 'v16', label: 'Proporción 16%', type: 'number' },
  { id: 'v17', label: 'Exclusivo import. aduana 16%', type: 'number' },
  { id: 'v18', label: 'Proporción import. aduana 16%', type: 'number' },
  { id: 'v19', label: 'Exclusivo import. intangibles 16%', type: 'number' },
  { id: 'v20', label: 'Proporción import. intangibles 16%', type: 'number' },
  { id: 'v21', label: 'Prop. frontera norte', type: 'number' },
  { id: 'v22', label: 'No cumple requisitos frontera norte', type: 'number' },
  { id: 'v23', label: 'Exentas frontera norte', type: 'number' },
  { id: 'v24', label: 'No objeto frontera norte', type: 'number' },
  { id: 'v25', label: 'Prop. frontera sur', type: 'number' },
  { id: 'v26', label: 'No cumple requisitos frontera sur', type: 'number' },
  { id: 'v27', label: 'Exentas frontera sur', type: 'number' },
  { id: 'v28', label: 'No objeto frontera sur', type: 'number' },
  { id: 'v29', label: 'Prop. 16%', type: 'number' },
  { id: 'v30', label: 'No cumple requisitos 16%', type: 'number' },
  { id: 'v31', label: 'Exentas 16%', type: 'number' },
  { id: 'v32', label: 'No objeto 16%', type: 'number' },
  { id: 'v33', label: 'Prop. import. aduana 16%', type: 'number' },
  { id: 'v34', label: 'No cumple import. aduana 16%', type: 'number' },
  { id: 'v35', label: 'Exentas import. aduana 16%', type: 'number' },
  { id: 'v36', label: 'No objeto import. aduana 16%', type: 'number' },
  { id: 'v37', label: 'Prop. import. intangibles 16%', type: 'number' },
  { id: 'v38', label: 'No cumple import. intangibles 16%', type: 'number' },
  { id: 'v39', label: 'Exentas import. intangibles 16%', type: 'number' },
  { id: 'v40', label: 'No objeto import. intangibles 16%', type: 'number' },
  { id: 'iva_retenido_2025', label: 'IVA retenido pagado', type: 'number' },
  { id: 'valor_import_exentos_2025', label: 'Valor import. exentos', type: 'number' },
  { id: 'valor_exentos_2025', label: 'Valor exentos', type: 'number' },
  { id: 'valor_0_2025', label: 'Valor 0% IVA', type: 'number' },
  { id: 'valor_no_objeto_nacional', label: 'Valor no objeto IVA territorio nacional', type: 'number' },
  { id: 'valor_no_objeto_sin_estab', label: 'Valor no objeto IVA sin establecimiento', type: 'number' },
  {
    id: 'manifiesto_efectos_fiscales',
    label: 'Manifiesto efectos fiscales (detalle)',
    type: 'text',
    required: true,
    requiredWhen: 'Tipo de proveedor/tercero a reportar: 01 Sí, 02 No',
    options: [
      { value: '01', label: '01 - Sí' },
      { value: '02', label: '02 - No' },
    ],
  },
]

export function getSchema(version: DiotVersion): DiotColumn[] {
  return version === '2024' ? schema2024 : schema2025
}

export function createEmptyRow(version: DiotVersion): Record<string, string | number> {
  const schema = getSchema(version)
  const row: Record<string, string | number> = {}
  for (const col of schema) {
    if (version === '2025' && col.id === 'manifiesto_efectos_fiscales') {
      row[col.id] = '01'
    } else {
      row[col.id] = col.type === 'number' ? 0 : ''
    }
  }
  return row
}
