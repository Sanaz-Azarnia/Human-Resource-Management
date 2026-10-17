import Link from "next/link";
import { getAttendancePermissions } from "@/lib/permissions";
import { attendanceApi } from "@/lib/api";

export default async function TodayAttendanceWidget() {
  const permissions = await getAttendancePermissions();

  if (!permissions.canViewAll) {
    return null;
  }

  // 🎯 تاریخ میلادی استاندارد (بر اساس timezone سرور/UTC)
  const today = new Date().toISOString().split('T')[0];

  let report = null;
  try {
    report = await attendanceApi.getDailyReport(today);
  } catch (error) {
    console.error("Widget fetch error:", error);
  }

  // 🎯 اگر API پاسخی نداد، به جای null، یک پیام نمایش می‌دهیم تا مشکل مشخص شود
  if (!report) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Today's Attendance</h2>
          <Link
            href="/dashboard/attendance/report"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Report →
          </Link>
        </div>
        <div className="text-center py-4 text-slate-500 text-sm">
          No attendance data available for today ({today}).
          <br />
          <span className="text-xs">Check if the API endpoint /daily-report is working.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Today's Attendance</h2>
        <Link
          href="/dashboard/attendance/report"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View Report →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{report.presentCount ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">Present</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{report.absentCount ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">Absent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{report.notRecordedCount ?? 0}</div>
          <div className="text-xs text-slate-500 mt-1">Not Recorded</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Total Employees</span>
          <span className="font-semibold text-slate-900">{report.totalEmployees ?? 0}</span>
        </div>
      </div>
    </div>
  );
}