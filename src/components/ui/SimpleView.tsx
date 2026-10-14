import { profile, zones } from '../../data/content'
import { detectWebGL } from '../../lib/quality'
import { gameStore, useGame, useUi } from '../../state/game'
import { LangToggle } from './LangToggle'

export function SimpleView() {
  const webgl = useGame((s) => s.webgl)
  const can3d = webgl && detectWebGL()
  const ui = useUi()

  return (
    <main className="simple">
      <div className="lang-bar">
        <LangToggle />
      </div>
      <header className="simple-hero">
        <p className="intro-place">{ui.place}</p>
        <h1>{profile.name}</h1>
        <p className="intro-role">{ui.role}</p>
        <p>{ui.simpleIntro}</p>
        <div className="intro-actions">
          {can3d && (
            <button
              type="button"
              className="btn primary"
              onClick={() => gameStore.set({ simple: false, entered: false })}
            >
              {ui.back3d}
            </button>
          )}
          <a className="btn ghost" href={profile.portfolio}>
            {ui.classic}
          </a>
        </div>
      </header>

      {(
        [
          ['experience', ui.experienceSection],
          ['project', ui.projectsSection],
          ['note', ui.notesSection],
        ] as const
      ).map(([kind, heading]) => (
        <section key={kind} className="simple-block" aria-label={heading}>
          <h2 className="simple-heading">{heading}</h2>
          <div className="simple-grid">
            {zones
              .filter((zone) => zone.kind === kind)
              .map((zone) => {
                const local = ui.zones[zone.id]
                return (
                  <article key={zone.id} className="simple-card" style={{ ['--accent' as string]: zone.accent }}>
                    <p className="postcard-kicker">{local.kicker}</p>
                    <h3>{local.title}</h3>
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
                  </article>
                )
              })}
          </div>
        </section>
      ))}
    </main>
  )
}
