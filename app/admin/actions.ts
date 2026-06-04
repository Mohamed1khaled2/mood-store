"use server";

import { revalidatePath } from "next/cache";
import { getDb, saveDb, StoreSection, GeneralSettings, Order } from "@/data/db";
import { Category, Product } from "@/data/store";

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

export async function updateSettings(settings: GeneralSettings) {
  const db = await getDb();
  db.settings = settings;
  await saveDb(db);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function updateProduct(product: Product) {
  const db = await getDb();
  db.products = db.products.map((p) => (p.id === product.id ? product : p));
  await saveDb(db);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/edit/${product.id}`);
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function updateCategory(category: Category) {
  const db = await getDb();
  db.categories = db.categories.map((c) => (c.id === category.id ? category : c));
  await saveDb(db);
  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/edit/${category.id}`);
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

export async function updateSection(section: StoreSection) {
  const db = await getDb();
  db.sections = db.sections.map((s) => (s.id === section.id ? section : s));
  db.sections.sort((a, b) => a.order - b.order);
  await saveDb(db);
  revalidatePath("/admin/sections");
  revalidatePath(`/admin/sections/edit/${section.id}`);
  revalidatePath("/");
  revalidatePath("/ar");
  revalidatePath("/en");
}

// ─── Order Actions ───────────────────────────────────────────────

export async function createOrder(order: Order) {
  const db = await getDb();
  if (!db.orders) db.orders = [];
  db.orders.push(order);
  await saveDb(db);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const db = await getDb();
  if (!db.orders) db.orders = [];
  db.orders = db.orders.map((o) =>
    o.id === orderId ? { ...o, status } : o
  );
  await saveDb(db);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  const db = await getDb();
  if (!db.orders) db.orders = [];
  db.orders = db.orders.filter((o) => o.id !== orderId);
  await saveDb(db);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

