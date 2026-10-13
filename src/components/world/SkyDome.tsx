import { useMemo } from 'react'
import { BackSide, CanvasTexture, SRGBColorSpace } from 'three'

function makeSkyTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 8
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  // CanvasTexture is flipY; sphere v=0 is +Y, so zenith color lives at the bottom.
  const gradient = ctx.createLinearGradient(0, 256, 0, 0)
  gradient.addColorStop(0, '#1b1030')
  gradient.addColorStop(0.38, '#6b2d55')
  gradient.addColorStop(0.55, '#ff6b3d')
  gradient.addColorStop(0.72, '#ffb068')
  gradient.addColorStop(1, '#f0c38a')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 8, 256)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function SkyDome() {
  const texture = useMemo(() => makeSkyTexture() ?? undefined, [])

  return (
    <mesh>
      <sphereGeometry args={[140, 24, 16]} />
      <meshBasicMaterial
        map={texture}
        side={BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}
