import {
  CuboidCollider,
  RigidBody,
  useBeforePhysicsStep,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, type MutableRefObject } from 'react'
import { Group, Quaternion, Vector3, type Mesh } from 'three'
import { readControls } from '../../lib/input'
import { setEngineSpeed } from '../../lib/sfx'
import { gameStore, playerPose } from '../../state/game'

export const playerVisual = { current: null as Group | null }

const _forward = new Vector3()
const _quat = new Quaternion()
const _worldPos = new Vector3()
const SPAWN = { x: 0, y: 0.3, z: 0 }
const STEP = 1 / 60
const MAX_SPEED = 10.5
const ACCEL = 16
const BRAKE = 24
const DRAG = 7
const STEER = 2.35

function approach(current: number, target: number, maxDelta: number) {
  const delta = target - current
  if (Math.abs(delta) <= maxDelta) return target
  return current + Math.sign(delta) * maxDelta
}

export function Car() {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<Group>(null)
  const wheels = useRef<[Mesh | null, Mesh | null, Mesh | null, Mesh | null]>([
    null,
    null,
    null,
    null,
  ])
  const spin = useRef(0)
  const holdRespawn = useRef(false)

  useBeforePhysicsStep(() => {
    const rb = body.current
    if (!rb) return

    const controls = readControls()
    if (controls.respawn && !holdRespawn.current) respawn(rb)
    holdRespawn.current = controls.respawn

    const rot = rb.rotation()
    _quat.set(rot.x, rot.y, rot.z, rot.w)
    _forward.set(0, 0, 1).applyQuaternion(_quat)

    const vel = rb.linvel()
    let along = vel.x * _forward.x + vel.z * _forward.z

    if (controls.brake) {
      along = approach(along, 0, BRAKE * STEP)
    } else if (Math.abs(controls.forward) > 0.04) {
      along = approach(along, controls.forward * MAX_SPEED, ACCEL * STEP)
    } else {
      along = approach(along, 0, DRAG * STEP)
    }

    rb.setLinvel(
      { x: _forward.x * along, y: vel.y, z: _forward.z * along },
      true,
    )

    const speedFactor = Math.min(Math.abs(along) / 2.8, 1)
    const steer = along < -0.35 ? -controls.turn : controls.turn
    rb.setAngvel({ x: 0, y: steer * STEER * (0.22 + 0.78 * speedFactor), z: 0 }, true)

    const pos = rb.translation()
    if (pos.y < -3) respawn(rb)
  })

  useFrame((_, dt) => {
    const rb = body.current
    const vis = visual.current
    if (!rb || !vis) return
    playerVisual.current = vis

    vis.getWorldPosition(_worldPos)
    vis.getWorldQuaternion(_quat)
    _forward.set(0, 0, 1).applyQuaternion(_quat)

    const vel = rb.linvel()
    const speed = Math.hypot(vel.x, vel.z)
    const clamped = Math.min(dt, 0.05)
    const controls = readControls()

    spin.current += speed * clamped * (controls.forward < -0.05 ? -1 : 1) * 2.6
    const steer = controls.turn * 0.42
    const w = wheels.current
    if (w[0]) {
      w[0].rotation.y = steer
      w[0].rotation.x = spin.current
    }
    if (w[1]) {
      w[1].rotation.y = steer
      w[1].rotation.x = spin.current
    }
    if (w[2]) w[2].rotation.x = spin.current
    if (w[3]) w[3].rotation.x = spin.current

    playerPose.x = _worldPos.x
    playerPose.y = _worldPos.y
    playerPose.z = _worldPos.z
    playerPose.angle = Math.atan2(_forward.x, _forward.z)
    playerPose.speed = speed

    setEngineSpeed(gameStore.get().entered ? speed : 0, gameStore.get().muted)
  })

  return (
    <RigidBody
      name="player"
      ref={body}
      colliders={false}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
      rotation={[0, Math.PI / 2, 0]}
      mass={8}
      linearDamping={0.35}
      angularDamping={2.2}
      enabledRotations={[false, true, false]}
      canSleep={false}
      ccd
      friction={0.95}
      restitution={0}
    >
      <CuboidCollider args={[0.48, 0.2, 0.9]} position={[0, 0.2, 0]} />
      <group ref={visual}>
        <GWagonMesh wheels={wheels} />
      </group>
    </RigidBody>
  )
}

function respawn(rb: RapierRigidBody) {
  rb.setTranslation(SPAWN, true)
  rb.setRotation({ x: 0, y: 0.7071068, z: 0, w: 0.7071068 }, true)
  rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
  rb.setAngvel({ x: 0, y: 0, z: 0 }, true)
}

