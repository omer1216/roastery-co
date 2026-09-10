import { notFound } from "next/navigation";
import { getOrderByReference } from "@/lib/orders";
import OrderStatus from "@/components/order/OrderStatus";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { reference } = await params;
  return { title: `Order ${reference} | The Roastery Co.` };
}

export default async function OrderStatusPage({ params }) {
  const { reference } = await params;
  const order = await getOrderByReference(reference);

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-roastery-bg px-6 py-16">
      <div className="mx-auto max-w-lg">
        <OrderStatus initialOrder={order} />
      </div>
    </div>
  );
}