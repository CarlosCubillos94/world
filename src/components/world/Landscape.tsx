import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import {
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { nearZoneOrPath } from '../../data/content'
import type { Quality } from '../../lib/quality'
import { mulberry32 } from '../../lib/random'
import { bloomField } from './Ground'

const FLOWER_COLORS = ['#e0488a', '#f2c14e', '#7b5ea7', '#fff1d6', '#ff7a3d', '#d94b8a']

function isClear(x: number, z: number) {
  const r = Math.hypot(x, z)
  if (r < 6) return false
  if (nearZoneOrPath(x, z, 6.5)) return false
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
      bloom: new MeshStandardMaterial({
        color: '#e0488a',
        flatShading: true,
        roughness: 0.55,
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
      assets.bloom.dispose()
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
      {rng() > 0.35 && (
        <mesh position={[0, 2.52, 0]} scale={0.45} castShadow geometry={assets.cap} material={assets.bloom} />
      )}
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

function makeFlowerHead() {
  const petal = new SphereGeometry(0.42, 7, 5)
  petal.scale(0.5, 0.14, 1.08)
  petal.translate(0, 0, 0.38)
  const parts: BufferGeometry[] = []
  for (let i = 0; i < 5; i++) {
    const g = petal.clone()
    const a = (i / 5) * Math.PI * 2
    g.rotateY(a)
    g.rotateX(-0.32)
    parts.push(g)
  }
  const merged = mergeGeometries(parts, false)
  petal.dispose()
  for (const part of parts) part.dispose()
  if (!merged) return new SphereGeometry(0.35, 6, 4)
  merged.computeVertexNormals()
  return merged
}

function makeFlowerCenter() {
  const center = new SphereGeometry(0.17, 7, 5)
  center.scale(1, 0.42, 1)
  center.translate(0, 0.09, 0)
  return center
}

function makeFlowerStem() {
  const stem = new CylinderGeometry(0.028, 0.04, 0.5, 5)
  stem.translate(0, 0.25, 0)
  return stem
}

function StaticInstances({
  items,
  geometry,
  roughness = 1,
}: {
  items: BatchItem[]
  geometry: BufferGeometry
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
        color: i % 3 === 0 ? '#e3b07a' : i % 3 === 1 ? '#d992b0' : '#e6c56a',
      })
    }

    const flowers: BatchItem[] = []
    const centers: BatchItem[] = []
    const stems: BatchItem[] = []
    guard = 0
    while (flowers.length < quality.flowerCount && guard < 4000) {
      guard += 1
      const x = (rng() - 0.5) * 70
      const z = (rng() - 0.5) * 70
      const r = Math.hypot(x, z)
      if (r < 4.2 || r > 36) continue
      if (nearZoneOrPath(x, z, 3.6)) continue
      if (bloomField(x, z) < 0.12 && rng() > 0.2) continue
      const s = 0.42 + rng() * 0.46
      const tall = rng() > 0.62
      const color = FLOWER_COLORS[Math.floor(rng() * FLOWER_COLORS.length)] ?? '#e0488a'
      const yaw = rng() * Math.PI * 2
      const tilt = (rng() - 0.5) * 0.22
      const y = tall ? 0.5 * s + 0.04 : 0.07
      flowers.push({
        pos: [x, y, z],
        scale: [s, s, s],
        rot: [tilt, yaw, 0],
        color,
      })
      centers.push({
        pos: [x, y, z],
        scale: [s, s, s],
        rot: [tilt, yaw, 0],
        color: rng() > 0.35 ? '#f4d35e' : '#fff4c4',
      })
      if (tall) {
        stems.push({
          pos: [x, 0, z],
          scale: [s, s * (0.95 + rng() * 0.2), s],
          rot: [0, yaw, 0],
          color: '#3d6b3a',
        })
      }
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

    return { cacti, rocks, dunes, peaks, flowers, centers, stems }
  }, [quality.cactusCount, quality.flowerCount, quality.isMobile, quality.rockCount])

  const rockGeo = useMemo(() => new DodecahedronGeometry(0.7, 0), [])
  const duneGeo = useMemo(() => new SphereGeometry(1, 7, 5), [])
  const peakGeo = useMemo(() => new ConeGeometry(1, 1, 5), [])
  const flowerGeo = useMemo(() => makeFlowerHead(), [])
  const centerGeo = useMemo(() => makeFlowerCenter(), [])
  const stemGeo = useMemo(() => makeFlowerStem(), [])

  return (
    <group>
      {props.cacti.map((c, i) => (
        <Cactus key={i} position={c.pos} scale={c.scale} seed={c.seed} assets={cactusAssets} />
      ))}
      <StaticInstances items={props.rocks} geometry={rockGeo} />
      <StaticInstances items={props.dunes} geometry={duneGeo} />
      <StaticInstances items={props.peaks} geometry={peakGeo} />
      <StaticInstances items={props.stems} geometry={stemGeo} roughness={0.85} />
      <StaticInstances items={props.flowers} geometry={flowerGeo} roughness={0.52} />
      <StaticInstances items={props.centers} geometry={centerGeo} roughness={0.4} />
    </group>
  )
}
