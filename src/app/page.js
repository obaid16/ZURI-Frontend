"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Factory, Cpu, Layers, DollarSign, PenTool, Flame, Box, Compass } from "lucide-react";
import { useQuote } from "@/components/QuoteContext";
import { getImageUrl } from "@/utils/api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { addToQuote } = useQuote();

  const heroRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const horizontalScrollRef = useRef(null);
  const bentoRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catRes, prodRes, blogRes] = await Promise.all([
          fetch("/api/v1/categories"),
          fetch("/api/v1/products?featured=true&limit=5"),
          fetch("/api/v1/blogs?limit=3")
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData?.success && catData.categories) {
            setCategories(catData.categories);
          }
        }
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData?.success && prodData.products) {
            setProducts(prodData.products);
          }
        }
        if (blogRes.ok) {
          const blogData = await blogRes.json();
          if (blogData?.success && blogData.blogs) {
            setBlogs(blogData.blogs);
          }
        }
      } catch (err) {
        console.error("Failed to load home page data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  useEffect(() => {
    // Animations disabled as requested
  }, []);

  return (
    <div ref={heroRef} className="bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* 1. CINEMATIC FULLSCREEN HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 py-16 sm:py-20 border-b border-white/5 overflow-hidden z-10">
        
        {/* Floating cyan particle blobs */}
        <div className="particle-float absolute top-1/4 left-1/4 w-3.5 h-3.5 bg-gold/30 rounded-full blur-[2px]" />
        <div className="particle-float absolute top-1/3 right-1/4 w-2 h-2 bg-gold/40 rounded-full blur-[1px]" />
        <div className="particle-float absolute bottom-1/4 left-1/3 w-4 h-4 bg-gold/20 rounded-full blur-[3px]" />
        
        {/* Ambient radial blur spotlights with Cyan/Royal Blue gradient mesh overlays */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/15 rounded-full filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative">
          
          {/* Asymmetric Typography layout */}
          <div className="lg:col-span-8 space-y-8">
            <span className="hero-fade-sub text-gold text-xs uppercase tracking-[0.4em] font-extrabold flex items-center space-x-2.5">
              <Compass className="w-4.5 h-4.5 text-gold animate-spin" style={{ animationDuration: '10s' }} />
              <span>ZURI ENTERPRISES OEM RUN</span>
            </span>

            {/* Split character layout heading */}
            <h1 className="font-serif text-4xl sm:text-5xl xl:text-7xl 2xl:text-8xl font-black tracking-tight leading-[1.05] uppercase overflow-hidden">
              <span className="hero-char-reveal inline-block">Everything</span> <br />
              <span className="hero-char-reveal inline-block">You Need to</span> <br />
              <span className="hero-char-reveal inline-block text-gold-gradient">Make &amp; Sell Caps.</span>
            </h1>

            <p className="hero-fade-sub text-white/60 max-w-xl text-xs sm:text-sm md:text-base tracking-[0.1em] leading-relaxed font-medium">
              Premium quality materials, blanks, accessories, and apparel in bulk. Custom-configured corporate sourcing.
            </p>

            <div className="hero-fade-sub flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
              <Link
                href="/products"
                className="bg-gold hover:bg-gold-light text-black text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded transition-transform hover:scale-105 shadow-lg shadow-gold/25 text-center"
              >
                Shop All Products
              </Link>
              <Link
                href="/inquiry"
                className="border border-white/10 hover:border-gold/50 text-white hover:text-gold text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded transition-transform hover:scale-105 backdrop-blur-sm text-center"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Right visual */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            <div className="hero-fade-sub relative border border-white/5 rounded-3xl p-6 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md overflow-hidden h-[340px] md:h-[400px] w-full max-w-sm flex items-center justify-center image-clip-path shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800"
                alt="Branded Cap"
                className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(16,183,255,0.2)]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. B2B VALUE BADGES BAR */}
      <section className="bg-[#050505] border-y border-white/5 py-10 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-[11px] text-white/50 uppercase tracking-[0.15em] font-extrabold">
          <div className="flex items-start space-x-3.5">
            <DollarSign className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <span className="text-white block font-black text-xs">Wholesale Only</span>
              <span className="text-[9px] text-white/30 font-semibold mt-0.5 normal-case block">Bulk orders at best prices</span>
            </div>
          </div>
          <div className="flex items-start space-x-3.5">
            <ShieldCheck className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <span className="text-white block font-black text-xs">Premium Quality</span>
              <span className="text-[9px] text-white/30 font-semibold mt-0.5 normal-case block">Top-grade materials</span>
            </div>
          </div>
          <div className="flex items-start space-x-3.5">
            <Truck className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <span className="text-white block font-black text-xs">Global Shipping</span>
              <span className="text-[9px] text-white/30 font-semibold mt-0.5 normal-case block">Fast & reliable delivery</span>
            </div>
          </div>
          <div className="flex items-start space-x-3.5">
            <Layers className="w-5 h-5 text-gold mt-0.5" />
            <div>
              <span className="text-white block font-black text-xs">Secure Payments</span>
              <span className="text-[9px] text-white/30 font-semibold mt-0.5 normal-case block">Safe & trusted transactions</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ASYMMETRICAL CATEGORIES */}
      <section className="py-20 md:py-28 lg:py-36 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-white/5 pb-8">
          <div>
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
              Sourcing Categories
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-white">
              Shop By Category
            </h2>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-4 md:mt-0 max-w-xs leading-relaxed font-semibold">
            Specialized raw materials and blank collections for custom cap manufacturing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {loading ? (
            <div className="md:col-span-12 text-center text-gold py-12 uppercase tracking-widest text-xs">
              Loading Categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="md:col-span-12 py-12 text-center text-white/55 border border-white/5 rounded-2xl bg-navy-light/30 w-full">
              <p className="text-xs uppercase tracking-widest">No categories available.</p>
            </div>
          ) : (
            categories.slice(0, 5).map((cat, index) => {
              const catId = cat.slug || cat.id || cat._id;
              const image = getImageUrl(cat.image) || "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800";
              const colSpan = index === 0 ? "md:col-span-7" : index === 1 ? "md:col-span-5" : "md:col-span-4";
              const heightClass = index === 0 ? "h-72 md:h-96" : index === 1 ? "h-48 md:h-64" : "h-48";
              return (
                <Link
                  key={catId}
                  href={`/products?category=${catId}`}
                  className={`cat-fade ${colSpan} bg-navy-light border border-white/5 hover:border-gold/30 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-2xl relative`}
                >
                  <div className={`relative ${heightClass} w-full overflow-hidden`}>
                    <img
                      src={image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-85" />
                  </div>
                  <div className="p-6 bg-matte-black border-t border-white/5 flex justify-between items-center relative z-10">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-white group-hover:text-gold transition-colors">
                      {cat.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* 4. HORIZONTAL SCROLL FEATURED PRODUCTS */}
      <section ref={horizontalSectionRef} className="relative bg-[#050505] py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 w-full mb-10 shrink-0">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
            Editorial Showcase
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black uppercase tracking-widest text-white">
            Featured Blanks
          </h2>
        </div>

        <div className="overflow-x-auto flex-grow flex items-center relative px-6 pb-6 scrollbar-thin scrollbar-thumb-gold/20">
          <div
            ref={horizontalScrollRef}
            className="flex space-x-8 w-max pl-6 pr-24"
          >
            {loading ? (
              <div className="text-center text-gold py-12 uppercase tracking-widest text-xs w-full">
                Loading Blanks...
              </div>
            ) : products.length === 0 ? (
              <div className="w-full py-12 text-center text-white/55 border border-white/5 rounded-2xl bg-navy-light/30">
                <p className="text-xs uppercase tracking-widest">No featured products available.</p>
              </div>
            ) : (
              products.map((product) => {
                const productId = product._id || product.id;
                const minPrice = product.tiers && product.tiers.length > 0 
                  ? product.tiers[product.tiers.length - 1].price 
                  : product.price;

                return (
                  <div
                    key={productId}
                    className="w-[280px] md:w-[320px] bg-navy-light border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-2xl shrink-0 hover:border-gold/25 transition-colors"
                  >
                    <Link href={`/products/${productId}`} className="relative h-60 w-full overflow-hidden block bg-matte-black/60">
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-black/65 border border-white/10 px-3 py-1 rounded text-[9px] text-gold font-bold uppercase tracking-wider">
                        MOQ: {product.moq} {product.unit || "pc"}s
                      </div>
                    </Link>

                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <Link
                          href={`/products/${productId}`}
                          className="font-serif text-sm font-bold text-white hover:text-gold transition-colors line-clamp-1 block"
                        >
                          {product.name}
                        </Link>
                        
                        <div className="mt-3 space-y-1 text-xs text-white/55">
                          <div className="flex justify-between">
                            <span>Wholesale from:</span>
                            <span className="text-white font-bold">${minPrice ? minPrice.toFixed(2) : "0.00"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rate:</span>
                            <span className="text-white/70 font-semibold">Volume Tier pricing</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToQuote(product, product.moq);
                          alert(`Added MOQ (${product.moq} ${product.unit || "pc"}s) of ${product.name} to inquiry.`);
                        }}
                        className="w-full bg-gold hover:bg-gold-light text-black text-[10px] font-black uppercase tracking-widest py-3 rounded cursor-pointer transition-colors"
                      >
                        Add to Inquiry
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 5. BENTO-GRID */}
      <section ref={bentoRef} className="py-20 md:py-28 lg:py-36 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
            Standards of Sourcing
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black uppercase tracking-widest text-white">
            Why Choose Zuri
          </h2>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          <div className="bento-card bento-border md:col-span-8 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span className="text-gold font-bold uppercase tracking-wider text-[10px] block mb-2">
                Logistics & Volumes
              </span>
              <h3 className="font-serif text-xl font-bold uppercase text-white mb-4">
                Enterprise Sourcing Capacity
              </h3>
              <p className="text-white/60 text-xs leading-relaxed max-w-md">
                We coordinate container freights, DDP duties clearings, and domestic drops directly to brand warehouse facilities globally.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-6 mt-8">
              <div>
                <span className="font-serif text-2xl font-bold text-gold block">10K+</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold mt-1">Clients Served</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-gold block">1000+</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold mt-1">Materials</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-gold block">48-Hr</span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest block font-bold mt-1">Quality Audit</span>
              </div>
            </div>
          </div>

          <div className="bento-card bento-border md:col-span-4 rounded-3xl p-8 flex flex-col justify-between">
            <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold uppercase text-white mb-2">
                48-Point QC Audit
              </h4>
              <p className="text-white/55 text-xs leading-relaxed">
                Tension testing on closures, color fastness checks on twill fabric, and crown structure scans.
              </p>
            </div>
          </div>

          <div className="bento-card bento-border md:col-span-4 rounded-3xl p-8 flex flex-col justify-between">
            <div className="bg-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <PenTool className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold uppercase text-white mb-2">
                Custom OEM Options
              </h4>
              <p className="text-white/55 text-xs leading-relaxed">
                Configure unique colorways, personalized internal taped seams, and specific closures.
              </p>
            </div>
          </div>

          <div className="bento-card bento-border md:col-span-8 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <span className="text-gold font-bold uppercase tracking-wider text-[10px] block mb-2">
                Production Speed
              </span>
              <h3 className="font-serif text-xl font-bold uppercase text-white mb-4">
                Fast Sampling & CNC Cutting
              </h3>
              <p className="text-white/60 text-xs leading-relaxed max-w-md">
                Computer-controlled laser panels cutting and advanced embroidery networks keep turnaround times tightly mapped to delivery dates.
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <Link
                href="/custom"
                className="bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 text-[10px] uppercase font-bold tracking-widest px-6 py-2.5 rounded transition-colors"
              >
                OEM Timeline &rarr;
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. MARQUEE TESTIMONIALS */}
      <section className="bg-matte-black py-16 md:py-20 border-y border-white/5 relative z-10">
        <div className="text-center mb-12">
          <span className="text-white/40 text-[10px] uppercase font-bold tracking-[0.30em] block">
            Reviews & Testimonials
          </span>
        </div>

        <div className="relative w-full overflow-hidden select-none flex">
          <div className="animate-marquee py-4">
            
            <div className="bg-navy-light border border-white/5 p-6 rounded-2xl max-w-md mx-4 shrink-0">
              <p className="text-white/85 font-serif italic text-xs leading-relaxed mb-4">
                "Zuri's double-stiffened buckrams transformed our custom baseball crowns. Before, we faced collapse reviews during sea transit. Now, structure retains posture."
              </p>
              <div>
                <span className="text-gold font-serif text-[10px] font-bold uppercase tracking-wider block">Harrison Ford Jr.</span>
                <span className="text-white/30 text-[9px] uppercase mt-0.5 block">Sourcing Desk, Heritage Group</span>
              </div>
            </div>

            <div className="bg-navy-light border border-white/5 p-6 rounded-2xl max-w-md mx-4 shrink-0">
              <p className="text-white/85 font-serif italic text-xs leading-relaxed mb-4">
                "Finding twill fabrics rolls matching colors across seasons is challenging. Zuri's dyeing controls provide absolute batch consistency. Recommended partner."
              </p>
              <div>
                <span className="text-gold font-serif text-[10px] font-bold uppercase tracking-wider block">Marcus V. Croft</span>
                <span className="text-white/30 text-[9px] uppercase mt-0.5 block">Procurement VP, Alpine Brands</span>
              </div>
            </div>

            <div className="bg-navy-light border border-white/5 p-6 rounded-2xl max-w-md mx-4 shrink-0">
              <p className="text-white/85 font-serif italic text-xs leading-relaxed mb-4">
                "The brass slider adjusters finishing is impeccable. Corrosion protection stands up to sweat wear tests beautifully. B2B volume quotes are highly competitive."
              </p>
              <div>
                <span className="text-gold font-serif text-[10px] font-bold uppercase tracking-wider block">Sophia Jenkins</span>
                <span className="text-white/30 text-[9px] uppercase mt-0.5 block">Design Lead, Sovereign Cap Co</span>
              </div>
            </div>

            {/* Duplicated for loop */}
            <div className="bg-navy-light border border-white/5 p-6 rounded-2xl max-w-md mx-4 shrink-0">
              <p className="text-white/85 font-serif italic text-xs leading-relaxed mb-4">
                "Zuri's double-stiffened buckrams transformed our custom baseball crowns. Before, we faced collapse reviews during sea transit. Now, structure retains posture."
              </p>
              <div>
                <span className="text-gold font-serif text-[10px] font-bold uppercase tracking-wider block">Harrison Ford Jr.</span>
                <span className="text-white/30 text-[9px] uppercase mt-0.5 block">Sourcing Desk, Heritage Group</span>
              </div>
            </div>

            <div className="bg-navy-light border border-white/5 p-6 rounded-2xl max-w-md mx-4 shrink-0">
              <p className="text-white/85 font-serif italic text-xs leading-relaxed mb-4">
                "Finding twill fabrics rolls matching colors across seasons is challenging. Zuri's dyeing controls provide absolute batch consistency. Recommended partner."
              </p>
              <div>
                <span className="text-gold font-serif text-[10px] font-bold uppercase tracking-wider block">Marcus V. Croft</span>
                <span className="text-white/30 text-[9px] uppercase mt-0.5 block">Procurement VP, Alpine Brands</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. BRAND LOGOS & BLOGS */}
      <section className="py-20 md:py-28 px-4 sm:px-6 border-t border-white/5 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-6 mb-20">
          <span className="text-white/40 text-[9px] uppercase tracking-[0.25em] font-black block">
            Supplying Global Headwear Labels
          </span>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-30 hover:opacity-50 transition-opacity">
            <span className="font-sans font-bold tracking-[0.2em] text-white text-lg">VANS</span>
            <span className="font-sans font-black tracking-tighter text-white text-xl italic">NIKE</span>
            <span className="font-serif italic font-extrabold text-white text-xl">adidas</span>
            <span className="font-sans font-bold tracking-[0.1em] text-white text-lg">PUMA</span>
            <span className="font-sans font-extrabold tracking-widest text-white text-lg">NEW ERA</span>
            <span className="font-serif tracking-widest text-white text-lg font-black uppercase">Reebok</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {loading ? (
            <div className="col-span-3 text-center text-gold py-12 uppercase tracking-widest text-xs">
              Loading Articles...
            </div>
          ) : blogs.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-white/55 border border-white/5 rounded-2xl bg-navy-light/30 w-full">
              <p className="text-xs uppercase tracking-widest">No articles available.</p>
            </div>
          ) : (
            blogs.map((post) => {
              const blogId = post._id || post.id;
              return (
                <div
                  key={blogId}
                  className="bg-navy-light border border-white/5 rounded-2xl overflow-hidden hover:border-gold/25 transition-all shadow-2xl flex flex-col justify-between group"
                >
                  <div className="h-52 w-full overflow-hidden relative">
                    <img src={getImageUrl(post.coverImage || post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute bottom-4 left-4 bg-gold text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white leading-snug line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-white/55 text-xs leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <Link
                      href="/blog"
                      className="text-gold text-[10px] font-black uppercase tracking-widest inline-block hover:underline"
                    >
                      Read Article &rarr;
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}
