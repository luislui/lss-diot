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
  { id: 'valor_actos_16', label: 'Base 16%', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados a la tasa del 16% de IVA' },
  { id: 'monto_iva_16', label: 'IVA no acreditable 16%', type: 'number', requiredWhen: 'Monto del IVA pagado no acreditable a la tasa del 16%' },
  { id: 'valor_actos_11', label: 'Base 11%', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados a la tasa del 11% de IVA' },
  { id: 'monto_iva_11', label: 'IVA no acreditable 11%', type: 'number', requiredWhen: 'Monto del IVA pagado no acreditable a la tasa del 11%' },
  { id: 'valor_frontera_norte', label: 'Base Norte', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados en la región fronteriza norte' },
  { id: 'monto_iva_frontera_norte', label: 'IVA no acreditable Norte', type: 'number', requiredWhen: 'Monto del IVA pagado no acreditable en la región fronteriza norte' },
  { id: 'valor_frontera_sur', label: 'Base Sur', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados en la región fronteriza sur' },
  { id: 'monto_iva_frontera_sur', label: 'IVA no acreditable Sur', type: 'number', requiredWhen: 'Monto del IVA pagado no acreditable en la región fronteriza sur' },
  { id: 'valor_import_16', label: 'Base Imp. 16%', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados en la importación de bienes y servicios a la tasa del 16% de IVA' },
  { id: 'monto_iva_import_16', label: 'IVA no acreditable Imp 16%', type: 'number', requiredWhen: 'Monto del IVA pagado no acreditable en la importación de bienes y servicios a la tasa del 16% de IVA' },
  { id: 'valor_import_exentos', label: 'Base Imp. exentos', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados en la importación de bienes y servicios por los que no se pagará el IVA' },
  { id: 'valor_exentos', label: 'Base exento', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados por los que no se pagará el IVA' },
  { id: 'valor_0', label: 'Base 0%', type: 'number', requiredWhen: 'Valor de los actos o actividades pagados a la tasa del 0% de IVA' },
  { id: 'valor_no_objeto', label: 'Base no objeto imp.', type: 'number', requiredWhen: 'Valor de los actos o actividades no objeto del IVA' },
  { id: 'iva_retenido', label: 'Iva Retenido', type: 'number', requiredWhen: 'IVA retenido por el contribuyente' },
  { id: 'iva_devoluciones', label: 'IVA devol.', type: 'number', requiredWhen: 'IVA pagado por devoluciones, descuentos y bonificaciones sobre adquisición de mercancías y gastos en general' },
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
  { id: 'v1', label: 'Subtotal norte', type: 'number', requiredWhen: 'Valor total de actos o actividades pagadas en la región fronteriza norte' },
  { id: 'v2', label: 'Devol. norte', type: 'number', requiredWhen: 'Devoluciones, descuentos y bonificaciones en la región fronteriza norte' },
  { id: 'v3', label: 'Subtotal sur', type: 'number', requiredWhen: 'Valor total de actos o actividades pagadas en la región fronteriza sur' },
  { id: 'v4', label: 'Devol. sur', type: 'number', requiredWhen: 'Devoluciones, descuentos y bonificaciones en la región fronteriza sur' },
  { id: 'v5', label: 'Subtotal 16%', type: 'number', requiredWhen: 'Valor total de actos o actividades pagadas a la tasa del 16% de IVA' },
  { id: 'v6', label: 'Devol. 16%', type: 'number', requiredWhen: 'Devoluciones, descuentos y bonificaciones a la tasa del 16% de IVA' },
  { id: 'v7', label: 'Subtotal Imp. Tan. 16%', type: 'number', requiredWhen: 'Valor total de actos o actividades pagados en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v8', label: 'Devol. Imp. Tan. 16%', type: 'number', requiredWhen: 'Devoluciones, descuentos y bonificaciones en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v9', label: 'Subtotal Imp. Intan. 16%', type: 'number', requiredWhen: 'Valor total de actos o actividades pagadas en la importación de bienes intangibles y servicios a la tasa del 16% de IVA' },
  { id: 'v10', label: 'Devol. Imp. Intan. 16%', type: 'number', requiredWhen: 'Devoluciones, descuentos y bonificaciones en la importación de bienes intangibles y servicios a la tasa del 16% de IVA' },
  { id: 'v11', label: 'IVA norte', type: 'number', requiredWhen: 'Exclusivamente de actividades gravadas en la región fronteriza norte' },
  { id: 'v12', label: 'Proporción norte', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción en la región fronteriza norte' },
  { id: 'v13', label: 'IVA sur', type: 'number', requiredWhen: 'Exclusivamente de actividades gravadas en la región fronteriza sur' },
  { id: 'v14', label: 'Proporción sur', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción en la región fronteriza sur' },
  { id: 'v15', label: 'IVA 16%', type: 'number', requiredWhen: 'Exclusivamente de actividades gravadas pagados a la tasa del 16% de IVA' },
  { id: 'v16', label: 'Proporción 16%', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción pagados a la tasa del 16% de IVA' },
  { id: 'v17', label: 'IVA Imp. Tan. 16%', type: 'number', requiredWhen: 'Exclusivamente de actividades gravadas pagadas en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v18', label: 'Proporción Imp. Tan. 16%', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción pagadas en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v19', label: 'IVA Imp. Intan. 16%', type: 'number', requiredWhen: 'Exclusivamente de actividades gravadas pagadas en la importación de bienes intangibles y servicios a la tasa del 16% de IVA' },
  { id: 'v20', label: 'Proporción Imp. Intan. 16%', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción pagados en la importación de bienes intangibles y servicios a la tasa del 16% de IVA' },
  { id: 'v21', label: 'Proporción norte', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción en la región fronteriza norte' },
  { id: 'v22', label: 'No cumple norte', type: 'number', requiredWhen: 'Asociado a que no cumple con requisitos en la región fronteriza norte' },
  { id: 'v23', label: 'Exento norte', type: 'number', requiredWhen: 'Asociado a actividades exentas en la región fronteriza norte' },
  { id: 'v24', label: 'No objeto norte', type: 'number', requiredWhen: 'Asociado a actividades no objeto en la región fronteriza norte' },
  { id: 'v25', label: 'Proporción sur', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción en la región fronteriza sur' },
  { id: 'v26', label: 'No cumple sur', type: 'number', requiredWhen: 'Asociado a que no cumple con requisitos en la región fronteriza sur' },
  { id: 'v27', label: 'Exento sur', type: 'number', requiredWhen: 'Asociado a actividades exentas en la región fronteriza sur' },
  { id: 'v28', label: 'No objeto sur', type: 'number', requiredWhen: 'Asociado a actividades no objeto en la región fronteriza sur' },
  { id: 'v29', label: 'Prop. 16%', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción a la tasa del 16% de IVA' },
  { id: 'v30', label: 'No cumple 16%', type: 'number', requiredWhen: 'Asociado a que no cumple con requisitos a la tasa del 16% de IVA' },
  { id: 'v31', label: 'Exentos a IVA 16%', type: 'number', requiredWhen: 'Asociado a actividades exentas a la tasa del 16% de IVA' },
  { id: 'v32', label: 'No objeto a IVA 16%', type: 'number', requiredWhen: 'Asociado a actividades no objeto a la tasa del 16% de IVA' },
  { id: 'v33', label: 'Prop. Imp. Tan. 16%', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v34', label: 'No cumple Imp. Tan. 16%', type: 'number', requiredWhen: 'Asociado a que no cumple con requisitos en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v35', label: 'Exento Imp. Tan. a 16%', type: 'number', requiredWhen: 'Asociado a actividades exentas en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v36', label: 'No objeto Imp. Tan. a 16%', type: 'number', requiredWhen: 'Asociado a actividades no objeto en la importación por aduana de bienes tangibles a la tasa del 16% de IVA' },
  { id: 'v37', label: 'Prop. Imp. Intan. 16%', type: 'number', requiredWhen: 'Asociado a actividades por las cuales se aplicó una proporción en la importación de bienes intangibles y servicios a la tasa del 16% del IVA' },
  { id: 'v38', label: 'No cumple Imp. Intan. 16%', type: 'number', requiredWhen: 'Asociado a que no cumple con requisitos en la importación de bienes intangibles y servicios a la tasa del 16% del IVA' },
  { id: 'v39', label: 'Exento Imp. Intan. a 16%', type: 'number', requiredWhen: 'Asociado a actividades exentas en la importación de bienes intangibles y servicios a la tasa del 16% del IVA' },
  { id: 'v40', label: 'No objeto Imp. Intan. a 16%', type: 'number', requiredWhen: 'Asociado a actividades no objeto en la importación de bienes intangibles y servicios a la tasa del 16% del IVA' },
  { id: 'iva_retenido_2025', label: 'IVA retenido', type: 'number', requiredWhen: 'IVA retenido por el contribuyente pagado' },
  { id: 'valor_import_exentos_2025', label: 'Base Exento Importación', type: 'number', requiredWhen: 'Valor de actos o actividades pagados en la importación de bienes y servicios por los que no se pagará el IVA' },
  { id: 'valor_exentos_2025', label: 'Base exento', type: 'number', requiredWhen: 'Valor de actos o actividades pagados por los que no se pagará el IVA' },
  { id: 'valor_0_2025', label: 'IVA 0%', type: 'number', requiredWhen: 'Valor de demás actos o actividades pagados a la tasa del 0% de IVA' },
  { id: 'valor_no_objeto_nacional', label: 'No objeto IVA nacional', type: 'number', requiredWhen: 'Valor de actos o actividades no objeto del IVA realizados en territorio nacional' },
  { id: 'valor_no_objeto_sin_estab', label: 'No objeto IVA no nacional', type: 'number', requiredWhen: 'Valor de actos o actividades no objeto del IVA por no contar con establecimiento en territorio nacional' },
  {
    id: 'manifiesto_efectos_fiscales',
    label: 'Manifiesto',
    type: 'text',
    required: true,
    requiredWhen: 'Manifiesto que se dio efectos fiscales a los comprobantes que amparan las operaciones realizadas con el proveedor',
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
