import { getDb } from "@/data/db";
import NewSectionForm from "./NewSectionForm";

export const metadata = { title: "إضافة قسم جديد" };

export default async function NewSectionPage() {
  const db = await getDb();
  
  return <NewSectionForm products={db.products} />;
}
