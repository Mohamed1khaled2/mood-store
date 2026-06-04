"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/app/i18n";

export type BottomBarNavCard = {
  label: { ar: string; en: string };
  type: "custom" | "categories";
  icon?: string;
  showInBottomBar?: boolean;
  links?: Array<{ label: { ar: string; en: string }; href: string }>;
};

type BottomBarProps = {
  locale: Locale;
  whatsappNumber?: string;
  navCards?: BottomBarNavCard[];
};

export default function BottomBar({ 
  locale, 
  whatsappNumber = "+201234567890",
  navCards = []
}: BottomBarProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("home");

  // Live search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    if (isSearchOpen) {
      import("@/app/admin/actions").then(({ getProductsList }) => {
        getProductsList().then((data) => {
          setProducts(data);
          setFilteredProducts(data);
        });
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSearchQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = products.filter((p) => {
      const nameAr = p.name?.ar?.toLowerCase() || "";
      const nameEn = p.name?.en?.toLowerCase() || "";
      const cat = p.category?.toLowerCase() || "";
      return nameAr.includes(q) || nameEn.includes(q) || cat.includes(q);
    });
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Detect active section based on hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setActiveTab(hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isAr = locale === "ar";

  // Format WhatsApp number cleanly
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  const getIconSvg = (iconName?: string) => {
    switch (iconName) {
      case "grid":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        );
      case "star":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case "heart":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        );
      case "gift":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <polyline points="20 12 20 22 4 22 4 12" />
            <rect x="2" y="7" width="20" height="5" />
            <line x1="12" y1="22" x2="12" y2="7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        );
      case "link":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      case "bag":
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        );
    }
  };

  // Filter and build dynamic tabs
  const activeNavCards = (navCards || [])
    .filter((card) => card.showInBottomBar)
    .slice(0, 3); // Max 3 items in bottom bar

  interface TabItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    isSearch?: boolean;
    isExternal?: boolean;
  }

  const dynamicTabs: TabItem[] = activeNavCards.map((card, idx) => {
    const label = card.label[locale] || card.label.en;
    let href = `/${locale}/#shop`;
    if (card.type === "custom" && card.links && card.links.length > 0) {
      const linkHref = card.links[0].href;
      href = linkHref.startsWith("/") ? `/${locale}${linkHref}` : linkHref;
    }

    return {
      id: `navcard-${idx}`,
      label,
      href,
      icon: getIconSvg(card.icon)
    };
  });

  const tabs: TabItem[] = [
    {
      id: "home",
      label: isAr ? "الرئيسية" : "Home",
      href: `/${locale}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    ...dynamicTabs,
    {
      id: "search",
      label: isAr ? "بحث" : "Search",
      href: "#",
      isSearch: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
    {
      id: "contact",
      label: isAr ? "تواصل" : "Contact",
      href: whatsappUrl,
      isExternal: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
  ];

  const shouldHide = pathname?.includes("/checkout") || pathname?.includes("/products/");
  if (shouldHide) return null;

  return (
    <nav
      id="mobile-bottom-bar"
      className={`
        fixed bottom-0 left-0 right-0 z-[200]
        md:hidden
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
    >
      {/* Glassmorphism backdrop */}
      <div
        className="mx-3 mb-3 rounded-2xl border border-white/20 shadow-[0_-4px_30px_rgba(32,23,17,0.12)]"
        style={{
          background: "rgba(255, 250, 243, 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="flex items-center justify-around py-2 px-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            const content = (
              <div className="flex flex-col items-center gap-0.5 relative py-1.5 px-2 min-w-[52px]">
                {/* Active indicator dot */}
                <div
                  className={`absolute -top-0.5 w-1 h-1 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-[#8c5a3c] scale-100 opacity-100"
                      : "bg-transparent scale-0 opacity-0"
                  }`}
                />
                {/* Icon */}
                <div
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-[#8c5a3c] scale-110"
                      : "text-[#201711]/50"
                  }`}
                >
                  {tab.icon}
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] font-medium leading-tight transition-all duration-300 ${
                    isActive
                      ? "text-[#8c5a3c]"
                      : "text-[#201711]/50"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );

            if (tab.isExternal) {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-none focus:outline-none active:scale-95 transition-transform"
                  aria-label={tab.label}
                >
                  {content}
                </a>
              );
            }

            if (tab.isSearch) {
              return (
                <button
                  key={tab.id}
                  onClick={() => setIsSearchOpen(true)}
                  className="outline-none focus:outline-none active:scale-95 transition-transform cursor-pointer"
                  aria-label={tab.label}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className="outline-none focus:outline-none active:scale-95 transition-transform"
                aria-label={tab.label}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Live Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-md flex flex-col pt-16 px-4 pb-6 transition-all duration-300">
          <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh] border border-gray-100">
            {/* Search Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-sm font-bold text-[#201711] uppercase tracking-wider">
                {locale === "ar" ? "البحث عن منتج" : "Search Product"}
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Input Bar */}
            <div className="mt-4 relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "ar" ? "ابحث بالاسم أو الفئة..." : "Search by name or category..."}
                className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50/50 px-4 pl-10 pr-4 text-sm text-[#201711] outline-none transition focus:border-[#8c5a3c]/30 focus:ring-2 focus:ring-[#8c5a3c]/10"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>

            {/* Search Results */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400 font-medium">
                  {locale === "ar" ? "لا توجد نتائج مطابقة" : "No results match your search"}
                </div>
              ) : (
                filteredProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/${locale}/products/${prod.slug || prod.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                  >
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <Image
                        src={prod.images?.[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=80"}
                        alt={prod.name[locale]}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#201711] truncate">
                        {prod.name[locale]}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                        {prod.category}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#8c5a3c] flex-shrink-0">
                      {prod.price}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Safe area spacer for notched devices */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-transparent" />
    </nav>
  );
}
