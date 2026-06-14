import React from "react";

export default function ZuriLogo({ className = "" }) {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Brand Icon SVG Monogram */}
      <svg
        className="w-10 h-10 overflow-visible shrink-0"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Elegant Serif Z (White) */}
        <text
          x="15"
          y="65"
          fill="#FFFFFF"
          fontSize="48"
          fontWeight="bold"
          fontFamily="var(--font-cinzel), Cinzel, Georgia, serif"
        >
          Z
        </text>

        {/* Elegant Serif E (Cyan) */}
        <text
          x="48"
          y="65"
          fill="#10B7FF"
          fontSize="48"
          fontWeight="bold"
          fontFamily="var(--font-cinzel), Cinzel, Georgia, serif"
        >
          E
        </text>

        {/* Curved Swoosh/Arc (Cyan) */}
        <path
          d="M 5 45 C 30 22, 70 22, 95 45 C 70 32, 30 32, 5 45 Z"
          fill="#10B7FF"
          filter="drop-shadow(0px 2px 4px rgba(16, 183, 255, 0.3))"
        />
      </svg>

      {/* Typography labels */}
      <div className="flex flex-col text-left">
        <span className="font-serif text-lg md:text-xl font-black tracking-[0.15em] text-white leading-none uppercase">
          Zuri
        </span>
        <span className="text-[7.5px] text-white/50 tracking-[0.3em] font-extrabold uppercase mt-1 leading-none">
          Enterprises
        </span>
      </div>
    </div>
  );
}
