"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addSection } from "../../actions";
import { StoreSection } from "@/data/db";
import { Product } from "@/data/store";
import { FiSearch } from "react-icons/fi";

export default function NewSectionForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const newSection: StoreSection = {
      id: `s-${Date.now()}`,
      type: formData.get("type") as "grid" | "carousel" | "featured",
      title: {
        ar: formData.get("title_ar") as string,
        en: formData.get("title_en") as string,
      },
      productIds: selectedProductIds,
      order: parseInt(formData.get("order") as string) || 99,
    };

    await addSection(newSection);
    router.push("/admin/sections");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.ar.includes(searchQuery) ||
      p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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

        {/* Product Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <label className="text-sm font-semibold text-gray-800">اختر المنتجات لهذا القسم ({selectedProductIds.length} محدد)</label>
            
            {/* Simple Search bar */}
            <div className="relative w-48 sm:w-64">
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="بحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pr-9 pl-3 py-1.5 text-xs focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-100">
            {filteredProducts.map((product) => {
              const isChecked = selectedProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => handleToggleProduct(product.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? "bg-[#fffaf3] border-[#201711] ring-1 ring-[#201711]"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // toggled by wrapper click
                      className="w-4 h-4 text-[#201711] rounded border-gray-300 focus:ring-[#f4d7b1]"
                    />
                    <div
                      className="h-8 w-6 rounded border border-gray-200"
                      style={{ backgroundColor: product.color }}
                    />
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900">{product.name.ar}</p>
                      <p className="text-[10px] text-gray-500">{product.name.en}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {product.category}
                  </span>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <p className="col-span-2 text-center text-xs text-gray-500 py-6">لا توجد منتجات مطابقة للبحث.</p>
            )}
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
            {isSubmitting ? "جاري الحفظ..." : "إضافة القسم"}
          </button>
        </div>

      </form>
    </div>
  );
}
