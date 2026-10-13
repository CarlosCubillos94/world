import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import {
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from 'three'
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

function useSharedCactusAssets() {
  const assets = useMemo(
    () => ({
      trunk: new CylinderGeometry(0.22, 0.3, 2.3, 6),
      cap: new SphereGeometry(0.24, 6, 5),
      arm: new CylinderGeometry(0.12, 0.14, 0.7, 6),
      greenA: new MeshStandardMaterial({
        color: '#2f5d45',
        flatShading: true,
        roughness: 0.85,
        metalness: 0,
      }),
      greenB: new MeshStandardMaterial({
        color: '#3d6b4f',
        flatShading: true,
        roughness: 0.85,
        metalness: 0,
      }),
      dark: new MeshStandardMaterial({
        color: '#244536',
        flatShading: true,
        roughness: 0.85,
        metalness: 0,
      }),
    }),
    [],
  )

  useEffect(
    () => () => {
      assets.trunk.dispose()
      assets.cap.dispose()
      assets.arm.dispose()
      assets.greenA.dispose()
      assets.greenB.dispose()
      assets.dark.dispose()
    },
    [assets],
  )

  return assets
}

function Cactus({
  position,
  scale,
  seed,
  assets,
}: {
  position: [number, number, number]
  scale: number
  seed: number
  assets: ReturnType<typeof useSharedCactusAssets>
}) {
  const rng = mulberry32(seed)
  const arms = 1 + Math.floor(rng() * 3)
  const body = rng() > 0.5 ? assets.greenA : assets.greenB

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.15, 0]} castShadow geometry={assets.trunk} material={body} />
      <mesh position={[0, 2.32, 0]} castShadow geometry={assets.cap} material={body} />
      {Array.from({ length: arms }, (_, i) => {
        const side = i % 2 === 0 ? 1 : -1
        const h = 0.55 + rng() * 0.55
        const y = 0.7 + rng() * 0.7
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh
              position={[side * 0.36, 0, 0]}
              rotation={[0, 0, side * 1.15]}
              castShadow
              geometry={assets.arm}
              material={assets.dark}
            />
            <mesh
              position={[side * 0.62, h * 0.5, 0]}
              scale={[1, (h + 0.15) / 0.7, 1]}
              castShadow
              geometry={assets.arm}
              material={body}
            />
          </group>
        )
      })}
    </group>
  )
}

type BatchItem = {
  pos: [number, number, number]
  scale: [number, number, number]
  rot: [number, number, number]
  color: string
}

function StaticInstances({
  items,
  geometry,
  roughness = 1,
}: {
  items: BatchItem[]
  geometry: SphereGeometry | DodecahedronGeometry | ConeGeometry
  roughness?: number
}) {
  const mesh = useRef<InstancedMesh>(null)
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        flatShading: true,
        roughness,
        metalness: 0,
      }),
    [roughness],
  )

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    const dummy = new Object3D()
    const color = new Color()
    items.forEach((item, i) => {
      dummy.position.set(item.pos[0], item.pos[1], item.pos[2])
      dummy.rotation.set(item.rot[0], item.rot[1], item.rot[2])
      dummy.scale.set(item.scale[0], item.scale[1], item.scale[2])
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, color.set(item.color))
    })
    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
    inst.computeBoundingSphere()
  }, [items])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  if (items.length === 0) return null

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, items.length]}
      castShadow
      receiveShadow
      frustumCulled
    />
  )
}

export function Landscape({ quality }: { quality: Quality }) {
  const cactusAssets = useSharedCactusAssets()
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

    const rocks: BatchItem[] = []
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
        rot: [0, rng() * Math.PI, 0.1],
        color: rng() > 0.5 ? '#8b6f5a' : '#6e5344',
      })
    }

    const dunes: BatchItem[] = []
    const duneCount = quality.isMobile ? 10 : 16
    for (let i = 0; i < duneCount; i++) {
      const a = (i / 16) * Math.PI * 2 + rng() * 0.2
      const r = 28 + rng() * 10
      const s = 3.2 + rng() * 4.5
      dunes.push({
        pos: [Math.cos(a) * r, 0.05, Math.sin(a) * r],
        scale: [s, s * (0.22 + rng() * 0.12), s * (0.8 + rng() * 0.4)],
        rot: [0, 0, 0],
        color: i % 2 === 0 ? '#d4a574' : '#c99563',
      })
    }

    const peaks: BatchItem[] = []
    const peakRng = mulberry32(88)
    for (let i = 0; i < 14; i++) {
      const a = -0.35 + (i / 13) * 1.1
      const r = 58 + peakRng() * 18
      peaks.push({
        pos: [Math.cos(a) * r + 8, 0, Math.sin(a) * r - 20],
        scale: [6 + peakRng() * 7, 9 + peakRng() * 14, 6 + peakRng() * 7],
        rot: [0, 0, 0],
        color: i % 3 === 0 ? '#8d6a55' : i % 3 === 1 ? '#6d4c41' : '#5c4033',
      })
    }

    return { cacti, rocks, dunes, peaks }
  }, [quality.cactusCount, quality.isMobile, quality.rockCount])

  const rockGeo = useMemo(() => new DodecahedronGeometry(0.7, 0), [])
  const duneGeo = useMemo(() => new SphereGeometry(1, 7, 5), [])
  const peakGeo = useMemo(() => new ConeGeometry(1, 1, 5), [])

  return (
    <group>
      {props.cacti.map((c, i) => (
        <Cactus key={i} position={c.pos} scale={c.scale} seed={c.seed} assets={cactusAssets} />
      ))}
      <StaticInstances items={props.rocks} geometry={rockGeo} />
      <StaticInstances items={props.dunes} geometry={duneGeo} />
      <StaticInstances items={props.peaks} geometry={peakGeo} />
    </group>
  )
}
