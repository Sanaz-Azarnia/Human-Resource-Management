import Link from "next/link";

export function AuthButtons({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
    const btnClass = mobile
        ? 'bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors text-center'
        : 'bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors';

    return (
        <>
            <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={onClick}>
                Sign In
            </Link>
            <Link href="#roles" className={btnClass} onClick={onClick}>
                Try Different Roles
            </Link>
        </>
    );
}
