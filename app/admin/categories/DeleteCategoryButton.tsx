"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteCategory } from "../actions";

export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد أنك تريد مسح هذا التصنيف؟")) {
      setIsDeleting(true);
      await deleteCategory(categoryId);
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
