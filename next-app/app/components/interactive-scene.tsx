"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Trail, Stars } from "@react-three/drei";
import { Vector3, Color, MathUtils } from "three";
import type * as THREE from "three";

export default function InteractiveScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const { mouse, size } = useThree();
  const [hovered, setHovered] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isDraggingMain, setisDraggingMain] = useState(false);
  const [isDraggingOrbit, setisDraggingOrbit] = useState(false);
  const isMainReleased = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const idleRotation = useRef({ x: 0.005, y: 0.01 });
  const blendFactor = useRef(0);
  const manualElapsed = useRef(0);
  const lastFrame = useRef<number | null>(null);
  const [hoverOrbitIndex, setHoverOrbitIndex] = useState<number | null>(null);
  const draggedOrbitIndex = useRef<number | null>(null);
  const globalLerp = useRef(0.03);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      dragVelocity.current = { x: dx, y: dy };
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      if (draggedOrbitIndex.current !== null) {
        orbitingShapes[draggedOrbitIndex.current].isDragged = false;
        draggedOrbitIndex.current = null;
        setisDraggingOrbit(false);
      }else{
        setisDraggingMain(false);
        isMainReleased.current = true;
      }
    };

    if (isDraggingMain || isDraggingOrbit) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingMain, isDraggingOrbit]);
  // Calculate responsive scale factor based on screen size
  useEffect(() => {
    const updateScale = () => {
      const width = size.width;
      const height = size.height;

      // Base scale on the smaller dimension to ensure it fits
      const minDimension = Math.min(width, height);

      // Scale factor based on viewport size
      // For very small screens (mobile), scale down significantly
      if (minDimension < 400) {
        setScaleFactor(0.4);
      } else if (minDimension < 600) {
        setScaleFactor(0.6);
      } else if (minDimension < 800) {
        setScaleFactor(0.8);
      } else {
        setScaleFactor(1);
      }
    };

    updateScale();
  }, [size]);

  function getMouseWorldPosition(
    mouse: { x: number; y: number },
    camera: THREE.Camera,
    z: number
  ): THREE.Vector3 {
    // Step 1: Create a normalized device coordinate (NDC) vector at z = 0
    const ndc = new Vector3(mouse.x, mouse.y, 0.5); // z=0.5 is halfway into the frustum

    // Step 2: Unproject into world space (this gives a point on the ray)
    const worldDirection = ndc.clone().unproject(camera);

    // Step 3: Get ray direction from camera to unprojected point
    const rayOrigin = camera.position.clone();
    const rayDir = worldDirection.clone().sub(rayOrigin).normalize();

    // Step 4: Solve for intersection with plane at z = target depth
    const t = (z - rayOrigin.z) / rayDir.z;
    return rayOrigin.clone().add(rayDir.multiplyScalar(t));
  }
  useFrame((state) => {
    const now = performance.now();
    if (!isVisible){
      lastFrame.current = null;
      return;
    }
    if (lastFrame.current === null) {
      lastFrame.current = now;
      return;
    }
    const delta = (now - lastFrame.current) / 1000;
    const camera = state.camera;
    lastFrame.current = now;
    manualElapsed.current += delta;
    
    if (meshRef.current && groupRef.current && orbitGroupRef.current) {
      // Automatic rotation for main shape

      if (isDraggingMain) {
        // Apply live drag rotation
        meshRef.current.rotation.y += dragVelocity.current.x * 0.002;
        meshRef.current.rotation.x += dragVelocity.current.y * 0.002;
        blendFactor.current = 0;
      } else if (isMainReleased.current) {
        // Continue rotation with momentum after release
        meshRef.current.rotation.y += dragVelocity.current.x * 0.002;
        meshRef.current.rotation.x += dragVelocity.current.y * 0.002;

        dragVelocity.current.x *= 0.96;
        dragVelocity.current.y *= 0.96;

        // Stop when velocity is negligible
        if (
          Math.abs(dragVelocity.current.x) < 1 &&
          Math.abs(dragVelocity.current.y) < 1
        ) {
          isMainReleased.current = false;
        }
        blendFactor.current = 0;
      } else {
        // Idle auto-rotation
        blendFactor.current = Math.min(blendFactor.current + 0.05, 1);
        meshRef.current.rotation.x +=
          idleRotation.current.x * blendFactor.current;
        meshRef.current.rotation.y +=
          idleRotation.current.y * blendFactor.current;
      }
      const time = manualElapsed.current;
      // Gentle floating animation for the main group
      groupRef.current.position.y =
        Math.cos(time * 0.5) * 0.1;

      // Scale on hover with responsive scaling
      const baseScale = 1.2 * scaleFactor;
      const targetScale = hovered ? baseScale * 1.1 : baseScale;
      meshRef.current.scale.lerp(
        new Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
      globalLerp.current = Math.max(globalLerp.current * 0.96, 0.005);
      // Update orbiting shapes to move like planets with responsive scaling
      orbitingShapes.forEach((shape, index) => {
        const trailGroup = orbitGroupRef.current!.children[index];
        const mesh = trailGroup.children[0] as THREE.Mesh;
        if (shape.isDragged) {
          const z = trailGroup.position.z;
          const mouseWorld = getMouseWorldPosition(mouse, camera, z);

          // Move the object in x and y at the same depth
          trailGroup.position.set(mouseWorld.x, mouseWorld.y, z);
          shape.velocity.set(
            dragVelocity.current.x * 0.003,
            dragVelocity.current.y * -0.003,
            0
          );
        } else if (shape.velocity.lengthSq() > 0.0001) {
          
          trailGroup.position.add(shape.velocity);
          shape.velocity.multiplyScalar(0.95);
        }else{
          // Calculate orbital position with responsive radius
          const angle = time * shape.speed + shape.initialAngle;
          // shape.angle += shape.speed * delta;
          const responsiveRadius = shape.radius * scaleFactor;
          const x = Math.cos(angle) * responsiveRadius;
          const z = Math.sin(angle) * responsiveRadius;
          const y =
            shape.height * scaleFactor +
            Math.sin(time * 0.3 + index) * 0.2 * scaleFactor;

          // Update position
          shape.targetPosition.set(x, y, z); //trailGroup
        }
        if (!shape.isDragged && shape.velocity.lengthSq() <= 0.0001) {
          const factor = 1 - Math.pow(1 - globalLerp.current, delta * 60);
          trailGroup.position.lerp(shape.targetPosition, factor);
        }
        // Individual rotation
        mesh.rotation.x += 0.01 + index * 0.002;
        mesh.rotation.y += 0.008 + index * 0.001;

        const targetScale =
          (hoverOrbitIndex === index ? shape.scale * 1.2 : shape.scale) * scaleFactor;
        shape.currentScale = MathUtils.lerp(shape.currentScale, targetScale, 0.1);
        mesh.scale.setScalar(shape.currentScale);
      });
    }
  });

function generateRandomShape() {
  const shapeTypes = [
  "cube", "triangle", "diamond", 
];
  const colors = [
    "#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b",
    "#f87171", "#10b981", "#f97316", "#a855f7"
  ];

  return {
    type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    radius: +(Math.random() * 3 + 2.5).toFixed(2), // 2 - 5
    speed: +(Math.random() * 0.3 + 0.1).toFixed(3), // 0.1 - 0.3
    initialAngle: +(Math.random() * Math.PI * 3).toFixed(3), // 0 - 2π
    height: +(Math.random() * 4 - 2).toFixed(2), // -2 to 2
    scale: +(Math.random() * 0.25 + 0.15).toFixed(3), // 0.15 - 0.4
    color: colors[Math.floor(Math.random() * colors.length)],
    isDragged: false,
    velocity: new Vector3(),
    targetPosition: new Vector3(),
    angle: 0,
  };
}
const initialShapes = [
  {
    type: "cube",
    radius: 4,
    speed: 0.3,
    initialAngle: 0,
    height: 1,
    scale: 0.3,
    color: "#3b82f6",
  },
  {
    type: "diamond",
    radius: 3.5,
    speed: 0.4,
    initialAngle: 2.4,
    height: 2,
    scale: 0.25,
    color: "#06b6d4",
  },
  {
    type: "cube",
    radius: 6,
    speed: 0.15,
    initialAngle: 3.6,
    height: -1.5,
    scale: 0.2,
    color: "#f59e0b",
  },
  {
    type: "triangle",
    radius: 4.5,
    speed: 0.25,
    initialAngle: 4.8,
    height: 0.8,
    scale: 0.35,
    color: "#f87171",
  },
  {
    type: "diamond",
    radius: 3,
    speed: 0.5,
    initialAngle: 0.6,
    height: -2,
    scale: 0.3,
    color: "#10b981",
  },
  {
    type: "triangle",
    radius: 2.5,
    speed: 0.6,
    initialAngle: 3,
    height: 0,
    scale: 0.15,
    color: "#a855f7",
  }]
  const displayShapes = useMemo(() => {
    const base = [...initialShapes];
    for (let i = 0; i < 3; i++) base.push(generateRandomShape());
    return base;
  }, []);
  const orbitingShapes = useRef(displayShapes.map((shape) => ({
    ...shape,
    isDragged: false,
    velocity: new Vector3(),
    position: new Vector3(),
    targetPosition: new Vector3(),
    currentScale: shape.scale
  }))).current;

const renderSimpleShape = (type: string) => {
  switch (type) {
    case "cube":
      return <boxGeometry args={[1, 1, 1]} />;
    case "triangle":
      return <tetrahedronGeometry args={[1]} />;
    case "diamond":
      return <octahedronGeometry args={[1]} />;
    default:
      return <boxGeometry args={[1, 1, 1]} />;
  }
};
function lightenColor(hex: string, percent: number): string {
  const amt = Math.round(255 * percent);
  return (
    "#" +
    hex
      .replace(/^#/, "")
      .match(/.{2}/g)!
      .map((c) =>
        Math.min(255, parseInt(c, 16) + amt).toString(16).padStart(2, "0")
      )
      .join("")
  );
}

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />

      {/* Main shape - simple wireframe sphere */}
      <group ref={groupRef}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
          <mesh
            ref={meshRef}
            onPointerEnter={() => {
              setHovered(true);
              document.body.style.cursor = "grab";
            }}
            onPointerLeave={() => {
              setHovered(false);
              document.body.style.cursor = "default";
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "grabbing";
              setisDraggingMain(true);
              lastMousePos.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={() => {
              document.body.style.cursor = "grab";
            }}
          >
            <sphereGeometry args={[1.5, 7, 5]} />
            <meshStandardMaterial
              color={hovered ? "#3b82f6" : "#8b5cf6"}
              emissive={hovered ? "#3b82f6" : "#8b5cf6"}
              emissiveIntensity={0.05}
              wireframe
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      </group>

      {/* Orbiting simple shapes with trails */}
      <group ref={orbitGroupRef}>
        {orbitingShapes.map((shape, i) => (
          <group key={i}>
            <Trail
              width={0.3 * scaleFactor}
              length={8}
              color={new Color("white").convertSRGBToLinear().multiplyScalar(0.15)}
              attenuation={(width) => width}
            >
              <mesh
                onPointerEnter={() => {
                  document.body.style.cursor = "grab";
                  setHoverOrbitIndex(i);
                }}
                onPointerLeave={() => {
                  document.body.style.cursor = "default";
                  setHoverOrbitIndex(null);
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = "grabbing";
                  lastMousePos.current = { x: e.clientX, y: e.clientY };
                  orbitingShapes[i].isDragged = true;
                  draggedOrbitIndex.current = i;
                  setisDraggingOrbit(true);
                }}
                onPointerUp={() => {
                  document.body.style.cursor = "grab";
                  orbitingShapes[i].isDragged = false;
                }}
              >
                {renderSimpleShape(shape.type)}
                <meshStandardMaterial
                  wireframe
                  transparent
                  opacity={0.6}
                  color={
                    hoverOrbitIndex === i
                      ? lightenColor(shape.color, 0.2)
                      : shape.color
                  }
                />
              </mesh>
            </Trail>
          </group>
        ))}
      </group>

    </>
  );
}
