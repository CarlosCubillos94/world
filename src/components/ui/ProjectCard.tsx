import { zones } from '../../data/content'
import { gameStore, useGame, useUi } from '../../state/game'

export function ProjectCard() {
  const id = useGame((s) => s.activeZone)
  const ui = useUi()
  const zone = zones.find((z) => z.id === id)
  if (!zone) return null
  const local = ui.zones[zone.id]

  return (
    <article className="postcard" style={{ ['--accent' as string]: zone.accent }}>
      <header className="postcard-head">
        <p className="postcard-kicker">{local.kicker}</p>
        <button
          type="button"
          className="postcard-close"
          onClick={() => gameStore.set({ activeZone: null })}
          aria-label={ui.closeAria}
        >
          {ui.close}
        </button>
      </header>
      <h2>{local.title}</h2>
      {local.description.split('\n\n').map((para) => (
        <p key={para.slice(0, 24)}>{para}</p>
      ))}
      {zone.tech.length > 0 && (
        <ul className="tech">
          {zone.tech.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {zone.links.length > 0 && (
        <div className="postcard-links">
          {zone.links.map((link) => (
            <a
              key={link.href + link.id}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
            >
              {local.linkLabels[link.id] ?? link.id}
            </a>
          ))}
        </div>
      )}
      <p className="postcard-hint">{ui.keepExploring}</p>
    </article>
  )
}
