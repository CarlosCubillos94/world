import { Float, Text } from '@react-three/drei'
import {
  CuboidCollider,
  RigidBody,
  type CollisionPayload,
} from '@react-three/rapier'
import { zones, type Zone } from '../../data/content'
import { playChime } from '../../lib/sfx'
import { gameStore } from '../../state/game'

export function Stands() {
  return (
    <group>
      {zones.map((zone) => (
        <Stand key={zone.id} zone={zone} />
      ))}
    </group>
  )
}

function Stand({ zone }: { zone: Zone }) {
  const [x, , z] = zone.position

  const enter = (payload: CollisionPayload) => {
    if (payload.other.rigidBodyObject?.name !== 'player') return
    gameStore.set({ activeZone: zone.id })
    playChime(gameStore.get().muted)
  }

  const leave = (payload: CollisionPayload) => {
    if (payload.other.rigidBodyObject?.name !== 'player') return
    if (gameStore.get().activeZone === zone.id) {
      gameStore.set({ activeZone: null })
    }
  }

  return (
    <group position={[x, 0, z]} rotation={[0, -zone.angle - Math.PI / 2, 0]}>
      <RigidBody type="fixed" colliders="cuboid" friction={1.2}>
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[3.1, 3.3, 0.16, 12]} />
          <meshStandardMaterial color="#c9a27a" flatShading roughness={1} />
        </mesh>
        <mesh position={[0, 0.14, 0]} receiveShadow>
          <cylinderGeometry args={[2.4, 2.5, 0.08, 12]} />
          <meshStandardMaterial color="#b08968" flatShading />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid" position={[-1.15, 1.05, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 2.1, 0.16]} />
          <meshStandardMaterial color="#6f4e37" flatShading />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid" position={[1.15, 1.05, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.16, 2.1, 0.16]} />
          <meshStandardMaterial color="#6f4e37" flatShading />
        </mesh>
      </RigidBody>

      <mesh position={[0, 2.15, -0.15]} castShadow>
        <boxGeometry args={[2.6, 0.18, 0.18]} />
        <meshStandardMaterial color="#5c4033" flatShading />
      </mesh>
      <mesh position={[0, 2.55, -0.12]} castShadow>
        <boxGeometry args={[2.2, 0.72, 0.08]} />
        <meshStandardMaterial color={zone.banner} flatShading />
      </mesh>

      <Text
        position={[0, 2.55, 0.0]}
        fontSize={0.28}
        color="#fff6ea"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        outlineWidth={0.012}
        outlineColor="#2a1810"
      >
        {zone.title}
      </Text>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
        <group position={[0, 0.95, 0.75]}>{iconFor(zone)}</group>
      </Float>

      <RigidBody type="fixed" colliders={false} position={[0, 1, 0]}>
        <CuboidCollider
          args={[3.6, 1.6, 3.6]}
          sensor
          onIntersectionEnter={enter}
          onIntersectionExit={leave}
        />
      </RigidBody>
    </group>
  )
}

function iconFor(zone: Zone) {
  switch (zone.id) {
    case 'gymflow':
      return (
        <group>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 1.5, 6]} />
            <meshStandardMaterial color="#3d3d3d" metalness={0.4} />
          </mesh>
          <mesh position={[-0.7, 0, 0]}>
            <sphereGeometry args={[0.22, 8, 6]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
          <mesh position={[0.7, 0, 0]}>
            <sphereGeometry args={[0.22, 8, 6]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
        </group>
      )
    case 'fynn':
      return (
        <group>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.06, 12]} />
            <meshStandardMaterial color="#e9c46a" metalness={0.5} />
          </mesh>
          <mesh position={[0.08, 0.16, 0.05]}>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 12]} />
            <meshStandardMaterial color="#f4d35e" metalness={0.5} />
          </mesh>
          <mesh position={[-0.05, 0.24, -0.04]}>
            <cylinderGeometry args={[0.24, 0.24, 0.06, 12]} />
            <meshStandardMaterial color="#ffe08a" metalness={0.5} />
          </mesh>
        </group>
      )
    case 'reflex':
      return (
        <group rotation={[0, 0.4, 0.15]}>
          <mesh>
            <boxGeometry args={[0.18, 0.9, 0.12]} />
            <meshStandardMaterial color="#c77dff" flatShading emissive="#7b2cbf" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.2, 0.15, 0]} rotation={[0, 0, 0.7]}>
            <boxGeometry args={[0.5, 0.16, 0.1]} />
            <meshStandardMaterial color="#e0aaff" flatShading />
          </mesh>
        </group>
      )
    case 'valorant':
      return (
        <group>
          <mesh rotation={[0.3, 0, 0]}>
            <torusGeometry args={[0.38, 0.05, 6, 14]} />
            <meshStandardMaterial color="#c1121f" flatShading />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.7, 6]} />
            <meshStandardMaterial color="#6c757d" metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color="#ffddd2" />
          </mesh>
        </group>
      )
    case 'about':
      return (
        <group>
          <mesh position={[0, 0.22, 0]}>
            <boxGeometry args={[0.38, 0.5, 0.22]} />
            <meshStandardMaterial color="#fff6ea" flatShading />
          </mesh>
          <mesh position={[0, 0.58, 0]}>
            <sphereGeometry args={[0.16, 8, 6]} />
            <meshStandardMaterial color="#e0b089" flatShading />
          </mesh>
        </group>
      )
    case 'contact':
      return (
        <group rotation={[0, 0.5, 0.4]}>
          <mesh>
            <boxGeometry args={[0.7, 0.42, 0.06]} />
            <meshStandardMaterial color="#fff6ea" flatShading />
          </mesh>
          <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.62, 0.08, 0.02]} />
            <meshStandardMaterial color="#1d3557" />
          </mesh>
        </group>
      )
    default:
      return null
  }
}
