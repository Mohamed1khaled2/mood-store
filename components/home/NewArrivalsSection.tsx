"use client";

import type { Product } from "@/data/store";
import type { Dictionary, Locale } from "@/app/i18n";
import ProductCard from "./ProductCard";

type NewArrivalsSectionProps = {
  products: Product[];
  locale: Locale;
  dict: Dictionary;
};

export default function NewArrivalsSection({
  products,
  locale,
  dict,
}: NewArrivalsSectionProps) {
  return (
    <section className="bg-[#f5f0eb] px-4 py-16 sm:px-6 md:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-[#201711] sm:text-base">
            {dict.newArrivals.title}
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-6 md:overflow-visible md:pb-0">
          {products.map((product) => (
            <div key={product.id} className="min-w-[240px] flex-shrink-0 md:min-w-0">
              <ProductCard
                product={product}
                locale={locale}
                dict={dict}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

