"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, Settings, ShieldAlert, BadgeCheck, FileCheck } from "lucide-react";
import { gsap } from "gsap";

export default function CustomManufacturingPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-custom",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
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
        {/* Hero Header */}
        <div className="text-center mb-16 reveal-custom">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold mb-3 block">
            Custom Cap Tailoring & OEM
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-white leading-tight">
            Bespoke Cap <br className="md:hidden" />
            <span className="text-gold-gradient">Manufacturing</span>
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4 mb-4" />
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Partner directly with our New York-supervised factories to stitch custom collections, corporate apparel, and specialized B2B merch.
          </p>
        </div>

        {/* Grid of Customization Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 reveal-custom">
          
          {/* Card 1 */}
          <div className="bg-matte-black border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all flex flex-col justify-between">
            <div>
              <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-5">
                <Star className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-base font-bold uppercase text-white mb-2">
                3D Puff Embroidery
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Elevate logos with thick 3D density staggers. Stitched on advanced Tajima multi-head machines using German polyester thread for zero loose lines.
              </p>
            </div>
            <span className="text-[10px] text-gold font-bold mt-6 uppercase tracking-wider block">
              MOQ: 250 units
            </span>
          </div>

          {/* Card 2 */}
          <div className="bg-matte-black border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all flex flex-col justify-between">
            <div>
              <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-base font-bold uppercase text-white mb-2">
                Genuine Leather Patches
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Italian cowhide patches debossed or laser-etched. Hand-stitched with thick border thread channels or iron-on adhesive.
              </p>
            </div>
            <span className="text-[10px] text-gold font-bold mt-6 uppercase tracking-wider block">
              MOQ: 100 units
            </span>
          </div>

          {/* Card 3 */}
          <div className="bg-matte-black border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all flex flex-col justify-between">
            <div>
              <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-5">
                <Settings className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-base font-bold uppercase text-white mb-2">
                Custom Visors & Closures
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Pick solid brass sliders, antique snaps, curved or flat bills, custom pattern prints, and personalized inside taping.
              </p>
            </div>
            <span className="text-[10px] text-gold font-bold mt-6 uppercase tracking-wider block">
              MOQ: 150 units
            </span>
          </div>

          {/* Card 4 */}
          <div className="bg-matte-black border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all flex flex-col justify-between">
            <div>
              <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-5">
                <BadgeCheck className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-base font-bold uppercase text-white mb-2">
                Fabric Configurations
              </h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Configure specialized fabrics: brushed canvas cotton twill, vintage corduroy, heavyweight fleece, or honeycomb trucker meshes.
              </p>
            </div>
            <span className="text-[10px] text-gold font-bold mt-6 uppercase tracking-wider block">
              MOQ: 150 yards
            </span>
          </div>

        </div>

        {/* Timelines Section */}
        <section className="bg-matte-black/40 border border-white/5 rounded-2xl p-8 md:p-12 mb-20 reveal-custom">
          <h3 className="font-serif text-xl md:text-2xl font-extrabold uppercase text-gold tracking-widest text-center mb-10">
            Manufacturing Production Cycle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center text-xs relative">
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-[#050505] text-gold font-bold mb-4">
                01
              </div>
              <h4 className="font-serif text-white font-bold uppercase mb-1">Sampling (10 Days)</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Submit your vector design file. We sew a prototype sample and send detailed photos for client approval.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-[#050505] text-gold font-bold mb-4">
                02
              </div>
              <h4 className="font-serif text-white font-bold uppercase mb-1">Panel Slicing</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Textiles are precision laser-cut. Embroidery and printing are carried out on flat layout panels.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-[#050505] text-gold font-bold mb-4">
                03
              </div>
              <h4 className="font-serif text-white font-bold uppercase mb-1">Stitching Assembly</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Crown components, structured buckram cores, eyelets, and adjustable closures are sewn together.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-[#050505] text-gold font-bold mb-4">
                04
              </div>
              <h4 className="font-serif text-white font-bold uppercase mb-1">QC & Shipping (20 Days)</h4>
              <p className="text-white/50 text-[11px] leading-relaxed">
                Hats undergo 48-point inspections, packed in custom boxes, and dispatched via DDP ocean or air freight.
              </p>
            </div>

          </div>
        </section>

        {/* Inquiry Call to Action */}
        <section className="bg-gradient-to-r from-gold/10 to-[#062b73]/10 border border-gold/25 rounded-2xl p-8 md:p-12 text-center reveal-custom">
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold uppercase text-white mb-4">
            Ready to Configure Your Brand Cap Line?
          </h3>
          <p className="text-white/75 text-sm max-w-xl mx-auto leading-relaxed mb-8">
            Contact our B2B customization agents to receive dynamic sample quotes, discuss logo files, and evaluate color combinations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/inquiry"
              className="bg-gold hover:bg-gold-dark text-black text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full flex items-center justify-center space-x-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Launch Wholesale Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/917506251326"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full flex items-center justify-center space-x-2 transition-transform hover:scale-105"
            >
              <span>WhatsApp Sourcing Agent</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
