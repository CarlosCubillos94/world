export type Quality = {
  isMobile: boolean
  isTouch: boolean
  dpr: [number, number]
  shadows: boolean
  cactusCount: number
  rockCount: number
  flowerCount: number
  physicsCount: number
  shadowMapSize: number
}

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') || canvas.getContext('webgl'),
    )
  } catch {
    return false
  }
}

export function getQuality(): Quality {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTouch: false,
      dpr: [1, 1.75],
      shadows: true,
      cactusCount: 40,
      rockCount: 18,
      flowerCount: 420,
      physicsCount: 8,
      shadowMapSize: 1024,
    }
  }

  const ua = navigator.userAgent
  const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ||
    (isTouch && window.innerWidth < 960)

  return {
    isMobile,
    isTouch,
    dpr: isMobile ? [1, 1.25] : [1, 1.75],
    shadows: !isMobile,
    cactusCount: isMobile ? 22 : 42,
    rockCount: isMobile ? 10 : 20,
    flowerCount: isMobile ? 180 : 460,
    physicsCount: isMobile ? 4 : 8,
    shadowMapSize: isMobile ? 512 : 1024,
  }
}
