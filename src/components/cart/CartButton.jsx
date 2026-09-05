"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { openCart, itemCount, hydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open order${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className="relative rounded-full bg-roastery-accent px-5 py-2 text-sm font-medium text-roastery-bg transition-colors duration-200 hover:bg-roastery-accent-text"
    >
      <span className="flex items-center gap-2">
        <ShoppingBag size={16} />
        Order
      </span>

      {hydrated && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-roastery-text px-1.5 text-xs font-medium text-roastery-bg">
          {itemCount}
        </span>
      )}
    </button>
  );
}
