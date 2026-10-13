import { RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { Color, Float32BufferAttribute } from 'three'
import { mulberry32 } from '../../lib/random'

export function Ground() {
  const colors = useMemo(() => {
    const rng = mulberry32(42)
    const geomCount = 81 * 81
    const arr = new Float32Array(geomCount * 3)
    const a = new Color('#e6c39a')
    const b = new Color('#c99563')
    const c = new Color('#d8b07a')
    const tmp = new Color()
    for (let i = 0; i < geomCount; i++) {
      tmp.copy(a).lerp(rng() > 0.5 ? b : c, 0.35 + rng() * 0.4)
      arr[i * 3] = tmp.r
      arr[i * 3 + 1] = tmp.g
      arr[i * 3 + 2] = tmp.b
    }
    return new Float32BufferAttribute(arr, 3)
  }, [])

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -1, 0]} friction={1.6} restitution={0}>
        <mesh visible={false}>
          <boxGeometry args={[160, 2, 160]} />
          <meshBasicMaterial />
        </mesh>
      </RigidBody>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, 0, 0]}
      >
        <planeGeometry args={[120, 120, 80, 80]}>
          <primitive attach="attributes-color" object={colors} />
        </planeGeometry>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[14.2, 17.8, 64]} />
        <meshStandardMaterial color="#c48a58" roughness={1} />
      </mesh>

      <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[2.15, 2.4, 32]} />
          <meshStandardMaterial color="#b67a4c" roughness={1} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.28, 12]} />
          <meshStandardMaterial color="#a86b40" />
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
        <RigidBody key={i} type="fixed" position={[x, y, z]} colliders="cuboid">
          <mesh visible={false}>
            <boxGeometry args={[w, h, d]} />
            <meshBasicMaterial />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}
