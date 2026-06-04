import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dictionary, isLocale, type Locale } from "@/app/i18n";
import { getSettings } from "@/data/db";
import {
  absoluteUrl,
  infoPages,
  localizedPath,
  siteConfig,
  type InfoPageSlug,
} from "@/utils/site-config";

type InfoPageProps = {
  params: Promise<{
    locale: string;
    info: string;
  }>;
};

type LocalizedCopy = Record<Locale, string>;

type InfoPageContent = {
  eyebrow: LocalizedCopy;
  intro: LocalizedCopy;
  sections: Array<{
    title: LocalizedCopy;
    body: LocalizedCopy;
  }>;
};

const pageContent: Record<InfoPageSlug, InfoPageContent> = {
  about: {
    eyebrow: { en: "Our story", ar: "قصتنا" },
    intro: {
      en: "Mood Store is built around everyday fragrance rituals: scents that feel personal, polished, and easy to wear.",
      ar: "مود ستور مبني على طقوس العطر اليومية: روائح شخصية، أنيقة، وسهلة الاستخدام في كل يوم.",
    },
    sections: [
      {
        title: { en: "Curated scents", ar: "عطور مختارة بعناية" },
        body: {
          en: "We focus on warm amber, clean musk, oud, citrus, and soft floral profiles that work across daily use and special occasions.",
          ar: "نركز على العنبر الدافئ، المسك النظيف، العود، الحمضيات، والزهور الناعمة لتناسب الاستخدام اليومي والمناسبات الخاصة.",
        },
      },
      {
        title: { en: "Gift-ready experience", ar: "تجربة جاهزة للهدايا" },
        body: {
          en: "Orders are prepared with presentation in mind, from fragrance selection to packaging and customer follow-up.",
          ar: "نجهز الطلبات بطريقة تليق بالهدية، بداية من اختيار العطر وحتى التغليف والمتابعة مع العميل.",
        },
      },
      {
        title: { en: "Support before and after ordering", ar: "دعم قبل وبعد الطلب" },
        body: {
          en: "Customers can reach the team for scent recommendations, order updates, and delivery questions.",
          ar: "تقدر تتواصل معنا لترشيحات العطور، متابعة الطلبات، أو أي سؤال بخصوص التوصيل.",
        },
      },
    ],
  },
  branches: {
    eyebrow: { en: "Visit and support", ar: "الفروع والدعم" },
    intro: {
      en: "Mood Store currently handles branch and visit inquiries through customer support so customers can confirm availability before moving.",
      ar: "مود ستور يتابع استفسارات الفروع والزيارات من خلال خدمة العملاء حتى تتأكد من التوفر قبل التحرك.",
    },
    sections: [
      {
        title: { en: "Confirm availability", ar: "تأكد من التوفر" },
        body: {
          en: "Contact us before visiting to check product stock, order pickup options, and current support hours.",
          ar: "تواصل معنا قبل الزيارة للتأكد من توفر المنتجات، خيارات استلام الطلبات، ومواعيد الدعم الحالية.",
        },
      },
      {
        title: { en: "Online ordering", ar: "الطلب أونلاين" },
        body: {
          en: "The fastest way to shop is through the website, then confirm details through WhatsApp after checkout.",
          ar: "أسرع طريقة للتسوق هي من خلال الموقع، وبعدها يتم تأكيد التفاصيل عبر واتساب بعد إتمام الطلب.",
        },
      },
      {
        title: { en: "Future locations", ar: "فروع جديدة" },
        body: {
          en: "New branch information will be published here when official locations are ready for customers.",
          ar: "أي معلومات عن فروع جديدة سيتم نشرها هنا فور جاهزيتها للعملاء.",
        },
      },
    ],
  },
  careers: {
    eyebrow: { en: "Join the team", ar: "انضم للفريق" },
    intro: {
      en: "We are interested in people who care about product detail, customer service, fragrance, content, and operations.",
      ar: "نهتم بالأشخاص اللي عندهم شغف بتفاصيل المنتج، خدمة العملاء، العطور، المحتوى، والتشغيل.",
    },
    sections: [
      {
        title: { en: "Retail and customer care", ar: "المبيعات وخدمة العملاء" },
        body: {
          en: "Help customers choose scents, follow orders, and keep the buying experience clear and warm.",
          ar: "ساعد العملاء في اختيار العطر المناسب، متابعة الطلبات، وتقديم تجربة شراء واضحة ومريحة.",
        },
      },
      {
        title: { en: "Operations", ar: "التشغيل" },
        body: {
          en: "Support product preparation, order tracking, packaging, and day-to-day store workflows.",
          ar: "شارك في تجهيز المنتجات، متابعة الطلبات، التغليف، وتنظيم سير العمل اليومي.",
        },
      },
      {
        title: { en: "How to apply", ar: "طريقة التقديم" },
        body: {
          en: "Send your CV or a short introduction through the contact page and mention the role you are interested in.",
          ar: "ابعت السيرة الذاتية أو نبذة قصيرة من خلال صفحة التواصل، واذكر الوظيفة المناسبة لك.",
        },
      },
    ],
  },
  academy: {
    eyebrow: { en: "Scent guide", ar: "دليل العطور" },
    intro: {
      en: "Mood Academy helps customers understand fragrance families, notes, and the best way to choose a scent.",
      ar: "أكاديمية مود تساعدك تفهم عائلات العطور، النوتات، وأفضل طريقة لاختيار عطرك المناسب.",
    },
    sections: [
      {
        title: { en: "Know the notes", ar: "افهم النوتات" },
        body: {
          en: "Top notes create the first impression, heart notes shape the character, and base notes define depth and longevity.",
          ar: "النوتات العليا تعطي الانطباع الأول، نوتات القلب تصنع شخصية العطر، ونوتات القاعدة تحدد العمق والثبات.",
        },
      },
      {
        title: { en: "Choose by mood", ar: "اختار حسب المود" },
        body: {
          en: "Amber and oud feel warmer and deeper, musk feels clean and intimate, citrus feels fresh and energetic.",
          ar: "العنبر والعود يمنحان إحساسا دافئا وعميقا، المسك نظيف وناعم، والحمضيات منعشة ومليئة بالطاقة.",
        },
      },
      {
        title: { en: "Wear it well", ar: "استخدم العطر صح" },
        body: {
          en: "Apply perfume to pulse points, avoid rubbing it after spraying, and store bottles away from heat and direct sun.",
          ar: "رش العطر على نقاط النبض، تجنب فركه بعد الرش، واحفظ الزجاجة بعيدا عن الحرارة والشمس المباشرة.",
        },
      },
    ],
  },
  privacy: {
    eyebrow: { en: "Customer privacy", ar: "خصوصية العملاء" },
    intro: {
      en: "This page explains how Mood Store handles information shared while browsing, ordering, or contacting support.",
      ar: "توضح هذه الصفحة كيف يتعامل مود ستور مع البيانات التي تشاركها أثناء التصفح أو الطلب أو التواصل مع الدعم.",
    },
    sections: [
      {
        title: { en: "Information we use", ar: "البيانات التي نستخدمها" },
        body: {
          en: "We use customer name, phone, address, order details, and messages only to process orders and provide support.",
          ar: "نستخدم اسم العميل، رقم الهاتف، العنوان، تفاصيل الطلب، والرسائل فقط لمعالجة الطلبات وتقديم الدعم.",
        },
      },
      {
        title: { en: "Communication", ar: "التواصل" },
        body: {
          en: "We may contact customers through phone, WhatsApp, or email to confirm orders, delivery details, or support requests.",
          ar: "قد نتواصل مع العملاء عبر الهاتف أو واتساب أو البريد الإلكتروني لتأكيد الطلبات أو تفاصيل التوصيل أو طلبات الدعم.",
        },
      },
      {
        title: { en: "Data protection", ar: "حماية البيانات" },
        body: {
          en: "Customer information is kept for store operations and is not sold to third parties.",
          ar: "يتم الاحتفاظ ببيانات العملاء لأغراض تشغيل المتجر فقط، ولا يتم بيعها لأي طرف ثالث.",
        },
      },
    ],
  },
  terms: {
    eyebrow: { en: "Store terms", ar: "شروط المتجر" },
    intro: {
      en: "These terms cover browsing, ordering, payment, delivery, and customer support for Mood Store purchases.",
      ar: "توضح هذه الشروط قواعد التصفح، الطلب، الدفع، التوصيل، وخدمة العملاء لمشتريات مود ستور.",
    },
    sections: [
      {
        title: { en: "Orders", ar: "الطلبات" },
        body: {
          en: "Orders are confirmed after the customer submits the required details and the team verifies availability and delivery information.",
          ar: "يتم تأكيد الطلب بعد إدخال العميل للبيانات المطلوبة ومراجعة الفريق للتوفر وتفاصيل التوصيل.",
        },
      },
      {
        title: { en: "Pricing and availability", ar: "الأسعار والتوفر" },
        body: {
          en: "Product prices, offers, and stock status may change. The latest confirmed details are shared during order processing.",
          ar: "قد تتغير الأسعار والعروض وحالة التوفر، ويتم مشاركة أحدث التفاصيل المؤكدة أثناء معالجة الطلب.",
        },
      },
      {
        title: { en: "Delivery", ar: "التوصيل" },
        body: {
          en: "Delivery timing depends on location, order confirmation time, and courier availability.",
          ar: "يعتمد وقت التوصيل على المنطقة، وقت تأكيد الطلب، وتوفر خدمة الشحن.",
        },
      },
    ],
  },
  faq: {
    eyebrow: { en: "Common questions", ar: "أسئلة شائعة" },
    intro: {
      en: "Quick answers for customers shopping Mood Store products, checking delivery, or choosing a fragrance.",
      ar: "إجابات سريعة للعملاء عن التسوق من مود ستور، التوصيل، واختيار العطر المناسب.",
    },
    sections: [
      {
        title: { en: "How do I place an order?", ar: "إزاي أطلب؟" },
        body: {
          en: "Add products to your cart, complete checkout details, then the team can follow up to confirm delivery information.",
          ar: "أضف المنتجات للسلة، أكمل بيانات الشراء، وبعدها يمكن للفريق متابعتك لتأكيد تفاصيل التوصيل.",
        },
      },
      {
        title: { en: "Can I ask for a scent recommendation?", ar: "ممكن أطلب ترشيح عطر؟" },
        body: {
          en: "Yes. Use the contact page or WhatsApp and tell us the mood, notes, or occasion you prefer.",
          ar: "نعم. استخدم صفحة التواصل أو واتساب وقول لنا المود أو النوتات أو المناسبة التي تفضلها.",
        },
      },
      {
        title: { en: "How can I track my order?", ar: "إزاي أتابع طلبي؟" },
        body: {
          en: "Use WhatsApp with your order details for the fastest support and delivery updates.",
          ar: "استخدم واتساب مع تفاصيل الطلب للحصول على أسرع دعم وتحديثات للتوصيل.",
        },
      },
    ],
  },
};

