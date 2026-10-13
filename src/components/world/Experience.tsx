import { Physics } from '@react-three/rapier'
import type { Quality } from '../../lib/quality'
import { Bounds, Ground } from './Ground'
import { Landscape } from './Landscape'
import { Lights } from './Lights'
import { PlayfulObjects } from './PlayfulObjects'
import { SkyDome } from './SkyDome'
import { Stands } from './Stands'
import { Car } from './Car'
import { FollowCamera } from './FollowCamera'

export function Experience({ quality }: { quality: Quality }) {
  return (
    <>
      <SkyDome />
      <Lights quality={quality} />
      <FollowCamera />
      <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} interpolate>
        <Ground />
        <Bounds />
        <Landscape quality={quality} />
        <Stands />
        <PlayfulObjects quality={quality} />
        <Car />
      </Physics>
    </>
  )
}
