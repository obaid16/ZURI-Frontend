"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "wholesale",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "wholesale", message: "" });
    }, 4000);
  };

  return (
    <div className="relative min-h-screen py-12 md:py-20 px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header breadcrumbs */}
        <div className="mb-14 text-left border-b border-white/5 pb-8">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-black uppercase tracking-widest text-white">
            Contact Us
          </h1>
          <p className="text-white/50 text-xs mt-3 uppercase tracking-[0.2em]">
            Home / Contact Us
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: DIRECTORY INFO (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-matte-black border border-white/5 rounded-xl p-6 shadow-2xl space-y-6">
              
              <h3 className="font-serif text-sm text-gold uppercase tracking-wider font-black border-b border-white/5 pb-2">
                Procurement Desk
              </h3>
              
              <p className="text-white/60 text-xs leading-relaxed">
                Our support team is ready to coordinate custom designs and volume shipment requests.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <Phone className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/40 block">Phone Desk</span>
                    <a href="tel:+917506251326" className="text-white font-bold hover:text-gold block mt-0.5">
                      +91 75062 51326
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/40 block">Procurement Submissions</span>
                    <a href="mailto:wholesale@zurienterprises.com" className="text-white font-bold hover:text-gold block mt-0.5">
                      wholesale@zurienterprises.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/40 block">Our Location</span>
                    <span className="text-white font-semibold block mt-0.5 leading-relaxed">
                      Zuri Enterprises
                      <br />
                      Mumbai, Maharashtra, India
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4.5 h-4.5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/40 block">Business Hours</span>
                    <span className="text-white font-semibold block mt-0.5">
                      Mon - Fri: 8:00 AM - 6:00 PM EST
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Maps Embed */}
            <div className="bg-matte-black border border-white/5 rounded-xl overflow-hidden shadow-2xl relative" style={{ height: '280px' }}>
              {/* Gold top accent bar */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-sm border-b border-gold/20">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-gold" />
                  <span className="text-[9px] text-white/70 uppercase tracking-widest font-bold">Zuri Enterprises — Mumbai</span>
                </div>
                <a
                  href="https://maps.app.goo.gl/KGGTt5XBUSSGWiS76"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-gold font-bold hover:underline uppercase tracking-widest"
                >
                  Open Maps ↗
                </a>
              </div>
              <iframe
                title="Zuri Enterprises Location"
                src="https://maps.google.com/maps?q=19.0635852,72.9293809&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(0.9)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM INPUTS (7 cols) */}
          <div className="lg:col-span-7 bg-matte-black border border-white/5 rounded-xl p-6 md:p-8 shadow-2xl">
            <h3 className="font-serif text-sm text-white uppercase tracking-wider font-black border-b border-white/5 pb-3 mb-6">
              Get in Touch
            </h3>

            {submitted ? (
              <div className="py-20 text-center flex flex-col items-center justify-center animate-fade-in text-xs">
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold flex items-center justify-center mb-6">
                  <Check className="w-6 h-6 text-gold" />
                </div>
                <h4 className="font-serif text-base font-bold uppercase text-white mb-2">
                  Message Dispatched
                </h4>
                <p className="text-white/60 leading-relaxed max-w-xs mx-auto">
                  Thank you. A wholesale sales specialist will follow up via corporate email within 12 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                
                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="First Last"
                    className="bg-white/5 border border-white/10 rounded px-3.5 py-2.5 focus:outline-none focus:border-gold text-white transition-colors"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="name@company.com"
                    className="bg-white/5 border border-white/10 rounded px-3.5 py-2.5 focus:outline-none focus:border-gold text-white transition-colors"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="E.g., Custom cap orders"
                    className="bg-white/5 border border-white/10 rounded px-3.5 py-2.5 focus:outline-none focus:border-gold text-white transition-colors"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9px] text-white/50 uppercase tracking-widest font-bold">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your wholesale or custom production query..."
                    className="bg-white/5 border border-white/10 rounded px-3.5 py-2.5 focus:outline-none focus:border-gold text-white resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-light text-black font-bold uppercase tracking-widest text-[10px] py-3.5 rounded transition-transform hover:scale-[1.02] cursor-pointer shadow-lg shadow-gold/15 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
