import { getDb } from "@/data/db";
import { FiShoppingBag, FiLayers, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = await getDb();
  const productsCount = db.products.length;
  const categoriesCount = db.categories.length;
  const orders = db.orders || [];

  // Statistics
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
  const completedOrdersCount = orders.filter((o) => o.status === "delivered").length;
  const totalOrdersCount = orders.length;

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded">قيد الانتظار</span>;
      case "shipped":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded">تم الشحن</span>;
      case "delivered":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 rounded">تم التوصيل</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 rounded">ملغي</span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة</h2>
        <p className="mt-1 text-sm text-gray-500">
          أهلاً بك في لوحة إدارة مود ستور. إليك ملخص نشاط المتجر والإحصائيات الحالية.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FiDollarSign />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">إجمالي المبيعات</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} ج.م
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <FiClock />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">طلبات قيد الانتظار</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{pendingOrdersCount} طلب</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">الطلبات المسلمة</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{completedOrdersCount} طلب</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <FiShoppingBag />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400">إجمالي المنتجات</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{productsCount} منتج</p>
          </div>
        </div>
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Recent Orders Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">أحدث الطلبات</h3>
            <Link href="/admin/orders" className="text-xs font-bold text-[#8c5a3c] hover:underline">
              عرض كل الطلبات
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-400 flex-1 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📦</span>
              لا توجد طلبات مسجلة حتى الآن.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-50">
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">العميل</th>
                    <th className="p-4">المحافظة</th>
                    <th className="p-4">الإجمالي</th>
                    <th className="p-4">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-[#8c5a3c]">
                        <Link href="/admin/orders" className="hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4 text-gray-500">{order.customerGovernorate}</td>
                      <td className="p-4 font-bold">LE {order.total.toLocaleString()}</td>
                      <td className="p-4">{getStatusLabel(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories and Store Stats */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">إحصائيات المتجر</h3>

          <div className="space-y-4 text-xs font-medium text-gray-700">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500">
                <FiLayers className="text-base text-gray-400" />
                عدد التصنيفات النشطة
              </span>
              <span className="font-bold text-gray-900">{categoriesCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500">
                <FiShoppingBag className="text-base text-gray-400" />
                إجمالي الطلبات
              </span>
              <span className="font-bold text-gray-900">{totalOrdersCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-gray-500 text-red-600">
                ⚠️ طلبات ملغية
              </span>
              <span className="font-bold text-red-600">
                {orders.filter((o) => o.status === "cancelled").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
