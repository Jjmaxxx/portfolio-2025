"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="cursor-pointer" onClick={scrollToTop}>
            <Image src="/buggah.png" alt="Logo" width={32} height={32} />
          </div>
          <div className="text-2xl font-bold"></div>
          <div className="hidden md:flex space-x-8">
            {["Projects", "Experience", "Tech", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-blue-400 transition-colors"
              >
                {item}
              </button>
            ))}
              {/* <button
                key={"About"}
                className="hover:text-blue-400 transition-colors"
              >
                About
              </button> */}
              <a href="/Justin-Lee-Resume.pdf" download target="_blank" rel="noopener noreferrer">
                <button
                  key={"Resume"}
                  className="hover:text-blue-400 transition-colors"
                >
                  Resume
                </button>
              </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
