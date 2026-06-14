"use client";

import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function Loader({ onComplete }) {
  const [percentage, setPercentage] = useState(0);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const subTextRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("zuri_loaded");
    if (hasLoaded) {
      if (onComplete) onComplete();
      return;
    }

    const counter = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("zuri_loaded", "true");
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.4,
          ease: "power4.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    });

    // 1. Monogram fade-in & scale reveal
    gsap.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
    );

    // 2. Subtitle slide up
    gsap.fromTo(
      subTextRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 }
    );

    // 3. Counter progress
    tl.to(counter, {
      val: 100,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        setPercentage(Math.floor(counter.val));
      }
    });

    // Progress bar scale
    gsap.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 2.5, ease: "power2.out", transformOrigin: "left" }
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const [show, setShow] = useState(true);
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("zuri_loaded");
    if (hasLoaded) setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center text-white select-none"
    >
      <div className="text-center max-w-lg px-6 flex flex-col items-center">
        
        {/* Monogram ZE Vector Logo wrapper */}
        <div ref={logoRef} className="flex justify-center mb-6 opacity-0">
          <svg
            className="w-24 h-24 overflow-visible"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Elegant Serif Z (White) */}
            <text
              x="12"
              y="68"
              fill="#FFFFFF"
              fontSize="54"
              fontWeight="bold"
              fontFamily="Cinzel, serif"
            >
              Z
            </text>

            {/* Elegant Serif E (Cyan) */}
            <text
              x="48"
              y="68"
              fill="#10B7FF"
              fontSize="54"
              fontWeight="bold"
              fontFamily="Cinzel, serif"
            >
              E
            </text>

            {/* Curved Swoosh/Arc (Cyan) */}
            <path
              d="M 5 45 C 30 22, 70 22, 95 45 C 70 32, 30 32, 5 45 Z"
              fill="#10B7FF"
              filter="drop-shadow(0px 3px 6px rgba(16, 183, 255, 0.4))"
            />
          </svg>
        </div>

        {/* Large Brand Serif labels */}
        <h2 className="font-serif text-3xl md:text-4xl tracking-[0.2em] text-white font-extrabold uppercase mb-2">
          ZURI
        </h2>

        <p
          ref={subTextRef}
          className="text-gold uppercase tracking-[0.4em] text-[10px] font-extrabold md:text-xs mb-10 opacity-0"
        >
          ENTERPRISES • CORPORATE LUXURY
        </p>

        {/* Micro Cyan progress bar */}
        <div className="relative w-48 md:w-64 h-[1px] bg-white/5 overflow-hidden mb-4">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full w-full bg-gold"
            style={{ transform: "scaleX(0)", transformOrigin: "left" }}
          />
        </div>

        <div className="font-serif text-[10px] md:text-xs font-light text-gold/60 tracking-[0.3em]">
          SOURCING {percentage}%
        </div>
      </div>
    </div>
  );
}
