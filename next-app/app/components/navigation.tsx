"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button";

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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold"></div>
          <div className="hidden md:flex space-x-8">
            {["Projects", "Experience", "Tech", "Contact"].map((item) => (
              <Button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-blue-400 transition-colors"
              >
                {item}
              </Button>
            ))}
              {/* <Button
                key={"About"}
                className="hover:text-blue-400 transition-colors"
              >
                About
              </Button> */}
              <a href="/Justin-Lee-Resume.pdf" download target="_blank" rel="noopener noreferrer">
                <Button
                  key={"Resume"}
                  className="hover:text-blue-400 transition-colors"
                >
                  Resume
                </Button>
              </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
