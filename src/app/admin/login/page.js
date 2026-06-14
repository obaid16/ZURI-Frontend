"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import ZuriLogo from "@/components/ZuriLogo";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, user } = useAuth();

  // If already logged in as admin, auto-redirect
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== "admin") {
        setError("Access denied. Admin portal requires administrator privileges.");
        return;
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-[#050505] overflow-hidden text-xs">
      {/* Ambient glowing gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#10b7ff]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-blue-950/10 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="bg-matte-black border border-white/5 rounded-2xl w-full max-w-md p-8 shadow-2xl relative z-10">
        
        {/* Glow accent */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#10b7ff]/5 rounded-full filter blur-[40px] pointer-events-none" />

        <div className="text-center mb-8 relative flex flex-col items-center">
          <Link href="/">
            <ZuriLogo className="scale-90" />
          </Link>
          <span className="text-[10px] text-[#10b7ff] uppercase tracking-[0.3em] font-extrabold block mt-3.5">
            Admin Console
          </span>
          <h2 className="text-xs font-sans text-white/60 mt-4 font-semibold uppercase tracking-widest">
            Log In to Administrator Desk
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-3 rounded font-semibold text-center leading-normal">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
              Administrator Email
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
                placeholder="admin@zurienterprises.com"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-[#10b7ff]/50 text-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
              Password
            </label>
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
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-[#10b7ff]/50 text-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#062b73] to-[#10b7ff] text-white py-3 rounded font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 relative group disabled:opacity-50 cursor-pointer text-[10px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Enter Terminal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
