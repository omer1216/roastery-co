import { createServiceClient } from "@/lib/supabase/server";
import { toPublicOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { reference } = await params;

  if (!/^RC-\d{4}$/.test(reference)) {
    return new Response("Not found", { status: 404 });
  }

  const supabase = createServiceClient();
  const encoder = new TextEncoder();
  let channel = null;
  let keepAlive = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event, payload) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`)
          );
        } catch {
          // stream already closed
        }
      };

      send("ready", { at: Date.now() });

      keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        } catch {
          // ignore
        }
      }, 15000);

      channel = supabase
        .channel(`order-${reference}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `reference=eq.${reference}`,
          },
          (payload) => {
            if (payload.new) send("order", toPublicOrder(payload.new));
          }
        )
        .subscribe();
    },

    cancel() {
      if (keepAlive) clearInterval(keepAlive);
      if (channel) supabase.removeChannel(channel);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}