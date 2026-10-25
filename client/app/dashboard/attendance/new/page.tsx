import CreateModal from "@/components/modals/CreateModal";
import { getAttendancePermissions } from "@/lib/permissions";
import { createAttendanceSheetAction } from "@/actions/attendance-actions";
import type { ActionResult, CreateAttendanceSheetDto } from "@/lib/api/types";
import AttendanceNavButtons from "@/components/ui/AttendanceNavButtons";

export default async function NewAttendanceSheetPage() {
  const permissions = await getAttendancePermissions();

  if (!permissions.canCreate) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to create attendance sheets.</p>
      </div>
    );
  }

  async function handleCreate(formData: FormData): Promise<ActionResult> {
    "use server";

    const dto: CreateAttendanceSheetDto = {
      date: String(formData.get("date") ?? ""),
      title: String(formData.get("title") ?? "Daily Attendance"),
      notes: formData.get("notes") ? String(formData.get("notes")) : undefined,
    };

    return createAttendanceSheetAction(dto);
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* همین قسمت دکمه‌ها اضافه شده */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">New Attendance Sheet</h1>
        <AttendanceNavButtons permissions={permissions} />
      </div>

      <CreateModal
        title="Attendance Sheet"
        action={handleCreate}
        redirectPath="/dashboard/attendance/report"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            name="date"
            type="date"
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            defaultValue="Daily Attendance"
            required
            maxLength={100}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
            rows={3}
            maxLength={500}
          />
        </div>
      </CreateModal>
    </div>
  );
}