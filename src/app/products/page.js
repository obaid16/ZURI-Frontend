"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, Eye, ShoppingCart, X, BadgeAlert } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { useQuote } from "@/components/QuoteContext";
import { getImageUrl } from "@/utils/api";
import { gsap } from "gsap";

function EditorialCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToQuote } = useQuote();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [previewProduct, setPreviewProduct] = useState(null);
  const previewModalRef = useRef(null);

  // Sync category param from URL search parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/v1/categories");
        if (!res.ok) {
          console.warn(`Categories API returned ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data && data.success && data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Load Products dynamically based on filters
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let url = `/api/v1/products?limit=50`;
        if (selectedCategory !== "all") {
          url += `&category=${selectedCategory}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (sortBy !== "default") {
          url += `&sort=${sortBy}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`Products API returned ${res.status}`);
          setProducts(PRODUCTS);
          return;
        }
        const data = await res.json();
        if (data && data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to load products from API:", err);
        // Fall back to static mock array
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchQuery, sortBy]);

  const MATERIALS = ["Cotton", "Polyester", "Nylon", "Wool", "Mesh"];

  const toggleMaterial = (mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleOpenPreview = (product) => {
    setPreviewProduct(product);
    setTimeout(() => {
      if (previewModalRef.current) {
        gsap.fromTo(
          previewModalRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }, 50);
  };

  const handleClosePreview = () => {
    if (previewModalRef.current) {
      gsap.to(previewModalRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setPreviewProduct(null)
      });
    } else {
      setPreviewProduct(null);
    }
  };

  const handleQuickAdd = (product) => {
    addToQuote(product, product.moq);
    alert(`Added MOQ (${product.moq} ${product.unit || "pc"}s) of ${product.name} to Quote List.`);
  };

  const displayCategories = categories.length > 0 ? categories : CATEGORIES;
  const displayProducts = products.length > 0 ? products : PRODUCTS;

  const getCategoryName = (prod) => {
    if (!prod.category) return "";
    if (typeof prod.category === "object") {
      return prod.category.slug || prod.category.name || "";
    }
    return prod.category;
  };

  const getProductSpecs = (prod) => {
    if (prod.specs && Object.keys(prod.specs).length > 0) {
      return prod.specs;
    }
    return {
      "Material": prod.materialType || "Standard Blend",
      "Colors": prod.availableColors ? prod.availableColors.join(", ") : "Standard",
      "Baseline Stock": prod.stock !== undefined ? `${prod.stock} units` : "In Stock"
    };
  };

  const filteredProducts = displayProducts.filter((product) => {
    const catVal = getCategoryName(product);
    const matchesCategory = selectedCategory === "all" || catVal === selectedCategory || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMaterials =
      selectedMaterials.length === 0 ||
      selectedMaterials.some((mat) => {
        const materialSpec = product.materialType || getProductSpecs(product)["Material"] || "";
        return materialSpec.toLowerCase().includes(mat.toLowerCase());
      });

    return matchesCategory && matchesSearch && matchesMaterials;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.tiers && a.tiers.length > 0 ? a.tiers[a.tiers.length - 1].price : a.price;
    const priceB = b.tiers && b.tiers.length > 0 ? b.tiers[b.tiers.length - 1].price : b.price;
    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "moq") return a.moq - b.moq;
    return 0;
  });

  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 max-w-7xl mx-auto z-10 overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />
      
      {/* Editorial Header */}
      <div className="mb-14 text-left border-b border-white/5 pb-8">
        <span className="text-gold text-xs uppercase tracking-[0.3em] font-extrabold block mb-2">
          Zuri Sourcing Directory
        </span>
        <h1 className="font-serif text-4xl md:text-6xl font-black uppercase tracking-widest text-white">
          Wholesale Catalog
        </h1>
        <p className="text-white/40 text-xs mt-3 uppercase tracking-[0.2em] leading-relaxed max-w-md">
          Procure structured cap blanks, raw textiles rolls, brass Closures, and adjusters.
        </p>
      </div>

      {/* MOBILE-ONLY: category pill row + search bar */}
      <div className="lg:hidden mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-lg px-4 py-3 text-xs placeholder-white/30 focus:outline-none text-white transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => { setSelectedCategory("all"); router.push("/products"); }}
            className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full border transition-all cursor-pointer ${selectedCategory === "all" ? "bg-gold text-black border-gold" : "border-white/10 text-white/60 hover:border-gold/30"}`}
          >
            All
          </button>
          {displayCategories.map((cat) => {
            const catId = cat.slug || cat.id;
            return (
              <button
                key={catId}
                onClick={() => { setSelectedCategory(catId); router.push(`/products?category=${catId}`); }}
                className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full border transition-all cursor-pointer ${selectedCategory === catId ? "bg-gold text-black border-gold" : "border-white/10 text-white/60 hover:border-gold/30"}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* SIDEBAR FILTERS (3 cols) — hidden on mobile, shown lg+ */}
        <aside className="lg:col-span-3 space-y-6 hidden lg:block">
          
          {/* SEARCH BOX */}
          <div className="bento-border rounded-2xl p-5 shadow-2xl">
            <h3 className="text-gold text-[10px] uppercase tracking-[0.25em] font-extrabold mb-4 flex items-center space-x-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search Sourcing</span>
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keywords..."
                className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded px-3.5 py-3 text-xs placeholder-white/30 focus:outline-none text-white transition-colors"
              />
            </div>
          </div>

          {/* CATEGORIES SIDEBAR */}
          <div className="bento-border rounded-2xl p-5 shadow-2xl">
            <h3 className="text-gold text-[10px] uppercase tracking-[0.25em] font-extrabold mb-4 flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Categories</span>
            </h3>
            <div className="flex flex-col space-y-1 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  router.push("/products");
                }}
                className={`text-left px-3.5 py-2.5 rounded transition-all cursor-pointer font-bold uppercase tracking-wider ${
                  selectedCategory === "all"
                    ? "bg-gold text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                All Offerings
              </button>
              {displayCategories.map((cat) => {
                const catId = cat.slug || cat.id;
                return (
                  <button
                    key={catId}
                    onClick={() => {
                      setSelectedCategory(catId);
                      router.push(`/products?category=${catId}`);
                    }}
                    className={`text-left px-3.5 py-2.5 rounded transition-all cursor-pointer font-bold uppercase tracking-wider ${
                      selectedCategory === catId
                        ? "bg-gold text-black"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHECKBOX FILTERS */}
          <div className="bento-border rounded-2xl p-5 shadow-2xl">
            <h3 className="text-gold text-[10px] uppercase tracking-[0.25em] font-extrabold mb-4">
              Filters
            </h3>
            
            <div className="space-y-5">
              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-black block mb-3">
                  Material
                </span>
                <div className="space-y-2.5 text-xs text-white/70">
                  {MATERIALS.map((mat) => (
                    <label key={mat} className="flex items-center space-x-3.5 cursor-pointer hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(mat)}
                        onChange={() => toggleMaterial(mat)}
                        className="bg-white/5 border border-white/10 rounded w-4 h-4 checked:bg-gold text-gold cursor-pointer"
                      />
                      <span className="font-semibold">{mat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-black block mb-3">
                  Colorways
                </span>
                <div className="flex gap-2">
                  <span className="w-4.5 h-4.5 rounded-full bg-black border border-white/20 cursor-pointer hover:scale-110 transition-transform block" />
                  <span className="w-4.5 h-4.5 rounded-full bg-zinc-400 border border-white/20 cursor-pointer hover:scale-110 transition-transform block" />
                  <span className="w-4.5 h-4.5 rounded-full bg-blue-950 border border-white/20 cursor-pointer hover:scale-110 transition-transform block" />
                  <span className="w-4.5 h-4.5 rounded-full bg-amber-100 border border-white/20 cursor-pointer hover:scale-110 transition-transform block" />
                </div>
              </div>
            </div>

          </div>

        </aside>

        {/* PRODUCTS LIST GRID (9 cols) */}
        <section className="lg:col-span-9 space-y-6">
          
          <div className="bento-border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-white/50 font-bold uppercase tracking-wider">
            <span>{sortedProducts.length} Sourcing Profiles matched</span>
            <div className="flex items-center space-x-2">
              <span className="text-white/30">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#050505] border border-white/10 rounded px-2.5 py-1.5 focus:outline-none focus:border-gold text-white cursor-pointer transition-colors"
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="moq">Low MOQ</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24 text-gold uppercase tracking-[0.2em] font-serif text-sm">
              Loading Wholesale Catalog...
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
              {sortedProducts.map((product) => {
                const productId = product._id || product.id;
                const minPrice = product.tiers && product.tiers.length > 0 
                  ? product.tiers[product.tiers.length - 1].price 
                  : product.price;

                return (
                  <div
                    key={productId}
                    className="group bg-navy-light border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gold/30 hover:shadow-2xl transition-all"
                  >
                    
                    <div className="relative h-60 w-full overflow-hidden bg-matte-black/60">
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-black/65 border border-white/10 px-3 py-1 rounded text-[9px] text-gold font-bold uppercase tracking-widest">
                        MOQ: {product.moq} {product.unit || "pc"}s
                      </div>
                      
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenPreview(product)}
                          className="bg-white text-black p-3 rounded-full hover:bg-gold transition-colors shadow-lg cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[9px] text-gold uppercase tracking-widest font-black block">
                          {getCategoryName(product).replace("-", " ")}
                        </span>
                        <Link
                          href={`/products/${productId}`}
                          className="block font-serif text-sm font-bold text-white hover:text-gold transition-colors mt-1.5 line-clamp-1"
                        >
                          {product.name}
                        </Link>

                        <div className="flex gap-1.5 mt-2 mb-4">
                          <span className="w-3.5 h-3.5 rounded-full bg-black border border-white/10" />
                          <span className="w-3.5 h-3.5 rounded-full bg-zinc-500 border border-white/10" />
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-950 border border-white/10" />
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-50 border border-white/10" />
                        </div>

                        <div className="space-y-1.5 text-xs text-white/50 border-t border-white/5 pt-3">
                          <div className="flex justify-between">
                            <span>Wholesale price:</span>
                            <span className="text-white font-bold">${minPrice.toFixed(2)} / {product.unit || "pc"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Minimum order:</span>
                            <span className="text-white font-bold">{product.moq} {product.unit || "pc"}s</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="w-full bg-gold hover:bg-gold-light text-black text-[10px] font-black uppercase tracking-widest py-3 rounded cursor-pointer text-center"
                      >
                        Add to Quote
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-matte-black border border-white/5 rounded-2xl py-24 text-center text-white/60 shadow-2xl">
              <BadgeAlert className="w-12 h-12 text-gold mx-auto mb-4 opacity-50" />
              <h3 className="font-serif text-lg text-white mb-2">No Matching Products Found</h3>
              <p className="text-xs max-w-sm mx-auto">
                Adjust checkbox filters or simplify query tags.
              </p>
            </div>
          )}

        </section>

      </div>

      {/* QUICK PREVIEW POPUP */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div
            ref={previewModalRef}
            className="relative bg-matte-gray border border-gold/30 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden p-6 md:p-8 animate-fade-in"
          >
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 text-white/60 hover:text-gold transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden border border-white/5 bg-matte-black">
                <img
                  src={getImageUrl(previewProduct.images[0])}
                  alt={previewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gold uppercase tracking-widest font-black">
                    {getCategoryName(previewProduct).replace("-", " ")}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-white mt-1 mb-3">
                    {previewProduct.name}
                  </h2>
                  <p className="text-white/70 text-xs leading-relaxed mb-4">
                    {previewProduct.description}
                  </p>

                  <div className="bg-matte-black rounded border border-white/5 p-3.5 mb-4 text-[11px] space-y-1.5">
                    {Object.entries(getProductSpecs(previewProduct)).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-white/40">{key}:</span>
                        <span className="text-white/80 font-bold">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gold font-bold mb-4 bg-gold/10 p-2.5 rounded border border-gold/20 flex justify-between">
                    <span>Wholesale MOQ:</span>
                    <span>{previewProduct.moq} {previewProduct.unit || "pc"}s</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => {
                      handleQuickAdd(previewProduct);
                      handleClosePreview();
                    }}
                    className="bg-gold text-black hover:bg-gold-light text-xs font-bold uppercase tracking-widest py-3 px-6 rounded flex items-center justify-center space-x-2 flex-grow transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Request Quotation</span>
                  </button>
                  <Link
                    href={`/products/${previewProduct._id || previewProduct.id}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-widest py-3 px-4 rounded transition-colors text-center"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function EditorialCatalog() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gold">Loading Sourcing Catalog...</div>}>
      <EditorialCatalogContent />
    </Suspense>
  );
}
