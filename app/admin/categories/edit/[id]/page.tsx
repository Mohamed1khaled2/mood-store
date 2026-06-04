import { getDb } from "@/data/db";
import { notFound } from "next/navigation";
import EditCategoryForm from "./EditCategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const category = db.categories.find((c) => c.id === id);

  if (!category) {
    notFound();
  }

  return <EditCategoryForm category={category} />;
}
