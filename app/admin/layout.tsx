import type { Metadata } from "next";
import Link from "next/link";
import { Cairo } from "next/font/google";
import "../globals.css";
import AdminSidebar from "./AdminSidebar";

export const metadata: Metadata = {
  title: {
    default: "لوحة التحكم | مود ستور",
    template: "%s | مود ستور",
  },
};

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
          <AdminSidebar />

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
