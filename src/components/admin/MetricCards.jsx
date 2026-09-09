import { formatPrice } from "@/lib/format";

function Card({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-roastery-panel p-5">
      <p className="font-body text-xs uppercase tracking-[0.15em] text-roastery-muted">
        {label}
      </p>
      <p className="mt-3 font-heading text-3xl text-roastery-text">{value}</p>
      {hint ? (
        <p className="mt-1 font-body text-xs text-roastery-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export default function MetricCards({ metrics }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card label="Orders today" value={metrics.ordersToday} />
      <Card label="Revenue today" value={formatPrice(metrics.revenueToday)} />
      <Card
        label="Avg prep time"
        value={metrics.avgPrepMinutes === null ? "—" : `${metrics.avgPrepMinutes} min`}
        hint={
          metrics.avgPrepMinutes === null
            ? "No completed orders yet"
            : `${metrics.completedToday} completed`
        }
      />
      <Card label="Pending now" value={metrics.pendingNow} />
    </div>
  );
}