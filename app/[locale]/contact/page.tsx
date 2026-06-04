import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { isLocale, type Locale } from "@/app/i18n";
import { getSettings } from "@/data/db";
import { absoluteUrl, localizedPath, siteConfig } from "@/utils/site-config";
import ContactForm from "./ContactForm";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

function cleanPhoneForTel(phone: string) {
  return phone.replace(/[^+0-9]/g, "");
}

function cleanPhoneForWhatsapp(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const title = locale === "ar" ? "تواصل معنا" : "Contact us";
  const description =
    locale === "ar"
      ? "تواصل مع Mood Store عبر واتساب أو الهاتف أو البريد الإلكتروني لخدمة الطلبات والاستفسارات."
      : "Contact Mood Store through WhatsApp, phone, or email for orders and fragrance support.";
  const path = localizedPath(locale, "/contact");

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: localizedPath("en", "/contact"),
        ar: localizedPath("ar", "/contact"),
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: siteConfig.name,
      images: [{ url: absoluteUrl("/logo.png"), alt: siteConfig.name }],
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const settings = await getSettings();
  const typedLocale = locale as Locale;
  const isAr = typedLocale === "ar";
  const whatsappNumber = cleanPhoneForWhatsapp(settings.whatsapp);
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";
  const phoneHref = settings.contactPhone
    ? `tel:${cleanPhoneForTel(settings.contactPhone)}`
    : "";
  const emailHref = settings.contactEmail ? `mailto:${settings.contactEmail}` : "";

  const copy = {
    eyebrow: isAr ? "خدمة العملاء" : "Customer care",
    title: isAr ? "تواصل مع Mood Store" : "Contact Mood Store",
    intro: isAr
      ? "لو عندك سؤال عن طلب، عطر، توصيل، أو محتاج ترشيح مناسب، كلمنا مباشرة وهنرد عليك في أسرع وقت."
      : "Need help with an order, a fragrance, delivery, or a scent recommendation? Reach us directly and we will get back to you quickly.",
    quickTitle: isAr ? "طرق التواصل" : "Contact channels",
    hoursTitle: isAr ? "مواعيد الرد" : "Response hours",
    hours: isAr
      ? "بنرد يوميا من 10 صباحا إلى 10 مساء بتوقيت القاهرة."
      : "We reply daily from 10 AM to 10 PM Cairo time.",
    locationTitle: isAr ? "الطلبات والتوصيل" : "Orders and delivery",
    location: isAr
      ? "استخدم واتساب لأسرع متابعة للطلبات وتأكيد بيانات الشحن."
      : "Use WhatsApp for the fastest order follow-up and shipping confirmation.",
    backShop: isAr ? "العودة للتسوق" : "Back to shop",
  };

  const contactCards = [
    {
      label: "WhatsApp",
      value: settings.whatsapp,
      href: whatsappHref,
      icon: <FaWhatsapp className="text-lg" />,
      isExternal: true,
    },
    {
      label: isAr ? "الهاتف" : "Phone",
      value: settings.contactPhone,
      href: phoneHref,
      icon: <span className="text-sm font-black">TEL</span>,
      isExternal: false,
    },
    {
      label: isAr ? "البريد الإلكتروني" : "Email",
      value: settings.contactEmail,
      href: emailHref,
      icon: <span className="text-sm font-black">@</span>,
      isExternal: false,
    },
  ].filter((item) => item.value && item.href);

  return (
    <main className="min-h-screen bg-[#fffaf3] text-[#201711]">
      <section className="px-4 pb-16 pt-14 sm:px-6 md:px-10 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c5a3c]">
              {copy.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5b4434]">
              {copy.intro}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-[#201711]/10 bg-white/60 p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#8c5a3c]">
                  {copy.hoursTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5b4434]">
                  {copy.hours}
                </p>
              </div>
              <div className="rounded-md border border-[#201711]/10 bg-white/60 p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#8c5a3c]">
                  {copy.locationTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5b4434]">
                  {copy.location}
                </p>
              </div>
            </div>

            <Link
              href={localizedPath(typedLocale, "/#shop")}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-xl border border-[#201711]/15 px-5 text-xs font-bold uppercase tracking-wider text-[#201711] transition hover:bg-white"
            >
              {copy.backShop}
            </Link>
          </div>

          <div className="grid gap-5">
            <div className="rounded-md border border-[#201711]/10 bg-white/60 p-5 sm:p-6">
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {copy.quickTitle}
              </h2>
              <div className="mt-5 grid gap-3">
                {contactCards.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-xl border border-[#201711]/10 bg-[#fffaf3] p-4 transition hover:border-[#8c5a3c]/40 hover:bg-white"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#201711] text-[#fffaf3]">
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-widest text-[#8c5a3c]">
                        {item.label}
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold text-[#201711]">
                        {item.value}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                {settings.facebook && (
                  <a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#201711]/10 text-[#201711] transition hover:bg-[#1877F2] hover:text-white"
                  >
                    <FaFacebookF className="text-sm" />
                  </a>
                )}
                {settings.instagram && (
                  <a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#201711]/10 text-[#201711] transition hover:bg-[#201711] hover:text-white"
                  >
                    <FaInstagram className="text-base" />
                  </a>
                )}
              </div>
            </div>

            <ContactForm
              locale={typedLocale}
              whatsappNumber={settings.whatsapp}
              fallbackEmail={settings.contactEmail}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
