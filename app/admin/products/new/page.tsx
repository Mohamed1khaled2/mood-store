import { getDb } from "@/data/db";
import NewProductForm from "./NewProductForm";

export const metadata = { title: "إضافة منتج جديد" };

export default async function NewProductPage() {
  const db = await getDb();

  return <NewProductForm categories={db.categories} />;
}
