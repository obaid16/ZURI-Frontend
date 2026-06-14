"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { getImageUrl } from "@/utils/api";
import { gsap } from "gsap";

export default function CategoriesPage() {
  const containerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories");
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cat-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div ref={containerRef} className="relative min-h-screen py-12 md:py-20 px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-1 bg-gold/10 border border-gold/30 rounded-full px-3 py-1 text-xs text-gold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Professional Grade</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-white leading-tight">
            Wholesale <br className="sm:hidden" />
            <span className="text-gold-gradient">Categories</span>
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4 mb-4" />
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Source raw cap-making fabrics, structural backings, brass closures, threads, blanks, and custom industrial embroidery.
          </p>
        </div>

        {/* Grid of Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gold py-12 uppercase tracking-widest text-xs">
              Loading Categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/55 border border-white/5 rounded-2xl bg-navy-light/30 w-full">
              <p className="text-xs uppercase tracking-widest">No categories available.</p>
            </div>
          ) : (
            categories.map((category) => {
              const catId = category.slug || category.id || category._id;
              return (
                <div
                  key={catId}
                  className="cat-item group bg-matte-black border border-white/5 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 shadow-2xl flex flex-col justify-between"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      fill
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors mb-3">
                        {category.name}
                      </h3>
                      <p className="text-white/55 text-xs leading-relaxed mb-6">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <span className="text-white/40 text-[10px] uppercase tracking-wider">
                        Bulk Catalog Sourcing
                      </span>
                      <Link
                        href={`/products?category=${catId}`}
                        className="bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 hover:border-gold text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-all flex items-center space-x-1"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Call to Customization Card */}
          <div className="cat-item group bg-gradient-to-br from-[#062b73]/10 to-matte-black border border-gold/20 rounded-xl p-8 shadow-2xl flex flex-col justify-between text-center min-h-[380px]">
            <div className="my-auto">
              <span className="text-gold text-xs font-bold uppercase tracking-widest mb-3 block">
                Bespoke Factory Orders
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-extrabold uppercase text-white mb-4 leading-tight">
                Custom Cap <br />
                Manufacturing
              </h3>
              <p className="text-white/65 text-xs max-w-xs mx-auto leading-relaxed mb-6">
                Need custom 3D embroidery, logo screens, or branded sizing closures? Provide your design specifications to order factory-direct cap production runs.
              </p>
            </div>
            <Link
              href="/custom"
              className="bg-gold text-black hover:bg-gold-light py-3.5 rounded font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center space-x-2 w-full mt-auto"
            >
              <span>Configure Custom Order</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
