export type ZoneId =
  | 'pucv'
  | 'witi'
  | 'telefonica'
  | 'freelance'
  | 'bctech'
  | 'gymflow'
  | 'fynn'
  | 'reflex'
  | 'valorant'
  | 'about'
  | 'contact'

export type ZoneKind = 'experience' | 'project' | 'note'

export type ZoneLink = {
  id: string
  href: string
  external?: boolean
}

export type Zone = {
  id: ZoneId
  kind: ZoneKind
  tech: string[]
  links: ZoneLink[]
  accent: string
  banner: string
  position: [number, number, number]
  angle: number
}

function at(x: number, z: number): [number, number, number] {
  return [x, 0, z]
}

function faceToward(from: [number, number, number], to: [number, number, number]) {
  return Math.atan2(to[2] - from[2], to[0] - from[0])
}

const PATH_START = at(5, 0)
const PUCV = at(18, 4)
const WITI = at(16, 18)
const TELEFONICA = at(2, 26)
const FREELANCE = at(-14, 22)
const BCTECH = at(-22, 8)
const GYM = at(18, -12)
const FYNN = at(4, -18)
const REFLEX = at(-10, -18)
const VALORANT = at(-22, -12)
const ABOUT = at(-8, 6)
const CONTACT = at(0, -6)

export const zones: Zone[] = [
  {
    id: 'pucv',
    kind: 'experience',
    tech: ['React Native'],
    links: [],
    accent: '#6d4c41',
    banner: '#8d6e63',
    position: PUCV,
    angle: faceToward(PATH_START, PUCV),
  },
  {
    id: 'witi',
    kind: 'experience',
    tech: ['React Native'],
    links: [],
    accent: '#1565c0',
    banner: '#1e88e5',
    position: WITI,
    angle: faceToward(PUCV, WITI),
  },
  {
    id: 'telefonica',
    kind: 'experience',
    tech: ['React Native', 'SSO', 'Auth'],
    links: [],
    accent: '#0d47a1',
    banner: '#1565c0',
    position: TELEFONICA,
    angle: faceToward(WITI, TELEFONICA),
  },
  {
    id: 'freelance',
    kind: 'experience',
    tech: ['React Native', 'React'],
    links: [],
    accent: '#5d4037',
    banner: '#795548',
    position: FREELANCE,
    angle: faceToward(TELEFONICA, FREELANCE),
  },
  {
    id: 'bctech',
    kind: 'experience',
    tech: ['React Native'],
    links: [],
    accent: '#2e7d32',
    banner: '#43a047',
    position: BCTECH,
    angle: faceToward(FREELANCE, BCTECH),
  },
  {
    id: 'gymflow',
    kind: 'project',
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
    position: GYM,
    angle: faceToward([0, 0, 0], GYM),
  },
  {
    id: 'fynn',
    kind: 'project',
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
    position: FYNN,
    angle: faceToward([0, 0, 0], FYNN),
  },
  {
    id: 'reflex',
    kind: 'project',
    tech: ['React Native', 'Firebase', 'TypeScript'],
    links: [],
    accent: '#7b2cbf',
    banner: '#9d4edd',
    position: REFLEX,
    angle: faceToward([0, 0, 0], REFLEX),
  },
  {
    id: 'valorant',
    kind: 'project',
    tech: ['React Native', 'Expo', 'React', 'Riot API'],
    links: [],
    accent: '#c1121f',
    banner: '#eb5e28',
    position: VALORANT,
    angle: faceToward([0, 0, 0], VALORANT),
  },
  {
    id: 'about',
    kind: 'note',
    tech: ['React Native', 'Expo', 'React', 'Next.js', 'Redux', 'Jest'],
    links: [
      {
        id: 'classic',
        href: 'https://carloscubillos94.github.io',
        external: true,
      },
    ],
    accent: '#9c6644',
    banner: '#dda15e',
    position: ABOUT,
    angle: faceToward([0, 0, 0], ABOUT),
  },
  {
    id: 'contact',
    kind: 'note',
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
    position: CONTACT,
    angle: faceToward([0, 0, 0], CONTACT),
  },
]

export const experiencePath: [number, number, number][] = [
  PATH_START,
  ...zones.filter((zone) => zone.kind === 'experience').map((zone) => zone.position),
]

function distToSegment(
  x: number,
  z: number,
  a: [number, number, number],
  b: [number, number, number],
) {
  const dx = b[0] - a[0]
  const dz = b[2] - a[2]
  const len2 = dx * dx + dz * dz
  if (len2 < 0.0001) return Math.hypot(x - a[0], z - a[2])
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[2]) * dz) / len2))
  return Math.hypot(x - (a[0] + t * dx), z - (a[2] + t * dz))
}

export function nearZoneOrPath(x: number, z: number, pad = 5) {
  for (const zone of zones) {
    if (Math.hypot(x - zone.position[0], z - zone.position[2]) < pad) return true
  }
  for (let i = 0; i < experiencePath.length - 1; i++) {
    const a = experiencePath[i]
    const b = experiencePath[i + 1]
    if (!a || !b) continue
    if (distToSegment(x, z, a, b) < 2.3) return true
  }
  return false
}

export const profile = {
  name: 'Carlos Cubillos',
  portfolio: 'https://carloscubillos94.github.io',
  github: 'https://github.com/CarlosCubillos94',
}
