"use client"

import { useEffect, useRef } from "react"
import { ExternalLink, Github } from "lucide-react"

const projects = [
  {
    title: "Lenses - Professor Rating Platform",
    description:
      "Streamlining how SJSU students search for courses, browse semester schedules, and review professors.",
    image: "/project-images/Lenses.png",
    tech: ["Django", "PostgreSQL", "Next.js", "Docker"],
    github: "https://github.com/SJSUCSClub/course-scheduling",
    live: "https://lenses.acmsjsu.org/",
  },
  {
    title: "theTypingSchool - Typing Tracker",
    description:
      "An interactive platform that helps users improve typing speed through lessons and eye-tracking technology.",
    image: "/project-images/TypingSchool.png",
    tech: ["Express.js","Github Actions", "OpenAI API", "AWS"],
    live: "https://thetypingschool.com/",
  },
  {
    title: "Downloadable Youtube Player",
    description:
      "Download YouTube videos for offline playback with smart file management and custom in-app playlists.",
    image: "/project-images/ytdl-app.png",
    tech: ["Electron.js", "React", "Material-UI", "Node.js"],
    github: "https://github.com/Jjmaxxx/electron-with-react-ytdl",
    live: "https://drive.google.com/file/d/1KwHn-pv-S2Z5KEbD5CQBSQz3VlufZiKF/view",
  },
  {
    title: "Yelpin! - Eat faster. Decide smarter.",
    description:
      "A web app that helps you find a great place to eat by filtering nearby restaurants or picking one at random.",
    image: "/project-images/Yelpin.png",
    tech: ["React", "Express.js", "Material-UI"],
    github: "https://github.com/Jjmaxxx/yelp-randomizer"
  },
  {
    title: "Discord Standup Bot",
    description:
      "Managing agile standups. Create groups, collect team updates via DMs, and get AI-powered summaries.",
    image: "/project-images/standup-bot.png",
    tech: ["Python", "SQLite", "Discord API", "OpenAI API"],
    github: "https://github.com/Jjmaxxx/discord-standup-bot"
  },
  {
    title: "Bankr - Online Banking",
    description:
      "Mock online banking app to manage accounts, transfer funds, upload checks, and manage users.",
    image: "/project-images/online-banking.png",
    tech: ["Next.js", "Flask", "PostgreSQL", "Docker"],
    github: "https://github.com/Jjmaxxx/onlinebanking"
  }
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
    <section ref={sectionRef} id="projects" className="py-20 px-6 bg-gray-950 relative overflow-hidden">
      {/* Background geometric elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 right-10 w-40 h-40 border border-purple-500 rotate-12"></div>
        <div className="absolute bottom-20 left-16 w-28 h-28 border border-cyan-500 rotate-45"></div>
        <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-blue-500 rotate-12"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="scroll-animate text-5xl font-bold text-center mb-16 opacity-0 transform translate-y-10">
          <span className="text-blue-500">Featured Projects</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="scroll-animate opacity-0 transform translate-y-10 group">
              <div className="relative bg-black/50 backdrop-blur-sm border-2 border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-all duration-500 hover:transform hover:scale-105">
                {/* Corner accents */}
                {/* <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                {/* <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}

                <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden border-b border-gray-700">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400 group-hover:text-blue-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 border border-blue-500/30 text-blue-300 rounded-full text-xs bg-blue-500/5 hover:bg-blue-500/10 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group/link"
                      >
                        <Github size={16} className="group-hover/link:scale-110 transition-transform" />
                        <span className="text-sm">Code</span>
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors group/link"
                      >
                        <ExternalLink size={16} className="group-hover/link:scale-110 transition-transform" />
                        <span className="text-sm">Live Demo</span>
                      </a>
                    )}
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
