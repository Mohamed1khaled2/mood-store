export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export const dictionary = {
  en: {
    nav: {
      shop: "Shop",
      bestSellers: "Best sellers",
      newArrivals: "New arrivals",
      collections: "Collections",
      amber: "Amber",
      fresh: "Fresh",
      offers: "Offers",
      giftSets: "Gift sets",
      delivery: "Delivery",
      scentQuiz: "Scent quiz",
      cta: "Shop now",
    },
    footer: {
      trademarkTitle: "Trademark",
      languageTitle: "Change language",
      languageLabel: "Arabic",
      companyTitle: "Company",
      companyLinks: ["About us", "Branches", "Careers", "Mood Academy"],
      moreTitle: "More",
      moreLinks: ["Privacy policy", "Terms of use"],
      customerTitle: "Customer care",
      customerLinks: ["Contact us", "FAQ"],
      payment: ["VISA", "MC"],
    },
    hero: {
      eyebrow: "Signature fragrances",
      title: "Scents that shift the room.",
      copy: "Mood Store curates warm amber, clean musk, and bright citrus perfumes for everyday rituals and special nights.",
      primaryCta: "Explore best sellers",
      secondaryCta: "Find your scent",
      dailyMoods: "daily moods",
      dispatch: "dispatch",
    },
    categories: {
      eyebrow: "Browse",
      title: "Shop by collection",
      subtitle: "Find the mood that matches yours",
      viewAll: "View all",
    },
    products: {
      eyebrow: "Shop",
      title: "Best sellers",
      backToTop: "Back to top",
      type: "Eau de parfum",
      addToCart: "Add to cart",
      soldOut: "Sold out",
    },
    featured: {
      eyebrow: "Editor's pick",
      title: "Featured scent",
      subtitle: "Our most distinguished fragrance, handpicked for the season.",
      shopNow: "Shop now",
      notes: "Fragrance notes",
    },
    newArrivals: {
      eyebrow: "Just dropped",
      title: "New arrivals",
      subtitle: "Be the first to discover our latest creations.",
      type: "Eau de parfum",
      addToCart: "Add to cart",
      badge: "New",
    },
    testimonials: {
      eyebrow: "Reviews",
      title: "What our customers say",
      subtitle: "Real stories from real scent lovers.",
      verifiedBuyer: "Verified buyer",
    },
    offers: {
      eyebrow: "Mood Store perks",
      title:
        "Shop signature perfumes with curated sets, fast delivery, and gift-ready packaging.",
    },
    newsletter: {
      eyebrow: "Stay in the loop",
      title: "Get exclusive scents & offers",
      subtitle:
        "Subscribe to receive early access to new arrivals, special discounts, and curated scent recommendations.",
      placeholder: "Enter your email",
      cta: "Subscribe",
      privacy: "We respect your privacy. Unsubscribe anytime.",
    },
  },
  ar: {
    nav: {
      shop: "تسوق",
      bestSellers: "الأكثر مبيعا",
      newArrivals: "وصل حديثا",
      collections: "المجموعات",
      amber: "عنبر",
      fresh: "منعش",
      offers: "العروض",
      giftSets: "أطقم هدايا",
      delivery: "التوصيل",
      scentQuiz: "اختار عطرك",
      cta: "تسوق الآن",
    },
    footer: {
      trademarkTitle: "العلامة التجارية",
      languageTitle: "تغيير اللغة",
      languageLabel: "English",
      companyTitle: "عن الشركة",
      companyLinks: ["من نحن؟", "الفروع", "المهن", "أكاديمية مود"],
      moreTitle: "المزيد",
      moreLinks: ["سياسة الخصوصية", "سياسة الاستخدام"],
      customerTitle: "خدمة العملاء",
      customerLinks: ["اتصل بنا", "الأسئلة الشائعة"],
      payment: ["VISA", "MC"],
    },
    hero: {
      eyebrow: "عطور مميزة",
      title: "عطور تغير إحساس المكان.",
      copy: "مود ستور بيقدم عطور عنبر دافئة، مسك ناعم، ولمسات حمضية منعشة لكل يوم وكل مناسبة.",
      primaryCta: "الأكثر مبيعا",
      secondaryCta: "اختار عطرك",
      dailyMoods: "حالات يومية",
      dispatch: "تجهيز",
    },
    categories: {
      eyebrow: "تصفح",
      title: "تسوق حسب المجموعة",
      subtitle: "اكتشف المود اللي يناسبك",
      viewAll: "عرض الكل",
    },
    products: {
      eyebrow: "تسوق",
      title: "الأكثر مبيعا",
      backToTop: "للأعلى",
      type: "أو دو بارفان",
      addToCart: "أضف للسلة",
      soldOut: "غير متوفر",
    },
    featured: {
      eyebrow: "اختيار المحرر",
      title: "العطر المميز",
      subtitle: "أرقى عطورنا، مختار بعناية لهذا الموسم.",
      shopNow: "تسوق الآن",
      notes: "نوتات العطر",
    },
    newArrivals: {
      eyebrow: "وصل حديثاً",
      title: "وصل جديد",
      subtitle: "كن أول من يكتشف أحدث إبداعاتنا.",
      type: "أو دو بارفان",
      addToCart: "أضف للسلة",
      badge: "جديد",
    },
    testimonials: {
      eyebrow: "آراء العملاء",
      title: "ماذا يقول عملاؤنا",
      subtitle: "قصص حقيقية من عشاق العطور.",
      verifiedBuyer: "مشتري موثق",
    },
    offers: {
      eyebrow: "مميزات مود ستور",
      title:
        "تسوق عطور مميزة مع مجموعات مختارة، توصيل سريع، وتغليف جاهز للهدايا.",
    },
    newsletter: {
      eyebrow: "ابق على اطلاع",
      title: "احصل على عطور وعروض حصرية",
      subtitle:
        "اشترك لتحصل على وصول مبكر للمنتجات الجديدة، خصومات خاصة، وتوصيات عطور مختارة.",
      placeholder: "أدخل بريدك الإلكتروني",
      cta: "اشترك",
      privacy: "نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.",
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

export type Dictionary = (typeof dictionary)[Locale];
