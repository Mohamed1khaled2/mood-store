import Link from "next/link";
import { getDb } from "../../data/db";
import { FiPlus, FiEdit2, FiMove } from "react-icons/fi";
import DeleteSectionButton from "./DeleteSectionButton";

export default async function SectionsAdminPage() {
  const db = await getDb();
  const sections = db.sections.sort((a, b) => a.order - b.order);

  const getSectionTypeName = (type: string) => {
    switch (type) {
      case "grid": return "شبكة منتجات (Grid)";
      case "carousel": return "شريط متحرك (Carousel)";
      case "featured": return "منتج مميز (Featured)";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">أقسام الصفحة الرئيسية</h2>
          <p className="text-gray-500 mt-1">أضف ورتب الأقسام اللي بتظهر في الصفحة الرئيسية للمتجر.</p>
        </div>
        <Link
          href="/admin/sections/new"
          className="bg-[#201711] text-[#fffaf3] px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-[#3a2a20] transition shadow-sm"
        >
          <FiPlus className="text-lg" />
          إضافة قسم جديد
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium w-16">الترتيب</th>
                <th className="p-4 font-medium">عنوان القسم (عربي)</th>
                <th className="p-4 font-medium">عنوان القسم (إنجليزي)</th>
                <th className="p-4 font-medium">نوع العرض</th>
                <th className="p-4 font-medium">عدد المنتجات</th>
                <th className="p-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                      {section.order}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">{section.title.ar}</td>
                  <td className="p-4 text-gray-600">{section.title.en}</td>
                  <td className="p-4">
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-100">
                      {getSectionTypeName(section.type)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">{section.productIds.length}</span> منتجات
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="h-8 w-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition" title="تعديل (قريباً)">
                        <FiEdit2 />
                      </button>
                      <DeleteSectionButton sectionId={section.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {sections.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    لا يوجد أقسام لعرضها. أضف قسم جديد لتحديث واجهة المتجر.
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
