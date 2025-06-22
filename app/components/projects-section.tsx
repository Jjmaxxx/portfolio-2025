"use client"

import { useEffect, useRef } from "react"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution with real-time inventory management and payment processing.",
    image: "/placeholder.svg?height=300&width=500",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "#",
    live: "#",
  },
  {
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates and team collaboration features.",
    image: "/placeholder.svg?height=300&width=500",
    tech: ["Next.js", "PostgreSQL", "Socket.io", "Tailwind"],
    github: "#",
    live: "#",
  },
  {
    title: "AI Chat Interface",
    description: "Intelligent chatbot interface with natural language processing and context awareness.",
    image: "/placeholder.svg?height=300&width=500",
    tech: ["React", "Python", "OpenAI", "FastAPI"],
    github: "#",
    live: "#",
  },
]

export default function ProjectsSection() {
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
              }, index * 150)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="projects" className="min-h-screen py-20 px-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="scroll-animate text-5xl font-bold text-center mb-16 opacity-0 transform translate-y-10">
          Featured Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="scroll-animate opacity-0 transform translate-y-10 group">
              <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={16} />
                      Code
                    </a>
                    <a
                      href={project.live}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
