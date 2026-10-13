import { useMemo } from 'react'
import { zones } from '../../data/content'
import type { Quality } from '../../lib/quality'
import { mulberry32 } from '../../lib/random'

function isClear(x: number, z: number) {
  const r = Math.hypot(x, z)
  if (r < 6) return false
  if (Math.abs(r - 16) < 3.4) return false
  for (const zone of zones) {
    if (Math.hypot(x - zone.position[0], z - zone.position[2]) < 5) return false
  }
  return r < 37 && r > 7
}

function Cactus({
  position,
  scale,
  seed,
}: {
  position: [number, number, number]
  scale: number
  seed: number
}) {
  const rng = mulberry32(seed)
  const arms = 1 + Math.floor(rng() * 3)
  const green = rng() > 0.5 ? '#2f5d45' : '#3d6b4f'
  const dark = '#244536'

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 2.3, 6]} />
        <meshStandardMaterial color={green} flatShading roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.32, 0]} castShadow>
        <sphereGeometry args={[0.24, 6, 5]} />
        <meshStandardMaterial color={green} flatShading />
      </mesh>
      {Array.from({ length: arms }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1
        const h = 0.55 + rng() * 0.55
        const y = 0.7 + rng() * 0.7
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[side * 0.36, 0, 0]} rotation={[0, 0, side * 1.15]} castShadow>
              <cylinderGeometry args={[0.12, 0.14, 0.7, 6]} />
              <meshStandardMaterial color={dark} flatShading />
            </mesh>
            <mesh position={[side * 0.62, h * 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.13, h + 0.15, 6]} />
              <meshStandardMaterial color={green} flatShading />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export function Landscape({ quality }: { quality: Quality }) {
  const props = useMemo(() => {
    const rng = mulberry32(2026)
    const cacti: { pos: [number, number, number]; scale: number; seed: number }[] = []
    let guard = 0
    while (cacti.length < quality.cactusCount && guard < 800) {
      guard += 1
      const x = (rng() - 0.5) * 72
      const z = (rng() - 0.5) * 72
      if (!isClear(x, z)) continue
      cacti.push({
        pos: [x, 0, z],
        scale: 1.05 + rng() * 0.95,
        seed: Math.floor(rng() * 9999),
      })
    }

    const rocks: { pos: [number, number, number]; scale: [number, number, number]; rot: number; color: string }[] = []
    guard = 0
    while (rocks.length < quality.rockCount && guard < 400) {
      guard += 1
      const x = (rng() - 0.5) * 70
      const z = (rng() - 0.5) * 70
      if (!isClear(x, z)) continue
      const s = 0.35 + rng() * 1.1
      rocks.push({
        pos: [x, s * 0.28, z],
        scale: [s, s * (0.4 + rng() * 0.5), s * (0.7 + rng() * 0.4)],
        rot: rng() * Math.PI,
        color: rng() > 0.5 ? '#8b6f5a' : '#6e5344',
      })
    }

    const dunes: { pos: [number, number, number]; scale: [number, number, number]; color: string }[] = []
    for (let i = 0; i < (quality.isMobile ? 10 : 16); i++) {
      const a = (i / 16) * Math.PI * 2 + rng() * 0.2
      const r = 28 + rng() * 10
      const s = 3.2 + rng() * 4.5
      dunes.push({
        pos: [Math.cos(a) * r, 0.05, Math.sin(a) * r],
        scale: [s, s * (0.22 + rng() * 0.12), s * (0.8 + rng() * 0.4)],
        color: i % 2 === 0 ? '#d4a574' : '#c99563',
      })
    }

    return { cacti, rocks, dunes }
  }, [quality.cactusCount, quality.isMobile, quality.rockCount])

  return (
    <group>
      {props.cacti.map((c, i) => (
        <Cactus key={i} position={c.pos} scale={c.scale} seed={c.seed} />
      ))}

      {props.rocks.map((r, i) => (
        <mesh
          key={`rock-${i}`}
          position={r.pos}
          scale={r.scale}
          rotation={[0, r.rot, 0.1]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={r.color} flatShading roughness={1} />
        </mesh>
      ))}

      {props.dunes.map((d, i) => (
        <mesh key={`dune-${i}`} position={d.pos} scale={d.scale} castShadow receiveShadow>
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial color={d.color} flatShading roughness={1} />
        </mesh>
      ))}

      <Mountains />
    </group>
  )
}

function Mountains() {
  const peaks = useMemo(() => {
    const rng = mulberry32(88)
    const list: { pos: [number, number, number]; scale: [number, number, number]; color: string }[] = []
    for (let i = 0; i < 14; i++) {
      const a = -0.35 + (i / 13) * 1.1
      const r = 58 + rng() * 18
      list.push({
        pos: [Math.cos(a) * r + 8, 0, Math.sin(a) * r - 20],
        scale: [6 + rng() * 7, 9 + rng() * 14, 6 + rng() * 7],
        color: i % 3 === 0 ? '#8d6a55' : i % 3 === 1 ? '#6d4c41' : '#5c4033',
      })
    }
    return list
  }, [])

  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale} castShadow>
          <coneGeometry args={[1, 1, 5]} />
          <meshStandardMaterial color={p.color} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
