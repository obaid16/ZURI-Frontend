"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import {
  Users,
  Search,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Phone,
  Building
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/auth/users", "GET");
      if (res && res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load user records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleAdmin = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const msg = `Are you sure you want to change ${user.name}'s role to ${newRole.toUpperCase()}?`;
    if (!confirm(msg)) return;

    setUpdatingId(user._id);
    try {
      const res = await apiRequest(`/auth/users/${user._id}`, "PUT", { role: newRole });
      if (res && res.success) {
        setUsers(prev =>
          prev.map(u => (u._id === user._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      const res = await apiRequest(`/auth/users/${id}`, "DELETE");
      if (res && res.success) {
        setUsers(prev => prev.filter(u => u._id !== id));
      }
    } catch (err) {
      alert(err.message || "Failed to delete user account.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.company.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query))
    );
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-extrabold uppercase tracking-widest text-white">
          Client <span className="text-gold-gradient">Profiles</span>
        </h1>
        <p className="text-white/50 text-xs mt-1">
          Monitor wholesale client accounts, coordinate portal access, and authorize administrator roles.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-matte-black border border-white/5 rounded-xl p-4">
        <div className="relative">
          <span className="absolute left-3 top-3 text-white/40">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search accounts by name, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#10b7ff] transition-all"
          />
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 text-[#10b7ff] animate-spin" />
          <span className="text-white/60 tracking-wider">Loading registered profiles...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-matte-black border border-white/5 rounded-xl py-16 text-center space-y-4 border-dashed animate-fade-in">
          <Users className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white/40 font-bold">No user accounts found matching query.</p>
        </div>
      ) : (
        <div className="bg-matte-black border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-extrabold bg-white/2">
                  <th className="py-4 px-6">User / Contact Details</th>
                  <th className="py-4 px-6">Company / Entity</th>
                  <th className="py-4 px-6">Access Role</th>
                  <th className="py-4 px-6">Created On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-white/80">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-white text-xs block">{u.name}</span>
                        <span className="text-[10px] text-white/40 mt-0.5 block">
                          {u.email} • {u.phone || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white/70">
                      {u.company}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider border ${
                        u.role === "admin"
                          ? "bg-[#10b7ff]/10 text-[#10b7ff] border-[#10b7ff]/25"
                          : "bg-white/5 text-white/50 border-white/10"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white/50">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      {updatingId === u._id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#10b7ff] inline-block" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            className="text-white/60 hover:text-[#10b7ff] hover:bg-white/5 p-1.5 rounded transition-all cursor-pointer inline-flex items-center space-x-1"
                            title={u.role === "admin" ? "Demote to standard client" : "Promote to administrator"}
                          >
                            {u.role === "admin" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="text-white/60 hover:text-red-400 hover:bg-red-950/20 p-1.5 rounded transition-all cursor-pointer inline-flex items-center"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
