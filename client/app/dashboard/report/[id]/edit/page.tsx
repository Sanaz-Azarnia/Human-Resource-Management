import { redirect, notFound } from "next/navigation";
import ReportForm from '@/components/forms/ReportForm';
import EditModal from '@/components/modals/EditModal';
import { getReportPermissions, getCurrentUserEmployeeId } from "@/lib/permissions";
import { reportsApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { updateReportAction } from "@/actions/report-actions";
import type { ActionResult, UpdateReportDto } from "@/lib/api/types";

async function getReport(id: number) {
  try {
    return await reportsApi.getById(id);
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404) return null;
    }
    console.error("Report fetch error:", error);
    return null;
  }
}

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reportId = parseInt(id, 10);

  if (!Number.isInteger(reportId) || reportId <= 0) {
    notFound();
  }

  const [report, permissions] = await Promise.all([
    getReport(reportId),
    getReportPermissions(),
  ]);

  if (!report) {
    notFound();
  }

  const currentUserId = await getCurrentUserEmployeeId();

  const canEdit =
    permissions.canEditAll ||
    (permissions.canEditOwn && report.userId === currentUserId);

  if (!canEdit) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to edit this report.</p>
      </div>
    );
  }

  async function handleUpdate(formData: FormData): Promise<ActionResult> {
    'use server';

    const dto: UpdateReportDto = {
      title: formData.get("title") ? String(formData.get("title")) : undefined,
      content: formData.get("content") ? String(formData.get("content")) : undefined,
      type: formData.get("type") ? String(formData.get("type")) : undefined,
      attachmentUrl: formData.get("attachmentUrl") ? String(formData.get("attachmentUrl")) : undefined,
    };

    return updateReportAction(reportId, dto);
  }

  return (
    <EditModal
      title="Report"
      action={handleUpdate}
      redirectPath="/dashboard/report"
      data={report}
    >
      <ReportForm
        userId={report.userId}
        defaultValues={{
          employeeName: report.employeeName,
          title: report.title,
          content: report.content,
          type: report.type,
          attachmentUrl: report.attachmentUrl,
        }}
      />
    </EditModal>
  );
}