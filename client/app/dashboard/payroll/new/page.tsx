import { redirect } from "next/navigation";
import CreateModal from '@/components/modals/CreateModal';
import PayrollForm from '@/components/forms/PayrollForm';
import { getBasePermissions } from "@/lib/permissions";
import { employeesApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { createPayrollAction } from "@/actions/payroll-actions";
import type { ActionResult, CreatePayrollDto, Employee } from "@/lib/api/types";

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

export default async function NewPayrollPage() {
  const permissions = await getBasePermissions('payroll');

  if (!permissions.canCreate) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to create payrolls.</p>
      </div>
    );
  }

  const employees = await getEmployeesForDropdown();

  async function handleCreate(formData: FormData): Promise<ActionResult> {
    'use server'; 
    const dto: CreatePayrollDto = {
      userId: Number(formData.get("userId") ?? 0),
      year: Number(formData.get("year") ?? ""),
      month: Number(formData.get("month") ?? ""),
      baseSalary: Number(formData.get("baseSalary") ?? 0),
      overTime: formData.get("overTime") ? Number(formData.get("overTime")) : undefined,
      bonus: formData.get("bonus") ? Number(formData.get("bonus")) : undefined,
      tax: formData.get("tax") ? Number(formData.get("tax")) : undefined,
      insurance: formData.get("insurance") ? Number(formData.get("insurance")) : undefined,
      isPaid: formData.get("isPaid") === "on",
    };

    return createPayrollAction(dto);
  }

  return (
    <CreateModal
      title="Payroll"
      action={handleCreate}
      redirectPath="/dashboard/payroll"
    >
      <PayrollForm employees={employees} />
    </CreateModal>
  );
}