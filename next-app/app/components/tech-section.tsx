"use client"

import { useEffect, useRef } from "react"
const technologies = [
  { name: "JavaScript", icon: "/svgs/javascript.svg" },
  { name: "Python", icon: "/svgs/python.svg" },
  { name: "Java", icon: "/svgs/java.svg" },
  { name: "React", icon: "/svgs/react.svg" },
  { name: "Express.js", icon: "/svgs/express.svg" },
  { name: "Next.js", icon: "/svgs/nextjs.svg" },
  { name: "TypeScript", icon: "/svgs/typescript.svg" },
  { name: "Tailwind CSS", icon: "/svgs/tailwind.svg" },
  { name: "Node.js", icon: "/svgs/nodejs.svg" },
  { name: "PostgreSQL", icon: "/svgs/elephant.svg" },
  { name: "MongoDB", icon: "/svgs/mongodb.svg" },
  { name: "Supabase", icon: "/svgs/supabase.svg" },
  { name: "AWS", icon: "/svgs/aws.svg" },
  { name: "GCP", icon: "/svgs/google-cloud.svg" },
  { name: "Docker", icon: "/svgs/docker.svg" },
  { name: "GitHub", icon: "/svgs/github.svg" },
  { name: "GitHub Actions", icon: "/svgs/github-action.svg" },
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
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Double the technologies array for seamless infinite scroll
  const duplicatedTechnologies = [...technologies, ...technologies]

  return (
    <section ref={sectionRef} id="tech" className="py-20 px-6 bg-gray-950 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-blue-500 rotate-45"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border border-purple-500 rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-cyan-500 rotate-45"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-green-500 rotate-12"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="scroll-animate text-5xl font-bold text-center mb-16 opacity-0 transform translate-y-10">
          <span className="text-blue-500">Technologies & Skills</span>
        </h2>

        {/* Auto-scrolling carousel with fixed height container */}
        <div className="scroll-animate opacity-0 transform translate-y-10">
          <div className="relative overflow-hidden h-32">
            {/* Gradient overlays for fade effect */}
            {/* <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div> */}

            {/* Scrolling container with proper seamless loop */}
            <div className="flex animate-scroll-seamless items-center h-full w-[max-content]">
              {duplicatedTechnologies.map((tech, index) => (
                <div key={`${tech.name}-${index}`} className="flex-shrink-0 mx-4 group cursor-pointer">
                  <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-xl bg-gray-900/30 backdrop-blur-sm border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 min-w-[100px] h-24 hover:bg-gray-800/50">
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300 text-white"
                      />
                    <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors duration-300 text-center whitespace-nowrap">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple description */}
        <div className="scroll-animate opacity-0 transform translate-y-10 mt-12 text-center">
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experienced with modern technologies across the full development stack
          </p>
        </div>
      </div>
    </section>
  )
}
