"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Clock, User, X } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/api";

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch("/api/v1/blogs");
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data.blogs) {
            setBlogs(data.blogs);
          }
        }
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="relative min-h-screen py-12 md:py-20 px-4 sm:px-6 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-extrabold mb-3 block">
            Industry Insights & Guides
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold uppercase tracking-widest text-white leading-tight">
            Zuri <span className="text-gold-gradient">Insights</span>
          </h1>
          <div className="w-16 h-[2px] bg-gold mx-auto mt-4 mb-4" />
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Review structural specifications, sourcing comparisons, and custom embroidery guides compiled by our fabric design specialists.
          </p>
        </div>

        {/* Grid of articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gold py-12 uppercase tracking-widest text-xs">
              Loading Articles...
            </div>
          ) : blogs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/55 border border-white/5 rounded-2xl bg-navy-light/30 w-full">
              <p className="text-xs uppercase tracking-widest">No articles available.</p>
            </div>
          ) : (
            blogs.map((post) => {
              const blogId = post._id || post.id;
              const image = getImageUrl(post.coverImage || post.image);
              const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : post.date;

              return (
                <div
                  key={blogId}
                  onClick={() => setSelectedPost({ ...post, image, formattedDate })}
                  className="group bg-matte-black border border-white/5 rounded-xl overflow-hidden hover:border-gold/20 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="bg-gold/10 text-gold border border-gold/25 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider inline-block mb-4">
                        {post.category}
                      </span>
                      
                      <h3 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mt-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6 text-[10px] text-white/40">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime || "5 min read"}</span>
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* DETAILED ARTICLE PREVIEW POPUP */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
            <div className="relative bg-matte-gray border border-gold/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden p-6 md:p-8 animate-fade-in my-8">
              {/* Close */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 text-white/60 hover:text-gold transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mt-2 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  width={800}
                  height={256}
                  unoptimized
                  className="w-full h-64 object-cover rounded-lg border border-white/5"
                />

                <div className="flex flex-wrap items-center gap-4 text-[10px] text-gold uppercase tracking-wider font-bold">
                  <span>{selectedPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 font-normal text-white/40">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedPost.formattedDate || selectedPost.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 font-normal text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedPost.readTime || "5 min read"}</span>
                  </span>
                </div>

                <h2 className="font-serif text-xl md:text-2xl font-extrabold text-white uppercase leading-snug">
                  {selectedPost.title}
                </h2>

                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line border-t border-white/5 pt-4">
                  {selectedPost.content}
                </p>

                <div className="flex items-center space-x-2 border-t border-white/5 pt-4 mt-6 text-xs text-white/40">
                  <User className="w-4 h-4 text-gold" />
                  <span>Written by:</span>
                  <span className="text-white font-bold">{typeof selectedPost.author === 'object' ? selectedPost.author.name : (selectedPost.author || "Admin")}</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
