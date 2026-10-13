import { useSyncExternalStore } from 'react'
import type { ZoneId } from '../data/content'

export type GameState = {
  entered: boolean
  simple: boolean
  muted: boolean
  webgl: boolean
  activeZone: ZoneId | null
}

const listeners = new Set<() => void>()

let state: GameState = {
  entered: false,
  simple: false,
  muted: true,
  webgl: true,
  activeZone: null,
}

function emit() {
  for (const listener of listeners) listener()
}

export const gameStore = {
  get(): GameState {
    return state
  },
  set(partial: Partial<GameState>) {
    state = { ...state, ...partial }
    emit()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
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
