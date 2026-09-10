"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";

const STEPS = [
  { status: "pending", label: "Received", blurb: "We've got your order." },
  { status: "confirmed", label: "Confirmed", blurb: "The counter has accepted it." },
  { status: "preparing", label: "Preparing", blurb: "Being made now." },
  {
    status: "ready",
    label: "Ready",
    blurb: {
      pickup: "Come collect it.",
      delivery: "On its way to you.",
    },
  },
];

export default function OrderStatus({ initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const source = new EventSource(`/api/orders/${order.reference}/stream`);

    source.addEventListener("ready", () => setLive(true));
    source.addEventListener("order", (event) => {
      setOrder((previous) => ({ ...previous, ...JSON.parse(event.data) }));
    });
    source.onerror = () => setLive(false);

    return () => source.close();
    // reference never changes for this page
  }, [order.reference]);

  const cancelled = order.status === "cancelled";
  const currentIndex = STEPS.findIndex((step) => step.status === order.status);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div>
      <p className="font-body text-xs uppercase tracking-[0.2em] text-roastery-muted">
        Order {order.reference}
      </p>
      <h1 className="mt-2 font-heading text-3xl text-roastery-text">
        {cancelled ? "Order cancelled" : "Thanks for your order"}
      </h1>

      {cancelled ? (
        <div className="mt-8 rounded-2xl border border-red-400/30 bg-roastery-panel p-6">
          <p className="font-body text-sm text-roastery-text">
            We weren&apos;t able to make this one.
          </p>
          {order.rejection_reason ? (
            <p className="mt-3 font-body text-sm text-roastery-muted">
              {order.rejection_reason}
            </p>
          ) : null}
          <p className="mt-4 font-body text-xs text-roastery-muted">
            Nothing has been charged. Call us on 051 111 0000 if you&apos;d like
            to reorder.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-2 flex items-center gap-2 font-body text-sm text-roastery-muted">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                live ? "bg-emerald-400" : "bg-roastery-muted"
              }`}
            />
            {live ? "Updating live" : "Reconnecting…"}
          </p>

          <ol className="mt-10 space-y-6">
            {STEPS.map((step, index) => {
              const done = index < currentIndex;
              const active = index === currentIndex;

              return (
                <li key={step.status} className="flex gap-4">
                  <span
                    className={`mt-1 inline-block h-3 w-3 shrink-0 rounded-full ${
                      done
                        ? "bg-roastery-accent"
                        : active
                          ? "bg-roastery-accent ring-4 ring-roastery-accent/25"
                          : "bg-white/15"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-heading text-base ${
                        done || active ? "text-roastery-text" : "text-roastery-muted"
                      }`}
                    >
                      {step.label}
                    </p>
                    {active ? (
                      <p className="mt-1 font-body text-sm text-roastery-muted">
                        {typeof step.blurb === "string"
                          ? step.blurb
                          : (step.blurb[order.order_type] ?? step.blurb.pickup)}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}

      <div className="mt-10 rounded-2xl border border-white/10 bg-roastery-panel p-6">
        <h2 className="font-heading text-sm uppercase tracking-[0.15em] text-roastery-text">
          Your order
        </h2>

        <ul className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${order.reference}-${index}`}
              className="flex justify-between font-body text-sm text-roastery-text"
            >
              <span>
                <span className="text-roastery-accent-text">
                  {item.quantity ?? 1}×
                </span>{" "}
                {item.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-1 border-t border-white/10 pt-4 font-body text-sm">
          <div className="flex justify-between text-roastery-muted">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {Number(order.delivery_fee) > 0 ? (
            <div className="flex justify-between text-roastery-muted">
              <span>Delivery</span>
              <span>{formatPrice(order.delivery_fee)}</span>
            </div>
          ) : null}
          <div className="flex justify-between pt-1 text-roastery-text">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}