"use server";

import { revalidatePath } from "next/cache";
import { getDb, saveDb, StoreSection } from "../data/db";
import { Category, Product } from "../data/store";

export async function addProduct(product: Product) {
  const db = await getDb();
  db.products.push(product);
  await saveDb(db);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function deleteProduct(productId: string) {
  const db = await getDb();
  db.products = db.products.filter((p) => p.id !== productId);
  await saveDb(db);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function addCategory(category: Category) {
  const db = await getDb();
  db.categories.push(category);
  await saveDb(db);
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function deleteCategory(categoryId: string) {
  const db = await getDb();
  db.categories = db.categories.filter((c) => c.id !== categoryId);
  await saveDb(db);
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function addSection(section: StoreSection) {
  const db = await getDb();
  db.sections.push(section);
  // Re-sort just in case
  db.sections.sort((a, b) => a.order - b.order);
  await saveDb(db);
  revalidatePath("/admin/sections");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function deleteSection(sectionId: string) {
  const db = await getDb();
  db.sections = db.sections.filter((s) => s.id !== sectionId);
  await saveDb(db);
  revalidatePath("/admin/sections");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}
