"use client";

import { useState } from "react";
import { updateSettings } from "../actions";
import { GeneralSettings, NavCardItem } from "@/data/db";
import { FiCheck, FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function SettingsForm({ initialSettings }: { initialSettings: GeneralSettings }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [navCards, setNavCards] = useState<NavCardItem[]>(initialSettings.navCards || []);

  const addCard = () => {
    const newCard: NavCardItem = {
      label: { ar: "قسم جديد", en: "New Section" },
      bgColor: "#201711",
      textColor: "#fff7ed",
      type: "custom",
      icon: "bag",
      showInBottomBar: false,
      links: [
        { label: { ar: "رابط جديد", en: "New Link" }, href: "/#shop" }
      ]
    };
    setNavCards([...navCards, newCard]);
  };

  const removeCard = (index: number) => {
    setNavCards(navCards.filter((_, idx) => idx !== index));
  };

  const updateCard = (index: number, updatedFields: Partial<NavCardItem>) => {
    setNavCards(navCards.map((card, idx) => idx === index ? { ...card, ...updatedFields } : card));
  };

  const addLink = (cardIndex: number) => {
    const card = navCards[cardIndex];
    const newLink = { label: { ar: "رابط جديد", en: "New Link" }, href: "/#shop" };
    const updatedLinks = [...(card.links || []), newLink];
    updateCard(cardIndex, { links: updatedLinks });
  };

  const removeLink = (cardIndex: number, linkIndex: number) => {
    const card = navCards[cardIndex];
    const updatedLinks = (card.links || []).filter((_, idx) => idx !== linkIndex);
    updateCard(cardIndex, { links: updatedLinks });
  };

  const updateLink = (cardIndex: number, linkIndex: number, labelAr: string, labelEn: string, href: string) => {
    const card = navCards[cardIndex];
    const updatedLinks = (card.links || []).map((link, idx) => 
      idx === linkIndex 
        ? { label: { ar: labelAr, en: labelEn }, href }
        : link
    );
    updateCard(cardIndex, { links: updatedLinks });
  };

  const moveCard = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navCards.length) return;
    const updated = [...navCards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setNavCards(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    const settings: GeneralSettings = {
      storeName: {
        ar: formData.get("name_ar") as string,
        en: formData.get("name_en") as string,
      },
      storeDescription: {
        ar: formData.get("desc_ar") as string,
        en: formData.get("desc_en") as string,
      },
      whatsapp: formData.get("whatsapp") as string,
      contactPhone: formData.get("contactPhone") as string,
      contactEmail: formData.get("contactEmail") as string,
      instagram: formData.get("instagram") as string,
      facebook: formData.get("facebook") as string,
      
      // Navbar config
      ctaLabel: {
        ar: formData.get("cta_label_ar") as string,
        en: formData.get("cta_label_en") as string,
      },
      ctaHref: formData.get("cta_href") as string,
      navCards: navCards,
    };

    try {
      await updateSettings(settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 shadow-sm animate-fade-in">
          <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <FiCheck className="text-lg" />
          </div>
          <div>
            <h4 className="font-bold">تم حفظ الإعدادات بنجاح</h4>
            <p className="text-sm text-emerald-700 mt-0.5">تم تحديث بيانات المتجر وتطبيقها في جميع الصفحات.</p>
          </div>
        </div>
      )}

      {/* Store Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-900">بيانات المتجر</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر (عربي) *</label>
            <input required name="name_ar" type="text" defaultValue={initialSettings.storeName.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المتجر (إنجليزي) *</label>
            <input required name="name_en" type="text" defaultValue={initialSettings.storeName.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر (عربي) *</label>
            <textarea required name="desc_ar" rows={3} defaultValue={initialSettings.storeDescription.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وصف المتجر (إنجليزي) *</label>
            <textarea required name="desc_en" rows={3} defaultValue={initialSettings.storeDescription.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr"></textarea>
          </div>
        </div>
      </div>

      {/* Navbar Customization */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-900">تخصيص القائمة العلوية للمتجر (Navbar)</h3>
        
        {/* CTA Button */}
        <div className="space-y-4">
          <h4 className="font-medium text-[#8c5a3c] border-r-2 border-[#8c5a3c] pr-2">زر الدعوة لاتخاذ إجراء (CTA Button)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نص الزر (عربي) *</label>
              <input required name="cta_label_ar" type="text" defaultValue={initialSettings.ctaLabel?.ar} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نص الزر (إنجليزي) *</label>
              <input required name="cta_label_en" type="text" defaultValue={initialSettings.ctaLabel?.en} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط الزر (مسار الرابط) *</label>
              <input required name="cta_href" type="text" defaultValue={initialSettings.ctaHref} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Dynamic Cards list */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-[#8c5a3c] border-r-2 border-[#8c5a3c] pr-2">أقسام القائمة (Navigation Cards)</h4>
            <button 
              type="button" 
              onClick={addCard}
              className="bg-[#8c5a3c] text-white hover:bg-[#72482f] text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm font-medium"
            >
              <FiPlus /> إضافة قسم جديد
            </button>
          </div>

          {navCards.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              لم يتم إضافة أي أقسام للقائمة بعد. أضف قسم جديد للبدء.
            </div>
          ) : (
            <div className="space-y-4">
              {navCards.map((card, cardIdx) => (
                <div key={cardIdx} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4 relative">
                  
                  {/* Header / Reorder & Delete */}
                  <div className="flex justify-between items-center border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-700">#{cardIdx + 1}</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-amber-50 text-amber-800 font-semibold">
                        {card.type === "categories" ? "التصنيفات تلقائياً" : "روابط مخصصة"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={cardIdx === 0}
                        onClick={() => moveCard(cardIdx, "up")}
                        className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-50 rounded disabled:opacity-30 disabled:hover:text-gray-500 transition"
                        title="تحريك لأعلى"
                      >
                        <FiArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={cardIdx === navCards.length - 1}
                        onClick={() => moveCard(cardIdx, "down")}
                        className="p-1.5 text-gray-500 hover:text-gray-900 bg-gray-50 rounded disabled:opacity-30 disabled:hover:text-gray-500 transition"
                        title="تحريك لأسفل"
                      >
                        <FiArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCard(cardIdx)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition mr-2"
                        title="حذف القسم"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Inputs: Label (AR / EN), Type */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">اسم القسم (عربي) *</label>
                      <input
                        required
                        type="text"
                        value={card.label.ar}
                        onChange={(e) => updateCard(cardIdx, { label: { ...card.label, ar: e.target.value } })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none transition text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">اسم القسم (إنجليزي) *</label>
                      <input
                        required
                        type="text"
                        value={card.label.en}
                        onChange={(e) => updateCard(cardIdx, { label: { ...card.label, en: e.target.value } })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none transition text-left"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">نوع القسم *</label>
                      <select
                        value={card.type}
                        onChange={(e) => updateCard(cardIdx, { type: e.target.value as "custom" | "categories" })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none transition bg-white"
                      >
                        <option value="custom">روابط مخصصة</option>
                        <option value="categories">عرض تصنيفات المتجر تلقائياً</option>
                      </select>
                    </div>
                  </div>

                  {/* Color styling & Icons & Bottom bar visibility */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">لون الخلفية (للـ Dropdown)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={card.bgColor || "#201711"}
                          onChange={(e) => updateCard(cardIdx, { bgColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0"
                        />
                        <input
                          type="text"
                          value={card.bgColor || "#201711"}
                          onChange={(e) => updateCard(cardIdx, { bgColor: e.target.value })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#f4d7b1] outline-none uppercase font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">لون النص (للـ Dropdown)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={card.textColor || "#fffaf3"}
                          onChange={(e) => updateCard(cardIdx, { textColor: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0"
                        />
                        <input
                          type="text"
                          value={card.textColor || "#fffaf3"}
                          onChange={(e) => updateCard(cardIdx, { textColor: e.target.value })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#f4d7b1] outline-none uppercase font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">أيقونة الشريط السفلي</label>
                      <select
                        value={card.icon || "bag"}
                        onChange={(e) => updateCard(cardIdx, { icon: e.target.value })}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none transition bg-white"
                      >
                        <option value="bag">حقيبة (Bag)</option>
                        <option value="grid">شبكة / أقسام (Grid)</option>
                        <option value="star">نجمة / عروض (Star)</option>
                        <option value="heart">قلب / مفضلة (Heart)</option>
                        <option value="gift">هدية / علبة (Gift)</option>
                        <option value="link">رابط (Link)</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-5 justify-center">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={card.showInBottomBar || false}
                          onChange={(e) => updateCard(cardIdx, { showInBottomBar: e.target.checked })}
                          className="w-4 h-4 rounded text-[#8c5a3c] focus:ring-[#f4d7b1] border-gray-300"
                        />
                        <span className="text-xs font-semibold text-gray-700">عرض في الشريط السفلي</span>
                      </label>
                    </div>
                  </div>

                  {/* Custom links subsection */}
                  {card.type === "custom" && (
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/30 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">الروابط المخصصة في القائمة المنسدلة</span>
                        <button
                          type="button"
                          onClick={() => addLink(cardIdx)}
                          className="text-[10px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2.5 py-1 rounded flex items-center gap-1 transition"
                        >
                          <FiPlus /> إضافة رابط جديد
                        </button>
                      </div>

                      {(card.links || []).length === 0 ? (
                        <div className="text-center py-4 text-xs text-gray-400">
                          لا يوجد أي روابط مخصصة في هذا القسم. أضف رابطاً للبدء.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(card.links || []).map((link, linkIdx) => (
                            <div key={linkIdx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center border-b border-gray-100 pb-3 md:pb-0 md:border-0">
                              <div className="md:col-span-3">
                                <input
                                  required
                                  placeholder="الاسم بالعربي"
                                  type="text"
                                  value={link.label.ar}
                                  onChange={(e) => updateLink(cardIdx, linkIdx, e.target.value, link.label.en, link.href)}
                                  className="w-full text-xs border border-gray-300 bg-white rounded px-2.5 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none text-right"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <input
                                  required
                                  placeholder="الاسم بالإنجليزي"
                                  type="text"
                                  value={link.label.en}
                                  onChange={(e) => updateLink(cardIdx, linkIdx, link.label.ar, e.target.value, link.href)}
                                  className="w-full text-xs border border-gray-300 bg-white rounded px-2.5 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none text-left"
                                  dir="ltr"
                                />
                              </div>
                              <div className="md:col-span-5">
                                <input
                                  required
                                  placeholder="رابط المسار (مثال: /#offers)"
                                  type="text"
                                  value={link.href}
                                  onChange={(e) => updateLink(cardIdx, linkIdx, link.label.ar, link.label.en, e.target.value)}
                                  className="w-full text-xs border border-gray-300 bg-white rounded px-2.5 py-1.5 focus:ring-2 focus:ring-[#f4d7b1] outline-none text-left"
                                  dir="ltr"
                                />
                              </div>
                              <div className="md:col-span-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeLink(cardIdx, linkIdx)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition inline-block"
                                  title="حذف الرابط"
                                >
                                  <FiTrash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {card.type === "categories" && (
                    <div className="text-center py-4 bg-gray-50 border border-gray-100 rounded-xl text-xs text-amber-800 font-medium">
                      هذا القسم ديناميكي بالكامل. سيقوم النظام تلقائياً بسحب تصنيفات المتجر الحالية وعرضها كروابط في القائمة المنسدلة.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-900">بيانات الاتصال</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب (WhatsApp) *</label>
            <input required name="whatsapp" type="text" defaultValue={initialSettings.whatsapp} placeholder="مثال: +201200000000" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف للاتصال</label>
            <input name="contactPhone" type="text" defaultValue={initialSettings.contactPhone} placeholder="مثال: +201200000000" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني للدعم</label>
            <input name="contactEmail" type="email" defaultValue={initialSettings.contactEmail} placeholder="example@moodstore.com" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-900">حسابات التواصل الاجتماعي</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط انستجرام (Instagram)</label>
            <input name="instagram" type="url" defaultValue={initialSettings.instagram} placeholder="https://instagram.com/yourbrand" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط فيسبوك (Facebook)</label>
            <input name="facebook" type="url" defaultValue={initialSettings.facebook} placeholder="https://facebook.com/yourbrand" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#f4d7b1] focus:border-[#201711] outline-none transition" dir="ltr" />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-[#201711] text-[#fffaf3] px-8 py-3 rounded-lg font-medium hover:bg-[#3a2a20] transition shadow-md flex items-center gap-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FiSave className="text-lg" />
          {isSubmitting ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </form>
  );
}
