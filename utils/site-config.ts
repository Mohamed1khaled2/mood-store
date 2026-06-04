import type { Dictionary, Locale } from "@/app/i18n";
import type { GeneralSettings } from "@/data/db";

const fallbackSiteUrl = "http://localhost:3000";

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, ""),
  name: "Mood Store",
  defaultLocale: "en" satisfies Locale,
  locales: ["en", "ar"] satisfies Locale[],
  defaultDescription:
    "Premium perfumes, signature fragrances, curated scent collections, and gift-ready fragrance sets.",
  keywords: [
    "Mood Store",
    "perfumes",
    "fragrance",
    "luxury perfumes",
    "amber perfume",
    "musk perfume",
    "oud perfume",
    "Egypt perfume store",
  ],
};

export const infoPages = {
  about: {
    title: { en: "About us", ar: "من نحن" },
    description: {
      en: "Learn more about Mood Store and our signature approach to fine fragrance.",
      ar: "تعرف على مود ستور وطريقتنا في تقديم العطور المختارة بعناية.",
    },
  },
  branches: {
    title: { en: "Branches", ar: "الفروع" },
    description: {
      en: "Find Mood Store branches and ways to reach our team.",
      ar: "تعرف على فروع مود ستور وطرق التواصل مع فريقنا.",
    },
  },
  careers: {
    title: { en: "Careers", ar: "الوظائف" },
    description: {
      en: "Explore opportunities to join the Mood Store team.",
      ar: "اكتشف فرص الانضمام إلى فريق مود ستور.",
    },
  },
  academy: {
    title: { en: "Mood Academy", ar: "أكاديمية مود" },
    description: {
      en: "Discover scent guides, fragrance notes, and ways to choose your signature perfume.",
      ar: "اكتشف دليل العطور والنوتات وطرق اختيار عطرك المناسب.",
    },
  },
  privacy: {
    title: { en: "Privacy policy", ar: "سياسة الخصوصية" },
    description: {
      en: "Read how Mood Store handles customer data, orders, and communication.",
      ar: "تعرف على كيفية تعامل مود ستور مع بيانات العملاء والطلبات ووسائل التواصل.",
    },
  },
  terms: {
    title: { en: "Terms of use", ar: "شروط الاستخدام" },
    description: {
      en: "Review Mood Store terms for browsing, ordering, payment, and delivery.",
      ar: "راجع شروط مود ستور الخاصة بالتصفح والطلب والدفع والتوصيل.",
    },
  },
  faq: {
    title: { en: "FAQ", ar: "الأسئلة الشائعة" },
    description: {
      en: "Answers to common questions about Mood Store products, orders, and delivery.",
      ar: "إجابات على الأسئلة الشائعة حول منتجات مود ستور والطلبات والتوصيل.",
    },
  },
} as const;

export type InfoPageSlug = keyof typeof infoPages;

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function localizedPath(locale: Locale, path = "/") {
  if (path === "/" || path === "") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolveLocalizedHref(locale: Locale, href: string) {
  if (/^(https?:|mailto:|tel:|sms:)/.test(href)) return href;
  if (href.startsWith("#")) return `/${locale}/${href}`;
  return localizedPath(locale, href);
}

export function getFooterLinks(
  locale: Locale,
  dict: Dictionary,
  settings: GeneralSettings
) {
  const whatsappNumber = settings.whatsapp.replace(/[^0-9]/g, "");

  return {
    more: [
      { label: dict.footer.moreLinks[0], href: localizedPath(locale, "/privacy") },
      { label: dict.footer.moreLinks[1], href: localizedPath(locale, "/terms") },
    ],
    customer: [
      { label: dict.footer.customerLinks[0], href: localizedPath(locale, "/contact") },
      { label: dict.footer.customerLinks[1], href: localizedPath(locale, "/faq") },
    ],
    contact: {
      whatsapp: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "",
      email: settings.contactEmail ? `mailto:${settings.contactEmail}` : "",
      phone: settings.contactPhone ? `tel:${settings.contactPhone.replace(/[^+0-9]/g, "")}` : "",
    },
  };
}
