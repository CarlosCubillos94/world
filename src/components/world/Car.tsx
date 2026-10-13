import {
  CuboidCollider,
  RigidBody,
  useBeforePhysicsStep,
  useRapier,
  type RapierRigidBody,
} from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, type MutableRefObject } from 'react'
import { Group, Quaternion, Vector3, type Object3D } from 'three'
import type { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat'
import { readControls } from '../../lib/input'
import { setEngineSpeed } from '../../lib/sfx'
import { gameStore, playerPose } from '../../state/game'

export const playerVisual = { current: null as Group | null }

const _forward = new Vector3()
const _up = new Vector3()
const _quat = new Quaternion()
const _worldPos = new Vector3()

const SPAWN = { x: 0, y: 0.42, z: 0 }
const SPAWN_ROT = { x: 0, y: 0.7071068, z: 0, w: 0.7071068 }
const STEP = 1 / 60
const EXCLUDE_SENSORS = 8
const MASS = 60

const WHEEL_RADIUS = 0.2
const WHEEL_REST = 0.18
const WHEEL_TRAVEL = 0.12
const WHEEL_CONN = { x: 0.42, y: 0.08, z: 0.48 }

const ENGINE_FORCE = 320
const REVERSE_FACTOR = 0.55
const CRUISE_SPEED = 10.5
const MAX_STEER = 0.48
const STEER_SPEED = 5.2
const BRAKE_FORCE = 8
const HANDBRAKE_FORCE = 14
const COAST_BRAKE = 1.05
const STIFFNESS = 48
const COMPRESSION = 4.4
const RELAXATION = 2.8
const FRICTION_SLIP = 5.6
const SIDE_FRICTION = 1.05
const MAX_SUSPENSION_FORCE = 4500
const WHEEL_RAY_GROUPS = 0xfffffffe
const CHASSIS_GROUPS = 0x0001ffff

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function Car() {
  const body = useRef<RapierRigidBody>(null)
  const visual = useRef<Group>(null)
  const wheels = useRef<[Object3D | null, Object3D | null, Object3D | null, Object3D | null]>([
    null,
    null,
    null,
    null,
  ])
  const vehicleRef = useRef<DynamicRayCastVehicleController | null>(null)
  const steer = useRef(0)
  const spin = useRef([0, 0, 0, 0])
  const holdRespawn = useRef(false)
  const { world } = useRapier()

  useEffect(() => {
    return () => {
      const vehicle = vehicleRef.current
      if (vehicle) {
        world.removeVehicleController(vehicle)
        vehicleRef.current = null
      }
    }
  }, [world])

  useBeforePhysicsStep(() => {
    const rb = body.current
    if (!rb) return

    let vehicle = vehicleRef.current
    if (!vehicle) {
      vehicle = world.createVehicleController(rb)
      vehicle.indexUpAxis = 1
      vehicle.setIndexForwardAxis = 2

      const points = [
        { x: -WHEEL_CONN.x, y: WHEEL_CONN.y, z: WHEEL_CONN.z },
        { x: WHEEL_CONN.x, y: WHEEL_CONN.y, z: WHEEL_CONN.z },
        { x: -WHEEL_CONN.x, y: WHEEL_CONN.y, z: -WHEEL_CONN.z },
        { x: WHEEL_CONN.x, y: WHEEL_CONN.y, z: -WHEEL_CONN.z },
      ]
      for (const point of points) {
        vehicle.addWheel(point, { x: 0, y: -1, z: 0 }, { x: 1, y: 0, z: 0 }, WHEEL_REST, WHEEL_RADIUS)
      }
      for (let i = 0; i < 4; i++) {
        vehicle.setWheelSuspensionStiffness(i, STIFFNESS)
        vehicle.setWheelSuspensionCompression(i, COMPRESSION)
        vehicle.setWheelSuspensionRelaxation(i, RELAXATION)
        vehicle.setWheelMaxSuspensionTravel(i, WHEEL_TRAVEL)
        vehicle.setWheelMaxSuspensionForce(i, MAX_SUSPENSION_FORCE)
        vehicle.setWheelFrictionSlip(i, FRICTION_SLIP)
        vehicle.setWheelSideFrictionStiffness(i, SIDE_FRICTION)
      }
      vehicleRef.current = vehicle
    }

    const controls = readControls()
    if (controls.respawn && !holdRespawn.current) respawn(rb)
    holdRespawn.current = controls.respawn

    const rot = rb.rotation()
    _quat.set(rot.x, rot.y, rot.z, rot.w)
    _forward.set(0, 0, 1).applyQuaternion(_quat)
    _up.set(0, 1, 0).applyQuaternion(_quat)

    const vel = rb.linvel()
    const along = vel.x * _forward.x + vel.y * _forward.y + vel.z * _forward.z
    const speed = Math.hypot(vel.x, vel.z)

    const targetSteer = controls.turn * MAX_STEER
    const steerStep = STEER_SPEED * STEP
    steer.current = clamp(targetSteer, steer.current - steerStep, steer.current + steerStep)
    vehicle.setWheelSteering(0, steer.current)
    vehicle.setWheelSteering(1, steer.current)

    const throttle = controls.forward
    const cap = CRUISE_SPEED
    let force = 0
    if (throttle > 0.04 && speed < cap) {
      force = -ENGINE_FORCE * throttle
      if (speed > cap * 0.88) {
        force *= clamp((cap - speed) / (cap * 0.12), 0, 1)
      }
    } else if (throttle < -0.04) {
      force = along > 0.55 ? 0 : -ENGINE_FORCE * REVERSE_FACTOR * throttle
    }

    if (force < 0) {
      const frontLoad =
        (vehicle.wheelSuspensionForce(0) ?? 0) + (vehicle.wheelSuspensionForce(1) ?? 0)
      const nominalAxle = (MASS * 9.82) / 2
      force *= clamp(frontLoad / Math.max(nominalAxle * 0.4, 1), 0.35, 1)
    }

    vehicle.setWheelEngineForce(0, 0)
    vehicle.setWheelEngineForce(1, 0)
    vehicle.setWheelEngineForce(2, force)
    vehicle.setWheelEngineForce(3, force)

    let brake = 0
    if (throttle < -0.04 && along > 0.6) brake = BRAKE_FORCE
    if (Math.abs(throttle) <= 0.04) brake = COAST_BRAKE
    for (let i = 0; i < 4; i++) vehicle.setWheelBrake(i, brake)
    if (controls.brake) {
      vehicle.setWheelBrake(2, HANDBRAKE_FORCE)
      vehicle.setWheelBrake(3, HANDBRAKE_FORCE)
    }

    vehicle.updateVehicle(STEP, EXCLUDE_SENSORS, WHEEL_RAY_GROUPS, (collider) => {
      const col = typeof collider === 'number' ? world.getCollider(collider) : collider
      return col?.parent()?.handle !== rb.handle
    })

    const ang = rb.angvel()
    const grounded = [0, 1, 2, 3].reduce((n, i) => n + (vehicle.wheelIsInContact(i) ? 1 : 0), 0)
    const tiltDamp = grounded > 0 && grounded < 4 ? 0.72 : 0.94
    rb.setAngvel({ x: ang.x * tiltDamp, y: ang.y, z: ang.z * tiltDamp }, true)

    if (_up.y < 0.2) {
      rb.setAngvel({ x: ang.x * 0.8, y: ang.y * 0.8, z: ang.z * 0.8 }, true)
    }

    const pos = rb.translation()
    if (pos.y < -3) respawn(rb)
  })

  useFrame((_, dt) => {
    const rb = body.current
    const vis = visual.current
    const vehicle = vehicleRef.current
    if (!rb || !vis) return
    playerVisual.current = vis

    vis.getWorldPosition(_worldPos)
    vis.getWorldQuaternion(_quat)
    _forward.set(0, 0, 1).applyQuaternion(_quat)

    const vel = rb.linvel()
    const speed = Math.hypot(vel.x, vel.z)
    const along = vel.x * _forward.x + vel.z * _forward.z
    const clamped = Math.min(dt, 0.05)

    for (let i = 0; i < 4; i++) {
      const node = wheels.current[i]
      if (!node) continue
      const rest = vehicle?.wheelSuspensionRestLength(i) ?? WHEEL_REST
      const hanging = vehicle ? !vehicle.wheelIsInContact(i) : true
      const length = hanging ? rest : (vehicle?.wheelSuspensionLength(i) ?? rest)
      const side = i % 2 === 0 ? -1 : 1
      const front = i < 2 ? 1 : -1
      node.position.set(side * WHEEL_CONN.x, WHEEL_CONN.y - length, front * WHEEL_CONN.z)
      spin.current[i] += (along / WHEEL_RADIUS) * clamped
      const steerY = i < 2 ? steer.current : 0
      node.rotation.set(spin.current[i], steerY, 0)
    }

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
      mass={MASS}
      linearDamping={0.08}
      angularDamping={0.18}
      canSleep={false}
      ccd
      friction={0.02}
      restitution={0}
    >
      <CuboidCollider
        args={[0.34, 0.09, 0.5]}
        position={[0, 0.34, 0]}
        friction={0.02}
        restitution={0}
        collisionGroups={CHASSIS_GROUPS}
      />
      <group ref={visual}>
        <CarMesh wheels={wheels} />
      </group>
    </RigidBody>
  )
}

function respawn(rb: RapierRigidBody) {
  rb.setTranslation(SPAWN, true)
  rb.setRotation(SPAWN_ROT, true)
  rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
  rb.setAngvel({ x: 0, y: 0, z: 0 }, true)
}

function CarMesh({
  wheels,
}: {
  wheels: MutableRefObject<[Object3D | null, Object3D | null, Object3D | null, Object3D | null]>
}) {
  const wheel = (index: 0 | 1 | 2 | 3, x: number, z: number) => (
    <group
      ref={(node) => {
        wheels.current[index] = node
      }}
      position={[x, WHEEL_CONN.y - WHEEL_REST, z]}
    >
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, 0.16, 10]} />
        <meshStandardMaterial color="#2b2118" flatShading roughness={0.7} />
      </mesh>
    </group>
  )

  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow>
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
      <mesh position={[0, 0.46, -0.12]} castShadow>
        <boxGeometry args={[0.78, 0.22, 0.7]} />
        <meshStandardMaterial color="#fff6ea" flatShading />
      </mesh>
      <mesh position={[0, 0.58, -0.08]} castShadow>
        <boxGeometry args={[0.82, 0.08, 0.78]} />
        <meshStandardMaterial color="#2a1810" flatShading />
      </mesh>
      <mesh position={[0, 0.34, 0.78]} castShadow>
        <boxGeometry args={[0.86, 0.16, 0.22]} />
        <meshStandardMaterial color="#c44103" flatShading />
      </mesh>
      <mesh position={[0.28, 0.34, 0.9]}>
        <boxGeometry args={[0.14, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.28, 0.34, 0.9]}>
        <boxGeometry args={[0.14, 0.08, 0.06]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffb703" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.44, -0.82]} castShadow>
        <torusGeometry args={[0.16, 0.05, 6, 10]} />
        <meshStandardMaterial color="#2b2118" flatShading />
      </mesh>
      <mesh position={[0, 0.24, -0.95]} castShadow>
        <boxGeometry args={[0.7, 0.08, 0.08]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {wheel(0, -WHEEL_CONN.x, WHEEL_CONN.z)}
      {wheel(1, WHEEL_CONN.x, WHEEL_CONN.z)}
      {wheel(2, -WHEEL_CONN.x, -WHEEL_CONN.z)}
      {wheel(3, WHEEL_CONN.x, -WHEEL_CONN.z)}
    </group>
  )
}
