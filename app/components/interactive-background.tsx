"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Color } from "three"
import type * as THREE from "three"

interface FloatingShape {
  position: Vector3
  rotation: Vector3
  scale: number
  baseScale: number
  velocity: Vector3
  color: Color
  geometry: "box" | "sphere" | "octahedron" | "torus"
}

export default function InteractiveBackground() {
  const { viewport, mouse } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const [mouseVelocity, setMouseVelocity] = useState(0)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Create floating shapes
  const shapes = useMemo(() => {
    const shapeArray: FloatingShape[] = []
    const geometries: FloatingShape["geometry"][] = ["box", "sphere", "octahedron", "torus"]

    for (let i = 0; i < 20; i++) {
      shapeArray.push({
        position: new Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10),
        rotation: new Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: 0.5 + Math.random() * 0.5,
        baseScale: 0.5 + Math.random() * 0.5,
        velocity: new Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.01),
        color: new Color().setHSL(Math.random(), 0.7, 0.6),
        geometry: geometries[Math.floor(Math.random() * geometries.length)],
      })
    }
    return shapeArray
  }, [])

  // Track mouse velocity
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - lastMousePos.current.x
      const deltaY = event.clientY - lastMousePos.current.y
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      setMouseVelocity(velocity)
      lastMousePos.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, index) => {
      const shape = shapes[index]

      // Base floating animation
      child.position.x = shape.position.x + Math.sin(time + index) * 0.5
      child.position.y = shape.position.y + Math.cos(time + index * 0.5) * 0.3
      child.position.z = shape.position.z + Math.sin(time * 0.5 + index) * 0.2

      // Rotation
      child.rotation.x += shape.velocity.x
      child.rotation.y += shape.velocity.y
      child.rotation.z += shape.velocity.z

      // Mouse interaction
      const distance = child.position.distanceTo(
        new Vector3((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0),
      )

      // Scale based on mouse proximity and velocity
      const proximityScale = Math.max(0.5, 2 - distance / 3)
      const velocityScale = 1 + mouseVelocity * 0.01
      child.scale.setScalar(shape.baseScale * proximityScale * velocityScale)

      // "Throw" effect based on mouse velocity
      if (mouseVelocity > 50 && distance < 3) {
        const direction = child.position
          .clone()
          .sub(new Vector3((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0))
          .normalize()
        child.position.add(direction.multiplyScalar(mouseVelocity * 0.001))
      }
    })

    // Decay mouse velocity
    setMouseVelocity((prev) => prev * 0.95)
  })

  const renderGeometry = (geometry: FloatingShape["geometry"]) => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />
      case "sphere":
        return <sphereGeometry args={[0.5, 16, 16]} />
      case "octahedron":
        return <octahedronGeometry args={[0.5]} />
      case "torus":
        return <torusGeometry args={[0.3, 0.2, 8, 16]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />

      <group ref={groupRef}>
        {shapes.map((shape, index) => (
          <mesh key={index} position={shape.position}>
            {renderGeometry(shape.geometry)}
            <meshStandardMaterial
              color={shape.color}
              transparent
              opacity={0.7}
              emissive={shape.color}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
    </>
  )
}
