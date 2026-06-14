"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { useQuote } from "./QuoteContext";
import { useAuth } from "./AuthContext";
import { CATEGORIES } from "@/data/products";
import ZuriLogo from "./ZuriLogo";
import { gsap } from "gsap";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItemsCount } = useQuote();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpenAt, setMobileOpenAt] = useState(null);
  const [megaOpenAt,   setMegaOpenAt]   = useState(null);
  const [categories,   setCategories]   = useState([]);

  const isMobileMenuOpen = mobileOpenAt === pathname;
  const isMegaMenuOpen   = megaOpenAt   === pathname;

  const megaMenuRef  = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories");
        if (!res.ok) {
          console.warn(`Navbar API returned ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data?.success && data.categories?.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories in Navbar:", err);
      }
    }
    loadCategories();
  }, []);

  const displayCategories = categories.length > 0 ? categories : CATEGORIES;

  useEffect(() => {
    if (isMegaMenuOpen) {
      gsap.fromTo(
        megaMenuRef.current,
        { opacity: 0, y: 15, display: "none" },
        { opacity: 1, y: 0, display: "block", duration: 0.3, ease: "power2.out" }
      );
    } else {
      gsap.to(megaMenuRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (megaMenuRef.current) megaMenuRef.current.style.display = "none";
        }
      });
    }
  }, [isMegaMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -20, display: "none" },
        { opacity: 1, y: 0, display: "block", duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          if (mobileMenuRef.current) mobileMenuRef.current.style.display = "none";
        }
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      
      {/* 1. TOP UTILITY ANNOUNCEMENT BAR */}
      <div className="bg-[#050505] border-b border-white/5 py-2.5 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">
          <div className="flex items-center space-x-3 md:space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block animate-pulse"></span>
              <span>Bulk &amp; Wholesale Only</span>
            </span>
            <span className="hidden md:inline-block">|</span>
            <span className="hidden md:inline-block">Minimum Order Quantity Applies</span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/faq" className="hover:text-gold transition-colors">Track Order</Link>
            <span>|</span>
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 md:space-x-3 text-white/50">
                <span className="text-white/60 font-semibold normal-case hidden sm:inline">
                  Hi, <span className="text-gold font-bold">{user.name.split(" ")[0]}</span>
                </span>
                <span className="hidden sm:inline">|</span>
                <button
                  onClick={logout}
                  className="hover:text-red-400 font-bold transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="hover:text-gold transition-colors">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAV ROW */}
      <nav
        className={`transition-all duration-300 border-b ${
          isScrolled
            ? "bg-matte-black/95 backdrop-blur-md border-gold/15 py-3 shadow-lg"
            : "bg-transparent border-white/5 py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Logo brand */}
          <Link href="/" className="group">
            <ZuriLogo />
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-[0.2em] font-extrabold text-white/80">
            <Link href="/" className={`hover:text-gold transition-colors ${pathname === "/" ? "text-gold" : ""}`}>
              Home
            </Link>

            <div
              className="relative py-2"
              onMouseEnter={() => setMegaOpenAt(pathname)}
              onMouseLeave={() => setMegaOpenAt(null)}
            >
              <button
                className={`flex items-center space-x-1 hover:text-gold cursor-pointer transition-colors ${
                  pathname.startsWith("/products") ? "text-gold" : ""
                }`}
              >
                <span>Products</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <div
                ref={megaMenuRef}
                className="absolute top-full -left-20 w-[280px] bg-matte-gray border border-gold/20 shadow-2xl rounded-lg overflow-hidden p-4 grid grid-cols-1 gap-2 mt-2 hidden"
              >
                <div className="border-b border-white/5 pb-1.5 mb-1.5">
                  <h4 className="font-serif text-[10px] text-gold tracking-widest uppercase font-black">
                    Sourcing Catalog
                  </h4>
                </div>
                {displayCategories.map((cat) => {
                  const catId = cat.slug || cat.id;
                  return (
                    <Link
                      key={catId}
                      href={`/products?category=${catId}`}
                      className="flex justify-between items-center px-2 py-1.5 rounded hover:bg-white/5 text-[11px] font-bold text-white/75 hover:text-gold transition-all"
                    >
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Link href="/products?category=cap-materials" className={`hover:text-gold transition-colors ${pathname.includes("category=cap-materials") ? "text-gold" : ""}`}>
              Materials
            </Link>

            <Link href="/products?category=ready-caps" className={`hover:text-gold transition-colors ${pathname.includes("category=ready-caps") ? "text-gold" : ""}`}>
              Clothing
            </Link>

            <Link href="/custom" className={`hover:text-gold transition-colors ${pathname === "/custom" ? "text-gold" : ""}`}>
              Custom Manufacturing
            </Link>

            <Link href="/about" className={`hover:text-gold transition-colors ${pathname === "/about" ? "text-gold" : ""}`}>
              About Us
            </Link>
          </div>

          {/* Right utilities */}
          <div className="flex items-center space-x-4">
            
            <Link
              href="/products"
              className="p-2 border border-white/5 text-white/60 hover:text-gold hover:border-gold/25 rounded-full transition-all"
              title="Search Sourcing"
            >
              <Search className="w-4.5 h-4.5" />
            </Link>

            <Link
              href="/quote"
              className={`relative p-2 border border-white/5 text-white/60 hover:text-gold hover:border-gold/25 rounded-full transition-all ${
                pathname === "/quote" ? "border-gold/20 text-gold bg-gold/5" : ""
              }`}
            >
              <ShoppingBag className="w-4.5 h-4.5 text-gold" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-gold text-black font-sans text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpenAt(isMobileMenuOpen ? null : pathname)}
              className="lg:hidden p-2 text-white/80 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile menu */}
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-matte-black border-b border-gold/15 absolute top-full left-0 right-0 shadow-2xl py-6 px-4 sm:px-6 hidden"
        >
          <div className="flex flex-col space-y-4 font-sans text-xs font-bold uppercase tracking-widest text-white/95">
            <Link href="/" className="hover:text-gold py-1 border-b border-white/5">
              Home
            </Link>
            <Link href="/products" className="hover:text-gold py-1 border-b border-white/5">
              Products Catalog
            </Link>
            <Link href="/products?category=cap-materials" className="hover:text-gold py-1 border-b border-white/5">
              Materials
            </Link>
            <Link href="/products?category=ready-caps" className="hover:text-gold py-1 border-b border-white/5">
              Clothing
            </Link>
            <Link href="/custom" className="hover:text-gold py-1 border-b border-white/5">
              Custom Manufacturing
            </Link>
            <Link href="/about" className="hover:text-gold py-1 border-b border-white/5">
              About Us
            </Link>
            {isAuthenticated && user ? (
              <div className="flex flex-col space-y-4 pt-2">
                <span className="text-white/60 font-semibold py-1 normal-case">
                  Hello, <span className="text-gold font-bold">{user.name}</span> ({user.company})
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpenAt(null);
                  }}
                  className="text-left text-red-400 font-bold py-1.5 transition-colors cursor-pointer border-t border-white/5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="hover:text-gold py-1 border-b border-white/5">
                Login / Register
              </Link>
            )}
            <Link
              href="/quote"
              className="bg-gold text-black text-center py-2 rounded font-black text-[10px] tracking-widest uppercase mt-4"
            >
              Quotation Cart
            </Link>
          </div>
        </div>

      </nav>

    </header>
  );
}
