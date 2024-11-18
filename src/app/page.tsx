'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamically import Three.js components with no SSR
const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), { ssr: false })

// Add this component for initial loading
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <motion.div
      className="flex flex-col items-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex space-x-4">
        <motion.div 
          className="w-8 h-8 bg-cyan-400 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div 
          className="w-8 h-8 bg-purple-400 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div 
          className="w-8 h-8 bg-pink-400 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
      <p className="text-cyan-200 text-xl">Initializing Multiversal Interface...</p>
    </motion.div>
  </div>
);

// Main component
export default function RAGingAgentExtreme() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const controls = useAnimation()
  const y = useMotionValue(0)
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0])
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 })
  const [isInitialized, setIsInitialized] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
      setShowCanvas(true)
      setIsInitialized(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
      } else {
        setResponse('Error: ' + (data.error || 'Failed to get response'));
      }
    } catch (error) {
      setResponse('Error: Failed to connect to server');
    }
    setIsLoading(false);
  };

  if (!isInitialized) {
    return <LoadingScreen />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 3D Background */}
      {showCanvas && (
        <div className="fixed inset-0">
          <ThreeCanvas />
        </div>
      )}

      {/* Main content - Added pt-20 for top padding and min-h-[120vh] for more space */}
      <div className="relative z-10 min-h-[120vh] flex flex-col items-center pt-20 p-8">
        <motion.h1
          className="text-7xl font-bold mb-24 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ 
            paddingBottom: '0.5em',  // Extra padding at bottom
            lineHeight: '1.2',       // Increased line height
            textShadow: '0 0 30px rgba(0,0,0,0.5)'  // Optional: adds depth
          }}
        >
          RAGing Agent
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mt-8"  // Added mt-8 for spacing
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-8 py-6 bg-black/30 border-2 border-cyan-300 rounded-full text-2xl text-white placeholder-cyan-200 focus:outline-none focus:border-cyan-400 transition duration-300"
              placeholder="Ask about EU statistics (GDP, unemployment, inflation...)"
              style={{ backdropFilter: 'blur(10px)' }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <motion.button
                type="submit"
                className="min-w-[120px] px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                <span className="truncate">
                  {isLoading ? 'Processing...' : 'Ask'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.form>

        <AnimatePresence>
          {response && !isLoading && (
            <motion.div
              className="mt-8 p-8 bg-black/50 border-2 border-purple-500 rounded-3xl backdrop-blur-xl max-w-4xl w-full"
              initial={{ opacity: 0, y: 50, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, rotateX: 30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                EU Statistics:
              </h2>
              <pre className="whitespace-pre-wrap font-sans text-xl text-cyan-100 leading-relaxed">
                {response}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating action buttons */}
        <div className="fixed bottom-12 right-12 flex flex-col space-y-6">
          {/* ... buttons remain the same ... */}
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
