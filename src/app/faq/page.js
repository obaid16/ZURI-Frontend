"use client";

import React, { useState, useRef } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { gsap } from "gsap";

const FAQ_ITEMS = [
  {
    q: "What are the Minimum Order Quantities (MOQs) for products?",
    a: "Our MOQs depend strictly on the category: double-stiffened buckram rolls require 50 units, cotton canvas twill fabrics require 100 meters, brass buckles require 1,000 pieces, ready-made blank cap stock requires 100-150 pieces, and custom OEM manufacturing orders start at 250 units."
  },
  {
    q: "Can you send physical fabric and accessory swatches?",
    a: "Yes. Corporate accounts can request our Material Swatch Kit containing canvas cotton cuttings, buckram rolls swatches, snaps, and buckles catalogs. Contact our sales desk or submit a bulk inquiry ticket to request one. Swatch shipments are free for verified apparel brands."
  },
  {
    q: "How are wholesale B2B quotations processed?",
    a: "Once you build a quotation list and submit the inquiry, our procurement division coordinates with factory coordinators. We check raw inventory availability, calculate shipping schedules, apply bulk volume discount tiers, and send a final PDF proposal to your email within 12 business hours."
  },
  {
    q: "Do you provide digital pre-production proofs and physical samples?",
    a: "For custom cap manufacturing contracts, we develop full digital 3D vector schematics for approval. Upon contract approval, we stitch a physical master sample in our factory, sending detailed high-resolution macro-photographs (or the physical cap via DHL Express) before commencing bulk cutting."
  },
  {
    q: "What is your average shipping lead time?",
    a: "For stock catalog products (buckram, buckle sets, fabric rolls), items ship from our New York logistics hub in 3-5 business days. Custom cap manufacturing runs require 25-30 days production, plus sea container (18 days) or express air (5 days) transit timelines."
  },
  {
    q: "Do you handle custom clearances and B2B import duties?",
    a: "Yes. For bulk cargo shipments, we offer DDP (Delivered Duty Paid) shipping options into the United States, United Kingdom, and European Union countries. This means Zuri handles import clearances, port custom duties, and ground container drop schedules directly."
  }
];

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const accordionRefs = useRef([]);

  const toggleAccordion = (index) => {
    const isOpening = activeIndex !== index;
    
    // Close the currently active one first if there is one
    if (activeIndex !== null && accordionRefs.current[activeIndex]) {
      gsap.to(accordionRefs.current[activeIndex], {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }

    // Set new active state
    setActiveIndex(isOpening ? index : null);

    // Open target accordion
    if (isOpening && accordionRefs.current[index]) {
      gsap.fromTo(
        accordionRefs.current[index],
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut"
        }
      );
    }
  };

  return (
    <div className="relative min-h-screen py-12 md:py-20 px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-extrabold mb-3 block">
            Support Desk
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-white leading-tight">
            Frequently Asked <br className="sm:hidden" />
            <span className="text-gold-gradient">Questions</span>
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4 mb-4" />
          <p className="text-white/60 text-xs max-w-md mx-auto">
            Review shipping schedules, custom specifications, sampling timelines, and minimum order volume regulations.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="bg-matte-black border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5 pr-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? "text-gold" : "text-white/40 group-hover:text-gold"}`} />
                    <span className="font-serif text-sm font-bold text-white group-hover:text-gold transition-colors">
                      {item.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/50 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-gold" : ""
                    }`}
                  />
                </button>

                {/* Collapsible Content */}
                <div
                  ref={(el) => (accordionRefs.current[idx] = el)}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-white/60 leading-relaxed border-t border-white/5">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
