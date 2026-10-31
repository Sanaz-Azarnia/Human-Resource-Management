 "use client";

import Link from "next/link";

interface AuthButtonsProps {
    mobile?: boolean;
    onClick?: () => void;
}

export function AuthButtons({ mobile = false, onClick }: AuthButtonsProps) {
    const btnClass = mobile
        ? 'bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors text-center w-full'
        : 'bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors';

    if (mobile) {
        return (
            <div className="flex flex-col gap-2">
                <Link
                    href="/login"
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-center"
                    onClick={onClick}
                >
                    Sign In
                </Link>
                <Link
                    href="#roles"
                    className={btnClass}
                    onClick={onClick}
                >
                    Try Different Roles
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/login"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={onClick}
            >
                Sign In
            </Link>
            <Link
                href="#roles"
                className={btnClass}
                onClick={onClick}
            >
                Try Different Roles
            </Link>
        </div>
    );
}