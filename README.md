# LSS Generador de DIOT

Generador de archivos TXT DIOT para el SAT (México). Desarrollado por [Loeram Software Solutions](https://www.loeramsoft.com). Permite capturar operaciones con proveedores nacionales, extranjeros y globales, validar los datos y exportar el archivo en el formato requerido para la Declaración Informativa de Operaciones con Terceros.

## Características

- **Versiones DIOT**: soporte para formato 2024 (23 columnas) y 2025 (57 columnas). Selector en la barra superior.
- **Tabla editable**: columnas redimensionables, totales en columnas numéricas, campos obligatorios marcados con asterisco rojo y validación por celda (errores en rojo con tooltip).
- **Campos condicionales**: RFC, número de identificación fiscal, país, etc. se habilitan o deshabilitan según tipo de tercero (Nacional / Extranjero / Global) y, en 2025, según manifiesto de efectos fiscales.
- **Entrada de datos**:
  - **Descargar plantilla Excel**: genera una hoja con los encabezados de la versión elegida para rellenar fuera de la app.
  - **Importar Excel**: carga un archivo .xlsx/.xls (primera hoja, encabezados iguales a la plantilla). Si hay RFC duplicados, se ofrece agrupar por RFC (sumando columnas numéricas) o importar tal cual.
  - **Pegar desde portapapeles** (Ctrl+V o botón): **obligatorio** que la primera fila sea encabezados; se abre un modal para relacionar cada columna pegada con la columna DIOT. Si no hay encabezados se muestra una ayuda.
  - **Añadir línea** y **Eliminar seleccionadas**.
- **Valores por defecto** al pegar/importar: si hay RFC y no se especifica tipo de tercero → **Nacional**; si no se especifica tipo de operación → **Otros (85)**.
- **RFC duplicados**: al importar (Excel o pegar), si se detectan filas con el mismo RFC se pregunta si desea agruparlas (se suman las columnas numéricas y se conservan los datos de texto de la primera fila de cada grupo).
- **Exportación**: descarga un archivo TXT con separador pipe (`|`), UTF-8, sin decimales, listo para el SAT.
- **Visibilidad de columnas**: botón **Columnas** en la barra para mostrar u ocultar columnas en la tabla. La configuración se guarda por versión (2024/2025) en el almacenamiento local del navegador.
- **Validación**: comprobación de RFC, tipos de operación, campos obligatorios según tipo de tercero y, en 2025, manifiesto 01/02. Errores por fila antes de exportar.
- **Ayuda**: botón en la cabecera que abre un modal con instrucciones de uso de la aplicación.

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
   - **Descargar plantilla** → rellenar en Excel → **Importar Excel** (si hay RFC duplicados podrás agrupar o no), o
   - **Pegar** desde Excel (Ctrl+V o botón): incluye la fila de encabezados, asigna columnas en el modal y confirma, o
   - **Añadir línea** y editar en la tabla.
3. Revisa los errores de validación (celdas en rojo; pasa el ratón para ver el mensaje).
4. Cuando todo sea correcto, pulsa **Descargar TXT** y sube el archivo según indique el SAT.

Puedes usar el botón **Ayuda** en la cabecera para ver las instrucciones detalladas en cualquier momento.

## Estructura del proyecto

```
src/
├── App.tsx                    # Estado global, atajo Ctrl+V, modales
├── components/
│   ├── VersionSelector.tsx    # Selector 2024 / 2025
│   ├── Toolbar.tsx            # Botones (plantilla, importar, pegar, añadir, eliminar, descargar TXT)
│   ├── DiotGrid.tsx           # Tabla editable con totales y errores en rojo
│   ├── PasteMappingModal.tsx  # Modal para relacionar columnas al pegar
│   ├── DuplicateRfcModal.tsx  # Modal para agrupar por RFC al importar
│   ├── ColumnVisibilityModal.tsx  # Modal para mostrar/ocultar columnas
│   └── HelpModal.tsx          # Ayuda de uso
├── schemas/
│   └── diotSchemas.ts         # Columnas y opciones por versión
└── utils/
    ├── validation.ts          # Reglas de validación por campo/versión
    ├── exportTxt.ts           # Generación del TXT pipe UTF-8
    ├── excelTemplate.ts       # Descarga de plantilla Excel
    ├── importExcel.ts        # Lectura de Excel para importar
    ├── pasteFromClipboard.ts  # Parseo y valores por defecto (tipo tercero, tipo operación)
    ├── groupByRfc.ts          # Detección de RFC duplicados y agrupación
    ├── columnVisibility.ts   # Persistencia de columnas ocultas en localStorage
    └── formatNumber.ts
```

## Por hacer

- **Importación de XML para lectura**: permitir cargar un archivo XML (por ejemplo, DIOT previamente presentado o exportado) para leer y editar los datos en la aplicación.

## Licencia

Este proyecto está bajo la [GNU General Public License v3.0](LICENSE) (GPL-3.0). Puedes usar, modificar y distribuir el software bajo los términos de esa licencia. El uso de los archivos generados (TXT DIOT) debe ajustarse a la normativa del SAT (México).

---

**[Loeram Software Solutions](https://www.loeramsoft.com)**
