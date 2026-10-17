// app/dashboard/employees/new/page.tsx
import EmployeeForm from "@/components/forms/EmployeeForm";
import CreateModal from "@/components/modals/CreateModal";
import { getBasePermissions } from "@/lib/permissions";
import { createEmployeeAction } from "@/actions/employee-actions";
import type { ActionResult, CreateEmployeeDto } from "@/lib/api/types";

export default async function NewEmployeePage() {
  const permissions = await getBasePermissions('employee');

  if (!permissions.canCreate) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to create employees.</p>
      </div>
    );
  }



  async function handleCreate(formData: FormData): Promise<ActionResult> {
    'use server';

    const dto: CreateEmployeeDto = {
      firstname: String(formData.get("firstname") ?? ""),
      lastname: String(formData.get("lastname") ?? ""),
      personnelId: String(formData.get("personnelId") ?? ""),
      nationalId: String(formData.get("nationalId") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      roleId: Number(formData.get("roleId") ?? 0),
      password: String(formData.get("password") ?? ""),
      avatarUrl: formData.get("avatarUrl") ? String(formData.get("avatarUrl")) : undefined,
      baseSalary: Number(formData.get("baseSalary") ?? 0),
    };

    return createEmployeeAction(dto);
  }

  return (
    <CreateModal
      title="Employee"
      action={handleCreate}
      redirectPath="/dashboard/employees"
    >
      <EmployeeForm />
    </CreateModal>
  );
}