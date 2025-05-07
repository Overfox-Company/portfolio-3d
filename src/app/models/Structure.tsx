import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function Structure(props: any) {
    const { scene } = useGLTF('/portfolio.glb')

    useEffect(() => {
        scene.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                (child as THREE.Mesh).castShadow = true as boolean
                (child as THREE.Mesh).receiveShadow = true
            }
        })
    }, [scene])

    return <primitive object={scene} {...props} />
}