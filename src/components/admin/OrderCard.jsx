"use client";

import { formatPrice } from "@/lib/format";

function minutesAgo(iso) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

const ACTION_LABEL = {
  pending: "Confirm",
  confirmed: "Start preparing",
  preparing: "Mark ready",
};

export default function OrderCard({ order, onAdvance, busy }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const label = ACTION_LABEL[order.status];

  return (
    <article className="rounded-xl border border-white/10 bg-roastery-bg p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading text-sm text-roastery-text">
          {order.reference}
        </p>
        <p className="font-body text-xs text-roastery-muted">
          {minutesAgo(order.created_at)}
        </p>
      </div>

      {order.customer_name ? (
        <p className="mt-1 font-body text-xs text-roastery-muted">
          {order.customer_name}
        </p>
      ) : null}

      <ul className="mt-3 space-y-1">
        {items.map((item, index) => (
          <li
            key={`${order.id}-${index}`}
            className="font-body text-sm text-roastery-text"
          >
            <span className="text-roastery-accent-text">{item.quantity ?? 1}×</span>{" "}
            {item.name}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-body text-sm text-roastery-text">
          {formatPrice(order.total)}
        </p>

        {label ? (
          <button
            type="button"
            onClick={() => onAdvance(order.id)}
            disabled={busy}
            className="rounded-lg bg-roastery-accent px-3 py-1.5 font-body text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "…" : label}
          </button>
        ) : null}
      </div>
    </article>
  );
}