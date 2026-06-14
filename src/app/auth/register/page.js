"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Building, Phone, ArrowRight } from "lucide-react";
import ZuriLogo from "@/components/ZuriLogo";
import { useAuth } from "@/components/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    password: "",
    interest: "ready-caps"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(
        formData.name,
        formData.company,
        formData.email,
        formData.phone,
        formData.password
      );
      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-[#050505] overflow-hidden">
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
            Procurement Division
          </span>
          <h2 className="text-xs font-sans text-white/60 mt-4 font-semibold uppercase tracking-widest">
            Register Wholesale Profile
          </h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 text-xs">
          {error && (
            <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-3 rounded font-semibold text-center leading-normal">
              {error}
            </div>
          )}
          
          {/* Name */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-white/40">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="First Last"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
              />
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
              Company Entity Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-white/40">
                <Building className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData(p => ({ ...p, company: e.target.value }))}
                placeholder="E.g., Alpine Outdoors Ltd"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
              Corporate Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-white/40">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
              Direct Contact Phone
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-white/40">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                placeholder="E.g., +1 (555) 000-0000"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
              Choose Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-white/40">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded px-10 py-3 focus:outline-none focus:border-gold/50 text-white transition-colors"
              />
            </div>
          </div>

          {/* Interest */}
          <div className="flex flex-col space-y-1">
            <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
              Primary Sourcing Interest
            </label>
            <select
              value={formData.interest}
              onChange={(e) => setFormData(p => ({ ...p, interest: e.target.value }))}
              className="w-full bg-[#050505] border border-white/10 rounded px-3.5 py-3 focus:outline-none focus:border-gold/50 text-white cursor-pointer transition-colors"
            >
              <option value="cap-materials">Cap Construction Materials</option>
              <option value="ready-caps">Unbranded Blank Caps</option>
              <option value="custom-mfg">OEM Branded Cap Sewing</option>
              <option value="accessories">Brass Closures & Buckles</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-dark text-black font-bold uppercase tracking-widest py-3.5 rounded flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Registering..." : "Submit Registration Application"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 border-t border-white/5 pt-6 text-center text-[11px] text-white/55">
          <span>Already registered? </span>
          <Link href="/auth/login" className="text-gold font-bold hover:underline">
            Log In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
