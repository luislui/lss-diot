import type { DiotVersion } from '../schemas/diotSchemas'

interface VersionSelectorProps {
  value: DiotVersion
  onChange: (version: DiotVersion) => void
}

export function VersionSelector({ value, onChange }: VersionSelectorProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Versión DIOT:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DiotVersion)}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-[0.9375rem] text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-400"
      >
        <option value="2024">2024 y anteriores</option>
        <option value="2025">2025 en adelante</option>
      </select>
    </label>
  )
}
