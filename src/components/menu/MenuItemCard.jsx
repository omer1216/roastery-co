"use client";

import { useState } from "react";
import MenuImage from "@/components/MenuImage";
import ItemModal from "./ItemModal";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

function buildTags(item) {
  const tags = [];

  if (item.temperature === "hot") tags.push("Hot only");
  if (item.temperature === "iced") tags.push("Iced only");
  if (item.customizations?.milk?.includes("oat")) tags.push("Oat available");

  return tags;
}

function hasOptions(item) {
  const c = item.customizations ?? {};
  return Boolean(
    c.sizes?.length || c.milk?.length || c.sweetness?.length
  );
}

export default function MenuItemCard({ item }) {
  const { addItem } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  const soldOut = item.available === false;
  const tags = buildTags(item);
  const customisable = hasOptions(item);

  function handleClick() {
    if (soldOut) return;

    if (customisable) {
      setModalOpen(true);
    } else {
      addItem(item, {}, 1);
    }
  }

  return (
    <>
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-roastery-panel transition duration-300 ${
          soldOut
            ? "opacity-50"
            : "hover:-translate-y-1 hover:border-roastery-accent/30 hover:shadow-lg hover:shadow-black/50"
        }`}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-roastery-bg">
          <MenuImage
            src={item.image_url}
            alt={item.name}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-500 ${
              soldOut ? "grayscale" : "group-hover:scale-105"
            }`}
          />

          {soldOut && (
            <span className="absolute left-4 top-4 rounded-full bg-roastery-bg/90 px-3 py-1 text-xs text-roastery-text">
              Sold out
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-lg leading-snug text-roastery-text">
              {item.name}
            </h2>
            <p className="shrink-0 text-sm text-roastery-accent-text">
              {formatPrice(item.price)}
            </p>
          </div>

          <p className="mt-3 flex-1 text-sm leading-relaxed text-roastery-muted">
            {item.description}
          </p>

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-roastery-muted/20 px-3 py-1 text-xs text-roastery-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleClick}
            disabled={soldOut}
            className="mt-6 w-full rounded-full border border-roastery-accent/40 px-5 py-2.5 text-sm text-roastery-accent-text transition-colors duration-200 hover:bg-roastery-accent hover:text-roastery-bg disabled:cursor-not-allowed disabled:border-roastery-muted/20 disabled:text-roastery-muted"
          >
            {soldOut ? "Unavailable" : customisable ? "Choose options" : "Add to order"}
          </button>
        </div>
      </article>

      {modalOpen && <ItemModal item={item} onClose={() => setModalOpen(false)} />}
    </>
  );
}