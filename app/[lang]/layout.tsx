import { notFound } from "next/navigation";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { dictionary, getDirection, isLocale, locales } from "../i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = dictionary[lang];

  return (
    <div lang={lang} dir={getDirection(lang)} className="flex min-h-full flex-col">
      <Header locale={lang} dict={dict} />
      {children}
      <Footer locale={lang} dict={dict} />
    </div>
  );
}
