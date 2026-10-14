import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import {
  Color,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from 'three'
import type { Quality } from '../../lib/quality'
import { gameStore, playerPose } from '../../state/game'

const WHEELS: [number, number][] = [
  [0.48, -0.58],
  [-0.48, -0.58],
]

const SAND = ['#e6c49a', '#d8b88a', '#ecd2b0', '#c9a87a']

type Particle = {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  maxLife: number
  size: number
  color: Color
}

function makePool(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: 0,
    y: -10,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    life: 0,
    maxLife: 1,
    size: 0.2,
    color: new Color('#d2a06a'),
  }))
}

export function WheelDust({ quality }: { quality: Quality }) {
  const count = quality.isMobile ? 28 : 48
  const mesh = useRef<InstancedMesh>(null)
  const cursor = useRef(0)
  const emit = useRef(0)
  const dummy = useMemo(() => new Object3D(), [])
  const particles = useMemo(() => makePool(count), [count])
  const geometry = useMemo(() => new SphereGeometry(1, 6, 4), [])
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        transparent: true,
        opacity: 0.22,
        roughness: 1,
        metalness: 0,
        depthWrite: false,
        flatShading: true,
      }),
    [],
  )

  useLayoutEffect(() => {
    const inst = mesh.current
    if (!inst) return
    const boot = new Color('#e6c49a')
    for (let i = 0; i < count; i++) inst.setColorAt(i, boot)
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  }, [count])

  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((_, dt) => {
    const inst = mesh.current
    if (!inst) return
    const clamped = Math.min(dt, 0.05)
    const entered = gameStore.get().entered
    const speed = playerPose.speed
    const yaw = playerPose.angle
    const fx = Math.sin(yaw)
    const fz = Math.cos(yaw)
    const cos = Math.cos(yaw)
    const sin = Math.sin(yaw)

    if (entered && speed > 2.2) {
      emit.current += clamped * (1.1 + speed * 2.4)
      while (emit.current >= 1) {
        emit.current -= 1
        const [lx, lz] = WHEELS[cursor.current % WHEELS.length] ?? [0.48, -0.58]
        cursor.current += 1
        const p = particles[cursor.current % particles.length]
        if (!p) continue
        const side = (Math.random() - 0.5) * 0.12
        p.x = playerPose.x + lx * cos + lz * sin + side * fz
        p.y = 0.03 + Math.random() * 0.04
        p.z = playerPose.z - lx * sin + lz * cos - side * fx
        p.vx = -fx * (0.5 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.45
        p.vy = 0.35 + Math.random() * 0.55
        p.vz = -fz * (0.5 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.45
        p.maxLife = 0.28 + Math.random() * 0.32
        p.life = p.maxLife
        p.size = 0.05 + Math.random() * 0.09 * Math.min(speed / 9, 1)
        p.color.set(SAND[Math.floor(Math.random() * SAND.length)] ?? '#e6c49a')
      }
    } else {
      emit.current = 0
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      if (!p) continue
      if (p.life <= 0) {
        dummy.position.set(0, -12, 0)
        dummy.scale.setScalar(0.0001)
        dummy.updateMatrix()
        inst.setMatrixAt(i, dummy.matrix)
        continue
      }
      p.life -= clamped
      p.x += p.vx * clamped
      p.y += p.vy * clamped
      p.z += p.vz * clamped
      p.vy -= 1.4 * clamped
      p.vx *= 1 - 2.2 * clamped
      p.vz *= 1 - 2.2 * clamped
      const t = Math.max(p.life / p.maxLife, 0)
      const puff = 0.25 + 0.55 * Math.sin(t * Math.PI)
      dummy.position.set(p.x, Math.max(p.y, 0.03), p.z)
      dummy.scale.set(p.size * (0.85 + puff * 0.4), p.size * puff * 0.55, p.size * (0.85 + puff * 0.4))
      dummy.updateMatrix()
      inst.setMatrixAt(i, dummy.matrix)
      inst.setColorAt(i, p.color)
    }

    inst.instanceMatrix.needsUpdate = true
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  )
}
