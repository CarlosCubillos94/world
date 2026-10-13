import type { Lang } from '../../i18n/copy'
import { gameStore, useGame, useUi } from '../../state/game'

export function LangToggle() {
  const lang = useGame((s) => s.lang)
  const ui = useUi()

  const setLang = (next: Lang) => {
    if (next === lang) return
    gameStore.set({ lang: next })
  }

  return (
    <div className="lang-toggle" role="group" aria-label={ui.langAria}>
      <button
        type="button"
        className={lang === 'es' ? 'chip lang-chip active' : 'chip lang-chip'}
        aria-pressed={lang === 'es'}
        onClick={() => setLang('es')}
      >
        {ui.langEs}
      </button>
      <button
        type="button"
        className={lang === 'en' ? 'chip lang-chip active' : 'chip lang-chip'}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        {ui.langEn}
      </button>
    </div>
  )
}
