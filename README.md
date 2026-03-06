# LSS Generador de DIOT

Generador de archivos TXT DIOT para el SAT (México). Permite capturar operaciones con proveedores nacionales, extranjeros y globales, validar los datos y exportar el archivo en el formato requerido para la Declaración Informativa de Operaciones con Terceros.

## Características

- **Versiones DIOT**: soporte para formato 2024 (23 columnas) y 2025 (57 columnas). Selector en la barra superior.
- **Tabla editable**: columnas redimensionables, totales en columnas numéricas, campos obligatorios marcados y validación por celda.
- **Campos condicionales**: RFC, número de identificación fiscal, país, etc. se habilitan o deshabilitan según tipo de tercero (Nacional / Extranjero / Global) y, en 2025, según manifiesto de efectos fiscales.
- **Entrada de datos**:
  - **Descargar plantilla Excel**: genera una hoja con los encabezados de la versión elegida para rellenar fuera de la app.
  - **Importar Excel**: carga un archivo .xlsx/.xls (primera hoja, encabezados iguales a la plantilla).
  - **Pegar desde portapapeles**: pegar datos copiados desde Excel (Ctrl+V).
  - **Añadir línea** y **Eliminar seleccionadas**.
- **Exportación**: descarga un archivo TXT con separador pipe (`|`), UTF-8, sin decimales, listo para el SAT.
- **Validación**: comprobación de RFC, tipos de operación, campos obligatorios según tipo de tercero y, en 2025, manifiesto 01/02. Errores por fila antes de exportar.

## Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS (modo oscuro por defecto)
- TanStack Table (cabeceras redimensionables)
- SheetJS (xlsx) para plantilla e importación Excel
- react-hot-toast para notificaciones

## Requisitos

- Node.js 18+
- pnpm (recomendado) o npm

## Instalación

```bash
# Clonar o entrar al proyecto
cd lss-diot

# Instalar dependencias
pnpm install
```

## Scripts

| Comando        | Descripción                    |
|----------------|--------------------------------|
| `pnpm dev`     | Servidor de desarrollo         |
| `pnpm build`   | Compilación para producción    |
| `pnpm preview` | Vista previa del build         |
| `pnpm lint`    | Ejecutar ESLint                |

## Uso recomendado

1. Selecciona la **versión DIOT** (2024 o 2025).
2. Introduce los datos de una de estas formas:
   - **Descargar plantilla** → rellenar en Excel → **Importar Excel**, o
   - **Pegar** desde Excel (Ctrl+V), o
   - **Añadir línea** y editar en la tabla.
3. Revisa los mensajes de validación (errores en rojo por fila).
4. Cuando todo sea correcto, pulsa **Descargar TXT** y sube el archivo según indique el SAT.

## Estructura del proyecto

```
src/
├── App.tsx                 # Estado global, atajo Ctrl+V
├── components/
│   ├── VersionSelector.tsx # Selector 2024 / 2025
│   ├── Toolbar.tsx         # Botones (plantilla, importar, pegar, añadir, eliminar, descargar TXT)
│   └── DiotGrid.tsx        # Tabla editable con totales
├── schemas/
│   └── diotSchemas.ts      # Columnas y opciones por versión
└── utils/
    ├── validation.ts       # Reglas de validación por campo/versión
    ├── exportTxt.ts        # Generación del TXT pipe UTF-8
    ├── excelTemplate.ts    # Descarga de plantilla Excel
    ├── importExcel.ts      # Lectura de Excel para importar
    ├── pasteFromClipboard.ts
    └── formatNumber.ts
```

## Licencia

Este proyecto está bajo la [GNU General Public License v3.0](LICENSE) (GPL-3.0). Puedes usar, modificar y distribuir el software bajo los términos de esa licencia. El uso de los archivos generados (TXT DIOT) debe ajustarse a la normativa del SAT (México).
