import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
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
        .channel("admin-orders")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          (payload) => {
            if (payload.new) send("order", payload.new);
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