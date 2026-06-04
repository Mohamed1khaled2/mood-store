import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import type { Dictionary, Locale } from "@/app/i18n";
import { getSettings } from "@/data/db";

type FooterProps = {
  locale: Locale;
  dict: Dictionary;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#f4d7b1]/80">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="inline-flex text-[14px] font-normal text-white/70 transition-all duration-300 hover:text-[#f4d7b1] hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const PaymentIcons = () => (
  <div className="flex items-center gap-3 text-white/30">
    {/* Visa */}
    <svg className="h-3 w-auto hover:text-white/60 transition-colors duration-300" viewBox="0 0 36 12" fill="currentColor">
      <path d="M13.67 11.66H15.6l1.2-7.46h-1.93l-1.2 7.46zm5.83-7.28c-.36-.14-.92-.28-1.61-.28-1.78 0-3.03.95-3.04 2.3-.01 1 .89 1.56 1.57 1.89.7.34.94.56.94.87-.01.47-.56.68-1.08.68-.72 0-1.11-.11-1.7-.37l-.24-.11-.25 1.57c.42.2.1.2.17.35.6.28 1.39.52 2.19.52 1.89 0 3.13-.93 3.15-2.38.01-.8-.47-1.4-1.51-1.9-.63-.32-1.02-.53-1.02-.86 0-.3.33-.61 1-.61.56-.01.97.12 1.49.34l.18.08.27-1.69zm3.28 4.54c.17-.48.85-2.32.85-2.32-.01.02.17-.48.28-.78l.15.71s.4 1.96.49 2.39h-1.77zm2.7-4.72h-1.36c-.42 0-.74.12-.92.57l-3.25 7.73h1.99l.39-1.09h2.43l.23 1.09h1.75L28.18 4.2zm-24.6 7.46l2.03-7.46H3.58L1.56 9.38C1.33 9.98 1.15 10.2 0.74 10.42V10.6h3.14l.66-4.14 2.53 5.2h2.15L6.68 4.2H4.66L2.21 11.66H3.58z" />
    </svg>
    {/* Mastercard */}
    <svg className="h-4.5 w-auto hover:text-white/60 transition-colors duration-300" viewBox="0 0 28 16" fill="currentColor">
      <path d="M9 14.5c3.038 0 5.5-2.462 5.5-5.5S12.038 3.5 9 3.5 3.5 5.962 3.5 9s2.462 5.5 5.5 5.5z" opacity="0.6" />
      <path d="M19 14.5c3.038 0 5.5-2.462 5.5-5.5S22.038 3.5 19 3.5 13.5 5.962 13.5 9s2.462 5.5 5.5 5.5z" opacity="0.6" />
      <path d="M14 9c0 1.25-.42 2.4-1.12 3.32A5.467 5.467 0 0 0 14.5 9a5.467 5.467 0 0 0-1.62-3.32c.7-.92 1.12-2.07 1.12-3.32" />
    </svg>
    {/* Cash on delivery */}
    <span className="text-[8px] font-bold tracking-widest border border-white/10 rounded px-1.5 py-0.5 uppercase hover:text-white/60 hover:border-white/30 transition-colors duration-300 cursor-default select-none">
      COD
    </span>
  </div>
);

export default async function Footer({ locale, dict }: FooterProps) {
  const otherLocale = locale === "ar" ? "en" : "ar";
  const settings = await getSettings();
  
  // Format WhatsApp number to link
  const cleanPhone = settings.whatsapp.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  return (
    <footer className="relative bg-gradient-to-b from-[#18110d] to-[#0c0806] border-t border-[#8c5a3c]/15 px-6 pb-6 pt-16 text-white sm:px-10 md:px-16 overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] lg:gap-12 relative z-10">
        
        {/* Column 1: Brand & Socials */}
        <div className="flex flex-col gap-6 sm:col-span-2 md:col-span-1">
          <div className="flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="Mood Store"
              width={120}
              height={40}
              className="h-auto w-[110px] brightness-0 invert"
              priority
              style={{ width: "auto", height: "auto" }}
            />
            <p className="text-[13px] leading-relaxed text-white/50 font-normal max-w-xs">
              {locale === "ar"
                ? "نصنع لحظات استثنائية من خلال أرقى تركيبات العطور الفاخرة، المصممة خصيصاً لتناسب يومك وتغير إحساس المكان."
                : "Crafting exceptional moments through fine fragrance, custom-designed to shift the room and elevate your daily rituals."}
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            {settings.whatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-110 hover:border-[#25D366]/30 hover:bg-[#25D366] hover:text-white"
              >
                <FaWhatsapp className="text-base" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-110 hover:border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:scale-110 hover:border-[#ee2a7b]/30 hover:bg-gradient-to-tr hover:from-[#f9ce71] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white"
              >
                <FaInstagram className="text-base" />
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Language Switcher */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#f4d7b1]/80">
            {dict.footer.languageTitle}
          </h3>
          <p className="text-[13px] leading-relaxed text-white/40 max-w-[180px]">
            {locale === "ar"
              ? "تصفح الموقع باللغة الإنجليزية"
              : "Browse the website in Arabic"}
          </p>
          <div>
            <a
              href={`/${otherLocale}`}
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:border-[#f4d7b1]/30 hover:bg-white/10 hover:text-[#f4d7b1]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#f4d7b1] transition-transform duration-300 group-hover:scale-125" />
              {dict.footer.languageLabel}
            </a>
          </div>
        </div>

        {/* Column 3, 4, 5: Custom Links */}
        <FooterColumn
          title={dict.footer.companyTitle}
          links={dict.footer.companyLinks}
        />
        <FooterColumn 
          title={dict.footer.moreTitle} 
          links={dict.footer.moreLinks} 
        />
        <FooterColumn
          title={dict.footer.customerTitle}
          links={dict.footer.customerLinks}
        />
      </div>

      {/* Bottom Bar: Copyright & Payment */}
      <div className="mx-auto mt-16 max-w-7xl border-t border-white/5 pt-8 relative z-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[11px] text-white/40 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} Mood Store.{" "}
            {locale === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <PaymentIcons />
        </div>
      </div>

      {/* Large luxury background wordmark */}
      <div className="mt-10 select-none text-center pointer-events-none overflow-hidden h-[8vw] sm:h-[6vw] relative z-0">
        <span className="text-[11vw] font-black tracking-[0.25em] text-white/[0.015] uppercase leading-none block">
          MOOD
        </span>
      </div>
    </footer>
  );
}

