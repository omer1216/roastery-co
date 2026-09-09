import { NextResponse } from "next/server";
import { advanceOrder } from "@/lib/orders";

export async function PATCH(request, { params }) {
  const { id } = await params;

  const result = await advanceOrder(id);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ order: result.order });
}