import { getDb } from "@/data/db";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export const metadata = { title: "تعديل المنتج" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} categories={db.categories} />;
}
