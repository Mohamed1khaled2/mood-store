import Link from "next/link";
import { FiGrid, FiBox, FiList, FiSettings, FiShoppingBag } from "react-icons/fi";
import { Cairo } from "next/font/google";
import "../globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className={`${cairo.variable} antialiased`}>
        <div className="flex h-screen overflow-hidden bg-[#f8f9fa] text-gray-900">
      <aside className="w-64 bg-[#201711] text-[#fffaf3] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-xl font-bold"
          >
            مود <span className="text-[#f4d7b1]">إدارة</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <FiGrid className="text-lg" />
            <span className="font-medium">لوحة التحكم</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <FiBox className="text-lg" />
            <span className="font-medium">المنتجات</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <FiList className="text-lg" />
            <span className="font-medium">التصنيفات</span>
          </Link>
          <Link href="/admin/sections" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <FiList className="text-lg" />
            <span className="font-medium">أقسام الصفحة الرئيسية</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition">
            <FiShoppingBag className="text-lg" />
            <span className="font-medium">الطلبات</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-gray-400">
            <FiSettings className="text-lg" />
            <span className="font-medium">الإعدادات</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold">إدارة مود ستور</h1>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm font-medium text-blue-600 hover:underline">
              عرض المتجر
            </Link>
            <div className="h-8 w-8 rounded-full bg-[#f4d7b1] flex items-center justify-center text-[#201711] font-bold">
              م
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-[#fdfbf9]">
          {children}
        </main>
      </div>
        </div>
      </body>
    </html>
  );
}
