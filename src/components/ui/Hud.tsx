import { profile } from '../../data/content'
import { stopEngine } from '../../lib/sfx'
import type { Quality } from '../../lib/quality'
import { gameStore, useGame, useUi } from '../../state/game'
import { Joystick } from './Joystick'
import { LangToggle } from './LangToggle'
import { Minimap } from './Minimap'
import { ProjectCard } from './ProjectCard'

export function Hud({ quality }: { quality: Quality }) {
  const muted = useGame((s) => s.muted)
  const ui = useUi()

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-brand">
          <strong>{profile.name}</strong>
          <span>{ui.hudTag}</span>
        </div>
        <div className="hud-actions">
          <LangToggle />
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
            {muted ? ui.soundOff : ui.soundOn}
          </button>
          <button
            type="button"
            className="chip"
            onClick={() => {
              stopEngine()
              gameStore.set({ simple: true, entered: false })
            }}
          >
            {ui.simple}
          </button>
          <a className="chip" href={profile.portfolio}>
            {ui.classic}
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
            <span>{ui.orArrows}</span>
            <kbd>Space</kbd>
            <span>{ui.brake}</span>
            <kbd>R</kbd>
            <span>{ui.respawn}</span>
          </p>
        )}
        <Minimap />
      </div>
    </div>
  )
}
