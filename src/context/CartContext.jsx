"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildLineId, cartSubtotal, lineUnitPrice } from "@/lib/cart";

const STORAGE_KEY = "roastery-cart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setLines(JSON.parse(stored));
    } catch {
      // corrupted or unavailable storage, start empty
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full or blocked, cart still works in memory
    }
  }, [lines, hydrated]);

  function addItem(item, customizations = {}, quantity = 1, options = {}) {
    const lineId = buildLineId(item.id, customizations);
    const unitPrice = lineUnitPrice(item, customizations);

    setLines((prev) => {
      const existing = prev.find((line) => line.lineId === lineId);

      if (existing) {
        return prev.map((line) =>
          line.lineId === lineId
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }

      return [
        ...prev,
        {
          lineId,
          menuItemId: item.id,
          name: item.name,
          image_url: item.image_url,
          unitPrice,
          quantity,
          customizations,
        },
      ];
    });

      if (!options.silent) setIsOpen(true);
  }

  function updateQuantity(lineId, quantity) {
    if (quantity < 1) {
      removeItem(lineId);
      return;
    }

    setLines((prev) =>
      prev.map((line) => (line.lineId === lineId ? { ...line, quantity } : line))
    );
  }

  function removeItem(lineId) {
    setLines((prev) => prev.filter((line) => line.lineId !== lineId));
  }

  function clearCart() {
    setLines([]);
  }

  const value = useMemo(
    () => ({
      lines,
      hydrated,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      subtotal: cartSubtotal(lines),
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    }),
    [lines, hydrated, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}