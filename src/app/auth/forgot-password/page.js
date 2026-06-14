"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, Check } from "lucide-react";
import ZuriLogo from "@/components/ZuriLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#050505] overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#062b73]/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="bg-matte-black border border-white/5 rounded-2xl w-full max-w-md p-8 shadow-2xl relative z-10">
        
        {/* Glow accent */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gold/5 rounded-full filter blur-[40px] pointer-events-none" />

        <div className="text-center mb-8 relative flex flex-col items-center">
          <Link href="/">
            <ZuriLogo className="scale-90" />
          </Link>
          <span className="text-[9px] text-gold uppercase tracking-[0.3em] font-extrabold block mt-3.5">
            Client Portal
          </span>
          <h2 className="text-xs font-sans text-white/60 mt-4 font-semibold uppercase tracking-widest">
            Reset Portal Password
          </h2>
        </div>

        {submitted ? (
          <div className="text-center py-6 animate-fade-in text-xs">
            <div className="w-12 h-12 bg-gold/10 border border-gold rounded-full flex items-center justify-center mx-auto mb-5">
              <Check className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif text-base font-bold uppercase text-white mb-2">
              Recovery Link Dispatched
            </h3>
            <p className="text-white/60 leading-relaxed max-w-xs mx-auto mb-6">
              A temporary password key was dispatched to <span className="text-gold font-bold">{email}</span>. Click the link inside to secure a new password.
            </p>
            <Link
              href="/auth/login"
              className="bg-gold text-black font-bold uppercase tracking-widest py-3 px-6 rounded inline-block transition-transform hover:scale-105"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6 text-xs">
            <p className="text-white/50 leading-relaxed text-center">
              Provide your corporate registry email below, and we will issue a temporary URL security ticket to reset your portal password.
            </p>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                Registered Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-white/40">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-dark text-black font-bold uppercase tracking-widest py-3.5 rounded flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Verifying Email..." : "Send Password Ticket"}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-[11px] text-white/55">
          <span>Remembered credentials? </span>
          <Link href="/auth/login" className="text-gold font-bold hover:underline">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
