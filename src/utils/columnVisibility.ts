import type { DiotVersion } from '../schemas/diotSchemas'

const STORAGE_KEY_PREFIX = 'diot-column-visibility-'

export function getHiddenColumnIds(version: DiotVersion): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + version)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) && parsed.every((x) => typeof x === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function setHiddenColumnIds(version: DiotVersion, hiddenIds: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + version, JSON.stringify(hiddenIds))
  } catch {
    // localStorage full or disabled
  }
}
