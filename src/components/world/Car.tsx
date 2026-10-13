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
const SPAWN = { x: 0, y: 0.28, z: 0 }
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
      <CuboidCollider args={[0.42, 0.16, 0.82]} position={[0, 0.16, 0]} />
      <group ref={visual}>
        <CarMesh wheels={wheels} />
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

function CarMesh({
  wheels,
}: {
  wheels: MutableRefObject<[Mesh | null, Mesh | null, Mesh | null, Mesh | null]>
}) {
  const wheel = (
    index: 0 | 1 | 2 | 3,
    x: number,
    z: number,
  ) => (
    <mesh
      ref={(node) => {
        wheels.current[index] = node
      }}
      position={[x, 0.2, z]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
    >
      <cylinderGeometry args={[0.2, 0.2, 0.16, 8]} />
      <meshStandardMaterial color="#2b2118" flatShading roughness={0.7} />
    </mesh>
  )

  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.9, 0.28, 1.55]} />
        <meshPhysicalMaterial
          color="#e85d04"
          flatShading
          roughness={0.38}
          metalness={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.35}
        />
      </mesh>
      <mesh position={[0, 0.48, -0.12]} castShadow>
        <boxGeometry args={[0.78, 0.22, 0.7]} />
        <meshStandardMaterial color="#fff6ea" flatShading />
      </mesh>
      <mesh position={[0, 0.6, -0.08]} castShadow>
        <boxGeometry args={[0.82, 0.08, 0.78]} />
        <meshStandardMaterial color="#2a1810" flatShading />
      </mesh>
      <mesh position={[0, 0.36, 0.78]} castShadow>
        <boxGeometry args={[0.86, 0.16, 0.22]} />
        <meshStandardMaterial color="#c44103" flatShading />
      </mesh>
      <mesh position={[0.28, 0.36, 0.9]}>
        <boxGeometry args={[0.14, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.28, 0.36, 0.9]}>
        <boxGeometry args={[0.14, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.46, -0.82]} castShadow>
        <torusGeometry args={[0.16, 0.05, 6, 10]} />
        <meshStandardMaterial color="#2b2118" flatShading />
      </mesh>
      <mesh position={[0, 0.26, -0.95]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.08]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {wheel(0, 0.5, 0.52)}
      {wheel(1, -0.5, 0.52)}
      {wheel(2, 0.5, -0.52)}
      {wheel(3, -0.5, -0.52)}
    </group>
  )
}
