import { FaWhatsapp } from "react-icons/fa";
import type { Locale } from "@/app/i18n";

type FloatingWhatsAppButtonProps = {
  locale: Locale;
  whatsappNumber?: string;
};

export default function FloatingWhatsAppButton({
  locale,
  whatsappNumber,
}: FloatingWhatsAppButtonProps) {
  const cleanPhone = whatsappNumber?.replace(/[^0-9]/g, "");
  if (!cleanPhone) return null;

  const isAr = locale === "ar";
  const message = isAr
    ? "\u0645\u0631\u062d\u0628\u0627\u060c \u0623\u062d\u062a\u0627\u062c \u0645\u0633\u0627\u0639\u062f\u0629 \u0645\u0646 Mood Store"
    : "Hello, I need help from Mood Store";
  const ariaLabel = isAr
    ? "\u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628"
    : "Contact on WhatsApp";

  return (
    <a
      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`fixed bottom-24 z-[210] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition duration-300 hover:scale-105 hover:bg-[#1ebe5d] active:scale-95 md:bottom-6 ${
        isAr ? "left-4 md:left-6" : "right-4 md:right-6"
      }`}
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
}
