import type { ZoneId } from '../data/content'

export type Lang = 'es' | 'en'

export type ZoneCopy = {
  title: string
  kicker: string
  description: string
  linkLabels: Record<string, string>
}

export type UiCopy = {
  documentTitle: string
  documentDescription: string
  place: string
  role: string
  hint: string
  ready: string
  loading: (pct: number) => string
  enter: string
  skip: string
  keys: string
  hudTag: string
  soundOff: string
  soundOn: string
  simple: string
  classic: string
  back3d: string
  simpleIntro: string
  simpleSection: string
  close: string
  closeAria: string
  keepExploring: string
  steer: string
  orArrows: string
  brake: string
  respawn: string
  langEs: string
  langEn: string
  langAria: string
  zones: Record<ZoneId, ZoneCopy>
}

export const copy: Record<Lang, UiCopy> = {
  es: {
    documentTitle: 'Carlos Cubillos — Recorre el desierto',
    documentDescription:
      'Conduce un auto por un desierto atacameño low-poly y conoce el trabajo de Carlos Cubillos, desarrollador React y React Native de Vallenar, Chile.',
    place: 'Vallenar, Chile',
    role: 'Desarrollador React / React Native',
    hint: 'Conduce para explorar — párate en un stand para abrir una ficha.',
    ready: 'El desierto está listo.',
    loading: (pct) => `Cargando ${pct}%`,
    enter: 'Entrar al desierto',
    skip: 'Ir a la versión simple',
    keys: 'WASD o flechas para conducir · Espacio para frenar · R para volver al inicio',
    hudTag: 'Recorre los stands · Atacama',
    soundOff: 'Sin sonido',
    soundOn: 'Con sonido',
    simple: 'Versión simple',
    classic: 'Portafolio clásico',
    back3d: 'Volver al mundo 3D',
    simpleIntro:
      'Notas de campo de un Atacama low-poly: los mismos proyectos e historia que encontrarías conduciendo el mundo 3D, ordenados para teclado, lector de pantalla o un notebook cansado.',
    simpleSection: 'Proyectos y notas',
    close: 'Cerrar',
    closeAria: 'Cerrar ficha',
    keepExploring: 'Aléjate para seguir explorando',
    steer: 'Girar · avanzar',
    orArrows: 'o flechas',
    brake: 'freno',
    respawn: 'volver',
    langEs: 'ES',
    langEn: 'EN',
    langAria: 'Idioma',
    zones: {
      gymflow: {
        title: 'GymFlow',
        kicker: 'Proyecto',
        description:
          'Una plataforma de gestión para gimnasios que construí desde cero: un administrador web para dueños y una app móvil para socios. Socios, reservas y la operación diaria del gimnasio viven en un solo sistema — web y móvil, diseñados juntos.',
        linkLabels: {
          webRepo: 'Repo web',
          mobileRepo: 'Repo móvil',
        },
      },
      fynn: {
        title: 'Fynn',
        kicker: 'Proyecto',
        description:
          'Un registro de finanzas personales en el dispositivo, que se llena en lenguaje natural. Escribes “uber 4500” y queda en un libro SQLite local — con presupuestos por categoría, resúmenes semanales y un bloqueo biométrico opcional. Nada sale del teléfono.',
        linkLabels: { github: 'GitHub' },
      },
      reflex: {
        title: 'Reflex Chile',
        kicker: 'Proyecto',
        description:
          'Una app en React Native que fundé, con Firebase. Reflex Chile ganó el fondo “Emprende tu Tesis” de la PUCV: una tesis que salió de la sala y se convirtió en un producto real.',
        linkLabels: {},
      },
      valorant: {
        title: 'App companion de Valorant',
        kicker: 'Proyecto',
        description:
          'Una app companion para consultar perfiles, rangos e historial de partidas. Cliente en React Native / Expo más un front web, conectado a la API de Riot.',
        linkLabels: {},
      },
      about: {
        title: 'Sobre mí',
        kicker: 'Carlos Cubillos',
        description:
          'Desarrollador React y React Native de Vallenar, Chile. Cinco años creando productos con React Native y Expo. Antes lideré un equipo de ocho personas. En Telefónica construí el módulo de identidad KeyPass y ayudé a migrar Mi Movistar a React Native. También obtuve el 2.° lugar en NTT Data Hack The Challenge.\n\nIngeniería de Ejecución en Informática — PUCV, 2018–2022.',
        linkLabels: { classic: 'Portafolio clásico' },
      },
      contact: {
        title: 'Contacto',
        kicker: 'Hablemos',
        description:
          'Abierto a roles remotos y contratos con equipos de cualquier país. Pasa en auto o usa los enlaces: GitHub, el portafolio clásico y un espacio listo para el CV.',
        linkLabels: {
          github: 'GitHub',
          portfolio: 'Portafolio',
          cv: 'Descargar CV',
        },
      },
    },
  },
  en: {
    documentTitle: 'Carlos Cubillos — Drive the desert',
    documentDescription:
      'Drive a small car through a low-poly Atacama desert and discover the work of Carlos Cubillos, a React and React Native developer from Vallenar, Chile.',
    place: 'Vallenar, Chile',
    role: 'React / React Native developer',
    hint: 'Drive to explore — park on a stand to open a card.',
    ready: 'The desert is ready.',
    loading: (pct) => `Loading ${pct}%`,
    enter: 'Enter the desert',
    skip: 'Skip to simple version',
    keys: 'WASD or arrows to drive · Space to brake · R to respawn',
    hudTag: 'Drive the stands · Atacama',
    soundOff: 'Sound off',
    soundOn: 'Sound on',
    simple: 'Simple version',
    classic: 'Classic portfolio',
    back3d: 'Back to 3D world',
    simpleIntro:
      'Field notes from a low-poly Atacama — the same projects and story you would find by driving the 3D world, laid out for a keyboard, a screen reader, or a tired laptop.',
    simpleSection: 'Projects and notes',
    close: 'Close',
    closeAria: 'Close card',
    keepExploring: 'Drive away to keep exploring',
    steer: 'Steer · drive',
    orArrows: 'or arrows',
    brake: 'brake',
    respawn: 'respawn',
    langEs: 'ES',
    langEn: 'EN',
    langAria: 'Language',
    zones: {
      gymflow: {
        title: 'GymFlow',
        kicker: 'Project',
        description:
          'A gym management platform I built from scratch: a web admin for owners and a member mobile app. Members, bookings, and day-to-day gym operations live in one system — web and mobile, designed together.',
        linkLabels: {
          webRepo: 'Web repo',
          mobileRepo: 'Mobile repo',
        },
      },
      fynn: {
        title: 'Fynn',
        kicker: 'Project',
        description:
          'An on-device personal finance ledger you fill in plain language. Type “uber 4500” and it lands in a local SQLite ledger — with category budgets, weekly insights, and an optional biometric lock. Nothing leaves the phone.',
        linkLabels: { github: 'GitHub' },
      },
      reflex: {
        title: 'Reflex Chile',
        kicker: 'Project',
        description:
          'A React Native app I founded, backed by Firebase. Reflex Chile won PUCV’s “Emprende tu Tesis” fund — a thesis that left the classroom and shipped as a real product.',
        linkLabels: {},
      },
      valorant: {
        title: 'Valorant companion',
        kicker: 'Project',
        description:
          'A companion app for looking up player profiles, ranks, and match history. Built as a React Native / Expo client plus a web front-end, talking to the Riot API.',
        linkLabels: {},
      },
      about: {
        title: 'About me',
        kicker: 'Carlos Cubillos',
        description:
          'React and React Native developer from Vallenar, Chile. Five years building products with React Native and Expo. I previously led a team of eight. At Telefónica I built the KeyPass identity module and helped migrate Mi Movistar to React Native. I also took 2nd place at NTT Data Hack The Challenge.\n\nIngeniería de Ejecución en Informática — PUCV, 2018–2022.',
        linkLabels: { classic: 'Classic portfolio' },
      },
      contact: {
        title: 'Contact',
        kicker: 'Let’s talk',
        description:
          'Open to remote roles and contracts with teams worldwide. Drive by, or just use the links — GitHub, the classic portfolio, and a CV slot ready for the file.',
        linkLabels: {
          github: 'GitHub',
          portfolio: 'Portfolio',
          cv: 'Download CV',
        },
      },
    },
  },
}

export function applyDocumentLang(lang: Lang) {
  if (typeof document === 'undefined') return
  const ui = copy[lang]
  document.documentElement.lang = lang
  document.title = ui.documentTitle
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', ui.documentDescription)
}
