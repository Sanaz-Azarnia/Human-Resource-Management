import { redirect, notFound } from "next/navigation";
import EditModal from '@/components/modals/EditModal';
import PayrollForm from '@/components/forms/PayrollForm';
import { getBasePermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { payrollsApi, employeesApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { updatePayrollAction } from "@/actions/payroll-actions";
import type { ActionResult, UpdatePayrollDto, Employee } from "@/lib/api/types";

async function getPayroll(id: number) {
  try {
    return await payrollsApi.getById(id);
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404) return null;
    }
    console.error("Payroll fetch error:", error);
    return null;
  }
}

async function getEmployeesForDropdown(): Promise<Employee[]> {
  try {
    const data = await employeesApi.getAll();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
    }
    console.error("Employees fetch error:", error);
    return [];
  }
}

export default async function EditPayrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payrollId = parseInt(id, 10);

  if (!Number.isInteger(payrollId) || payrollId <= 0) {
    notFound();
  }

  const [payroll, permissions, employees] = await Promise.all([
    getPayroll(payrollId),
    getBasePermissions('payroll'),
    getEmployeesForDropdown(),
  ]);

  if (!payroll) {
    notFound();
  }

  const currentUserId = await getCurrentUserEmployeeId();

  const canEdit =
    permissions.canEditAll ||
    (permissions.canEditOwn && payroll.userId === currentUserId);

  if (!canEdit) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to edit this payroll.</p>
      </div>
    );
  }

  async function handleUpdate(formData: FormData): Promise<ActionResult> {
    'use server';

    const dto: UpdatePayrollDto = {
      userId: formData.get("userId") ? Number(formData.get("userId")) : undefined,
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      month: formData.get("month") ? Number(formData.get("month")) : undefined,
      baseSalary: formData.get("baseSalary") ? Number(formData.get("baseSalary")) : undefined,
      overTime: formData.get("overTime") ? Number(formData.get("overTime")) : undefined,
      bonus: formData.get("bonus") ? Number(formData.get("bonus")) : undefined,
      tax: formData.get("tax") ? Number(formData.get("tax")) : undefined,
      insurance: formData.get("insurance") ? Number(formData.get("insurance")) : undefined,
      isPaid: formData.get("isPaid") === "on",
    };

    return updatePayrollAction(payrollId, dto);
  }

  return (
    <EditModal
      title="Payroll"
      action={handleUpdate}
      redirectPath="/dashboard/payroll"
      data={payroll}
    >
      <PayrollForm
        employees={employees}
        defaultValues={{
          employeeId: payroll.userId,
          employeeName: payroll.employeeName,
          year: Number(payroll.year),
          month: Number(payroll.month),
          baseSalary: payroll.baseSalary,
          overTime: payroll.overTime,
          bonus: payroll.bonus,
          tax: payroll.tax,
          insurance: payroll.insurance,
          isPaid: payroll.isPaid,
        }}
      />
    </EditModal>
  );
}