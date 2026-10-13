import { useProgress } from '@react-three/drei'
import { profile } from '../../data/content'
import { unlockAudio } from '../../lib/sfx'
import { gameStore } from '../../state/game'

export function LoadingScreen() {
  const { progress, active } = useProgress()
  const ready = !active || progress >= 100

  return (
    <div className="intro">
      <div className="intro-inner">
        <p className="intro-place">{profile.place}</p>
        <h1>{profile.name}</h1>
        <p className="intro-role">{profile.role}</p>
        <p className="intro-hint">{profile.hint} — park on a stand to open a card.</p>
        <div className="intro-bar" aria-hidden="true">
          <span style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="intro-load">{ready ? 'The desert is ready.' : `Loading ${Math.round(progress)}%`}</p>
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
            Enter the desert
          </button>
          <button
            type="button"
            className="btn ghost"
            onClick={() => gameStore.set({ simple: true })}
          >
            Skip to simple version
          </button>
        </div>
        <p className="intro-keys">WASD or arrows to drive · Space to brake · R to respawn</p>
      </div>
    </div>
  )
}
