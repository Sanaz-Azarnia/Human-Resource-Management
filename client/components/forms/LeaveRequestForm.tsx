"use client";

import type { LeaveRequestFormFieldsProps } from '@/lib/api/types';

const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
];

const LEAVE_STATUS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

export default function LeaveRequestForm({ defaultValues, userId }: LeaveRequestFormFieldsProps) {
  return (
    <>
      {userId !== undefined && (
        <input type="hidden" name="userId" value={userId} />
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Employee
        </label>
        <input
          name="name"
          type="text"
          defaultValue={defaultValues?.name}
          readOnly
          className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          type="text"
          defaultValue={defaultValues?.title}
          placeholder="Summer vacation request"
          required
          maxLength={200}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reason"
          defaultValue={defaultValues?.reason}
          placeholder="Explain the reason for your leave..."
          required
          maxLength={2000}
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            name="startDate"
            type="date"
            defaultValue={defaultValues?.startDate}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            name="endDate"
            type="date"
            defaultValue={defaultValues?.endDate}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            defaultValue={defaultValues?.type || ''}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="" disabled>Select type</option>
            {LEAVE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            name="status"
            defaultValue={defaultValues?.status || 'Pending'}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {LEAVE_STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {defaultValues?.adminNote !== undefined && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Admin Note
          </label>
          <textarea
            name="adminNote"
            defaultValue={defaultValues.adminNote}
            placeholder="Admin feedback..."
            rows={2}
            maxLength={1000}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
          />
        </div>
      )}
    </>
  );
}