import {
    EffectComposer,
    Bloom,
    Vignette,
    SSAO,
    DepthOfField,
    Noise,
    ChromaticAberration,
    Glitch,
    HueSaturation,
    ToneMapping,
    LUT,
    Scanline,
    DotScreen,
    GodRays
} from '@react-three/postprocessing'

import { Vector2, Color } from 'three'

export default function ProfilePostProcessing({ }) {
    return (
        <EffectComposer enableNormalPass>





            {/* Depth of Field */}
            <DepthOfField focusDistance={0.015} focalLength={.035} bokehScale={2} height={640} />

            {/* Vignette */}
            <Vignette eskil={false} offset={0.01} darkness={0.5} />

            {/* Noise */}
            <Noise opacity={0.02} />

            {/* Chromatic Aberration
            <ChromaticAberration
                radialModulation={true}
                offset={new Vector2(0.001, 0.001)}
            />
 */}


            {/* Hue and Saturation */}
            <HueSaturation

                hue={-0.01} saturation={0.1} />

            {/* Tone Mapping */}
            <ToneMapping />

            {/* LUT (Lookup Table color grading, necesita archivo .CUBE o similar) */}
            {/* <LUT lut={yourLUTTexture} /> */}

            {/* Scanline 
            <Scanline density={1.25} />
*/}
            {/* DotScreen 
            <DotScreen angle={Math.PI * 0.5} scale={1.0} />
*/}
            {/* God Rays (requiere una referencia a una luz o malla que actúe como fuente) */}
            {/*sunRef && <GodRays sun={sunRef} intensity={0.3} decay={0.95} blur={true} />*/}

        </EffectComposer>
    )
}
