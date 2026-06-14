"use client";

import React, { useState, useEffect } from "react";
import { Send, Upload, MessageCircle, Phone, Mail, Clock, Check } from "lucide-react";

import { useAuth } from "@/components/AuthContext";

export default function BulkInquiryPage() {
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    category: "ready-caps",
    quantity: 150,
    details: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        company: user.company || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user, isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Resolve category item placeholder ObjectId from backend
    let targetProductId = "";
    let targetPrice = 1.0;
    try {
      const res = await fetch(`/api/v1/products?category=${formData.category}&limit=1`);
      if (!res.ok) {
        console.warn(`Category API returned ${res.status}`);
        throw "API error";
      }
      const data = await res.json();
      if (data && data.success && data.products && data.products.length > 0) {
        targetProductId = data.products[0]._id;
        targetPrice = data.products[0].price;
      }
    } catch (err) {
      console.warn("Could not load category placeholder product:", err);
    }

    // Secondary fallback to any product if category query was empty
    if (!targetProductId) {
      try {
        const res = await fetch(`/api/v1/products?limit=1`);
        if (!res.ok) {
          console.warn(`Products limit API returned ${res.status}`);
          throw "API error";
        }
        const data = await res.json();
        if (data && data.success && data.products && data.products.length > 0) {
          targetProductId = data.products[0]._id;
          targetPrice = data.products[0].price;
        }
      } catch (err) {}
    }

    if (!targetProductId) {
      setError("Cannot submit inquiry: No products seeded in backend database yet.");
      setLoading(false);
      return;
    }

    // 2. Build Multi-part Form Data
    const bodyFormData = new FormData();
    bodyFormData.append("name", formData.name);
    bodyFormData.append("company", formData.company);
    bodyFormData.append("email", formData.email);
    bodyFormData.append("phone", formData.phone);
    bodyFormData.append("details", formData.details);

    const itemsArray = [
      {
        product: targetProductId,
        color: "Standard",
        quantity: formData.quantity,
        price: targetPrice
      }
    ];
    bodyFormData.append("items", JSON.stringify(itemsArray));

    if (logoFile) {
      bodyFormData.append("attachments", logoFile);
    }

    try {
      const headers = {};
      const token = localStorage.getItem("zuri_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers,
        body: bodyFormData
      });

      if (!response.ok) {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const errorData = isJson ? await response.json() : {};
        throw new Error(errorData.message || `Failed to submit inquiry. Status: ${response.status}`);
      }
      const resJson = await response.json();

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: isAuthenticated && user ? user.name : "",
          company: isAuthenticated && user ? user.company : "",
          email: isAuthenticated && user ? user.email : "",
          phone: isAuthenticated && user ? user.phone : "",
          category: "ready-caps",
          quantity: 150,
          details: "",
        });
        setLogoFile(null);
      }, 5000);
    } catch (err) {
      setError(err.message || "Inquiry submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 md:py-20 px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-extrabold mb-3 block">
            Corporate Procurement Division
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-white leading-tight">
            Bulk Inquiry <br className="sm:hidden" />
            <span className="text-gold-gradient">Center</span>
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4 mb-4" />
          <p className="text-white/60 text-xs max-w-lg mx-auto">
            Submit manufacturing parameters, raw material volume demands, or upload branding designs to receive official wholesale proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: THE FORM (8 cols) */}
          <div className="lg:col-span-8 bg-matte-black border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl relative">
            
            {submitted ? (
              <div className="py-20 text-center flex flex-col items-center justify-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-bold uppercase text-white mb-3">
                  Inquiry Logged Successfully
                </h3>
                <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                  Your B2B sourcing ticket has been assigned to our corporate design division. We will review files and contact you via email at <span className="text-gold font-bold">{formData.email}</span> within 12 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                {error && (
                  <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-3.5 rounded font-semibold text-center leading-normal">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                      Procurement Officer Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="E.g., John Doe"
                      className="bg-white/5 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white transition-colors"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                      Company / Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="E.g., Apex Sports Group"
                      className="bg-white/5 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                      Corporate Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@company.com"
                      className="bg-white/5 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                      Direct Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="bg-white/5 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white transition-colors"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Category Selection */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                      Primary Sourcing Area
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="bg-[#050505] border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white cursor-pointer transition-colors"
                    >
                      <option value="cap-materials">Structured Buckrams & Mesh</option>
                      <option value="fabrics">Cotton Twills & Weaves</option>
                      <option value="buckles">Buckles & Metal Closures</option>
                      <option value="ready-caps">Blank Cap Stocks</option>
                      <option value="custom-mfg">Bespoke OEM Embroidery Production</option>
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                      Estimated Production Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="bg-white/5 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white transition-colors"
                    />
                  </div>

                </div>

                {/* Specs Details */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                    Detailed Specifications & Special Requests *
                  </label>
                  <textarea
                    required
                    rows={5}
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Describe panel shapes, sizing, thread colors, custom label tags, backing types, cargo deadlines..."
                    className="bg-white/5 border border-white/10 rounded px-4 py-3 text-xs focus:outline-none focus:border-gold/50 text-white resize-none transition-colors"
                  />
                </div>

                {/* FILE UPLOAD DRAG BOX */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                    Vector Blueprint or Logo File (Optional)
                  </label>
                  <div className="border border-dashed border-white/15 rounded-lg p-6 text-center hover:border-gold/30 transition-colors relative flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.ai,.eps,.jpg,.png"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-gold/60 mb-2" />
                    <span className="text-xs text-white/70 block font-semibold">
                      {logoFile ? logoFile.name : "Drag & Drop files or Click to Browse"}
                    </span>
                    <span className="text-[10px] text-white/30 mt-1 block">
                      Supported: PDF, AI, EPS, JPG, PNG (Max 15MB)
                    </span>
                  </div>
                </div>

                {/* Submit Trigger */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-dark text-black font-bold uppercase tracking-widest text-xs py-4 rounded transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-gold/10 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Submitting Inquiry..." : "Submit Procurement Request"}</span>
                </button>

              </form>
            )}

          </div>

          {/* RIGHT COLUMN: BRAND OFFICE CONTACT DETAILS (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Help Card */}
            <div className="bg-matte-black border border-white/5 rounded-2xl p-6 shadow-2xl">
              <h3 className="font-serif text-sm text-gold uppercase tracking-wider font-bold mb-4">
                Need Instant Support?
              </h3>
              <p className="text-white/60 text-xs leading-relaxed mb-6">
                Our B2B coordinators are online to answer material inventory levels, cargo schedules, and customized sampling questions via WhatsApp.
              </p>
              <a
                href="https://wa.me/917506251326"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold uppercase tracking-widest text-[10px] py-3 rounded-full flex items-center justify-center space-x-2 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Contact Details Card */}
            <div className="bg-matte-black border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
              <h3 className="font-serif text-xs text-gold uppercase tracking-widest font-black border-b border-white/5 pb-2">
                Procurement Directory
              </h3>
              
              <div className="flex items-start space-x-3 text-xs">
                <Phone className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white/40 block">Wholesale Desk</span>
                  <a href="tel:+917506251326" className="text-white font-bold hover:text-gold block mt-0.5">
                    +91 75062 51326
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <Mail className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white/40 block">Procurement Submissions</span>
                  <a href="mailto:wholesale@zurienterprises.com" className="text-white font-bold hover:text-gold block mt-0.5">
                    wholesale@zurienterprises.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <Clock className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                <div>
                  <span className="text-white/40 block">Corporate Office Hours</span>
                  <span className="text-white font-semibold block mt-0.5">
                    Mon - Fri: 8:00 AM - 6:00 PM EST
                  </span>
                  <span className="text-white/40 block mt-0.5">Closed Saturdays & Sundays</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
