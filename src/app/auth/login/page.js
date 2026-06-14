"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import ZuriLogo from "@/components/ZuriLogo";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#050505] overflow-hidden">
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
            Log In to Sourcing Desk
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-xs">
          {error && (
            <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-3 rounded font-semibold text-center leading-normal">
              {error}
            </div>
          )}
          {/* Email */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
              Corporate Email Address
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

          {/* Password */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[10px] text-gold hover:underline font-semibold"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white/40">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark text-black font-bold uppercase tracking-widest py-3.5 rounded flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Log In to Sourcing Portal"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 border-t border-white/5 pt-6 text-center text-[11px] text-white/55">
          <span>New corporate client? </span>
          <Link href="/auth/register" className="text-gold font-bold hover:underline">
            Register for B2B Account
          </Link>
        </div>

      </div>
    </div>
  );
}
