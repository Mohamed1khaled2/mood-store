"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCategory } from "../../../actions";
import { Category } from "@/data/store";

export default function EditCategoryForm({ category }: { category: Category }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const updatedCategory: Category = {
      id: category.id, // Keep original ID
      name: {
        ar: formData.get("name_ar") as string,
        en: formData.get("name_en") as string,
      },
      description: {
        ar: formData.get("desc_ar") as string,
        en: formData.get("desc_en") as string,
      },
      color: formData.get("color") as string,
      textColor: formData.get("textColor") as string,
      productCount: category.productCount, // Maintain current count
    };

    await updateCategory(updatedCategory);
    router.push("/admin/categories");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تعديل التصنيف: {category.name.ar}</h2>
          <p className="text-gray-500 mt-1">قم بتعديل تفاصيل الفئة أو التصنيف الحالي.</p>
        </div>
        <Link
          href="/admin/categories"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف (عربي) *</label>
              <input required name="name_ar" type="text" defaultValue={category.name.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف (إنجليزي) *</label>
              <input required name="name_en" type="text" defaultValue={category.name.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">معرف التصنيف (ID - غير قابل للتعديل)</label>
              <input readOnly name="id" type="text" defaultValue={category.id} className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-4 py-2 outline-none cursor-not-allowed text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">الوصف</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي) *</label>
              <textarea required name="desc_ar" rows={4} defaultValue={category.description.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (إنجليزي) *</label>
              <textarea required name="desc_en" rows={4} defaultValue={category.description.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr"></textarea>
            </div>
          </div>
        </div>

        {/* Style / Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">الألوان (للتصميم)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">لون الخلفية (Hex) *</label>
              <div className="flex gap-2">
                <input name="color_picker" type="color" defaultValue={category.color} onChange={(e) => {
                  const txtInput = document.getElementById("color_txt") as HTMLInputElement;
                  if (txtInput) txtInput.value = e.target.value;
                }} className="h-10 w-10 rounded cursor-pointer" />
                <input required id="color_txt" name="color" type="text" defaultValue={category.color} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">لون النص (Hex) *</label>
              <div className="flex gap-2">
                <input name="textColor_picker" type="color" defaultValue={category.textColor} onChange={(e) => {
                  const txtInput = document.getElementById("textColor_txt") as HTMLInputElement;
                  if (txtInput) txtInput.value = e.target.value;
                }} className="h-10 w-10 rounded cursor-pointer" />
                <input required id="textColor_txt" name="textColor" type="text" defaultValue={category.textColor} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
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
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>

      </form>
    </div>
  );
}