function isInfoPageSlug(slug: string): slug is InfoPageSlug {
  return slug in infoPages;
}

export function generateStaticParams() {
  return siteConfig.locales.flatMap((locale) =>
    Object.keys(infoPages).map((info) => ({ locale, info }))
  );
}

export async function generateMetadata({
  params,
}: InfoPageProps): Promise<Metadata> {
  const { locale, info } = await params;
  if (!isLocale(locale) || !isInfoPageSlug(info)) return {};

  const page = infoPages[info];
  const title = page.title[locale];
  const description = page.description[locale];
  const path = localizedPath(locale, `/${info}`);

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: localizedPath("en", `/${info}`),
        ar: localizedPath("ar", `/${info}`),
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

export default async function InfoPage({ params }: InfoPageProps) {
  const { locale, info } = await params;
  if (!isLocale(locale) || !isInfoPageSlug(info)) notFound();

  const typedLocale = locale as Locale;
  const settings = await getSettings();
  const dict = dictionary[typedLocale];
  const page = infoPages[info];
  const content = pageContent[info];
  const contactHref = localizedPath(typedLocale, "/contact");

  return (
    <main className="min-h-screen bg-[#fffaf3] px-4 py-16 text-[#201711] sm:px-6 md:px-10 md:py-24">
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c5a3c]">
              {content.eyebrow[typedLocale]}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {page.title[typedLocale]}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5b4434]">
              {content.intro[typedLocale]}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5b4434]/80">
              {settings.storeDescription?.[typedLocale] ||
                siteConfig.defaultDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localizedPath(typedLocale, "/#shop")}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#201711] px-5 text-xs font-bold uppercase tracking-wider text-[#fffaf3] transition hover:bg-[#3a2a20]"
              >
                {dict.nav.cta}
              </Link>
              <Link
                href={contactHref}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#201711]/15 px-5 text-xs font-bold uppercase tracking-wider text-[#201711] transition hover:bg-white"
              >
                {dict.footer.customerLinks[0]}
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {content.sections.map((section) => (
              <article
                key={section.title.en}
                className="rounded-md border border-[#201711]/10 bg-white/70 p-5 shadow-sm sm:p-6"
              >
                <h2 className="text-lg font-bold text-[#201711]">
                  {section.title[typedLocale]}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#5b4434]">
                  {section.body[typedLocale]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
