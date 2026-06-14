"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { QuoteProvider } from "./QuoteContext";
import { AuthProvider } from "./AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader";
import CustomCursor from "./ui/CustomCursor";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClientWrapper({ children }) {
  const [loadingComplete, setLoadingComplete] = useState(true);
  const [transitionEnded, setTransitionEnded] = useState(true);
  const spotlightRef = useRef(null);
  const lenisRef = useRef(null);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // If it's an admin route, skip the slow public loader animation
    if (isAdminRoute) {
      const timer = setTimeout(() => {
        setLoadingComplete(true);
        setTransitionEnded(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAdminRoute]);

  useEffect(() => {
    // Spotlight follows cursor on desktop only
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    // Set initial coordinates offscreen
    gsap.set(spotlight, { x: -300, y: -300 });

    const handleMouseMove = (e) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.7,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Connect Lenis to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis
    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Initial check
    if (!loadingComplete) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, [loadingComplete]);

  // Handle loading state changes & fallback transition end
  useEffect(() => {
    let timer;
    if (loadingComplete) {
      if (lenisRef.current) {
        lenisRef.current.start();
      }

      // Fallback timer to ensure CSS scaling/blur classes get cleaned up
      timer = setTimeout(() => {
        setTransitionEnded(true);
      }, 1600);
    } else {
      timer = setTimeout(() => {
        setTransitionEnded(false);
      }, 0);
      if (lenisRef.current) {
        lenisRef.current.stop();
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loadingComplete]);

  return (
    <AuthProvider>
      <QuoteProvider>
        {/* 4. Main Page Body wrapper */}
        <div
          onTransitionEnd={() => {
            if (loadingComplete) {
              setTransitionEnded(true);
            }
          }}
          className={`flex flex-col min-h-screen ${
            transitionEnded
              ? "opacity-100"
              : `transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  loadingComplete
                    ? "opacity-100 blur-none scale-100"
                    : "opacity-0 blur-md scale-98"
                }`
          }`}
        >
          {!isAdminRoute && <Navbar />}
          <main className={`flex-grow relative z-10 overflow-x-hidden ${isAdminRoute ? "" : "pt-[88px] md:pt-[96px]"}`}>
            {children}
          </main>
          {!isAdminRoute && <Footer />}
        </div>
      </QuoteProvider>
    </AuthProvider>
  );
}
