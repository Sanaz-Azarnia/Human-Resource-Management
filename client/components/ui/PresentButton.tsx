// components/ui/PresentButton.tsx
"use client";

import { useTransition } from "react";
import { presentAttendanceAction } from "@/actions/attendance-actions";

interface PresentButtonProps {
  attendanceId: number;
}

export default function PresentButton({ attendanceId }: PresentButtonProps) {
  const [pending, startTransition] = useTransition();

  function handlePresent() {
    console.log("PresentButton clicked for attendanceId:" , attendanceId);
    startTransition(async () => {
      const result = await presentAttendanceAction(attendanceId);
      if (!result.success) {
        alert(result.message || "An unexpected error occurred.");
      }
    });
  }

  return (
    <button
      onClick={handlePresent}
      disabled={pending}
      className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "..." : "Present"}
    </button>
  );
}