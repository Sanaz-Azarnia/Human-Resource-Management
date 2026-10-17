import { redirect } from "next/navigation";
import Link from "next/link";
import { Payroll } from "@/lib/api/types";
import { getBasePermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { payrollsApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import DeleteButton from "@/components/ui/DeleteButton";
import { deletePayrollAction } from "@/actions/payroll-actions";

async function getPayrolls(): Promise<Payroll[]> {
  try {
    const data = await payrollsApi.getAll();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 403 || error.status === 404) return [];
    }
    console.error("Payrolls fetch error:", error);
    return [];
  }
}

export default async function PayrollPage() {
  const [payrolls, permissions] = await Promise.all([
    getPayrolls(),
    getBasePermissions('payroll')
  ]);

  if (!permissions.canViewAll && !permissions.canViewOwn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view payrolls.</p>
      </div>
    );
  }

  const currentUserId = await getCurrentUserEmployeeId();
  const visiblePayrolls = permissions.canViewAll
    ? payrolls
    : payrolls.filter(e => e.userId === currentUserId);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Payrolls</h1>
        {permissions.canCreate && (
          <Link href="/dashboard/payroll/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base">
            + New Payroll
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visiblePayrolls.map((pay) => (
          <div key={pay.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  {pay.employeeName?.[0] || '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{pay.employeeName}</h3>
                  <span className="text-xs text-slate-500">{pay.year}/{pay.month}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                pay.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {pay.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Salary</span>
                <span className="text-slate-700">${pay.baseSalary?.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Overtime</span>
                <span className="text-green-600">+${pay.overTime?.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bonus</span>
                <span className="text-green-600">+${pay.bonus?.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax</span>
                <span className="text-red-600">-${pay.tax?.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Insurance</span>
                <span className="text-red-600">-${pay.insurance?.toLocaleString('en-US')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                <span className="text-slate-700">Net Salary</span>
                <span className="text-indigo-600">${pay.netSalary?.toLocaleString('en-US')}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
              {(permissions.canEditAll || (permissions.canEditOwn && pay.userId === currentUserId)) && !pay.isPaid && (
                <Link href={`/dashboard/payroll/${pay.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </Link>
              )}
              {permissions.canDelete && (
                <DeleteButton action={deletePayrollAction.bind(null, pay.id)} redirectPath="/dashboard/payroll" />
              )}
            </div>
          </div>
        ))}
      </div>

      {visiblePayrolls.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-slate-500">No payrolls found.</p>
        </div>
      )}
    </div>
  );
}