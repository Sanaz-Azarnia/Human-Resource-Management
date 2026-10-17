import { redirect } from "next/navigation";
import { getAttendancePermissions } from "@/lib/permissions";
import { attendanceApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import Link from "next/link";
import type { DailyAttendanceReport, AttendanceSheet } from "@/lib/api/types";

async function getSheetReport(sheetId: number): Promise<DailyAttendanceReport | null> {
  try {
    return await attendanceApi.getSheetReport(sheetId);
  } catch (error) {
    if (isApiError(error) && error.status === 401) redirect("/login");
    console.error("Report fetch error:", error);
    return null;
  }
}

async function getAttendanceSheets(): Promise<AttendanceSheet[]> {
  try {
    return await attendanceApi.getAllSheets();
  } catch (error) {
    if (isApiError(error) && error.status === 401) redirect("/login");
    return [];
  }
}

export default async function AttendanceReportPage({
  searchParams,
}: {
  searchParams: Promise<{ sheetId?: string }>;
}) {
  const params = await searchParams;
  const sheetIdParam = params.sheetId;
  const selectedSheetId = sheetIdParam ? parseInt(sheetIdParam, 10) : null;

  const permissions = await getAttendancePermissions();

  if (!permissions.canViewAll) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view attendance reports.</p>
      </div>
    );
  }

  const [sheets, selectedReport] = await Promise.all([
    getAttendanceSheets(),
    selectedSheetId ? getSheetReport(selectedSheetId) : Promise.resolve(null)
  ]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Attendance Reports</h1>
        
        {/* List of Attendance Sheets */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Select Attendance Sheet</h2>
          
          {sheets.length === 0 ? (
            <p className="text-slate-500">No attendance sheets found. Create one first.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {sheets.map(sheet => (
                <Link 
                  key={sheet.id} 
                  href={`/dashboard/attendance/report?sheetId=${sheet.id}`}
                  className={`px-4 py-2 rounded-lg border transition-colors font-medium ${
                    selectedSheetId === sheet.id 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sheet.title} ({sheet.date})
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Report for the selected sheet */}
        {selectedSheetId && selectedReport && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="text-sm text-slate-500 mb-1">Total Employees</div>
                <div className="text-2xl font-bold text-slate-900">{selectedReport.totalEmployees}</div>
              </div>
              <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-4">
                <div className="text-sm text-green-600 mb-1">Present</div>
                <div className="text-2xl font-bold text-green-700">{selectedReport.presentCount}</div>
              </div>
              <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
                <div className="text-sm text-red-600 mb-1">Absent</div>
                <div className="text-2xl font-bold text-red-700">{selectedReport.absentCount}</div>
              </div>
              <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-4">
                <div className="text-sm text-yellow-600 mb-1">Not Recorded</div>
                <div className="text-2xl font-bold text-yellow-700">{selectedReport.notRecordedCount}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Personnel ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check In</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedReport.employees.map((emp) => (
                      <tr key={emp.employeeId} className="hover:bg-slate-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                              {emp.employeeName[0]}
                            </div>
                            <span className="font-medium text-slate-900">{emp.employeeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{emp.personnelId}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            emp.status === 'Present' ? 'bg-green-100 text-green-700' :
                            emp.status === 'Absent' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {emp.status === 'Present' ? 'Present' : emp.status === 'Absent' ? 'Absent' : 'Not Recorded'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{emp.checkIn || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{emp.checkOut || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{emp.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {selectedSheetId && !selectedReport && (
           <div className="bg-white p-8 rounded-xl shadow-sm border text-center text-slate-500">
             No report found for this sheet.
           </div>
        )}
      </div>
    </div>
  );
}