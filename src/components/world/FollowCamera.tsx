import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Quaternion, Vector3 } from 'three'
import { playerPose } from '../../state/game'
import { playerBody } from './Car'
import { useGame } from '../../state/game'

const _target = new Vector3()
const _look = new Vector3()
const _offset = new Vector3()
const _quat = new Quaternion()

export function FollowCamera() {
  const entered = useGame((s) => s.entered)
  const ready = useRef(false)

  useFrame((state, dt) => {
    if (!entered) {
      const t = state.clock.elapsedTime
      state.camera.position.set(
        Math.sin(t * 0.13) * 16,
        5.4,
        Math.cos(t * 0.13) * 16,
      )
      state.camera.lookAt(0, 0.6, 0)
      ready.current = false
      return
    }

    const rb = playerBody.current
    if (!rb) {
      state.camera.position.set(playerPose.x + 8, 5, playerPose.z + 8)
      state.camera.lookAt(playerPose.x, 0.6, playerPose.z)
      return
    }

    const pos = rb.translation()
    const rot = rb.rotation()
    _quat.set(rot.x, rot.y, rot.z, rot.w)
    _offset.set(0, 2.6, -6).applyQuaternion(_quat)
    _target.set(pos.x + _offset.x, pos.y + _offset.y, pos.z + _offset.z)
    _look.set(pos.x, pos.y + 0.7, pos.z)

    const alpha = ready.current ? 1 - Math.pow(0.001, dt) : 1
    state.camera.position.lerp(_target, alpha)
    state.camera.lookAt(_look)
    ready.current = true
  })

  return null
}
