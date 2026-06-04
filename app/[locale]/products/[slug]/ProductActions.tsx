"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/store";
import { Dictionary, Locale } from "@/app/i18n";
import { useCart } from "@/components/CartContext";

type ProductActionsProps = {
  product: Product;
  locale: Locale;
  dict: Dictionary;
};

export default function ProductActions({ product, locale, dict }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (product.isSoldOut) return;
    addToCart(product, quantity);
    router.push(`/${locale}/checkout`);
  };

  if (product.isSoldOut) {
    return (
      <div className="mt-8 space-y-4">
        <button
          disabled
          className="w-full h-12 flex items-center justify-center rounded-xl bg-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest cursor-not-allowed"
        >
          {dict.productDetail.outOfStock}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Quantity Picker */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#201711]">
          {locale === "ar" ? "الكمية" : "Quantity"}
        </span>
        <div className="flex items-center border border-[#201711]/10 rounded-xl bg-white/50 overflow-hidden">
          <button
            onClick={handleDecrement}
            className="px-4 py-2 hover:bg-[#201711]/5 font-bold transition text-[#201711]"
          >
            -
          </button>
          <span className="px-6 text-sm font-bold text-[#201711] min-w-[3rem] text-center select-none">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="px-4 py-2 hover:bg-[#201711]/5 font-bold transition text-[#201711]"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleAddToCart}
          className="h-12 flex items-center justify-center rounded-xl border border-[#201711] bg-transparent text-[#201711] text-xs font-bold uppercase tracking-widest hover:bg-[#201711]/5 transition active:scale-[0.99] cursor-pointer"
        >
          {dict.productDetail.addToCart}
        </button>
        <button
          onClick={handleBuyNow}
          className="h-12 flex items-center justify-center rounded-xl bg-[#201711] text-[#fffaf3] text-xs font-bold uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] transition shadow-md cursor-pointer"
        >
          {dict.productDetail.buyNow}
        </button>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            {locale === "ar" ? "الإجمالي" : "Total Price"}
          </span>
          <span className="text-lg font-bold text-[#201711]">
            {product.price}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end max-w-[70%]">
          {/* Add to Cart icon */}
          <button
            onClick={handleAddToCart}
            aria-label={dict.productDetail.addToCart}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#201711]/20 text-[#201711] hover:bg-[#201711]/5 transition active:scale-95 cursor-pointer bg-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
          
          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="h-12 flex-1 flex items-center justify-center rounded-xl bg-[#201711] text-[#fffaf3] text-xs font-bold uppercase tracking-widest hover:opacity-95 active:scale-[0.99] transition shadow-md cursor-pointer"
          >
            {dict.productDetail.buyNow}
          </button>
        </div>
      </div>
    </div>
  );
}
