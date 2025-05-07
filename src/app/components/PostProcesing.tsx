import { EffectComposer, Bloom, Vignette, SSAO } from '@react-three/postprocessing'
import { Color } from 'three'

export default function ProfilePostProcessing() {
    return (
        <EffectComposer //enableNormalPass
        >
            <Bloom intensity={0.1} luminanceThreshold={0.2} />
            <Vignette eskil={false} offset={0.1} darkness={0.2} />

        </EffectComposer>
    )
}