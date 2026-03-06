import type { DiotVersion } from '../schemas/diotSchemas'

const STORAGE_KEY = 'diot-selected-version'
const VALID_VERSIONS: DiotVersion[] = ['2024', '2025']

export function getStoredDiotVersion(): DiotVersion {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && VALID_VERSIONS.includes(raw as DiotVersion)) return raw as DiotVersion
  } catch {
    // localStorage disabled
  }
  return '2025'
}

export function setStoredDiotVersion(version: DiotVersion): void {
  try {
    localStorage.setItem(STORAGE_KEY, version)
  } catch {
    // localStorage full or disabled
  }
}
