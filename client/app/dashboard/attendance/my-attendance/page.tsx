import { attendanceApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { redirect } from "next/navigation";
import SubmitAttendanceCard from "@/components/widgets/SubmitAttendanceCard";
import type { AttendanceSheet } from "@/lib/api/types";
import { getAttendancePermissions } from "@/lib/permissions";
import AttendanceNavButtons from "@/components/ui/AttendanceNavButtons";

async function getActiveSheets(): Promise<AttendanceSheet[]> {
  try {
    return await attendanceApi.getActiveSheets();
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      redirect("/login");
    }

    return [];
  }
}

export default async function MyAttendancePage() {
  const [sheets, permissions] = await Promise.all([
    getActiveSheets(),
    getAttendancePermissions()
  ]);

  if (!permissions.canViewAll && !permissions.canViewOwn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view attendance.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* عنوان + دکمه‌های مشترک */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">My Attendance</h1>

        <AttendanceNavButtons permissions={permissions} />
      </div>

      {sheets.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-slate-500">
          There are no active attendance sheets at the moment.
        </div>
      ) : (
        <div className="grid gap-4">
          {sheets.map((sheet) => (
            <SubmitAttendanceCard key={sheet.id} sheet={sheet} />
          ))}
        </div>
      )}
    </div>
  );
}