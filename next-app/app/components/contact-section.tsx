"use client";

import { useEffect, useRef } from "react";
import { Mail, Github, Linkedin, Twitter, ArrowDown } from "lucide-react";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".scroll-animate");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-slide-up");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 px-6 bg-gray-950"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-blue-500 scroll-animate text-5xl font-bold mb-8 opacity-0 transform translate-y-10">
          Let's Connect
        </h2>

        <p className="scroll-animate text-xl text-gray-300 mb-12 opacity-0 transform translate-y-10">
          I'm always open to discussing new opportunities and interesting
          projects. Feel free to reach out if you'd like to work together!
        </p>

        <div className="scroll-animate opacity-0 transform translate-y-10 mb-12 flex flex-col items-center justify-center text-gray-400">
          <ArrowDown className="w-6 h-6 animate-bounce text-blue-600 drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]" />
        </div>

        <div className="flex justify-center gap-6">
          {[
            { icon: Github, href: "https://github.com/Jjmaxxx", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/lee-justin-j/", label: "LinkedIn" },
            { icon: Mail, href: "mailto:justlee888@gmail.com", label: "Email" },
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              className="scroll-animate opacity-0 transform translate-y-10 group"
              aria-label={social.label}
            >
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 group-hover:border-blue-500 group-hover:bg-gray-700 transition-all">
                <social.icon
                  size={20}
                  className="text-gray-400 group-hover:text-white transition-colors drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
