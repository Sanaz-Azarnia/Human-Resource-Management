"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchEmployeeAction } from "@/actions/employee-actions";
import { Employee } from "@/lib/api/types";

interface AdvancedSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdvancedSearchModal({ isOpen, onClose }: AdvancedSearchModalProps) {
    const router = useRouter();
    const [searchType, setSearchType] = useState<"id" | "personnel">("personnel");
    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<Employee | null>(null);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setError("Please enter a value");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await searchEmployeeAction(searchType, searchValue);

            if (response.success && response.data) {
                setResult(response.data);
            } else {
                setError(response.message || "An error occurred");
            }
        } catch (err) {
            console.error(err);
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const handleGoToEdit = () => {
        if (result) {
            router.push(`/dashboard/employees/${result.id}/edit`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">🔍 Advanced Search</h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex gap-2 mb-4 border-b border-slate-200">
                    <button
                        onClick={() => { setSearchType("personnel"); setResult(null); setError(""); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            searchType === "personnel"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        By Personnel ID
                    </button>
                    <button
                        onClick={() => { setSearchType("id"); setResult(null); setError(""); }}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            searchType === "id"
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        By Employee ID
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {searchType === "personnel" ? "Personnel ID" : "Employee ID"}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type={searchType === "id" ? "number" : "text"}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder={searchType === "personnel" ? "86720194" : "1"}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {loading ? "..." : "Search"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                            {result.avatarUrl ? (
                                <img src={result.avatarUrl} className="w-12 h-12 rounded-full" alt="" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                    {result.firstname[0]}{result.lastname[0]}
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    {result.firstname} {result.lastname}
                                </h3>
                                <p className="text-xs text-slate-500">{result.roleName}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Personnel ID:</span>
                                <span className="font-mono">{result.personnelId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <span>{result.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Phone:</span>
                                <span>{result.phone}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleGoToEdit}
                            className="mt-3 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                        >
                            View / Edit Employee
                        </button>
                    </div>
                )}

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}