import { getRecentOrders } from "@/lib/orders";
import OrdersBoard from "@/components/admin/OrdersBoard";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getRecentOrders();

  return (
    <main className="min-h-screen bg-roastery-bg px-6 py-10 lg:px-10">
      <OrdersBoard initialOrders={orders} />
    </main>
  );
}