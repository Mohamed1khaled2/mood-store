"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProduct } from "../../../actions";
import { Product, Category } from "@/data/store";

export default function EditProductForm({ product, categories }: { product: Product; categories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const updatedProduct: Product = {
      id: product.id,
      slug: (formData.get("slug") as string).toLowerCase().trim().replace(/\s+/g, '-'),
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

    await updateProduct(updatedProduct);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تعديل منتج: {product.name.ar}</h2>
          <p className="text-gray-500 mt-1">تعديل تفاصيل العطر والأسعار والألوان.</p>
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
              <input required name="name_ar" type="text" defaultValue={product.name.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (إنجليزي) *</label>
              <input required name="name_en" type="text" defaultValue={product.name.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">الرابط المخصص (Slug) *</label>
              <input required name="slug" type="text" defaultValue={product.slug} placeholder="مثال: amber-night" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Pricing & Category */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">التسعير والتصنيف</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر الحالي *</label>
              <input required name="price" type="text" defaultValue={product.price} placeholder="مثال: LE 2,250.00" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر القديم (اختياري)</label>
              <input name="oldPrice" type="text" defaultValue={product.oldPrice || ""} placeholder="مثال: LE 3,000.00" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف (Category) *</label>
              <select required name="category" defaultValue={product.category} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition">
                <option value="">اختر تصنيفاً...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name.ar} ({cat.name.en})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="isSoldOut" name="isSoldOut" defaultChecked={product.isSoldOut} className="w-4 h-4 text-[#201711] rounded focus:ring-[#f4d7b1]" />
            <label htmlFor="isSoldOut" className="text-sm font-medium text-gray-700">المنتج غير متوفر (Sold Out)</label>
          </div>
        </div>

        {/* Notes & Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">الوصف والنوتات العطرية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النوتة العطرية (عربي) *</label>
              <input required name="note_ar" type="text" defaultValue={product.note.ar} placeholder="مثال: عنبر، فانيليا، عود" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">النوتة العطرية (إنجليزي) *</label>
              <input required name="note_en" type="text" defaultValue={product.note.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي) *</label>
              <textarea required name="desc_ar" rows={4} defaultValue={product.description.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (إنجليزي) *</label>
              <textarea required name="desc_en" rows={4} defaultValue={product.description.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr"></textarea>
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
                <input name="color_picker" type="color" defaultValue={product.color} onChange={(e) => {
                  const txtInput = document.getElementById("color_txt") as HTMLInputElement;
                  if (txtInput) txtInput.value = e.target.value;
                }} className="h-10 w-10 rounded cursor-pointer" />
                <input required id="color_txt" name="color" type="text" defaultValue={product.color} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اللون المميز (Accent Hex) *</label>
              <div className="flex gap-2">
                <input name="accentColor_picker" type="color" defaultValue={product.accentColor} onChange={(e) => {
                  const txtInput = document.getElementById("accentColor_txt") as HTMLInputElement;
                  if (txtInput) txtInput.value = e.target.value;
                }} className="h-10 w-10 rounded cursor-pointer" />
                <input required id="accentColor_txt" name="accentColor" type="text" defaultValue={product.accentColor} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
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
