"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteSection } from "../actions";

export default function DeleteSectionButton({ sectionId }: { sectionId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد أنك تريد مسح هذا القسم من الصفحة الرئيسية؟")) {
      setIsDeleting(true);
      await deleteSection(sectionId);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`h-8 w-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center transition ${
        isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100"
      }`}
      title="حذف"
    >
      <FiTrash2 />
    </button>
  );
}
