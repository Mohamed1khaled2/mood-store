import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import { isLocale, dictionary } from "@/app/i18n";
import { notFound } from "next/navigation";
import { getSettings } from "@/data/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Mood Store",
  description: "Premium Perfumes",
};

import { CartProvider } from "@/components/CartContext";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = dictionary[locale];
  const settings = await getSettings();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}
      >
        <CartProvider>
          <Header locale={locale} dict={dict} />
          {children}
          <Footer locale={locale} dict={dict} />
          <BottomBar 
            locale={locale} 
            whatsappNumber={settings.whatsapp}
            navCards={settings.navCards}
          />
          {/* Spacer for mobile bottom bar */}
          <div className="h-20 md:hidden" />
        </CartProvider>
      </body>
    </html>
  );
}
