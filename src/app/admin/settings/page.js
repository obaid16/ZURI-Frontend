"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import {
  Settings as SettingsIcon,
  Loader2,
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Tv,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Business Info fields
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Social Links
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // SEO
  const [defaultTitle, setDefaultTitle] = useState("");
  const [defaultDescription, setDefaultDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Hero Section
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await apiRequest("/settings", "GET");
        if (res && res.success && res.data) {
          const s = res.data;
          setCompanyName(s.companyName || "");
          setAddress(s.address || "");
          setEmail(s.email || "");
          setPhone(s.phone || "");
          setFacebook(s.socialLinks?.facebook || "");
          setInstagram(s.socialLinks?.instagram || "");
          setTwitter(s.socialLinks?.twitter || "");
          setLinkedin(s.socialLinks?.linkedin || "");
          setDefaultTitle(s.seo?.defaultTitle || "");
          setDefaultDescription(s.seo?.defaultDescription || "");
          setSeoKeywords(s.seo?.keywords || "");
          setHeroTitle(s.hero?.title || "");
          setHeroSubtitle(s.hero?.subtitle || "");
          setHeroDescription(s.hero?.description || "");
        }
      } catch (err) {
        setError(err.message || "Failed to load store settings.");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      companyName,
      address,
      email,
      phone,
      socialLinks: { facebook, instagram, twitter, linkedin },
      seo: { defaultTitle, defaultDescription, keywords: seoKeywords },
      hero: { title: heroTitle, subtitle: heroSubtitle, description: heroDescription },
    };

    try {
      const res = await apiRequest("/settings", "PUT", payload);
      if (res && res.success) {
        setSuccess("Store configuration updated successfully.");
      }
    } catch (err) {
      setError(err.message || "Failed to update configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-xs">
        <Loader2 className="w-8 h-8 text-[#10b7ff] animate-spin" />
        <span className="text-white/60 tracking-wider">Loading settings console...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-extrabold uppercase tracking-widest text-white">
          Store <span className="text-gold-gradient">Configuration</span>
        </h1>
        <p className="text-white/50 text-xs mt-1">
          Adjust store addresses, contact emails, social channels, SEO overrides, and hero text settings.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-4 rounded-xl font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 p-4 rounded-xl font-bold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* BUSINESS INFO SECTION */}
        <div className="bg-matte-black border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3 flex items-center space-x-2">
            <Building className="w-4 h-4 text-[#10b7ff]" />
            <span>Corporate Details</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Company Legal Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Primary Sourcing Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Contact Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Corporate Office Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
          </div>
        </div>

        {/* HERO CONTENT SETTINGS */}
        <div className="bg-matte-black border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3 flex items-center space-x-2">
            <Tv className="w-4 h-4 text-purple-400" />
            <span>Homepage Hero Banner</span>
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Hero Title (Uppercase Header)</label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Hero Subtitle</label>
                <input
                  type="text"
                  required
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Hero Core Description</label>
              <textarea
                rows="3"
                required
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                className="bg-white/5 border border-white/10 rounded p-4 text-white focus:outline-none focus:border-[#10b7ff] resize-none"
              />
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="bg-matte-black border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3 flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-pink-400" />
            <span>Social Directories</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/company/..."
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Facebook URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Twitter / X URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
              />
            </div>
          </div>
        </div>

        {/* DEFAULT SEO */}
        <div className="bg-matte-black border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white border-b border-white/5 pb-3 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Search Engine Optimization</span>
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Default Page Title</label>
                <input
                  type="text"
                  required
                  value={defaultTitle}
                  onChange={(e) => setDefaultTitle(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Meta Keywords</label>
                <input
                  type="text"
                  required
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white focus:outline-none focus:border-[#10b7ff]"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Default Meta Description</label>
              <textarea
                rows="3"
                required
                value={defaultDescription}
                onChange={(e) => setDefaultDescription(e.target.value)}
                className="bg-white/5 border border-white/10 rounded p-4 text-white focus:outline-none focus:border-[#10b7ff] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-2 text-[10px]"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Configuration</span>
          </button>
        </div>

      </form>
    </div>
  );
}
