"use client";

import { useEffect, useMemo, useState } from "react";
import MetricCards from "./MetricCards";
import OrderCard from "./OrderCard";

const COLUMNS = [
  { status: "pending", title: "New" },
  { status: "confirmed", title: "Confirmed" },
  { status: "preparing", title: "Preparing" },
  { status: "ready", title: "Ready" },
];

function startOfDayPKT() {
  const shifted = new Date(Date.now() + 5 * 60 * 60 * 1000);
  shifted.setUTCHours(0, 0, 0, 0);
  return shifted.getTime() - 5 * 60 * 60 * 1000;
}

function prepMinutes(order) {
  const history = Array.isArray(order.status_history) ? order.status_history : [];
  const ready = history.find((entry) => entry.status === "ready");
  if (!ready) return null;
  const start = new Date(history[0]?.at ?? order.created_at).getTime();
  return (new Date(ready.at).getTime() - start) / 60000;
}

export default function OrdersBoard({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [live, setLive] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const source = new EventSource("/api/admin/stream");

    source.addEventListener("ready", () => setLive(true));

    source.addEventListener("order", (event) => {
      const incoming = JSON.parse(event.data);
      setOrders((previous) => {
        const index = previous.findIndex((order) => order.id === incoming.id);
        if (index === -1) return [...previous, incoming];
        const next = [...previous];
        next[index] = incoming;
        return next;
      });
    });

    source.onerror = () => setLive(false);

    return () => source.close();
  }, []);

  const metrics = useMemo(() => {
    const dayStart = startOfDayPKT();
    const today = orders.filter(
      (order) => new Date(order.created_at).getTime() >= dayStart
    );

    const durations = today.map(prepMinutes).filter((value) => value !== null);

    return {
      ordersToday: today.length,
      revenueToday: today.reduce((sum, order) => sum + Number(order.total || 0), 0),
      completedToday: durations.length,
      avgPrepMinutes: durations.length
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : null,
      pendingNow: orders.filter((order) =>
        ["pending", "confirmed", "preparing"].includes(order.status)
        ).length,
    };
  }, [orders]);

  async function handleAdvance(id) {
    setBusyId(id);
    setError("");

    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH" });
    const data = await response.json().catch(() => ({}));

    if (response.ok && data.order) {
      setOrders((previous) =>
        previous.map((order) => (order.id === data.order.id ? data.order : order))
      );
    } else {
      setError(data.error || "Could not update that order.");
    }

    setBusyId(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-roastery-text">Orders</h1>
          <p className="mt-1 flex items-center gap-2 font-body text-sm text-roastery-muted">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                live ? "bg-emerald-400" : "bg-roastery-muted"
              }`}
            />
            {live ? "Live" : "Reconnecting…"}
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            window.location.href = "/admin/login";
          }}
          className="rounded-lg border border-white/10 px-4 py-2 font-body text-xs text-roastery-muted transition hover:text-roastery-text"
        >
          Sign out
        </button>
      </div>

      <MetricCards metrics={metrics} />

      {error ? (
        <p className="font-body text-sm text-red-400">{error}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.status === column.status
          );

          return (
            <section
              key={column.status}
              className="rounded-2xl border border-white/10 bg-roastery-panel p-4"
            >
              <header className="flex items-center justify-between">
                <h2 className="font-heading text-sm uppercase tracking-[0.15em] text-roastery-text">
                  {column.title}
                </h2>
                <span className="font-body text-xs text-roastery-muted">
                  {columnOrders.length}
                </span>
              </header>

              <div className="mt-4 space-y-3">
                {columnOrders.length === 0 ? (
                  <p className="font-body text-xs text-roastery-muted">Nothing here.</p>
                ) : (
                  columnOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onAdvance={handleAdvance}
                      busy={busyId === order.id}
                    />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}