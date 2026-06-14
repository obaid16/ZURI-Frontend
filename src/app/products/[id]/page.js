"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ShieldCheck, Heart, Info, ZoomIn } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useQuote } from "@/components/QuoteContext";
import { getImageUrl } from "@/utils/api";
import { gsap } from "gsap";

export default function ProductDetailPage({ params }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  const { addToQuote } = useQuote();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);
  
  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: "center" });

  const detailRef = useRef(null);

  useEffect(() => {
    async function loadProductDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products/${productId}`);
        if (!res.ok) {
          console.warn(`Product details API returned ${res.status}`);
          throw new Error("Failed to load product");
        }
        const data = await res.json();
        if (data && data.success && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.images[0]);
          setQuantity(data.product.moq);
          
          // Load related products
          const catId = typeof data.product.category === "object"
            ? data.product.category._id
            : data.product.category;
            
          const relRes = await fetch(`/api/v1/products?category=${catId}&limit=4`);
          if (!relRes.ok) {
            console.warn(`Related products API returned ${relRes.status}`);
            return;
          }
          const relData = await relRes.json();
          if (relData && relData.success && relData.products) {
            setRelatedItems(relData.products.filter(p => p._id !== data.product._id).slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Failed to load product details from backend:", err);
        // Fall back to static mock arrays if request fails
        const fallbackProd = PRODUCTS.find(p => p.id === productId);
        if (fallbackProd) {
          setProduct(fallbackProd);
          setActiveImage(fallbackProd.images[0]);
          setQuantity(fallbackProd.moq);
          setRelatedItems(PRODUCTS.filter(p => p.category === fallbackProd.category && p.id !== fallbackProd.id).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProductDetails();
    }
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-item",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }, detailRef);
    return () => ctx.revert();
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 text-gold uppercase tracking-[0.2em] font-serif text-sm bg-[#050505]">
        Loading Product Specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 text-white bg-[#050505]">
        <h2 className="font-serif text-xl mb-4">Material Offering Not Found</h2>
        <Link href="/products" className="text-gold border-b border-gold/30 hover:border-gold pb-1 font-bold text-xs uppercase tracking-widest">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Pan zoom on hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.4)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)"
    });
  };

  const handleAddQuoteClick = () => {
    addToQuote(product, quantity, selectedColor);
    alert(`Added ${quantity} ${product.unit || "pc"}s (${selectedColor}) of ${product.name} to Quote List.`);
  };

  const getCategoryName = (prod) => {
    if (!prod.category) return "";
    if (typeof prod.category === "object") {
      return prod.category.slug || prod.category.name || "";
    }
    return prod.category;
  };

  const colors = product.availableColors && product.availableColors.length > 0
    ? product.availableColors
    : (getCategoryName(product) === "fabrics"
        ? ["Midnight Black", "Charcoal Gray", "Navy Blue", "Desert Sand"]
        : ["Matte Black", "Heather Gray", "Dark Navy", "Pure White"]);

  const getProductSpecs = (prod) => {
    if (prod.specs && Object.keys(prod.specs).length > 0) {
      return prod.specs;
    }
    return {
      "Composition": prod.materialType || "Standard Blend",
      "Colors": colors.join(", "),
      "Available Stock": prod.stock !== undefined ? `${prod.stock} units` : "Bulk Stock"
    };
  };

  const activeTiers = product.tiers && product.tiers.length > 0
    ? product.tiers
    : [
        { qty: product.moq, price: product.price },
        { qty: product.moq * 2, price: product.price * 0.9 },
        { qty: product.moq * 10, price: product.price * 0.8 }
      ];

  const matchedTierPrice = activeTiers.find(t => quantity >= t.qty)?.price || product.price;

  return (
    <div ref={detailRef} className="relative min-h-screen py-10 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden bg-[#050505]">
      {/* Ambient gradients */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#062b73]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full filter blur-[150px] pointer-events-none" />
      
      {/* Back button */}
      <div className="reveal-item mb-8">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-white/50 hover:text-gold text-xs uppercase tracking-[0.2em] font-extrabold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wholesale Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* LEFT COLUMN: Main Gallery Image & Thumbnails (5 cols) */}
        <div className="lg:col-span-5 space-y-4 reveal-item">
          <div
            className="relative h-[380px] md:h-[480px] w-full bg-matte-black border border-white/5 rounded-xl overflow-hidden cursor-zoom-in flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={getImageUrl(activeImage)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-100 ease-out"
              style={zoomStyle}
            />
            <div className="absolute bottom-4 right-4 bg-black/60 border border-white/10 p-2.5 rounded-full pointer-events-none">
              <ZoomIn className="w-4.5 h-4.5 text-gold" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`h-22 rounded-lg overflow-hidden border bg-matte-black transition-all ${
                  activeImage === img ? "border-gold" : "border-white/5 hover:border-gold/50"
                }`}
              >
                <img src={getImageUrl(img)} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between reveal-item">
          
          <div className="space-y-6">
            <div>
              <span className="text-[10px] text-gold uppercase tracking-[0.25em] font-extrabold block">
                {getCategoryName(product).replace("-", " ")} Specifications
              </span>
              <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-white mt-1.5 uppercase leading-snug">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-xs text-white/50 mt-3 border-y border-white/5 py-3.5">
                <div>
                  <span>Wholesale Price: </span>
                  <span className="text-gold font-bold text-sm">${product.price.toFixed(2)}</span>
                </div>
                <span>|</span>
                <div>
                  <span>MOQ Requirement: </span>
                  <span className="text-white font-bold">{product.moq} {product.unit || "pc"}s</span>
                </div>
              </div>
            </div>

            <p className="text-white/70 text-xs leading-relaxed">
              {product.description}
            </p>

            {/* COLOR OPTIONS */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-black text-white/40 mb-2.5">
                Colorways
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`text-[11px] px-3.5 py-1.5 rounded border transition-all ${
                      selectedColor === c
                        ? "bg-gold text-black border-gold font-bold"
                        : "bg-white/5 text-white/70 border-white/10 hover:border-gold/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* MOQ pricing tier */}
            <div className="bg-matte-black border border-white/5 rounded-xl p-4.5">
              <h4 className="text-[10px] uppercase tracking-wider font-black text-gold mb-3">
                Bulk Discount Brackets
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                {activeTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border ${
                      quantity >= tier.qty
                        ? "bg-gold/10 border-gold/40 text-gold font-bold"
                        : "bg-white/5 border-white/5 text-white/50"
                    }`}
                  >
                    <span className="block">{tier.qty}+ {product.unit || "pc"}s</span>
                    <span className="text-xs block mt-1">${tier.price.toFixed(2)} / pc</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity counters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-5">
              <div className="flex items-center space-x-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-white/40">
                  Quantity ({product.unit || "pc"}s)
                </span>
                <div className="flex items-center bg-matte-black border border-white/15 rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 10))}
                    className="px-3.5 py-1.5 text-white/60 hover:text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center text-xs bg-transparent border-none text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 10)}
                    className="px-3.5 py-1.5 text-white/60 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Estimate quotes */}
              <div className="text-right">
                <span className="text-[10px] text-white/40 block uppercase">Estimate sub-total</span>
                <span className="text-lg font-serif text-white font-bold">
                  ${(quantity * matchedTierPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Alert below MOQ */}
            {quantity < product.moq && (
              <div className="flex items-start space-x-2 bg-red-950/25 border border-red-500/25 rounded-lg p-3 text-red-400 text-[11px]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>MOQ Alert:</strong> Ordering below the {product.moq} {product.unit || "pc"}s MOQ limit may result in higher pricing adjustments during final PDF invoice generation.
                </span>
              </div>
            )}

          </div>

          <div className="flex gap-4 pt-8 border-t border-white/5 mt-8">
            <button
              onClick={handleAddQuoteClick}
              className="flex-grow bg-gold hover:bg-gold-light text-black py-3.5 rounded font-bold uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 transition-transform hover:scale-105 cursor-pointer shadow-lg shadow-gold/15"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Inquiry</span>
            </button>
            <button
              onClick={() => alert("Added item to procurement wishlist.")}
              className="border border-white/20 hover:border-gold text-white hover:text-gold p-3.5 rounded transition-transform hover:scale-105"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Tabs description */}
      <section className="reveal-item border-t border-white/5 pt-10 pb-10">
        
        {/* Tab triggers */}
        <div className="flex space-x-6 border-b border-white/5 pb-2 mb-6 text-xs uppercase font-extrabold tracking-widest text-white/50">
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-2 border-b cursor-pointer transition-colors ${activeTab === "specs" ? "border-gold text-gold" : "border-transparent hover:text-white"}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-2 border-b cursor-pointer transition-colors ${activeTab === "desc" ? "border-gold text-gold" : "border-transparent hover:text-white"}`}
          >
            Sourcing Details
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-2 border-b cursor-pointer transition-colors ${activeTab === "shipping" ? "border-gold text-gold" : "border-transparent hover:text-white"}`}
          >
            Shipping & Cargo
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "specs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3.5 text-xs">
            {Object.entries(getProductSpecs(product)).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">{k}:</span>
                <span className="text-white/80 font-bold">{v}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40">Audit:</span>
              <span className="text-gold font-bold flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>ISO 9001 Approved</span>
              </span>
            </div>
          </div>
        )}

        {activeTab === "desc" && (
          <p className="text-white/70 text-xs leading-relaxed max-w-2xl">
            This catalog item is engineered specifically for premium headwear design labels. The structured weaves undergo 48-hour color preservation and salt spray anti-rust tests. The core sweatband uses hypoallergenic cotton linings designed for high-density stitching machines.
          </p>
        )}

        {activeTab === "shipping" && (
          <p className="text-white/70 text-xs leading-relaxed max-w-2xl">
            Stock item. Ground shipments depart our New York fulfillment facility in 2-3 business days. Custom B2B bulk orders require sea ocean cargo clearance (18 days transit) or fast air express (5 days transit) with tracking dashboards.
          </p>
        )}

      </section>

      {/* RELATED PRODUCTS */}
      {relatedItems.length > 0 && (
        <section className="reveal-item border-t border-white/5 pt-10">
          <h3 className="font-serif text-lg font-bold uppercase text-white tracking-widest mb-6">
            Related Sourcing Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((p) => {
              const relId = p._id || p.id;
              const relPrice = p.price;
              return (
                <div
                  key={relId}
                  className="group bg-navy-light border border-white/5 rounded-xl overflow-hidden flex flex-col justify-between hover:border-gold/25 transition-all shadow-xl"
                >
                  <Link href={`/products/${relId}`} className="relative h-44 w-full overflow-hidden block">
                    <img src={getImageUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] text-gold uppercase tracking-wider font-bold">
                        {getCategoryName(p).replace("-", " ")}
                      </span>
                      <Link
                        href={`/products/${relId}`}
                        className="block font-serif text-xs font-bold text-white hover:text-gold transition-colors mt-1 mb-2 line-clamp-1"
                      >
                        {p.name}
                      </Link>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                      <span className="text-xs text-white/50">MOQ: {p.moq} {p.unit || "pc"}s</span>
                      <span className="text-xs font-bold text-white">${relPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
