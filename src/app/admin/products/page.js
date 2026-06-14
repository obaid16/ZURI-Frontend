"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiRequest, getImageUrl } from "@/utils/api";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Loader2,
  Upload,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  Layers,
  Hash,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  IndianRupee
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  // Custom delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null); // holds product id to delete

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [moq, setMoq] = useState(50);
  const [stock, setStock] = useState(100);
  const [materialType, setMaterialType] = useState("");
  const [availableColors, setAvailableColors] = useState("Black, Gray, Navy");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState("");
  const [tiers, setTiers] = useState([{ qty: 50, price: 10 }]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = `/products?page=${page}&limit=10&search=${search}&category=${categoryFilter}`;
      const res = await apiRequest(q, "GET");
      if (res && res.success) {
        setProducts(res.products);
        setTotalPages(res.pages);
      }
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiRequest("/categories", "GET");
      if (res && res.success) setCategories(res.categories);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchProducts(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchCategories(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  // Lock body scroll when any modal/overlay is open
  useEffect(() => {
    if (isModalOpen || deleteConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, deleteConfirm]);


  const openModal = (prod = null) => {
    setModalError("");
    setModalSuccess("");
    setImageFiles([]);
    setImagePreviews([]);
    if (prod) {
      setEditingProduct(prod);
      setName(prod.name);
      setDescription(prod.description);
      setCategory(prod.category?._id || prod.category || "");
      setMoq(prod.moq);
      setStock(prod.stock);
      setMaterialType(prod.materialType);
      setAvailableColors(prod.availableColors?.join(", ") || "");
      setFeatured(prod.featured || false);
      setTags(prod.tags?.join(", ") || "");
      setTiers(prod.tiers && prod.tiers.length > 0 ? prod.tiers : [{ qty: 50, price: 10 }]);
      if (prod.images && prod.images.length > 0) {
        setImagePreviews(prod.images.map(img => getImageUrl(img)));
      }
    } else {
      setEditingProduct(null);
      setName("");
      setDescription("");
      setCategory(categories[0]?._id || "");
      setMoq(50);
      setStock(100);
      setMaterialType("");
      setAvailableColors("Black, Gray, Navy");
      setFeatured(false);
      setTags("");
      setTiers([{ qty: 50, price: 10 }]);
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) setImagePreviews(previews);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    setModalSuccess("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("moq", Number(moq));
      formData.append("stock", Number(stock));
      formData.append("materialType", materialType);
      formData.append("featured", featured);
      const colorsArr = availableColors.split(",").map(c => c.trim()).filter(Boolean);
      formData.append("availableColors", JSON.stringify(colorsArr));
      const tagsArr = tags.split(",").map(t => t.trim()).filter(Boolean);
      formData.append("tags", JSON.stringify(tagsArr));
      const validTiers = tiers.map(t => ({ qty: Number(t.qty), price: Number(t.price) }));
      formData.append("tiers", JSON.stringify(validTiers));
      imageFiles.forEach((file) => formData.append("images", file));

      let res;
      if (editingProduct) {
        res = await apiRequest(`/products/${editingProduct._id}`, "PUT", formData, true);
      } else {
        res = await apiRequest("/products", "POST", formData, true);
      }
      if (res && res.success) {
        setModalSuccess(editingProduct ? "Product updated successfully." : "Product registered successfully.");
        setTimeout(() => { setIsModalOpen(false); fetchProducts(); }, 1200);
      }
    } catch (err) {
      setModalError(err.message || "Failed to save product.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await apiRequest(`/products/${id}`, "DELETE");
      if (res && res.success) {
        setDeleteConfirm(null);
        fetchProducts();
      }
    } catch (err) {
      setDeleteConfirm(null);
      alert(err.message || "Failed to delete product.");
    }
  };

  const addTier = () => setTiers([...tiers, { qty: moq, price: 5 }]);
  const removeTier = (index) => setTiers(tiers.filter((_, i) => i !== index));
  const updateTier = (index, field, value) => {
    const updated = [...tiers];
    updated[index][field] = Number(value);
    setTiers(updated);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-extrabold uppercase tracking-widest text-white">
            Product <span className="text-[#10b7ff]">Catalog</span>
          </h1>
          <p className="text-white/30 text-[11px] mt-1.5 font-medium">
            Manage listings, pricing tiers, stock quantities, and media.
          </p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="inline-flex items-center space-x-2 bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-4 py-2.5 rounded-lg font-black uppercase tracking-wider transition-all text-[10px] shadow-lg shadow-[#10b7ff]/15 hover:shadow-[#10b7ff]/25 hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Products", value: products.length || "–", icon: Package, color: "#10b7ff" },
          { label: "Featured", value: products.filter(p => p.featured).length || "–", icon: Star, color: "#f59e0b" },
          { label: "Low Stock", value: products.filter(p => p.stock < 10).length || "0", icon: AlertCircle, color: "#ef4444" },
          { label: "Categories", value: categories.length || "–", icon: Layers, color: "#a78bfa" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-4 py-3.5 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="font-serif text-base font-black text-white">{value}</p>
              <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/25" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-[11px] text-white placeholder-white/25 focus:outline-none focus:border-[#10b7ff]/50 transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-2.5 w-4 h-4 text-white/25" />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-[11px] text-white focus:outline-none focus:border-[#10b7ff]/50 transition-all cursor-pointer appearance-none"
          >
            <option value="" className="bg-[#0a0a0a]">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-[#0a0a0a]">{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 space-y-4">
          <Loader2 className="w-7 h-7 text-[#10b7ff] animate-spin" />
          <span className="text-white/30 tracking-widest text-[10px] uppercase font-bold">Loading catalog...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-dashed border-white/[0.08] rounded-xl py-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/30 font-bold text-[11px] uppercase tracking-wider">No products found in catalog</p>
          <button
            onClick={() => openModal(null)}
            className="bg-[#10b7ff]/10 hover:bg-[#10b7ff]/20 border border-[#10b7ff]/20 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#10b7ff] cursor-pointer transition-all"
          >
            + Create First Product
          </button>
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-[9px] text-white/25 uppercase tracking-[0.2em] font-black">
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">MOQ</th>
                  <th className="py-3.5 px-5">Stock</th>
                  <th className="py-3.5 px-5">Price Tiers</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {products.map((prod) => (
                  <tr key={prod._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/5 border border-white/[0.07] shrink-0">
                          <img
                            src={getImageUrl(prod.images?.[0]) || "https://placehold.co/80x80/0a0a0a/10b7ff?text=IMG"}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-[11px] truncate">{prod.name}</span>
                            {prod.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                          </div>
                          <span className="text-[9px] text-white/30 font-semibold block mt-0.5 truncate uppercase tracking-wide">
                            {prod.materialType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-[9px] bg-white/[0.05] border border-white/[0.08] px-2 py-1 rounded-md uppercase font-bold text-white/50">
                        {prod.category?.name || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-white/60 font-semibold text-[11px]">
                      {prod.moq} <span className="text-white/25">units</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        prod.stock < 10
                          ? "bg-red-950/30 text-red-400 border border-red-500/20"
                          : "bg-emerald-950/30 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        <span>{prod.stock}</span>
                        <span className="opacity-60">units</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-wrap gap-1">
                        {prod.tiers?.map((t, idx) => (
                          <span key={idx} className="bg-[#10b7ff]/8 border border-[#10b7ff]/15 text-[#10b7ff] text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                            {t.qty}+: ₹{t.price}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openModal(prod)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-[#10b7ff] hover:bg-[#10b7ff]/10 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(prod._id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="border-t border-white/[0.06] px-5 py-3.5 flex items-center justify-between">
              <span className="text-white/25 font-bold uppercase tracking-wider text-[9px]">
                Page {page} of {totalPages}
              </span>
              <div className="flex space-x-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/5 disabled:opacity-30 text-white cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/5 disabled:opacity-30 text-white cursor-pointer transition-all"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d0d0d] border border-white/[0.1] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-xs">
            <div className="w-10 h-10 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white text-center mb-2">Delete Product?</h4>
            <p className="text-white/40 text-center text-[11px] leading-relaxed mb-6">This will permanently remove the product from the catalog. This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/[0.08] px-4 py-2.5 rounded-lg font-bold uppercase tracking-wider text-white/60 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-lg font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-900/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-[#0a0a0a] border border-white/[0.09] w-full max-w-2xl rounded-2xl shadow-2xl text-xs flex flex-col" style={{maxHeight: '90vh'}}>

            {/* Modal Header — sticky */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] bg-[#0d0d0d] rounded-t-2xl shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#10b7ff]/10 border border-[#10b7ff]/20 flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#10b7ff]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-black uppercase tracking-widest text-white">
                    {editingProduct ? "Edit Product" : "New Product"}
                  </h3>
                  <p className="text-[9px] text-white/30 font-semibold mt-0.5">
                    {editingProduct ? `Modifying: ${editingProduct.name}` : "Register a new catalog item"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1">
              {/* Alerts */}
              {modalError && (
                <div className="mx-6 mt-4 bg-red-950/25 border border-red-500/20 text-red-400 p-3 rounded-lg font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}
              {modalSuccess && (
                <div className="mx-6 mt-4 bg-emerald-950/25 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg font-semibold flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{modalSuccess}</span>
                </div>
              )}

            <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-6">

              {/* Basic Details */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25 mb-3 flex items-center space-x-2">
                  <span className="inline-block w-3 h-px bg-white/20" />
                  <span>Basic Details</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Product Title *</label>
                    <input
                      type="text" required value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. 5 Panel Twill Snapback"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all placeholder-white/20"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Category *</label>
                    <select
                      required value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all cursor-pointer"
                    >
                      <option value="" disabled className="bg-[#0a0a0a]">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id} className="bg-[#0a0a0a]">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Material / Composition *</label>
                    <input
                      type="text" required value={materialType}
                      onChange={(e) => setMaterialType(e.target.value)}
                      placeholder="e.g. 100% Brushed Cotton"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all placeholder-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Stock & Quantities */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25 mb-3 flex items-center space-x-2">
                  <span className="inline-block w-3 h-px bg-white/20" />
                  <span>Inventory</span>
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">MOQ (Min Order) *</label>
                    <input
                      type="number" required min="1" value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Stock Quantity *</label>
                    <input
                      type="number" required min="0" value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Tiers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25 flex items-center space-x-2">
                    <span className="inline-block w-3 h-px bg-white/20" />
                    <span>Wholesale Price Tiers</span>
                  </p>
                  <button
                    type="button" onClick={addTier}
                    className="flex items-center space-x-1 text-[#10b7ff] hover:text-[#10b7ff]/80 font-bold text-[9px] uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Tier</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {tiers.map((tier, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-3">
                      <div className="w-5 h-5 rounded-full bg-[#10b7ff]/10 border border-[#10b7ff]/20 flex items-center justify-center text-[#10b7ff] text-[8px] font-black shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <label className="text-[8px] text-white/30 uppercase font-bold tracking-wider block mb-1">Min Qty</label>
                        <input
                          type="number" required value={tier.qty}
                          onChange={(e) => updateTier(index, "qty", e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2.5 py-1.5 text-center text-white text-[11px] focus:outline-none focus:border-[#10b7ff]/60"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[8px] text-white/30 uppercase font-bold tracking-wider block mb-1">Price (₹)</label>
                        <input
                          type="number" step="0.01" required value={tier.price}
                          onChange={(e) => updateTier(index, "price", e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2.5 py-1.5 text-center text-white text-[11px] focus:outline-none focus:border-[#10b7ff]/60"
                        />
                      </div>
                      <button
                        type="button" onClick={() => removeTier(index)}
                        disabled={tiers.length === 1}
                        className="p-1 text-white/20 hover:text-red-400 disabled:opacity-20 cursor-pointer transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Description *</label>
                <textarea
                  required rows="3" value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the product specifications, structure type, adjustment details..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all resize-none placeholder-white/20"
                />
              </div>

              {/* Image Upload */}
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25 mb-3 flex items-center space-x-2">
                  <span className="inline-block w-3 h-px bg-white/20" />
                  <span>Product Images</span>
                </p>
                <div className="border border-dashed border-white/[0.1] rounded-xl p-8 hover:border-[#10b7ff]/30 transition-colors relative flex flex-col items-center justify-center space-y-2 cursor-pointer bg-white/[0.01] group">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#10b7ff]/10 flex items-center justify-center transition-colors">
                    <Upload className="w-5 h-5 text-white/30 group-hover:text-[#10b7ff]/60 transition-colors" />
                  </div>
                  <p className="font-bold text-white/40 group-hover:text-white/60 transition-colors text-[11px]">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-[9px] text-white/20">Up to 5 images (JPEG, PNG, WebP)</p>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/[0.1] bg-black group">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center space-x-1.5">
                    <Tag className="w-3 h-3" />
                    <span>Available Colors</span>
                  </label>
                  <input
                    type="text" value={availableColors}
                    onChange={(e) => setAvailableColors(e.target.value)}
                    placeholder="Black, Navy, Off-white"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all placeholder-white/20"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold flex items-center space-x-1.5">
                    <Hash className="w-3 h-3" />
                    <span>Tags</span>
                  </label>
                  <input
                    type="text" value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="trucker, cap, blank, accessories"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#10b7ff]/60 text-white text-[11px] transition-all placeholder-white/20"
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3.5">
                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-[11px] font-bold text-white/70">Mark as Featured</p>
                    <p className="text-[9px] text-white/30 mt-0.5">Featured products appear in the homepage showcase</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`relative w-10 h-5 rounded-full transition-all cursor-pointer ${featured ? "bg-amber-400" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${featured ? "left-5" : "left-0.5"}`} />
                </button>
              </div>

            </form>
            </div>{/* end scrollable body */}

            {/* Sticky footer */}
            <div className="flex justify-end space-x-3 px-6 py-4 border-t border-white/[0.06] bg-[#0a0a0a] rounded-b-2xl shrink-0">
              <button
                type="button" onClick={() => setIsModalOpen(false)}
                className="bg-white/5 hover:bg-white/10 border border-white/[0.08] px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider text-white/60 hover:text-white transition-all cursor-pointer text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit" form="product-form" disabled={modalLoading}
                className="bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-6 py-2.5 rounded-lg font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-2 text-[10px] shadow-lg shadow-[#10b7ff]/20"
              >
                {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingProduct ? "Save Changes" : "Register Product"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
