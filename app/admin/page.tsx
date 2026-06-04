import { getDb } from "../data/db";
import { FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp } from "react-icons/fi";

export default async function AdminDashboard() {
  const db = await getDb();
  const productsCount = db.products.length;
  const categoriesCount = db.categories.length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة</h2>
        <p className="mt-1 text-gray-500">
          أهلا بك في لوحة إدارة مود ستور. هنا ملخص نشاط المتجر اليوم.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            <FiDollarSign />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">إجمالي الإيرادات</p>
            <p className="text-2xl font-bold text-gray-900">45,231 ج.م</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <FiShoppingBag />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">إجمالي المنتجات</p>
            <p className="text-2xl font-bold text-gray-900">{productsCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <FiUsers />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">إجمالي العملاء</p>
            <p className="text-2xl font-bold text-gray-900">1,204</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <FiTrendingUp />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">التصنيفات</p>
            <p className="text-2xl font-bold text-gray-900">{categoriesCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">أحدث الطلبات</h3>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
          لا توجد طلبات حديثة حتى الآن. عند شراء العملاء للمنتجات ستظهر الطلبات هنا.
        </div>
      </div>
    </div>
  );
}
