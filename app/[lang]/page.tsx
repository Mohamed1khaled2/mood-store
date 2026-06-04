import { notFound } from "next/navigation";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturedSection from "../components/home/FeaturedSection";
import HeroSection from "../components/home/HeroSection";
import NewArrivalsSection from "../components/home/NewArrivalsSection";
import NewsletterSection from "../components/home/NewsletterSection";
import OffersSection from "../components/home/OffersSection";
import ProductGridSection from "../components/home/ProductGridSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import { getDb } from "../data/db";
import { dictionary, isLocale } from "../i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = dictionary[lang];
  const db = await getDb();

  const { categories, products, storePerks, testimonials, sections } = db;

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <main id="home" className="min-h-screen bg-[#fffaf3] text-[#201711]">
      {/* 1. Hero */}
      <HeroSection dict={dict} />

      {/* 2. Categories */}
      <CategoriesSection categories={categories} locale={lang} dict={dict} />

      {/* 3. Dynamic Sections */}
      {sortedSections.map((section) => {
        // Resolve product objects from IDs
        const sectionProducts = section.productIds
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean) as typeof products;

        if (section.type === "grid") {
          return (
            <div key={section.id}>
              {/* Injecting dynamic title from section into dict structure temporarily for the component, or passing directly if we updated the component. 
                  Since ProductGridSection relies on dict.products.title, let's just pass the section title instead if we refactor it.
                  Wait, to avoid breaking components without refactoring them, let's pass a modified dict just for this section, or better yet, refactor the components later. 
                  For now, let's clone the dict and override the title so the existing component shows the dynamic title.
               */}
              <ProductGridSection 
                products={sectionProducts} 
                locale={lang} 
                dict={{
                  ...dict,
                  products: { ...dict.products, title: section.title[lang] }
                }} 
              />
            </div>
          );
        }

        if (section.type === "carousel") {
          return (
            <div key={section.id}>
              <NewArrivalsSection 
                products={sectionProducts} 
                locale={lang} 
                dict={{
                  ...dict,
                  newArrivals: { ...dict.newArrivals, title: section.title[lang] }
                }} 
              />
            </div>
          );
        }

        if (section.type === "featured" && sectionProducts.length > 0) {
          return (
            <div key={section.id}>
              <FeaturedSection 
                product={sectionProducts[0]} 
                locale={lang} 
                dict={dict} 
              />
            </div>
          );
        }

        return null;
      })}

      {/* 4. Testimonials */}
      <TestimonialsSection
        testimonials={testimonials}
        locale={lang}
        dict={dict}
      />

      {/* 5. Offers / Perks */}
      <OffersSection perks={storePerks} locale={lang} dict={dict} />

      {/* 6. Newsletter */}
      <NewsletterSection dict={dict} />
    </main>
  );
}
