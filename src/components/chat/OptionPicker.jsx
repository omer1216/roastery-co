"use client";

import { useState } from "react";

const LABELS = {
  hot: "Hot",
  iced: "Iced",
  S: "Small",
  M: "Medium",
  L: "Large",
};

export default function OptionPicker({ pending, onConfirm, busy }) {
  const [choices, setChoices] = useState(() => {
    const initial = {};
    for (const group of pending.groups) {
      initial[group.key] =
        group.selected ??
        (group.key === "size" && group.values.includes("M")
          ? "M"
          : group.key === "sweetness" && group.values.includes("regular")
            ? "regular"
            : group.values[0]);
    }
    return initial;
  });

  return (
    <div className="mt-2 rounded-2xl border border-white/10 bg-roastery-bg p-4">
      <p className="font-body text-xs text-roastery-muted">
        {pending.quantity} × {pending.name}
      </p>

      <div className="mt-3 space-y-3">
        {pending.groups.map((group) => (
          <div key={group.key}>
            <p className="font-body text-[0.6875rem] uppercase tracking-[0.15em] text-roastery-muted">
              {group.label}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {group.values.map((value) => {
                const active = choices[group.key] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setChoices((prev) => ({ ...prev, [group.key]: value }))
                    }
                    className={`rounded-full px-3 py-1 font-body text-xs capitalize transition ${
                      active
                        ? "bg-roastery-accent text-roastery-bg"
                        : "border border-white/10 text-roastery-muted hover:text-roastery-text"
                    }`}
                  >
                    {LABELS[value] ?? value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onConfirm(choices)}
        disabled={busy}
        className="mt-4 w-full rounded-lg bg-roastery-accent px-4 py-2 font-body text-xs font-medium text-roastery-bg transition hover:opacity-90 disabled:opacity-40"
      >
        {busy ? "Adding…" : "Add to cart"}
      </button>
    </div>
  );
}