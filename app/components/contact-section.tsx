"use client"

import { useEffect, useRef } from "react"
import { Mail, Github, Linkedin, Twitter } from "lucide-react"

export default function ContactSection() {
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
    <section ref={sectionRef} id="contact" className="min-h-screen py-20 px-6 bg-gray-950">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="scroll-animate text-5xl font-bold mb-8 opacity-0 transform translate-y-10">Let's Connect</h2>

        <p className="scroll-animate text-xl text-gray-300 mb-12 opacity-0 transform translate-y-10">
          I'm always open to discussing new opportunities and interesting projects. Feel free to reach out if you'd like
          to work together!
        </p>

        <div className="scroll-animate opacity-0 transform translate-y-10 mb-12">
          <a
            href="mailto:hello@johndoe.com"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all hover:transform hover:scale-105"
          >
            <Mail size={20} />
            Get In Touch
          </a>
        </div>

        <div className="flex justify-center gap-6">
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
            { icon: Twitter, href: "#", label: "Twitter" },
            { icon: Mail, href: "mailto:hello@johndoe.com", label: "Email" },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="scroll-animate opacity-0 transform translate-y-10 group"
              aria-label={social.label}
            >
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 group-hover:border-blue-500 group-hover:bg-gray-700 transition-all">
                <social.icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
