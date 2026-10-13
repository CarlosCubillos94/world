import { useSyncExternalStore } from 'react'
import type { ZoneId } from '../data/content'
import { copy, type Lang } from '../i18n/copy'
import { persistLang, readInitialLang } from '../i18n/lang'

export type GameState = {
  entered: boolean
  simple: boolean
  muted: boolean
  webgl: boolean
  lang: Lang
  activeZone: ZoneId | null
}

const listeners = new Set<() => void>()

const initialLang = readInitialLang()

let state: GameState = {
  entered: false,
  simple: false,
  muted: true,
  webgl: true,
  lang: initialLang,
  activeZone: null,
}

persistLang(initialLang)

function emit() {
  for (const listener of listeners) listener()
}

export const gameStore = {
  get(): GameState {
    return state
  },
  set(partial: Partial<GameState>) {
    state = { ...state, ...partial }
    if (partial.lang) persistLang(partial.lang)
    emit()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useUi() {
  const lang = useGame((s) => s.lang)
  return copy[lang]
}

export function useGame<T>(selector: (s: GameState) => T): T {
  return useSyncExternalStore(
    gameStore.subscribe,
    () => selector(gameStore.get()),
    () => selector(gameStore.get()),
  )
}

export const playerPose = {
  x: 0,
  y: 0.5,
  z: 0,
  angle: -Math.PI / 2,
  speed: 0,
}

declare global {
  interface Window {
    __carPose?: typeof playerPose
  }
}

if (typeof window !== 'undefined') {
  window.__carPose = playerPose
}
