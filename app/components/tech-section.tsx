"use client"

import { useEffect, useRef } from "react"

const technologies = [
  { name: "JavaScript", level: 95 },
  { name: "React", level: 90 },
  { name: "TypeScript", level: 88 },
  { name: "Node.js", level: 85 },
  { name: "Python", level: 82 },
  { name: "PostgreSQL", level: 80 },
  { name: "MongoDB", level: 78 },
  { name: "AWS", level: 75 },
]

export default function TechSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".scroll-animate")
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-slide-up")
              }, index * 100)
            })

            // Animate progress bars
            const progressBars = entry.target.querySelectorAll(".progress-bar")
            progressBars.forEach((bar, index) => {
              setTimeout(
                () => {
                  const level = (bar as HTMLElement).dataset.level
                  if (level) {
                    ;(bar as HTMLElement).style.width = `${level}%`
                  }
                },
                index * 100 + 500,
              )
            })
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="tech" className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="scroll-animate text-5xl font-bold text-center mb-16 opacity-0 transform translate-y-10">
          Technologies & Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="scroll-animate opacity-0 transform translate-y-10">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{tech.name}</h3>
                  <span className="text-gray-400">{tech.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="progress-bar h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                    data-level={tech.level}
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
