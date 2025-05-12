import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function Structure(props: any) {
    const { scene: livingRoomStructure } = useGLTF('/Living_room/structure/living_room_structure.gltf')
    const { scene: guitar } = useGLTF('/Living_room/forniture/guitar/guitar.gltf')
    const { scene: darkmarble } = useGLTF('/Living_room/forniture/Mueble_negro/nuevo/mueble_negro.gltf')
    const { scene: darkstante } = useGLTF('/Living_room/forniture/estante_negro/estante_negro.gltf')
    useEffect(() => {

        darkstante.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).castShadow = true as boolean
                (child as THREE.Mesh).receiveShadow = true
            }
        }
        )

        darkmarble.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).castShadow = true as boolean
                (child as THREE.Mesh).receiveShadow = true
            }
        }
        )

        guitar.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).castShadow = true as boolean
                (child as THREE.Mesh).receiveShadow = true
            }
        }
        )

        livingRoomStructure.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).castShadow = true as boolean
                (child as THREE.Mesh).receiveShadow = true
            }
        })
    }, [livingRoomStructure, guitar, darkmarble, darkstante])

    return (
        <>
            <primitive object={livingRoomStructure} {...props} />
            <primitive object={guitar} {...props} />
            <primitive object={darkmarble} {...props} />
            <primitive object={darkstante} {...props} />
            {/* <primitive object={livingRoomStructure} {...props} /> */}
            {/* <primitive object={guitar} {...props} /> */}
            {/* <primitive object={darkmarble} {...props} /> */}
        </>
    )
    // <primitive object={livingRoomStructure} {...props} />
}