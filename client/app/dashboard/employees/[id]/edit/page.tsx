// app/dashboard/employees/[id]/edit/page.tsx
import { redirect, notFound } from "next/navigation";
import EmployeeForm from '@/components/forms/EmployeeForm';
import EditModal from '@/components/modals/EditModal';
import { getBasePermissions, getCurrentUserPersonnelId } from "@/lib/permissions";
import { employeesApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { updateEmployeeAction } from "@/actions/employee-actions";
import type { ActionResult, UpdateEmployeeDto } from "@/lib/api/types";

async function getEmployee(id: number) {
  try {
    return await employeesApi.getById(id);
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404) return null;
    }
    console.error("Employee fetch error:", error);
    return null;
  }
}

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employeeId = parseInt(id, 10);

  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    notFound();
  }

  const [employee, permissions] = await Promise.all([
    getEmployee(employeeId),
    getBasePermissions('employee'),
  ]);

  if (!employee) {
    notFound();
  }

  const currentUserPersonnelId = await getCurrentUserPersonnelId();

  const canEdit =
    permissions.canEditAll ||
    (permissions.canEditOwn && employee.personnelId === currentUserPersonnelId);

  if (!canEdit) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to edit this employee.</p>
      </div>
    );
  }


  async function handleUpdate(formData: FormData): Promise<ActionResult> {
    'use server';

    const dto: UpdateEmployeeDto = {
      firstname: formData.get("firstname") ? String(formData.get("firstname")) : undefined,
      lastname: formData.get("lastname") ? String(formData.get("lastname")) : undefined,
      personnelId: formData.get("personnelId") ? String(formData.get("personnelId")) : undefined,
      nationalId: formData.get("nationalId") ? String(formData.get("nationalId")) : undefined,
      email: formData.get("email") ? String(formData.get("email")) : undefined,
      phone: formData.get("phone") ? String(formData.get("phone")) : undefined,
      address: formData.get("address") ? String(formData.get("address")) : undefined,
      roleId: formData.get("roleId") ? Number(formData.get("roleId")) : undefined,       
      password: formData.get("password") ? String(formData.get("password")) : undefined,  
      avatarUrl: formData.get("avatarUrl") ? String(formData.get("avatarUrl")) : undefined,
      baseSalary: formData.get("baseSalary") ? Number(formData.get("baseSalary")) : undefined,
    };

    return updateEmployeeAction(employeeId, dto);
  }

  return (
    <EditModal
      title="Employee"
      action={handleUpdate}
      redirectPath="/dashboard/employees"
      data={employee}
    >
      <EmployeeForm defaultValues={employee} />
    </EditModal>
  );
}