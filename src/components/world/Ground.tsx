import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { Color, Float32BufferAttribute } from 'three'
import { mulberry32 } from '../../lib/random'

const SAND = ['#e6c39a', '#d2a06a', '#c99563'] as const
const BLOOM = ['#e0488a', '#f2c14e', '#7b5ea7', '#fff1d6', '#ff7a3d', '#d94b8a'] as const

export function bloomField(x: number, z: number) {
  return (
    0.52 * Math.sin(x * 0.16 + 0.4) * Math.cos(z * 0.13) +
    0.28 * Math.sin(x * 0.07 + z * 0.09) +
    0.18 * Math.cos(z * 0.21 - x * 0.05)
  )
}

export function Ground() {
  const colors = useMemo(() => {
    const rng = mulberry32(42)
    const segs = 80
    const verts = segs + 1
    const arr = new Float32Array(verts * verts * 3)
    const sandA = new Color(SAND[0])
    const sandB = new Color(SAND[1])
    const sandC = new Color(SAND[2])
    const blooms = BLOOM.map((hex) => new Color(hex))
    const tmp = new Color()
    for (let row = 0; row < verts; row++) {
      for (let col = 0; col < verts; col++) {
        const i = row * verts + col
        const x = (col / segs - 0.5) * 120
        const z = (row / segs - 0.5) * 120
        const field = bloomField(x, z) + (rng() - 0.5) * 0.18
        if (field > 0.22) {
          const pick = blooms[Math.floor(rng() * blooms.length)] ?? blooms[0]
          tmp.copy(sandA).lerp(pick, 0.55 + rng() * 0.4)
        } else {
          tmp.copy(sandA).lerp(rng() > 0.5 ? sandB : sandC, 0.3 + rng() * 0.45)
        }
        arr[i * 3] = tmp.r
        arr[i * 3 + 1] = tmp.g
        arr[i * 3 + 2] = tmp.b
      }
    }
    return new Float32BufferAttribute(arr, 3)
  }, [])

  return (
    <>
      <RigidBody type="fixed" colliders={false} friction={1.8} restitution={0}>
        <CuboidCollider args={[80, 2, 80]} position={[0, -2, 0]} />
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[120, 120, 80, 80]}>
          <primitive attach="attributes-color" object={colors} />
        </planeGeometry>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[14.2, 17.8, 64]} />
        <meshStandardMaterial color="#c9a06e" roughness={1} metalness={0} />
      </mesh>

      <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.15, 2.4, 32]} />
          <meshStandardMaterial color="#b67a4c" roughness={1} metalness={0} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.28, 12]} />
          <meshStandardMaterial color="#a86b40" roughness={1} metalness={0} />
        </mesh>
      </group>
    </>
  )
}

export function Bounds() {
  const size = 40
  const thick = 2.4
  const height = 10
  const walls: [number, number, number, number, number, number][] = [
    [0, height / 2, size, size * 2, height, thick],
    [0, height / 2, -size, size * 2, height, thick],
    [size, height / 2, 0, thick, height, size * 2],
    [-size, height / 2, 0, thick, height, size * 2],
  ]

  return (
    <>
      {walls.map(([x, y, z, w, h, d], i) => (
        <RigidBody key={i} type="fixed" position={[x, y, z]} colliders={false}>
          <CuboidCollider args={[w / 2, h / 2, d / 2]} />
        </RigidBody>
      ))}
    </>
  )
}
