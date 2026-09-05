"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import MenuImage from "@/components/MenuImage";
import { useCart } from "@/context/CartContext";
import { describeCustomizations } from "@/lib/cart";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, updateQuantity, removeItem, subtotal } =
    useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event) {
      if (event.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className="animate-slide-in-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-roastery-panel"
      >
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-5">
          <h2 className="font-heading text-xl text-roastery-text">Your order</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-roastery-muted transition-colors hover:text-roastery-text"
          >
            <X size={20} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="text-sm text-roastery-muted">Nothing here yet.</p>
            <Link
              href="/menu"
              onClick={closeCart}
              className="rounded-full bg-roastery-accent px-6 py-2.5 text-sm font-medium text-roastery-bg transition-colors hover:bg-roastery-accent-text"
            >
              Browse the menu
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-5">
                {lines.map((line) => {
                  const detail = describeCustomizations(line.customizations);

                  return (
                    <li key={line.lineId} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-roastery-bg">
                        <MenuImage
                          src={line.image_url}
                          alt={line.name}
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-heading text-base text-roastery-text">
                            {line.name}
                          </h3>
                          <p className="shrink-0 text-sm text-roastery-accent-text">
                            {formatPrice(line.unitPrice * line.quantity)}
                          </p>
                        </div>

                        {detail && (
                          <p className="mt-1 text-xs text-roastery-muted">
                            {detail}
                          </p>
                        )}

                        <div className="mt-auto flex items-center gap-3 pt-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(line.lineId, line.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="rounded-full border border-roastery-muted/25 p-1.5 text-roastery-muted transition-colors hover:text-roastery-text"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-5 text-center text-sm text-roastery-text">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(line.lineId, line.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="rounded-full border border-roastery-muted/25 p-1.5 text-roastery-muted transition-colors hover:text-roastery-text"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(line.lineId)}
                            aria-label={`Remove ${line.name}`}
                            className="ml-auto text-roastery-muted transition-colors hover:text-red-400"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <footer className="border-t border-white/5 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-roastery-muted">Subtotal</p>
                <p className="font-heading text-xl text-roastery-text">
                  {formatPrice(subtotal)}
                </p>
              </div>
              <p className="mt-2 text-xs text-roastery-muted">
                Delivery charged at checkout. Free over Rs. 2,500.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-5 block rounded-full bg-roastery-accent px-6 py-3 text-center text-sm font-medium text-roastery-bg transition-colors hover:bg-roastery-accent-text"
              >
                Checkout
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}