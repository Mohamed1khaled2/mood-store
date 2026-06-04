import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import type { Dictionary, Locale } from "../i18n";

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
    <div>
      <h2 className="text-sm font-medium text-white/70">{title}</h2>
      <ul className="mt-4 space-y-4">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-base font-semibold text-white transition hover:text-[#f4d7b1]"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ locale, dict }: FooterProps) {
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <footer className="bg-black px-6 pb-6 pt-12 text-white sm:px-10 md:px-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.1fr_0.9fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-sm font-medium text-white/70">
            {dict.footer.trademarkTitle}
          </h2>
          <div className="mt-4">
            <Image
              src="/logo.png"
              alt="Mood Store"
              width={130}
              height={56}
              className="h-auto w-32 brightness-0 invert"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-white/70">
            {dict.footer.languageTitle}
          </h2>
          <a
            href={`/${otherLocale}`}
            className="mt-4 inline-flex text-base font-semibold text-white transition hover:text-[#f4d7b1]"
          >
            {dict.footer.languageLabel}
          </a>
        </div>

        <FooterColumn
          title={dict.footer.companyTitle}
          links={dict.footer.companyLinks}
        />
        <FooterColumn title={dict.footer.moreTitle} links={dict.footer.moreLinks} />
        <FooterColumn
          title={dict.footer.customerTitle}
          links={dict.footer.customerLinks}
        />
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-end">
     

        <div className="flex items-center gap-6 text-2xl text-white">
          <a href="#" aria-label="LinkedIn" className="transition hover:text-[#f4d7b1]">
            <FaLinkedinIn />
          </a>
          <a href="#" aria-label="Facebook" className="transition hover:text-[#f4d7b1]">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram" className="transition hover:text-[#f4d7b1]">
            <FaInstagram />
          </a>
        </div>
      </div>

      <div className="mt-8 h-6 bg-white/10" />
    </footer>
  );
}
