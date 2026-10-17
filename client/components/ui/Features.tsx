"use client";

import {
    Users,
    Clock,
    DollarSign,
    Calendar,
    BarChart3,
    ShieldCheck,
} from "lucide-react";

type Feature = {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
};

export default function Features() {
    const features: Feature[] = [
        {
            title: "Personal Information",
            desc: "Complete employee profiles with role-based access control.",
            icon: <Users className="h-6 w-6" />,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "hover:border-indigo-200",
        },
        {
            title: "Attendance",
            desc: "Track check-ins, verify presence/absence with manager approval.",
            icon: <Clock className="h-6 w-6" />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "hover:border-emerald-200",
        },
        {
            title: "Payroll",
            desc: "Salary management with role-based visibility and reporting.",
            icon: <DollarSign className="h-6 w-6" />,
            color: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "hover:border-amber-200",
        },
        {
            title: "Leave Requests",
            desc: "Apply, track, approve or reject leave with full audit trail.",
            icon: <Calendar className="h-6 w-6" />,
            color: "text-rose-600",
            bgColor: "bg-rose-50",
            borderColor: "hover:border-rose-200",
        },
        {
            title: "Reports",
            desc: "Generate and export analytics with permission-based filters.",
            icon: <BarChart3 className="h-6 w-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "hover:border-blue-200",
        },
        {
            title: "Permission-Based Access",
            desc: "Granular RBAC with Admin, Manager, Deputy, Employee & Staff roles.",
            icon: <ShieldCheck className="h-6 w-6" />,
            color: "text-violet-600",
            bgColor: "bg-violet-50",
            borderColor: "hover:border-violet-200",
        },
    ];

    return (
        <section id="features" className="px-6 py-20">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Core Modules
                    </h2>
                    <p className="mt-3 text-slate-500">
                        Everything you need to manage your people
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className={`group rounded-2xl border border-slate-200 bg-white p-7 
                                transition-all duration-300 hover:shadow-lg ${f.borderColor}`}
                        >
                            <div
                                className={`mb-4 flex h-12 w-12 items-center justify-center 
                                    rounded-xl ${f.bgColor} ${f.color}`}
                            >
                                {f.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                {f.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}