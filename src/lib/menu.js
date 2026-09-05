import { createReadClient } from "@/lib/supabase/server";

export async function getMenuItems() {
  const supabase = createReadClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[menu] fetch failed:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getPopularItems() {
  const items = await getMenuItems();
  return items.filter((item) => item.popular);
}
