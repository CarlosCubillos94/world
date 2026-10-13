export type ZoneId =
  | 'gymflow'
  | 'fynn'
  | 'reflex'
  | 'valorant'
  | 'about'
  | 'contact'

export type ZoneLink = {
  label: string
  href: string
  external?: boolean
}

export type Zone = {
  id: ZoneId
  title: string
  kicker: string
  description: string
  tech: string[]
  links: ZoneLink[]
  accent: string
  banner: string
  position: [number, number, number]
  angle: number
}

const RING = 16

export const zones: Zone[] = [
  {
    id: 'gymflow',
    title: 'GymFlow',
    kicker: 'Project',
    description:
      'A gym management platform I built from scratch: a web admin for owners and a member mobile app. Members, bookings, and day-to-day gym operations live in one system — web and mobile, designed together.',
    tech: ['React', 'React Native', 'TypeScript', 'Expo', 'Vite'],
    links: [
      {
        label: 'Web repo',
        href: 'https://github.com/CarlosCubillos94/gymflow-web',
        external: true,
      },
      {
        label: 'Mobile repo',
        href: 'https://github.com/CarlosCubillos94/gymflow-mobile',
        external: true,
      },
    ],
    accent: '#e85d04',
    banner: '#f48c06',
    position: [RING, 0, 0],
    angle: 0,
  },
  {
    id: 'fynn',
    title: 'Fynn',
    kicker: 'Project',
    description:
      'An on-device personal finance ledger you fill in plain language. Type “uber 4500” and it lands in a local SQLite ledger — with category budgets, weekly insights, and an optional biometric lock. Nothing leaves the phone.',
    tech: ['Expo', 'React Native', 'TypeScript', 'SQLite'],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/CarlosCubillos94/fynn',
        external: true,
      },
    ],
    accent: '#2d6a4f',
    banner: '#40916c',
    position: [RING * Math.cos(Math.PI / 3), 0, RING * Math.sin(Math.PI / 3)],
    angle: Math.PI / 3,
  },
  {
    id: 'reflex',
    title: 'Reflex Chile',
    kicker: 'Project',
    description:
      'A React Native app I founded, backed by Firebase. Reflex Chile won PUCV’s “Emprende tu Tesis” fund — a thesis that left the classroom and shipped as a real product.',
    tech: ['React Native', 'Firebase', 'TypeScript'],
    links: [],
    accent: '#7b2cbf',
    banner: '#9d4edd',
    position: [
      RING * Math.cos((2 * Math.PI) / 3),
      0,
      RING * Math.sin((2 * Math.PI) / 3),
    ],
    angle: (2 * Math.PI) / 3,
  },
  {
    id: 'valorant',
    title: 'Valorant companion',
    kicker: 'Project',
    description:
      'A companion app for looking up player profiles, ranks, and match history. Built as a React Native / Expo client plus a web front-end, talking to the Riot API.',
    tech: ['React Native', 'Expo', 'React', 'Riot API'],
    links: [],
    accent: '#c1121f',
    banner: '#eb5e28',
    position: [-RING, 0, 0],
    angle: Math.PI,
  },
  {
    id: 'about',
    title: 'About me',
    kicker: 'Carlos Cubillos',
    description:
      'React and React Native developer from Vallenar, Chile. Five years building products with React Native and Expo. I previously led a team of eight. At Telefónica I built the KeyPass identity module and helped migrate Mi Movistar to React Native. I also took 2nd place at NTT Data Hack The Challenge.\n\nIngeniería de Ejecución en Informática — PUCV, 2018–2022.',
    tech: ['React', 'React Native', 'Expo', 'TypeScript'],
    links: [
      {
        label: 'Classic portfolio',
        href: 'https://carloscubillos94.github.io',
        external: true,
      },
    ],
    accent: '#9c6644',
    banner: '#dda15e',
    position: [
      RING * Math.cos((4 * Math.PI) / 3),
      0,
      RING * Math.sin((4 * Math.PI) / 3),
    ],
    angle: (4 * Math.PI) / 3,
  },
  {
    id: 'contact',
    title: 'Contact',
    kicker: 'Let’s talk',
    description:
      'Open to remote roles and contracts with teams worldwide. Drive by, or just use the links — GitHub, the classic portfolio, and a CV slot ready for the file.',
    tech: [],
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/CarlosCubillos94',
        external: true,
      },
      {
        label: 'Portfolio',
        href: 'https://carloscubillos94.github.io',
        external: true,
      },
      {
        label: 'Download CV',
        href: '#cv-placeholder',
      },
    ],
    accent: '#1d3557',
    banner: '#457b9d',
    position: [
      RING * Math.cos((5 * Math.PI) / 3),
      0,
      RING * Math.sin((5 * Math.PI) / 3),
    ],
    angle: (5 * Math.PI) / 3,
  },
]

export const profile = {
  name: 'Carlos Cubillos',
  role: 'React / React Native developer',
  place: 'Vallenar, Chile',
  hint: 'Drive to explore',
  portfolio: 'https://carloscubillos94.github.io',
  github: 'https://github.com/CarlosCubillos94',
}
