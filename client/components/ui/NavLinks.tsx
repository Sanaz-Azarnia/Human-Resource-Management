import Link from "next/link";

const NAV_LINKS = [
    { href: '#features', label: 'Features' },
    { href: '#roles', label: 'Roles' },
    { href: '#contact', label: 'Contact' },
];

export function NavLinks({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
    const baseClass = mobile
        ? 'text-sm font-medium text-slate-600 hover:text-indigo-600'
        : 'text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors';

    return (
        <>
            {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={baseClass} onClick={onClick}>
                    {link.label}
                </Link>
            ))}
        </>
    );
}
