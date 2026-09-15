import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/menu";
import { validateToolCall } from "@/lib/chat/validate";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { menuItemId, quantity, customizations } = body;

    const menuItems = await getMenuItems();

    const outcome = validateToolCall({
      name: "add_to_cart",
      args: {
        item_name: menuItemId,
        quantity: Number(quantity) || 1,
        ...(customizations ?? {}),
        __resolved: true,
      },
      menuItems,
      cartLines: [],
    });

    if (!outcome.ok) {
      return NextResponse.json({ error: outcome.error }, { status: 400 });
    }

    return NextResponse.json({
      action: outcome.action,
      result: outcome.result,
    });
  } catch (error) {
    console.error("[chat/add]", error);
    return NextResponse.json({ error: "Could not add that." }, { status: 500 });
  }
}