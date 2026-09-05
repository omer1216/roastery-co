"use client";

import { useMemo, useState } from "react";
import MenuItemCard from "./MenuItemCard";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "coffee", label: "Coffee" },
  { id: "tea", label: "Tea" },
  { id: "specialty", label: "Specialty" },
  { id: "bakery", label: "Bakery" },
];

export default function MenuBrowser({ items }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <>
      <div className="mt-14 flex flex-wrap gap-3" role="tablist">
        {CATEGORIES.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-5 py-2 text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-roastery-accent font-medium text-roastery-bg"
                  : "border border-roastery-muted/25 text-roastery-muted hover:border-roastery-accent/40 hover:text-roastery-text"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div
        key={activeCategory}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className="animate-fade-up h-full"
            style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
          >
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>

      {visibleItems.length === 0 && (
        <p className="mt-16 text-center text-sm text-roastery-muted">
          Nothing in this section right now.
        </p>
      )}
    </>
  );
}