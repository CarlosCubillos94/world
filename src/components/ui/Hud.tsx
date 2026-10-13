import { profile } from '../../data/content'
import { stopEngine } from '../../lib/sfx'
import type { Quality } from '../../lib/quality'
import { gameStore, useGame } from '../../state/game'
import { Joystick } from './Joystick'
import { Minimap } from './Minimap'
import { ProjectCard } from './ProjectCard'

export function Hud({ quality }: { quality: Quality }) {
  const muted = useGame((s) => s.muted)

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-brand">
          <strong>{profile.name}</strong>
          <span>Drive the stands · Atacama</span>
        </div>
        <div className="hud-actions">
          <button
            type="button"
            className="chip"
            onClick={() => {
              const next = !gameStore.get().muted
              gameStore.set({ muted: next })
              if (next) stopEngine()
            }}
            aria-pressed={!muted}
          >
            {muted ? 'Sound off' : 'Sound on'}
          </button>
          <button
            type="button"
            className="chip"
            onClick={() => {
              stopEngine()
              gameStore.set({ simple: true, entered: false })
            }}
          >
            Simple version
          </button>
          <a className="chip" href={profile.portfolio}>
            Classic portfolio
          </a>
        </div>
      </div>

      <ProjectCard />

      <div className="hud-bottom">
        {quality.isTouch ? (
          <Joystick />
        ) : (
          <p className="keys-hint">
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd>
            <span>or arrows</span>
            <kbd>Space</kbd>
            <span>brake</span>
            <kbd>R</kbd>
            <span>respawn</span>
          </p>
        )}
        <Minimap />
      </div>
    </div>
  )
}
