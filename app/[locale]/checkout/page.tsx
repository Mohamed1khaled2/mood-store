"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { dictionary, Locale } from "@/app/i18n";
import { createOrder } from "@/app/admin/actions";
import { Order, OrderItem } from "@/data/db";

const EGYPT_GOVERNORATES = [
  { id: "cairo", names: { en: "Cairo", ar: "القاهرة" }, fee: 80 },
  { id: "giza", names: { en: "Giza", ar: "الجيزة" }, fee: 80 },
  { id: "alexandria", names: { en: "Alexandria", ar: "الإسكندرية" }, fee: 90 },
  { id: "qalyubia", names: { en: "Qalyubia", ar: "القليوبية" }, fee: 90 },
  { id: "gharbia", names: { en: "Gharbia", ar: "الغربية" }, fee: 100 },
  { id: "monufia", names: { en: "Monufia", ar: "المنوفية" }, fee: 100 },
  { id: "dakahlia", names: { en: "Dakahlia", ar: "الدقهلية" }, fee: 100 },
  { id: "sharqia", names: { en: "Sharqia", ar: "الشرقية" }, fee: 100 },
  { id: "beheira", names: { en: "Beheira", ar: "البحيرة" }, fee: 100 },
  { id: "damietta", names: { en: "Damietta", ar: "دمياط" }, fee: 110 },
  { id: "port_said", names: { en: "Port Said", ar: "بورسعيد" }, fee: 110 },
  { id: "ismailia", names: { en: "Ismailia", ar: "الإسماعيلية" }, fee: 110 },
  { id: "suez", names: { en: "Suez", ar: "السويس" }, fee: 110 },
  { id: "kafr_el_sheikh", names: { en: "Kafr El Sheikh", ar: "كفر الشيخ" }, fee: 110 },
  { id: "fayoum", names: { en: "Fayoum", ar: "الفيوم" }, fee: 110 },
  { id: "beni_suef", names: { en: "Beni Suef", ar: "بني سويف" }, fee: 110 },
  { id: "minya", names: { en: "Minya", ar: "المنيا" }, fee: 120 },
  { id: "assiut", names: { en: "Assiut", ar: "أسيوط" }, fee: 120 },
  { id: "sohag", names: { en: "Sohag", ar: "سوهاج" }, fee: 120 },
  { id: "qena", names: { en: "Qena", ar: "قنا" }, fee: 130 },
  { id: "luxor", names: { en: "Luxor", ar: "الأقصر" }, fee: 130 },
  { id: "aswan", names: { en: "Aswan", ar: "أسوان" }, fee: 130 },
  { id: "red_sea", names: { en: "Red Sea", ar: "البحر الأحمر" }, fee: 140 },
  { id: "matrouh", names: { en: "Matrouh", ar: "مطروح" }, fee: 140 },
  { id: "north_sinai", names: { en: "North Sinai", ar: "شمال سيناء" }, fee: 150 },
  { id: "south_sinai", names: { en: "South Sinai", ar: "جنوب سيناء" }, fee: 150 },
  { id: "new_valley", names: { en: "New Valley", ar: "الوادي الجديد" }, fee: 150 },
];

type CheckoutPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = use(params);
  const dict = dictionary[locale] || dictionary.en;
  const isRtl = locale === "ar";
  const router = useRouter();
  const placeholderImage = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";

  const { cartItems, cartSubtotal, clearCart, isInitialized } = useCart();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  // Custom dropdown state
  const [isGovDropdownOpen, setIsGovDropdownOpen] = useState(false);
  const [govSearchQuery, setGovSearchQuery] = useState("");
  const govDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (govDropdownRef.current && !govDropdownRef.current.contains(e.target as Node)) {
        setIsGovDropdownOpen(false);
        setGovSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedGovData = EGYPT_GOVERNORATES.find((g) => g.id === selectedGovernorate);

  // Complimentary shipping over 2000 EGP
  const shippingFee = selectedGovData
    ? (cartSubtotal >= 2000 ? 0 : selectedGovData.fee)
    : 0;

  const total = cartSubtotal + shippingFee;

  // Filter governorates by search
  const filteredGovernorates = EGYPT_GOVERNORATES.filter((gov) =>
    gov.names[locale].toLowerCase().includes(govSearchQuery.toLowerCase()) ||
    gov.names.en.toLowerCase().includes(govSearchQuery.toLowerCase())
  );

  // Protect page (if cart empty, go home)
  useEffect(() => {
    if (isInitialized && cartItems.length === 0 && !isPending) {
      router.push(`/${locale}`);
    }
  }, [isInitialized, cartItems, locale, router, isPending]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#fffaf3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#201711]" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !selectedGovernorate || !address) {
      setError(locale === "ar" ? "برجاء ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    if (cartItems.length === 0) return;

    setIsPending(true);
    setError("");

    try {
      const orderId = `MOOD-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const newOrder: Order = {
        id: orderId,
        customerName: fullName,
        customerPhone: phone,
        customerGovernorate: selectedGovData?.names[locale] || selectedGovernorate,
        customerAddress: address,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingFee: shippingFee,
        total: total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await createOrder(newOrder);
      clearCart();
      router.push(`/${locale}/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      setError(locale === "ar" ? "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى." : "An error occurred. Please try again.");
      setIsPending(false);
    }
  };

  if (cartItems.length === 0 && !isPending) return null;

  const formatCurrency = (amount: number) => {
    return `${isRtl ? "ج.م " : "EGP "}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <main
      className="min-h-screen bg-[#fffaf3] pb-32 md:pb-24"
      style={{ fontFamily: isRtl ? "var(--font-cairo), sans-serif" : "var(--font-geist-sans), sans-serif" }}
    >
      {/* Mobile-first Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#201711]/5 sticky top-0 z-20 px-4 py-4 md:px-8">
        <div className="max-w-3xl lg:max-w-6xl mx-auto flex items-center gap-3">
          <Link
            href={`/${locale}`}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-[#201711]/10 hover:bg-[#201711]/5 transition flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "rotate-180" : ""}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Link>
          <h1 className="text-base font-bold uppercase tracking-wider text-[#201711]">
            {dict.checkout.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl lg:max-w-6xl mx-auto px-4 md:px-8 pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

          {/* ━━━━━━━━ LEFT: Customer Form ━━━━━━━━ */}
          <div className="w-full lg:flex-1 space-y-5 order-2 lg:order-1">

            {error && (
              <div className="p-3.5 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Customer Info Section */}
            <div className="bg-white rounded-2xl border border-[#201711]/5 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#201711]/5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-[#8c5a3c]/10 text-[#8c5a3c] flex items-center justify-center text-xs font-bold">1</div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#201711]">
                  {dict.checkout.customerInfo}
                </h2>
              </div>

              <div className="p-5 space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#201711]/60">
                    {dict.checkout.fullName} <span className="text-[#8c5a3c]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#201711]/10 bg-[#fffaf3]/50 focus:outline-none focus:border-[#8c5a3c] focus:ring-1 focus:ring-[#8c5a3c]/20 text-sm text-[#201711] transition-all"
                    placeholder={isRtl ? "محمد أحمد" : "John Doe"}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#201711]/60">
                    {dict.checkout.phone} <span className="text-[#8c5a3c]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-[#201711]/10 bg-[#fffaf3]/50 focus:outline-none focus:border-[#8c5a3c] focus:ring-1 focus:ring-[#8c5a3c]/20 text-sm text-[#201711] transition-all"
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                  />
                </div>

                {/* Governorate - Custom Dropdown */}
                <div className="space-y-1.5" ref={govDropdownRef}>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#201711]/60">
                    {dict.checkout.governorate} <span className="text-[#8c5a3c]">*</span>
                  </label>

                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsGovDropdownOpen(!isGovDropdownOpen);
                      setGovSearchQuery("");
                    }}
                    className={`w-full h-12 px-4 rounded-xl border bg-[#fffaf3]/50 text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isGovDropdownOpen
                        ? "border-[#8c5a3c] ring-1 ring-[#8c5a3c]/20"
                        : "border-[#201711]/10"
                    }`}
                  >
                    <span className={selectedGovernorate ? "text-[#201711] font-medium" : "text-gray-400"}>
                      {selectedGovData
                        ? `${selectedGovData.names[locale]} ${selectedGovData.fee > 0 ? `(${formatCurrency(cartSubtotal >= 2000 ? 0 : selectedGovData.fee)} ${isRtl ? "شحن" : "shipping"})` : ""}`
                        : dict.checkout.selectGovernorate}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isGovDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Custom Dropdown Panel */}
                  {isGovDropdownOpen && (
                    <div className="relative z-30">
                      <div className="absolute top-1 left-0 right-0 bg-white rounded-xl border border-[#201711]/10 shadow-xl overflow-hidden max-h-[300px] flex flex-col">
                        {/* Search Input */}
                        <div className="p-3 border-b border-[#201711]/5 sticky top-0 bg-white z-10">
                          <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? "right-3" : "left-3"}`}>
                              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                              type="text"
                              autoFocus
                              value={govSearchQuery}
                              onChange={(e) => setGovSearchQuery(e.target.value)}
                              className={`w-full h-10 rounded-lg border border-[#201711]/10 bg-[#fffaf3]/50 text-sm text-[#201711] focus:outline-none focus:border-[#8c5a3c] transition ${isRtl ? "pr-9 pl-3" : "pl-9 pr-3"}`}
                              placeholder={isRtl ? "ابحث عن المحافظة..." : "Search governorate..."}
                            />
                          </div>
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto flex-1 overscroll-contain">
                          {filteredGovernorates.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-gray-400">
                              {isRtl ? "لا توجد نتائج" : "No results found"}
                            </div>
                          ) : (
                            filteredGovernorates.map((gov) => {
                              const isSelected = selectedGovernorate === gov.id;
                              const displayFee = cartSubtotal >= 2000 ? 0 : gov.fee;
                              return (
                                <button
                                  key={gov.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedGovernorate(gov.id);
                                    setIsGovDropdownOpen(false);
                                    setGovSearchQuery("");
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-[#8c5a3c]/5 text-[#8c5a3c] font-bold"
                                      : "text-[#201711] hover:bg-[#fffaf3]"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? "border-[#8c5a3c]" : "border-gray-300"
                                    }`}>
                                      {isSelected && <div className="h-2 w-2 rounded-full bg-[#8c5a3c]" />}
                                    </div>
                                    <span className="font-medium">{gov.names[locale]}</span>
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    displayFee === 0 ? "text-[#8c5a3c]" : "text-gray-400"
                                  }`}>
                                    {displayFee === 0
                                      ? (isRtl ? "مجاني" : "Free")
                                      : `${isRtl ? "ج.م" : "EGP"} ${displayFee}`}
                                  </span>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#201711]/60">
                    {dict.checkout.address} <span className="text-[#8c5a3c]">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[#201711]/10 bg-[#fffaf3]/50 focus:outline-none focus:border-[#8c5a3c] focus:ring-1 focus:ring-[#8c5a3c]/20 text-sm text-[#201711] resize-none transition-all"
                    placeholder={dict.checkout.addressPlaceholder}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━ RIGHT: Order Summary ━━━━━━━━ */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-20 order-1 lg:order-2 space-y-5">

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl border border-[#201711]/5 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#201711]/5 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-[#8c5a3c]/10 text-[#8c5a3c] flex items-center justify-center text-xs font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#201711]">
                  {dict.checkout.orderSummary}
                </h2>
                <span className="text-[10px] font-bold bg-[#8c5a3c]/10 text-[#8c5a3c] px-2 py-0.5 rounded-full ms-auto">
                  {cartItems.reduce((sum, i) => sum + i.quantity, 0)} {isRtl ? "قطعة" : "items"}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#201711]/5 max-h-[250px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="px-5 py-3.5 flex items-center gap-3.5">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-[#201711]/5 flex-shrink-0 bg-[#f8f9fa]">
                      <Image
                        src={item.product.images?.[0] || placeholderImage}
                        alt={item.product.name[locale]}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#201711] truncate">{item.product.name[locale]}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">x{item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-[#201711] flex-shrink-0">{item.product.price}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="px-5 py-4 border-t border-[#201711]/5 space-y-2.5 bg-[#fffaf3]/50">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">{dict.checkout.subtotal}</span>
                  <span className="font-bold text-[#201711]">{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">{dict.checkout.shipping}</span>
                  <span className="font-bold">
                    {selectedGovernorate ? (
                      shippingFee === 0 ? (
                        <span className="text-[#8c5a3c]">{isRtl ? "شحن مجاني ✨" : "Free ✨"}</span>
                      ) : (
                        <span className="text-[#201711]">{formatCurrency(shippingFee)}</span>
                      )
                    ) : (
                      <span className="text-gray-300 text-[10px]">—</span>
                    )}
                  </span>
                </div>

                {/* Free shipping nudge */}
                {cartSubtotal < 2000 && (
                  <div className="pt-1">
                    <div className="bg-[#8c5a3c]/5 rounded-lg px-3 py-2 text-[10px] text-[#8c5a3c] font-bold text-center">
                      {isRtl
                        ? `أضف ${formatCurrency(2000 - cartSubtotal)} للحصول على شحن مجاني 🚀`
                        : `Add ${formatCurrency(2000 - cartSubtotal)} more for free shipping 🚀`}
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold border-t border-[#201711]/10 pt-3 mt-1">
                  <span className="uppercase tracking-wider text-[#201711]">{dict.checkout.total}</span>
                  <span className="text-[#201711] text-base">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button - visible on desktop, hidden on mobile (shown as sticky footer) */}
            <div className="hidden lg:block space-y-3">
              <button
                type="submit"
                disabled={isPending || !selectedGovernorate}
                className={`w-full h-13 flex items-center justify-center rounded-xl bg-[#201711] text-xs font-bold uppercase tracking-widest text-[#fffaf3] transition-all shadow-md ${
                  isPending || !selectedGovernorate ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                }`}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#fffaf3]" />
                    {dict.checkout.placing}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    {dict.checkout.placeOrder}
                  </div>
                )}
              </button>
              <Link
                href={`/${locale}`}
                className="flex justify-center text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#201711] transition py-1"
              >
                {dict.checkout.backToCart}
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* ━━━━━━━━ MOBILE Sticky Footer ━━━━━━━━ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#201711]/5 px-4 py-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{dict.checkout.total}</span>
          <span className="text-base font-black text-[#201711]">{formatCurrency(total)}</span>
        </div>
        <button
          type="submit"
          form="checkout-form"
          onClick={handleSubmit as any}
          disabled={isPending || !selectedGovernorate}
          className={`w-full h-12 flex items-center justify-center rounded-xl bg-[#201711] text-xs font-bold uppercase tracking-widest text-[#fffaf3] transition-all ${
            isPending || !selectedGovernorate ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98] cursor-pointer"
          }`}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#fffaf3]" />
              {dict.checkout.placing}
            </div>
          ) : (
            dict.checkout.placeOrder
          )}
        </button>
      </div>
    </main>
  );
}
