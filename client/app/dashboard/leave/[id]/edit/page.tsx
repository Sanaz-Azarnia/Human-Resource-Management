import { redirect, notFound } from "next/navigation";
import LeaveRequestForm from '@/components/forms/LeaveRequestForm';
import EditModal from '@/components/modals/EditModal';
import { getLeavePermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { leaveRequestsApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { updateLeaveAction } from "@/actions/leave-actions";
import type { ActionResult, UpdateLeaveRequestDto } from "@/lib/api/types";

async function getLeaveRequest(id: number) {
  try {
    return await leaveRequestsApi.getById(id);
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404) return null;
    }
    console.error("Leave request fetch error:", error);
    return null;
  }
}

export default async function EditLeaveRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leaveId = parseInt(id, 10);

  if (!Number.isInteger(leaveId) || leaveId <= 0) {
    notFound();
  }

  const [leave, permissions] = await Promise.all([
    getLeaveRequest(leaveId),
    getLeavePermissions(),
  ]);

  if (!leave) {
    notFound();
  }

  const currentUserId = await getCurrentUserEmployeeId();

  const canEdit =
    permissions.canEditAll ||
    (permissions.canEditOwn && leave.userId === currentUserId);

  if (!canEdit) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to edit this leave request.</p>
      </div>
    );
  }

  async function handleUpdate(formData: FormData): Promise<ActionResult> {
    'use server';

    const dto: UpdateLeaveRequestDto = {
      title: formData.get("title") ? String(formData.get("title")) : undefined,
      reason: formData.get("reason") ? String(formData.get("reason")) : undefined,
      startDate: formData.get("startDate") ? String(formData.get("startDate")) : undefined,
      endDate: formData.get("endDate") ? String(formData.get("endDate")) : undefined,
      type: formData.get("type") ? String(formData.get("type")) : undefined,
      adminNote: formData.get("adminNote") ? String(formData.get("adminNote")) : undefined,
    };

    return updateLeaveAction(leaveId, dto);
  }

  return (
    <EditModal
      title="Leave Request"
      action={handleUpdate}
      redirectPath="/dashboard/leave"
      data={leave}
    >
      <LeaveRequestForm
        userId={leave.userId}
        defaultValues={{
          name: leave.name,
          title: leave.title,
          reason: leave.reason,
          startDate: leave.startDate,
          endDate: leave.endDate,
          type: leave.type,
          status: leave.status,
          adminNote: leave.adminNote,
        }}
      />
    </EditModal>
  );
}