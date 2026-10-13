import { useEffect, useMemo } from 'react'
import { BackSide, CanvasTexture, SRGBColorSpace } from 'three'

function makeSkyTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 8
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  // CanvasTexture is flipY; sphere v=0 is +Y, so zenith color lives at the bottom.
  const gradient = ctx.createLinearGradient(0, 256, 0, 0)
  gradient.addColorStop(0, '#241438')
  gradient.addColorStop(0.34, '#8a3d6e')
  gradient.addColorStop(0.52, '#ff7b6a')
  gradient.addColorStop(0.7, '#ffc38a')
  gradient.addColorStop(1, '#f7e0c4')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 8, 256)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function SkyDome() {
  const texture = useMemo(() => makeSkyTexture() ?? undefined, [])

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  return (
    <mesh frustumCulled={false}>
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
