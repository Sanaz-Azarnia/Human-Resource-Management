"use client";

import { useUser } from "@/contexts/UserContext";
import { NavLinks } from "./NavLinks";
import { SignOutButton } from "./SignOutButton";
import { AuthButtons } from "./AuthButtons";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { user } = useUser();

    if (!open) return null;

    return (
        <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-6 py-4 space-y-3">
                {!user && <NavLinks mobile onClick={onClose} />}
                <div className="pt-3 border-t border-slate-100">
                    {user ? <SignOutButton /> : <AuthButtons mobile onClick={onClose} />}
                </div>
            </div>
        </div>
    );
}