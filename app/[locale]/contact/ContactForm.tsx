"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/app/i18n";

type ContactFormProps = {
  locale: Locale;
  whatsappNumber: string;
  fallbackEmail: string;
};

export default function ContactForm({
  locale,
  whatsappNumber,
  fallbackEmail,
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const isAr = locale === "ar";

  const cleanWhatsapp = useMemo(
    () => whatsappNumber.replace(/[^0-9]/g, ""),
    [whatsappNumber]
  );

  const labels = {
    title: isAr ? "ابعتلنا رسالة" : "Send us a message",
    name: isAr ? "الاسم" : "Name",
    phone: isAr ? "رقم الموبايل" : "Phone number",
    message: isAr ? "رسالتك" : "Message",
    namePlaceholder: isAr ? "اكتب اسمك" : "Your name",
    phonePlaceholder: isAr ? "مثال: 01000000000" : "Example: 01000000000",
    messagePlaceholder: isAr
      ? "قولنا محتاج مساعدة في ايه"
      : "Tell us what you need help with",
    submit: isAr ? "إرسال على واتساب" : "Send on WhatsApp",
    emailSubmit: isAr ? "إرسال بالإيميل" : "Send by email",
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = [
      isAr ? "رسالة جديدة من موقع Mood Store" : "New message from Mood Store website",
      `${labels.name}: ${name}`,
      `${labels.phone}: ${phone}`,
      `${labels.message}: ${message}`,
    ].join("\n");

    if (cleanWhatsapp) {
      window.open(
        `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
      "Mood Store contact"
    )}&body=${encodeURIComponent(text)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-[#201711]/10 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-bold uppercase tracking-wider text-[#201711]">
        {labels.title}
      </h2>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5b4434]">
            {labels.name}
          </span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={labels.namePlaceholder}
            className="h-12 rounded-xl border border-[#201711]/10 bg-[#fffaf3] px-4 text-sm text-[#201711] outline-none transition focus:border-[#8c5a3c] focus:ring-2 focus:ring-[#8c5a3c]/10"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5b4434]">
            {labels.phone}
          </span>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={labels.phonePlaceholder}
            dir="ltr"
            className="h-12 rounded-xl border border-[#201711]/10 bg-[#fffaf3] px-4 text-sm text-[#201711] outline-none transition focus:border-[#8c5a3c] focus:ring-2 focus:ring-[#8c5a3c]/10"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5b4434]">
            {labels.message}
          </span>
          <textarea
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={labels.messagePlaceholder}
            rows={5}
            className="resize-none rounded-xl border border-[#201711]/10 bg-[#fffaf3] px-4 py-3 text-sm leading-6 text-[#201711] outline-none transition focus:border-[#8c5a3c] focus:ring-2 focus:ring-[#8c5a3c]/10"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#201711] px-5 text-sm font-bold uppercase tracking-wider text-[#fffaf3] transition hover:bg-[#3a2a20]"
      >
        {cleanWhatsapp ? labels.submit : labels.emailSubmit}
      </button>
    </form>
  );
}
