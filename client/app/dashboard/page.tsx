import { redirect } from "next/navigation";
import Link from "next/link";
import { 
    Users, 
    Clock, 
    Wallet, 
    Calendar, 
    BarChart3,
    ArrowRight,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { getCurrentUser } from "@/lib/permissions";

function getRoleName(roleId: number | undefined): string {
    const roles: Record<number, string> = {
        1: 'Admin',
        2: 'Manager',
        3: 'Deputy',
        4: 'Employee',
        5: 'Staff',
    };
    return roles[roleId || 0] || 'Unknown';
}

function getRoleColor(roleId: number | undefined): string {
    const colors: Record<number, string> = {
        1: 'bg-red-100 text-red-700 border-red-200',
        2: 'bg-blue-100 text-blue-700 border-blue-200',
        3: 'bg-violet-100 text-violet-700 border-violet-200',
        4: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        5: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return colors[roleId || 0] || 'bg-slate-100 text-slate-700 border-slate-200';
}

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const roleName = getRoleName(user.roleId);
    const roleColor = getRoleColor(user.roleId);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const cards = [
        { 
            title: 'Employees', 
            href: '/dashboard/employees', 
            description: 'Manage staff profiles, roles and access',
            icon: Users,
            gradient: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50',
            textColor: 'text-blue-600',
            hoverBorder: 'hover:border-blue-300',
        },
        { 
            title: 'Attendance', 
            href: '/dashboard/attendance', 
            description: 'Track check-ins and verify presence',
            icon: Clock,
            gradient: 'from-emerald-500 to-emerald-600',
            lightBg: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            hoverBorder: 'hover:border-emerald-300',
        },
        { 
            title: 'Payroll', 
            href: '/dashboard/payroll', 
            description: 'Manage salaries, taxes and bonuses',
            icon: Wallet,
            gradient: 'from-violet-500 to-violet-600',
            lightBg: 'bg-violet-50',
            textColor: 'text-violet-600',
            hoverBorder: 'hover:border-violet-300',
        },
        { 
            title: 'Leave Requests', 
            href: '/dashboard/leave', 
            description: 'Approve or reject time off requests',
            icon: Calendar,
            gradient: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50',
            textColor: 'text-orange-600',
            hoverBorder: 'hover:border-orange-300',
        },
        { 
            title: 'Reports', 
            href: '/dashboard/report', 
            description: 'View analytics and export data',
            icon: BarChart3,
            gradient: 'from-rose-500 to-rose-600',
            lightBg: 'bg-rose-50',
            textColor: 'text-rose-600',
            hoverBorder: 'hover:border-rose-300',
        },
    ];

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-8 md:mb-10">
                {/* Welcome Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>
                    
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-5">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {user.avatarUrl ? (
                                    <img 
                                        src={user.avatarUrl} 
                                        alt="avatar" 
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/20 object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center text-2xl md:text-3xl font-bold">
                                        {user.firstname?.[0]}{user.lastname?.[0]}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                    <span className="text-xs md:text-sm text-white/80 font-medium">
                                        {formattedDate}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                                    Welcome back, {user.firstname}! 👋
                                </h1>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${roleColor}`}>
                                        {roleName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold">5</div>
                                <div className="text-xs text-white/70 mt-1">Modules</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold flex items-center gap-1">
                                    <TrendingUp className="w-6 h-6 text-emerald-300" />
                                </div>
                                <div className="text-xs text-white/70 mt-1">Active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    Quick Access
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Jump to any module to start managing your team
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link 
                            key={card.title}
                            href={card.href}
                            className={`group relative overflow-hidden bg-white rounded-2xl p-6 
                                border border-slate-200 ${card.hoverBorder}
                                transition-all duration-300 
                                hover:shadow-xl hover:-translate-y-1
                                flex flex-col`}
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            {/* Content */}
                            <div className="relative flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                                </div>
                                
                                {/* Arrow Icon */}
                                <div className={`${card.lightBg} ${card.textColor} w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:${card.gradient} group-hover:text-white transition-all duration-300`}>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>

                            <div className="relative flex-1">
                                <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                                    {card.title}
                                </h2>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>

                            {/* Footer with Action */}
                            <div className="relative mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className={`text-xs font-semibold ${card.textColor} uppercase tracking-wider`}>
                                    Open Module
                                </span>
                                <div className="flex gap-0.5">
                                    <div className={`w-1 h-1 rounded-full ${card.lightBg} group-hover:bg-gradient-to-br group-hover:${card.gradient}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${card.lightBg} group-hover:bg-gradient-to-br group-hover:${card.gradient}`}></div>
                                    <div className={`w-1 h-1 rounded-full ${card.lightBg} group-hover:bg-gradient-to-br group-hover:${card.gradient}`}></div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Tips Section */}
            <div className="mt-8 md:mt-10 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Pro Tip</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Use the filter bar on each module page to quickly find specific records. 
                            Your filters are saved in the URL, so you can bookmark frequently used searches!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}