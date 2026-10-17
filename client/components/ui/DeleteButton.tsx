 
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DeleteButtonProps } from "@/lib/api/types";

export default function DeleteButton({
  action,
  confirmMessage = "Are you sure you want to delete this?",
  redirectPath,
}: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm(confirmMessage)) return;

    startTransition(async () => {
      const result = await action();

      if (result.success) {
        if (redirectPath) {
          router.push(redirectPath);
        }
         
      } else {
        alert(result.message || "An unexpected error occurred.");
      }
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "..." : "Delete"}
    </button>
  );
}