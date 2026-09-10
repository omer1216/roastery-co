import { NextResponse } from "next/server";
import { advanceOrder, rejectOrder } from "@/lib/orders";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const action = body.action ?? "advance";

    let result;
    if (action === "reject") {
      result = await rejectOrder(id, body.reason);
    } else if (action === "advance") {
      result = await advanceOrder(id);
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

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