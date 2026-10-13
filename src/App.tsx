import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { Experience } from './components/world/Experience'
import { Hud } from './components/ui/Hud'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { SimpleView } from './components/ui/SimpleView'
import { bindKeyboard } from './lib/input'
import { detectWebGL, getQuality } from './lib/quality'
import { gameStore, useGame } from './state/game'

export default function App() {
  const simple = useGame((s) => s.simple)
  const entered = useGame((s) => s.entered)
  const quality = useMemo(() => getQuality(), [])

  useEffect(() => bindKeyboard(), [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const webgl = detectWebGL()
    gameStore.set({ webgl })
    if (params.get('simple') === '1' || !webgl) {
      gameStore.set({ simple: true })
    }
    if (params.get('enter') === '1' && webgl) {
      gameStore.set({ entered: true, muted: true })
    }
  }, [])

  if (simple) return <SimpleView />

  return (
    <div className="app">
      <Canvas
        frameloop="always"
        dpr={quality.dpr}
        shadows={quality.shadows ? 'soft' : false}
        gl={{
          antialias: !quality.isMobile,
          powerPreference: 'high-performance',
          stencil: false,
          alpha: false,
          preserveDrawingBuffer: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          outputColorSpace: SRGBColorSpace,
        }}
        camera={{ fov: 48, near: 0.1, far: 200, position: [12, 5.2, 12] }}
        onCreated={({ gl }) => {
          gl.setClearColor('#f0b080')
        }}
      >
        <Suspense fallback={null}>
          <Experience quality={quality} />
        </Suspense>
      </Canvas>
      {!entered && <LoadingScreen />}
      {entered && <Hud quality={quality} />}
    </div>
  )
}
