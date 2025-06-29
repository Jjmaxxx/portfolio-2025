"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, MapPin } from "lucide-react"

const experiences = [
  {
    title: "Software Engineer",
    company: "Delta Labs AI",
    location: "Remote",
    period: "May 2025 - Present",
    description:
      "Building the MVP for a full stack web platform that helps farmers track, manage, and analyze agricultural data in real time.",
    achievements: [
      "Designed and implemented 7+ responsive frontend pages using React.js and TailwindCSS, delivering key workflows",
      "Refactored the Flask backend to modularize routes and optimize database connectivity, cutting endpoint times by 50%",
      "Integrated PostgreSQL with GCP Cloud SQL to ensure scalable, cloud-native data persistence",
    ],
    technologies: ["React.js", "Flask", "PostgreSQL", "GCP", "Docker", "TailwindCSS", "Shadcn"],
  },
  {
    title: "Software Engineer Technical Lead",
    company: "Arctex",
    location: "Remote",
    period: "May 2025 - Present",
    description:
      "Took on a leadership role overseeing DevOps, CI/CD, and overall backend infrastructure, enabling faster and more reliable development cycles.",
    achievements: [
      "Oversaw a team of 6 engineers, providing technical guidance, code reviews, and sprint planning support",
      "Built a CI/CD pipeline using GitHub Actions to deploy to AWS Fargate, saving 5+ minutes per deployment",
      "Improved team velocity by eliminating manual deployment steps and integrating build/test automation"
    ],
    technologies: ["CI/CD", "GitHub Actions", "AWS Fargate", "Docker", "DevOps"],
  },
  {
    title: "Software Engineer (Contract)",
    company: "Arctex",
    location: "Remote",
    period: "Jan. 2025 - May 2025",
    description:
      "Promoted to a contract role to lead infrastructure efforts and support both the web platform and browser extension ecosystem.",
    achievements: [
      "Dockerized and deployed the MERN stack to AWS Fargate with ALB, enabling scalable, production-grade hosting",
      "Enabled secure cross-authentication between the web app and Chrome extension, improving UX and session consistency",
      "Designed a dynamic MongoDB schema to store and query HTML element IDs from 100+ websites with deeply nested fields",
    ],
    technologies: ["MongoDB", "Express.js", "React", "Node.js", "AWS Fargate", "Cloudflare", "Docker", "Chrome Extensions"],
  },
  {
    title: "Software Engineer Intern",
    company: "Arctex",
    location: "Remote",
    period: "Sep. 2024 - Dec. 2024",
    description:
      "Joined as a backend intern to help build core features for the CollegeAppAssist platform with a focus on payments and modular architecture.",
    achievements: [
      "Implemented secure payment endpoints using the Stripe API to support seamless transactions and subscriptions",
      "Integrated Stripe Webhooks for real-time updates, including billing events and subscription lifecycle management",
      "Refactored backend endpoints to follow modular practices, improving scalability and long-term maintainability",
    ],
    technologies: ["Express.js", "Node.js", "MongoDB", "Stripe", "OAuth", "Passport.js", "Google Cloud Platform"],
  }
]

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const section = sectionRef.current
      const sectionTop = section.getBoundingClientRect().top
      const sectionHeight = section.offsetHeight
      const windowHeight = window.innerHeight

      // Calculate when section starts and ends being visible
      const visible = windowHeight - sectionTop - 50
      const progress = Math.min(Math.max(visible / sectionHeight, 0), 1)
      setScrollProgress(progress * 100)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="min-h-screen py-20 px-6 bg-gray-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="scroll-animate text-5xl font-bold text-center mb-16 opacity-0 transform translate-y-10">
          <span className="text-blue-400">Experience</span>
        </h2>

        <div className="relative">
          {/* Animated Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-700"></div>
          <div
            ref={timelineRef}
            className="absolute left-8 top-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 transition-all duration-300 ease-out"
            style={{ height: `${scrollProgress}%` }}
          ></div>

          {experiences.map((exp, index) => (
            <div key={index} className="scroll-animate opacity-0 transform translate-y-10 relative mb-12 last:mb-0">
              {/* Timeline dot with animation */}
              <div
                className={`absolute left-6 w-5 h-5 rounded-full border-4 border-gray-950 z-10 transition-all duration-500 ${
                  scrollProgress >= (index + 1) * (100 / experiences.length) ? "bg-blue-500 scale-110" : "bg-gray-600"
                }`}
              ></div>

              {/* Content */}
              <div className="ml-20">
                <div className="bg-black/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-lg text-white font-medium">{exp.company}</p>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0 text-sm text-gray-400">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={14} />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
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
