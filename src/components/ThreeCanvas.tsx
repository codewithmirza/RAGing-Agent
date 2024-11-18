'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { EffectComposer, Bloom, Glitch, Noise } from '@react-three/postprocessing'
import { Vector2 } from 'three'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// QuantumSphere component
const QuantumSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.1
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime()) * 0.1
    }
  })

  return (
    <Sphere 
      ref={meshRef} 
      args={[1, 64, 64]} 
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshPhongMaterial
        color="#00ffff"
        emissive="#004444"
        shininess={100}
        wireframe={true}
      />
    </Sphere>
  )
}

// DimensionalPortal component
const DimensionalPortal = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, -2]} rotation={[0, Math.PI / 4, 0]}>
      <torusGeometry args={[1, 0.2, 16, 100]} />
      <meshPhongMaterial
        color="#ff00ff"
        emissive="#420042"
        shininess={100}
        wireframe={true}
      />
    </mesh>
  )
}

// Main Canvas component
export default function ThreeCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <QuantumSphere />
      <DimensionalPortal />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Glitch 
          delay={new Vector2(1.5, 3.5)} 
          duration={new Vector2(0.6, 1.0)} 
          strength={new Vector2(0.3, 1.0)} 
        />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  )
} 