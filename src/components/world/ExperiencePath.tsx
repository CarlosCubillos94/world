import { Text } from '@react-three/drei'
import { experiencePath } from '../../data/content'
import { useUi } from '../../state/game'

export function ExperiencePath() {
  const label = useUi().experienceSign
  const segments = experiencePath.slice(0, -1).map((a, i) => {
    const b = experiencePath[i + 1]
    if (!b) return null
    const dx = b[0] - a[0]
    const dz = b[2] - a[2]
    const len = Math.hypot(dx, dz)
    return {
      key: `seg-${i}`,
      position: [(a[0] + b[0]) / 2, 0.03, (a[2] + b[2]) / 2] as [number, number, number],
      length: len + 0.6,
      yaw: Math.atan2(dx, dz),
    }
  })

  return (
    <group>
      {segments.map(
        (seg) =>
          seg && (
            <group key={seg.key} position={seg.position} rotation={[0, seg.yaw, 0]}>
              <mesh receiveShadow>
                <boxGeometry args={[3.2, 0.05, seg.length]} />
                <meshStandardMaterial color="#c9a06e" roughness={1} flatShading />
              </mesh>
              <mesh position={[0, 0.012, 0]} receiveShadow>
                <boxGeometry args={[1.7, 0.03, seg.length * 0.92]} />
                <meshStandardMaterial color="#b08968" roughness={1} flatShading />
              </mesh>
            </group>
          ),
      )}

      <group position={[4.4, 0, 1.35]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial color="#6f4e37" flatShading />
        </mesh>
        <mesh position={[0.55, 1.28, 0]} castShadow>
          <boxGeometry args={[1.15, 0.42, 0.08]} />
          <meshStandardMaterial color="#e85d04" flatShading />
        </mesh>
        <Text
          position={[0.55, 1.28, 0.05]}
          fontSize={0.16}
          color="#fff6ea"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.05}
          outlineWidth={0.008}
          outlineColor="#2a1810"
        >
          {label}
        </Text>
      </group>
    </group>
  )
}
