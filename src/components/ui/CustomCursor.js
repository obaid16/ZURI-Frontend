"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on mobile/tablet viewports
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    if (!cursor || !follower) return;

    // Set initial off-screen
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    // Expand follower on hovering link or button
    const handleMouseEnter = () => {
      gsap.to(follower, {
        scale: 1.8,
        borderColor: "#10B7FF",
        backgroundColor: "rgba(16, 183, 255, 0.15)",
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(follower, {
        scale: 1,
        borderColor: "rgba(16, 183, 255, 0.6)",
        backgroundColor: "transparent",
        duration: 0.3,
      });
    };

    const registerHoverElements = () => {
      const hoverables = document.querySelectorAll("a, button, [role='button'], input, select, textarea");
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    registerHoverElements();

    // Create an observer to auto-register elements added dynamically
    const observer = new MutationObserver(registerHoverElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-gold rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-gold/60 rounded-full pointer-events-none z-50 hidden md:block"
        style={{ transition: "transform 0.05s ease" }}
      />
    </>
  );
}
