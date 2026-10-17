import { redirect } from "next/navigation";
import LeaveRequestForm from "@/components/forms/LeaveRequestForm";
import CreateModal from "@/components/modals/CreateModal";
import { getLeavePermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { employeesApi } from "@/lib/api";
import { createLeaveAction } from "@/actions/leave-actions";
import type { ActionResult, CreateLeaveRequestDto } from "@/lib/api/types";

export default async function NewLeaveRequestPage() {
  const permissions = await getLeavePermissions();

  if (!permissions.canCreate) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to create leave requests.</p>
      </div>
    );
  }

  const currentUserId = await getCurrentUserEmployeeId();
  if (!currentUserId) redirect("/login");

  const currentEmployee = await employeesApi.getById(currentUserId).catch(() => null);
  const currentName = currentEmployee
    ? `${currentEmployee.firstname} ${currentEmployee.lastname}`
    : "";

  async function handleCreate(formData: FormData): Promise<ActionResult> {
    'use server';

    const userId = await getCurrentUserEmployeeId();
    if (!userId) redirect("/login");

    const dto: CreateLeaveRequestDto = {
      userId,
      title: String(formData.get("title") ?? ""),
      reason: String(formData.get("reason") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      endDate: String(formData.get("endDate") ?? ""),
      type: String(formData.get("type") ?? ""),
      adminNote: formData.get("adminNote") ? String(formData.get("adminNote")) : undefined,
    };

    return createLeaveAction(dto);
  }

  return (
    <CreateModal
      title="Leave Request"
      action={handleCreate}
      redirectPath="/dashboard/leave"
    >
      <LeaveRequestForm
        userId={currentUserId}
        defaultValues={{ name: currentName, status: "Pending" }}
      />
    </CreateModal>
  );
}