'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ModalLayoutProps {
    title: string;
    children: ReactNode;
}

export default function ModalLayout({ title, children }: ModalLayoutProps) {
    const router = useRouter();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button 
                        onClick={() => router.back()} 
                        className="text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}