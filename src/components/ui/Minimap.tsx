import { useEffect, useRef } from 'react'
import { zones } from '../../data/content'
import { playerPose } from '../../state/game'

const SIZE = 128
const WORLD = 40

export function Minimap() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.fillStyle = 'rgba(42, 21, 16, 0.72)'
      ctx.beginPath()
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 246, 234, 0.35)'
      ctx.lineWidth = 2
      ctx.stroke()

      const to = (x: number, z: number) => [
        SIZE / 2 + (x / WORLD) * (SIZE / 2 - 10),
        SIZE / 2 + (z / WORLD) * (SIZE / 2 - 10),
      ]

      ctx.strokeStyle = 'rgba(196, 138, 88, 0.7)'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(SIZE / 2, SIZE / 2, (16 / WORLD) * (SIZE / 2 - 10), 0, Math.PI * 2)
      ctx.stroke()

      for (const zone of zones) {
        const [px, pz] = to(zone.position[0], zone.position[2])
        ctx.fillStyle = zone.accent
        ctx.beginPath()
        ctx.arc(px, pz, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      const [cx, cz] = to(playerPose.x, playerPose.z)
      ctx.save()
      ctx.translate(cx, cz)
      ctx.rotate(playerPose.angle)
      ctx.fillStyle = '#fff6ea'
      ctx.beginPath()
      ctx.moveTo(0, 7)
      ctx.lineTo(4, -5)
      ctx.lineTo(-4, -5)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="minimap">
      <canvas ref={canvas} width={SIZE} height={SIZE} />
    </div>
  )
}
