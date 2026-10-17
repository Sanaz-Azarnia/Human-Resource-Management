"use client";

import type { EmployeeFormFieldsProps } from '@/lib/api/types';

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Deputy' },
  { id: 4, name: 'Employee' },
  { id: 5, name: 'Staff' },
];

export default function EmployeeForm({ defaultValues }: EmployeeFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstname"
            type="text"
            defaultValue={defaultValues?.firstname}
            placeholder="John"
            required
            maxLength={100}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastname"
            type="text"
            defaultValue={defaultValues?.lastname}
            placeholder="Doe"
            required
            maxLength={100}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Personnel ID <span className="text-red-500">*</span>
          </label>
          <input
            name="personnelId"
            type="text"
            defaultValue={defaultValues?.personnelId}
            placeholder="86720194"
            required
            maxLength={50}
            pattern="[a-zA-Z0-9\-]+"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            National ID <span className="text-red-500">*</span>
          </label>
          <input
            name="nationalId"
            type="text"
            defaultValue={defaultValues?.nationalId}
            placeholder="1478259866"
            required
            minLength={10}
            maxLength={20}
            pattern="[0-9]+"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            defaultValue={defaultValues?.email}
            placeholder="john@company.com"
            required
            maxLength={100}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            defaultValue={defaultValues?.phone}
            placeholder="09384523324"
            required
            pattern="[0-9+\-\s()]{7,20}"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          name="address"
          type="text"
          defaultValue={defaultValues?.address}
          placeholder="Tehran, Iran"
          required
          maxLength={300}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="roleId"
            defaultValue={defaultValues?.roleId || ''}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="" disabled>Select role</option>
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password <span className="text-red-500">*</span>
            {defaultValues && (
              <span className="text-slate-400 font-normal"> (Leave blank to keep current)</span>
            )}
          </label>
          <input
            name="password"
            type="password"
            defaultValue=""
            required={!defaultValues}
            minLength={6}
            placeholder={defaultValues ? "Enter new password (optional)" : "At least 6 characters"}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            placeholder="500000"
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Avatar URL <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            name="avatarUrl"
            type="url"
            defaultValue={defaultValues?.avatarUrl}
            placeholder="https://example.com/avatar.jpg"
            maxLength={500}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
}