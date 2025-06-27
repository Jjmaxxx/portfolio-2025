"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import InteractiveScene from "./components/interactive-scene";
import HeroSection from "./components/hero-section";
import AboutSection from "./components/about-section";
import ExperienceSection from "./components/experience-section"
import ProjectsSection from "./components/projects-section";
import TechSection from "./components/tech-section";
import ContactSection from "./components/contact-section";
import Navigation from "./components/navigation";
import StarsBackground from "./components/stars-background";

export default function Portfolio() {
  return (
    <div className="bg-black text-white relative">
      
      <Navigation />

      {/* Hero with Interactive 3D */}
      <section className="h-screen relative overflow-hidden">
        
        <Canvas gl={{ powerPreference: "high-performance" }} camera={{ position: [0, 0, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <StarsBackground />
            <InteractiveScene />
          </Suspense>
        </Canvas>
        <HeroSection />
      </section>

      {/* Content Sections */}
      {/* <AboutSection /> */}
      <ProjectsSection />
      <ExperienceSection />
      <TechSection />
      <ContactSection />
    </div>
  );
}
