"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiGrid,
  FiBox,
  FiList,
  FiSettings,
  FiShoppingBag,
} from "react-icons/fi";
import { FiLoader } from "react-icons/fi";

const navLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: FiGrid, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: FiBox },
  { href: "/admin/categories", label: "التصنيفات", icon: FiList },
  {
    href: "/admin/sections",
    label: "أقسام الصفحة الرئيسية",
    icon: FiList,
  },
  { href: "/admin/orders", label: "الطلبات", icon: FiShoppingBag },
];

const bottomLinks = [
  { href: "/admin/settings", label: "الإعدادات", icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  // When pathname changes, the navigation is done — clear loading
  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleClick = (href: string) => {
    // Don't show loading if we're already on this page
    if (isActive(href, href === "/admin")) return;
    setLoadingHref(href);
  };

  return (
    <aside className="w-64 bg-[#201711] text-[#fffaf3] flex flex-col shrink-0">
      <div className="p-6 border-b border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-xl font-bold"
        >
          مود <span className="text-[#f4d7b1]">إدارة</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);
          const loading = loadingHref === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleClick(link.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-white/15 text-[#f4d7b1] font-bold"
                  : "hover:bg-white/10 text-[#fffaf3]/80 font-medium"
              }`}
            >
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#f4d7b1] rounded-l-full" />
              )}

              {loading ? (
                <FiLoader className="text-lg animate-spin text-[#f4d7b1]" />
              ) : (
                <Icon
                  className={`text-lg transition-colors ${
                    active ? "text-[#f4d7b1]" : "group-hover:text-[#f4d7b1]/70"
                  }`}
                />
              )}

              <span>{link.label}</span>

              {loading && (
                <span className="mr-auto">
                  <span className="flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-[#f4d7b1] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f4d7b1]"></span>
                  </span>
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          const loading = loadingHref === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleClick(link.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                active
                  ? "bg-white/15 text-[#f4d7b1] font-bold"
                  : "hover:bg-white/10 text-gray-400 font-medium"
              }`}
            >
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#f4d7b1] rounded-l-full" />
              )}

              {loading ? (
                <FiLoader className="text-lg animate-spin text-[#f4d7b1]" />
              ) : (
                <Icon className="text-lg" />
              )}

              <span>{link.label}</span>

              {loading && (
                <span className="mr-auto">
                  <span className="flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-[#f4d7b1] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f4d7b1]"></span>
                  </span>
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
