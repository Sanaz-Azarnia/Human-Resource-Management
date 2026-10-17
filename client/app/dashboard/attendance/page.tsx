import { redirect } from "next/navigation";
import Link from "next/link";
import { Attendance } from "@/lib/api/types";
import { getAttendancePermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { attendanceApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import DeleteButton from "@/components/ui/DeleteButton";
import PresentButton from "@/components/ui/PresentButton";
import AbsentButton from "@/components/ui/AbsentButton";
import { deleteAttendanceAction } from "@/actions/attendance-actions";

async function getAttendances(): Promise<Attendance[]> {
  try {
    const data = await attendanceApi.getAll();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) {
        redirect("/login");
      }
      if (error.status === 403) {
        return [];
      }
      if (error.status === 404) {
        return [];
      }
    }
    console.error("Attendance fetch error:", error);
    return [];
  }
}

export default async function AttendancePage() {
  const [attendances, permissions] = await Promise.all([
    getAttendances(),
    getAttendancePermissions()
  ]);

  if (!permissions.canViewAll && !permissions.canViewOwn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view attendances.</p>
      </div>
    );
  }

  const currentUserId = await getCurrentUserEmployeeId();
  const visibleAttendances = permissions.canViewAll
    ? attendances
    : attendances.filter(a => a.userId === currentUserId);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Attendances</h1>
        
        <div className="flex flex-wrap gap-2">
          {/* دکمه ساخت برگه جدید (فقط برای ادمین) */}
          {permissions.canCreate && (
            <Link
              href="/dashboard/attendance/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Sheet
            </Link>
          )}

          {/* دکمه My Attendance (برای همه کاربران) */}
          <Link
            href="/dashboard/attendance/my-attendance"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            My Attendance
          </Link>

          {/* دکمه Attendance Report (فقط برای ادمین، مدیر، معاون) */}
          {permissions.canViewAll && (
            <Link
              href="/dashboard/attendance/report"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm md:text-base flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Attendance Report
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleAttendances.map((a) => {
          const statusText = (a as any).status || (a.isPresent ? 'Present' : 'Absent');
          const statusColor = statusText === 'Present' 
            ? 'bg-green-100 text-green-700' 
            : statusText === 'Absent' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-yellow-100 text-yellow-700';

          const avatarColor = statusText === 'Present' 
            ? 'bg-green-100 text-green-600' 
            : statusText === 'Absent' 
              ? 'bg-red-100 text-red-600' 
              : 'bg-yellow-100 text-yellow-600';

          return (
            <div key={`${a.id}-${a.isPresent}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${avatarColor}`}>
                  {a.name?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{a.name}</h3>
                  <span className="text-xs text-slate-500">{a.date}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Check In</span>
                  <span className={`font-medium ${a.checkIn ? 'text-green-600' : 'text-slate-400'}`}>
                    {a.checkIn || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check Out</span>
                  <span className={`font-medium ${a.checkOut ? 'text-green-600' : 'text-slate-400'}`}>
                    {a.checkOut || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                    {statusText}
                  </span>
                </div>
                {a.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 text-xs">Notes:</span>
                    <p className="text-slate-700 text-sm mt-1">{a.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
                {(permissions.canEditAll || (permissions.canEditOwn && a.userId === currentUserId)) && (
                  <Link href={`/dashboard/attendance/${a.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit
                  </Link>
                )}
                
                {permissions.canPresent && !a.isPresent && (
                  <PresentButton attendanceId={a.id} />
                )}
                
                {permissions.canAbsent && a.isPresent && (
                  <AbsentButton attendanceId={a.id} />
                )}
                
                {permissions.canDelete && (
                  <DeleteButton action={deleteAttendanceAction.bind(null, a.id)} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {visibleAttendances.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-slate-500">No attendances found.</p>
        </div>
      )}
    </div>
  );
}