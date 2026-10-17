import { redirect } from "next/navigation";
import Link from "next/link";
import { Report } from "@/lib/api/types";
import { getReportPermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { reportsApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import DeleteButton from "@/components/ui/DeleteButton";
import { deleteReportAction } from "@/actions/report-actions";

async function getReports(): Promise<Report[]> {
  try {
    const data = await reportsApi.getAll();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 403 || error.status === 404) return [];
    }
    console.error("Reports fetch error:", error);
    return [];
  }
}

export default async function ReportPage() {
  const [reports, permissions] = await Promise.all([
    getReports(),
    getReportPermissions()
  ]);

  if (!permissions.canViewAll && !permissions.canViewOwn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view reports.</p>
      </div>
    );
  }

  const currentUserId = await getCurrentUserEmployeeId();
  const visibleReports = permissions.canViewAll
    ? reports
    : reports.filter(r => r.userId === currentUserId);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Reports</h1>
        {permissions.canCreate && (
          <Link href="/dashboard/report/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base">
            + New Report
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleReports.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {r.employeeName?.[0] || '?'}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{r.employeeName}</h3>
                <span className="text-xs text-slate-500">{r.createdAt}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-slate-900 mb-1">{r.title}</h4>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                r.type === 'performance' ? 'bg-purple-100 text-purple-700' :
                r.type === 'incident' ? 'bg-red-100 text-red-700' :
                r.type === 'monthly' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {r.type}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 text-xs">Content:</span>
                <p className="text-slate-700 text-sm mt-1 line-clamp-3">{r.content}</p>
              </div>
              {r.attachmentUrl && (
                <div className="pt-2">
                  <a href={r.attachmentUrl} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                    📎 Attachment
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
              {(permissions.canEditAll || (permissions.canEditOwn && r.userId === currentUserId)) && (
                <Link href={`/dashboard/report/${r.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </Link>
              )}
              {permissions.canDelete && (
                <DeleteButton action={deleteReportAction.bind(null, r.id)} redirectPath="/dashboard/report" />
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleReports.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-slate-500">No reports found.</p>
        </div>
      )}
    </div>
  );
}