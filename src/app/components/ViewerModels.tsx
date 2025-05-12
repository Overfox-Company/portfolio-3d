'use client'
import { NextPage } from 'next'
import * as THREE from 'three'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { Canvas, applyProps, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor, AccumulativeShadows, RandomizedLight, Environment, Lightformer, Float, useGLTF, CameraControls, OrbitControls } from '@react-three/drei'
import { LayerMaterial, Color, Depth } from 'lamina'
import FPSCameraController from './FPSController'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import Structure from '../models/Structure'

interface Props { }

const Cube = () => {
    const [ref] = useBox(() => ({
        mass: 1,
        position: [0, 5, 0], // Empieza en el aire para que caiga
        args: [2, 2, 2],
    }))
    return (
        <mesh ref={ref} castShadow receiveShadow>
            <boxGeometry args={[200, 200, 200]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    )
}

const Ground = () => {
    const [ref] = usePlane(() => ({
        position: [0, -2, 0],
        rotation: [-Math.PI / 2, 0, 0],
        userData: { ground: true }
    }))
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#888" />
        </mesh>
    )
}

const ViewerModels: NextPage<Props> = ({ }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [degraded, degrade] = useState(false)
    return (
        <Canvas
            shadows={{ type: THREE.PCFSoftShadowMap }}
            dpr={[1, 2]}
            camera={{ position: [0, 2, 10], fov: 75 }}
        >
            <Environment
                files={[
                    '/sky/Cold_Sunset__Cam_2_Left+X.png',  // +x
                    '/sky/Cold_Sunset__Cam_3_Right-X.png', // -x
                    '/sky/Cold_Sunset__Cam_4_Up+Y.png',    // +y
                    '/sky/Cold_Sunset__Cam_5_Down-Y.png',  // -y
                    '/sky/Cold_Sunset__Cam_0_Front+Z.png', // +z
                    '/sky/Cold_Sunset__Cam_1_Back-Z.png',  // -z
                ]}
                background
            />
            {/* Sombras acumulativas */}

            <directionalLight
                rotation={[50, 1, 10]}
                position={[100, 100, 100]}
                intensity={0}
                color="rgb(231, 145, 32)"
                castShadow


                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.000005}
            />
            <ambientLight
                intensity={0.5}


                color={"rgb(161, 57, 57)"}
            />
            <FPSCameraController />


            <Structure scale={[0.5, 0.5, 0.5]} position={[1, -0.2, 8]} />
        </Canvas>
    )
}

export default ViewerModels

