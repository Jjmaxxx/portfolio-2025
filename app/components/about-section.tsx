"use client"

import { useEffect, useRef } from "react"

export default function AboutSection() {
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
              }, index * 200)
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
    <section ref={sectionRef} id="about" className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="scroll-animate text-5xl font-bold mb-8 opacity-0 transform translate-y-10">About Me</h2>
            <p className="scroll-animate text-lg text-gray-300 mb-6 opacity-0 transform translate-y-10">
              I'm a passionate developer who loves creating digital experiences that blend functionality with beautiful
              design. With over 5 years of experience in web development, I specialize in building modern, scalable
              applications.
            </p>
            <p className="scroll-animate text-lg text-gray-300 mb-8 opacity-0 transform translate-y-10">
              My journey started with curiosity about how websites work, and it has evolved into a deep passion for
              crafting solutions that make a difference in people's lives.
            </p>
            <div className="scroll-animate opacity-0 transform translate-y-10">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all">
                Download Resume
              </button>
            </div>
          </div>

          <div className="scroll-animate opacity-0 transform translate-y-10">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-6">What I Do</h3>
              <div className="space-y-4">
                {["Frontend Development", "Backend Development", "UI/UX Design", "Mobile Development"].map(
                  (skill, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{skill}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
