"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addSection } from "../../../actions";
import { StoreSection } from "../../../data/db";

export default function NewSectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const productIdsStr = formData.get("productIds") as string;
    const productIds = productIdsStr.split(",").map(id => id.trim()).filter(Boolean);
    
    const newSection: StoreSection = {
      id: `s-${Date.now()}`,
      type: formData.get("type") as "grid" | "carousel" | "featured",
      title: {
        ar: formData.get("title_ar") as string,
        en: formData.get("title_en") as string,
      },
      productIds: productIds,
      order: parseInt(formData.get("order") as string) || 99,
    };

    await addSection(newSection);
    router.push("/admin/sections");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إضافة قسم جديد</h2>
          <p className="text-gray-500 mt-1">أضف قسم جديد للصفحة الرئيسية (مثل: الأكثر مبيعاً).</p>
        </div>
        <Link
          href="/admin/sections"
          className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-50 transition shadow-sm"
        >
          إلغاء
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان القسم (عربي) *</label>
            <input required name="title_ar" type="text" placeholder="مثال: تشكيلة الصيف" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان القسم (إنجليزي) *</label>
            <input required name="title_en" type="text" placeholder="e.g: Summer Collection" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">نوع العرض *</label>
            <select required name="type" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition">
              <option value="grid">شبكة منتجات (Grid)</option>
              <option value="carousel">شريط متحرك (Carousel)</option>
              <option value="featured">منتج مميز كبير (Featured)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب في الصفحة (رقم) *</label>
            <input required name="order" type="number" defaultValue="1" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">معرفات المنتجات (Product IDs)</label>
          <input name="productIds" type="text" placeholder="مثال: p1, p2, p3" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
          <p className="text-xs text-gray-500 mt-1">افصل بين كل ID بفاصلة (,)</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#201711] text-[#fffaf3] px-8 py-3 rounded-lg font-medium hover:bg-[#3a2a20] transition shadow-md ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "جاري الحفظ..." : "إضافة القسم"}
          </button>
        </div>

      </form>
    </div>
  );
}
