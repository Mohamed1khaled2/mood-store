import { getDb } from "@/data/db";
import OrdersList from "./OrdersList";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const db = await getDb();
  const orders = db.orders || [];

  // Sort orders by date descending
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store orders, track shipments, and update payment/fulfillment statuses.
          </p>
        </div>
      </div>

      <OrdersList initialOrders={sortedOrders} />
    </main>
  );
}
