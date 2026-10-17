"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function SignOutButton() {
    const router = useRouter();
    const { refetch } = useUser();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        
        try {
            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                console.error("Logout failed");
            }
            refetch();

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                text-red-600 hover:text-red-800 hover:bg-red-50 
                rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <LogOut className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Signing out..." : "Sign Out"}
        </button>
    );
}