function GWagonMesh({
  wheels,
}: {
  wheels: MutableRefObject<[Mesh | null, Mesh | null, Mesh | null, Mesh | null]>
}) {
  const paint = '#c4b396'
  const trim = '#d7dbe2'
  const glass = '#3a4a55'
  const rubber = '#1a1614'
  const dark = '#2a2c31'

  const wheel = (index: 0 | 1 | 2 | 3, x: number, z: number) => (
    <mesh
      ref={(node) => {
        wheels.current[index] = node
      }}
      position={[x, 0.22, z]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
    >
      <cylinderGeometry args={[0.22, 0.22, 0.2, 10]} />
      <meshStandardMaterial color={rubber} flatShading roughness={0.75} />
      <mesh>
        <cylinderGeometry args={[0.11, 0.11, 0.22, 8]} />
        <meshStandardMaterial color={trim} metalness={0.55} roughness={0.35} />
      </mesh>
    </mesh>
  )

  return (
    <group>
      <mesh position={[0, 0.42, -0.08]} castShadow>
        <boxGeometry args={[0.98, 0.48, 1.28]} />
        <meshPhysicalMaterial
          color={paint}
          flatShading
          roughness={0.32}
          metalness={0.18}
          clearcoat={0.55}
          clearcoatRoughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.36, 0.72]} castShadow>
        <boxGeometry args={[0.96, 0.28, 0.52]} />
        <meshPhysicalMaterial
          color={paint}
          flatShading
          roughness={0.32}
          metalness={0.18}
          clearcoat={0.55}
          clearcoatRoughness={0.28}
        />
      </mesh>
      <mesh position={[0, 0.78, -0.12]} castShadow>
        <boxGeometry args={[0.92, 0.34, 1.12]} />
        <meshPhysicalMaterial
          color={paint}
          flatShading
          roughness={0.32}
          metalness={0.18}
          clearcoat={0.45}
          clearcoatRoughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.98, -0.12]} castShadow>
        <boxGeometry args={[0.94, 0.06, 1.14]} />
        <meshStandardMaterial color={dark} roughness={0.7} />
      </mesh>
      <mesh position={[0.28, 1.03, -0.08]}>
        <boxGeometry args={[0.08, 0.08, 0.9]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[-0.28, 1.03, -0.08]}>
        <boxGeometry args={[0.08, 0.08, 0.9]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[0, 0.8, 0.42]}>
        <boxGeometry args={[0.86, 0.26, 0.04]} />
        <meshStandardMaterial color={glass} roughness={0.15} metalness={0.3} />
      </mesh>
      <mesh position={[0.47, 0.8, -0.02]}>
        <boxGeometry args={[0.04, 0.22, 0.72]} />
        <meshStandardMaterial color={glass} roughness={0.22} metalness={0.25} />
      </mesh>
      <mesh position={[-0.47, 0.8, -0.02]}>
        <boxGeometry args={[0.04, 0.22, 0.72]} />
        <meshStandardMaterial color={glass} roughness={0.22} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.78, -0.69]} castShadow>
        <boxGeometry args={[0.9, 0.34, 0.05]} />
        <meshPhysicalMaterial
          color={paint}
          flatShading
          roughness={0.32}
          metalness={0.18}
          clearcoat={0.45}
          clearcoatRoughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.88, -0.72]}>
        <boxGeometry args={[0.4, 0.13, 0.03]} />
        <meshStandardMaterial color="#5c7380" roughness={0.28} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.38, 0.99]} castShadow>
        <boxGeometry args={[0.78, 0.22, 0.06]} />
        <meshStandardMaterial color={dark} roughness={0.5} />
      </mesh>
      {[-0.22, -0.11, 0, 0.11, 0.22].map((x) => (
        <mesh key={x} position={[x, 0.4, 1.02]}>
          <boxGeometry args={[0.05, 0.16, 0.03]} />
          <meshStandardMaterial color={trim} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0.28, 0.4, 1.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 10]} />
        <meshStandardMaterial color="#f4f0d8" emissive="#ffe08a" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[-0.28, 0.4, 1.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 10]} />
        <meshStandardMaterial color="#f4f0d8" emissive="#ffe08a" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0.5, 0.28, 0.7]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.28]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[-0.5, 0.28, 0.7]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.28]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[0.5, 0.28, -0.62]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.28]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[-0.5, 0.28, -0.62]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.28]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[0.5, 0.24, 0.05]}>
        <boxGeometry args={[0.08, 0.05, 1.15]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[-0.5, 0.24, 0.05]}>
        <boxGeometry args={[0.08, 0.05, 1.15]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[0.52, 0.72, 0.38]}>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[-0.52, 0.72, 0.38]}>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      <mesh position={[0.32, 0.48, -0.74]}>
        <boxGeometry args={[0.16, 0.1, 0.04]} />
        <meshStandardMaterial color="#c1121f" emissive="#7a0f16" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.32, 0.48, -0.74]}>
        <boxGeometry args={[0.16, 0.1, 0.04]} />
        <meshStandardMaterial color="#c1121f" emissive="#7a0f16" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.56, -0.82]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 10]} />
        <meshStandardMaterial color={rubber} flatShading roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.56, -0.88]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 8]} />
        <meshStandardMaterial color={trim} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.28, -0.86]} castShadow>
        <boxGeometry args={[0.72, 0.1, 0.08]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      {wheel(0, 0.48, 0.56)}
      {wheel(1, -0.48, 0.56)}
      {wheel(2, 0.48, -0.58)}
      {wheel(3, -0.48, -0.58)}
    </group>
  )
}
