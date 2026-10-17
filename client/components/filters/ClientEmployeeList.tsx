"use client";

import { useState } from "react";
import Link from "next/link";
import { Employee, BasePermissions } from "@/lib/api/types";
import DeleteButton from "@/components/ui/DeleteButton";
import EmployeeFilterBar from "@/components/filters/EmployeeFilterBar";
import AdvancedSearchModal from "@/components/modals/AdvancedSearchModal";
import { deleteEmployeeAction } from "@/actions/employee-actions";

interface ClientEmployeeListProps {
    employees: Employee[];
    permissions: BasePermissions;
    currentUserPersonnelId: string | null;
    initialSearchParams: { [key: string]: string | string[] | undefined };
}

export default function ClientEmployeeList({
    employees,
    permissions,
    currentUserPersonnelId,
    initialSearchParams,
}: ClientEmployeeListProps) {
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

    const search = (initialSearchParams.search as string) || "";
    const role = (initialSearchParams.role as string) || "";
    const minSalary = parseFloat(initialSearchParams.minSalary as string) || 0;
    const maxSalary = parseFloat(initialSearchParams.maxSalary as string) || Infinity;

    const filteredEmployees = employees.filter((emp) => {
        if (search) {
            const s = search.toLowerCase();
            const matchesSearch =
                emp.firstname.toLowerCase().includes(s) ||
                emp.lastname.toLowerCase().includes(s) ||
                emp.email.toLowerCase().includes(s) ||
                emp.personnelId.includes(s) ||
                emp.nationalId.includes(s) ||
                emp.phone.includes(s);
            if (!matchesSearch) return false;
        }

        if (role && role !== "All" && emp.roleName !== role) {
            return false;
        }

        if (emp.baseSalary < minSalary || emp.baseSalary > maxSalary) {
            return false;
        }

        return true;
    });

    return (
        <>
            <EmployeeFilterBar
                totalCount={filteredEmployees.length}
                onAdvancedSearch={() => setShowAdvancedSearch(true)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            {emp.avatarUrl ? (
                                <img src={emp.avatarUrl} className="w-12 h-12 rounded-full" alt="" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {emp.firstname[0]}{emp.lastname[0]}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">
                                    {emp.firstname} {emp.lastname}
                                </h3>
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                    emp.roleName === 'Admin' ? 'bg-red-100 text-red-700' :
                                    emp.roleName === 'Manager' ? 'bg-blue-100 text-blue-700' :
                                    emp.roleName === 'Deputy' ? 'bg-purple-100 text-purple-700' :
                                    emp.roleName === 'Staff' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    {emp.roleName}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Personnel ID</span>
                                <span className="font-mono text-slate-700">{emp.personnelId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Phone</span>
                                <span className="text-slate-700">{emp.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email</span>
                                <span className="text-slate-700 truncate max-w-[150px]">{emp.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Base Salary</span>
                                <span className="text-slate-700 font-medium">${emp.baseSalary.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
                            {(permissions.canEditAll ||
                                (permissions.canEditOwn && emp.personnelId === currentUserPersonnelId)) && (
                                <Link 
                                    href={`/dashboard/employees/${emp.id}/edit`}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Edit
                                </Link>
                            )}
                            {permissions.canDelete && (
                                <DeleteButton 
                                    action={deleteEmployeeAction.bind(null, emp.id)}
                                    redirectPath="/dashboard/employees" 
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredEmployees.length === 0 && (
                <div className="text-center p-12 bg-white rounded-lg shadow-sm border border-slate-200">
                    <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-slate-700 mb-1">No employees found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
            )}

            <AdvancedSearchModal
                isOpen={showAdvancedSearch}
                onClose={() => setShowAdvancedSearch(false)}
            />
        </>
    );
}