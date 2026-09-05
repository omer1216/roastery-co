import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { MENU_ITEMS } from "../src/data/menu.js";

dotenv.config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const rows = MENU_ITEMS.map((item, index) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  category: item.category,
  price: item.price,
  customizations: item.customizations ?? {},
  temperature: item.temperature ?? null,
  popular: item.popular ?? false,
  image_url: item.image_url ?? null,
  available: item.available ?? true,
  sort_order: index,
}));

const { error } = await supabase
  .from("menu_items")
  .upsert(rows, { onConflict: "id" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

const { count } = await supabase
  .from("menu_items")
  .select("*", { count: "exact", head: true });

console.log(`Seeded ${rows.length} items. Table now holds ${count}.`);
