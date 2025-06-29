"use client"

import { useEffect, useState } from "react"

interface LoaderProps {
  duration?: number
}

export default function Loader({ duration = 1.0 }: LoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const durationMs = duration * 700

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / durationMs) * 100, 100)
      setProgress(newProgress)

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [duration])


  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8">
      <div className="relative w-full flex justify-center">
        
        <div className="relative w-[70vw] max-w-[32rem] h-10 sm:px-0 bg-transparent border border-gray-600/50 rounded-sm overflow-hidden">
          {/* <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="w-full h-full bg-blue-500/20 blur-xl scale-110 rounded-sm" />
          </div> */}
          <div
            className="h-full transition-all duration-100 ease-out relative overflow-hidden"
            style={{
              width: `${progress}%`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 4px,
                  rgba(59, 130, 246, 0.8) 4px,
                  rgba(59, 130, 246, 0.8) 5px,
                  transparent 5px,
                  transparent 9px,
                  rgba(96, 165, 250, 0.6) 9px,
                  rgba(96, 165, 250, 0.6) 10px
                )`,
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
              }}
            />

            <div
              className="absolute top-0 right-0 h-full w-px bg-blue-400/80"
              style={{
                boxShadow: "0 0 8px rgba(96, 165, 250, 0.8)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Simple loading text */}
      <div className="text-center">
        <p className="text-sm text-gray-300 font-light tracking-[0.3em] uppercase">Loading Portfolio...</p>
      </div>
    </div>
  )
}
