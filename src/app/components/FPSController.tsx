import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from 'three'
import ProfilePostProcessing from "./PostProcesing"
export function isDedicatedGPU() {
    const canvas = document.createElement('canvas')
    const gl: any = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return false

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (!debugInfo) return false

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    if (!renderer) return false

    const r = renderer.toLowerCase()

    // Detectar Intel Arc (dedicada)
    const isIntelArc = r.includes('intel') && r.includes('arc')

    // NVIDIA siempre es dedicada
    const isNVIDIA = r.includes('nvidia') || r.includes('geforce')

    // AMD dedicada si tiene número (ej. RX 6600)
    const isAMDWithModel = r.includes('radeon') && /\d{3,4}/.test(r)

    // Integradas típicas
    const isIntelIntegrated = r.includes('intel') && !r.includes('arc')
    const isAMDIntegrated = r.includes('radeon') && !/\d{3,4}/.test(r)
    const isMicrosoftBasic = r.includes('microsoft basic') || r.includes('swiftshader')

    const isIntegrated = isIntelIntegrated || isAMDIntegrated || isMicrosoftBasic

    return !isIntegrated && (isNVIDIA || isAMDWithModel || isIntelArc)
}


interface FPSCameraControllerProps {
    cameraHeight?: number // altura de la cámara en metros
    groundTag?: string    // nombre del parámetro para identificar el suelo
    fov?: number         // field of view de la cámara
}

export default function FPSCameraController({

    cameraHeight = 2,
    groundTag = "ground",
    fov = 50
}: FPSCameraControllerProps) {
    const { camera, gl, scene } = useThree()
    const velocity = useRef([0, 0, 0])
    const direction = useRef([0, 0, 0])
    const move = useRef({ w: false, a: false, s: false, d: false })
    const pitch = useRef(0)
    const yaw = useRef(0)
    const targetPitch = useRef(0)
    const targetYaw = useRef(0)
    const isPointerLocked = useRef(false)
    const targetPosition = useRef(camera.position.clone())

    // Aplica el FOV si cambia
    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = fov
            camera.updateProjectionMatrix()
        }
    }, [camera, fov])

    useEffect(() => {
        yaw.current = camera.rotation.y
        pitch.current = camera.rotation.x
        targetYaw.current = camera.rotation.y
        targetPitch.current = camera.rotation.x
        targetPosition.current = camera.position.clone()
    }, [camera])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'KeyW') move.current.w = true
            if (e.code === 'KeyA') move.current.a = true
            if (e.code === 'KeyS') move.current.s = true
            if (e.code === 'KeyD') move.current.d = true
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'KeyW') move.current.w = false
            if (e.code === 'KeyA') move.current.a = false
            if (e.code === 'KeyS') move.current.s = false
            if (e.code === 'KeyD') move.current.d = false
        }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [camera])

    useEffect(() => {
        const handlePointerLockChange = () => {
            isPointerLocked.current = document.pointerLockElement === gl.domElement
        }
        document.addEventListener('pointerlockchange', handlePointerLockChange)
        return () => document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }, [gl])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isPointerLocked.current) return
            const sensitivity = 0.002
            targetYaw.current -= e.movementX * sensitivity
            targetPitch.current -= e.movementY * sensitivity
            targetPitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, targetPitch.current))
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {


        const handleClick = () => {
            gl.domElement.requestPointerLock()
        }
        gl.domElement.addEventListener('click', handleClick)
        return () => gl.domElement.removeEventListener('click', handleClick)
    }, [gl])

    let lastFrameTime = 0

    useFrame((_, delta) => {
        const now = performance.now()
        // Limita a 60 FPS (aprox 16.67ms por frame)
        if (now - lastFrameTime < 1000 / 60) {
            return
        }
        lastFrameTime = now

        // Aplica la rotación directamente (sin interpolar)
        camera.rotation.order = 'YXZ'
        camera.rotation.y = targetYaw.current
        camera.rotation.x = targetPitch.current

        // Dirección de movimiento
        direction.current = [0, 0, 0]
        if (move.current.w) direction.current[2] += 1
        if (move.current.s) direction.current[2] -= 1
        if (move.current.a) direction.current[0] -= 1
        if (move.current.d) direction.current[0] += 1

        // Normaliza la dirección
        const len = Math.hypot(...direction.current)
        let moveVec = new THREE.Vector3()
        if (len > 0) {
            direction.current = direction.current.map((v) => v / len)
            const forward = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation)
            forward.y = 0
            forward.normalize()
            const right = new THREE.Vector3(1, 0, 0).applyEuler(camera.rotation)
            right.y = 0
            right.normalize()
            moveVec.add(forward.multiplyScalar(direction.current[2]))
            moveVec.add(right.multiplyScalar(direction.current[0]))
            moveVec.normalize()
        }

        // Velocidad
        const speed = 5
        let nextPosition = targetPosition.current.clone()
        if (len > 0) {
            nextPosition.add(moveVec.clone().multiplyScalar(speed * delta))

            // --- Colisión frontal ---
            // Raycast en la dirección de movimiento
            const collisionRay = new THREE.Raycaster(
                targetPosition.current.clone(),
                moveVec.clone().normalize(),
                0,
                0.6 // radio de colisión (ajusta según el tamaño del "jugador")
            )
            const collisionIntersects = collisionRay.intersectObjects(scene.children, true)
            let blocked = false
            for (const i of collisionIntersects) {
                // Ignora el suelo
                if (i.object.userData && i.object.userData[groundTag]) continue
                // Si hay colisión, bloquea el movimiento
                if (i.distance < 0.6) {
                    blocked = true
                    break
                }
            }
            if (!blocked) {
                targetPosition.current.copy(nextPosition)
            }
            // Si está bloqueado, no actualiza la posición
        }

        // --- Detección de suelo ---
        // Raycast hacia abajo desde la posición objetivo
        const raycaster = new THREE.Raycaster()
        const rayOrigin = targetPosition.current.clone()
        rayOrigin.y += 1 // para evitar autointersección
        raycaster.set(rayOrigin, new THREE.Vector3(0, -1, 0))
        const intersects = raycaster.intersectObjects(scene.children, true)
        let groundY = null
        for (const i of intersects) {
            // Busca un objeto con userData[groundTag] === true
            if (i.object.userData && i.object.userData[groundTag]) {
                groundY = i.point.y
                break
            }
        }
        if (groundY !== null) {
            targetPosition.current.y = groundY + cameraHeight
        }

        // Interpolación suave de la posición
        camera.position.lerp(targetPosition.current, 0.25)
    })

    return isDedicatedGPU() ? <ProfilePostProcessing /> : null

}
