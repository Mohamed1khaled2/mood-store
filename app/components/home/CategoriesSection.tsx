import type { Category } from "../../data/store";
import type { Dictionary, Locale } from "../../i18n";

type CategoriesSectionProps = {
  categories: Category[];
  locale: Locale;
  dict: Dictionary;
};

export default function CategoriesSection({
  categories,
  locale,
  dict,
}: CategoriesSectionProps) {
  return (
    <section
      id="collections"
      className="px-4 py-10 sm:px-6 md:px-10 md:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c5a3c]">
            {dict.categories.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {dict.categories.title}
          </h2>
          <p className="mt-2 text-base text-[#5b4434]">
            {dict.categories.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href={`#shop`}
              className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl sm:p-6 ${
                i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-1" : ""
              }`}
              style={{
                backgroundColor: cat.color,
                color: cat.textColor,
              }}
            >
              {/* Decorative bottle shape */}
              <div
                className="absolute -bottom-4 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                style={{
                  right: locale === "ar" ? "auto" : "-8px",
                  left: locale === "ar" ? "-8px" : "auto",
                }}
              >
                <div className="h-32 w-16 rounded-b-3xl rounded-t-lg" style={{backgroundColor: cat.textColor}} />
              </div>

              <div className="relative z-10">
                <p className="text-2xl font-bold sm:text-3xl">
                  {cat.name[locale]}
                </p>
                <p
                  className="mt-2 text-xs leading-5 opacity-80 sm:text-sm"
                >
                  {cat.description[locale]}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-70">
                  <span>{cat.productCount} {locale === "ar" ? "منتجات" : "products"}</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" style={{
                    transform: locale === "ar" ? "scaleX(-1)" : undefined,
                  }}>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
