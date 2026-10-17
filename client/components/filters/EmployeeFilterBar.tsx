"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

const ROLES = ["All", "Admin", "Manager", "Deputy", "Employee", "Staff"];

interface EmployeeFilterBarProps {
    totalCount: number;
    onAdvancedSearch?: () => void;
}

export default function EmployeeFilterBar({ 
    totalCount, 
    onAdvancedSearch 
}: EmployeeFilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [role, setRole] = useState(searchParams.get("role") || "All");
    const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "");
    const [maxSalary, setMaxSalary] = useState(searchParams.get("maxSalary") || "");

    const updateURL = useCallback(() => {
        const params = new URLSearchParams();
        
        if (search) params.set("search", search);
        if (role && role !== "All") params.set("role", role);
        if (minSalary) params.set("minSalary", minSalary);
        if (maxSalary) params.set("maxSalary", maxSalary);

        const queryString = params.toString();
        router.push(`/dashboard/employees${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }, [search, role, minSalary, maxSalary, router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateURL();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, updateURL]);

    const handleRoleChange = (value: string) => {
        setRole(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value === "All") params.delete("role");
        else params.set("role", value);
        router.push(`/dashboard/employees?${params.toString()}`, { scroll: false });
    };

    const handleClearFilters = () => {
        setSearch("");
        setRole("All");
        setMinSalary("");
        setMaxSalary("");
        router.push("/dashboard/employees", { scroll: false });
    };

    const hasActiveFilters = search || role !== "All" || minSalary || maxSalary;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        <span className="font-semibold text-indigo-600">{totalCount}</span> employee{totalCount !== 1 ? "s" : ""} found
                    </p>
                </div>
                <div className="flex gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            ✕ Clear
                        </button>
                    )}
                    {onAdvancedSearch && (
                        <button
                            onClick={onAdvancedSearch}
                            className="flex gap-2 text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1.5 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                        >
                            <Search size={18} />
                            Advanced
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Search
                    </label>
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name, email, ID..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    >
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Min Salary
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        onBlur={updateURL}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        Max Salary
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        onBlur={updateURL}
                        placeholder="500000"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                    {search && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                            Search: "{search}"
                            <button onClick={() => setSearch("")} className="hover:text-indigo-900">×</button>
                        </span>
                    )}
                    {role !== "All" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            Role: {role}
                            <button onClick={() => handleRoleChange("All")} className="hover:text-blue-900">×</button>
                        </span>
                    )}
                    {minSalary && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            Min: ${minSalary}
                            <button onClick={() => setMinSalary("")} className="hover:text-green-900">×</button>
                        </span>
                    )}
                    {maxSalary && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            Max: ${maxSalary}
                            <button onClick={() => setMaxSalary("")} className="hover:text-green-900">×</button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}