"use client";

import { useTransition } from "react";
import { rejectLeaveAction } from "@/actions/leave-actions";

interface RejectButtonProps {
  leaveId: number;
}

export default function RejectButton({ leaveId }: RejectButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleReject() {
    startTransition(async () => {
      const result = await rejectLeaveAction(leaveId);
      if (!result.success) {
        alert(result.message || "An unexpected error occurred.");
      }
    });
  }

  return (
    <button
      onClick={handleReject}
      disabled={pending}
      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "..." : "Reject"}
    </button>
  );
}