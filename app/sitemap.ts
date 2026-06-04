import type { MetadataRoute } from "next";
import { getDb } from "@/data/db";
import {
  absoluteUrl,
  infoPages,
  localizedPath,
  siteConfig,
} from "@/utils/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDb();
  const now = new Date();
  const infoSlugs = Object.keys(infoPages);

  const homeUrls = siteConfig.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale)),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1,
    alternates: {
      languages: {
        en: absoluteUrl(localizedPath("en")),
        ar: absoluteUrl(localizedPath("ar")),
      },
    },
  }));

  const infoUrls = siteConfig.locales.flatMap((locale) =>
    infoSlugs.map((slug) => ({
      url: absoluteUrl(localizedPath(locale, `/${slug}`)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: absoluteUrl(localizedPath("en", `/${slug}`)),
          ar: absoluteUrl(localizedPath("ar", `/${slug}`)),
        },
      },
    }))
  );

  const contactUrls = siteConfig.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, "/contact")),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: absoluteUrl(localizedPath("en", "/contact")),
        ar: absoluteUrl(localizedPath("ar", "/contact")),
      },
    },
  }));

  const productUrls = siteConfig.locales.flatMap((locale) =>
    db.products.map((product) => ({
      url: absoluteUrl(localizedPath(locale, `/products/${product.slug}`)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.images?.map((image) =>
        image.startsWith("http") ? image : absoluteUrl(image)
      ),
      alternates: {
        languages: {
          en: absoluteUrl(localizedPath("en", `/products/${product.slug}`)),
          ar: absoluteUrl(localizedPath("ar", `/products/${product.slug}`)),
        },
      },
    }))
  );

  return [...homeUrls, ...infoUrls, ...contactUrls, ...productUrls];
}
