import { NextResponse } from "next/server";
import { advanceOrder } from "@/lib/orders";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const result = await advanceOrder(id);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ order: result.order });
  } catch (error) {
    console.error("[admin/orders PATCH]", error);
    return NextResponse.json(
      { error: error.message || "Server error." },
      { status: 500 }
    );
  }
}