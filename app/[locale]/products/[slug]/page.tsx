import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/data/db";
import { dictionary, Locale } from "@/app/i18n";
import ProductGallery from "./ProductGallery";
import ProductActions from "./ProductActions";
import ProductCard from "@/components/home/ProductCard";

type ProductPageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const dict = dictionary[locale] || dictionary.en;

  const db = await getDb();
  const product = db.products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = db.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fffaf3] pt-8 pb-32 lg:pb-24" style={{ fontFamily: locale === "ar" ? "var(--font-cairo), sans-serif" : "var(--font-geist-sans), sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-xs font-bold uppercase tracking-wider text-gray-400 gap-2">
          <Link href={`/${locale}`} className="hover:text-[#201711] transition">
            {locale === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-gray-500">{product.category}</span>
          <span>/</span>
          <span className="text-[#201711] truncate">{product.name[locale]}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Gallery Section */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} locale={locale} />
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="border-b border-[#201711]/10 pb-6">
              <span className="text-xs font-bold text-gray-500 tracking-widest uppercase block mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold uppercase tracking-wide text-[#201711] mb-2 leading-tight">
                {product.name[locale]}
              </h1>
              <p className="text-sm text-gray-500 tracking-wider">
                {product.note[locale]}
              </p>
              <div className="mt-4 flex items-center gap-3">
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.oldPrice}
                  </span>
                )}
                <span className="text-2xl font-bold text-[#201711]">
                  {product.price}
                </span>
              </div>
            </div>

            {/* Actions (Add to Cart / Buy Now) */}
            <ProductActions product={product} locale={locale} dict={dict} />

            {/* Accordion Info */}
            <div className="mt-8 border-t border-[#201711]/10 pt-6 space-y-4">
              <details className="group" open>
                <summary className="flex justify-between items-center font-bold text-xs uppercase tracking-widest text-[#201711] cursor-pointer py-2 select-none list-none [&::-webkit-details-marker]:hidden">
                  <span>{dict.productDetail.description}</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 text-sm text-gray-600 leading-relaxed font-normal">
                  {product.description[locale]}
                </div>
              </details>

              <details className="group border-t border-[#201711]/5 pt-4">
                <summary className="flex justify-between items-center font-bold text-xs uppercase tracking-widest text-[#201711] cursor-pointer py-2 select-none list-none [&::-webkit-details-marker]:hidden">
                  <span>{dict.productDetail.fragranceNotes}</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 text-sm text-gray-600 leading-relaxed font-normal">
                  {product.note[locale]}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-[#201711]/10">
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#201711] mb-8 text-center md:text-left rtl:md:text-right">
              {dict.productDetail.youMayAlsoLike}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
