import Link from "next/link";
import { getDb } from "@/data/db";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import DeleteCategoryButton from "./DeleteCategoryButton";

export const metadata = { title: "التصنيفات" };
export default async function CategoriesAdminPage() {
  const db = await getDb();
  const categories = db.categories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة التصنيفات</h2>
          <p className="text-gray-500 mt-1">أضف وحذف تصنيفات العطور (مثل: عنبر، مسك، إلخ).</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-[#201711] text-[#fffaf3] px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-[#3a2a20] transition shadow-sm"
        >
          <FiPlus className="text-lg" />
          إضافة تصنيف
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">التصنيف (عربي)</th>
                <th className="p-4 font-medium">التصنيف (إنجليزي)</th>
                <th className="p-4 font-medium">اللون</th>
                <th className="p-4 font-medium">عدد المنتجات (تقريبي)</th>
                <th className="p-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full border border-gray-200"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-gray-900">{cat.name.ar}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{cat.name.en}</td>
                  <td className="p-4 text-gray-600" dir="ltr">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{cat.color}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-100">
                      {cat.productCount}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/categories/edit/${cat.id}`} className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition" title="تعديل">
                        <FiEdit2 />
                      </Link>
                      <DeleteCategoryButton categoryId={cat.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    لا يوجد تصنيفات حالياً.
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
