"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/utils/api";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  Search,
  Eye,
  CheckCircle2,
  Edit,
  ArrowRight
} from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search/Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form Fields
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("Fabric Design");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [status, setStatus] = useState("draft");
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Admin request gets all blogs (including draft status)
      const res = await apiRequest("/blogs", "GET");
      if (res && res.success) {
        setBlogs(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load blogs CMS feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (blog = null) => {
    setModalError("");
    if (blog) {
      setEditingBlog(blog);
      setTitle(blog.title);
      setExcerpt(blog.excerpt);
      setContent(blog.content);
      setCoverImage(blog.coverImage);
      setCategory(blog.category || "Fabric Design");
      setTags(blog.tags?.join(", ") || "");
      setReadTime(blog.readTime || "5 min read");
      setStatus(blog.status || "draft");
      setSeoTitle(blog.seo?.title || "");
      setSeoDescription(blog.seo?.description || "");
      setSeoKeywords(blog.seo?.keywords || "");
    } else {
      setEditingBlog(null);
      setTitle("");
      setExcerpt("");
      setContent("");
      setCoverImage("");
      setCategory("Fabric Design");
      setTags("");
      setReadTime("5 min read");
      setStatus("draft");
      setSeoTitle("");
      setSeoDescription("");
      setSeoKeywords("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");

    const payload = {
      title,
      excerpt,
      content,
      coverImage: coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
      category,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      readTime,
      status,
      seo: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
      },
    };

    try {
      let res;
      if (editingBlog) {
        res = await apiRequest(`/blogs/${editingBlog._id}`, "PUT", payload);
      } else {
        res = await apiRequest("/blogs", "POST", payload);
      }

      if (res && res.success) {
        setIsModalOpen(false);
        fetchBlogs();
      }
    } catch (err) {
      setModalError(err.message || "Failed to save blog post.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await apiRequest(`/blogs/${id}`, "DELETE");
      if (res && res.success) {
        fetchBlogs();
      }
    } catch (err) {
      alert(err.message || "Failed to delete blog post.");
    }
  };

  // Filter blogs locally
  const filteredBlogs = blogs.filter((blog) => {
    const query = search.toLowerCase();
    const matchesSearch =
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "" || blog.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="font-serif text-2xl font-extrabold uppercase tracking-widest text-white">
            Blog <span className="text-gold-gradient">CMS</span>
          </h1>
          <p className="text-white/50 text-xs mt-1">
            Publish guides, updates, manufacturing walkthroughs, and industry insight articles.
          </p>
        </div>
        <button
          onClick={() => openModal(null)}
          className="flex items-center space-x-2 bg-[#10b7ff] hover:bg-[#10b7ff]/90 text-black px-4 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors cursor-pointer text-[10px]"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </button>
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
            placeholder="Search by title, excerpt, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#10b7ff] transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative min-w-[180px]">
          <span className="absolute left-3 top-3 text-white/40">
            <Search className="w-4 h-4" /> {/* Standard Filter Icon placeholder */}
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b7ff] transition-all cursor-pointer appearance-none animate-fade-in"
          >
            <option value="" className="bg-[#050505] text-white">All Statuses</option>
            <option value="draft" className="bg-[#050505] text-white">Draft</option>
            <option value="published" className="bg-[#050505] text-white">Published</option>
          </select>
        </div>
      </div>

      {/* Main CMS Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 text-[#10b7ff] animate-spin" />
          <span className="text-white/60 tracking-wider">Loading articles...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-matte-black border border-white/5 rounded-xl py-16 text-center space-y-4 border-dashed animate-fade-in">
          <FileText className="w-12 h-12 text-white/20 mx-auto" />
          <p className="text-white/40 font-bold">No blog posts found in records.</p>
          <button
            onClick={() => openModal(null)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider text-[#10b7ff] cursor-pointer"
          >
            Compose First Article
          </button>
        </div>
      ) : (
        <div className="bg-matte-black border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-extrabold bg-white/2">
                  <th className="py-4 px-6">Article Information</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Publish Status</th>
                  <th className="py-4 px-6">Author</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-semibold text-white/80">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 px-6 flex items-center space-x-4">
                      <img
                        src={blog.coverImage || "https://placehold.co/120x80/050505/10b7ff?text=No+Image"}
                        alt={blog.title}
                        className="w-16 h-10 rounded object-cover border border-white/5"
                      />
                      <div>
                        <span className="font-bold text-white text-xs block">{blog.title}</span>
                        <span className="text-[10px] text-white/40 mt-0.5 block truncate max-w-sm">
                          {blog.excerpt}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-bold text-white/70">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider border ${
                        blog.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : "bg-white/5 text-white/50 border-white/10"
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white/50">
                      {blog.author?.name || "Admin"}
                    </td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => openModal(blog)}
                        className="text-white/60 hover:text-[#10b7ff] hover:bg-white/5 p-1.5 rounded transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
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
          <div className="relative bg-matte-black border border-white/10 w-full max-w-2xl rounded-xl shadow-2xl p-6 md:p-8 animate-fade-in my-8 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-white">
                {editingBlog ? "Modify Blog Article" : "Compose Blog Article"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Buckram Shaper Selection Guide"
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                    Category Segment
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors cursor-pointer"
                  >
                    <option value="Fabric Design" className="bg-[#050505]">Fabric Design</option>
                    <option value="Sourcing Guide" className="bg-[#050505]">Sourcing Guide</option>
                    <option value="Manufacturing" className="bg-[#050505]">Manufacturing</option>
                    <option value="Company Update" className="bg-[#050505]">Company Update</option>
                  </select>
                </div>

                {/* Read time */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                    Read Time Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                    Publish Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors cursor-pointer"
                  >
                    <option value="draft" className="bg-[#050505]">Draft (Hidden)</option>
                    <option value="published" className="bg-[#050505]">Published (Live)</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Excerpt Summary
                </label>
                <input
                  type="text"
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Provide brief article highlights..."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                />
              </div>

              {/* Cover Image URL */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                />
              </div>

              {/* Content Markup Editor */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Article Content (Markdown or plain HTML)
                </label>
                <textarea
                  rows="8"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full post contents here..."
                  className="w-full bg-white/5 border border-white/10 rounded p-4 focus:outline-none focus:border-[#10b7ff] text-white font-mono transition-colors resize-none text-[11px]"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. buckram, materials, caps"
                  className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 focus:outline-none focus:border-[#10b7ff] text-white transition-colors"
                />
              </div>

              {/* SEO Sub-section */}
              <div className="border border-white/5 rounded-lg p-4 bg-white/2 space-y-4">
                <span className="font-bold text-white/70 uppercase tracking-widest text-[9px]">
                  SEO Configuration (Optional overrides)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] text-white/40 uppercase tracking-wider font-bold">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#10b7ff] text-white"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[9px] text-white/40 uppercase tracking-wider font-bold">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#10b7ff] text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] text-white/40 uppercase tracking-wider font-bold">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-[#10b7ff] text-white"
                  />
                </div>
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
                  <span>{editingBlog ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
