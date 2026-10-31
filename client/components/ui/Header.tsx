"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { NavLinks } from './NavLinks';
import { SignOutButton } from './SignOutButton';
import { AuthButtons } from './AuthButtons';
import { MenuIcon } from './MenuIcon';

export default function Header() {
    const { user } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
            {/* دسکتاپ */}
            <div className="mx-auto hidden max-w-7xl items-center justify-between px-6 py-4 md:flex">
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        HRM<span className="text-indigo-600 ml-2">Pro</span>
                    </span>
                </Link>

                {!user && !isDashboard && (
                    <div className="flex items-center gap-8">
                        <NavLinks />
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {user ? <SignOutButton /> : <AuthButtons />}
                </div>
            </div>

            {/* موبایل */}
            <div className="mx-auto flex flex-col px-6 py-4 md:hidden">
                {/* خط اول: لوگو + دکمه همبرگری */}
                <div className="flex items-center justify-between">
                    <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center">
                            <img src="/logo.png" alt="logo" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">
                            HRM<span className="text-indigo-600 ml-2">Pro</span>
                        </span>
                    </Link>
                    
                    <button
                        className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <MenuIcon open={mobileMenuOpen} />
                    </button>
                </div>

                {/* منوی موبایل - ستونی */}
                {mobileMenuOpen && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
                        {!user && !isDashboard && (
                            <NavLinks mobile onClick={() => setMobileMenuOpen(false)} />
                        )}
                        
                        <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                            {user ? (
                                <SignOutButton onClick={() => setMobileMenuOpen(false)} />
                            ) : (
                                <AuthButtons mobile onClick={() => setMobileMenuOpen(false)} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}