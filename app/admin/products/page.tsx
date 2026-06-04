import Link from "next/link";
import { getDb } from "@/data/db";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import DeleteProductButton from "./DeleteProductButton";

export default async function ProductsAdminPage() {
  const db = await getDb();
  const products = db.products;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h2>
          <p className="text-gray-500 mt-1">تصفح، أضف، وعدل المنتجات المعروضة في المتجر.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#201711] text-[#fffaf3] px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-[#3a2a20] transition shadow-sm"
        >
          <FiPlus className="text-lg" />
          إضافة منتج جديد
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">المنتج (عربي)</th>
                <th className="p-4 font-medium">المنتج (إنجليزي)</th>
                <th className="p-4 font-medium">السعر</th>
                <th className="p-4 font-medium">التصنيف</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-8 rounded-md shrink-0 border border-gray-200"
                        style={{ backgroundColor: product.color }}
                      />
                      <span className="font-semibold text-gray-900">{product.name.ar}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.name.en}</td>
                  <td className="p-4 text-gray-900 font-medium">{product.price}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.isSoldOut ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                        نفذت الكمية
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                        متاح
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/products/edit/${product.id}`} className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition" title="تعديل">
                        <FiEdit2 />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    لا توجد منتجات حالياً. أضف منتجك الأول!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
