"use client";

import { useTransition } from "react";
import { approveLeaveAction } from "@/actions/leave-actions";

interface ApproveButtonProps {
  leaveId: number;
}

export default function ApproveButton({ leaveId }: ApproveButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      const result = await approveLeaveAction(leaveId);
      if (!result.success) {
        alert(result.message || "An unexpected error occurred.");
      }
    });
  }

  return (
    <button
      onClick={handleApprove}
      disabled={pending}
      className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "..." : "Approve"}
    </button>
  );
}