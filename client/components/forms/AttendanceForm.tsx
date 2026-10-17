"use client";

import type { AttendanceFormFieldsProps } from '@/lib/api/types';

export default function AttendanceForm({ defaultValues }: AttendanceFormFieldsProps) {
  return (
    <>
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
          Date <span className="text-red-500">*</span>
        </label>
        <input
          name="date"
          type="date"
          defaultValue={defaultValues?.date}
          required
          maxLength={50}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Check In
          </label>
          <input
            name="checkIn"
            type="time"
            defaultValue={defaultValues?.checkIn}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Check Out
          </label>
          <input
            name="checkOut"
            type="time"
            defaultValue={defaultValues?.checkOut}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          name="notes"
          defaultValue={defaultValues?.notes}
          placeholder="Any additional notes..."
          rows={2}
          maxLength={500}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
        />
      </div>
    </>
  );
}