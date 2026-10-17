import { redirect } from "next/navigation";
import ReportForm from "@/components/forms/ReportForm";
import CreateModal from "@/components/modals/CreateModal";
import { getReportPermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { employeesApi } from "@/lib/api";
import { createReportAction } from "@/actions/report-actions";
import type { ActionResult, CreateReportDto } from "@/lib/api/types";

export default async function NewReportPage() {
  const permissions = await getReportPermissions();

  if (!permissions.canCreate) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to create reports.</p>
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

    const dto: CreateReportDto = {
      userId,
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      type: String(formData.get("type") ?? ""),
      attachmentUrl: formData.get("attachmentUrl") ? String(formData.get("attachmentUrl")) : undefined,
    };

    return createReportAction(dto);
  }

  return (
    <CreateModal
      title="Report"
      action={handleCreate}
      redirectPath="/dashboard/report"
    >
      <ReportForm
        userId={currentUserId}
        defaultValues={{ employeeName: currentName }}
      />
    </CreateModal>
  );
}