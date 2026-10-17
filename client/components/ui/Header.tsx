"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { NavLinks } from './NavLinks';
import { SignOutButton } from './SignOutButton';
import { AuthButtons } from './AuthButtons';
import { MenuIcon } from './MenuIcon';
import { MobileMenu } from './MobileMenu';

export default function Header() {
    const { user } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                
                <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        HRM<span className="text-indigo-600 ml-2">Pro</span>
                    </span>
                </Link>

                {!user && (
                    <div className="hidden md:flex items-center gap-8">
                        <NavLinks />
                    </div>
                )}

                <div className="hidden md:flex items-center gap-4">
                    {user ? <SignOutButton /> : <AuthButtons />}
                </div>

                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <MenuIcon open={mobileMenuOpen} />
                </button>
            </div>

            <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </nav>
    );
}