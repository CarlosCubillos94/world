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

function polar(radius: number, angle: number): [number, number, number] {
  return [radius * Math.cos(angle), 0, radius * Math.sin(angle)]
}

const EXP_R = 20
const EXP_ANGLES = [0.12, 0.64, 1.16, 1.68, 2.2] as const

export const zones: Zone[] = [
  {
    id: 'pucv',
    kind: 'experience',
    tech: ['React Native'],
    links: [],
    accent: '#6d4c41',
    banner: '#8d6e63',
    position: polar(EXP_R, EXP_ANGLES[0]),
    angle: EXP_ANGLES[0],
  },
  {
    id: 'witi',
    kind: 'experience',
    tech: ['React Native'],
    links: [],
    accent: '#1565c0',
    banner: '#1e88e5',
    position: polar(EXP_R, EXP_ANGLES[1]),
    angle: EXP_ANGLES[1],
  },
  {
    id: 'telefonica',
    kind: 'experience',
    tech: ['React Native', 'SSO', 'Auth'],
    links: [],
    accent: '#0d47a1',
    banner: '#1565c0',
    position: polar(EXP_R, EXP_ANGLES[2]),
    angle: EXP_ANGLES[2],
  },
  {
    id: 'freelance',
    kind: 'experience',
    tech: ['React Native', 'React'],
    links: [],
    accent: '#5d4037',
    banner: '#795548',
    position: polar(EXP_R, EXP_ANGLES[3]),
    angle: EXP_ANGLES[3],
  },
  {
    id: 'bctech',
    kind: 'experience',
    tech: ['React Native'],
    links: [],
    accent: '#2e7d32',
    banner: '#43a047',
    position: polar(EXP_R, EXP_ANGLES[4]),
    angle: EXP_ANGLES[4],
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
    position: polar(12, 3.35),
    angle: 3.35,
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
    position: polar(12, 4.0),
    angle: 4.0,
  },
  {
    id: 'reflex',
    kind: 'project',
    tech: ['React Native', 'Firebase', 'TypeScript'],
    links: [],
    accent: '#7b2cbf',
    banner: '#9d4edd',
    position: polar(12, 4.65),
    angle: 4.65,
  },
  {
    id: 'valorant',
    kind: 'project',
    tech: ['React Native', 'Expo', 'React', 'Riot API'],
    links: [],
    accent: '#c1121f',
    banner: '#eb5e28',
    position: polar(12, 5.25),
    angle: 5.25,
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
    position: [-8, 0, -9],
    angle: Math.PI * 1.15,
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
    position: polar(22, 2.62),
    angle: 2.62,
  },
]

export const experiencePath: [number, number, number][] = [
  [5, 0, 0],
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
