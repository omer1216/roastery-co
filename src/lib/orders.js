import "server-only";
import { createServiceClient } from "@/lib/supabase/server";

export const STATUSES = ["pending", "confirmed", "preparing", "ready"];

export function nextStatus(current) {
  const index = STATUSES.indexOf(current);
  if (index === -1 || index === STATUSES.length - 1) return null;
  return STATUSES[index + 1];
}

// Pakistan is a fixed +05:00 offset, no DST, so this is safe arithmetic.
export function startOfDayPKT(now = new Date()) {
  const shifted = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  shifted.setUTCHours(0, 0, 0, 0);
  return new Date(shifted.getTime() - 5 * 60 * 60 * 1000);
}

export async function getRecentOrders() {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function advanceOrder(id) {
  const supabase = createServiceClient();

  const { data: current, error: readError } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", id)
    .single();

  if (readError || !current) return { error: "Order not found.", status: 404 };

  const target = nextStatus(current.status);
  if (!target) return { error: "Order is already at the final stage.", status: 409 };

  const { data, error } = await supabase
    .from("orders")
    .update({ status: target })
    .eq("id", id)
    .eq("status", current.status) // guards against two baristas clicking at once
    .select()
    .single();

  if (error || !data) return { error: "Status already changed.", status: 409 };
  return { order: data };
}