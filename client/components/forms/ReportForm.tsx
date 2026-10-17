"use client";

import type { ReportFormFieldsProps } from '@/lib/api/types';

const REPORT_TYPES = [
  { value: 'performance', label: 'Performance Review' },
  { value: 'incident', label: 'Incident Report' },
  { value: 'monthly', label: 'Monthly Summary' },
  { value: 'training', label: 'Training Report' },
  { value: 'other', label: 'Other' },
];

export default function ReportForm({ defaultValues, userId }: ReportFormFieldsProps) {
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
          name="employeeName"
          type="text"
          defaultValue={defaultValues?.employeeName}
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
          placeholder="Enter report title"
          required
          maxLength={200}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

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
          <option value="" disabled>Select report type</option>
          {REPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          defaultValue={defaultValues?.content}
          placeholder="Describe the report details..."
          required
          maxLength={10000}
          rows={5}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Attachment URL <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <input
          name="attachmentUrl"
          type="url"
          defaultValue={defaultValues?.attachmentUrl}
          placeholder="https://example.com/file.pdf"
          maxLength={500}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-400 mt-1">
          Enter a link to the attachment or upload file separately
        </p>
      </div>
    </>
  );
}