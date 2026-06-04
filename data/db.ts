import fs from "fs/promises";
import path from "path";
import { Category, Product, StorePerk, Testimonial } from "./store";

// Add StoreSection type to store.ts later, for now define here
export type LocalizedText = {
  en: string;
  ar: string;
};

export type StoreSection = {
  id: string;
  type: "grid" | "carousel" | "featured";
  title: LocalizedText;
  productIds: string[];
  order: number;
};

export type NavLinkItem = {
  label: LocalizedText;
  href: string;
};

export type NavCardItem = {
  label: LocalizedText;
  bgColor?: string;
  textColor?: string;
  type: "custom" | "categories";
  icon?: string; // 'bag' | 'grid' | 'star' | 'heart' | 'link' | 'gift'
  showInBottomBar?: boolean;
  links?: NavLinkItem[];
};

export type GeneralSettings = {
  whatsapp: string;
  instagram: string;
  facebook: string;
  contactEmail: string;
  contactPhone: string;
  storeName: LocalizedText;
  storeDescription: LocalizedText;
  // Navbar settings
  ctaLabel?: LocalizedText;
  ctaHref?: string;
  navCards?: NavCardItem[];
  // Legacy fields kept for backward compatibility / type-safety
  shopLabel?: LocalizedText;
  shopLinks?: NavLinkItem[];
  collectionsLabel?: LocalizedText;
  offersLabel?: LocalizedText;
  offersLinks?: NavLinkItem[];
};

export type OrderItem = {
  productId: string;
  name: LocalizedText;
  quantity: number;
  price: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerGovernorate: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type DatabaseSchema = {
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
  storePerks: StorePerk[];
  sections: StoreSection[];
  settings?: GeneralSettings;
  orders?: Order[];
};

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function getDb(): Promise<DatabaseSchema> {
  try {
    const fileContents = await fs.readFile(DB_PATH, "utf-8");
    const data = JSON.parse(fileContents);
    return {
      ...data,
      orders: data.orders || [],
    };
  } catch (error) {
    console.error("Error reading database:", error);
    // Return empty fallback
    return {
      categories: [],
      products: [],
      testimonials: [],
      storePerks: [],
      sections: [],
    };
  }
}

export async function saveDb(data: DatabaseSchema): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
    throw new Error("Failed to save data");
  }
}

// Helper methods for specific entities
export async function getProducts(): Promise<Product[]> {
  const db = await getDb();
  return db.products;
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  return db.categories;
}

export async function getSections(): Promise<StoreSection[]> {
  const db = await getDb();
  return db.sections.sort((a, b) => a.order - b.order);
}

const defaultNavCards: NavCardItem[] = [
  {
    label: { en: "Shop", ar: "تسوق" },
    bgColor: "#201711",
    textColor: "#fff7ed",
    type: "custom",
    icon: "bag",
    showInBottomBar: true,
    links: [
      { label: { en: "Best Sellers", ar: "الأكثر مبيعاً" }, href: "/#shop" },
      { label: { en: "New Arrivals", ar: "وصل حديثاً" }, href: "/#shop" },
    ],
  },
  {
    label: { en: "Collections", ar: "المجموعات" },
    bgColor: "#8c5a3c",
    textColor: "#fffaf3",
    type: "categories",
    icon: "grid",
    showInBottomBar: true,
    links: [],
  },
  {
    label: { en: "Offers", ar: "العروض" },
    bgColor: "#f4d7b1",
    textColor: "#201711",
    type: "custom",
    icon: "star",
    showInBottomBar: true,
    links: [
      { label: { en: "Gift Sets", ar: "أطقم هدايا" }, href: "/#offers" },
      { label: { en: "Delivery", ar: "التوصيل" }, href: "/#offers" },
      { label: { en: "Scent Quiz", ar: "اختار عطرك" }, href: "/#offers" },
    ],
  },
];

export async function getSettings(): Promise<GeneralSettings> {
  const db = await getDb();
  const baseSettings = db.settings || {
    whatsapp: "+201234567890",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    contactEmail: "info@moodstore.com",
    contactPhone: "+201234567890",
    storeName: { en: "Mood Store", ar: "مود ستور" },
    storeDescription: {
      en: "Scents that shift the room.",
      ar: "عطور تغير إحساس المكان.",
    },
  };

  let navCards = baseSettings.navCards;
  if (!navCards || navCards.length === 0) {
    // Migrate legacy settings if they exist
    const shopLabel = baseSettings.shopLabel || { en: "Shop", ar: "تسوق" };
    const shopLinks = baseSettings.shopLinks || [
      { label: { en: "Best Sellers", ar: "الأكثر مبيعاً" }, href: "/#shop" },
      { label: { en: "New Arrivals", ar: "وصل حديثاً" }, href: "/#shop" },
    ];
    const collectionsLabel = baseSettings.collectionsLabel || { en: "Collections", ar: "المجموعات" };
    const offersLabel = baseSettings.offersLabel || { en: "Offers", ar: "العروض" };
    const offersLinks = baseSettings.offersLinks || [
      { label: { en: "Gift Sets", ar: "أطقم هدايا" }, href: "/#offers" },
      { label: { en: "Delivery", ar: "التوصيل" }, href: "/#offers" },
      { label: { en: "Scent Quiz", ar: "اختار عطرك" }, href: "/#offers" },
    ];

    navCards = [
      {
        label: shopLabel,
        bgColor: "#201711",
        textColor: "#fff7ed",
        type: "custom",
        icon: "bag",
        showInBottomBar: true,
        links: shopLinks,
      },
      {
        label: collectionsLabel,
        bgColor: "#8c5a3c",
        textColor: "#fffaf3",
        type: "categories",
        icon: "grid",
        showInBottomBar: true,
        links: [],
      },
      {
        label: offersLabel,
        bgColor: "#f4d7b1",
        textColor: "#201711",
        type: "custom",
        icon: "star",
        showInBottomBar: true,
        links: offersLinks,
      },
    ];
  }

  return {
    ...baseSettings,
    ctaLabel: baseSettings.ctaLabel || { en: "Shop now", ar: "تسوق الآن" },
    ctaHref: baseSettings.ctaHref || "/#shop",
    navCards,
  };
}
