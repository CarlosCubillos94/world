export type ZoneId =
  | 'gymflow'
  | 'fynn'
  | 'reflex'
  | 'valorant'
  | 'about'
  | 'contact'

export type ZoneLink = {
  id: string
  href: string
  external?: boolean
}

export type Zone = {
  id: ZoneId
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
    tech: ['React', 'React Native', 'TypeScript', 'Expo', 'Vite'],
    links: [
      {
        id: 'webRepo',
        href: 'https://github.com/CarlosCubillos94/gymflow-web',
        external: true,
      },
      {
        id: 'mobileRepo',
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
    tech: ['Expo', 'React Native', 'TypeScript', 'SQLite'],
    links: [
      {
        id: 'github',
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
    tech: ['React Native', 'Expo', 'React', 'Riot API'],
    links: [],
    accent: '#c1121f',
    banner: '#eb5e28',
    position: [-RING, 0, 0],
    angle: Math.PI,
  },
  {
    id: 'about',
    tech: ['React', 'React Native', 'Expo', 'TypeScript'],
    links: [
      {
        id: 'classic',
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
    tech: [],
    links: [
      {
        id: 'github',
        href: 'https://github.com/CarlosCubillos94',
        external: true,
      },
      {
        id: 'portfolio',
        href: 'https://carloscubillos94.github.io',
        external: true,
      },
      {
        id: 'cv',
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
  portfolio: 'https://carloscubillos94.github.io',
  github: 'https://github.com/CarlosCubillos94',
}
