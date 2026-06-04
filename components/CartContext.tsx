"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Image from "next/image";
import { type Locale, dictionary } from "@/app/i18n";
import { useParams } from "next/navigation";
import { Product } from "@/data/store";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  isInitialized: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("mood_store_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mood_store_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Helper to parse numeric values from currency string like "LE 2,250.00" or "$85"
  const parsePrice = (priceStr: string): number => {
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + parsePrice(item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartSubtotal,
        isInitialized: mounted,
      }}
    >
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
};

const CartDrawer: React.FC = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const dict = dictionary[locale] || dictionary.en;
  const isRtl = locale === "ar";

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const placeholderImage = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";

  return (
    <div className="fixed inset-0 z-[250] flex justify-end" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1c120c]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Body */}
      <div
        className={`relative z-10 w-[420px] max-w-[90vw] h-full bg-[#fffaf3] shadow-2xl flex flex-col justify-between transition-transform duration-500 ease-out border-l border-[#201711]/10 ${
          isRtl ? "left-0" : "right-0"
        }`}
        style={{
          fontFamily: isRtl ? "var(--font-cairo), sans-serif" : "var(--font-geist-sans), sans-serif",
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#201711]/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#201711] tracking-wider uppercase">
            {dict.cart.title}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-[#201711]/5 text-[#201711] transition"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <span className="text-4xl">🛍️</span>
              <div>
                <p className="text-base font-bold text-[#201711]">{dict.cart.empty}</p>
                <p className="text-xs text-gray-500 mt-1">{dict.cart.emptyDesc}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-2.5 bg-[#201711] text-[#fffaf3] text-xs font-bold uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition"
              >
                {dict.cart.continueShopping}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#201711]/5">
              {cartItems.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  <div className="relative w-20 h-24 bg-white/50 rounded-lg overflow-hidden border border-[#201711]/5 flex-shrink-0">
                    <Image
                      src={item.product.images?.[0] || placeholderImage}
                      alt={item.product.name[locale]}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#201711] line-clamp-1">
                          {item.product.name[locale]}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest"
                        >
                          {dict.cart.remove}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                        {item.product.note[locale]}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#201711]/10 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold hover:bg-[#201711]/5 text-[#201711]"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#201711]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold hover:bg-[#201711]/5 text-[#201711]"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-bold text-[#201711]">{item.product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[#201711]/5 bg-[#fffaf3] space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center text-sm font-bold text-[#201711]">
              <span className="uppercase tracking-wider">{dict.cart.subtotal}</span>
              <span>
                {locale === "ar" ? "ج.م " : "EGP "}
                {cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <a
              href={`/${locale}/checkout`}
              onClick={() => setIsCartOpen(false)}
              className="flex w-full h-12 items-center justify-center rounded-xl bg-[#201711] text-xs font-bold uppercase tracking-widest text-[#fffaf3] hover:scale-[1.01] active:scale-[0.99] transition shadow-md"
            >
              {dict.cart.checkout}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
