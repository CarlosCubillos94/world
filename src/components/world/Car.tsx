import { CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, type MutableRefObject } from 'react'
import { Quaternion, Vector3, type Mesh } from 'three'
import { readControls } from '../../lib/input'
import { setEngineSpeed } from '../../lib/sfx'
import { gameStore, playerPose } from '../../state/game'

export const playerBody = { current: null as RapierRigidBody | null }

const _forward = new Vector3()
const _quat = new Quaternion()
const SPAWN = { x: 0, y: 0.85, z: 0 }

export function Car() {
  const body = useRef<RapierRigidBody>(null)
  const wheels = useRef<[Mesh | null, Mesh | null, Mesh | null, Mesh | null]>([
    null,
    null,
    null,
    null,
  ])
  const spin = useRef(0)
  const holdRespawn = useRef(false)

  useFrame((_, dt) => {
    const rb = body.current
    if (!rb) return
    playerBody.current = rb

    const controls = readControls()
    const rot = rb.rotation()
    _quat.set(rot.x, rot.y, rot.z, rot.w)
    _forward.set(0, 0, 1).applyQuaternion(_quat)

    const vel = rb.linvel()
    const speed = Math.hypot(vel.x, vel.z)
    const clamped = Math.min(dt, 0.05)

    if (Math.abs(controls.forward) > 0.05 && speed < 13) {
      const force = 52 * controls.forward * clamped
      rb.applyImpulse(
        { x: _forward.x * force, y: 0, z: _forward.z * force },
        true,
      )
    }

    if (Math.abs(controls.turn) > 0.05) {
      const yaw = 16 * controls.turn * clamped * (0.35 + Math.min(speed / 8, 1))
      rb.applyTorqueImpulse({ x: 0, y: yaw, z: 0 }, true)
    }

    if (controls.brake) {
      rb.setLinvel({ x: vel.x * 0.9, y: vel.y, z: vel.z * 0.9 }, true)
    }

    const pos = rb.translation()
    const shouldRespawn = controls.respawn || pos.y < -4
    if (shouldRespawn && !holdRespawn.current) {
      respawn(rb)
    }
    holdRespawn.current = controls.respawn

    spin.current += speed * clamped * (controls.forward < -0.05 ? -1 : 1) * 2.4
    const steer = controls.turn * 0.45
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

    playerPose.x = pos.x
    playerPose.y = pos.y
    playerPose.z = pos.z
    playerPose.angle = Math.atan2(_forward.x, _forward.z)
    playerPose.speed = speed

    setEngineSpeed(gameStore.get().entered ? speed : 0, gameStore.get().muted)
  })

  return (
    <RigidBody
      ref={body}
      name="player"
      colliders={false}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
      rotation={[0, Math.PI / 2, 0]}
      mass={14}
      linearDamping={1.35}
      angularDamping={3.4}
      enabledRotations={[false, true, false]}
      canSleep={false}
      ccd
      friction={0.9}
      restitution={0.05}
    >
      <CuboidCollider args={[0.48, 0.28, 0.92]} position={[0, 0.18, 0]} />
      <CarMesh wheels={wheels} />
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
      position={[x, 0.18, z]}
      rotation={[0, 0, Math.PI / 2]}
      castShadow
    >
      <cylinderGeometry args={[0.22, 0.22, 0.16, 8]} />
      <meshStandardMaterial color="#2b2118" flatShading roughness={0.7} />
    </mesh>
  )

  return (
    <group>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.9, 0.28, 1.55]} />
        <meshStandardMaterial color="#e85d04" flatShading roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.5, -0.12]} castShadow>
        <boxGeometry args={[0.78, 0.22, 0.7]} />
        <meshStandardMaterial color="#fff6ea" flatShading />
      </mesh>
      <mesh position={[0, 0.62, -0.08]} castShadow>
        <boxGeometry args={[0.82, 0.08, 0.78]} />
        <meshStandardMaterial color="#2a1810" flatShading />
      </mesh>
      <mesh position={[0, 0.38, 0.78]} castShadow>
        <boxGeometry args={[0.86, 0.16, 0.22]} />
        <meshStandardMaterial color="#c44103" flatShading />
      </mesh>
      <mesh position={[0.28, 0.38, 0.9]}>
        <boxGeometry args={[0.14, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.28, 0.38, 0.9]}>
        <boxGeometry args={[0.14, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.48, -0.82]} castShadow>
        <torusGeometry args={[0.16, 0.05, 6, 10]} />
        <meshStandardMaterial color="#2b2118" flatShading />
      </mesh>
      <mesh position={[0, 0.28, -0.95]} castShadow>
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
