"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuote } from "@/components/QuoteContext";
import { useAuth } from "@/components/AuthContext";
import { Trash2, FileText, CheckCircle, AlertTriangle, Send } from "lucide-react";

export default function QuotePage() {
  const {
    quoteItems,
    updateQuantity,
    removeFromQuote,
    clearQuote,
    totalQuoteEstimated,
    totalItemsCount,
    hasMoqViolations,
    isInitialized
  } = useQuote();

  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState(() => ({
    name: (isAuthenticated && user?.name) || "",
    company: (isAuthenticated && user?.company) || "",
    email: (isAuthenticated && user?.email) || "",
    phone: (isAuthenticated && user?.phone) || "",
    address: "",
    city: "",
    country: "United States",
  }));

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (quoteItems.length === 0) return;
    setLoading(true);
    setError("");

    const body = {
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      details: `Cart Sourcing Checkout. Delivery Address: ${formData.address}, ${formData.city}, ${formData.country}. Estimated gross value: $${totalQuoteEstimated.toFixed(2)}`,
      items: quoteItems.map(item => ({
        product: item.product._id || item.product.id,
        color: item.color,
        quantity: item.quantity,
        price: item.pricePerUnit
      }))
    };

    try {
      const headers = {
        "Content-Type": "application/json"
      };
      const token = localStorage.getItem("zuri_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/v1/inquiries", {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const errorData = isJson ? await response.json() : {};
        throw new Error(errorData.message || `Failed to submit checkout request. Status: ${response.status}`);
      }
      const resJson = await response.json();

      setSubmitted(true);
      setTimeout(() => {
        clearQuote();
      }, 100);
    } catch (err) {
      setError(err.message || "Checkout submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gold text-sm uppercase tracking-widest bg-[#050505]">
        Syncing Quotation Registry...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 md:py-16 px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header breadcrumbs */}
        <div className="mb-10 text-left border-b border-white/5 pb-6">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
            Procurement Desk
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-black uppercase tracking-widest text-white">
            Cart & Checkout
          </h1>
          <p className="text-white/50 text-xs mt-2 uppercase tracking-[0.2em]">
            Home / Checkout
          </p>
        </div>

        {submitted ? (
          <div className="bg-matte-black border border-gold/20 rounded-xl p-8 md:p-16 text-center max-w-2xl mx-auto py-20 animate-fade-in shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-serif text-2xl font-bold uppercase text-white mb-3">
              Procurement Order Placed
            </h2>
            <p className="text-white/70 text-xs leading-relaxed mb-6">
              Your quotation checklist has been submitted successfully. Our invoicing team will configure cargo schedules and email the official B2B PDF invoice to <span className="text-gold font-bold">{formData.email}</span> within 12 business hours.
            </p>
            <Link
              href="/products"
              className="bg-gold hover:bg-gold-light text-black px-8 py-3.5 rounded font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105"
            >
              Continue Sourcing
            </Link>
          </div>
        ) : quoteItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: YOUR CART (7 cols) */}
            <div className="lg:col-span-7 bg-matte-black border border-white/5 rounded-xl p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h3 className="font-serif text-sm text-gold uppercase tracking-wider font-black">
                  Your Cart
                </h3>
                <button
                  onClick={clearQuote}
                  className="text-red-400 hover:text-red-500 font-sans text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Empty Cart</span>
                </button>
              </div>

              {/* TABLE ITEMS */}
              <div className="space-y-4">
                {quoteItems.map((item, idx) => {
                  const itemId = item.product._id || item.product.id;
                  return (
                    <div key={`${itemId}-${item.color}`} className="flex flex-wrap sm:flex-nowrap items-center justify-between border-b border-white/5 pb-4 gap-3 text-xs">
                      
                      {/* Thumbnail and title details */}
                      <div className="flex items-center space-x-3.5">
                        <div className="h-14 w-14 bg-navy-light rounded overflow-hidden shrink-0 border border-white/5">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-white leading-tight line-clamp-1">{item.product.name}</h4>
                          <span className="text-[10px] text-white/40 block mt-0.5">Color: {item.color}</span>
                          {item.belowMoq && (
                            <span className="text-[9px] text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-500/25 mt-1 inline-block">
                              Below MOQ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity adjustments */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded overflow-hidden">
                          <button
                            onClick={() => updateQuantity(itemId, item.color, Math.max(1, item.quantity - 10))}
                            className="px-2 py-0.5 text-white/50 hover:text-white"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(itemId, item.color, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-10 text-center text-[11px] bg-transparent border-none text-white focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(itemId, item.color, item.quantity + 10)}
                            className="px-2 py-0.5 text-white/50 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromQuote(itemId, item.color)}
                          className="text-white/40 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Pricing recap */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-white/40 block">${item.pricePerUnit.toFixed(2)} / pc</span>
                        <span className="font-bold text-gold">${item.totalPrice.toFixed(2)}</span>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* SUB TOTAL BAR */}
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-white/50 uppercase tracking-widest font-black">Gross Estimated Total:</span>
                <span className="text-lg font-serif text-white font-bold">${totalQuoteEstimated.toFixed(2)}</span>
              </div>

            </div>

            {/* RIGHT COLUMN: CHECKOUT DETAILS FORM (5 cols) */}
            <div className="lg:col-span-5 bg-matte-black border border-white/5 rounded-xl p-6 shadow-2xl">
              <h3 className="font-serif text-sm text-gold uppercase tracking-wider font-black border-b border-white/5 pb-3 mb-5">
                Checkout Details
              </h3>

              <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
                {error && (
                  <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-3 rounded font-semibold text-center leading-normal mb-2">
                    {error}
                  </div>
                )}
                
                {/* Billing Info */}
                <div className="space-y-4">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider font-black block">
                    Billing Details
                  </span>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Procurement Officer Name"
                      className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company Entity"
                      className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@company.com"
                      className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                      Direct Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Contact Phone Number"
                      className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Industrial Way"
                      className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[9px] text-white/50 uppercase tracking-wider font-bold">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-gold text-white transition-colors"
                      />
                    </div>
                  </div>

                </div>

                {/* Warnings and order summary breakdown */}
                {hasMoqViolations && (
                  <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-2.5 rounded text-[10px] leading-relaxed flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Some styles do not satisfy the baseline MOQ quantities. Prices may fluctuate during review.</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold-light text-black font-bold uppercase tracking-widest text-[10px] py-3.5 rounded mt-6 transition-transform hover:scale-[1.02] cursor-pointer shadow-lg shadow-gold/15 disabled:opacity-50"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>

              </form>
            </div>

          </div>
        ) : (
          <div className="bg-matte-black border border-white/5 rounded-xl py-20 text-center max-w-md mx-auto shadow-2xl flex flex-col items-center">
            <FileText className="w-10 h-10 text-gold/60 mb-4 opacity-50" />
            <h3 className="font-serif text-lg text-white mb-2">Quotation List Empty</h3>
            <p className="text-white/50 text-xs px-6 mb-6">
              Review the cap accessories and fabric catalog to add structured blanks to your sourcing quote checkout sheet.
            </p>
            <Link
              href="/products"
              className="bg-gold text-black px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Explore Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
