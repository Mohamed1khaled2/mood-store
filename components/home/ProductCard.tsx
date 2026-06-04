"use client";

import type { Product } from "@/data/store";
import type { Dictionary, Locale } from "@/app/i18n";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

type ProductCardProps = {
  product: Product;
  locale: Locale;
  dict: Dictionary;
};

export default function ProductCard({ product, locale, dict }: ProductCardProps) {
  const { addToCart } = useCart();
  
  // We use a high-quality placeholder image for all products until actual images are uploaded.
  const placeholderImage = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.isSoldOut) {
      addToCart(product);
    }
  };

  const isRtl = locale === "ar";

  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group flex flex-col cursor-pointer w-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#f8f9fa] overflow-hidden rounded-sm transition-all duration-700 ease-out">
        {/* Actual Image */}
        <Image
          src={product.images?.[0] || placeholderImage}
          alt={product.name[locale]}
          fill
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105 opacity-90 mix-blend-multiply"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />

        {/* Subtle Overlay to emphasize the premium feel */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sold Out Badge */}
        {product.isSoldOut && (
          <div 
            className="absolute top-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-semibold tracking-widest text-[#201711] uppercase"
            style={{
              left: isRtl ? 'auto' : '12px',
              right: isRtl ? '12px' : 'auto'
            }}
          >
            {dict.products.soldOut}
          </div>
        )}

        {/* Quick Add Action (Visible on Hover) */}
        {!product.isSoldOut && (
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#201711] text-[#fffaf3] py-3 text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors cursor-pointer"
            >
              {dict.products.addToCart}
            </button>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="mt-5 flex flex-col items-center text-center px-2">
        <span className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">{product.category}</span>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-[#201711]">
          {product.name[locale]}
        </h3>
        <p className="mt-1 text-[11px] text-gray-500 line-clamp-1 max-w-[80%] mx-auto">
          {product.note[locale]}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs tracking-widest text-[#201711]">
          {product.oldPrice && (
            <span className="text-gray-400 line-through decoration-gray-300">
              {product.oldPrice}
            </span>
          )}
          <span className="font-medium">{product.price}</span>
        </div>
      </div>
    </Link>
  );
}
