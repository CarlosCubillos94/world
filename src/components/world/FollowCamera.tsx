import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { zones } from '../../data/content'
import { playerPose, useGame } from '../../state/game'
import { playerVisual } from './Car'

const _desired = new Vector3()
const _look = new Vector3()
const _lookSmooth = new Vector3()
const _pos = new Vector3()

const search =
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
const frontView = search?.get('front') === '1'
const stopZone = search?.get('stop')
const framedStop = stopZone ? zones.find((zone) => zone.id === stopZone) : undefined

export function FollowCamera() {
  const entered = useGame((s) => s.entered)
  const ready = useRef(false)

  useFrame((state, dt) => {
    if (framedStop && entered) {
      const [x, , z] = framedStop.position
      const yaw = framedStop.angle
      state.camera.position.set(
        x - Math.cos(yaw) * 7.4 + Math.sin(yaw) * 2.6,
        4.5,
        z - Math.sin(yaw) * 7.4 - Math.cos(yaw) * 2.6,
      )
      state.camera.lookAt(x, 1.25, z)
      return
    }

    if (frontView && entered) {
      const vis = playerVisual.current
      if (vis) vis.getWorldPosition(_pos)
      else _pos.set(playerPose.x, playerPose.y, playerPose.z)
      const yaw = playerPose.angle
      state.camera.position.set(
        _pos.x + Math.sin(yaw) * 3.4,
        Math.max(_pos.y, 0) + 1.35,
        _pos.z + Math.cos(yaw) * 3.4,
      )
      state.camera.lookAt(_pos.x, _pos.y + 0.55, _pos.z)
      return
    }

    if (!entered) {
      const t = state.clock.elapsedTime
      state.camera.position.set(
        Math.sin(t * 0.13) * 16,
        5.4,
        Math.cos(t * 0.13) * 16,
      )
      state.camera.lookAt(0, 0.5, 0)
      ready.current = false
      return
    }

    const vis = playerVisual.current
    if (vis) vis.getWorldPosition(_pos)
    else _pos.set(playerPose.x, playerPose.y, playerPose.z)

    const yaw = playerPose.angle
    const lookAhead = Math.min(playerPose.speed * 0.32, 2.6)
    const back = 6.5
    const height = 3.05
    _desired.set(
      _pos.x - Math.sin(yaw) * back,
      Math.max(_pos.y, 0) + height,
      _pos.z - Math.cos(yaw) * back,
    )
    _look.set(
      _pos.x + Math.sin(yaw) * lookAhead,
      Math.max(_pos.y, 0) + 0.65,
      _pos.z + Math.cos(yaw) * lookAhead,
    )

    const follow = 1 - Math.exp(-8 * dt)
    if (!ready.current) {
      state.camera.position.copy(_desired)
      _lookSmooth.copy(_look)
      ready.current = true
    } else {
      state.camera.position.lerp(_desired, follow)
      _lookSmooth.lerp(_look, follow)
    }
    state.camera.lookAt(_lookSmooth)
  })

  return null
}
