import { EffectComposer, Bloom, Vignette, SSAO } from '@react-three/postprocessing'
import { Color } from 'three'

export default function ProfilePostProcessing() {
    return (
        <EffectComposer //enableNormalPass
        >

            <Vignette eskil={false} offset={.01} darkness={0.5} />

        </EffectComposer>
    )
}