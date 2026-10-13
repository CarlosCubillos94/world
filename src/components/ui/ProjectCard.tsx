import { zones } from '../../data/content'
import { gameStore, useGame } from '../../state/game'

export function ProjectCard() {
  const id = useGame((s) => s.activeZone)
  const zone = zones.find((z) => z.id === id)
  if (!zone) return null

  return (
    <article className="postcard" style={{ ['--accent' as string]: zone.accent }}>
      <header className="postcard-head">
        <p className="postcard-kicker">{zone.kicker}</p>
        <button
          type="button"
          className="postcard-close"
          onClick={() => gameStore.set({ activeZone: null })}
          aria-label="Close card"
        >
          Close
        </button>
      </header>
      <h2>{zone.title}</h2>
      {zone.description.split('\n\n').map((para) => (
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
              key={link.href + link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <p className="postcard-hint">Drive away to keep exploring</p>
    </article>
  )
}
