'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, MeshDistortMaterial, GradientTexture, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom, Glitch, Noise } from '@react-three/postprocessing'
import { Vector2 } from 'three'

// Simulated AI response generation
const generateAIResponse = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return `Multiversal wisdom on: "${query}"`
}

// 3D Quantum Sphere component
const QuantumSphere = () => {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.1
      meshRef.current.rotation.y = Math.cos(state.clock.getElapsedTime()) * 0.1
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}>
      <MeshDistortMaterial
        color="#00ffff"
        attach="material"
        distort={0.3}
        speed={4}
        roughness={0}
      >
        <GradientTexture
          stops={[0, 0.5, 1]}
          colors={['#00ffff', '#ff00ff', '#ffff00']}
        />
      </MeshDistortMaterial>
    </Sphere>
  )
}

// Dimensional Portal component
const DimensionalPortal = () => {
  const portalRef = useRef<THREE.Mesh | null>(null)

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z += 0.01
    }
  })

  return (
    <mesh ref={portalRef} position={[0, 0, -5]}>
      <torusGeometry args={[9, 2, 16, 100]} />
      <meshPhongMaterial color="#ff00ff" emissive="#ff00ff" />
    </mesh>
  )
}

// Main component
export default function RAGingAgentExtreme() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const controls = useAnimation()
  const y = useMotionValue(0)
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0])
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsLoading(true)
      const aiResponse = await generateAIResponse(query)
      setResponse(aiResponse)
      setIsLoading(false)
      controls.start({ scale: [1.2, 1], transition: { duration: 0.3 } })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 3D Background */}
      <div className="fixed inset-0">
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
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <motion.h1
          className="text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          RAGing Agent
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-8 py-6 bg-transparent border-2 border-cyan-300 rounded-full text-2xl text-white placeholder-cyan-200 focus:outline-none focus:border-cyan-400 transition duration-300"
              placeholder="Inquire across the multiverse..."
              style={{ backdropFilter: 'blur(10px)' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-30"
              initial={false}
              animate={controls}
            />
          </div>
        </motion.form>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="mt-12 p-8 bg-black bg-opacity-50 rounded-3xl backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-4">
                <div className="w-6 h-6 bg-cyan-400 rounded-full animate-ping" />
                <div className="w-6 h-6 bg-purple-400 rounded-full animate-pulse" />
                <div className="w-6 h-6 bg-pink-400 rounded-full animate-bounce" />
              </div>
              <p className="mt-6 text-center text-xl text-cyan-200">Traversing the multiverse for wisdom...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {response && !isLoading && (
            <motion.div
              className="mt-12 p-8 bg-black bg-opacity-50 rounded-3xl backdrop-blur-xl max-w-4xl w-full"
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                Multiversal Wisdom:
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">{response}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating action buttons */}
        <div className="fixed bottom-12 right-12 flex flex-col space-y-6">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -180 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.button>
        </div>

        {/* Quantum particles effect */}
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                x: [Math.random() * dimensions.width, Math.random() * dimensions.width],
                y: [Math.random() * dimensions.height, Math.random() * dimensions.height],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
