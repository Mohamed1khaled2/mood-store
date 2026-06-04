"use client";

import { useState } from "react";
import type { Dictionary } from "@/app/i18n";

type NewsletterSectionProps = {
  dict: Dictionary;
};

export default function NewsletterSection({ dict }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="bg-[linear-gradient(150deg,#201711_0%,#3a2a20_50%,#8c5a3c_100%)] px-4 py-12 sm:px-6 md:px-10 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f4d7b1]">
          {dict.newsletter.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-[#fffaf3] sm:text-4xl">
          {dict.newsletter.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#f4d7b1]/80 sm:text-base">
          {dict.newsletter.subtitle}
        </p>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-[#f4d7b1]/20 bg-white/10 p-6">
            <p className="text-lg font-semibold text-[#f4d7b1]">✓</p>
            <p className="mt-2 text-sm text-[#fffaf3]">
              {/* Simple thank-you — keeping it bilingual-safe */}
              Thank you! 🎉
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.newsletter.placeholder}
                required
                className="h-12 flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-5 text-sm text-[#fffaf3] placeholder-[#f4d7b1]/40 outline-none transition-all duration-300 focus:border-[#f4d7b1]/40 focus:bg-white/8 focus:ring-2 focus:ring-[#f4d7b1]/10 text-center sm:text-start rtl:text-center font-medium"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#f4d7b1] px-8 text-sm font-bold text-[#201711] transition-all duration-300 hover:bg-[#e8c89e] hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
              >
                {dict.newsletter.cta}
              </button>
            </div>
            <p className="mt-3 text-xs text-[#f4d7b1]/50">
              {dict.newsletter.privacy}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

