"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import InteractiveScene from "./components/interactive-scene";
import HeroSection from "./components/hero-section";
import AboutSection from "./components/about-section";
import ExperienceSection from "./components/experience-section"
import ProjectsSection from "./components/projects-section";
import TechSection from "./components/tech-section";
import ContactSection from "./components/contact-section";
import Navigation from "./components/navigation";
import StarsBackground from "./components/stars-background";
import Loader from "./components/loader";
const LOADING_DURATION = 1.0
export default function Portfolio() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), LOADING_DURATION * 1000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!isReady) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isReady])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <div className="bg-black text-white relative">
      {isReady && <Navigation />}

      {!isReady ? (
        <div className="flex justify-center items-center h-screen">
          <Loader duration={LOADING_DURATION} />
        </div>
      ) : (
        <section className="h-screen relative overflow-hidden">
          <Canvas dpr={[1,2.0]}  gl={{ powerPreference: "high-performance" }} camera={{ position: [0, 0, 5], fov: 60 }}>
            <Suspense fallback={<Loader />}>
              <StarsBackground />
              <InteractiveScene />
            </Suspense>
          </Canvas>
          <HeroSection />
        </section>
      )}

      {/* Content Sections */}
      {/* <AboutSection /> */}
      <ProjectsSection />
      <ExperienceSection />
      <TechSection />
      <ContactSection />
    </div>
  );
}
