"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import {
  TrendingUp,
  Package,
  Users,
  MailOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  FilePlus,
  Loader2,
  DollarSign,
  Settings as SettingsIcon
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await apiRequest("/dashboard/analytics", "GET");
        if (res && res.success) {
          setData(res.analytics);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-xs">
        {/* Header skeleton */}
        <div className="h-8 w-1/4 bg-white/5 rounded" />

        {/* Stats Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-matte-black border border-white/5 rounded-xl" />
          ))}
        </div>

        {/* Dynamic content area skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-matte-black border border-white/5 rounded-xl" />
          <div className="h-96 bg-matte-black border border-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/25 bg-red-950/10 p-6 rounded-xl text-center space-y-4 max-w-lg mx-auto mt-12 text-xs">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <h3 className="font-bold text-white uppercase tracking-wider">Dashboard Error</h3>
        <p className="text-white/60">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError("");
            window.location.reload();
          }}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-semibold uppercase tracking-wider cursor-pointer"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const { products, inquiries, users, financials, recentInquiries = [] } = data || {};

  const stats = [
    {
      name: "Estimated Sales Value",
      value: `₹${(financials?.estimatedSalesValue || 0).toLocaleString("en-IN")}`,
      desc: "Valuation from reviewed/completed orders",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      name: "Total Products",
      value: products?.total || 0,
      desc: `${products?.featured || 0} Products marked as Featured`,
      icon: Package,
      color: "text-[#10b7ff]",
      bg: "bg-[#10b7ff]/10 border-[#10b7ff]/20",
    },
    {
      name: "Wholesale Inquiries",
      value: inquiries?.total || 0,
      desc: `${inquiries?.pending || 0} pending review`,
      icon: MailOpen,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      name: "Registered Clients",
      value: users?.totalClients || 0,
      desc: "Verified B2B portal accounts",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-white">
            Overview <span className="text-gold-gradient">Console</span>
          </h1>
          <p className="text-white/50 text-xs mt-1">
            Real-time operations, B2B procurement pipelines, and active wholesale inquiries.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-4 py-2 rounded-lg font-bold uppercase tracking-wider transition-colors cursor-pointer text-[10px]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer text-[10px]"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Write Blog</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`bg-matte-black border rounded-xl p-6 relative overflow-hidden group hover:border-[#10b7ff]/30 transition-all duration-300 ${stat.bg}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold">
                    {stat.name}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-white">{stat.value}</h3>
                </div>
                <div className={`p-2.5 rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-white/40 mt-4 font-semibold tracking-wider">
                {stat.desc}
              </p>
              {/* Cyan inner glow effect */}
              <div className="absolute inset-0 bg-[#10b7ff]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* PRIMARY PIPELINES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-matte-black border border-white/5 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                Recent Wholesale Inquiries
              </h3>
              <Link
                href="/admin/inquiries"
                className="text-[10px] text-[#10b7ff] hover:underline font-bold uppercase tracking-wider"
              >
                View All
              </Link>
            </div>

            {recentInquiries.length === 0 ? (
              <div className="py-12 text-center text-white/40 font-semibold space-y-2 border border-dashed border-white/5 rounded-lg">
                <MailOpen className="w-8 h-8 mx-auto text-white/20" />
                <p>No customer inquiries have been submitted yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentInquiries.map((inq) => {
                  const statusColors = {
                    pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
                    reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/25",
                    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
                  };
                  return (
                    <div key={inq._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-xs">{inq.name}</p>
                        <p className="text-white/50 text-[10px]">
                          {inq.company} • {inq.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-white/40">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider border ${
                            statusColors[inq.status] || statusColors.pending
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Logs & System Status */}
        <div className="bg-matte-black border border-white/5 rounded-xl p-6 space-y-6">
          <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
            Quick Actions Console
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:border-[#10b7ff]/30 hover:bg-[#10b7ff]/5 transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-[#10b7ff]" />
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Manage Inventory</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/inquiries"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:border-[#10b7ff]/30 hover:bg-[#10b7ff]/5 transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <MailOpen className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Process Inquiries</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-lg hover:border-[#10b7ff]/30 hover:bg-[#10b7ff]/5 transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <SettingsIcon className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">Store Configuration</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline helper component since lucide chevron-right isn't explicitly imported
function ChevronRight(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
