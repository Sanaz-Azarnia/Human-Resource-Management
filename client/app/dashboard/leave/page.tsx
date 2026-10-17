import { redirect } from "next/navigation";
import Link from "next/link";
import { LeaveRequest } from "@/lib/api/types";
import { getLeavePermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { leaveRequestsApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import DeleteButton from "@/components/ui/DeleteButton";
import ApproveButton from "@/components/ui/ApproveButton";
import RejectButton from "@/components/ui/RejectButton";
import { deleteLeaveAction } from "@/actions/leave-actions";

async function getLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const data = await leaveRequestsApi.getAll();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 403 || error.status === 404) return [];
    }
    console.error("Leave requests fetch error:", error);
    return [];
  }
}

export default async function LeaveRequestPage() {
  const [leaveRequests, permissions] = await Promise.all([
    getLeaveRequests(),
    getLeavePermissions()
  ]);

  if (!permissions.canViewAll && !permissions.canViewOwn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view leave requests.</p>
      </div>
    );
  }

  const currentUserId = await getCurrentUserEmployeeId();
  const visibleLeaveRequests = permissions.canViewAll
    ? leaveRequests
    : leaveRequests.filter(l => l.userId === currentUserId);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Leave Requests</h1>
        {permissions.canCreate && (
          <Link href="/dashboard/leave/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base">
            + New Leave Request
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleLeaveRequests.map((l) => (
          <div key={l.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  {l.name?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{l.name}</h3>
                  <span className="text-xs text-slate-500">{l.title}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                l.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {l.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-700">{l.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Start</span>
                <span className="text-slate-700">{l.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">End</span>
                <span className="text-slate-700">{l.endDate}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 text-xs">Reason:</span>
                <p className="text-slate-700 text-sm mt-1 line-clamp-2">{l.reason}</p>
              </div>
              {l.adminNote && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 text-xs">Admin Note:</span>
                  <p className="text-slate-700 text-sm mt-1">{l.adminNote}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
              {(permissions.canEditAll || (permissions.canEditOwn && l.userId === currentUserId)) && l.status !== 'Approved' && (
                <Link href={`/dashboard/leave/${l.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </Link>
              )}
              {permissions.canApprove && l.status === 'Pending' && (
                <ApproveButton leaveId={l.id} />
              )}
              {permissions.canReject && l.status === 'Pending' && (
                <RejectButton leaveId={l.id} />
              )}
              {permissions.canDelete && (
                <DeleteButton action={deleteLeaveAction.bind(null, l.id)} redirectPath="/dashboard/leave" />
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleLeaveRequests.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-slate-500">No leave requests found.</p>
        </div>
      )}
    </div>
  );
}