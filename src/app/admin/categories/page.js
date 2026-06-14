"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Upload
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/categories", "GET");
      if (res && res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (cat = null) => {
    setModalError("");
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description || "");
      setImage(cat.image || "");
    } else {
      setEditingCategory(null);
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
    }
    setIsModalOpen(true);
  };

  // Generate slug dynamically from name
  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    const payload = { name, slug, description, image };

    try {
      let res;
      if (editingCategory) {
        res = await apiRequest(`/categories/${editingCategory._id}`, "PUT", payload);
      } else {
        res = await apiRequest("/categories", "POST", payload);
      }

      if (res && res.success) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      setModalError(err.message || "Failed to save category.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category? All products using it will be marked as uncategorized.")) return;
    try {
      const res = await apiRequest(`/categories/${id}`, "DELETE");
      if (res && res.success) {
        fetchCategories();
      }
    } catch (err) {
      alert(err.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-serif text-2xl font-extrabold uppercase tracking-widest text-white">
            Category <span className="text-gold-gradient">Classification</span>
          </h1>
          <p className="text-white/50 text-xs mt-1">
            Define classification segments, matching B2B filters and catalog routing.
          </p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="flex items-center space-x-2 bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-4 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors cursor-pointer text-[10px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 text-[#10b7ff] animate-spin" />
          <span className="text-white/60 tracking-wider">Loading classifications...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-matte-black border border-white/5 rounded-xl py-16 text-center space-y-4 border-dashed animate-fade-in">
          <FolderTree className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white/40 font-bold">No categories registered yet.</p>
          <button
            onClick={() => openModal(null)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider text-[#10b7ff] cursor-pointer"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="bg-matte-black border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-extrabold bg-white/2">
                  <th className="py-4 px-6">Classification Name</th>
                  <th className="py-4 px-6">Route Slug</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-white/80">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <img
                        src={cat.image || "https://placehold.co/80x80/050505/10b7ff?text=No+Image"}
                        alt={cat.name}
                        className="w-10 h-10 rounded object-cover border border-white/5"
                      />
                      <span className="font-bold text-white text-xs">{cat.name}</span>
                    </td>
                    <td className="py-4 px-6 text-[10px] text-[#10b7ff] font-extrabold tracking-wider">
                      /{cat.slug}
                    </td>
                    <td className="py-4 px-6 text-white/50 max-w-sm truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => openModal(cat)}
                        className="text-white/60 hover:text-[#10b7ff] hover:bg-white/5 p-1.5 rounded transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-white/60 hover:text-red-400 hover:bg-red-950/20 p-1.5 rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-matte-black border border-white/10 w-full max-w-md rounded-xl shadow-2xl p-6 md:p-8 animate-fade-in my-8 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                {editingCategory ? "Modify Category" : "Register New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="bg-red-950/20 border border-red-500/25 text-red-400 p-3 rounded font-semibold text-center mb-6 leading-normal">
                {modalError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Premium Threads"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Url Route Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. premium-threads"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-[#10b7ff] font-extrabold tracking-wider transition-colors"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide category description details..."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded font-bold uppercase tracking-wider text-white transition-colors cursor-pointer text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-6 py-2.5 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer flex items-center space-x-2 text-[10px]"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
