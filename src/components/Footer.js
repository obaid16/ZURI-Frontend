"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import ZuriLogo from "./ZuriLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#050505] border-t border-gold/10 text-white font-sans relative z-10">
      
      {/* Newsletter bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/5">
        <div className="lg:col-span-6">
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold tracking-wider uppercase mb-3 text-white">
            Sourcing & Sells <span className="text-gold">Catalog Updates</span>
          </h3>
          <p className="text-white/60 text-xs max-w-lg">
            Subscribe to our quarterly B2B manufacturing reports and material availability notices.
          </p>
        </div>
        <div className="lg:col-span-6">
          <form onSubmit={handleSubscribe} className="relative flex max-w-md lg:ml-auto w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Corporate Email"
              className="bg-white/5 border border-white/10 focus:border-gold/50 rounded-full px-6 py-3.5 w-full text-xs placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-gold/20 text-white pr-12"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-gold hover:bg-gold-light text-black rounded-full w-11 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {subscribed && (
            <p className="text-gold text-[10px] mt-2 text-right transition-all animate-fade-in">
              Subscribed. Thank you.
            </p>
          )}
        </div>
      </div>

      {/* Grid columns */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        
        {/* Brand info */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col space-y-6">
          <ZuriLogo />
          
          <p className="text-white/50 text-xs leading-relaxed max-w-xs">
            Zuri Enterprises is a premier international B2B manufacturer and bulk distributor of custom headwear blanks, structured buckrams, and closure accessories.
          </p>
          <div>
            <a
              href="https://wa.me/917506251326"
              className="inline-flex items-center space-x-2 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Agent</span>
            </a>
          </div>
        </div>

        {/* Categories links */}
        <div className="lg:col-span-3">
          <h4 className="font-serif text-[10px] text-gold uppercase tracking-[0.2em] font-extrabold mb-6">
            Sourcing Areas
          </h4>
          <ul className="space-y-3.5 text-xs text-white/50">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="hover:text-white hover:translate-x-1 inline-block transition-all font-semibold"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation links */}
        <div className="lg:col-span-2">
          <h4 className="font-serif text-[10px] text-gold uppercase tracking-[0.2em] font-extrabold mb-6">
            Information
          </h4>
          <ul className="space-y-3.5 text-xs text-white/50">
            <li>
              <Link href="/custom" className="hover:text-white transition-colors font-semibold">
                Custom OEM
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors font-semibold">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors font-semibold">
                Insights
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors font-semibold">
                FAQ Support
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors font-semibold">
                Contact HQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Head office coords */}
        <div className="sm:col-span-2 lg:col-span-3 space-y-4 text-xs text-white/50">
          <h4 className="font-serif text-[10px] text-gold uppercase tracking-[0.2em] font-extrabold mb-2">
            Our Location
          </h4>
          <a
            href="https://maps.app.goo.gl/KGGTt5XBUSSGWiS76"
            target="_blank"
            rel="noreferrer"
            className="flex items-start space-x-3 leading-relaxed hover:text-white transition-colors group"
          >
            <MapPin className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <span>
              Zuri Enterprises
              <br />
              Mumbai, Maharashtra, India
            </span>
          </a>
          <div className="flex items-center space-x-3">
            <Phone className="w-4.5 h-4.5 text-gold shrink-0" />
            <a href="tel:+917506251326" className="hover:text-white font-semibold">
              +91 75062 51326
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-4.5 h-4.5 text-gold shrink-0" />
            <a href="mailto:wholesale@zurienterprises.com" className="hover:text-white font-semibold break-all">
              wholesale@zurienterprises.com
            </a>
          </div>
        </div>

      </div>


      {/* Copy bounds */}
      <div className="bg-[#020202] py-8 text-center text-[10px] text-white/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Zuri Enterprises. All rights reserved. B2B Corporate Sourcing.</p>
          <div className="flex space-x-6">
            <Link href="/auth/login" className="hover:text-gold transition-colors">Client Portal</Link>
            <Link href="/faq" className="hover:text-gold transition-colors">MOQ Guidelines</Link>
          </div>
        </div>
      </div>


    </footer>
  );
}
