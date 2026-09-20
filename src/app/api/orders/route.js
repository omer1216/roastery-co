import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { lineUnitPrice, deliveryFeeFor } from "@/lib/cart";

const N8N_ORDER_WEBHOOK_URL = process.env.N8N_ORDER_WEBHOOK_URL;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function generateReference() {

  const n = Math.floor(1000 + Math.random() * 9000);
  return `RC-${n}`;
}

function validCustomization(item, customizations = {}) {
  const allowed = item.customizations ?? {};

  if (customizations.size && !allowed.sizes?.includes(customizations.size)) {
    return `${item.name} has no size ${customizations.size}`;
  }

  if (customizations.milk && !allowed.milk?.includes(customizations.milk)) {
    return `${item.name} has no milk option ${customizations.milk}`;
  }

  if (
    customizations.sweetness &&
    !allowed.sweetness?.includes(customizations.sweetness)
  ) {
    return `${item.name} has no sweetness ${customizations.sweetness}`;
  }

  if (customizations.temperature) {
    const t = item.temperature;
    if (t === null) return `${item.name} has no temperature option`;
    if (t !== "both" && t !== customizations.temperature) {
      return `${item.name} is ${t} only`;
    }
  }

  return null;
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    items,
    customer_name,
    phone,
    customer_email,
    order_type,
    delivery_address,
    notes,
  } = body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  if (!customer_name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Name and phone required" }, { status: 400 });
  }

  const email = customer_email?.trim().toLowerCase() ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (!["pickup", "delivery"].includes(order_type)) {
    return NextResponse.json({ error: "Invalid order type" }, { status: 400 });
  }

  if (order_type === "delivery" && !delivery_address?.trim()) {
    return NextResponse.json(
      { error: "Delivery address required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  const ids = [...new Set(items.map((line) => line.menuItemId))];

  const { data: menuRows, error: menuError } = await supabase
    .from("menu_items")
    .select("*")
    .in("id", ids);

  if (menuError) {
    console.error("[orders] menu lookup failed:", menuError.message);
    return NextResponse.json({ error: "Could not verify order" }, { status: 500 });
  }

  const menuById = new Map(menuRows.map((row) => [row.id, row]));

  const verifiedItems = [];
  let subtotal = 0;

  for (const line of items) {
    const item = menuById.get(line.menuItemId);

    if (!item) {
      return NextResponse.json(
        { error: `Unknown item: ${line.menuItemId}` },
        { status: 400 }
      );
    }

    if (!item.available) {
      return NextResponse.json(
        { error: `${item.name} is sold out` },
        { status: 409 }
      );
    }

    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return NextResponse.json(
        { error: `Invalid quantity for ${item.name}` },
        { status: 400 }
      );
    }

    const customizationError = validCustomization(item, line.customizations);
    if (customizationError) {
      return NextResponse.json({ error: customizationError }, { status: 400 });
    }

    const price = lineUnitPrice(item, line.customizations ?? {});
    subtotal += price * qty;

    verifiedItems.push({
      menuItemId: item.id,
      name: item.name,
      qty,
      price,
      customizations: line.customizations ?? {},
    });
  }

  const deliveryFee = deliveryFeeFor(subtotal, order_type);
  const total = subtotal + deliveryFee;

    const orderRow = {
    items: verifiedItems,
    customer_name: customer_name.trim(),
    phone: phone.trim(),
    customer_email: email,
    order_type,
    delivery_address:
      order_type === "delivery" ? delivery_address.trim() : null,
    notes: notes?.trim() || null,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    status: "pending",
  };

  const SELECT_FIELDS =
    "id, reference, total, subtotal, delivery_fee, order_type, delivery_address, notes, created_at";

  let order = null;
  let insertError = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("orders")
      .insert({ ...orderRow, reference: generateReference() })
      .select(SELECT_FIELDS)
      .single();

    if (!error) {
      order = data;
      insertError = null;
      break;
    }

    insertError = error;

    // 23505 = unique violation. Any other error is real, so stop.
    if (error.code !== "23505") break;
  }

  if (!order) {
    console.error("[orders] insert failed:", insertError?.message);
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }

  if (N8N_ORDER_WEBHOOK_URL) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      new URL(request.url).origin;

    fetch(N8N_ORDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...order,
        items: verifiedItems,
        customer_name,
        phone,
        customer_email: email,
        tracking_url: `${baseUrl}/order/${order.reference}`,
      }),
    }).catch((err) => console.error("[orders] webhook failed:", err));
  }

  return NextResponse.json({ ok: true, order });
}