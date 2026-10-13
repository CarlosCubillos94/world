import { useCallback, useRef } from 'react'
import { setStick } from '../../lib/input'

export function Joystick() {
  const pad = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const pointer = useRef<number | null>(null)

  const move = useCallback((clientX: number, clientY: number) => {
    const el = pad.current
    const k = knob.current
    if (!el || !k) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = clientX - cx
    let dy = clientY - cy
    const max = rect.width / 2 - 18
    const len = Math.hypot(dx, dy)
    if (len > max && len > 0) {
      dx = (dx / len) * max
      dy = (dy / len) * max
    }
    k.style.transform = `translate(${dx}px, ${dy}px)`
    setStick(dx / max, dy / max, true)
  }, [])

  const end = useCallback(() => {
    pointer.current = null
    if (knob.current) knob.current.style.transform = 'translate(0px, 0px)'
    setStick(0, 0, false)
  }, [])

  return (
    <div className="joystick-wrap" aria-hidden="true">
      <div
        ref={pad}
        className="joystick"
        onPointerDown={(e) => {
          pointer.current = e.pointerId
          e.currentTarget.setPointerCapture(e.pointerId)
          move(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (pointer.current !== e.pointerId) return
          move(e.clientX, e.clientY)
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div ref={knob} className="joystick-knob" />
      </div>
      <p className="joystick-label">Steer · drive</p>
    </div>
  )
}
