// components/ui/AbsentButton.tsx
"use client";

import { useTransition } from "react";
import { absentAttendanceAction } from "@/actions/attendance-actions";

interface AbsentButtonProps {
  attendanceId: number;
}

export default function AbsentButton({ attendanceId }: AbsentButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleAbsent() {
    console.log("AbsentButton clicked for attendanceId:" , attendanceId);
    startTransition(async () => {
      const result = await absentAttendanceAction(attendanceId);
      if (!result.success) {
        alert(result.message || "An unexpected error occurred.");
      }
    });
  }

  return (
    <button
      onClick={handleAbsent}
      disabled={pending}
      className="text-orange-600 hover:text-orange-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "..." : "Absent"}
    </button>
  );
}