import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { isLocale, dictionary } from "@/app/i18n";
import { notFound } from "next/navigation";
import { getSettings } from "@/data/db";
import { absoluteUrl, localizedPath, siteConfig } from "@/utils/site-config";

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

import { CartProvider } from "@/components/CartContext";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : siteConfig.defaultLocale;
  const settings = await getSettings();
  const title = settings.storeName?.[safeLocale] || siteConfig.name;
  const description =
    settings.storeDescription?.[safeLocale] || siteConfig.defaultDescription;
  const canonicalPath = localizedPath(safeLocale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    applicationName: title,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: localizedPath("en"),
        ar: localizedPath("ar"),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      siteName: siteConfig.name,
      type: "website",
      locale: safeLocale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: safeLocale === "ar" ? ["en_US"] : ["ar_EG"],
      images: [
        {
          url: absoluteUrl("/logo.png"),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/logo.png")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

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
          <FloatingWhatsAppButton
            locale={locale}
            whatsappNumber={settings.whatsapp}
          />
        </CartProvider>
      </body>
    </html>
  );
}
