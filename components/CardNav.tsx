"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/app/i18n";
import { useCart } from "./CartContext";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  className?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ctaLabel?: string;
  ctaHref?: string;
  localeSwitcherHref?: string;
  localeSwitcherLabel?: string;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  items = [],
  className = "",
  baseColor = "#fffaf3",
  menuColor = "#201711",
  buttonBgColor = "#201711",
  buttonTextColor = "#fffaf3",
  ctaLabel = "Shop now",
  ctaHref = "#shop",
  localeSwitcherHref,
  localeSwitcherLabel,
}) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedCard, setMobileExpandedCard] = useState<number | null>(null);
  
  const navRef = useRef<HTMLDivElement>(null);
  const locale = localeSwitcherLabel === "EN" ? "ar" : "en";
  const isRtl = locale === "ar";

  let cart: any = null;
  try {
    cart = useCart();
  } catch (e) {}

  const isCheckout = pathname?.includes("/checkout");

  if (isCheckout) {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full bg-[#fffaf3] border-b border-[#201711]/5 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[50px]">
            {/* Back Button */}
            <div className="flex w-1/3 justify-start">
              <a
                href={`/${locale}`}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#201711]/60 hover:text-[#201711] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="rtl:rotate-180">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span className="hidden sm:inline">{locale === "ar" ? "الرئيسية" : "Home"}</span>
              </a>
            </div>
            {/* Centered Logo */}
            <div className="flex items-center justify-center w-1/3">
              <a href={`/${locale}`} aria-label="Mood home">
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={160}
                  height={46}
                  priority
                  className="h-[36px] w-auto md:h-[46px]"
                />
              </a>
            </div>
            {/* Empty Right Column to maintain flex spacing */}
            <div className="w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    setMobileExpandedCard(null);
  }, []);

  const hoveredItem = activeDropdown !== null ? items[activeDropdown] : null;

  return (
    <div ref={navRef} className={`w-full ${className}`}>
      {/* 1. Announcement Bar */}
      <div className="w-full bg-[#1c120c] text-white/95 text-center py-2.5 px-4 text-[10px] md:text-[11px] font-bold tracking-widest uppercase z-[102] relative">
        {locale === "ar"
          ? "توصيل سريع مجاني لكافة المحافظات للطلبات فوق ٢٠٠٠ ج.م"
          : "Complimentary shipping on orders above 2,000 EGP"}
      </div>

      {/* 2. Main Navigation Header */}
      <div
        className={`w-full sticky top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? "bg-[#fffaf3]/92 backdrop-blur-md shadow-[0_2px_20px_rgba(32,23,17,0.04)] border-b border-[#201711]/5 py-3"
            : "bg-[#fffaf3] border-b border-[#201711]/5 py-4"
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[50px] relative">
          
          {/* LEFT: Inline Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 w-1/3 justify-start">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.links?.[0]?.href || "#"}
                className={`text-[13px] font-bold uppercase tracking-widest text-[#201711]/80 hover:text-[#8c5a3c] transition-colors relative py-2 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#8c5a3c] after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${
                  activeDropdown === idx ? "text-[#8c5a3c] after:scale-x-100" : ""
                }`}
                onMouseEnter={() => setActiveDropdown(idx)}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* LEFT: Mobile Hamburguer Button (Mobile) */}
          <div className="flex md:hidden w-1/3 justify-start">
            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl hover:bg-[#201711]/5 transition"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={`block h-[1.5px] bg-[#201711] transition-all duration-300 ${
                  isMobileMenuOpen ? "w-[20px] translate-y-[3.25px] rotate-45" : "w-[22px]"
                }`}
              />
              <span
                className={`block h-[1.5px] bg-[#201711] transition-all duration-300 ${
                  isMobileMenuOpen ? "w-[20px] -translate-y-[3.25px] -rotate-45" : "w-[16px] self-start rtl:self-end"
                }`}
              />
            </button>
          </div>

          {/* CENTER: Logo (Both Desktop & Mobile) */}
          <div className="flex items-center justify-center w-1/3">
            <a href={`/${locale}`} aria-label="Mood home">
              <Image
                src={logo}
                alt={logoAlt}
                width={160}
                height={46}
                priority
                className="h-[36px] w-auto md:h-[46px] transition-all duration-300"
              />
            </a>
          </div>

          {/* RIGHT: Utilities (Both Desktop & Mobile) */}
          <div className="flex items-center gap-3.5 w-1/3 justify-end">
            {/* Language Switcher */}
            {localeSwitcherHref && localeSwitcherLabel && (
              <a
                className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#201711]/10 text-[10px] font-bold tracking-wider hover:bg-[#201711]/5 transition"
                href={localeSwitcherHref}
                aria-label={`Switch to ${localeSwitcherLabel}`}
              >
                {localeSwitcherLabel}
              </a>
            )}

            {/* Cart Button */}
            {cart && (
              <button
                type="button"
                onClick={() => cart.setIsCartOpen(true)}
                className="relative inline-flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#201711]/10 hover:bg-[#201711]/5 transition cursor-pointer"
                aria-label="Shopping Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cart.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8c5a3c] text-[#fffaf3] text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cart.cartCount}
                  </span>
                )}
              </button>
            )}

            {/* CTA Button (Desktop only) */}
            <a
              className="hidden md:inline-flex h-[38px] items-center rounded-xl bg-[#201711] px-5 text-[11px] font-bold uppercase tracking-wider text-[#fffaf3] transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
              href={ctaHref}
            >
              {ctaLabel}
            </a>
          </div>

          {/* 3. Dropdown Mega Menu (Desktop Hover) */}
          <div
            className={`absolute left-0 right-0 top-full bg-[#fffaf3] border-b border-[#201711]/8 transition-all duration-300 ease-out shadow-[0_20px_40px_rgba(32,23,17,0.06)] overflow-hidden z-[90] ${
              activeDropdown !== null ? "max-h-[320px] opacity-100 border-t border-[#201711]/5 py-8" : "max-h-0 opacity-0 pointer-events-none py-0"
            }`}
          >
            <div className="mx-auto max-w-7xl px-8 grid grid-cols-[1.5fr_1fr] gap-12">
              {hoveredItem && (
                <>
                  {/* Dropdown Left: Sublinks */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8c5a3c] mb-5">
                      {hoveredItem.label}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-3.5">
                      {hoveredItem.links?.map((lnk, i) => (
                        <a
                          key={i}
                          href={lnk.href}
                          className="group/link flex items-center justify-between py-1.5 border-b border-[#201711]/5 text-[14px] text-[#201711] font-semibold transition-colors hover:text-[#8c5a3c] hover:border-[#8c5a3c]/30"
                          aria-label={lnk.ariaLabel}
                        >
                          <span>{lnk.label}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 rtl:group-hover/link:-translate-x-0 rtl:translate-x-2 transition-all duration-300 text-[#8c5a3c]"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Dropdown Right: Promo Card */}
                  <div className="bg-[#1c120c] rounded-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden group/card shadow-[0_8px_24px_rgba(0,0,0,0.15)] min-h-[180px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#8c5a3c_0%,transparent_60%)] opacity-35 group-hover/card:scale-110 transition-transform duration-700" />
                    
                    <div className="relative z-10">
                      <span className="text-[9px] font-bold tracking-widest text-[#f4d7b1] uppercase">
                        {locale === "ar" ? "مميز وموصى به" : "Featured Recommendation"}
                      </span>
                      <h5 className="text-[17px] font-bold mt-2 tracking-wide">
                        {locale === "ar" ? "ليلة العنبر - Amber Night" : "Amber Night Eau de Parfum"}
                      </h5>
                      <p className="text-[12px] text-white/60 mt-1 max-w-[260px] font-normal leading-relaxed">
                        {locale === "ar" 
                          ? "توليفة دافئة من العنبر، الفانيليا والعود الثمين لإحساس بالفخامة المطلقة." 
                          : "A warm embrace of golden amber and smooth vanilla, deepened with precious oud."}
                      </p>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between mt-4">
                      <span className="text-[13px] font-semibold text-[#f4d7b1]">
                        {locale === "ar" ? "اكتشف العطور" : "Explore Scent"}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover/card:bg-[#f4d7b1] group-hover/card:text-[#1c120c] transition-all duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="rtl:rotate-180"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 4. Mobile Navigation Drawer (Slide-out menu) */}
      <>
        {/* Overlay backdrop */}
        <div
          className={`fixed inset-0 z-[190] bg-[#1c120c]/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`fixed top-0 bottom-0 z-[200] w-[280px] max-w-[85vw] bg-[#fffaf3] p-6 shadow-[0_0_40px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden flex flex-col justify-between ${
            isMobileMenuOpen
              ? isRtl
                ? "right-0 translate-x-0"
                : "left-0 translate-x-0"
              : isRtl
                ? "right-0 translate-x-full"
                : "left-0 -translate-x-full"
          }`}
        >
          <div className="space-y-6">
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#201711]/5">
              <span className="text-[15px] font-bold text-[#201711] tracking-wider uppercase">
                {locale === "ar" ? "القائمة" : "Menu"}
              </span>
              <button
                type="button"
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#201711]/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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

            {/* Accordion Links Grid */}
            <div className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <div key={idx} className="border-b border-[#201711]/5 pb-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-2 text-left rtl:text-right font-bold text-[15px] text-[#201711]"
                    onClick={() => setMobileExpandedCard(mobileExpandedCard === idx ? null : idx)}
                  >
                    <span>{item.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={`transition-transform duration-300 text-[#8c5a3c]/70 ${
                        mobileExpandedCard === idx ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Accordion content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileExpandedCard === idx ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-col gap-2.5 pl-4 pr-4 py-2 border-l rtl:border-l-0 rtl:border-r border-[#8c5a3c]/20 bg-[#201711]/2 rounded-xl">
                      {item.links?.map((lnk, i) => (
                        <a
                          key={i}
                          href={lnk.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[13px] font-semibold text-[#201711]/80 hover:text-[#8c5a3c] transition-colors py-1"
                        >
                          {lnk.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom actions in Drawer */}
          <div className="space-y-4 pt-6 border-t border-[#201711]/5">
            <a
              href={ctaHref}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-12 items-center justify-center rounded-xl bg-[#201711] text-[14px] font-bold text-[#fffaf3] text-center"
            >
              {ctaLabel}
            </a>
          </div>
        </aside>
      </>
    </div>
  );
};

export default CardNav;
