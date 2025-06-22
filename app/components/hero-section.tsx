"use client"

import { useEffect, useRef } from "react"

export default function HeroSection() {
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
      <div ref={titleRef} className="text-center opacity-0 transform translate-y-10 relative z-10 max-w-4xl">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 relative">
          <span className="animated-gradient-text">Justin Lee</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white font-medium text-shadow-enhanced">
          Full Stack & Cloud Developer
        </p>
      </div>
    </div>
  )
}
