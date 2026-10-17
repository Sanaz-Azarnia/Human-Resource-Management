import { attendanceApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { redirect } from "next/navigation";
import SubmitAttendanceCard from "@/components/widgets/SubmitAttendanceCard";
import type { AttendanceSheet } from "@/lib/api/types";

async function getActiveSheets(): Promise<AttendanceSheet[]> {
  try {
    return await attendanceApi.getActiveSheets();
  } catch (error) {
    if (isApiError(error) && error.status === 401) redirect("/login");
    return [];
  }
}

export default async function MyAttendancePage() {
  const sheets = await getActiveSheets();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Attendance</h1>
      
      {sheets.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-slate-500">
          There are no active attendance sheets at the moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {sheets.map(sheet => (
            <SubmitAttendanceCard key={sheet.id} sheet={sheet} />
          ))}
        </div>
      )}
    </div>
  );
}