"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteProduct } from "../actions";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد أنك تريد مسح هذا المنتج؟")) {
      setIsDeleting(true);
      await deleteProduct(productId);
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
