"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const QuoteContext = createContext(undefined);

export function QuoteProvider({ children }) {
  const [quoteItems, setQuoteItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load quote from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("zuri_quote_request");
      if (stored) {
        setQuoteItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load quote items:", e);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("zuri_quote_request", JSON.stringify(quoteItems));
    }
  }, [quoteItems, isInitialized]);

  // Helper to determine bulk price tier based on quantity
  const calculateTierPrice = (product, quantity) => {
    if (!product.tiers || product.tiers.length === 0) return product.price;
    
    // Sort tiers descending by quantity
    const sortedTiers = [...product.tiers].sort((a, b) => b.qty - a.qty);
    const matchedTier = sortedTiers.find(tier => quantity >= tier.qty);
    
    return matchedTier ? matchedTier.price : product.price;
  };

  const addToQuote = (product, qty, color = "Standard") => {
    setQuoteItems(prev => {
      const targetProdId = product._id || product.id;
      const existingIndex = prev.findIndex(
        item => {
          const itemProdId = item.product._id || item.product.id;
          return itemProdId === targetProdId && item.color === color;
        }
      );

      // Quantities must be at least the product MOQ or input amount
      const targetQty = qty;

      if (existingIndex > -1) {
        const newItems = [...prev];
        const updatedQty = newItems[existingIndex].quantity + targetQty;
        const finalPrice = calculateTierPrice(product, updatedQty);
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: updatedQty,
          pricePerUnit: finalPrice,
          totalPrice: updatedQty * finalPrice,
          belowMoq: updatedQty < product.moq
        };
        return newItems;
      } else {
        const finalPrice = calculateTierPrice(product, targetQty);
        return [
          ...prev,
          {
            product,
            color,
            quantity: targetQty,
            pricePerUnit: finalPrice,
            totalPrice: targetQty * finalPrice,
            belowMoq: targetQty < product.moq
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, color, newQty) => {
    setQuoteItems(prev => {
      return prev.map(item => {
        const itemProdId = item.product._id || item.product.id;
        if (itemProdId === productId && item.color === color) {
          const finalPrice = calculateTierPrice(item.product, newQty);
          return {
            ...item,
            quantity: newQty,
            pricePerUnit: finalPrice,
            totalPrice: newQty * finalPrice,
            belowMoq: newQty < item.product.moq
          };
        }
        return item;
      });
    });
  };

  const removeFromQuote = (productId, color) => {
    setQuoteItems(prev => prev.filter(item => {
      const itemProdId = item.product._id || item.product.id;
      return !(itemProdId === productId && item.color === color);
    }));
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  const totalItemsCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalQuoteEstimated = quoteItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const hasMoqViolations = quoteItems.some(item => item.belowMoq);

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        addToQuote,
        updateQuantity,
        removeFromQuote,
        clearQuote,
        totalItemsCount,
        totalQuoteEstimated,
        hasMoqViolations,
        isInitialized
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within a QuoteProvider");
  }
  return context;
}
