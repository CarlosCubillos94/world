import { useProgress } from '@react-three/drei'
import { profile } from '../../data/content'
import { unlockAudio } from '../../lib/sfx'
import { gameStore, useUi } from '../../state/game'
import { LangToggle } from './LangToggle'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  const ready = !active || progress >= 100
  const ui = useUi()

  return (
    <div className="intro">
      <div className="lang-bar">
        <LangToggle />
      </div>
      <div className="intro-inner">
        <p className="intro-place">{ui.place}</p>
        <h1>{profile.name}</h1>
        <p className="intro-role">{ui.role}</p>
        <p className="intro-hint">{ui.hint}</p>
        <div className="intro-bar" aria-hidden="true">
          <span style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="intro-load">{ready ? ui.ready : ui.loading(Math.round(progress))}</p>
        <div className="intro-actions">
          <button
            type="button"
            className="btn primary"
            disabled={!ready}
            onClick={() => {
              unlockAudio()
              gameStore.set({ entered: true, muted: false })
            }}
          >
            {ui.enter}
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => gameStore.set({ simple: true })}
          >
            {ui.skip}
          </button>
        </div>
        <p className="intro-keys">{ui.keys}</p>
      </div>
    </div>
  )
}
