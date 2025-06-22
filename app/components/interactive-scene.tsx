"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Environment, Float, Trail, Stars } from "@react-three/drei"
import { Vector3, Color } from "three"
import type * as THREE from "three"
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu"

export default function InteractiveScene() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const orbitGroupRef = useRef<THREE.Group>(null)
  const starGroupRef = useRef<THREE.Group>(null)
  const { mouse, viewport, size } = useThree()
  const [hovered, setHovered] = useState(false)
  const [scaleFactor, setScaleFactor] = useState(1)
  const [isVisible, setIsVisible] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const isReleased = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const dragVelocity = useRef({ x: 0, y: 0 })
  const idleRotation = useRef({ x: 0.005, y: 0.01 })
  const blendFactor = useRef(0)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible")
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y
      dragVelocity.current = { x: dx, y: dy }
      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      isReleased.current = true
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])
  // Calculate responsive scale factor based on screen size
  useEffect(() => {
    const updateScale = () => {
      const width = size.width
      const height = size.height

      // Base scale on the smaller dimension to ensure it fits
      const minDimension = Math.min(width, height)

      // Scale factor based on viewport size
      // For very small screens (mobile), scale down significantly
      if (minDimension < 400) {
        setScaleFactor(0.4)
      } else if (minDimension < 600) {
        setScaleFactor(0.6)
      } else if (minDimension < 800) {
        setScaleFactor(0.8)
      } else {
        setScaleFactor(1)
      }
    }

    updateScale()
  }, [size])

  // Generate random star field with initial properties
  const starData = useMemo(() => {
    const stars = []
    for (let i = 0; i < 150; i++) {
      const radius = 30 + Math.random() * 70
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      stars.push({
        position: [x, y, z],
        baseOpacity: Math.random() * 0.6 + 0.2,
        currentScale: 1,
        targetScale: 1,
        currentOpacity: Math.random() * 0.6 + 0.2,
        targetOpacity: Math.random() * 0.6 + 0.2,
      })
    }
    return stars
  }, [])

  useFrame((state) => {
    if (!isVisible) return 
    if (meshRef.current && groupRef.current && orbitGroupRef.current) {
      // Automatic rotation for main shape

      if (isDragging) {
        // Apply live drag rotation
        meshRef.current.rotation.y += dragVelocity.current.x * 0.002
        meshRef.current.rotation.x += dragVelocity.current.y * 0.002
        blendFactor.current = 0
      } else if (isReleased.current) {
        // Continue rotation with momentum after release
        meshRef.current.rotation.y += dragVelocity.current.x * 0.002
        meshRef.current.rotation.x += dragVelocity.current.y * 0.002

        dragVelocity.current.x *= 0.96
        dragVelocity.current.y *= 0.96

        // Stop when velocity is negligible
        if (
          Math.abs(dragVelocity.current.x) < 1 &&
          Math.abs(dragVelocity.current.y) < 1
        ) {
          isReleased.current = false
        }
        blendFactor.current = 0
      } else {
        // Idle auto-rotation
        blendFactor.current = Math.min(blendFactor.current + 0.05, 1)
        meshRef.current.rotation.x += idleRotation.current.x * blendFactor.current
        meshRef.current.rotation.y += idleRotation.current.y * blendFactor.current
      }
      // Gentle floating animation for the main group
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1

      // Scale on hover with responsive scaling
      const baseScale = 1.2 * scaleFactor
      const targetScale = hovered ? baseScale * 1.1 : baseScale
      meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1)

      // Update orbiting shapes to move like planets with responsive scaling
      orbitingShapes.forEach((shape, index) => {
        // const trailGroup = orbitGroupRef.current!.children[index]
        // const mesh = trailGroup.children[0] as THREE.Mesh
        const mesh = orbitGroupRef.current!.children[index] as THREE.Mesh
        // Calculate orbital position with responsive radius
        const time = state.clock.elapsedTime
        const angle = time * shape.speed + shape.initialAngle
        const responsiveRadius = shape.radius * scaleFactor
        const x = Math.cos(angle) * responsiveRadius
        const z = Math.sin(angle) * responsiveRadius
        const y = shape.height * scaleFactor + Math.sin(time * 0.3 + index) * 0.2 * scaleFactor

        // Update position
        mesh.position.set(x, y, z) //trailGroup

        // Individual rotation
        mesh.rotation.x += 0.01 + index * 0.002
        mesh.rotation.y += 0.008 + index * 0.001

        // Scale the orbiting shapes responsively
        const responsiveScale = shape.scale * scaleFactor
        mesh.scale.setScalar(responsiveScale)

        // Fade in and out based on sine wave
        const fadePhase = time * 0.5 + index * 0.8
        const opacity = (Math.sin(fadePhase) + 1) * 0.3 + 0.2

        if (mesh.material && "opacity" in mesh.material) {
          ;(mesh.material as THREE.MeshStandardMaterial).opacity = opacity
        }
      })

      // Smooth star animations based on mouse proximity
      if (starGroupRef.current) {
        const mousePos = new Vector3((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)

        starGroupRef.current.children.forEach((star, index) => {
          const starMesh = star as THREE.Mesh
          const starInfo = starData[index]

          // Calculate distance to mouse with responsive scaling
          const distance = starMesh.position.distanceTo(mousePos)
          const maxDistance = 20 * scaleFactor

          if (distance < maxDistance) {
            const proximity = 1 - distance / maxDistance
            starInfo.targetScale = (1 + proximity * 1.5) * scaleFactor
            starInfo.targetOpacity = starInfo.baseOpacity + proximity * 0.5
          } else {
            starInfo.targetScale = 1 * scaleFactor
            starInfo.targetOpacity = starInfo.baseOpacity
          }

          // Smooth interpolation to prevent glitching
          const lerpFactor = 0.05
          starInfo.currentScale += (starInfo.targetScale - starInfo.currentScale) * lerpFactor
          starInfo.currentOpacity += (starInfo.targetOpacity - starInfo.currentOpacity) * lerpFactor

          // Apply the smooth values
          starMesh.scale.setScalar(starInfo.currentScale)
          if (starMesh.material && "opacity" in starMesh.material) {
            ;(starMesh.material as THREE.MeshBasicMaterial).opacity = starInfo.currentOpacity
          }
        })
      }
    }
  })

  // Simplified orbiting shapes
  const orbitingShapes = [
    { type: "cube", radius: 4, speed: 0.3, initialAngle: 0, height: 1, scale: 0.3, color: "#3b82f6" },
    { type: "triangle", radius: 5, speed: 0.2, initialAngle: 1.2, height: -0.5, scale: 0.4, color: "#8b5cf6" },
    { type: "diamond", radius: 3.5, speed: 0.4, initialAngle: 2.4, height: 2, scale: 0.25, color: "#06b6d4" },
    { type: "cube", radius: 6, speed: 0.15, initialAngle: 3.6, height: -1.5, scale: 0.2, color: "#f59e0b" },
    { type: "triangle", radius: 4.5, speed: 0.25, initialAngle: 4.8, height: 0.8, scale: 0.35, color: "#ef4444" },
    { type: "diamond", radius: 3, speed: 0.5, initialAngle: 0.6, height: -2, scale: 0.3, color: "#10b981" },
    { type: "cube", radius: 5.5, speed: 0.18, initialAngle: 1.8, height: 1.5, scale: 0.2, color: "#f97316" },
    { type: "triangle", radius: 2.5, speed: 0.6, initialAngle: 3, height: 0, scale: 0.15, color: "#a855f7" },
  ]

  const renderSimpleShape = (type: string) => {
    switch (type) {
      case "cube":
        return <boxGeometry args={[1, 1, 1]} />
      case "triangle":
        return <tetrahedronGeometry args={[1]} />
      case "diamond":
        return <octahedronGeometry args={[1]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />

      {/* Distant stars moving very slowly */}
      <Stars radius={100} depth={50} count={200} factor={3} saturation={0} fade speed={0.1} />

      {/* Interactive custom star dots */}
      <group ref={starGroupRef}>
        {starData.map((star, index) => (
          <mesh key={index} position={star.position}>
            <sphereGeometry args={[0.15 * scaleFactor, 6, 6]} />
            <meshBasicMaterial color="white" transparent opacity={star.baseOpacity} />
          </mesh>
        ))}
      </group>

      {/* Main shape - simple wireframe sphere */}
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
            <mesh
              ref={meshRef}
              onPointerEnter={() => {setHovered(true); document.body.style.cursor = "grab"}}
              onPointerLeave={() => {setHovered(false); document.body.style.cursor = "default"}}
              onPointerDown={(e) => {
                e.stopPropagation()
                document.body.style.cursor = "grabbing"
                setIsDragging(true)
                lastMousePos.current = { x: e.clientX, y: e.clientY }
              }}
              onPointerUp={() => {
                document.body.style.cursor = "grab"
              }}
            >
            <sphereGeometry args={[1.5, 8, 6]} />
            <meshStandardMaterial color={hovered ? "#8b5cf6" : "#3b82f6"} wireframe transparent opacity={0.8} />
          </mesh>
        </Float>
      </group>

      {/* Orbiting simple shapes with trails */}
      <group ref={orbitGroupRef}>
        {orbitingShapes.map((shape, i) => (
          // <Trail key={i} width={0.3 * scaleFactor} length={6} color={new Color("white")} attenuation={(width) => width}>
            <mesh key={i}>
              {renderSimpleShape(shape.type)}
              <meshStandardMaterial color={shape.color} wireframe transparent opacity={0.6} />
            </mesh>
          // </Trail>
        ))}
      </group>
    </>
  )
}
