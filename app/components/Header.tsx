import CardNav, { type CardNavItem } from "./CardNav";
import type { Dictionary, Locale } from "../i18n";
import { getDb } from "../data/db";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export default async function Header({ locale, dict }: HeaderProps) {
  const db = await getDb();
  const categories = db.categories;

  // Build dynamic collections links based on real categories
  const categoryLinks = categories.map((cat) => ({
    label: cat.name[locale],
    href: `/${locale}/#shop`, // Or to a specific category page if we had one
    ariaLabel: cat.name[locale],
  }));

  const navItems: CardNavItem[] = [
    {
      label: dict.nav.shop,
      bgColor: "#201711",
      textColor: "#fff7ed",
      links: [
        {
          label: dict.nav.bestSellers,
          href: `/${locale}/#shop`,
          ariaLabel: dict.nav.bestSellers,
        },
        {
          label: dict.nav.newArrivals,
          href: `/${locale}/#shop`,
          ariaLabel: dict.nav.newArrivals,
        },
      ],
    },
    {
      label: dict.nav.collections,
      bgColor: "#8c5a3c",
      textColor: "#fffaf3",
      links: categoryLinks.length > 0 ? categoryLinks : [
        // Fallbacks if no categories exist yet
        { label: dict.nav.amber, href: `/${locale}/#shop`, ariaLabel: dict.nav.amber },
        { label: dict.nav.fresh, href: `/${locale}/#shop`, ariaLabel: dict.nav.fresh },
      ],
    },
    {
      label: dict.nav.offers,
      bgColor: "#f4d7b1",
      textColor: "#201711",
      links: [
        { label: dict.nav.giftSets, href: `/${locale}/#offers`, ariaLabel: dict.nav.giftSets },
        { label: dict.nav.delivery, href: `/${locale}/#offers`, ariaLabel: dict.nav.delivery },
        { label: dict.nav.scentQuiz, href: `/${locale}/#offers`, ariaLabel: dict.nav.scentQuiz },
      ],
    },
  ];
  const otherLocale = locale === "ar" ? "en" : "ar";

  return (
    <header className="relative z-[100]">
      <CardNav
        logo="/logo.png"
        logoAlt="Mood Store"
        items={navItems}
        baseColor="#fffaf3"
        menuColor="#201711"
        buttonBgColor="#201711"
        buttonTextColor="#fffaf3"
        ctaLabel={dict.nav.cta}
        ctaHref={`/${locale}/#shop`}
        localeSwitcherHref={`/${otherLocale}`}
        localeSwitcherLabel={otherLocale.toUpperCase()}
      />
    </header>
  );
}
