"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import {
  MailWarning,
  Search,
  Filter,
  Eye,
  Loader2,
  X,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Phone,
  Building,
  Mail
} from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search/Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Detail Drawer state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/inquiries", "GET");
      if (res && res.success) {
        setInquiries(res.inquiries);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch wholesale inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await apiRequest(`/inquiries/${id}/status`, "PUT", { status: newStatus });
      if (res && res.success) {
        // Update local list
        setInquiries(prev =>
          prev.map(inq => (inq._id === id ? { ...inq, status: newStatus } : inq))
        );
        // Update active drawer if open
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.message || "Failed to update inquiry status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "reviewed":
        return <Clock className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
    }
  };

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/25",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  };

  // Filter local inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const query = search.toLowerCase();
    const matchesSearch =
      inq.name.toLowerCase().includes(query) ||
      inq.company.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      (inq.phone && inq.phone.includes(query)) ||
      (inq.details && inq.details.toLowerCase().includes(query));

    const matchesStatus = statusFilter === "" || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs relative">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-extrabold uppercase tracking-widest text-white">
          Wholesale <span className="text-gold-gradient">Inquiries</span>
        </h1>
        <p className="text-white/50 text-xs mt-1">
          Review bulk sourcing inquiries, customize quotes, check B2B attachments, and update status.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-matte-black border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-grow">
          <span className="absolute left-3 top-3 text-white/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, company, email, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#10b7ff] transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[180px]">
          <span className="absolute left-3 top-3 text-white/40">
            <Filter className="w-4 h-4" />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b7ff] transition-all cursor-pointer appearance-none"
          >
            <option value="" className="bg-[#050505] text-white">All Statuses</option>
            <option value="pending" className="bg-[#050505] text-white">Pending</option>
            <option value="reviewed" className="bg-[#050505] text-white">Reviewed</option>
            <option value="completed" className="bg-[#050505] text-white">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Content Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 text-[#10b7ff] animate-spin" />
          <span className="text-white/60 tracking-wider">Loading inquiries...</span>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="bg-matte-black border border-white/5 rounded-xl py-16 text-center space-y-4 border-dashed">
          <MailWarning className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white/40 font-bold">No sourcing tickets match the active filters.</p>
        </div>
      ) : (
        <div className="bg-matte-black border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-extrabold bg-white/2">
                  <th className="py-4 px-6">Company / Inquirer</th>
                  <th className="py-4 px-6">Received Date</th>
                  <th className="py-4 px-6">Pipeline Items</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-white/80">
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-white text-xs block">{inq.company}</span>
                        <span className="text-[10px] text-white/50 mt-0.5 block">
                          {inq.name} • {inq.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white/50">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/30" />
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-white/5 border border-white/10 text-white/70 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        {inq.items?.length || 0} styles requested
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider border flex items-center space-x-1.5 w-fit ${statusColors[inq.status]}`}>
                        {getStatusIcon(inq.status)}
                        <span>{inq.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="text-white/60 hover:text-[#10b7ff] hover:bg-white/5 p-1.5 rounded transition-all cursor-pointer inline-flex items-center space-x-1 uppercase text-[9px] tracking-wider font-extrabold border border-white/10"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILS SLIDE-OUT DRAWER OVERLAY */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedInquiry(null)}
          />
          
          {/* Drawer Body */}
          <div className="relative w-full max-w-lg bg-matte-black border-l border-white/10 h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between z-10 animate-slide-in overflow-y-auto">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                    Inquiry Details
                  </h3>
                  <span className="text-[10px] text-white/40 font-bold block mt-1">
                    Ticket ID: #{selectedInquiry._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-white/60 hover:text-white p-1 rounded hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Console */}
              <div className="bg-white/2 border border-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
                <span className="font-bold text-white/70 uppercase tracking-widest text-[9px]">
                  Pipeline Stage
                </span>
                <select
                  value={selectedInquiry.status}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusUpdate(selectedInquiry._id, e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#10b7ff] focus:outline-none focus:border-[#10b7ff] cursor-pointer"
                >
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Reviewed (Contacted)</option>
                  <option value="completed">Completed (Sourced)</option>
                </select>
              </div>

              {/* Client Profile */}
              <div className="space-y-4 mb-8">
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-white/90">
                  Client Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-white/70">
                    <Building className="w-4 h-4 text-white/40" />
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase font-bold tracking-wider">Company</span>
                      <span className="font-bold text-white text-xs">{selectedInquiry.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <User className="w-4 h-4 text-white/40" />
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase font-bold tracking-wider">Primary Contact</span>
                      <span className="font-bold text-white text-xs">{selectedInquiry.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <Mail className="w-4 h-4 text-white/40" />
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase font-bold tracking-wider">Email</span>
                      <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-[#10b7ff] hover:underline text-xs">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <Phone className="w-4 h-4 text-white/40" />
                    <div>
                      <span className="text-[10px] text-white/40 block uppercase font-bold tracking-wider">Phone</span>
                      <span className="font-bold text-white text-xs">{selectedInquiry.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirement details */}
              <div className="space-y-2 mb-8">
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-white/90">
                  Notes & Details
                </h4>
                <p className="bg-white/5 border border-white/5 rounded-lg p-4 font-semibold text-white/70 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedInquiry.details}
                </p>
              </div>

              {/* Items Table */}
              <div className="space-y-3 mb-8">
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-white/90">
                  Requested Items
                </h4>
                <div className="border border-white/5 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/2 border-b border-white/5 text-[9px] uppercase tracking-wider text-white/40 font-extrabold">
                        <th className="py-2.5 px-4">Item Name</th>
                        <th className="py-2.5 px-4 text-center">Color</th>
                        <th className="py-2.5 px-4 text-center">Qty</th>
                        <th className="py-2.5 px-4 text-right">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-bold text-white/70 text-[10px]">
                      {selectedInquiry.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-4">{item.product?.name || "Custom Manufacturing Style"}</td>
                          <td className="py-2.5 px-4 text-center text-white/50">{item.color}</td>
                          <td className="py-2.5 px-4 text-center">{item.quantity}</td>
                          <td className="py-2.5 px-4 text-right text-[#10b7ff]">₹{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attachments */}
              {selectedInquiry.attachments && selectedInquiry.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-white/90">
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 bg-white/5 border border-white/10 hover:border-[#10b7ff]/30 px-3 py-2 rounded text-[10px] uppercase font-bold tracking-wider text-white hover:text-[#10b7ff] transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Attachment {idx + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/5 mt-8 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded font-bold uppercase tracking-wider text-white transition-colors cursor-pointer text-[10px]"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
