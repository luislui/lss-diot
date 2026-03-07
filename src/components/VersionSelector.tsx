import type { DiotVersion } from '../schemas/diotSchemas'

interface VersionSelectorProps {
  value: DiotVersion
  onChange: (version: DiotVersion) => void
}

export function VersionSelector({ value, onChange }: VersionSelectorProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Versión DIOT:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DiotVersion)}
        className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-[0.9375rem] text-neutral-800 shadow-sm focus:border-[#63048C] focus:outline-none focus:ring-1 focus:ring-[#63048C] dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:focus:border-[#b855e8] dark:focus:ring-[#b855e8]"
      >
        <option value="2024">2024 y anteriores</option>
        <option value="2025">2025 en adelante</option>
      </select>
    </label>
  )
}
