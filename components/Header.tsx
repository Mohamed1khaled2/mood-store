import CardNav, { type CardNavItem } from "./CardNav";
import type { Dictionary, Locale } from "@/app/i18n";
import { getDb, getSettings } from "@/data/db";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export default async function Header({ locale, dict }: HeaderProps) {
  const db = await getDb();
  const settings = await getSettings();
  const categories = db.categories;

  // Build dynamic collections links based on real categories
  const categoryLinks = categories.map((cat) => ({
    label: cat.name[locale],
    href: `/${locale}/#shop`, // Or to a specific category page if we had one
    ariaLabel: cat.name[locale],
  }));

  // Resolve dynamic settings navigation cards
  const navItems: CardNavItem[] = (settings.navCards || []).map((card) => {
    let resolvedLinks = [];
    if (card.type === "categories") {
      resolvedLinks = categoryLinks;
    } else {
      resolvedLinks = (card.links || []).map((link) => ({
        label: link.label[locale],
        href: link.href.startsWith("/") ? `/${locale}${link.href}` : link.href,
        ariaLabel: link.label[locale],
      }));
    }

    return {
      label: card.label[locale],
      bgColor: card.bgColor || "#201711",
      textColor: card.textColor || "#fffaf3",
      links: resolvedLinks,
    };
  });
  const otherLocale = locale === "ar" ? "en" : "ar";
  const ctaLabelResolved = settings.ctaLabel?.[locale] || dict.nav.cta;
  const ctaHrefResolved = settings.ctaHref ? (settings.ctaHref.startsWith("/") ? `/${locale}${settings.ctaHref}` : settings.ctaHref) : `/${locale}/#shop`;

  return (
    <header className="w-full relative z-[100]">
      <CardNav
        logo="/logo.png"
        logoAlt="Mood Store"
        items={navItems}
        baseColor="#fffaf3"
        menuColor="#201711"
        buttonBgColor="#201711"
        buttonTextColor="#fffaf3"
        ctaLabel={ctaLabelResolved}
        ctaHref={ctaHrefResolved}
        localeSwitcherHref={`/${otherLocale}`}
        localeSwitcherLabel={otherLocale.toUpperCase()}
      />
    </header>
  );
}

