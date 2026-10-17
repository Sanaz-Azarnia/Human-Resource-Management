"use client";

import { useState, useEffect } from 'react';
import type { PayrollFormFieldsProps, Employee } from '@/lib/api/types';

export default function PayrollForm({ defaultValues, employees: propEmployees }: PayrollFormFieldsProps) {
  const [employees, setEmployees] = useState<Employee[]>(propEmployees ?? []);
  const [loading, setLoading] = useState(!propEmployees);

  useEffect(() => {
    if (propEmployees) {
      setEmployees(propEmployees);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadEmployees() {
      try {
        const res = await fetch('/api/employees', { cache: 'no-store' });
        if (!cancelled && res.ok) {
          const data = await res.json();
          setEmployees(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load employees:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEmployees();
    return () => { cancelled = true; };
  }, [propEmployees]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading employees...</p>;
  }

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Employee <span className="text-red-500">*</span>
        </label>
        <select
          name="userId"
          defaultValue={defaultValues?.employeeId ?? ''}
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstname} {emp.lastname}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            name="year"
            type="number"
            min="2000"
            max="3000"
            defaultValue={defaultValues?.year ?? new Date().getFullYear()}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Month <span className="text-red-500">*</span>
          </label>
          <select
            name="month"
            defaultValue={defaultValues?.month ?? (new Date().getMonth() + 1)}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Base Salary <span className="text-red-500">*</span>
        </label>
        <input
          name="baseSalary"
          type="number"
          min="0"
          step="0.01"
          defaultValue={defaultValues?.baseSalary}
          required
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Overtime
          </label>
          <input
            name="overTime"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.overTime ?? 0}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Bonus
          </label>
          <input
            name="bonus"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.bonus ?? 0}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tax
          </label>
          <input
            name="tax"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.tax ?? 0}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Insurance
          </label>
          <input
            name="insurance"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.insurance ?? 0}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
        <input
          name="isPaid"
          type="checkbox"
          defaultChecked={defaultValues?.isPaid ?? false}
          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <label className="text-sm font-medium text-slate-700">
          Mark as Paid
        </label>
      </div>
    </>
  );
}