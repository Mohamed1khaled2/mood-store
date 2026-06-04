"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addProduct } from "../../../actions";
import { Product } from "../../../data/store";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      slug: (formData.get("slug") as string).toLowerCase().replace(/\s+/g, '-'),
      name: {
        ar: formData.get("name_ar") as string,
        en: formData.get("name_en") as string,
      },
      description: {
        ar: formData.get("desc_ar") as string,
        en: formData.get("desc_en") as string,
      },
      note: {
        ar: formData.get("note_ar") as string,
        en: formData.get("note_en") as string,
      },
      price: formData.get("price") as string,
      oldPrice: formData.get("oldPrice") as string || undefined,
      color: formData.get("color") as string,
      accentColor: formData.get("accentColor") as string,
      category: formData.get("category") as string,
      isSoldOut: formData.get("isSoldOut") === "on",
    };

    await addProduct(newProduct);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h2>
          <p className="text-gray-500 mt-1">أدخل تفاصيل العطر الجديد الخاص بك.</p>
        </div>
        <Link
          href="/admin/products"
          className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-50 transition shadow-sm"
        >
          إلغاء
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-8">
        
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">البيانات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (عربي) *</label>
              <input required name="name_ar" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (إنجليزي) *</label>
              <input required name="name_en" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">الرابط المخصص (Slug) *</label>
              <input required name="slug" type="text" placeholder="مثال: amber-night" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">التسعير والتصنيف</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر الحالي *</label>
              <input required name="price" type="text" placeholder="مثال: LE 2,250.00" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر القديم (اختياري)</label>
              <input name="oldPrice" type="text" placeholder="مثال: LE 3,000.00" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">معرف التصنيف (Category ID) *</label>
              <input required name="category" type="text" placeholder="مثال: amber, musk, floral" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="isSoldOut" name="isSoldOut" className="w-4 h-4 text-[#201711] rounded focus:ring-[#f4d7b1]" />
            <label htmlFor="isSoldOut" className="text-sm font-medium text-gray-700">المنتج غير متوفر (Sold Out)</label>
          </div>
        </div>

        {/* Notes & Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">الوصف والنوتات العطرية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النوتة العطرية (عربي) *</label>
              <input required name="note_ar" type="text" placeholder="مثال: عنبر، فانيليا، عود" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النوتة العطرية (إنجليزي) *</label>
              <input required name="note_en" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي) *</label>
              <textarea required name="desc_ar" rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (إنجليزي) *</label>
              <textarea required name="desc_en" rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr"></textarea>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">الألوان (للتصميم)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">لون الزجاجة (Hex) *</label>
              <div className="flex gap-2">
                <input required name="color" type="color" defaultValue="#8c5a3c" className="h-10 w-10 rounded cursor-pointer" />
                <input required name="color" type="text" defaultValue="#8c5a3c" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اللون المميز (Accent Hex) *</label>
              <div className="flex gap-2">
                <input required name="accentColor" type="color" defaultValue="#f4d7b1" className="h-10 w-10 rounded cursor-pointer" />
                <input required name="accentColor" type="text" defaultValue="#f4d7b1" className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#201711] text-[#fffaf3] px-8 py-3 rounded-lg font-medium hover:bg-[#3a2a20] transition shadow-md ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
          </button>
        </div>

      </form>
    </div>
  );
}
