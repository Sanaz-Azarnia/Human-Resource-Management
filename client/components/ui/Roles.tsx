"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { 
    ShieldCheck, 
    UserCog, 
    Users, 
    User, 
    LogIn,
    Sparkles,
    Loader2,
    AlertCircle
} from "lucide-react";

type DemoRole = {
    title: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    badge: string;
};

export default function Roles() {
    const router = useRouter();
    const { refetch } = useUser();
    const [loadingRole, setLoadingRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const demoRoles: DemoRole[] = [
        {
            title: "Admin",
            desc: "Full system access with complete control over all modules, users, and permissions.",
            icon: <ShieldCheck className="h-6 w-6" />,
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "hover:border-red-300",
            badge: "Full Access",
        },
        {
            title: "Manager",
            desc: "Department manager with ability to approve requests, manage employees and payrolls.",
            icon: <UserCog className="h-6 w-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "hover:border-blue-300",
            badge: "Management",
        },
        {
            title: "Deputy",
            desc: "Deputy manager with supervisory permissions to assist in daily operations.",
            icon: <Users className="h-6 w-6" />,
            color: "text-violet-600",
            bgColor: "bg-violet-50",
            borderColor: "hover:border-violet-300",
            badge: "Supervisor",
        },
        {
            title: "Employee",
            desc: "Basic employee with access to personal data, leave requests, and attendance.",
            icon: <User className="h-6 w-6" />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "hover:border-emerald-300",
            badge: "Standard User",
        },
    ];

    const handleDemoLogin = async (role: DemoRole) => {
        setLoadingRole(role.title);
        setError(null);
        
        try {
            const res = await fetch("/api/auth/demo-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: role.title }),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok && data.success) {
                 
                refetch();
                router.push("/dashboard");
                router.refresh();   
            } else {
                setError(data.error || "Login failed");
                setLoadingRole(null);
            }
        } catch (err) {
            console.error("Demo login error:", err);
            setError("Network error. Please try again.");
            setLoadingRole(null);
        }
    };

    return (
        <section id="roles" className="px-6 py-20 bg-slate-50">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        Try it yourself
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                        Demo Accounts
                    </h2>
                    <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
                        Experience the system with different permission levels.
                        Click on any card to instantly login and explore the features.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {demoRoles.map((role) => (
                        <div 
                            key={role.title} 
                            className={`group relative rounded-2xl border border-slate-200 bg-white p-6 
                                transition-all duration-300 hover:shadow-xl ${role.borderColor}
                                flex flex-col`}
                        >
                            <div className="absolute top-4 right-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${role.bgColor} ${role.color}`}>
                                    {role.badge}
                                </span>
                            </div>

                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${role.bgColor} ${role.color}`}>
                                {role.icon}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
                            <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-1">
                                {role.desc}
                            </p>

                            <button
                                onClick={() => handleDemoLogin(role)}
                                disabled={loadingRole !== null}
                                className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 
                                    ${role.bgColor} ${role.color} 
                                    font-semibold rounded-xl transition-all
                                    hover:shadow-md hover:scale-[1.02]
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    disabled:hover:scale-100 disabled:hover:shadow-none`}
                            >
                                {loadingRole === role.title ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4" />
                                        Quick Login
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Each account has different permissions. Try logging in with each to see how the interface changes.
                    </p>
                </div>
            </div>
        </section>
    );
}