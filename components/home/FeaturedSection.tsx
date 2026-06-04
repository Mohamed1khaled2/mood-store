import type { Product } from "@/data/store";
import type { Dictionary, Locale } from "@/app/i18n";
import BorderGlow from "../BorderGlow";

type FeaturedSectionProps = {
  product: Product;
  locale: Locale;
  dict: Dictionary;
};

export default function FeaturedSection({
  product,
  locale,
  dict,
}: FeaturedSectionProps) {
  return (
    <section className="px-4 py-10 sm:px-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <BorderGlow
          className="overflow-hidden"
          backgroundColor={product.color}
          borderRadius={20}
          glowRadius={30}
          glowColor="28 85 78"
          animated
          colors={["#f4d7b1", "#b85c38", "#fffaf3"]}
          fillOpacity={0.3}
        >
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:gap-10 md:p-10 lg:p-12">
            {/* Product visual */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                  style={{ backgroundColor: product.accentColor }}
                />
                {/* Bottle placeholder */}
                <div className="relative flex h-56 w-40 flex-col items-center justify-center sm:h-72 sm:w-52">
                  <div
                    className="h-8 w-10 rounded-t-md sm:h-10 sm:w-12"
                    style={{ backgroundColor: `${product.accentColor}99` }}
                  />
                  <div
                    className="h-36 w-28 rounded-b-3xl rounded-t-md sm:h-48 sm:w-36"
                    style={{ backgroundColor: product.accentColor }}
                  />
                  <div className="mt-3 text-center">
                    <p
                      className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: product.accentColor }}
                    >
                      Mood
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col justify-center" style={{ color: product.accentColor }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
                {dict.featured.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {product.name[locale]}
              </h2>
              <p className="mt-2 text-2xl font-semibold opacity-90">
                {product.price}
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 opacity-80 sm:text-base">
                {product.description[locale]}
              </p>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
                  {dict.featured.notes}
                </p>
                <p className="mt-1 text-sm font-medium opacity-90">
                  {product.note[locale]}
                </p>
              </div>

              <div className="mt-6">
                <a
                  href="#shop"
                  className="inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: product.accentColor,
                    color: product.color,
                  }}
                >
                  {dict.featured.shopNow}
                </a>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}

