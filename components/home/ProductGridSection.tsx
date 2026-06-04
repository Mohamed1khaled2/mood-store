import type { Product } from "@/data/store";
import type { Dictionary, Locale } from "@/app/i18n";
import ProductCard from "./ProductCard";

type ProductGridSectionProps = {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
  maxProducts?: number;
};

export default function ProductGridSection({
  products,
  locale,
  dict,
  maxProducts,
}: ProductGridSectionProps) {
  const displayProducts = maxProducts
    ? products.slice(0, maxProducts)
    : products;

  return (
    <section id="shop" className="bg-[#fdfbf9] px-4 py-16 sm:px-6 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-[#201711] sm:text-base">
            {dict.products.title}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              dict={dict}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


