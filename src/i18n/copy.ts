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
  experienceSection: string
  projectsSection: string
  notesSection: string
  experienceSign: string
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
    documentTitle: 'Carlos Cubillos — Desierto florido',
    documentDescription:
      'Conduce un G-Wagon por un desierto florido low-poly en Vallenar y conoce el trabajo de Carlos Cubillos, desarrollador React y React Native.',
    place: 'Vallenar, Chile',
    role: 'Desarrollador React / React Native',
    hint: 'Sigue la ruta de Experiencia — una parada por cada etapa — y los stands de proyectos.',
    ready: 'El desierto florido está listo.',
    loading: (pct) => `Cargando ${pct}%`,
    enter: 'Entrar al desierto florido',
    skip: 'Ir a la versión simple',
    keys: 'WASD o flechas para conducir · Espacio para frenar · R para volver al inicio',
    hudTag: 'Ruta de experiencia · Desierto florido',
    soundOff: 'Sin sonido',
    soundOn: 'Con sonido',
    simple: 'Versión simple',
    classic: 'Portafolio clásico',
    back3d: 'Volver al mundo 3D',
    simpleIntro:
      'La misma ruta que el G-Wagon: primero la experiencia laboral, en orden, y después los proyectos. Hecho para teclado, lector de pantalla o un notebook cansado.',
    simpleSection: 'Experiencia y proyectos',
    experienceSection: 'Experiencia laboral',
    projectsSection: 'Proyectos',
    notesSection: 'Sobre mí y contacto',
    experienceSign: 'Experiencia',
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
      pucv: {
        title: 'PUCV',
        kicker: 'Experiencia · desde ~2014',
        description:
          'Ingeniería en Informática en la Pontificia Universidad Católica de Valparaíso. Ahí empecé a programar, hacia 2014. En la universidad fundé Reflex Chile, una app en React Native que ganó el fondo “Emprende tu Tesis” de la PUCV.',
        linkLabels: {},
      },
      witi: {
        title: 'WiTi',
        kicker: 'Experiencia · desde ago. 2021',
        description: 'En WiTi me dedico al desarrollo mobile con React Native.',
        linkLabels: {},
      },
      telefonica: {
        title: 'Telefónica',
        kicker: 'Experiencia · oct. 2022 – jun. 2026',
        description:
          'En Telefónica ayudé a migrar Mi Movistar a React Native. Construí KeyPass, un módulo de validación de identidad para transacciones digitales usado en Latinoamérica. Fui Tech Lead de un equipo de 8 personas: lideré el upgrade de React Native e implementé SSO/Auth.',
        linkLabels: {},
      },
      freelance: {
        title: 'Freelance',
        kicker: 'Experiencia',
        description: 'Trabajo freelance con un cliente de Estados Unidos.',
        linkLabels: {},
      },
      bctech: {
        title: 'BC Tecnología',
        kicker: 'Experiencia · desde 3 ago. 2026',
        description: 'Mobile Developer en BC Tecnología, desde el 3 de agosto de 2026.',
        linkLabels: {},
      },
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
          'Desarrollador React y React Native de Vallenar, Chile. Cinco años con React Native y Expo, además de React, Next.js, Redux y Jest/RTL. Tres apps publicadas en App Store y Google Play.\n\nFui Tech Lead de un equipo de 8 en Telefónica, donde construí KeyPass y ayudé a migrar Mi Movistar a React Native. Ingeniería en Informática en la PUCV; empecé a programar hacia 2014.',
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
    documentTitle: 'Carlos Cubillos — Flowering desert',
    documentDescription:
      'Drive a G-Wagon through a low-poly flowering desert in Vallenar and discover the work of Carlos Cubillos, a React and React Native developer.',
    place: 'Vallenar, Chile',
    role: 'React / React Native developer',
    hint: 'Follow the Experience route — one stop per chapter — plus the project stands.',
    ready: 'The flowering desert is ready.',
    loading: (pct) => `Loading ${pct}%`,
    enter: 'Enter the flowering desert',
    skip: 'Skip to simple version',
    keys: 'WASD or arrows to drive · Space to brake · R to respawn',
    hudTag: 'Experience route · Flowering desert',
    soundOff: 'Sound off',
    soundOn: 'Sound on',
    simple: 'Simple version',
    classic: 'Classic portfolio',
    back3d: 'Back to 3D world',
    simpleIntro:
      'The same route as the G-Wagon: work experience first, in order, then the projects. Laid out for a keyboard, a screen reader, or a tired laptop.',
    simpleSection: 'Experience and projects',
    experienceSection: 'Work experience',
    projectsSection: 'Projects',
    notesSection: 'About and contact',
    experienceSign: 'Experience',
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
      pucv: {
        title: 'PUCV',
        kicker: 'Experience · since ~2014',
        description:
          'Ingeniería en Informática at Pontificia Universidad Católica de Valparaíso. That’s where I started programming, around 2014. During university I founded Reflex Chile, a React Native app that won PUCV’s “Emprende tu Tesis” fund.',
        linkLabels: {},
      },
      witi: {
        title: 'WiTi',
        kicker: 'Experience · since Aug 2021',
        description: 'At WiTi I work on mobile development with React Native.',
        linkLabels: {},
      },
      telefonica: {
        title: 'Telefónica',
        kicker: 'Experience · Oct 2022 – Jun 2026',
        description:
          'At Telefónica I helped migrate Mi Movistar to React Native. I built KeyPass, an identity-validation module for digital transactions used across Latin America. As Tech Lead of a team of 8 I led a React Native upgrade and implemented SSO/Auth.',
        linkLabels: {},
      },
      freelance: {
        title: 'Freelance',
        kicker: 'Experience',
        description: 'Freelance work with a client in the United States.',
        linkLabels: {},
      },
      bctech: {
        title: 'BC Tecnología',
        kicker: 'Experience · since 3 Aug 2026',
        description: 'Mobile Developer at BC Tecnología, since 3 August 2026.',
        linkLabels: {},
      },
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
          'React and React Native developer from Vallenar, Chile. Five years with React Native and Expo, plus React, Next.js, Redux, and Jest/RTL. Three apps published on the App Store and Google Play.\n\nI was Tech Lead of a team of 8 at Telefónica, where I built KeyPass and helped migrate Mi Movistar to React Native. Ingeniería en Informática at PUCV; I started programming around 2014.',
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
