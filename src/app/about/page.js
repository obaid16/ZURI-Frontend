"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Calendar, Award, Globe, Users } from "lucide-react";
import { gsap } from "gsap";
import ZuriLogo from "@/components/ZuriLogo";

export default function AboutPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fade-about",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen py-12 md:py-20 px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header breadcrumbs */}
        <div className="mb-14 text-left border-b border-white/5 pb-8 fade-about">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
            Company Profile
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black uppercase tracking-widest text-white">
            Our Heritage
          </h1>
          <p className="text-white/50 text-xs mt-3 uppercase tracking-[0.2em]">
            Home / About Us
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20 fade-about">
          
          {/* Left Column: text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <ZuriLogo className="scale-90 origin-left" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold uppercase text-white">
              Industrial Excellence
            </h2>
            <p className="text-white/75 text-xs leading-relaxed">
              We are a leading wholesale supplier of cap materials, accessories, apparel, and custom manufacturing solutions. Our mission is to empower brands and businesses with premium quality products at unbeatable wholesale pricing.
            </p>
            <p className="text-white/60 text-xs leading-relaxed">
              Every material roll and custom order undergoes extensive salt spray, tension, and sweatband friction tests before packaging. Partnered with global sea brokers and air express services to deliver pallet orders on time.
            </p>

            {/* Stats blocks layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <span className="font-serif text-2xl font-black text-gold block">10+</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                  Years Experience
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl font-black text-gold block">500+</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                  Corporate Clients
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl font-black text-gold block">1000+</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                  Products
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-serif text-2xl font-black text-gold block">10K+</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold block">
                  Happy Clients
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: dual image grids */}
          <div className="lg:col-span-5 space-y-6">
            <div className="h-[240px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-matte-black relative group">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                alt="Warehouse logistics"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#050505]/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            
            <div className="h-[180px] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-matte-black relative group">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800"
                alt="Factory tailoring"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#050505]/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>

        </div>

        {/* Timeline process row at the bottom */}
        <section className="border-t border-white/5 pt-12 fade-about">
          <h3 className="font-serif text-lg font-bold uppercase tracking-widest text-white mb-10">
            Our Journey
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs leading-relaxed text-white/70">
            
            <div className="border-t border-gold/30 pt-4 relative">
              <span className="absolute -top-[5px] left-0 w-2.5 h-2.5 rounded-full bg-gold inline-block" />
              <span className="text-gold font-serif font-black block text-sm">2013</span>
              <h4 className="font-bold text-white uppercase mt-1 mb-2">Founded Zuri</h4>
              <p className="text-[11px] text-white/55">
                Launched in New York with a vision to supply premium cap structure materials and templates.
              </p>
            </div>

            <div className="border-t border-gold/30 pt-4 relative">
              <span className="absolute -top-[5px] left-0 w-2.5 h-2.5 rounded-full bg-gold inline-block" />
              <span className="text-gold font-serif font-black block text-sm">2016</span>
              <h4 className="font-bold text-white uppercase mt-1 mb-2">Expanded Sourcing</h4>
              <p className="text-[11px] text-white/55">
                Partnered with European weaving mills to expand standard fabric canvas inventories.
              </p>
            </div>

            <div className="border-t border-gold/30 pt-4 relative">
              <span className="absolute -top-[5px] left-0 w-2.5 h-2.5 rounded-full bg-gold inline-block" />
              <span className="text-gold font-serif font-black block text-sm">2019</span>
              <h4 className="font-bold text-white uppercase mt-1 mb-2">OEM Factories Launch</h4>
              <p className="text-[11px] text-white/55">
                Set up high-density computer-controlled embroidery lines for bespoke client collections.
              </p>
            </div>

            <div className="border-t border-gold/30 pt-4 relative">
              <span className="absolute -top-[5px] left-0 w-2.5 h-2.5 rounded-full bg-gold inline-block" />
              <span className="text-gold font-serif font-black block text-sm">2026</span>
              <h4 className="font-bold text-white uppercase mt-1 mb-2">Serving 10K+ Labels</h4>
              <p className="text-[11px] text-white/55">
                Leading the global B2B headwear supply space with integrated freight and cargo solutions.
              </p>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
