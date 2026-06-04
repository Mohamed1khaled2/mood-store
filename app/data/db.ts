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

export type DatabaseSchema = {
  categories: Category[];
  products: Product[];
  testimonials: Testimonial[];
  storePerks: StorePerk[];
  sections: StoreSection[];
};

const DB_PATH = path.join(process.cwd(), "app", "data", "db.json");

export async function getDb(): Promise<DatabaseSchema> {
  try {
    const fileContents = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(fileContents);
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
