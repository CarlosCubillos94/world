import type { Lang } from './copy'
import { applyDocumentLang } from './copy'

const STORAGE_KEY = 'world-lang'

export function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'es'
  const query = new URLSearchParams(window.location.search).get('lang')
  if (query === 'en' || query === 'es') return query
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {
    // Ignore blocked storage.
  }
  return 'es'
}

export function persistLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Ignore blocked storage.
  }
  applyDocumentLang(lang)
}
