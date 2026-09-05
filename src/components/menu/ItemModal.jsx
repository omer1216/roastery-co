"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus } from "lucide-react";
import MenuImage from "@/components/MenuImage";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { lineUnitPrice } from "@/lib/cart";

const SIZE_LABELS = { S: "Small", M: "Medium", L: "Large" };
const MILK_LABELS = {
  whole: "Whole",
  oat: "Oat",
  almond: "Almond",
  none: "None",
};
const SWEETNESS_LABELS = {
  none: "None",
  light: "Light",
  regular: "Regular",
  extra: "Extra",
};

function temperatureOptions(item) {
  if (item.temperature === "both") return ["hot", "iced"];
  if (item.temperature === "hot") return ["hot"];
  if (item.temperature === "iced") return ["iced"];
  return [];
}

function OptionRow({ label, options, value, labels, onChange, note }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.15em] text-roastery-muted">
          {label}
        </p>
        {note && <p className="text-xs text-roastery-muted/70">{note}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                isActive
                  ? "bg-roastery-accent font-medium text-roastery-bg"
                  : "border border-roastery-muted/25 text-roastery-muted hover:border-roastery-accent/40 hover:text-roastery-text"
              }`}
            >
              {labels?.[option] ?? option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ItemModal({ item, onClose }) {
  const { addItem } = useCart();

  const sizes = item.customizations?.sizes ?? [];
  const milks = item.customizations?.milk ?? [];
  const sweetnessLevels = item.customizations?.sweetness ?? [];
  const temperatures = temperatureOptions(item);

  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState(sizes.includes("M") ? "M" : sizes[0] ?? null);
  const [milk, setMilk] = useState(milks[0] ?? null);
  const [sweetness, setSweetness] = useState(
    sweetnessLevels.includes("regular") ? "regular" : sweetnessLevels[0] ?? null
  );
  const [temperature, setTemperature] = useState(temperatures[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const customizations = {};
  if (size) customizations.size = size;
  if (milk) customizations.milk = milk;
  if (sweetness) customizations.sweetness = sweetness;
  if (temperature) customizations.temperature = temperature;

  const unitPrice = lineUnitPrice(item, customizations);

  function handleAdd() {
    addItem(item, customizations, quantity);
    onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="animate-slide-up-modal relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-roastery-panel sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-roastery-bg/80 p-2 text-roastery-text transition-colors hover:text-roastery-accent-text"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[3/2] w-full overflow-hidden bg-roastery-bg">
          <MenuImage
            src={item.image_url}
            alt={item.name}
            sizes="(min-width: 640px) 512px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-7 p-7">
          <div>
            <h2 className="font-heading text-2xl text-roastery-text">
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-roastery-muted">
              {item.description}
            </p>
          </div>

          {temperatures.length > 0 && (
            <OptionRow
              label="Temperature"
              options={temperatures}
              value={temperature}
              labels={{ hot: "Hot", iced: "Iced" }}
              onChange={setTemperature}
              note={
                temperatures.length === 1
                  ? temperatures[0] === "hot"
                    ? "Served hot only"
                    : "Served iced only"
                  : null
              }
            />
          )}

          {sizes.length > 0 && (
            <OptionRow
              label="Size"
              options={sizes}
              value={size}
              labels={SIZE_LABELS}
              onChange={setSize}
              note="S −Rs.100 · L +Rs.150"
            />
          )}

          {milks.length > 0 && (
            <OptionRow
              label="Milk"
              options={milks}
              value={milk}
              labels={MILK_LABELS}
              onChange={setMilk}
              note="Oat +Rs.150 · Almond +Rs.200"
            />
          )}

          {sweetnessLevels.length > 0 && (
            <OptionRow
              label="Sweetness"
              options={sweetnessLevels}
              value={sweetness}
              labels={SWEETNESS_LABELS}
              onChange={setSweetness}
            />
          )}

          <div className="flex items-center justify-between gap-6 border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
                className="rounded-full border border-roastery-muted/25 p-2 text-roastery-muted transition-colors hover:border-roastery-accent/40 hover:text-roastery-text"
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center text-sm text-roastery-text">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
                aria-label="Increase quantity"
                className="rounded-full border border-roastery-muted/25 p-2 text-roastery-muted transition-colors hover:border-roastery-accent/40 hover:text-roastery-text"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-roastery-accent px-6 py-3 text-sm font-medium text-roastery-bg transition-colors duration-200 hover:bg-roastery-accent-text"
            >
              Add · {formatPrice(unitPrice * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}