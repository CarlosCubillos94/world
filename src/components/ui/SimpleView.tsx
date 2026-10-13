import { profile, zones } from '../../data/content'
import { detectWebGL } from '../../lib/quality'
import { gameStore, useGame } from '../../state/game'

export function SimpleView() {
  const webgl = useGame((s) => s.webgl)
  const can3d = webgl && detectWebGL()

  return (
    <main className="simple">
      <header className="simple-hero">
        <p className="intro-place">{profile.place}</p>
        <h1>{profile.name}</h1>
        <p className="intro-role">{profile.role}</p>
        <p>
          Field notes from a low-poly Atacama — the same projects and story you
          would find by driving the 3D world, laid out for a keyboard, a screen
          reader, or a tired laptop.
        </p>
        <div className="intro-actions">
          {can3d && (
            <button
              type="button"
              className="btn primary"
              onClick={() => gameStore.set({ simple: false, entered: false })}
            >
              Back to 3D world
            </button>
          )}
          <a className="btn ghost" href={profile.portfolio}>
            Classic portfolio
          </a>
        </div>
      </header>

      <section className="simple-grid" aria-label="Projects and notes">
        {zones.map((zone) => (
          <article key={zone.id} className="simple-card" style={{ ['--accent' as string]: zone.accent }}>
            <p className="postcard-kicker">{zone.kicker}</p>
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
          </article>
        ))}
      </section>
    </main>
  )
}
