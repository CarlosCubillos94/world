import { RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import type { Quality } from '../../lib/quality'
import { mulberry32 } from '../../lib/random'

const COLORS = ['#e9c46a', '#f4a261', '#e76f51', '#2a9d8f', '#e9ecef', '#cdb4db']

export function PlayfulObjects({ quality }: { quality: Quality }) {
  const items = useMemo(() => {
    const rng = mulberry32(77)
    const list: {
      kind: 'ball' | 'crate'
      pos: [number, number, number]
      color: string
    }[] = []
    const spots: [number, number][] = [
      [5, 4],
      [-4, 6],
      [3, -5],
      [-6, -3],
      [8, -8],
      [-9, 5],
      [2, 9],
      [-2, -8],
    ]
    for (let i = 0; i < quality.physicsCount; i++) {
      const [x, z] = spots[i] ?? [(rng() - 0.5) * 12, (rng() - 0.5) * 12]
      list.push({
        kind: i % 3 === 0 ? 'crate' : 'ball',
        pos: [x, 0.7 + rng() * 0.4, z],
        color: COLORS[i % COLORS.length] ?? '#e9c46a',
      })
    }
    return list
  }, [quality.physicsCount])

  return (
    <group>
      {items.map((item, i) =>
        item.kind === 'ball' ? (
          <RigidBody
            key={i}
            position={item.pos}
            colliders="ball"
            restitution={0.55}
            friction={0.4}
            mass={0.6}
          >
            <mesh castShadow>
              <icosahedronGeometry args={[0.38, 0]} />
              <meshStandardMaterial color={item.color} flatShading roughness={0.4} />
            </mesh>
          </RigidBody>
        ) : (
          <RigidBody
            key={i}
            position={item.pos}
            colliders="cuboid"
            restitution={0.15}
            friction={0.8}
            mass={1.1}
          >
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.7, 0.7]} />
              <meshStandardMaterial color="#b08968" flatShading roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
              <boxGeometry args={[0.72, 0.04, 0.72]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
          </RigidBody>
        ),
      )}
    </group>
  )
}
