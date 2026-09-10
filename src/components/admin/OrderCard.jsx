"use client";

import { useState } from "react";
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

export default function OrderCard({ order, onAdvance, onReject, busy }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const items = Array.isArray(order.items) ? order.items : [];
  const label = ACTION_LABEL[order.status];
  const canReject = Boolean(label);

  function handleReject() {
    onReject(order.id, reason);
    setRejecting(false);
    setReason("");
  }

  return (
    <article className="rounded-xl border border-white/10 bg-roastery-bg p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-heading text-sm text-roastery-text">{order.reference}</p>
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

      {rejecting ? (
        <div className="mt-4">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={2}
            autoFocus
            placeholder="Why? The customer will see this."
            className="w-full rounded-lg border border-white/10 bg-roastery-panel px-3 py-2 font-body text-xs text-roastery-text outline-none focus:border-roastery-accent"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleReject}
              disabled={busy || reason.trim().length < 3}
              className="rounded-lg bg-red-500/80 px-3 py-1.5 font-body text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40"
            >
              Confirm rejection
            </button>
            <button
              type="button"
              onClick={() => {
                setRejecting(false);
                setReason("");
              }}
              className="rounded-lg border border-white/10 px-3 py-1.5 font-body text-xs text-roastery-muted transition hover:text-roastery-text"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-body text-sm text-roastery-text">
            {formatPrice(order.total)}
          </p>

          <div className="flex items-center gap-2">
            {canReject ? (
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={busy}
                className="rounded-lg border border-white/10 px-2.5 py-1.5 font-body text-xs text-roastery-muted transition hover:border-red-400/40 hover:text-red-400 disabled:opacity-40"
              >
                Reject
              </button>
            ) : null}

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
        </div>
      )}
    </article>
  );
}