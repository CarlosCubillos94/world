import type { Quality } from '../../lib/quality'

export function Lights({ quality }: { quality: Quality }) {
  return (
    <>
      <color attach="background" args={['#ff8a4c']} />
      <fog attach="fog" args={['#d9896a', 55, 145]} />
      <ambientLight intensity={0.28} color="#ffd7b0" />
      <hemisphereLight args={['#ffb38a', '#6a3e2a', 0.42]} />
      <directionalLight
        position={[-48, 16, -18]}
        intensity={2.05}
        color="#ffb070"
        castShadow={quality.shadows}
        shadow-mapSize-width={quality.shadowMapSize}
        shadow-mapSize-height={quality.shadowMapSize}
        shadow-camera-near={2}
        shadow-camera-far={110}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
        shadow-bias={-0.0008}
      />
      <directionalLight position={[20, 10, 30]} intensity={0.22} color="#6a4c93" />
      <mesh position={[-52, 14, -16]}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial color="#fff3c4" toneMapped={false} />
      </mesh>
    </>
  )
}
