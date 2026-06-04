import { getDb } from "@/data/db";
import { notFound } from "next/navigation";
import EditSectionForm from "./EditSectionForm";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const section = db.sections.find((s) => s.id === id);

  if (!section) {
    notFound();
  }

  return <EditSectionForm section={section} products={db.products} />;
}
