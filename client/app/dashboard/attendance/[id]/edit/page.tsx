import { redirect, notFound } from "next/navigation";
import AttendanceForm from "@/components/forms/AttendanceForm";
import EditModal from "@/components/modals/EditModal";
import {
  getAttendancePermissions,
  getCurrentUserEmployeeId
} from "@/lib/permissions";
import { attendanceApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import { updateAttendanceAction } from "@/actions/attendance-actions";
import type { ActionResult, UpdateAttendanceDto } from "@/lib/api/types";
import AttendanceNavButtons from "@/components/ui/AttendanceNavButtons";

async function getAttendance(id: number) {
  try {
    return await attendanceApi.getById(id);
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404) return null;
    }
    console.error("Attendance fetch error:", error);
    return null;
  }
}

export default async function EditAttendancePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const attendanceId = parseInt(id, 10);

  if (!Number.isInteger(attendanceId) || attendanceId <= 0) {
    notFound();
  }

  const [attendance, permissions] = await Promise.all([
    getAttendance(attendanceId),
    getAttendancePermissions()
  ]);

  if (!attendance) {
    notFound();
  }

  const currentUserId = await getCurrentUserEmployeeId();

  const canEdit =
    permissions.canEditAll ||
    (permissions.canEditOwn && attendance.userId === currentUserId);

  if (!canEdit) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to edit this attendance.</p>
      </div>
    );
  }

  async function handleUpdate(formData: FormData): Promise<ActionResult> {
    "use server";

    const dto: UpdateAttendanceDto = {
      date: String(formData.get("date") ?? ""),
      checkIn: formData.get("checkIn")
        ? String(formData.get("checkIn"))
        : undefined,
      checkOut: formData.get("checkOut")
        ? String(formData.get("checkOut"))
        : undefined,
      notes: formData.get("notes")
        ? String(formData.get("notes"))
        : undefined
    };

    return updateAttendanceAction(attendanceId, dto);
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* عنوان + دکمه‌های مشترک */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Edit Attendance</h1>

        <AttendanceNavButtons permissions={permissions} />
      </div>

      <EditModal
        title="Attendance"
        action={handleUpdate}
        redirectPath="/dashboard/attendance"
        data={attendance}
      >
        <AttendanceForm
          defaultValues={{
            name: attendance.name,
            date: attendance.date,
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
            notes: attendance.notes
          }}
        />
      </EditModal>
    </div>
  );
}